import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'src');
const INDEX_HTML = path.join(ROOT, 'index.html');
const ENGINES_DIR = path.join(SRC_DIR, 'engines');

const NAME_PATTERN = /\b(lly|duramax|dmax|6600|moraine|bosch|garrett|acdelco|allison|zf|cp3|pf2232|gm|chevrolet|gmc|denso)\b|gt3788[a-z]*/gi;
const NUMBER_PATTERN = /\b(3,?250|3,?000|3,?200|26,?000)\b/g;
const ENCODING_PATTERN = /Â|â€|âˆ/g;

function toPosix(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function isInsideEngines(file) {
  const relative = path.relative(ENGINES_DIR, file);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

async function collectFiles() {
  const files = [];

  async function walk(directory) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  await walk(SRC_DIR);
  files.push(INDEX_HTML);
  return files.sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

async function scanFiles(files, pattern) {
  const matches = [];

  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const lines = text.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const terms = [];
      pattern.lastIndex = 0;
      let match;

      while ((match = pattern.exec(line)) !== null) {
        terms.push(match[0]);
        if (match[0].length === 0) pattern.lastIndex += 1;
      }

      if (terms.length > 0) {
        matches.push({ file: toPosix(file), line: index + 1, terms });
      }
    }
  }

  return matches;
}

function countTerms(matches) {
  return matches.reduce((total, match) => total + match.terms.length, 0);
}

function printCheck(check) {
  const total = countTerms(check.matches);
  const detail = total === 0
    ? '0 matches'
    : `${total} ${total === 1 ? 'match' : 'matches'} in ${check.matches.length} ${check.matches.length === 1 ? 'line' : 'lines'}`;

  console.log(`${check.label}: ${check.status} (${detail})`);
  if (check.note) console.log(`  ${check.note}`);
  for (const match of check.matches) {
    console.log(`  ${match.file}:${match.line}: ${match.terms.join(', ')}`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function checkIds(files) {
  const registryPath = path.join(ENGINES_DIR, 'index.js');
  let registry = '';

  try {
    registry = await readFile(registryPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const ids = new Set(['lly', 'lbz', 'generic-i6']);
  const arrayMatch = registry.match(/ENGINE_IDS\s*=\s*\[([\s\S]*?)\]/);
  if (arrayMatch) {
    for (const match of arrayMatch[1].matchAll(/['"]([^'"]+)['"]/g)) {
      ids.add(match[1]);
    }
  }

  const idsPattern = [...ids].map(escapeRegExp).join('|');
  const pattern = new RegExp(`['"](?:${idsPattern})['"]`, 'g');
  const matches = await scanFiles(files, pattern);

  return {
    label: 'IDs',
    status: matches.length > 0 ? 'FAIL' : 'PASS',
    matches,
    note: `Compared quoted strings against: ${[...ids].join(', ')}.`,
  };
}

async function checkProvenance() {
  let entries = [];

  try {
    const directories = await readdir(ENGINES_DIR, { withFileTypes: true });
    for (const directory of directories) {
      if (!directory.isDirectory() || directory.name === 'families' || directory.name === 'shared') continue;

      const entryPath = path.join(ENGINES_DIR, directory.name, 'index.js');
      try {
        await readFile(entryPath, 'utf8');
        entries.push(entryPath);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (entries.length === 0) {
    return {
      label: 'Provenance',
      status: 'PASS',
      matches: [],
      note: 'No entries under src/engines/ yet; passes vacuously.',
    };
  }

  return {
    label: 'Provenance',
    status: 'FAIL',
    matches: entries.map((entry) => ({ file: toPosix(entry), line: 1, terms: ['entry'] })),
    note: 'Entry files exist; full numeric provenance validation is not implemented in this package.',
  };
}

async function main() {
  const allFiles = await collectFiles();
  const nonEngineFiles = allFiles.filter((file) => !isInsideEngines(file));

  const checks = [];

  const nameMatches = await scanFiles(nonEngineFiles, NAME_PATTERN);
  checks.push({
    label: 'Names',
    status: nameMatches.length > 0 ? 'FAIL' : 'PASS',
    matches: nameMatches,
  });

  const numberMatches = await scanFiles(nonEngineFiles, NUMBER_PATTERN);
  checks.push({
    label: 'Numbers',
    status: numberMatches.length > 0 ? 'FAIL' : 'PASS',
    matches: numberMatches,
  });

  const encodingMatches = await scanFiles(allFiles, ENCODING_PATTERN);
  checks.push({
    label: 'Encoding',
    status: encodingMatches.length > 0 ? 'FAIL' : 'PASS',
    matches: encodingMatches,
  });

  checks.push(await checkIds(nonEngineFiles));
  checks.push(await checkProvenance());

  console.log('Scope: src/ and index.html; names and numbers exclude src/engines/.');
  for (const check of checks) printCheck(check);

  const failed = checks.filter((check) => check.status === 'FAIL');
  console.log(`Result: ${failed.length > 0 ? 'FAIL' : 'PASS'} (${failed.length} of ${checks.length} checks failed${failed.length ? `: ${failed.map((check) => check.label).join(', ')}` : ''})`);

  if (failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error('Check script failed:');
  console.error(error);
  process.exitCode = 1;
});

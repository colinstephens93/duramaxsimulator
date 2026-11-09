import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ENGINE_IDS } from '../src/engines/index.js';

export async function checkDist(directory) {
  const files = [];
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) await walk(file);
      else files.push(file);
    }
  }
  await walk(directory);
  assert.ok(files.some(file => path.relative(directory,file) === 'index.html'), 'Missing production index.html');
  const content = new Map(await Promise.all(files.map(async file => [file, await readFile(file,'utf8')])));
  for (const [file, text] of content) {
    assert.ok(!/lly-copy|synthetic lly|synthetic copy/i.test(text), `Test fixture leaked into ${file}`);
  }
  const main = files.filter(file => /^index-.*\.js$/.test(path.basename(file)));
  assert.equal(main.length,1,'Expected one production application chunk');
  const chunks = {};
  for (const id of ENGINE_IDS) {
    const entries = files.filter(file => path.basename(file).startsWith(id+'-') && file.endsWith('.js'));
    assert.equal(entries.length,1,`Expected a distinct ${id} entry chunk`);
    const file = entries[0], name = path.basename(file);
    assert.ok(new RegExp(`(?:"?id"?)\\s*:\\s*["'\\x60]${id}["'\\x60]`).test(content.get(file)), `${id} chunk lacks its entry identity`);
    assert.ok(['"', "'", String.fromCharCode(96)].some(quote => content.get(main[0]).includes('import('+quote+'./'+name+quote+')')), `${id} is not lazy imported by the application`);
    chunks[id]=name;
  }
  assert.equal(new Set(Object.values(chunks)).size,ENGINE_IDS.length,'Engine entry chunks must be separate');
  return { files: files.length, engines: chunks, fixtureAbsent: true };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  try { console.log('Dist: PASS', JSON.stringify(await checkDist(path.resolve(root,process.argv[2] || 'dist')))); }
  catch (error) { console.error('Dist: FAIL',error.message); process.exitCode=1; }
}

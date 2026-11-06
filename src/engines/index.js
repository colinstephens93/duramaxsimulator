import { validateEntry } from './schema.js';

export const ENGINE_IDS = ['lly'];
export const DEFAULT_ENGINE_ID = 'lly';

const LOADERS = {
  lly: () => import('./lly/index.js'),
};

const FAMILY_LOADERS = {
  'v8-ohv': () => import('./families/v8-ohv.js'),
};

export function isEngineId(id) {
  return ENGINE_IDS.includes(id);
}

export function parseEngineParam(search) {
  const params = new URLSearchParams(search);
  const requested = params.get('engine');
  if (requested === null || requested === '') {
    return { id: DEFAULT_ENGINE_ID, requested: null, fallback: false };
  }
  if (isEngineId(requested)) {
    return { id: requested, requested, fallback: false };
  }
  return { id: DEFAULT_ENGINE_ID, requested, fallback: true };
}

export async function loadEngine(id) {
  if (!isEngineId(id)) {
    throw new RangeError(`Unknown engine id: ${String(id)}`);
  }

  const module = await LOADERS[id]();
  const entry = module.default;
  const errors = [];
  if (!entry || entry.id !== id) errors.push(`entry id must be ${id}`);
  errors.push(...validateEntry(entry));
  if (errors.length > 0) {
    const error = new Error(`Engine ${id} is invalid: ${errors.join('; ')}`);
    error.errors = errors;
    throw error;
  }

  const family = await FAMILY_LOADERS[entry.family]();
  const copy = await entry.copy();
  const copyErrors = [];
  if (copy === null || typeof copy !== 'object') {
    copyErrors.push('copy module must be an object');
  } else {
    if (copy.COMPONENT_CARDS === null || typeof copy.COMPONENT_CARDS !== 'object') {
      copyErrors.push('copy must export COMPONENT_CARDS as an object');
    }
    for (const name of ['pistonCard', 'rodCard', 'engineSummary']) {
      if (typeof copy[name] !== 'function') copyErrors.push(`copy must export ${name} as a function`);
    }
  }
  if (copyErrors.length > 0) {
    const error = new Error(`Engine ${id} is invalid: ${copyErrors.join('; ')}`);
    error.errors = copyErrors;
    throw error;
  }

  return { id, entry, copy, family };
}

export function installQaHook(target, hook) {
  if (target === null || typeof target !== 'object') {
    throw new TypeError('target must be an object');
  }
  target.__ENGINE__ = hook;
  target.__LLY__ = hook;
  return hook;
}

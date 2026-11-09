export function createRequestToken() {
  let latest = 0;
  return { begin: () => ++latest, isCurrent: token => token === latest };
}

/** Commit is synchronous: request ownership cannot change halfway through it. */
export function createEngineSwitcher({ getCurrent, load, build, commit, rollback, dispose,
  stop, lock, overlay, paint, ready, error }) {
  const requests = createRequestToken();
  return async function switchEngine(id, { reload = false } = {}) {
    const token = requests.begin();
    if (!reload && getCurrent().id === id) {
      overlay(false); lock(false);
      return { status: 'unchanged', id };
    }
    let candidate;
    const previous = getCurrent();
    lock(true); stop(); overlay(true, id);
    try {
      await paint();
      if (!requests.isCurrent(token)) return { status: 'superseded', id };
      const loaded = await load(id);
      if (!requests.isCurrent(token)) return { status: 'superseded', id };
      candidate = await build(loaded);
      if (!requests.isCurrent(token)) {
        dispose(candidate); candidate = null;
        return { status: 'superseded', id };
      }
      try { commit(candidate, previous); }
      catch (failure) { rollback(previous); throw failure; }
      candidate = null;
      let cleanupError;
      try { dispose(previous); } catch (failure) { cleanupError = failure; }
      ready(getCurrent());
      return { status: 'committed', id, ...(cleanupError ? { cleanupError } : {}) };
    } catch (failure) {
      if (candidate) dispose(candidate);
      if (!requests.isCurrent(token)) return { status: 'superseded', id };
      error(failure);
      return { status: 'error', id, error: failure };
    } finally {
      if (requests.isCurrent(token)) { overlay(false); lock(false); }
    }
  };
}

// Safe wrappers: storage can be blocked (private mode, strict settings), so never throw.

const area = (kind) => (kind === 'session' ? window.sessionStorage : window.localStorage);

export function readStorage(key, kind = 'local') {
  try {
    return area(kind).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key, value, kind = 'local') {
  try {
    area(kind).setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

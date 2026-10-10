import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../config.js';
import { DEFAULT_THEME, themes } from '../data/themes.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const isValid = (id) => themes.some((t) => t.id === id);

// Current colour theme, saved in localStorage and applied as <html data-theme="...">.
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.theme);
    return isValid(saved) ? saved : DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Returns false for an unknown theme id.
  const setTheme = useCallback((id) => {
    if (!isValid(id)) return false;
    setThemeState(id);
    writeStorage(STORAGE_KEYS.theme, id);
    return true;
  }, []);

  return { theme, setTheme };
}

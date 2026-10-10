import { useEffect } from 'react';

const isTypingTarget = (el) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

// Ctrl/Cmd + K opens the command palette. "/" focuses the terminal (unless you are already typing).
export function useGlobalShortcuts({ enabled, onOpenPalette, onFocusTerminal }) {
  useEffect(() => {
    if (!enabled) return undefined;
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenPalette();
      } else if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)) {
        e.preventDefault();
        onFocusTerminal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, onOpenPalette, onFocusTerminal]);
}

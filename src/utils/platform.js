// Label for the shortcut modifier key (Command on Apple devices, Ctrl elsewhere).
export const MOD_KEY =
  typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.userAgent) ? '⌘' : 'Ctrl';

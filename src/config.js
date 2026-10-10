// Tunable settings in one place. Change a number here instead of hunting through components.

export const config = {
  // Typewriter effect in the terminal
  typing: {
    commandDelayMs: 80, // delay per character when the command itself is typed (intro only)
    outputDelayMs: 22, // delay between output ticks
    maxOutputTicks: 90, // long output types faster so it never takes much more than ~2s
  },

  // Loading page on first visit
  boot: {
    steps: ['loading profile', 'loading projects', 'checking for resume', 'starting terminal'],
    resumeStepIndex: 2, // this step waits for the real resume lookup
    stepMs: 340, // time between steps
    maxWaitMs: 3000, // never hold the page longer than this
    finishDelayMs: 350,
  },

  // Category filter buttons appear only once there are at least this many projects.
  projects: { filterMinCount: 5 },

  toastMs: 5000,
};

// localStorage / sessionStorage keys. The theme key is also read by the inline
// script in index.html, so keep the two in sync.
export const STORAGE_KEYS = {
  theme: 'portfolio-theme',
  bootSeen: 'portfolio-boot-seen',
};

import { useCallback, useMemo, useState } from 'react';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts.js';
import { useResume } from './hooks/useResume.js';
import { useSiteActions } from './hooks/useSiteActions.js';
import { useTheme } from './hooks/useTheme.js';
import { useToast } from './hooks/useToast.js';
import { buildPaletteItems } from './utils/palette.js';

import Footer from './components/layout/Footer.jsx';
import Navigation from './components/layout/Navigation.jsx';
import Toast from './components/layout/Toast.jsx';
import ProjectExplorer from './components/projects/ProjectExplorer.jsx';
import About from './components/sections/About.jsx';
import Contact from './components/sections/Contact.jsx';
import Education from './components/sections/Education.jsx';
import Skills from './components/sections/Skills.jsx';
import Terminal from './components/terminal/Terminal.jsx';
import BootScreen, { shouldSkipBoot } from './components/ui/BootScreen.jsx';
import CommandPalette from './components/ui/CommandPalette.jsx';

// App owns the shared state and wires the pieces together. Content lives in
// src/data, settings in src/config.js, and page actions in hooks/useSiteActions.js.
export default function App() {
  const resume = useResume();
  const { theme, setTheme } = useTheme();
  const { message: toast, notify } = useToast();
  const [booted, setBooted] = useState(shouldSkipBoot);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const perform = useSiteActions({ resume, setTheme, notify, setSelectedSlug });
  const paletteItems = useMemo(buildPaletteItems, []);

  const finishBoot = useCallback(() => setBooted(true), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const focusTerminal = useCallback(() => perform({ type: 'focus-terminal' }), [perform]);
  const onPaletteSelect = useCallback((item) => perform(item.action), [perform]);
  const changeTheme = useCallback((id) => perform({ type: 'set-theme', id }), [perform]);

  useGlobalShortcuts({ enabled: booted, onOpenPalette: openPalette, onFocusTerminal: focusTerminal });

  return (
    <>
      {!booted && <BootScreen onDone={finishBoot} ready={resume.status !== 'checking'} />}
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation resume={resume} onNotify={notify} onOpenPalette={openPalette} />

      <main id="main">
        <section id="top" className="hero" aria-label="Introduction">
          <div className="container">
            <Terminal resume={resume} theme={theme} active={booted} onAction={perform} />
          </div>
        </section>
        <About />
        <ProjectExplorer selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
        <Skills />
        <Education />
        <Contact resume={resume} onNotify={notify} />
      </main>

      <Footer theme={theme} onThemeChange={changeTheme} />
      <Toast message={toast} />
      <CommandPalette open={paletteOpen} items={paletteItems} onSelect={onPaletteSelect} onClose={closePalette} />
    </>
  );
}

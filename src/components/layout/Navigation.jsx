import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { profile } from '../../data/profile.js';
import { sections } from '../../data/sections.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import { MOD_KEY } from '../../utils/platform.js';
import ResumeLink from '../ui/ResumeLink.jsx';
import SocialLinks from './SocialLinks.jsx';

const SECTION_IDS = sections.map((s) => s.id);

// Sticky header: brand, section links (the current one is highlighted), social
// icons, resume and command-palette buttons. Collapses into a menu below 992px.
export default function Navigation({ resume, onNotify, onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const links = (
    <ul>
      {sections.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} onClick={close} aria-current={active === item.id ? 'true' : undefined}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top" onClick={close}>
          <span className="brand__name">
            {profile.handle}@{profile.host}
          </span>
          <span className="brand__version">{profile.version}</span>
        </a>

        <nav className="nav-desktop" aria-label="Primary">
          {links}
        </nav>

        <div className="header-actions">
          <SocialLinks variant="icons" />
          <button
            type="button"
            className="btn btn--small btn--ghost"
            onClick={onOpenPalette}
            aria-label={`Open command palette (${MOD_KEY} K)`}
            title={`Command palette (${MOD_KEY} K)`}
          >
            <Search size={16} aria-hidden="true" />
            <span className="wide-only">Search</span>
            <kbd className="wide-only">{MOD_KEY} K</kbd>
          </button>
          <ResumeLink resume={resume} onNotify={onNotify} className="btn btn--small" />
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <div className="container">
            <nav aria-label="Mobile primary">{links}</nav>
            <SocialLinks variant="full" />
            <div className="mobile-menu__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  close();
                  onOpenPalette();
                }}
              >
                <Search size={16} aria-hidden="true" />
                <span>Search and actions</span>
              </button>
              <ResumeLink
                resume={resume}
                onNotify={(message) => {
                  onNotify(message);
                  close();
                }}
                className="btn"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

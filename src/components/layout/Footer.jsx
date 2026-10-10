import { profile } from '../../data/profile.js';
import { MOD_KEY } from '../../utils/platform.js';
import ThemeSwitcher from './ThemeSwitcher.jsx';

export default function Footer({ theme, onThemeChange }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="site-footer__signoff">Thanks for stopping by.</p>
        <div className="site-footer__row">
          <ThemeSwitcher theme={theme} onChange={onThemeChange} />
          <p className="dim site-footer__hint">
            Shortcuts: press / for the terminal, {MOD_KEY} K for the command palette.
          </p>
        </div>
        <div className="site-footer__row">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="dim">{profile.version}. Built with React and Vite.</p>
        </div>
      </div>
    </footer>
  );
}

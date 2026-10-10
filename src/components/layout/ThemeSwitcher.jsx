import { themes } from '../../data/themes.js';

export default function ThemeSwitcher({ theme, onChange }) {
  return (
    <div className="theme-switcher" role="group" aria-label="Colour theme">
      <span className="dim">Theme</span>
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          className="chip"
          aria-pressed={theme === t.id}
          title={t.description}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

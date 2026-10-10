import { Github, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { profile } from '../../data/profile.js';

const ITEMS = [
  { key: 'github', Icon: Github, external: true },
  { key: 'linkedin', Icon: Linkedin, external: true },
  { key: 'instagram', Icon: Instagram, external: true },
  { key: 'email', Icon: Mail, external: false },
  { key: 'phone', Icon: Phone, external: false },
];

// variant "icons": icon-only buttons with accessible names (header)
// variant "full": icon plus visible label (mobile menu)
export default function SocialLinks({ variant = 'icons' }) {
  return (
    <ul className={`social social--${variant}`}>
      {ITEMS.map(({ key, Icon, external }) => {
        const item = profile.contact[key];
        const extra = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
        return (
          <li key={key}>
            <a
              href={item.href}
              className="social__link"
              aria-label={variant === 'icons' ? `${item.label}: ${item.value}${external ? ' (opens in a new tab)' : ''}` : undefined}
              title={variant === 'icons' ? item.label : undefined}
              {...extra}
            >
              <Icon size={18} aria-hidden="true" />
              {variant === 'full' && <span>{item.label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

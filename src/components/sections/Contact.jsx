import { Github, Instagram, Linkedin, Phone } from 'lucide-react';
import { profile } from '../../data/profile.js';
import CopyButton from '../ui/CopyButton.jsx';
import ResumeLink from '../ui/ResumeLink.jsx';
import Section from './Section.jsx';

const SOCIALS = [
  { key: 'github', Icon: Github },
  { key: 'linkedin', Icon: Linkedin },
  { key: 'instagram', Icon: Instagram },
];

export default function Contact({ resume, onNotify }) {
  const { email, phone } = profile.contact;
  return (
    <Section id="contact" title="Contact">
      <p className="contact__lead">The quickest way to reach me is email.</p>

      <div className="contact__primary">
        <a className="contact__email" href={email.href}>
          {email.value}
        </a>
        <CopyButton value={email.value} what="email address" />
      </div>

      <div className="contact__phone">
        <Phone size={18} aria-hidden="true" />
        <span className="dim">{phone.label}</span>
        <a href={phone.href}>{phone.value}</a>
        <CopyButton value={phone.value} what="phone number" />
      </div>

      <ul className="contact__social">
        {SOCIALS.map(({ key, Icon }) => {
          const item = profile.contact[key];
          return (
            <li key={key}>
              <a className="btn btn--ghost" href={item.href} target="_blank" rel="noopener noreferrer">
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
                <span className="sr-only"> ({item.value}, opens in a new tab)</span>
              </a>
            </li>
          );
        })}
        <li>
          <ResumeLink resume={resume} onNotify={onNotify} className="btn" label="View resume" />
        </li>
      </ul>
    </Section>
  );
}

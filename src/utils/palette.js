// Builds the list of actions shown in the command palette (Ctrl/Cmd + K).
// Every item has an `action` that `useSiteActions` knows how to perform.

import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import { sections } from '../data/sections.js';
import { themes } from '../data/themes.js';

export function buildPaletteItems() {
  const c = profile.contact;
  return [
    ...sections.map((s) => ({
      id: `goto-${s.id}`,
      group: 'Go to',
      label: s.label,
      action: { type: 'goto', id: s.id },
    })),
    ...projects.map((p) => ({
      id: `project-${p.slug}`,
      group: 'Projects',
      label: p.title,
      hint: p.subtitle,
      action: { type: 'open-project', slug: p.slug },
    })),
    { id: 'copy-email', group: 'Contact', label: 'Copy email address', hint: c.email.value, action: { type: 'copy', value: c.email.value, what: 'email address' } },
    { id: 'copy-phone', group: 'Contact', label: 'Copy phone number', hint: c.phone.value, action: { type: 'copy', value: c.phone.value, what: 'phone number' } },
    { id: 'send-email', group: 'Contact', label: 'Send an email', action: { type: 'link', href: c.email.href, external: false } },
    { id: 'open-github', group: 'Contact', label: 'Open GitHub', hint: c.github.value, action: { type: 'link', href: c.github.href, external: true } },
    { id: 'open-linkedin', group: 'Contact', label: 'Open LinkedIn', hint: c.linkedin.value, action: { type: 'link', href: c.linkedin.href, external: true } },
    { id: 'open-instagram', group: 'Contact', label: 'Open Instagram', hint: c.instagram.value, action: { type: 'link', href: c.instagram.href, external: true } },
    { id: 'open-resume', group: 'Contact', label: 'Open resume', action: { type: 'resume' } },
    ...themes.map((t) => ({
      id: `theme-${t.id}`,
      group: 'Theme',
      label: `${t.label} theme`,
      hint: t.description,
      action: { type: 'set-theme', id: t.id },
    })),
    { id: 'focus-terminal', group: 'Terminal', label: 'Focus the terminal', hint: 'Shortcut: /', action: { type: 'focus-terminal' } },
  ];
}

// Every word typed must appear somewhere in the item's group, label or hint.
export function filterPaletteItems(items, query) {
  const words = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return items;
  return items.filter((item) => {
    const haystack = `${item.group} ${item.label} ${item.hint || ''}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

// Terminal command engine.
//
// Nothing here runs shell commands or evaluates input. Input is matched against
// an explicit allowlist, and every result is plain data (text, links, buttons)
// that React renders as escaped text.
//
// To add a command: add it to COMMANDS and HELP_ROWS, then give it a handler in
// `handlers` (or a special case in runCommand if it needs an action or arguments).

import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import { skillGroups } from '../data/skills.js';
import { interests } from '../data/interests.js';
import { sections } from '../data/sections.js';
import { DEFAULT_THEME, themes } from '../data/themes.js';
import { resumeUnavailableMessage } from './resume.js';

export const COMMANDS = [
  'help',
  'whoami',
  'about',
  'interests',
  'skills',
  'projects',
  'education',
  'contact',
  'resume',
  'theme',
  'ls',
  'cat',
  'neofetch',
  'clear',
  'date',
  'sudo hire-me',
  'exit',
];

// Shown as always-visible buttons under the terminal input.
export const PRIMARY_COMMANDS = [
  'help',
  'about',
  'projects',
  'skills',
  'interests',
  'education',
  'contact',
  'resume',
  'neofetch',
];

const HELP_ROWS = [
  ['help', 'List available commands'],
  ['whoami', 'Short introduction'],
  ['about', 'More about me'],
  ['interests', 'Hobbies and details'],
  ['skills', 'Technologies I work with'],
  ['projects', 'List projects'],
  ['projects <slug>', 'Show one project'],
  ['education', 'Where I study'],
  ['contact', 'Email, phone and social links'],
  ['resume', 'Open my resume'],
  ['theme [name]', 'Change the colour theme'],
  ['ls', 'List the files on this site'],
  ['cat <file>', 'Open one of those files'],
  ['neofetch', 'Quick profile card'],
  ['clear', 'Clear the screen'],
  ['date', 'Show the current date'],
  ['sudo hire-me', 'Worth a try'],
  ['exit', 'Close the session (sort of)'],
];

// Files listed by `ls` and opened by `cat <file>`: one per section, plus interests.
const FILES = [
  ...sections.map((s) => ({ file: s.file, label: s.label, command: s.id })),
  { file: 'interests.md', label: 'Interests', command: 'interests' },
];

// ---- output line builders ----
const text = (value, tone) => ({ kind: 'text', text: value, tone });
const row = (term, desc) => ({ kind: 'row', term, desc });
const link = (label, value, href, external = false) => ({ kind: 'link', label, text: value, href, external });
const chips = (commands) => ({ kind: 'suggest', commands });
const button = (label, action) => ({ kind: 'button', label, action });

const SOCIAL_KEYS = ['github', 'linkedin', 'instagram'];

function contactLines() {
  const c = profile.contact;
  return [
    link(c.email.label, c.email.value, c.email.href),
    link(c.phone.label, c.phone.value, c.phone.href),
    ...SOCIAL_KEYS.map((k) => link(c[k].label, c[k].value, c[k].href, true)),
  ];
}

function nameLines() {
  return [text(profile.name, 'strong'), ...profile.intro.map((l) => text(l))];
}

// ---- input handling ----
export function normalizeInput(raw) {
  return String(raw ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}

function closestCommand(word) {
  let best = null;
  let bestScore = 3;
  COMMANDS.forEach((cmd) => {
    const score = distance(word, cmd.split(' ')[0]);
    if (score < bestScore) {
      best = cmd;
      bestScore = score;
    }
  });
  return best;
}

function projectLines(arg) {
  if (!projects.length) return [text('No projects added yet.', 'dim')];
  if (!arg) {
    return [
      text('Projects:', 'accent'),
      ...projects.map((p) => row(p.slug, `${p.title}: ${p.subtitle}`)),
      chips(projects.map((p) => `projects ${p.slug}`)),
    ];
  }
  const project = projects.find((p) => p.slug === arg);
  if (!project) {
    return [
      text(`No project named "${arg.slice(0, 40)}".`, 'error'),
      text(`Available: ${projects.map((p) => p.slug).join(', ')}`, 'dim'),
    ];
  }
  const lines = [
    text(`${project.title}: ${project.subtitle}`, 'strong'),
    text(project.description),
    row('Stack', project.technologies.join(', ')),
  ];
  if (project.highlight) lines.push(text(project.highlight));
  if (project.features?.length) lines.push(row('Features', project.features.map((f) => f.name).join('; ')));
  if (project.disclaimer) lines.push(text(project.disclaimer, 'dim'));
  if (project.links?.repo) lines.push(link('Repository', project.links.repo, project.links.repo, true));
  if (project.links?.demo) lines.push(link('Demo', project.links.demo, project.links.demo, true));
  lines.push(button('Open in project explorer', { type: 'open-project', slug: project.slug }));
  return lines;
}

function interestLines() {
  return [
    ...interests.flatMap((i) => [
      row(
        i.name,
        (i.details || [])
          .filter((d) => !d.href)
          .map((d) => `${d.label}: ${d.value}`)
          .join('; '),
      ),
      ...(i.details || []).filter((d) => d.href).map((d) => link(d.label, d.value, d.href, true)),
    ]),
    button('Go to About', { type: 'goto', id: 'about' }),
  ];
}

function neofetchLines() {
  const id = `${profile.handle}@${profile.host}`;
  const school = profile.education[0];
  return [
    text(id, 'strong'),
    text('-'.repeat(id.length), 'dim'),
    row('Name', profile.name),
    ...(profile.role ? [row('Role', profile.role)] : []),
    ...(school ? [row('Studying', `${school.degree}, ${school.institution}`)] : []),
    row('Focus', profile.focusAreas.slice(0, 4).join(', ')),
    row('Projects', projects.map((p) => p.title).join(', ')),
    row('Interests', interests.map((i) => i.name).join(', ')),
    link(profile.contact.email.label, profile.contact.email.value, profile.contact.email.href),
    chips(['about', 'projects', 'contact']),
  ];
}

const handlers = {
  help: () => [
    text('Available commands:', 'accent'),
    ...HELP_ROWS.map(([term, desc]) => row(term, desc)),
    text('Tab completes commands. Arrow up/down browse history.', 'dim'),
    chips(PRIMARY_COMMANDS),
  ],
  whoami: () => nameLines(),
  about: () => [
    ...profile.about.map((p) => text(p)),
    row('Interests', interests.map((i) => i.name).join(', ')),
    button('Go to About', { type: 'goto', id: 'about' }),
  ],
  interests: () => interestLines(),
  skills: () => [
    ...skillGroups.map((g) => row(g.label, g.items.map((i) => i.name).join(', '))),
    button('Go to Skills', { type: 'goto', id: 'skills' }),
  ],
  projects: (args) => projectLines(args[0]),
  education: () =>
    profile.education.flatMap((e) => [
      text(e.degree, 'strong'),
      text(e.institution),
      ...(e.university ? [text(e.university, 'dim')] : []),
    ]),
  contact: () => [...contactLines(), button('Go to Contact', { type: 'goto', id: 'contact' })],
  ls: () => [...FILES.map((f) => row(f.file, f.label)), chips(FILES.map((f) => f.command))],
  neofetch: () => neofetchLines(),
  date: (_args, ctx) => [text((ctx.now || new Date()).toString())],
  exit: () => [
    text('logout'),
    text("There is no session to close here, so the page stays open. Type 'help' to keep exploring.", 'dim'),
    chips(['help']),
  ],
};

function resumeResult(ctx) {
  const state = ctx.resume || { status: 'missing' };
  if (state.status === 'ready' && state.url) {
    return {
      lines: [text('Opening resume in a new tab…'), link('Resume', state.url, state.url, true)],
      action: { type: 'open-url', url: state.url },
    };
  }
  if (state.status === 'checking') {
    return { lines: [text('Still checking for the resume. Try again in a moment.', 'dim')] };
  }
  return {
    lines: [
      text(resumeUnavailableMessage(), 'error'),
      link(profile.contact.email.label, profile.contact.email.value, profile.contact.email.href),
    ],
  };
}

function themeResult(args, ctx) {
  const id = args[0];
  if (!id) {
    return {
      lines: [
        text(`Current theme: ${ctx.theme || DEFAULT_THEME}`, 'accent'),
        ...themes.map((t) => row(t.id, t.description)),
        chips(themes.map((t) => `theme ${t.id}`)),
      ],
    };
  }
  const theme = themes.find((t) => t.id === id);
  if (!theme) {
    return {
      lines: [
        text(`Unknown theme "${id.slice(0, 40)}".`, 'error'),
        text(`Available: ${themes.map((t) => t.id).join(', ')}`, 'dim'),
      ],
    };
  }
  return {
    lines: [text(`Theme set to ${theme.id}.`)],
    action: { type: 'set-theme', id: theme.id, quiet: true },
  };
}

function sudoResult(args) {
  if (args.join(' ') === 'hire-me') {
    return {
      lines: [
        text('[sudo] password for recruiter: ********', 'dim'),
        text('Access granted. Hiring pipeline unlocked.', 'accent'),
        text('Side effects may include well-commented code and more questions about caching than anyone asked for.'),
        ...contactLines().slice(0, 2),
        link(profile.contact.linkedin.label, profile.contact.linkedin.value, profile.contact.linkedin.href, true),
        button('Go to Contact', { type: 'goto', id: 'contact' }),
      ],
    };
  }
  return {
    lines: [
      text(`${profile.handle} is not in the sudoers file for that. This incident will be reported to nobody.`, 'error'),
      text("Try 'sudo hire-me'.", 'dim'),
      chips(['sudo hire-me']),
    ],
  };
}

// `cat about.md`, `cat projects/`, `cat skills` ... all map to the matching command.
function catResult(args, ctx) {
  const arg = args[0];
  if (!arg) {
    return { lines: [text('usage: cat <file>', 'error'), text("Run 'ls' to see the files.", 'dim'), chips(['ls'])] };
  }
  const base = arg.replace(/\/+$/, '').replace(/\.[a-z]+$/, '');
  const match = FILES.find((f) => f.file.replace(/\/+$/, '').replace(/\.[a-z]+$/, '') === base);
  if (!match) {
    return {
      lines: [text(`cat: ${arg.slice(0, 40)}: No such file or directory`, 'error'), chips(['ls'])],
    };
  }
  return runCommand(match.command, ctx);
}

// Returns { lines, action? }. action: 'clear' | { type: 'open-url', url } | { type: 'set-theme', id, quiet }
export function runCommand(raw, ctx = {}) {
  const input = normalizeInput(raw);
  if (!input) return { lines: [] };

  const tokens = input.toLowerCase().split(' ');
  const [name, ...args] = tokens;

  if (name === 'clear') return { lines: [], action: 'clear' };
  if (name === 'resume') return resumeResult(ctx);
  if (name === 'theme') return themeResult(args, ctx);
  if (name === 'sudo') return sudoResult(args);
  if (name === 'cat') return catResult(args, ctx);

  const handler = Object.prototype.hasOwnProperty.call(handlers, name) ? handlers[name] : null;
  if (handler) return { lines: handler(args, ctx) };

  const shown = name.slice(0, 40);
  const suggestion = closestCommand(name);
  return {
    lines: [
      text(`command not found: ${shown}`, 'error'),
      ...(suggestion ? [text(`Did you mean '${suggestion}'?`, 'dim')] : []),
      text("Type 'help' to see available commands.", 'dim'),
      chips(suggestion ? ['help', suggestion] : ['help']),
    ],
  };
}

// ---- tab completion ----
function commonPrefix(list) {
  if (!list.length) return '';
  let prefix = list[0];
  for (const item of list) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

// Commands whose argument can be tab-completed, and where the choices come from.
const ARGUMENT_CHOICES = {
  projects: () => projects.map((p) => p.slug),
  theme: () => themes.map((t) => t.id),
  cat: () => FILES.map((f) => f.file),
};

export function complete(rawValue) {
  const value = String(rawValue ?? '').replace(/^\s+/, '').toLowerCase();
  if (!value) return { value: '', options: [] };

  const space = value.indexOf(' ');
  const name = space === -1 ? '' : value.slice(0, space);

  let candidates;
  let head = '';
  if (ARGUMENT_CHOICES[name]) {
    head = `${name} `;
    const partial = value.slice(head.length);
    candidates = ARGUMENT_CHOICES[name]().filter((c) => c.startsWith(partial));
  } else {
    candidates = COMMANDS.filter((c) => c.startsWith(value));
  }
  if (!candidates.length) return { value, options: [] };

  return { value: head + commonPrefix(candidates), options: candidates };
}

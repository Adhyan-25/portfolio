// Sections shown in the navigation, scroll tracking, command palette and the
// `ls` terminal command.
//   id      must match the id on the section element (components/sections/Section.jsx)
//   label   shown in the navigation
//   prompt  the "command" drawn as the section heading, e.g. `$ cat about.md`
//   file    the file name `ls` lists (and `cat <file>` opens)

export const sections = [
  { id: 'about', label: 'About', prompt: 'cat about.md', file: 'about.md' },
  { id: 'projects', label: 'Projects', prompt: 'ls projects/', file: 'projects/' },
  { id: 'skills', label: 'Skills', prompt: 'cat skills.json', file: 'skills.json' },
  { id: 'education', label: 'Education', prompt: 'cat education.txt', file: 'education.txt' },
  { id: 'contact', label: 'Contact', prompt: './contact.sh', file: 'contact.sh' },
];

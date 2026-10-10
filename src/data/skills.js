// Skill groups shown in the Skills section and the `skills` terminal command.
// No proficiency scores: this is a list of what I work with and study.
// Add an item: { name: 'Name', note: 'optional short note' }

export const skillGroups = [
  {
    id: 'languages',
    label: 'Languages',
    items: [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'Lua', note: 'Redis scripts' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend and visualization',
    items: [
      { name: 'React' },
      { name: 'Tailwind CSS' },
      { name: 'shadcn/ui' },
      { name: 'D3.js' },
      { name: 'TanStack Query' },
      { name: 'React Router' },
      { name: 'React Hook Form' },
      { name: 'Zod' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'REST APIs' },
      { name: 'BullMQ', note: 'job queues' },
    ],
  },
  {
    id: 'data',
    label: 'Databases and caching',
    items: [{ name: 'MongoDB' }, { name: 'Mongoose' }, { name: 'Redis' }],
  },
  {
    id: 'infra',
    label: 'Infrastructure and tooling',
    items: [
      { name: 'Docker' },
      { name: 'Docker Compose' },
      { name: 'Nginx' },
      { name: 'Git' },
      { name: 'GitHub' },
    ],
  },
  {
    id: 'cs',
    label: 'Computer science fundamentals',
    items: [
      { name: 'Data structures and algorithms' },
      { name: 'Tries' },
      { name: 'LRU caches' },
      { name: 'Hashing and Bloom filters' },
      { name: 'Rate limiting' },
      { name: 'Distributed systems concepts' },
    ],
  },
];

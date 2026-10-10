// Single source of truth for profile, contact and resume settings.
// Edit values here; nothing else in the code repeats them.

export const profile = {
  name: 'Adhyan Negi',
  role: 'Full stack developer',
  handle: 'adhyan',
  host: 'portfolio',
  version: 'PORTFOLIO v1.0',

  // Lines shown under the name in the terminal intro.
  intro: [
    'Developer in progress. Interested in what happens behind the interface.',
    'Exploring backend engineering, APIs, and distributed systems.',
  ],

  about: [
    "I'm a full stack developer and B.Tech student at Dronacharya College of Engineering (Gurugram University). I like building a whole product, from the React interface to the API and the database behind it.",
    'The part I am drawn to most is the backend: designing APIs, modelling data in databases, adding caching where it helps, and thinking about how a service behaves when many users arrive at once. I enjoy data structures and algorithms because they explain why one design stays fast and another slows down.',
    'I learn by building small, experimental systems and writing down the trade-offs. I want to keep growing across the whole stack, with the aim of designing reliable, scalable systems.',
  ],

  focusAreas: [
    'Full stack development',
    'Backend engineering',
    'Distributed systems',
    'Scalable applications',
    'APIs',
    'Databases',
    'Caching',
    'Infrastructure',
    'Data structures and algorithms',
  ],

  education: [
    {
      degree: 'B.Tech',
      institution: 'Dronacharya College of Engineering',
      university: 'Gurugram University',
    },
    { degree: '12th', institution: 'OPG World School' },
    { degree: '10th', institution: 'RD Rajpal Public School' },
  ],

  // Optional small photo. If the file is missing, the photo is simply not shown.
  photo: '/images/profile.jpg',

  // Resume. The external URL wins if set; otherwise the local PDF is used.
  resume: {
    local: '/resume.pdf', // file lives at public/resume.pdf
    external: '', // e.g. 'https://drive.google.com/...' (leave empty to use the local file)
  },

  contact: {
    email: {
      label: 'Email',
      value: 'adhyannegi81@gmail.com',
      href: 'mailto:adhyannegi81@gmail.com',
    },
    phone: {
      label: 'Phone',
      value: '+91 7303181795',
      href: 'tel:+917303181795',
    },
    github: {
      label: 'GitHub',
      value: 'github.com/Adhyan-25',
      href: 'https://github.com/Adhyan-25',
    },
    linkedin: {
      label: 'LinkedIn',
      value: 'linkedin.com/in/Adhyan-Negi',
      href: 'https://www.linkedin.com/in/Adhyan-Negi',
    },
    instagram: {
      label: 'Instagram',
      value: '@adhyannegi_',
      href: 'https://www.instagram.com/adhyannegi_/',
    },
  },
};

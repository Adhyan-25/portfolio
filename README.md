# Adhyan Negi: terminal-style developer portfolio

A responsive, static portfolio built with React, Vite, plain CSS and Lucide icons. It has a themed loading page, a working terminal simulation that types its output character by character, a data-driven project explorer, a responsive architecture diagram and a small local autocomplete demo (Trie-based prefix search). There is no backend, database, analytics or paid service, so it runs on free static hosting.

## Tech stack

- React 18 + JavaScript (no TypeScript)
- Vite 5
- Plain CSS (`src/styles.css`)
- Lucide React icons

## Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Requires Node.js 18 or newer.

## Project layout (code map)

Content, settings, logic and presentation are kept apart, so most edits touch one small file.

```
public/
  resume.pdf              <- your resume (you add this)
  images/profile.jpg      <- optional small photo (you add this)
src/
  config.js               <- typing speed, loading-page timing, storage keys
  App.jsx                 <- owns shared state and wires everything together
  data/                   <- CONTENT: edit these to change what the site says
    profile.js            name, contact details, about text, education, resume settings
    projects.js           projects (add new ones here)
    skills.js             skill groups
    interests.js          hobbies/interests and the details shown when you click them
    sections.js           sections in the nav, scroll tracking and palette
    themes.js             colour themes (colours live in styles/tokens.css)
  components/
    layout/               Navigation, SocialLinks, Footer, ThemeSwitcher, Toast
    terminal/             Terminal (input, history), Entry (typing), Line, Prompt
    sections/             Section, About, Skills, Education, Interests, Contact
    projects/             ProjectExplorer, ProjectDetail, ArchitectureDiagram, AutocompleteDemo
    ui/                   BootScreen, CommandPalette, CopyButton, ResumeLink, Avatar
  hooks/                  small reusable behaviours (theme, toast, resume, shortcuts, typing...)
  utils/                  plain functions with no React: commands.js, resume.js, trie.js, palette.js ...
  styles/                 one CSS file per area; index.css sets the import order
```

Where to change things:

| I want to... | Edit |
| --- | --- |
| Change text, contact details or education | `src/data/profile.js` |
| Add a project or skill | `src/data/projects.js`, `src/data/skills.js` |
| Add or change interests and their details | `src/data/interests.js` |
| Change typing speed, loading-page timing, or when project filters appear | `src/config.js` |
| Add a terminal command | `src/utils/commands.js` (add to `COMMANDS`, `HELP_ROWS` and `handlers`) |
| Add a command-palette action | `src/utils/palette.js` (and a new action type in `src/hooks/useSiteActions.js` if needed) |
| Change colours | `src/styles/tokens.css` |
| Add a nav section | create a component in `components/sections/`, render it in `App.jsx`, add it to `src/data/sections.js` |

## Edit profile and contact information

Everything lives in `src/data/profile.js`: name, intro lines, about paragraphs, focus areas, education (newest first, including school) and the `contact` object (email, phone, GitHub, LinkedIn, Instagram). Each contact entry has a `value` (shown and copied) and an `href` (the link). Components and the terminal read these values, so you only change them in one place.

## Add a project

Append an object to the array in `src/data/projects.js`, copying the shape of the existing entry:

```js
{
  slug: 'my-new-project',          // used by `projects my-new-project` in the terminal
  title: 'My New Project',
  subtitle: 'One-line description',
  status: 'Experimental',          // optional badge
  categories: ['Backend'],         // category filters appear once there are 5+ projects (config.js)
  description: '...',
  technologies: ['Node.js', 'PostgreSQL'],
  links: { repo: 'https://github.com/...', demo: 'https://...' }, // omit what you don't have
  features: [{ name: '...', plain: '...', how: '...', why: '...' }], // optional
}
```

The explorer, the filters and the `projects` terminal command pick it up automatically. Optional fields: `highlight` (what makes it stand out), `steps` (ordered "How it works" list), `notes`, `disclaimer`, `architecture` (same shape as the existing one), `demo: 'autocomplete'` and per-feature `status: 'implemented' | 'planned'` (shows a badge).

## Interests and their details

Edit `src/data/interests.js`. Each interest with a non-empty `details` list becomes a chip you can click to expand (and is printed by the `interests` terminal command). Interests with no details are shown as plain labels. Interests behave like tabs: click a chip to see its details (the first is open by default). A detail can have an `href` to become a link, as with the YouTube Music row. Entries marked `SAMPLE` in the file are placeholder wording: replace them, and add your half marathon best and the workout split you follow.

## Add skills

Edit `src/data/skills.js`. Add `{ name: 'PostgreSQL' }` to a group's `items`, or add a whole new group.

## Profile photo (optional)

Put a small square image at `public/images/profile.jpg`. If the file does not exist, the photo is hidden with no broken-image icon and no empty frame.

## Resume

All resume links (header, contact section, terminal) go through one resolver in `src/utils/resume.js`:

1. If `resume.external` in `src/data/profile.js` is set to an `http(s)` URL, that URL is used.
2. Otherwise `/resume.pdf` (the file `public/resume.pdf`) is used, if it exists.
3. If neither is available, the buttons show a helpful message instead of opening a broken link.

To update your resume, replace `public/resume.pdf` with the new file and redeploy. No code changes are needed. To host it elsewhere, set `resume.external` instead.

## Design notes

The terminal is the hero; the rest of the page borrows from print so it does not feel repetitive:

- **Two typefaces:** monospace for the interface (terminal, buttons, tags) and a system serif for reading text, headings and the contact line. Change the stacks with `--mono` and `--serif` in `src/styles/tokens.css`.
- **Editorial sections:** on wide screens each section has a sticky heading column on the left (the `$ command` line under the title comes from `src/data/sections.js`). Projects and Education sit on a lighter band (`tone="alt"` on `Section`) so the page has rhythm.
- **Skills** read like a table of contents, **Education** is a timeline, and **Contact** leads with one large email link.
- **Details:** a brass second accent (`--accent-2`) for the drop cap and serif labels, and a faint dot grid behind the terminal that follows the theme colour.

## Extra features

- **Colour themes:** Green (default), Amber and Mono. Switch from the footer, the command palette, or the terminal (`theme amber`). The choice is remembered in the browser. To add a theme, add an entry to `src/data/themes.js` and a `:root[data-theme='<id>']` block in `src/styles/tokens.css`.
- **Command palette:** press Ctrl+K (Cmd+K on Mac) or use the Search button in the header. Type to filter, arrow keys to move, Enter to run, Esc to close. It can jump to sections and projects, copy your email or phone, open your social links and resume, change the theme and focus the terminal.
- **Keyboard shortcut:** press `/` anywhere on the page to jump to the terminal input.
- **Current section in the navigation:** the link for the section you are reading is highlighted as you scroll.

## Loading page and typing effect

- **Loading page:** shown once per browser session. Its "checking for resume" step waits for the real resume lookup (never longer than 3 seconds). Press any key or tap to skip.
- **Typewriter output:** the terminal types the intro and every command's output with a block cursor. Press Enter, Esc or click the output to finish instantly. Both effects are switched off when the visitor has reduced motion enabled. To change the typing speed, edit `typing` in `src/config.js`.

## Terminal commands

`help`, `whoami`, `about`, `interests`, `skills`, `projects`, `projects <slug>`, `education`, `contact`, `resume`, `theme [name]`, `ls`, `cat <file>`, `neofetch`, `clear`, `date`, `sudo hire-me`, `exit`.

`ls` lists the files on the site (`about.md`, `projects/`, `skills.json`, `education.txt`, `contact.sh`, `interests.md`) and `cat about.md` (or `cat about`) opens one. The main commands are also always visible as tap-able buttons under the input, so nothing needs typing on a phone.

Arrow up/down browse history, Tab completes commands, project slugs, theme names and file names (Tab only captures focus when there is something to complete), and `Ctrl+L` clears. Section headings on the page are drawn as shell commands (`$ cat about.md`); change them in `src/data/sections.js`. The terminal is a simulation: input is matched against a fixed allowlist, nothing is evaluated or executed, and output is rendered as escaped text. All sections can also be reached from the navigation without typing.

## Deploy

The build uses relative asset paths (`base: './'`), so it works on a root domain and on a GitHub Pages project site.

### GitHub Pages (included workflow)

1. Push this project to a GitHub repository whose default branch is `main`.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds the site and publishes `dist/`.

Your site appears at `https://<username>.github.io/<repository>/`.

### Other static hosts (Netlify, Vercel, Cloudflare Pages)

Use build command `npm run build` and publish directory `dist`.

## Troubleshooting

- **`npm run dev` fails or shows a blank page:** use Node.js 18+, delete `node_modules`, and run `npm install` again. Check the browser console for errors.
- **Resume button shows "isn't available online yet":** `public/resume.pdf` is missing or `resume.external` is not a full `http(s)` URL. Add the file (or set the URL) and redeploy.
- **Resume works locally but not after deploy:** make sure `public/resume.pdf` is committed (check `.gitignore`) and the deploy finished.
- **Photo does not appear:** the file must be exactly `public/images/profile.jpg`.
- **GitHub Pages shows a 404 or old content:** confirm Pages source is set to GitHub Actions, wait for the workflow run to finish, and hard-refresh.
- **Copy buttons do nothing:** clipboard access needs HTTPS or localhost. The app falls back to an older copy method when possible and shows "Copy failed" otherwise.
- **Boot animation plays every visit:** it plays once per browser session and is skipped when reduced motion is enabled. Press any key or tap to skip it.

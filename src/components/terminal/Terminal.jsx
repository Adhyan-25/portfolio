import { useCallback, useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile.js';
import { useCommandHistory } from '../../hooks/useCommandHistory.js';
import { PRIMARY_COMMANDS, complete, normalizeInput, runCommand } from '../../utils/commands.js';
import { plainText } from '../../utils/typewriter.js';
import Entry from './Entry.jsx';
import Prompt from './Prompt.jsx';

const INTRO_LINES = [
  { kind: 'text', text: profile.name, tone: 'heading' },
  ...profile.intro.map((text) => ({ kind: 'text', text })),
  { kind: 'text', text: "Type 'help' to explore.", tone: 'dim' },
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Props:
//   resume    resume state from useResume (used by the `resume` command)
//   theme     current theme id (used by the `theme` command)
//   active    false while the loading page is showing; the intro types once true
//   onAction  performs site actions such as scrolling or changing the theme
export default function Terminal({ resume, theme, active = true, onAction }) {
  const [entries, setEntries] = useState([]);
  const [skip, setSkip] = useState(0); // bump to finish all typing instantly
  const [announce, setAnnounce] = useState('');
  const [value, setValue] = useState('');
  const [animateOk] = useState(() => !reducedMotion());
  const history = useCommandHistory();
  const nextId = useRef(0);
  const introAdded = useRef(false);
  const inputRef = useRef(null);
  const logRef = useRef(null);

  // Keep the newest output in view (scrolls the terminal, never the page).
  const scrollToEnd = useCallback(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const addEntry = useCallback(
    (command, lines, options = {}) => {
      nextId.current += 1;
      const animate = animateOk && options.animate !== false;
      setEntries((prev) => [
        ...prev,
        { id: nextId.current, command, lines, animate, animateCommand: animate && Boolean(options.animateCommand) },
      ]);
      setAnnounce(lines.map(plainText).filter(Boolean).join('. '));
    },
    [animateOk],
  );

  // Type out the intro once the loading page is gone.
  useEffect(() => {
    if (!active || introAdded.current) return;
    introAdded.current = true;
    addEntry('whoami', INTRO_LINES, { animateCommand: true });
  }, [active, addEntry]);

  const clearScreen = useCallback(() => {
    setEntries([]);
    setAnnounce('');
  }, []);

  const finishTyping = useCallback(() => setSkip((s) => s + 1), []);

  const run = useCallback(
    (raw) => {
      const input = normalizeInput(raw);
      if (!input) return;
      finishTyping(); // anything still typing completes instantly
      const result = runCommand(input, { resume, theme, now: new Date() });

      if (result.action === 'clear') {
        clearScreen();
      } else {
        addEntry(input, result.lines);
        if (result.action?.type === 'open-url') window.open(result.action.url, '_blank', 'noopener,noreferrer');
        else if (result.action) onAction(result.action);
      }
      history.push(input);
      setValue('');
    },
    // `history` is a fresh object every render, but push() only uses stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resume, theme, addEntry, clearScreen, finishTyping, onAction],
  );

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishTyping();
      run(value);
    } else if (e.key === 'Escape') {
      finishTyping();
    } else if (e.key === 'ArrowUp') {
      const previous = history.up(value);
      if (previous === null) return;
      e.preventDefault();
      setValue(previous);
    } else if (e.key === 'ArrowDown') {
      const next = history.down();
      if (next === null) return;
      e.preventDefault();
      setValue(next);
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // Only capture Tab when it can complete something, so keyboard users never get stuck.
      const { value: completed, options } = complete(value);
      if (!options.length || (options.length === 1 && completed === value.trim().toLowerCase())) return;
      e.preventDefault();
      if (completed !== value) setValue(completed);
      if (options.length > 1) {
        addEntry(value, [{ kind: 'text', text: options.join('   '), tone: 'dim' }], { animate: false });
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearScreen();
    }
  };

  const onLogClick = (e) => {
    if (window.getSelection()?.toString()) return;
    if (e.target.closest('a, button')) return;
    finishTyping();
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="terminal">
      <div className="terminal__bar">
        <span>
          {profile.handle}@{profile.host}: ~
        </span>
        <span className="terminal__version">{profile.version}</span>
      </div>

      {/* Output is typed character by character, so it is not announced live;
          the status region below announces each finished result once. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className="terminal__log"
        ref={logRef}
        role="log"
        aria-label="Terminal output"
        aria-live="off"
        tabIndex={0}
        onClick={onLogClick}
      >
        {entries.map((entry) => (
          <Entry
            key={entry.id}
            entry={entry}
            skip={skip}
            onRun={run}
            onAction={onAction}
            onProgress={scrollToEnd}
          />
        ))}
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>

      <div className="terminal__input">
        <label className="t-inputrow">
          <span className="t-inputrow__prompt" aria-hidden="true">
            <Prompt />
          </span>
          <input
            id="terminal-input"
            ref={inputRef}
            className="t-input"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              history.stopBrowsing();
            }}
            onKeyDown={onKeyDown}
            aria-label="Terminal command. Type help for the list of commands."
            placeholder="type a command"
            maxLength={200}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
          />
        </label>
        <div className="t-commandbar">
          <span id="t-commands-label" className="t-commandbar__label dim">
            Tap a command or type one:
          </span>
          <div className="t-chips" role="group" aria-labelledby="t-commands-label">
            {PRIMARY_COMMANDS.map((cmd) => (
              <button key={cmd} type="button" className="chip" onClick={() => run(cmd)}>
                {cmd}
              </button>
            ))}
          </div>
        </div>
        <p className="t-hint dim">
          Keys: Tab completes, Up and Down browse history, Esc finishes the typing, / jumps here from anywhere.
        </p>
      </div>
    </div>
  );
}

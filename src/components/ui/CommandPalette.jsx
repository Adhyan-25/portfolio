import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react';
import { filterPaletteItems } from '../../utils/palette.js';

// Ctrl/Cmd + K palette: type to filter, arrows to move, Enter to run, Esc to close.
// Focus returns to where it was before opening, unless the chosen action moved it.
export default function CommandPalette({ open, items, onSelect, onClose }) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const returnFocus = useRef(null);

  const results = useMemo(() => filterPaletteItems(items, query), [items, query]);
  const optionId = (i) => `${uid}-opt-${i}`;

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      return undefined;
    }
    const current = document.activeElement;
    if (!current || current === document.body) returnFocus.current?.focus?.();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  if (!open) return null;

  const choose = (item) => {
    if (!item) return;
    onSelect(item); // run first so an action that moves focus wins over focus restore
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setActive((a) => (a <= 0 ? results.length - 1 : a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // the input is the only stop; options are reached with the arrows
    }
  };

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="palette__input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={results.length ? optionId(active) : undefined}
          aria-label="Search actions"
          placeholder="Type to search: projects, contact, theme…"
          value={query}
          maxLength={60}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />

        <ul id={`${uid}-list`} className="palette__list" role="listbox" aria-label="Actions">
          {results.map((item, i) => (
            <Fragment key={item.id}>
              {(i === 0 || results[i - 1].group !== item.group) && (
                <li role="presentation" className="palette__group">
                  {item.group}
                </li>
              )}
              <li
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                className={`palette__option${i === active ? ' is-active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(item)}
                onMouseMove={() => active !== i && setActive(i)}
              >
                <span>{item.label}</span>
                {item.hint && <span className="palette__hint">{item.hint}</span>}
              </li>
            </Fragment>
          ))}
        </ul>

        {results.length === 0 && <p className="palette__empty">No matching actions. Try a different word.</p>}
        <p className="palette__help dim">Up and down to move, Enter to run, Esc to close.</p>
        <p className="sr-only" role="status" aria-live="polite">
          {results.length} action{results.length === 1 ? '' : 's'} available
        </p>
      </div>
    </div>
  );
}

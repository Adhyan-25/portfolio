// Pure helpers for the typewriter effect. A terminal "entry" is a command plus
// output lines. Typing walks through every character of the typeable lines in
// order; `n` is how many characters have been revealed so far.

// Line kinds whose characters are typed. Other kinds (chips, buttons) appear
// once the text before them has finished.
export const TYPEABLE = new Set(['text', 'row', 'link']);

export function lineLength(line) {
  if (line.kind === 'text') return line.text.length;
  if (line.kind === 'row') return line.term.length + line.desc.length;
  if (line.kind === 'link') return line.label.length + line.text.length;
  return 0;
}

// The first `n` characters of a line.
export function partialLine(line, n) {
  if (line.kind === 'text') return { ...line, text: line.text.slice(0, n) };
  if (line.kind === 'row') {
    return { ...line, term: line.term.slice(0, n), desc: line.desc.slice(0, Math.max(0, n - line.term.length)) };
  }
  if (line.kind === 'link') {
    return { ...line, label: line.label.slice(0, n), text: line.text.slice(0, Math.max(0, n - line.label.length)) };
  }
  return line;
}

// Plain-text version of a line, used for the screen-reader announcement.
export function plainText(line) {
  if (line.kind === 'text') return line.text;
  if (line.kind === 'row') return `${line.term}: ${line.desc}`;
  if (line.kind === 'link') return `${line.label}: ${line.text}`;
  if (line.kind === 'button') return line.label;
  return '';
}

// Where each line starts (in revealed characters) and the total to reveal.
export function computeLayout(lines, commandLength) {
  let acc = commandLength;
  const starts = lines.map((line) => {
    const start = acc;
    acc += lineLength(line);
    return start;
  });
  return { starts, total: acc };
}

// Index of the line that currently holds the cursor:
// -1 = the command line, -2 = nowhere (typing finished).
export function findCursorLine(lines, layout, n, commandLength) {
  if (n >= layout.total) return -2;
  if (n < commandLength) return -1;
  for (let i = 0; i < lines.length; i += 1) {
    const len = lineLength(lines[i]);
    if (len > 0 && n >= layout.starts[i] && n < layout.starts[i] + len) return i;
  }
  return -2;
}

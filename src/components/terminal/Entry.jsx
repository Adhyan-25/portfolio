import { useEffect, useMemo } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter.js';
import { TYPEABLE, computeLayout, findCursorLine, partialLine } from '../../utils/typewriter.js';
import Line, { Cursor } from './Line.jsx';
import Prompt from './Prompt.jsx';

// One command plus its output. With `entry.animate`, characters appear one by
// one and a block cursor marks the typing position. Changing `skip` finishes at once.
export default function Entry({ entry, skip, onRun, onAction, onProgress }) {
  const { lines, command, animate, animateCommand } = entry;
  const commandLength = animateCommand ? command.length : 0;

  const layout = useMemo(() => computeLayout(lines, commandLength), [lines, commandLength]);
  const n = useTypewriter({ animate, total: layout.total, commandLength, skip });

  // Lets the terminal keep the newest text scrolled into view.
  useEffect(() => {
    onProgress();
  }, [n, onProgress]);

  const cursorAt = findCursorLine(lines, layout, n, commandLength);

  return (
    <div className="t-entry">
      <p className="t-line t-command">
        <Prompt /> <span>{animateCommand ? command.slice(0, Math.min(n, commandLength)) : command}</span>
        {cursorAt === -1 && <Cursor />}
      </p>
      {lines.map((line, i) =>
        n >= layout.starts[i] ? (
          <Line
            key={i}
            line={TYPEABLE.has(line.kind) ? partialLine(line, n - layout.starts[i]) : line}
            cursor={cursorAt === i}
            onRun={onRun}
            onAction={onAction}
          />
        ) : null,
      )}
    </div>
  );
}

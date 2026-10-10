// Renders one line of terminal output. Content is plain data from utils/commands.js
// and is always rendered as escaped text, never as HTML.

export const Cursor = () => <span className="t-cursor" aria-hidden="true" />;

export default function Line({ line, cursor, onRun, onAction }) {
  switch (line.kind) {
    case 'text':
      if (line.tone === 'heading') {
        return (
          <h1 className="t-name">
            {line.text}
            {cursor && <Cursor />}
          </h1>
        );
      }
      return (
        <p className={`t-line${line.tone ? ` t-${line.tone}` : ''}`}>
          {line.text}
          {cursor && <Cursor />}
        </p>
      );

    case 'row':
      return (
        <p className="t-row">
          <span className="t-term">{line.term}</span>
          <span>
            {line.desc}
            {cursor && <Cursor />}
          </span>
        </p>
      );

    case 'link':
      return (
        <p className="t-row">
          <span className="t-term">{line.label}</span>
          <span>
            <a href={line.href} {...(line.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {line.text}
            </a>
            {cursor && <Cursor />}
          </span>
        </p>
      );

    case 'suggest': // clickable command suggestions
      return (
        <div className="t-chips">
          {line.commands.map((cmd) => (
            <button key={cmd} type="button" className="chip" onClick={() => onRun(cmd)}>
              {cmd}
            </button>
          ))}
        </div>
      );

    case 'button': // runs a site action (see hooks/useSiteActions.js)
      return (
        <div className="t-chips">
          <button type="button" className="chip" onClick={() => onAction(line.action)}>
            {line.label}
          </button>
        </div>
      );

    default:
      return null;
  }
}

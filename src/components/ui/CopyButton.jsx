import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard.js';

// "Copy" button with its own inline feedback ("Copied" / "Copy failed").
export default function CopyButton({ value, what }) {
  const [state, setState] = useState('idle'); // idle | copied | failed
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const ok = await copyToClipboard(value);
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2500);
  };

  const label = state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy';
  return (
    <>
      <button type="button" className="btn btn--ghost btn--small" onClick={copy} aria-label={`Copy ${what}`}>
        {state === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span>{label}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'copied' ? `${what} copied to clipboard` : state === 'failed' ? `Could not copy ${what}` : ''}
      </span>
    </>
  );
}

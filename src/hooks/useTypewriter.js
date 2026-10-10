import { useEffect, useRef, useState } from 'react';
import { config } from '../config.js';

// Reveals characters one by one. Returns `n`, the number of characters shown.
//   animate        false = everything is shown immediately
//   total          characters to reveal
//   commandLength  the first characters (the command) type slower
//   skip           change this value to finish immediately
export function useTypewriter({ animate, total, commandLength, skip }) {
  const { commandDelayMs, outputDelayMs, maxOutputTicks } = config.typing;
  const [n, setN] = useState(animate ? 0 : total);
  const lastSkip = useRef(skip);

  useEffect(() => {
    if (skip !== lastSkip.current) {
      lastSkip.current = skip;
      setN(total);
    }
  }, [skip, total]);

  const perTick = Math.max(1, Math.ceil((total - commandLength) / maxOutputTicks));
  useEffect(() => {
    if (n >= total) return undefined;
    const typingCommand = n < commandLength;
    const timer = setTimeout(
      () => setN((v) => Math.min(total, v + (typingCommand ? 1 : perTick))),
      typingCommand ? commandDelayMs : outputDelayMs,
    );
    return () => clearTimeout(timer);
  }, [n, total, commandLength, perTick, commandDelayMs, outputDelayMs]);

  return n;
}

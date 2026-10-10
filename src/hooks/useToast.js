import { useCallback, useEffect, useRef, useState } from 'react';
import { config } from '../config.js';

// A single short message shown in the corner (see components/layout/Toast.jsx).
export function useToast() {
  const [message, setMessage] = useState('');
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const notify = useCallback((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), config.toastMs);
  }, []);

  return { message, notify };
}

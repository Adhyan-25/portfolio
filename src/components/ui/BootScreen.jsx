import { useCallback, useEffect, useRef, useState } from 'react';
import { config, STORAGE_KEYS } from '../../config.js';
import { profile } from '../../data/profile.js';
import { readStorage, writeStorage } from '../../utils/storage.js';

const { steps, resumeStepIndex, stepMs, maxWaitMs, finishDelayMs } = config.boot;

// Skip the loading page for reduced motion and for repeat visits in the same session.
export function shouldSkipBoot() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return readStorage(STORAGE_KEYS.bootSeen, 'session') === '1';
}

// Loading page shown on first visit. The "checking for resume" step is real:
// it waits for the resume lookup (capped at maxWaitMs) before finishing.
export default function BootScreen({ onDone, ready }) {
  const [step, setStep] = useState(0); // number of completed steps
  const [capped, setCapped] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    writeStorage(STORAGE_KEYS.bootSeen, '1', 'session');
    onDone();
  }, [onDone]);

  const maxStep = ready || capped ? steps.length : resumeStepIndex;

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, maxStep)), stepMs);
    return () => clearInterval(timer);
  }, [maxStep]);

  useEffect(() => {
    const cap = setTimeout(() => setCapped(true), maxWaitMs);
    return () => clearTimeout(cap);
  }, []);

  useEffect(() => {
    if (step < steps.length) return undefined;
    const t = setTimeout(finish, finishDelayMs);
    return () => clearTimeout(t);
  }, [step, finish]);

  // Skip with any key or tap.
  useEffect(() => {
    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [finish]);

  const percent = Math.round((step / steps.length) * 100);

  return (
    <div className="boot" role="status" aria-label="Loading portfolio">
      <div className="boot__panel">
        <p className="boot__title">
          {profile.handle}@{profile.host}
        </p>
        <p className="dim boot__version">{profile.version}</p>

        <ul className="boot__steps">
          {steps.slice(0, Math.min(step + 1, steps.length)).map((label, i) => {
            const isDone = i < step;
            return (
              <li key={label}>
                <span className={isDone ? 'boot__status' : 'boot__status boot__status--wait'}>
                  {isDone ? '[ ok ]' : '[ .. ]'}
                </span>{' '}
                {label}
              </li>
            );
          })}
        </ul>

        <div
          className="boot__bar"
          role="progressbar"
          aria-label="Loading"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="boot__fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="boot__hint dim">Press any key or tap to skip</p>
      </div>
    </div>
  );
}

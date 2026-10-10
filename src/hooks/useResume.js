import { useEffect, useState } from 'react';
import { initialResumeState, resolveResume } from '../utils/resume.js';

export function useResume() {
  const [resume, setResume] = useState(initialResumeState);

  useEffect(() => {
    if (resume.status !== 'checking') return undefined;
    let live = true;
    resolveResume().then((next) => {
      if (live) setResume(next);
    });
    return () => {
      live = false;
    };
    // Runs once on mount; the initial state decides whether a check is needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return resume;
}

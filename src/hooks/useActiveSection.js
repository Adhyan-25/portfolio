import { useEffect, useState } from 'react';

// Returns the id of the section currently crossing a thin band near the top of
// the viewport ('' while the hero is showing). Pass a stable array of ids.
export function useActiveSection(ids) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const live = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? live.add(e.target.id) : live.delete(e.target.id)));
        setActive(ids.filter((id) => live.has(id)).pop() || '');
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

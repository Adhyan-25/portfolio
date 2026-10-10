import { useRef, useState } from 'react';

// Arrow-key history for the terminal input.
//   push(cmd)      remember a command
//   up(current)    previous command, or null when there is nothing to show
//   down()         next command (or the unfinished draft), or null when not browsing
//   stopBrowsing() leave history mode (call when the user edits the text)
export function useCommandHistory() {
  const [past, setPast] = useState([]);
  const [index, setIndex] = useState(-1); // -1 means "the line being typed"
  const draft = useRef('');

  return {
    push(cmd) {
      setPast((p) => (p[p.length - 1] === cmd ? p : [...p, cmd]));
      setIndex(-1);
      draft.current = '';
    },
    up(current) {
      if (!past.length) return null;
      if (index === -1) draft.current = current;
      const next = index === -1 ? past.length - 1 : Math.max(0, index - 1);
      setIndex(next);
      return past[next];
    },
    down() {
      if (index === -1) return null;
      if (index >= past.length - 1) {
        setIndex(-1);
        return draft.current;
      }
      setIndex(index + 1);
      return past[index + 1];
    },
    stopBrowsing() {
      setIndex(-1);
    },
  };
}

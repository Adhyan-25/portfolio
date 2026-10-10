import { useId, useMemo, useState } from 'react';
import { Trie } from '../../utils/trie.js';

const SAMPLE_TERMS = [
  'api gateway', 'autocomplete', 'availability', 'backpressure', 'benchmarking', 'binary search',
  'binary tree', 'bloom filter', 'breadth-first search', 'b-tree', 'bullmq', 'cache',
  'cache eviction', 'cache invalidation', 'cap theorem', 'circuit breaker', 'connection pool',
  'consensus', 'consistent hashing', 'cors', 'database index', 'dead letter queue',
  'depth-first search', 'dijkstra', 'distributed lock', 'docker', 'docker compose',
  'dynamic programming', 'eventual consistency', 'express middleware', 'graceful shutdown',
  'graph', 'hash map', 'hashing', 'heap', 'horizontal scaling', 'idempotency', 'job queue', 'jwt',
  'leader election', 'linked list', 'load balancer', 'lru cache', 'lua script', 'message queue',
  'mongodb', 'mongoose', 'nginx', 'node.js', 'pagination', 'priority queue', 'queue',
  'rate limiting', 'read replica', 'recursion', 'redis', 'replication', 'rest api',
  'reverse proxy', 'round robin', 'sharding', 'sliding window', 'sorting', 'stack',
  'token bucket', 'trie', 'two pointers', 'vertical scaling', 'write-ahead log',
];

const trie = new Trie(SAMPLE_TERMS);
const LIMIT = 8;

export default function AutocompleteDemo() {
  const uid = useId();
  const listId = `${uid}-list`;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [chosen, setChosen] = useState('');

  const trimmed = query.trim();
  const results = useMemo(() => trie.suggest(trimmed, LIMIT), [trimmed]);
  const showList = open && trimmed.length > 0 && results.length > 0;
  const showEmpty = open && trimmed.length > 0 && results.length === 0;

  const choose = (term) => {
    setQuery(term);
    setChosen(term);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (!results.length) return;
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      if (!results.length) return;
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a <= 0 ? results.length - 1 : a - 1));
    } else if (e.key === 'Enter') {
      if (showList && active >= 0) {
        e.preventDefault();
        choose(results[active]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      } else {
        setQuery('');
        setChosen('');
      }
    }
  };

  const status = !trimmed
    ? ''
    : results.length
      ? `${results.length} suggestion${results.length === 1 ? '' : 's'} available. Use up and down arrows to browse.`
      : 'No matches.';

  return (
    <div className="demo">
      <div className="demo__head">
        <h4 className="demo__title">Try prefix search</h4>
        <span className="badge">Local demo: runs in your browser, not a live service</span>
      </div>
      <p className="dim">
        Prefix search finds every word that <em>starts with</em> the text you typed. This demo stores {trie.size}{' '}
        sample backend and algorithm terms in a trie (one node per character): it follows your prefix down the
        trie, then lists the words below that point. No server, database or API is involved.
      </p>

      <label className="demo__label" htmlFor={`${uid}-input`}>
        Search sample terms
      </label>
      <div className="demo__box">
        <input
          id={`${uid}-input`}
          className="demo__input"
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${uid}-opt-${active}` : undefined}
          value={query}
          placeholder="e.g. re, ca, lo"
          autoComplete="off"
          spellCheck={false}
          maxLength={60}
          onChange={(e) => {
            setQuery(e.target.value);
            setChosen('');
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        {showList && (
          <ul id={listId} className="demo__list" role="listbox" aria-label="Suggestions">
            {results.map((term, i) => (
              <li
                key={term}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={`demo__option${i === active ? ' is-active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(term);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <mark>{term.slice(0, trimmed.length)}</mark>
                {term.slice(trimmed.length)}
              </li>
            ))}
          </ul>
        )}
        {showEmpty && (
          <p className="demo__empty">
            No matches for “{trimmed}” in the sample dataset. Try a shorter prefix such as “re” or “ca”.
          </p>
        )}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
      {chosen && (
        <p className="demo__chosen">
          Selected: <strong>{chosen}</strong>
        </p>
      )}
    </div>
  );
}

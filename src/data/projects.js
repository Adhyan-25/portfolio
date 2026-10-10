// Every entry here is shown automatically by the project explorer and the
// `projects` terminal command. To add a project, append an object with the
// same shape. Omit `links.repo` / `links.demo` if you don't have real URLs.
//
// Optional per-feature field: status: 'implemented' | 'planned'
// (a badge is shown only when this is set).

export const projects = [
  {
    slug: 'smart-search-engine',
    title: 'Smart Search Engine',
    subtitle: 'Scalable Search & Autocomplete Platform',
    status: 'Experimental',
    categories: ['Backend', 'Distributed systems', 'Full-stack'],
    description:
      'An experimental backend-focused search platform built to explore autocomplete, caching, rate limiting, background processing, and horizontally scaled Node.js services.',
    disclaimer:
      'Experimental project. The sections below explain the concepts and how they work. No performance figures are claimed, and nothing here is presented as production-ready.',
    technologies: [
      'React',
      'JavaScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'Redis',
      'BullMQ',
      'Nginx',
      'Docker',
      'Docker Compose',
    ],
    links: {
      // repo: 'https://github.com/...',
      // demo: 'https://...',
    },
    demo: 'autocomplete',

    features: [
      {
        name: 'Trie-based prefix autocomplete',
        plain: 'As you type, the search box suggests words that start with what you have typed so far.',
        how: 'A trie stores words as paths of characters, one node per character. To answer a prefix, the code walks down the path for the prefix (cost proportional to the prefix length) and then collects words below that node, optionally ranked.',
        why: 'Lookup time depends on the prefix, not on how many words are stored. Trade-offs: a trie uses more memory than a sorted array with binary search, it needs rebuilding or careful updates when data changes, and it does not tolerate typos on its own.',
      },
      {
        name: 'Bounded LRU cache',
        plain: 'Keeps recent answers close by and throws away the least recently used one when the cache is full.',
        how: 'A hash map finds an entry by key in constant time. A doubly linked list orders entries by recency: a read moves the entry to the front, an insert goes to the front, and when capacity is exceeded the entry at the back is evicted. Both operations stay O(1).',
        why: 'It bounds memory while favouring hot queries. Trade-offs: the cache lives inside one process, so separate instances do not share it; it tracks recency rather than frequency, so a burst of one-off queries can push out useful entries; capacity needs tuning.',
      },
      {
        name: 'Bloom filter membership checks',
        plain: 'A fast pre-check that answers "definitely not here" or "maybe here" before a more expensive lookup.',
        how: 'A bit array plus several hash functions. Adding an item sets one bit per hash function; checking an item looks at the same bits. If any bit is 0 the item was never added. If all are 1 it might have been added, because other items can set the same bits.',
        why: 'It is compact and cheap, and it saves lookups for items that do not exist. Trade-offs: false positives are possible (false negatives are not), a standard Bloom filter cannot delete items, and its size must be chosen up front to control the false-positive rate. A "maybe" still needs the real lookup.',
      },
      {
        name: 'Consistent hashing',
        plain: 'A way to decide which node stores a key so that adding or removing a node moves only a small share of keys.',
        how: 'Nodes and keys are hashed onto the same circular space (a ring). A key belongs to the first node found going clockwise. Each node is usually placed at several points (virtual nodes) to even out the load. When a node leaves, only the keys in its arcs move to neighbours.',
        why: 'Simple modulo hashing reshuffles almost every key when the node count changes; a ring avoids that. Trade-offs: with few virtual nodes the load can be uneven, virtual nodes add memory and bookkeeping, and the ring alone does not provide replication or failure detection.',
      },
      {
        name: 'Redis token-bucket rate limiting (atomic Lua script)',
        plain: 'Limits how often one client can call the API, while still allowing short bursts.',
        how: 'Each client has a bucket with a maximum number of tokens that refills at a steady rate. Every request spends a token; with no tokens left the request is rejected. The bucket state (token count and last refill time) lives in Redis, and a Lua script performs read, refill, spend and write as one atomic step, so several Node.js instances cannot race each other.',
        why: 'Sharing the state in Redis makes the limit consistent across instances. Trade-offs: every request pays an extra Redis round trip, Redis becomes a dependency for the API, and you must decide whether to allow or block requests when Redis is unreachable.',
      },
      {
        name: 'Background analytics with a job queue',
        plain: 'Slow bookkeeping, such as recording searches, happens after the response has been sent.',
        how: 'The API adds a small job to a BullMQ queue (stored in Redis) and responds immediately. A separate worker process takes jobs from the queue, retries failures, and writes the results to MongoDB.',
        why: 'It keeps request latency low and isolates slow work. Trade-offs: analytics become eventually consistent, there is one more process to run and monitor, and retries mean a job can run more than once, so handlers should be safe to repeat.',
      },
      {
        name: 'Multiple Node.js instances behind a load balancer',
        plain: 'Several copies of the server share the incoming traffic, so one copy is not a bottleneck or a single point of failure.',
        how: 'Nginx acts as a reverse proxy and spreads requests across an upstream group of Express instances (round robin by default). Docker Compose starts the instances. Because shared state lives in Redis and MongoDB, any instance can serve any request.',
        why: 'It scales horizontally and survives an instance restart. Trade-offs: in-process state (such as the LRU cache) is not shared, there are more moving parts to configure, and the load balancer itself needs redundancy to avoid becoming the single point of failure.',
      },
      {
        name: 'Pagination, client-side caching and benchmarking',
        plain: 'Results arrive in pages, the browser remembers answers it already fetched, and the system is measured rather than guessed about.',
        how: 'The API returns a limited slice per request. The React client keeps previous responses keyed by query and page, so repeating a query does not hit the network. Benchmarking means running a load tool against the service with and without a feature to compare behaviour.',
        why: 'Pages keep responses small and the client cache makes repeated typing feel instant. Trade-offs: offset pagination gets slower on deep pages and can shift when data changes, a client cache can show stale results, and benchmark results depend on the machine, so no numbers are published here.',
      },
    ],

    architecture: {
      title: 'Architecture as designed',
      summary:
        'Client, then Nginx, then multiple Node.js/Express instances, which share Redis and MongoDB. A BullMQ worker handles background jobs.',
      note: 'This diagram shows the intended design of an experimental project. It is not verified production infrastructure.',
      layers: [
        { id: 'client', nodes: [{ name: 'Client', role: 'React app: search box, client-side cache' }] },
        { id: 'proxy', via: 'HTTP requests', nodes: [{ name: 'Nginx', role: 'Reverse proxy and load balancer' }] },
        {
          id: 'api',
          via: 'Requests spread across instances',
          nodes: [
            { name: 'Node.js / Express #1', role: 'API instance' },
            { name: 'Node.js / Express #2', role: 'API instance' },
            { name: 'Node.js / Express #N', role: 'API instance' },
          ],
        },
        {
          id: 'state',
          via: 'Shared state and data',
          nodes: [
            { name: 'Redis', role: 'Shared cache, rate-limit state, job queue' },
            { name: 'MongoDB', role: 'Persistent data (via Mongoose)' },
          ],
        },
        {
          id: 'worker',
          async: true,
          via: 'Background path: jobs queued in Redis',
          nodes: [{ name: 'BullMQ worker', role: 'Processes analytics jobs, writes results to MongoDB' }],
        },
      ],
      components: [
        { name: 'Client', description: 'The React front end. Sends search requests and keeps earlier responses so repeated queries need no network call.' },
        { name: 'Nginx', description: 'Receives every request and forwards it to one of the API instances, so no single instance carries all the traffic.' },
        { name: 'Node.js / Express instances', description: 'Identical API servers. They run the search logic (trie, LRU cache, Bloom filter) and check the rate limit before answering.' },
        { name: 'Redis', description: 'Shared in-memory store used for the cache, the token-bucket state, and the BullMQ queue.' },
        { name: 'MongoDB', description: 'The persistent database, accessed through Mongoose.' },
        { name: 'BullMQ worker', description: 'A separate process that takes analytics jobs from the queue and stores the results, away from the request path.' },
      ],
    },
  },
  {
    slug: 'autocrypt',
    title: 'AutoCrypt',
    subtitle: 'Bitcoin Blockchain Forensics Tool',
    categories: ['Blockchain', 'Data visualization', 'Frontend'],
    description:
      'A Bitcoin blockchain forensics tool for tracing the flow of funds. Enter any Bitcoin address or transaction ID and AutoCrypt fetches the on-chain data live, then draws it as an interactive force-directed graph so you can follow money as it moves between wallets.',
    highlight:
      'What makes it stand out: click-to-trace. Every node in the graph is a new starting point, so you can follow funds down the chain one hop at a time. It runs entirely in the browser on live data, with no backend.',
    technologies: [
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'D3.js',
      'TanStack Query',
      'React Router',
      'React Hook Form',
      'Zod',
    ],
    links: {
      // repo: 'https://github.com/...',
      // demo: 'https://...',  (add once deployed)
    },
    features: [
      { name: 'Address and transaction lookup', plain: 'Search by a Bitcoin address or a raw 64-character transaction hash.' },
      { name: 'Interactive transaction graph', plain: 'A D3-powered force-directed graph showing inputs, outputs and value flow between addresses.' },
      { name: 'Click-to-trace', plain: 'Click any node to jump to that address and keep tracing the fund flow.' },
      { name: 'Transaction details panel', plain: 'A readable breakdown of inputs, outputs and BTC values for the selected address or transaction.' },
      { name: 'Live blockchain data', plain: 'Pulled directly from the public blockchain.info API, so no backend is required.' },
    ],
    steps: [
      'You enter a Bitcoin address or transaction hash.',
      'The input is validated and classified as an address or a transaction.',
      'AutoCrypt fetches the raw data from the blockchain.info API.',
      'The response is parsed into inputs and outputs, then converted into graph nodes and links.',
      'D3.js renders an interactive force-directed layout.',
      'Clicking a node re-runs the trace from that address.',
    ],
    notes:
      'AutoCrypt relies on the free public blockchain.info API, which is rate-limited. If lookups fail, wait a moment and retry.',
  },
];

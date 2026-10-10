// Prefix search with a Trie.
//
// Each node stands for one character. Inserting a word walks/creates one node
// per character. Searching a prefix walks down the same path (cost proportional
// to the prefix length), then collects the words stored below that node.
// Children are visited in alphabetical order, so results are deterministic.

class TrieNode {
  constructor() {
    this.children = new Map();
    this.word = null; // original word when a word ends here
  }
}

export class Trie {
  constructor(words = []) {
    this.root = new TrieNode();
    this.size = 0;
    words.forEach((w) => this.insert(w));
  }

  insert(word) {
    const clean = String(word ?? '').trim();
    if (!clean) return;
    let node = this.root;
    for (const ch of clean.toLowerCase()) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    if (node.word === null) this.size += 1;
    node.word = clean;
  }

  suggest(prefix, limit = 8) {
    const clean = String(prefix ?? '').trim().toLowerCase();
    if (!clean) return [];
    let node = this.root;
    for (const ch of clean) {
      node = node.children.get(ch);
      if (!node) return [];
    }
    const results = [];
    const walk = (n) => {
      if (results.length >= limit) return;
      if (n.word !== null) results.push(n.word);
      const keys = [...n.children.keys()].sort();
      for (const key of keys) {
        if (results.length >= limit) return;
        walk(n.children.get(key));
      }
    };
    walk(node);
    return results;
  }
}

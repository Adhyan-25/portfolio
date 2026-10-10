import { profile } from '../data/profile.js';

// One central resolver for every resume link in the app.
// Precedence: 1) external URL, 2) local /resume.pdf, 3) unavailable.

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

export function toAbsoluteUrl(path) {
  const p = clean(path);
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  if (typeof document === 'undefined') return p;
  // Resolve against the page's base so it works on GitHub Pages sub-paths.
  return new URL(p.replace(/^\/+/, ''), document.baseURI).href;
}

export function getExternalResumeUrl() {
  const url = clean(profile.resume.external);
  return /^https?:\/\//i.test(url) ? url : '';
}

let localCheck = null;

// A static host returns 404 for a missing PDF, and the Vite dev server returns
// the HTML page instead, so we require a PDF-like content type.
export function checkLocalResume() {
  if (localCheck) return localCheck;
  const url = toAbsoluteUrl(profile.resume.local);
  if (!url || typeof fetch === 'undefined') {
    localCheck = Promise.resolve('');
    return localCheck;
  }
  localCheck = fetch(url, { method: 'HEAD' })
    .then((res) => {
      const type = (res.headers.get('content-type') || '').toLowerCase();
      return res.ok && (type.includes('pdf') || type.includes('octet-stream')) ? url : '';
    })
    .catch(() => '');
  return localCheck;
}

export function initialResumeState() {
  const external = getExternalResumeUrl();
  return external
    ? { status: 'ready', url: external, source: 'external' }
    : { status: 'checking', url: '', source: null };
}

export async function resolveResume() {
  const external = getExternalResumeUrl();
  if (external) return { status: 'ready', url: external, source: 'external' };
  const local = await checkLocalResume();
  return local
    ? { status: 'ready', url: local, source: 'local' }
    : { status: 'missing', url: '', source: null };
}

export function resumeUnavailableMessage() {
  return `The resume isn't available online yet. Email ${profile.contact.email.value} and I'll send it.`;
}

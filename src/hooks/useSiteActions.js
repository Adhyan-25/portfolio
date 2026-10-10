import { useCallback } from 'react';
import { themes } from '../data/themes.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { resumeUnavailableMessage } from '../utils/resume.js';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The one place that performs "do something on the page" actions. The terminal
// buttons, the command palette and the footer all send their actions here.
//
// Action shapes:
//   { type: 'goto', id }                  scroll to a section
//   { type: 'open-project', slug }        select a project and scroll to it
//   { type: 'set-theme', id, quiet? }     change the colour theme
//   { type: 'copy', value, what }         copy text
//   { type: 'link', href, external }      open a link
//   { type: 'resume' }                    open the resume (or explain it is missing)
//   { type: 'focus-terminal' }            jump to the terminal input
export function useSiteActions({ resume, setTheme, notify, setSelectedSlug }) {
  const goTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, []);

  return useCallback(
    async (action) => {
      switch (action?.type) {
        case 'goto':
          goTo(action.id);
          break;
        case 'open-project':
          setSelectedSlug(action.slug);
          requestAnimationFrame(() => goTo('projects')); // wait a frame so the project has rendered
          break;
        case 'set-theme':
          if (setTheme(action.id) && !action.quiet) {
            notify(`Theme: ${themes.find((t) => t.id === action.id)?.label ?? action.id}`);
          }
          break;
        case 'copy': {
          const ok = await copyToClipboard(action.value);
          notify(ok ? `Copied ${action.what}` : `Could not copy ${action.what}`);
          break;
        }
        case 'link':
          if (action.external) window.open(action.href, '_blank', 'noopener,noreferrer');
          else window.location.href = action.href;
          break;
        case 'resume':
          if (resume.status === 'ready' && resume.url) window.open(resume.url, '_blank', 'noopener,noreferrer');
          else notify(resume.status === 'checking' ? 'Still checking for the resume. Try again in a moment.' : resumeUnavailableMessage());
          break;
        case 'focus-terminal':
          goTo('top');
          document.getElementById('terminal-input')?.focus({ preventScroll: true });
          break;
        default:
          break;
      }
    },
    [goTo, resume, setTheme, notify, setSelectedSlug],
  );
}

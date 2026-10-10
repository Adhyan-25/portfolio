import { sections } from '../../data/sections.js';

// Section wrapper with an editorial layout: on wide screens the heading sits in
// a sticky left column and the content in the right one; on phones they stack.
//   tone="alt"  draws the section on a slightly lighter band for visual rhythm.
// The small `$ command` line under the title comes from data/sections.js.
export default function Section({ id, title, tone, children }) {
  const prompt = sections.find((s) => s.id === id)?.prompt;
  return (
    <section id={id} className={`section${tone === 'alt' ? ' section--alt' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="container section__layout">
        <header className="section__head">
          <h2 id={`${id}-title`} className="section__title">
            {title}
          </h2>
          {prompt && (
            <p className="section__prompt" aria-hidden="true">
              <span className="section__sigil">$</span> {prompt}
            </p>
          )}
        </header>
        <div className="section__body">{children}</div>
      </div>
    </section>
  );
}

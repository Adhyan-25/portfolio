import { profile } from '../../data/profile.js';
import Section from './Section.jsx';

// A real sequence, so it is drawn as a timeline (newest first, as in data/profile.js).
export default function Education() {
  return (
    <Section id="education" title="Education" tone="alt">
      <ol className="timeline">
        {profile.education.map((e) => (
          <li key={`${e.degree}-${e.institution}`} className="timeline__item">
            <h3 className="timeline__title">{e.degree}</h3>
            <p>{e.institution}</p>
            {e.university && <p className="dim">{e.university}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}

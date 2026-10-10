import { skillGroups } from '../../data/skills.js';
import Section from './Section.jsx';

// Laid out like a table of contents: group name on the left, items on the right.
export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <p className="prose prose--note">
        Technologies I work with and topics I study. The projects show the depth.
      </p>
      <dl className="toc">
        {skillGroups.map((group) => (
          <div key={group.id} className="toc__row">
            <dt>{group.label}</dt>
            <dd>
              <ul className="toc__items">
                {group.items.map((item) => (
                  <li key={item.name} className="toc__item">
                    {item.name}
                    {item.note && <span className="toc__note"> ({item.note})</span>}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

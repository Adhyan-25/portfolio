import { profile } from '../../data/profile.js';
import Avatar from '../ui/Avatar.jsx';
import Interests from './Interests.jsx';
import Section from './Section.jsx';

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="about">
        <Avatar />
        <div className="prose">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <h3 className="subhead">Focus areas</h3>
      <ul className="tags">
        {profile.focusAreas.map((f) => (
          <li key={f} className="tag">
            {f}
          </li>
        ))}
      </ul>

      <Interests />
    </Section>
  );
}

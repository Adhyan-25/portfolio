import { useEffect, useMemo, useState } from 'react';
import { config } from '../../config.js';
import { projects } from '../../data/projects.js';
import Section from '../sections/Section.jsx';
import ProjectDetail from './ProjectDetail.jsx';

export default function ProjectExplorer({ selectedSlug, onSelect }) {
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(projects.flatMap((p) => p.categories || []))],
    [],
  );
  const visible = projects.filter((p) => category === 'All' || (p.categories || []).includes(category));
  const current = visible.find((p) => p.slug === selectedSlug) || visible[0];

  // When the terminal opens a project, make sure a filter isn't hiding it.
  useEffect(() => {
    if (selectedSlug) setCategory('All');
  }, [selectedSlug]);

  if (!projects.length) {
    return (
      <Section id="projects" title="Projects" tone="alt">
        <p className="dim">Projects will appear here once they are added to src/data/projects.js.</p>
      </Section>
    );
  }

  return (
    <Section id="projects" title="Projects" tone="alt">
      {projects.length >= config.projects.filterMinCount && (
        <div className="filters" role="group" aria-label="Filter projects by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="explorer">
        {visible.length > 1 && (
          <ul className="explorer__list" aria-label="Projects">
            {visible.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  className="explorer__item"
                  aria-current={current?.slug === p.slug ? 'true' : undefined}
                  onClick={() => onSelect(p.slug)}
                >
                  <strong>{p.title}</strong>
                  <span className="dim">{p.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="explorer__detail">
          {current ? (
            <ProjectDetail key={current.slug} project={current} />
          ) : (
            <p className="dim">No projects in this category yet.</p>
          )}
        </div>
      </div>
    </Section>
  );
}

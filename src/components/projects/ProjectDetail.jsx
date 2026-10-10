import { ExternalLink } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram.jsx';
import AutocompleteDemo from './AutocompleteDemo.jsx';

const STATUS_LABEL = { implemented: 'Implemented', planned: 'Planned' };

function Feature({ feature, open }) {
  const badge = STATUS_LABEL[feature.status] && (
    <span className="badge badge--small">{STATUS_LABEL[feature.status]}</span>
  );

  // Short features (name + one line) are shown flat; detailed ones expand.
  if (!feature.how && !feature.why) {
    return (
      <div className="feature feature--simple">
        <strong>
          {feature.name}
          {badge}
        </strong>
        <p className="dim">{feature.plain}</p>
      </div>
    );
  }

  return (
    <details className="feature" open={open}>
      <summary>
        <span>{feature.name}</span>
        {badge}
      </summary>
      <dl className="feature__body">
        {feature.plain && (
          <div>
            <dt>In plain English</dt>
            <dd>{feature.plain}</dd>
          </div>
        )}
        {feature.how && (
          <div>
            <dt>How it works</dt>
            <dd>{feature.how}</dd>
          </div>
        )}
        {feature.why && (
          <div>
            <dt>Why this, and the trade-offs</dt>
            <dd>{feature.why}</dd>
          </div>
        )}
      </dl>
    </details>
  );
}

export default function ProjectDetail({ project }) {
  const links = Object.entries(project.links || {}).filter(([, url]) => Boolean(url));
  return (
    <article className="project" aria-labelledby={`project-${project.slug}`}>
      <header className="project__head">
        <h3 id={`project-${project.slug}`} className="project__title">
          {project.title}
          {project.subtitle && <span className="project__subtitle"> {project.subtitle}</span>}
        </h3>
        {project.status && <span className="badge">{project.status}</span>}
      </header>

      <p className="prose">{project.description}</p>
      {project.highlight && <p className="project__highlight">{project.highlight}</p>}
      {project.disclaimer && <p className="project__disclaimer">{project.disclaimer}</p>}

      <h4 className="subhead">Technologies</h4>
      <ul className="tags">
        {project.technologies.map((t) => (
          <li key={t} className="tag">
            {t}
          </li>
        ))}
      </ul>

      {links.length > 0 && (
        <ul className="project__links">
          {links.map(([key, url]) => (
            <li key={key}>
              <a className="btn btn--small" href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} aria-hidden="true" />
                <span>{key === 'repo' ? 'Source code' : key === 'demo' ? 'Live demo' : key}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {project.features?.length > 0 && (
        <>
          <h4 className="subhead">Features</h4>
          <div className="features">
            {project.features.map((f, i) => (
              <Feature key={f.name} feature={f} open={i === 0} />
            ))}
          </div>
        </>
      )}

      {project.steps?.length > 0 && (
        <>
          <h4 className="subhead">How it works</h4>
          <ol className="steps">
            {project.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      )}

      {project.notes && <p className="project__notes">{project.notes}</p>}

      {project.architecture && <ArchitectureDiagram architecture={project.architecture} />}
      {project.demo === 'autocomplete' && <AutocompleteDemo />}
    </article>
  );
}

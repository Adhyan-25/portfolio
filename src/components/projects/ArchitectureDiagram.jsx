import { useId } from 'react';

// Responsive layered diagram. Layers stack top to bottom at every width and
// nodes wrap inside a layer, so it stays readable at 375px.
export default function ArchitectureDiagram({ architecture }) {
  const id = useId();
  const { title, summary, note, layers, components } = architecture;
  return (
    <figure className="arch" aria-labelledby={`${id}-cap`}>
      <figcaption id={`${id}-cap`}>
        <h4 className="arch__title">{title}</h4>
        <p className="dim">{summary}</p>
      </figcaption>

      <ol className="arch__flow">
        {layers.map((layer) => (
          <li key={layer.id} className={`arch__layer${layer.async ? ' arch__layer--async' : ''}`}>
            {layer.via && (
              <p className="arch__via">
                <span aria-hidden="true">↓ </span>
                {layer.via}
              </p>
            )}
            <div className="arch__nodes">
              {layer.nodes.map((n) => (
                <div className="arch__node" key={n.name}>
                  <strong>{n.name}</strong>
                  <span>{n.role}</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <p className="arch__legend dim">Solid outline: request path. Dashed outline: background path.</p>
      {note && <p className="arch__note">{note}</p>}

      <h5 className="arch__sub">What each part does</h5>
      <dl className="arch__components">
        {components.map((c) => (
          <div key={c.name}>
            <dt>{c.name}</dt>
            <dd>{c.description}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

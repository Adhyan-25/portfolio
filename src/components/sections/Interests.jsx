import { useState } from 'react';
import { interests } from '../../data/interests.js';

// Interest chips behave like tabs: pick one to see its details. The first is
// open by default so the pattern is obvious. Interests without details are
// shown as plain labels.
export default function Interests() {
  const [openId, setOpenId] = useState(interests.find((i) => i.details?.length)?.id ?? null);
  const open = interests.find((i) => i.id === openId);

  return (
    <>
      <h3 className="subhead">Outside the terminal</h3>
      <ul className="tags">
        {interests.map((item) => {
          if (!item.details?.length) {
            return (
              <li key={item.id} className="tag">
                {item.name}
              </li>
            );
          }
          const selected = openId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                className="tag tag--button"
                aria-expanded={selected}
                aria-controls="interest-panel"
                onClick={() => setOpenId(selected ? null : item.id)}
              >
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>

      {open && (
        <div id="interest-panel" className="interest-panel" role="region" aria-label={`${open.name} details`}>
          <dl>
            {open.details.map((d) => (
              <div key={d.label}>
                <dt>{d.label}</dt>
                <dd>
                  {d.href ? (
                    <a href={d.href} target="_blank" rel="noopener noreferrer">
                      {d.value}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  );
}

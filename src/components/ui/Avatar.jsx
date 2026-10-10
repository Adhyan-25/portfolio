import { useState } from 'react';
import { profile } from '../../data/profile.js';
import { toAbsoluteUrl } from '../../utils/resume.js';

// Optional photo. The <img> stays hidden until it loads, so a missing file
// never shows a broken-image icon or an empty frame.
export default function Avatar() {
  const [state, setState] = useState('loading'); // loading | ok | missing
  if (state === 'missing') return null;
  return (
    <img
      className="avatar"
      src={toAbsoluteUrl(profile.photo)}
      alt={`Photo of ${profile.name}`}
      width="96"
      height="96"
      hidden={state !== 'ok'}
      onLoad={() => setState('ok')}
      onError={() => setState('missing')}
    />
  );
}

import { profile } from '../../data/profile.js';

export default function Prompt() {
  return (
    <span className="prompt">
      <span className="prompt__host">
        {profile.handle}@{profile.host}
      </span>
      <span className="prompt__path">:~$</span>
    </span>
  );
}

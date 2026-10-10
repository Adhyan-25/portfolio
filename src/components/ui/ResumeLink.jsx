import { FileText } from 'lucide-react';
import { resumeUnavailableMessage } from '../../utils/resume.js';

export default function ResumeLink({ resume, onNotify, className = 'btn', label = 'Resume' }) {
  if (resume.status === 'ready' && resume.url) {
    return (
      <a className={className} href={resume.url} target="_blank" rel="noopener noreferrer">
        <FileText size={16} aria-hidden="true" />
        <span>{label}</span>
      </a>
    );
  }
  const handleClick = () =>
    onNotify?.(
      resume.status === 'checking'
        ? 'Still checking for the resume. Try again in a moment.'
        : resumeUnavailableMessage(),
    );
  return (
    <button type="button" className={className} onClick={handleClick}>
      <FileText size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

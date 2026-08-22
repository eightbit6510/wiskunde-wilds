interface MechanicMascotProps {
  size?: number;
  className?: string;
  mood?: 'calm' | 'happy' | 'thinking';
}

/** Pitstop mechanic — forest pencil palette. */
export function MechanicMascot({
  size = 72,
  className = '',
  mood = 'calm',
}: MechanicMascotProps) {
  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 80 80" role="img">
        <title>Monteur mascotte</title>
        <ellipse cx="40" cy="72" rx="16" ry="3.5" fill="#3f4636" opacity="0.12" />
        <ellipse cx="40" cy="54" rx="18" ry="16" fill="#c77a4a" />
        <ellipse cx="40" cy="58" rx="11" ry="10" fill="#f7f2e6" />
        <ellipse cx="40" cy="34" rx="20" ry="18" fill="#e8c9a8" />
        <rect x="24" y="18" width="32" height="10" rx="3" fill="#3f4636" />
        <circle cx="33" cy="36" r="3.2" fill="#3f4636" />
        <circle cx="47" cy="36" r="3.2" fill="#3f4636" />
        <path d="M36 44 Q40 47 44 44" stroke="#3f4636" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path
          d="M58 48 L68 38 L72 42 L62 52 Z"
          fill="#9aaa7a"
          stroke="#3f4636"
          strokeWidth="1"
        />
        {mood === 'happy' && <circle cx="14" cy="16" r="1.6" fill="#e6c86e" />}
      </svg>
    </div>
  );
}

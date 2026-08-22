interface DetectiveMascotProps {
  size?: number;
  className?: string;
  mood?: 'calm' | 'happy' | 'thinking';
}

/** Rounded detective companion — pencil palette (no purple). */
export function DetectiveMascot({
  size = 72,
  className = '',
  mood = 'calm',
}: DetectiveMascotProps) {
  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 80 80" role="img">
        <title>Detective mascotte</title>
        <ellipse cx="40" cy="72" rx="16" ry="3.5" fill="#3f4636" opacity="0.12" />
        <ellipse cx="40" cy="54" rx="18" ry="16" fill="#6f7d55" />
        <ellipse cx="40" cy="58" rx="11" ry="10" fill="#f7f2e6" />
        <ellipse cx="40" cy="34" rx="20" ry="18" fill="#e8c9a8" />
        <path d="M18 28 C20 12, 34 8, 40 14 C46 8, 60 12, 62 28 Z" fill="#3f4636" />
        <ellipse cx="40" cy="30" rx="14" ry="5" fill="#2a3024" opacity="0.9" />
        <circle cx="33" cy="36" r="3.2" fill="#3f4636" />
        <circle cx="47" cy="36" r="3.2" fill="#3f4636" />
        <circle cx="34" cy="35" r="1" fill="#f7f2e6" />
        <circle cx="48" cy="35" r="1" fill="#f7f2e6" />
        <path d="M36 44 Q40 47 44 44" stroke="#3f4636" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <rect x="52" y="46" width="14" height="8" rx="4" fill="#c77a4a" transform="rotate(25 59 50)" />
        <circle cx="63" cy="49" r="5" fill="#f7f2e6" stroke="#6f7d55" strokeWidth="1.5" />
        {mood === 'thinking' && (
          <text x="10" y="18" fontSize="13" fill="#6f7d55" fontFamily="Caveat, cursive">
            ?
          </text>
        )}
        {mood === 'happy' && (
          <>
            <circle cx="14" cy="16" r="1.6" fill="#c77a4a" />
            <circle cx="66" cy="18" r="1.3" fill="#9aaa7a" />
          </>
        )}
      </svg>
    </div>
  );
}

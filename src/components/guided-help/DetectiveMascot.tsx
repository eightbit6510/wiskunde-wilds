interface DetectiveMascotProps {
  size?: number;
  className?: string;
  mood?: 'calm' | 'happy' | 'thinking';
}

/** Rounded detective companion for Deel II guided help. */
export function DetectiveMascot({
  size = 72,
  className = '',
  mood = 'calm',
}: DetectiveMascotProps) {
  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 80 80" role="img">
        <title>Detective mascotte</title>
        <ellipse cx="40" cy="72" rx="16" ry="3.5" fill="#1E2A3A" opacity="0.12" />
        <ellipse cx="40" cy="54" rx="18" ry="16" fill="#4A5568" />
        <ellipse cx="40" cy="58" rx="11" ry="10" fill="#E8EDF2" />
        <ellipse cx="40" cy="34" rx="20" ry="18" fill="#F6D7B0" />
        <path d="M18 28 C20 12, 34 8, 40 14 C46 8, 60 12, 62 28 Z" fill="#2D3748" />
        <ellipse cx="40" cy="30" rx="14" ry="5" fill="#1A202C" opacity="0.85" />
        <circle cx="33" cy="36" r="3.2" fill="#1A202C" />
        <circle cx="47" cy="36" r="3.2" fill="#1A202C" />
        <circle cx="34" cy="35" r="1" fill="#FFFCF0" />
        <circle cx="48" cy="35" r="1" fill="#FFFCF0" />
        <path d="M36 44 Q40 47 44 44" stroke="#1A202C" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <rect x="52" y="46" width="14" height="8" rx="4" fill="#C4A574" transform="rotate(25 59 50)" />
        <circle cx="63" cy="49" r="5" fill="#E8EDF2" stroke="#718096" strokeWidth="1.5" />
        {mood === 'thinking' && (
          <text x="10" y="18" fontSize="13" fill="#4A5568" fontFamily="Nunito, sans-serif">
            ?
          </text>
        )}
        {mood === 'happy' && (
          <>
            <circle cx="14" cy="16" r="1.6" fill="#E6C86E" />
            <circle cx="66" cy="18" r="1.3" fill="#A0AEC0" />
          </>
        )}
      </svg>
    </div>
  );
}

export type MascotMood = 'normal' | 'happy' | 'thinking' | 'celebrating';

interface ForestMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

export function ForestMascot({ mood = 'normal', size = 140, className = '' }: ForestMascotProps) {
  const mouth =
    mood === 'happy' || mood === 'celebrating'
      ? 'M28 40c4 5 12 5 16 0'
      : mood === 'thinking'
        ? 'M30 42h12'
        : 'M30 41c3 3 9 3 12 0';

  const eyeY = mood === 'thinking' ? 29 : 28;
  const sparkle = mood === 'celebrating';

  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 80 80" role="img">
        <title>Bosvos mascotte</title>
        {sparkle && (
          <>
            <circle cx="12" cy="14" r="2" fill="#E6C86E" className="pulse-star" />
            <circle cx="68" cy="18" r="2.5" fill="#B8A4D4" />
            <circle cx="70" cy="40" r="1.8" fill="#E6C86E" />
          </>
        )}
        {/* ears */}
        <path d="M22 28 L16 8 L30 20 Z" fill="#C4784A" />
        <path d="M58 28 L64 8 L50 20 Z" fill="#C4784A" />
        <path d="M22 26 L19 12 L28 20 Z" fill="#E8B896" />
        <path d="M58 26 L61 12 L52 20 Z" fill="#E8B896" />
        {/* head */}
        <ellipse cx="40" cy="42" rx="24" ry="22" fill="#C4784A" />
        <ellipse cx="40" cy="48" rx="14" ry="12" fill="#F3EEE4" />
        {/* eyes */}
        <circle cx="31" cy={eyeY} r="3.2" fill="#1E3328" />
        <circle cx="49" cy={eyeY} r="3.2" fill="#1E3328" />
        <circle cx="32" cy={eyeY - 1} r="1" fill="#F3EEE4" />
        <circle cx="50" cy={eyeY - 1} r="1" fill="#F3EEE4" />
        {/* nose */}
        <ellipse cx="40" cy="36" rx="3.5" ry="2.5" fill="#1E3328" />
        {/* mouth */}
        <path d={mouth} stroke="#1E3328" strokeWidth="2" fill="none" strokeLinecap="round" />
        {mood === 'thinking' && (
          <text x="58" y="22" fontSize="12" fill="#6B5B8A">
            ?
          </text>
        )}
      </svg>
    </div>
  );
}

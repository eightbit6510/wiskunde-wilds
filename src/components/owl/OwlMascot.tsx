interface OwlMascotProps {
  size?: number;
  className?: string;
  mood?: 'calm' | 'happy' | 'thinking';
}

/** Soft, rounded owl companion — same cozy SVG vibe as ForestMascot. */
export function OwlMascot({ size = 72, className = '', mood = 'calm' }: OwlMascotProps) {
  const eyeY = mood === 'thinking' ? 36 : 35;
  const pupilR = mood === 'thinking' ? 3.2 : 3.6;
  const blink = mood === 'thinking';

  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 80 80" role="img">
        <title>Uil mascotte</title>

        {/* soft ground shadow */}
        <ellipse cx="40" cy="72" rx="16" ry="3.5" fill="#2F4A3A" opacity="0.12" />

        {/* body */}
        <ellipse cx="40" cy="52" rx="20" ry="18" fill="#7A6B9A" />
        {/* belly */}
        <ellipse cx="40" cy="56" rx="12" ry="11" fill="#F3EEE4" />
        {/* belly speckles */}
        <circle cx="36" cy="54" r="1.1" fill="#E4DCF0" />
        <circle cx="44" cy="57" r="1.1" fill="#E4DCF0" />
        <circle cx="39" cy="60" r="0.9" fill="#E4DCF0" />

        {/* wings */}
        <ellipse cx="22" cy="52" rx="7" ry="11" fill="#6B5B8A" transform="rotate(-12 22 52)" />
        <ellipse cx="58" cy="52" rx="7" ry="11" fill="#6B5B8A" transform="rotate(12 58 52)" />

        {/* head */}
        <ellipse cx="40" cy="34" rx="22" ry="20" fill="#8B7AAD" />

        {/* ear tufts */}
        <path d="M22 22 C18 10, 28 14, 30 22 Z" fill="#7A6B9A" />
        <path d="M58 22 C62 10, 52 14, 50 22 Z" fill="#7A6B9A" />
        <path d="M24 20 C22 14, 28 15, 29 20 Z" fill="#C9B8E0" />
        <path d="M56 20 C58 14, 52 15, 51 20 Z" fill="#C9B8E0" />

        {/* face disc */}
        <ellipse cx="40" cy="36" rx="16" ry="14" fill="#F6F1EA" />

        {/* blush */}
        <ellipse cx="27" cy="42" rx="3.2" ry="2" fill="#E8B896" opacity="0.55" />
        <ellipse cx="53" cy="42" rx="3.2" ry="2" fill="#E8B896" opacity="0.55" />

        {/* eye rings */}
        <circle cx="31" cy={eyeY} r="7.5" fill="#E4DCF0" />
        <circle cx="49" cy={eyeY} r="7.5" fill="#E4DCF0" />

        {/* eyes */}
        {blink ? (
          <>
            <path
              d="M25 35 Q31 38 37 35"
              stroke="#1E3328"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M43 35 Q49 38 55 35"
              stroke="#1E3328"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="31" cy={eyeY} r={pupilR} fill="#1E3328" />
            <circle cx="49" cy={eyeY} r={pupilR} fill="#1E3328" />
            <circle cx="32.4" cy={eyeY - 1.4} r="1.35" fill="#FFFCF0" />
            <circle cx="50.4" cy={eyeY - 1.4} r="1.35" fill="#FFFCF0" />
            <circle cx="29.8" cy={eyeY + 1.2} r="0.7" fill="#FFFCF0" opacity="0.7" />
            <circle cx="47.8" cy={eyeY + 1.2} r="0.7" fill="#FFFCF0" opacity="0.7" />
          </>
        )}

        {/* beak */}
        <path d="M40 38 L44.5 44 L35.5 44 Z" fill="#E0A05A" />
        <path d="M40 39.2 L42.6 43 L37.4 43 Z" fill="#C4784A" opacity="0.35" />

        {/* happy smile */}
        {mood === 'happy' && (
          <path
            d="M34 48c3 3.5 9 3.5 12 0"
            stroke="#1E3328"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* feet */}
        <path
          d="M33 68 Q36 71 39 68"
          stroke="#C4784A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M41 68 Q44 71 47 68"
          stroke="#C4784A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {mood === 'thinking' && (
          <text x="62" y="18" fontSize="13" fill="#6B5B8A" fontFamily="Nunito, sans-serif">
            ?
          </text>
        )}

        {mood === 'happy' && (
          <>
            <circle cx="14" cy="16" r="1.8" fill="#E6C86E" />
            <circle cx="66" cy="20" r="1.4" fill="#B8A4D4" />
          </>
        )}
      </svg>
    </div>
  );
}

interface SketchIconProps {
  name: 'explore' | 'measure' | 'tracks' | 'star' | 'leaf';
  size?: number;
  className?: string;
}

/** Minimal pencil-style accent icons for empty states / nav flourishes. */
export function SketchIcon({ name, size = 28, className = '' }: SketchIconProps) {
  const stroke = '#3f4636';
  const fillFox = '#c77a4a';
  const fillSage = '#9aaa7a';
  const fillCream = '#f7f2e6';

  return (
    <svg
      className={`sketch-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {name === 'explore' && (
        <>
          <circle cx="20" cy="20" r="11" stroke={stroke} strokeWidth="1.8" fill={fillCream} />
          <path d="M28 28 L38 40" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M16 16c2-1 5-1 7 1" stroke={fillSage} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="26" cy="14" r="2.2" fill={fillFox} opacity="0.85" />
          <circle cx="30" cy="18" r="1.6" fill={fillFox} opacity="0.7" />
        </>
      )}
      {name === 'measure' && (
        <>
          <path d="M10 36 L10 12 L34 36 Z" stroke={stroke} strokeWidth="1.8" fill={fillCream} />
          <path d="M10 20h5M10 26h7M10 32h9" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
          <rect x="22" y="8" width="16" height="6" rx="1" stroke={stroke} strokeWidth="1.6" fill={fillCream} transform="rotate(18 30 11)" />
          <path d="M38 22c-2 4-6 5-8 3" stroke={fillSage} strokeWidth="1.5" fill="none" />
        </>
      )}
      {name === 'tracks' && (
        <>
          <ellipse cx="14" cy="30" rx="6" ry="7" fill={fillFox} stroke={stroke} strokeWidth="1.4" />
          <circle cx="9" cy="20" r="2.2" fill={fillFox} stroke={stroke} strokeWidth="1.1" />
          <circle cx="14" cy="17" r="2.3" fill={fillFox} stroke={stroke} strokeWidth="1.1" />
          <circle cx="19" cy="20" r="2.2" fill={fillFox} stroke={stroke} strokeWidth="1.1" />
          <path d="M24 28c4-2 8-1 12 2c3 2 6 2 9 0" stroke={stroke} strokeWidth="1.6" strokeDasharray="3 3" strokeLinecap="round" />
          <path d="M34 18c2 3 1 5-1 6" stroke={fillSage} strokeWidth="1.4" fill="none" />
        </>
      )}
      {name === 'star' && (
        <path
          d="M24 6l4.2 10.5H39l-8.4 6.4 3.2 10.6L24 27.8 14.2 33.5l3.2-10.6L9 16.5h10.8Z"
          fill={fillFox}
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      )}
      {name === 'leaf' && (
        <path
          d="M12 34c8-18 22-24 28-26-2 12-8 24-22 28-2-4-4-4-6-2Z"
          fill={fillSage}
          stroke={stroke}
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}

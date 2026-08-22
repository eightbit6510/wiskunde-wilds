import type { BadgeDefinition } from '../types';

interface Props {
  badge: BadgeDefinition | null;
  open: boolean;
  queueRemaining: number;
  animationsEnabled: boolean;
  onContinue: () => void;
}

export function BadgeUnlockModal({
  badge,
  open,
  queueRemaining,
  animationsEnabled,
  onContinue,
}: Props) {
  if (!open || !badge) return null;

  const festive = animationsEnabled;

  return (
    <div
      className="completion-modal badge-unlock-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-unlock-title"
    >
      <div className={`completion-card badge-unlock-card${festive ? ' badge-unlock-enter' : ''}`}>
        {festive && (
          <div className="badge-party" aria-hidden="true">
            <div className="badge-garland">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="badge-balloon b1">🎈</span>
            <span className="badge-balloon b2">🎈</span>
            <span className="badge-balloon b3">🎈</span>
            <span className="badge-confetti c1">✨</span>
            <span className="badge-confetti c2">🎉</span>
            <span className="badge-confetti c3">⭐</span>
            <span className="badge-confetti c4">✨</span>
            <span className="badge-confetti c5">🎊</span>
          </div>
        )}

        <p className="chip badge-unlock-chip">Nieuwe badge!</p>

        <div className={`badge-unlock-medal${festive ? ' badge-medal-pop' : ''}`} aria-hidden="true">
          <div className="badge-unlock-ring">
            <span className="badge-unlock-emoji">{badge.emoji}</span>
          </div>
        </div>

        <h2 id="badge-unlock-title">Gefeliciteerd!</h2>
        <p className="badge-unlock-lead">
          Je hebt de badge <strong>{badge.name}</strong> behaald.
        </p>
        <p className="muted">{badge.description}</p>

        {queueRemaining > 0 && (
          <p className="chip" style={{ marginTop: '0.85rem' }}>
            Nog {queueRemaining} badge{queueRemaining === 1 ? '' : 's'} te ontdekken
          </p>
        )}

        <div className="badge-unlock-actions">
          <button type="button" className="btn btn-large" onClick={onContinue}>
            {queueRemaining > 0 ? 'Volgende badge' : 'Feestelijk verder'}
          </button>
        </div>
      </div>
    </div>
  );
}

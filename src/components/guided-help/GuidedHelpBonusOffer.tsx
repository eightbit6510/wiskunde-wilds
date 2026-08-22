import type { HelpPersona } from '../../types/content';

interface GuidedHelpBonusOfferProps {
  persona: HelpPersona;
  open: boolean;
  xpEarned: number;
  onAccept: () => void;
  onDecline: () => void;
}

export function GuidedHelpBonusOffer({
  persona,
  open,
  xpEarned,
  onAccept,
  onDecline,
}: GuidedHelpBonusOfferProps) {
  if (!open) return null;

  return (
    <div
      className={`completion-modal guided-help-modal-backdrop ${persona.themeClass ?? ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guided-help-bonus-title"
    >
      <div className="completion-card">
        <h2 id="guided-help-bonus-title">{persona.bonusFoundTitle}</h2>
        <p>
          Je kreeg <strong>+{xpEarned} XP</strong>
        </p>
        <p className="muted">{persona.bonusWithHelpNote}</p>

        <hr className="guided-help-divider" />

        <h3 style={{ marginBottom: '0.35rem' }}>{persona.bonusSelfTryTitle}</h3>
        <p>{persona.bonusSelfTryBody}</p>
        <p className="chip">Als het lukt krijg je bonus XP.</p>

        <div className="guided-help-modal-actions">
          <button type="button" className="btn" onClick={onAccept}>
            {persona.bonusAcceptLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onDecline}>
            {persona.bonusDeclineLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import type { HelpPersona } from '../../types/content';
import { OWL_HELP_STAR_COST } from '../../utils/owlEconomy';
import { HelpMascot } from './HelpMascot';

interface GuidedHelpConfirmModalProps {
  persona: HelpPersona;
  open: boolean;
  totalStars: number;
  animationsEnabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onTryHint?: () => void;
}

export function GuidedHelpConfirmModal({
  persona,
  open,
  totalStars,
  animationsEnabled,
  onConfirm,
  onCancel,
  onTryHint,
}: GuidedHelpConfirmModalProps) {
  if (!open) return null;

  const canAfford = totalStars >= OWL_HELP_STAR_COST;

  return (
    <div
      className={`completion-modal guided-help-modal-backdrop ${persona.themeClass ?? ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guided-help-confirm-title"
    >
      <div
        className={`completion-card guided-help-confirm-card${animationsEnabled ? ' guided-help-enter' : ''}`}
      >
        <HelpMascot
          persona={persona}
          size={64}
          mood="calm"
          className={animationsEnabled ? 'float' : ''}
        />

        {!canAfford ? (
          <>
            <h2 id="guided-help-confirm-title">{persona.confirmTitleNoStars}</h2>
            <p>{persona.confirmBodyNoStars}</p>
            <p className="chip">Je hebt: ⭐ {totalStars}</p>
            <div className="guided-help-modal-actions">
              {onTryHint && (
                <button type="button" className="btn" onClick={onTryHint}>
                  {persona.tryHintLabel}
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                {persona.backToQuestionLabel}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="guided-help-confirm-title">{persona.confirmAffordTitle}</h2>
            <p>{persona.confirmAffordBody}</p>
            <p className="guided-help-cost-note">
              Hulp kost {OWL_HELP_STAR_COST} {persona.starCostLabel}.
            </p>
            <p className="muted">{persona.xpReducedNote}</p>
            <p className="chip">Je hebt: ⭐ {totalStars}</p>
            <p style={{ fontWeight: 700 }}>Weet je het zeker?</p>
            <div className="guided-help-modal-actions">
              <button type="button" className="btn" onClick={onConfirm}>
                {persona.confirmYesLabel}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                {persona.confirmNoLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

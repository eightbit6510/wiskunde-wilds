import { OWL_HELP_STAR_COST } from '../../utils/owlEconomy';
import { OwlMascot } from './OwlMascot';

interface OwlConfirmModalProps {
  open: boolean;
  totalStars: number;
  animationsEnabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onTryHint?: () => void;
}

export function OwlConfirmModal({
  open,
  totalStars,
  animationsEnabled,
  onConfirm,
  onCancel,
  onTryHint,
}: OwlConfirmModalProps) {
  if (!open) return null;

  const canAfford = totalStars >= OWL_HELP_STAR_COST;

  return (
    <div className="completion-modal owl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="owl-confirm-title">
      <div className={`completion-card owl-confirm-card${animationsEnabled ? ' owl-enter' : ''}`}>
        {animationsEnabled && <OwlMascot size={64} mood="calm" className="float" />}
        {!animationsEnabled && <OwlMascot size={64} mood="calm" />}

        {!canAfford ? (
          <>
            <h2 id="owl-confirm-title">De Uil wil graag helpen</h2>
            <p>
              De Uil wil graag helpen, maar je hebt op dit moment geen sterren om hem op te
              roepen.
            </p>
            <p className="chip">Je hebt: ⭐ {totalStars}</p>
            <div className="owl-modal-actions">
              {onTryHint && (
                <button type="button" className="btn" onClick={onTryHint}>
                  Probeer een hint
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Ga terug naar de som
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="owl-confirm-title">De Uil om hulp vragen?</h2>
            <p>De Uil helpt je stap voor stap door deze som.</p>
            <p className="owl-cost-note">🦉 Hulp van de Uil kost {OWL_HELP_STAR_COST} ster.</p>
            <p className="muted">Sommen die je samen met de Uil oplost leveren minder XP op.</p>
            <p className="chip">Je hebt: ⭐ {totalStars}</p>
            <p style={{ fontWeight: 700 }}>Weet je het zeker?</p>
            <div className="owl-modal-actions">
              <button type="button" className="btn" onClick={onConfirm}>
                Ja, help mij 🦉
              </button>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Ik probeer het nog even zelf
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

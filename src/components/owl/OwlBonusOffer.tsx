interface OwlBonusOfferProps {
  open: boolean;
  xpEarned: number;
  onAccept: () => void;
  onDecline: () => void;
}

export function OwlBonusOffer({ open, xpEarned, onAccept, onDecline }: OwlBonusOfferProps) {
  if (!open) return null;

  return (
    <div className="completion-modal owl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="owl-bonus-title">
      <div className="completion-card">
        <h2 id="owl-bonus-title">🐾 Pootafdruk gevonden!</h2>
        <p>
          Je kreeg <strong>+{xpEarned} XP</strong>
        </p>
        <p className="muted">Met hulp van de Uil</p>

        <hr className="owl-divider" />

        <h3 style={{ marginBottom: '0.35rem' }}>Wil je het nu zelf proberen?</h3>
        <p>Je weet nu hoe deze soort som werkt.</p>
        <p>Wil je een vergelijkbare som helemaal zelf maken?</p>
        <p className="chip">Als het lukt krijg je bonus XP.</p>

        <div className="owl-modal-actions">
          <button type="button" className="btn" onClick={onAccept}>
            Ja, bonus challenge! 🐾
          </button>
          <button type="button" className="btn btn-secondary" onClick={onDecline}>
            Nee, verder met mijn avontuur
          </button>
        </div>
      </div>
    </div>
  );
}

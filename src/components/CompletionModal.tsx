interface CompletionModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  stars: number;
  challengesSolved: number;
  strongTopics: string[];
  trainTopics: string[];
  onClose: () => void;
  onContinue?: () => void;
}

export function CompletionModal({
  open,
  title,
  subtitle,
  stars,
  challengesSolved,
  strongTopics,
  trainTopics,
  onClose,
  onContinue,
}: CompletionModalProps) {
  if (!open) return null;

  return (
    <div className="completion-modal" role="dialog" aria-modal="true" aria-labelledby="completion-title">
      <div className="completion-card">
        <div style={{ fontSize: '2rem' }} aria-hidden="true">
          ⭐🦊🌙
        </div>
        <h2 id="completion-title">{title}</h2>
        <p className="muted">{subtitle}</p>
        <div className="stat-grid" style={{ margin: '1.1rem 0', textAlign: 'left' }}>
          <div className="stat-card">
            <div className="label">Sterren</div>
            <div className="value">{stars}</div>
          </div>
          <div className="stat-card">
            <div className="label">Challenges</div>
            <div className="value">{challengesSolved}</div>
          </div>
        </div>
        {strongTopics.length > 0 && (
          <p>
            <strong>Sterk spoor:</strong> {strongTopics.join(', ')}
          </p>
        )}
        {trainTopics.length > 0 && (
          <p>
            <strong>Hier kun je nog XP pakken:</strong> {trainTopics.join(', ')}
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', marginTop: '1.2rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn" onClick={onContinue ?? onClose}>
            Verder
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}

import type { MascotMood } from './ForestMascot';
import { ForestMascot } from './ForestMascot';

interface CompletionModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  stars: number;
  challengesSolved: number;
  strongTopics: string[];
  trainTopics: string[];
  /** Go home / leave lesson */
  onClose: () => void;
  /** Continue to next chapter when available */
  onContinue?: () => void;
  /** Label for continue — default Doorgaan */
  continueLabel?: string;
  /** Whether a next chapter exists */
  hasNextChapter?: boolean;
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
  continueLabel = 'Doorgaan',
  hasNextChapter = true,
}: CompletionModalProps) {
  if (!open) return null;

  return (
    <div className="completion-modal" role="dialog" aria-modal="true" aria-labelledby="completion-title">
      <div className="completion-card">
        <div className="completion-mascot" aria-hidden="true">
          <ForestMascot mood={'celebrating' satisfies MascotMood} size={96} className="float" />
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
          {hasNextChapter && onContinue && (
            <button type="button" className="btn" onClick={onContinue}>
              {continueLabel}
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Afsluiten
          </button>
        </div>
      </div>
    </div>
  );
}

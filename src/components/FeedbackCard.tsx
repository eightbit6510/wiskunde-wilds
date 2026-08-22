interface FeedbackCardProps {
  kind: 'success' | 'try-again';
  title: string;
  body?: string;
  starsEarned?: number;
}

export function FeedbackCard({ kind, title, body, starsEarned }: FeedbackCardProps) {
  return (
    <div className={`feedback-card ${kind}`} role="status" aria-live="polite">
      <strong>{title}</strong>
      {typeof starsEarned === 'number' && (
        <div className="star-pop" style={{ marginTop: '0.4rem' }}>
          +{starsEarned} ⭐
        </div>
      )}
      {body && <p style={{ margin: '0.65rem 0 0' }}>{body}</p>}
    </div>
  );
}

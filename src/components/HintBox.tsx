interface HintBoxProps {
  attempt: number;
  hint1: string;
  hint2: string;
  firstStep?: string;
  onRequestFirstStep: () => void;
  usedFirstStep: boolean;
}

export function HintBox({
  attempt,
  hint1,
  hint2,
  firstStep,
  onRequestFirstStep,
  usedFirstStep,
}: HintBoxProps) {
  if (attempt < 1) return null;

  return (
    <div className="hint-box" role="status">
      {attempt >= 1 && (
        <p style={{ margin: '0 0 0.5rem' }}>
          <strong>Hint:</strong> {hint1}
        </p>
      )}
      {attempt >= 2 && (
        <p style={{ margin: '0 0 0.5rem' }}>
          <strong>Duidelijkere hint:</strong> {hint2}
        </p>
      )}
      {attempt >= 3 && firstStep && !usedFirstStep && (
        <button type="button" className="btn btn-secondary" onClick={onRequestFirstStep}>
          Laat me de eerste stap zien
        </button>
      )}
      {usedFirstStep && firstStep && (
        <p style={{ margin: attempt >= 3 ? '0.75rem 0 0' : 0 }}>
          <strong>Eerste stap:</strong> {firstStep}
        </p>
      )}
    </div>
  );
}

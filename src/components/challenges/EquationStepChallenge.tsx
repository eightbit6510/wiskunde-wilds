import type { EquationStep } from '../../types';
import { formatMathText } from '../../utils/mathText';

interface Props {
  steps: EquationStep[];
  stepIndex: number;
  selected: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function EquationStepChallenge({
  steps,
  stepIndex,
  selected,
  onSelect,
  disabled,
}: Props) {
  const step = steps[stepIndex];
  if (!step) return null;

  return (
    <div>
      <p style={{ fontWeight: 700 }}>{formatMathText(step.prompt)}</p>
      {stepIndex > 0 && (
        <p className="chip" style={{ marginBottom: '0.75rem' }}>
          Nu: {formatMathText(steps[stepIndex - 1].resultDisplay)}
        </p>
      )}
      <div className="options-list">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`option-btn${selected === opt.id ? ' selected' : ''}`}
            disabled={disabled}
            onClick={() => onSelect(opt.id)}
          >
            {formatMathText(opt.label)}
          </button>
        ))}
      </div>
    </div>
  );
}

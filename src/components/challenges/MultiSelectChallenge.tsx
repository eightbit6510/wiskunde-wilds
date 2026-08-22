import type { AnswerOption } from '../../types';
import { formatMathText } from '../../utils/mathText';

interface Props {
  options: AnswerOption[];
  selected: string[];
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export function MultiSelectChallenge({ options, selected, onToggle, disabled }: Props) {
  return (
    <div className="options-list" role="group" aria-label="Kies alle juiste antwoorden">
      {options.map((opt) => {
        const isOn = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            className={`option-btn${isOn ? ' selected' : ''}`}
            aria-pressed={isOn}
            disabled={disabled}
            onClick={() => onToggle(opt.id)}
          >
            {formatMathText(opt.label)}
          </button>
        );
      })}
    </div>
  );
}

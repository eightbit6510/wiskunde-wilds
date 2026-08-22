import type { AnswerOption } from '../../types';

interface Props {
  options: AnswerOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
  revealCorrectId?: string | null;
}

export function MultipleChoiceChallenge({
  options,
  selected,
  onSelect,
  disabled,
  revealCorrectId,
}: Props) {
  return (
    <div className="options-list" role="listbox" aria-label="Antwoordopties">
      {options.map((opt) => {
        let cls = 'option-btn';
        if (selected === opt.id) cls += ' selected';
        if (revealCorrectId && opt.id === revealCorrectId) cls += ' correct';
        if (revealCorrectId && selected === opt.id && opt.id !== revealCorrectId) cls += ' wrong';
        return (
          <button
            key={opt.id}
            type="button"
            className={cls}
            role="option"
            aria-selected={selected === opt.id}
            disabled={disabled}
            onClick={() => onSelect(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

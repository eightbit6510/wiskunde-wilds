interface Props {
  value: boolean | null;
  onSelect: (v: boolean) => void;
  disabled?: boolean;
}

export function TrueFalseChallenge({ value, onSelect, disabled }: Props) {
  return (
    <div className="options-list" role="group" aria-label="Waar of niet waar">
      <button
        type="button"
        className={`option-btn${value === true ? ' selected' : ''}`}
        disabled={disabled}
        onClick={() => onSelect(true)}
      >
        Waar
      </button>
      <button
        type="button"
        className={`option-btn${value === false ? ' selected' : ''}`}
        disabled={disabled}
        onClick={() => onSelect(false)}
      >
        Niet waar
      </button>
    </div>
  );
}

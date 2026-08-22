interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  inputMode?: 'text' | 'decimal' | 'numeric';
}

export function NumberInputChallenge({
  value,
  onChange,
  onSubmit,
  disabled,
  label = 'Jouw antwoord',
  placeholder = 'Typ een getal',
  inputMode = 'decimal',
}: Props) {
  return (
    <form
      className="input-row"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="field">
        <label htmlFor="number-answer">{label}</label>
        <input
          id="number-answer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          disabled={disabled}
          autoComplete="off"
        />
      </div>
      <button type="submit" className="btn" disabled={disabled || !value.trim()}>
        Check
      </button>
    </form>
  );
}

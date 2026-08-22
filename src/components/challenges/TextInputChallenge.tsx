interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function TextInputChallenge({
  value,
  onChange,
  onSubmit,
  disabled,
  label = 'Jouw antwoord',
  placeholder = 'Typ je formule of antwoord',
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
        <label htmlFor="text-answer">{label}</label>
        <input
          id="text-answer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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

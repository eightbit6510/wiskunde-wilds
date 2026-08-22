import type { CodeCrackItem } from '../../types';

interface Props {
  items: CodeCrackItem[];
  secretWord: string;
  values: string[];
  onChange: (index: number, value: string) => void;
  disabled?: boolean;
}

export function CodeCrackChallenge({
  items,
  secretWord,
  values,
  onChange,
  disabled,
}: Props) {
  const revealed = items.map((item, i) => {
    const n = Number(values[i]?.replace(',', '.'));
    return !Number.isNaN(n) && n === item.answer ? item.letter : '·';
  });

  return (
    <div className="vault">
      <h3>🔐 Pootkluis</h3>
      <div className="code-slots" aria-label={`Geheim woord, ${secretWord.length} letters`}>
        {secretWord.split('').map((_, i) => (
          <div key={i} className={`code-slot${revealed[i] !== '·' ? ' filled' : ''}`}>
            {revealed[i]}
          </div>
        ))}
      </div>
      {items.map((item, i) => (
        <div className="vault-item" key={item.expression}>
          <label htmlFor={`code-${i}`}>
            {item.expression} = ?
          </label>
          <input
            id={`code-${i}`}
            value={values[i] ?? ''}
            onChange={(e) => onChange(i, e.target.value)}
            disabled={disabled}
            inputMode="decimal"
            aria-label={`Antwoord voor ${item.expression}`}
          />
        </div>
      ))}
    </div>
  );
}

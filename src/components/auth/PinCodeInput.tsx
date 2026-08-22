import { useEffect, useRef } from 'react';
import { PIN_RULES } from '../../types/player';

interface PinCodeInputProps {
  idPrefix: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  label?: string;
}

export function PinCodeInput({
  idPrefix,
  value,
  onChange,
  length = PIN_RULES.maxLength,
  autoFocus = false,
  disabled = false,
  label,
}: PinCodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  const updateAt = (index: number, digit: string) => {
    const nextChar = digit.replace(/\D/g, '').slice(-1);
    const nextDigits = Array.from({ length }, (_, i) => value[i] ?? '');
    nextDigits[index] = nextChar;
    const joined = nextDigits.join('').replace(/\s/g, '').slice(0, length);
    onChange(joined);
    if (nextChar && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  return (
    <div className="pin-code-field">
      {label && (
        <span className="pin-code-label" id={`${idPrefix}-label`}>
          {label}
        </span>
      )}
      <div
        className="pin-digit-row"
        role="group"
        aria-labelledby={label ? `${idPrefix}-label` : undefined}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            id={`${idPrefix}-${index}`}
            className="pin-digit-input"
            type="password"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Cijfer ${index + 1} van ${length}`}
            onChange={(event) => updateAt(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !digit && index > 0) {
                refs.current[index - 1]?.focus();
              }
              if (event.key === 'ArrowLeft' && index > 0) {
                refs.current[index - 1]?.focus();
              }
              if (event.key === 'ArrowRight' && index < length - 1) {
                refs.current[index + 1]?.focus();
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
              if (!pasted) return;
              onChange(pasted);
              const focusIndex = Math.min(pasted.length, length - 1);
              refs.current[focusIndex]?.focus();
            }}
          />
        ))}
      </div>
      <p className="pin-code-hint muted">4 cijfers — alleen jij weet deze code.</p>
    </div>
  );
}

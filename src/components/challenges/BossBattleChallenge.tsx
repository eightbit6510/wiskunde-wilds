import { useState } from 'react';
import type { BossQuestion } from '../../types';
import { answersMatch } from '../../utils/answers';
import { formatMathText } from '../../utils/mathText';

interface Props {
  questions: BossQuestion[];
  onComplete: (wrongCount: number) => void;
  disabled?: boolean;
}

export function BossBattleChallenge({ questions, onComplete, disabled }: Props) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [tf, setTf] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  const q = questions[index];
  if (!q) return null;

  const submit = () => {
    let ok = false;
    if (q.type === 'multiple-choice') {
      ok = selected === q.correctAnswer;
    } else if (q.type === 'true-false') {
      ok = tf === q.correctAnswer;
    } else {
      ok = answersMatch(value, q.correctAnswer);
    }

    if (!ok) {
      setWrong((w) => w + 1);
      setMsg('Nog niet… probeer opnieuw of ga door naar de hint.');
      return;
    }

    setMsg(formatMathText(q.explanation));
    if (index >= questions.length - 1) {
      onComplete(wrong);
      return;
    }
    window.setTimeout(() => {
      setIndex((i) => i + 1);
      setValue('');
      setTf(null);
      setSelected(null);
      setMsg(null);
    }, 700);
  };

  return (
    <div>
      <p className="chip">
        Boss {index + 1}/{questions.length}
      </p>
      <p style={{ fontWeight: 700 }}>{formatMathText(q.question)}</p>
      {q.type === 'multiple-choice' && q.options && (
        <div className="options-list">
          {q.options.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`option-btn${selected === o.id ? ' selected' : ''}`}
              disabled={disabled}
              onClick={() => setSelected(o.id)}
            >
              {formatMathText(o.label)}
            </button>
          ))}
        </div>
      )}
      {q.type === 'true-false' && (
        <div className="options-list">
          <button
            type="button"
            className={`option-btn${tf === true ? ' selected' : ''}`}
            disabled={disabled}
            onClick={() => setTf(true)}
          >
            Waar
          </button>
          <button
            type="button"
            className={`option-btn${tf === false ? ' selected' : ''}`}
            disabled={disabled}
            onClick={() => setTf(false)}
          >
            Niet waar
          </button>
        </div>
      )}
      {q.type === 'number-input' && (
        <div className="input-row">
          <div className="field">
            <label htmlFor="boss-num">Antwoord</label>
            <input
              id="boss-num"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              inputMode="decimal"
            />
          </div>
        </div>
      )}
      {msg && <p className="muted">{msg}</p>}
      <button type="button" className="btn" disabled={disabled} onClick={submit}>
        {index >= questions.length - 1 ? 'Finish boss' : 'Volgende'}
      </button>
    </div>
  );
}

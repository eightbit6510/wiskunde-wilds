import { useState } from 'react';
import type { BonusVariant } from '../../types';
import { answersMatch } from '../../utils/answers';
import { formatMathText } from '../../utils/mathText';
import { OWL_BONUS_XP } from '../../utils/owlEconomy';
import { FeedbackCard } from '../FeedbackCard';
import { OwlMascot } from './OwlMascot';

interface BonusChallengeProps {
  variant: BonusVariant;
  animationsEnabled: boolean;
  onSolved: (xp: number) => void;
  onSkip: () => void;
}

export function BonusChallenge({
  variant,
  animationsEnabled,
  onSolved,
  onSkip,
}: BonusChallengeProps) {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);

  const type = variant.type ?? 'text-input';

  const submit = () => {
    if (solved) return;
    let ok = false;
    if (type === 'multiple-choice') {
      ok = selected === variant.answer;
    } else if (type === 'true-false') {
      ok = selected === String(variant.answer);
    } else {
      const expected = variant.acceptedAnswers ?? variant.answer;
      ok = answersMatch(text, expected as string | number | string[]);
    }

    if (!ok) {
      setAttempts((a) => a + 1);
      setWrong(true);
      return;
    }

    setSolved(true);
    setWrong(false);
    onSolved(OWL_BONUS_XP);
  };

  return (
    <article className="card challenge-card owl-bonus-card">
      <p className="chip">🦉 Nu jij!</p>
      <h2 style={{ marginTop: '0.35rem' }}>Zelfde truc, andere som.</h2>
      {variant.optionalStory && <p className="challenge-story">{formatMathText(variant.optionalStory)}</p>}
      <p style={{ fontWeight: 700 }}>{formatMathText(variant.question)}</p>

      {type === 'multiple-choice' && variant.answerOptions && (
        <div className="options-list">
          {variant.answerOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`option-btn${selected === opt.id ? ' selected' : ''}`}
              disabled={solved}
              onClick={() => setSelected(opt.id)}
            >
              {formatMathText(opt.label)}
            </button>
          ))}
        </div>
      )}

      {type === 'true-false' && (
        <div className="options-list">
          {[
            { id: 'true', label: 'Waar' },
            { id: 'false', label: 'Niet waar' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`option-btn${selected === opt.id ? ' selected' : ''}`}
              disabled={solved}
              onClick={() => setSelected(opt.id)}
            >
              {formatMathText(opt.label)}
            </button>
          ))}
        </div>
      )}

      {(type === 'text-input' || type === 'number-input') && (
        <form
          className="input-row"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="field">
            <label htmlFor="bonus-answer">Jouw antwoord</label>
            <input
              id="bonus-answer"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={solved}
              autoComplete="off"
              inputMode={type === 'number-input' ? 'decimal' : 'text'}
            />
          </div>
          <button type="submit" className="btn" disabled={solved || !text.trim()}>
            Check
          </button>
        </form>
      )}

      {(type === 'multiple-choice' || type === 'true-false') && (
        <button type="button" className="btn" disabled={solved || !selected} onClick={submit}>
          Check antwoord
        </button>
      )}

      {wrong && !solved && (
        <FeedbackCard
          kind="try-again"
          title="Nog niet helemaal. Laten we even speuren."
          body={formatMathText(
            attempts >= 2
              ? variant.hint2 ?? variant.hint1
              : variant.hint1 ?? 'Kijk nog eens naar de stappen die je met de Uil deed.',
          )}
        />
      )}

      {solved && (
        <div className="feedback-card success" role="status">
          <strong>Yes! 🐾</strong>
          <p style={{ margin: '0.5rem 0 0' }}>Deze deed je helemaal zelf.</p>
          <div className="star-pop" style={{ marginTop: '0.4rem' }}>
            +{OWL_BONUS_XP} bonus XP
          </div>
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            De Uil knikt goedkeurend.
          </p>
          {animationsEnabled && <OwlMascot size={72} mood="happy" className="float" />}
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button type="button" className="btn btn-ghost" onClick={onSkip}>
          {solved ? 'Verder met mijn avontuur' : 'Sla bonus over'}
        </button>
      </div>
    </article>
  );
}

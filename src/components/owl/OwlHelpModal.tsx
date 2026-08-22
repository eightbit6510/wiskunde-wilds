import { useState } from 'react';
import type { OwlHelp } from '../../types';
import { OwlMascot } from './OwlMascot';
import { OwlSpeechBubble } from './OwlSpeechBubble';

interface OwlHelpModalProps {
  open: boolean;
  help: OwlHelp;
  animationsEnabled: boolean;
  starsAfterSpend: number;
  onFinished: () => void;
  onClose: () => void;
}

export function OwlHelpModal({
  open,
  help,
  animationsEnabled,
  starsAfterSpend,
  onFinished,
  onClose,
}: OwlHelpModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<'ask' | 'success' | 'retry' | 'done'>('ask');

  if (!open) return null;

  const step = help.steps[stepIndex];
  const isLast = stepIndex >= help.steps.length - 1;

  const checkStep = () => {
    if (!step) return;
    if (!step.correctAnswer) {
      // Explanation-only step
      if (isLast) setPhase('done');
      else {
        setStepIndex((i) => i + 1);
        setSelected(null);
        setPhase('ask');
      }
      return;
    }
    if (selected === step.correctAnswer) {
      setPhase('success');
    } else {
      setPhase('retry');
    }
  };

  const goNext = () => {
    if (isLast) {
      setPhase('done');
      return;
    }
    setStepIndex((i) => i + 1);
    setSelected(null);
    setPhase('ask');
  };

  return (
    <div className="completion-modal owl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="owl-help-title">
      <div className={`owl-help-panel${animationsEnabled ? ' owl-enter' : ''}`}>
        <header className="owl-help-header">
          <div>
            <h2 id="owl-help-title" style={{ margin: 0 }}>
              🦉 Uilenhulp
            </h2>
            <p className="muted" style={{ margin: '0.25rem 0 0' }}>
              Geen stress. We doen deze samen.
            </p>
          </div>
          <div className="chip">Je hebt: ⭐ {starsAfterSpend}</div>
        </header>

        <div className="owl-help-body">
          <OwlMascot
            size={80}
            mood={phase === 'success' || phase === 'done' ? 'happy' : phase === 'retry' ? 'thinking' : 'calm'}
            className={animationsEnabled ? 'float' : ''}
          />

          {stepIndex === 0 && phase === 'ask' && (
            <OwlSpeechBubble>{help.intro}</OwlSpeechBubble>
          )}

          {phase !== 'done' && step && (
            <>
              <OwlSpeechBubble>{step.explanation}</OwlSpeechBubble>

              {step.question && phase !== 'success' && (
                <>
                  <p style={{ fontWeight: 700 }}>{step.question}</p>
                  {step.options && (
                    <div className="options-list">
                      {step.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={`option-btn${selected === opt.id ? ' selected' : ''}`}
                          disabled={false}
                          onClick={() => {
                            setSelected(opt.id);
                            setPhase('ask');
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {phase === 'retry' && step.retryFeedback && (
                <OwlSpeechBubble>{step.retryFeedback}</OwlSpeechBubble>
              )}

              {phase === 'success' && step.successFeedback && (
                <OwlSpeechBubble>{step.successFeedback}</OwlSpeechBubble>
              )}
            </>
          )}

          {phase === 'done' && <OwlSpeechBubble>{help.conclusion}</OwlSpeechBubble>}
        </div>

        <footer className="owl-modal-actions">
          {phase === 'ask' || phase === 'retry' ? (
            <button
              type="button"
              className="btn"
              onClick={checkStep}
              disabled={!!step?.correctAnswer && !selected}
            >
              Check stap
            </button>
          ) : null}

          {phase === 'success' && (
            <button type="button" className="btn" onClick={goNext}>
              {isLast ? 'Afronden' : 'Volgende stap'}
            </button>
          )}

          {phase === 'done' && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                onFinished();
              }}
            >
              Pootafdruk gevonden! 🐾
            </button>
          )}

          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Sluiten
          </button>
        </footer>
      </div>
    </div>
  );
}

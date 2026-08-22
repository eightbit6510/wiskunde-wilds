import { useState } from 'react';
import type { HelpPersona, OwlHelp } from '../../types';
import { formatMathText } from '../../utils/mathText';
import { HelpMascot } from './HelpMascot';
import { GuidedHelpSpeechBubble } from './GuidedHelpSpeechBubble';

interface GuidedHelpModalProps {
  persona: HelpPersona;
  open: boolean;
  help: OwlHelp;
  animationsEnabled: boolean;
  starsAfterSpend: number;
  onFinished: () => void;
  onClose: () => void;
}

export function GuidedHelpModal({
  persona,
  open,
  help,
  animationsEnabled,
  starsAfterSpend,
  onFinished,
  onClose,
}: GuidedHelpModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<'ask' | 'success' | 'retry' | 'done'>('ask');

  if (!open) return null;

  const step = help.steps[stepIndex];
  const isLast = stepIndex >= help.steps.length - 1;

  const checkStep = () => {
    if (!step) return;
    if (!step.correctAnswer) {
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
    <div
      className={`completion-modal guided-help-modal-backdrop ${persona.themeClass ?? ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guided-help-title"
    >
      <div className={`guided-help-panel${animationsEnabled ? ' guided-help-enter' : ''}`}>
        <header className="guided-help-header">
          <div>
            <h2 id="guided-help-title" style={{ margin: 0 }}>
              {persona.helpModalTitle}
            </h2>
            <p className="muted" style={{ margin: '0.25rem 0 0' }}>
              {persona.helpModalSubtitle}
            </p>
          </div>
          <div className="chip">Je hebt: ⭐ {starsAfterSpend}</div>
        </header>

        <div className="guided-help-body">
          <HelpMascot
            persona={persona}
            size={80}
            mood={
              phase === 'success' || phase === 'done'
                ? 'happy'
                : phase === 'retry'
                  ? 'thinking'
                  : 'calm'
            }
            className={animationsEnabled ? 'float' : ''}
          />

          {stepIndex === 0 && phase === 'ask' && (
            <GuidedHelpSpeechBubble>{formatMathText(help.intro)}</GuidedHelpSpeechBubble>
          )}

          {phase !== 'done' && step && (
            <>
              <GuidedHelpSpeechBubble>{formatMathText(step.explanation)}</GuidedHelpSpeechBubble>

              {step.question && phase !== 'success' && (
                <>
                  <p style={{ fontWeight: 700 }}>{formatMathText(step.question)}</p>
                  {step.options && (
                    <div className="options-list">
                      {step.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className={`option-btn${selected === opt.id ? ' selected' : ''}`}
                          onClick={() => {
                            setSelected(opt.id);
                            setPhase('ask');
                          }}
                        >
                          {formatMathText(opt.label)}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {phase === 'retry' && step.retryFeedback && (
                <GuidedHelpSpeechBubble>{formatMathText(step.retryFeedback)}</GuidedHelpSpeechBubble>
              )}

              {phase === 'success' && step.successFeedback && (
                <GuidedHelpSpeechBubble>{formatMathText(step.successFeedback)}</GuidedHelpSpeechBubble>
              )}
            </>
          )}

          {phase === 'done' && <GuidedHelpSpeechBubble>{formatMathText(help.conclusion)}</GuidedHelpSpeechBubble>}
        </div>

        <footer className="guided-help-modal-actions">
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
            <button type="button" className="btn" onClick={onFinished}>
              {persona.finishHelpLabel}
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

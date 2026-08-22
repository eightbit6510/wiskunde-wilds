import { useEffect, useMemo, useState } from 'react';
import type { Challenge } from '../types';
import {
  WRONG_MESSAGES,
  answersMatch,
  arraysEqualOrdered,
  arraysEqualUnordered,
  pickMessage,
  SUCCESS_MESSAGES,
} from '../utils/answers';
import { FeedbackCard } from './FeedbackCard';
import { HintBox } from './HintBox';
import { ForestMascot } from './ForestMascot';
import { BossBattleChallenge } from './challenges/BossBattleChallenge';
import { CodeCrackChallenge } from './challenges/CodeCrackChallenge';
import { EquationStepChallenge } from './challenges/EquationStepChallenge';
import { GraphChallenge } from './challenges/GraphChallenge';
import { MatchingChallenge } from './challenges/MatchingChallenge';
import { MultipleChoiceChallenge } from './challenges/MultipleChoiceChallenge';
import { MultiSelectChallenge } from './challenges/MultiSelectChallenge';
import { NumberInputChallenge } from './challenges/NumberInputChallenge';
import { ParabolaExplorer } from './challenges/ParabolaExplorer';
import { SortingChallenge } from './challenges/SortingChallenge';
import { TextInputChallenge } from './challenges/TextInputChallenge';
import { TrueFalseChallenge } from './challenges/TrueFalseChallenge';

interface ChallengeCardProps {
  challenge: Challenge;
  alreadyStars?: number;
  /** Challenge already in completedChallenges */
  alreadyCompleted?: boolean;
  /** Mark solved when owl help finished the challenge */
  externallySolved?: boolean;
  /** Open first hint (e.g. when owl unavailable) */
  revealFirstHint?: boolean;
  onWrong: () => void;
  onCorrect: (meta: {
    attempts: number;
    usedHint: boolean;
    usedFirstStep: boolean;
    stars: number;
    usedOwlHelp?: boolean;
  }) => void;
  animationsEnabled: boolean;
}

export function ChallengeCard({
  challenge,
  alreadyStars = 0,
  alreadyCompleted = false,
  externallySolved = false,
  revealFirstHint = false,
  onWrong,
  onCorrect,
  animationsEnabled,
}: ChallengeCardProps) {
  const previouslyDone = alreadyCompleted || alreadyStars > 0 || externallySolved;
  const [attempts, setAttempts] = useState(revealFirstHint ? 1 : 0);
  const [usedHint, setUsedHint] = useState(revealFirstHint);
  const [usedFirstStep, setUsedFirstStep] = useState(false);
  const [solved, setSolved] = useState(previouslyDone);
  const [feedback, setFeedback] = useState<'success' | 'try-again' | null>(
    previouslyDone ? 'success' : null,
  );
  const [starsEarned, setStarsEarned] = useState(Math.max(alreadyStars, previouslyDone ? 1 : 0));
  const [showVisual, setShowVisual] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [tf, setTf] = useState<boolean | null>(null);
  const [eqStep, setEqStep] = useState(0);
  const [eqSelected, setEqSelected] = useState<string | null>(null);
  const [codeValues, setCodeValues] = useState<string[]>(
    () => challenge.codeItems?.map(() => '') ?? [],
  );
  const [matchSel, setMatchSel] = useState<Record<string, string>>({});
  const [sortItems, setSortItems] = useState<string[]>(
    () => [...(challenge.sortItems ?? [])],
  );

  useEffect(() => {
    if (externallySolved || alreadyCompleted) {
      setSolved(true);
      setFeedback('success');
      if (alreadyStars > 0) setStarsEarned(alreadyStars);
    }
  }, [externallySolved, alreadyCompleted, alreadyStars]);

  useEffect(() => {
    if (revealFirstHint) {
      setUsedHint(true);
      setAttempts((a) => Math.max(a, 1));
    }
  }, [revealFirstHint]);

  const wrongTitle = useMemo(
    () => pickMessage(WRONG_MESSAGES, attempts + challenge.id.length),
    [attempts, challenge.id],
  );

  const markWrong = () => {
    setAttempts((a) => a + 1);
    setUsedHint(true);
    setFeedback('try-again');
    onWrong();
  };

  const markCorrect = (attemptOverride?: number, hintOverride?: boolean) => {
    const finalAttempts = attemptOverride ?? attempts + 1;
    const hinted = hintOverride ?? (usedHint || finalAttempts > 1);
    setAttempts(finalAttempts);
    setSolved(true);
    setFeedback('success');
    const preview = usedFirstStep ? 1 : finalAttempts <= 1 ? 3 : finalAttempts === 2 ? 2 : 1;
    setStarsEarned(preview);
    onCorrect({
      attempts: finalAttempts,
      usedHint: hinted,
      usedFirstStep,
      stars: preview,
    });
  };

  const startRetry = () => {
    setAttempts(0);
    setUsedHint(false);
    setUsedFirstStep(false);
    setSolved(false);
    setFeedback(null);
    setStarsEarned(alreadyStars);
    setSelected(null);
    setMulti([]);
    setText('');
    setTf(null);
    setEqStep(0);
    setEqSelected(null);
    setCodeValues(challenge.codeItems?.map(() => '') ?? []);
    setMatchSel({});
    setSortItems([...(challenge.sortItems ?? [])]);
    setShowVisual(false);
  };

  const canImproveStars = Math.max(alreadyStars, previouslyDone ? 1 : 0) < 3;
  const checkAnswer = () => {
    if (solved) return;
    let ok = false;

    switch (challenge.type) {
      case 'multiple-choice':
      case 'spot-error':
      case 'graph-choice':
        ok = selected === challenge.answer;
        break;
      case 'multi-select':
        ok = arraysEqualUnordered(multi, challenge.answers ?? []);
        break;
      case 'number-input': {
        const expected = challenge.acceptedAnswers ?? challenge.answer;
        ok = answersMatch(text, expected as string | number | string[]);
        break;
      }
      case 'text-input': {
        const expected = challenge.acceptedAnswers ?? challenge.answer;
        ok = answersMatch(text, expected as string | number | string[]);
        break;
      }
      case 'true-false':
        ok = tf === challenge.answer;
        break;
      case 'equation-steps': {
        const step = challenge.equationSteps?.[eqStep];
        if (!step || eqSelected !== step.correctId) {
          ok = false;
          break;
        }
        if (eqStep < (challenge.equationSteps?.length ?? 0) - 1) {
          setEqStep((s) => s + 1);
          setEqSelected(null);
          setFeedback(null);
          return;
        }
        ok = true;
        break;
      }
      case 'code-crack': {
        const items = challenge.codeItems ?? [];
        ok = items.every((item, i) => {
          const n = Number(codeValues[i]?.replace(',', '.'));
          return !Number.isNaN(n) && n === item.answer;
        });
        break;
      }
      case 'matching': {
        const pairs = challenge.matchingPairs ?? [];
        ok = pairs.every((p) => matchSel[p.id] === p.right);
        break;
      }
      case 'sorting':
        ok = arraysEqualOrdered(sortItems, challenge.correctOrder ?? []);
        break;
      default:
        ok = false;
    }

    if (ok) markCorrect();
    else markWrong();
  };

  const toggleMulti = (id: string) => {
    setMulti((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const moveSort = (index: number, direction: -1 | 1) => {
    setSortItems((items) => {
      const next = [...items];
      const j = index + direction;
      if (j < 0 || j >= next.length) return items;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  const needsManualCheck = !['boss-battle'].includes(challenge.type);

  return (
    <article className="card challenge-card">
      {challenge.sneakyNote && <div className="sneaky">{challenge.sneakyNote}</div>}
      {challenge.optionalStory && <p className="challenge-story">{challenge.optionalStory}</p>}
      <h2 style={{ marginTop: 0, fontSize: '1.35rem' }}>{challenge.question}</h2>

      {challenge.tableData && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {challenge.tableData.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {challenge.tableData.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {challenge.interactiveParabola && (
        <ParabolaExplorer
          base={challenge.interactiveParabola.base}
          xValues={challenge.interactiveParabola.xValues}
        />
      )}

      {(challenge.type === 'multiple-choice' || challenge.type === 'spot-error') &&
        challenge.answerOptions && (
          <MultipleChoiceChallenge
            options={challenge.answerOptions}
            selected={selected}
            onSelect={setSelected}
            disabled={solved}
          />
        )}

      {challenge.type === 'multi-select' && challenge.answerOptions && (
        <MultiSelectChallenge
          options={challenge.answerOptions}
          selected={multi}
          onToggle={toggleMulti}
          disabled={solved}
        />
      )}

      {challenge.type === 'number-input' && (
        <NumberInputChallenge
          value={text}
          onChange={setText}
          onSubmit={checkAnswer}
          disabled={solved}
        />
      )}

      {challenge.type === 'text-input' && (
        <TextInputChallenge
          value={text}
          onChange={setText}
          onSubmit={checkAnswer}
          disabled={solved}
        />
      )}

      {challenge.type === 'true-false' && (
        <TrueFalseChallenge value={tf} onSelect={setTf} disabled={solved} />
      )}

      {challenge.type === 'equation-steps' && challenge.equationSteps && (
        <EquationStepChallenge
          steps={challenge.equationSteps}
          stepIndex={eqStep}
          selected={eqSelected}
          onSelect={setEqSelected}
          disabled={solved}
        />
      )}

      {challenge.type === 'graph-choice' && challenge.graphOptions && (
        <GraphChallenge
          options={challenge.graphOptions}
          selected={selected}
          onSelect={setSelected}
          disabled={solved}
        />
      )}

      {challenge.type === 'code-crack' && challenge.codeItems && challenge.secretWord && (
        <CodeCrackChallenge
          items={challenge.codeItems}
          secretWord={challenge.secretWord}
          values={codeValues}
          onChange={(i, v) =>
            setCodeValues((prev) => {
              const next = [...prev];
              next[i] = v;
              return next;
            })
          }
          disabled={solved}
        />
      )}

      {challenge.type === 'matching' && challenge.matchingPairs && (
        <MatchingChallenge
          pairs={challenge.matchingPairs}
          selections={matchSel}
          onChange={(id, right) => setMatchSel((s) => ({ ...s, [id]: right }))}
          disabled={solved}
        />
      )}

      {challenge.type === 'sorting' && (
        <SortingChallenge items={sortItems} onMove={moveSort} disabled={solved} />
      )}

      {challenge.type === 'boss-battle' && challenge.bossQuestions && !solved && (
        <BossBattleChallenge
          questions={challenge.bossQuestions}
          onComplete={(wrongCount) => {
            const a = Math.max(1, wrongCount + 1);
            markCorrect(a, wrongCount > 0);
          }}
        />
      )}

      {challenge.showVisualCompare && challenge.visualBars && (
        <div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowVisual((v) => !v)}
          >
            {showVisual ? 'Verberg visualisatie' : 'Laat visueel zien'}
          </button>
          {showVisual && (
            <div className="visual-bars">
              {challenge.visualBars.map((bar) => (
                <div className="bar-row" key={bar.label}>
                  <span>{bar.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${bar.value * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {needsManualCheck && challenge.type !== 'number-input' && challenge.type !== 'text-input' && (
        <button type="button" className="btn" disabled={solved} onClick={checkAnswer}>
          Check antwoord
        </button>
      )}

      {!solved && (
        <HintBox
          attempt={attempts}
          hint1={challenge.hint1}
          hint2={challenge.hint2}
          firstStep={challenge.optionalWorkedFirstStep}
          usedFirstStep={usedFirstStep}
          onRequestFirstStep={() => setUsedFirstStep(true)}
        />
      )}

      {feedback === 'try-again' && !solved && (
        <FeedbackCard kind="try-again" title={wrongTitle} />
      )}

      {feedback === 'success' && (
        <>
          <FeedbackCard
            kind="success"
            title={
              previouslyDone && attempts === 0
                ? 'Deze pootafdruk had je al gevonden.'
                : pickMessage(SUCCESS_MESSAGES, challenge.id.length)
            }
            body={
              previouslyDone && attempts === 0 && canImproveStars
                ? `${challenge.explanation}\n\nJe hebt nu ${Math.max(alreadyStars, 1)}⭐. Wil je opnieuw proberen voor meer sterren?`
                : challenge.explanation
            }
            starsEarned={attempts > 0 ? starsEarned : undefined}
          />
          {canImproveStars && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '0.85rem' }}
              onClick={startRetry}
            >
              🐾 Opnieuw voor meer sterren
            </button>
          )}
          {animationsEnabled && (
            <div style={{ marginTop: '0.75rem' }}>
              <ForestMascot mood="celebrating" size={100} className="float" />
            </div>
          )}
        </>
      )}
    </article>
  );
}

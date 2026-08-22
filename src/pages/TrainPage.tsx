import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChallengeCard } from '../components/ChallengeCard';
import { ForestMascot } from '../components/ForestMascot';
import { useActiveLessons } from '../hooks/useActiveLessons';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';
import { buildTrainingSession } from '../utils/mastery';
import { XP } from '../utils/xpConfig';

export function TrainPage({
  progressApi,
  settingsApi,
}: {
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
}) {
  const { progress, completeChallenge, recordWrongAttempt, completeTrainingSession } =
    progressApi;
  const { settings } = settingsApi;
  const { trainingPool, reviewPool, hasLevelContent, lessons } = useActiveLessons();

  const easyPool = useMemo(
    () => trainingPool.filter((c) => c.difficulty <= 2),
    [trainingPool],
  );
  const hardPool = useMemo(
    () => trainingPool.filter((c) => c.difficulty >= 2),
    [trainingPool],
  );

  const session = useMemo(
    () => buildTrainingSession(reviewPool, easyPool, hardPool, progress),
    // Only rebuild when starting — freeze for the session
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const challenge = session[index];
  const lessonId =
    lessons.find((l) => l.challenges.some((c) => c.id === challenge?.id))?.id ?? 'train';

  if (!hasLevelContent || !session.length) {
    return (
      <div className="card">
        <p>Kies eerst je jaargroep op de kaart — dan kun je trainen met passende sommen.</p>
        <Link to="/" className="btn">
          Naar de kaart
        </Link>
      </div>
    );
  }

  if (done || !challenge) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
        <ForestMascot mood="celebrating" size={100} />
        <h1>Training klaar</h1>
        <p>{solvedCount} pootafdrukken gevonden</p>
        <p className="star-pop">+{XP.trainingSession} XP</p>
        <Link to="/" className="btn">
          Terug naar de kaart
        </Link>
      </div>
    );
  }

  return (
    <div className="challenge-shell">
      <Link to="/" className="btn btn-ghost">
        ← Kaart
      </Link>
      <h1 style={{ fontSize: '1.4rem' }}>🐾 Even trainen</h1>
      <p className="muted">
        Vraag {index + 1} van {session.length} — kort en krachtig.
      </p>
      {challenge.reviewOfPart1 && (
        <p className="chip">🐾 Vertrouwde pootafdruk — bekend terrein</p>
      )}
      <ChallengeCard
        key={challenge.id}
        challenge={challenge}
        alreadyStars={progress.challengeStars[challenge.id]}
        animationsEnabled={settings.animationsEnabled && !settings.calmMode}
        onWrong={() => recordWrongAttempt(challenge.topic)}
        onCorrect={({ attempts, usedHint, usedFirstStep }) => {
          completeChallenge({
            challengeId: challenge.id,
            lessonId,
            topic: challenge.topic,
            attempts,
            usedHint,
            usedFirstStep,
            reviewOfPart1: challenge.reviewOfPart1,
            xpReward: challenge.xpReward ?? XP.review,
          });
          setSolvedCount((n) => n + 1);
          if (index >= session.length - 1) {
            completeTrainingSession(XP.trainingSession);
            setDone(true);
          } else {
            setIndex((i) => i + 1);
          }
        }}
      />
      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginTop: '1rem' }}
        onClick={() => {
          if (index >= session.length - 1) {
            completeTrainingSession(Math.round(XP.trainingSession * 0.5));
            setDone(true);
          } else setIndex((i) => i + 1);
        }}
      >
        Overslaan
      </button>
    </div>
  );
}

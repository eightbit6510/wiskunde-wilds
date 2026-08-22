import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { BadgeUnlockModal } from '../components/BadgeUnlockModal';
import { ChallengeCard } from '../components/ChallengeCard';
import { CompletionModal } from '../components/CompletionModal';
import { ForestMascot } from '../components/ForestMascot';
import { Part2UnlockReveal } from '../components/Part2UnlockReveal';
import { ProgressBar } from '../components/ProgressBar';
import { StarCounter } from '../components/StarCounter';
import { GuidedHelpController } from '../components/guided-help/GuidedHelpController';
import { getHelpPersona } from '../content/personas';
import { getHelpPersonaIdForLesson } from '../content/personaForLesson';
import { useActiveClassLevel } from '../context/ActiveClassLevelContext';
import { badges } from '../data/badges';
import { getLesson } from '../data/lessons';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';
import { getAdventureForLesson, isAdventureUnlocked } from '../utils/adventureUnlock';
import { TOPIC_LABELS } from '../utils/storage';
import { STREAK_MESSAGES, pickMessage } from '../utils/answers';
import { XP } from '../utils/xpConfig';

export function LessonPage({
  progressApi,
  settingsApi,
}: {
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
}) {
  const { lessonId = '' } = useParams();
  const classLevel = useActiveClassLevel();
  const lesson = getLesson(lessonId, classLevel);
  const navigate = useNavigate();
  const {
    progress,
    completeChallenge,
    recordWrongAttempt,
    confirmOwlHelp,
    startOwlBonus,
    completeOwlBonus,
    lessonProgress,
    markPart2UnlockSeen,
    finalizeLesson,
  } = progressApi;
  const { settings } = settingsApi;

  const [index, setIndex] = useState(() => {
    if (!lesson) return 0;
    const firstOpen = lesson.challenges.findIndex(
      (c) => !progress.completedChallenges.includes(c.id),
    );
    return firstOpen >= 0 ? firstOpen : 0;
  });
  const [showComplete, setShowComplete] = useState(false);
  const [showPart2Reveal, setShowPart2Reveal] = useState(false);
  const [streakNote, setStreakNote] = useState<string | null>(null);
  const [owlSolvedIds, setOwlSolvedIds] = useState<string[]>([]);
  const [revealHintFor, setRevealHintFor] = useState<string | null>(null);
  const [bonusActive, setBonusActive] = useState(false);
  const [badgeQueue, setBadgeQueue] = useState<string[]>([]);
  const [pendingNavigate, setPendingNavigate] = useState(false);
  const [finishHint, setFinishHint] = useState<string | null>(null);
  const badgesAtVisitStart = useRef(progress.unlockedBadges);

  const prog = lessonProgress.find((p) => p.lessonId === lessonId);
  const challenge = lesson?.challenges[index];
  const adventure = lesson ? getAdventureForLesson(lesson.id) : 'part1';
  const isPart2 = adventure === 'part2' || lesson?.adventureId === 'part2' || lesson?.adventureId === 'side';

  const runeLit = useMemo(() => {
    if (!lesson || lesson.id !== 'bergmissie') return [];
    return lesson.challenges.map((c) => progress.completedChallenges.includes(c.id));
  }, [lesson, progress.completedChallenges]);

  const nightRooms = useMemo(() => {
    if (!lesson || lesson.id !== 'nachtmissie') return [];
    // First 5 rooms light the moon-paw symbol
    return lesson.challenges.slice(0, 5).map((c) => progress.completedChallenges.includes(c.id));
  }, [lesson, progress.completedChallenges]);

  const topicInsight = useMemo(() => {
    const entries = Object.entries(progress.topicStats).map(([topic, stats]) => {
      const score =
        stats.tried === 0
          ? 0
          : (stats.firstTryCorrect * 2 + stats.withHintCorrect) / Math.max(1, stats.tried);
      return { topic, score, tried: stats.tried };
    });
    const strong = entries
      .filter((e) => e.tried > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((e) => TOPIC_LABELS[e.topic as keyof typeof TOPIC_LABELS]);
    const train = entries
      .filter((e) => e.tried > 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map((e) => TOPIC_LABELS[e.topic as keyof typeof TOPIC_LABELS]);
    return { strong, train };
  }, [progress.topicStats]);

  if (!lesson || !challenge) {
    return (
      <div className="card">
        <p>Dit gebied bestaat niet.</p>
        <Link to="/" className="btn">
          Terug naar kaart
        </Link>
      </div>
    );
  }

  if (
    (lesson.adventureId === 'part2' || lesson.adventureId === 'side') &&
    !isAdventureUnlocked('part2', progress)
  ) {
    return <Navigate to="/" replace />;
  }

  const lessonStars = prog?.stars ?? 0;
  const gateOpen = lesson.id === 'bergmissie' && runeLit.every(Boolean);
  const owlExternallySolved = owlSolvedIds.includes(challenge.id);
  const anim = settings.animationsEnabled && !settings.calmMode;
  const displayOrder = lesson.order > 100 ? lesson.order - 100 : lesson.order;
  const helpPersona = getHelpPersona(getHelpPersonaIdForLesson(lesson.id));

  const badgesEarnedThisVisit = progress.unlockedBadges.filter(
    (id) => !badgesAtVisitStart.current.includes(id),
  );

  const currentBadge =
    badgeQueue.length > 0 ? (badges.find((b) => b.id === badgeQueue[0]) ?? null) : null;

  const finishAfterCelebration = (shouldNavigate: boolean) => {
    if (lesson.id === 'sterrentempel' && progress.part2Unlocked && !progress.part2UnlockSeen) {
      setShowPart2Reveal(true);
      return;
    }
    if (shouldNavigate) {
      navigate('/');
    }
  };

  const beginBadgeCelebration = (shouldNavigate: boolean) => {
    setShowComplete(false);
    if (badgesEarnedThisVisit.length > 0) {
      setBadgeQueue(badgesEarnedThisVisit);
      setPendingNavigate(shouldNavigate);
      // Prevent re-showing the same badges if they finish another flow later
      badgesAtVisitStart.current = [...progress.unlockedBadges];
      return;
    }
    finishAfterCelebration(shouldNavigate);
  };

  const advanceBadgeQueue = () => {
    setBadgeQueue((queue) => {
      const rest = queue.slice(1);
      if (rest.length === 0) {
        queueMicrotask(() => finishAfterCelebration(pendingNavigate));
      }
      return rest;
    });
  };

  const completionTitle =
    lesson.id === 'nachtmissie'
      ? 'Nachtwoud Ontdekt'
      : lesson.id === 'sterrentempel'
        ? 'Boswiskundige Level Up!'
        : `${lesson.areaName} voltooid!`;

  const completionSubtitle =
    lesson.id === 'nachtmissie'
      ? 'Je hebt het Verborgen Gebied doorkruist. De maanpoot brandt helder.'
      : lesson.id === 'sterrentempel'
        ? 'Je bent klaar om VWO 3 binnen te wandelen.'
        : lesson.outroStory ?? 'Mooi spoor achtergelaten. Klaar voor het volgende gebied?';

  return (
    <div className={`challenge-shell${isPart2 ? ' theme-night' : ''}`}>
      <div className="lesson-header">
        <Link to="/" className="btn btn-ghost">
          ← Kaart
        </Link>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>
            {lesson.emoji} {displayOrder}. {lesson.areaName}
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {lesson.title}
          </p>
        </div>
        <StarCounter stars={progress.totalStars} label="sterren totaal" />
      </div>

      <ProgressBar
        value={
          lesson.challenges.filter((c) => progress.completedChallenges.includes(c.id)).length
        }
        max={lesson.challenges.length}
        label={`Opdracht ${index + 1} van ${lesson.challenges.length} · ${
          lesson.challenges.filter((c) => progress.completedChallenges.includes(c.id)).length
        } pootafdrukken gevonden`}
      />
      <p className="muted" style={{ fontSize: '0.9rem', marginTop: '0.35rem' }}>
        Lessterren: ⭐ {lessonStars}
      </p>

      {index === 0 && (
        <p className="challenge-story" style={{ marginTop: '1rem' }}>
          {lesson.intro}
        </p>
      )}

      {challenge.reviewOfPart1 && (
        <p className="chip review-chip" style={{ marginTop: '0.75rem' }}>
          🐾 Vertrouwde pootafdruk — bekend terrein
        </p>
      )}

      {challenge.title && !challenge.reviewOfPart1 && (
        <p className="chip" style={{ marginTop: '0.75rem' }}>
          {challenge.title}
        </p>
      )}

      {lesson.id === 'bergmissie' && (
        <>
          <div className="rune-row" aria-label="Runestenen">
            {['∫', '📈', '½', '🔗'].map((symbol, i) => (
              <div key={symbol} className={`rune${runeLit[i] ? ' lit' : ''}`} aria-hidden="true">
                {symbol}
              </div>
            ))}
          </div>
          <div className={`gate${gateOpen ? ' open' : ''}`} aria-hidden="true">
            <div className="gate-light" />
          </div>
          {gateOpen && (
            <p className="streak-banner" style={{ textAlign: 'center' }}>
              De bergpoort is open! ⛰️
            </p>
          )}
        </>
      )}

      {lesson.id === 'nachtmissie' && (
        <div className="moon-paw-row" aria-label="Maanpoot-symbolen">
          {['🌑', '🌊', '⭐', '🔮', '🌙'].map((symbol, i) => (
            <div
              key={symbol}
              className={`moon-fragment${nightRooms[i] ? ' lit' : ''}`}
              aria-hidden="true"
            >
              {symbol}
            </div>
          ))}
        </div>
      )}

      {streakNote && <div className="streak-banner">{streakNote}</div>}

      <div style={{ marginTop: '1rem' }}>
        {!bonusActive && (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            alreadyStars={progress.challengeStars[challenge.id] ?? 0}
            alreadyCompleted={progress.completedChallenges.includes(challenge.id)}
            externallySolved={owlExternallySolved}
            revealFirstHint={revealHintFor === challenge.id}
            animationsEnabled={anim}
            onWrong={() => recordWrongAttempt(challenge.topic)}
            onCorrect={({ attempts, usedHint, usedFirstStep }) => {
              completeChallenge({
                challengeId: challenge.id,
                lessonId: lesson.id,
                topic: challenge.topic,
                attempts,
                usedHint,
                usedFirstStep,
                reviewOfPart1: challenge.reviewOfPart1,
                xpReward: challenge.xpReward,
              });
              const nextStreak = progress.sessionStreak + 1;
              if (nextStreak > 0 && nextStreak % 3 === 0) {
                setStreakNote(pickMessage(STREAK_MESSAGES, nextStreak));
              } else if (challenge.reviewOfPart1) {
                setStreakNote('🐾 Oude skill! Deze zat nog gewoon in je rugzak.');
              } else {
                setStreakNote(null);
              }
            }}
          />
        )}

        <GuidedHelpController
          key={`help-${challenge.id}`}
          persona={helpPersona}
          challenge={challenge}
          totalStars={progress.totalStars}
          alreadySolved={
            progress.completedChallenges.includes(challenge.id) || owlExternallySolved
          }
          animationsEnabled={anim}
          onConfirmSpend={confirmOwlHelp}
          onHelpSolved={() => {
            completeChallenge({
              challengeId: challenge.id,
              lessonId: lesson.id,
              topic: challenge.topic,
              attempts: 3,
              usedHint: true,
              usedFirstStep: true,
              usedOwlHelp: true,
              reviewOfPart1: challenge.reviewOfPart1,
              xpReward: challenge.xpReward ?? XP.normal,
            });
            setOwlSolvedIds((ids) =>
              ids.includes(challenge.id) ? ids : [...ids, challenge.id],
            );
          }}
          onBonusStart={startOwlBonus}
          onBonusSolved={completeOwlBonus}
          onRequestHint={() => setRevealHintFor(challenge.id)}
          onBonusVisibilityChange={setBonusActive}
        />
      </div>

      {!bonusActive && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            disabled={index === 0}
            onClick={() => {
              setIndex((i) => Math.max(0, i - 1));
              setBonusActive(false);
            }}
          >
            Vorige
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (index < lesson.challenges.length - 1) {
                setIndex((i) => i + 1);
                setStreakNote(null);
                setBonusActive(false);
                setFinishHint(null);
              } else {
                const done = lesson.challenges.every((c) =>
                  progress.completedChallenges.includes(c.id),
                );
                if (!done) {
                  const remaining = lesson.challenges.filter(
                    (c) => !progress.completedChallenges.includes(c.id),
                  ).length;
                  setFinishHint(
                    `Nog ${remaining} opdracht${remaining === 1 ? '' : 'en'} open in dit gebied. Los die eerst op — dan telt het gebied mee voor Deel II.`,
                  );
                  return;
                }
                finalizeLesson(lesson.id);
                setFinishHint(null);
                setShowComplete(true);
              }
            }}
          >
            {index < lesson.challenges.length - 1 ? 'Volgende' : 'Les afronden'}
          </button>
        </div>
      )}

      {finishHint && (
        <p className="streak-banner" role="status" style={{ marginTop: '0.75rem' }}>
          {finishHint}
        </p>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <ForestMascot
          mood={progress.completedChallenges.includes(challenge.id) ? 'happy' : 'thinking'}
          size={88}
        />
      </div>

      <CompletionModal
        open={showComplete && !showPart2Reveal && badgeQueue.length === 0}
        title={completionTitle}
        subtitle={completionSubtitle}
        stars={progress.totalStars}
        challengesSolved={progress.challengesSolved}
        strongTopics={topicInsight.strong}
        trainTopics={topicInsight.train}
        onClose={() => beginBadgeCelebration(false)}
        onContinue={() => beginBadgeCelebration(true)}
      />

      <BadgeUnlockModal
        open={badgeQueue.length > 0 && !showPart2Reveal}
        badge={currentBadge}
        queueRemaining={Math.max(0, badgeQueue.length - 1)}
        animationsEnabled={anim}
        onContinue={advanceBadgeQueue}
      />

      <Part2UnlockReveal
        open={showPart2Reveal}
        animationsEnabled={anim}
        onDiscover={() => {
          markPart2UnlockSeen();
          setShowPart2Reveal(false);
          navigate('/');
        }}
      />
    </div>
  );
}

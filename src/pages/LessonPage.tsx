import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { BadgeUnlockModal } from '../components/BadgeUnlockModal';
import { ChallengeCard } from '../components/ChallengeCard';
import { ChapterPageBackground } from '../components/ChapterPageBackground';
import { CompletionModal } from '../components/CompletionModal';
import type { MascotMood } from '../components/ForestMascot';
import { ForestMascot } from '../components/ForestMascot';
import { LessonMascotScene } from '../components/LessonMascotScene';
import { Part2UnlockReveal } from '../components/Part2UnlockReveal';
import { ProgressBar } from '../components/ProgressBar';
import { StarCounter } from '../components/StarCounter';
import { GuidedHelpController } from '../components/guided-help/GuidedHelpController';
import { getHelpPersona } from '../content/personas';
import { getHelpPersonaIdForLesson } from '../content/personaForLesson';
import { useActiveClassLevel } from '../context/ActiveClassLevelContext';
import { badges } from '../data/badges';
import {
  getLesson,
  getLessonsForClassLevel,
  getPart2LessonsForClassLevel,
  getSideMissionsForClassLevel,
} from '../data/lessons';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';
import type { Lesson } from '../types';
import { getAdventureForLesson, isAdventureUnlocked } from '../utils/adventureUnlock';
import { isChallengeComplete, isLessonChallengesComplete } from '../utils/progressSync';
import { TOPIC_LABELS } from '../utils/storage';
import { STREAK_MESSAGES, pickMessage } from '../utils/answers';
import { XP } from '../utils/xpConfig';
import { formatMathText } from '../utils/mathText';

function lessonsInSameArc(lesson: Lesson, classLevel: ReturnType<typeof useActiveClassLevel>): Lesson[] {
  if (!classLevel) return [];
  if (lesson.adventureId === 'side') {
    return getSideMissionsForClassLevel(classLevel);
  }
  const adventure = getAdventureForLesson(lesson.id);
  if (adventure === 'part2' || lesson.adventureId === 'part2') {
    return getPart2LessonsForClassLevel(classLevel);
  }
  return getLessonsForClassLevel(classLevel);
}

function nextLessonInArc(lesson: Lesson, classLevel: ReturnType<typeof useActiveClassLevel>): Lesson | undefined {
  const list = [...lessonsInSameArc(lesson, classLevel)].sort((a, b) => a.order - b.order);
  const i = list.findIndex((l) => l.id === lesson.id);
  return i >= 0 ? list[i + 1] : undefined;
}

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
  const [pendingCompletedIds, setPendingCompletedIds] = useState<string[]>([]);
  const [badgeQueue, setBadgeQueue] = useState<string[]>([]);
  const [finishHint, setFinishHint] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>('normal');
  const [pendingDestination, setPendingDestination] = useState<'home' | 'next' | null>(null);
  const badgesAtVisitStart = useRef(progress.unlockedBadges);

  useEffect(() => {
    setPendingCompletedIds((prev) =>
      prev.filter((id) => !progress.completedChallenges.includes(id)),
    );
  }, [progress.completedChallenges]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [index, lessonId]);

  useEffect(() => {
    if (!lesson) return;
    const firstOpen = lesson.challenges.findIndex(
      (c) => !progress.completedChallenges.includes(c.id),
    );
    setIndex(firstOpen >= 0 ? firstOpen : 0);
    setShowComplete(false);
    setShowPart2Reveal(false);
    setStreakNote(null);
    setOwlSolvedIds([]);
    setRevealHintFor(null);
    setBonusActive(false);
    setPendingCompletedIds([]);
    setFinishHint(null);
    setBadgeQueue([]);
    setPendingDestination(null);
    badgesAtVisitStart.current = progress.unlockedBadges;
    // Only reset when switching lesson route — not on every progress tick
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional lessonId gate
  }, [lessonId]);

  const pendingCompletionIds = useMemo(
    () => [...new Set([...pendingCompletedIds, ...owlSolvedIds])],
    [pendingCompletedIds, owlSolvedIds],
  );

  const isDone = (challengeId: string) =>
    isChallengeComplete(progress, challengeId, pendingCompletionIds);

  const registerChallengeComplete = (
    input: Parameters<typeof completeChallenge>[0],
  ) => {
    setPendingCompletedIds((prev) =>
      prev.includes(input.challengeId) ? prev : [...prev, input.challengeId],
    );
    completeChallenge(input);
  };

  const lessonComplete = lesson
    ? isLessonChallengesComplete(lesson, progress, pendingCompletionIds)
    : false;

  const completedInLesson = lesson
    ? lesson.challenges.filter((c) => isDone(c.id)).length
    : 0;

  const prog = lessonProgress.find((p) => p.lessonId === lessonId);
  const challenge = lesson?.challenges[index];
  const adventure = lesson ? getAdventureForLesson(lesson.id) : 'part1';
  const isPart2 = adventure === 'part2' || lesson?.adventureId === 'part2' || lesson?.adventureId === 'side';

  const storyId = lesson?.storyLessonId ?? lessonId;

  const runeLit = useMemo(() => {
    if (!lesson || storyId !== 'bergmissie') return [];
    return lesson.challenges.map((c) => isDone(c.id));
  }, [lesson, progress.completedChallenges, pendingCompletionIds, storyId]);

  const nightRooms = useMemo(() => {
    if (!lesson || storyId !== 'nachtmissie') return [];
    // First 5 rooms light the moon-paw symbol
    return lesson.challenges.slice(0, 5).map((c) => isDone(c.id));
  }, [lesson, progress.completedChallenges, pendingCompletionIds, storyId]);

  useEffect(() => {
    if (!challenge) {
      setMascotMood('normal');
      return;
    }
    const done = isChallengeComplete(progress, challenge.id, pendingCompletionIds);
    setMascotMood(done ? 'happy' : 'normal');
  }, [challenge?.id, index, lessonId]);

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
  const gateOpen = storyId === 'bergmissie' && runeLit.every(Boolean);
  const owlExternallySolved = owlSolvedIds.includes(challenge.id);
  const anim = settings.animationsEnabled && !settings.calmMode;
  const displayOrder = lesson.order > 100 ? lesson.order - 100 : lesson.order;
  const helpPersona = getHelpPersona(getHelpPersonaIdForLesson(lesson.id));

  const badgesEarnedThisVisit = progress.unlockedBadges.filter(
    (id) => !badgesAtVisitStart.current.includes(id),
  );

  const currentBadge =
    badgeQueue.length > 0 ? (badges.find((b) => b.id === badgeQueue[0]) ?? null) : null;

  const nextLesson = nextLessonInArc(lesson, classLevel);

  const finishAfterCelebration = (destination: 'home' | 'next' | null) => {
    if (
      storyId === 'sterrentempel' &&
      progress.part2Unlocked &&
      !progress.part2UnlockSeen
    ) {
      setShowPart2Reveal(true);
      return;
    }
    if (destination === 'next' && nextLesson) {
      navigate(`/les/${nextLesson.id}`);
      return;
    }
    if (destination === 'home' || destination === 'next') {
      navigate('/');
    }
  };

  const beginBadgeCelebration = (destination: 'home' | 'next') => {
    setShowComplete(false);
    if (badgesEarnedThisVisit.length > 0) {
      setBadgeQueue(badgesEarnedThisVisit);
      setPendingDestination(destination);
      // Prevent re-showing the same badges if they finish another flow later
      badgesAtVisitStart.current = [...progress.unlockedBadges];
      return;
    }
    finishAfterCelebration(destination);
  };

  const advanceBadgeQueue = () => {
    setBadgeQueue((queue) => {
      const rest = queue.slice(1);
      if (rest.length === 0) {
        queueMicrotask(() => finishAfterCelebration(pendingDestination));
      }
      return rest;
    });
  };

  const completionTitle =
    storyId === 'nachtmissie'
      ? 'Nachtwoud Ontdekt'
      : storyId === 'sterrentempel'
        ? 'Boswiskundige Level Up!'
        : `${lesson.areaName} voltooid!`;

  const completionSubtitle =
    storyId === 'nachtmissie'
      ? 'Je hebt het Verborgen Gebied doorkruist. De maanpoot brandt helder.'
      : storyId === 'sterrentempel'
        ? 'Achter de tempel opent een donker pad — Deel II wacht.'
        : lesson.outroStory ?? 'Mooi spoor achtergelaten. Klaar voor het volgende gebied?';

  return (
    <div className={`challenge-shell${isPart2 ? ' theme-night' : ''}`}>
      <ChapterPageBackground storyLessonId={storyId} />
      <div className="lesson-sticky-top">
        <div className="lesson-header">
          <Link to="/" className="btn btn-ghost lesson-header__back">
            ← Kaart
          </Link>
          <div className="lesson-header__titles">
            <h1 className="lesson-header__title">
              {lesson.emoji} {displayOrder}. {lesson.areaName}
            </h1>
            <span className="lesson-header__subtitle muted">{lesson.title}</span>
          </div>
          <div className={`lesson-header__fox${anim ? ' header-fox-float' : ''}`} aria-hidden="true">
            <ForestMascot mood={mascotMood} size={56} />
          </div>
          <StarCounter stars={progress.totalStars} label="sterren totaal" />
        </div>

        <ProgressBar
          value={completedInLesson}
          max={lesson.challenges.length}
          label={`Opdracht ${index + 1} van ${lesson.challenges.length} · ${completedInLesson} pootafdrukken gevonden`}
        />
      </div>

      <p className="muted lesson-stars-note">
        Lessterren: ⭐ {lessonStars}
      </p>

      <LessonMascotScene
        storyLessonId={storyId}
        areaName={lesson.areaName}
        emoji={lesson.emoji}
        color={lesson.color}
        storyText={formatMathText(index === 0 ? lesson.intro : challenge.optionalStory)}
      />

      {!bonusActive && (
        <h2 className="lesson-question">{formatMathText(challenge.question)}</h2>
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

      {storyId === 'bergmissie' && (
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

      {storyId === 'nachtmissie' && (
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

      <div className="lesson-challenge-body">
        {!bonusActive && (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            alreadyStars={progress.challengeStars[challenge.id] ?? 0}
            alreadyCompleted={isDone(challenge.id)}
            externallySolved={owlExternallySolved}
            revealFirstHint={revealHintFor === challenge.id}
            suppressOptionalStory
            hideQuestion
            variant="lesson"
            animationsEnabled={anim}
            onWrong={() => {
              recordWrongAttempt(challenge.topic);
              setMascotMood('thinking');
            }}
            onRetry={() => setMascotMood('normal')}
            onCorrect={({ attempts, usedHint, usedFirstStep }) => {
              setMascotMood('happy');
              registerChallengeComplete({
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
          alreadySolved={isDone(challenge.id)}
          animationsEnabled={anim}
          onConfirmSpend={confirmOwlHelp}
          onHelpSolved={() => {
            setMascotMood('happy');
            registerChallengeComplete({
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
                if (!lessonComplete) {
                  const remaining = lesson.challenges.filter((c) => !isDone(c.id)).length;
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

      <CompletionModal
        open={showComplete && !showPart2Reveal && badgeQueue.length === 0}
        title={completionTitle}
        subtitle={completionSubtitle}
        stars={progress.totalStars}
        challengesSolved={progress.challengesSolved}
        strongTopics={topicInsight.strong}
        trainTopics={topicInsight.train}
        hasNextChapter={Boolean(nextLesson)}
        onClose={() => beginBadgeCelebration('home')}
        onContinue={() => beginBadgeCelebration('next')}
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

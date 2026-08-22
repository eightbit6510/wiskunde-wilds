import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdventureMap } from '../components/AdventureMap';
import { ForestMascot } from '../components/ForestMascot';
import { Part2LockedModal } from '../components/Part2LockedModal';
import { Part2UnlockReveal } from '../components/Part2UnlockReveal';
import { ProgressBar } from '../components/ProgressBar';
import { StarCounter } from '../components/StarCounter';
import {
  part1Lessons,
  part2MainLessons,
  sideMissionLessons,
} from '../data/lessons';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';
import {
  isAdventureUnlocked,
  isPart1Complete,
  PART1_LESSON_IDS,
} from '../utils/adventureUnlock';
import { part1LessonCompletionSummary } from '../utils/progressSync';

export function Dashboard({
  progressApi,
  settingsApi,
}: {
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
}) {
  const { progress, startAdventure, lessonProgress, markPart2UnlockSeen } = progressApi;
  const { settings } = settingsApi;
  const [showLocked, setShowLocked] = useState(false);

  const part1Done = isPart1Complete(progress);
  const part2Open = isAdventureUnlocked('part2', progress);
  const part1Summary = useMemo(() => part1LessonCompletionSummary(progress), [progress]);
  const p1CompleteCount = part1Summary.filter((c) => c.complete).length;

  const showUnlockReveal = part1Done && progress.part2Unlocked && !progress.part2UnlockSeen;

  const totalChallenges = useMemo(
    () =>
      [...part1Lessons, ...(part2Open ? part2MainLessons : [])].reduce(
        (s, l) => s + l.challenges.length,
        0,
      ),
    [part2Open],
  );
  const doneChallenges = progress.completedChallenges.filter((id) =>
    [...part1Lessons, ...part2MainLessons].some((l) => l.challenges.some((c) => c.id === id)),
  ).length;

  return (
    <div className={part2Open ? 'theme-night-soft' : undefined}>
      <section className="hero" aria-labelledby="welcome-title">
        <div className="hero-panel">
          <p className="chip">🐾 Wiskunde Wilds</p>
          <h1 id="welcome-title">Welkom in Wiskunde Wilds</h1>
          <p className="lead">Klaar om je wiskundeskills wakker te maken?</p>
          <p className="subtitle">
            Train je skills. Ontdek patronen. Level up naar VWO 3.
          </p>
          <button
            type="button"
            className="btn btn-large"
            onClick={() => {
              startAdventure();
              document.getElementById('map-title')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {progress.adventureStarted || doneChallenges > 0
              ? 'Ga verder met mijn avontuur'
              : 'Start mijn avontuur'}
          </button>
        </div>
        <div className="card" style={{ display: 'grid', placeItems: 'center' }}>
          <ForestMascot
            mood={doneChallenges > 0 ? 'happy' : 'normal'}
            size={160}
            className="float"
          />
          <p className="muted" style={{ textAlign: 'center', margin: '0.5rem 0 0' }}>
            Jouw bosgids
          </p>
        </div>
      </section>

      <section className="stat-grid" aria-label="Voortgangsoverzicht">
        <div className="stat-card">
          <div className="label">Sterren</div>
          <div className="value">
            <StarCounter stars={progress.totalStars} />
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Sessie-streak</div>
          <div className="value">{progress.sessionStreak}</div>
        </div>
        <div className="stat-card">
          <div className="label">Opgelost</div>
          <div className="value">{progress.challengesSolved}</div>
        </div>
        <div className="stat-card">
          <div className="label">XP</div>
          <div className="value">{progress.totalXp}</div>
        </div>
      </section>

      <div style={{ margin: '1.25rem 0 1.75rem' }}>
        <ProgressBar
          value={doneChallenges}
          max={Math.max(totalChallenges, 1)}
          label="Levelprogressie"
        />
      </div>

      <AdventureMap
        part1Lessons={part1Lessons}
        part2Lessons={part2MainLessons}
        sideMissions={part2Open ? sideMissionLessons : []}
        lessonProgress={lessonProgress}
        part2Unlocked={part2Open}
        part1CompletedCount={p1CompleteCount}
        part1Total={PART1_LESSON_IDS.length}
        onLockedPart2Click={() => setShowLocked(true)}
        sequential
      />

      <p className="muted" style={{ marginTop: '1.5rem' }}>
        Tip: bekijk ook je <Link to="/skills">skills</Link> en{' '}
        <Link to="/badges">badges</Link>, of start een korte{' '}
        <Link to="/train">training</Link>.
      </p>

      <Part2LockedModal
        open={showLocked}
        part1Completed={p1CompleteCount}
        part1Total={PART1_LESSON_IDS.length}
        chapters={part1Summary}
        onClose={() => setShowLocked(false)}
      />

      <Part2UnlockReveal
        open={showUnlockReveal}
        animationsEnabled={settings.animationsEnabled && !settings.calmMode}
        onDiscover={() => {
          markPart2UnlockSeen();
          document.getElementById('map-title')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}

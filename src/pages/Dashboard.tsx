import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdventureMap } from '../components/AdventureMap';
import { CloudSavePanel } from '../components/CloudSavePanel';
import { ForestMascot } from '../components/ForestMascot';
import { ProgressBar } from '../components/ProgressBar';
import { StarCounter } from '../components/StarCounter';
import { getClassLevelLabel } from '../content/classLevels';
import { getLevelManifest } from '../content/levelLoader';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';
import type { PlayerAuthApi } from '../hooks/usePlayerAuth';
import { useActiveLessons } from '../hooks/useActiveLessons';
import { part1LessonCompletionSummary } from '../utils/progressSync';

export function Dashboard({
  progressApi,
  settingsApi,
  authApi,
}: {
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
  authApi: PlayerAuthApi;
}) {
  const { progress, startAdventure, lessonProgress } = progressApi;
  const { session, isLoggedIn } = authApi;
  const { classLevel, lessons, hasLevelContent } = useActiveLessons();
  const [wizardOpen, setWizardOpen] = useState(false);

  const manifest = classLevel ? getLevelManifest(classLevel) : undefined;
  const summary = useMemo(
    () => part1LessonCompletionSummary(progress, lessons),
    [progress, lessons],
  );
  const completeCount = summary.filter((c) => c.complete).length;

  const totalChallenges = useMemo(
    () => lessons.reduce((s, l) => s + l.challenges.length, 0),
    [lessons],
  );
  const doneChallenges = progress.completedChallenges.filter((id) =>
    lessons.some((l) => l.challenges.some((c) => c.id === id)),
  ).length;

  const playerName = session?.player.displayName;
  const hasLegacyBosProgress = progress.completedChallenges.some(
    (id) => id.startsWith('l') || id.startsWith('p2-') || id.startsWith('zij-'),
  );
  const welcomeTitle =
    isLoggedIn && playerName
      ? progress.adventureStarted || doneChallenges > 0
        ? `Welkom terug in Wiskunde Wilds, ${playerName}!`
        : `Welkom in Wiskunde Wilds, ${playerName}!`
      : 'Welkom in Wiskunde Wilds';

  if (!hasLevelContent) {
    return (
      <div>
        <section className="hero" aria-labelledby="welcome-title">
          <div className="hero-panel">
            <p className="chip">🐾 Wiskunde Wilds</p>
            <h1 id="welcome-title">{welcomeTitle}</h1>
            <p className="lead">Kies eerst je jaargroep — dan staat je avontuur klaar.</p>
            <p className="subtitle">
              Sommen en uil-hulp passend bij basisschool, MAVO, HAVO of VWO.
            </p>
            <button type="button" className="btn btn-large" onClick={() => setWizardOpen(true)}>
              Kies mijn jaargroep
            </button>
          </div>
          <div className="card" style={{ display: 'grid', placeItems: 'center' }}>
            <ForestMascot mood="normal" size={160} className="float" />
          </div>
        </section>

        <div className="settings-list" style={{ marginTop: '1.5rem' }}>
          <CloudSavePanel
            authApi={authApi}
            progressApi={progressApi}
            settingsApi={settingsApi}
            forceWizardOpen={wizardOpen}
            onWizardClose={() => setWizardOpen(false)}
            classOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="hero" aria-labelledby="welcome-title">
        <div className="hero-panel">
          <p className="chip">
            🦉 {classLevel ? getClassLevelLabel(classLevel) : 'Wiskunde Wilds'}
          </p>
          <h1 id="welcome-title">{welcomeTitle}</h1>
          <p className="lead">{manifest?.subtitle ?? 'Klaar om je wiskundeskills wakker te maken?'}</p>
          <p className="subtitle">{manifest?.title ?? 'Wiskunde Wilds'}</p>
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
            De Uil wijst je de weg
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
        part1Lessons={lessons}
        part2Lessons={[]}
        lessonProgress={lessonProgress}
        part2Unlocked={false}
        part1CompletedCount={completeCount}
        part1Total={lessons.length}
        onLockedPart2Click={() => {}}
        singleAdventure
        sectionTitle={manifest?.title ?? 'Jouw avontuur'}
        sectionSubtitle={
          classLevel ? `${getClassLevelLabel(classLevel)} — ${manifest?.subtitle ?? ''}` : undefined
        }
        sequential
      />

      <p className="muted" style={{ marginTop: '1.5rem' }}>
        Tip: bekijk ook je <Link to="/skills">skills</Link> en{' '}
        <Link to="/badges">badges</Link>, of start een korte{' '}
        <Link to="/train">training</Link>.
      </p>
      {hasLegacyBosProgress && (
        <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
          Je hebt nog voortgang uit het oude bos-avontuur. Dat blijft bewaard, maar je speelt nu
          jaargroep-sommen — sterren op oude IDs tellen niet mee voor dit avontuur.
        </p>
      )}
    </div>
  );
}

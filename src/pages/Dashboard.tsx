import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdventureMap } from '../components/AdventureMap';
import { PlayerAuthWizard } from '../components/auth/PlayerAuthWizard';
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
  const { classLevel, lessons, part2Lessons, sideMissions, hasLevelContent } = useActiveLessons();
  const [classWizardOpen, setClassWizardOpen] = useState(false);

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

  return (
    <div>
      <section className="hero" aria-labelledby="welcome-title">
        <div className="hero-panel">
          <p className="chip">
            🦉 {classLevel ? getClassLevelLabel(classLevel) : 'Wiskunde Wilds'}
          </p>
          <h1 id="welcome-title">{welcomeTitle}</h1>
          {hasLevelContent ? (
            <>
              <p className="lead">
                {manifest?.subtitle ?? 'Het Ontwaakte Bos wacht — klaar om je wiskundeskills wakker te maken?'}
              </p>
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
            </>
          ) : (
            <>
              <p className="lead">Kies je jaargroep — dan staan je hoofdstukken op de kaart klaar.</p>
              <p className="subtitle">
                Sommen en uil-hulp passend bij basisschool, MAVO, HAVO of VWO.
              </p>
              <button
                type="button"
                className="btn btn-large"
                onClick={() => setClassWizardOpen(true)}
              >
                Kies mijn jaargroep
              </button>
            </>
          )}
        </div>
        <div className="card" style={{ display: 'grid', placeItems: 'center' }}>
          <ForestMascot
            mood={doneChallenges > 0 ? 'happy' : 'normal'}
            size={160}
            className="float"
          />
          <p className="muted" style={{ textAlign: 'center', margin: '0.5rem 0 0' }}>
            {hasLevelContent ? 'De Uil wijst je de weg' : 'De Uil wacht op je jaargroep'}
          </p>
        </div>
      </section>

      {hasLevelContent && (
        <>
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
        </>
      )}

      {hasLevelContent ? (
        <AdventureMap
          part1Lessons={lessons}
          part2Lessons={part2Lessons}
          sideMissions={sideMissions}
          lessonProgress={lessonProgress}
          part2Unlocked={progress.part2Unlocked}
          part1CompletedCount={completeCount}
          part1Total={lessons.length}
          onLockedPart2Click={() => {
            document.getElementById('map-title')?.scrollIntoView({ behavior: 'smooth' });
          }}
          sectionTitle="DEEL I — Het Ontwaakte Bos"
          sectionSubtitle={
            classLevel
              ? `${getClassLevelLabel(classLevel)} — avontuur met sommen op jouw niveau`
              : undefined
          }
          sequential
        />
      ) : (
        <section aria-labelledby="map-title">
          <h2 id="map-title" className="section-title" style={{ marginTop: 0 }}>
            Avonturenkaart
          </h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Kies je jaargroep om alle hoofdstukken te zien.
          </p>
          <div className="card" style={{ marginTop: '1rem' }}>
            <p style={{ marginTop: 0 }}>
              Nog geen jaargroep gekozen. Zodra je die kiest, verschijnen hier je 8 hoofdstukken
              met sommen op jouw niveau.
            </p>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={() => setClassWizardOpen(true)}>
                Kies mijn jaargroep
              </button>
              <Link to="/settings" className="btn btn-secondary">
                Via instellingen
              </Link>
            </div>
          </div>
        </section>
      )}

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

      <PlayerAuthWizard
        open={classWizardOpen}
        onClose={() => setClassWizardOpen(false)}
        classOnly
        authApi={authApi}
        progressApi={progressApi}
        settingsApi={settingsApi}
        progress={progress}
      />
    </div>
  );
}

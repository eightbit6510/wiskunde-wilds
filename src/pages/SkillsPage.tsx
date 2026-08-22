import { Link } from 'react-router-dom';
import { TOPIC_LABELS, TOPICS } from '../utils/storage';
import type { ProgressApi } from '../hooks/useProgress';

function skillPercent(tried: number, first: number, hinted: number, wrong: number): number {
  if (tried === 0 && wrong === 0) return 0;
  const points = first * 3 + hinted * 2;
  const denom = Math.max(tried * 3, points + wrong);
  return Math.round((points / Math.max(1, denom)) * 100);
}

export function SkillsPage({ progressApi }: { progressApi: ProgressApi }) {
  const { progress } = progressApi;

  return (
    <div>
      <h1>Mijn skills</h1>
      <p className="muted">
        Geen cijfers — alleen sporen van waar je al sterk bent, en waar je nog XP kunt pakken.
      </p>

      <div style={{ margin: '1rem 0' }}>
        <Link to="/train" className="btn">
          🐾 Even trainen
        </Link>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        {TOPICS.map((topic) => {
          const stats = progress.topicStats[topic];
          const pct = skillPercent(
            stats.tried,
            stats.firstTryCorrect,
            stats.withHintCorrect,
            stats.wrongAttempts,
          );
          const tip =
            pct >= 70
              ? 'Sterk spoor!'
              : stats.tried === 0
                ? 'Nog niet verkend — hier kun je XP pakken'
                : 'Hier kun je nog XP pakken';

          return (
            <div key={topic} style={{ marginBottom: '1.1rem' }}>
              <div className="skill-row">
                <strong>{TOPIC_LABELS[topic]}</strong>
                <div
                  className="skill-bar"
                  role="meter"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={TOPIC_LABELS[topic]}
                >
                  <div className="skill-fill" style={{ width: `${pct}%` }} />
                </div>
                <span>{pct}%</span>
              </div>
              <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                {tip} · geprobeerd {stats.tried} · direct goed {stats.firstTryCorrect}
              </p>
            </div>
          );
        })}
      </div>

      {(progress.owlHelpUsedCount > 0 || progress.owlBonusSolved > 0) && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem' }}>🦉 Samen leren</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Hulp vragen is slim — daarna zelf oefenen maakt je sterker.
          </p>
          <p style={{ marginBottom: '0.35rem' }}>
            🦉 Samen met de Uil geleerd: {progress.owlHelpUsedCount}
          </p>
          <p style={{ margin: 0 }}>
            🐾 Daarna zelf opgelost: {progress.owlBonusSolved}
            {progress.owlBonusTried > 0
              ? ` (van ${progress.owlBonusTried} bonuspogingen)`
              : ''}
          </p>
        </div>
      )}

      {progress.reviewSolvedCount > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem' }}>🐾 Oude pootafdrukken</h2>
          <p style={{ margin: 0 }}>
            Vertrouwde herhalingen goed opgelost: {progress.reviewSolvedCount}
          </p>
        </div>
      )}
    </div>
  );
}

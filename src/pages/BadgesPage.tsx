import { BadgeCard } from '../components/BadgeCard';
import { badges } from '../data/badges';
import type { ProgressApi } from '../hooks/useProgress';

export function BadgesPage({ progressApi }: { progressApi: ProgressApi }) {
  const { progress } = progressApi;

  return (
    <div>
      <h1>Badges</h1>
      <p className="muted">Verzamel sporen van je avontuur. Badges zijn voor de lol — geen druk.</p>
      <div className="badge-grid" style={{ marginTop: '1rem' }}>
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlocked={progress.unlockedBadges.includes(badge.id)}
          />
        ))}
      </div>
    </div>
  );
}

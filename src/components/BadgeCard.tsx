import type { BadgeDefinition } from '../types';

export function BadgeCard({
  badge,
  unlocked,
}: {
  badge: BadgeDefinition;
  unlocked: boolean;
}) {
  return (
    <article className={`badge-card${unlocked ? ' unlocked' : ''}`}>
      <div className="emoji" aria-hidden="true">
        {badge.emoji}
      </div>
      <h3>{badge.name}</h3>
      <p>{badge.description}</p>
      <p style={{ marginTop: '0.5rem', fontWeight: 700 }}>
        {unlocked ? 'Ontgrendeld' : 'Nog te verdienen'}
      </p>
    </article>
  );
}

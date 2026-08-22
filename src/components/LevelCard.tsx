import { Link } from 'react-router-dom';
import type { Lesson } from '../types';
import { ProgressBar } from './ProgressBar';

interface LevelCardProps {
  lesson: Lesson;
  done: number;
  total: number;
  stars: number;
  completed: boolean;
  locked?: boolean;
}

export function LevelCard({ lesson, done, total, stars, completed, locked }: LevelCardProps) {
  const content = (
    <>
      <div className="level-emoji" style={{ background: `${lesson.color}33` }}>
        {lesson.emoji}
      </div>
      <div className="level-meta">
        <h3>
          {lesson.order > 200
            ? '✦'
            : lesson.order > 100
              ? lesson.order - 100
              : lesson.order}
          . {lesson.areaName}
        </h3>
        <p>{lesson.title}</p>
        {lesson.mapTeaser && !completed && (
          <p className="level-teaser">{lesson.mapTeaser}</p>
        )}
        <div style={{ marginTop: '0.55rem', maxWidth: 220 }}>
          <ProgressBar value={done} max={total} />
        </div>
      </div>
      <div className="level-status">
        {completed ? (
          <div className="done">🐾 Voltooid</div>
        ) : locked ? (
          <div>Nog even…</div>
        ) : (
          <div>
            {done}/{total}
          </div>
        )}
        <div style={{ marginTop: '0.25rem' }}>⭐ {stars}</div>
      </div>
    </>
  );

  if (locked) {
    return (
      <div className="level-card" style={{ opacity: 0.65 }} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link to={`/les/${lesson.id}`} className="level-card">
      {content}
    </Link>
  );
}

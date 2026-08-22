import { Link } from 'react-router-dom';
import type { Lesson } from '../types';
import { LevelCard } from './LevelCard';

interface LessonProg {
  lessonId: string;
  done: number;
  total: number;
  stars: number;
  completed: boolean;
}

interface AdventureMapProps {
  part1Lessons: Lesson[];
  part2Lessons: Lesson[];
  sideMissions?: Lesson[];
  lessonProgress: LessonProg[];
  part2Unlocked: boolean;
  part1CompletedCount: number;
  part1Total: number;
  onLockedPart2Click: () => void;
  sequential?: boolean;
}

function sectionLessons(
  lessons: Lesson[],
  lessonProgress: LessonProg[],
  sequential: boolean,
  forceLocked?: boolean,
  onLockedClick?: () => void,
) {
  return lessons.map((lesson, index) => {
    const prog = lessonProgress.find((p) => p.lessonId === lesson.id);
    const prevProg = lessonProgress.find((p) => p.lessonId === lessons[index - 1]?.id);
    const prevDone =
      index === 0 ||
      !!prevProg?.completed ||
      (prevProg?.done ?? 0) > 0;
    const locked = forceLocked || (sequential && index > 0 && !prevDone);

    if (forceLocked) {
      return (
        <button
          key={lesson.id}
          type="button"
          className="level-card part2-locked-card"
          onClick={onLockedClick}
        >
          <div className="level-emoji" style={{ background: `${lesson.color}44` }}>
            🔒
          </div>
          <div className="level-meta">
            <h3>
              {lesson.order > 100 ? lesson.order - 100 : lesson.order}. {lesson.areaName}
            </h3>
            <p>{lesson.title}</p>
            {lesson.mapTeaser && (
              <p className="level-teaser">{lesson.mapTeaser}</p>
            )}
          </div>
          <div className="level-status">
            <div>Nog gesloten</div>
          </div>
        </button>
      );
    }

    return (
      <LevelCard
        key={lesson.id}
        lesson={lesson}
        done={prog?.done ?? 0}
        total={prog?.total ?? lesson.challenges.length}
        stars={prog?.stars ?? 0}
        completed={prog?.completed ?? false}
        locked={locked}
      />
    );
  });
}

export function AdventureMap({
  part1Lessons,
  part2Lessons,
  sideMissions = [],
  lessonProgress,
  part2Unlocked,
  part1CompletedCount,
  part1Total,
  onLockedPart2Click,
  sequential = true,
}: AdventureMapProps) {
  return (
    <section aria-labelledby="map-title">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 id="map-title" className="section-title" style={{ marginTop: 0 }}>
            Avonturenkaart
          </h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Reis door het magische bos — en misschien verder.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/train" className="btn btn-secondary">
            🐾 Even trainen
          </Link>
          <Link to="/skills" className="btn btn-secondary">
            Mijn skills
          </Link>
        </div>
      </div>

      <h3 className="adventure-section-title">DEEL I — Het Ontwaakte Bos</h3>
      <div className="level-grid">
        {sectionLessons(part1Lessons, lessonProgress, sequential)}
      </div>

      <div className={`part2-gate${part2Unlocked ? ' open' : ''}`}>
        <div className="part2-sky" aria-hidden="true">
          <span className="part2-moon" />
          <span className="part2-star s1" />
          <span className="part2-star s2" />
          <span className="part2-star s3" />
          <span className="part2-star s4" />
          <span className="part2-star s5" />
          <span className="part2-mist" />
        </div>
        <div className="part2-gate-content">
          <h3 className="adventure-section-title night">
            🌙 DEEL II — Het Verborgen Gebied
          </h3>
          <p className="part2-section-lead">
            Nachtelijk bos, maanlicht en oude paden — ontdek wat achter de Sterrentempel ligt.
          </p>
          {!part2Unlocked && (
            <div className="card part2-teaser">
              <p style={{ marginTop: 0, fontWeight: 700 }}>🌙 Een donker bospad</p>
              <p className="muted">
                Er beweegt iets achter de bomen… Voltooi eerst je avontuur in Wiskunde Wilds om
                dit pad te openen.
              </p>
              <p className="chip">
                Deel 1 voltooid: {part1CompletedCount} / {part1Total} gebieden
              </p>
            </div>
          )}
          <div className={`level-grid${part2Unlocked ? '' : ' night-dim'}`}>
            {sectionLessons(
              part2Lessons,
              lessonProgress,
              sequential && part2Unlocked,
              !part2Unlocked,
              onLockedPart2Click,
            )}
          </div>
        </div>
      </div>

      {part2Unlocked && sideMissions.length > 0 && (
        <>
          <h3 className="adventure-section-title">🌿 Zijpaden</h3>
          <p className="muted">Optioneel — voor extra oefening, niet verplicht voor het verhaal.</p>
          <div className="level-grid">
            {sectionLessons(sideMissions, lessonProgress, false)}
          </div>
        </>
      )}
    </section>
  );
}

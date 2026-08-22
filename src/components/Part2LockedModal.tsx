import { OwlMascot } from './owl/OwlMascot';

interface ChapterStatus {
  areaName: string;
  done: number;
  total: number;
  complete: boolean;
}

interface Props {
  open: boolean;
  part1Completed: number;
  part1Total: number;
  chapters?: ChapterStatus[];
  onClose: () => void;
}

export function Part2LockedModal({
  open,
  part1Completed,
  part1Total,
  chapters = [],
  onClose,
}: Props) {
  if (!open) return null;

  const incomplete = chapters.filter((c) => !c.complete);

  return (
    <div className="completion-modal" role="dialog" aria-modal="true" aria-labelledby="p2-lock-title">
      <div className="completion-card night-card">
        <OwlMascot size={72} mood="calm" />
        <h2 id="p2-lock-title">Het pad is nog gesloten</h2>
        <p>Je bent dichtbij.</p>
        <p>
          Eerst moeten alle pootafdrukken van het eerste avontuur gevonden zijn — dus alle
          opdrachten in elk gebied. Daarna kan ik je laten zien wat er achter deze bomen ligt.
        </p>
        <p className="chip">
          Deel 1 voltooid: {part1Completed} / {part1Total} gebieden
        </p>
        {incomplete.length > 0 && (
          <div className="part2-incomplete-list">
            <p style={{ marginBottom: '0.4rem', fontWeight: 700 }}>Nog open:</p>
            <ul>
              {incomplete.map((c) => (
                <li key={c.areaName}>
                  {c.areaName}{' '}
                  <span className="muted">
                    ({c.done}/{c.total})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" className="btn" onClick={onClose}>
          Terug naar mijn avontuur
        </button>
      </div>
    </div>
  );
}

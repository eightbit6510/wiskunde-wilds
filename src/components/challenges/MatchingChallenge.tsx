import type { MatchingPair } from '../../types';

interface Props {
  pairs: MatchingPair[];
  /** map left id -> selected right label */
  selections: Record<string, string>;
  onChange: (leftId: string, right: string) => void;
  disabled?: boolean;
}

export function MatchingChallenge({ pairs, selections, onChange, disabled }: Props) {
  const rights = pairs.map((p) => p.right);

  return (
    <div className="match-grid" role="group" aria-label="Match de paren">
      {pairs.map((pair) => (
        <div className="match-row" key={pair.id}>
          <div className="option-btn" style={{ cursor: 'default' }}>
            {pair.left}
          </div>
          <label className="sr-only" htmlFor={`match-${pair.id}`}>
            Match voor: {pair.left}
          </label>
          <select
            id={`match-${pair.id}`}
            value={selections[pair.id] ?? ''}
            disabled={disabled}
            onChange={(e) => onChange(pair.id, e.target.value)}
          >
            <option value="">Kies…</option>
            {rights.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

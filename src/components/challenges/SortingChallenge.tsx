interface Props {
  items: string[];
  onMove: (index: number, direction: -1 | 1) => void;
  disabled?: boolean;
}

export function SortingChallenge({ items, onMove, disabled }: Props) {
  return (
    <div className="sort-list" role="list" aria-label="Sorteer de items">
      {items.map((item, index) => (
        <div className="sort-item" key={`${item}-${index}`} role="listitem">
          <span>
            {index + 1}. {item}
          </span>
          <div className="sort-controls">
            <button
              type="button"
              aria-label="Omhoog"
              disabled={disabled || index === 0}
              onClick={() => onMove(index, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Omlaag"
              disabled={disabled || index === items.length - 1}
              onClick={() => onMove(index, 1)}
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

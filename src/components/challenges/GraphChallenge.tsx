import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { GraphOption } from '../../types';

interface Props {
  options: GraphOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function GraphChallenge({ options, selected, onSelect, disabled }: Props) {
  return (
    <div className="graph-grid" role="listbox" aria-label="Kies een grafiek">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`graph-option${selected === opt.id ? ' selected' : ''}`}
          role="option"
          aria-selected={selected === opt.id}
          disabled={disabled}
          onClick={() => onSelect(opt.id)}
        >
          <div className="g-label">{opt.label}</div>
          <div style={{ width: '100%', height: 140 }}>
            <ResponsiveContainer>
              <LineChart data={opt.points} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c5d6c0" />
                <XAxis dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#2F4A3A"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </button>
      ))}
    </div>
  );
}

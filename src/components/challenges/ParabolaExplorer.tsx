import { useMemo, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from 'recharts';

interface Props {
  base: 'x2' | 'x2+2';
  xValues: number[];
}

export function ParabolaExplorer({ base, xValues }: Props) {
  const [x, setX] = useState(0);
  const y = base === 'x2+2' ? x * x + 2 : x * x;

  const data = useMemo(
    () =>
      xValues.map((vx) => ({
        x: vx,
        y: base === 'x2+2' ? vx * vx + 2 : vx * vx,
        yBase: vx * vx,
      })),
    [base, xValues],
  );

  return (
    <div className="parabola-panel">
      <div className="x-chips" role="group" aria-label="Kies een x-waarde">
        {xValues.map((vx) => (
          <button
            key={vx}
            type="button"
            className={x === vx ? 'active' : undefined}
            onClick={() => setX(vx)}
          >
            {vx}
          </button>
        ))}
      </div>
      <p style={{ margin: '0 0 0.75rem', fontWeight: 700 }}>
        x = {x} → y = {base === 'x2+2' ? `${x}² + 2` : `${x}²`} = {y}
      </p>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d6c0" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            {base === 'x2+2' && (
              <Line
                type="monotone"
                dataKey="yBase"
                name="y = x²"
                stroke="#9aaa7a"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />
            )}
            <Line
              type="monotone"
              dataKey="y"
              name={base === 'x2+2' ? 'y = x² + 2' : 'y = x²'}
              stroke="#2F4A3A"
              strokeWidth={3}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
            <ReferenceDot x={x} y={y} r={6} fill="#C4784A" stroke="#1E3328" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { HistoricalTelemetryPoint } from '../types';

interface InteractiveChartProps {
  data: HistoricalTelemetryPoint[];
  metricKey: keyof HistoricalTelemetryPoint;
  metricLabel: string;
  metricUnit: string;
  colorHex: string;
  gradientId: string;
  minThreshold?: number;
  maxThreshold?: number;
  yMin?: number;
  yMax?: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  metricKey,
  metricLabel,
  metricUnit,
  colorHex,
  gradientId,
  minThreshold,
  maxThreshold,
  yMin: customYMin,
  yMax: customYMax
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400">
        No telemetry records available for this period.
      </div>
    );
  }

  const values = data.map((d) => Number(d[metricKey]) || 0);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  // Compute scale boundaries
  const yMin = customYMin !== undefined ? customYMin : Math.max(0, Math.floor(dataMin * 0.85));
  const yMax = customYMax !== undefined ? customYMax : Math.ceil(dataMax * 1.15) || 10;
  const yRange = yMax - yMin || 1;

  // Viewbox coordinates
  const width = 600;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const val = Number(d[metricKey]) || 0;
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((val - yMin) / yRange) * chartHeight;
    return { x, y, val, label: d.timeLabel, pumpActive: d.pumpActive, raw: d };
  });

  // Build SVG path
  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    // Smooth Bezier curve control points
    const prev = points[idx - 1];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, '');

  // Closed area path for gradient
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  // Threshold Y calculations
  const minThY = minThreshold !== undefined && minThreshold >= yMin && minThreshold <= yMax
    ? paddingTop + chartHeight - ((minThreshold - yMin) / yRange) * chartHeight
    : null;

  const maxThY = maxThreshold !== undefined && maxThreshold >= yMin && maxThreshold <= yMax
    ? paddingTop + chartHeight - ((maxThreshold - yMin) / yRange) * chartHeight
    : null;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="relative w-full select-none">
      {/* Chart Top Stat readout */}
      <div className="flex items-baseline justify-between mb-2 px-1">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{metricLabel}</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              {activePoint.val.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">{metricUnit}</span>
            {activePoint.label && (
              <span className="text-[11px] text-slate-400 ml-2">
                @ {activePoint.label}
              </span>
            )}
          </div>
        </div>

        {/* Legend / Range info */}
        {(minThreshold !== undefined || maxThreshold !== undefined) && (
          <div className="text-right text-[11px] text-slate-500">
            <span className="text-[10px] text-slate-400 block font-medium">Safe Zone</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {minThreshold ?? 0} – {maxThreshold ?? 100} {metricUnit}
            </span>
          </div>
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-xl bg-white border border-slate-100 p-2 shadow-sm">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * width;
            let closestIdx = 0;
            let minDist = Infinity;
            points.forEach((p, idx) => {
              const d = Math.abs(p.x - mouseX);
              if (d < minDist) {
                minDist = d;
                closestIdx = idx;
              }
            });
            setHoverIndex(closestIdx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              const touchX = ((e.touches[0].clientX - rect.left) / rect.width) * width;
              let closestIdx = 0;
              let minDist = Infinity;
              points.forEach((p, idx) => {
                const d = Math.abs(p.x - touchX);
                if (d < minDist) {
                  minDist = d;
                  closestIdx = idx;
                }
              });
              setHoverIndex(closestIdx);
            }
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorHex} stopOpacity="0.35" />
              <stop offset="90%" stopColor={colorHex} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingTop + chartHeight * pct;
            const valLabel = (yMax - pct * yRange).toFixed(yRange < 5 ? 1 : 0);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* Safe Threshold Band */}
          {minThY !== null && maxThY !== null && (
            <rect
              x={paddingLeft}
              y={Math.min(minThY, maxThY)}
              width={chartWidth}
              height={Math.abs(minThY - maxThY)}
              fill="#10b981"
              fillOpacity="0.05"
            />
          )}

          {/* Min threshold line */}
          {minThY !== null && (
            <line
              x1={paddingLeft}
              y1={minThY}
              x2={width - paddingRight}
              y2={minThY}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth="1.2"
              opacity="0.8"
            />
          )}

          {/* Max threshold line */}
          {maxThY !== null && (
            <line
              x1={paddingLeft}
              y1={maxThY}
              x2={width - paddingRight}
              y2={maxThY}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth="1.2"
              opacity="0.8"
            />
          )}

          {/* Filled Area */}
          <path d={areaD} fill={`url(#${gradientId})`} />

          {/* Main Stroke Line */}
          <path d={pathD} fill="none" stroke={colorHex} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Active pointer guide line */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={paddingTop + chartHeight}
                stroke="#64748b"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill={colorHex}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* X Axis Time Labels */}
          {points.map((p, idx) => {
            // Only show sparse labels to prevent crowding
            const showEvery = Math.ceil(points.length / 6);
            if (idx % showEvery === 0 || idx === points.length - 1) {
              return (
                <text
                  key={idx}
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="sans-serif"
                >
                  {p.label}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
};

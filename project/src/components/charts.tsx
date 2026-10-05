import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/* Lightweight SVG charts — no external dependency. Premium-styled with gradients + glow. */

export function LineChart({
  data,
  labels,
  color = '#6366f1',
  height = 200,
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) {
  const w = 560;
  const h = height;
  const pad = 30;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1 || 1);
  const pts = data.map((d, i) => {
    const x = pad + i * step;
    const y = h - pad - ((d - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${path} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  const id = `lc-${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="currentColor" className="text-slate-200 dark:text-white/[0.06]" strokeWidth="1" strokeDasharray={t > 0 && t < 1 ? '4 4' : '0'} />
      ))}
      <motion.path d={area} fill={`url(#${id})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="3.5"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
          className="drop-shadow"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 + i * 0.04 }}
        />
      ))}
      {labels && labels.map((l, i) => (
        <text key={i} x={pad + i * step} y={h - 8} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: 9 }}>{l}</text>
      ))}
    </svg>
  );
}

export function BarChart({
  data,
  labels,
  color = '#3b82f6',
  height = 200,
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}) {
  const w = 560;
  const h = height;
  const pad = 30;
  const max = Math.max(...data, 1);
  const bw = (w - pad * 2) / data.length;
  const id = `bc-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="currentColor" className="text-slate-200 dark:text-white/[0.06]" strokeWidth="1" strokeDasharray={t > 0 && t < 1 ? '4 4' : '0'} />
      ))}
      {data.map((d, i) => {
        const bh = (d / max) * (h - pad * 2);
        const x = pad + i * bw + bw * 0.18;
        const y = h - pad - bh;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={bw * 0.64}
            height={bh}
            rx="5"
            fill={`url(#${id})`}
            initial={{ height: 0, y: h - pad }}
            animate={{ height: bh, y }}
            transition={{ delay: i * 0.04, duration: 0.6, ease: 'easeOut' }}
          />
        );
      })}
      {labels && labels.map((l, i) => (
        <text key={i} x={pad + i * bw + bw / 2} y={h - 8} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500" style={{ fontSize: 9 }}>{l}</text>
      ))}
    </svg>
  );
}

export function DonutChart({
  segments,
  size = 170,
  thickness = 24,
  centerLabel,
  centerValue,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: ReactNode;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${c}` }}
              animate={{ strokeDasharray: dash }}
              transition={{ duration: 1, delay: i * 0.12 }}
            />
          );
          offset += len;
          return el;
        })}
        {centerValue && (
          <text x={size / 2} y={size / 2 - 2} textAnchor="middle" className="rotate-90 fill-slate-900 dark:fill-white" style={{ fontSize: 24, fontWeight: 700, transformOrigin: 'center' }}>{centerValue}</text>
        )}
        {centerLabel && (
          <text x={size / 2} y={size / 2 + 18} textAnchor="middle" className="rotate-90 fill-slate-400 dark:fill-slate-500" style={{ fontSize: 9, transformOrigin: 'center' }}>{centerLabel}</text>
        )}
      </svg>
      <div className="space-y-2.5">
        {segments.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2.5 text-sm"
          >
            <span className="h-3 w-3 rounded-full shadow-glow" style={{ background: s.color }} />
            <span className="text-slate-600 dark:text-slate-300">{s.label}</span>
            <span className="text-slate-400 ml-auto font-medium tabular-nums">{s.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ChartCard({ title, children, action, accent = 'from-cyber-500 to-quantum-500' }: { title: string; children: ReactNode; action?: ReactNode; accent?: string }) {
  return (
    <div className="glass-glow rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${accent}`} />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/* Radial progress ring — used for success rates */
export function RadialProgress({
  value,
  size = 120,
  thickness = 10,
  label,
  color = '#6366f1',
}: {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  color?: string;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth={thickness} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c}` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}%</span>
        {label && <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

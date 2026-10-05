import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { AnimatedCounter, GlowEmptyState } from '@/components/premium';

export function GlassCard({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass-glow rounded-2xl ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-lg' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'from-cyber-500 to-quantum-500',
  delay = 0,
  sub,
  animate = true,
}: {
  label: string;
  value: ReactNode;
  icon: React.ElementType;
  accent?: string;
  delay?: number;
  sub?: string;
  animate?: boolean;
}) {
  const numeric = typeof value === 'number';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <GlassCard hover className="p-5 relative overflow-hidden group">
        <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500`} />
        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {numeric && animate ? <AnimatedCounter value={value as number} /> : value}
            </p>
            {sub && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            className={`rounded-xl bg-gradient-to-br ${accent} p-2.5 shadow-glow`}
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'quantum' | 'cyan';
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    info: 'bg-cyber-100 text-cyber-700 dark:bg-cyber-500/15 dark:text-cyber-300',
    quantum: 'bg-quantum-100 text-quantum-700 dark:bg-quantum-500/15 dark:text-quantum-300',
    cyan: 'bg-aqua-100 text-aqua-700 dark:bg-aqua-500/15 dark:text-aqua-300',
  };
  return <span className={`badge ${tones[tone]}`}>{children}</span>;
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-slate-900 dark:text-white"
      >
        {title}
      </motion.h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return <GlowEmptyState icon={icon} title={title} subtitle={subtitle} />;
}

/* Search input with icon — reused across dashboards */
export function SearchInput({
  value,
  onChange,
  placeholder,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}) {
  return (
    <div className="relative flex-1">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-quantum-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        className="input pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
      />
    </div>
  );
}

/* Filter pill toggle */
export function FilterPills({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            value === o.value
              ? 'bg-gradient-to-r from-cyber-500 to-quantum-500 text-white shadow-glow'
              : 'glass text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

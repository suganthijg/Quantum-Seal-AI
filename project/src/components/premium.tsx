import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

/* Animated counter that tweens from 0 to target on mount */
export function AnimatedCounter({
  value,
  duration = 1.1,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* Button with a ripple effect on click */
export function RippleButton({
  children,
  className = '',
  onClick,
  disabled,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  };
  return (
    <button className={className} onClick={handle} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

/* Skeleton placeholder for loading states */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

/* Animated quantum particle field — floating dots with connecting glow */
export function QuantumParticles({ count = 28 }: { count?: number }) {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 8,
      hue: Math.random() > 0.5 ? '#6366f1' : '#22d3ee',
    })),
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 ${p.size * 3}px ${p.hue}`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* A stepped verification sequence animation.
   Pass steps as an array of labels; each completes ~700ms apart. */
export function VerificationSequence({
  steps,
  active,
  onComplete,
}: {
  steps: string[];
  active: boolean;
  onComplete?: () => void;
}) {
  const [current, setCurrent] = useState(-1);

  useEffect(() => {
    if (!active) {
      setCurrent(-1);
      return;
    }
    let i = 0;
    setCurrent(0);
    const interval = setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        clearInterval(interval);
        onComplete?.();
      } else {
        setCurrent(i);
      }
    }, 750);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const done = i < current;
        const running = i === current;
        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="shrink-0">
              {done ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </motion.div>
              ) : running ? (
                <Loader2 className="h-5 w-5 text-quantum-500 animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-white/15" />
              )}
            </div>
            <span
              className={`text-sm transition-colors ${
                done ? 'text-slate-500 dark:text-slate-400 line-through' : running ? 'text-quantum-600 dark:text-quantum-300 font-medium' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {step}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* Generic animated entrance wrapper for page content */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

/* Staggered list container + item */
export function StaggerItem({ children, index = 0, className = '' }: { children: ReactNode; index?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Empty-state with a glowing icon */
export function GlowEmptyState({ icon: Icon, title, subtitle }: { icon: ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="rounded-2xl bg-gradient-to-br from-cyber-500/15 to-quantum-500/15 p-5 mb-4 relative"
      >
        <div className="absolute inset-0 rounded-2xl bg-quantum-500/20 blur-xl" />
        <Icon className="h-9 w-9 text-quantum-500 relative" />
      </motion.div>
      <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xs">{subtitle}</p>}
    </div>
  );
}

/* Fade-in wrapper used for route-level transitions */
export function FadeIn({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

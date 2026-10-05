import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Logo({ size = 'md', withText = true }: { size?: 'sm' | 'md' | 'lg'; withText?: boolean }) {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.6 }}
        style={{ width: dim, height: dim }}
        className="relative shrink-0"
      >
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow">
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill="url(#logo-g)" />
          <path d="M20 8c-2.5 3.8-6.2 5.6-6.2 11.2S17.5 26 20 32c2.5-6 6.2-7.8 6.2-12.8S22.5 11.8 20 8z" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="3" fill="#fff" />
        </svg>
      </motion.div>
      {withText && (
        <div className="leading-none">
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            Quantum<span className="gradient-text">Seal</span>
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-quantum-500">AI</span>
        </div>
      )}
    </Link>
  );
}

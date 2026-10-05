import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Factory, Store, User, ShieldCheck, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { QuantumParticles } from '@/components/premium';
import type { Role } from '@/lib/types';

const roles: { role: Role; title: string; desc: string; icon: typeof Factory; accent: string; glow: string; path: string }[] = [
  { role: 'manufacturer', title: 'Manufacturer', desc: 'Register products and generate quantum identities with cryptographic signatures.', icon: Factory, accent: 'from-cyber-500 to-quantum-500', glow: 'shadow-glow', path: '/manufacturer' },
  { role: 'retailer', title: 'Retailer', desc: 'Receive, verify and transfer products across your inventory network.', icon: Store, accent: 'from-emerald-500 to-cyber-500', glow: 'shadow-glow-emerald', path: '/retailer' },
  { role: 'customer', title: 'Customer', desc: 'Scan QR codes and verify product authenticity instantly.', icon: User, accent: 'from-quantum-500 to-purple-500', glow: 'shadow-glow', path: '/customer' },
  { role: 'admin', title: 'Admin', desc: 'Monitor users, products, fraud alerts and platform analytics.', icon: ShieldCheck, accent: 'from-rose-500 to-quantum-600', glow: 'shadow-glow-rose', path: '/admin' },
];

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-grid-light dark:bg-grid-dark bg-[size:36px_36px] relative flex flex-col">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-quantum-500/25 blur-[130px]" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyber-500/20 blur-[130px]" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>

      <header className="relative px-6 py-5 flex items-center justify-between">
        <Logo />
        <Link to="/" className="btn-ghost text-sm group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
      </header>

      <div className="relative flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-quantum-600 dark:text-quantum-300 mb-4">
              <Sparkles className="h-4 w-4" /> Choose your portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold">Select your role</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">No authentication required — select a role to enter that dashboard directly.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {roles.map((r, i) => (
              <motion.button
                key={r.role}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(r.path)}
                className="glass-glow rounded-2xl p-6 text-left group relative overflow-hidden"
              >
                <div className={`absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${r.accent} opacity-20 blur-2xl group-hover:opacity-50 transition-opacity duration-500`} />
                <QuantumParticles count={6} />
                <div className="relative flex items-start gap-4">
                  <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className={`rounded-2xl bg-gradient-to-br ${r.accent} p-3.5 ${r.glow} shrink-0`}>
                    <r.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{r.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{r.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-quantum-600 dark:text-quantum-300 group-hover:gap-2.5 transition-all">
                      Enter dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <p className="text-center mt-10 text-xs text-slate-400">This is a hackathon prototype. All data is simulated and stored locally in your browser.</p>
        </div>
      </div>
    </div>
  );
}

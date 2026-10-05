import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Fingerprint, Boxes, Link2, BrainCircuit, QrCode, BarChart3, ArrowRight,
  Factory, Cpu, KeyRound, ScanLine, Store, PackageCheck, CheckCircle2, Sun, Moon, Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useTheme } from '@/lib/useTheme';
import { QuantumParticles } from '@/components/premium';

const features = [
  { icon: Fingerprint, title: 'Quantum Digital Signature', desc: 'Tamper-proof cryptographic identity generated per product using simulated quantum-resistant algorithms.' },
  { icon: Boxes, title: 'Digital Product Twin', desc: 'A unique digital replica of every physical product, anchored on-chain for lifecycle traceability.' },
  { icon: Link2, title: 'Blockchain Traceability', desc: 'Immutable ledger records every handover — manufacture, transfer, verification, sale.' },
  { icon: BrainCircuit, title: 'AI Fraud Detection', desc: 'Real-time risk scoring flags duplicate scans, location anomalies, and signature mismatches.' },
  { icon: QrCode, title: 'Secure QR Verification', desc: 'Each product carries a cryptographically-bound QR code for instant authenticity checks.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Live insights into registrations, verifications, counterfeit attempts, and regional risk.' },
];

const flow = [
  { icon: Factory, label: 'Manufacturer' },
  { icon: Cpu, label: 'Quantum Engine' },
  { icon: KeyRound, label: 'Quantum Signature' },
  { icon: QrCode, label: 'Secure QR' },
  { icon: PackageCheck, label: 'Store Product' },
  { icon: ScanLine, label: 'Retailer Verification' },
  { icon: Store, label: 'Customer Scan' },
  { icon: CheckCircle2, label: 'Authenticity Result' },
];

export default function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-grid-light dark:bg-grid-dark bg-[size:36px_36px] relative overflow-x-hidden">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-quantum-500/25 blur-[130px]" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute top-1/4 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyber-500/20 blur-[140px]" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-aqua-500/15 blur-[120px]" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 12, repeat: Infinity }} />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/40 dark:bg-white/[0.03] border-b border-white/40 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-quantum-500 transition">Features</a>
            <a href="#how" className="hover:text-quantum-500 transition">How it works</a>
            <Link to="/login" className="hover:text-quantum-500 transition">Sign in</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition">
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-quantum-500" />}
            </button>
            <Link to="/login" className="btn-primary text-sm hidden sm:inline-flex">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-24 text-center">
        <QuantumParticles count={24} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-quantum-600 dark:text-quantum-300 mb-8 relative">
          <ShieldCheck className="h-4 w-4" />
          Quantum-Resistant Product Provenance · Hackathon Prototype
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }} className="text-5xl sm:text-7xl font-bold tracking-tight text-balance relative">
          <span className="gradient-text">QuantumSeal AI</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="mt-4 text-xl sm:text-2xl font-medium text-slate-700 dark:text-slate-200 relative">
          Quantum Authenticated Product Provenance
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 text-balance relative">
          Prevent counterfeit products using Quantum Digital Signatures, Digital Product Twins, AI Fraud Detection, Blockchain Traceability and Secure QR Verification.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          <Link to="/login" className="btn-primary text-base px-7 py-3 group">
            Login <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#how" className="btn-ghost text-base px-7 py-3">Learn More</a>
        </motion.div>

        {/* hero visual — animated product authentication workflow */}
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.4 }} className="mt-16 relative max-w-4xl mx-auto">
          <div className="glass-strong rounded-3xl p-6 sm:p-10 shadow-glow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-500/10 via-transparent to-quantum-500/10" />
            <QuantumParticles count={12} />
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: KeyRound, label: 'Quantum Token', value: 'QT-8F92-AB7C-9D12-XP41' },
                { icon: Fingerprint, label: 'Signature', value: 'QDS-7BFD892A…' },
                { icon: Link2, label: 'Blockchain', value: '0x4a9f…c21b' },
                { icon: ShieldCheck, label: 'Status', value: 'AUTHENTIC' },
              ].map((c, i) => (
                <motion.div key={c.label} className="glass rounded-2xl p-4 text-left relative" animate={{ y: [0, -6, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}>
                  <c.icon className="h-5 w-5 text-quantum-500 mb-2" />
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{c.label}</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate">{c.value}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-500 font-medium relative">
              <motion.span className="h-2 w-2 rounded-full bg-emerald-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              Quantum signature verified · Blockchain record intact
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-quantum-600 dark:text-quantum-300 mb-4">
            <Sparkles className="h-4 w-4" /> Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold">A complete anti-counterfeit stack</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Six interlocking layers of quantum-grade security, from cryptographic identity to live fraud intelligence.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass-glow rounded-2xl p-6 group hover:-translate-y-1.5 transition-all duration-300">
              <div className="rounded-xl bg-gradient-to-br from-cyber-500/15 to-quantum-500/15 p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-quantum-500" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works — animated workflow */}
      <section id="how" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-quantum-600 dark:text-quantum-300 mb-4">
            <Cpu className="h-4 w-4" /> The Quantum Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">From factory floor to customer scan — every step is cryptographically sealed.</p>
        </motion.div>
        <div className="flex flex-col items-center gap-3">
          {flow.map((step, i) => (
            <motion.div key={step.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="flex flex-col items-center">
              <motion.div whileHover={{ scale: 1.03 }} className="glass-glow rounded-2xl px-6 py-4 flex items-center gap-3 min-w-[260px] hover:shadow-glow transition-all">
                <div className="rounded-lg bg-gradient-to-br from-cyber-500 to-quantum-500 p-2 shadow-glow">
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-slate-800 dark:text-white">{step.label}</span>
                <span className="ml-auto text-xs font-mono text-quantum-500">0{i + 1}</span>
              </motion.div>
              {i < flow.length - 1 && (
                <motion.div initial={{ height: 0 }} whileInView={{ height: 28 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }} className="w-px bg-gradient-to-b from-quantum-400 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20">
        <div className="glass-strong rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-500/15 via-quantum-500/10 to-purple-500/15" />
          <QuantumParticles count={16} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to explore the prototype?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Choose a role and jump straight into a working dashboard.</p>
            <Link to="/login" className="btn-primary mt-8 text-base px-8 py-3 group">
              Enter the Portal <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/40 dark:border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo />
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">QuantumSeal AI · Hackathon Prototype · Simulated quantum & blockchain</p>
            <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
              <a href="#features" className="hover:text-quantum-500 transition">Features</a>
              <a href="#how" className="hover:text-quantum-500 transition">How it works</a>
              <Link to="/login" className="hover:text-quantum-500 transition">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, Upload, Search, ShieldCheck, ShieldAlert, Fingerprint, KeyRound, Link2, Factory,
  CalendarDays, MapPin, BadgeCheck, BrainCircuit, Download, Share2, CheckCircle2, XCircle, Package, Clock, Award,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { GlassCard, SectionTitle, Badge, EmptyState } from '@/components/ui';
import { RippleButton, VerificationSequence } from '@/components/premium';
import { QRCertificate } from '@/components/QRCertificate';
import { useToast } from '@/components/Toast';
import { db } from '@/lib/db';
import { formatDate, formatDateTime, downloadCanvas } from '@/lib/helpers';
import type { Product } from '@/lib/types';

const nav = [{ label: 'Verify Product', path: '/customer', icon: ScanLine }];

const VERIFY_STEPS = [
  'Scanning QR…',
  'Validating Quantum Signature…',
  'Checking Blockchain…',
  'Running AI Fraud Detection…',
  'Verification Complete',
];

export default function Customer() {
  return (
    <DashboardLayout role="customer" nav={nav} userName="Demo Customer">
      <Scanner />
    </DashboardLayout>
  );
}

type Result =
  | { kind: 'authentic'; product: Product }
  | { kind: 'counterfeit'; reason: string };

function Scanner() {
  const products = db.useDB().products;
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  const verify = (id: string) => {
    if (!id.trim()) { notify('Enter a Product ID or upload a QR', 'warning'); return; }
    setPhase('scanning');
    setResult(null);
  };

  const onSequenceComplete = () => {
    const id = query;
    const p = products.find((x) => x.id.toLowerCase() === id.trim().toLowerCase() || x.twinId.toLowerCase() === id.trim().toLowerCase());
    setPhase('done');
    if (p) {
      db.incrementVerification(p.id, 'Customer Location');
      db.addVerification({
        id: 'V-' + Math.random().toString(36).slice(2, 8), productId: p.id, productName: p.productName,
        verifier: 'Demo Customer', role: 'customer', result: 'Authentic', location: 'Customer Location', timestamp: new Date().toISOString(),
      });
      setResult({ kind: 'authentic', product: db.getState().products.find((x) => x.id === p.id)! });
      notify('Product verified — Authentic', 'success');
    } else {
      const reasons = ['Product Not Registered', 'Quantum Signature Invalid', 'Blockchain Record Missing'];
      setResult({ kind: 'counterfeit', reason: reasons[Math.floor(Math.random() * reasons.length)] });
      db.addVerification({
        id: 'V-' + Math.random().toString(36).slice(2, 8), productId: id, productName: 'Unknown',
        verifier: 'Demo Customer', role: 'customer', result: 'Counterfeit', location: 'Customer Location', timestamp: new Date().toISOString(),
      });
      notify('Counterfeit product detected', 'error');
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    notify('QR image received — enter the Product ID to verify (simulated decode)', 'info');
    setQuery('');
  };

  const downloadCert = () => {
    const canvas = certRef.current?.querySelector('canvas');
    downloadCanvas(canvas, `quantumseal-cert-${result?.kind === 'authentic' ? result.product.id : 'qr'}.png`);
  };

  return (
    <div>
      <SectionTitle title="Verify Product" subtitle="Upload a QR image or enter a Product ID to check authenticity." />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <GlassCard className="p-6">
          <div className="relative aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-cyber-500/10 via-quantum-500/10 to-purple-500/10 border border-white/40 dark:border-white/10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === 'scanning' ? (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-56 h-56">
                    {/* corner brackets */}
                    <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-quantum-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-quantum-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-quantum-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-quantum-400 rounded-br-lg" />
                    <motion.div
                      className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-aqua-400 to-transparent shadow-glow-cyan"
                      initial={{ top: '4%' }}
                      animate={{ top: ['4%', '96%', '4%'] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <ScanLine className="absolute inset-0 m-auto h-16 w-16 text-quantum-500 animate-pulse" />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center p-6">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} className="rounded-2xl bg-white/60 dark:bg-white/5 p-6 w-fit mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-2xl bg-quantum-500/20 blur-xl" />
                    <ScanLine className="h-12 w-12 text-quantum-500 relative" />
                  </motion.div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">Ready to scan</p>
                  <p className="text-sm text-slate-500 mt-1">Upload a QR image or enter a Product ID below</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-quantum-500" />
                <input className="input pl-10" placeholder="Enter Product ID (e.g. PRD-…)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && verify(query)} />
              </div>
              <RippleButton className="btn-primary" onClick={() => verify(query)} disabled={phase === 'scanning'}><ScanLine className="h-4 w-4" /> Verify</RippleButton>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            <RippleButton className="btn-ghost w-full" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Upload QR Image</RippleButton>
            <p className="text-xs text-slate-500 text-center">Tip: copy a Product ID from the Manufacturer dashboard to verify an authentic product. Enter a random ID to see a counterfeit result.</p>
          </div>
        </GlassCard>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {phase === 'scanning' && (
              <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-8">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-quantum-500/20" />
                    <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-quantum-500" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                    <BrainCircuit className="absolute inset-0 m-auto h-8 w-8 text-quantum-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white text-center mb-5">Quantum Verification</h3>
                  <VerificationSequence steps={VERIFY_STEPS} active={phase === 'scanning'} onComplete={onSequenceComplete} />
                </GlassCard>
              </motion.div>
            )}

            {phase === 'done' && result?.kind === 'authentic' && (
              <AuthenticResult key="a" product={result.product} certRef={certRef} onDownload={downloadCert} />
            )}
            {phase === 'done' && result?.kind === 'counterfeit' && (
              <CounterfeitResult key="c" reason={result.reason} />
            )}
            {phase === 'idle' && (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard className="p-10 text-center">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} className="rounded-2xl bg-gradient-to-br from-cyber-500/15 to-quantum-500/15 p-5 w-fit mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-2xl bg-quantum-500/20 blur-xl" />
                    <ShieldCheck className="h-9 w-9 text-quantum-500 relative" />
                  </motion.div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">Awaiting verification</p>
                  <p className="text-sm text-slate-500 mt-1">Your authenticity result will appear here.</p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AuthenticResult({ product, certRef, onDownload }: { product: Product; certRef: React.RefObject<HTMLDivElement>; onDownload: () => void }) {
  const timeline = [
    { icon: Factory, label: 'Manufactured', detail: product.manufacturerName, time: formatDate(product.manufacturingDate) },
    { icon: Package, label: 'Registered', detail: 'Quantum Engine', time: formatDate(product.registrationTimestamp) },
    { icon: ShieldCheck, label: 'Verified', detail: 'Retailer', time: formatDate(product.timeline[2]?.timestamp ?? product.registrationTimestamp) },
    { icon: BadgeCheck, label: 'Retailer', detail: product.currentOwner, time: product.currentLocation },
    { icon: KeyRound, label: 'Customer', detail: 'You', time: formatDateTime(new Date().toISOString()) },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="p-6">
        <div className="flex flex-col items-center text-center mb-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="rounded-full bg-emerald-500/15 p-4 mb-3 relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl animate-pulseGlow" />
            <CheckCircle2 className="h-12 w-12 text-emerald-500 relative" />
          </motion.div>
          <Badge tone="success"><ShieldCheck className="h-3.5 w-3.5" /> AUTHENTIC</Badge>
          <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{product.productName}</h3>
          <p className="text-sm text-slate-500">{product.brand} · {product.category}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Detail icon={Package} label="Manufacturer" value={product.manufacturerName} />
          <Detail icon={KeyRound} label="Product ID" value={product.id} mono />
          <Detail icon={BadgeCheck} label="Batch Number" value={product.batchNumber} />
          <Detail icon={CalendarDays} label="Manufacturing Date" value={formatDate(product.manufacturingDate)} />
          <Detail icon={CalendarDays} label="Expiry Date" value={formatDate(product.expiryDate)} />
          <Detail icon={MapPin} label="Factory" value={product.factoryLocation} />
          <Detail icon={Fingerprint} label="Digital Product Twin ID" value={product.twinId} mono />
          <Detail icon={KeyRound} label="Quantum Token" value={product.quantumToken} mono />
          <Detail icon={Fingerprint} label="Quantum Digital Signature" value={product.quantumSignature.slice(0, 32) + '…'} mono />
          <Detail icon={Link2} label="Blockchain Transaction" value={product.blockchainTx} mono />
          <Detail icon={Clock} label="Verification Timestamp" value={formatDateTime(new Date().toISOString())} />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <Score label="Authenticity Score" value="100%" tone="success" />
          <Score label="AI Fraud Risk" value="Low" tone="success" />
          <Score label="Blockchain" value="Verified" tone="success" />
        </div>

        {/* Premium certificate */}
        <div className="mt-6">
          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-quantum-500" /> Authenticity Certificate</h4>
          <div className="flex justify-center overflow-x-auto no-scrollbar">
            <div ref={certRef}><QRCertificate product={product} /></div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3">Product Timeline</h4>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-lg bg-gradient-to-br from-cyber-500 to-quantum-500 p-1.5 shadow-glow"><t.icon className="h-3.5 w-3.5 text-white" /></div>
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-quantum-400/50 to-transparent my-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{t.label}</p>
                  <p className="text-xs text-slate-500">{t.detail} · {t.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <RippleButton className="btn-primary flex-1" onClick={onDownload}><Download className="h-4 w-4" /> Download Certificate</RippleButton>
          <RippleButton className="btn-ghost flex-1" onClick={() => { navigator.clipboard?.writeText(`${product.productName} verified AUTHENTIC by QuantumSeal AI`); }}><Share2 className="h-4 w-4" /> Share Result</RippleButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function CounterfeitResult({ reason }: { reason: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="p-6">
        <div className="flex flex-col items-center text-center mb-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="rounded-full bg-rose-500/15 p-4 mb-3 relative">
            <div className="absolute inset-0 rounded-full bg-rose-500/30 blur-xl animate-pulseGlow" />
            <XCircle className="h-12 w-12 text-rose-500 relative" />
          </motion.div>
          <Badge tone="danger"><ShieldAlert className="h-3.5 w-3.5" /> COUNTERFEIT PRODUCT</Badge>
        </div>
        <div className="space-y-3">
          <Detail icon={ShieldAlert} label="Reason" value={reason} />
          <Detail icon={BrainCircuit} label="AI Risk" value="High" />
          <div className="rounded-xl bg-rose-500/10 border border-rose-400/30 p-4">
            <p className="text-sm font-medium text-rose-600 dark:text-rose-300">Recommendation</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Do Not Purchase — this product failed quantum authentication and is not recorded on the blockchain.</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Detail({ icon: Icon, label, value, mono }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="rounded-lg bg-quantum-500/10 p-1.5 shrink-0"><Icon className="h-3.5 w-3.5 text-quantum-500" /></div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        <p className={`text-sm text-slate-700 dark:text-slate-200 break-all ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

function Score({ label, value, tone }: { label: string; value: string; tone: 'success' | 'danger' }) {
  return (
    <div className={`rounded-xl p-3 text-center ${tone === 'success' ? 'bg-emerald-500/10 border border-emerald-400/30' : 'bg-rose-500/10 border border-rose-400/30'}`}>
      <p className={`text-lg font-bold ${tone === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

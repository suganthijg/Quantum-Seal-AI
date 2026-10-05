import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackagePlus, Sparkles, KeyRound, Fingerprint, Link2, QrCode, Clock, CheckCircle2, Download, Printer, Award } from 'lucide-react';
import { GlassCard, SectionTitle, Badge } from '@/components/ui';
import { RippleButton } from '@/components/premium';
import { VerificationSequence } from '@/components/premium';
import { QRCertificate } from '@/components/QRCertificate';
import { useToast } from '@/components/Toast';
import { db } from '@/lib/db';
import {
  generateBlockchainTx,
  generateProductId,
  generateQuantumSignature,
  generateQuantumToken,
  generateTwinId,
} from '@/lib/quantum';
import { downloadText, downloadCanvas } from '@/lib/helpers';
import type { Product } from '@/lib/types';

const empty = {
  productName: '', brand: '', category: '', productId: '', batchNumber: '',
  manufacturingDate: '', expiryDate: '', factoryLocation: '', retailPrice: '',
  manufacturerName: 'QuantumForge Industries',
};

const GEN_STEPS = [
  'Generating Digital Product Twin…',
  'Generating Quantum Token…',
  'Generating Quantum Digital Signature…',
  'Creating Blockchain Record…',
  'Generating Secure QR…',
];

export function RegisterProduct() {
  const [form, setForm] = useState({ ...empty });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<Product | null>(null);
  const [seqDone, setSeqDone] = useState(false);
  const { notify } = useToast();
  const certRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const generate = () => {
    if (!form.productName || !form.brand || !form.category) {
      notify('Please fill product name, brand and category', 'warning');
      return;
    }
    setGenerating(true);
    setResult(null);
    setSeqDone(false);
  };

  const onSequenceComplete = () => {
    setSeqDone(true);
    const id = form.productId || generateProductId();
    const twinId = generateTwinId();
    const token = generateQuantumToken();
    const sig = generateQuantumSignature();
    const tx = generateBlockchainTx();
    const now = new Date().toISOString();
    const product: Product = {
      id, productName: form.productName, brand: form.brand, category: form.category,
      batchNumber: form.batchNumber || 'BATCH-AUTO',
      manufacturingDate: form.manufacturingDate || now,
      expiryDate: form.expiryDate || now,
      factoryLocation: form.factoryLocation || 'Plant Alpha, Mumbai',
      retailPrice: Number(form.retailPrice) || 0,
      manufacturerName: form.manufacturerName || 'QuantumForge Industries',
      twinId, quantumToken: token, quantumSignature: sig, blockchainTx: tx,
      registrationTimestamp: now, status: 'Registered',
      currentOwner: form.manufacturerName || 'QuantumForge Industries',
      currentLocation: form.factoryLocation || 'Plant Alpha, Mumbai',
      verificationCount: 0, riskScore: 2, riskLevel: 'Low', fraudReasons: [],
      timeline: [
        { stage: 'Manufactured', actor: form.manufacturerName, location: form.factoryLocation, timestamp: form.manufacturingDate || now },
        { stage: 'Registered', actor: form.manufacturerName, location: form.factoryLocation, timestamp: now },
      ],
    };
    db.addProduct(product);
    setTimeout(() => {
      setResult(product);
      setGenerating(false);
      notify('Quantum identity generated and stored on-chain', 'success');
    }, 400);
  };

  const downloadCert = () => {
    const canvas = certRef.current?.querySelector('canvas');
    downloadCanvas(canvas, `quantumseal-cert-${result?.id ?? 'qr'}.png`);
  };

  return (
    <div>
      <SectionTitle title="Register Product" subtitle="Fill product details, then generate its quantum identity and secure QR." />
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-quantum-500" /> Product Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name"><input className="input" value={form.productName} onChange={(e) => set('productName', e.target.value)} placeholder="e.g. NovaPharma Tablet" /></Field>
            <Field label="Brand"><input className="input" value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="e.g. NovaPharma" /></Field>
            <Field label="Category"><input className="input" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Pharmaceutical" /></Field>
            <Field label="Product ID"><input className="input" value={form.productId} onChange={(e) => set('productId', e.target.value)} placeholder="Auto-generated if blank" /></Field>
            <Field label="Batch Number"><input className="input" value={form.batchNumber} onChange={(e) => set('batchNumber', e.target.value)} placeholder="BATCH-2024-001" /></Field>
            <Field label="Manufacturing Date"><input type="date" className="input" value={form.manufacturingDate} onChange={(e) => set('manufacturingDate', e.target.value)} /></Field>
            <Field label="Expiry Date"><input type="date" className="input" value={form.expiryDate} onChange={(e) => set('expiryDate', e.target.value)} /></Field>
            <Field label="Factory Location"><input className="input" value={form.factoryLocation} onChange={(e) => set('factoryLocation', e.target.value)} placeholder="Plant Alpha, Mumbai" /></Field>
            <Field label="Retail Price ($)"><input type="number" className="input" value={form.retailPrice} onChange={(e) => set('retailPrice', e.target.value)} placeholder="120" /></Field>
            <Field label="Manufacturer Name"><input className="input" value={form.manufacturerName} onChange={(e) => set('manufacturerName', e.target.value)} /></Field>
          </div>
          <RippleButton className="btn-primary mt-5 w-full" onClick={generate} disabled={generating}>
            {generating ? (<><Sparkles className="h-4 w-4 animate-spin" /> Generating…</>) : (<><Sparkles className="h-4 w-4" /> Generate Quantum Identity</>)}
          </RippleButton>
        </GlassCard>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {generating && !seqDone && (
              <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-8">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-quantum-500/20" />
                    <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-quantum-500" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                    <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-quantum-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white text-center mb-5">Generating Quantum Identity</h3>
                  <VerificationSequence steps={GEN_STEPS} active={generating} onComplete={onSequenceComplete} />
                </GlassCard>
              </motion.div>
            )}

            {generating && seqDone && !result && (
              <motion.div key="seqdone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard className="p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="rounded-full bg-emerald-500/15 p-4 w-fit mx-auto mb-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </motion.div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">Finalizing certificate…</p>
                </GlassCard>
              </motion.div>
            )}

            {result && !generating && (
              <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-quantum-500" /> Quantum Certificate Issued
                    </h3>
                    <Badge tone="success"><CheckCircle2 className="h-3.5 w-3.5" /> Registered</Badge>
                  </div>

                  {/* Premium certificate */}
                  <div className="flex justify-center mb-5 overflow-x-auto no-scrollbar">
                    <div ref={certRef}>
                      <QRCertificate product={result} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <RippleButton className="btn-primary flex-1" onClick={downloadCert}>
                      <Download className="h-4 w-4" /> Download QR
                    </RippleButton>
                    <RippleButton className="btn-ghost flex-1" onClick={() => window.print()}>
                      <Printer className="h-4 w-4" /> Print Certificate
                    </RippleButton>
                    <RippleButton className="btn-ghost" onClick={() => downloadText(JSON.stringify(result, null, 2), `${result.id}.json`)}>
                      <QrCode className="h-4 w-4" /> Export
                    </RippleButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {!generating && !result && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center">
                <GlassCard className="p-10 text-center w-full">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} className="rounded-2xl bg-gradient-to-br from-cyber-500/15 to-quantum-500/15 p-5 w-fit mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-2xl bg-quantum-500/20 blur-xl" />
                    <QrCode className="h-9 w-9 text-quantum-500 relative" />
                  </motion.div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">No identity generated yet</p>
                  <p className="text-sm text-slate-500 mt-1">Fill the form and click Generate Quantum Identity.</p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="label">{label}</label>{children}</div>);
}

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, PackageCheck, Boxes, Send, History, ShieldCheck, Store, AlertTriangle, Clock, Search, Check, X, ScanLine, Loader2, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard, SectionTitle, GlassCard, Badge, EmptyState, SearchInput, FilterPills } from '@/components/ui';
import { RippleButton, VerificationSequence, StaggerItem } from '@/components/premium';
import { QRCanvas } from '@/components/QRCanvas';
import { useProducts, useVerifications, formatDate, formatDateTime, riskTone, statusTone } from '@/lib/helpers';
import { useToast } from '@/components/Toast';
import { db } from '@/lib/db';
import type { Product } from '@/lib/types';

const nav = [
  { label: 'Dashboard', path: '/retailer', icon: LayoutDashboard },
  { label: 'Receive Product', path: '/retailer/receive', icon: PackageCheck },
  { label: 'Inventory', path: '/retailer/inventory', icon: Boxes },
  { label: 'Transfer Product', path: '/retailer/transfer', icon: Send },
  { label: 'History', path: '/retailer/history', icon: History },
];

const RETAILER = 'Aurora Retail Co.';
const VERIFY_STEPS = ['Scanning QR…', 'Validating Quantum Signature…', 'Checking Blockchain…', 'Verification Complete'];

export default function Retailer() {
  return (
    <DashboardLayout role="retailer" nav={nav} userName={RETAILER}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="receive" element={<Receive />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="history" element={<HistoryPage />} />
      </Routes>
    </DashboardLayout>
  );
}

function Overview() {
  const products = useProducts();
  const received = products.filter((p) => p.currentOwner === RETAILER).length;
  const sold = products.filter((p) => p.status === 'Sold' && p.currentOwner === RETAILER).length;
  const pending = products.filter((p) => p.status === 'Registered' || p.status === 'In Transit').length;
  const suspicious = products.filter((p) => p.riskLevel === 'High').length;

  return (
    <div>
      <SectionTitle title="Retailer Dashboard" subtitle="Receive, verify and manage your product inventory." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products Received" value={received} icon={PackageCheck} delay={0} />
        <StatCard label="Products Sold" value={sold} icon={Store} accent="from-emerald-500 to-cyber-500" delay={0.08} />
        <StatCard label="Pending Verification" value={pending} icon={Clock} accent="from-amber-500 to-rose-500" delay={0.16} />
        <StatCard label="Suspicious Products" value={suspicious} icon={AlertTriangle} accent="from-rose-500 to-red-500" delay={0.24} />
      </div>
      <div className="mt-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Recent Inventory</h3>
          <div className="space-y-2">
            {products.filter((p) => p.currentOwner === RETAILER).slice(0, 6).map((p, i) => (
              <StaggerItem key={p.id} index={i}>
                <div className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition">
                  <div className="h-10 w-10 rounded-lg bg-white p-1"><QRCanvas value={p.id} size={64} preview /></div>
                  <div className="flex-1 min-w-0"><p className="font-medium text-sm text-slate-800 dark:text-white truncate">{p.productName}</p><p className="text-xs text-slate-500 font-mono">{p.id}</p></div>
                  <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                  <Badge tone={riskTone(p.riskLevel)}>{p.riskLevel}</Badge>
                </div>
              </StaggerItem>
            ))}
            {received === 0 && <EmptyState icon={Boxes} title="No products received yet" subtitle="Receive a product to populate your inventory." />}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Receive() {
  const products = useProducts();
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<Product | null>(null);
  const [searched, setSearched] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'verifying' | 'result'>('idle');
  const { notify } = useToast();

  const search = () => {
    if (!query.trim()) { notify('Enter a Product ID or scan a QR', 'warning'); return; }
    setPhase('verifying');
    setFound(null);
  };

  const onVerifyComplete = () => {
    const p = products.find((x) => x.id.toLowerCase() === query.trim().toLowerCase() || x.twinId.toLowerCase() === query.trim().toLowerCase());
    setSearched(true);
    setFound(p ?? null);
    setPhase('result');
  };

  const accept = () => {
    if (!found) return;
    db.updateProduct(found.id, { currentOwner: RETAILER, currentLocation: 'Aurora Storefront, Berlin', status: 'Verified' });
    db.addVerification({
      id: 'V-' + Math.random().toString(36).slice(2, 8), productId: found.id, productName: found.productName,
      verifier: RETAILER, role: 'retailer', result: 'Authentic', location: 'Aurora Storefront, Berlin', timestamp: new Date().toISOString(),
    });
    notify('Product accepted into inventory', 'success');
    setFound(null); setQuery(''); setSearched(false); setPhase('idle');
  };
  const reject = () => { notify('Product rejected', 'warning'); setFound(null); setQuery(''); setSearched(false); setPhase('idle'); };

  return (
    <div>
      <SectionTitle title="Receive Product" subtitle="Scan a QR code or enter a Product ID to verify and accept a shipment." />
      <GlassCard className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-quantum-500" />
            <input className="input pl-11" placeholder="Enter Product ID (e.g. PRD-…)" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} />
          </div>
          <RippleButton className="btn-primary" onClick={search} disabled={phase === 'verifying'}><Search className="h-4 w-4" /> Search</RippleButton>
        </div>
        <p className="text-xs text-slate-500 mt-3">Tip: copy any Product ID from the Manufacturer's Product History to test the flow.</p>
      </GlassCard>

      {phase === 'verifying' && (
        <GlassCard className="p-8">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-quantum-500/20" />
            <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-quantum-500" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-quantum-500" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white text-center mb-5">Verifying Product</h3>
          <VerificationSequence steps={VERIFY_STEPS} active={phase === 'verifying'} onComplete={onVerifyComplete} />
        </GlassCard>
      )}

      {phase === 'result' && searched && !found && (
        <GlassCard className="p-10 text-center">
          <div className="rounded-2xl bg-rose-500/15 p-4 w-fit mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-2xl bg-rose-500/30 blur-xl animate-pulseGlow" />
            <AlertTriangle className="h-8 w-8 text-rose-500 relative" />
          </div>
          <p className="font-semibold text-rose-600 dark:text-rose-400">Product not found</p>
          <p className="text-sm text-slate-500 mt-1">This ID is not registered in the quantum ledger.</p>
        </GlassCard>
      )}

      {phase === 'result' && found && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge tone="success"><CheckCircle2 className="h-3.5 w-3.5" /> Verified Authentic</Badge>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-cyber-500/15 to-quantum-500/15 flex items-center justify-center text-slate-400 relative overflow-hidden">
                <Boxes className="h-16 w-16" />
                <div className="absolute inset-0 bg-gradient-to-t from-quantum-500/10 to-transparent" />
              </div>
              <QRCanvas value={found.id} size={140} />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{found.productName}</h3>
                <Badge tone={statusTone(found.status)}>{found.status}</Badge>
              </div>
              <Row label="Manufacturer" value={found.manufacturerName} />
              <Row label="Brand" value={found.brand} />
              <Row label="Batch" value={found.batchNumber} />
              <Row label="Product ID" value={found.id} mono />
              <Row label="Quantum Signature" value={found.quantumSignature.slice(0, 36) + '…'} mono />
              <Row label="Blockchain Verified" value={found.blockchainTx} mono />
              <Row label="Registration Date" value={formatDate(found.registrationTimestamp)} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Authenticity Status</p>
                <Badge tone="success"><ShieldCheck className="h-3.5 w-3.5" /> Authentic</Badge>
              </div>
              <div className="flex gap-3 pt-2">
                <RippleButton className="btn-primary flex-1" onClick={accept}><Check className="h-4 w-4" /> Accept Product</RippleButton>
                <RippleButton className="btn-danger flex-1" onClick={reject}><X className="h-4 w-4" /> Reject Product</RippleButton>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div><p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p><p className={`text-sm text-slate-700 dark:text-slate-200 break-all ${mono ? 'font-mono' : ''}`}>{value}</p></div>;
}

function Inventory() {
  const products = useProducts();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  let mine = products.filter((p) => p.currentOwner === RETAILER);
  mine = mine.filter((p) => {
    const mq = p.productName.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase());
    const mf = filter === 'all' || (filter === 'verified' && p.status === 'Verified') || (filter === 'sold' && p.status === 'Sold') || (filter === 'flagged' && p.riskLevel === 'High');
    return mq && mf;
  });

  return (
    <div>
      <SectionTitle title="Inventory" subtitle="All accepted products currently in your store." />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search inventory…" />
        <FilterPills value={filter} onChange={setFilter} options={[
          { label: 'All', value: 'all' }, { label: 'Verified', value: 'verified' }, { label: 'Sold', value: 'sold' }, { label: 'Flagged', value: 'flagged' },
        ]} />
      </div>
      <GlassCard className="p-2 overflow-x-auto">
        {mine.length === 0 ? (
          <EmptyState icon={Boxes} title="Inventory is empty" subtitle="Receive products to add them here." />
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="p-3">Product</th><th className="p-3">Quantity</th><th className="p-3">Verification</th><th className="p-3">Location</th><th className="p-3">Current Owner</th>
            </tr></thead>
            <tbody>
              {mine.map((p) => (
                <tr key={p.id} className="border-t border-white/30 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition">
                  <td className="p-3"><div className="flex items-center gap-2"><div className="h-9 w-9 rounded-lg bg-white p-0.5"><QRCanvas value={p.id} size={56} preview /></div><div><p className="font-medium text-slate-800 dark:text-white">{p.productName}</p><p className="text-xs text-slate-500 font-mono">{p.id}</p></div></div></td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">1</td>
                  <td className="p-3"><Badge tone={p.status === 'Verified' ? 'success' : 'info'}>{p.status}</Badge></td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.currentLocation}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.currentOwner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}

function Transfer() {
  const products = useProducts();
  const [id, setId] = useState('');
  const [owner, setOwner] = useState('NovaMart Stores');
  const [location, setLocation] = useState('Shenzhen, CN');
  const { notify } = useToast();
  const mine = products.filter((p) => p.currentOwner === RETAILER);

  const transfer = () => {
    const p = products.find((x) => x.id === id);
    if (!p) { notify('Select a product to transfer', 'warning'); return; }
    db.transferProduct(p.id, owner, location);
    notify('Product transferred', 'success');
    setId('');
  };

  return (
    <div>
      <SectionTitle title="Transfer Product" subtitle="Hand off a product to another retailer or customer." />
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div><label className="label">Product</label>
              <select className="input" value={id} onChange={(e) => setId(e.target.value)}>
                <option value="">Select a product…</option>
                {mine.map((p) => <option key={p.id} value={p.id}>{p.productName} · {p.id}</option>)}
              </select>
            </div>
            <div><label className="label">New Owner</label><input className="input" value={owner} onChange={(e) => setOwner(e.target.value)} /></div>
            <div><label className="label">New Location</label><input className="input" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <RippleButton className="btn-primary w-full" onClick={transfer}><Send className="h-4 w-4" /> Transfer Product</RippleButton>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Transferable Inventory</h3>
          {mine.length === 0 ? <EmptyState icon={Send} title="Nothing to transfer" /> : (
            <div className="space-y-2">
              {mine.map((p, i) => (
                <StaggerItem key={p.id} index={i}>
                  <div className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition">
                    <div className="h-9 w-9 rounded-lg bg-white p-0.5"><QRCanvas value={p.id} size={56} preview /></div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-sm text-slate-800 dark:text-white truncate">{p.productName}</p><p className="text-xs text-slate-500 font-mono">{p.id}</p></div>
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                  </div>
                </StaggerItem>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function HistoryPage() {
  const verifications = useVerifications().filter((v) => v.verifier === RETAILER);
  return (
    <div>
      <SectionTitle title="History" subtitle="Your verification and transfer activity." />
      <GlassCard className="p-2 overflow-x-auto">
        {verifications.length === 0 ? <EmptyState icon={History} title="No activity yet" /> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="p-3">Product</th><th className="p-3">ID</th><th className="p-3">Result</th><th className="p-3">Location</th><th className="p-3">Timestamp</th>
            </tr></thead>
            <tbody>
              {verifications.map((v) => (
                <tr key={v.id} className="border-t border-white/30 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition">
                  <td className="p-3 font-medium text-slate-800 dark:text-white">{v.productName}</td>
                  <td className="p-3 font-mono text-xs text-slate-500">{v.productId}</td>
                  <td className="p-3"><Badge tone={v.result === 'Authentic' ? 'success' : 'danger'}>{v.result}</Badge></td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{v.location}</td>
                  <td className="p-3 text-slate-500">{formatDateTime(v.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}

import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, QrCode, History, BarChart3, Settings, ShieldCheck, PackageCheck, AlertTriangle, Award, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard, SectionTitle, GlassCard, Badge, EmptyState, SearchInput, FilterPills } from '@/components/ui';
import { BarChart, ChartCard, LineChart, RadialProgress } from '@/components/charts';
import { RippleButton, StaggerItem } from '@/components/premium';
import { QRCertificate } from '@/components/QRCertificate';
import { db } from '@/lib/db';
import { useProducts, useVerifications, formatDate, riskTone, statusTone } from '@/lib/helpers';
import { useToast } from '@/components/Toast';
import { QRCanvas } from '@/components/QRCanvas';
import { RegisterProduct } from './manufacturer/RegisterProduct';
import type { Product } from '@/lib/types';

const nav = [
  { label: 'Dashboard', path: '/manufacturer', icon: LayoutDashboard },
  { label: 'Register Product', path: '/manufacturer/register', icon: PackagePlus },
  { label: 'Generate QR', path: '/manufacturer/qr', icon: QrCode },
  { label: 'Product History', path: '/manufacturer/history', icon: History },
  { label: 'Analytics', path: '/manufacturer/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/manufacturer/settings', icon: Settings },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Manufacturer() {
  return (
    <DashboardLayout role="manufacturer" nav={nav} userName="QuantumForge Industries">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="register" element={<RegisterProduct />} />
        <Route path="qr" element={<QrPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

function Overview() {
  const products = useProducts();
  const registered = products.length;
  const verified = products.filter((p) => p.status === 'Verified' || p.status === 'Sold').length;
  const alerts = products.filter((p) => p.riskLevel === 'High').length;

  return (
    <div>
      <SectionTitle title="Manufacturer Dashboard" subtitle="Quantum identity issuance and product lifecycle overview." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products Registered" value={registered} icon={PackageCheck} accent="from-cyber-500 to-quantum-500" delay={0} />
        <StatCard label="Products Verified" value={verified} icon={ShieldCheck} accent="from-emerald-500 to-cyber-500" delay={0.08} />
        <StatCard label="Counterfeit Alerts" value={alerts} icon={AlertTriangle} accent="from-rose-500 to-red-500" delay={0.16} />
        <StatCard label="Quantum Certificates" value={registered} icon={Award} accent="from-quantum-500 to-purple-500" delay={0.24} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Monthly Product Registrations"><BarChart data={db.getState().monthlyRegistrations} labels={MONTHS} color="#6366f1" /></ChartCard>
        <ChartCard title="Verification Trend" accent="from-emerald-500 to-cyber-500"><LineChart data={db.getState().monthlyVerifications} labels={MONTHS} color="#3b82f6" /></ChartCard>
      </div>

      <div className="mt-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Recent Registrations</h3>
          {products.length === 0 ? (
            <EmptyState icon={PackageCheck} title="No products registered yet" subtitle="Register a product to generate its quantum identity." />
          ) : (
            <div className="space-y-2">
              {products.slice(0, 5).map((p, i) => (
                <StaggerItem key={p.id} index={i}>
                  <div className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyber-500 to-quantum-500 flex items-center justify-center text-white font-bold text-sm shadow-glow">{p.brand.charAt(0)}</div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-sm text-slate-800 dark:text-white truncate">{p.productName}</p><p className="text-xs text-slate-500 font-mono">{p.id} · {p.batchNumber}</p></div>
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                    <Badge tone={riskTone(p.riskLevel)}>{p.riskLevel} Risk</Badge>
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

function QrPage() {
  const products = useProducts();
  const [selected, setSelected] = useState<string>(products[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const product = products.find((p) => p.id === selected) ?? products[0];
  const filtered = products.filter((p) => p.productName.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <SectionTitle title="Generate QR" subtitle="View and download the secure QR certificate for any registered product." />
      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-4 lg:col-span-1 h-fit">
          <div className="mb-3"><SearchInput value={query} onChange={setQuery} placeholder="Search products…" /></div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => setSelected(p.id)} className={`w-full text-left p-3 rounded-xl transition ${selected === p.id ? 'bg-quantum-500/15 border border-quantum-400/40 shadow-glow' : 'glass hover:bg-white/80 dark:hover:bg-white/10'}`}>
                <p className="font-medium text-sm text-slate-800 dark:text-white truncate">{p.productName}</p>
                <p className="text-xs text-slate-500 font-mono">{p.id}</p>
              </button>
            ))}
            {filtered.length === 0 && <EmptyState icon={QrCode} title="No products found" />}
          </div>
        </GlassCard>

        {product && (
          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex flex-col items-center gap-6">
              <QRCertificate product={product} />
              <div className="flex gap-3 w-full max-w-md">
                <RippleButton className="btn-primary flex-1" onClick={() => QRCanvas.download(product.id)}><QrCode className="h-4 w-4" /> Download QR</RippleButton>
                <RippleButton className="btn-ghost flex-1" onClick={() => window.print()}><QrCode className="h-4 w-4" /> Print Certificate</RippleButton>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function HistoryPage() {
  const products = useProducts();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = products.filter((p) => {
    const matchesQuery = p.productName.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()) || p.manufacturerName.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'verified' && (p.status === 'Verified' || p.status === 'Sold')) || (filter === 'flagged' && p.riskLevel === 'High') || (filter === 'registered' && p.status === 'Registered');
    return matchesQuery && matchesFilter;
  });

  return (
    <div>
      <SectionTitle title="Product History" subtitle="All registered products across the supply chain." />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by product, ID, or manufacturer…" />
        <FilterPills value={filter} onChange={setFilter} options={[
          { label: 'All', value: 'all' }, { label: 'Registered', value: 'registered' }, { label: 'Verified', value: 'verified' }, { label: 'Flagged', value: 'flagged' },
        ]} />
      </div>
      <GlassCard className="p-2 overflow-x-auto">
        {filtered.length === 0 ? (
          <EmptyState icon={History} title="No products found" subtitle="Try adjusting your search or filter." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="p-3">QR</th><th className="p-3">Product</th><th className="p-3">Product ID</th><th className="p-3">Manufacturer</th>
                <th className="p-3">Batch</th><th className="p-3">Current Owner</th><th className="p-3">Location</th><th className="p-3">Verifications</th>
                <th className="p-3">Risk</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-white/30 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition">
                  <td className="p-3"><div className="h-10 w-10 rounded-lg bg-white p-1"><QRCanvas value={p.id} size={64} preview /></div></td>
                  <td className="p-3 font-medium text-slate-800 dark:text-white">{p.productName}</td>
                  <td className="p-3 font-mono text-xs text-slate-500">{p.id}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.manufacturerName}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.batchNumber}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.currentOwner}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.currentLocation}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.verificationCount}</td>
                  <td className="p-3"><Badge tone={riskTone(p.riskLevel)}>{p.riskScore}</Badge></td>
                  <td className="p-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                  <td className="p-3"><div className="flex items-center justify-end gap-2">
                    <button onClick={() => navigate('/manufacturer/qr')} className="p-1.5 rounded-lg glass hover:bg-white/80 dark:hover:bg-white/10 transition" title="View"><QrCode className="h-4 w-4 text-quantum-500" /></button>
                    <button onClick={() => notify('Edit coming soon', 'info')} className="p-1.5 rounded-lg glass hover:bg-white/80 dark:hover:bg-white/10 transition" title="Edit"><PackagePlus className="h-4 w-4 text-cyber-500" /></button>
                    <button onClick={() => { db.deleteProduct(p.id); notify('Product deleted', 'success'); }} className="p-1.5 rounded-lg glass hover:bg-rose-500/10 transition" title="Delete"><AlertTriangle className="h-4 w-4 text-rose-500" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}

function Analytics() {
  const products = useProducts();
  const verifications = useVerifications();
  const total = products.length;
  const verified = products.filter((p) => p.status === 'Verified' || p.status === 'Sold').length;
  const reqs = verifications.length;
  const counterfeits = products.filter((p) => p.riskLevel === 'High').length;
  const avgRisk = total ? Math.round(products.reduce((s, p) => s + p.riskScore, 0) / total) : 0;
  const successRate = reqs ? Math.round((verifications.filter((v) => v.result === 'Authentic').length / reqs) * 100) : 100;

  return (
    <div>
      <SectionTitle title="Analytics" subtitle="Registration, verification and risk insights." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Products" value={total} icon={PackageCheck} delay={0} />
        <StatCard label="Verified Products" value={verified} icon={ShieldCheck} accent="from-emerald-500 to-cyber-500" delay={0.08} />
        <StatCard label="Verification Requests" value={reqs} icon={History} accent="from-quantum-500 to-purple-500" delay={0.16} />
        <StatCard label="Counterfeit Attempts" value={counterfeits} icon={AlertTriangle} accent="from-rose-500 to-red-500" delay={0.24} />
        <StatCard label="Average Risk Score" value={avgRisk} icon={BarChart3} accent="from-amber-500 to-rose-500" delay={0.32} />
        <StatCard label="Verification Success Rate" value={`${successRate}%`} icon={Award} accent="from-cyber-500 to-emerald-500" delay={0.4} animate={false} />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <ChartCard title="Monthly Product Registrations"><BarChart data={db.getState().monthlyRegistrations} labels={MONTHS} color="#6366f1" /></ChartCard>
        <ChartCard title="Verification Trend" accent="from-emerald-500 to-cyber-500"><LineChart data={db.getState().monthlyVerifications} labels={MONTHS} color="#3b82f6" /></ChartCard>
        <GlassCard className="p-5 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 self-start flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyber-500 to-quantum-500" /> Success Rate</h3>
          <RadialProgress value={successRate} label="Verified" color="#6366f1" />
        </GlassCard>
      </div>
      <div className="mt-6">
        <ChartCard title="Counterfeit Attempts" accent="from-rose-500 to-red-500"><BarChart data={db.getState().monthlyCounterfeits} labels={MONTHS} color="#f43f5e" /></ChartCard>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { notify } = useToast();
  return (
    <div>
      <SectionTitle title="Settings" subtitle="Manufacturer profile and prototype controls." />
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Manufacturer Profile</h3>
          <div className="space-y-4">
            <div><label className="label">Company Name</label><input className="input" defaultValue="QuantumForge Industries" /></div>
            <div><label className="label">Factory Location</label><input className="input" defaultValue="Plant Alpha, Mumbai" /></div>
            <div><label className="label">Contact Email</label><input className="input" defaultValue="ops@quantumforge.io" /></div>
            <RippleButton className="btn-primary" onClick={() => notify('Profile saved', 'success')}>Save Changes</RippleButton>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Prototype Data</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Reset the simulated database to its seeded demo state. This clears all registered products.</p>
          <RippleButton className="btn-danger" onClick={() => { db.reset(); notify('Database reset to demo state', 'success'); }}>Reset Simulated Database</RippleButton>
        </GlassCard>
      </div>
    </div>
  );
}

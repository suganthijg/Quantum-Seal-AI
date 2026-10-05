import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, ShieldAlert, BarChart3, Settings, Factory, Store, User as UserIcon,
  PackageCheck, AlertTriangle, History, Eye, Ban, Trash2, MapPin, BrainCircuit, Activity, Zap, Search,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard, SectionTitle, GlassCard, Badge, EmptyState, SearchInput, FilterPills } from '@/components/ui';
import { BarChart, ChartCard, DonutChart, LineChart, RadialProgress } from '@/components/charts';
import { QRCanvas } from '@/components/QRCanvas';
import { RippleButton, StaggerItem } from '@/components/premium';
import { db } from '@/lib/db';
import { useProducts, useUsers, useVerifications, formatDate, formatDateTime, riskTone, statusTone } from '@/lib/helpers';
import { useToast } from '@/components/Toast';

const nav = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Fraud Detection', path: '/admin/fraud', icon: ShieldAlert },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REGIONS = [
  { region: 'Shenzhen, CN', risk: 78 },
  { region: 'Mumbai, IN', risk: 54 },
  { region: 'Berlin, DE', risk: 22 },
  { region: 'Austin, US', risk: 14 },
  { region: 'São Paulo, BR', risk: 41 },
  { region: 'Dubai, AE', risk: 33 },
];

export default function Admin() {
  return (
    <DashboardLayout role="admin" nav={nav} userName="System Admin">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="fraud" element={<FraudPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

function Overview() {
  const products = useProducts();
  const users = useUsers();
  const verifications = useVerifications();
  const manufacturers = users.filter((u) => u.role === 'manufacturer').length;
  const retailers = users.filter((u) => u.role === 'retailer').length;
  const customers = users.filter((u) => u.role === 'customer').length;
  const alerts = products.filter((p) => p.riskLevel === 'High');
  const reqs = verifications.length;

  return (
    <div>
      <SectionTitle title="Admin Dashboard" subtitle="Platform-wide monitoring of users, products and fraud." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Manufacturers" value={manufacturers} icon={Factory} delay={0} />
        <StatCard label="Retailers" value={retailers} icon={Store} accent="from-emerald-500 to-cyber-500" delay={0.08} />
        <StatCard label="Customers" value={customers} icon={UserIcon} accent="from-quantum-500 to-purple-500" delay={0.16} />
        <StatCard label="Products" value={products.length} icon={PackageCheck} accent="from-cyber-500 to-quantum-500" delay={0.24} />
        <StatCard label="Counterfeit Alerts" value={alerts.length} icon={AlertTriangle} accent="from-rose-500 to-red-500" delay={0.32} />
        <StatCard label="Verification Requests" value={reqs} icon={History} accent="from-amber-500 to-rose-500" delay={0.4} />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <ChartCard title="Monthly Registrations"><BarChart data={db.getState().monthlyRegistrations} labels={MONTHS} color="#6366f1" /></ChartCard>
        <ChartCard title="Verification Requests" accent="from-emerald-500 to-cyber-500"><LineChart data={db.getState().monthlyVerifications} labels={MONTHS} color="#3b82f6" /></ChartCard>
        {/* Live alerts */}
        <GlassCard className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-rose-500" /> Live Alerts
          </h3>
          {alerts.length === 0 ? (
            <EmptyState icon={ShieldAlert} title="No active alerts" />
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {alerts.slice(0, 6).map((p, i) => (
                <StaggerItem key={p.id} index={i}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-400/20">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-800 dark:text-white truncate">{p.productName}</p>
                      <p className="text-xs text-rose-500">{p.fraudReasons[0] ?? 'High risk detected'}</p>
                    </div>
                    <Badge tone="danger">{p.riskScore}</Badge>
                  </div>
                </StaggerItem>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Recent activity */}
      <div className="mt-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-quantum-500" /> Recent Activity</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
            {verifications.slice(0, 8).map((v, i) => (
              <StaggerItem key={v.id} index={i}>
                <div className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${v.result === 'Authentic' ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                    <ShieldAlert className={`h-4 w-4 ${v.result === 'Authentic' ? 'text-emerald-500' : 'text-rose-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800 dark:text-white truncate">{v.productName}</p>
                    <p className="text-xs text-slate-500">{v.verifier} · {v.location}</p>
                  </div>
                  <Badge tone={v.result === 'Authentic' ? 'success' : 'danger'}>{v.result}</Badge>
                  <span className="text-xs text-slate-400 hidden sm:block">{formatDateTime(v.timestamp)}</span>
                </div>
              </StaggerItem>
            ))}
            {verifications.length === 0 && <EmptyState icon={Activity} title="No recent activity" />}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function UsersPage() {
  const users = useUsers();
  const { notify } = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const roleIcon: Record<string, React.ElementType> = { manufacturer: Factory, retailer: Store, customer: UserIcon, admin: ShieldAlert };

  const filtered = users.filter((u) => {
    const mq = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const mf = filter === 'all' || u.role === filter;
    return mq && mf;
  });

  return (
    <div>
      <SectionTitle title="Users" subtitle="Manage all platform users and their access." />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search users…" />
        <FilterPills value={filter} onChange={setFilter} options={[
          { label: 'All', value: 'all' }, { label: 'Manufacturers', value: 'manufacturer' }, { label: 'Retailers', value: 'retailer' }, { label: 'Customers', value: 'customer' }, { label: 'Admins', value: 'admin' },
        ]} />
      </div>
      <GlassCard className="p-2 overflow-x-auto">
        {filtered.length === 0 ? <EmptyState icon={Users} title="No users found" /> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Products</th><th className="p-3">Last Login</th><th className="p-3 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((u) => {
                const Icon = roleIcon[u.role];
                return (
                  <tr key={u.id} className="border-t border-white/30 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition">
                    <td className="p-3"><div className="flex items-center gap-2"><div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyber-500 to-quantum-500 flex items-center justify-center text-white shadow-glow"><Icon className="h-4 w-4" /></div><div><p className="font-medium text-slate-800 dark:text-white">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></div></div></td>
                    <td className="p-3"><Badge tone="quantum">{u.role}</Badge></td>
                    <td className="p-3"><Badge tone={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge></td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{u.products}</td>
                    <td className="p-3 text-slate-500">{formatDate(u.lastLogin)}</td>
                    <td className="p-3"><div className="flex items-center justify-end gap-2">
                      <button onClick={() => notify(`Viewing ${u.name}`, 'info')} className="p-1.5 rounded-lg glass hover:bg-white/80 dark:hover:bg-white/10 transition" title="View"><Eye className="h-4 w-4 text-cyber-500" /></button>
                      <button onClick={() => { db.updateUser(u.id, { status: u.status === 'Active' ? 'Suspended' : 'Active' }); notify(`${u.name} ${u.status === 'Active' ? 'suspended' : 'reactivated'}`, u.status === 'Active' ? 'warning' : 'success'); }} className="p-1.5 rounded-lg glass hover:bg-amber-500/10 transition" title="Suspend"><Ban className="h-4 w-4 text-amber-500" /></button>
                      <button onClick={() => { db.deleteUser(u.id); notify('User deleted', 'success'); }} className="p-1.5 rounded-lg glass hover:bg-rose-500/10 transition" title="Delete"><Trash2 className="h-4 w-4 text-rose-500" /></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}

function ProductsPage() {
  const products = useProducts();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = products.filter((p) => {
    const mq = p.productName.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()) || p.currentOwner.toLowerCase().includes(query.toLowerCase());
    const mf = filter === 'all' || (filter === 'verified' && (p.status === 'Verified' || p.status === 'Sold')) || (filter === 'flagged' && p.riskLevel === 'High') || (filter === 'transit' && p.status === 'In Transit');
    return mq && mf;
  });

  return (
    <div>
      <SectionTitle title="Product Monitoring" subtitle="All products across the platform." />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search products, owners…" />
        <FilterPills value={filter} onChange={setFilter} options={[
          { label: 'All', value: 'all' }, { label: 'Verified', value: 'verified' }, { label: 'In Transit', value: 'transit' }, { label: 'Flagged', value: 'flagged' },
        ]} />
      </div>
      <GlassCard className="p-2 overflow-x-auto">
        {filtered.length === 0 ? <EmptyState icon={Package} title="No products found" /> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="p-3">Product</th><th className="p-3">Owner</th><th className="p-3">Location</th><th className="p-3">Verifications</th><th className="p-3">Risk</th><th className="p-3">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-white/30 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition">
                  <td className="p-3"><div className="flex items-center gap-2"><div className="h-9 w-9 rounded-lg bg-white p-0.5"><QRCanvas value={p.id} size={56} preview /></div><div><p className="font-medium text-slate-800 dark:text-white">{p.productName}</p><p className="text-xs text-slate-500 font-mono">{p.id}</p></div></div></td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.currentOwner}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.currentLocation}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{p.verificationCount}</td>
                  <td className="p-3"><Badge tone={riskTone(p.riskLevel)}>{p.riskScore} · {p.riskLevel}</Badge></td>
                  <td className="p-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}

const FRAUD_REASONS = ['Duplicate QR', 'Multiple Scans in Different Locations', 'Quantum Signature Mismatch', 'Blockchain Record Missing', 'Tampering Detected'];

function FraudPage() {
  const products = useProducts();
  const high = products.filter((p) => p.riskLevel === 'High');
  const med = products.filter((p) => p.riskLevel === 'Medium');
  const low = products.filter((p) => p.riskLevel === 'Low');

  return (
    <div>
      <SectionTitle title="Fraud Detection" subtitle="AI-powered risk classification and anomaly reasons." />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="High Risk" value={high.length} icon={AlertTriangle} accent="from-rose-500 to-red-500" delay={0} />
        <StatCard label="Medium Risk" value={med.length} icon={AlertTriangle} accent="from-amber-500 to-rose-500" delay={0.08} />
        <StatCard label="Low Risk" value={low.length} icon={ShieldAlert} accent="from-emerald-500 to-cyber-500" delay={0.16} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-quantum-500" /> Detected Reasons</h3>
          <div className="space-y-2">
            {FRAUD_REASONS.map((r, i) => {
              const count = products.filter((p) => p.fraudReasons.includes(r)).length;
              return (
                <StaggerItem key={r} index={i}>
                  <div className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition">
                    <AlertTriangle className={`h-4 w-4 ${count > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
                    <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">{r}</span>
                    <Badge tone={count > 0 ? 'danger' : 'neutral'}>{count}</Badge>
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">High Risk Products</h3>
          {high.length === 0 ? <EmptyState icon={ShieldAlert} title="No high-risk products" /> : (
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
              {high.map((p, i) => (
                <StaggerItem key={p.id} index={i}>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/20">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-slate-800 dark:text-white">{p.productName}</p>
                      <Badge tone="danger">{p.riskScore}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{p.id}</p>
                    {p.fraudReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.fraudReasons.map((r) => <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500">{r}</span>)}
                      </div>
                    )}
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

function Analytics() {
  const products = useProducts();
  const verifications = useVerifications();
  const total = products.length;
  const authentic = verifications.filter((v) => v.result === 'Authentic').length;
  const counterfeits = products.filter((p) => p.riskLevel === 'High').length;
  const reqs = verifications.length;
  const successRate = reqs ? Math.round((authentic / reqs) * 100) : 100;

  const low = products.filter((p) => p.riskLevel === 'Low').length;
  const med = products.filter((p) => p.riskLevel === 'Medium').length;
  const high = products.filter((p) => p.riskLevel === 'High').length;

  return (
    <div>
      <SectionTitle title="Analytics" subtitle="Platform-wide intelligence and risk distribution." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={total} icon={PackageCheck} delay={0} />
        <StatCard label="Authentic Products" value={authentic} icon={ShieldAlert} accent="from-emerald-500 to-cyber-500" delay={0.08} />
        <StatCard label="Counterfeit Attempts" value={counterfeits} icon={AlertTriangle} accent="from-rose-500 to-red-500" delay={0.16} />
        <StatCard label="Verification Requests" value={reqs} icon={History} accent="from-quantum-500 to-purple-500" delay={0.24} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <ChartCard title="Monthly Registrations"><BarChart data={db.getState().monthlyRegistrations} labels={MONTHS} color="#6366f1" /></ChartCard>
        <ChartCard title="Verification Requests" accent="from-emerald-500 to-cyber-500"><LineChart data={db.getState().monthlyVerifications} labels={MONTHS} color="#3b82f6" /></ChartCard>
        <GlassCard className="p-5 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 self-start flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyber-500 to-quantum-500" /> Success Rate</h3>
          <RadialProgress value={successRate} label="Verified" color="#6366f1" />
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Counterfeit Trend" accent="from-rose-500 to-red-500"><BarChart data={db.getState().monthlyCounterfeits} labels={MONTHS} color="#f43f5e" /></ChartCard>
        <ChartCard title="Risk Score Distribution" accent="from-amber-500 to-rose-500">
          <DonutChart
            centerValue={`${successRate}%`}
            centerLabel="Success"
            segments={[
              { value: low, color: '#10b981', label: 'Low Risk' },
              { value: med, color: '#f59e0b', label: 'Medium Risk' },
              { value: high, color: '#f43f5e', label: 'High Risk' },
            ]}
          />
        </ChartCard>
      </div>

      <div className="mt-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1 flex items-center gap-2"><MapPin className="h-5 w-5 text-quantum-500" /> Top Risk Regions</h3>
          <p className="text-xs text-slate-500 mb-4">Heatmap placeholder — regional counterfeit risk concentration.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REGIONS.map((r, i) => {
              const intensity = r.risk / 100;
              return (
                <StaggerItem key={r.region} index={i}>
                  <div className="rounded-xl p-4 relative overflow-hidden transition hover:scale-[1.02]" style={{ background: `rgba(244,63,94,${0.1 + intensity * 0.4})` }}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-slate-800 dark:text-white">{r.region}</p>
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-300">{r.risk}%</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-amber-500 to-rose-500" initial={{ width: 0 }} animate={{ width: `${r.risk}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} />
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { notify } = useToast();
  return (
    <div>
      <SectionTitle title="Settings" subtitle="Platform configuration and prototype controls." />
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Platform Settings</h3>
          <div className="space-y-4">
            <div><label className="label">Platform Name</label><input className="input" defaultValue="QuantumSeal AI" /></div>
            <div><label className="label">Quantum Algorithm</label><input className="input" defaultValue="Simulated Lattice-512" /></div>
            <div><label className="label">Blockchain Network</label><input className="input" defaultValue="QuantumChain Testnet" /></div>
            <RippleButton className="btn-primary" onClick={() => notify('Settings saved', 'success')}>Save</RippleButton>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Prototype Data</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Reset the simulated database to its seeded demo state.</p>
          <RippleButton className="btn-danger" onClick={() => { db.reset(); notify('Database reset to demo state', 'success'); }}>Reset Simulated Database</RippleButton>
        </GlassCard>
      </div>
    </div>
  );
}

import { useSyncExternalStore } from 'react';
import type { DBState, Product, User, VerificationLog, Role } from './types';
import {
  generateBlockchainTx,
  generateProductId,
  generateQuantumSignature,
  generateQuantumToken,
  generateTwinId,
} from './quantum';

const KEY = 'quantumseal_db_v1';

const CATEGORIES = ['Pharmaceutical', 'Electronics', 'Luxury Goods', 'Cosmetics', 'Automotive Parts', 'Beverages'];
const BRANDS = ['NovaPharma', 'VoltTech', 'Lumière', 'PureLab', 'MotoCore', 'AuroraWines'];
const CITIES = ['Mumbai, IN', 'Shenzhen, CN', 'Berlin, DE', 'Austin, US', 'São Paulo, BR', 'Dubai, AE'];
const FACTORIES = ['Plant Alpha, Mumbai', 'Plant Beta, Shenzhen', 'Plant Gamma, Berlin'];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function daysAhead(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function seedProduct(i: number, owner: string, location: string): Product {
  const id = generateProductId();
  const twinId = generateTwinId();
  const token = generateQuantumToken();
  const sig = generateQuantumSignature();
  const tx = generateBlockchainTx();
  const brand = BRANDS[i % BRANDS.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const manufactured = daysAgo(30 + i * 3);
  const registered = daysAgo(28 + i * 3);
  const verifications = Math.floor(Math.random() * 6);
  const risk = i % 7 === 0 ? Math.floor(60 + Math.random() * 30) : Math.floor(Math.random() * 25);
  const status: Product['status'] =
    risk > 60 ? 'Flagged' : i % 3 === 0 ? 'Sold' : i % 2 === 0 ? 'Verified' : 'In Transit';
  return {
    id,
    productName: `${brand} ${category.slice(0, -1)} Model ${1000 + i}`,
    brand,
    category,
    batchNumber: 'BATCH-' + (2024 + (i % 2)) + '-' + String(100 + i).padStart(3, '0'),
    manufacturingDate: manufactured,
    expiryDate: daysAhead(365 * 2 - i),
    factoryLocation: FACTORIES[i % FACTORIES.length],
    retailPrice: Math.floor(50 + Math.random() * 950),
    manufacturerName: 'QuantumForge Industries',
    twinId,
    quantumToken: token,
    quantumSignature: sig,
    blockchainTx: tx,
    registrationTimestamp: registered,
    status,
    currentOwner: owner,
    currentLocation: location,
    verificationCount: verifications,
    riskScore: risk,
    riskLevel: risk > 60 ? 'High' : risk > 30 ? 'Medium' : 'Low',
    fraudReasons: risk > 60 ? ['Multiple Scans in Different Locations', 'Quantum Signature Mismatch'] : [],
    timeline: [
      { stage: 'Manufactured', actor: 'QuantumForge Industries', location: FACTORIES[i % FACTORIES.length], timestamp: manufactured },
      { stage: 'Registered', actor: 'QuantumForge Industries', location: FACTORIES[i % FACTORIES.length], timestamp: registered },
      { stage: 'Verified', actor: 'Retailer', location: location, timestamp: daysAgo(20 + i) },
      { stage: 'Retailer', actor: owner, location: location, timestamp: daysAgo(15 + i) },
    ],
  };
}

function seed(): DBState {
  const products: Product[] = [];
  for (let i = 0; i < 14; i++) {
    const owner = i % 3 === 0 ? 'Aurora Retail Co.' : 'NovaMart Stores';
    const loc = CITIES[i % CITIES.length];
    products.push(seedProduct(i, owner, loc));
  }

  const users: User[] = [
    { id: 'U-MFR-01', name: 'QuantumForge Industries', role: 'manufacturer', email: 'ops@quantumforge.io', status: 'Active', products: products.length, lastLogin: daysAgo(0) },
    { id: 'U-RET-01', name: 'Aurora Retail Co.', role: 'retailer', email: 'inv@aurora.shop', status: 'Active', products: 8, lastLogin: daysAgo(1) },
    { id: 'U-RET-02', name: 'NovaMart Stores', role: 'retailer', email: 'inv@novamart.shop', status: 'Active', products: 6, lastLogin: daysAgo(2) },
    { id: 'U-CUS-01', name: 'Demo Customer', role: 'customer', email: 'customer@demo.app', status: 'Active', products: 0, lastLogin: daysAgo(0) },
    { id: 'U-ADM-01', name: 'System Admin', role: 'admin', email: 'admin@quantumseal.ai', status: 'Active', products: 0, lastLogin: daysAgo(0) },
  ];

  const verifications: VerificationLog[] = products.slice(0, 10).map((p, i) => ({
    id: 'V-' + String(i + 1).padStart(4, '0'),
    productId: p.id,
    productName: p.productName,
    verifier: p.currentOwner,
    role: 'retailer' as Role,
    result: p.riskLevel === 'High' ? 'Counterfeit' : 'Authentic',
    location: p.currentLocation,
    timestamp: daysAgo(10 - i),
  }));

  return {
    products,
    users,
    verifications,
    monthlyRegistrations: [12, 18, 24, 30, 28, 35, 42, 38, 45, 52, 48, 60],
    monthlyVerifications: [40, 55, 68, 72, 80, 95, 110, 102, 120, 135, 128, 150],
    monthlyCounterfeits: [2, 3, 1, 5, 4, 6, 8, 5, 7, 9, 6, 11],
  };
}

let state: DBState = load();
const listeners = new Set<() => void>();

function load(): DBState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DBState;
  } catch {
    // ignore
  }
  const s = seed();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
  return s;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

export const db = {
  getState: () => state,
  useDB: (): DBState => useSyncExternalStore(subscribe, getSnapshot, getSnapshot),
  addProduct(p: Product) {
    state = { ...state, products: [p, ...state.products] };
    persist();
  },
  updateProduct(id: string, patch: Partial<Product>) {
    state = {
      ...state,
      products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    };
    persist();
  },
  deleteProduct(id: string) {
    state = { ...state, products: state.products.filter((p) => p.id !== id) };
    persist();
  },
  addVerification(v: VerificationLog) {
    state = { ...state, verifications: [v, ...state.verifications] };
    persist();
  },
  incrementVerification(id: string, location: string) {
    state = {
      ...state,
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        const count = p.verificationCount + 1;
        const reasons = [...p.fraudReasons];
        if (location && p.currentLocation && location !== p.currentLocation && !reasons.includes('Multiple Scans in Different Locations')) {
          reasons.push('Multiple Scans in Different Locations');
        }
        const risk = reasons.length ? Math.min(85, p.riskScore + 15) : Math.max(0, p.riskScore - 2);
        return {
          ...p,
          verificationCount: count,
          riskScore: risk,
          riskLevel: risk > 60 ? 'High' : risk > 30 ? 'Medium' : 'Low',
          fraudReasons: reasons,
        };
      }),
    };
    persist();
  },
  transferProduct(id: string, newOwner: string, newLocation: string) {
    state = {
      ...state,
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              currentOwner: newOwner,
              currentLocation: newLocation,
              status: 'In Transit',
              timeline: [
                ...p.timeline,
                { stage: 'Transfer', actor: newOwner, location: newLocation, timestamp: new Date().toISOString() },
              ],
            }
          : p,
      ),
    };
    persist();
  },
  updateUser(id: string, patch: Partial<User>) {
    state = { ...state, users: state.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) };
    persist();
  },
  deleteUser(id: string) {
    state = { ...state, users: state.users.filter((u) => u.id !== id) };
    persist();
  },
  reset() {
    state = seed();
    persist();
  },
};

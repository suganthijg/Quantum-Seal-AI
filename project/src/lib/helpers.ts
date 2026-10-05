import { db } from '@/lib/db';
import type { Product, RiskLevel } from '@/lib/types';

export function riskTone(level: RiskLevel) {
  return level === 'High' ? 'danger' : level === 'Medium' ? 'warning' : 'success';
}

export function statusTone(status: Product['status']) {
  if (status === 'Flagged') return 'danger';
  if (status === 'Sold') return 'neutral';
  if (status === 'Verified') return 'success';
  if (status === 'In Transit') return 'info';
  return 'quantum';
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}
export function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function useProducts() {
  return db.useDB().products;
}
export function useUsers() {
  return db.useDB().users;
}
export function useVerifications() {
  return db.useDB().verifications;
}

export function downloadCanvas(canvas: HTMLCanvasElement | null, filename: string) {
  if (!canvas) return;
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

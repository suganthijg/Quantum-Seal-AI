import { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ShieldCheck, Fingerprint, CheckCircle2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatDateTime } from '@/lib/helpers';

/* A premium printable certificate rendered as a styled card.
   Wrapped with forwardRef so callers can capture it for download/print. */
export const QRCertificate = forwardRef<HTMLDivElement, { product: Product }>(
  function QRCertificate({ product }, ref) {
    const certId = `QC-${product.id.replace('PRD-', '')}-${product.twinId.slice(-4)}`;
    return (
      <div
        ref={ref}
        className="relative rounded-3xl overflow-hidden bg-white dark:bg-navy-950 border-2 border-quantum-400/30 shadow-glow-lg"
        style={{ width: 460 }}
      >
        {/* corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-quantum-400/50 rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-quantum-400/50 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-quantum-400/50 rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-quantum-400/50 rounded-br-3xl" />

        {/* header */}
        <div className="relative px-8 pt-8 pb-4 text-center bg-gradient-to-b from-quantum-500/10 to-transparent">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyber-500 to-quantum-500 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              Quantum<span className="gradient-text">Seal</span> AI
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-quantum-500 font-medium">Quantum Certificate of Authenticity</p>
        </div>

        {/* QR + badges */}
        <div className="relative px-8 flex flex-col items-center">
          <div className="rounded-2xl bg-white p-3 shadow-glow mb-4">
            <QRCodeCanvas
              value={JSON.stringify({ pid: product.id, twin: product.twinId, token: product.quantumToken, sig: product.quantumSignature, chain: product.blockchainTx })}
              size={180}
              level="H"
              fgColor="#1e1b4b"
              bgColor="#ffffff"
              imageSettings={{
                src:
                  'data:image/svg+xml;base64,' +
                  btoa('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="#6366f1"/><circle cx="20" cy="20" r="6" fill="#fff"/></svg>'),
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>
          <div className="flex gap-2 mb-5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> Quantum Verified
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyber-100 dark:bg-cyber-500/15 text-cyber-700 dark:text-cyber-300 px-3 py-1 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Blockchain Verified
            </span>
          </div>
        </div>

        {/* details */}
        <div className="relative px-8 pb-8 space-y-2.5">
          <CertRow label="Product Name" value={product.productName} />
          <CertRow label="Product ID" value={product.id} mono />
          <CertRow label="Quantum Certificate ID" value={certId} mono />
          <CertRow label="Digital Twin ID" value={product.twinId} mono />
          <CertRow label="Quantum Token" value={product.quantumToken} mono />
          <CertRow label="Blockchain Transaction" value={product.blockchainTx} mono />
          <CertRow label="Manufacturer" value={product.manufacturerName} />
          <CertRow label="Registration Timestamp" value={formatDateTime(product.registrationTimestamp)} />
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-quantum-400/20">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Authenticity Score</span>
            <span className="text-2xl font-bold gradient-text">100%</span>
          </div>
        </div>

        {/* footer */}
        <div className="relative px-8 py-4 bg-gradient-to-t from-quantum-500/10 to-transparent text-center">
          <p className="text-[9px] text-slate-400 dark:text-slate-500">
            This certificate is cryptographically sealed by QuantumSeal AI. Verify at quantumseal.ai/verify
          </p>
        </div>
      </div>
    );
  },
);

function CertRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 items-start">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 pt-0.5">{label}</span>
      <span className={`text-xs text-slate-800 dark:text-slate-100 text-right break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

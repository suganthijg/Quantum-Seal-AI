// Simulated quantum identity, digital signature, and blockchain generators.
// All deterministic-ish but random enough for a hackathon prototype.

const HEX = '0123456789ABCDEF';
const TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomString(length: number, charset: string): string {
  let out = '';
  for (let i = 0; i < length; i++) out += charset[Math.floor(Math.random() * charset.length)];
  return out;
}

export function generateProductId(): string {
  return 'PRD-' + randomString(8, TOKEN_CHARS);
}

export function generateTwinId(): string {
  return 'DPT-' + randomString(4, TOKEN_CHARS) + '-' + randomString(4, TOKEN_CHARS) + '-' + randomString(4, TOKEN_CHARS);
}

export function generateQuantumToken(): string {
  return (
    'QT-' +
    randomString(4, TOKEN_CHARS) +
    '-' +
    randomString(4, TOKEN_CHARS) +
    '-' +
    randomString(4, TOKEN_CHARS) +
    '-' +
    randomString(4, TOKEN_CHARS)
  );
}

export function generateQuantumSignature(): string {
  // ~128 hex chars -> QDS- prefix
  return 'QDS-' + randomString(128, HEX);
}

export function generateBlockchainTx(): string {
  return '0x' + randomString(64, '0123456789abcdef');
}

export function generateQrPayload(product: {
  id: string;
  twinId: string;
  quantumToken: string;
  quantumSignature: string;
  blockchainTx: string;
}): string {
  return JSON.stringify({
    v: 1,
    pid: product.id,
    twin: product.twinId,
    token: product.quantumToken,
    sig: product.quantumSignature,
    chain: product.blockchainTx,
  });
}

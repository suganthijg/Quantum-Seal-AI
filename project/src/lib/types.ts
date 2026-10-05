export type Role = 'manufacturer' | 'retailer' | 'customer' | 'admin';

export type ProductStatus = 'Registered' | 'In Transit' | 'Verified' | 'Sold' | 'Flagged';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  status: 'Active' | 'Suspended';
  products: number;
  lastLogin: string;
}

export interface Product {
  id: string;
  productName: string;
  brand: string;
  category: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  factoryLocation: string;
  retailPrice: number;
  manufacturerName: string;
  // generated
  twinId: string;
  quantumToken: string;
  quantumSignature: string;
  blockchainTx: string;
  registrationTimestamp: string;
  status: ProductStatus;
  // ownership / movement
  currentOwner: string;
  currentLocation: string;
  verificationCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  fraudReasons: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  stage: string;
  actor: string;
  location: string;
  timestamp: string;
}

export interface VerificationLog {
  id: string;
  productId: string;
  productName: string;
  verifier: string;
  role: Role;
  result: 'Authentic' | 'Counterfeit';
  location: string;
  timestamp: string;
}

export interface DBState {
  products: Product[];
  users: User[];
  verifications: VerificationLog[];
  monthlyRegistrations: number[];
  monthlyVerifications: number[];
  monthlyCounterfeits: number[];
}

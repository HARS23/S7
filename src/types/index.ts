export type CategorySlug = 'phones' | 'laptops' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  tagline: string;
  specs: Record<string, string>;
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type VerdictStatus = 'APPROVED' | 'STEP_UP' | 'BLOCKED';
export type EngineVerdict = 'CLEAN' | 'FLAGGED';

export interface FraudEngineResult {
  status: VerdictStatus;
  ruleVerdict: EngineVerdict;
  graphVerdict: EngineVerdict;
  score: number; // 0 (safe) - 100 (high risk)
  ruleReasons: string[];
  graphReasons: string[];
  matchedRingId?: string;
  connectedAccountIds?: string[];
  sharedEntities?: {
    deviceId?: string;
    ip?: string;
    shippingAddress?: string;
  };
}

export interface Order {
  id: string;
  timestamp: string;
  accountId: string;
  accountName: string;
  deviceId: string;
  cardId: string;
  cardLast4: string;
  ip: string;
  shippingAddress: string;
  normalizedAddress: string;
  amount: number;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: VerdictStatus;
  ruleVerdict: EngineVerdict;
  graphVerdict: EngineVerdict;
  score: number;
  ringId?: string;
  reasons: string[];
  isHistorical?: boolean;
}

export interface FraudRing {
  id: string;
  name: string;
  sharedType: 'deviceId' | 'ip' | 'shippingAddress';
  sharedValue: string;
  accountIds: string[];
  orderIds: string[];
  riskScore: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'account' | 'device' | 'ip' | 'address';
  ringId?: string;
  isCurrent?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
  ringId?: string;
}

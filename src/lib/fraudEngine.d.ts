import type { Order, FraudEngineResult } from '../types';
export declare function getOrCreateDeviceId(): string;
export declare function hashCardNumber(cardNumber: string): {
    cardId: string;
    cardLast4: string;
};
export declare function normalizeAddress(address: string): string;
export declare const PRESET_FRAUD_RINGS: ({
    ringId: string;
    name: string;
    sharedType: "deviceId";
    sharedValue: string;
    sharedAddress: string;
    sharedIp: string;
} | {
    ringId: string;
    name: string;
    sharedType: "shippingAddress";
    sharedValue: string;
    sharedAddress: string;
    sharedIp: string;
} | {
    ringId: string;
    name: string;
    sharedType: "ip";
    sharedValue: string;
    sharedAddress: string;
    sharedIp: string;
})[];
export declare function getStoredOrders(): Order[];
export declare function saveStoredOrders(orders: Order[]): void;
export declare function resetToSeedData(): Order[];
export declare function evaluateOrder(payload: {
    accountId: string;
    accountName: string;
    deviceId: string;
    cardId: string;
    cardLast4: string;
    ip: string;
    shippingAddress: string;
    amount: number;
    items: Array<{
        productId: string;
        name: string;
        quantity: number;
        price: number;
    }>;
}): {
    order: Order;
    result: FraudEngineResult;
};
export declare function getRiskAnalytics(): {
    totalOrders: number;
    ruleFlaggedCount: number;
    graphFlaggedCount: number;
    ruleMissedGraphCaught: number;
    bothFlagged: number;
    ringsList: {
        id: string;
        name: string;
        accountCount: number;
        orderCount: number;
        riskScore: number;
    }[];
};
//# sourceMappingURL=fraudEngine.d.ts.map
import type { Order, FraudEngineResult } from '../types';
interface OrderResultPageProps {
    lastResult: {
        order: Order;
        result: FraudEngineResult;
    } | null;
    navigate: (path: string) => void;
}
export declare const OrderResultPage: React.FC<OrderResultPageProps>;
export {};
//# sourceMappingURL=OrderResultPage.d.ts.map
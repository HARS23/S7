import type { CartItem, Order, FraudEngineResult } from '../types';
interface CheckoutPageProps {
    cart: CartItem[];
    clearCart: () => void;
    navigate: (path: string) => void;
    setLastOrderResult: (res: {
        order: Order;
        result: FraudEngineResult;
    }) => void;
}
export declare const CheckoutPage: React.FC<CheckoutPageProps>;
export {};
//# sourceMappingURL=CheckoutPage.d.ts.map
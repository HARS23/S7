import type { Order, FraudEngineResult } from '../types';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { IconWell } from '../components/ui/IconWell';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, XCircle, ShieldCheck, ShoppingBag } from 'lucide-react';

interface OrderResultPageProps {
  lastResult: { order: Order; result: FraudEngineResult } | null;
  navigate: (path: string) => void;
}

export const OrderResultPage: React.FC<OrderResultPageProps> = ({ lastResult, navigate }) => {
  const isApproved = lastResult ? lastResult.order.status === 'APPROVED' : true;
  const order = lastResult?.order;

  if (!isApproved) {
    // BLOCKED SCREEN (Friendly generic denial, no internal scores exposed)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8 pb-20">
        <NeuCard variant="deep" className="p-8 sm:p-12 text-center space-y-6">
          <IconWell size="xl" variant="standard" className="mx-auto text-[#E53E3E] bg-[#E0E5EC] shadow-[inset_8px_8px_16px_rgba(229,62,62,0.3)]">
            <XCircle className="w-12 h-12 text-[#E53E3E]" />
          </IconWell>

          <div className="space-y-2">
            <Badge variant="blocked">Transaction Declined</Badge>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#3D4852]">
              Order Could Not Be Completed
            </h1>
            <p className="text-sm font-medium text-[#6B7280] max-w-md mx-auto leading-relaxed">
              We were unable to process your order at this time. Our automated risk protection system has flagged this transaction for review.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] text-xs text-[#6B7280] space-y-1 text-left font-medium">
            <div className="font-bold text-[#3D4852] font-display flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E53E3E]" /> Notice for Shopper:
            </div>
            <p>
              Your card has not been charged. If you believe this is an error, please try an alternate payment method or reach out to customer support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <NeuButton variant="primary" size="md" onClick={() => navigate('/checkout')}>
              Try Alternate Payment
            </NeuButton>
            <NeuButton variant="secondary" size="md" onClick={() => navigate('/admin/risk')} icon={<ShieldCheck className="w-4 h-4 text-[#6C63FF]" />}>
              View in Analyst Risk Console
            </NeuButton>
          </div>
        </NeuCard>
      </div>
    );
  }

  // APPROVED SCREEN
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 pb-20">
      
      <NeuCard variant="deep" className="p-8 sm:p-12 text-center space-y-6">
        <IconWell size="xl" variant="teal" className="mx-auto">
          <CheckCircle2 className="w-12 h-12 text-[#38B2AC]" />
        </IconWell>

        <div className="space-y-2">
          <Badge variant="approved">Order Confirmed</Badge>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#3D4852]">
            Thank You For Your Order!
          </h1>
          <p className="text-sm font-medium text-[#6B7280]">
            Order confirmation and digital invoice sent to your email.
          </p>
        </div>

        {/* Order Meta Bar */}
        {order && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.6)] text-xs text-left">
            <div>
              <span className="font-bold text-[#6B7280] font-display block">Order ID</span>
              <span className="font-mono font-bold text-[#3D4852]">{order.id}</span>
            </div>
            <div>
              <span className="font-bold text-[#6B7280] font-display block">Total Amount</span>
              <span className="font-extrabold text-[#6C63FF]">${order.amount.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold text-[#6B7280] font-display block">Est. Delivery</span>
              <span className="font-semibold text-[#3D4852]">2 Business Days</span>
            </div>
            <div>
              <span className="font-bold text-[#6B7280] font-display block">Fraud Verdict</span>
              <span className="font-bold text-[#38B2AC]">VERIFIED SAFE</span>
            </div>
          </div>
        )}

        {/* Order Items */}
        {order && (
          <NeuCard className="p-6 space-y-4 text-left">
            <h3 className="font-display font-bold text-sm text-[#3D4852] border-b border-[#A3B1C6]/30 pb-2">
              Purchased Hardware
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-[#3D4852]">{item.name}</span>
                    <span className="text-xs text-[#6B7280] ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-[#3D4852]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </NeuCard>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <NeuButton variant="primary" size="md" onClick={() => navigate('/category/phones')} icon={<ShoppingBag className="w-4 h-4" />}>
            Continue Shopping
          </NeuButton>
          <NeuButton variant="secondary" size="md" onClick={() => navigate('/admin/risk')} icon={<ShieldCheck className="w-4 h-4 text-[#6C63FF]" />}>
            View Analyst Risk Console
          </NeuButton>
        </div>
      </NeuCard>

    </div>
  );
};

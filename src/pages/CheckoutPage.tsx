import { useState } from 'react';
import type { CartItem, Order, FraudEngineResult } from '../types';
import { evaluateOrder, getOrCreateDeviceId, hashCardNumber, PRESET_FRAUD_RINGS, scoreOrderWithFraudApi } from '../lib/fraudEngine';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuInput } from '../components/ui/NeuInput';
import { IconWell } from '../components/ui/IconWell';
import { Badge } from '../components/ui/Badge';
import { CreditCard, ShieldCheck, User, MapPin, Smartphone, Lock, Zap } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  clearCart: () => void;
  navigate: (path: string) => void;
  setLastOrderResult: (res: { order: Order; result: FraudEngineResult }) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  clearCart,
  navigate,
  setLastOrderResult,
}) => {
  // Form State
  const [fullName, setFullName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@example.com');
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield OR 97477');
  const [cardNumber, setCardNumber] = useState('4532 8910 2384 9012');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [ipAddress, setIpAddress] = useState('172.16.42.109');

  // Custom Device ID state
  const [activeDeviceId, setActiveDeviceId] = useState(getOrCreateDeviceId());

  // Step-Up OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingEvaluation, setPendingEvaluation] = useState<{ order: Order; result: FraudEngineResult } | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Presets Quick-Fill for Demo Verification
  const applyPreset = (type: 'normal' | 'high_value' | 'ring_alpha' | 'ring_beta' | 'ring_gamma') => {
    if (type === 'normal') {
      setFullName('Jordan Vance');
      setAddress(`${Math.floor(Math.random() * 900 + 100)} Pleasant Hill Rd, Austin TX 78704`);
      setIpAddress(`172.20.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 200)}`);
      setActiveDeviceId(`dev_unique_${Math.random().toString(36).slice(2, 8)}`);
    } else if (type === 'high_value') {
      setFullName('Taylor Reed');
      setAddress(`${Math.floor(Math.random() * 900 + 100)} Grand Avenue, Chicago IL 60611`);
      setIpAddress(`192.168.1.${Math.floor(Math.random() * 150)}`);
      setActiveDeviceId(`dev_unique_${Math.random().toString(36).slice(2, 8)}`);
    } else if (type === 'ring_alpha') {
      // Shared Device
      const ring = PRESET_FRAUD_RINGS[0];
      setFullName('Ring Mule (Shared Device)');
      setActiveDeviceId(ring.sharedValue);
      setIpAddress('198.51.100.42');
      setAddress('404 Cyber Alley, New York NY 10001');
    } else if (type === 'ring_beta') {
      // Shared Address
      const ring = PRESET_FRAUD_RINGS[1];
      setFullName('Ring Mule (Shared Address)');
      setActiveDeviceId(`dev_mule_${Math.random().toString(36).slice(2, 8)}`);
      setAddress(ring.sharedAddress);
      setIpAddress('203.0.113.19');
    } else if (type === 'ring_gamma') {
      // Shared IP
      const ring = PRESET_FRAUD_RINGS[2];
      setFullName('Ring Mule (Shared IP)');
      setActiveDeviceId(`dev_mule_${Math.random().toString(36).slice(2, 8)}`);
      setIpAddress(ring.sharedIp);
      setAddress('88 Fake Street Apartment 2B, Austin TX 78701');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const accountId = `acc_${fullName.toLowerCase().replace(/\s+/g, '_')}_${cardNumber.slice(-4)}`;
    const { cardId, cardLast4 } = hashCardNumber(cardNumber);

    const items = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const localEvaluation = evaluateOrder({
      accountId,
      accountName: fullName,
      deviceId: activeDeviceId,
      cardId,
      cardLast4,
      ip: ipAddress,
      shippingAddress: address,
      amount: total,
      items,
    });
    const remoteScore = await scoreOrderWithFraudApi({
      amount: total,
      transactionType: 'PAYMENT',
      step: Math.floor(Date.now() / 3600000),
      accountId,
      deviceId: activeDeviceId,
      ipAddress,
      shippingAddress: address,
    });
    const { order, result } = localEvaluation;
    if (remoteScore) {
      const remoteStatus = remoteScore.action === 'BLOCK' ? 'BLOCKED' : remoteScore.action === 'STEP_UP' ? 'STEP_UP' : 'APPROVED';
      order.status = remoteStatus;
      order.score = remoteScore.risk_score;
      order.modelVersion = remoteScore.model_version;
      order.autonomousAction = remoteScore.action;
      order.confidence = Math.round(remoteScore.confidence * 100);
      order.reasons.push(...remoteScore.signals.map((signal) => `Trained model signal: ${signal}`));
      result.status = remoteStatus;
      result.score = remoteScore.risk_score;
      result.modelVersion = remoteScore.model_version;
      result.autonomousAction = remoteScore.action;
      result.confidence = Math.round(remoteScore.confidence * 100);
      result.graphSignals = remoteScore.signals;
    }

    setLastOrderResult({ order, result });

    if (result.status === 'STEP_UP') {
      // Require Step-Up Verification Modal
      setPendingEvaluation({ order, result });
      setShowOtpModal(true);
    } else if (result.status === 'BLOCKED') {
      clearCart();
      navigate('/order-result?status=blocked');
    } else {
      clearCart();
      navigate('/order-result?status=approved');
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '123456' || otpCode.trim().length >= 4) {
      if (pendingEvaluation) {
        pendingEvaluation.order.status = 'APPROVED';
        pendingEvaluation.order.reasons.push('Verified via SMS OTP Step-Up');
        setLastOrderResult(pendingEvaluation);
      }
      setShowOtpModal(false);
      clearCart();
      navigate('/order-result?status=approved');
    } else {
      setOtpError('Invalid verification code. Try entering 123456');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 pb-20">
      
      {/* Quick Demo Fill Toolbar */}
      <NeuCard variant="deep" className="p-6 border border-[#6C63FF]/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#A3B1C6]/30 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#6C63FF] animate-pulse" />
            <span className="font-display font-extrabold text-sm text-[#3D4852]">
              Demo Quick-Fill Profiles (Test Fraud Engine Outcomes)
            </span>
          </div>
          <Badge variant="ring" size="sm">Rule & Graph Simulation</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-[#38B2AC]">1. Normal Order</span>
              <Badge variant="approved" size="sm">Approve</Badge>
            </div>
            <p className="text-[11px] text-[#6B7280]">Clean profile, amount under $500</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('high_value')}
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-[#D69E2E]">2. High-Value Order</span>
              <Badge variant="stepup" size="sm">Step-Up OTP</Badge>
            </div>
            <p className="text-[11px] text-[#6B7280]">Unique identity, amount &gt; $500</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('ring_alpha')}
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-[#E53E3E]">3. Shared Device Ring</span>
              <Badge variant="blocked" size="sm">Block</Badge>
            </div>
            <p className="text-[11px] text-[#6B7280]">Matches Syndicate Alpha Device</p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('ring_beta')}
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-[#E53E3E]">4. Reshipping Address</span>
              <Badge variant="blocked" size="sm">Block</Badge>
            </div>
            <p className="text-[11px] text-[#6B7280]">Matches Syndicate Beta Address</p>
          </button>
        </div>
      </NeuCard>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Info */}
          <NeuCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#A3B1C6]/30 pb-3">
              <IconWell size="sm" variant="deep">
                <MapPin className="w-5 h-5 text-[#6C63FF]" />
              </IconWell>
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#3D4852]">Shipping Address</h2>
                <p className="text-xs text-[#6B7280] font-semibold">Address will be normalized for graph cluster matching</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NeuInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                icon={<User className="w-4 h-4" />}
              />
              <NeuInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <NeuInput
              label="Shipping Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              icon={<MapPin className="w-4 h-4" />}
            />
          </NeuCard>

          {/* Payment Info */}
          <NeuCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-[#A3B1C6]/30 pb-3">
              <IconWell size="sm" variant="deep">
                <CreditCard className="w-5 h-5 text-[#6C63FF]" />
              </IconWell>
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#3D4852]">Mock Payment Details</h2>
                <p className="text-xs text-[#6B7280] font-semibold">Card number is securely hashed before engine evaluation</p>
              </div>
            </div>

            <NeuInput
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              icon={<CreditCard className="w-4 h-4" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <NeuInput
                label="Expiration Date"
                value={cardExp}
                onChange={(e) => setCardExp(e.target.value)}
                required
              />
              <NeuInput
                label="CVC / CVV"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                required
                icon={<Lock className="w-4 h-4" />}
              />
            </div>
          </NeuCard>

          {/* Simulated Entity Signals (For Demonstration Transparency) */}
          <NeuCard variant="inset" className="p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-display font-bold text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-[#6C63FF]" /> Simulated Device ID:
              </span>
              <span className="font-mono text-[#3D4852]">{activeDeviceId}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-display font-bold text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-[#38B2AC]" /> Simulated IP Address:
              </span>
              <span className="font-mono text-[#3D4852]">{ipAddress}</span>
            </div>
          </NeuCard>

        </div>

        {/* Order Summary & Place Order */}
        <NeuCard variant="deep" className="p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-extrabold text-xl text-[#3D4852]">Summary</h2>

          <div className="space-y-3 text-sm font-semibold text-[#6B7280]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-[#3D4852]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-bold text-[#3D4852]">${tax.toFixed(2)}</span>
            </div>
            
            <div className="pt-4 border-t border-[#A3B1C6]/30 flex justify-between items-baseline text-base font-display">
              <span className="font-bold text-[#3D4852]">Total</span>
              <span className="font-extrabold text-2xl text-[#6C63FF]">${total.toFixed(2)}</span>
            </div>
          </div>

          <NeuButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            icon={<Lock className="w-5 h-5" />}
          >
            Place Order (${total.toFixed(2)})
          </NeuButton>

          <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] space-y-2 text-xs font-medium text-[#6B7280]">
            <div className="flex items-center gap-2 font-bold text-[#3D4852] font-display">
              <ShieldCheck className="w-4 h-4 text-[#38B2AC]" />
              <span>Synchronous Fraud Inspection</span>
            </div>
            <p>
              Your order will undergo parallel rule & graph network checks before final approval.
            </p>
          </div>
        </NeuCard>

      </form>

      {/* STEP-UP REQUIRED OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <NeuCard className="max-w-md w-full p-8 space-y-6 text-center shadow-2xl">
            <IconWell size="lg" variant="deep" className="mx-auto">
              <Smartphone className="w-8 h-8 text-[#6C63FF]" />
            </IconWell>

            <div className="space-y-2">
              <Badge variant="stepup">Verification Required</Badge>
              <h2 className="font-display font-extrabold text-2xl text-[#3D4852]">
                Order Verification Code
              </h2>
              <p className="text-xs text-[#6B7280] font-semibold">
                High transaction amount detected (&gt; $500.00). We sent a 6-digit security code to your phone.
              </p>
            </div>

            <div className="space-y-4">
              <NeuInput
                placeholder="Enter 6-digit code (e.g. 123456)"
                value={otpCode}
                onChange={(e) => { setOtpCode(e.target.value); setOtpError(''); }}
                className="text-center font-mono text-lg tracking-widest"
                error={otpError}
              />
              <p className="text-[11px] font-bold text-[#6C63FF]">
                Demo Tip: Type 123456 to pass verification
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NeuButton
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </NeuButton>
              <NeuButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleVerifyOtp}
              >
                Confirm Code
              </NeuButton>
            </div>
          </NeuCard>
        </div>
      )}

    </div>
  );
};

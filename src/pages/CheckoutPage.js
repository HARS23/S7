import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { evaluateOrder, getOrCreateDeviceId, hashCardNumber, PRESET_FRAUD_RINGS } from '../lib/fraudEngine';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuInput } from '../components/ui/NeuInput';
import { IconWell } from '../components/ui/IconWell';
import { Badge } from '../components/ui/Badge';
import { CreditCard, ShieldCheck, User, MapPin, Smartphone, Lock, Zap } from 'lucide-react';
export const CheckoutPage = ({ cart, clearCart, navigate, setLastOrderResult, }) => {
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
    const [pendingEvaluation, setPendingEvaluation] = useState(null);
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    // Presets Quick-Fill for Demo Verification
    const applyPreset = (type) => {
        if (type === 'normal') {
            setFullName('Jordan Vance');
            setAddress(`${Math.floor(Math.random() * 900 + 100)} Pleasant Hill Rd, Austin TX 78704`);
            setIpAddress(`172.20.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 200)}`);
            setActiveDeviceId(`dev_unique_${Math.random().toString(36).slice(2, 8)}`);
        }
        else if (type === 'high_value') {
            setFullName('Taylor Reed');
            setAddress(`${Math.floor(Math.random() * 900 + 100)} Grand Avenue, Chicago IL 60611`);
            setIpAddress(`192.168.1.${Math.floor(Math.random() * 150)}`);
            setActiveDeviceId(`dev_unique_${Math.random().toString(36).slice(2, 8)}`);
        }
        else if (type === 'ring_alpha') {
            // Shared Device
            const ring = PRESET_FRAUD_RINGS[0];
            setFullName('Ring Mule (Shared Device)');
            setActiveDeviceId(ring.sharedValue);
            setIpAddress('198.51.100.42');
            setAddress('404 Cyber Alley, New York NY 10001');
        }
        else if (type === 'ring_beta') {
            // Shared Address
            const ring = PRESET_FRAUD_RINGS[1];
            setFullName('Ring Mule (Shared Address)');
            setActiveDeviceId(`dev_mule_${Math.random().toString(36).slice(2, 8)}`);
            setAddress(ring.sharedAddress);
            setIpAddress('203.0.113.19');
        }
        else if (type === 'ring_gamma') {
            // Shared IP
            const ring = PRESET_FRAUD_RINGS[2];
            setFullName('Ring Mule (Shared IP)');
            setActiveDeviceId(`dev_mule_${Math.random().toString(36).slice(2, 8)}`);
            setIpAddress(ring.sharedIp);
            setAddress('88 Fake Street Apartment 2B, Austin TX 78701');
        }
    };
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        const accountId = `acc_${fullName.toLowerCase().replace(/\s+/g, '_')}_${cardNumber.slice(-4)}`;
        const { cardId, cardLast4 } = hashCardNumber(cardNumber);
        const items = cart.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
        }));
        const { order, result } = evaluateOrder({
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
        setLastOrderResult({ order, result });
        if (result.status === 'STEP_UP') {
            // Require Step-Up Verification Modal
            setPendingEvaluation({ order, result });
            setShowOtpModal(true);
        }
        else if (result.status === 'BLOCKED') {
            clearCart();
            navigate('/order-result?status=blocked');
        }
        else {
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
        }
        else {
            setOtpError('Invalid verification code. Try entering 123456');
        }
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 pb-20", children: [_jsxs(NeuCard, { variant: "deep", className: "p-6 border border-[#6C63FF]/30 space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#A3B1C6]/30 pb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5 text-[#6C63FF] animate-pulse" }), _jsx("span", { className: "font-display font-extrabold text-sm text-[#3D4852]", children: "Demo Quick-Fill Profiles (Test Fraud Engine Outcomes)" })] }), _jsx(Badge, { variant: "ring", size: "sm", children: "Rule & Graph Simulation" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: [_jsxs("button", { type: "button", onClick: () => applyPreset('normal'), className: "p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-display font-bold text-xs text-[#38B2AC]", children: "1. Normal Order" }), _jsx(Badge, { variant: "approved", size: "sm", children: "Approve" })] }), _jsx("p", { className: "text-[11px] text-[#6B7280]", children: "Clean profile, amount under $500" })] }), _jsxs("button", { type: "button", onClick: () => applyPreset('high_value'), className: "p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-display font-bold text-xs text-[#D69E2E]", children: "2. High-Value Order" }), _jsx(Badge, { variant: "stepup", size: "sm", children: "Step-Up OTP" })] }), _jsx("p", { className: "text-[11px] text-[#6B7280]", children: "Unique identity, amount > $500" })] }), _jsxs("button", { type: "button", onClick: () => applyPreset('ring_alpha'), className: "p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-display font-bold text-xs text-[#E53E3E]", children: "3. Shared Device Ring" }), _jsx(Badge, { variant: "blocked", size: "sm", children: "Block" })] }), _jsx("p", { className: "text-[11px] text-[#6B7280]", children: "Matches Syndicate Alpha Device" })] }), _jsxs("button", { type: "button", onClick: () => applyPreset('ring_beta'), className: "p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.75)] text-left space-y-1 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-display font-bold text-xs text-[#E53E3E]", children: "4. Reshipping Address" }), _jsx(Badge, { variant: "blocked", size: "sm", children: "Block" })] }), _jsx("p", { className: "text-[11px] text-[#6B7280]", children: "Matches Syndicate Beta Address" })] })] })] }), _jsxs("form", { onSubmit: handlePlaceOrder, className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start", children: [_jsxs("div", { className: "lg:col-span-2 space-y-8", children: [_jsxs(NeuCard, { className: "p-6 sm:p-8 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-[#A3B1C6]/30 pb-3", children: [_jsx(IconWell, { size: "sm", variant: "deep", children: _jsx(MapPin, { className: "w-5 h-5 text-[#6C63FF]" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-display font-extrabold text-lg text-[#3D4852]", children: "Shipping Address" }), _jsx("p", { className: "text-xs text-[#6B7280] font-semibold", children: "Address will be normalized for graph cluster matching" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(NeuInput, { label: "Full Name", value: fullName, onChange: (e) => setFullName(e.target.value), required: true, icon: _jsx(User, { className: "w-4 h-4" }) }), _jsx(NeuInput, { label: "Email Address", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsx(NeuInput, { label: "Shipping Address", value: address, onChange: (e) => setAddress(e.target.value), required: true, icon: _jsx(MapPin, { className: "w-4 h-4" }) })] }), _jsxs(NeuCard, { className: "p-6 sm:p-8 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-[#A3B1C6]/30 pb-3", children: [_jsx(IconWell, { size: "sm", variant: "deep", children: _jsx(CreditCard, { className: "w-5 h-5 text-[#6C63FF]" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-display font-extrabold text-lg text-[#3D4852]", children: "Mock Payment Details" }), _jsx("p", { className: "text-xs text-[#6B7280] font-semibold", children: "Card number is securely hashed before engine evaluation" })] })] }), _jsx(NeuInput, { label: "Card Number", value: cardNumber, onChange: (e) => setCardNumber(e.target.value), required: true, icon: _jsx(CreditCard, { className: "w-4 h-4" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(NeuInput, { label: "Expiration Date", value: cardExp, onChange: (e) => setCardExp(e.target.value), required: true }), _jsx(NeuInput, { label: "CVC / CVV", value: cardCvc, onChange: (e) => setCardCvc(e.target.value), required: true, icon: _jsx(Lock, { className: "w-4 h-4" }) })] })] }), _jsxs(NeuCard, { variant: "inset", className: "p-6 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-display font-bold text-[#6B7280]", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Smartphone, { className: "w-4 h-4 text-[#6C63FF]" }), " Simulated Device ID:"] }), _jsx("span", { className: "font-mono text-[#3D4852]", children: activeDeviceId })] }), _jsxs("div", { className: "flex items-center justify-between text-xs font-display font-bold text-[#6B7280]", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Lock, { className: "w-4 h-4 text-[#38B2AC]" }), " Simulated IP Address:"] }), _jsx("span", { className: "font-mono text-[#3D4852]", children: ipAddress })] })] })] }), _jsxs(NeuCard, { variant: "deep", className: "p-6 sm:p-8 space-y-6", children: [_jsx("h2", { className: "font-display font-extrabold text-xl text-[#3D4852]", children: "Summary" }), _jsxs("div", { className: "space-y-3 text-sm font-semibold text-[#6B7280]", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Items Subtotal" }), _jsxs("span", { className: "font-bold text-[#3D4852]", children: ["$", subtotal.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Estimated Tax" }), _jsxs("span", { className: "font-bold text-[#3D4852]", children: ["$", tax.toFixed(2)] })] }), _jsxs("div", { className: "pt-4 border-t border-[#A3B1C6]/30 flex justify-between items-baseline text-base font-display", children: [_jsx("span", { className: "font-bold text-[#3D4852]", children: "Total" }), _jsxs("span", { className: "font-extrabold text-2xl text-[#6C63FF]", children: ["$", total.toFixed(2)] })] })] }), _jsxs(NeuButton, { type: "submit", variant: "primary", size: "lg", className: "w-full", icon: _jsx(Lock, { className: "w-5 h-5" }), children: ["Place Order ($", total.toFixed(2), ")"] }), _jsxs("div", { className: "p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] space-y-2 text-xs font-medium text-[#6B7280]", children: [_jsxs("div", { className: "flex items-center gap-2 font-bold text-[#3D4852] font-display", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-[#38B2AC]" }), _jsx("span", { children: "Synchronous Fraud Inspection" })] }), _jsx("p", { children: "Your order will undergo parallel rule & graph network checks before final approval." })] })] })] }), showOtpModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn", children: _jsxs(NeuCard, { className: "max-w-md w-full p-8 space-y-6 text-center shadow-2xl", children: [_jsx(IconWell, { size: "lg", variant: "deep", className: "mx-auto", children: _jsx(Smartphone, { className: "w-8 h-8 text-[#6C63FF]" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx(Badge, { variant: "stepup", children: "Verification Required" }), _jsx("h2", { className: "font-display font-extrabold text-2xl text-[#3D4852]", children: "Order Verification Code" }), _jsx("p", { className: "text-xs text-[#6B7280] font-semibold", children: "High transaction amount detected (> $500.00). We sent a 6-digit security code to your phone." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(NeuInput, { placeholder: "Enter 6-digit code (e.g. 123456)", value: otpCode, onChange: (e) => { setOtpCode(e.target.value); setOtpError(''); }, className: "text-center font-mono text-lg tracking-widest", error: otpError }), _jsx("p", { className: "text-[11px] font-bold text-[#6C63FF]", children: "Demo Tip: Type 123456 to pass verification" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(NeuButton, { variant: "secondary", size: "md", className: "w-full", onClick: () => setShowOtpModal(false), children: "Cancel" }), _jsx(NeuButton, { variant: "primary", size: "md", className: "w-full", onClick: handleVerifyOtp, children: "Confirm Code" })] })] }) }))] }));
};
//# sourceMappingURL=CheckoutPage.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { getStoredOrders, getRiskAnalytics, resetToSeedData } from '../lib/fraudEngine';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { Badge } from '../components/ui/Badge';
import { ShieldAlert, RefreshCw, Zap, Network, Layers, AlertTriangle } from 'lucide-react';
export const RiskConsolePage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedRingFilter, setSelectedRingFilter] = useState('all');
    const [selectedNode, setSelectedNode] = useState(null);
    const loadData = () => {
        setOrders(getStoredOrders());
    };
    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 3000);
        return () => clearInterval(interval);
    }, []);
    const handleResetData = () => {
        const seed = resetToSeedData();
        setOrders(seed);
        setSelectedNode(null);
    };
    const analytics = useMemo(() => getRiskAnalytics(), [orders]);
    // Build Network Graph Nodes and Edges from recent orders
    const graphData = useMemo(() => {
        const nodesMap = new Map();
        const edges = [];
        // Filter to last 40 orders + ring orders for graph clarity
        const graphOrders = orders.filter(o => o.ringId || !o.isHistorical).slice(0, 40);
        graphOrders.forEach(ord => {
            const accNodeId = `acc_${ord.accountId}`;
            const devNodeId = `dev_${ord.deviceId}`;
            const ipNodeId = `ip_${ord.ip}`;
            const addrNodeId = `addr_${ord.normalizedAddress.slice(0, 15)}`;
            if (!nodesMap.has(accNodeId)) {
                nodesMap.set(accNodeId, {
                    id: accNodeId,
                    label: ord.accountName,
                    type: 'account',
                    ringId: ord.ringId,
                    isCurrent: !ord.isHistorical
                });
            }
            if (!nodesMap.has(devNodeId)) {
                nodesMap.set(devNodeId, {
                    id: devNodeId,
                    label: ord.deviceId.slice(0, 14),
                    type: 'device',
                    ringId: ord.ringId,
                });
            }
            if (!nodesMap.has(ipNodeId)) {
                nodesMap.set(ipNodeId, {
                    id: ipNodeId,
                    label: ord.ip,
                    type: 'ip',
                    ringId: ord.ringId,
                });
            }
            if (!nodesMap.has(addrNodeId)) {
                nodesMap.set(addrNodeId, {
                    id: addrNodeId,
                    label: ord.normalizedAddress.slice(0, 16) + '...',
                    type: 'address',
                    ringId: ord.ringId,
                });
            }
            edges.push({ source: accNodeId, target: devNodeId, ringId: ord.ringId });
            edges.push({ source: accNodeId, target: ipNodeId, ringId: ord.ringId });
            edges.push({ source: accNodeId, target: addrNodeId, ringId: ord.ringId });
        });
        const nodes = Array.from(nodesMap.values());
        return { nodes, edges };
    }, [orders]);
    const filteredOrders = useMemo(() => {
        if (selectedRingFilter === 'all')
            return orders.slice(0, 30);
        if (selectedRingFilter === 'flagged')
            return orders.filter(o => o.graphVerdict === 'FLAGGED').slice(0, 30);
        return orders.filter(o => o.ringId === selectedRingFilter).slice(0, 30);
    }, [orders, selectedRingFilter]);
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 pb-20", children: [_jsxs(NeuCard, { variant: "deep", className: "p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: "space-y-2 text-center md:text-left", children: [_jsxs("div", { className: "inline-flex items-center gap-2", children: [_jsx(Badge, { variant: "ring", size: "sm", children: "ANALYST DASHBOARD" }), _jsxs("span", { className: "text-xs font-bold text-[#38B2AC] flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[#38B2AC] animate-ping" }), "Live Sync Active"] })] }), _jsxs("h1", { className: "font-display font-extrabold text-3xl sm:text-4xl text-[#3D4852] flex items-center justify-center md:justify-start gap-3", children: [_jsx(ShieldAlert, { className: "w-8 h-8 text-[#6C63FF]" }), "Nimbus Risk Console"] }), _jsx("p", { className: "text-xs font-semibold text-[#6B7280]", children: "Comparing Baseline Rule Engine vs Real-Time Entity Graph Network Protection" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(NeuButton, { variant: "secondary", size: "md", onClick: loadData, icon: _jsx(RefreshCw, { className: "w-4 h-4 text-[#6C63FF]" }), children: "Refresh Engine" }), _jsx(NeuButton, { variant: "danger", size: "md", onClick: handleResetData, children: "Reset Seed Data" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(NeuCard, { className: "p-6 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-bold font-display text-[#6B7280]", children: [_jsx("span", { children: "Total Evaluated Orders" }), _jsx(Layers, { className: "w-4 h-4 text-[#6C63FF]" })] }), _jsx("div", { className: "text-3xl font-display font-extrabold text-[#3D4852]", children: analytics.totalOrders }), _jsx("p", { className: "text-[11px] font-medium text-[#6B7280]", children: "Includes 150 historical seed orders" })] }), _jsxs(NeuCard, { className: "p-6 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-bold font-display text-[#6B7280]", children: [_jsx("span", { children: "Rule Engine Flags" }), _jsx(AlertTriangle, { className: "w-4 h-4 text-[#D69E2E]" })] }), _jsx("div", { className: "text-3xl font-display font-extrabold text-[#D69E2E]", children: analytics.ruleFlaggedCount }), _jsx("p", { className: "text-[11px] font-medium text-[#6B7280]", children: "Flags transactions > $500 threshold" })] }), _jsxs(NeuCard, { className: "p-6 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-bold font-display text-[#6B7280]", children: [_jsx("span", { children: "Graph Engine Detections" }), _jsx(Network, { className: "w-4 h-4 text-[#6C63FF]" })] }), _jsx("div", { className: "text-3xl font-display font-extrabold text-[#6C63FF]", children: analytics.graphFlaggedCount }), _jsx("p", { className: "text-[11px] font-medium text-[#6B7280]", children: "Multi-account entity overlap matches" })] }), _jsxs(NeuCard, { variant: "deep", className: "p-6 space-y-3 border-l-4 border-l-[#38B2AC]", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-bold font-display text-[#38B2AC]", children: [_jsx("span", { children: "Graph Engine Lift" }), _jsx(Zap, { className: "w-4 h-4 text-[#38B2AC]" })] }), _jsxs("div", { className: "text-3xl font-display font-extrabold text-[#38B2AC]", children: ["+", analytics.ruleMissedGraphCaught] }), _jsx("p", { className: "text-[11px] font-bold text-[#6B7280]", children: "Fraud ring orders caught that Rule missed!" })] })] }), _jsxs(NeuCard, { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#A3B1C6]/30 pb-4", children: [_jsxs("div", { children: [_jsxs("h2", { className: "font-display font-extrabold text-2xl text-[#3D4852] flex items-center gap-2", children: [_jsx(Network, { className: "w-6 h-6 text-[#6C63FF]" }), "Entity Network Graph Visualizer"] }), _jsx("p", { className: "text-xs text-[#6B7280] font-semibold", children: "Live linkage topology between Accounts, Devices, IPs, and Shipping Addresses" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("button", { onClick: () => setSelectedRingFilter('all'), className: `px-3 py-1 rounded-xl text-xs font-display font-bold transition-all ${selectedRingFilter === 'all'
                                            ? 'bg-[#6C63FF] text-white shadow-md'
                                            : 'bg-[#E0E5EC] text-[#6B7280] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'}`, children: "All Activity" }), _jsx("button", { onClick: () => setSelectedRingFilter('flagged'), className: `px-3 py-1 rounded-xl text-xs font-display font-bold transition-all ${selectedRingFilter === 'flagged'
                                            ? 'bg-[#E53E3E] text-white shadow-md'
                                            : 'bg-[#E0E5EC] text-[#6B7280] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]'}`, children: "All Fraud Rings" })] })] }), _jsxs("div", { className: "relative w-full h-[450px] bg-[#E0E5EC] rounded-3xl shadow-[inset_10px_10px_20px_rgba(163,177,198,0.75),inset_-10px_-10px_20px_rgba(255,255,255,0.7)] overflow-hidden flex items-center justify-center", children: [_jsxs("svg", { className: "w-full h-full", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "ringGlow", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#6C63FF", stopOpacity: "0.8" }), _jsx("stop", { offset: "100%", stopColor: "#E53E3E", stopOpacity: "0.8" })] }) }), graphData.edges.slice(0, 60).map((edge, idx) => {
                                        const srcIdx = graphData.nodes.findIndex(n => n.id === edge.source);
                                        const tgtIdx = graphData.nodes.findIndex(n => n.id === edge.target);
                                        if (srcIdx === -1 || tgtIdx === -1)
                                            return null;
                                        // Grid node positioning layout
                                        const srcX = 100 + (srcIdx % 8) * 110 + (srcIdx % 3) * 20;
                                        const srcY = 70 + Math.floor(srcIdx / 8) * 100 + (srcIdx % 2) * 15;
                                        const tgtX = 100 + (tgtIdx % 8) * 110 + (tgtIdx % 3) * 20;
                                        const tgtY = 70 + Math.floor(tgtIdx / 8) * 100 + (tgtIdx % 2) * 15;
                                        const isRing = Boolean(edge.ringId);
                                        return (_jsx("line", { x1: srcX, y1: srcY, x2: tgtX, y2: tgtY, stroke: isRing ? 'url(#ringGlow)' : 'rgba(163, 177, 198, 0.4)', strokeWidth: isRing ? 2.5 : 1, strokeDasharray: isRing ? '4,2' : undefined }, idx));
                                    }), graphData.nodes.slice(0, 40).map((node, idx) => {
                                        const cx = 100 + (idx % 8) * 110 + (idx % 3) * 20;
                                        const cy = 70 + Math.floor(idx / 8) * 100 + (idx % 2) * 15;
                                        const isRing = Boolean(node.ringId);
                                        const isCurrent = node.isCurrent;
                                        const nodeColor = isRing
                                            ? '#6C63FF'
                                            : node.type === 'account'
                                                ? '#38B2AC'
                                                : node.type === 'device'
                                                    ? '#3182CE'
                                                    : '#D69E2E';
                                        return (_jsxs("g", { onClick: () => setSelectedNode(node), className: "cursor-pointer group hover:scale-125 transition-transform", children: [isRing && (_jsx("circle", { cx: cx, cy: cy, r: 18, fill: "none", stroke: "#6C63FF", strokeWidth: "2", className: "animate-ping opacity-75" })), isCurrent && (_jsx("circle", { cx: cx, cy: cy, r: 22, fill: "none", stroke: "#38B2AC", strokeWidth: "2", className: "animate-pulse" })), _jsx("circle", { cx: cx, cy: cy, r: isRing ? 12 : 9, fill: nodeColor, filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.2))" }), _jsx("text", { x: cx, y: cy + 22, textAnchor: "middle", fill: "#3D4852", fontSize: "9", fontWeight: "700", fontFamily: "Plus Jakarta Sans", children: node.label })] }, node.id));
                                    })] }), _jsxs("div", { className: "absolute bottom-4 left-4 p-3 rounded-2xl bg-[#E0E5EC]/90 backdrop-blur-md shadow-[4px_4px_8px_rgba(163,177,198,0.65),-4px_-4px_8px_rgba(255,255,255,0.6)] flex items-center gap-4 text-[11px] font-bold font-display text-[#6B7280]", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-[#38B2AC]" }), " Account"] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-[#3182CE]" }), " Device"] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-[#D69E2E]" }), " IP / Address"] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-[#6C63FF] animate-pulse" }), " Fraud Ring Match"] })] })] }), selectedNode && (_jsxs(NeuCard, { variant: "deep", className: "p-4 flex items-center justify-between border-l-4 border-l-[#6C63FF]", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: selectedNode.ringId ? 'ring' : 'neutral', children: ["Node: ", selectedNode.type.toUpperCase()] }), _jsx("span", { className: "font-mono text-xs font-bold text-[#3D4852]", children: selectedNode.id })] }), _jsxs("p", { className: "text-xs text-[#6B7280] font-semibold", children: ["Label: ", _jsx("strong", { className: "text-[#3D4852]", children: selectedNode.label }), " ", selectedNode.ringId ? `| Tagged in Ring ${selectedNode.ringId}` : '| Clean Entity'] })] }), _jsx(NeuButton, { variant: "ghost", size: "sm", onClick: () => setSelectedNode(null), children: "Close" })] }))] }), _jsxs(NeuCard, { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-[#A3B1C6]/30 pb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-display font-extrabold text-2xl text-[#3D4852]", children: "Live Order Stream & Engine Comparison" }), _jsx("p", { className: "text-xs text-[#6B7280] font-semibold", children: "Side-by-side evaluation output for every order passing through checkout" })] }), _jsxs(Badge, { variant: "ring", children: [filteredOrders.length, " Feed Items"] })] }), _jsx("div", { className: "space-y-3", children: filteredOrders.map((ord) => (_jsxs(NeuCard, { variant: ord.graphVerdict === 'FLAGGED' ? 'deep' : 'extruded', className: "p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-mono text-xs font-bold text-[#3D4852]", children: ord.id }), !ord.isHistorical && _jsx(Badge, { variant: "accent", size: "sm", children: "NEW LIVE ORDER" }), ord.ringId && _jsx(Badge, { variant: "ring", size: "sm", children: ord.ringId })] }), _jsxs("div", { className: "text-sm font-bold text-[#3D4852] font-display flex items-center gap-3", children: [_jsx("span", { children: ord.accountName }), _jsxs("span", { className: "text-xs font-normal text-[#6B7280]", children: ["($", ord.amount.toFixed(2), ")"] })] }), _jsxs("div", { className: "text-[11px] text-[#6B7280] font-mono flex flex-wrap items-center gap-3", children: [_jsxs("span", { children: ["Dev: ", ord.deviceId.slice(0, 16)] }), _jsxs("span", { children: ["IP: ", ord.ip] }), _jsxs("span", { children: ["Addr: ", ord.normalizedAddress.slice(0, 24), "..."] })] })] }), _jsxs("div", { className: "flex items-center gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#A3B1C6]/20", children: [_jsxs("div", { className: "flex flex-col items-center p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] min-w-28 text-center", children: [_jsx("span", { className: "text-[9px] font-bold text-[#6B7280] uppercase tracking-wider font-display", children: "Rule Engine" }), _jsx(Badge, { variant: ord.ruleVerdict === 'FLAGGED' ? 'stepup' : 'neutral', size: "sm", className: "mt-1", children: ord.ruleVerdict })] }), _jsxs("div", { className: "flex flex-col items-center p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] min-w-28 text-center", children: [_jsx("span", { className: "text-[9px] font-bold text-[#6B7280] uppercase tracking-wider font-display", children: "Graph Engine" }), _jsx(Badge, { variant: ord.graphVerdict === 'FLAGGED' ? 'blocked' : 'approved', size: "sm", className: "mt-1", children: ord.graphVerdict })] }), _jsx("div", { className: "min-w-24 text-right", children: _jsx(Badge, { variant: ord.status === 'APPROVED' ? 'approved' : ord.status === 'STEP_UP' ? 'stepup' : 'blocked', children: ord.status }) })] })] }, ord.id))) })] })] }));
};
//# sourceMappingURL=RiskConsolePage.js.map
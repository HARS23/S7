const STORE_KEY_ORDERS = 'nimbus_orders_history_v1';
const STORE_KEY_DEVICE = 'nimbus_device_id_v1';
// Get or initialize persistent Device ID
export function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem(STORE_KEY_DEVICE);
    if (!deviceId) {
        deviceId = `dev_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
        localStorage.setItem(STORE_KEY_DEVICE, deviceId);
    }
    return deviceId;
}
// Simple deterministic string hash for card numbers
export function hashCardNumber(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    const last4 = digits.slice(-4) || '4242';
    let hash = 0;
    for (let i = 0; i < digits.length; i++) {
        hash = (hash << 5) - hash + digits.charCodeAt(i);
        hash |= 0;
    }
    return {
        cardId: `card_hash_${Math.abs(hash).toString(16)}`,
        cardLast4: last4
    };
}
// Normalize shipping address
export function normalizeAddress(address) {
    return address
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
}
// --- PRESET FRAUD RINGS FOR SEED DATA ---
export const PRESET_FRAUD_RINGS = [
    {
        ringId: 'ring_alpha',
        name: 'Syndicate Alpha (Shared Device)',
        sharedType: 'deviceId',
        sharedValue: 'dev_syndicate_alpha_shared_macbook',
        sharedAddress: '742 evergreen terrace springfield or 97477',
        sharedIp: '198.51.100.42',
    },
    {
        ringId: 'ring_beta',
        name: 'Syndicate Beta (Reshipping Address)',
        sharedType: 'shippingAddress',
        sharedValue: '1048 industrial parkway hub 4 miami fl 33101',
        sharedAddress: '1048 industrial parkway hub 4 miami fl 33101',
        sharedIp: '203.0.113.19',
    },
    {
        ringId: 'ring_gamma',
        name: 'Syndicate Gamma (Shared Proxy IP)',
        sharedType: 'ip',
        sharedValue: '185.220.101.5',
        sharedAddress: '88 fake street apartment 2b austin tx 78701',
        sharedIp: '185.220.101.5',
    },
    {
        ringId: 'ring_delta',
        name: 'Syndicate Delta (Cross-Country Device Cluster)',
        sharedType: 'deviceId',
        sharedValue: 'dev_cross_country_emulator_99',
        sharedAddress: '404 ghost lane suite 100 seattle wa 98101',
        sharedIp: '192.0.2.88',
    }
];
// Generate ~150 clean historical orders + 4 hand-crafted fraud rings (~34 orders)
function generateSeedOrders() {
    const seed = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    // 1. Generate ~140 clean historical orders
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Pat', 'Riley', 'Avery', 'Dakota', 'Casey', 'Jesse', 'Skyler', 'Reese'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson'];
    const cities = ['New York NY', 'Los Angeles CA', 'Chicago IL', 'Houston TX', 'Phoenix AZ', 'Philadelphia PA', 'San Antonio TX', 'San Diego CA', 'Dallas TX', 'San Jose CA'];
    for (let i = 1; i <= 140; i++) {
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[Math.floor(i / 3) % lastNames.length];
        const name = `${fn} ${ln}`;
        const accountId = `acc_clean_${1000 + i}`;
        const deviceId = `dev_clean_${1000 + i}_${Math.random().toString(36).substring(2, 7)}`;
        const cardId = `card_clean_${1000 + i}`;
        const ip = `172.16.${Math.floor(i / 25)}.${(i * 7) % 250}`;
        const rawAddress = `${100 + (i * 12) % 800} ${fn} Ave, ${cities[i % cities.length]}`;
        const normalized = normalizeAddress(rawAddress);
        // Amounts keep rule threshold clean for most
        const amount = 85 + (i * 27) % 410; // $85 to $495
        const timestamp = new Date(now - (140 - i) * (dayMs / 3)).toISOString();
        seed.push({
            id: `ord_clean_${1000 + i}`,
            timestamp,
            accountId,
            accountName: name,
            deviceId,
            cardId,
            cardLast4: `${1000 + (i % 9000)}`,
            ip,
            shippingAddress: rawAddress,
            normalizedAddress: normalized,
            amount,
            items: [{ productId: 'acc-01', name: 'Nimbus Pods Pro ANC', quantity: 1, price: amount }],
            status: 'APPROVED',
            ruleVerdict: 'CLEAN',
            graphVerdict: 'CLEAN',
            score: Math.floor(Math.random() * 15),
            reasons: [],
            isHistorical: true
        });
    }
    // 2. Generate 4 Hand-Crafted Fraud Rings (8 orders each = 32 ring orders)
    PRESET_FRAUD_RINGS.forEach((ring, ringIdx) => {
        for (let j = 1; j <= 8; j++) {
            const ringAccNum = ringIdx * 10 + j;
            const accountId = `acc_ring_${ring.ringId}_${ringAccNum}`;
            const accountName = `Mule Account ${ringAccNum}`;
            const cardId = `card_ring_${ring.ringId}_${ringAccNum}`;
            // Shared entity logic: each order shares the ring's target entity!
            const deviceId = ring.sharedType === 'deviceId' ? ring.sharedValue : `dev_ring_${ring.ringId}_sub${j}`;
            const ip = ring.sharedType === 'ip' ? ring.sharedValue : (j % 2 === 0 ? ring.sharedIp : `198.51.${ringIdx + 10}.${j * 5}`);
            const rawAddress = ring.sharedType === 'shippingAddress' ? ring.sharedAddress : (j % 2 === 0 ? ring.sharedAddress : `${j * 15} Mule Way, City TX 75001`);
            const normalized = normalizeAddress(rawAddress);
            const amount = 350 + (j * 180); // some trigger rule, some don't
            const timestamp = new Date(now - (30 - j * 2) * dayMs).toISOString();
            seed.push({
                id: `ord_${ring.ringId}_${j}`,
                timestamp,
                accountId,
                accountName,
                deviceId,
                cardId,
                cardLast4: `${8000 + j}`,
                ip,
                shippingAddress: rawAddress,
                normalizedAddress: normalized,
                amount,
                items: [{ productId: 'laptop-01', name: 'Nimbus Book Pro 16', quantity: 1, price: amount }],
                status: 'BLOCKED',
                ruleVerdict: amount > 500 ? 'FLAGGED' : 'CLEAN',
                graphVerdict: 'FLAGGED',
                score: 92,
                ringId: ring.ringId,
                reasons: [`Network Graph Match: Shared ${ring.sharedType} across multi-accounts (${ring.name})`],
                isHistorical: true
            });
        }
    });
    return seed;
}
// In-Memory & LocalStorage Sync Order Store
export function getStoredOrders() {
    try {
        const raw = localStorage.getItem(STORE_KEY_ORDERS);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    }
    catch (e) {
        console.error('Failed to parse stored orders', e);
    }
    // If no store, generate seed and save
    const seed = generateSeedOrders();
    saveStoredOrders(seed);
    return seed;
}
export function saveStoredOrders(orders) {
    try {
        localStorage.setItem(STORE_KEY_ORDERS, JSON.stringify(orders));
    }
    catch (e) {
        console.error('Failed to save orders to localStorage', e);
    }
}
export function resetToSeedData() {
    const seed = generateSeedOrders();
    saveStoredOrders(seed);
    return seed;
}
// --- CORE FRAUD DETECTION ENGINE ---
export function evaluateOrder(payload) {
    const history = getStoredOrders();
    const normalizedAddr = normalizeAddress(payload.shippingAddress);
    const ruleReasons = [];
    const graphReasons = [];
    // 1. RULE ENGINE EVALUATION (Baseline: Amount > $500)
    let ruleVerdict = 'CLEAN';
    if (payload.amount > 500) {
        ruleVerdict = 'FLAGGED';
        ruleReasons.push(`High Transaction Amount ($${payload.amount.toFixed(2)} > $500.00 threshold)`);
    }
    // 2. GRAPH ENGINE EVALUATION (Network Match)
    // Check if deviceId, IP, or normalized address matches 2+ distinct accountIds in order history
    let graphVerdict = 'CLEAN';
    let matchedRingId;
    const connectedAccountsSet = new Set();
    const sharedEntitiesInfo = {};
    // Query history for entity overlap across distinct accountIds
    const deviceAccounts = new Set();
    const ipAccounts = new Set();
    const addressAccounts = new Set();
    history.forEach(ord => {
        // Exclude current accountId if evaluating multi-account sharing
        if (ord.accountId !== payload.accountId) {
            if (ord.deviceId === payload.deviceId) {
                deviceAccounts.add(ord.accountId);
                if (ord.ringId)
                    matchedRingId = ord.ringId;
            }
            if (ord.ip === payload.ip) {
                ipAccounts.add(ord.accountId);
                if (ord.ringId)
                    matchedRingId = ord.ringId;
            }
            if (ord.normalizedAddress === normalizedAddr) {
                addressAccounts.add(ord.accountId);
                if (ord.ringId)
                    matchedRingId = ord.ringId;
            }
        }
    });
    if (deviceAccounts.size >= 2) {
        graphVerdict = 'FLAGGED';
        deviceAccounts.forEach(acc => connectedAccountsSet.add(acc));
        sharedEntitiesInfo.deviceId = payload.deviceId;
        graphReasons.push(`Shared Device ID (${payload.deviceId}) linked to ${deviceAccounts.size} other distinct account IDs`);
    }
    if (ipAccounts.size >= 2) {
        graphVerdict = 'FLAGGED';
        ipAccounts.forEach(acc => connectedAccountsSet.add(acc));
        sharedEntitiesInfo.ip = payload.ip;
        graphReasons.push(`Shared IP Address (${payload.ip}) linked to ${ipAccounts.size} other distinct account IDs`);
    }
    if (addressAccounts.size >= 2) {
        graphVerdict = 'FLAGGED';
        addressAccounts.forEach(acc => connectedAccountsSet.add(acc));
        sharedEntitiesInfo.shippingAddress = normalizedAddr;
        graphReasons.push(`Shared Shipping Address (${normalizedAddr.slice(0, 30)}...) linked to ${addressAccounts.size} other distinct account IDs`);
    }
    // If matched graph ring, link or assign ring ID
    if (graphVerdict === 'FLAGGED' && !matchedRingId) {
        matchedRingId = `ring_live_${Math.random().toString(36).substring(2, 7)}`;
    }
    // 3. COMBINED DECISION LOGIC
    // - Graph engine flags -> BLOCK (regardless of amount)
    // - Only rule engine flags -> STEP_UP (OTP required)
    // - Neither flags -> APPROVE
    let finalStatus = 'APPROVED';
    let overallScore = 10; // base score
    if (graphVerdict === 'FLAGGED') {
        finalStatus = 'BLOCKED';
        overallScore = 95;
    }
    else if (ruleVerdict === 'FLAGGED') {
        finalStatus = 'STEP_UP';
        overallScore = 65;
    }
    const allReasons = [...ruleReasons, ...graphReasons];
    const newOrder = {
        id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString(),
        accountId: payload.accountId,
        accountName: payload.accountName,
        deviceId: payload.deviceId,
        cardId: payload.cardId,
        cardLast4: payload.cardLast4,
        ip: payload.ip,
        shippingAddress: payload.shippingAddress,
        normalizedAddress: normalizedAddr,
        amount: payload.amount,
        items: payload.items,
        status: finalStatus,
        ruleVerdict,
        graphVerdict,
        score: overallScore,
        ringId: matchedRingId,
        reasons: allReasons,
        isHistorical: false
    };
    // Retroactively mark all connected historical orders to the same ring in store!
    if (graphVerdict === 'FLAGGED' && matchedRingId) {
        const updatedHistory = history.map(ord => {
            if (ord.deviceId === payload.deviceId ||
                ord.ip === payload.ip ||
                ord.normalizedAddress === normalizedAddr) {
                return {
                    ...ord,
                    graphVerdict: 'FLAGGED',
                    status: 'BLOCKED',
                    ringId: matchedRingId
                };
            }
            return ord;
        });
        updatedHistory.unshift(newOrder);
        saveStoredOrders(updatedHistory);
    }
    else {
        history.unshift(newOrder);
        saveStoredOrders(history);
    }
    const result = {
        status: finalStatus,
        ruleVerdict,
        graphVerdict,
        score: overallScore,
        ruleReasons,
        graphReasons,
        matchedRingId,
        connectedAccountIds: Array.from(connectedAccountsSet),
        sharedEntities: sharedEntitiesInfo
    };
    return { order: newOrder, result };
}
// Compute Scoreboard & Fraud Rings Summary for Risk Console
export function getRiskAnalytics() {
    const orders = getStoredOrders();
    let totalOrders = orders.length;
    let ruleFlaggedCount = 0;
    let graphFlaggedCount = 0;
    let ruleMissedGraphCaught = 0; // Graph flagged BUT Rule missed (amount <= $500)
    let bothFlagged = 0;
    const ringsMap = new Map();
    orders.forEach(ord => {
        if (ord.ruleVerdict === 'FLAGGED')
            ruleFlaggedCount++;
        if (ord.graphVerdict === 'FLAGGED')
            graphFlaggedCount++;
        if (ord.graphVerdict === 'FLAGGED' && ord.ruleVerdict === 'CLEAN') {
            ruleMissedGraphCaught++;
        }
        if (ord.graphVerdict === 'FLAGGED' && ord.ruleVerdict === 'FLAGGED') {
            bothFlagged++;
        }
        if (ord.ringId) {
            let ring = ringsMap.get(ord.ringId);
            if (!ring) {
                ring = {
                    ringId: ord.ringId,
                    name: ord.ringId.startsWith('ring_alpha') ? 'Syndicate Alpha' :
                        ord.ringId.startsWith('ring_beta') ? 'Syndicate Beta' :
                            ord.ringId.startsWith('ring_gamma') ? 'Syndicate Gamma' :
                                ord.ringId.startsWith('ring_delta') ? 'Syndicate Delta' : `Fraud Ring ${ord.ringId.slice(-5)}`,
                    accounts: new Set(),
                    orders: [],
                    riskScore: 94
                };
                ringsMap.set(ord.ringId, ring);
            }
            ring.accounts.add(ord.accountId);
            ring.orders.push(ord.id);
        }
    });
    const ringsList = Array.from(ringsMap.values()).map(r => ({
        id: r.ringId,
        name: r.name,
        accountCount: r.accounts.size,
        orderCount: r.orders.length,
        riskScore: r.riskScore
    }));
    return {
        totalOrders,
        ruleFlaggedCount,
        graphFlaggedCount,
        ruleMissedGraphCaught,
        bothFlagged,
        ringsList
    };
}
//# sourceMappingURL=fraudEngine.js.map
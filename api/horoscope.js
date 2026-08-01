const ALLOWED_SIGNS = new Set(['gemini', 'sagittarius']);
const ALLOWED_QUERY_KEYS = new Set(['astro']);

const ALLOWED_ORIGINS = new Set([
    'https://lovelx.top',
    'https://www.lovelx.top',
    'https://li-luo-love.vercel.app'
]);

function listToObject(list) {
    return Object.fromEntries((Array.isArray(list) ? list : []).map(item => [item.type, item.content]));
}

function percent(value) {
    const number = Number.parseInt(String(value || '').replace('%', ''), 10);
    return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : null;
}

module.exports = async function handler(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ error: '仅支持 GET 请求' });
    if (origin && !ALLOWED_ORIGINS.has(origin)) return res.status(403).json({ error: '来源未被允许' });
    if (Object.keys(req.query).some(key => !ALLOWED_QUERY_KEYS.has(key))) {
        return res.status(400).json({ error: '请求参数无效' });
    }

    const sign = String(req.query.astro || '').toLowerCase();
    if (!ALLOWED_SIGNS.has(sign)) return res.status(400).json({ error: '星座参数无效' });
    if (!process.env.TIANAPI_KEY) return res.status(503).json({ error: '星座服务尚未配置' });

    const params = new URLSearchParams({ key: process.env.TIANAPI_KEY, astro: sign });

    try {
        const response = await fetch(`https://apis.tianapi.com/star/index?${params}`, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) throw new Error(`TianAPI HTTP ${response.status}`);

        const payload = await response.json();
        if (payload.code !== 200 || !payload.result?.list) {
            console.error('TianAPI business error:', payload.code, payload.msg);
            return res.status(502).json({ error: '今日运势暂时不可用' });
        }

        const data = listToObject(payload.result.list);
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
        return res.status(200).json({
            sign,
            scores: {
                overall: percent(data['综合指数']),
                love: percent(data['爱情指数']),
                work: percent(data['工作指数']),
                money: percent(data['财运指数']),
                health: percent(data['健康指数'])
            },
            luckyColor: data['幸运颜色'] || '',
            luckyNumber: data['幸运数字'] || '',
            luckyConstellation: data['贵人星座'] || '',
            summary: data['今日概述'] || '今天适合放慢一点，好好回应彼此。'
        });
    } catch (error) {
        console.error('Horoscope proxy error:', error.message);
        return res.status(502).json({ error: '星座服务连接失败，请稍后再试' });
    }
};

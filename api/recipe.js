const ALLOWED_ORIGINS = new Set(['https://lovelx.top', 'https://www.lovelx.top', 'https://li-luo-love.vercel.app']);

function cors(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return !origin || ALLOWED_ORIGINS.has(origin);
}

module.exports = async function handler(req, res) {
    if (!cors(req, res)) return res.status(403).json({ error:'来源未被允许' });
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ error:'仅支持 GET 请求' });
    const path = String(req.query.path || '');
    if (!path.startsWith('dishes/') || !path.endsWith('.md') || path.includes('..') || path.includes('\\')) {
        return res.status(400).json({ error:'菜谱路径无效' });
    }
    try {
        const encodedPath = path.split('/').map(encodeURIComponent).join('/');
        const rawUrl = `https://raw.githubusercontent.com/Anduin2017/HowToCook/master/${encodedPath}`;
        const response = await fetch(rawUrl, { signal:AbortSignal.timeout(10000) });
        if (!response.ok) return res.status(response.status === 404 ? 404 : 502).json({ error:'菜谱内容暂时无法加载' });
        const markdown = await response.text();
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
        return res.status(200).json({ path, markdown, sourceUrl:`https://github.com/Anduin2017/HowToCook/blob/master/${encodedPath}` });
    } catch (error) {
        console.error('HowToCook recipe error:', error.message);
        return res.status(502).json({ error:'菜谱内容暂时无法加载' });
    }
};

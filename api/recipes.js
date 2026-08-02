const ALLOWED_ORIGINS = new Set(['https://lovelx.top', 'https://www.lovelx.top', 'https://li-luo-love.vercel.app']);
const staticCatalog = require('../data/recipes.json');
const CATEGORY_NAMES = {
    vegetable_dish: '素菜', meat_dish: '荤菜', aquatic: '水产', breakfast: '早餐', staple: '主食',
    'semi-finished': '半成品', soup: '汤与粥', drink: '饮品', condiment: '酱料', dessert: '甜品'
};
const CATEGORY_ICONS = { '素菜':'🥬','荤菜':'🍖','水产':'🐟','早餐':'🍳','主食':'🍚','半成品':'🥟','汤与粥':'🥣','饮品':'🥤','酱料':'🫙','甜品':'🍰' };

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
    try {
        if (staticCatalog && Array.isArray(staticCatalog.recipes) && staticCatalog.recipes.length) {
            res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800');
            return res.status(200).json(staticCatalog);
        }
        const response = await fetch('https://raw.githubusercontent.com/Anduin2017/HowToCook/master/README.md', { signal:AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
        const readme = await response.text();
        const recipes = [];
        const pattern = /^\s*- \[([^\]]+)\]\((?:\.\/)?(dishes\/[^)]+\.md)\)\s*$/gm;
        let match;
        while ((match = pattern.exec(readme))) {
            const path = decodeURIComponent(match[2]);
            if (path.includes('/template/')) continue;
            const categoryKey = path.split('/')[1];
            const category = CATEGORY_NAMES[categoryKey] || '其他';
            recipes.push({ id:path, name:match[1], path, category, icon:CATEGORY_ICONS[category] || '🍽️' });
        }
        res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
        return res.status(200).json({ count:recipes.length, source:'Anduin2017/HowToCook', license:'Unlicense', recipes });
    } catch (error) {
        console.error('HowToCook catalog error:', error.message);
        return res.status(502).json({ error:'菜谱目录暂时无法加载' });
    }
};

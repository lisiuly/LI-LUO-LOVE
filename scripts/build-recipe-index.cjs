const fs = require('fs');
const path = require('path');

const sourceRoot = process.argv[2];
const outputPath = process.argv[3] || path.join(process.cwd(), 'data', 'recipes.json');
if (!sourceRoot || !fs.existsSync(path.join(sourceRoot, 'dishes'))) {
    throw new Error('Usage: node scripts/build-recipe-index.cjs <HowToCook-root> [output]');
}

const categoryNames = {
    vegetable_dish:'素菜', meat_dish:'荤菜', aquatic:'水产', breakfast:'早餐', staple:'主食',
    'semi-finished':'半成品', soup:'汤', drink:'饮品', condiment:'酱料', dessert:'甜品'
};
const categoryIcons = {素菜:'🥬',荤菜:'🍖',水产:'🐟',早餐:'🍳',主食:'🍚',半成品:'🥟',汤:'🥣',饮品:'🥤',酱料:'🫙',甜品:'🍰'};

function walk(dir) {
    return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
    });
}

function cleanInline(value='') {
    return value
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[`*_~>#|]/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function firstDescription(markdown, title) {
    const blocks = markdown.replace(/\r/g,'').split(/\n\s*\n/);
    for (const block of blocks) {
        const text = cleanInline(block);
        if (!text || text === title || /^#+\s/.test(block.trim()) || /^预估|^计算|^必备|^原料|^步骤|^制作/.test(text)) continue;
        if (text.length >= 18) return text.slice(0, 180);
    }
    return '来自 HowToCook 的完整菜谱，包含原料、用量和详细制作步骤。';
}

function firstImage(markdown, relativePath) {
    const match = markdown.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (!match) return null;
    const href = match[1].trim().replace(/^<|>$/g,'');
    if (/^https?:\/\//i.test(href)) return href;
    const directory = path.posix.dirname(relativePath);
    const resolved = path.posix.normalize(path.posix.join(directory, href));
    return `https://raw.githubusercontent.com/Anduin2017/HowToCook/master/${resolved.split('/').map(encodeURIComponent).join('/')}`;
}

function difficulty(markdown) {
    const match = markdown.match(/(?:预估)?(?:烹饪)?难度[^★☆\n]*(★{1,5})/);
    return match ? match[1].length : null;
}

function calories(markdown) {
    const candidates = [...markdown.matchAll(/(\d+(?:\.\d+)?)\s*(?:千卡|大卡|kcal)/gi)].map(match => Number(match[1]));
    const sensible = candidates.find(value => value >= 10 && value <= 10000);
    return sensible || null;
}

function searchableText(markdown) {
    return cleanInline(markdown)
        .replace(/https?:\/\/\S+/g,' ')
        .replace(/\s+/g,' ')
        .slice(0, 5000);
}

const dishesRoot = path.join(sourceRoot, 'dishes');
const files = walk(dishesRoot).filter(file => file.endsWith('.md') && !file.includes(`${path.sep}template${path.sep}`));
const recipes = files.map(file => {
    const markdown = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(sourceRoot, file).split(path.sep).join('/');
    const heading = markdown.match(/^#\s+(.+)$/m);
    const filename = path.basename(file, '.md');
    const name = cleanInline(heading ? heading[1] : filename).replace(/的做法$/,'') || filename;
    const categoryKey = relativePath.split('/')[1];
    const category = categoryNames[categoryKey] || '其他';
    return {
        id:relativePath,
        path:relativePath,
        name,
        category,
        icon:categoryIcons[category] || '🍽️',
        summary:firstDescription(markdown, name),
        difficulty:difficulty(markdown),
        calories:calories(markdown),
        image:firstImage(markdown, relativePath),
        keywords:searchableText(markdown)
    };
}).sort((a,b) => a.category.localeCompare(b.category,'zh-CN') || a.name.localeCompare(b.name,'zh-CN'));

fs.mkdirSync(path.dirname(outputPath), {recursive:true});
fs.writeFileSync(outputPath, JSON.stringify({
    generatedAt:new Date().toISOString(),
    source:'Anduin2017/HowToCook',
    license:'Unlicense',
    count:recipes.length,
    recipes
}, null, 0));

const stats = {
    count:recipes.length,
    images:recipes.filter(item => item.image).length,
    difficulty:recipes.filter(item => item.difficulty).length,
    calories:recipes.filter(item => item.calories).length,
    output:outputPath,
    bytes:fs.statSync(outputPath).size
};
console.log(JSON.stringify(stats, null, 2));

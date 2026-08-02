// ============================================
//  希宝 & 小李 · 秘密花园
// ============================================

// ---- 配置 ----
const CONFIG = {
    PASSWORD: '0616',
    GIRL_NAME: '希宝',
    BOY_NAME: '小李',
    START_DATE: '2021-06-26',
    GIRL_BIRTHDAY: { month: 6, day: 16 },
    BOY_BIRTHDAY: { month: 11, day: 30 },
    STORAGE_KEY: 'loveSiteData'
};

// ---- 数据存储 ----
const defaultData = {
    plans: [
        { id: 1, text: '一起去看海 🌊', done: false },
        { id: 2, text: '一起吃遍所有美食 🍽️', done: false },
        { id: 3, text: '一起去看樱花 🌸', done: false },
        { id: 4, text: '一起坐摩天轮 🎡', done: false },
        { id: 5, text: '一起养一只猫 🐱', done: false },
        { id: 6, text: '一起旅行去日本 🇯🇵✈️', done: false },
        { id: 7, text: '一起看日出 🌅', done: false },
        { id: 8, text: '一起看流星雨 🌠', done: false },
    ],
    diaries: [],
    recipes: [],
    photos: []
};

function loadData() {
    try {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            // Merge with defaults to ensure all keys exist
            return { ...JSON.parse(JSON.stringify(defaultData)), ...data };
        }
    } catch (e) {
        console.warn('Load data error:', e);
    }
    return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Save data error:', e);
    }
}

let appData = loadData();
let diaryImageData = '';

// ============================================
//  花瓣飘落效果
// ============================================
function createPetals() {
    const container = document.getElementById('petalsContainer');
    const petals = ['🌸', '🌸', '🌺', '🌷', '🌹', '🌸', '🌼', '🌺'];
    for (let i = 0; i < 25; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.fontSize = (12 + Math.random() * 14) + 'px';
        petal.style.animationDuration = (6 + Math.random() * 8) + 's';
        petal.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(petal);
    }
}

// ============================================
//  登录逻辑
// ============================================
function initLogin() {
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const loginPage = document.getElementById('loginPage');
    const mainSite = document.getElementById('mainSite');

    function tryLogin() {
        const pwd = passwordInput.value.trim();
        if (pwd === CONFIG.PASSWORD) {
            loginPage.style.display = 'none';
            mainSite.style.display = 'flex';
            document.body.style.overflow = 'auto';
            initMainSite();
        } else {
            loginError.classList.add('show');
            passwordInput.value = '';
            passwordInput.focus();
            setTimeout(() => loginError.classList.remove('show'), 2000);
        }
    }

    loginBtn.addEventListener('click', tryLogin);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tryLogin();
    });

    // Auto focus
    setTimeout(() => passwordInput.focus(), 500);
}

// ============================================
//  时间计算
// ============================================
function calcDaysSince(dateStr) {
    const start = new Date(dateStr);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function calcDuration(dateStr) {
    const start = new Date(dateStr);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months, days };
}

function calcBirthdayCountdown(bday = CONFIG.GIRL_BIRTHDAY) {
    const now = new Date();
    let target = new Date(now.getFullYear(), bday.month - 1, bday.day);

    if (now > target) {
        target = new Date(now.getFullYear() + 1, bday.month - 1, bday.day);
    }

    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ============================================
//  主页计时器
// ============================================
function updateCounters() {
    const start = new Date(CONFIG.START_DATE);
    const now = new Date();
    const diff = now - start;

    // Calculate total time
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    setText('timerDays', days);
    setText('timerHours', String(hours).padStart(2, '0'));
    setText('timerMinutes', String(minutes).padStart(2, '0'));
    setText('timerSeconds', String(seconds).padStart(2, '0'));

    // Update login page counter too
    const loginDaysEl = document.getElementById('loginDaysDisplay');
    const loginTimeEl = document.getElementById('loginTimeDisplay');
    if (loginDaysEl) loginDaysEl.textContent = days + ' 天';
    if (loginTimeEl) loginTimeEl.textContent = hours + '时 ' + minutes + '分 ' + seconds + '秒';

    const dur = calcDuration(CONFIG.START_DATE);
    setText('togetherDetail', `${dur.years}年${dur.months}个月${dur.days}天 ❤️  forever`);

    const bdayDays = calcBirthdayCountdown();
    setText('birthdayCountdown', bdayDays);
    const boyBirthdayEl = document.getElementById('boyBirthdayCountdown');
    if (boyBirthdayEl) boyBirthdayEl.textContent = calcBirthdayCountdown(CONFIG.BOY_BIRTHDAY);

    // Update milestones
    const startDate = new Date(CONFIG.START_DATE);
    const ms100 = new Date(startDate);
    ms100.setDate(ms100.getDate() + 100);
    setText('milestone100', formatDate(ms100.toISOString().slice(0, 10)));

    const ms365 = new Date(startDate);
    ms365.setFullYear(ms365.getFullYear() + 1);
    setText('milestone365', formatDate(ms365.toISOString().slice(0, 10)));
}

// ============================================
//  情话切换
// ============================================
const loveQuotes = [
    '你的笑容是我一天的动力 😊',
    '遇见你是我最美好的意外 💕',
    '想和你一起，走过春夏秋冬 🌸☀️🍂❄️❤️',
    '你是我的小呀小苹果 🍎',
    '余生有你，请多指教 💕',
    '你的眼里有星星 ⭐',
    '世界那么大，我只想要你 💕',
    '每天想你一百遍 💭',
    '你是我写过最美的情书 💌',
    '在一起的日子，每天都甜 🍯',
    '希宝是世界上最好的女朋友 💕',
    '小李永远爱希宝 💕💕',
    '想牵着你的手，一直走下去 🚶',
    '你是我最想留住的幸运 🍀',
    '只要有你在，每天都是情人节 💝'
];
let currentQuoteIndex = 0;

function changeQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % loveQuotes.length;
    const el = document.querySelector('.quote-text');
    if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        setTimeout(() => {
            el.textContent = loveQuotes[currentQuoteIndex];
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200);
    }
}

// ============================================
//  计划书
// ============================================
function renderPlans() {
    const grid = document.getElementById('plansGrid');
    grid.innerHTML = '';

    appData.plans.forEach(plan => {
        const div = document.createElement('div');
        div.className = `plan-item ${plan.done ? 'done' : ''}`;
        div.innerHTML = `
            <div class="plan-checkbox" data-id="${plan.id}">${plan.done ? '✓' : ''}</div>
            <span class="plan-text">${plan.text}</span>
            <button class="plan-delete" data-id="${plan.id}">🗑️</button>
        `;
        grid.appendChild(div);
    });

    updatePlanStats();
}

function updatePlanStats() {
    const total = appData.plans.length;
    const done = appData.plans.filter(p => p.done).length;
    document.getElementById('plansDone').textContent = done;
    document.getElementById('plansTotal').textContent = total;

    const pct = total > 0 ? (done / total) * 100 : 0;
    document.getElementById('plansProgress').style.width = pct + '%';
}

function initPlans() {
    renderPlans();

    document.getElementById('plansGrid').addEventListener('click', (e) => {
        const checkbox = e.target.closest('.plan-checkbox');
        const deleteBtn = e.target.closest('.plan-delete');

        if (checkbox) {
            const id = parseInt(checkbox.dataset.id);
            const plan = appData.plans.find(p => p.id === id);
            if (plan) {
                plan.done = !plan.done;
                saveData(appData);
                renderPlans();
            }
        }

        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            appData.plans = appData.plans.filter(p => p.id !== id);
            saveData(appData);
            renderPlans();
        }
    });

    document.getElementById('addPlanBtn').addEventListener('click', () => {
        const input = document.getElementById('planInput');
        const text = input.value.trim();
        if (!text) return;

        const maxId = appData.plans.length > 0 ? Math.max(...appData.plans.map(p => p.id)) : 0;
        appData.plans.push({ id: maxId + 1, text, done: false });
        saveData(appData);
        renderPlans();
        input.value = '';
    });

    document.getElementById('planInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('addPlanBtn').click();
    });
}

// ============================================
//  恋爱日记
// ============================================
function renderDiaries() {
    const list = document.getElementById('diaryList');
    list.innerHTML = '';

    if (appData.diaries.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <span class="empty-state-icon">📝</span>
                <span class="empty-state-text">还没有日记，写下第一段回忆吧 💕😊</span>
            </div>
        `;
        return;
    }

    // Show newest first
    const sorted = [...appData.diaries].reverse();
    sorted.forEach(diary => {
        const div = document.createElement('div');
        div.className = 'diary-entry';
        div.innerHTML = `
            <div class="diary-entry-header">
                <span class="diary-entry-title">💕 ${escapeHTML(diary.title)}</span>
                <span class="diary-entry-date">📅 ${escapeHTML(diary.date)}</span>
            </div>
            ${diary.image ? `<img class="diary-entry-image" src="${diary.image}" alt="${escapeHTML(diary.title)}的记录图片" loading="lazy">` : ''}
            <div class="diary-entry-content">${escapeHTML(diary.content)}</div>
            <button class="diary-entry-delete" data-id="${diary.id}" aria-label="删除${escapeHTML(diary.title)}">删除</button>
        `;
        list.appendChild(div);
    });
}

function initDiaries() {
    renderDiaries();
    document.getElementById('diaryDate').value = getLocalDateKey();
    const imageInput = document.getElementById('diaryImageInput');
    const preview = document.getElementById('diaryImagePreview');
    const previewImg = document.getElementById('diaryImagePreviewImg');
    const clearImage = () => {
        diaryImageData = '';
        imageInput.value = '';
        preview.hidden = true;
        previewImg.src = '';
    };
    imageInput.addEventListener('change', () => {
        const file = imageInput.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('请选择图片文件'); clearImage(); return; }
        if (file.size > 8 * 1024 * 1024) { alert('图片不能超过 8MB'); clearImage(); return; }
        const reader = new FileReader();
        reader.onload = event => {
            const image = new Image();
            image.onload = () => {
                const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(image.width * scale);
                canvas.height = Math.round(image.height * scale);
                canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
                diaryImageData = canvas.toDataURL('image/jpeg', 0.82);
                previewImg.src = diaryImageData;
                preview.hidden = false;
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('removeDiaryImage').addEventListener('click', clearImage);

    document.getElementById('diaryList').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.diary-entry-delete');
        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            appData.diaries = appData.diaries.filter(d => d.id !== id);
            saveData(appData);
            renderDiaries();
        }
    });

    document.getElementById('addDiaryBtn').addEventListener('click', () => {
        const title = document.getElementById('diaryTitle').value.trim();
        const content = document.getElementById('diaryContent').value.trim();
        const date = document.getElementById('diaryDate').value || formatDate(new Date().toISOString().slice(0, 10));

        if (!title || !content) {
            alert('请填写标题和内容哦 💕');
            return;
        }

        const maxId = appData.diaries.length > 0 ? Math.max(...appData.diaries.map(d => d.id)) : 0;
        appData.diaries.push({ id: maxId + 1, title, content, date, image: diaryImageData });
        saveData(appData);
        renderDiaries();

        document.getElementById('diaryTitle').value = '';
        document.getElementById('diaryContent').value = '';
        document.getElementById('diaryDate').value = getLocalDateKey();
        clearImage();
    });
}

// ============================================
//  食谱日记
// ============================================
const featuredRecipes = [
    { id:'tomato-eggs', name:'西红柿炒鸡蛋', aliases:['番茄炒蛋'], category:'素菜', icon:'🍅', time:15, difficulty:'简单', servings:2, summary:'酸甜开胃，厨房新手也能稳定完成。', ingredients:['西红柿 2个（约400克）','鸡蛋 3个','盐 3克','白糖 3克','食用油 25毫升','葱花 少许'], steps:['西红柿切块；鸡蛋加一小撮盐和一汤匙清水，充分打散。','热锅放一半油，倒入蛋液，边缘凝固后快速推散，八成熟时盛出。','补剩余油，下西红柿和盐，中火炒到出汁，再加糖调节酸味。','倒回鸡蛋，大火翻匀约30秒，撒葱花出锅。'], tips:'鸡蛋不要炒到全熟再盛出，回锅后口感才嫩。' },
    { id:'cola-wings', name:'可乐鸡翅', category:'荤菜', icon:'🍗', time:35, difficulty:'简单', servings:2, summary:'甜咸入味，适合两个人分享的下饭菜。', ingredients:['鸡翅中 8只','可乐 330毫升','生抽 30毫升','老抽 5毫升','料酒 15毫升','姜 5片','食用油 10毫升'], steps:['鸡翅两面划刀，用料酒和两片姜腌15分钟。','鸡翅冷水下锅，煮开后再煮2分钟，捞出擦干。','锅中放油，鸡翅两面煎至金黄。','加入姜片、生抽、老抽和可乐，大火煮开后转小火焖15分钟。','开盖转大火收汁，汤汁能挂在鸡翅上时关火。'], tips:'可乐本身有糖，收汁后再尝味，通常不必额外加糖。' },
    { id:'braised-chicken', name:'黄焖鸡', category:'荤菜', icon:'🥘', time:45, difficulty:'中等', servings:2, summary:'鸡腿软嫩，汤汁浓郁，配米饭刚刚好。', ingredients:['鸡腿 2只','香菇 6朵','青椒 1个','土豆 1个','生抽 25毫升','蚝油 15毫升','冰糖 8克','姜 4片'], steps:['鸡腿剁块，香菇泡发，土豆和青椒切块。','锅中少油炒化冰糖，下鸡块炒至表面微黄。','加入姜、生抽和蚝油翻匀，再放香菇和没过鸡块一半的热水。','小火焖20分钟，加入土豆再焖12分钟。','放青椒，大火收汁2分钟即可。'], tips:'青椒最后再放，颜色和清香都会更好。' },
    { id:'steamed-fish', name:'清蒸鲈鱼', category:'水产', icon:'🐟', time:25, difficulty:'中等', servings:2, summary:'鲜嫩清爽，最能吃出鱼本身的味道。', ingredients:['鲈鱼 1条（约600克）','姜 8片','葱 2根','蒸鱼豉油 25毫升','食用油 15毫升','料酒 10毫升'], steps:['鱼处理干净，在鱼身两侧各划两刀，用料酒和姜片腌10分钟。','水烧开后放鱼，大火蒸8分钟，关火焖2分钟。','倒掉盘中汤汁，去掉旧姜片，铺上新葱姜丝。','淋蒸鱼豉油，再浇上烧热的食用油。'], tips:'一定要等水开后再上锅，600克左右的鱼蒸8分钟即可。' },
    { id:'fried-rice', name:'蛋炒饭', category:'主食', icon:'🍚', time:12, difficulty:'简单', servings:2, summary:'粒粒分明，用剩米饭快速解决一餐。', ingredients:['冷米饭 2碗','鸡蛋 2个','火腿 60克','胡萝卜 50克','葱花 适量','盐 3克','食用油 20毫升'], steps:['火腿和胡萝卜切小丁，鸡蛋打散。','热锅放油，鸡蛋炒散后盛出。','原锅下胡萝卜和火腿炒香，加入冷米饭压散。','大火翻炒至米粒松散，倒回鸡蛋，加盐和葱花炒匀。'], tips:'冷藏隔夜饭含水更少；没有隔夜饭时，可把热饭摊开晾凉。' },
    { id:'scallion-noodles', name:'葱油拌面', category:'主食', icon:'🍜', time:20, difficulty:'简单', servings:2, summary:'葱香浓郁，简单却很满足。', ingredients:['细面条 200克','小葱 8根','生抽 30毫升','老抽 8毫升','白糖 8克','食用油 40毫升'], steps:['小葱擦干切段，生抽、老抽和白糖调匀。','冷油下葱段，小火慢炸到葱变焦黄，捞出葱段。','关小火倒入调味汁，搅拌到糖融化后关火。','面条煮熟沥干，每碗拌入两到三勺葱油汁，放上葱段。'], tips:'葱必须擦干再下油，避免飞溅；全程小火才不会发苦。' },
    { id:'egg-soup', name:'紫菜蛋花汤', category:'汤粥', icon:'🥣', time:10, difficulty:'简单', servings:2, summary:'十分钟暖汤，适合搭配任何家常菜。', ingredients:['清水 700毫升','鸡蛋 2个','紫菜 5克','虾皮 8克','盐 3克','香油 5毫升','葱花 少许'], steps:['锅中加水和虾皮煮开，放入撕碎的紫菜。','鸡蛋充分打散，汤保持微沸时沿锅边细细淋入。','等待10秒再轻推蛋花，加盐、香油和葱花。'], tips:'蛋液下锅后不要马上搅，蛋花会更完整。' },
    { id:'egg-sandwich', name:'鸡蛋三明治', category:'早餐', icon:'🥪', time:15, difficulty:'简单', servings:2, summary:'柔软香甜，适合一起吃的周末早餐。', ingredients:['吐司 4片','鸡蛋 3个','蛋黄酱 25克','牛奶 10毫升','盐 1克','黑胡椒 少许','生菜 2片'], steps:['鸡蛋冷水下锅，水开后煮9分钟，过冷水去壳。','蛋黄压碎，加入蛋黄酱、牛奶、盐和黑胡椒，再拌入切碎的蛋白。','吐司铺生菜和鸡蛋馅，盖上另一片吐司，轻压后对半切开。'], tips:'鸡蛋馅冷藏10分钟后更容易定型，也更清爽。' },
    { id:'egg-tarts', name:'懒人蛋挞', category:'甜品', icon:'🧁', time:30, difficulty:'简单', servings:2, summary:'外酥里嫩，甜甜的下午茶。', ingredients:['冷冻蛋挞皮 6个','鸡蛋 1个','牛奶 100毫升','淡奶油 60毫升','细砂糖 25克'], steps:['烤箱提前以200℃预热。','鸡蛋、牛奶、淡奶油和糖搅匀，过筛一次。','蛋挞液倒入挞皮八分满。','放入烤箱中层，200℃烤20到23分钟，表面出现焦糖斑即可。'], tips:'蛋挞液过筛后口感更细腻；不同烤箱最后5分钟注意观察。' },
    { id:'lemon-soda', name:'蜂蜜柠檬气泡水', category:'饮品', icon:'🍋', time:8, difficulty:'简单', servings:2, summary:'酸甜清爽，适合晚餐后的两人饮品。', ingredients:['柠檬 1个','蜂蜜 25克','无糖气泡水 500毫升','冰块 适量','薄荷叶 少许'], steps:['柠檬用盐搓洗表皮，一半切片，一半挤汁。','杯中加入蜂蜜和柠檬汁搅匀。','加入冰块和柠檬片，沿杯壁缓慢倒入气泡水，轻轻搅一下。'], tips:'气泡水最后加入并轻搅，气泡会保留得更久。' }
];

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

let recipeCatalog = featuredRecipes;
const RECIPE_API_BASE = 'https://li-luo-love.vercel.app/api';
const RECIPE_SEARCH_ALIASES = [
    [['番茄'], '西红柿'],
    [['马铃薯'], '土豆'],
    [['红薯', '番薯'], '地瓜'],
    [['卷心菜', '圆白菜', '洋白菜'], '包菜'],
    [['菜花'], '花菜'],
    [['柿子椒'], '青椒'],
    [['炒蛋'], '炒鸡蛋']
];

function normalizeRecipeSearch(value = '') {
    let normalized = String(value).toLowerCase().replace(/[\s·・,，。.!！?？()（）\-_]/g, '');
    RECIPE_SEARCH_ALIASES.forEach(([aliases, canonical]) => {
        aliases.forEach(alias => { normalized = normalized.replaceAll(alias, canonical); });
    });
    return normalized;
}

async function fetchRecipeAPI(url, timeout = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try { return await fetch(url, { signal:controller.signal }); }
    finally { clearTimeout(timer); }
}

function recipeCardHTML(recipe) {
    const localMeta = recipe.time ? `<span>${recipe.time} 分钟</span><span>${escapeHTML(recipe.difficulty)}</span>` : '<span>完整步骤</span>';
    const summary = recipe.summary || '来自 HowToCook 的完整菜谱，点开查看食材、用量和制作步骤。';
    return `<article class="recipe-result-card" data-category="${escapeHTML(recipe.category)}"><div class="recipe-card-icon" aria-hidden="true">${recipe.icon || '🍽️'}</div><div class="recipe-result-body"><div class="recipe-card-meta"><span>${escapeHTML(recipe.category)}</span>${localMeta}</div><h4>${escapeHTML(recipe.name)}</h4><p class="recipe-summary">${escapeHTML(summary)}</p><button type="button" class="recipe-view" data-recipe-id="${escapeHTML(recipe.id)}">查看完整做法</button></div></article>`;
}

function renderRecipeDetail(recipe) {
    const panel = document.getElementById('recipeDetailPanel');
    panel.hidden = false;
    panel.innerHTML = `<div class="recipe-detail-heading"><div><span class="recipe-detail-icon" aria-hidden="true">${recipe.icon}</span><div><p>${escapeHTML(recipe.category)} · ${recipe.time} 分钟 · ${escapeHTML(recipe.difficulty)}</p><h3>${escapeHTML(recipe.name)}</h3></div></div><button class="recipe-detail-close" type="button" aria-label="关闭菜谱详情">关闭</button></div><p class="recipe-detail-summary">${escapeHTML(recipe.summary)}</p><div class="recipe-detail-columns"><section><h4>两人份食材</h4><ul>${recipe.ingredients.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></section><section><h4>步骤</h4><ol>${recipe.steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ol></section></div><aside class="recipe-tip"><strong>不翻车提示</strong><span>${escapeHTML(recipe.tips)}</span></aside><button class="recipe-save-found" data-name="${escapeHTML(recipe.name)}" data-desc="${escapeHTML(recipe.summary)}">记入我们的食谱日记</button>`;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function appendInlineMarkdown(parent, text, recipePath) {
    const pattern = /(!?\[[^\]]*\]\([^)]+\)|`[^`]+`)/g;
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
        parent.append(document.createTextNode(text.slice(cursor, match.index)));
        const token = match[0];
        const parts = token.match(/^(!?)\[([^\]]*)\]\(([^)]+)\)$/);
        if (parts) {
            const [, imageMark, label, href] = parts;
            const resolvedUrl = new URL(href, `https://raw.githubusercontent.com/Anduin2017/HowToCook/master/${recipePath.substring(0, recipePath.lastIndexOf('/') + 1)}`);
            if (!['http:', 'https:'].includes(resolvedUrl.protocol)) {
                parent.append(document.createTextNode(label || href));
                cursor = match.index + token.length;
                continue;
            }
            const resolved = resolvedUrl.href;
            if (imageMark) {
                const img = document.createElement('img');
                img.src = resolved;
                img.alt = label || '菜谱步骤图片';
                img.loading = 'lazy';
                parent.append(img);
            } else {
                const link = document.createElement('a');
                link.href = resolved;
                link.target = '_blank';
                link.rel = 'noopener';
                link.textContent = label || href;
                parent.append(link);
            }
        } else {
            const code = document.createElement('code');
            code.textContent = token.slice(1, -1);
            parent.append(code);
        }
        cursor = match.index + token.length;
    }
    parent.append(document.createTextNode(text.slice(cursor)));
}

function markdownToFragment(markdown, recipePath) {
    const fragment = document.createDocumentFragment();
    let list = null;
    markdown.replace(/\r/g, '').split('\n').forEach(rawLine => {
        const line = rawLine.trimEnd();
        if (!line.trim()) { list = null; return; }
        const heading = line.match(/^(#{1,3})\s+(.+)$/);
        const item = line.match(/^\s*(?:[-*+]|(\d+)\.)\s+(.+)$/);
        if (heading) {
            list = null;
            const node = document.createElement(`h${Math.min(heading[1].length + 2, 5)}`);
            appendInlineMarkdown(node, heading[2], recipePath);
            fragment.append(node);
        } else if (item) {
            const tag = item[1] ? 'ol' : 'ul';
            if (!list || list.tagName.toLowerCase() !== tag) {
                list = document.createElement(tag);
                fragment.append(list);
            }
            const node = document.createElement('li');
            appendInlineMarkdown(node, item[2], recipePath);
            list.append(node);
        } else if (/^!\[[^\]]*\]\([^)]+\)$/.test(line.trim())) {
            list = null;
            const figure = document.createElement('figure');
            appendInlineMarkdown(figure, line.trim(), recipePath);
            fragment.append(figure);
        } else {
            list = null;
            const node = document.createElement('p');
            appendInlineMarkdown(node, line.replace(/^>\s?/, ''), recipePath);
            fragment.append(node);
        }
    });
    return fragment;
}

async function renderRemoteRecipeDetail(recipe) {
    const panel = document.getElementById('recipeDetailPanel');
    panel.hidden = false;
    panel.innerHTML = `<div class="recipe-detail-loading" role="status">正在打开「${escapeHTML(recipe.name)}」的完整做法…</div>`;
    panel.scrollIntoView({ behavior:'smooth', block:'start' });
    try {
        const response = await fetchRecipeAPI(`${RECIPE_API_BASE}/recipe?path=${encodeURIComponent(recipe.path)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || '菜谱加载失败');
        panel.innerHTML = `<div class="recipe-detail-heading"><div><span class="recipe-detail-icon" aria-hidden="true">${recipe.icon || '🍽️'}</span><div><p>${escapeHTML(recipe.category)} · HowToCook</p><h3>${escapeHTML(recipe.name)}</h3></div></div><button class="recipe-detail-close" type="button" aria-label="关闭菜谱详情">关闭</button></div><div class="recipe-markdown"></div><div class="recipe-detail-actions"><button class="recipe-save-found" data-name="${escapeHTML(recipe.name)}" data-desc="来自 HowToCook 的完整菜谱">记入我们的食谱日记</button><a href="${escapeHTML(data.sourceUrl)}" target="_blank" rel="noopener">查看原始菜谱</a></div>`;
        panel.querySelector('.recipe-markdown').append(markdownToFragment(data.markdown, recipe.path));
    } catch (error) {
        panel.innerHTML = `<div class="recipe-detail-error"><strong>这道菜暂时打不开</strong><p>${escapeHTML(error.message)}，可以稍后再试。</p><button type="button" class="recipe-retry">重新加载</button><button type="button" class="recipe-detail-close">关闭</button></div>`;
        panel.querySelector('.recipe-retry').addEventListener('click', () => renderRemoteRecipeDetail(recipe), { once:true });
    }
}

function renderRecipes() {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = '';

    if (appData.recipes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <span class="empty-state-icon">🍳</span>
                <span class="empty-state-text">还没有记录食谱，做了好吃的记下来吧 😋</span>
            </div>
        `;
        return;
    }

    const foodIcons = ['🍚', '🍜', '🍝', '🍛', '🍣', '🥟', '🍲', '🥗', '🍕', '🥘', '🍰', '🍨'];
    const sorted = [...appData.recipes].reverse();
    sorted.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe-entry';
        div.innerHTML = `
            <div class="recipe-entry-title">${escapeHTML(recipe.name)}</div>
            <div class="recipe-entry-desc">${escapeHTML(recipe.desc)}</div>
            <div class="recipe-entry-date">📅 ${escapeHTML(recipe.date)}</div>
            <button class="recipe-entry-delete" data-id="${recipe.id}" aria-label="删除${escapeHTML(recipe.name)}">删除</button>
        `;
        grid.appendChild(div);
    });
}

function initRecipes() {
    renderRecipes();
    document.getElementById('recipeDate').value = getLocalDateKey();

    const searchInput = document.getElementById('recipeSearchInput');
    const searchButton = document.getElementById('recipeSearchBtn');
    const searchStatus = document.getElementById('recipeSearchStatus');
    const searchResults = document.getElementById('recipeSearchResults');
    const loadMore = document.getElementById('recipeLoadMore');
    const categoryNav = document.getElementById('recipeCategories');
    let activeCategory = '全部';
    let visibleLimit = 24;
    let currentMatches = [];

    const renderCategories = () => {
        const categories = ['全部', ...new Set(recipeCatalog.map(recipe => recipe.category))];
        categoryNav.innerHTML = categories.map(category => `<button type="button" class="recipe-category${category === activeCategory ? ' active' : ''}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('');
    };

    const searchRecipes = () => {
        const rawQuery = searchInput.value.trim();
        const query = normalizeRecipeSearch(rawQuery);
        currentMatches = recipeCatalog.filter(recipe => {
            const inCategory = activeCategory === '全部' || recipe.category === activeCategory;
            const haystack = normalizeRecipeSearch([recipe.name, recipe.category, recipe.summary || '', ...(recipe.aliases || []), ...(recipe.ingredients || [])].join(' '));
            return inCategory && (!query || haystack.includes(query));
        });
        searchStatus.textContent = rawQuery || activeCategory !== '全部' ? `找到 ${currentMatches.length} 道菜谱` : `共 ${recipeCatalog.length} 道完整菜谱`;
        searchResults.innerHTML = currentMatches.length ? currentMatches.slice(0, visibleLimit).map(recipe => recipeCardHTML(recipe)).join('') : `<div class="recipe-empty-result">没有找到相关菜谱，换个菜名或分类试试。</div>`;
        loadMore.hidden = currentMatches.length <= visibleLimit;
        if (!loadMore.hidden) loadMore.textContent = `再加载 ${Math.min(24, currentMatches.length - visibleLimit)} 道`;
    };

    renderCategories();
    searchRecipes();
    const resetAndSearch = () => { visibleLimit = 24; searchRecipes(); };
    searchButton.addEventListener('click', resetAndSearch);
    searchInput.addEventListener('keydown', event => { if (event.key === 'Enter') resetAndSearch(); });
    searchInput.addEventListener('input', resetAndSearch);
    loadMore.addEventListener('click', () => { visibleLimit += 24; searchRecipes(); });
    categoryNav.addEventListener('click', event => {
        const button = event.target.closest('.recipe-category');
        if (!button) return;
        activeCategory = button.dataset.category;
        visibleLimit = 24;
        categoryNav.querySelectorAll('.recipe-category').forEach(item => item.classList.toggle('active', item === button));
        searchRecipes();
    });
    searchResults.addEventListener('click', event => {
        const viewButton = event.target.closest('.recipe-view');
        if (!viewButton) return;
        const recipe = recipeCatalog.find(item => item.id === viewButton.dataset.recipeId);
        if (recipe) recipe.path ? renderRemoteRecipeDetail(recipe) : renderRecipeDetail(recipe);
    });

    const detailPanel = document.getElementById('recipeDetailPanel');
    detailPanel.addEventListener('click', event => {
        if (event.target.closest('.recipe-detail-close')) {
            detailPanel.hidden = true;
            return;
        }
        const saveFound = event.target.closest('.recipe-save-found');
        if (!saveFound) return;
        const maxId = appData.recipes.length ? Math.max(...appData.recipes.map(recipe => recipe.id)) : 0;
        appData.recipes.push({ id: maxId + 1, name: saveFound.dataset.name, desc: saveFound.dataset.desc || '从菜谱库收藏的做法', date: getLocalDateKey() });
        saveData(appData);
        renderRecipes();
        saveFound.textContent = '已记录 ✓';
        saveFound.disabled = true;
    });

    document.getElementById('recipeGrid').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.recipe-entry-delete');
        if (deleteBtn) {
            const id = parseInt(deleteBtn.dataset.id);
            appData.recipes = appData.recipes.filter(r => r.id !== id);
            saveData(appData);
            renderRecipes();
        }
    });

    document.getElementById('addRecipeBtn').addEventListener('click', () => {
        const name = document.getElementById('recipeName').value.trim();
        const desc = document.getElementById('recipeDesc').value.trim();
        const date = document.getElementById('recipeDate').value || formatDate(new Date().toISOString().slice(0, 10));

        if (!name) {
            alert('请输入菜名哦 😋');
            return;
        }

        const maxId = appData.recipes.length > 0 ? Math.max(...appData.recipes.map(r => r.id)) : 0;
        appData.recipes.push({ id: maxId + 1, name, desc: desc || '超好吃！😋', date });
        saveData(appData);
        renderRecipes();

        document.getElementById('recipeName').value = '';
        document.getElementById('recipeDesc').value = '';
        document.getElementById('recipeDate').value = getLocalDateKey();
    });

    (async () => {
        searchStatus.textContent = `正在读取 HowToCook 完整目录，当前可先浏览 ${featuredRecipes.length} 道离线菜谱…`;
        try {
            const response = await fetchRecipeAPI(`${RECIPE_API_BASE}/recipes`);
            const data = await response.json();
            if (!response.ok || !Array.isArray(data.recipes) || !data.recipes.length) throw new Error(data.error || '目录为空');
            recipeCatalog = data.recipes;
            activeCategory = '全部';
            visibleLimit = 24;
            renderCategories();
            searchRecipes();
        } catch (error) {
            searchStatus.textContent = `完整目录暂时不可用，当前显示 ${featuredRecipes.length} 道离线菜谱。`;
        }
    })();
}

// ============================================
//  照片墙
// ============================================
function renderPhotos() {
    const grid = document.getElementById('photosGrid');
    grid.innerHTML = '';

    const photos = appData.photos;

    if (photos.length === 0) {
        // Show placeholder photos
        const placeholders = [
            { emoji: '💑', text: '你们的照片' },
            { emoji: '💕', text: '美好回忆' },
            { emoji: '😊', text: '甜蜜瞬间' },
            { emoji: '🎂', text: '生日快乐' },
        ];
        placeholders.forEach((p, i) => {
            const div = document.createElement('div');
            div.className = 'photo-item';
            div.innerHTML = `
                <div class="photo-item-placeholder">
                    <div style="font-size:48px;margin-bottom:8px;">${p.emoji}</div>
                    <div style="font-size:13px;color:var(--text-light)">${p.text}</div>
                </div>
            `;
            grid.appendChild(div);
        });
        return;
    }

    photos.forEach((photo, index) => {
        const div = document.createElement('div');
        div.className = 'photo-item';
        div.innerHTML = `
            <img src="${photo.data}" alt="photo ${index + 1}">
            <button class="photo-delete-btn" data-index="${index}">🗑️</button>
        `;
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.photo-delete-btn')) {
                openPhotoModal(photo.data);
            }
        });
        grid.appendChild(div);
    });
}

function openPhotoModal(src) {
    const modal = document.getElementById('photoModal');
    const img = document.getElementById('photoModalImg');
    img.src = src;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function initPhotos() {
    renderPhotos();

    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');

    uploadArea.addEventListener('click', () => photoInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    photoInput.addEventListener('change', () => {
        handleFiles(photoInput.files);
        photoInput.value = '';
    });

    // Close modal on click outside
    document.getElementById('photoModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closePhotoModal();
    });

    // Keyboard escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePhotoModal();
    });
}

function handleFiles(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const reader = new FileReader();
        reader.onload = (e) => {
            appData.photos.push({ data: e.target.result });
            saveData(appData);
            renderPhotos();
        };
        reader.readAsDataURL(file);
    }
}

// ============================================
//  导航切换
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-item');
    const pages = {
        home: document.getElementById('page-home'),
        plans: document.getElementById('page-plans'),
        diary: document.getElementById('page-diary'),
        recipe: document.getElementById('page-recipe'),
        photos: document.getElementById('page-photos')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;

            // Update nav
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update page
            Object.values(pages).forEach(p => p.classList.remove('active'));
            if (pages[page]) pages[page].classList.add('active');

            // Close mobile nav
            document.getElementById('navLinks').classList.remove('open');

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Mobile toggle
    document.getElementById('navToggle').addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('open');
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
        const nav = document.getElementById('navLinks');
        const toggle = document.getElementById('navToggle');
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('open');
        }
    });
}

// ============================================
//  本地歌单播放器
// ============================================
function initMusicPlayer() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    const status = document.getElementById('musicStatus');
    const songName = document.getElementById('musicSongName');
    const previous = document.getElementById('musicPrev');
    const next = document.getElementById('musicNext');
    const add = document.getElementById('musicAdd');
    const files = document.getElementById('musicFiles');
    const defaultPlaylist = [
        {
            name: '甜甜乌克丽丽',
            url: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Audionautix-com-ccby-happyukulele.mp3'
        },
        {
            name: '小小幸福 · Felicity',
            url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Scott_Buckley_-_Felicity.oga'
        }
    ];
    let playlist = defaultPlaylist;
    let currentIndex = 0;

    const cleanSongName = filename => filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();

    const updatePlayButton = playing => {
        toggle.classList.toggle('playing', playing);
        icon.textContent = playing ? 'Ⅱ' : '▶';
        toggle.setAttribute('aria-label', playing ? '暂停' : '播放');
        toggle.title = playing ? '暂停' : '播放';
    };

    const loadSong = (index, shouldPlay = false) => {
        if (!playlist.length) {
            files.click();
            return;
        }
        currentIndex = (index + playlist.length) % playlist.length;
        audio.src = playlist[currentIndex].url;
        songName.textContent = playlist[currentIndex].name;
        status.textContent = `${currentIndex + 1} / ${playlist.length}`;
        updatePlayButton(false);
        if (shouldPlay) {
            audio.play().catch(() => {
                status.textContent = '无法播放，请换一个音频文件';
            });
        }
    };

    toggle.addEventListener('click', () => {
        if (!playlist.length) {
            files.click();
            return;
        }
        if (audio.paused) {
            audio.play().catch(() => {
                status.textContent = '无法播放，请换一个音频文件';
            });
        } else {
            audio.pause();
        }
    });

    previous.addEventListener('click', () => loadSong(currentIndex - 1, !audio.paused));
    next.addEventListener('click', () => loadSong(currentIndex + 1, !audio.paused));
    add.addEventListener('click', () => files.click());

    files.addEventListener('change', () => {
        playlist.filter(song => song.local).forEach(song => URL.revokeObjectURL(song.url));
        playlist = Array.from(files.files).map(file => ({
            name: cleanSongName(file.name),
            url: URL.createObjectURL(file),
            local: true
        }));
        if (playlist.length) loadSong(0, false);
    });

    audio.addEventListener('play', () => {
        updatePlayButton(true);
        status.textContent = `${currentIndex + 1} / ${playlist.length} · 正在播放`;
    });

    audio.addEventListener('pause', () => {
        updatePlayButton(false);
        if (playlist.length) status.textContent = `${currentIndex + 1} / ${playlist.length} · 已暂停`;
    });

    audio.addEventListener('ended', () => loadSong(currentIndex + 1, true));
    audio.addEventListener('error', () => {
        status.textContent = '网络加载失败，可以添加本地歌曲';
        updatePlayButton(false);
    });

    loadSong(0, false);
}

// ============================================
//  初始化主站
// ============================================
function initMainSite() {
    updateCounters();

    // Init all modules
    initNavigation();
    initPlans();
    initDiaries();
    initRecipes();
    initPhotos();
    initMusicPlayer();
    initWeather();
    displayFortune();
    let fortuneDate = getLocalDateKey();
    setInterval(() => {
        const today = getLocalDateKey();
        if (today !== fortuneDate) {
            fortuneDate = today;
            displayFortune(true);
        }
    }, 60000);

    // Set initial quote
    const quoteEl = document.querySelector('.quote-text');
    if (quoteEl) {
        quoteEl.textContent = loveQuotes[0];
        quoteEl.style.transition = 'all 0.3s ease';
    }
}

// ============================================
//  线条小狗秘密花园启动
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    createPetals();
    initLogin();
    updateCounters();
    setInterval(updateCounters, 1000);
});

// ============================================
//  🌤️ 天气功能
// ============================================
const WEATHER_API = 'https://wttr.in';

function fetchWeather(city) {
    const content = document.getElementById('weatherContent');
    content.innerHTML = '<div class="weather-loading">🌤️ 获取天气中...</div>';

    // 使用 wttr.in JSON API 获取结构化数据
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`)
        .then(res => res.json())
        .then(data => {
            const current = data.current_condition[0];
            const tempC = current.temp_C + '°C';
            
            // 获取中文描述
            let descCN = current.weatherDesc[0].value || '';
            // wttr.in 有时在 lang_zh 字段提供中文
            if (current.lang_zh && current.lang_zh.length > 0) {
                descCN = current.lang_zh[0].value;
            }
            // 如果还是英文，尝试翻译
            const displayDesc = translateWeatherDesc(descCN);
            const weatherEmoji = getWeatherEmoji(displayDesc || descCN);
            
            content.innerHTML = `
                <div class="weather-info">
                    <div class="weather-emoji">${weatherEmoji}</div>
                    <div class="weather-details">
                        <div class="weather-temp">${tempC}</div>
                        <div class="weather-desc">${displayDesc || descCN}</div>
                    </div>
                </div>
            `;
        })
        .catch(() => {
            // 备用：简单格式
            fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%C+%t&lang=zh`)
                .then(res => res.text())
                .then(data => {
                    const clean = data.trim();
                    // 尝试英文映射
                    const mapped = translateWeatherDesc(clean);
                    const weatherEmoji = getWeatherEmoji(mapped);
                    content.innerHTML = `
                        <div class="weather-info">
                            <div class="weather-emoji">${weatherEmoji}</div>
                            <div class="weather-details">
                                <div class="weather-temp">${clean}</div>
                                <div class="weather-desc">${mapped}</div>
                            </div>
                        </div>
                    `;
                })
                .catch(() => {
                    content.innerHTML = '<div style="text-align:center;padding:10px;color:rgba(255,255,255,0.5);font-size:13px;">😅 获取天气失败</div>';
                });
        });
}

async function fetchWeatherByCoords(latitude, longitude, city = '当前位置') {
    const content = document.getElementById('weatherContent');
    content.innerHTML = '<div class="weather-loading">🌤️ 获取天气中...</div>';
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,apparent_temperature&timezone=auto`);
        if (!response.ok) throw new Error('weather unavailable');
        const current = (await response.json()).current;
        const labels = {0:'晴朗',1:'基本晴朗',2:'局部多云',3:'阴天',45:'雾',48:'雾凇',51:'小毛毛雨',53:'毛毛雨',55:'大毛毛雨',61:'小雨',63:'中雨',65:'大雨',71:'小雪',73:'中雪',75:'大雪',80:'阵雨',81:'中阵雨',82:'强阵雨',95:'雷雨',96:'雷雨伴冰雹',99:'强雷雨伴冰雹'};
        const desc = labels[current.weather_code] || '天气变化中';
        document.getElementById('weatherLocation').dataset.location = city;
        content.innerHTML = `<div class="weather-info"><div class="weather-emoji">${getWeatherEmoji(desc)}</div><div class="weather-details"><div class="weather-temp">${Math.round(current.temperature_2m)}°C</div><div class="weather-desc">${desc} · 体感 ${Math.round(current.apparent_temperature)}°C</div></div></div>`;
    } catch {
        if (city === '深圳' || city === '当前位置') fetchWeatherByCoords(22.5431, 114.0579, '深圳');
        else fetchWeather(city);
    }
}

async function fetchWeatherForCity(city) {
    const name = city.trim() || '深圳';
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=zh&format=json`);
        const result = await response.json();
        const place = result.results?.[0];
        if (!place) throw new Error('city not found');
        const displayName = place.name || name;
        document.getElementById('cityInput').value = displayName;
        localStorage.setItem('loveSiteCity', displayName);
        fetchWeatherByCoords(place.latitude, place.longitude, displayName);
    } catch {
        document.getElementById('cityInput').value = '深圳';
        localStorage.setItem('loveSiteCity', '深圳');
        fetchWeatherByCoords(22.5431, 114.0579, '深圳');
    }
}

function translateWeatherDesc(text) {
    const map = {
        'Sunny': '晴', 'Clear': '晴',
        'Partly cloudy': '多云', 'Cloudy': '阴', 'Overcast': '阴天',
        'Mist': '薄雾', 'Fog': '雾', 'Haze': '霾',
        'Light drizzle': '毛毛雨', 'Patchy light drizzle': '局部小雨',
        'Light rain': '小雨', 'Patchy light rain': '局部阵雨',
        'Moderate rain at times': '间歇中雨', 'Moderate rain': '中雨',
        'Heavy rain at times': '间歇大雨', 'Heavy rain': '大雨',
        'Light rain shower': '小阵雨', 'Moderate or heavy rain shower': '大阵雨',
        'Torrential rain shower': '暴雨',
        'Thundery outbreaks possible': '可能雷暴', 'Patchy light rain with thunder': '雷阵雨',
        'Moderate or heavy rain with thunder': '强雷雨',
        'Light snow': '小雪', 'Moderate snow': '中雪', 'Heavy snow': '大雪',
        'Blizzard': '暴风雪', 'Blowing snow': '风雪',
        'Light sleet': '小冰粒', 'Moderate or heavy sleet': '雨夹雪',
        'Freezing fog': '冻雾', 'Ice pellets': '冰粒',
    };
    
    for (const [en, cn] of Object.entries(map)) {
        if (text.toLowerCase().includes(en.toLowerCase())) return cn + ' ' + text;
    }
    return text;
}

function displayWeather(desc, temp, city) {
    const content = document.getElementById('weatherContent');
    const weatherEmoji = getWeatherEmoji(desc);

    content.innerHTML = `
        <div class="weather-info">
            <div class="weather-emoji">${weatherEmoji}</div>
            <div class="weather-details">
                <div class="weather-temp">${temp}</div>
                <div class="weather-desc">${desc}</div>
            </div>
        </div>
    `;
}

function getWeatherEmoji(desc) {
    if (desc.includes('晴') || desc.includes('Sunny') || desc.includes('Clear')) return '☀️';
    if (desc.includes('云') || desc.includes('Cloud') || desc.includes('Overcast')) return '☁️';
    if (desc.includes('雨') || desc.includes('Rain') || desc.includes('Drizzle') || desc.includes('Shower')) return '🌧️';
    if (desc.includes('雪') || desc.includes('Snow') || desc.includes('Sleet')) return '❄️';
    if (desc.includes('雾') || desc.includes('Fog') || desc.includes('Mist') || desc.includes('Haze')) return '🌫️';
    if (desc.includes('雷') || desc.includes('Thunder') || desc.includes('Storm')) return '⛈️';
    if (desc.includes('风') || desc.includes('Wind')) return '💨';
    if (desc.includes('阴')) return '☁️';
    return '🌈';
}

function initWeather() {
    const fallbackCity = localStorage.getItem('loveSiteCity') || '深圳';
    const useCity = city => {
        const finalCity = city || '深圳';
        document.getElementById('cityInput').value = finalCity;
        localStorage.setItem('loveSiteCity', finalCity);
        fetchWeatherForCity(finalCity);
    };

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`);
                const data = await response.json();
                const city = data.city || data.locality || data.principalSubdivision || fallbackCity;
                document.getElementById('cityInput').value = city;
                localStorage.setItem('loveSiteCity', city);
                fetchWeatherByCoords(latitude, longitude, city);
            } catch {
                useCity(fallbackCity);
            }
        }, () => {
            document.getElementById('cityInput').value = '深圳';
            localStorage.setItem('loveSiteCity', '深圳');
            fetchWeatherByCoords(22.5431, 114.0579, '深圳');
        }, { timeout: 6000, maximumAge: 3600000 });
    } else {
        document.getElementById('cityInput').value = '深圳';
        localStorage.setItem('loveSiteCity', '深圳');
        fetchWeatherByCoords(22.5431, 114.0579, '深圳');
    }

    document.getElementById('cityBtn').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            localStorage.setItem('loveSiteCity', city);
            fetchWeatherForCity(city);
        }
    });

    document.getElementById('cityInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('cityBtn').click();
    });
}

// ============================================
//  🔮 今日运势
// ============================================
const HOROSCOPE_API = 'https://li-luo-love.vercel.app/api/horoscope';
const FORTUNE_CACHE_KEY = 'loveSiteCoupleFortuneV4';
const ZODIAC_API_NAMES = { '摩羯座':'Capricorn', '水瓶座':'Aquarius', '双鱼座':'Pisces', '白羊座':'Aries', '金牛座':'Taurus', '双子座':'Gemini', '巨蟹座':'Cancer', '狮子座':'Leo', '处女座':'Virgo', '天秤座':'Libra', '天蝎座':'Scorpio', '射手座':'Sagittarius' };

const zodiacSigns = [
    { name: '摩羯座', type: 'capricorn', start: 1222, end: 119 },
    { name: '水瓶座', type: 'aquarius', start: 120, end: 218 },
    { name: '双鱼座', type: 'pisces', start: 219, end: 320 },
    { name: '白羊座', type: 'aries', start: 321, end: 419 },
    { name: '金牛座', type: 'taurus', start: 420, end: 520 },
    { name: '双子座', type: 'gemini', start: 521, end: 621 },
    { name: '巨蟹座', type: 'cancer', start: 622, end: 722 },
    { name: '狮子座', type: 'leo', start: 723, end: 822 },
    { name: '处女座', type: 'virgo', start: 823, end: 922 },
    { name: '天秤座', type: 'libra', start: 923, end: 1023 },
    { name: '天蝎座', type: 'scorpio', start: 1024, end: 1122 },
    { name: '射手座', type: 'sagittarius', start: 1123, end: 1221 }
];

function getZodiacSign(birthday) {
    const value = birthday.month * 100 + birthday.day;
    return zodiacSigns.find(sign => {
        if (sign.start > sign.end) return value >= sign.start || value <= sign.end;
        return value >= sign.start && value <= sign.end;
    });
}

function getLocalDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getCoupleSigns() {
    return [
        { name: CONFIG.BOY_NAME, birthday: CONFIG.BOY_BIRTHDAY, sign: getZodiacSign(CONFIG.BOY_BIRTHDAY) },
        { name: CONFIG.GIRL_NAME, birthday: CONFIG.GIRL_BIRTHDAY, sign: getZodiacSign(CONFIG.GIRL_BIRTHDAY) }
    ];
}

function normalizeScore(value, fallback = 3) {
    const score = Number(value);
    if (!Number.isFinite(score)) return fallback;
    return Math.min(5, Math.max(1, Math.round(score)));
}

async function fetchSignFortune(person) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const apiSign = ZODIAC_API_NAMES[person.sign.name] || person.sign.name;
        const url = `${HOROSCOPE_API}?astro=${encodeURIComponent(apiSign.toLowerCase())}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Horoscope HTTP ${response.status}`);

        const data = await response.json();
        const toFive = value => normalizeScore(Math.round((Number(value) || 60) / 20));
        return {
            name: person.name,
            sign: person.sign.name,
            birthday: `${person.birthday.month}.${person.birthday.day}`,
            loveScore: toFive(data.scores?.love),
            overallScore: toFive(data.scores?.overall),
            workScore: data.scores?.work,
            moneyScore: data.scores?.money,
            healthScore: data.scores?.health,
            loveText: data.summary || '今天适合把真实想法说清楚，给彼此一个及时回应。',
            luckyColor: data.luckyColor || '',
            luckyNumber: data.luckyNumber || '',
            luckyConstellation: data.luckyConstellation || ''
        };
    } finally {
        clearTimeout(timeout);
    }
}

function createLocalSignFortune(person, dayNumber) {
    const signOffset = person.sign.type === 'gemini' ? 2 : 4;
    const loveScore = 2 + ((dayNumber + signOffset) % 4);
    const messages = person.sign.type === 'gemini'
        ? [
            '今天思路活跃，也更在意回应。把好奇心用在了解对方上，会比猜测更靠近彼此。',
            '表达欲比平时更强，适合把心里话说具体；一句明确的关心胜过反复试探。',
            '容易被新鲜事吸引，和对方分享一个刚发现的小事，会自然打开今天的话题。',
            '信息很多、节奏偏快，重要的话慢一点说，也给对方完整回应的时间。'
        ]
        : [
            '今天行动力不错，适合主动提出一个两个人都期待的小安排。',
            '坦率是你的优势，但重要感受先确认再下结论，沟通会更顺。',
            '想尝试新鲜事的心变强，邀请对方一起参与，比独自决定更有默契。',
            '需要一点自由和舒展，也别忘了告诉对方你的去向与真实想法。'
        ];

    return {
        name: person.name,
        sign: person.sign.name,
        birthday: `${person.birthday.month}.${person.birthday.day}`,
        loveScore,
        overallScore: loveScore,
        loveText: messages[(dayNumber + signOffset) % messages.length],
        luckyColor: '',
        luckyNumber: ''
    };
}

function getLocalCoupleFortune() {
    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const dayNumber = Math.floor((new Date() - startOfYear) / 86400000);
    return getCoupleSigns().map(person => createLocalSignFortune(person, dayNumber));
}

function getCoupleAdvice(score) {
    if (score >= 85) return '双子与射手都是重视交流和新鲜感的星座。今天适合一起尝试一件新事，也把喜欢直接说出来。';
    if (score >= 65) return '今天的关键词是“说清楚”。射手少一点想当然，双子少一点绕弯，默契会在坦率回应里升温。';
    return '今天先照顾情绪，再讨论道理。给彼此一点空间，晚些时候用一个具体问题重新开始对话。';
}

function saveFortuneCache(people) {
    try {
        localStorage.setItem(FORTUNE_CACHE_KEY, JSON.stringify({
            date: getLocalDateKey(),
            people
        }));
    } catch (error) {
        console.warn('Save horoscope cache error:', error);
    }
}

function loadFortuneCache() {
    try {
        const cached = JSON.parse(localStorage.getItem(FORTUNE_CACHE_KEY));
        if (cached?.date === getLocalDateKey() && Array.isArray(cached.people)) return cached.people;
    } catch (error) {
        console.warn('Load horoscope cache error:', error);
    }
    return null;
}

function appendFortuneText(parent, className, text) {
    const element = document.createElement('div');
    element.className = className;
    element.textContent = text;
    parent.appendChild(element);
    return element;
}

function renderCoupleFortune(people, source) {
    const content = document.getElementById('fortuneContent');
    const loveIndex = Math.round(people.reduce((total, person) => total + person.loveScore, 0) / people.length * 20);
    const result = document.createElement('div');
    result.className = 'fortune-result';

    const heading = appendFortuneText(result, 'fortune-level', `爱情指数 ${loveIndex}`);
    const max = document.createElement('span');
    max.textContent = '/100';
    heading.appendChild(max);

    appendFortuneText(result, 'fortune-pair', '射手座 × 双子座');

    const peopleContainer = document.createElement('div');
    peopleContainer.className = 'fortune-people';
    people.forEach(person => {
        const item = document.createElement('div');
        item.className = 'fortune-person';
        appendFortuneText(item, 'fortune-person-name', `${person.name} · ${person.sign} (${person.birthday})`);
        appendFortuneText(item, 'fortune-stars', `${'★'.repeat(person.loveScore)}${'☆'.repeat(5 - person.loveScore)}`);
        const indicators = [
            Number.isFinite(person.workScore) ? `工作 ${person.workScore}%` : '',
            Number.isFinite(person.moneyScore) ? `财运 ${person.moneyScore}%` : '',
            Number.isFinite(person.healthScore) ? `健康 ${person.healthScore}%` : ''
        ].filter(Boolean).join(' · ');
        if (indicators) appendFortuneText(item, 'fortune-indicators', indicators);
        appendFortuneText(item, 'fortune-person-text', person.loveText);
        peopleContainer.appendChild(item);
    });
    result.appendChild(peopleContainer);

    content.replaceChildren(result);
}

async function displayFortune(forceRefresh = false) {
    const content = document.getElementById('fortuneContent');
    const refreshButton = document.querySelector('.fortune-refresh');
    const cached = forceRefresh ? null : loadFortuneCache();
    if (cached) {
        renderCoupleFortune(cached, '天行数据今日运势 · 已缓存');
        return;
    }
    content.innerHTML = '<div class="fortune-loading">正在生成今日双人运势...</div>';
    if (refreshButton) refreshButton.disabled = true;
    try {
        const people = await Promise.all(getCoupleSigns().map(fetchSignFortune));
        saveFortuneCache(people);
        renderCoupleFortune(people, '天行数据今日运势 · 实时读取');
    } catch (error) {
        console.warn('Public horoscope unavailable:', error);
        renderCoupleFortune(getLocalCoupleFortune(), '公开接口暂不可用 · 本地日期参考');
    } finally {
        if (refreshButton) refreshButton.disabled = false;
    }
}

function refreshFortune() {
    displayFortune(true);
}

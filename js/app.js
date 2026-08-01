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
    { name: '可乐鸡翅', aliases: ['可乐鸡翅','鸡翅可乐'], image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=1000&q=85', summary: '甜咸入味、色泽油亮的家常硬菜。', ingredients: ['鸡翅中 8只（约500克）','可乐 330毫升','生抽 2汤匙','老抽 1茶匙（上色）','料酒 1汤匙','姜 5片','葱 2段','盐 1/3茶匙','食用油 1汤匙'], steps: ['鸡翅洗净，两面各划两刀；用料酒、2片姜腌 15 分钟。', '冷水下锅，加鸡翅和姜片，大火煮开后撇去浮沫，继续煮 2 分钟，捞出擦干。', '锅烧热放油，鸡翅皮面朝下，中火煎 3 到 4 分钟，翻面再煎 2 分钟，煎到两面金黄。', '加入葱段、剩余姜片、生抽、老抽和可乐；可乐液面到鸡翅一半即可。', '大火煮开后转中小火，加盖焖 15 分钟，中途翻面一次。', '开盖转大火收汁 3 到 5 分钟，汁变浓亮并能挂在鸡翅上即可；尝味后再决定是否加盐。'] },
    { name: '番茄炒蛋', aliases: ['番茄炒蛋','西红柿炒鸡蛋'], image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80', summary: '酸甜开胃，十分钟就能端上桌。', ingredients: ['番茄 2个','鸡蛋 3个','盐 1/2茶匙','白糖 1/2茶匙','食用油 2汤匙','葱花 少许'], steps: ['番茄切块，鸡蛋加 1 汤匙清水和少许盐打散。', '锅烧热放 1 汤匙油，倒入蛋液，炒到刚凝固就盛出，保持嫩度。', '补少许油，下番茄中火炒 2 到 3 分钟，炒出汁后加糖和盐。', '倒回鸡蛋，大火翻匀 30 秒，撒葱花出锅。'] },
    { name: '蒜香虾仁意面', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80', summary: '适合两个人一起完成的晚餐。', steps: '意面煮熟备用。蒜末和虾仁炒香，加入黑胡椒与少量煮面水，拌入意面即可。' },
    { name: '照烧鸡腿饭', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80', summary: '甜咸浓郁，配一碗热米饭。', steps: '鸡腿去骨煎至两面金黄，加入生抽、蜂蜜和清水，小火收汁后切块铺在米饭上。' },
    { name: '牛油果鸡蛋吐司', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=80', summary: '清爽的周末早餐。', steps: '吐司烤脆，牛油果压泥加盐和黑胡椒，铺上水煮蛋或煎蛋即可。' }
];

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function recipeCardHTML(recipe, action = true) {
    const image = recipe.image || featuredRecipes[recipe.id % featuredRecipes.length].image;
    const actionButton = action ? `<button class="recipe-save-found" data-name="${escapeHTML(recipe.name)}" data-desc="${escapeHTML(recipe.instructions || recipe.steps || recipe.summary || '')}" data-image="${escapeHTML(image)}">记入我的食谱</button>` : '';
    const ingredients = recipe.ingredients || [];
    const steps = Array.isArray(recipe.steps) ? recipe.steps : (recipe.instructions ? recipe.instructions.split(/\n+/).filter(Boolean) : []);
    return `<article class="recipe-result-card"><img src="${escapeHTML(image)}" alt="${escapeHTML(recipe.name)}" loading="lazy"><div class="recipe-result-body"><h4>${escapeHTML(recipe.name)}</h4><p class="recipe-summary">${escapeHTML(recipe.summary || '一份值得和喜欢的人一起分享的料理。')}</p>${ingredients.length ? `<section class="recipe-detail-section"><strong>准备食材</strong><ul>${ingredients.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></section>` : ''}${steps.length ? `<details class="recipe-detail-section" open><summary>详细步骤</summary><ol>${steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ol></details>` : ''}${actionButton}</div></article>`;
}

function renderDailyRecommendation() {
    const target = document.getElementById('recipeRecommendation');
    if (!target) return;
    const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const recipe = featuredRecipes[day % featuredRecipes.length];
    target.innerHTML = `<div class="recommendation-copy"><span class="recipe-kicker">TODAY'S PICK · ${getLocalDateKey()}</span><h3>今日推荐：${escapeHTML(recipe.name)}</h3><p>${escapeHTML(recipe.summary)}</p></div><img src="${recipe.image}" alt="今日推荐 ${escapeHTML(recipe.name)}" loading="lazy"><div class="recommendation-steps"><strong>快速做法</strong><span>${escapeHTML(recipe.steps)}</span></div>`;
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
    renderDailyRecommendation();
    document.getElementById('recipeDate').value = getLocalDateKey();

    const searchInput = document.getElementById('recipeSearchInput');
    const searchButton = document.getElementById('recipeSearchBtn');
    const searchStatus = document.getElementById('recipeSearchStatus');
    const searchResults = document.getElementById('recipeSearchResults');
    const searchRecipes = async () => {
        const query = searchInput.value.trim();
        if (!query) { searchStatus.textContent = '先输入一道菜名，例如“番茄炒蛋”'; return; }
        searchStatus.textContent = '正在找做法……';
        searchResults.innerHTML = '';
        const normalizedQuery = query.toLowerCase().replace(/[\s·炒]/g, '');
        const local = featuredRecipes.filter(recipe => [recipe.name, ...(recipe.aliases || [])].some(alias => normalizedQuery.includes(alias.toLowerCase().replace(/[\s·炒]/g, '')) || alias.toLowerCase().replace(/[\s·炒]/g, '').includes(normalizedQuery)));
        if (local.length) {
            searchStatus.textContent = `已找到 ${local.length} 道中文家常菜做法`;
            searchResults.innerHTML = local.map(recipe => recipeCardHTML(recipe)).join('');
            return;
        }
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
            const data = await response.json();
            const meals = (data.meals || []).slice(0, 6).map(meal => {
                const ingredients = [];
                for (let i = 1; i <= 20; i++) if (meal[`strIngredient${i}`]) ingredients.push(`${meal[`strMeasure${i}`] || ''}${meal[`strIngredient${i}`]}`);
                return { name: meal.strMeal, image: meal.strMealThumb, summary: `${meal.strArea || '家常'}料理`, ingredients, instructions: meal.strInstructions };
            });
            if (!meals.length) throw new Error('not found');
            searchStatus.textContent = `找到 ${meals.length} 道相关做法`;
            searchResults.innerHTML = meals.map(recipe => recipeCardHTML(recipe)).join('');
        } catch {
            searchStatus.textContent = '暂时没找到这道菜，可以换个关键词试试';
            searchResults.innerHTML = `<div class="recipe-empty-result">可以试试：可乐鸡翅、番茄炒蛋、西红柿炒鸡蛋、pasta、chicken</div>`;
        }
    };
    searchButton.addEventListener('click', searchRecipes);
    searchInput.addEventListener('keydown', event => { if (event.key === 'Enter') searchRecipes(); });
    searchResults.addEventListener('click', event => {
        const saveFound = event.target.closest('.recipe-save-found');
        if (!saveFound) return;
        const maxId = appData.recipes.length ? Math.max(...appData.recipes.map(recipe => recipe.id)) : 0;
        appData.recipes.push({ id: maxId + 1, name: saveFound.dataset.name, desc: saveFound.dataset.desc || '从搜索结果收藏的做法', date: getLocalDateKey(), image: saveFound.dataset.image });
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
//  音乐播放器
// ============================================
// ============================================
//  音乐播放器（网易云直链）
// ============================================
function initMusicPlayer() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    const status = document.getElementById('musicStatus');
    
    // 默认显示
    status.textContent = '恋爱轻音乐 ♪';
    
    // 音频就绪
    audio.addEventListener('canplay', () => {
        status.textContent = '恋爱轻音乐 ♪';
    });
    
    audio.addEventListener('error', () => {
        status.textContent = '加载失败，换个网络试试';
    });

    const tryAutoplay = () => audio.play().catch(() => {
        status.textContent = '轻触页面播放音乐 ♪';
    });
    tryAutoplay();
    document.addEventListener('pointerdown', tryAutoplay, { once: true });
    
    // 点击按钮播放/暂停
    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                toggle.classList.add('playing');
                icon.textContent = '🎵';
                status.textContent = '恋爱轻音乐 ♪';
            }).catch(err => {
                // 浏览器阻止自动播放，提示用户点击
                status.textContent = '点击音符播放';
                console.log('播放被阻止，请点击音符');
            });
        } else {
            audio.pause();
            toggle.classList.remove('playing');
            icon.textContent = '🎵';
            status.textContent = '恋爱轻音乐 ♪';
        }
    });
    
    // 正在播放
    audio.addEventListener('play', () => {
        toggle.classList.add('playing');
    });
    
    audio.addEventListener('pause', () => {
        toggle.classList.remove('playing');
    });
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
const HOROSCOPE_API = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily';
const FORTUNE_CACHE_KEY = 'loveSiteCoupleFortuneV3';
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
        const url = `${HOROSCOPE_API}?sign=${encodeURIComponent(apiSign)}&day=TODAY`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Horoscope HTTP ${response.status}`);

        const payload = await response.json();
        if (!payload.data) throw new Error('Invalid horoscope response');
        const data = payload.data;
        return {
            name: person.name,
            sign: person.sign.name,
            birthday: `${person.birthday.month}.${person.birthday.day}`,
            loveScore: normalizeScore(data.fortune?.love),
            overallScore: normalizeScore(data.fortune?.all),
            loveText: data.horoscope_data || data.fortunetext?.love || data.shortcomment || '今天适合把真实想法说清楚，给彼此一个及时回应。',
            luckyColor: data.luckycolor || '',
            luckyNumber: data.luckynumber || ''
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
        appendFortuneText(item, 'fortune-person-text', person.loveText);
        peopleContainer.appendChild(item);
    });
    result.appendChild(peopleContainer);

    appendFortuneText(result, 'fortune-advice', getCoupleAdvice(loveIndex));
    appendFortuneText(result, 'fortune-source', source);
    content.replaceChildren(result);
}

async function displayFortune(forceRefresh = false) {
    const content = document.getElementById('fortuneContent');
    const refreshButton = document.querySelector('.fortune-refresh');
    const cached = forceRefresh ? null : loadFortuneCache();
    if (cached) {
        renderCoupleFortune(cached, '今日公开日运 · 已缓存');
        return;
    }
    content.innerHTML = '<div class="fortune-loading">正在生成今日双人运势...</div>';
    if (refreshButton) refreshButton.disabled = true;
    try {
        const people = await Promise.all(getCoupleSigns().map(fetchSignFortune));
        saveFortuneCache(people);
        renderCoupleFortune(people, '今日公开日运 · 实时读取');
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

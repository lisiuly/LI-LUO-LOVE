// ============================================
//  ? 希宝 & 小李 - 秘密花园 ?
// ============================================

// ---- 配置 ----
const CONFIG = {
    PASSWORD: '0616',
    GIRL_NAME: '希宝',
    BOY_NAME: '小李',
    START_DATE: '2021-06-26',
    GIRL_BIRTHDAY: { month: 6, day: 16 },
    STORAGE_KEY: 'loveSiteData'
};

// ---- 数据存储 ----
const defaultData = {
    plans: [
        { id: 1, text: '一起去看海 ?', done: false },
        { id: 2, text: '一起吃遍所有美食 ?', done: false },
        { id: 3, text: '一起去看樱花 ?', done: false },
        { id: 4, text: '一起坐摩天轮 ?', done: false },
        { id: 5, text: '一起养一只猫 ?', done: false },
        { id: 6, text: '一起旅行去日本 ??', done: false },
        { id: 7, text: '一起看日出 ?', done: false },
        { id: 8, text: '一起看流星雨 ?', done: false },
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

// ============================================
//  花瓣飘落效果
// ============================================
function createPetals() {
    const container = document.getElementById('petalsContainer');
    const petals = ['?', '?', '?', '?', '?', '?', '?', '?'];
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

function calcBirthdayCountdown() {
    const now = new Date();
    const bday = CONFIG.GIRL_BIRTHDAY;
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
    const days = calcDaysSince(CONFIG.START_DATE);
    const dur = calcDuration(CONFIG.START_DATE);

    document.getElementById('daysTogether').textContent = days;
    document.getElementById('togetherDetail').textContent =
        `${dur.years}年 ${dur.months}个月 ${dur.days}天`;

    const bdayDays = calcBirthdayCountdown();
    document.getElementById('birthdayCountdown').textContent = bdayDays;

    // Update milestones
    const startDate = new Date(CONFIG.START_DATE);
    const ms100 = new Date(startDate);
    ms100.setDate(ms100.getDate() + 100);
    document.getElementById('milestone100').textContent = formatDate(ms100.toISOString().slice(0, 10));

    const ms365 = new Date(startDate);
    ms365.setFullYear(ms365.getFullYear() + 1);
    document.getElementById('milestone365').textContent = formatDate(ms365.toISOString().slice(0, 10));
}

// ============================================
//  情话切换
// ============================================
const loveQuotes = [
    '你的笑容是我一天的动力 ?',
    '遇见你是我最美好的意外 ?',
    '想和你一起，走过春夏秋冬 ?????',
    '你是我的小呀小苹果 ?',
    '余生有你，请多指教 ?',
    '你的眼里有星星 ?',
    '世界那么大，我只想要你 ?',
    '每天想你一百遍 ?',
    '你是我写过最美的情书 ?',
    '在一起的日子，每天都甜 ?',
    '希宝是世界上最好的女朋友 ?',
    '小李永远爱希宝 ??',
    '想牵着你的手，一直走下去 ?',
    '你是我最想留住的幸运 ?',
    '只要有你在，每天都是情人节 ?'
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
            <div class="plan-checkbox" data-id="${plan.id}">${plan.done ? '?' : ''}</div>
            <span class="plan-text">${plan.text}</span>
            <button class="plan-delete" data-id="${plan.id}">?</button>
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
                <span class="empty-state-icon">?</span>
                <span class="empty-state-text">还没有日记，写下第一段回忆吧 ??</span>
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
                <span class="diary-entry-title">? ${diary.title}</span>
                <span class="diary-entry-date">? ${diary.date}</span>
            </div>
            <div class="diary-entry-content">${diary.content}</div>
            <button class="diary-entry-delete" data-id="${diary.id}">?</button>
        `;
        list.appendChild(div);
    });
}

function initDiaries() {
    renderDiaries();

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
            alert('请填写标题和内容哦 ?');
            return;
        }

        const maxId = appData.diaries.length > 0 ? Math.max(...appData.diaries.map(d => d.id)) : 0;
        appData.diaries.push({ id: maxId + 1, title, content, date });
        saveData(appData);
        renderDiaries();

        document.getElementById('diaryTitle').value = '';
        document.getElementById('diaryContent').value = '';
        document.getElementById('diaryDate').value = '';
    });
}

// ============================================
//  食谱日记
// ============================================
function renderRecipes() {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = '';

    if (appData.recipes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <span class="empty-state-icon">?</span>
                <span class="empty-state-text">还没有记录食谱，做了好吃的记下来吧 ?</span>
            </div>
        `;
        return;
    }

    const foodIcons = ['?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?'];
    const sorted = [...appData.recipes].reverse();
    sorted.forEach(recipe => {
        const icon = foodIcons[recipe.id % foodIcons.length];
        const div = document.createElement('div');
        div.className = 'recipe-entry';
        div.innerHTML = `
            <div class="recipe-entry-icon">${icon}</div>
            <div class="recipe-entry-title">${recipe.name}</div>
            <div class="recipe-entry-desc">${recipe.desc}</div>
            <div class="recipe-entry-date">? ${recipe.date}</div>
            <button class="recipe-entry-delete" data-id="${recipe.id}">?</button>
        `;
        grid.appendChild(div);
    });
}

function initRecipes() {
    renderRecipes();

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
            alert('请输入菜名哦 ?');
            return;
        }

        const maxId = appData.recipes.length > 0 ? Math.max(...appData.recipes.map(r => r.id)) : 0;
        appData.recipes.push({ id: maxId + 1, name, desc: desc || '超好吃！?', date });
        saveData(appData);
        renderRecipes();

        document.getElementById('recipeName').value = '';
        document.getElementById('recipeDesc').value = '';
        document.getElementById('recipeDate').value = '';
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
            { emoji: '?', text: '你们的照片' },
            { emoji: '?', text: '美好回忆' },
            { emoji: '?', text: '甜蜜瞬间' },
            { emoji: '?', text: '生日快乐' },
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
            <button class="photo-delete-btn" data-index="${index}">?</button>
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
function initMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    const status = document.getElementById('musicStatus');
    const fileInput = document.getElementById('musicFileInput');
    const uploadBtn = document.getElementById('musicUploadBtn');

    // Check if there's saved music
    const savedMusic = localStorage.getItem('loveSiteMusic');
    if (savedMusic) {
        audio.src = savedMusic;
        status.textContent = '本地音乐';
        player.style.display = 'flex';
    } else {
        player.style.display = 'flex';
    }

    // Toggle play/pause
    toggle.addEventListener('click', () => {
        if (!audio.src) {
            fileInput.click();
            return;
        }

        if (audio.paused) {
            audio.play().then(() => {
                toggle.classList.add('playing');
                icon.textContent = '\u{1F3B5}';
            }).catch(() => {
                // Auto play blocked, user needs to interact
                status.textContent = '点击播放';
            });
        } else {
            audio.pause();
            toggle.classList.remove('playing');
            icon.textContent = '\u{1F3B5}';
        }
    });

    // Update icon when playing
    audio.addEventListener('play', () => {
        toggle.classList.add('playing');
        icon.textContent = '\u{1F3B5}';
        status.textContent = audio.src ? (savedMusic ? '本地音乐' : '播放中') : '没有音乐';
    });

    audio.addEventListener('pause', () => {
        toggle.classList.remove('playing');
        icon.textContent = '\u{1F3B5}';
    });

    audio.addEventListener('ended', () => {
        toggle.classList.remove('playing');
        icon.textContent = '\u{1F3B5}';
    });

    // Upload music
    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            audio.src = e.target.result;
            localStorage.setItem('loveSiteMusic', e.target.result);
            status.textContent = file.name.replace(/\.[^/.]+$/, '');
            toggle.classList.add('playing');
            icon.textContent = '&#127925;';
            audio.play().catch(() => {});
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
    });

    // Try to load a demo song from a free API if no music is loaded
    if (!savedMusic) {
        // Use a free, publicly available music track
        const demoMusic = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        // Don't auto-load, let user choose
        status.textContent = '点击音符上传音乐';
    }
}

// ============================================
//  初始化主站
// ============================================
function initMainSite() {
    updateCounters();
    // Update counters every minute
    setInterval(updateCounters, 60000);

    // Init all modules
    initNavigation();
    initPlans();
    initDiaries();
    initRecipes();
    initPhotos();
    initMusicPlayer();

    // Set initial quote
    const quoteEl = document.querySelector('.quote-text');
    if (quoteEl) {
        quoteEl.textContent = loveQuotes[0];
        quoteEl.style.transition = 'all 0.3s ease';
    }
}

// ============================================
//  ? 启动！
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    createPetals();
    initLogin();
});

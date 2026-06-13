// ============================================
//  � 希宝 & 小李 🐻 - 秘密花园 🐾
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
    const start = new Date(CONFIG.START_DATE);
    const now = new Date();
    const diff = now - start;

    // Calculate total time
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('timerDays').textContent = days;
    document.getElementById('timerHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');

    // Update login page counter too
    const loginDaysEl = document.getElementById('loginDaysDisplay');
    const loginTimeEl = document.getElementById('loginTimeDisplay');
    if (loginDaysEl) loginDaysEl.textContent = days + ' 天';
    if (loginTimeEl) loginTimeEl.textContent = hours + '时 ' + minutes + '分 ' + seconds + '秒';

    const dur = calcDuration(CONFIG.START_DATE);
    document.getElementById('togetherDetail').textContent =
        `${dur.years}年${dur.months}个月${dur.days}天 ❤️  forever`;

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
                <span class="diary-entry-title">💕 ${diary.title}</span>
                <span class="diary-entry-date">📅 ${diary.date}</span>
            </div>
            <div class="diary-entry-content">${diary.content}</div>
            <button class="diary-entry-delete" data-id="${diary.id}">🗑️</button>
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
            alert('请填写标题和内容哦 💕');
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
                <span class="empty-state-icon">🍳</span>
                <span class="empty-state-text">还没有记录食谱，做了好吃的记下来吧 😋</span>
            </div>
        `;
        return;
    }

    const foodIcons = ['🍚', '🍜', '🍝', '🍛', '🍣', '🥟', '🍲', '🥗', '🍕', '🥘', '🍰', '🍨'];
    const sorted = [...appData.recipes].reverse();
    sorted.forEach(recipe => {
        const icon = foodIcons[recipe.id % foodIcons.length];
        const div = document.createElement('div');
        div.className = 'recipe-entry';
        div.innerHTML = `
            <div class="recipe-entry-icon">${icon}</div>
            <div class="recipe-entry-title">${recipe.name}</div>
            <div class="recipe-entry-desc">${recipe.desc}</div>
            <div class="recipe-entry-date">📅 ${recipe.date}</div>
            <button class="recipe-entry-delete" data-id="${recipe.id}">🗑️</button>
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
            alert('请输入菜名哦 😋');
            return;
        }

        const maxId = appData.recipes.length > 0 ? Math.max(...appData.recipes.map(r => r.id)) : 0;
        appData.recipes.push({ id: maxId + 1, name, desc: desc || '超好吃！😋', date });
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
    status.textContent = '狂恋你 ♪';
    
    // 音频就绪
    audio.addEventListener('canplay', () => {
        status.textContent = '狂恋你 - 沈以诚 ♪';
    });
    
    audio.addEventListener('error', () => {
        status.textContent = '加载失败，换个网络试试';
    });
    
    // 点击按钮播放/暂停
    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                toggle.classList.add('playing');
                icon.textContent = '🎵';
                status.textContent = '狂恋你 - 沈以诚 ♪';
            }).catch(err => {
                // 浏览器阻止自动播放，提示用户点击
                status.textContent = '点击音符播放';
                console.log('播放被阻止，请点击音符');
            });
        } else {
            audio.pause();
            toggle.classList.remove('playing');
            icon.textContent = '🎵';
            status.textContent = '狂恋你 ♪';
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
    // Update counters every second (real-time count-up)
    setInterval(updateCounters, 1000);

    // Init all modules
    initNavigation();
    initPlans();
    initDiaries();
    initRecipes();
    initPhotos();
    initMusicPlayer();
    initWeather();
    displayFortune();
    displayTask();

    // Set initial quote
    const quoteEl = document.querySelector('.quote-text');
    if (quoteEl) {
        quoteEl.textContent = loveQuotes[0];
        quoteEl.style.transition = 'all 0.3s ease';
    }
}

// ============================================
//  🐶🐻 启动！
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    createPetals();
    initLogin();
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
    const savedCity = localStorage.getItem('loveSiteCity') || '深圳';
    document.getElementById('cityInput').value = savedCity;
    fetchWeather(savedCity);

    document.getElementById('cityBtn').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            localStorage.setItem('loveSiteCity', city);
            fetchWeather(city);
        }
    });

    document.getElementById('cityInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('cityBtn').click();
    });
}

// ============================================
//  🔮 今日运势
// ============================================
const fortuneList = [
    // ===== 大吉 =====
    { level: '大吉', text: '今日爱情运势极佳！适合表白、约会、求婚，大胆表达你的爱吧 💕' },
    { level: '大吉', text: '天作之合！今天你们的心有灵犀指数爆表，一个眼神就能懂对方 👀' },
    { level: '大吉', text: '超级幸运日！适合一起做一件从未做过的事，创造新的回忆 ✨' },
    { level: '大吉', text: '爱情满满的一天！给对方准备一个小惊喜，TA会感动到哭 🎁' },
    { level: '大吉', text: '今日份甜蜜超标！适合一起看日出日落，浪漫值拉满 🌅' },
    { level: '大吉', text: '今天适合一起去看星星，感受宇宙的浪漫 🌟' },
    { level: '大吉', text: '今天你们的默契度满分！一起做什么都顺利，享受甜蜜时光吧 🎯' },
    { level: '大吉', text: '桃花运爆棚！但你的眼里只有TA，这才是最浪漫的事 🌸' },
    { level: '大吉', text: '适合制造惊喜的一天！TA会因为你的小心意开心一整天 🎈' },
    { level: '大吉', text: '今日爱情能量满格！一起拍照记录美好瞬间吧 📸' },
    // ===== 中吉 =====
    { level: '中吉', text: '运势不错！一起做饭会有意想不到的乐趣 🍳' },
    { level: '中吉', text: '今天适合散步聊天，分享彼此的心事 🚶' },
    { level: '中吉', text: '给对方写一封情书吧，文字最能打动人心 💌' },
    { level: '中吉', text: '一起看一部电影，享受温馨的二人世界 🎬' },
    { level: '中吉', text: '小幸运正在靠近，注意今天的小惊喜 🍀' },
    { level: '中吉', text: '今天适合一起听音乐，放松心情 🎵' },
    { level: '中吉', text: '给对方一个拥抱，胜过千言万语 🤗' },
    { level: '中吉', text: '一起回忆初次见面的情景，会很有趣哦 💭' },
    { level: '中吉', text: '一起喝杯咖啡聊聊天，平淡中也有甜蜜 ☕' },
    { level: '中吉', text: '今天适合一起运动，健康又有爱 🏃' },
    // ===== 小吉 =====
    { level: '小吉', text: '平平淡淡也是真，珍惜在一起的每一刻 ☺️' },
    { level: '小吉', text: '偶尔的小争吵也是感情的调味剂，别太在意 🌶️' },
    { level: '小吉', text: '今天适合一起静静看书或追剧 📖' },
    { level: '小吉', text: '给对方做一顿早餐，温暖从清晨开始 🌅' },
    { level: '小吉', text: '一起整理房间也是一件浪漫的小事 🏠' },
    { level: '小吉', text: '今天的小确幸：一起逛超市采购 🛒' },
    { level: '小吉', text: '适合一起打游戏，开心最重要 🎮' },
    { level: '小吉', text: '和TA一起养一盆植物，见证你们的爱情成长 🌱' },
    { level: '小吉', text: '今天适合给对方按摩放松，贴心满分 💆' },
    { level: '小吉', text: '一起计划下一次旅行，期待也是幸福的一部分 🗺️' },
];

function getDailyFortune() {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem('loveSiteFortune');
    let fortuneIndex;

    if (saved) {
        try {
            const savedData = JSON.parse(saved);
            if (savedData.date === today) {
                fortuneIndex = savedData.index;
            } else {
                fortuneIndex = Math.floor(Math.random() * fortuneList.length);
                localStorage.setItem('loveSiteFortune', JSON.stringify({ date: today, index: fortuneIndex }));
            }
        } catch {
            fortuneIndex = Math.floor(Math.random() * fortuneList.length);
            localStorage.setItem('loveSiteFortune', JSON.stringify({ date: today, index: fortuneIndex }));
        }
    } else {
        fortuneIndex = Math.floor(Math.random() * fortuneList.length);
        localStorage.setItem('loveSiteFortune', JSON.stringify({ date: today, index: fortuneIndex }));
    }

    return fortuneList[fortuneIndex];
}

function displayFortune() {
    const content = document.getElementById('fortuneContent');
    const fortune = getDailyFortune();
    content.innerHTML = `
        <div class="fortune-result">
            <div class="fortune-level">${fortune.level}</div>
            <div class="fortune-text">${fortune.text}</div>
        </div>
    `;
}

function refreshFortune() {
    const today = new Date().toISOString().slice(0, 10);
    const newIndex = Math.floor(Math.random() * fortuneList.length);
    localStorage.setItem('loveSiteFortune', JSON.stringify({ date: today, index: newIndex }));
    displayFortune();
}

// ============================================
//  ✅ 今日恋爱任务
// ============================================
const loveTasks = [
    { icon: '💬', text: '互相说10个对方的优点' },
    { icon: '🤗', text: '给对方一个持续30秒的拥抱' },
    { icon: '💋', text: '给对方一个早安吻和晚安吻' },
    { icon: '📝', text: '一起写下未来一年的目标' },
    { icon: '📸', text: '拍一张合照留作纪念' },
    { icon: '🍳', text: '一起做一顿浪漫的晚餐' },
    { icon: '🎵', text: '分享一首最近最喜欢的歌' },
    { icon: '📖', text: '给对方读一段有趣的故事' },
    { icon: '🚶', text: '一起散步15分钟，不玩手机' },
    { icon: '💌', text: '给对方写一封情书' },
    { icon: '🎬', text: '一起看一部爱情电影' },
    { icon: '☕', text: '一起喝杯咖啡，聊聊天' },
    { icon: '🎮', text: '一起玩一局游戏' },
    { icon: '🌸', text: '给对方买一束花' },
    { icon: '🎁', text: '准备一个小惊喜给对方' },
    { icon: '📞', text: '给远方的TA打个电话说想你' },
    { icon: '🎂', text: '一起做甜点' },
    { icon: '🎨', text: '一起画一幅画' },
    { icon: '🧩', text: '一起完成一个拼图' },
    { icon: '🌅', text: '一起看日出或日落' },
];

function getDailyTask() {
    const today = new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem('loveSiteTask');
    let taskIndex;

    if (saved) {
        try {
            const savedData = JSON.parse(saved);
            if (savedData.date === today) {
                taskIndex = savedData.index;
            } else {
                taskIndex = Math.floor(Math.random() * loveTasks.length);
                localStorage.setItem('loveSiteTask', JSON.stringify({ date: today, index: taskIndex }));
            }
        } catch {
            taskIndex = Math.floor(Math.random() * loveTasks.length);
            localStorage.setItem('loveSiteTask', JSON.stringify({ date: today, index: taskIndex }));
        }
    } else {
        taskIndex = Math.floor(Math.random() * loveTasks.length);
        localStorage.setItem('loveSiteTask', JSON.stringify({ date: today, index: taskIndex }));
    }

    return loveTasks[taskIndex];
}

function displayTask() {
    const content = document.getElementById('taskContent');
    const task = getDailyTask();
    content.innerHTML = `
        <div class="task-result">
            <div class="task-icon">${task.icon}</div>
            <div class="task-text">${task.text}</div>
        </div>
    `;
}

function refreshTask() {
    const today = new Date().toISOString().slice(0, 10);
    const newIndex = Math.floor(Math.random() * loveTasks.length);
    localStorage.setItem('loveSiteTask', JSON.stringify({ date: today, index: newIndex }));
    displayTask();
}

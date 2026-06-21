// ============================================
// DEBATEMATE - Complete JavaScript
// ============================================

// ============================================
// DATA
// ============================================

const topicsData = [
    {
        id: 1,
        title: "AI Will Replace Human Jobs in 10 Years",
        category: "technology",
        difficulty: "medium",
        debates: 2345,
        icon: "💻",
        description: "Will artificial intelligence make human workers obsolete?"
    },
    {
        id: 2,
        title: "Social Media Does More Harm Than Good",
        category: "technology",
        difficulty: "medium",
        debates: 1876,
        icon: "📱",
        description: "Is social media destroying real human connections?"
    },
    {
        id: 3,
        title: "Universal Basic Income Should Be Implemented",
        category: "politics",
        difficulty: "hard",
        debates: 1234,
        icon: "🏛️",
        description: "Should governments provide a basic income to all citizens?"
    },
    {
        id: 4,
        title: "Is Free Will an Illusion?",
        category: "philosophy",
        difficulty: "hard",
        debates: 987,
        icon: "🧠",
        description: "Do we truly have control over our decisions?"
    },
    {
        id: 5,
        title: "Plant-Based Diets Are Better for Health",
        category: "health",
        difficulty: "easy",
        debates: 1567,
        icon: "❤️",
        description: "Can a plant-based diet improve overall health?"
    },
    {
        id: 6,
        title: "Climate Change Is the Greatest Threat of Our Time",
        category: "environment",
        difficulty: "medium",
        debates: 2100,
        icon: "🌍",
        description: "Is climate change our most urgent global challenge?"
    },
    {
        id: 7,
        title: "Online Education Is Better Than Traditional",
        category: "education",
        difficulty: "easy",
        debates: 1456,
        icon: "📚",
        description: "Is digital learning superior to physical classrooms?"
    },
    {
        id: 8,
        title: "Remote Work Increases Productivity",
        category: "business",
        difficulty: "medium",
        debates: 1987,
        icon: "💼",
        description: "Does working from home make people more productive?"
    },
    {
        id: 9,
        title: "Genetic Engineering Should Be Legal",
        category: "health",
        difficulty: "hard",
        debates: 876,
        icon: "🧬",
        description: "Should we edit human genes for improvement?"
    },
    {
        id: 10,
        title: "Cryptocurrency Will Replace Traditional Money",
        category: "business",
        difficulty: "medium",
        debates: 2341,
        icon: "💰",
        description: "Is cryptocurrency the future of finance?"
    }
];

// Sample AI responses for different topics (for demo)
const aiResponses = {
    "AI Will Replace Human Jobs in 10 Years": [
        "While automation will replace some jobs, history shows technology creates new roles we can't yet imagine. The internet created millions of jobs that didn't exist before.",
        "AI may eliminate routine tasks, but it will augment human capabilities. We'll see new professions emerge in AI ethics, AI training, and human-AI collaboration.",
        "The Luddite fallacy suggests that fears about technology replacing jobs are unfounded. Every industrial revolution created more jobs than it destroyed."
    ],
    "Social Media Does More Harm Than Good": [
        "Social media connects us globally and gives voice to marginalized communities. The Arab Spring showed how it can drive positive political change.",
        "It enables small businesses to reach customers globally. Many entrepreneurs built their brands entirely through social media.",
        "Social media facilitates rapid information sharing during emergencies. It's been crucial for disaster response and public health communication."
    ],
    "Universal Basic Income Should Be Implemented": [
        "UBI would eliminate poverty and reduce inequality. It gives people the freedom to pursue education, art, and entrepreneurship without fear.",
        "The administrative costs of current welfare systems are enormous. UBI would streamline social support and reduce bureaucracy.",
        "Pilot programs in Finland and Kenya show UBI improves mental health, reduces crime, and increases economic activity."
    ],
    "default": [
        "That's an interesting point. However, we must consider the counter-argument that...",
        "While I see your perspective, the evidence suggests a different conclusion...",
        "Your argument has merit, but it fails to account for the broader context of...",
        "I understand your position, but let me offer an alternative interpretation..."
    ]
};

// ============================================
// STATE
// ============================================

let state = {
    currentPage: 'home',
    isLoggedIn: false,
    currentUser: null,
    currentDebate: null,
    userScore: 0,
    aiScore: 0,
    currentRound: 0,
    maxRounds: 5,
    debateHistory: [],
    iqScore: 0,
    timer: null,
    seconds: 0,
    achievements: [],
    stats: {
        totalDebates: 0,
        wins: 0,
        losses: 0,
        draws: 0
    }
};

// ============================================
// DOM REFS
// ============================================

function $(id) {
    return document.getElementById(id);
}

// ============================================
// PAGE NAVIGATION - FIXED!
// ============================================

function showPage(page) {
    console.log('Showing page:', page); // Debug log
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    console.log('Found pages:', pages.length); // Debug log
    
    pages.forEach(p => {
        p.classList.remove('active');
    });

    // Show target page
    const target = $(`page-${page}`);
    if (target) {
        target.classList.add('active');
        console.log('Showing:', page); // Debug log
    } else {
        console.error('Page not found:', page); // Debug log
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    state.currentPage = page;

    // Load data for dashboard
    if (page === 'dashboard' && state.isLoggedIn) {
        renderDashboard();
    }

    // Render topics
    if (page === 'topics') {
        renderTopics();
    }
}

// ============================================
// AUTHENTICATION
// ============================================

function toggleAuth() {
    const modal = $('authModal');
    if (modal) {
        modal.classList.toggle('show');
        if (modal.classList.contains('show')) {
            switchAuth('login');
        }
    }
}

function closeAuth() {
    const modal = $('authModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function switchAuth(form) {
    const loginForm = $('loginForm');
    const signupForm = $('signupForm');
    
    if (form === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'none';
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'block';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = $('loginEmail');
    const password = $('loginPassword');
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    state.isLoggedIn = true;
    state.currentUser = { username: 'Debater', email: email.value };
    closeAuth();
    updateUIAfterAuth();
    alert('✅ Login successful! Welcome back!');
}

function handleSignup(e) {
    e.preventDefault();
    const username = $('signupUsername');
    const email = $('signupEmail');
    const password = $('signupPassword');
    const confirm = $('signupConfirm');

    if (!username || !email || !password || !confirm) {
        alert('Please fill in all fields');
        return;
    }

    if (password.value !== confirm.value) {
        alert('Passwords do not match!');
        return;
    }

    state.isLoggedIn = true;
    state.currentUser = { username: username.value, email: email.value };
    closeAuth();
    updateUIAfterAuth();
    alert(`✅ Welcome ${username.value}! Your account has been created.`);
}

function logout() {
    state.isLoggedIn = false;
    state.currentUser = null;
    state.stats = {
        totalDebates: 0,
        wins: 0,
        losses: 0,
        draws: 0
    };
    localStorage.removeItem('debateHistory');
    state.achievements = [];
    state.iqScore = 0;
    state.currentDebate = null;
    state.userScore = 0;
    state.aiScore = 0;
    state.currentRound = 0;
    state.debateHistory = [];
    state.seconds = 0;
    
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    
    updateUIAfterAuth();
    showPage('home');
    alert('Logged out successfully. All your data has been cleared.');
}

function updateUIAfterAuth() {
    const authBtn = $('authBtn');
    if (!authBtn) return;
    
    if (state.isLoggedIn && state.currentUser) {
        authBtn.textContent = `👤 ${state.currentUser.username}`;
        authBtn.onclick = () => showPage('dashboard');
        authBtn.className = 'nav-btn nav-btn-primary';
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = toggleAuth;
        authBtn.className = 'nav-btn nav-btn-primary';
    }
}

// ============================================
// TOPICS
// ============================================

let currentCategory = 'all';

function renderTopics() {
    const grid = $('topicsGrid');
    if (!grid) return;
    
    let filtered = [...topicsData];

    if (currentCategory !== 'all') {
        filtered = filtered.filter(t => t.category === currentCategory);
    }

    const search = $('topicSearch');
    if (search) {
        const searchTerm = search.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(searchTerm) ||
                t.category.includes(searchTerm)
            );
        }
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                No topics found. Try a different search!
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(topic => `
        <div class="topic-card">
            <span class="topic-category">${topic.icon} ${topic.category}</span>
            <h4>${topic.title}</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 8px 0;">${topic.description}</p>
            <div class="topic-meta">
                <span>⭐ ${topic.difficulty}</span>
                <span>📊 ${topic.debates} debates</span>
            </div>
            <div class="topic-actions">
                <button class="btn btn-small btn-primary" onclick="startDebate(${topic.id}, 'for')">FOR</button>
                <button class="btn btn-small btn-secondary" onclick="startDebate(${topic.id}, 'against')">AGAINST</button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) tab.classList.add('active');
    });
    renderTopics();
}

function filterTopics() {
    renderTopics();
}

// ============================================
// DEBATE FUNCTIONS (Simplified for now)
// ============================================

function startDebate(topicId, side) {
    if (!state.isLoggedIn) {
        alert('Please login first to start a debate!');
        toggleAuth();
        return;
    }

    const topic = topicsData.find(t => t.id === topicId);
    if (!topic) return;

    state.currentDebate = topic;
    state.currentRound = 0;
    state.userScore = 0;
    state.aiScore = 0;
    state.debateHistory = [];
    state.seconds = 0;

    // Update UI
    const topicEl = $('debateTopic');
    const sideEl = $('debateSide');
    const difficultyEl = $('debateDifficulty');
    const roundEl = $('currentRound');
    
    if (topicEl) topicEl.textContent = topic.title;
    if (sideEl) sideEl.textContent = `You: ${side.toUpperCase()}`;
    if (difficultyEl) difficultyEl.textContent = `⚡ ${topic.difficulty}`;
    if (roundEl) roundEl.textContent = '1';
    
    $('debateTimer').textContent = '00:00';
    $('userScore').textContent = '0';
    $('aiScore').textContent = '0';

    // Reset bars
    const userFill = document.querySelector('.user-score-fill');
    const aiFill = document.querySelector('.ai-score-fill');
    const iqFill = document.querySelector('.iq-fill');
    const iqValue = $('iqValue');
    
    if (userFill) userFill.style.width = '0%';
    if (aiFill) aiFill.style.width = '0%';
    if (iqFill) iqFill.style.width = '0%';
    if (iqValue) iqValue.textContent = '0';

    // Clear chat
    const chat = $('debateChat');
    if (chat) {
        chat.innerHTML = `
            <div class="debate-start-msg">
                <p>🎯 Debate Started!</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    Topic: "${topic.title}"
                </p>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 10px;">
                    Make your opening argument...
                </p>
            </div>
        `;
    }

    // Clear input
    const input = $('debateInput');
    if (input) input.value = '';

    // Show debate page
    showPage('debate');

    // Start timer
    startTimer();

    // Enable input
    if (input) input.disabled = false;
    const sendBtn = document.querySelector('.input-wrapper .btn-primary');
    if (sendBtn) sendBtn.disabled = false;
}

// ============================================
// DASHBOARD
// ============================================

function renderDashboard() {
    const usernameEl = $('username');
    if (usernameEl) {
        usernameEl.textContent = state.currentUser ? state.currentUser.username : 'Debater';
    }

    const totalEl = $('totalDebates');
    const winsEl = $('wins');
    const lossesEl = $('losses');
    const drawsEl = $('draws');
    
    if (totalEl) totalEl.textContent = state.stats.totalDebates;
    if (winsEl) winsEl.textContent = state.stats.wins;
    if (lossesEl) lossesEl.textContent = state.stats.losses;
    if (drawsEl) drawsEl.textContent = state.stats.draws;

    const iq = state.iqScore || Math.floor(Math.random() * 30) + 60;
    const iqFillLarge = $('iqFillLarge');
    const iqValueLarge = $('iqValueLarge');
    const percentile = $('percentile');
    
    if (iqFillLarge) iqFillLarge.style.width = `${iq}%`;
    if (iqValueLarge) iqValueLarge.textContent = iq;
    if (percentile) percentile.textContent = Math.floor(Math.random() * 30) + 60;

    renderAchievements();
    renderHistory();
}

function renderAchievements() {
    const grid = $('achievementsGrid');
    if (!grid) return;
    
    const allAchievements = [
        { icon: '🎯', label: 'First Debate', unlocked: state.stats.totalDebates >= 1 },
        { icon: '🔥', label: '5 Debates', unlocked: state.stats.totalDebates >= 5 },
        { icon: '💪', label: 'First Win', unlocked: state.stats.wins >= 1 },
        { icon: '👑', label: '5 Wins', unlocked: state.stats.wins >= 5 },
        { icon: '⭐', label: '10 Debates', unlocked: state.stats.totalDebates >= 10 },
        { icon: '🌟', label: 'Debate Master', unlocked: state.stats.wins >= 10 },
        { icon: '🏅', label: 'Perfect Score', unlocked: state.stats.wins >= 3 && state.stats.losses === 0 },
        { icon: '🎖️', label: 'Veteran', unlocked: state.stats.totalDebates >= 25 }
    ];

    grid.innerHTML = allAchievements.map(ach => `
        <div class="achievement-item ${ach.unlocked ? '' : 'locked'}">
            <span class="ach-icon">${ach.icon}</span>
            <span class="ach-label">${ach.label}</span>
        </div>
    `).join('');
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('debateHistory')) || [];
    const container = $('historyList');
    
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
                No debates yet. Start your first debate!
            </p>
        `;
        return;
    }

    container.innerHTML = history.slice(-5).reverse().map(item => `
        <div class="history-item">
            <span class="h-topic">${item.topic}</span>
            <span class="h-result ${item.result}">${item.result.toUpperCase()}</span>
            <span class="h-date">${item.date}</span>
        </div>
    `).join('');
}

function saveDebateHistory(result) {
    const history = JSON.parse(localStorage.getItem('debateHistory')) || [];
    history.push({
        topic: state.currentDebate.title,
        result: result,
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('debateHistory', JSON.stringify(history));
}

// ============================================
// TIMER
// ============================================

function startTimer() {
    if (state.timer) clearInterval(state.timer);
    state.seconds = 0;

    state.timer = setInterval(() => {
        state.seconds++;
        const mins = String(Math.floor(state.seconds / 60)).padStart(2, '0');
        const secs = String(state.seconds % 60).padStart(2, '0');
        const timerEl = $('debateTimer');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
}

// ============================================
// SEND ARGUMENT (Simplified)
// ============================================

function sendArgument() {
    if (!state.isLoggedIn) {
        alert('Please login first!');
        return;
    }

    const input = $('debateInput');
    if (!input) return;
    
    const text = input.value.trim();

    if (!text) {
        alert('Please type your argument first!');
        return;
    }

    if (state.currentRound >= state.maxRounds) {
        alert('Debate is complete! Click "End Debate" to see results.');
        return;
    }

    // Add user message
    addMessage('user', text);

    // Clear input
    input.value = '';
    input.disabled = true;
    const sendBtn = document.querySelector('.input-wrapper .btn-primary');
    if (sendBtn) sendBtn.disabled = true;

    // Show thinking
    addMessage('ai', '⏳ Thinking...', true);

    // Simulate AI thinking
    setTimeout(() => {
        const chat = $('debateChat');
        const lastMsg = chat ? chat.lastElementChild : null;
        if (lastMsg && lastMsg.querySelector('.msg-fallback')) {
            lastMsg.remove();
        }

        const aiResponse = generateAIResponse(text);
        const userScore = Math.floor(Math.random() * 30) + 65;
        const aiScore = Math.floor(Math.random() * 30) + 60;

        state.userScore += userScore;
        state.aiScore += aiScore;
        state.currentRound++;

        addMessage('ai', aiResponse, false, {
            userScore: userScore,
            aiScore: aiScore,
            feedback: getRandomFeedback(userScore)
        });

        updateScores();

        if (state.currentRound >= state.maxRounds) {
            if (sendBtn) sendBtn.disabled = true;
            input.disabled = true;
            setTimeout(() => endDebate(), 2000);
        } else {
            const roundEl = $('currentRound');
            if (roundEl) roundEl.textContent = state.currentRound + 1;
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            input.focus();
        }

        updateTips(userScore);
    }, 1500 + Math.random() * 1000);
}

function generateAIResponse(userText) {
    const topic = state.currentDebate;
    const responses = aiResponses[topic?.title] || aiResponses['default'];
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    if (Math.random() > 0.5) {
        response += " Furthermore, consider that " + getRandomCounter();
    }
    
    return response;
}

function getRandomCounter() {
    const counters = [
        "this perspective oversimplifies a complex issue.",
        "there are multiple factors at play here.",
        "correlation doesn't imply causation.",
        "we must consider the long-term implications.",
        "this assumes a static scenario when things are constantly evolving."
    ];
    return counters[Math.floor(Math.random() * counters.length)];
}

function getRandomFeedback(score) {
    if (score >= 85) {
        return ["🏆 Excellent argument!", "💪 Strong evidence provided", "🎯 Well-structured"];
    } else if (score >= 75) {
        return ["👍 Good reasoning", "📊 Consider more evidence", "💡 Strong structure"];
    } else {
        return ["📝 Could use more clarity", "🔍 Add supporting evidence", "🧠 Consider counter-arguments"];
    }
}

function addMessage(type, text, isThinking = false, meta = null) {
    const chat = $('debateChat');
    if (!chat) return;

    const startMsg = chat.querySelector('.debate-start-msg');
    if (startMsg) startMsg.remove();

    const div = document.createElement('div');
    div.className = `debate-message ${type}`;

    let html = `<div class="msg-bubble">${text}`;

    if (isThinking) {
        html += `<div class="msg-fallback">⏳ AI is crafting a counter-argument...</div>`;
    }

    html += `</div>`;

    if (meta && !isThinking) {
        html += `
            <div class="msg-meta">
                <span>Round ${state.currentRound}</span>
                <span class="msg-score">+${meta.userScore}</span>
                <span style="color: var(--text-secondary);">${meta.feedback[0]}</span>
            </div>
        `;
    }

    div.innerHTML = html;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function updateScores() {
    const total = state.userScore + state.aiScore;
    const userPercent = total > 0 ? (state.userScore / total) * 100 : 0;
    const aiPercent = total > 0 ? (state.aiScore / total) * 100 : 0;

    const userScoreEl = $('userScore');
    const aiScoreEl = $('aiScore');
    const userFill = document.querySelector('.user-score-fill');
    const aiFill = document.querySelector('.ai-score-fill');
    const iqFill = document.querySelector('.iq-fill');
    const iqValue = $('iqValue');

    if (userScoreEl) userScoreEl.textContent = Math.round(userPercent);
    if (aiScoreEl) aiScoreEl.textContent = Math.round(aiPercent);
    if (userFill) userFill.style.width = `${userPercent}%`;
    if (aiFill) aiFill.style.width = `${aiPercent}%`;

    const iq = Math.round(50 + (state.userScore - state.aiScore) * 0.5 + Math.random() * 10);
    state.iqScore = Math.max(0, Math.min(100, iq));
    if (iqFill) iqFill.style.width = `${state.iqScore}%`;
    if (iqValue) iqValue.textContent = state.iqScore;
}

function updateTips(score) {
    const tipsList = $('tipsList');
    if (!tipsList) return;
    
    let tips = [];
    if (score >= 85) {
        tips = ['🎯 Excellent reasoning!', '💪 Strong evidence usage', '🌟 Keep up the momentum'];
    } else if (score >= 75) {
        tips = ['📊 Add more statistics', '💡 Strengthen your opening', '🎯 Address counter-arguments'];
    } else {
        tips = ['📝 Improve structure', '🔍 Use concrete examples', '🧠 Consider the opponent\'s view'];
    }

    tipsList.innerHTML = tips.map(t => `<li>${t}</li>`).join('');
}

function endDebate() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }

    let result = '';
    let icon = '';
    let title = '';

    if (state.userScore > state.aiScore) {
        result = 'win';
        icon = '🏆';
        title = '🎉 You Won the Debate!';
        state.stats.wins++;
    } else if (state.aiScore > state.userScore) {
        result = 'loss';
        icon = '😅';
        title = 'AI Won This Round';
        state.stats.losses++;
    } else {
        result = 'draw';
        icon = '⚖️';
        title = 'It\'s a Draw!';
        state.stats.draws++;
    }

    state.stats.totalDebates++;

    const resultIcon = $('resultIcon');
    const resultTitle = $('resultTitle');
    const resultUserScore = $('resultUserScore');
    const resultAiScore = $('resultAiScore');
    const resultFeedback = $('resultFeedback');

    if (resultIcon) resultIcon.textContent = icon;
    if (resultTitle) resultTitle.textContent = title;
    if (resultUserScore) {
        resultUserScore.textContent = Math.round((state.userScore / (state.userScore + state.aiScore)) * 100);
    }
    if (resultAiScore) {
        resultAiScore.textContent = Math.round((state.aiScore / (state.userScore + state.aiScore)) * 100);
    }

    const feedback = generateFeedback(result);
    if (resultFeedback) {
        resultFeedback.innerHTML = feedback.map(f => `<p>${f}</p>`).join('');
    }

    const modal = $('resultModal');
    if (modal) modal.classList.add('show');

    saveDebateHistory(result);
}

function generateFeedback(result) {
    if (result === 'win') {
        return [
            '💪 Great job! You showed strong reasoning skills.',
            '📈 Your evidence usage was excellent.',
            '🎯 You effectively countered AI\'s arguments.',
            '🌟 Try even more diverse examples next time!'
        ];
    } else if (result === 'loss') {
        return [
            '📝 Good effort! The AI was tough today.',
            '🔍 Try using more statistical evidence.',
            '🧠 Consider strengthening your opening arguments.',
            '💪 Keep practicing - you\'ll get better!'
        ];
    } else {
        return [
            '⚖️ Well played! You matched the AI.',
            '🎯 Strong arguments from both sides.',
            '📊 Work on bringing more unique perspectives.',
            '💪 You\'re on the right track!'
        ];
    }
}

function closeResult() {
    const modal = $('resultModal');
    if (modal) modal.classList.remove('show');
    showPage('topics');
}

function getHint() {
    const hints = [
        '💡 Start with a strong thesis statement',
        '📊 Use data and statistics to support your claim',
        '🎯 Address potential counter-arguments early',
        '🧠 Use logical reasoning and examples',
        '📝 Structure: Claim → Evidence → Reasoning',
        '🎤 Speak confidently and clearly'
    ];
    alert(hints[Math.floor(Math.random() * hints.length)]);
}

function handleEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendArgument();
    }
}

function speakArgument() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser. Please type your argument.');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    const input = $('debateInput');
    if (!input) return;
    
    input.placeholder = '🎤 Listening...';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        input.placeholder = 'Type your argument here...';
        setTimeout(() => sendArgument(), 500);
    };

    recognition.onerror = () => {
        input.placeholder = 'Type your argument here...';
        alert('Could not recognize speech. Please type your argument.');
    };

    recognition.start();
}

// ============================================
// INITIALIZATION
// ============================================

// Make sure DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚖️ DebateMate initialized!');
    
    // Initial render
    renderTopics();
    updateUIAfterAuth();
    
    // Show home page by default
    showPage('home');
    
    console.log('💡 Click "Topics" to start debating!');
});

// Keyboard shortcut: Ctrl+Enter to send
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        if (state.currentPage === 'debate') {
            sendArgument();
        }
    }
});

// Handle Enter key in debate input
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.id === 'debateInput') {
            e.preventDefault();
            sendArgument();
        }
    }
});
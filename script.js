// ====== GLOBAL APP STATE ======
const appState = {
    currentUser: null,
    isLoggedIn: false,
    userProgress: JSON.parse(localStorage.getItem('ce_progress')) || {},
    currentFormulaCategory: 'all',
    currentFormulaIndex: 0,
    currentDifficulty: 'easy',
    currentProblemId: 1,
    streak: parseInt(localStorage.getItem('streak')) || 0,
    points: parseInt(localStorage.getItem('points')) || 0,
    level: 1,
    bookmarks: JSON.parse(localStorage.getItem('bookmarks')) || []
};

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    // Safe particles initialization
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#4361ee" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#4cc9f0",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }

    initApp();
    setupEventListeners();
    loadAnimations();
    updateStats();
    updateLeaderboard();
    updateBookmarkList();
});

// ====== INITIAL SETUP ======
function initApp() {
    // Safe localStorage retrieval
    try {
        const savedUser = localStorage.getItem('ce_user');
        if (savedUser) {
            appState.currentUser = JSON.parse(savedUser);
            appState.isLoggedIn = true;
        }
    } catch (e) { console.warn('LocalStorage not available'); }

    // Load initial formula set
    loadFormulas('all');
    
    // Load first problem
    loadProblem(1, 'easy');
    
    // Update UI based on login state
    updateUserDisplay();
    updateProgressBars();
    updateStatsDisplay();
}

// ====== GLOBAL EVENT LISTENERS ======
function setupEventListeners() {
    // ----- Authentication -----
    safeListener('loginBtn', 'click', showLoginModal);
    safeListener('guestLogin', 'click', loginAsGuest);
    safeListener('submitLogin', 'click', handleLogin);
    safeListener('showSignup', 'click', showSignupModal);
    safeListener('submitSignup', 'click', handleSignup);
    safeListener('closeModal', 'click', closeLoginModal);
    safeListener('closeSignup', 'click', closeSignupModal);

    // ----- Navigation & Smooth Scroll -----
    document.querySelectorAll('.nav-link, .btn-primary, .btn-secondary, a[href^="#"]').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // ----- Topic Explore Buttons -----
    document.querySelectorAll('.btn-explore').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const topic = this.dataset.topic;
            exploreTopic(topic);
        });
    });

    // ----- Formula Sidebar Categories -----
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', function() {
            const category = this.dataset.category;
            loadFormulas(category);
        });
    });

    // ----- Formula Navigation -----
    safeListener('prevFormula', 'click', prevFormula);
    safeListener('nextFormula', 'click', nextFormula);

    // ----- Bookmark Button -----
    safeListener('bookmarkBtn', 'click', toggleBookmark);

    // ----- Difficulty Selection -----
    document.querySelectorAll('.diff-card').forEach(card => {
        card.addEventListener('click', function() {
            selectDifficulty(this.dataset.level);
        });
    });

    // ----- Practice Arena Actions -----
    safeListener('submitAnswer', 'click', checkAnswer);
    safeListener('hintBtn', 'click', getHint);
    safeListener('skipBtn', 'click', skipProblem);
    safeListener('nextProblemBtn', 'click', nextProblem);

    // ----- Quick Answer in Hero -----
    safeListener('quickAnswerBtn', 'click', checkQuickAnswer);
    safeListener('quickAnswer', 'keypress', function(e) {
        if (e.key === 'Enter') checkQuickAnswer();
    });

    // ----- Leaderboard Tabs -----
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const boardType = this.dataset.board;
            switchLeaderboard(boardType);
        });
    });

    // ----- Admin Panel -----
    safeListener('adminBtn', 'click', showAdminPanel);

    // ----- Close Modals on Outside Click -----
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Helper to safely add event listener
function safeListener(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
}

// ====== AUTHENTICATION ======
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function showSignupModal(e) {
    e.preventDefault();
    closeLoginModal();
    document.getElementById('signupModal').style.display = 'flex';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

function loginAsGuest() {
    appState.currentUser = {
        name: 'Guest Student',
        email: 'guest@example.com',
        year: 'Reviewer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
    };
    appState.isLoggedIn = true;
    localStorage.setItem('ce_user', JSON.stringify(appState.currentUser));
    updateUserDisplay();
    closeLoginModal();
    showNotification('Welcome, Guest! Track your progress by creating an account.', 'info');
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    // Simulated login
    appState.currentUser = {
        name: email.split('@')[0],
        email: email,
        year: '4th Year',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    appState.isLoggedIn = true;
    localStorage.setItem('ce_user', JSON.stringify(appState.currentUser));
    updateUserDisplay();
    closeLoginModal();
    showNotification('Welcome back! Your progress has been loaded.', 'success');
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const year = document.getElementById('signupYear').value;
    if (!name || !email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    appState.currentUser = {
        name: name,
        email: email,
        year: year,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    appState.isLoggedIn = true;
    localStorage.setItem('ce_user', JSON.stringify(appState.currentUser));
    updateUserDisplay();
    closeSignupModal();
    showNotification('Account created successfully!', 'success');
}

// ====== USER INTERFACE UPDATES ======
function updateUserDisplay() {
    const userProfile = document.getElementById('userProfile');
    const loginBtn = document.getElementById('loginBtn');
    if (!userProfile || !loginBtn) return;

    if (appState.isLoggedIn && appState.currentUser) {
        userProfile.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        const usernameEl = document.querySelector('.username');
        const avatarEl = document.querySelector('.avatar');
        if (usernameEl) usernameEl.textContent = appState.currentUser.name.split(' ')[0];
        if (avatarEl) avatarEl.src = appState.currentUser.avatar;
        updateProgressRing();
    } else {
        userProfile.classList.add('hidden');
        loginBtn.classList.remove('hidden');
    }
}

function updateProgressRing() {
    const circle = document.querySelector('.progress-ring-circle');
    if (!circle) return;
    const totalProblems = 500;
    const solvedProblems = Object.values(appState.userProgress).reduce((sum, t) => sum + (t.solved || 0), 0);
    const progress = Math.min((solvedProblems / totalProblems) * 100, 100);
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
    const progressValue = document.querySelector('.progress-value');
    if (progressValue) progressValue.textContent = `${Math.round(progress)}%`;
}

function updateProgressBars() {
    document.querySelectorAll('.topic-card').forEach(card => {
        const topic = card.dataset.topic;
        const progress = appState.userProgress[topic] || { solved: 0, total: 100 };
        const percentage = (progress.solved / progress.total) * 100;
        const fill = card.querySelector('.progress-fill');
        const percentageText = card.querySelector('.progress-info span:last-child');
        if (fill) fill.style.width = `${percentage}%`;
        if (percentageText) percentageText.textContent = `${Math.round(percentage)}%`;
    });
}

// ====== FORMULA EXPLORER ======
function loadFormulas(category) {
    appState.currentFormulaCategory = category;
    appState.currentFormulaIndex = 0;

    // Update active category in sidebar
    document.querySelectorAll('.category').forEach(cat => {
        cat.classList.toggle('active', cat.dataset.category === category);
    });

    let formulas;
    if (category === 'all') {
        formulas = Object.values(formulasData).flat();
    } else {
        formulas = formulasData[category] || [];
    }

    if (formulas.length > 0) {
        displayFormula(formulas[0], 0, formulas.length);
    } else {
        // No formulas - show placeholder
        document.getElementById('currentFormulaTitle').textContent = 'No formulas found';
        document.getElementById('formulaText').textContent = '∅';
        document.getElementById('formulaDescription').textContent = 'No description available.';
        document.getElementById('formulaApplication').textContent = '';
        document.getElementById('variablesList').innerHTML = '<div class="variable">No variables defined</div>';
        document.querySelector('.formula-counter').textContent = '0/0';
    }
}

function displayFormula(formula, index, total) {
    document.getElementById('currentFormulaTitle').textContent = formula.title;
    document.getElementById('formulaText').textContent = formula.formula;
    document.getElementById('formulaDescription').textContent = formula.description;
    document.getElementById('formulaApplication').textContent = formula.application || formula.example;
    document.querySelector('.formula-counter').textContent = `${index + 1}/${total}`;
    
    // Variables
    const varsList = document.getElementById('variablesList');
    varsList.innerHTML = formula.variables?.length 
        ? formula.variables.map(v => `<div class="variable">${v}</div>`).join('')
        : '<div class="variable">No variables defined</div>';

    // Update bookmark icon
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        const isBookmarked = appState.bookmarks.some(b => b.id === formula.id);
        bookmarkBtn.innerHTML = isBookmarked 
            ? '<i class="fas fa-bookmark"></i>' 
            : '<i class="far fa-bookmark"></i>';
    }
}

function nextFormula() {
    const category = appState.currentFormulaCategory;
    const formulas = category === 'all' 
        ? Object.values(formulasData).flat() 
        : formulasData[category] || [];
    if (formulas.length === 0) return;
    appState.currentFormulaIndex = (appState.currentFormulaIndex + 1) % formulas.length;
    displayFormula(formulas[appState.currentFormulaIndex], appState.currentFormulaIndex, formulas.length);
}

function prevFormula() {
    const category = appState.currentFormulaCategory;
    const formulas = category === 'all' 
        ? Object.values(formulasData).flat() 
        : formulasData[category] || [];
    if (formulas.length === 0) return;
    appState.currentFormulaIndex = (appState.currentFormulaIndex - 1 + formulas.length) % formulas.length;
    displayFormula(formulas[appState.currentFormulaIndex], appState.currentFormulaIndex, formulas.length);
}

function toggleBookmark() {
    const category = appState.currentFormulaCategory;
    const formulas = category === 'all' 
        ? Object.values(formulasData).flat() 
        : formulasData[category] || [];
    if (formulas.length === 0) return;
    const formula = formulas[appState.currentFormulaIndex];
    const index = appState.bookmarks.findIndex(b => b.id === formula.id);
    
    if (index === -1) {
        appState.bookmarks.push({ id: formula.id, title: formula.title, category });
        showNotification('Formula bookmarked!', 'success');
    } else {
        appState.bookmarks.splice(index, 1);
        showNotification('Bookmark removed', 'info');
    }
    localStorage.setItem('bookmarks', JSON.stringify(appState.bookmarks));
    updateBookmarkList();
    // Update icon
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        bookmarkBtn.innerHTML = index === -1 
            ? '<i class="fas fa-bookmark"></i>' 
            : '<i class="far fa-bookmark"></i>';
    }
}

function updateBookmarkList() {
    const bookmarkList = document.querySelector('.bookmark-list');
    if (!bookmarkList) return;
    if (appState.bookmarks.length === 0) {
        bookmarkList.innerHTML = '<p style="color: rgba(255,255,255,0.5);">No bookmarks yet</p>';
        return;
    }
    bookmarkList.innerHTML = appState.bookmarks.map(b => `
        <div class="bookmark-item" data-id="${b.id}">
            <i class="fas fa-bookmark" style="color: var(--accent);"></i>
            <span>${b.title}</span>
        </div>
    `).join('');
}

function exploreTopic(topic) {
    document.getElementById('formulas').scrollIntoView({ behavior: 'smooth' });
    loadFormulas(topic);
}

// ====== PRACTICE ARENA ======
function loadProblem(problemId, difficulty) {
    const problem = problemsData[difficulty]?.find(p => p.id === problemId);
    if (!problem) return;

    appState.currentProblemId = problemId;
    appState.currentDifficulty = difficulty;

    document.getElementById('problemStatement').textContent = problem.question;
    
    const optionsContainer = document.getElementById('problemOptions');
    optionsContainer.innerHTML = problem.options.map((opt, idx) => `
        <div class="option" data-index="${idx}">
            <input type="radio" name="problem-answer" id="opt${idx}" value="${idx}">
            <label for="opt${idx}">${opt}</label>
        </div>
    `).join('');

    // Hide solution area
    document.querySelector('.solution-area').classList.add('hidden');
}

function selectDifficulty(level) {
    appState.currentDifficulty = level;
    document.querySelectorAll('.diff-card').forEach(card => {
        card.classList.toggle('active', card.dataset.level === level);
    });
    loadProblem(1, level);
}

function checkAnswer() {
    const selected = document.querySelector('input[name="problem-answer"]:checked');
    if (!selected) {
        showNotification('Please select an answer', 'warning');
        return;
    }
    const answerIndex = parseInt(selected.value);
    const problem = problemsData[appState.currentDifficulty]?.find(p => p.id === appState.currentProblemId);
    if (!problem) return;

    if (answerIndex === problem.answer) {
        // Correct!
        showNotification('✅ Correct! +' + problem.points + ' XP', 'success');
        appState.points += problem.points;
        localStorage.setItem('points', appState.points);
        updateStatsDisplay();
        
        // Update progress (simplified)
        const topicKey = mapTopicToKey(problem.topic);
        if (topicKey) {
            if (!appState.userProgress[topicKey]) appState.userProgress[topicKey] = { solved: 0, total: 100 };
            appState.userProgress[topicKey].solved++;
            localStorage.setItem('ce_progress', JSON.stringify(appState.userProgress));
            updateProgressBars();
            updateProgressRing();
        }

        // Show solution
        document.querySelector('.solution-area').classList.remove('hidden');
        document.getElementById('solutionContent').innerHTML = `
            <p><strong>Solution:</strong> ${problem.solution}</p>
            <p><strong>Explanation:</strong> ${problem.explanation}</p>
        `;
    } else {
        showNotification('❌ Incorrect. Try again!', 'error');
    }
}

function getHint() {
    if (appState.points >= 5) {
        appState.points -= 5;
        localStorage.setItem('points', appState.points);
        updateStatsDisplay();
        showNotification('Hint: Review the related formula!', 'info');
    } else {
        showNotification('Not enough XP! Solve more problems.', 'warning');
    }
}

function skipProblem() {
    // Load next problem in same difficulty
    const problems = problemsData[appState.currentDifficulty];
    const currentIndex = problems.findIndex(p => p.id === appState.currentProblemId);
    const nextIndex = (currentIndex + 1) % problems.length;
    loadProblem(problems[nextIndex].id, appState.currentDifficulty);
    showNotification('Problem skipped', 'info');
}

function nextProblem() {
    skipProblem(); // same behavior
}

function mapTopicToKey(topic) {
    const map = {
        'Mathematics': 'mathematics',
        'Surveying': 'surveying',
        'Transportation': 'transportation',
        'Construction': 'construction',
        'Health': 'health',
        'Environmental Health': 'health'
    };
    return map[topic] || null;
}

// ====== QUICK ANSWER (HERO) ======
function checkQuickAnswer() {
    const input = document.getElementById('quickAnswer');
    const answer = input.value.trim().toLowerCase();
    if (!answer) {
        showNotification('Please enter an answer', 'warning');
        return;
    }
    // Simplified check for derivative of 3x²+2x-5
    if (answer.includes('6x+2') || answer.includes('6x + 2')) {
        showNotification('✅ Correct! The derivative is 6x + 2', 'success');
        input.value = '';
        input.classList.add('success');
        setTimeout(() => input.classList.remove('success'), 1000);
        // Award small XP
        appState.points += 5;
        localStorage.setItem('points', appState.points);
        updateStatsDisplay();
    } else {
        showNotification('❌ Not quite right. Try again!', 'error');
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 1000);
    }
}

// ====== LEADERBOARD ======
function updateLeaderboard(boardType = 'weekly') {
    const data = leaderboardData[boardType] || leaderboardData.weekly;
    const listContainer = document.querySelector('.leaderboard-list');
    if (!listContainer) return;

    // Update active tab
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.board === boardType);
    });

    // Update top three podium
    updatePodium(data.slice(0, 3));

    // Build list (ranks 4+)
    let html = `
        <div class="leaderboard-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Problems Solved</span>
            <span>XP Points</span>
        </div>
    `;
    data.forEach((student, index) => {
        html += `
            <div class="leaderboard-row">
                <span class="rank">${index + 1}</span>
                <span class="student">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}" alt="${student.name}">
                    ${student.name}
                </span>
                <span class="solved">${student.solved}</span>
                <span class="xp">${student.xp} XP</span>
            </div>
        `;
    });
    listContainer.innerHTML = html;
}

function updatePodium(topThree) {
    const podiumNames = document.querySelectorAll('.podium h4');
    const podiumXP = document.querySelectorAll('.podium p');
    const podiumImgs = document.querySelectorAll('.podium img');
    if (topThree.length >= 3) {
        // 2nd place
        if (podiumNames[0]) podiumNames[0].textContent = topThree[1].name;
        if (podiumXP[0]) podiumXP[0].textContent = topThree[1].xp + ' XP';
        if (podiumImgs[0]) podiumImgs[0].src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].name}`;
        // 1st place
        if (podiumNames[1]) podiumNames[1].textContent = topThree[0].name;
        if (podiumXP[1]) podiumXP[1].textContent = topThree[0].xp + ' XP';
        if (podiumImgs[1]) podiumImgs[1].src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].name}`;
        // 3rd place
        if (podiumNames[2]) podiumNames[2].textContent = topThree[2].name;
        if (podiumXP[2]) podiumXP[2].textContent = topThree[2].xp + ' XP';
        if (podiumImgs[2]) podiumImgs[2].src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].name}`;
    }
}

function switchLeaderboard(boardType) {
    updateLeaderboard(boardType);
}

// ====== UTILITIES ======
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function loadAnimations() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        animateCounter(stat, 0, target, 2000);
    });
    document.querySelectorAll('.topic-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.1}s`;
    });
}

function updateStats() {
    const lastLogin = localStorage.getItem('last_login');
    const today = new Date().toDateString();
    if (lastLogin === today) {
        // already logged in
    } else if (lastLogin) {
        const last = new Date(lastLogin);
        const now = new Date();
        const diff = Math.ceil((now - last) / (1000 * 60 * 60 * 24));
        if (diff === 1) appState.streak++;
        else appState.streak = 1;
    } else {
        appState.streak = 1;
    }
    localStorage.setItem('last_login', today);
    localStorage.setItem('streak', appState.streak);
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const streakEl = document.getElementById('streakCount');
    const pointsEl = document.getElementById('pointsCount');
    const levelEl = document.getElementById('userLevel');
    if (streakEl) streakEl.textContent = appState.streak;
    if (pointsEl) pointsEl.textContent = appState.points;
    // Simple level calculation
    appState.level = Math.floor(appState.points / 500) + 1;
    if (levelEl) levelEl.textContent = appState.level;
}

function showAdminPanel() {
    showNotification('Admin panel is under development. Coming soon!', 'info');
}

// ====== CSS FOR NOTIFICATIONS (if not already in style.css) ======
(function injectNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                background: rgba(26, 26, 46, 0.95);
                border-left: 4px solid var(--primary);
                display: flex;
                align-items: center;
                gap: 10px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 3000;
                backdrop-filter: blur(10px);
                max-width: 300px;
                color: white;
            }
            .notification.show { transform: translateX(0); }
            .notification.success { border-color: var(--success); }
            .notification.error { border-color: var(--danger); }
            .notification.warning { border-color: var(--warning); }
            .notification.info { border-color: var(--primary); }
            .notification i { font-size: 1.2rem; }
            .notification.success i { color: var(--success); }
            .notification.error i { color: var(--danger); }
            .notification.warning i { color: var(--warning); }
            .notification.info i { color: var(--primary); }
            .success { border-color: var(--success) !important; }
            .error { border-color: var(--danger) !important; }
        `;
        document.head.appendChild(style);
    }
})();

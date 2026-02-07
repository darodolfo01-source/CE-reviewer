// Initialize Particles.js
document.addEventListener('DOMContentLoaded', function() {
    // Particles.js Background
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

    // Initialize the application
    initApp();
    setupEventListeners();
    loadAnimations();
    updateStats();
});

// Application State
const appState = {
    currentUser: null,
    isLoggedIn: false,
    userProgress: {},
    currentFormulaIndex: 0,
    currentProblem: 0,
    streak: 0,
    points: 0,
    level: 1
};

// Initialize App
function initApp() {
    // Check for saved user
    const savedUser = localStorage.getItem('ce_user');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        appState.isLoggedIn = true;
        updateUserDisplay();
    }
    
    // Load progress
    const savedProgress = localStorage.getItem('ce_progress');
    if (savedProgress) {
        appState.userProgress = JSON.parse(savedProgress);
        updateProgressBars();
    }
    
    // Initialize formulas display
    loadFormulas('all');
    
    // Initialize problems
    loadProblem(1, 'easy');
    
    // Update leaderboard
    updateLeaderboard();
}

// Setup Event Listeners
function setupEventListeners() {
    // Login/Logout
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('guestLogin').addEventListener('click', loginAsGuest);
    document.getElementById('submitLogin').addEventListener('click', handleLogin);
    document.getElementById('showSignup').addEventListener('click', showSignupModal);
    document.getElementById('submitSignup').addEventListener('click', handleSignup);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Topic explore buttons
    document.querySelectorAll('.btn-explore').forEach(btn => {
        btn.addEventListener('click', function() {
            const topic = this.dataset.topic;
            exploreTopic(topic);
        });
    });
    
    // Formula navigation
    document.getElementById('prevFormula').addEventListener('click', prevFormula);
    document.getElementById('nextFormula').addEventListener('click', nextFormula);
    
    // Practice arena
    document.querySelectorAll('.diff-card').forEach(card => {
        card.addEventListener('click', function() {
            selectDifficulty(this.dataset.level);
        });
    });
    
    // Quick answer check
    document.querySelector('.btn-check').addEventListener('click', checkQuickAnswer);
    
    // Admin panel
    document.getElementById('adminBtn').addEventListener('click', showAdminPanel);
    
    // Animate on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Load Animations
function loadAnimations() {
    // Animate stats counting
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        animateCounter(stat, 0, target, 2000);
    });
    
    // Add floating animation to cards
    document.querySelectorAll('.topic-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Update Statistics
function updateStats() {
    // Update streak
    const lastLogin = localStorage.getItem('last_login');
    const today = new Date().toDateString();
    
    if (lastLogin === today) {
        // Already logged in today
    } else if (lastLogin) {
        const lastLoginDate = new Date(lastLogin);
        const todayDate = new Date();
        const diffTime = Math.abs(todayDate - lastLoginDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            appState.streak++;
        } else {
            appState.streak = 1;
        }
    }
    
    localStorage.setItem('last_login', today);
    updateStatsDisplay();
}

// Login Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function loginAsGuest() {
    appState.currentUser = {
        name: 'Guest Student',
        email: 'guest@example.com',
        year: 'Reviewer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
    };
    appState.isLoggedIn = true;
    updateUserDisplay();
    document.getElementById('loginModal').style.display = 'none';
    
    showNotification('Welcome, Guest! Track your progress by creating an account.', 'info');
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login (in real app, this would be an API call)
    appState.currentUser = {
        name: 'John Doe',
        email: email,
        year: '4th Year',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    appState.isLoggedIn = true;
    localStorage.setItem('ce_user', JSON.stringify(appState.currentUser));
    
    updateUserDisplay();
    document.getElementById('loginModal').style.display = 'none';
    
    showNotification('Welcome back! Your progress has been loaded.', 'success');
}

// Update User Display
function updateUserDisplay() {
    const userProfile = document.getElementById('userProfile');
    const loginBtn = document.getElementById('loginBtn');
    
    if (appState.isLoggedIn && appState.currentUser) {
        userProfile.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        
        // Update user info
        document.querySelector('.username').textContent = appState.currentUser.name.split(' ')[0];
        document.querySelector('.avatar').src = appState.currentUser.avatar;
        
        // Update progress ring
        updateProgressRing();
    } else {
        userProfile.classList.add('hidden');
        loginBtn.classList.remove('hidden');
    }
}

// Update Progress Ring
function updateProgressRing() {
    const totalProblems = 500; // Total problems in system
    const solvedProblems = Object.values(appState.userProgress).reduce((sum, topic) => 
        sum + (topic.solved || 0), 0);
    
    const progress = (solvedProblems / totalProblems) * 100;
    const circle = document.querySelector('.progress-ring-circle');
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
    
    document.querySelector('.progress-value').textContent = `${Math.round(progress)}%`;
}

// Update Progress Bars
function updateProgressBars() {
    document.querySelectorAll('.topic-card').forEach(card => {
        const topic = card.dataset.topic;
        const progress = appState.userProgress[topic] || { solved: 0, total: 100 };
        const percentage = (progress.solved / progress.total) * 100;
        
        const fill = card.querySelector('.progress-fill');
        const percentageText = card.querySelector('.progress-info span:last-child');
        
        if (fill) {
            fill.style.width = `${percentage}%`;
            percentageText.textContent = `${Math.round(percentage)}%`;
        }
    });
}

// Load Formulas
function loadFormulas(category) {
    // This would load from formulasData in data.js
    console.log(`Loading formulas for category: ${category}`);
    
    // Update UI
    document.querySelectorAll('.category').forEach(cat => {
        cat.classList.remove('active');
        if (cat.dataset.category === category) {
            cat.classList.add('active');
        }
    });
}

// Explore Topic
function exploreTopic(topic) {
    // Smooth scroll to formulas section
    document.getElementById('formulas').scrollIntoView({ behavior: 'smooth' });
    
    // Load topic formulas
    loadFormulas(topic);
    
    // Update formula display
    const topicFormulas = formulasData[topic] || [];
    if (topicFormulas.length > 0) {
        displayFormula(topicFormulas[0], 0, topicFormulas.length);
    }
}

// Display Formula
function displayFormula(formula, index, total) {
    document.getElementById('currentFormulaTitle').textContent = formula.title;
    document.getElementById('formulaText').textContent = formula.formula;
    document.getElementById('formulaDescription').textContent = formula.description;
    document.getElementById('formulaApplication').textContent = formula.example;
    
    // Update counter
    document.querySelector('.formula-counter').textContent = `${index + 1}/${total}`;
    
    // Update variables list
    const variablesList = document.getElementById('variablesList');
    variablesList.innerHTML = formula.variables ? 
        formula.variables.map(v => `<div class="variable">${v}</div>`).join('') :
        '<div class="variable">No variables defined</div>';
}

// Next/Previous Formula
function nextFormula() {
    appState.currentFormulaIndex++;
    // Logic to get next formula
}

function prevFormula() {
    appState.currentFormulaIndex = Math.max(0, appState.currentFormulaIndex - 1);
    // Logic to get previous formula
}

// Load Problem
function loadProblem(problemId, difficulty) {
    const problem = problemsData[difficulty]?.find(p => p.id === problemId);
    if (!problem) return;
    
    document.getElementById('problemStatement').textContent = problem.question;
    
    const optionsContainer = document.getElementById('problemOptions');
    optionsContainer.innerHTML = problem.options.map((option, index) => `
        <div class="option" data-index="${index}">
            <input type="radio" name="problem-answer" id="option${index}">
            <label for="option${index}">${option}</label>
        </div>
    `).join('');
    
    // Store current problem info
    appState.currentProblem = {
        id: problemId,
        difficulty: difficulty,
        solution: problem.solution
    };
}

// Select Difficulty
function selectDifficulty(level) {
    document.querySelectorAll('.diff-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.level === level) {
            card.classList.add('active');
        }
    });
    
    // Load first problem of selected difficulty
    loadProblem(1, level);
}

// Check Quick Answer
function checkQuickAnswer() {
    const input = document.getElementById('quickAnswer');
    const answer = input.value.trim();
    
    if (!answer) {
        showNotification('Please enter an answer first!', 'warning');
        return;
    }
    
    // Simple validation (in real app, this would be more complex)
    if (answer.includes('6x')) {
        showNotification('✅ Correct! The derivative is 6x + 2', 'success');
        input.value = '';
        
        // Animate success
        input.classList.add('success');
        setTimeout(() => input.classList.remove('success'), 1000);
    } else {
        showNotification('❌ Not quite right. Try again!', 'error');
        
        // Animate error
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 1000);
    }
}

// Show Notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update Stats Display
function updateStatsDisplay() {
    document.getElementById('streakCount').textContent = appState.streak;
    document.getElementById('pointsCount').textContent = appState.points;
    document.getElementById('userLevel').textContent = appState.level;
}

// Update Leaderboard
function updateLeaderboard() {
    // This would fetch from server in real app
    const leaderboardData = [
        { name: "Juan Dela Cruz", solved: 245, xp: 5250 },
        { name: "Maria Santos", solved: 220, xp: 4850 },
        { name: "Carlos Reyes", solved: 210, xp: 4200 },
        { name: "Anna Lopez", solved: 195, xp: 3980 },
        { name: "James Wilson", solved: 180, xp: 3750 }
    ];
    
    const leaderboardList = document.querySelector('.leaderboard-list');
    leaderboardList.innerHTML = `
        <div class="leaderboard-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Problems Solved</span>
            <span>XP Points</span>
        </div>
    `;
    
    leaderboardData.forEach((student, index) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        row.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="student">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}" alt="${student.name}">
                ${student.name}
            </span>
            <span class="solved">${student.solved}</span>
            <span class="xp">${student.xp} XP</span>
        `;
        leaderboardList.appendChild(row);
    });
}

// Animate Counter
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Smooth Scroll
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Animate on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Show Admin Panel
function showAdminPanel() {
    // In real app, this would require authentication
    showNotification('Admin panel is under development. Coming soon!', 'info');
}

// CSS for Notifications (add to style.css)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-color: var(--success);
}

.notification.error {
    border-color: var(--danger);
}

.notification.warning {
    border-color: var(--warning);
}

.notification.info {
    border-color: var(--primary);
}
// === MODAL FUNCTIONS ===
function showSignupModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'flex';
}
// === MODAL FUNCTIONS ===
function showSignupModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'flex';
}
function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

// === NOTIFICATION STYLES ===
// Only add these styles once
if (!document.getElementById('notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
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
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification.success {
            border-color: var(--success);
        }
        .notification.error {
            border-color: var(--danger);
        }
        .notification.warning {
            border-color: var(--warning);
        }
        .notification.info {
            border-color: var(--primary);
        }
        .notification i {
            font-size: 1.2rem;
        }
        .notification.success i { color: var(--success); }
        .notification.error i { color: var(--danger); }
        .notification.warning i { color: var(--warning); }
        .notification.info i { color: var(--primary); }
    `;
    document.head.appendChild(notificationStyles);
}

// Fixed script.js with proper error handling
console.log('Website script loaded successfully!');

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

// Safe element getter with error prevention
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element #${id} not found in HTML`);
        // Create a dummy element if it doesn't exist
        const dummy = document.createElement('div');
        dummy.id = id;
        dummy.style.display = 'none';
        document.body.appendChild(dummy);
        return dummy;
    }
    return element;
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing website...');
    
    // Try to initialize particles
    try {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: "#4361ee" },
                    shape: { type: "circle" },
                    opacity: { value: 0.3, random: true },
                    size: { value: 2, random: true },
                    line_linked: {
                        enable: true,
                        distance: 100,
                        color: "#4cc9f0",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        random: true,
                        straight: false
                    }
                }
            });
            console.log('Particles.js initialized');
        }
    } catch (error) {
        console.log('Particles.js not available, continuing without background');
    }
    
    // Initialize the app
    initApp();
    updateStatsDisplay();
    
    // Animate counters
    animateCounters();
    
    console.log('Website initialization complete!');
});

// Initialize App - FIXED VERSION
function initApp() {
    console.log('Initializing app...');
    
    // Check for saved user
    try {
        const savedUser = localStorage.getItem('ce_user');
        if (savedUser) {
            appState.currentUser = JSON.parse(savedUser);
            appState.isLoggedIn = true;
            updateUserDisplay();
        }
    } catch (error) {
        console.log('No user data found');
    }
    
    // Load progress
    try {
        const savedProgress = localStorage.getItem('ce_progress');
        if (savedProgress) {
            appState.userProgress = JSON.parse(savedProgress);
            updateProgressBars();
        }
    } catch (error) {
        console.log('No progress data found');
    }
    
    // Initialize formulas display
    try {
        loadFormulas('all');
    } catch (error) {
        console.log('Error loading formulas:', error);
    }
    
    // Initialize problems - WITH ERROR HANDLING
    try {
        // Check if problemsData exists
        if (typeof problemsData !== 'undefined' && problemsData.easy && problemsData.easy.length > 0) {
            loadProblem(1, 'easy');
        } else {
            console.log('No problem data available yet');
            // Set a default problem
            const problemStatement = getElement('problemStatement');
            if (problemStatement) {
                problemStatement.textContent = "Solve for x: 2x + 5 = 15";
            }
        }
    } catch (error) {
        console.log('Error loading problems:', error);
    }
    
    // Update leaderboard
    try {
        updateLeaderboard();
    } catch (error) {
        console.log('Error updating leaderboard:', error);
    }
    
    console.log('App initialization complete');
}

// Load Problem - FIXED VERSION (won't crash)
function loadProblem(problemId, difficulty) {
    console.log(`Loading problem ${problemId} (${difficulty})`);
    
    try {
        // Check if problemsData exists
        if (typeof problemsData === 'undefined' || !problemsData[difficulty]) {
            console.log('Problem data not available');
            return;
        }
        
        const problem = problemsData[difficulty].find(p => p.id === problemId);
        if (!problem) {
            console.log(`Problem ${problemId} not found in ${difficulty}`);
            return;
        }
        
        // Safely update the problem statement
        const problemStatement = getElement('problemStatement');
        problemStatement.textContent = problem.question;
        console.log('Problem statement updated');
        
        // Safely update options
        const optionsContainer = getElement('problemOptions');
        if (optionsContainer && problem.options) {
            optionsContainer.innerHTML = problem.options.map((option, index) => `
                <div class="option" data-index="${index}">
                    <input type="radio" name="problem-answer" id="option${index}">
                    <label for="option${index}">${option}</label>
                </div>
            `).join('');
            console.log('Problem options updated');
        }
        
        // Store current problem info
        appState.currentProblem = {
            id: problemId,
            difficulty: difficulty,
            solution: problem.solution || 'Solution not available'
        };
        
    } catch (error) {
        console.error('Error in loadProblem:', error);
        // Don't crash - just show a friendly message
        const problemStatement = getElement('problemStatement');
        if (problemStatement) {
            problemStatement.textContent = "Welcome! Select a difficulty to start practicing.";
        }
    }
}

// Load Formulas - FIXED VERSION
function loadFormulas(category) {
    console.log(`Loading formulas for category: ${category}`);
    
    try {
        // Check if formulasData exists
        if (typeof formulasData === 'undefined') {
            console.log('Formulas data not loaded yet');
            return;
        }
        
        // Update active category UI
        document.querySelectorAll('.category').forEach(cat => {
            cat.classList.remove('active');
            if (cat.dataset.category === category) {
                cat.classList.add('active');
            }
        });
        
        // Display first formula if available
        if (category === 'all') {
            // Combine all formulas
            let allFormulas = [];
            Object.values(formulasData).forEach(categoryFormulas => {
                allFormulas = allFormulas.concat(categoryFormulas);
            });
            
            if (allFormulas.length > 0) {
                displayFormula(allFormulas[0], 0, allFormulas.length);
            }
        } else if (formulasData[category] && formulasData[category].length > 0) {
            displayFormula(formulasData[category][0], 0, formulasData[category].length);
        }
        
    } catch (error) {
        console.log('Error loading formulas:', error);
    }
}

// Display Formula - FIXED VERSION
function displayFormula(formula, index, total) {
    try {
        const titleEl = getElement('currentFormulaTitle');
        const formulaEl = getElement('formulaText');
        const descEl = getElement('formulaDescription');
        const appEl = getElement('formulaApplication');
        const varsEl = getElement('variablesList');
        
        if (titleEl) titleEl.textContent = formula.title || 'Formula Title';
        if (formulaEl) formulaEl.textContent = formula.formula || 'f(x) = formula';
        if (descEl) descEl.textContent = formula.description || 'Description not available';
        if (appEl) appEl.textContent = formula.application || formula.example || 'Application not specified';
        
        if (varsEl && formula.variables) {
            varsEl.innerHTML = formula.variables.map(v => 
                `<div class="variable">${v}</div>`
            ).join('');
        }
        
        // Update counter
        const counterEl = document.querySelector('.formula-counter');
        if (counterEl) {
            counterEl.textContent = `${index + 1}/${total}`;
        }
        
    } catch (error) {
        console.log('Error displaying formula:', error);
    }
}

// Animate counters on homepage
function animateCounters() {
    console.log('Animating counters...');
    
    const stats = [
        { element: document.querySelector('[data-count="150"]'), target: 150 },
        { element: document.querySelector('[data-count="500"]'), target: 500 },
        { element: document.querySelector('[data-count="250"]'), target: 250 }
    ];
    
    stats.forEach(stat => {
        if (stat.element) {
            let current = 0;
            const increment = stat.target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    stat.element.textContent = stat.target;
                    clearInterval(timer);
                } else {
                    stat.element.textContent = Math.floor(current);
                }
            }, 20);
        }
    });
}

// Update Stats Display
function updateStatsDisplay() {
    try {
        const streakEl = getElement('streakCount');
        const pointsEl = getElement('pointsCount');
        const levelEl = getElement('userLevel');
        
        if (streakEl) streakEl.textContent = appState.streak;
        if (pointsEl) pointsEl.textContent = appState.points;
        if (levelEl) levelEl.textContent = appState.level;
    } catch (error) {
        console.log('Error updating stats:', error);
    }
}

// Update Leaderboard
function updateLeaderboard() {
    console.log('Updating leaderboard...');
    
    try {
        // Check if leaderboardData exists
        if (typeof leaderboardData === 'undefined' || !leaderboardData.weekly) {
            console.log('Leaderboard data not available');
            return;
        }
        
        const leaderboardList = document.querySelector('.leaderboard-list');
        if (!leaderboardList) return;
        
        // Clear existing content
        leaderboardList.innerHTML = '';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'leaderboard-header';
        header.innerHTML = `
            <span>Rank</span>
            <span>Student</span>
            <span>Problems Solved</span>
            <span>XP Points</span>
        `;
        leaderboardList.appendChild(header);
        
        // Add rows
        leaderboardData.weekly.forEach((student, index) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="student">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}" 
                         alt="${student.name}" width="30" height="30">
                    ${student.name}
                </span>
                <span class="solved">${student.solved}</span>
                <span class="xp">${student.xp} XP</span>
            `;
            leaderboardList.appendChild(row);
        });
        
    } catch (error) {
        console.log('Error updating leaderboard:', error);
    }
}

// Update Progress Bars
function updateProgressBars() {
    try {
        document.querySelectorAll('.topic-card').forEach(card => {
            const topic = card.dataset.topic;
            const progress = appState.userProgress[topic] || { solved: 0, total: 100 };
            const percentage = Math.min((progress.solved / progress.total) * 100, 100);
            
            const fill = card.querySelector('.progress-fill');
            const percentageText = card.querySelector('.progress-info span:last-child');
            
            if (fill) fill.style.width = `${percentage}%`;
            if (percentageText) percentageText.textContent = `${Math.round(percentage)}%`;
        });
    } catch (error) {
        console.log('Error updating progress bars:', error);
    }
}

// Simple notification system
function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                             type === 'error' ? 'exclamation-circle' : 
                             type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    } catch (error) {
        console.log('Could not show notification:', error);
    }
}

// Update User Display
function updateUserDisplay() {
    try {
        const userProfile = document.getElementById('userProfile');
        const loginBtn = document.getElementById('loginBtn');
        
        if (appState.isLoggedIn && appState.currentUser) {
            if (userProfile) userProfile.classList.remove('hidden');
            if (loginBtn) loginBtn.classList.add('hidden');
            
            const usernameEl = document.querySelector('.username');
            const avatarEl = document.querySelector('.avatar');
            
            if (usernameEl) usernameEl.textContent = appState.currentUser.name.split(' ')[0];
            if (avatarEl) avatarEl.src = appState.currentUser.avatar;
        }
    } catch (error) {
        console.log('Error updating user display:', error);
    }
}

// Simple event listeners for buttons
document.addEventListener('DOMContentLoaded', function() {
    // Quick answer check
    const checkBtn = document.querySelector('.btn-check');
    if (checkBtn) {
        checkBtn.addEventListener('click', function() {
            const input = document.getElementById('quickAnswer');
            if (input && input.value.trim()) {
                showNotification('Answer submitted!', 'success');
                input.value = '';
            } else {
                showNotification('Please enter an answer first', 'warning');
            }
        });
    }
    
    // Difficulty selection
    document.querySelectorAll('.diff-card').forEach(card => {
        card.addEventListener('click', function() {
            const level = this.dataset.level;
            document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            loadProblem(1, level);
            showNotification(`Loaded ${level} problems`, 'info');
        });
    });
    
    // Topic exploration
    document.querySelectorAll('.btn-explore').forEach(btn => {
        btn.addEventListener('click', function() {
            const topic = this.dataset.topic;
            showNotification(`Exploring ${topic}...`, 'info');
            loadFormulas(topic);
        });
    });
    
    // Formula navigation
    const prevBtn = document.getElementById('prevFormula');
    const nextBtn = document.getElementById('nextFormula');
    
    if (prevBtn) prevBtn.addEventListener('click', () => showNotification('Previous formula', 'info'));
    if (nextBtn) nextBtn.addEventListener('click', () => showNotification('Next formula', 'info'));
    
    console.log('Event listeners attached');
});

// Make sure formulasData and problemsData exist even if data.js fails
if (typeof formulasData === 'undefined') {
    console.log('Creating empty formulasData');
    var formulasData = {};
}

if (typeof problemsData === 'undefined') {
    console.log('Creating empty problemsData');
    var problemsData = { easy: [], medium: [], hard: [] };
}

if (typeof leaderboardData === 'undefined') {
    console.log('Creating empty leaderboardData');
    var leaderboardData = { weekly: [] };
}

console.log('Website script loaded successfully! All systems ready.');

// Enhanced Formulas Database with more data
const formulasData = {
    math: [
        {
            id: 1,
            title: "Quadratic Formula",
            formula: "x = [-b ± √(b² - 4ac)] / 2a",
            description: "For solving quadratic equations ax² + bx + c = 0",
            example: "Example: Solve 2x² + 4x - 6 = 0",
            variables: ["a: coefficient of x²", "b: coefficient of x", "c: constant term"],
            application: "Used in structural analysis, trajectory calculations",
            difficulty: "easy"
        },
        {
            id: 2,
            title: "Derivative Power Rule",
            formula: "d/dx[xⁿ] = n·xⁿ⁻¹",
            description: "Basic rule for differentiation of polynomial functions",
            example: "d/dx[x³] = 3x²",
            variables: ["n: exponent", "x: variable"],
            application: "Used in optimization problems, rate of change calculations",
            difficulty: "easy"
        },
        {
            id: 3,
            title: "Integration by Parts",
            formula: "∫u dv = uv - ∫v du",
            description: "Integration technique for product of two functions",
            example: "∫x·eˣ dx = x·eˣ - eˣ + C",
            variables: ["u: first function", "v: second function"],
            application: "Used in moment calculations, probability distributions",
            difficulty: "medium"
        },
        {
            id: 4,
            title: "Matrix Determinant (3×3)",
            formula: "det(A) = a(ei - fh) - b(di - fg) + c(dh - eg)",
            description: "Determinant calculation for 3×3 matrices",
            example: "For structural analysis in indeterminate beams",
            variables: ["a-i: matrix elements"],
            application: "Structural analysis, coordinate transformations",
            difficulty: "hard"
        }
    ],
    survey: [
        {
            id: 5,
            title: "Horizontal Distance (Slope)",
            formula: "H = L × cos(θ)",
            description: "L = slope distance, θ = vertical angle",
            example: "If L=100m, θ=30°, then H=86.6m",
            variables: ["L: slope distance", "θ: vertical angle"],
            application: "Field measurements, topographic surveys",
            difficulty: "easy"
        },
        {
            id: 6,
            title: "Area by DMD Method",
            formula: "A = ½|Σ(DMD × latitude)|",
            description: "Double Meridian Distance method for traverse areas",
            example: "For closed traverse area calculation",
            variables: ["DMD: Double Meridian Distance", "latitude: latitude of course"],
            application: "Land area computation, property surveying",
            difficulty: "medium"
        },
        {
            id: 7,
            title: "Curvature Correction",
            formula: "Cc = (L³) / (24R²)",
            description: "Correction for earth's curvature in leveling",
            example: "For precise leveling over long distances",
            variables: ["L: sight distance", "R: earth's radius (6371 km)"],
            application: "Precise leveling, geodetic surveys",
            difficulty: "hard"
        }
    ],
    transpo: [
        {
            id: 8,
            title: "Stopping Sight Distance",
            formula: "SSD = 0.278Vt + V²/254(f ± G)",
            description: "Minimum distance required to stop safely",
            example: "Critical for highway design and safety",
            variables: ["V: design speed (km/h)", "t: reaction time (s)", "f: friction coefficient", "G: grade (%)"],
            application: "Highway geometric design, safety analysis",
            difficulty: "medium"
        },
        {
            id: 9,
            title: "Traffic Flow Rate",
            formula: "q = (3600 × N) / T",
            description: "Number of vehicles passing a point per hour",
            example: "For traffic volume studies",
            variables: ["N: number of vehicles", "T: time period (seconds)"],
            application: "Traffic engineering, capacity analysis",
            difficulty: "easy"
        },
        {
            id: 10,
            title: "Pavement Design (AASHTO)",
            formula: "log₁₀W₁₈ = ZᵣS₀ + 9.36log₁₀(SN+1) - 0.20 + log₁₀[ΔPSI/(4.2-1.5)] / [0.4+1094/(SN+1)⁵·¹⁹]",
            description: "AASHTO flexible pavement design equation",
            example: "For highway pavement thickness design",
            variables: ["W₁₈: ESALs", "Zᵣ: reliability", "S₀: standard deviation", "SN: structural number", "ΔPSI: serviceability loss"],
            application: "Pavement design and rehabilitation",
            difficulty: "hard"
        }
    ],
    construction: [
        {
            id: 11,
            title: "Concrete Volume",
            formula: "V = L × W × H",
            description: "Volume calculation for rectangular concrete sections",
            example: "Slab: 10m × 5m × 0.15m = 7.5m³",
            variables: ["L: length", "W: width", "H: height/thickness"],
            application: "Material quantity estimation, cost estimation",
            difficulty: "easy"
        },
        {
            id: 12,
            title: "Steel Weight Calculation",
            formula: "Weight = (D²/162) × L",
            description: "Weight of steel reinforcement bars",
            example: "16mm bar, 12m long = (256/162)×12 = 18.96kg",
            variables: ["D: diameter (mm)", "L: length (m)"],
            application: "Reinforcement estimation, material procurement",
            difficulty: "easy"
        },
        {
            id: 13,
            title: "Critical Path Method (CPM)",
            formula: "EF = ES + D",
            description: "Earliest Finish = Earliest Start + Duration",
            example: "For project scheduling and management",
            variables: ["ES: earliest start", "D: duration", "EF: earliest finish"],
            application: "Project planning, schedule optimization",
            difficulty: "medium"
        }
    ],
    health: [
        {
            id: 14,
            title: "Chlorine Demand",
            formula: "CD = Dose - Residual",
            description: "Amount of chlorine consumed in water treatment",
            example: "Essential for proper disinfection",
            variables: ["Dose: chlorine applied", "Residual: chlorine remaining"],
            application: "Water treatment plant design and operation",
            difficulty: "easy"
        },
        {
            id: 15,
            title: "Population Forecast (Geometric)",
            formula: "P = P₀(1 + r)ⁿ",
            description: "Geometric increase method for population projection",
            example: "For water supply system design capacity",
            variables: ["P₀: initial population", "r: growth rate", "n: number of years"],
            application: "Infrastructure planning, utility design",
            difficulty: "medium"
        },
        {
            id: 16,
            title: "BOD Removal Efficiency",
            formula: "E = [(BODᵢ - BODₒ)/BODᵢ] × 100%",
            description: "Biological Oxygen Demand removal efficiency",
            example: "For wastewater treatment plant design",
            variables: ["BODᵢ: influent BOD", "BODₒ: effluent BOD"],
            application: "Wastewater treatment design, environmental compliance",
            difficulty: "medium"
        }
    ]
};

// Enhanced Problems Database
const problemsData = {
    easy: [
        {
            id: 1,
            topic: "Mathematics",
            question: "Solve for x: 3x - 7 = 14",
            options: ["x = 7", "x = 6", "x = 8", "x = 9"],
            answer: 0,
            solution: "3x - 7 = 14 → 3x = 21 → x = 7",
            explanation: "Add 7 to both sides, then divide by 3.",
            time_limit: 60,
            points: 10
        },
        {
            id: 2,
            topic: "Surveying",
            question: "Convert 3.75 kilometers to meters",
            options: ["37.5 m", "375 m", "3,750 m", "37,500 m"],
            answer: 2,
            solution: "1 km = 1000 m → 3.75 km = 3.75 × 1000 = 3,750 m",
            explanation: "Multiply kilometers by 1000 to convert to meters.",
            time_limit: 45,
            points: 10
        },
        {
            id: 3,
            topic: "Construction",
            question: "Calculate the volume of concrete for a footing 2m × 2m × 0.5m",
            options: ["2 m³", "3 m³", "4 m³", "5 m³"],
            answer: 0,
            solution: "V = L × W × H = 2 × 2 × 0.5 = 2 m³",
            explanation: "Multiply all dimensions to get volume.",
            time_limit: 60,
            points: 10
        }
    ],
    medium: [
        {
            id: 4,
            topic: "Transportation",
            question: "A vehicle moving at 80 km/h takes 2.5 seconds to react. What is the reaction distance?",
            options: ["27.8 m", "55.6 m", "83.3 m", "111.1 m"],
            answer: 1,
            solution: "Distance = 0.278 × V × t = 0.278 × 80 × 2.5 = 55.6 m",
            explanation: "Use the reaction distance formula with given values.",
            time_limit: 90,
            points: 25
        },
        {
            id: 5,
            topic: "Mathematics",
            question: "Find the derivative of f(x) = 4x³ - 3x² + 2x - 1",
            options: ["12x² - 6x + 2", "12x² - 6x", "4x² - 3x + 2", "12x³ - 6x² + 2"],
            answer: 0,
            solution: "f'(x) = 12x² - 6x + 2",
            explanation: "Apply power rule to each term: d/dx[xⁿ] = n·xⁿ⁻¹",
            time_limit: 120,
            points: 25
        },
        {
            id: 6,
            topic: "Health",
            question: "A water sample has initial BOD of 200 mg/L and final BOD of 20 mg/L. What is the removal efficiency?",
            options: ["80%", "85%", "90%", "95%"],
            answer: 2,
            solution: "E = [(200 - 20)/200] × 100% = 90%",
            explanation: "Apply BOD removal efficiency formula.",
            time_limit: 90,
            points: 25
        }
    ],
    hard: [
        {
            id: 7,
            topic: "Surveying",
            question: "A 50m tape is 0.03m too long. What is the correction for a measured distance of 325.75m?",
            options: ["+0.1955 m", "-0.1955 m", "+0.0977 m", "-0.0977 m"],
            answer: 0,
            solution: "Correction = (0.03/50) × 325.75 = +0.1955 m",
            explanation: "Apply tape correction formula: Correction = (error/tape length) × measured distance",
            time_limit: 180,
            points: 50
        },
        {
            id: 8,
            topic: "Transportation",
            question: "Calculate the stopping sight distance for a vehicle at 100 km/h on a 3% downgrade with friction coefficient 0.35 and reaction time 2.5s",
            options: ["185.6 m", "212.8 m", "245.3 m", "278.9 m"],
            answer: 1,
            solution: "SSD = 0.278×100×2.5 + 100²/(254×(0.35-0.03)) = 69.5 + 143.3 = 212.8 m",
            explanation: "Apply SSD formula with proper sign for grade (negative for downgrade).",
            time_limit: 240,
            points: 50
        },
        {
            id: 9,
            topic: "Construction",
            question: "A rectangular beam 300mm × 600mm is reinforced with 4-25mm diameter bars. If f'c=28 MPa and fy=415 MPa, calculate the design moment capacity (Mn). Use simplified method.",
            options: ["450 kN-m", "520 kN-m", "580 kN-m", "620 kN-m"],
            answer: 1,
            solution: "As = 4×(π×25²/4) = 1963.5 mm², a = (As×fy)/(0.85×f'c×b) = 114.5 mm, Mn = As×fy×(d-a/2) = 520 kN-m",
            explanation: "Calculate steel area, concrete compression block depth, then moment capacity.",
            time_limit: 300,
            points: 50
        }
    ]
};

// Leaderboard Data
const leaderboardData = {
    weekly: [
        { name: "Juan Dela Cruz", solved: 45, xp: 1250, streak: 7 },
        { name: "Maria Santos", solved: 38, xp: 1050, streak: 5 },
        { name: "Carlos Reyes", solved: 32, xp: 950, streak: 3 },
        { name: "Anna Lopez", solved: 28, xp: 850, streak: 4 },
        { name: "James Wilson", solved: 25, xp: 750, streak: 2 }
    ],
    monthly: [
        { name: "Juan Dela Cruz", solved: 180, xp: 4250, streak: 21 },
        { name: "Maria Santos", solved: 165, xp: 3850, streak: 18 },
        { name: "Anna Lopez", solved: 150, xp: 3550, streak: 15 },
        { name: "Carlos Reyes", solved: 140, xp: 3250, streak: 12 },
        { name: "Michael Chen", solved: 125, xp: 2950, streak: 10 }
    ],
    alltime: [
        { name: "Juan Dela Cruz", solved: 520, xp: 12500, streak: 30 },
        { name: "Maria Santos", solved: 485, xp: 11250, streak: 28 },
        { name: "Anna Lopez", solved: 420, xp: 9850, streak: 25 },
        { name: "Carlos Reyes", solved: 395, xp: 9250, streak: 22 },
        { name: "James Wilson", solved: 350, xp: 8250, streak: 20 }
    ]
};

// Achievements Data
const achievementsData = [
    {
        id: 1,
        name: "First Steps",
        description: "Solve your first problem",
        icon: "fas fa-baby",
        points: 100,
        unlocked: false
    },
    {
        id: 2,
        name: "Quick Learner",
        description: "Solve 10 problems in one day",
        icon: "fas fa-bolt",
        points: 250,
        unlocked: false
    },
    {
        id: 3,
        name: "Formula Master",
        description: "Bookmark 25 formulas",
        icon: "fas fa-brain",
        points: 500,
        unlocked: false
    },
    {
        id: 4,
        name: "Streak Champion",
        description: "Maintain a 7-day streak",
        icon: "fas fa-fire",
        points: 750,
        unlocked: false
    },
    {
        id: 5,
        name: "Top of the Class",
        description: "Reach #1 on the leaderboard",
        icon: "fas fa-crown",
        points: 1000,
        unlocked: false
    }
];

// Comments Database
let commentsData = [
    {
        id: 1,
        author: "Juan Dela Cruz",
        topic: "Mathematics",
        question: "How to solve for the curvature of a parabolic curve?",
        reply: "Instructor: Use the formula: curvature = |y''| / (1 + y'²)^(3/2). For y = ax² + bx + c, curvature = |2a| / (1 + (2ax + b)²)^(3/2)",
        timestamp: "2024-01-15 14:30",
        likes: 12,
        solved: true
    },
    {
        id: 2,
        author: "Maria Santos",
        topic: "Surveying",
        question: "What is the difference between bearing and azimuth?",
        reply: "Instructor: Bearing is acute angle (0-90°) measured from N/S to E/W. Azimuth is clockwise angle (0-360°) from North. Example: N30°E = bearing, 30° = azimuth.",
        timestamp: "2024-01-14 10:15",
        likes: 8,
        solved: true
    },
    {
        id: 3,
        author: "Carlos Reyes",
        topic: "Transportation",
        question: "How to calculate superelevation for a horizontal curve?",
        reply: "",
        timestamp: "2024-01-16 09:45",
        likes: 5,
        solved: false
    }
];

// User Progress Template
const userProgressTemplate = {
    mathematics: { solved: 0, total: 120, last_score: 0, best_score: 0 },
    surveying: { solved: 0, total: 95, last_score: 0, best_score: 0 },
    transportation: { solved: 0, total: 110, last_score: 0, best_score: 0 },
    construction: { solved: 0, total: 85, last_score: 0, best_score: 0 },
    health: { solved: 0, total: 90, last_score: 0, best_score: 0 }
};
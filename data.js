// formulasData - Contains all formulas for the website
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
        }
    ],
    survey: [
        {
            id: 3,
            title: "Horizontal Distance (Slope)",
            formula: "H = L × cos(θ)",
            description: "L = slope distance, θ = vertical angle",
            example: "If L=100m, θ=30°, then H=86.6m",
            variables: ["L: slope distance", "θ: vertical angle"],
            application: "Field measurements, topographic surveys",
            difficulty: "easy"
        }
    ],
    transpo: [
        {
            id: 4,
            title: "Stopping Sight Distance",
            formula: "SSD = 0.278Vt + V²/254(f ± G)",
            description: "Minimum distance required to stop safely",
            example: "Critical for highway design and safety",
            variables: ["V: design speed (km/h)", "t: reaction time (s)", "f: friction coefficient", "G: grade (%)"],
            application: "Highway geometric design, safety analysis",
            difficulty: "medium"
        }
    ],
    construction: [
        {
            id: 5,
            title: "Concrete Volume",
            formula: "V = L × W × H",
            description: "Volume calculation for rectangular concrete sections",
            example: "Slab: 10m × 5m × 0.15m = 7.5m³",
            variables: ["L: length", "W: width", "H: height/thickness"],
            application: "Material quantity estimation, cost estimation",
            difficulty: "easy"
        }
    ],
    health: [
        {
            id: 6,
            title: "Chlorine Demand",
            formula: "CD = Dose - Residual",
            description: "Amount of chlorine consumed in water treatment",
            example: "Essential for proper disinfection",
            variables: ["Dose: chlorine applied", "Residual: chlorine remaining"],
            application: "Water treatment plant design and operation",
            difficulty: "easy"
        }
    ]
};

// problemsData - Contains all practice problems
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
            points: 10
        },
        {
            id: 2,
            topic: "Construction",
            question: "Calculate the volume of concrete for a footing 2m × 2m × 0.5m",
            options: ["2 m³", "3 m³", "4 m³", "5 m³"],
            answer: 0,
            solution: "V = L × W × H = 2 × 2 × 0.5 = 2 m³",
            explanation: "Multiply all dimensions to get volume.",
            points: 10
        }
    ],
    medium: [
        {
            id: 3,
            topic: "Transportation",
            question: "A vehicle moving at 80 km/h takes 2.5 seconds to react. What is the reaction distance?",
            options: ["27.8 m", "55.6 m", "83.3 m", "111.1 m"],
            answer: 1,
            solution: "Distance = 0.278 × V × t = 0.278 × 80 × 2.5 = 55.6 m",
            explanation: "Use the reaction distance formula with given values.",
            points: 25
        }
    ],
    hard: [
        {
            id: 4,
            topic: "Surveying",
            question: "A 50m tape is 0.03m too long. What is the correction for a measured distance of 325.75m?",
            options: ["+0.1955 m", "-0.1955 m", "+0.0977 m", "-0.0977 m"],
            answer: 0,
            solution: "Correction = (0.03/50) × 325.75 = +0.1955 m",
            explanation: "Apply tape correction formula.",
            points: 50
        }
    ]
};

// leaderboardData - For the leaderboard section
const leaderboardData = {
    weekly: [
        { name: "Juan Dela Cruz", solved: 245, xp: 5250 },
        { name: "Maria Santos", solved: 220, xp: 4850 },
        { name: "Carlos Reyes", solved: 210, xp: 4200 },
        { name: "Anna Lopez", solved: 195, xp: 3980 },
        { name: "James Wilson", solved: 180, xp: 3750 }
    ]
};

// Initial user progress
const userProgressTemplate = {
    mathematics: { solved: 0, total: 120 },
    surveying: { solved: 0, total: 95 },
    transportation: { solved: 0, total: 110 },
    construction: { solved: 0, total: 85 },
    health: { solved: 0, total: 90 }
};

// Initial comments data
let commentsData = [
    {
        id: 1,
        author: "Juan Dela Cruz",
        topic: "Mathematics",
        question: "How to solve for the curvature of a parabolic curve?",
        reply: "Instructor: Use the formula: curvature = |y''| / (1 + y'²)^(3/2)",
        timestamp: "2024-01-15"
    }
];

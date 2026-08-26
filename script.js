const starDB = {
    "sun": { t: 5778, m: 1.0, r: 1.0, l: 1.0, mv: 4.83, state: "MAIN SEQUENCE" },
    "sirius": { t: 9940, m: 2.06, r: 1.71, l: 25.4, mv: 1.42, state: "BINARY SYSTEM" },
    "vega": { t: 9602, m: 2.135, r: 2.36, l: 40.12, mv: 0.58, state: "MAIN SEQUENCE" },
    "altair": { t: 7550, m: 1.79, r: 1.63, l: 10.6, mv: 2.22, state: "MAIN SEQUENCE" },
    "capella": { t: 4970, m: 2.57, r: 11.98, l: 78.7, mv: -0.48, state: "YELLOW GIANT" },
    "rigel": { t: 12100, m: 21.0, r: 78.9, l: 120000, mv: -7.84, state: "BLUE SUPERGIANT" },
    "betelgeuse": { t: 3500, m: 16.5, r: 764.0, l: 126000, mv: -5.85, state: "RED SUPERGIANT" },
    "deneb": { t: 8525, m: 19.0, r: 203.0, l: 196000, mv: -8.38, state: "BLUE SUPERGIANT" },
    "canopus": { t: 7400, m: 8.0, r: 71.0, l: 10700, mv: -5.71, state: "BRIGHT GIANT" },
    "achernar": { t: 15000, m: 6.7, r: 9.3, l: 3150, mv: -2.77, state: "MAIN SEQUENCE" },
    "hadar": { t: 25000, m: 12.0, r: 8.6, l: 41700, mv: -4.53, state: "BLUE GIANT" },
    "acrux": { t: 28000, m: 17.8, r: 5.4, l: 25000, mv: -3.77, state: "BLUE SUBGIANT" },
    "spica": { t: 25300, m: 11.43, r: 7.47, l: 20500, mv: -3.55, state: "BLUE GIANT" },
    "antares": { t: 3660, m: 12.0, r: 680.0, l: 75000, mv: -5.28, state: "RED SUPERGIANT" },
    "pollux": { t: 4666, m: 1.91, r: 8.8, l: 32.7, mv: 1.08, state: "RED GIANT" },
    "fomalhaut": { t: 8590, m: 1.92, r: 1.84, l: 16.6, mv: 1.72, state: "MAIN SEQUENCE" },
    "aldebaran": { t: 3900, m: 1.16, r: 44.1, l: 439.0, mv: -0.63, state: "RED GIANT" },
    "brown dwarf": { t: 1500, m: 0.05, r: 0.1, l: 0.0001, mv: 18.0, state: "BROWN DWARF" },
    "nebula": { t: 50, m: 5.0, r: 25.0, l: 0.01, mv: 12.0, state: "NEBULA" }
};

const galaxyDB = {
    "milky way": { type: "BARRED", name: "Milky Way", diameter: 105700, appMag: "-20.5 (Integrated)" },
    "andromeda": { type: "SPIRAL", name: "Andromeda (M31)", diameter: 220000, appMag: "+3.44" },
    "m31": { type: "SPIRAL", name: "Andromeda (M31)", diameter: 220000, appMag: "+3.44" },
    "triangulum": { type: "SPIRAL", name: "Triangulum (M33)", diameter: 60000, appMag: "+5.72" },
    "m87": { type: "ELLIPTICAL", name: "Virgo A (M87)", diameter: 120000, appMag: "+8.6" },
    "smc": { type: "IRREGULAR", name: "Small Magellanic Cloud", diameter: 7000, appMag: "+2.7" },
    "lmc": { type: "IRREGULAR", name: "Large Magellanic Cloud", diameter: 14000, appMag: "+0.9" }
};

const galaxyTypes = ["SPIRAL", "BARRED", "ELLIPTICAL", "LENTICULAR", "IRREGULAR"];

let currentStar = { ...starDB.sun, age: 0 };
let hrPoint = null;
let currentSpaceMode = "LAB"; // "LAB" or "ALTERNATE"
let autoEvolve = false;
let autoEvolveInterval = null;

function switchToLabView() {
    if (currentSpaceMode !== "LAB") {
        currentSpaceMode = "LAB";
        document.getElementById('alternate-space-view').classList.add('hidden-space');
        document.getElementById('stellar-lab-view').classList.remove('hidden-space');
        const switchBtn = document.getElementById('btn-switch-space');
        switchBtn.innerText = "SWITCH SPACE";
        switchBtn.style.background = "#16a085";
    }
}

function switchToGalaxyView() {
    if (currentSpaceMode !== "ALTERNATE") {
        currentSpaceMode = "ALTERNATE";
        document.getElementById('stellar-lab-view').classList.add('hidden-space');
        document.getElementById('alternate-space-view').classList.remove('hidden-space');
        const switchBtn = document.getElementById('btn-switch-space');
        switchBtn.innerText = "RETURN TO LAB";
        switchBtn.style.background = "#e74c3c";
    }
}

function getSpectralClass(t, state) {
    if (state === "NEBULA") return "N";
    if (state.includes("BLACK HOLE") || state.includes("NEUTRON")) return "X";
    if (t >= 30000) return "O"; if (t >= 10000) return "B"; if (t >= 7500) return "A";
    if (t >= 6000) return "F"; if (t >= 5200) return "G"; if (t >= 3700) return "K";
    return "M";
}

function getStarColor(t, state) {
    if (state === "NEBULA") return "#8e44ad";
    if (state === "BROWN DWARF") return "#5e1a1a";
    if (state.includes("BLACK HOLE")) return "#000000";
    if (state.includes("NEUTRON")) return "#a6e3e9";
    if (state.includes("WHITE DWARF")) return "#e0f7fa";
    if (t > 30000) return "#9bb0ff"; if (t > 10000) return "#cad7ff";
    if (t > 6000) return "#f8f7ff"; if (t > 5000) return "#fff4a6";
    return "#ff5e41";
}

function calculateAbsoluteMagnitude(l) {
    return 4.83 - (2.5 * Math.log10(Math.max(l, 0.00001)));
}

function updateHRDiagram(s) {
    const xDot = 45 + ((6.0 - Math.log10(s.t || 1)) / (6.0 - 3.4)) * 335;
    const yDot = 400 - ((Math.log10(s.l || 0.0001) - (-5)) / (7 - (-5))) * 380;
    if (!hrPoint) {
        hrPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hrPoint.setAttribute("r", 5);
        hrPoint.setAttribute("stroke", "white");
        hrPoint.setAttribute("stroke-width", "2");
        document.getElementById('star-points').appendChild(hrPoint);
    }
    hrPoint.setAttribute("cx", Math.max(45, Math.min(380, xDot)));
    hrPoint.setAttribute("cy", Math.max(20, Math.min(400, yDot)));
    hrPoint.setAttribute("fill", getStarColor(s.t, s.state));
}

function updateVisuals() {
    const s = currentStar;
    const render = document.getElementById('star-render');

    if (s.l === undefined) s.l = Math.pow(s.r, 2) * Math.pow(s.t / 5778, 4);
    if (s.mv === undefined) s.mv = calculateAbsoluteMagnitude(s.l);

    if (s.mv <= 1.00 && s.state !== "NEBULA" && !s.state.includes("BLACK HOLE")) {
        render.classList.add('has-cross');
    } else {
        render.classList.remove('has-cross');
    }

    document.getElementById('type-val').innerText = s.state;
    document.getElementById('cat-val').innerText = getSpectralClass(s.t, s.state);
    document.getElementById('m-val').innerText = s.m.toFixed(2);
    document.getElementById('r-val').innerText = s.r.toFixed(2);
    document.getElementById('t-val').innerText = Math.round(s.t).toLocaleString();
    document.getElementById('mv-val').innerText = s.mv.toFixed(2);

    if (s.state === "NEBULA") render.classList.add('nebula-style');
    else render.classList.remove('nebula-style');

    if (s.state === "BROWN DWARF") render.classList.add('is-brown-dwarf');
    else render.classList.remove('is-brown-dwarf');

    const color = getStarColor(s.t, s.state);
    render.style.backgroundColor = color;
    render.style.boxShadow = s.state === "NEBULA" ? "none" : (s.state.includes("BLACK HOLE") ? "0 0 25px #ffffff" : `0 0 60px ${color}`);

    let visualSize = s.r * 15;
    if (s.state.includes("GIANT") || s.state.includes("SUPERGIANT")) visualSize = 60 + (Math.log10(Math.max(s.r, 1)) * 25);
    render.style.width = Math.min(Math.max(visualSize, 8), 250) + 'px';
    render.style.height = Math.min(Math.max(visualSize, 8), 250) + 'px';

    updateHRDiagram(s);
}

// ==========================================
// SIMPLIFIED STELLAR EVOLUTION LOGIC
// Red Dwarf (< 0.5 M☉)   : RED DWARF -> WHITE DWARF directly
// Mid Mass  (< 10 M☉)    : MAIN SEQUENCE -> RED GIANT -> BOOM -> WHITE DWARF
// High Mass (>= 10 M☉)   : MAIN SEQUENCE -> RED SUPERGIANT -> BOOM -> BLACK HOLE / NEUTRON STAR
// ==========================================

function triggerBoom(nextStateCallback) {
    const vCont = document.getElementById('v-cont');
    vCont.classList.add('boom-active');
    setTimeout(() => {
        vCont.classList.remove('boom-active');
        if (nextStateCallback) nextStateCallback();
    }, 600);
}

function evolveStarStep() {
    let s = currentStar;

    // Stage 1: Main Sequence / Early Stage -> Expand to Giant / Supergiant or decay directly if Red Dwarf
    if (s.state === "RED DWARF" || s.state === "MAIN SEQUENCE" || s.state === "BINARY SYSTEM" || s.state === "BLUE GIANT" || s.state === "BLUE SUBGIANT") {
        if (s.m < 0.5) {
            s.state = "WHITE DWARF";
            s.r = 0.15;
            s.t = 12000;
        } else if (s.m >= 10) {
            s.state = "RED SUPERGIANT";
            s.r = s.r * 25 + 100;
            s.t = 3500;
        } else {
            s.state = "RED GIANT";
            s.r = s.r * 10 + 15;
            s.t = 4000;
        }
        s.l = Math.pow(s.r, 2) * Math.pow(s.t / 5778, 4);
        s.mv = calculateAbsoluteMagnitude(s.l);
        updateVisuals();
    }
    // Stage 2: Giant / Supergiant -> BOOM!
    else if (s.state === "RED GIANT" || s.state === "RED SUPERGIANT" || s.state === "YELLOW GIANT" || s.state === "BLUE SUPERGIANT" || s.state === "BRIGHT GIANT") {
        const isHighMass = s.m >= 10;
        s.state = "BOOM! (SUPERNOVA)";
        updateVisuals();

        triggerBoom(() => {
            if (isHighMass) {
                if (s.m >= 20) {
                    s.state = "BLACK HOLE";
                    s.r = 0.1;
                    s.t = 0;
                    s.l = 0.00001;
                } else {
                    s.state = "NEUTRON STAR";
                    s.r = 0.2;
                    s.t = 100000;
                    s.l = 0.01;
                }
            } else {
                s.state = "WHITE DWARF";
                s.r = 0.3;
                s.t = 25000;
                s.l = 0.001;
            }
            s.mv = calculateAbsoluteMagnitude(s.l);
            updateVisuals();
        });
    }
    // Stage 3: Nebula -> Collapse back into Main Sequence Star
    else if (s.state === "NEBULA") {
        currentStar = createRandomStar();
        updateVisuals();
    }
}

// Generation weighted toward Red Dwarfs (~75% occurrence)
function createRandomStar() {
    let roll = Math.random();
    let m, r, t, state;

    if (roll < 0.75) {
        // 75% Chance: RED DWARF
        m = 0.08 + Math.random() * 0.42;
        r = Math.pow(m, 0.85);
        t = 2500 + Math.random() * 1200;
        state = "RED DWARF";
    } else if (roll < 0.95) {
        // 20% Chance: MID-MASS MAIN SEQUENCE
        m = 0.5 + Math.random() * 7.5;
        r = Math.pow(m, 0.7);
        t = 3700 + (m * 800);
        state = "MAIN SEQUENCE";
    } else {
        // 5% Chance: HIGH-MASS MASSIVE STAR
        m = 8.0 + Math.random() * 42.0;
        r = Math.pow(m, 0.6);
        t = 10000 + (m * 500);
        state = "BLUE SUPERGIANT";
    }

    let l = Math.pow(r, 2) * Math.pow(t / 5778, 4);
    let mv = calculateAbsoluteMagnitude(l);
    
    return {
        t: t, m: m, r: r, l: l, mv: mv,
        state: state,
        rot: 1, age: 0
    };
}

// Universal Search Router
function executeUniversalSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!q) return;

    if (galaxyDB[q]) {
        switchToGalaxyView();
        generateGalaxy(galaxyDB[q].type, galaxyDB[q]);
    } 
    else if (galaxyTypes.includes(q.toUpperCase())) {
        switchToGalaxyView();
        generateGalaxy(q.toUpperCase());
    } 
    else if (starDB[q]) {
        switchToLabView();
        currentStar = { ...starDB[q], age: 0 };
        updateVisuals();
    } 
    else {
        switchToLabView();
        currentStar = createRandomStar();
        updateVisuals();
    }
}

document.getElementById('btn-universal-search').onclick = executeUniversalSearch;
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeUniversalSearch();
});

// Space Switching & Controls
document.getElementById('btn-switch-space').onclick = function() {
    if (currentSpaceMode === "LAB") {
        switchToGalaxyView();
        setTimeout(() => generateGalaxy(), 50);
    } else {
        switchToLabView();
    }
};

document.getElementById('btn-nebula').onclick = () => {
    switchToLabView();
    currentStar = { ...starDB.nebula, age: 0 };
    updateVisuals();
};

document.getElementById('btn-reset').onclick = () => {
    switchToLabView();
    currentStar = { ...starDB.sun, age: 0 };
    updateVisuals();
};

document.getElementById('btn-gen').onclick = () => {
    switchToLabView();
    currentStar = createRandomStar();
    updateVisuals();
};

document.getElementById('btn-step-evolve').onclick = () => {
    switchToLabView();
    evolveStarStep();
};

document.getElementById('btn-evolve').onclick = function() {
    autoEvolve = !autoEvolve;
    if (autoEvolve) {
        this.innerText = "EVOLUTION: ON";
        this.style.background = "#27ae60";
        autoEvolveInterval = setInterval(() => {
            if (currentSpaceMode === "LAB") evolveStarStep();
        }, 3000);
    } else {
        this.innerText = "EVOLUTION: OFF";
        this.style.background = "#e67e22";
        clearInterval(autoEvolveInterval);
    }
};

document.getElementById('btn-gen-galaxy').onclick = () => generateGalaxy();

// ==========================================
// GALAXY RENDER ENGINE
// ==========================================

const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

function resizeGalaxyCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}

function calculateGalaxyStats(type, preset = null) {
    let diameter, appMag, name;

    if (preset) {
        name = preset.name;
        diameter = preset.diameter;
        appMag = preset.appMag;
    } else {
        name = type;
        switch(type) {
            case "ELLIPTICAL":
                diameter = Math.floor(50000 + Math.random() * 450000);
                appMag = "+" + (6.0 + Math.random() * 7.5).toFixed(2);
                break;
            case "LENTICULAR":
                diameter = Math.floor(30000 + Math.random() * 120000);
                appMag = "+" + (8.0 + Math.random() * 6.0).toFixed(2);
                break;
            case "IRREGULAR":
                diameter = Math.floor(3000 + Math.random() * 27000);
                appMag = "+" + (9.5 + Math.random() * 6.5).toFixed(2);
                break;
            case "BARRED":
            case "SPIRAL":
            default:
                diameter = Math.floor(20000 + Math.random() * 160000);
                appMag = "+" + (7.0 + Math.random() * 7.0).toFixed(2);
                break;
        }
    }

    document.getElementById('galaxy-name-val').innerText = name;
    document.getElementById('galaxy-diameter-val').innerText = `${diameter.toLocaleString()} ly`;
    document.getElementById('galaxy-appmag-val').innerText = appMag;
}

function generateGalaxy(targetType = null, preset = null) {
    resizeGalaxyCanvas();

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const type = targetType || galaxyTypes[Math.floor(Math.random() * galaxyTypes.length)];

    let stars = [];
    const maxRadius = Math.min(width, height) * 0.38;

    calculateGalaxyStats(type, preset);

    if (type === "IRREGULAR") {
        const numStars = 2400;
        const numClusters = 4 + Math.floor(Math.random() * 5);
        let clusters = [];

        for (let c = 0; c < numClusters; c++) {
            clusters.push({
                x: centerX + (Math.random() - 0.5) * maxRadius * 1.3,
                y: centerY + (Math.random() - 0.5) * maxRadius * 1.3,
                radius: (0.15 + Math.random() * 0.25) * maxRadius
            });
        }

        for (let i = 0; i < numStars; i++) {
            let cluster = clusters[Math.floor(Math.random() * clusters.length)];
            let r = Math.pow(Math.random(), 1.5) * cluster.radius;
            let theta = Math.random() * Math.PI * 2;

            let x = cluster.x + r * Math.cos(theta);
            let y = cluster.y + r * Math.sin(theta);

            let colorPool = ['#9bb0ff', '#cad7ff', '#8e44ad', '#ff80ab', '#ffffff'];
            let color = colorPool[Math.floor(Math.random() * colorPool.length)];

            stars.push({
                x: x, y: y,
                size: Math.random() * 1.4 + 0.3,
                color: color,
                alpha: Math.random() * 0.75 + 0.2
            });
        }
    }
    else if (type === "ELLIPTICAL") {
        const numStars = 3200;
        const axisRatio = 0.5 + Math.random() * 0.4;
        const angle = Math.random() * Math.PI;

        for (let i = 0; i < numStars; i++) {
            let distance = Math.pow(Math.random(), 2.5) * maxRadius;
            let theta = Math.random() * Math.PI * 2;
            let ex = distance * Math.cos(theta);
            let ey = distance * Math.sin(theta) * axisRatio;

            let rx = ex * Math.cos(angle) - ey * Math.sin(angle);
            let ry = ex * Math.sin(angle) + ey * Math.cos(angle);

            let color = Math.random() > 0.3 ? '#ffd59e' : '#ffe8c2';
            stars.push({
                x: centerX + rx,
                y: centerY + ry,
                size: Math.random() * 1.3 + 0.3,
                color: color,
                alpha: Math.random() * 0.6 + 0.3
            });
        }
    } 
    else if (type === "LENTICULAR") {
        const numStars = 3000;
        const diskAngle = Math.random() * Math.PI;
        const inclination = 0.2 + Math.random() * 0.3;

        for (let i = 0; i < 800; i++) {
            let r = Math.pow(Math.random(), 2) * (maxRadius * 0.25);
            let theta = Math.random() * Math.PI * 2;
            stars.push({
                x: centerX + r * Math.cos(theta),
                y: centerY + r * Math.sin(theta),
                size: Math.random() * 1.5 + 0.4,
                color: '#fff0b3',
                alpha: Math.random() * 0.8 + 0.2
            });
        }

        for (let i = 0; i < numStars - 800; i++) {
            let r = (Math.random() * 0.85 + 0.15) * maxRadius;
            let theta = Math.random() * Math.PI * 2;

            let dx = r * Math.cos(theta);
            let dy = r * Math.sin(theta) * inclination;

            let rx = dx * Math.cos(diskAngle) - dy * Math.sin(diskAngle);
            let ry = dx * Math.sin(diskAngle) + dy * Math.cos(diskAngle);

            let color = r < maxRadius * 0.4 ? '#fffae6' : '#d2e1ff';
            stars.push({
                x: centerX + rx,
                y: centerY + ry,
                size: Math.random() * 1.1 + 0.3,
                color: color,
                alpha: Math.random() * 0.6 + 0.25
            });
        }
    } 
    else {
        // SPIRAL & BARRED SPIRAL
        const isBarred = (type === "BARRED");
        const numStars = preset && preset.name.includes("Andromeda") ? 3800 : 2800;
        const numArms = isBarred ? 2 : (preset && preset.name.includes("Andromeda") ? 2 : Math.floor(2 + Math.random() * 3));
        const armWidth = 0.35;
        const barLength = isBarred ? maxRadius * 0.35 : 0;
        const barAngle = Math.random() * Math.PI * 2;

        for (let i = 0; i < 600; i++) {
            let r = Math.random() * (maxRadius * 0.12);
            let theta = Math.random() * Math.PI * 2;
            stars.push({
                x: centerX + r * Math.cos(theta),
                y: centerY + r * Math.sin(theta),
                size: Math.random() * 1.6 + 0.4,
                color: '#fff4a6',
                alpha: Math.random() * 0.8 + 0.2
            });
        }

        if (isBarred) {
            for (let i = 0; i < 600; i++) {
                let dist = (Math.random() - 0.5) * barLength * 2;
                let offset = (Math.random() - 0.5) * 15;
                let px = dist * Math.cos(barAngle) - offset * Math.sin(barAngle);
                let py = dist * Math.sin(barAngle) + offset * Math.cos(barAngle);

                stars.push({
                    x: centerX + px,
                    y: centerY + py,
                    size: Math.random() * 1.3 + 0.4,
                    color: '#f8f7ff',
                    alpha: Math.random() * 0.7 + 0.3
                });
            }
        }

        for (let i = 0; i < numStars; i++) {
            let armIndex = i % numArms;
            let baseAngle = isBarred 
                ? (armIndex === 0 ? barAngle : barAngle + Math.PI) 
                : (armIndex * (2 * Math.PI / numArms));

            let distance = Math.random();
            let r = isBarred 
                ? barLength + (distance * (maxRadius - barLength))
                : distance * maxRadius;

            let theta = baseAngle + (distance * 3.5);
            let offset = (Math.random() - 0.5) * armWidth * (r + 15);

            let x = centerX + (r * Math.cos(theta)) + Math.cos(theta + Math.PI / 2) * offset;
            let y = centerY + (r * Math.sin(theta)) + Math.sin(theta + Math.PI / 2) * offset;

            let color = r < maxRadius * 0.45 ? '#f8f7ff' : (Math.random() > 0.35 ? '#9bb0ff' : '#cad7ff');

            stars.push({
                x: x, y: y,
                size: Math.random() * 1.2 + 0.3,
                color: color,
                alpha: Math.random() * 0.7 + 0.3
            });
        }
    }

    // Canvas Background
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, width, height);

    // Glow Layers
    let coreGlowRadius = type === "ELLIPTICAL" ? maxRadius * 0.45 : maxRadius * 0.28;
    let coreColor = type === "ELLIPTICAL" ? 'rgba(255, 213, 158, 0.7)' : (type === "IRREGULAR" ? 'rgba(142, 68, 173, 0.35)' : 'rgba(255, 244, 166, 0.85)');
    
    let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreGlowRadius);
    gradient.addColorStop(0, coreColor);
    gradient.addColorStop(0.4, 'rgba(142, 68, 173, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreGlowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Render Stars
    stars.forEach(star => {
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
}

window.addEventListener('resize', () => {
    if (currentSpaceMode === "ALTERNATE") generateGalaxy();
});

// Initial Render
updateVisuals();

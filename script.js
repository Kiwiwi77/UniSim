// Global State
let currentLanguage = 'en';
let currentStar = { t: 5778, m: 1.0, r: 1.0, l: 1.0, mv: 4.83, state: "MAIN SEQUENCE" };
let currentMode = 'lab'; // 'lab' or 'galaxy'

// Localized Databases & Translations
const translations = {
    en: {
        appTitle: "UniSim: Interactive Universe Simulator",
        navLab: "Stellar Lab",
        navGalaxy: "Galaxy Generator",
        searchPlaceholder: "Search star or galaxy (e.g. Sun, Andromeda, Spiral)...",
        searchBtn: "Search",
        tempLabel: "Temperature (K)",
        massLabel: "Mass (Solar Mass)",
        radLabel: "Radius (Solar Radius)",
        lumLabel: "Luminosity (Solar)",
        magLabel: "Abs Magnitude",
        stateLabel: "Stellar State",
        galaxyTypeLabel: "Galaxy Morphological Type",
        spiralOpt: "Spiral Galaxy",
        barredOpt: "Barred Spiral",
        ellipticalOpt: "Elliptical Galaxy",
        irregularOpt: "Irregular Galaxy",
        starsCountLabel: "Star Particle Count",
        resetBtn: "Reset Simulation"
    },
    fr: {
        appTitle: "UniSim : Simulateur d'Univers Interactif",
        navLab: "Laboratoire Stellaire",
        navGalaxy: "Générateur de Galaxies",
        searchPlaceholder: "Rechercher une étoile ou une galaxie (ex. Soleil, Voie Lactée, Spirale)...",
        searchBtn: "Rechercher",
        tempLabel: "Température (K)",
        massLabel: "Masse (Masse Solaire)",
        radLabel: "Rayon (Rayon Solaire)",
        lumLabel: "Luminosité (Solaire)",
        magLabel: "Magnitude Absolue",
        stateLabel: "État Stellaire",
        galaxyTypeLabel: "Type Morphologique de la Galaxie",
        spiralOpt: "Galaxie Spirale",
        barredOpt: "Spirale Barrée",
        ellipticalOpt: "Galaxie Elliptique",
        irregularOpt: "Galaxie Irrégulière",
        starsCountLabel: "Nombre de Particules d'Étoiles",
        resetBtn: "Réinitialiser"
    },
    es: {
        appTitle: "UniSim: Simulador Interactivo del Universo",
        navLab: "Laboratorio Estelar",
        navGalaxy: "Generador de Galaxias",
        searchPlaceholder: "Buscar estrella o galaxia (ej. Sol, Vía Láctea, Espiral)...",
        searchBtn: "Buscar",
        tempLabel: "Temperatura (K)",
        massLabel: "Masa (Masa Solar)",
        radLabel: "Radio (Radio Solar)",
        lumLabel: "Luminosidad (Solar)",
        magLabel: "Magnitud Absoluta",
        stateLabel: "Estado Estelar",
        galaxyTypeLabel: "Tipo Morfológico de la Galaxia",
        spiralOpt: "Galaxia Espiral",
        barredOpt: "Espiral Barrada",
        ellipticalOpt: "Galaxia Elíptica",
        irregularOpt: "Galaxia Irregular",
        starsCountLabel: "Número de Partículas de Estrellas",
        resetBtn: "Restablecer"
    },
    de: {
        appTitle: "UniSim: Interaktiver Universum-Simulator",
        navLab: "Stellarlabor",
        navGalaxy: "Galaxien-Generator",
        searchPlaceholder: "Stern oder Galaxie suchen (z. B. Sonne, Milchstraße, Spirale)...",
        searchBtn: "Suchen",
        tempLabel: "Temperatur (K)",
        massLabel: "Masse (Sonnenmasse)",
        radLabel: "Radius (Sonnenradius)",
        lumLabel: "Leuchtkraft (Sonne)",
        magLabel: "Absoluter Helligkeitswert",
        stateLabel: "Stellarer Zustand",
        galaxyTypeLabel: "Morphologischer Galaxientyp",
        spiralOpt: "Spiralgalaxie",
        barredOpt: "Balkenspiralgalaxie",
        ellipticalOpt: "Elliptische Galaxie",
        irregularOpt: "Unregelmäßige Galaxie",
        starsCountLabel: "Anzahl der Sternpartikel",
        resetBtn: "Zurücksetzen"
    },
    zh: {
        appTitle: "UniSim: 交互式宇宙模拟器",
        navLab: "恒星实验室",
        navGalaxy: "星系生成器",
        searchPlaceholder: "搜索恒星或星系（例如：太阳、银河系、螺旋星系）...",
        searchBtn: "搜索",
        tempLabel: "温度 (K)",
        massLabel: "质量 (太阳质量)",
        radLabel: "半径 (太阳半径)",
        lumLabel: "光度 (太阳光度)",
        magLabel: "绝对星等",
        stateLabel: "恒星演化状态",
        galaxyTypeLabel: "星系形态类型",
        spiralOpt: "螺旋星系",
        barredOpt: "棒旋星系",
        ellipticalOpt: "椭圆星系",
        irregularOpt: "不规则星系",
        starsCountLabel: "恒星粒子数量",
        resetBtn: "重置模拟"
    }
};

// Expanded starDB with multilingual keys & aliases
const starDB = {
    "sun": { t: 5778, m: 1.0, r: 1.0, l: 1.0, mv: 4.83, state: "MAIN SEQUENCE" },
    "soleil": { t: 5778, m: 1.0, r: 1.0, l: 1.0, mv: 4.83, state: "MAIN SEQUENCE" }, // FR
    "sol": { t: 5778, m: 1.0, r: 1.0, l: 1.0, mv: 4.83, state: "MAIN SEQUENCE" },    // ES
    "sonne": { t: 5778, m: 1.0, r: 1.0, l: 1.0, mv: 4.83, state: "MAIN SEQUENCE" },  // DE
    "太阳": { t: 5778, m: 1.0, r: 1.0, l: 1.0, mv: 4.83, state: "MAIN SEQUENCE" },   // ZH
    
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
    "naine brune": { t: 1500, m: 0.05, r: 0.1, l: 0.0001, mv: 18.0, state: "BROWN DWARF" },
    "nebula": { t: 50, m: 5.0, r: 25.0, l: 0.01, mv: 12.0, state: "NEBULA" },
    "nebuleuse": { t: 50, m: 5.0, r: 25.0, l: 0.01, mv: 12.0, state: "NEBULA" }
};

// Expanded galaxyDB with multilingual aliases
const galaxyDB = {
    "milky way": { type: "BARRED", name: "Milky Way", diameter: 105700, appMag: "-20.5 (Integrated)" },
    "voie lactee": { type: "BARRED", name: "Voie Lactée", diameter: 105700, appMag: "-20.5 (Intégré)" },
    "via lactea": { type: "BARRED", name: "Vía Láctea", diameter: 105700, appMag: "-20.5" },
    "milchstrasse": { type: "BARRED", name: "Milchstraße", diameter: 105700, appMag: "-20.5" },
    "银河系": { type: "BARRED", name: "银河系", diameter: 105700, appMag: "-20.5" },
    
    "andromeda": { type: "SPIRAL", name: "Andromeda (M31)", diameter: 220000, appMag: "+3.44" },
    "andromede": { type: "SPIRAL", name: "Andromède (M31)", diameter: 220000, appMag: "+3.44" },
    "仙女座": { type: "SPIRAL", name: "仙女座星系 (M31)", diameter: 220000, appMag: "+3.44" },
    "m31": { type: "SPIRAL", name: "Andromeda (M31)", diameter: 220000, appMag: "+3.44" },
    
    "triangulum": { type: "SPIRAL", name: "Triangulum (M33)", diameter: 60000, appMag: "+5.72" },
    "triangle": { type: "SPIRAL", name: "Triangle (M33)", diameter: 60000, appMag: "+5.72" },
    "三角座": { type: "SPIRAL", name: "三角座星系 (M33)", diameter: 60000, appMag: "+5.72" },
    "m87": { type: "ELLIPTICAL", name: "Virgo A (M87)", diameter: 120000, appMag: "+8.6" },
    "smc": { type: "IRREGULAR", name: "Small Magellanic Cloud", diameter: 7000, appMag: "+2.7" },
    "lmc": { type: "IRREGULAR", name: "Large Magellanic Cloud", diameter: 14000, appMag: "+0.9" }
};

// Map localized terms to standard Galaxy types
const localizedTypes = {
    "SPIRAL": "SPIRAL", "SPIRALE": "SPIRAL", "ESSPIRAL": "SPIRAL", "螺旋": "SPIRAL",
    "BARRED": "BARRED", "BARREE": "BARRED", "BARRADA": "BARRED", "棒旋": "BARRED",
    "ELLIPTICAL": "ELLIPTICAL", "ELLIPTIQUE": "ELLIPTICAL", "ELIPTICA": "ELLIPTICAL", "ELLIPTISCH": "ELLIPTICAL", "椭圆": "ELLIPTICAL",
    "IRREGULAR": "IRREGULAR", "IRREGULIERE": "IRREGULAR", "IRREGULAR": "IRREGULAR", "UNREGELMÄSSIG": "IRREGULAR", "不规则": "IRREGULAR"
};

// Helper: Normalize string (remove accents & lowercase)
function normalizeText(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Language Switching Logic
function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;

    // Update Text Elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });
}

// Universal Search Execution
function executeUniversalSearch() {
    const rawInput = document.getElementById('searchInput').value.trim();
    if (!rawInput) return;

    const query = normalizeText(rawInput);

    // 1. Check Galaxy DB
    const foundGalaxyKey = Object.keys(galaxyDB).find(k => normalizeText(k) === query);
    if (foundGalaxyKey) {
        switchToGalaxyView();
        generateGalaxy(galaxyDB[foundGalaxyKey].type, galaxyDB[foundGalaxyKey]);
        return;
    }

    // 2. Check Galaxy Shape Types
    const matchedTypeKey = Object.keys(localizedTypes).find(k => normalizeText(k) === query);
    if (matchedTypeKey) {
        switchToGalaxyView();
        generateGalaxy(localizedTypes[matchedTypeKey]);
        return;
    }

    // 3. Check Star DB
    const foundStarKey = Object.keys(starDB).find(k => normalizeText(k) === query);
    if (foundStarKey) {
        switchToLabView();
        currentStar = { ...starDB[foundStarKey], age: 0 };
        updateVisuals();
        return;
    }

    // Fallback: Generate random star if search query is unrecognized
    switchToLabView();
    currentStar = createRandomStar();
    updateVisuals();
}

// Navigation View Switches
function switchToLabView() {
    currentMode = 'lab';
    document.getElementById('stellarControls').style.display = 'block';
    document.getElementById('galaxyControls').style.display = 'none';
}

function switchToGalaxyView() {
    currentMode = 'galaxy';
    document.getElementById('stellarControls').style.display = 'none';
    document.getElementById('galaxyControls').style.display = 'block';
}

// Utility: Generate Random Star for Fallback
function createRandomStar() {
    return {
        t: Math.floor(Math.random() * 25000) + 2000,
        m: parseFloat((Math.random() * 20 + 0.1).toFixed(2)),
        r: parseFloat((Math.random() * 50 + 0.2).toFixed(2)),
        l: parseFloat((Math.random() * 10000 + 0.01).toFixed(2)),
        mv: parseFloat((Math.random() * 20 - 10).toFixed(2)),
        state: "CUSTOM SYSTEM"
    };
}

// Visual Updating Stub
function updateVisuals() {
    console.log("Updating 3D visuals with current star parameters:", currentStar);
}

// Galaxy Generation Stub
function generateGalaxy(type, data = null) {
    console.log(`Generating Galaxy View: Type=${type}`, data);
}

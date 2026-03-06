import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend, AreaChart, Area } from "recharts";

/* ─── LIGHT MEDICAL THEME ─── */
const C = {
  bg: "#f0f4f8",
  white: "#ffffff",
  card: "#ffffff",
  cardAlt: "#f8fafc",
  accent: "#0891b2",       // teal-600
  accentLight: "#e0f7fa",
  accentDark: "#0e7490",
  success: "#059669",
  successBg: "#ecfdf5",
  danger: "#dc2626",
  dangerBg: "#fef2f2",
  warning: "#d97706",
  warningBg: "#fffbeb",
  info: "#2563eb",
  infoBg: "#eff6ff",
  purple: "#7c3aed",
  purpleBg: "#f5f3ff",
  text: "#1e293b",
  textMid: "#475569",
  textDim: "#94a3b8",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
  shadowLg: "0 10px 30px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
};

/* ─── SYMPTOM QUESTIONS ─── */
const symptomQuestions = [
  { id: "sym_thirst", text: "Сізде жиі өшпейтін шөлдеу сезімі болады ма?", icon: "💧", weight: 4 },
  { id: "sym_dry_mouth", text: "Соңғы уақытта аузыңыз құрғап жүр ме?", icon: "👄", weight: 3 },
  { id: "sym_fatigue", text: "Жиі қатты шаршап жүресіз бе?", icon: "😴", weight: 3 },
  { id: "sym_urination", text: "Зәр шығару жиілеп кетті ме?", icon: "🚻", weight: 4 },
  { id: "sym_wounds", text: "Кішігірім жаралар ұзақ уақыт бойы жазылмай ма?", icon: "🩹", weight: 4 },
  { id: "sym_nausea", text: "Жиі жүрек айну сезімі болады ма?", icon: "🤢", weight: 2 },
  { id: "sym_acetone", text: "Сіздің немесе жаныңыздағылардың назарына деміңіздің ацетон иісі бар ма?", icon: "💨", weight: 5 },
  { id: "sym_heartbeat", text: "Соңғы уақытта жүрек соғу жиілеп кетті ме?", icon: "💗", weight: 3 },
  { id: "sym_weight", text: "Соңғы уақытта салмақ тез түсті немесе тез қосылды ма?", icon: "⚖️", weight: 3 },
  { id: "sym_cramps", text: "Бұлшықеттеріңіз жиі тартылып қалады ма?", icon: "💪", weight: 2 },
  { id: "sym_skin", text: "Теріңіз қышиды немесе қабынып, бөртпе, безеу пайда болады ма?", icon: "🩺", weight: 3 },
  { id: "sym_hunger", text: "Үнемі аш боласыз ба?", icon: "🍽️", weight: 3 },
  { id: "sym_vision", text: "Көру қабілетіңіз нашарлап жатыр ма?", icon: "👁️", weight: 3 },
  { id: "sym_numbness", text: "Қол-аяғыңызда ұю немесе шаншу сезімі бар ма?", icon: "🖐️", weight: 3 },
];

/* ─── MEDICAL HISTORY ─── */
const medicalQuestions = [
  { id: "med_cardiovascular", text: "Сізде жүрек-қан тамырлары аурулары бар ма?", icon: "❤️", weight: 4 },
  { id: "med_kidney", text: "Сізде бүйрек жеткіліксіздігі диагнозы қойылған ба?", icon: "🫘", weight: 4 },
  { id: "med_hypertension", text: "Сізде артериялық гипертензия (жоғары қан қысымы) бар ма?", icon: "🩸", weight: 3 },
  { id: "med_pcos", text: "Сізде поликистозды аналық без синдромы (PCOS) бар ма?", icon: "🔬", weight: 3 },
  { id: "med_gestational", text: "Бұрын жүктілік кезінде гестациялық диабет болды ма?", icon: "🤰", weight: 4 },
];

/* ─── LAB PARAMETERS ─── */
const labFactors = [
  { id: "glucose", label: "Қан глюкозасы (аш қарынға)", min: 3, max: 20, unit: "ммоль/л", icon: "🩸", info: "Норма: 3.9–5.5 ммоль/л" },
  { id: "hba1c", label: "Гликирленген гемоглобин (HbA1c)", min: 3, max: 15, unit: "%", icon: "🔬", info: "Норма: < 5.7%" },
  { id: "cholesterol", label: "Жалпы холестерин", min: 2, max: 10, unit: "ммоль/л", icon: "🧪", info: "Норма: < 5.2 ммоль/л" },
  { id: "triglycerides", label: "Триглицеридтер", min: 0.3, max: 10, unit: "ммоль/л", icon: "📊", info: "Норма: < 1.7 ммоль/л" },
  { id: "hdl", label: "HDL холестерин (жақсы)", min: 0.5, max: 4, unit: "ммоль/л", icon: "✅", info: "Норма: > 1.0 (ер), > 1.2 (әйел)" },
  { id: "ldl", label: "LDL холестерин (жаман)", min: 0.5, max: 8, unit: "ммоль/л", icon: "⚠️", info: "Норма: < 3.0 ммоль/л" },
  { id: "creatinine", label: "Креатинин", min: 30, max: 500, unit: "мкмоль/л", icon: "🫘", info: "Норма: 62–106 (ер), 44–80 (әйел)" },
  { id: "insulin", label: "Инсулин (аш қарынға)", min: 1, max: 100, unit: "мкМЕ/мл", icon: "💉", info: "Норма: 2.6–24.9 мкМЕ/мл" },
];

/* ─── BASIC INPUTS ─── */
const basicFactors = [
  { id: "age", label: "Жасы", min: 18, max: 100, unit: "жас", icon: "👤" },
  { id: "weight", label: "Салмағы", min: 30, max: 250, unit: "кг", icon: "⚖️" },
  { id: "height", label: "Бойы", min: 100, max: 230, unit: "см", icon: "📐" },
  { id: "bp", label: "Артериялық қысым (систолалық)", min: 80, max: 220, unit: "мм сын.бағ.", icon: "💓" },
  { id: "waist", label: "Бел шеңбері", min: 50, max: 180, unit: "см", icon: "📏" },
];

const selectFactors = [
  { id: "gender", label: "Жынысы", icon: "⚧", options: [
    { value: "male", label: "Ер" }, { value: "female", label: "Әйел" },
  ]},
  { id: "family", label: "Туыстарында қант диабеті", icon: "👨‍👩‍👧‍👦", options: [
    { value: "none", label: "Жоқ" }, { value: "distant", label: "Алыс туыстарында" },
    { value: "close", label: "Жақын туыстарында" }, { value: "both_parents", label: "Ата-анасында" },
  ]},
  { id: "activity", label: "Физикалық белсенділік", icon: "🏃", options: [
    { value: "high", label: "Жоғары (аптасына 5+ рет)" }, { value: "moderate", label: "Орташа (аптасына 3-4 рет)" },
    { value: "low", label: "Төмен (аптасына 1-2 рет)" }, { value: "sedentary", label: "Отырыс өмір салты" },
  ]},
  { id: "smoking", label: "Темекі шегу", icon: "🚬", options: [
    { value: "never", label: "Ешқашан шекпеген" }, { value: "former", label: "Бұрын шеккен" },
    { value: "current", label: "Қазір шегеді" },
  ]},
  { id: "diet", label: "Тамақтану сипаты", icon: "🥗", options: [
    { value: "healthy", label: "Теңдестірілген тамақтану" }, { value: "moderate", label: "Орташа" },
    { value: "unhealthy", label: "Дұрыс тамақтанбау" },
  ]},
];

/* ─── RISK CALCULATION ─── */
function calculateRisk(data, hasLabs) {
  let score = 0;
  let maxPossible = 0;
  let factors = [];
  let warnings = [];
  let unanswered = [];

  // Age
  if (data.age) {
    const age = parseFloat(data.age);
    maxPossible += 12;
    if (age >= 65) { score += 12; factors.push({ name: "Жасы", score: 12, max: 12, status: "danger" }); }
    else if (age >= 50) { score += 8; factors.push({ name: "Жасы", score: 8, max: 12, status: "warning" }); }
    else if (age >= 40) { score += 5; factors.push({ name: "Жасы", score: 5, max: 12, status: "warning" }); }
    else { score += 1; factors.push({ name: "Жасы", score: 1, max: 12, status: "safe" }); }
  } else { unanswered.push("Жасы"); }

  // BMI (auto-calculated from weight & height)
  let bmi = null;
  if (data.weight && data.height) {
    const w = parseFloat(data.weight);
    const h = parseFloat(data.height) / 100;
    bmi = w / (h * h);
  }
  if (bmi) {
    maxPossible += 15;
    if (bmi >= 35) { score += 15; factors.push({ name: "BMI (" + bmi.toFixed(1) + ")", score: 15, max: 15, status: "danger" }); }
    else if (bmi >= 30) { score += 12; factors.push({ name: "BMI (" + bmi.toFixed(1) + ")", score: 12, max: 15, status: "danger" }); }
    else if (bmi >= 25) { score += 7; factors.push({ name: "BMI (" + bmi.toFixed(1) + ")", score: 7, max: 15, status: "warning" }); }
    else { score += 1; factors.push({ name: "BMI (" + bmi.toFixed(1) + ")", score: 1, max: 15, status: "safe" }); }
  } else { unanswered.push("BMI (салмақ/бой)"); }

  // BP
  if (data.bp) {
    const bp = parseFloat(data.bp);
    maxPossible += 8;
    if (bp >= 160) { score += 8; factors.push({ name: "Қан қысымы", score: 8, max: 8, status: "danger" }); }
    else if (bp >= 140) { score += 6; factors.push({ name: "Қан қысымы", score: 6, max: 8, status: "warning" }); }
    else if (bp >= 130) { score += 3; factors.push({ name: "Қан қысымы", score: 3, max: 8, status: "warning" }); }
    else { score += 1; factors.push({ name: "Қан қысымы", score: 1, max: 8, status: "safe" }); }
  } else { unanswered.push("Қан қысымы"); }

  // Waist
  if (data.waist && data.gender) {
    const w = parseFloat(data.waist);
    maxPossible += 8;
    const threshold = data.gender === "male" ? 102 : 88;
    const warnThreshold = data.gender === "male" ? 94 : 80;
    if (w >= threshold) { score += 8; factors.push({ name: "Бел шеңбері", score: 8, max: 8, status: "danger" }); }
    else if (w >= warnThreshold) { score += 5; factors.push({ name: "Бел шеңбері", score: 5, max: 8, status: "warning" }); }
    else { score += 1; factors.push({ name: "Бел шеңбері", score: 1, max: 8, status: "safe" }); }
  }

  // Lab results
  if (hasLabs) {
    if (data.glucose) {
      const g = parseFloat(data.glucose);
      maxPossible += 18;
      if (g >= 7.0) { score += 18; factors.push({ name: "Глюкоза", score: 18, max: 18, status: "danger" }); }
      else if (g >= 5.6) { score += 10; factors.push({ name: "Глюкоза", score: 10, max: 18, status: "warning" }); }
      else { score += 1; factors.push({ name: "Глюкоза", score: 1, max: 18, status: "safe" }); }
    }
    if (data.hba1c) {
      const h = parseFloat(data.hba1c);
      maxPossible += 18;
      if (h >= 6.5) { score += 18; factors.push({ name: "HbA1c", score: 18, max: 18, status: "danger" }); }
      else if (h >= 5.7) { score += 10; factors.push({ name: "HbA1c", score: 10, max: 18, status: "warning" }); }
      else { score += 1; factors.push({ name: "HbA1c", score: 1, max: 18, status: "safe" }); }
    }
    if (data.cholesterol) {
      const c = parseFloat(data.cholesterol);
      maxPossible += 6;
      if (c >= 6.2) { score += 6; factors.push({ name: "Холестерин", score: 6, max: 6, status: "danger" }); }
      else if (c >= 5.2) { score += 4; factors.push({ name: "Холестерин", score: 4, max: 6, status: "warning" }); }
      else { score += 1; factors.push({ name: "Холестерин", score: 1, max: 6, status: "safe" }); }
    }
    if (data.triglycerides) {
      const t = parseFloat(data.triglycerides);
      maxPossible += 5;
      if (t >= 2.3) { score += 5; factors.push({ name: "Триглицеридтер", score: 5, max: 5, status: "danger" }); }
      else if (t >= 1.7) { score += 3; factors.push({ name: "Триглицеридтер", score: 3, max: 5, status: "warning" }); }
      else { score += 1; factors.push({ name: "Триглицеридтер", score: 1, max: 5, status: "safe" }); }
    }
    if (data.insulin) {
      const ins = parseFloat(data.insulin);
      maxPossible += 8;
      if (ins >= 25) { score += 8; factors.push({ name: "Инсулин", score: 8, max: 8, status: "danger" }); }
      else if (ins >= 12) { score += 4; factors.push({ name: "Инсулин", score: 4, max: 8, status: "warning" }); }
      else { score += 1; factors.push({ name: "Инсулин", score: 1, max: 8, status: "safe" }); }
    }
  } else {
    warnings.push("Зертханалық анализ нәтижелері ескерілмеді — нақтырақ бағалау үшін анализ нәтижелерін енгізіңіз");
  }

  // Family
  if (data.family) {
    maxPossible += 10;
    if (data.family === "both_parents") { score += 10; factors.push({ name: "Тұқым қуалау", score: 10, max: 10, status: "danger" }); }
    else if (data.family === "close") { score += 7; factors.push({ name: "Тұқым қуалау", score: 7, max: 10, status: "warning" }); }
    else if (data.family === "distant") { score += 3; factors.push({ name: "Тұқым қуалау", score: 3, max: 10, status: "safe" }); }
    else { score += 0; factors.push({ name: "Тұқым қуалау", score: 0, max: 10, status: "safe" }); }
  }

  // Lifestyle
  if (data.activity === "sedentary") score += 5;
  else if (data.activity === "low") score += 3;
  if (data.smoking === "current") score += 4;
  else if (data.smoking === "former") score += 2;
  if (data.diet === "unhealthy") score += 4;
  else if (data.diet === "moderate") score += 2;

  // Symptoms
  let symptomScore = 0;
  let symptomMax = 0;
  let answeredSymptoms = 0;
  symptomQuestions.forEach(sq => {
    if (data[sq.id] !== undefined) {
      answeredSymptoms++;
      symptomMax += sq.weight;
      if (data[sq.id] === "yes") { symptomScore += sq.weight; }
      else if (data[sq.id] === "sometimes") { symptomScore += Math.ceil(sq.weight * 0.5); }
    }
  });
  score += symptomScore;
  maxPossible += symptomMax || 20;

  if (answeredSymptoms === 0) {
    warnings.push("Симптомдар туралы сұрақтар жауапсыз қалды — симптомдар ескерілмеді");
  }

  // Medical history
  let medScore = 0;
  let medAnswered = 0;
  medicalQuestions.forEach(mq => {
    if (data[mq.id] !== undefined) {
      medAnswered++;
      if (data[mq.id] === "yes") { medScore += mq.weight; maxPossible += mq.weight; }
    }
  });
  score += medScore;
  if (medAnswered === 0) {
    warnings.push("Ауру тарихы сұрақтарына жауап берілмеді — ескерілмеді");
  }

  const effectiveMax = Math.max(maxPossible, 50);
  const percentage = Math.min(Math.round((score / effectiveMax) * 100), 100);

  let level, levelLabel, levelColor, levelBg;
  if (percentage < 20) { level = "low"; levelLabel = "Төмен тәуекел"; levelColor = C.success; levelBg = C.successBg; }
  else if (percentage < 45) { level = "moderate"; levelLabel = "Орташа тәуекел"; levelColor = C.warning; levelBg = C.warningBg; }
  else if (percentage < 70) { level = "high"; levelLabel = "Жоғары тәуекел"; levelColor = "#ea580c"; levelBg = "#fff7ed"; }
  else { level = "critical"; levelLabel = "Өте жоғары тәуекел"; levelColor = C.danger; levelBg = C.dangerBg; }

  return { score, percentage, level, levelLabel, levelColor, levelBg, factors, warnings, unanswered, symptomScore, hasLabs };
}

/* ─── GAUGE ─── */
function RiskGauge({ percentage, color }) {
  const r = 85, sw = 14;
  const circ = Math.PI * r;
  const off = circ - (percentage / 100) * circ;
  return (
    <svg width="200" height="120" viewBox="0 0 200 120">
      <defs>
        <linearGradient id="gG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.success}/><stop offset="50%" stopColor={C.warning}/><stop offset="100%" stopColor={C.danger}/>
        </linearGradient>
      </defs>
      <path d={`M 15 110 A ${r} ${r} 0 0 1 185 110`} fill="none" stroke="#e2e8f0" strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M 15 110 A ${r} ${r} 0 0 1 185 110`} fill="none" stroke="url(#gG)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }}/>
      <text x="100" y="82" textAnchor="middle" fill={color} style={{ fontSize: "38px", fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>
        {percentage}%
      </text>
      <text x="100" y="106" textAnchor="middle" fill={C.textDim} style={{ fontSize: "10px", fontFamily: "'Outfit', sans-serif", letterSpacing: "2px", textTransform: "uppercase" }}>
        тәуекел деңгейі
      </text>
    </svg>
  );
}

/* ─── CARD ─── */
function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.white, borderRadius: "16px", padding: "24px",
      border: `1px solid ${C.border}`, boxShadow: C.shadow,
      transition: "all 0.2s ease",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>{children}</div>
  );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ icon, title, subtitle, color = C.accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px",
      }}>{icon}</div>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 800, color: C.text, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: "12px", color: C.textDim, margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─── EPIDEMIOLOGY DATA ─── */
const kzEpiData = [
  { year: "2017", prevalence: 7.1, diagnosed: 352000 },
  { year: "2018", prevalence: 7.4, diagnosed: 371000 },
  { year: "2019", prevalence: 7.7, diagnosed: 395000 },
  { year: "2020", prevalence: 8.0, diagnosed: 412000 },
  { year: "2021", prevalence: 8.4, diagnosed: 438000 },
  { year: "2022", prevalence: 8.7, diagnosed: 461000 },
  { year: "2023", prevalence: 9.1, diagnosed: 489000 },
  { year: "2024", prevalence: 9.4, diagnosed: 512000 },
  { year: "2025", prevalence: 9.7, diagnosed: 535000 },
];
const regionData = [
  { region: "Алматы қ.", rate: 12.3 }, { region: "Астана қ.", rate: 10.8 },
  { region: "Шымкент қ.", rate: 9.5 }, { region: "Алматы обл.", rate: 8.7 },
  { region: "Қарағанды", rate: 8.4 }, { region: "Шығыс ҚО", rate: 7.9 },
  { region: "Ақтөбе обл.", rate: 7.2 }, { region: "Жамбыл обл.", rate: 6.8 },
];
const ageDistribution = [
  { group: "20-29", male: 1.2, female: 0.8 }, { group: "30-39", male: 3.4, female: 2.9 },
  { group: "40-49", male: 7.8, female: 6.5 }, { group: "50-59", male: 14.2, female: 12.8 },
  { group: "60-69", male: 19.6, female: 21.3 }, { group: "70+", male: 22.1, female: 24.7 },
];

/* ─── TABS ─── */
const tabs = [
  { id: "input", label: "Деректер енгізу", icon: "📋" },
  { id: "results", label: "Нәтижелер", icon: "📊" },
  { id: "analytics", label: "Аналитика", icon: "📈" },
  { id: "epidemiology", label: "Эпидемиология", icon: "🗺️" },
];

/* ─── STEPS ─── */
const steps = [
  { id: 1, label: "Негізгі мәлімет", icon: "👤" },
  { id: 2, label: "Симптомдар", icon: "🩺" },
  { id: 3, label: "Ауру тарихы", icon: "📋" },
  { id: 4, label: "Анализдер", icon: "🔬" },
];

/* ═══════════════ MAIN APP ═══════════════ */
export default function DiabetesDetectionApp() {
  const [activeTab, setActiveTab] = useState("input");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [hasLabs, setHasLabs] = useState(null); // null = not answered, true/false
  const [result, setResult] = useState(null);

  const set = (id, val) => setFormData(p => ({ ...p, [id]: val }));

  const handleAnalyze = () => {
    const risk = calculateRisk(formData, hasLabs === true);
    setResult(risk);
    setActiveTab("results");
  };

  const handleReset = () => {
    setFormData({}); setResult(null); setHasLabs(null); setCurrentStep(1); setActiveTab("input");
  };

  const answeredCount = Object.keys(formData).filter(k => formData[k] !== "" && formData[k] !== undefined).length;

  const inputStyle = (id) => ({
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: `1.5px solid ${formData[id] ? C.accent + "66" : C.border}`,
    background: formData[id] ? C.accentLight : C.white,
    color: C.text, fontSize: "15px", fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none", transition: "all 0.2s ease",
  });

  const selectStyle = (id) => ({
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: `1.5px solid ${formData[id] ? C.accent + "66" : C.border}`,
    background: formData[id] ? C.accentLight : C.white,
    color: C.text, fontSize: "14px", fontWeight: 500,
    fontFamily: "'Outfit', sans-serif",
    outline: "none", cursor: "pointer", appearance: "none",
  });

  /* Symptom button */
  const SymBtn = ({ qId, value, label, active }) => (
    <button onClick={() => set(qId, value)} style={{
      padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
      border: active ? `2px solid ${value === "yes" ? C.danger : value === "sometimes" ? C.warning : C.success}` : `1.5px solid ${C.border}`,
      background: active ? (value === "yes" ? C.dangerBg : value === "sometimes" ? C.warningBg : C.successBg) : C.white,
      color: active ? (value === "yes" ? C.danger : value === "sometimes" ? C.warning : C.success) : C.textMid,
      cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>

      {/* ─── HEADER ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`, padding: "0 32px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${C.accent}, #06b6d4)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: 900, color: "#fff",
            }}>D</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: C.accent, letterSpacing: "-0.5px" }}>DiabetScan</div>
              <div style={{ fontSize: "9px", color: C.textDim, letterSpacing: "2px", textTransform: "uppercase" }}>Ерте анықтау жүйесі</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: "2px" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: "8px 16px", borderRadius: "10px", border: "none",
                background: activeTab === t.id ? C.accentLight : "transparent",
                color: activeTab === t.id ? C.accent : C.textDim,
                fontSize: "13px", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
              }}>
                <span style={{ fontSize: "15px" }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div style={{
            padding: "5px 14px", borderRadius: "8px",
            background: C.accentLight, border: `1px solid ${C.accent}33`,
            fontSize: "12px", color: C.accent, fontWeight: 700,
          }}>✓ {answeredCount} толтырылды</div>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 32px" }}>

        {/* ════════ INPUT TAB ════════ */}
        {activeTab === "input" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Step indicators */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {steps.map(s => (
                <button key={s.id} onClick={() => setCurrentStep(s.id)} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 20px", borderRadius: "12px",
                  border: currentStep === s.id ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
                  background: currentStep === s.id ? C.accentLight : C.white,
                  color: currentStep === s.id ? C.accent : C.textMid,
                  fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                  boxShadow: currentStep === s.id ? `0 2px 8px ${C.accent}22` : "none",
                }}>
                  <span style={{ fontSize: "16px" }}>{s.icon}</span>
                  <span>{s.label}</span>
                  <span style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: currentStep === s.id ? C.accent : C.borderLight,
                    color: currentStep === s.id ? "#fff" : C.textDim,
                    fontSize: "11px", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{s.id}</span>
                </button>
              ))}
            </div>

            {/* ─ STEP 1: Basic info ─ */}
            {currentStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Card style={{ background: `linear-gradient(135deg, ${C.accentLight}, #f0fdfa)`, border: `1px solid ${C.accent}22` }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "8px" }}>🩺</div>
                    <h1 style={{ fontSize: "24px", fontWeight: 900, color: C.accent, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                      Қант диабетін ерте анықтау жүйесі
                    </h1>
                    <p style={{ color: C.textMid, fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                      Деректерді толтырыңыз — жүйе 2-ші типті қант диабетінің даму тәуекелін бағалайды
                    </p>
                  </div>
                </Card>

                <Card>
                  <SectionHeader icon="👤" title="Жеке мәліметтер мен антропометрия" subtitle="Негізгі көрсеткіштерді енгізіңіз"/>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                    {basicFactors.map(f => (
                      <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{f.icon}</span>{f.label}
                        </label>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input type="number" step="0.1" min={f.min} max={f.max}
                            value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)}
                            placeholder={`${f.min} — ${f.max}`} style={inputStyle(f.id)}/>
                          <span style={{ fontSize: "11px", color: C.textDim, padding: "8px 10px", background: C.cardAlt, borderRadius: "8px", whiteSpace: "nowrap", fontWeight: 600 }}>{f.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live BMI Calculator */}
                  {formData.weight && formData.height && (
                    (() => {
                      const bmiVal = parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2);
                      const bmiFixed = bmiVal.toFixed(1);
                      let bmiStatus, bmiColor, bmiBg, bmiLabel;
                      if (bmiVal < 18.5) { bmiStatus = "low"; bmiColor = C.info; bmiBg = C.infoBg; bmiLabel = "Салмақ жетіспеушілігі"; }
                      else if (bmiVal < 25) { bmiStatus = "normal"; bmiColor = C.success; bmiBg = C.successBg; bmiLabel = "Қалыпты салмақ"; }
                      else if (bmiVal < 30) { bmiStatus = "overweight"; bmiColor = C.warning; bmiBg = C.warningBg; bmiLabel = "Артық салмақ"; }
                      else if (bmiVal < 35) { bmiStatus = "obese1"; bmiColor = "#ea580c"; bmiBg = "#fff7ed"; bmiLabel = "1-дәрежелі семіздік"; }
                      else if (bmiVal < 40) { bmiStatus = "obese2"; bmiColor = C.danger; bmiBg = C.dangerBg; bmiLabel = "2-дәрежелі семіздік"; }
                      else { bmiStatus = "obese3"; bmiColor = C.danger; bmiBg = C.dangerBg; bmiLabel = "3-дәрежелі семіздік"; }
                      
                      return (
                        <div style={{
                          marginTop: "18px", padding: "16px 20px", borderRadius: "12px",
                          background: bmiBg, border: `1.5px solid ${bmiColor}33`,
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "22px" }}>📊</span>
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: 600, color: C.textDim, marginBottom: "2px" }}>Дене салмағы индексі (BMI) — автоматты есептелді</div>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: C.textMid }}>
                                {formData.weight} кг ÷ ({formData.height} см)² = <strong>{bmiFixed}</strong> кг/м²
                              </div>
                            </div>
                          </div>
                          <div style={{
                            padding: "6px 16px", borderRadius: "8px",
                            background: `${bmiColor}18`, border: `1.5px solid ${bmiColor}44`,
                            display: "flex", alignItems: "center", gap: "8px",
                          }}>
                            <span style={{ fontSize: "20px", fontWeight: 900, color: bmiColor, fontFamily: "'JetBrains Mono', monospace" }}>{bmiFixed}</span>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: bmiColor }}>{bmiLabel}</span>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </Card>

                <Card>
                  <SectionHeader icon="🏃" title="Өмір салты факторлары" subtitle="Күнделікті әдеттеріңіз туралы"/>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                    {selectFactors.map(f => (
                      <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{f.icon}</span>{f.label}
                        </label>
                        <select value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)} style={selectStyle(f.id)}>
                          <option value="">— Таңдаңыз —</option>
                          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </Card>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setCurrentStep(2)} style={{
                    padding: "12px 32px", borderRadius: "10px", border: "none",
                    background: C.accent, color: "#fff", fontSize: "14px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  }}>Келесі қадам →</button>
                </div>
              </div>
            )}

            {/* ─ STEP 2: Symptoms ─ */}
            {currentStep === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Card>
                  <SectionHeader icon="🩺" title="Симптомдар" subtitle="Қазіргі кездегі денсаулық жағдайыңыз туралы сұрақтар" color={C.warning}/>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {symptomQuestions.map((sq, idx) => (
                      <div key={sq.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px", borderRadius: "12px",
                        background: formData[sq.id] ? (formData[sq.id] === "yes" ? C.dangerBg : formData[sq.id] === "sometimes" ? C.warningBg : C.successBg) : C.cardAlt,
                        border: `1px solid ${formData[sq.id] ? (formData[sq.id] === "yes" ? C.danger+"33" : formData[sq.id] === "sometimes" ? C.warning+"33" : C.success+"33") : C.border}`,
                        transition: "all 0.2s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                          <span style={{ fontSize: "20px" }}>{sq.icon}</span>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: C.text, lineHeight: 1.5 }}>{sq.text}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginLeft: "16px" }}>
                          <SymBtn qId={sq.id} value="yes" label="Иә" active={formData[sq.id] === "yes"}/>
                          <SymBtn qId={sq.id} value="sometimes" label="Кейде" active={formData[sq.id] === "sometimes"}/>
                          <SymBtn qId={sq.id} value="no" label="Жоқ" active={formData[sq.id] === "no"}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={() => setCurrentStep(1)} style={{
                    padding: "12px 28px", borderRadius: "10px", border: `1.5px solid ${C.border}`,
                    background: C.white, color: C.textMid, fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  }}>← Артқа</button>
                  <button onClick={() => setCurrentStep(3)} style={{
                    padding: "12px 32px", borderRadius: "10px", border: "none",
                    background: C.accent, color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  }}>Келесі қадам →</button>
                </div>
              </div>
            )}

            {/* ─ STEP 3: Medical history ─ */}
            {currentStep === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Card>
                  <SectionHeader icon="📋" title="Ауру тарихы" subtitle="Бұрынғы және қазіргі диагноздарыңыз" color={C.purple}/>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {medicalQuestions.map(mq => (
                      <div key={mq.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px", borderRadius: "12px",
                        background: formData[mq.id] ? (formData[mq.id] === "yes" ? C.dangerBg : C.successBg) : C.cardAlt,
                        border: `1px solid ${formData[mq.id] ? (formData[mq.id] === "yes" ? C.danger+"33" : C.success+"33") : C.border}`,
                        transition: "all 0.2s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                          <span style={{ fontSize: "20px" }}>{mq.icon}</span>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>{mq.text}</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0, marginLeft: "16px" }}>
                          <SymBtn qId={mq.id} value="yes" label="Иә" active={formData[mq.id] === "yes"}/>
                          <SymBtn qId={mq.id} value="no" label="Жоқ" active={formData[mq.id] === "no"}/>
                          <SymBtn qId={mq.id} value="unknown" label="Белгісіз" active={formData[mq.id] === "unknown"}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={() => setCurrentStep(2)} style={{
                    padding: "12px 28px", borderRadius: "10px", border: `1.5px solid ${C.border}`,
                    background: C.white, color: C.textMid, fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  }}>← Артқа</button>
                  <button onClick={() => setCurrentStep(4)} style={{
                    padding: "12px 32px", borderRadius: "10px", border: "none",
                    background: C.accent, color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  }}>Келесі қадам →</button>
                </div>
              </div>
            )}

            {/* ─ STEP 4: Lab results ─ */}
            {currentStep === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Ask if labs available */}
                <Card style={{ textAlign: "center", padding: "32px" }}>
                  <SectionHeader icon="🔬" title="Зертханалық анализдер" subtitle="Сізде анализ нәтижелері бар ма?" color={C.info}/>
                  <p style={{ fontSize: "14px", color: C.textMid, margin: "0 0 20px", lineHeight: 1.7 }}>
                    Егер анализ нәтижелеріңіз болса, оларды енгізу тәуекелді бағалау нақтылығын арттырады.
                    Анализ жоқ болса — бағалау қалған деректер бойынша жүргізіледі.
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button onClick={() => setHasLabs(true)} style={{
                      padding: "14px 32px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                      border: hasLabs === true ? `2px solid ${C.success}` : `1.5px solid ${C.border}`,
                      background: hasLabs === true ? C.successBg : C.white,
                      color: hasLabs === true ? C.success : C.textMid,
                      cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    }}>✅ Иә, анализдерім бар</button>
                    <button onClick={() => setHasLabs(false)} style={{
                      padding: "14px 32px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
                      border: hasLabs === false ? `2px solid ${C.warning}` : `1.5px solid ${C.border}`,
                      background: hasLabs === false ? C.warningBg : C.white,
                      color: hasLabs === false ? C.warning : C.textMid,
                      cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    }}>❌ Жоқ, анализдерім жоқ</button>
                  </div>
                </Card>

                {/* Lab fields - only if hasLabs === true */}
                {hasLabs === true && (
                  <Card>
                    <SectionHeader icon="🧪" title="Анализ нәтижелерін енгізіңіз" subtitle="Тек қолда бар көрсеткіштерді толтырыңыз — бос өрістер ескерілмейді" color={C.info}/>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                      {labFactors.map(f => (
                        <div key={f.id} style={{
                          padding: "16px", borderRadius: "12px",
                          background: formData[f.id] ? C.infoBg : C.cardAlt,
                          border: `1px solid ${formData[f.id] ? C.info+"33" : C.border}`,
                          transition: "all 0.2s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "18px" }}>{f.icon}</span>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: C.text }}>{f.label}</span>
                          </div>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <input type="number" step="0.1" min={f.min} max={f.max}
                              value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)}
                              placeholder={f.info} style={{ ...inputStyle(f.id), fontSize: "14px" }}/>
                            <span style={{ fontSize: "11px", color: C.textDim, padding: "8px 10px", background: C.white, borderRadius: "8px", whiteSpace: "nowrap", fontWeight: 600, border: `1px solid ${C.border}` }}>{f.unit}</span>
                          </div>
                          <div style={{ fontSize: "11px", color: C.textDim, marginTop: "6px" }}>{f.info}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Warning when no labs */}
                {hasLabs === false && (
                  <Card style={{ background: C.warningBg, border: `1px solid ${C.warning}33` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <span style={{ fontSize: "28px" }}>⚠️</span>
                      <div>
                        <h4 style={{ fontSize: "15px", fontWeight: 800, color: C.warning, margin: "0 0 6px" }}>Анализ нәтижелері жоқ</h4>
                        <p style={{ fontSize: "13px", color: C.textMid, margin: 0, lineHeight: 1.7 }}>
                          Зертханалық көрсеткіштерсіз бағалау тек симптомдар, өмір салты және ауру тарихы негізінде жүргізіледі.
                          Нақтырақ нәтиже алу үшін глюкоза, HbA1c тексерулерінен өтуді ұсынамыз.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={() => setCurrentStep(3)} style={{
                    padding: "12px 28px", borderRadius: "10px", border: `1.5px solid ${C.border}`,
                    background: C.white, color: C.textMid, fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  }}>← Артқа</button>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handleReset} style={{
                      padding: "12px 24px", borderRadius: "10px", border: `1.5px solid ${C.border}`,
                      background: C.white, color: C.textDim, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    }}>🗑 Тазарту</button>
                    <button onClick={handleAnalyze} style={{
                      padding: "14px 40px", borderRadius: "12px", border: "none",
                      background: `linear-gradient(135deg, ${C.accent}, #0284c7)`,
                      color: "#fff", fontSize: "15px", fontWeight: 800, cursor: "pointer",
                      fontFamily: "'Outfit', sans-serif",
                      boxShadow: `0 4px 16px ${C.accent}44`,
                    }}>🔍 Талдау жүргізу</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ RESULTS TAB ════════ */}
        {activeTab === "results" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <Card style={{ background: C.warningBg, border: `1px solid ${C.warning}33`, padding: "18px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "24px" }}>⚠️</span>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 800, color: C.warning, margin: "0 0 8px" }}>Ескертулер</h4>
                    {result.warnings.map((w, i) => (
                      <div key={i} style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.7, display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.warning, flexShrink: 0 }}/>
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Score */}
            <Card style={{ textAlign: "center", background: result.levelBg, border: `1px solid ${result.levelColor}22` }}>
              <h2 style={{ fontSize: "12px", fontWeight: 700, color: C.textDim, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 16px" }}>
                Тәуекелді бағалау нәтижесі
              </h2>
              <RiskGauge percentage={result.percentage} color={result.levelColor}/>
              <div style={{
                display: "inline-block", marginTop: "12px",
                padding: "6px 22px", borderRadius: "20px",
                background: `${result.levelColor}16`, color: result.levelColor,
                fontSize: "14px", fontWeight: 800, border: `1.5px solid ${result.levelColor}33`,
              }}>{result.levelLabel}</div>
              <p style={{ color: C.textMid, fontSize: "14px", maxWidth: "520px", margin: "16px auto 0", lineHeight: 1.7 }}>
                {result.level === "low" && "Қазіргі көрсеткіштер бойынша қант диабетінің даму тәуекелі төмен. Салауатты өмір салтын жалғастырыңыз."}
                {result.level === "moderate" && "Қант диабетінің даму тәуекелі орташа. Дәрігерге тексерілуді және өмір салтын жақсартуды ұсынамыз."}
                {result.level === "high" && "Қант диабетінің даму тәуекелі жоғары. Эндокринологқа жүгінуді және қосымша тексерулерден өтуді ұсынамыз."}
                {result.level === "critical" && "Қант диабетінің даму тәуекелі өте жоғары. Мамандандырылған медициналық көмекке дереу жүгінуіңіз қажет!"}
              </p>
              {!result.hasLabs && (
                <div style={{
                  marginTop: "16px", padding: "10px 20px", borderRadius: "10px",
                  background: C.warningBg, border: `1px solid ${C.warning}33`,
                  fontSize: "13px", color: C.warning, fontWeight: 600,
                  display: "inline-block",
                }}>
                  ⚡ Нәтиже зертханалық анализсіз есептелді — нақтылық төмендеуі мүмкін
                </div>
              )}
            </Card>

            {/* Factors breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 18px" }}>
                  Факторлар бойынша талдау
                </h3>
                {result.factors.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {result.factors.map((f, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: C.text }}>{f.name}</span>
                          <span style={{
                            fontSize: "12px", fontWeight: 800,
                            color: f.status === "safe" ? C.success : f.status === "warning" ? C.warning : C.danger,
                          }}>{f.score}/{f.max}</span>
                        </div>
                        <div style={{ height: "7px", borderRadius: "4px", background: C.borderLight, overflow: "hidden" }}>
                          <div style={{
                            width: `${(f.score / f.max) * 100}%`, height: "100%", borderRadius: "4px",
                            background: f.status === "safe" ? C.success : f.status === "warning" ? C.warning : C.danger,
                            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                          }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: C.textDim, fontSize: "13px" }}>Жеткілікті деректер жоқ</p>
                )}
              </Card>

              <Card>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 18px" }}>
                  Тәуекел радары
                </h3>
                {result.factors.length >= 3 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <RadarChart data={result.factors.map(f => ({ subject: f.name, A: (f.score / f.max) * 100 }))}>
                      <PolarGrid stroke={C.border}/>
                      <PolarAngleAxis dataKey="subject" tick={{ fill: C.textMid, fontSize: 11 }}/>
                      <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
                      <Radar dataKey="A" stroke={result.levelColor} fill={result.levelColor} fillOpacity={0.15} strokeWidth={2}/>
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
                    <p style={{ color: C.textDim, fontSize: "13px" }}>Радар үшін кемінде 3 фактор қажет</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <SectionHeader icon="💡" title="Ұсыныстар" subtitle="Денсаулықты жақсарту бойынша кеңестер"/>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                {[
                  { icon: "🏥", title: "Дәрігерге тексерілу", text: "Жылына 1-2 рет скрининг тексерулерінен өтіңіз" },
                  { icon: "🥗", title: "Тамақтану", text: "Қант пен қарапайым көмірсуларды шектеңіз" },
                  { icon: "🏃", title: "Белсенділік", text: "Күніне кемінде 30 минут жүріңіз" },
                  { icon: "⚖️", title: "Салмақ бақылау", text: "BMI-ді қалыпты деңгейде ұстаңыз" },
                  { icon: "🩸", title: "Глюкоза мониторингі", text: "Қан глюкозасын тексеріп тұрыңыз" },
                  { icon: "😴", title: "Ұйқы", text: "7-8 сағат сапалы ұйқы алыңыз" },
                ].map((r, i) => (
                  <div key={i} style={{ padding: "16px", borderRadius: "12px", background: C.cardAlt, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{r.icon}</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "4px", color: C.text }}>{r.title}</div>
                    <div style={{ fontSize: "12px", color: C.textDim, lineHeight: 1.6 }}>{r.text}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "12px", color: C.textDim, fontStyle: "italic" }}>
                ⚠️ Бұл жүйе медициналық диагноз қоймайды. Нәтижелерді дәрігермен міндетті түрде талқылаңыз.
              </p>
            </div>
          </div>
        )}

        {activeTab === "results" && !result && (
          <Card style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "48px", marginBottom: "14px" }}>📋</div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 8px" }}>Деректер енгізілмеген</h3>
            <p style={{ color: C.textDim, fontSize: "14px" }}>Алдымен деректерді толтырып, талдау жүргізіңіз</p>
            <button onClick={() => setActiveTab("input")} style={{
              marginTop: "20px", padding: "12px 28px", borderRadius: "10px", border: "none",
              background: C.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}>Деректер енгізу →</button>
          </Card>
        )}

        {/* ════════ ANALYTICS TAB ════════ */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
              {[
                { label: "ҚР тіркелген науқастар", value: "535 000+", icon: "🏥", color: C.accent, bg: C.accentLight },
                { label: "Нақты таралу деңгейі", value: "~9.7%", icon: "📊", color: C.info, bg: C.infoBg },
                { label: "Диагноз қойылмаған", value: "~40%", icon: "⚠️", color: C.warning, bg: C.warningBg },
                { label: "Жылдық өсім", value: "+3.2%", icon: "📈", color: C.danger, bg: C.dangerBg },
              ].map((s, i) => (
                <Card key={i} style={{ textAlign: "center", background: s.bg, border: `1px solid ${s.color}22` }}>
                  <div style={{ fontSize: "26px", marginBottom: "8px" }}>{s.icon}</div>
                  <div style={{ fontSize: "22px", fontWeight: 900, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: C.textMid, marginTop: "4px", fontWeight: 600 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 18px" }}>
                  ҚР бойынша 2-ші типті ҚД таралуы (%)
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={kzEpiData}>
                    <defs>
                      <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.accent} stopOpacity={0.25}/><stop offset="100%" stopColor={C.accent} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
                    <XAxis dataKey="year" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }}/>
                    <YAxis tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }} domain={[6,11]}/>
                    <Tooltip contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "12px" }}/>
                    <Area type="monotone" dataKey="prevalence" stroke={C.accent} fill="url(#gA)" strokeWidth={3} name="Таралу (%)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 18px" }}>
                  Жас/жыныс бойынша таралу (%)
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={ageDistribution} barGap={2}>
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
                    <XAxis dataKey="group" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }}/>
                    <YAxis tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }}/>
                    <Tooltip contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "12px" }}/>
                    <Bar dataKey="male" name="Ер" fill={C.info} radius={[4,4,0,0]}/>
                    <Bar dataKey="female" name="Әйел" fill={C.purple} radius={[4,4,0,0]}/>
                    <Legend wrapperStyle={{ fontSize: "12px" }}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 18px" }}>
                Тіркелген науқастар саны динамикасы
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={kzEpiData}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
                  <XAxis dataKey="year" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }}/>
                  <YAxis tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }} tickFormatter={v => `${(v/1000).toFixed(0)}к`}/>
                  <Tooltip contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "12px" }}
                    formatter={v => [`${v.toLocaleString()} адам`, "Тіркелген"]}/>
                  <Line type="monotone" dataKey="diagnosed" stroke={C.info} strokeWidth={3}
                    dot={{ fill: C.info, stroke: C.white, strokeWidth: 2, r: 5 }}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ════════ EPIDEMIOLOGY TAB ════════ */}
        {activeTab === "epidemiology" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card style={{ background: `linear-gradient(135deg, ${C.infoBg}, ${C.purpleBg})`, border: `1px solid ${C.info}22` }}>
              <h2 style={{ fontSize: "22px", fontWeight: 900, color: C.info, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                Қазақстан бойынша эпидемиологиялық деректер
              </h2>
              <p style={{ color: C.textMid, fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                IDF Diabetes Atlas (11-ші басылым, 2025) және ҚР ДСМ мәліметтері негізінде
              </p>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 18px" }}>
                  Өңірлер бойынша таралу (%)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }}/>
                    <YAxis type="category" dataKey="region" tick={{ fill: C.textMid, fontSize: 11 }} axisLine={{ stroke: C.border }} width={100}/>
                    <Tooltip contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "12px" }}/>
                    <Bar dataKey="rate" name="Таралу (%)" radius={[0,6,6,0]}>
                      {regionData.map((e, i) => <Cell key={i} fill={e.rate > 10 ? C.danger : e.rate > 8 ? C.warning : C.accent}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 18px" }}>
                  Тәуекел факторларының үлесі
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={[
                      { name: "Артық салмақ", value: 32 }, { name: "Тұқым қуалау", value: 22 },
                      { name: "Отырыс өмір", value: 18 }, { name: "Тамақтану", value: 14 },
                      { name: "Гипертензия", value: 8 }, { name: "Басқа", value: 6 },
                    ]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                      {[C.accent, C.info, C.warning, C.purple, C.danger, C.textDim].map((c, i) => <Cell key={i} fill={c}/>)}
                    </Pie>
                    <Tooltip contentStyle={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "12px" }}
                      formatter={v => [`${v}%`, ""]}/>
                    <Legend wrapperStyle={{ fontSize: "11px" }} formatter={v => <span style={{ color: C.textMid }}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
              {[
                { title: "DeFronzo «Жаман сегіздік»", text: "Инсулин резистенттілігі, β-жасуша дисфункциясы, бауыр глюконеогенезі, инкретин дефициті, глюкагон гиперсекрециясы, бүйрек реабсорбциясы, ми инсулин резистенттілігі, липолиз", color: C.accent, bg: C.accentLight },
                { title: "ADA критерийлері (2025)", text: "Аш қарынға глюкоза ≥7.0, HbA1c ≥6.5%, OГТТ ≥11.1, кездейсоқ глюкоза ≥11.1 + симптомдар", color: C.info, bg: C.infoBg },
                { title: "ҚР ерекшеліктері", text: "Семіздік ~21%, отырыс өмір ~35%, диагностика жетіспеушілігі (ауылдық жерлерде). Науқастардың ~40%-ы диагноз қойылмаған", color: C.warning, bg: C.warningBg },
              ].map((f, i) => (
                <Card key={i} style={{ background: f.bg, border: `1px solid ${f.color}22` }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: f.color, margin: "0 0 8px" }}>{f.title}</h4>
                  <p style={{ fontSize: "12px", color: C.textMid, lineHeight: 1.7, margin: 0 }}>{f.text}</p>
                </Card>
              ))}
            </div>

            <Card style={{ padding: "16px 24px" }}>
              <h4 style={{ fontSize: "11px", fontWeight: 700, color: C.textDim, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>Дереккөздер</h4>
              <div style={{ fontSize: "11px", color: C.textDim, lineHeight: 1.8 }}>
                1. IDF Diabetes Atlas, 11th Edition (2025) • 2. ADA Standards of Care in Diabetes (2025/2026) •
                3. ҚР ДСМ статистикалық деректері • 4. DeFronzo R.A. "From the Triumvirate to the Ominous Octet" (Diabetes, 2009) •
                5. Оразумбекова Б.Т., Бейсова Б.К. — ҚР-дағы ҚД эпидемиологиясы
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "24px", borderTop: `1px solid ${C.border}`, marginTop: "32px", background: C.white }}>
        <p style={{ fontSize: "11px", color: C.textDim, margin: 0 }}>
          DiabetScan v2.0 • Қант диабетін ерте анықтау жүйесі • Медициналық диагноз емес, тәуекелді бағалау құралы
        </p>
      </footer>

      <style>{`
        input:focus, select:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accent}18; }
        input::placeholder { color: ${C.textDim}; }
        button:hover { opacity: 0.92; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

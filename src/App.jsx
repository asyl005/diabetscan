import { useState, useEffect, useRef } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, LineChart, Line, Legend, AreaChart, Area
} from "recharts";

/* ═══════════════ COLORS ═══════════════ */
const C = {
  white: "#ffffff",
  bg: "#f0f4f8",
  card: "#ffffff",
  cardAlt: "#f7f9fc",
  accent: "#0d9488",
  accentLight: "#f0fdfa",
  accentMid: "#5eead4",
  danger: "#dc2626",
  dangerBg: "#fef2f2",
  warning: "#d97706",
  warningBg: "#fffbeb",
  info: "#2563eb",
  infoBg: "#eff6ff",
  safe: "#16a34a",
  safeBg: "#f0fdf4",
  purple: "#7c3aed",
  purpleBg: "#f5f3ff",
  text: "#1e293b",
  textMid: "#475569",
  textDim: "#94a3b8",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
};

/* ═══════════════ RESPONSIVE HOOK ═══════════════ */
function useWindowSize() {
  const [size, setSize] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1200 });
  useEffect(() => {
    const h = () => setSize({ w: window.innerWidth });
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return size;
}

/* ═══════════════ CARD ═══════════════ */
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card, borderRadius: "16px", padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    border: `1px solid ${C.border}`, transition: "all 0.2s ease", ...style,
  }}>{children}</div>
);

const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      <h3 style={{ fontSize: "17px", fontWeight: 700, color: C.text, margin: 0 }}>{title}</h3>
    </div>
    {subtitle && <p style={{ fontSize: "13px", color: C.textDim, margin: "6px 0 0 30px" }}>{subtitle}</p>}
  </div>
);

/* ═══════════════ DATA ═══════════════ */
const basicFactors = [
  { id: "age", label: "Жасы", min: 18, max: 100, unit: "жас", icon: "👤" },
  { id: "weight", label: "Салмағы", min: 30, max: 250, unit: "кг", icon: "⚖️" },
  { id: "height", label: "Бойы", min: 100, max: 230, unit: "см", icon: "📐" },
  { id: "bp", label: "Артериялық қысым (систолалық)", min: 80, max: 220, unit: "мм сын.бағ.", icon: "💓" },
  { id: "waist", label: "Бел шеңбері", min: 50, max: 180, unit: "см", icon: "📏" },
];

const lifestyleFactors = [
  { id: "activity", label: "Физикалық белсенділік", icon: "🏃", options: [
    { value: "high", label: "Жоғары (аптасына 5+ рет)" },
    { value: "moderate", label: "Орташа (аптасына 2-4 рет)" },
    { value: "low", label: "Төмен (аптасына 1 рет)" },
    { value: "sedentary", label: "Отырықшы өмір салты" },
  ]},
  { id: "smoking", label: "Темекі шегу", icon: "🚬", options: [
    { value: "never", label: "Ешқашан" },
    { value: "former", label: "Бұрын шеккен" },
    { value: "current", label: "Қазір шегемін" },
  ]},
  { id: "diet", label: "Тамақтану", icon: "🥗", options: [
    { value: "healthy", label: "Теңдестірілген / салауатты" },
    { value: "moderate", label: "Аралас" },
    { value: "unhealthy", label: "Фаст-фуд / тәттілер көп" },
  ]},
  { id: "family", label: "Отбасылық анамнез (диабет)", icon: "👨‍👩‍👧", options: [
    { value: "none", label: "Жоқ" },
    { value: "distant", label: "Алыс туыстарда бар" },
    { value: "close", label: "Жақын туыстарда бар (ата-ана, бауыр)" },
  ]},
];

const symptomQuestions = [
  { id: "thirst", label: "Шөлдеу күшейді ме?", icon: "💧" },
  { id: "dryMouth", label: "Ауыз құрғайды ма?", icon: "👄" },
  { id: "fatigue", label: "Шаршағыштық / әлсіздік бар ма?", icon: "😴" },
  { id: "frequentUrination", label: "Жиі зәр шығу бар ма?", icon: "🚻" },
  { id: "blurredVision", label: "Көру бұлдырлады ма?", icon: "👁️" },
  { id: "slowHealing", label: "Жаралар баяу жазыла ма?", icon: "🩹" },
  { id: "numbness", label: "Қол-аяқта ұю / тітіркену бар ма?", icon: "🖐️" },
  { id: "weightChange", label: "Салмақ кенет өзгерді ме?", icon: "📉" },
  { id: "hunger", label: "Аштық сезімі күшейді ме?", icon: "🍽️" },
  { id: "skinDarkening", label: "Терінің қараюы бар ма? (мойын, қолтық)", icon: "🔲" },
  { id: "itching", label: "Тері қышуы бар ма?", icon: "🤚" },
  { id: "infections", label: "Жиі инфекциялар бар ма?", icon: "🦠" },
  { id: "acetoneBreath", label: "Ауыздан ацетон иісі бар ма?", icon: "💨" },
  { id: "moodSwings", label: "Көңіл-күй ауытқулары бар ма?", icon: "😤" },
];

const medicalHistory = [
  { id: "cardiovascular", label: "Жүрек-қан тамырлары ауруы", icon: "❤️" },
  { id: "kidney", label: "Бүйрек ауруы", icon: "🫘" },
  { id: "hypertension", label: "Гипертензия (жоғары қан қысымы)", icon: "🩺" },
  { id: "pcos", label: "PCOS (поликистоз)", icon: "♀️" },
  { id: "gestational", label: "Гестациялық диабет", icon: "🤰" },
  { id: "prediabetes", label: "Преддиабет (бұрын анықталған)", icon: "⚠️" },
];

const labFactors = [
  { id: "glucose", label: "Қан глюкозасы (аш қарынға)", min: 3, max: 20, unit: "ммоль/л", icon: "🩸" },
  { id: "hba1c", label: "Гликирленген гемоглобин (HbA1c)", min: 3, max: 15, unit: "%", icon: "🔬" },
  { id: "cholesterol", label: "Жалпы холестерин", min: 2, max: 12, unit: "ммоль/л", icon: "🧪" },
  { id: "triglycerides", label: "Триглицеридтер", min: 0.3, max: 10, unit: "ммоль/л", icon: "💉" },
];

/* ═══════════════ RISK CALCULATION ═══════════════ */
function calculateRisk(data, hasLabData) {
  let score = 0, maxPossible = 0;
  const factors = [], unanswered = [];

  // Age
  if (data.age) {
    const age = parseFloat(data.age); maxPossible += 10;
    if (age >= 65) { score += 10; factors.push({ name: "Жас", score: 10, max: 10, status: "danger" }); }
    else if (age >= 45) { score += 6; factors.push({ name: "Жас", score: 6, max: 10, status: "warning" }); }
    else if (age >= 35) { score += 3; factors.push({ name: "Жас", score: 3, max: 10, status: "warning" }); }
    else { score += 1; factors.push({ name: "Жас", score: 1, max: 10, status: "safe" }); }
  } else { unanswered.push("Жас"); }

  // BMI auto-calculated
  let bmi = null;
  if (data.weight && data.height) {
    const w = parseFloat(data.weight), h = parseFloat(data.height) / 100;
    bmi = w / (h * h);
  }
  if (bmi) {
    maxPossible += 15;
    if (bmi >= 35) { score += 15; factors.push({ name: `BMI (${bmi.toFixed(1)})`, score: 15, max: 15, status: "danger" }); }
    else if (bmi >= 30) { score += 12; factors.push({ name: `BMI (${bmi.toFixed(1)})`, score: 12, max: 15, status: "danger" }); }
    else if (bmi >= 25) { score += 7; factors.push({ name: `BMI (${bmi.toFixed(1)})`, score: 7, max: 15, status: "warning" }); }
    else { score += 1; factors.push({ name: `BMI (${bmi.toFixed(1)})`, score: 1, max: 15, status: "safe" }); }
  } else { unanswered.push("BMI (салмақ/бой)"); }

  // Blood Pressure
  if (data.bp) {
    const bp = parseFloat(data.bp); maxPossible += 8;
    if (bp >= 160) { score += 8; factors.push({ name: "Қан қысымы", score: 8, max: 8, status: "danger" }); }
    else if (bp >= 140) { score += 5; factors.push({ name: "Қан қысымы", score: 5, max: 8, status: "warning" }); }
    else if (bp >= 130) { score += 3; factors.push({ name: "Қан қысымы", score: 3, max: 8, status: "warning" }); }
    else { score += 0; factors.push({ name: "Қан қысымы", score: 0, max: 8, status: "safe" }); }
  } else { unanswered.push("Қан қысымы"); }

  // Waist
  if (data.waist) {
    const waist = parseFloat(data.waist); maxPossible += 8;
    if (waist >= 102) { score += 8; factors.push({ name: "Бел шеңбері", score: 8, max: 8, status: "danger" }); }
    else if (waist >= 88) { score += 5; factors.push({ name: "Бел шеңбері", score: 5, max: 8, status: "warning" }); }
    else { score += 1; factors.push({ name: "Бел шеңбері", score: 1, max: 8, status: "safe" }); }
  } else { unanswered.push("Бел шеңбері"); }

  // Lifestyle
  if (data.activity) {
    maxPossible += 6;
    const m = { sedentary: 6, low: 4, moderate: 2, high: 0 };
    const s = m[data.activity] || 0;
    score += s; factors.push({ name: "Белсенділік", score: s, max: 6, status: s >= 4 ? "danger" : s >= 2 ? "warning" : "safe" });
  }
  if (data.smoking) {
    maxPossible += 4;
    const m = { current: 4, former: 2, never: 0 };
    const s = m[data.smoking] || 0;
    score += s; factors.push({ name: "Темекі", score: s, max: 4, status: s >= 3 ? "danger" : s >= 1 ? "warning" : "safe" });
  }
  if (data.diet) {
    maxPossible += 5;
    const m = { unhealthy: 5, moderate: 2, healthy: 0 };
    const s = m[data.diet] || 0;
    score += s; factors.push({ name: "Тамақтану", score: s, max: 5, status: s >= 4 ? "danger" : s >= 2 ? "warning" : "safe" });
  }
  if (data.family) {
    maxPossible += 10;
    const m = { close: 10, distant: 5, none: 0 };
    const s = m[data.family] || 0;
    score += s; factors.push({ name: "Отбасылық анамнез", score: s, max: 10, status: s >= 8 ? "danger" : s >= 3 ? "warning" : "safe" });
  }

  // Symptoms
  let symptomScore = 0, symptomMax = 0;
  symptomQuestions.forEach(q => {
    if (data[q.id]) {
      symptomMax += 3;
      const m = { yes: 3, sometimes: 1.5, no: 0 };
      symptomScore += m[data[q.id]] || 0;
    }
  });
  if (symptomMax > 0) {
    const normalized = Math.round((symptomScore / symptomMax) * 20);
    maxPossible += 20; score += normalized;
    factors.push({ name: "Симптомдар", score: normalized, max: 20, status: normalized >= 14 ? "danger" : normalized >= 7 ? "warning" : "safe" });
  }

  // Medical history
  let histScore = 0, histMax = 0;
  medicalHistory.forEach(q => {
    if (data[q.id]) {
      histMax += 4;
      const m = { yes: 4, no: 0, unknown: 1 };
      histScore += m[data[q.id]] || 0;
    }
  });
  if (histMax > 0) {
    const normalized = Math.round((histScore / histMax) * 12);
    maxPossible += 12; score += normalized;
    factors.push({ name: "Ауру тарихы", score: normalized, max: 12, status: normalized >= 8 ? "danger" : normalized >= 4 ? "warning" : "safe" });
  }

  // Lab data
  if (hasLabData) {
    if (data.glucose) {
      const g = parseFloat(data.glucose); maxPossible += 15;
      if (g >= 7.0) { score += 15; factors.push({ name: "Глюкоза", score: 15, max: 15, status: "danger" }); }
      else if (g >= 5.6) { score += 8; factors.push({ name: "Глюкоза", score: 8, max: 15, status: "warning" }); }
      else { score += 0; factors.push({ name: "Глюкоза", score: 0, max: 15, status: "safe" }); }
    }
    if (data.hba1c) {
      const h = parseFloat(data.hba1c); maxPossible += 15;
      if (h >= 6.5) { score += 15; factors.push({ name: "HbA1c", score: 15, max: 15, status: "danger" }); }
      else if (h >= 5.7) { score += 8; factors.push({ name: "HbA1c", score: 8, max: 15, status: "warning" }); }
      else { score += 0; factors.push({ name: "HbA1c", score: 0, max: 15, status: "safe" }); }
    }
    if (data.cholesterol) {
      const c = parseFloat(data.cholesterol); maxPossible += 5;
      if (c >= 6.2) { score += 5; factors.push({ name: "Холестерин", score: 5, max: 5, status: "danger" }); }
      else if (c >= 5.2) { score += 3; factors.push({ name: "Холестерин", score: 3, max: 5, status: "warning" }); }
      else { score += 0; factors.push({ name: "Холестерин", score: 0, max: 5, status: "safe" }); }
    }
    if (data.triglycerides) {
      const t = parseFloat(data.triglycerides); maxPossible += 5;
      if (t >= 2.3) { score += 5; factors.push({ name: "Триглицеридтер", score: 5, max: 5, status: "danger" }); }
      else if (t >= 1.7) { score += 3; factors.push({ name: "Триглицеридтер", score: 3, max: 5, status: "warning" }); }
      else { score += 0; factors.push({ name: "Триглицеридтер", score: 0, max: 5, status: "safe" }); }
    }
  }

  const pct = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
  let level, levelColor, levelBg, levelLabel;
  if (pct >= 70) { level = "high"; levelColor = C.danger; levelBg = C.dangerBg; levelLabel = "Жоғары тәуекел"; }
  else if (pct >= 40) { level = "moderate"; levelColor = C.warning; levelBg = C.warningBg; levelLabel = "Орташа тәуекел"; }
  else { level = "low"; levelColor = C.safe; levelBg = C.safeBg; levelLabel = "Төмен тәуекел"; }

  return { score, maxPossible, pct, level, levelColor, levelBg, levelLabel, factors, unanswered };
}

/* ═══════════════ RECOMMENDATIONS ═══════════════ */
function getRecommendations(level) {
  const recs = {
    high: [
      { icon: "🏥", title: "Дәрігерге жүгініңіз", text: "Эндокринологқа жедел жазылыңыз. Толық тексеру қажет." },
      { icon: "🩸", title: "Анализдерді тапсырыңыз", text: "Аш қарынға глюкоза, HbA1c, липидтік профиль, бүйрек функциясы." },
      { icon: "🥗", title: "Тамақтануды өзгертіңіз", text: "Қант, ақ нан, газды сусындарды қысқартыңыз. Көкөніс, талшық көбейтіңіз." },
      { icon: "🏃", title: "Физикалық белсенділік", text: "Күнделікті кемінде 30 минут серуендеңіз. Дәрігермен келісіңіз." },
    ],
    moderate: [
      { icon: "👨‍⚕️", title: "Профилактикалық тексеру", text: "Жылына 1-2 рет эндокринологта тексеріліңіз." },
      { icon: "📊", title: "Мониторинг", text: "Қан глюкозасын, салмақты, қан қысымын бақылаңыз." },
      { icon: "🏋️", title: "Белсенді өмір салты", text: "Аптасына кемінде 150 минут орташа қарқынды жаттығу." },
      { icon: "🥦", title: "Салауатты тамақтану", text: "Жемістер, көкөністер, цельнозернді өнімдер, омега-3." },
    ],
    low: [
      { icon: "✅", title: "Жақсы нәтиже!", text: "Тәуекел факторлары аз. Салауатты өмір салтын жалғастырыңыз." },
      { icon: "📅", title: "Жоспарлы тексеру", text: "Жылына 1 рет профилактикалық тексеру жеткілікті." },
      { icon: "🏃‍♂️", title: "Белсенділікті сақтаңыз", text: "Тұрақты физикалық белсенділік — ең жақсы алдын алу." },
      { icon: "💧", title: "Су ішіңіз", text: "Күніне 1.5-2 литр таза су ішіңіз." },
    ],
  };
  return recs[level] || recs.low;
}

/* ═══════════════ EPIDEMIOLOGY DATA ═══════════════ */
const kzRegionData = [
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

/* ═══════════════ TABS & STEPS ═══════════════ */
const tabs = [
  { id: "input", label: "Деректер енгізу", shortLabel: "Енгізу", icon: "📋" },
  { id: "results", label: "Нәтижелер", shortLabel: "Нәтиже", icon: "📊" },
  { id: "analytics", label: "Аналитика", shortLabel: "Талдау", icon: "📈" },
  { id: "epidemiology", label: "Эпидемиология", shortLabel: "Эпид.", icon: "🗺️" },
];

const steps = [
  { id: 1, label: "Негізгі мәлімет", icon: "👤" },
  { id: 2, label: "Симптомдар", icon: "🩺" },
  { id: 3, label: "Ауру тарихы", icon: "📋" },
  { id: 4, label: "Анализдер", icon: "🔬" },
];

/* ═══════════════ MAIN APP ═══════════════ */
export default function DiabetesDetectionApp() {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;

  const [activeTab, setActiveTab] = useState("input");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [hasLabs, setHasLabs] = useState(null);
  const [result, setResult] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const set = (id, val) => setFormData(p => ({ ...p, [id]: val }));

  const handleAnalyze = () => {
    const risk = calculateRisk(formData, hasLabs === true);
    setResult(risk);
    setActiveTab("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData({}); setResult(null); setHasLabs(null); setCurrentStep(1); setActiveTab("input");
  };

  const answeredCount = Object.keys(formData).filter(k => formData[k] !== "" && formData[k] !== undefined).length;

  // BMI calculation
  let bmiValue = null, bmiLabel = "", bmiColor = C.textDim;
  if (formData.weight && formData.height) {
    const wt = parseFloat(formData.weight), ht = parseFloat(formData.height) / 100;
    if (wt > 0 && ht > 0) {
      bmiValue = wt / (ht * ht);
      if (bmiValue < 18.5) { bmiLabel = "Арықтық"; bmiColor = C.info; }
      else if (bmiValue < 25) { bmiLabel = "Қалыпты"; bmiColor = C.safe; }
      else if (bmiValue < 30) { bmiLabel = "Артық салмақ"; bmiColor = C.warning; }
      else if (bmiValue < 35) { bmiLabel = "1-дәр. семіздік"; bmiColor = C.danger; }
      else if (bmiValue < 40) { bmiLabel = "2-дәр. семіздік"; bmiColor = C.danger; }
      else { bmiLabel = "3-дәр. семіздік"; bmiColor = "#7f1d1d"; }
    }
  }

  const inputStyle = (id) => ({
    width: "100%", padding: isMobile ? "14px" : "12px 14px", borderRadius: "10px",
    border: `1.5px solid ${formData[id] ? C.accent + "66" : C.border}`,
    background: formData[id] ? C.accentLight : C.white,
    color: C.text, fontSize: isMobile ? "16px" : "15px", fontWeight: 600,
    fontFamily: "monospace", outline: "none", transition: "all 0.2s ease",
    WebkitAppearance: "none",
  });

  const selectStyle = (id) => ({
    width: "100%", padding: isMobile ? "14px" : "12px 14px", borderRadius: "10px",
    border: `1.5px solid ${formData[id] ? C.accent + "66" : C.border}`,
    background: formData[id] ? C.accentLight : C.white,
    color: C.text, fontSize: isMobile ? "15px" : "14px", fontWeight: 500,
    outline: "none", cursor: "pointer", WebkitAppearance: "none", appearance: "none",
  });

  const SymBtn = ({ qId, value, label, active }) => (
    <button onClick={() => set(qId, value)} style={{
      padding: isMobile ? "10px 14px" : "7px 16px", borderRadius: "8px",
      fontSize: isMobile ? "14px" : "13px", fontWeight: 600,
      border: active ? `2px solid ${value === "yes" ? C.danger : value === "sometimes" ? C.warning : C.safe}` : `1.5px solid ${C.border}`,
      background: active ? (value === "yes" ? C.dangerBg : value === "sometimes" ? C.warningBg : C.safeBg) : C.white,
      color: active ? (value === "yes" ? C.danger : value === "sometimes" ? C.warning : C.safe) : C.textMid,
      cursor: "pointer", transition: "all 0.15s ease", flex: 1, minWidth: 0,
    }}>{label}</button>
  );

  const HistBtn = ({ qId, value, label, active }) => (
    <button onClick={() => set(qId, value)} style={{
      padding: isMobile ? "10px 12px" : "7px 14px", borderRadius: "8px",
      fontSize: isMobile ? "14px" : "13px", fontWeight: 600,
      border: active ? `2px solid ${value === "yes" ? C.danger : value === "unknown" ? C.warning : C.safe}` : `1.5px solid ${C.border}`,
      background: active ? (value === "yes" ? C.dangerBg : value === "unknown" ? C.warningBg : C.safeBg) : C.white,
      color: active ? (value === "yes" ? C.danger : value === "unknown" ? C.warning : C.safe) : C.textMid,
      cursor: "pointer", transition: "all 0.15s ease", flex: 1,
    }}>{label}</button>
  );

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Segoe UI', 'SF Pro Display', -apple-system, sans-serif",
      color: C.text, overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ═══ HEADER ═══ */}
      <header style={{
        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
        padding: isMobile ? "16px" : "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(13,148,136,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: isMobile ? "24px" : "28px" }}>🩺</span>
          <div>
            <h1 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              DiabetScan
            </h1>
            {!isMobile && (
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                Қант диабетін ерте анықтау жүйесі
              </p>
            )}
          </div>
        </div>

        {/* Desktop/Tablet Tabs */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "4px" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: isTablet ? "8px 14px" : "8px 20px", borderRadius: "10px", border: "none",
                background: activeTab === t.id ? "#fff" : "transparent",
                color: activeTab === t.id ? C.accent : "rgba(255,255,255,0.8)",
                fontWeight: 700, fontSize: isTablet ? "12px" : "13px", cursor: "pointer",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px",
              }}>
                <span>{t.icon}</span>{isTablet ? t.shortLabel : t.label}
              </button>
            ))}
          </div>
        )}

        {/* Progress badge */}
        <div style={{
          background: "rgba(255,255,255,0.2)", borderRadius: "10px", padding: "6px 14px",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span style={{ fontSize: "14px" }}>📝</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{answeredCount}</span>
        </div>
      </header>

      {/* ═══ MOBILE BOTTOM TAB BAR ═══ */}
      {isMobile && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "#fff", borderTop: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-around", padding: "6px 0 env(safe-area-inset-bottom, 8px)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: "2px", padding: "6px 4px", border: "none", background: "transparent", cursor: "pointer",
              color: activeTab === t.id ? C.accent : C.textDim,
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: "20px" }}>{t.icon}</span>
              <span style={{ fontSize: "10px", fontWeight: activeTab === t.id ? 700 : 500 }}>{t.shortLabel}</span>
            </button>
          ))}
        </nav>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{
        maxWidth: "900px", margin: "0 auto",
        padding: isMobile ? "16px 12px 90px" : "28px 24px 40px",
      }}>

        {/* ═══ INPUT TAB ═══ */}
        {activeTab === "input" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Step indicator */}
            <div style={{
              display: "flex", gap: isMobile ? "4px" : "8px", justifyContent: "center",
              flexWrap: "wrap",
            }}>
              {steps.map(s => (
                <button key={s.id} onClick={() => setCurrentStep(s.id)} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: isMobile ? "8px 12px" : "10px 18px",
                  borderRadius: "12px", border: "none", cursor: "pointer",
                  background: currentStep === s.id ? C.accent : C.card,
                  color: currentStep === s.id ? "#fff" : C.textMid,
                  fontWeight: 700, fontSize: isMobile ? "12px" : "14px",
                  boxShadow: currentStep === s.id ? "0 4px 12px rgba(13,148,136,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
                  transition: "all 0.2s",
                }}>
                  <span>{s.icon}</span>
                  {(!isMobile || currentStep === s.id) && <span>{s.label}</span>}
                </button>
              ))}
            </div>

            {/* STEP 1: Basic info */}
            {currentStep === 1 && (
              <Card>
                <SectionHeader icon="👤" title="Жеке мәліметтер мен антропометрия" subtitle="Негізгі көрсеткіштерді енгізіңіз" />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "16px",
                }}>
                  {basicFactors.map(f => (
                    <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{f.icon}</span>{f.label}
                      </label>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input type="number" inputMode="decimal" step="0.1" min={f.min} max={f.max}
                          value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)}
                          placeholder={`${f.min} — ${f.max}`} style={inputStyle(f.id)} />
                        <span style={{
                          fontSize: "11px", color: C.textDim, padding: "8px 10px",
                          background: C.cardAlt, borderRadius: "8px", whiteSpace: "nowrap", fontWeight: 600,
                        }}>{f.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BMI indicator */}
                {bmiValue && (
                  <div style={{
                    marginTop: "16px", padding: "16px", borderRadius: "12px",
                    background: `${bmiColor}10`, border: `1.5px solid ${bmiColor}33`,
                    display: "flex", alignItems: "center", gap: "16px",
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}>
                    <span style={{ fontSize: "24px" }}>⚖️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", color: C.textDim, fontWeight: 600 }}>BMI автоматты есептелді</div>
                      <div style={{ fontSize: "11px", color: C.textDim, marginTop: "2px" }}>
                        {formData.weight} кг ÷ ({formData.height} см)² = {bmiValue.toFixed(1)} кг/м²
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: "22px", fontWeight: 900, color: bmiColor, fontFamily: "monospace" }}>{bmiValue.toFixed(1)}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: bmiColor }}>{bmiLabel}</span>
                    </div>
                  </div>
                )}

                {/* Lifestyle */}
                <div style={{ marginTop: "24px" }}>
                  <SectionHeader icon="🏃" title="Өмір салты" subtitle="Күнделікті әдеттеріңіз" />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                    gap: "16px",
                  }}>
                    {lifestyleFactors.map(f => (
                      <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{f.icon}</span>{f.label}
                        </label>
                        <select value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)} style={selectStyle(f.id)}>
                          <option value="">Таңдаңыз...</option>
                          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button onClick={() => setCurrentStep(2)} style={{
                    padding: isMobile ? "14px 28px" : "12px 28px", borderRadius: "12px", border: "none",
                    background: C.accent, color: "#fff", fontWeight: 700, fontSize: "15px",
                    cursor: "pointer", boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
                    width: isMobile ? "100%" : "auto",
                  }}>Келесі →</button>
                </div>
              </Card>
            )}

            {/* STEP 2: Symptoms */}
            {currentStep === 2 && (
              <Card>
                <SectionHeader icon="🩺" title="Симптомдар" subtitle="Соңғы 3 айда байқалған белгілерді белгілеңіз" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {symptomQuestions.map(q => (
                    <div key={q.id} style={{
                      display: "flex", flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "stretch" : "center",
                      gap: isMobile ? "8px" : "12px",
                      padding: "12px", borderRadius: "10px",
                      background: formData[q.id] ? C.cardAlt : "transparent",
                      border: `1px solid ${formData[q.id] ? C.border : "transparent"}`,
                    }}>
                      <div style={{
                        flex: 1, fontSize: "14px", fontWeight: 500, color: C.text,
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        <span>{q.icon}</span>{q.label}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <SymBtn qId={q.id} value="yes" label="Иә" active={formData[q.id] === "yes"} />
                        <SymBtn qId={q.id} value="sometimes" label="Кейде" active={formData[q.id] === "sometimes"} />
                        <SymBtn qId={q.id} value="no" label="Жоқ" active={formData[q.id] === "no"} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
                  <button onClick={() => setCurrentStep(1)} style={{
                    padding: "12px 28px", borderRadius: "12px", border: `2px solid ${C.border}`,
                    background: C.white, color: C.textMid, fontWeight: 700, fontSize: "15px", cursor: "pointer",
                    width: isMobile ? "100%" : "auto",
                  }}>← Артқа</button>
                  <button onClick={() => setCurrentStep(3)} style={{
                    padding: "12px 28px", borderRadius: "12px", border: "none",
                    background: C.accent, color: "#fff", fontWeight: 700, fontSize: "15px",
                    cursor: "pointer", boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
                    width: isMobile ? "100%" : "auto",
                  }}>Келесі →</button>
                </div>
              </Card>
            )}

            {/* STEP 3: Medical History */}
            {currentStep === 3 && (
              <Card>
                <SectionHeader icon="📋" title="Ауру тарихы" subtitle="Сіздегі немесе бұрынғы диагноздар" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {medicalHistory.map(q => (
                    <div key={q.id} style={{
                      display: "flex", flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "stretch" : "center",
                      gap: isMobile ? "8px" : "12px",
                      padding: "12px", borderRadius: "10px",
                      background: formData[q.id] ? C.cardAlt : "transparent",
                      border: `1px solid ${formData[q.id] ? C.border : "transparent"}`,
                    }}>
                      <div style={{
                        flex: 1, fontSize: "14px", fontWeight: 500, color: C.text,
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        <span>{q.icon}</span>{q.label}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <HistBtn qId={q.id} value="yes" label="Иә" active={formData[q.id] === "yes"} />
                        <HistBtn qId={q.id} value="no" label="Жоқ" active={formData[q.id] === "no"} />
                        <HistBtn qId={q.id} value="unknown" label="Белгісіз" active={formData[q.id] === "unknown"} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
                  <button onClick={() => setCurrentStep(2)} style={{
                    padding: "12px 28px", borderRadius: "12px", border: `2px solid ${C.border}`,
                    background: C.white, color: C.textMid, fontWeight: 700, fontSize: "15px", cursor: "pointer",
                    width: isMobile ? "100%" : "auto",
                  }}>← Артқа</button>
                  <button onClick={() => setCurrentStep(4)} style={{
                    padding: "12px 28px", borderRadius: "12px", border: "none",
                    background: C.accent, color: "#fff", fontWeight: 700, fontSize: "15px",
                    cursor: "pointer", boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
                    width: isMobile ? "100%" : "auto",
                  }}>Келесі →</button>
                </div>
              </Card>
            )}

            {/* STEP 4: Lab data */}
            {currentStep === 4 && (
              <Card>
                <SectionHeader icon="🔬" title="Зертханалық анализдер" subtitle="Анализ нәтижелеріңіз болса, енгізіңіз" />

                {hasLabs === null && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "24px 0" }}>
                    <p style={{ fontSize: "16px", fontWeight: 600, color: C.textMid, textAlign: "center" }}>
                      Сіздің зертханалық анализ нәтижелеріңіз бар ма?
                    </p>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                      <button onClick={() => setHasLabs(true)} style={{
                        padding: "14px 32px", borderRadius: "12px", border: `2px solid ${C.accent}`,
                        background: C.accentLight, color: C.accent, fontWeight: 700, fontSize: "15px",
                        cursor: "pointer",
                      }}>✅ Иә, бар</button>
                      <button onClick={() => setHasLabs(false)} style={{
                        padding: "14px 32px", borderRadius: "12px", border: `2px solid ${C.border}`,
                        background: C.white, color: C.textMid, fontWeight: 700, fontSize: "15px",
                        cursor: "pointer",
                      }}>❌ Жоқ</button>
                    </div>
                  </div>
                )}

                {hasLabs === true && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                    gap: "16px",
                  }}>
                    {labFactors.map(f => (
                      <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{f.icon}</span>{f.label}
                        </label>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input type="number" inputMode="decimal" step="0.1" min={f.min} max={f.max}
                            value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)}
                            placeholder={`${f.min} — ${f.max}`} style={inputStyle(f.id)} />
                          <span style={{
                            fontSize: "11px", color: C.textDim, padding: "8px 10px",
                            background: C.cardAlt, borderRadius: "8px", whiteSpace: "nowrap", fontWeight: 600,
                          }}>{f.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {hasLabs === false && (
                  <div style={{
                    padding: "20px", borderRadius: "12px", background: C.infoBg,
                    border: `1px solid ${C.info}22`, textAlign: "center",
                  }}>
                    <p style={{ fontSize: "14px", color: C.info, fontWeight: 600, margin: 0 }}>
                      Анализсіз де бағалау жүргізуге болады. Нәтиже дәлдігі төмен болуы мүмкін.
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
                  <button onClick={() => setCurrentStep(3)} style={{
                    padding: "12px 28px", borderRadius: "12px", border: `2px solid ${C.border}`,
                    background: C.white, color: C.textMid, fontWeight: 700, fontSize: "15px", cursor: "pointer",
                    width: isMobile ? "100%" : "auto",
                  }}>← Артқа</button>
                  <button onClick={handleAnalyze} style={{
                    padding: isMobile ? "16px 28px" : "14px 36px", borderRadius: "12px", border: "none",
                    background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                    color: "#fff", fontWeight: 800, fontSize: "16px",
                    cursor: "pointer", boxShadow: "0 4px 16px rgba(13,148,136,0.4)",
                    width: isMobile ? "100%" : "auto",
                    letterSpacing: "0.5px",
                  }}>🔍 Талдау жүргізу</button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ═══ RESULTS TAB ═══ */}
        {activeTab === "results" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Risk Level Card */}
            <Card style={{ background: result.levelBg, border: `2px solid ${result.levelColor}33`, textAlign: "center", padding: isMobile ? "28px 16px" : "36px" }}>
              <div style={{
                width: isMobile ? "100px" : "120px", height: isMobile ? "100px" : "120px",
                borderRadius: "50%", margin: "0 auto 16px",
                background: `conic-gradient(${result.levelColor} ${result.pct * 3.6}deg, ${C.border}22 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: isMobile ? "80px" : "96px", height: isMobile ? "80px" : "96px",
                  borderRadius: "50%", background: result.levelBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column",
                }}>
                  <span style={{ fontSize: isMobile ? "28px" : "32px", fontWeight: 900, color: result.levelColor, fontFamily: "monospace" }}>{result.pct}%</span>
                </div>
              </div>
              <h2 style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: 900, color: result.levelColor, margin: "0 0 8px" }}>
                {result.levelLabel}
              </h2>
              <p style={{ fontSize: "14px", color: C.textMid, margin: 0 }}>
                Балл: {result.score} / {result.maxPossible}
              </p>
              {result.unanswered.length > 0 && (
                <p style={{ fontSize: "12px", color: C.textDim, marginTop: "12px" }}>
                  Толтырылмаған: {result.unanswered.join(", ")}
                </p>
              )}
            </Card>

            {/* Factors breakdown */}
            <Card>
              <SectionHeader icon="📊" title="Факторлар бойынша бөлу" />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.factors.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                    <span style={{
                      width: isMobile ? "100%" : "140px", fontSize: "13px", fontWeight: 600, color: C.textMid,
                      flexShrink: 0,
                    }}>{f.name}</span>
                    <div style={{ flex: 1, height: "10px", background: C.borderLight, borderRadius: "5px", overflow: "hidden", minWidth: "100px" }}>
                      <div style={{
                        width: `${(f.score / f.max) * 100}%`, height: "100%", borderRadius: "5px",
                        background: f.status === "danger" ? C.danger : f.status === "warning" ? C.warning : C.safe,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: C.textMid, whiteSpace: "nowrap" }}>
                      {f.score}/{f.max}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card>
              <SectionHeader icon="💡" title="Ұсыныстар" />
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: "12px",
              }}>
                {getRecommendations(result.level).map((r, i) => (
                  <div key={i} style={{
                    padding: "16px", borderRadius: "12px", background: C.cardAlt,
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{r.icon}</span>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, color: C.text, margin: 0 }}>{r.title}</h4>
                    </div>
                    <p style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reset button */}
            <div style={{ textAlign: "center" }}>
              <button onClick={handleReset} style={{
                padding: "14px 36px", borderRadius: "12px", border: `2px solid ${C.accent}`,
                background: C.white, color: C.accent, fontWeight: 700, fontSize: "15px",
                cursor: "pointer", width: isMobile ? "100%" : "auto",
              }}>🔄 Қайта бастау</button>
            </div>
          </div>
        )}

        {activeTab === "results" && !result && (
          <Card style={{ textAlign: "center", padding: "48px 24px" }}>
            <span style={{ fontSize: "48px" }}>📊</span>
            <h3 style={{ fontSize: "18px", color: C.textMid, marginTop: "16px" }}>Нәтиже жоқ</h3>
            <p style={{ fontSize: "14px", color: C.textDim }}>Алдымен деректер енгізіп, талдау жүргізіңіз</p>
            <button onClick={() => setActiveTab("input")} style={{
              marginTop: "16px", padding: "12px 28px", borderRadius: "12px", border: "none",
              background: C.accent, color: "#fff", fontWeight: 700, cursor: "pointer",
            }}>Деректерді енгізу →</button>
          </Card>
        )}

        {/* ═══ ANALYTICS TAB ═══ */}
        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <SectionHeader icon="📈" title="Тәуекел факторларының радар диаграммасы" />
              {result ? (
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                  <RadarChart data={result.factors.slice(0, 8).map(f => ({ name: f.name, val: Math.round((f.score / f.max) * 100), full: 100 }))}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12, fill: C.textMid }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Тәуекел" dataKey="val" stroke={C.accent} fill={C.accent} fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: "center", color: C.textDim, padding: "40px 0" }}>Алдымен талдау жүргізіңіз</p>
              )}
            </Card>

            <Card>
              <SectionHeader icon="📊" title="Факторлар салыстырмасы" />
              {result ? (
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                  <BarChart data={result.factors} layout="vertical" margin={{ left: isMobile ? 10 : 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: C.textDim }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: isMobile ? 10 : 12, fill: C.textMid }} width={isMobile ? 80 : 120} />
                    <Tooltip />
                    <Bar dataKey="score" fill={C.accent} radius={[0, 6, 6, 0]} />
                    <Bar dataKey="max" fill={C.border} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: "center", color: C.textDim, padding: "40px 0" }}>Алдымен талдау жүргізіңіз</p>
              )}
            </Card>
          </div>
        )}

        {/* ═══ EPIDEMIOLOGY TAB ═══ */}
        {activeTab === "epidemiology" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <SectionHeader icon="🗺️" title="ҚР аймақтары бойынша қант диабеті таралуы" subtitle="1000 адамға шаққанда" />
              <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                <BarChart data={kzRegionData} margin={{ left: isMobile ? 0 : 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="region" tick={{ fontSize: isMobile ? 9 : 12, fill: C.textMid }} angle={isMobile ? -45 : 0} textAnchor={isMobile ? "end" : "middle"} height={isMobile ? 80 : 40} />
                  <YAxis tick={{ fontSize: 12, fill: C.textDim }} />
                  <Tooltip />
                  <Bar dataKey="rate" fill={C.accent} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionHeader icon="👥" title="Жас және жыныс бойынша таралу" subtitle="%" />
              <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="group" tick={{ fontSize: 12, fill: C.textMid }} />
                  <YAxis tick={{ fontSize: 12, fill: C.textDim }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "13px" }} />
                  <Bar dataKey="male" name="Ерлер" fill={C.info} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="female" name="Әйелдер" fill={C.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "12px",
            }}>
              {[
                { title: "IDF деректері (2025)", text: "Әлемде 537 млн адам қант диабетімен ауырады. 2045 жылға қарай 783 млн болады деп болжануда.", color: C.info, bg: C.infoBg },
                { title: "Қазақстан статистикасы", text: "ҚР-да 1.5 млн-нан астам адам ҚД-мен тіркелген. Нақты сан 2-3 есе көп болуы мүмкін.", color: C.accent, bg: C.accentLight },
                { title: "Ерте анықтау маңызы", text: "Диабетті ерте анықтау асқынуларды 50-70%-ға азайтады. Преддиабет кезеңінде өмір салтын өзгерту арқылы аурудың алдын алуға болады.", color: C.safe, bg: C.safeBg },
                { title: "Диагноз қойылмаған", text: "ДДҰ мәліметі бойынша науқастардың ~40%-ы диагноз қойылмаған.", color: C.warning, bg: C.warningBg },
              ].map((f, i) => (
                <Card key={i} style={{ background: f.bg, border: `1px solid ${f.color}22` }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: f.color, margin: "0 0 8px" }}>{f.title}</h4>
                  <p style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.7, margin: 0 }}>{f.text}</p>
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
      <footer style={{
        textAlign: "center",
        padding: isMobile ? "16px 12px 80px" : "24px",
        borderTop: `1px solid ${C.border}`, marginTop: "32px", background: C.white,
      }}>
        <p style={{ fontSize: "11px", color: C.textDim, margin: 0 }}>
          DiabetScan v2.0 • Қант диабетін ерте анықтау жүйесі • Медициналық диагноз емес, тәуекелді бағалау құралы
        </p>
      </footer>

      <style>{`
        input:focus, select:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accent}18; }
        input::placeholder { color: ${C.textDim}; }
        button:hover { opacity: 0.92; transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html { -webkit-text-size-adjust: 100%; }
        @media (max-width: 767px) {
          html { font-size: 16px; }
          input, select, textarea { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}

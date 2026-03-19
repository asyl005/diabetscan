import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, AreaChart, Area
} from "recharts";

/* ═══════════════ COLORS ═══════════════ */
const C = {
  white: "#ffffff", bg: "#f0f4f8", card: "#ffffff", cardAlt: "#f7f9fc",
  accent: "#0d9488", accentLight: "#f0fdfa", accentDark: "#0f766e",
  danger: "#dc2626", dangerBg: "#fef2f2",
  warning: "#d97706", warningBg: "#fffbeb",
  info: "#2563eb", infoBg: "#eff6ff",
  safe: "#16a34a", safeBg: "#f0fdf4",
  purple: "#7c3aed", purpleBg: "#f5f3ff",
  text: "#1e293b", textMid: "#475569", textDim: "#94a3b8",
  border: "#e2e8f0", borderLight: "#f1f5f9",
};

/* ═══════════════ HOOKS ═══════════════ */
function useWindowSize() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}

/* ═══════════════ COMPONENTS ═══════════════ */
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card, borderRadius: "16px", padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${C.border}`,
    transition: "all 0.2s ease", cursor: onClick ? "pointer" : "default", ...style,
  }}>{children}</div>
);

/* ═══════════════ DATA ═══════════════ */
const basicFactors = [
  { id: "age", label: "Жасы", min: 18, max: 100, unit: "жас", icon: "👤" },
  { id: "weight", label: "Салмағы", min: 30, max: 250, unit: "кг", icon: "⚖️" },
  { id: "height", label: "Бойы", min: 100, max: 230, unit: "см", icon: "📐" },
  { id: "bp", label: "Қан қысымы (систолалық)", min: 80, max: 220, unit: "мм", icon: "💓" },
  { id: "waist", label: "Бел шеңбері", min: 50, max: 180, unit: "см", icon: "📏" },
];

const lifestyleFactors = [
  { id: "activity", label: "Физикалық белсенділік", icon: "🏃", options: [
    { value: "high", label: "Жоғары (5+ рет/апта)" }, { value: "moderate", label: "Орташа (2-4 рет)" },
    { value: "low", label: "Төмен (1 рет)" }, { value: "sedentary", label: "Отырықшы" },
  ]},
  { id: "smoking", label: "Темекі", icon: "🚬", options: [
    { value: "never", label: "Ешқашан" }, { value: "former", label: "Бұрын" }, { value: "current", label: "Қазір шегемін" },
  ]},
  { id: "diet", label: "Тамақтану", icon: "🥗", options: [
    { value: "healthy", label: "Салауатты" }, { value: "moderate", label: "Аралас" }, { value: "unhealthy", label: "Фаст-фуд көп" },
  ]},
  { id: "family", label: "Отбасылық анамнез", icon: "👨‍👩‍👧", options: [
    { value: "none", label: "Жоқ" }, { value: "distant", label: "Алыс туыстарда" }, { value: "close", label: "Жақын туыстарда" },
  ]},
];

const symptomQuestions = [
  { id: "thirst", label: "Шөлдеу күшейді ме?", icon: "💧" },
  { id: "dryMouth", label: "Ауыз құрғайды ма?", icon: "👄" },
  { id: "fatigue", label: "Шаршағыштық бар ма?", icon: "😴" },
  { id: "frequentUrination", label: "Жиі зәр шығу?", icon: "🚻" },
  { id: "blurredVision", label: "Көру бұлдырлады ма?", icon: "👁️" },
  { id: "slowHealing", label: "Жаралар баяу жазыла ма?", icon: "🩹" },
  { id: "numbness", label: "Қол-аяқта ұю бар ма?", icon: "🖐️" },
  { id: "weightChange", label: "Салмақ кенет өзгерді ме?", icon: "📉" },
  { id: "hunger", label: "Аштық күшейді ме?", icon: "🍽️" },
  { id: "skinDarkening", label: "Терінің қараюы бар ма?", icon: "🔲" },
  { id: "itching", label: "Тері қышуы бар ма?", icon: "🤚" },
  { id: "infections", label: "Жиі инфекциялар?", icon: "🦠" },
];

const medicalHistory = [
  { id: "cardiovascular", label: "Жүрек-қан тамырлары ауруы", icon: "❤️" },
  { id: "kidney", label: "Бүйрек ауруы", icon: "🫘" },
  { id: "hypertension", label: "Гипертензия", icon: "🩺" },
  { id: "pcos", label: "PCOS (поликистоз)", icon: "♀️" },
  { id: "gestational", label: "Гестациялық диабет", icon: "🤰" },
  { id: "prediabetes", label: "Преддиабет", icon: "⚠️" },
];

const labFactors = [
  { id: "glucose", label: "Глюкоза (аш қарынға)", min: 3, max: 20, unit: "ммоль/л", icon: "🩸" },
  { id: "hba1c", label: "HbA1c", min: 3, max: 15, unit: "%", icon: "🔬" },
  { id: "cholesterol", label: "Холестерин", min: 2, max: 12, unit: "ммоль/л", icon: "🧪" },
  { id: "triglycerides", label: "Триглицеридтер", min: 0.3, max: 10, unit: "ммоль/л", icon: "💉" },
];

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

/* ═══════════════ RISK CALCULATION ═══════════════ */
function calculateRisk(data, hasLabData) {
  let score = 0, maxPossible = 0;
  const factors = [], unanswered = [];

  if (data.age) { const a = +data.age; maxPossible += 10; const s = a >= 65 ? 10 : a >= 45 ? 6 : a >= 35 ? 3 : 1; score += s; factors.push({ name: "Жас", score: s, max: 10, status: s >= 8 ? "danger" : s >= 3 ? "warning" : "safe" }); } else unanswered.push("Жас");

  let bmi = null;
  if (data.weight && data.height) { bmi = +data.weight / ((+data.height / 100) ** 2); }
  if (bmi) { maxPossible += 15; const s = bmi >= 35 ? 15 : bmi >= 30 ? 12 : bmi >= 25 ? 7 : 1; score += s; factors.push({ name: `BMI (${bmi.toFixed(1)})`, score: s, max: 15, status: s >= 10 ? "danger" : s >= 5 ? "warning" : "safe" }); } else unanswered.push("BMI");

  if (data.bp) { const b = +data.bp; maxPossible += 8; const s = b >= 160 ? 8 : b >= 140 ? 5 : b >= 130 ? 3 : 0; score += s; factors.push({ name: "Қан қысымы", score: s, max: 8, status: s >= 5 ? "danger" : s >= 3 ? "warning" : "safe" }); } else unanswered.push("Қан қысымы");
  if (data.waist) { const w = +data.waist; maxPossible += 8; const s = w >= 102 ? 8 : w >= 88 ? 5 : 1; score += s; factors.push({ name: "Бел шеңбері", score: s, max: 8, status: s >= 5 ? "danger" : s >= 3 ? "warning" : "safe" }); }

  const lm = { activity: { sedentary: 6, low: 4, moderate: 2, high: 0 }, smoking: { current: 4, former: 2, never: 0 }, diet: { unhealthy: 5, moderate: 2, healthy: 0 }, family: { close: 10, distant: 5, none: 0 } };
  const lmax = { activity: 6, smoking: 4, diet: 5, family: 10 };
  const lnames = { activity: "Белсенділік", smoking: "Темекі", diet: "Тамақтану", family: "Отбасылық анамнез" };
  ["activity", "smoking", "diet", "family"].forEach(k => {
    if (data[k]) { maxPossible += lmax[k]; const s = lm[k][data[k]] || 0; score += s; factors.push({ name: lnames[k], score: s, max: lmax[k], status: s >= lmax[k] * 0.7 ? "danger" : s >= lmax[k] * 0.3 ? "warning" : "safe" }); }
  });

  let symS = 0, symM = 0;
  symptomQuestions.forEach(q => { if (data[q.id]) { symM += 3; symS += ({ yes: 3, sometimes: 1.5, no: 0 }[data[q.id]] || 0); } });
  if (symM > 0) { const n = Math.round((symS / symM) * 20); maxPossible += 20; score += n; factors.push({ name: "Симптомдар", score: n, max: 20, status: n >= 14 ? "danger" : n >= 7 ? "warning" : "safe" }); }

  let hS = 0, hM = 0;
  medicalHistory.forEach(q => { if (data[q.id]) { hM += 4; hS += ({ yes: 4, no: 0, unknown: 1 }[data[q.id]] || 0); } });
  if (hM > 0) { const n = Math.round((hS / hM) * 12); maxPossible += 12; score += n; factors.push({ name: "Ауру тарихы", score: n, max: 12, status: n >= 8 ? "danger" : n >= 4 ? "warning" : "safe" }); }

  if (hasLabData) {
    if (data.glucose) { const g = +data.glucose; maxPossible += 15; const s = g >= 7 ? 15 : g >= 5.6 ? 8 : 0; score += s; factors.push({ name: "Глюкоза", score: s, max: 15, status: s >= 10 ? "danger" : s >= 5 ? "warning" : "safe" }); }
    if (data.hba1c) { const h = +data.hba1c; maxPossible += 15; const s = h >= 6.5 ? 15 : h >= 5.7 ? 8 : 0; score += s; factors.push({ name: "HbA1c", score: s, max: 15, status: s >= 10 ? "danger" : s >= 5 ? "warning" : "safe" }); }
    if (data.cholesterol) { const c = +data.cholesterol; maxPossible += 5; const s = c >= 6.2 ? 5 : c >= 5.2 ? 3 : 0; score += s; factors.push({ name: "Холестерин", score: s, max: 5, status: s >= 4 ? "danger" : s >= 2 ? "warning" : "safe" }); }
    if (data.triglycerides) { const t = +data.triglycerides; maxPossible += 5; const s = t >= 2.3 ? 5 : t >= 1.7 ? 3 : 0; score += s; factors.push({ name: "Триглицеридтер", score: s, max: 5, status: s >= 4 ? "danger" : s >= 2 ? "warning" : "safe" }); }
  }

  const pct = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
  let level, levelColor, levelBg, levelLabel;
  if (pct >= 70) { level = "high"; levelColor = C.danger; levelBg = C.dangerBg; levelLabel = "Жоғары тәуекел"; }
  else if (pct >= 40) { level = "moderate"; levelColor = C.warning; levelBg = C.warningBg; levelLabel = "Орташа тәуекел"; }
  else { level = "low"; levelColor = C.safe; levelBg = C.safeBg; levelLabel = "Төмен тәуекел"; }
  return { score, maxPossible, pct, level, levelColor, levelBg, levelLabel, factors, unanswered };
}

function getRecommendations(level) {
  const r = {
    high: [
      { icon: "🏥", title: "Дәрігерге жүгініңіз", text: "Эндокринологқа жедел жазылыңыз. Толық тексеру қажет." },
      { icon: "🩸", title: "Анализдер тапсырыңыз", text: "Аш қарынға глюкоза, HbA1c, липидтік профиль." },
      { icon: "🥗", title: "Тамақтануды өзгертіңіз", text: "Қант, ақ нан, газды сусындарды қысқартыңыз." },
      { icon: "🏃", title: "Физикалық белсенділік", text: "Күнделікті 30 минут серуендеңіз." },
    ],
    moderate: [
      { icon: "👨‍⚕️", title: "Профилактикалық тексеру", text: "Жылына 1-2 рет эндокринологта тексеріліңіз." },
      { icon: "📊", title: "Мониторинг", text: "Қан глюкозасын, салмақты бақылаңыз." },
      { icon: "🏋️", title: "Белсенді өмір салты", text: "Аптасына 150 минут жаттығу." },
      { icon: "🥦", title: "Салауатты тамақтану", text: "Көкөністер, цельнозернді өнімдер." },
    ],
    low: [
      { icon: "✅", title: "Жақсы нәтиже!", text: "Салауатты өмір салтын жалғастырыңыз." },
      { icon: "📅", title: "Жоспарлы тексеру", text: "Жылына 1 рет тексеру жеткілікті." },
      { icon: "🏃‍♂️", title: "Белсенділік", text: "Тұрақты спорт — ең жақсы алдын алу." },
      { icon: "💧", title: "Су ішіңіз", text: "Күніне 1.5-2 литр таза су." },
    ],
  };
  return r[level] || r.low;
}

/* ═══════════════ MAIN APP ═══════════════ */
export default function App() {
  const w = useWindowSize();
  const mob = w < 768;

  const [page, setPage] = useState("home");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [hasLabs, setHasLabs] = useState(null);
  const [result, setResult] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);

  const set = (id, val) => setFormData(p => ({ ...p, [id]: val }));

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleAnalyze = () => {
    setResult(calculateRisk(formData, hasLabs === true));
    setPage("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData({}); setResult(null); setHasLabs(null); setStep(1); setPage("home");
  };

  const answered = Object.keys(formData).filter(k => formData[k] !== "" && formData[k] !== undefined).length;

  let bmiVal = null, bmiLabel = "", bmiColor = C.textDim;
  if (formData.weight && formData.height) {
    bmiVal = +formData.weight / ((+formData.height / 100) ** 2);
    if (bmiVal < 18.5) { bmiLabel = "Арықтық"; bmiColor = C.info; }
    else if (bmiVal < 25) { bmiLabel = "Қалыпты"; bmiColor = C.safe; }
    else if (bmiVal < 30) { bmiLabel = "Артық салмақ"; bmiColor = C.warning; }
    else { bmiLabel = "Семіздік"; bmiColor = C.danger; }
  }

  const inp = (id) => ({
    width: "100%", padding: mob ? "14px" : "12px 14px", borderRadius: "10px",
    border: `1.5px solid ${formData[id] ? C.accent + "66" : C.border}`,
    background: formData[id] ? C.accentLight : C.white,
    color: C.text, fontSize: "16px", fontWeight: 600, fontFamily: "monospace",
    outline: "none", WebkitAppearance: "none",
  });

  const sel = (id) => ({
    width: "100%", padding: mob ? "14px" : "12px 14px", borderRadius: "10px",
    border: `1.5px solid ${formData[id] ? C.accent + "66" : C.border}`,
    background: formData[id] ? C.accentLight : C.white,
    color: C.text, fontSize: "15px", fontWeight: 500, outline: "none",
    cursor: "pointer", WebkitAppearance: "none", appearance: "none",
  });

  const TriBtn = ({ qId, value, label, active, colors }) => (
    <button onClick={() => set(qId, value)} style={{
      padding: mob ? "10px 10px" : "8px 14px", borderRadius: "8px", fontSize: mob ? "13px" : "13px", fontWeight: 600,
      border: active ? `2px solid ${colors[0]}` : `1.5px solid ${C.border}`,
      background: active ? colors[1] : C.white, color: active ? colors[0] : C.textMid,
      cursor: "pointer", flex: 1, minWidth: 0, transition: "all 0.15s",
    }}>{label}</button>
  );

  const colorMap = { yes: [C.danger, C.dangerBg], sometimes: [C.warning, C.warningBg], no: [C.safe, C.safeBg], unknown: [C.warning, C.warningBg] };

  /* ═══ BOTTOM NAV ═══ */
  const navItems = [
    { id: "home", icon: "🏠", label: "Басты" },
    { id: "test", icon: "📋", label: "Тест" },
    { id: "results", icon: "📊", label: "Нәтиже" },
    { id: "analytics", icon: "📈", label: "Талдау" },
    { id: "info", icon: "ℹ️", label: "Ақпарат" },
  ];

  const goTest = () => { setPage("test"); setStep(1); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', -apple-system, sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ═══ HEADER ═══ */}
      <header style={{
        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
        padding: mob ? "14px 16px" : "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(13,148,136,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => setPage("home")}>
          <span style={{ fontSize: mob ? "22px" : "26px" }}>🩺</span>
          <span style={{ fontSize: mob ? "18px" : "22px", fontWeight: 800, color: "#fff", fontFamily: "'Outfit',sans-serif" }}>DiabetScan</span>
        </div>
        {!mob && (
          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "4px" }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setPage(n.id === "test" ? "test" : n.id)} style={{
                padding: "8px 18px", borderRadius: "10px", border: "none",
                background: page === n.id ? "#fff" : "transparent",
                color: page === n.id ? C.accent : "rgba(255,255,255,0.8)",
                fontWeight: 700, fontSize: "13px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
              }}><span>{n.icon}</span>{n.label}</button>
            ))}
          </div>
        )}
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "10px", padding: "5px 12px" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>📝 {answered}</span>
        </div>
      </header>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      {mob && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "#fff", borderTop: `1px solid ${C.border}`,
          display: "flex", padding: "4px 0 env(safe-area-inset-bottom, 6px)",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
        }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id === "test" ? "test" : n.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: "1px", padding: "6px 2px", border: "none", background: "transparent",
              color: page === n.id ? C.accent : C.textDim, cursor: "pointer",
            }}>
              <span style={{ fontSize: "20px" }}>{n.icon}</span>
              <span style={{ fontSize: "9px", fontWeight: page === n.id ? 700 : 500 }}>{n.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* ═══ CONTENT ═══ */}
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: mob ? "16px 12px 80px" : "28px 24px 40px" }}>

        {/* ═══════ HOME PAGE ═══════ */}
        {page === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg, #0d9488 0%, #065f46 100%)",
              borderRadius: "20px", padding: mob ? "32px 20px" : "48px 40px",
              textAlign: "center", color: "#fff",
              boxShadow: "0 8px 32px rgba(13,148,136,0.3)",
            }}>
              <div style={{ fontSize: mob ? "48px" : "64px", marginBottom: "16px" }}>🩺</div>
              <h1 style={{ fontSize: mob ? "24px" : "32px", fontWeight: 900, margin: "0 0 12px", fontFamily: "'Outfit',sans-serif" }}>
                DiabetScan
              </h1>
              <p style={{ fontSize: mob ? "14px" : "16px", opacity: 0.85, margin: "0 0 24px", lineHeight: 1.6 }}>
                Деректерді талдау арқылы қант диабетін ерте анықтау жүйесі
              </p>
              <button onClick={goTest} style={{
                padding: "16px 40px", borderRadius: "14px", border: "none",
                background: "#fff", color: C.accent, fontWeight: 800, fontSize: "16px",
                cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}>🔍 Тест бастау</button>
            </div>

            {/* Install PWA banner */}
            {installPrompt && (
              <Card style={{ background: C.infoBg, border: `1px solid ${C.info}33` }} onClick={handleInstall}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "28px" }}>📱</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: C.info }}>Қосымшаны орнатыңыз</div>
                    <div style={{ fontSize: "13px", color: C.textMid, marginTop: "4px" }}>Телефонға орнатып, браузерсіз ашыңыз</div>
                  </div>
                  <span style={{ fontSize: "20px" }}>→</span>
                </div>
              </Card>
            )}

            {/* Features */}
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: "12px" }}>
              {[
                { icon: "📋", title: "4 қадам", desc: "Деректерді оңай енгізу", color: C.accent },
                { icon: "🧠", title: "AI талдау", desc: "Тәуекелді бағалау", color: C.purple },
                { icon: "📊", title: "Визуализация", desc: "Графиктер мен диаграммалар", color: C.info },
                { icon: "🇰🇿", title: "ҚР деректер", desc: "Қазақстан статистикасы", color: C.warning },
              ].map((f, i) => (
                <Card key={i} style={{ textAlign: "center", padding: "16px 12px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{f.icon}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: f.color }}>{f.title}</div>
                  <div style={{ fontSize: "11px", color: C.textDim, marginTop: "4px" }}>{f.desc}</div>
                </Card>
              ))}
            </div>

            {/* How it works */}
            <Card>
              <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔄</span> Қалай жұмыс істейді?
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { num: "1", title: "Деректерді енгізіңіз", desc: "Жас, салмақ, бой, өмір салты, симптомдар", color: C.accent },
                  { num: "2", title: "Жүйе талдау жүргізеді", desc: "20+ факторды ескеретін алгоритм", color: C.info },
                  { num: "3", title: "Нәтиже алыңыз", desc: "Тәуекел деңгейі, ұсыныстар, графиктер", color: C.purple },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                      background: s.color, color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: 800, fontSize: "16px",
                    }}>{s.num}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: C.text }}>{s.title}</div>
                      <div style={{ fontSize: "12px", color: C.textMid, marginTop: "2px" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { num: "537 млн", label: "Әлемде ҚД науқастары", icon: "🌍", bg: C.infoBg, color: C.info },
                { num: "1.5 млн+", label: "Қазақстанда тіркелген", icon: "🇰🇿", bg: C.accentLight, color: C.accent },
                { num: "~40%", label: "Диагноз қойылмаған", icon: "⚠️", bg: C.warningBg, color: C.warning },
              ].map((s, i) => (
                <Card key={i} style={{ background: s.bg, border: `1px solid ${s.color}22`, textAlign: "center" }}>
                  <span style={{ fontSize: "24px" }}>{s.icon}</span>
                  <div style={{ fontSize: "22px", fontWeight: 900, color: s.color, margin: "8px 0 4px", fontFamily: "monospace" }}>{s.num}</div>
                  <div style={{ fontSize: "12px", color: C.textMid }}>{s.label}</div>
                </Card>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{ padding: "16px", borderRadius: "12px", background: C.warningBg, border: `1px solid ${C.warning}22`, fontSize: "12px", color: C.textMid, lineHeight: 1.6, textAlign: "center" }}>
              ⚠️ DiabetScan медициналық диагноз емес, тәуекелді бағалау құралы. Нақты диагноз үшін дәрігерге жүгініңіз.
            </div>
          </div>
        )}

        {/* ═══════ TEST PAGE ═══════ */}
        {page === "test" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Step indicator */}
            <div style={{ display: "flex", gap: mob ? "4px" : "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { id: 1, label: "Негізгі", icon: "👤" }, { id: 2, label: "Симптомдар", icon: "🩺" },
                { id: 3, label: "Тарих", icon: "📋" }, { id: 4, label: "Анализдер", icon: "🔬" },
              ].map(s => (
                <button key={s.id} onClick={() => setStep(s.id)} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: mob ? "8px 12px" : "10px 18px", borderRadius: "12px", border: "none",
                  background: step === s.id ? C.accent : C.card, color: step === s.id ? "#fff" : C.textMid,
                  fontWeight: 700, fontSize: mob ? "12px" : "14px", cursor: "pointer",
                  boxShadow: step === s.id ? "0 4px 12px rgba(13,148,136,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
                }}><span>{s.icon}</span>{(!mob || step === s.id) && <span>{s.label}</span>}</button>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <Card>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px", display: "flex", alignItems: "center", gap: "8px" }}>👤 Жеке мәліметтер</h3>
                <p style={{ fontSize: "13px", color: C.textDim, margin: "0 0 16px" }}>Негізгі көрсеткіштерді енгізіңіз</p>
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
                  {basicFactors.map(f => (
                    <div key={f.id}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <span>{f.icon}</span>{f.label}
                      </label>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input type="number" inputMode="decimal" step="0.1" min={f.min} max={f.max}
                          value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)}
                          placeholder={`${f.min}–${f.max}`} style={inp(f.id)} />
                        <span style={{ fontSize: "11px", color: C.textDim, padding: "8px 8px", background: C.cardAlt, borderRadius: "8px", whiteSpace: "nowrap", fontWeight: 600 }}>{f.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {bmiVal && (
                  <div style={{ marginTop: "14px", padding: "14px", borderRadius: "12px", background: `${bmiColor}10`, border: `1.5px solid ${bmiColor}33`, display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "22px" }}>⚖️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", color: C.textDim }}>BMI автоматты</div>
                      <div style={{ fontSize: "11px", color: C.textDim }}>{formData.weight} кг ÷ ({formData.height} см)²</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: 900, color: bmiColor, fontFamily: "monospace" }}>{bmiVal.toFixed(1)}</div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: bmiColor }}>{bmiLabel}</div>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>🏃 Өмір салты</h3>
                  <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: "14px" }}>
                    {lifestyleFactors.map(f => (
                      <div key={f.id}>
                        <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                          <span>{f.icon}</span>{f.label}
                        </label>
                        <select value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)} style={sel(f.id)}>
                          <option value="">Таңдаңыз...</option>
                          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button onClick={() => setStep(2)} style={{ padding: "14px 28px", borderRadius: "12px", border: "none", background: C.accent, color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", width: mob ? "100%" : "auto" }}>Келесі →</button>
                </div>
              </Card>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <Card>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px", display: "flex", alignItems: "center", gap: "8px" }}>🩺 Симптомдар</h3>
                <p style={{ fontSize: "13px", color: C.textDim, margin: "0 0 16px" }}>Соңғы 3 айда байқалған белгілер</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {symptomQuestions.map(q => (
                    <div key={q.id} style={{ display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "stretch" : "center", gap: mob ? "8px" : "12px", padding: "10px", borderRadius: "10px", background: formData[q.id] ? C.cardAlt : "transparent" }}>
                      <div style={{ flex: 1, fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{q.icon}</span>{q.label}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <TriBtn qId={q.id} value="yes" label="Иә" active={formData[q.id] === "yes"} colors={colorMap.yes} />
                        <TriBtn qId={q.id} value="sometimes" label="Кейде" active={formData[q.id] === "sometimes"} colors={colorMap.sometimes} />
                        <TriBtn qId={q.id} value="no" label="Жоқ" active={formData[q.id] === "no"} colors={colorMap.no} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "12px", flexDirection: mob ? "column" : "row" }}>
                  <button onClick={() => setStep(1)} style={{ padding: "12px 28px", borderRadius: "12px", border: `2px solid ${C.border}`, background: C.white, color: C.textMid, fontWeight: 700, cursor: "pointer", width: mob ? "100%" : "auto" }}>← Артқа</button>
                  <button onClick={() => setStep(3)} style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: C.accent, color: "#fff", fontWeight: 700, cursor: "pointer", width: mob ? "100%" : "auto" }}>Келесі →</button>
                </div>
              </Card>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <Card>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px", display: "flex", alignItems: "center", gap: "8px" }}>📋 Ауру тарихы</h3>
                <p style={{ fontSize: "13px", color: C.textDim, margin: "0 0 16px" }}>Бұрынғы диагноздар</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {medicalHistory.map(q => (
                    <div key={q.id} style={{ display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "stretch" : "center", gap: mob ? "8px" : "12px", padding: "10px", borderRadius: "10px", background: formData[q.id] ? C.cardAlt : "transparent" }}>
                      <div style={{ flex: 1, fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{q.icon}</span>{q.label}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <TriBtn qId={q.id} value="yes" label="Иә" active={formData[q.id] === "yes"} colors={colorMap.yes} />
                        <TriBtn qId={q.id} value="no" label="Жоқ" active={formData[q.id] === "no"} colors={colorMap.no} />
                        <TriBtn qId={q.id} value="unknown" label="Белгісіз" active={formData[q.id] === "unknown"} colors={colorMap.unknown} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "12px", flexDirection: mob ? "column" : "row" }}>
                  <button onClick={() => setStep(2)} style={{ padding: "12px 28px", borderRadius: "12px", border: `2px solid ${C.border}`, background: C.white, color: C.textMid, fontWeight: 700, cursor: "pointer", width: mob ? "100%" : "auto" }}>← Артқа</button>
                  <button onClick={() => setStep(4)} style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: C.accent, color: "#fff", fontWeight: 700, cursor: "pointer", width: mob ? "100%" : "auto" }}>Келесі →</button>
                </div>
              </Card>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <Card>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px", display: "flex", alignItems: "center", gap: "8px" }}>🔬 Анализдер</h3>
                <p style={{ fontSize: "13px", color: C.textDim, margin: "0 0 16px" }}>Зертханалық нәтижелер (міндетті емес)</p>
                {hasLabs === null && (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: C.textMid, marginBottom: "16px" }}>Анализ нәтижелеріңіз бар ма?</p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button onClick={() => setHasLabs(true)} style={{ padding: "14px 28px", borderRadius: "12px", border: `2px solid ${C.accent}`, background: C.accentLight, color: C.accent, fontWeight: 700, cursor: "pointer" }}>✅ Иә</button>
                      <button onClick={() => setHasLabs(false)} style={{ padding: "14px 28px", borderRadius: "12px", border: `2px solid ${C.border}`, background: C.white, color: C.textMid, fontWeight: 700, cursor: "pointer" }}>❌ Жоқ</button>
                    </div>
                  </div>
                )}
                {hasLabs === true && (
                  <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: "14px" }}>
                    {labFactors.map(f => (
                      <div key={f.id}>
                        <label style={{ fontSize: "13px", fontWeight: 600, color: C.textMid, display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                          <span>{f.icon}</span>{f.label}
                        </label>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input type="number" inputMode="decimal" step="0.1" min={f.min} max={f.max}
                            value={formData[f.id] || ""} onChange={e => set(f.id, e.target.value)}
                            placeholder={`${f.min}–${f.max}`} style={inp(f.id)} />
                          <span style={{ fontSize: "11px", color: C.textDim, padding: "8px 8px", background: C.cardAlt, borderRadius: "8px", whiteSpace: "nowrap", fontWeight: 600 }}>{f.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {hasLabs === false && (
                  <div style={{ padding: "16px", borderRadius: "12px", background: C.infoBg, textAlign: "center" }}>
                    <p style={{ fontSize: "14px", color: C.info, fontWeight: 600, margin: 0 }}>Анализсіз де бағалау жүргізіледі</p>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", gap: "12px", flexDirection: mob ? "column" : "row" }}>
                  <button onClick={() => setStep(3)} style={{ padding: "12px 28px", borderRadius: "12px", border: `2px solid ${C.border}`, background: C.white, color: C.textMid, fontWeight: 700, cursor: "pointer", width: mob ? "100%" : "auto" }}>← Артқа</button>
                  <button onClick={handleAnalyze} style={{
                    padding: "16px 36px", borderRadius: "14px", border: "none",
                    background: "linear-gradient(135deg, #0d9488, #065f46)", color: "#fff",
                    fontWeight: 800, fontSize: "16px", cursor: "pointer", width: mob ? "100%" : "auto",
                    boxShadow: "0 4px 16px rgba(13,148,136,0.4)",
                  }}>🔍 Талдау жүргізу</button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ═══════ RESULTS PAGE ═══════ */}
        {page === "results" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card style={{ background: result.levelBg, border: `2px solid ${result.levelColor}33`, textAlign: "center", padding: mob ? "28px 16px" : "36px" }}>
              <div style={{ width: mob ? "100px" : "120px", height: mob ? "100px" : "120px", borderRadius: "50%", margin: "0 auto 16px", background: `conic-gradient(${result.levelColor} ${result.pct * 3.6}deg, ${C.border}22 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: mob ? "80px" : "96px", height: mob ? "80px" : "96px", borderRadius: "50%", background: result.levelBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: mob ? "28px" : "32px", fontWeight: 900, color: result.levelColor, fontFamily: "monospace" }}>{result.pct}%</span>
                </div>
              </div>
              <h2 style={{ fontSize: mob ? "22px" : "26px", fontWeight: 900, color: result.levelColor, margin: "0 0 8px" }}>{result.levelLabel}</h2>
              <p style={{ fontSize: "14px", color: C.textMid, margin: 0 }}>Балл: {result.score} / {result.maxPossible}</p>
            </Card>

            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px" }}>📊 Факторлар</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.factors.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: mob ? "wrap" : "nowrap" }}>
                    <span style={{ width: mob ? "100%" : "130px", fontSize: "13px", fontWeight: 600, color: C.textMid }}>{f.name}</span>
                    <div style={{ flex: 1, height: "10px", background: C.borderLight, borderRadius: "5px", overflow: "hidden", minWidth: "80px" }}>
                      <div style={{ width: `${(f.score / f.max) * 100}%`, height: "100%", borderRadius: "5px", background: f.status === "danger" ? C.danger : f.status === "warning" ? C.warning : C.safe, transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: C.textMid }}>{f.score}/{f.max}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px" }}>💡 Ұсыныстар</h3>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: "12px" }}>
                {getRecommendations(result.level).map((r, i) => (
                  <div key={i} style={{ padding: "14px", borderRadius: "12px", background: C.cardAlt, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "18px" }}>{r.icon}</span>
                      <span style={{ fontSize: "14px", fontWeight: 700 }}>{r.title}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.5, margin: 0 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ textAlign: "center", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setPage("analytics")} style={{ padding: "14px 28px", borderRadius: "12px", border: "none", background: C.accent, color: "#fff", fontWeight: 700, cursor: "pointer" }}>📈 Талдауды көру</button>
              <button onClick={handleReset} style={{ padding: "14px 28px", borderRadius: "12px", border: `2px solid ${C.accent}`, background: C.white, color: C.accent, fontWeight: 700, cursor: "pointer" }}>🔄 Қайта бастау</button>
            </div>
          </div>
        )}

        {page === "results" && !result && (
          <Card style={{ textAlign: "center", padding: "48px 24px" }}>
            <span style={{ fontSize: "48px" }}>📊</span>
            <h3 style={{ fontSize: "18px", color: C.textMid, marginTop: "16px" }}>Нәтиже жоқ</h3>
            <p style={{ fontSize: "14px", color: C.textDim }}>Алдымен тест тапсырыңыз</p>
            <button onClick={goTest} style={{ marginTop: "16px", padding: "14px 28px", borderRadius: "12px", border: "none", background: C.accent, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Тест бастау →</button>
          </Card>
        )}

        {/* ═══════ ANALYTICS PAGE ═══════ */}
        {page === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px" }}>📈 Тәуекел факторлары (радар)</h3>
              {result ? (
                <ResponsiveContainer width="100%" height={mob ? 260 : 340}>
                  <RadarChart data={result.factors.slice(0, 8).map(f => ({ name: f.name, val: Math.round((f.score / f.max) * 100), full: 100 }))}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: mob ? 9 : 12, fill: C.textMid }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="val" stroke={C.accent} fill={C.accent} fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign: "center", color: C.textDim, padding: "40px 0" }}>Алдымен тест тапсырыңыз</p>}
            </Card>
            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px" }}>📊 Факторлар салыстырмасы</h3>
              {result ? (
                <ResponsiveContainer width="100%" height={mob ? 260 : 340}>
                  <BarChart data={result.factors} layout="vertical" margin={{ left: mob ? 10 : 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: C.textDim }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: mob ? 9 : 12, fill: C.textMid }} width={mob ? 75 : 110} />
                    <Tooltip />
                    <Bar dataKey="score" fill={C.accent} radius={[0, 6, 6, 0]} />
                    <Bar dataKey="max" fill={C.border} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign: "center", color: C.textDim, padding: "40px 0" }}>Алдымен тест тапсырыңыз</p>}
            </Card>
          </div>
        )}

        {/* ═══════ INFO / EPIDEMIOLOGY PAGE ═══════ */}
        {page === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px" }}>🗺️ ҚР аймақтары бойынша таралу</h3>
              <ResponsiveContainer width="100%" height={mob ? 260 : 340}>
                <BarChart data={kzRegionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="region" tick={{ fontSize: mob ? 8 : 12, fill: C.textMid }} angle={mob ? -45 : 0} textAnchor={mob ? "end" : "middle"} height={mob ? 80 : 40} />
                  <YAxis tick={{ fontSize: 12, fill: C.textDim }} />
                  <Tooltip />
                  <Bar dataKey="rate" fill={C.accent} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px" }}>👥 Жас және жыныс бойынша</h3>
              <ResponsiveContainer width="100%" height={mob ? 260 : 340}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="group" tick={{ fontSize: 12, fill: C.textMid }} />
                  <YAxis tick={{ fontSize: 12, fill: C.textDim }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="male" name="Ерлер" fill={C.info} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="female" name="Әйелдер" fill={C.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: "12px" }}>
              {[
                { title: "IDF деректері (2025)", text: "Әлемде 537 млн адам қант диабетімен ауырады.", color: C.info, bg: C.infoBg },
                { title: "Қазақстан", text: "ҚР-да 1.5 млн-нан астам адам тіркелген. Нақты сан 2-3 есе көп.", color: C.accent, bg: C.accentLight },
                { title: "Ерте анықтау", text: "Ерте анықтау асқынуларды 50-70%-ға азайтады.", color: C.safe, bg: C.safeBg },
                { title: "Диагноз қойылмаған", text: "Науқастардың ~40%-ы диагноз қойылмаған.", color: C.warning, bg: C.warningBg },
              ].map((f, i) => (
                <Card key={i} style={{ background: f.bg, border: `1px solid ${f.color}22` }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: f.color, margin: "0 0 6px" }}>{f.title}</h4>
                  <p style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.6, margin: 0 }}>{f.text}</p>
                </Card>
              ))}
            </div>

            {/* About */}
            <Card>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 12px" }}>ℹ️ Қосымша туралы</h3>
              <div style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.8 }}>
                <p style={{ margin: "0 0 8px" }}><strong>DiabetScan v2.0</strong> — деректерді талдау арқылы қант диабетін ерте анықтау жүйесінің веб-қосымшасы.</p>
                <p style={{ margin: "0 0 8px" }}>Қосымша 20+ тәуекел факторын ескереді: жеке мәліметтер, өмір салты, симптомдар, ауру тарихы және зертханалық анализдер.</p>
                <p style={{ margin: "0 0 8px" }}>⚠️ Бұл медициналық диагноз емес, тәуекелді бағалау құралы.</p>
              </div>
              <div style={{ marginTop: "12px", fontSize: "11px", color: C.textDim, lineHeight: 1.8 }}>
                <strong>Дереккөздер:</strong> IDF Diabetes Atlas 11th Ed. (2025) • ADA Standards of Care (2025/2026) • ҚР ДСМ статистикасы • DeFronzo R.A. (Diabetes, 2009) • Оразумбекова Б.Т., Бейсова Б.К.
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: mob ? "16px 12px 80px" : "20px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        <p style={{ fontSize: "11px", color: C.textDim, margin: 0 }}>DiabetScan v2.0 • Қант диабетін ерте анықтау жүйесі</p>
      </footer>

      <style>{`
        input:focus,select:focus{border-color:${C.accent}!important;box-shadow:0 0 0 3px ${C.accent}18}
        input::placeholder{color:${C.textDim}}
        button:hover{opacity:0.92}
        button:active{transform:scale(0.98)}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html{-webkit-text-size-adjust:100%}
        @media(max-width:767px){input,select,textarea{font-size:16px!important}}
      `}</style>
    </div>
  );
}

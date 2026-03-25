import { useState, useEffect, useRef, useCallback } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, AreaChart, Area
} from "recharts";

/* ═══════════════════════════════════════════════════
   DiabetScan v3.0 — PWA-ready medical app
   Design: "Medical Clarity" with glassmorphism
   Font: DM Sans + JetBrains Mono
═══════════════════════════════════════════════════ */

const C = {
  white: "#ffffff", bg: "#f0f7f7", card: "#ffffff", cardAlt: "#f5fafa",
  accent: "#0d9488", accentDark: "#0f766e", accentLight: "#ccfbf1",
  accentGlow: "rgba(13,148,136,0.15)",
  danger: "#dc2626", dangerBg: "#fef2f2",
  warning: "#d97706", warningBg: "#fffbeb",
  info: "#2563eb", infoBg: "#eff6ff",
  safe: "#16a34a", safeBg: "#f0fdf4",
  purple: "#7c3aed", purpleBg: "#f5f3ff",
  text: "#0f172a", textMid: "#475569", textDim: "#94a3b8",
  border: "#e2e8f0", borderLight: "#f1f5f9",
  glass: "rgba(255,255,255,0.7)", glassBorder: "rgba(255,255,255,0.3)",
};

function useWindowSize() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}

function AnimatedNumber({ value, duration = 1200 }) {
  const [d, setD] = useState(0);
  useEffect(() => { let s = 0; const step = (t) => { if (!s) s = t; const p = Math.min((t - s) / duration, 1); setD(Math.round(p * value)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }, [value, duration]);
  return <>{d}</>;
}

function FadeIn({ children, delay = 0, direction = "up", style = {} }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  const tr = { up: "translateY(24px)", down: "translateY(-24px)", left: "translateX(24px)", right: "translateX(-24px)", none: "none" };
  return <div style={{ opacity: v ? 1 : 0, transform: v ? "none" : tr[direction], transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)", ...style }}>{children}</div>;
}

const GlassCard = ({ children, style, onClick, hover = true }) => {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => hover && setH(true)} onMouseLeave={() => hover && setH(false)} style={{
      background: C.glass, borderRadius: "20px", padding: "24px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${C.glassBorder}`,
      boxShadow: h ? "0 20px 40px rgba(13,148,136,0.12), 0 4px 12px rgba(0,0,0,0.04)" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-4px)" : "none",
      cursor: onClick ? "pointer" : "default", ...style,
    }}>{children}</div>
  );
};

const SH = ({ icon, title, subtitle }) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "22px" }}>{icon}</span>
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.text, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{title}</h3>
    </div>
    {subtitle && <p style={{ fontSize: "13px", color: C.textDim, margin: "6px 0 0 32px" }}>{subtitle}</p>}
  </div>
);

const basicFactors = [
  { id: "age", label: "Жасы", min: 18, max: 100, unit: "жас", icon: "👤" },
  { id: "weight", label: "Салмағы", min: 30, max: 250, unit: "кг", icon: "⚖️" },
  { id: "height", label: "Бойы", min: 100, max: 230, unit: "см", icon: "📐" },
  { id: "bp", label: "Қан қысымы (систолалық)", min: 80, max: 220, unit: "мм с.б.", icon: "💓" },
  { id: "waist", label: "Бел шеңбері", min: 50, max: 180, unit: "см", icon: "📏" },
];

const lifestyleFactors = [
  { id: "activity", label: "Физикалық белсенділік", icon: "🏃", opts: [{ v: "high", l: "Жоғары (аптасына 5+ рет)" }, { v: "moderate", l: "Орташа (аптасына 2-4 рет)" }, { v: "low", l: "Төмен (аптасына 1 рет)" }, { v: "sedentary", l: "Отырықшы өмір салты" }] },
  { id: "smoking", label: "Темекі шегу", icon: "🚬", opts: [{ v: "never", l: "Ешқашан" }, { v: "former", l: "Бұрын шеккен" }, { v: "current", l: "Қазір шегемін" }] },
  { id: "diet", label: "Тамақтану", icon: "🥗", opts: [{ v: "healthy", l: "Теңдестірілген / салауатты" }, { v: "moderate", l: "Аралас" }, { v: "unhealthy", l: "Фаст-фуд / тәттілер көп" }] },
  { id: "family", label: "Отбасылық анамнез (диабет)", icon: "👨‍👩‍👧", opts: [{ v: "none", l: "Жоқ" }, { v: "distant", l: "Алыс туыстарда бар" }, { v: "close", l: "Жақын туыстарда бар (ата-ана, бауыр)" }] },
];

const symptoms = [
  { id: "thirst", l: "Шөлдеу күшейді ме?", i: "💧" },
  { id: "dryMouth", l: "Ауыз құрғайды ма?", i: "👄" },
  { id: "fatigue", l: "Шаршағыштық / әлсіздік бар ма?", i: "😴" },
  { id: "frequentUrination", l: "Жиі зәр шығу бар ма?", i: "🚻" },
  { id: "blurredVision", l: "Көру бұлдырлады ма?", i: "👁️" },
  { id: "slowHealing", l: "Жаралар баяу жазыла ма?", i: "🩹" },
  { id: "numbness", l: "Қол-аяқта ұю / тітіркену бар ма?", i: "🖐️" },
  { id: "weightChange", l: "Салмақ кенет өзгерді ме?", i: "📉" },
  { id: "hunger", l: "Аштық сезімі күшейді ме?", i: "🍽️" },
  { id: "skinDarkening", l: "Терінің қараюы бар ма? (мойын, қолтық)", i: "🔲" },
  { id: "itching", l: "Тері қышуы бар ма?", i: "🤚" },
  { id: "infections", l: "Жиі инфекциялар бар ма?", i: "🦠" },
  { id: "acetoneBreath", l: "Ауыздан ацетон иісі бар ма?", i: "💨" },
  { id: "moodSwings", l: "Көңіл-күй ауытқулары бар ма?", i: "😤" },
];

const history = [
  { id: "cardiovascular", l: "Жүрек-қан тамырлары ауруы", i: "❤️" },
  { id: "kidney", l: "Бүйрек ауруы", i: "🫘" },
  { id: "hypertension", l: "Гипертензия (жоғары қан қысымы)", i: "🩺" },
  { id: "pcos", l: "PCOS (поликистоз)", i: "♀️" },
  { id: "gestational", l: "Гестациялық диабет", i: "🤰" },
  { id: "prediabetes", l: "Преддиабет (бұрын анықталған)", i: "⚠️" },
];

const labFactors = [
  { id: "glucose", l: "Глюкоза (аш қарынға)", min: 3, max: 20, u: "ммоль/л", i: "🩸" },
  { id: "hba1c", l: "HbA1c", min: 3, max: 15, u: "%", i: "🔬" },
  { id: "cholesterol", l: "Холестерин", min: 2, max: 12, u: "ммоль/л", i: "🧪" },
  { id: "triglycerides", l: "Триглицеридтер", min: 0.3, max: 10, u: "ммоль/л", i: "💉" },
];

const cities = ["Барлығы","Алматы","Астана","Шымкент","Қарағанды","Ақтөбе","Тараз","Павлодар","Өскемен","Семей","Атырау","Қостанай","Қызылорда","Орал","Петропавл","Ақтау","Түркістан"];

const clinics = [
  { city:"Алматы", name:"Эндокринология ғылыми орталығы", type:"clinic", spec:"Эндокринология", addr:"Төле би к., 94", phone:"+7 727 292 23 44", rating:4.8, svc:["HbA1c","Глюкоза","Инсулин","С-пептид"], hours:"08:00–18:00", lat:43.2567, lng:76.9286 },
  { city:"Алматы", name:"Central Hospital", type:"clinic", spec:"Терапия, Эндокринология", addr:"Абылай хан д., 76", phone:"+7 727 250 01 02", rating:4.6, svc:["Глюкоза","Холестерин"], hours:"08:00–20:00", lat:43.2615, lng:76.9453 },
  { city:"Алматы", name:"Interteach", type:"clinic", spec:"Мультипрофиль", addr:"Курмангазы к., 108", phone:"+7 727 258 60 60", rating:4.7, svc:["HbA1c","Глюкоза","Липидограмма"], hours:"07:30–21:00", lat:43.2520, lng:76.9350 },
  { city:"Алматы", name:"InVitro зертханасы", type:"lab", spec:"Зертхана", addr:"Желтоқсан к., 115", phone:"+7 727 330 88 85", rating:4.5, svc:["HbA1c","Глюкоза","Инсулин","Липидограмма"], hours:"07:00–19:00", lat:43.2480, lng:76.9420 },
  { city:"Астана", name:"Ұлттық ғылыми медицина орталығы", type:"clinic", spec:"Эндокринология", addr:"Абылай хан д., 42", phone:"+7 7172 70 22 33", rating:4.9, svc:["HbA1c","Глюкоза","С-пептид"], hours:"08:00–18:00", lat:51.1280, lng:71.4307 },
  { city:"Астана", name:"Olymp Clinic", type:"clinic", spec:"Мультипрофиль", addr:"Мәңгілік Ел д., 26", phone:"+7 7172 27 97 97", rating:4.7, svc:["HbA1c","Глюкоза","Липидограмма"], hours:"08:00–20:00", lat:51.0900, lng:71.4180 },
  { city:"Астана", name:"KDL зертханасы", type:"lab", spec:"Зертхана", addr:"Қабанбай батыр д., 53", phone:"+7 7172 44 55 66", rating:4.4, svc:["HbA1c","Глюкоза","Инсулин"], hours:"07:00–18:00", lat:51.1350, lng:71.4220 },
  { city:"Шымкент", name:"Шымкент эндокринология орталығы", type:"clinic", spec:"Эндокринология", addr:"Тәуке хан д., 12", phone:"+7 7252 53 40 40", rating:4.4, svc:["Глюкоза","HbA1c"], hours:"08:00–17:00", lat:42.3154, lng:69.5967 },
  { city:"Шымкент", name:"MedExpress", type:"clinic", spec:"Мультипрофиль", addr:"Байтұрсынов к., 45", phone:"+7 7252 30 12 12", rating:4.3, svc:["Глюкоза","Холестерин"], hours:"08:00–19:00", lat:42.3200, lng:69.6000 },
  { city:"Қарағанды", name:"Қарағанды облыстық аурухана", type:"clinic", spec:"Эндокринология", addr:"Бұқар Жырау д., 30", phone:"+7 7212 44 33 22", rating:4.5, svc:["HbA1c","Глюкоза"], hours:"08:00–17:00", lat:49.8047, lng:73.1094 },
  { city:"Ақтөбе", name:"Ақтөбе медицина орталығы", type:"clinic", spec:"Эндокринология", addr:"Тургенев к., 80", phone:"+7 7132 54 67 89", rating:4.2, svc:["Глюкоза","HbA1c"], hours:"08:00–17:00", lat:50.2839, lng:57.1670 },
  { city:"Тараз", name:"Тараз қалалық емхана №3", type:"clinic", spec:"Терапия", addr:"Төле би к., 60", phone:"+7 7262 45 33 11", rating:4.1, svc:["Глюкоза","Холестерин"], hours:"08:00–17:00", lat:42.9000, lng:71.3667 },
  { city:"Павлодар", name:"Павлодар диагностика орталығы", type:"clinic", spec:"Мультипрофиль", addr:"Сатпаев к., 72", phone:"+7 7182 32 11 00", rating:4.3, svc:["Глюкоза","HbA1c","Липидограмма"], hours:"07:30–18:00", lat:52.2873, lng:76.9674 },
  { city:"Өскемен", name:"ШҚО облыстық аурухана", type:"clinic", spec:"Эндокринология", addr:"Бейбітшілік к., 33", phone:"+7 7232 26 44 55", rating:4.4, svc:["HbA1c","Глюкоза","Инсулин"], hours:"08:00–17:00", lat:49.9481, lng:82.6282 },
  { city:"Семей", name:"Семей мед. университеті клиникасы", type:"clinic", spec:"Эндокринология", addr:"Абай д., 103", phone:"+7 7222 56 12 34", rating:4.5, svc:["HbA1c","Глюкоза","С-пептид"], hours:"08:00–18:00", lat:50.4116, lng:80.2275 },
  { city:"Атырау", name:"Атырау облыстық аурухана", type:"clinic", spec:"Терапия", addr:"Сәтпаев к., 15", phone:"+7 7122 35 67 89", rating:4.2, svc:["Глюкоза","Холестерин"], hours:"08:00–17:00", lat:47.1167, lng:51.9000 },
  { city:"Қостанай", name:"Қостанай диагностикалық орталық", type:"clinic", spec:"Мультипрофиль", addr:"Байтұрсынов к., 94", phone:"+7 7142 54 32 10", rating:4.3, svc:["Глюкоза","HbA1c"], hours:"08:00–18:00", lat:53.2198, lng:63.6354 },
  { city:"Қызылорда", name:"Қызылорда облыстық емхана", type:"clinic", spec:"Терапия", addr:"Жібек Жолы д., 28", phone:"+7 7242 27 11 22", rating:4.1, svc:["Глюкоза"], hours:"08:00–17:00", lat:44.8488, lng:65.5228 },
  { city:"Орал", name:"БҚО облыстық аурухана", type:"clinic", spec:"Эндокринология", addr:"Дос-Мұқасан к., 40", phone:"+7 7112 50 33 44", rating:4.3, svc:["Глюкоза","HbA1c"], hours:"08:00–17:00", lat:51.2333, lng:51.3667 },
  { city:"Петропавл", name:"СҚО диагностика орталығы", type:"clinic", spec:"Мультипрофиль", addr:"Конституция к., 58", phone:"+7 7152 46 78 90", rating:4.2, svc:["Глюкоза","HbA1c","Холестерин"], hours:"08:00–18:00", lat:54.8667, lng:69.1500 },
  { city:"Ақтау", name:"Маңғыстау облыстық аурухана", type:"clinic", spec:"Терапия", addr:"14 ш/а, 67 үй", phone:"+7 7292 43 22 11", rating:4.2, svc:["Глюкоза","Холестерин"], hours:"08:00–17:00", lat:43.6353, lng:51.1580 },
  { city:"Түркістан", name:"Түркістан қалалық емхана", type:"clinic", spec:"Терапия", addr:"Жібек Жолы к., 10", phone:"+7 7253 36 11 22", rating:4.0, svc:["Глюкоза"], hours:"08:00–17:00", lat:43.3017, lng:68.2517 },
];

const doctors = [
  { name:"Ахметова Гүлнар Серікқызы", spec:"Эндокринолог", exp:18, clinic:"Эндокринология ғылыми орталығы", city:"Алматы", phone:"+7 727 292 23 45", hours:"09:00–16:00", lat:43.2567, lng:76.9286 },
  { name:"Қасымов Ерлан Бауыржанұлы", spec:"Эндокринолог", exp:12, clinic:"Central Hospital", city:"Алматы", phone:"+7 727 250 01 03", hours:"08:00–15:00", lat:43.2615, lng:76.9453 },
  { name:"Сұлтанова Айгерім Мұратқызы", spec:"Терапевт", exp:10, clinic:"Interteach", city:"Алматы", phone:"+7 727 258 60 61", hours:"09:00–17:00", lat:43.2520, lng:76.9350 },
  { name:"Жұмабеков Дәулет Қанатұлы", spec:"Кардиолог", exp:15, clinic:"Interteach", city:"Алматы", phone:"+7 727 258 60 62", hours:"10:00–18:00", lat:43.2520, lng:76.9350 },
  { name:"Нұрланова Мәдина Ержанқызы", spec:"Диетолог", exp:8, clinic:"Central Hospital", city:"Алматы", phone:"+7 727 250 01 04", hours:"09:00–16:00", lat:43.2615, lng:76.9453 },
  { name:"Байғабылов Асқар Тұрсынұлы", spec:"Эндокринолог", exp:22, clinic:"Ұлттық ғылыми медицина орталығы", city:"Астана", phone:"+7 7172 70 22 34", hours:"08:00–16:00", lat:51.1280, lng:71.4307 },
  { name:"Оспанова Жансая Бекболатқызы", spec:"Терапевт", exp:14, clinic:"Olymp Clinic", city:"Астана", phone:"+7 7172 27 97 98", hours:"09:00–17:00", lat:51.0900, lng:71.4180 },
  { name:"Ержанов Нұрсұлтан Маратұлы", spec:"Кардиолог", exp:11, clinic:"Ұлттық ғылыми медицина орталығы", city:"Астана", phone:"+7 7172 70 22 35", hours:"10:00–17:00", lat:51.1280, lng:71.4307 },
  { name:"Тілеуберді Аяулым Серікқызы", spec:"Диетолог", exp:6, clinic:"Olymp Clinic", city:"Астана", phone:"+7 7172 27 97 99", hours:"09:00–15:00", lat:51.0900, lng:71.4180 },
  { name:"Мұқашева Анар Сағынтайқызы", spec:"Эндокринолог", exp:16, clinic:"Шымкент эндокринология орталығы", city:"Шымкент", phone:"+7 7252 53 40 41", hours:"08:00–16:00", lat:42.3154, lng:69.5967 },
  { name:"Қожаберген Арман Нұрланұлы", spec:"Терапевт", exp:9, clinic:"MedExpress", city:"Шымкент", phone:"+7 7252 30 12 13", hours:"09:00–18:00", lat:42.3200, lng:69.6000 },
  { name:"Серікбаев Бауыржан Асылұлы", spec:"Эндокринолог", exp:20, clinic:"Қарағанды облыстық аурухана", city:"Қарағанды", phone:"+7 7212 44 33 23", hours:"08:00–16:00", lat:49.8047, lng:73.1094 },
  { name:"Әлімжанова Дана Қайратқызы", spec:"Кардиолог", exp:13, clinic:"Қарағанды облыстық аурухана", city:"Қарағанды", phone:"+7 7212 44 33 24", hours:"09:00–17:00", lat:49.8047, lng:73.1094 },
  { name:"Тоқтаров Мұрат Бекенұлы", spec:"Эндокринолог", exp:17, clinic:"Ақтөбе медицина орталығы", city:"Ақтөбе", phone:"+7 7132 54 67 90", hours:"08:00–16:00", lat:50.2839, lng:57.1670 },
  { name:"Исмағұлова Камила Ерланқызы", spec:"Терапевт", exp:7, clinic:"Павлодар диагностика орталығы", city:"Павлодар", phone:"+7 7182 32 11 01", hours:"08:00–17:00", lat:52.2873, lng:76.9674 },
  { name:"Рахымов Ғалымжан Сейітұлы", spec:"Эндокринолог", exp:19, clinic:"ШҚО облыстық аурухана", city:"Өскемен", phone:"+7 7232 26 44 56", hours:"08:00–16:00", lat:49.9481, lng:82.6282 },
  { name:"Бекмұратова Салтанат Ерікқызы", spec:"Диетолог", exp:5, clinic:"Семей мед. университеті клиникасы", city:"Семей", phone:"+7 7222 56 12 35", hours:"09:00–15:00", lat:50.4116, lng:80.2275 },
  { name:"Досанов Берік Жанатұлы", spec:"Терапевт", exp:12, clinic:"Атырау облыстық аурухана", city:"Атырау", phone:"+7 7122 35 67 90", hours:"08:00–16:00", lat:47.1167, lng:51.9000 },
  { name:"Қуандықова Ләззат Оразқызы", spec:"Эндокринолог", exp:14, clinic:"Қостанай диагностикалық орталық", city:"Қостанай", phone:"+7 7142 54 32 11", hours:"08:00–17:00", lat:53.2198, lng:63.6354 },
  { name:"Нұрпейісов Тимур Асқарұлы", spec:"Терапевт", exp:10, clinic:"СҚО диагностика орталығы", city:"Петропавл", phone:"+7 7152 46 78 91", hours:"08:00–17:00", lat:54.8667, lng:69.1500 },
];

const specFilters = ["Барлығы","Эндокринолог","Терапевт","Кардиолог","Диетолог"];

function getDistance(lat1,lon1,lat2,lon2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

const recTests = [
  { name:"Қан глюкозасы (аш қарынға)", desc:"Негізгі скрининг. 8-12 сағат аш қарынға.", norm:"3.9—5.5 ммоль/л", pre:"5.6—6.9", diab:"≥7.0", i:"🩸", freq:"Жылына 1 рет (35+)" },
  { name:"HbA1c", desc:"Соңғы 2-3 ай орташа қан қанты.", norm:"<5.7%", pre:"5.7—6.4%", diab:"≥6.5%", i:"🔬", freq:"Жылына 1-2 рет" },
  { name:"ОГТТ (глюкозаға толеранттылық)", desc:"75г глюкозадан 2 сағат кейін.", norm:"<7.8", pre:"7.8—11.0", diab:"≥11.1", i:"⏱️", freq:"Қажет болса" },
  { name:"Липидограмма", desc:"Холестерин, триглицеридтер, ЛПНП, ЛПВП.", norm:"ХС<5.2", pre:"5.2—6.2", diab:"≥6.2", i:"🧪", freq:"Жылына 1 рет" },
  { name:"Инсулин деңгейі", desc:"Инсулин резистенттілігін анықтау.", norm:"2.6—24.9 мкМЕ/мл", pre:"25—30", diab:">30", i:"💉", freq:"Дәрігер тағайындауымен" },
  { name:"С-пептид", desc:"Ұйқы безінің инсулин өндіру қабілеті.", norm:"1.1—4.4 нг/мл", pre:"—", diab:"<1.1", i:"🧬", freq:"Дәрігер тағайындауымен" },
];

const kzRegions = [
  { region:"Алматы", rate:12.3 }, { region:"Астана", rate:10.8 }, { region:"Шымкент", rate:9.5 },
  { region:"Алматы обл.", rate:8.7 }, { region:"Қарағанды", rate:8.4 }, { region:"Шығыс ҚО", rate:7.9 },
  { region:"Ақтөбе", rate:7.2 }, { region:"Жамбыл", rate:6.8 },
];
const ageDist = [
  { g:"20-29", m:1.2, f:0.8 }, { g:"30-39", m:3.4, f:2.9 }, { g:"40-49", m:7.8, f:6.5 },
  { g:"50-59", m:14.2, f:12.8 }, { g:"60-69", m:19.6, f:21.3 }, { g:"70+", m:22.1, f:24.7 },
];
const trend = [
  { y:"2018", c:298 }, { y:"2019", c:345 }, { y:"2020", c:412 }, { y:"2021", c:489 },
  { y:"2022", c:534 }, { y:"2023", c:598 }, { y:"2024", c:650 }, { y:"2025", c:710 },
];

function calcRisk(data, hasLab) {
  let sc=0, mx=0; const facs=[], un=[];
  if(data.age){const a=+data.age;mx+=10;const s=a>=65?10:a>=45?6:a>=35?3:1;sc+=s;facs.push({n:"Жас",s,m:10,st:s>=8?"danger":s>=4?"warning":"safe"});}else un.push("Жас");
  let bmi=null;if(data.weight&&data.height){bmi=+data.weight/Math.pow(+data.height/100,2);}
  if(bmi){mx+=15;const s=bmi>=35?15:bmi>=30?12:bmi>=25?7:1;sc+=s;facs.push({n:`BMI (${bmi.toFixed(1)})`,s,m:15,st:s>=10?"danger":s>=5?"warning":"safe"});}else un.push("BMI");
  if(data.bp){const b=+data.bp;mx+=8;const s=b>=160?8:b>=140?5:b>=130?3:0;sc+=s;facs.push({n:"Қан қысымы",s,m:8,st:s>=6?"danger":s>=3?"warning":"safe"});}
  if(data.waist){const w=+data.waist;mx+=8;const s=w>=102?8:w>=88?5:1;sc+=s;facs.push({n:"Бел шеңбері",s,m:8,st:s>=6?"danger":s>=3?"warning":"safe"});}
  const lm={activity:{sedentary:6,low:4,moderate:2,high:0,max:6},smoking:{current:4,former:2,never:0,max:4},diet:{unhealthy:5,moderate:2,healthy:0,max:5},family:{close:10,distant:5,none:0,max:10}};
  const ln={activity:"Белсенділік",smoking:"Темекі",diet:"Тамақтану",family:"Анамнез"};
  Object.keys(lm).forEach(k=>{if(data[k]){const m=lm[k];mx+=m.max;const s=m[data[k]]||0;sc+=s;facs.push({n:ln[k],s,m:m.max,st:s>=m.max*0.7?"danger":s>=m.max*0.3?"warning":"safe"});}});
  let ss=0,sm=0;symptoms.forEach(q=>{if(data[q.id]){sm+=3;ss+=({yes:3,sometimes:1.5,no:0})[data[q.id]]||0;}});
  if(sm>0){const n=Math.round((ss/sm)*20);mx+=20;sc+=n;facs.push({n:"Симптомдар",s:n,m:20,st:n>=14?"danger":n>=7?"warning":"safe"});}
  let hs=0,hm=0;history.forEach(q=>{if(data[q.id]){hm+=4;hs+=({yes:4,no:0,unknown:1})[data[q.id]]||0;}});
  if(hm>0){const n=Math.round((hs/hm)*12);mx+=12;sc+=n;facs.push({n:"Ауру тарихы",s:n,m:12,st:n>=8?"danger":n>=4?"warning":"safe"});}
  if(hasLab){
    [{id:"glucose",n:"Глюкоза",max:15,th:[[7,15],[5.6,8],[0,0]]},{id:"hba1c",n:"HbA1c",max:15,th:[[6.5,15],[5.7,8],[0,0]]},{id:"cholesterol",n:"Холестерин",max:5,th:[[6.2,5],[5.2,3],[0,0]]},{id:"triglycerides",n:"Триглицеридтер",max:5,th:[[2.3,5],[1.7,3],[0,0]]}].forEach(l=>{
      if(data[l.id]){const v=+data[l.id];mx+=l.max;let s=0;for(const[t,sc2]of l.th){if(v>=t){s=sc2;break;}}sc+=s;facs.push({n:l.n,s,m:l.max,st:s>=l.max*0.7?"danger":s>=l.max*0.3?"warning":"safe"});}
    });
  }
  const pct=mx>0?Math.round((sc/mx)*100):0;
  let lv,lc,lb,ll;
  if(pct>=70){lv="high";lc=C.danger;lb=C.dangerBg;ll="Жоғары тәуекел";}
  else if(pct>=40){lv="moderate";lc=C.warning;lb=C.warningBg;ll="Орташа тәуекел";}
  else{lv="low";lc=C.safe;lb=C.safeBg;ll="Төмен тәуекел";}
  return {score:sc,maxP:mx,pct,level:lv,lc,lb,ll,factors:facs,unanswered:un};
}

function getRecs(level){
  const r={
    high:[
      {i:"🏥",t:"Дәрігерге жүгініңіз",x:"Эндокринологқа жедел жазылыңыз. Толық тексеру қажет."},
      {i:"🩸",t:"Анализдерді тапсырыңыз",x:"Аш қарынға глюкоза, HbA1c, липидтік профиль, бүйрек функциясы."},
      {i:"🥗",t:"Тамақтануды өзгертіңіз",x:"Қант, ақ нан, газды сусындарды қысқартыңыз. Көкөніс, талшық көбейтіңіз."},
      {i:"🏃",t:"Физикалық белсенділік",x:"Күнделікті кемінде 30 минут серуендеңіз. Дәрігермен келісіңіз."}
    ],
    moderate:[
      {i:"👨‍⚕️",t:"Профилактикалық тексеру",x:"Жылына 1-2 рет эндокринологта тексеріліңіз."},
      {i:"📊",t:"Мониторинг",x:"Қан глюкозасын, салмақты, қан қысымын бақылаңыз."},
      {i:"🏋️",t:"Белсенді өмір салты",x:"Аптасына кемінде 150 минут орташа қарқынды жаттығу."},
      {i:"🥦",t:"Салауатты тамақтану",x:"Жемістер, көкөністер, цельнозернді өнімдер, омега-3."}
    ],
    low:[
      {i:"✅",t:"Жақсы нәтиже!",x:"Тәуекел факторлары аз. Салауатты өмір салтын жалғастырыңыз."},
      {i:"📅",t:"Жоспарлы тексеру",x:"Жылына 1 рет профилактикалық тексеру жеткілікті."},
      {i:"🏃‍♂️",t:"Белсенділікті сақтаңыз",x:"Тұрақты физикалық белсенділік — ең жақсы алдын алу."},
      {i:"💧",t:"Су ішіңіз",x:"Күніне 1.5-2 литр таза су ішіңіз."}
    ],
  };return r[level]||r.low;
}

const pages=[{id:"home",l:"Басты",i:"🏠"},{id:"test",l:"Тест",i:"📋"},{id:"dir",l:"Анықтама",i:"🏥"},{id:"stats",l:"Статистика",i:"📈"}];
const steps=[{id:1,l:"Мәлімет",i:"👤"},{id:2,l:"Симптомдар",i:"🩺"},{id:3,l:"Тарих",i:"📋"},{id:4,l:"Анализдер",i:"🔬"}];

function Splash({onDone}){
  const [p,setP]=useState(0),[ph,setPh]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setP(v=>{if(v>=100){clearInterval(t);setTimeout(onDone,400);return 100;}return v+2;}),30);
    const t1=setTimeout(()=>setPh(1),600),t2=setTimeout(()=>setPh(2),1200);
    return()=>{clearInterval(t);clearTimeout(t1);clearTimeout(t2);};
  },[onDone]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"linear-gradient(160deg,#0d9488,#0f766e 40%,#115e59)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{position:"absolute",inset:0,overflow:"hidden"}}>{[...Array(6)].map((_,i)=><div key={i} style={{position:"absolute",width:`${100+i*60}px`,height:`${100+i*60}px`,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.08)",top:`${20+i*8}%`,left:`${10+i*12}%`,animation:`sf ${3+i*0.5}s ease-in-out infinite alternate`}}/>)}</div>
      <div style={{opacity:ph>=0?1:0,transform:ph>=0?"scale(1)":"scale(0.5)",transition:"all 0.8s cubic-bezier(0.34,1.56,0.64,1)",fontSize:"72px",marginBottom:"24px",filter:"drop-shadow(0 4px 20px rgba(0,0,0,0.3))"}}>🩺</div>
      <h1 style={{opacity:ph>=1?1:0,transform:ph>=1?"translateY(0)":"translateY(20px)",transition:"all 0.6s",color:"#fff",fontSize:"36px",fontWeight:900,margin:"0 0 8px",letterSpacing:"-1px"}}>DiabetScan</h1>
      <p style={{opacity:ph>=2?1:0,transform:ph>=2?"translateY(0)":"translateY(10px)",transition:"all 0.6s",color:"rgba(255,255,255,0.7)",fontSize:"14px",margin:"0 0 40px"}}>Қант диабетін ерте анықтау жүйесі</p>
      <div style={{width:"200px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.2)",overflow:"hidden"}}><div style={{width:`${p}%`,height:"100%",borderRadius:"2px",background:"linear-gradient(90deg,#5eead4,#fff)",transition:"width 0.1s"}}/></div>
      <style>{`@keyframes sf{from{transform:translate(0,0) rotate(0)}to{transform:translate(20px,-20px) rotate(10deg)}}`}</style>
    </div>
  );
}

export default function App(){
  const w=useWindowSize(),mob=w<768,tab=w>=768&&w<1024,narrow=w<1024;
  const [splash,setSplash]=useState(true);
  const [pg,setPg]=useState("home"),[step,setStep]=useState(1);
  const [fd,setFd]=useState({}),[labs,setLabs]=useState(null),[res,setRes]=useState(null);
  const [trans,setTrans]=useState(true);
  const [city,setCity]=useState("Барлығы"),[ctype,setCtype]=useState("all"),[dtab,setDtab]=useState("tests");
  const [specFilter,setSpecFilter]=useState("Барлығы");
  const [userLoc,setUserLoc]=useState(null),[geoLoading,setGeoLoading]=useState(false),[geoError,setGeoError]=useState(null);

  const requestGeo=()=>{
    if(!navigator.geolocation){setGeoError("Геолокация қолжетімсіз");return;}
    setGeoLoading(true);setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      pos=>{setUserLoc({lat:pos.coords.latitude,lng:pos.coords.longitude});setGeoLoading(false);},
      err=>{setGeoError("Орналасқан жеріңізді анықтау мүмкін болмады");setGeoLoading(false);},
      {enableHighAccuracy:true,timeout:10000}
    );
  };

  const s=(id,v)=>setFd(p=>({...p,[id]:v}));
  const nav=(p)=>{setTrans(false);setTimeout(()=>{setPg(p);setTrans(true);},150);};
  const analyze=()=>{setRes(calcRisk(fd,labs===true));nav("results");};
  const reset=()=>{setFd({});setRes(null);setLabs(null);setStep(1);nav("test");};
  const cnt=Object.keys(fd).filter(k=>fd[k]!==''&&fd[k]!==undefined).length;

  let bmi=null,bmiL="",bmiC=C.textDim;
  if(fd.weight&&fd.height){bmi=+fd.weight/Math.pow(+fd.height/100,2);if(bmi<18.5){bmiL="Арықтық";bmiC=C.info;}else if(bmi<25){bmiL="Қалыпты";bmiC=C.safe;}else if(bmi<30){bmiL="Артық салмақ";bmiC=C.warning;}else{bmiL="Семіздік";bmiC=C.danger;}}

  const inpS=(id)=>({width:"100%",padding:mob?"14px":"12px 14px",borderRadius:"12px",border:`1.5px solid ${fd[id]?C.accent+"55":C.border}`,background:fd[id]?C.accentLight:C.white,color:C.text,fontSize:mob?"16px":"15px",fontWeight:600,fontFamily:"'JetBrains Mono',monospace",outline:"none",transition:"all 0.25s",WebkitAppearance:"none"});
  const selS=(id)=>({width:"100%",padding:mob?"14px":"12px 14px",borderRadius:"12px",border:`1.5px solid ${fd[id]?C.accent+"55":C.border}`,background:fd[id]?C.accentLight:C.white,color:C.text,fontSize:mob?"15px":"14px",fontWeight:500,outline:"none",cursor:"pointer",appearance:"none",WebkitAppearance:"none",transition:"all 0.25s"});

  const TB=({q,v,l,c,bg,a})=><button onClick={()=>s(q,v)} style={{padding:mob?"10px 12px":"8px 16px",borderRadius:"10px",fontSize:mob?"13px":"13px",fontWeight:700,border:a?`2px solid ${c}`:`1.5px solid ${C.border}`,background:a?bg:C.white,color:a?c:C.textDim,cursor:"pointer",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)",flex:1,transform:a?"scale(1.02)":"scale(1)"}}>{l}</button>;

  const fc=clinics.filter(c2=>(city==="Барлығы"||c2.city===city)&&(ctype==="all"||c2.type===ctype)).map(c2=>({...c2,dist:userLoc?getDistance(userLoc.lat,userLoc.lng,c2.lat,c2.lng):null})).sort((a,b)=>a.dist&&b.dist?a.dist-b.dist:0);
  const fd2=doctors.filter(d=>(city==="Барлығы"||d.city===city)&&(specFilter==="Барлығы"||d.spec===specFilter)).map(d=>({...d,dist:userLoc?getDistance(userLoc.lat,userLoc.lng,d.lat,d.lng):null})).sort((a,b)=>a.dist&&b.dist?a.dist-b.dist:0);
  const done=useCallback(()=>setSplash(false),[]);
  if(splash) return <Splash onDone={done}/>;
  const cp=pg==="results"&&res?"results":pg;

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(180deg,${C.bg},#e6f2f2)`,fontFamily:"'DM Sans',-apple-system,'Segoe UI',sans-serif",color:C.text}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet"/>

      <header style={{background:"linear-gradient(135deg,#0d9488,#0f766e 50%,#115e59)",padding:mob?"14px 16px":tab?"14px 16px":"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 24px rgba(13,148,136,0.25)",gap:"8px",flexWrap:"nowrap",minWidth:0}}>
        <div onClick={()=>nav("home")} style={{display:"flex",alignItems:"center",gap:mob?"8px":"10px",cursor:"pointer",flexShrink:0}}>
          <span style={{fontSize:mob?"20px":tab?"22px":"26px"}}>🩺</span>
          <span style={{fontSize:mob?"16px":tab?"17px":"22px",fontWeight:900,color:"#fff",letterSpacing:"-0.5px",whiteSpace:"nowrap"}}>DiabetScan</span>
        </div>
        {!mob&&<nav style={{display:"flex",gap:"2px",background:"rgba(255,255,255,0.1)",borderRadius:"14px",padding:"3px",flexShrink:1,minWidth:0,overflow:"hidden"}}>{pages.map(p=><button key={p.id} onClick={()=>nav(p.id)} style={{padding:tab?"8px 10px":"10px 20px",borderRadius:"12px",border:"none",background:(pg===p.id||(p.id==="test"&&cp==="results"))?"rgba(255,255,255,0.95)":"transparent",color:(pg===p.id||(p.id==="test"&&cp==="results"))?C.accent:"rgba(255,255,255,0.8)",fontWeight:700,fontSize:tab?"12px":"14px",cursor:"pointer",transition:"all 0.3s",display:"flex",alignItems:"center",gap:tab?"4px":"6px",whiteSpace:"nowrap",flexShrink:1,minWidth:0}}><span style={{fontSize:tab?"14px":"16px"}}>{p.i}</span><span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{p.l}</span></button>)}</nav>}
        <div style={{background:"rgba(255,255,255,0.15)",borderRadius:"12px",padding:tab?"6px 10px":"8px 14px",display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}><span style={{fontSize:"13px"}}>📝</span><span style={{color:"#fff",fontWeight:800,fontSize:tab?"12px":"14px",fontFamily:"'JetBrains Mono',monospace"}}>{cnt}</span></div>
      </header>

      {mob&&<nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around",padding:"8px 0 max(env(safe-area-inset-bottom),8px)"}}>
        {pages.map(p=>{const a=pg===p.id||(p.id==="test"&&cp==="results");return<button key={p.id} onClick={()=>nav(p.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",padding:"6px 4px",border:"none",background:"transparent",cursor:"pointer",color:a?C.accent:C.textDim,transition:"all 0.3s",position:"relative"}}><span style={{fontSize:"22px",transform:a?"scale(1.15)":"scale(1)",transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>{p.i}</span><span style={{fontSize:"10px",fontWeight:a?800:500}}>{p.l}</span>{a&&<div style={{position:"absolute",top:"-1px",left:"25%",right:"25%",height:"3px",borderRadius:"0 0 3px 3px",background:C.accent}}/>}</button>;})}
      </nav>}

      <main style={{maxWidth:"940px",margin:"0 auto",padding:mob?"20px 14px 100px":"32px 24px 48px",opacity:trans?1:0,transform:trans?"translateY(0)":"translateY(12px)",transition:"opacity 0.3s,transform 0.3s"}}>

        {cp==="home"&&<div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
          <FadeIn><div style={{background:"linear-gradient(135deg,#0d9488,#0f766e 50%,#115e59)",borderRadius:"24px",padding:mob?"32px 20px":"48px 40px",color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:"-30px",right:"-30px",fontSize:"160px",opacity:0.08,transform:"rotate(15deg)"}}>🩺</div>
            <h1 style={{fontSize:mob?"28px":"38px",fontWeight:900,margin:"0 0 12px",lineHeight:1.2,letterSpacing:"-1px"}}>Қант диабетін<br/>ерте анықтаңыз</h1>
            <p style={{fontSize:mob?"14px":"16px",color:"rgba(255,255,255,0.8)",margin:"0 0 28px",maxWidth:"480px",lineHeight:1.7}}>Жеке тәуекеліңізді бағалап, маманға жүгіну қажеттілігін анықтаңыз. Тест 5 минуттан аспайды.</p>
            <button onClick={()=>nav("test")} style={{padding:mob?"16px 32px":"14px 36px",borderRadius:"14px",border:"none",background:"#fff",color:C.accent,fontWeight:800,fontSize:"16px",cursor:"pointer",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>🔍 Тестті бастау</button>
          </div></FadeIn>

          <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:"12px"}}>
            {[{n:"537M",l:"Әлемде ауырады",i:"🌍",c:C.info,d:100},{n:"1.5M+",l:"Қазақстанда",i:"🇰🇿",c:C.accent,d:200},{n:"~40%",l:"Диагноз қойылмаған",i:"⚠️",c:C.warning,d:300},{n:"70%",l:"Алдын алуға болады",i:"✅",c:C.safe,d:400}].map((s2,i)=>
              <FadeIn key={i} delay={s2.d}><GlassCard style={{textAlign:"center",padding:mob?"18px 12px":"24px"}}><span style={{fontSize:"28px"}}>{s2.i}</span><div style={{fontSize:mob?"22px":"28px",fontWeight:900,color:s2.c,fontFamily:"'JetBrains Mono',monospace",margin:"8px 0 4px"}}>{s2.n}</div><div style={{fontSize:"12px",color:C.textDim,fontWeight:600}}>{s2.l}</div></GlassCard></FadeIn>
            )}
          </div>

          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:"16px"}}>
            {[{i:"📋",t:"Тәуекелді бағалау",x:"30+ параметр бойынша жеке тәуекел",p:"test"},{i:"🏥",t:"Клиникалар мен анализдер",x:"17 қаладағы мекемелер анықтамасы",p:"dir"},{i:"📈",t:"Статистика",x:"ҚР және әлем эпидемиологиясы",p:"stats"}].map((f,i)=>
              <FadeIn key={i} delay={500+i*100}><GlassCard onClick={()=>nav(f.p)} style={{cursor:"pointer",padding:mob?"20px":"28px"}}><span style={{fontSize:"32px"}}>{f.i}</span><h3 style={{fontSize:"16px",fontWeight:800,margin:"12px 0 8px"}}>{f.t}</h3><p style={{fontSize:"13px",color:C.textMid,lineHeight:1.6,margin:0}}>{f.x}</p></GlassCard></FadeIn>
            )}
          </div>

          <FadeIn delay={800}><GlassCard style={{background:C.warningBg,border:`1px solid ${C.warning}22`,padding:"16px 20px"}}><div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}><span style={{fontSize:"20px"}}>⚠️</span><div><h4 style={{fontSize:"14px",fontWeight:700,color:C.warning,margin:"0 0 4px"}}>Маңызды ескертпе</h4><p style={{fontSize:"13px",color:C.textMid,margin:0,lineHeight:1.6}}>DiabetScan медициналық диагноз емес, тәуекелді бағалау құралы.</p></div></div></GlassCard></FadeIn>
        </div>}

        {cp==="test"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <FadeIn><div style={{display:"flex",gap:mob?"4px":"8px",justifyContent:"center",flexWrap:"wrap"}}>{steps.map(s2=><button key={s2.id} onClick={()=>setStep(s2.id)} style={{display:"flex",alignItems:"center",gap:"6px",padding:mob?"10px 14px":"10px 20px",borderRadius:"14px",border:"none",cursor:"pointer",background:step===s2.id?C.accent:C.glass,color:step===s2.id?"#fff":C.textMid,fontWeight:700,fontSize:mob?"12px":"14px",boxShadow:step===s2.id?"0 4px 16px rgba(13,148,136,0.35)":"0 1px 4px rgba(0,0,0,0.04)",transition:"all 0.3s",transform:step===s2.id?"scale(1.05)":"scale(1)",backdropFilter:"blur(8px)"}}><span>{s2.i}</span>{(!mob||step===s2.id)&&<span>{s2.l}</span>}</button>)}</div></FadeIn>
          <div style={{height:"4px",background:C.border,borderRadius:"2px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"2px",background:`linear-gradient(90deg,${C.accent},${C.accentDark})`,width:`${((step-1)/4)*100}%`,transition:"width 0.5s cubic-bezier(0.16,1,0.3,1)"}}/></div>

          {step===1&&<FadeIn delay={100}><GlassCard>
            <SH icon="👤" title="Жеке мәліметтер" subtitle="Негізгі көрсеткіштер"/>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:"16px"}}>
              {basicFactors.map(f=><div key={f.id} style={{display:"flex",flexDirection:"column",gap:"8px"}}><label style={{fontSize:"13px",fontWeight:600,color:C.textMid,display:"flex",alignItems:"center",gap:"8px"}}><span>{f.icon}</span>{f.label}</label><div style={{display:"flex",gap:"6px",alignItems:"center"}}><input type="number" inputMode="decimal" step="0.1" min={f.min} max={f.max} value={fd[f.id]||""} onChange={e=>s(f.id,e.target.value)} placeholder={`${f.min}—${f.max}`} style={inpS(f.id)}/><span style={{fontSize:"11px",color:C.textDim,padding:"8px 10px",background:C.cardAlt,borderRadius:"10px",whiteSpace:"nowrap",fontWeight:600}}>{f.unit}</span></div></div>)}
            </div>
            {bmi&&<FadeIn style={{marginTop:"16px"}}><div style={{padding:"16px 20px",borderRadius:"14px",background:`${bmiC}0D`,border:`1.5px solid ${bmiC}33`,display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}><span style={{fontSize:"26px"}}>⚖️</span><div style={{flex:1,minWidth:"150px"}}><div style={{fontSize:"12px",color:C.textDim,fontWeight:600}}>BMI автоматты</div><div style={{fontSize:"11px",color:C.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{fd.weight}кг ÷ ({fd.height}см)²</div></div><div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><span style={{fontSize:"24px",fontWeight:900,color:bmiC,fontFamily:"'JetBrains Mono',monospace"}}>{bmi.toFixed(1)}</span><span style={{fontSize:"12px",fontWeight:700,color:bmiC}}>{bmiL}</span></div></div></FadeIn>}
            <div style={{marginTop:"24px"}}><SH icon="🏃" title="Өмір салты"/><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2,1fr)",gap:"16px"}}>{lifestyleFactors.map(f=><div key={f.id} style={{display:"flex",flexDirection:"column",gap:"8px"}}><label style={{fontSize:"13px",fontWeight:600,color:C.textMid,display:"flex",alignItems:"center",gap:"8px"}}><span>{f.icon}</span>{f.label}</label><select value={fd[f.id]||""} onChange={e=>s(f.id,e.target.value)} style={selS(f.id)}><option value="">Таңдаңыз...</option>{f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>)}</div></div>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:"24px"}}><button onClick={()=>setStep(2)} style={{padding:mob?"14px 28px":"12px 32px",borderRadius:"14px",border:"none",background:C.accent,color:"#fff",fontWeight:700,fontSize:"15px",cursor:"pointer",boxShadow:"0 4px 16px rgba(13,148,136,0.3)",width:mob?"100%":"auto"}}>Келесі →</button></div>
          </GlassCard></FadeIn>}

          {step===2&&<FadeIn delay={100}><GlassCard>
            <SH icon="🩺" title="Симптомдар" subtitle="Соңғы 3 айда"/>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{symptoms.map(q=><div key={q.id} style={{display:"flex",flexDirection:mob?"column":"row",alignItems:mob?"stretch":"center",gap:mob?"8px":"12px",padding:"12px 14px",borderRadius:"12px",background:fd[q.id]?C.cardAlt:"transparent",border:`1px solid ${fd[q.id]?C.border:"transparent"}`,transition:"all 0.25s"}}><div style={{flex:1,fontSize:"14px",fontWeight:500,display:"flex",alignItems:"center",gap:"8px"}}><span>{q.i}</span>{q.l}</div><div style={{display:"flex",gap:"6px"}}><TB q={q.id} v="yes" l="Иә" c={C.danger} bg={C.dangerBg} a={fd[q.id]==="yes"}/><TB q={q.id} v="sometimes" l="Кейде" c={C.warning} bg={C.warningBg} a={fd[q.id]==="sometimes"}/><TB q={q.id} v="no" l="Жоқ" c={C.safe} bg={C.safeBg} a={fd[q.id]==="no"}/></div></div>)}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"24px",gap:"12px",flexDirection:mob?"column-reverse":"row"}}><button onClick={()=>setStep(1)} style={{padding:"12px 28px",borderRadius:"14px",border:`2px solid ${C.border}`,background:C.white,color:C.textMid,fontWeight:700,cursor:"pointer",width:mob?"100%":"auto"}}>← Артқа</button><button onClick={()=>setStep(3)} style={{padding:"12px 28px",borderRadius:"14px",border:"none",background:C.accent,color:"#fff",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(13,148,136,0.3)",width:mob?"100%":"auto"}}>Келесі →</button></div>
          </GlassCard></FadeIn>}

          {step===3&&<FadeIn delay={100}><GlassCard>
            <SH icon="📋" title="Ауру тарихы"/>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{history.map(q=><div key={q.id} style={{display:"flex",flexDirection:mob?"column":"row",alignItems:mob?"stretch":"center",gap:mob?"8px":"12px",padding:"12px 14px",borderRadius:"12px",background:fd[q.id]?C.cardAlt:"transparent",border:`1px solid ${fd[q.id]?C.border:"transparent"}`,transition:"all 0.25s"}}><div style={{flex:1,fontSize:"14px",fontWeight:500,display:"flex",alignItems:"center",gap:"8px"}}><span>{q.i}</span>{q.l}</div><div style={{display:"flex",gap:"6px"}}><TB q={q.id} v="yes" l="Иә" c={C.danger} bg={C.dangerBg} a={fd[q.id]==="yes"}/><TB q={q.id} v="no" l="Жоқ" c={C.safe} bg={C.safeBg} a={fd[q.id]==="no"}/><TB q={q.id} v="unknown" l="Белгісіз" c={C.warning} bg={C.warningBg} a={fd[q.id]==="unknown"}/></div></div>)}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"24px",gap:"12px",flexDirection:mob?"column-reverse":"row"}}><button onClick={()=>setStep(2)} style={{padding:"12px 28px",borderRadius:"14px",border:`2px solid ${C.border}`,background:C.white,color:C.textMid,fontWeight:700,cursor:"pointer",width:mob?"100%":"auto"}}>← Артқа</button><button onClick={()=>setStep(4)} style={{padding:"12px 28px",borderRadius:"14px",border:"none",background:C.accent,color:"#fff",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(13,148,136,0.3)",width:mob?"100%":"auto"}}>Келесі →</button></div>
          </GlassCard></FadeIn>}

          {step===4&&<FadeIn delay={100}><GlassCard>
            <SH icon="🔬" title="Зертханалық анализдер"/>
            {labs===null&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"16px",padding:"28px 0"}}><p style={{fontSize:"16px",fontWeight:600,color:C.textMid,textAlign:"center"}}>Анализ нәтижелеріңіз бар ма?</p><div style={{display:"flex",gap:"12px",flexWrap:"wrap",justifyContent:"center"}}><button onClick={()=>setLabs(true)} style={{padding:"14px 32px",borderRadius:"14px",border:`2px solid ${C.accent}`,background:C.accentLight,color:C.accent,fontWeight:700,fontSize:"15px",cursor:"pointer"}}>✅ Иә</button><button onClick={()=>setLabs(false)} style={{padding:"14px 32px",borderRadius:"14px",border:`2px solid ${C.border}`,background:C.white,color:C.textMid,fontWeight:700,fontSize:"15px",cursor:"pointer"}}>❌ Жоқ</button></div></div>}
            {labs===true&&<div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2,1fr)",gap:"16px"}}>{labFactors.map(f=><div key={f.id} style={{display:"flex",flexDirection:"column",gap:"8px"}}><label style={{fontSize:"13px",fontWeight:600,color:C.textMid,display:"flex",alignItems:"center",gap:"8px"}}><span>{f.i}</span>{f.l}</label><div style={{display:"flex",gap:"6px",alignItems:"center"}}><input type="number" inputMode="decimal" step="0.1" min={f.min} max={f.max} value={fd[f.id]||""} onChange={e=>s(f.id,e.target.value)} placeholder={`${f.min}—${f.max}`} style={inpS(f.id)}/><span style={{fontSize:"11px",color:C.textDim,padding:"8px 10px",background:C.cardAlt,borderRadius:"10px",whiteSpace:"nowrap",fontWeight:600}}>{f.u}</span></div></div>)}</div>}
            {labs===false&&<div style={{padding:"20px",borderRadius:"14px",background:C.infoBg,border:`1px solid ${C.info}22`,textAlign:"center"}}><p style={{fontSize:"14px",color:C.info,fontWeight:600,margin:0}}>Анализсіз де бағалау жүргізуге болады.</p></div>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"24px",gap:"12px",flexDirection:mob?"column-reverse":"row"}}><button onClick={()=>setStep(3)} style={{padding:"12px 28px",borderRadius:"14px",border:`2px solid ${C.border}`,background:C.white,color:C.textMid,fontWeight:700,cursor:"pointer",width:mob?"100%":"auto"}}>← Артқа</button><button onClick={analyze} style={{padding:mob?"16px 28px":"14px 40px",borderRadius:"14px",border:"none",background:"linear-gradient(135deg,#0d9488,#0f766e)",color:"#fff",fontWeight:800,fontSize:"16px",cursor:"pointer",boxShadow:"0 6px 24px rgba(13,148,136,0.4)",width:mob?"100%":"auto",letterSpacing:"0.5px"}}>🔍 Талдау жүргізу</button></div>
          </GlassCard></FadeIn>}
        </div>}

        {cp==="results"&&res&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <FadeIn><GlassCard style={{background:res.lb,border:`2px solid ${res.lc}33`,textAlign:"center",padding:mob?"32px 20px":"40px"}}>
            <div style={{width:mob?"110px":"130px",height:mob?"110px":"130px",borderRadius:"50%",margin:"0 auto 20px",background:`conic-gradient(${res.lc} ${res.pct*3.6}deg, ${C.border}22 0deg)`,display:"flex",alignItems:"center",justifyContent:"center",animation:"si 1s cubic-bezier(0.16,1,0.3,1)"}}>
              <div style={{width:mob?"88px":"104px",height:mob?"88px":"104px",borderRadius:"50%",background:res.lb,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:mob?"30px":"36px",fontWeight:900,color:res.lc,fontFamily:"'JetBrains Mono',monospace"}}><AnimatedNumber value={res.pct}/>%</span></div>
            </div>
            <h2 style={{fontSize:mob?"24px":"28px",fontWeight:900,color:res.lc,margin:"0 0 8px"}}>{res.ll}</h2>
            <p style={{fontSize:"14px",color:C.textMid}}>Балл: {res.score} / {res.maxP}</p>
          </GlassCard></FadeIn>

          <FadeIn delay={200}><GlassCard><SH icon="📊" title="Факторлар"/><div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{res.factors.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:mob?"wrap":"nowrap"}}><span style={{width:mob?"100%":"130px",fontSize:"13px",fontWeight:600,color:C.textMid}}>{f.n}</span><div style={{flex:1,height:"8px",background:C.borderLight,borderRadius:"4px",overflow:"hidden",minWidth:"80px"}}><div style={{width:`${(f.s/f.m)*100}%`,height:"100%",borderRadius:"4px",background:f.st==="danger"?C.danger:f.st==="warning"?C.warning:C.safe,transition:`width 0.8s cubic-bezier(0.16,1,0.3,1)`,transitionDelay:`${i*100}ms`}}/></div><span style={{fontSize:"13px",fontWeight:700,color:C.textMid,fontFamily:"'JetBrains Mono',monospace"}}>{f.s}/{f.m}</span></div>)}</div></GlassCard></FadeIn>

          <FadeIn delay={400}><GlassCard><SH icon="💡" title="Ұсыныстар"/><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2,1fr)",gap:"12px"}}>{getRecs(res.level).map((r,i)=><FadeIn key={i} delay={500+i*100}><div style={{padding:"18px",borderRadius:"14px",background:C.cardAlt,border:`1px solid ${C.border}`}}><div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}><span style={{fontSize:"22px"}}>{r.i}</span><h4 style={{fontSize:"14px",fontWeight:700,margin:0}}>{r.t}</h4></div><p style={{fontSize:"13px",color:C.textMid,lineHeight:1.6,margin:0}}>{r.x}</p></div></FadeIn>)}</div></GlassCard></FadeIn>

          <div style={{textAlign:"center"}}><button onClick={reset} style={{padding:"14px 36px",borderRadius:"14px",border:`2px solid ${C.accent}`,background:C.white,color:C.accent,fontWeight:700,fontSize:"15px",cursor:"pointer",width:mob?"100%":"auto"}}>🔄 Қайта бастау</button></div>
        </div>}

        {cp==="dir"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <FadeIn><div style={{display:"flex",gap:"6px",justifyContent:"center",flexWrap:"wrap"}}>{[{id:"tests",l:"📋 Анализдер"},{id:"clinics",l:"🏥 Клиникалар"},{id:"doctors",l:"👨‍⚕️ Дәрігерлер"}].map(t=><button key={t.id} onClick={()=>setDtab(t.id)} style={{padding:mob?"10px 16px":"12px 24px",borderRadius:"14px",border:"none",background:dtab===t.id?C.accent:C.glass,color:dtab===t.id?"#fff":C.textMid,fontWeight:700,fontSize:mob?"13px":"14px",cursor:"pointer",backdropFilter:"blur(8px)",transition:"all 0.3s",boxShadow:dtab===t.id?"0 4px 16px rgba(13,148,136,0.3)":"none"}}>{t.l}</button>)}</div></FadeIn>

          {/* Geo button - shows on clinics and doctors tabs */}
          {(dtab==="clinics"||dtab==="doctors")&&<FadeIn delay={50}>
            <GlassCard style={{padding:"14px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
                <button onClick={requestGeo} disabled={geoLoading} style={{padding:"10px 20px",borderRadius:"12px",border:"none",background:userLoc?"linear-gradient(135deg,#16a34a,#15803d)":geoLoading?"#94a3b8":"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:700,fontSize:"13px",cursor:geoLoading?"wait":"pointer",display:"flex",alignItems:"center",gap:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>
                  <span style={{fontSize:"16px"}}>{geoLoading?"⏳":userLoc?"✅":"📍"}</span>
                  {geoLoading?"Анықталуда...":userLoc?"Орналасу анықталды":"Менің орналасқан жерім"}
                </button>
                {userLoc&&<span style={{fontSize:"12px",color:C.safe,fontWeight:600}}>Жақын мекемелер бірінші көрсетіледі</span>}
                {geoError&&<span style={{fontSize:"12px",color:C.danger,fontWeight:600}}>{geoError}</span>}
              </div>
            </GlassCard>
          </FadeIn>}

          {dtab==="tests"&&<div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <FadeIn delay={100}><SH icon="🩸" title="Ұсынылатын анализдер" subtitle="Негізгі тексерулер"/></FadeIn>
            {recTests.map((t,i)=><FadeIn key={i} delay={150+i*80}><GlassCard style={{padding:mob?"18px":"24px"}}><div style={{display:"flex",gap:"14px",alignItems:mob?"flex-start":"center",flexDirection:mob?"column":"row"}}><span style={{fontSize:"36px"}}>{t.i}</span><div style={{flex:1}}><h4 style={{fontSize:"15px",fontWeight:800,margin:"0 0 4px"}}>{t.name}</h4><p style={{fontSize:"13px",color:C.textMid,lineHeight:1.6,margin:"0 0 12px"}}>{t.desc}</p>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:"8px"}}>{[{l:"Қалыпты",v:t.norm,c:C.safe,bg:C.safeBg},{l:"Преддиабет",v:t.pre,c:C.warning,bg:C.warningBg},{l:"Диабет",v:t.diab,c:C.danger,bg:C.dangerBg}].map((x,j)=><div key={j} style={{padding:"8px 12px",borderRadius:"10px",background:x.bg,border:`1px solid ${x.c}22`}}><div style={{fontSize:"10px",fontWeight:700,color:x.c,textTransform:"uppercase",marginBottom:"2px"}}>{x.l}</div><div style={{fontSize:"13px",fontWeight:700}}>{x.v}</div></div>)}</div>
              <div style={{marginTop:"8px",fontSize:"12px",color:C.textDim}}>⏱️ {t.freq}</div></div></div></GlassCard></FadeIn>)}
          </div>}

          {dtab==="clinics"&&<div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <FadeIn delay={100}><GlassCard style={{padding:"16px 20px"}}><div style={{display:"flex",gap:"12px",flexWrap:"wrap",alignItems:"center"}}>
              <div style={{flex:1,minWidth:"180px"}}><label style={{fontSize:"12px",fontWeight:700,color:C.textDim,marginBottom:"6px",display:"block"}}>🏙️ Қала</label><select value={city} onChange={e=>setCity(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:"12px",border:`1.5px solid ${C.border}`,background:C.white,fontSize:"14px",fontWeight:600,outline:"none",cursor:"pointer",appearance:"none",WebkitAppearance:"none"}}>{cities.map(c2=><option key={c2} value={c2}>{c2}</option>)}</select></div>
              <div style={{flex:1,minWidth:"180px"}}><label style={{fontSize:"12px",fontWeight:700,color:C.textDim,marginBottom:"6px",display:"block"}}>🏷️ Түрі</label><select value={ctype} onChange={e=>setCtype(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:"12px",border:`1.5px solid ${C.border}`,background:C.white,fontSize:"14px",fontWeight:600,outline:"none",cursor:"pointer",appearance:"none",WebkitAppearance:"none"}}><option value="all">Барлығы</option><option value="clinic">Клиника</option><option value="lab">Зертхана</option></select></div>
            </div><div style={{marginTop:"12px",fontSize:"13px",color:C.textDim,fontWeight:600}}>Табылды: {fc.length} мекеме</div></GlassCard></FadeIn>

            {fc.map((c2,i)=><FadeIn key={i} delay={150+i*60}><GlassCard style={{padding:mob?"18px":"24px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px"}}><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}><span style={{fontSize:"18px"}}>{c2.type==="lab"?"🧪":"🏥"}</span><h4 style={{fontSize:"15px",fontWeight:800,margin:0}}>{c2.name}</h4></div><div style={{fontSize:"13px",color:C.textMid,marginBottom:"4px"}}>📍 {c2.city}, {c2.addr}</div><div style={{fontSize:"13px",color:C.textMid,marginBottom:"4px"}}><a href={`tel:${c2.phone}`} style={{color:C.info,textDecoration:"none",fontWeight:600}}>📞 {c2.phone}</a></div><div style={{fontSize:"12px",color:C.accent,fontWeight:600}}>{c2.spec}</div><div style={{fontSize:"12px",color:C.textDim,marginTop:"4px"}}>🕐 {c2.hours}</div>{c2.dist!==null&&<div style={{fontSize:"12px",color:C.info,fontWeight:700,marginTop:"4px"}}>📏 {c2.dist<1?(c2.dist*1000).toFixed(0)+" м":c2.dist.toFixed(1)+" км"}</div>}</div><div style={{display:"flex",flexDirection:"column",gap:"6px",alignItems:"flex-end"}}><div style={{padding:"6px 14px",borderRadius:"10px",background:C.warningBg,display:"flex",alignItems:"center",gap:"4px"}}><span style={{fontSize:"14px"}}>⭐</span><span style={{fontWeight:800,color:C.warning,fontFamily:"'JetBrains Mono',monospace"}}>{c2.rating}</span></div><a href={`https://maps.google.com/?q=${c2.lat},${c2.lng}`} target="_blank" rel="noopener noreferrer" style={{padding:"6px 12px",borderRadius:"10px",background:C.infoBg,border:`1px solid ${C.info}22`,fontSize:"12px",fontWeight:700,color:C.info,textDecoration:"none",display:"flex",alignItems:"center",gap:"4px"}}>🗺️ Картада</a></div></div><div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"12px"}}>{c2.svc.map((sv,j)=><span key={j} style={{padding:"4px 10px",borderRadius:"8px",fontSize:"11px",fontWeight:600,background:C.accentLight,color:C.accent,border:`1px solid ${C.accent}22`}}>{sv}</span>)}</div></GlassCard></FadeIn>)}
          </div>}

          {dtab==="doctors"&&<div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <FadeIn delay={100}><GlassCard style={{padding:"16px 20px"}}><div style={{display:"flex",gap:"12px",flexWrap:"wrap",alignItems:"center"}}>
              <div style={{flex:1,minWidth:"180px"}}><label style={{fontSize:"12px",fontWeight:700,color:C.textDim,marginBottom:"6px",display:"block"}}>🏙️ Қала</label><select value={city} onChange={e=>setCity(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:"12px",border:`1.5px solid ${C.border}`,background:C.white,fontSize:"14px",fontWeight:600,outline:"none",cursor:"pointer",appearance:"none",WebkitAppearance:"none"}}>{cities.map(c2=><option key={c2} value={c2}>{c2}</option>)}</select></div>
              <div style={{flex:1,minWidth:"180px"}}><label style={{fontSize:"12px",fontWeight:700,color:C.textDim,marginBottom:"6px",display:"block"}}>🩺 Мамандық</label><select value={specFilter} onChange={e=>setSpecFilter(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:"12px",border:`1.5px solid ${C.border}`,background:C.white,fontSize:"14px",fontWeight:600,outline:"none",cursor:"pointer",appearance:"none",WebkitAppearance:"none"}}>{specFilters.map(sf=><option key={sf} value={sf}>{sf}</option>)}</select></div>
            </div><div style={{marginTop:"12px",fontSize:"13px",color:C.textDim,fontWeight:600}}>Табылды: {fd2.length} дәрігер</div></GlassCard></FadeIn>

            {fd2.map((d,i)=><FadeIn key={i} delay={150+i*60}><GlassCard style={{padding:mob?"18px":"24px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px"}}><div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}><div style={{width:"44px",height:"44px",borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accentDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",color:"#fff",fontWeight:800,flexShrink:0}}>{d.name[0]}</div><div><h4 style={{fontSize:"15px",fontWeight:800,margin:0,color:C.text}}>{d.name}</h4><div style={{fontSize:"12px",color:C.accent,fontWeight:700}}>{d.spec}</div></div></div>
              <div style={{fontSize:"13px",color:C.textMid,marginBottom:"4px"}}>🏥 {d.clinic}</div>
              <div style={{fontSize:"13px",color:C.textMid,marginBottom:"4px"}}>📍 {d.city}</div>
              <div style={{fontSize:"13px",marginBottom:"4px"}}><a href={`tel:${d.phone}`} style={{color:C.info,textDecoration:"none",fontWeight:600}}>📞 {d.phone}</a></div>
              <div style={{fontSize:"12px",color:C.textDim}}>🕐 {d.hours}</div>
              {d.dist!==null&&<div style={{fontSize:"12px",color:C.info,fontWeight:700,marginTop:"4px"}}>📏 {d.dist<1?(d.dist*1000).toFixed(0)+" м":d.dist.toFixed(1)+" км"}</div>}
            </div><div style={{display:"flex",flexDirection:"column",gap:"6px",alignItems:"flex-end"}}>
              <div style={{padding:"6px 14px",borderRadius:"10px",background:C.purpleBg,border:`1px solid ${C.purple}22`,fontSize:"12px",fontWeight:700,color:C.purple}}>🎓 {d.exp} жыл тәжірибе</div>
              <a href={`https://maps.google.com/?q=${d.lat},${d.lng}`} target="_blank" rel="noopener noreferrer" style={{padding:"6px 12px",borderRadius:"10px",background:C.infoBg,border:`1px solid ${C.info}22`,fontSize:"12px",fontWeight:700,color:C.info,textDecoration:"none",display:"flex",alignItems:"center",gap:"4px"}}>🗺️ Картада</a>
            </div></div></GlassCard></FadeIn>)}
          </div>}
        </div>}

        {cp==="stats"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <FadeIn><GlassCard><SH icon="📈" title="ҚР диабет динамикасы" subtitle="Мың адам"/><ResponsiveContainer width="100%" height={mob?250:300}><AreaChart data={trend}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.3}/><stop offset="100%" stopColor={C.accent} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="y" tick={{fontSize:12,fill:C.textMid}}/><YAxis tick={{fontSize:12,fill:C.textDim}}/><Tooltip/><Area type="monotone" dataKey="c" stroke={C.accent} fill="url(#ag)" strokeWidth={3} dot={{r:5,fill:C.accent}} animationDuration={1500}/></AreaChart></ResponsiveContainer></GlassCard></FadeIn>

          <FadeIn delay={200}><GlassCard><SH icon="🗺️" title="Аймақтар бойынша" subtitle="1000 адамға"/><ResponsiveContainer width="100%" height={mob?280:320}><BarChart data={kzRegions}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="region" tick={{fontSize:mob?9:12,fill:C.textMid}} angle={mob?-35:0} textAnchor={mob?"end":"middle"} height={mob?70:40}/><YAxis tick={{fontSize:12,fill:C.textDim}}/><Tooltip/><Bar dataKey="rate" fill={C.accent} radius={[8,8,0,0]} animationDuration={1200}/></BarChart></ResponsiveContainer></GlassCard></FadeIn>

          <FadeIn delay={400}><GlassCard><SH icon="👥" title="Жас және жыныс бойынша" subtitle="%"/><ResponsiveContainer width="100%" height={mob?260:300}><BarChart data={ageDist}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="g" tick={{fontSize:12,fill:C.textMid}}/><YAxis tick={{fontSize:12,fill:C.textDim}}/><Tooltip/><Legend wrapperStyle={{fontSize:"13px"}}/><Bar dataKey="m" name="Ерлер" fill={C.info} radius={[4,4,0,0]} animationDuration={1400}/><Bar dataKey="f" name="Әйелдер" fill={C.purple} radius={[4,4,0,0]} animationDuration={1600}/></BarChart></ResponsiveContainer></GlassCard></FadeIn>

          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2,1fr)",gap:"12px"}}>{[{t:"IDF (2025)",x:"Әлемде 537 млн адам ҚД-мен ауырады.",c:C.info,bg:C.infoBg},{t:"Қазақстан",x:"1.5 млн+ тіркелген, нақты сан 2-3 есе көп.",c:C.accent,bg:C.accentLight},{t:"Ерте анықтау",x:"Асқынуларды 50-70% азайтады.",c:C.safe,bg:C.safeBg},{t:"Диагноз қойылмаған",x:"Науқастардың ~40%-ы (ДДҰ).",c:C.warning,bg:C.warningBg}].map((f,i)=><FadeIn key={i} delay={600+i*100}><GlassCard style={{background:f.bg,border:`1px solid ${f.c}22`}}><h4 style={{fontSize:"14px",fontWeight:800,color:f.c,margin:"0 0 8px"}}>{f.t}</h4><p style={{fontSize:"13px",color:C.textMid,lineHeight:1.7,margin:0}}>{f.x}</p></GlassCard></FadeIn>)}</div>

          <FadeIn delay={1000}><GlassCard style={{padding:"14px 20px"}}><div style={{fontSize:"11px",color:C.textDim,lineHeight:1.8}}><span style={{fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>Дереккөздер: </span>IDF Diabetes Atlas 11th Ed. • ADA Standards 2025/2026 • ҚР ДСМ статистикасы</div></GlassCard></FadeIn>
        </div>}
      </main>

      <footer style={{textAlign:"center",padding:mob?"16px 14px 90px":"24px",borderTop:`1px solid ${C.border}`,background:"rgba(255,255,255,0.6)"}}><p style={{fontSize:"11px",color:C.textDim,margin:0}}>DiabetScan v3.0 • Қант диабетін ерте анықтау жүйесі • Медициналық диагноз емес</p></footer>

      <style>{`
        @keyframes si{from{transform:rotate(-180deg) scale(0.5);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
        input:focus,select:focus{border-color:${C.accent}!important;box-shadow:0 0 0 4px ${C.accentGlow};}
        input::placeholder{color:${C.textDim};}
        button{transition:all 0.25s cubic-bezier(0.16,1,0.3,1);}
        button:active{transform:scale(0.97)!important;}
        ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        html,body{overflow-x:hidden;max-width:100vw;}
        @media(max-width:767px){input,select,textarea{font-size:16px!important;}}
        @media(max-width:1023px) and (min-width:768px){
          header nav button span:last-child{max-width:60px;overflow:hidden;text-overflow:ellipsis;}
        }
        @media(max-width:850px) and (min-width:768px){
          header nav button{padding:7px 8px!important;font-size:11px!important;gap:3px!important;}
        }
      `}</style>
    </div>
  );
}

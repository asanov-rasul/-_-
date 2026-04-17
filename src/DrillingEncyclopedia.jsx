import { useState, useEffect } from "react";

const theme = {
  bg: "#0a0c0f", bg2: "#111418", bg3: "#181d24", panel: "#1a2030",
  border: "#2a3545", accent: "#f4a322", accent2: "#e8891a",
  steel: "#4a9eba", green: "#3dba7a", red: "#e05555",
  text: "#d4dbe8", text2: "#8a96a8", text3: "#5a6575"
};

const catColors = {
  "Долота": { bg: "rgba(244,163,34,0.12)", color: "#f4a322" },
  "Трубы и колонны": { bg: "rgba(74,158,186,0.12)", color: "#4a9eba" },
  "Забойные двигатели": { bg: "rgba(61,186,122,0.12)", color: "#3dba7a" },
  "КИП и контроль": { bg: "rgba(186,74,186,0.12)", color: "#ba4aba" },
  "Циркуляция": { bg: "rgba(74,130,186,0.12)", color: "#4a82ba" },
  "Герметизация": { bg: "rgba(224,85,85,0.12)", color: "#e05555" },
  "Заканчивание скважин": { bg: "rgba(186,150,74,0.12)", color: "#baa44a" },
  "Буровое оборудование": { bg: "rgba(130,74,186,0.12)", color: "#824aba" },
  "default": { bg: "rgba(244,163,34,0.12)", color: "#f4a322" }
};

const catIcons = {
  "Долота": "🔩", "Трубы и колонны": "⚙️", "Забойные двигатели": "🏭",
  "КИП и контроль": "📡", "Циркуляция": "🔄", "Герметизация": "🔒",
  "Заканчивание скважин": "⛽", "Буровое оборудование": "🏗️", "default": "🛠️"
};

const getCol = (cat) => catColors[cat] || catColors["default"];
const getIcon = (cat) => catIcons[cat] || catIcons["default"];

const tagClasses = [
  { bg: "rgba(74,158,186,0.15)", color: "#4a9eba", border: "rgba(74,158,186,0.25)" },
  { bg: "rgba(61,186,122,0.12)", color: "#3dba7a", border: "rgba(61,186,122,0.2)" },
  { bg: "rgba(244,163,34,0.1)", color: "#f4a322", border: "rgba(244,163,34,0.2)" },
  { bg: "rgba(224,85,85,0.1)", color: "#e05555", border: "rgba(224,85,85,0.2)" }
];

const QUICK_LINKS = [
  "Долота PDC", "Шарошечные долота", "Бурильные трубы", "Турбобур",
  "Превентор", "Пакер", "Телеметрия MWD LWD", "Буровой насос",
  "Обсадная колонна", "Верхний привод", "Буровой раствор", "Каротаж"
];

const SUGGESTIONS = [
  "Трёхшарошечное долото", "Превентор", "Турбобур ТСШ",
  "РУС роторная система", "Вибросито", "ВЗД забойный двигатель",
  "Пакер цементировочный", "MWD LWD каротаж"
];

const CATS = [
  { label: "Все", value: "" },
  { label: "🔩 Долота", value: "долота" },
  { label: "⚙️ Трубы", value: "трубы" },
  { label: "🏭 Двигатели", value: "забойные двигатели" },
  { label: "📡 КИП", value: "контроль телеметрия" },
  { label: "🔄 Циркуляция", value: "циркуляция насос" },
  { label: "🔒 Герметизация", value: "превентор пакер" },
  { label: "⛽ Заканчивание", value: "заканчивание обсадная" }
];

async function callAI(systemPrompt, userMsg) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMsg }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map(b => b.text || "").join("");
}

function Spinner({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `${size > 24 ? 3 : 2}px solid ${theme.border}`,
      borderTopColor: theme.accent,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      flexShrink: 0
    }} />
  );
}

function Card({ item, onClick }) {
  const col = getCol(item.category);
  const icon = getIcon(item.category);
  const specs = Object.entries(item.specs || {});
  const firstSpec = specs.slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(" · ");

  return (
    <div onClick={() => onClick(item)} style={{
      background: theme.bg3, border: `1px solid ${theme.border}`,
      borderRadius: 4, cursor: "pointer", overflow: "hidden",
      transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
      position: "relative"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = "rgba(244,163,34,0.45)";
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = "";
    }}>
      {/* header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${theme.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 40, height: 40, borderRadius: 4, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: theme.text3, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>
            {item.category}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, lineHeight: 1.3 }}>
            {item.name}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "12px 16px 14px" }}>
        <div style={{ fontSize: 13, color: theme.text2, lineHeight: 1.65, marginBottom: 12,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.shortDesc}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {(item.tags || []).slice(0, 4).map((t, i) => (
            <span key={i} style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
              padding: "3px 8px", borderRadius: 2,
              background: tagClasses[i % 4].bg, color: tagClasses[i % 4].color,
              border: `1px solid ${tagClasses[i % 4].border}`
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: "9px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: theme.text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
          {firstSpec || "нет параметров"}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: theme.accent, opacity: 0.75, flexShrink: 0 }}>
          подробнее →
        </div>
      </div>
    </div>
  );
}

function Modal({ item, onClose }) {
  const [detail, setDetail] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    if (!item) return;
    setDetail(""); setLoadingDetail(true);
    callAI(
      "Ты — опытный буровой инженер. Отвечай на русском. Без заголовков, структурированными абзацами по 4 темам: 1) суть и принцип работы, 2) где/когда применяется, 3) конструктивные особенности, 4) обслуживание и типичные проблемы.",
      `Расскажи подробно про "${item.name}" (${item.nameEn || item.category}). ${item.shortDesc}`
    ).then(text => { setDetail(text); setLoadingDetail(false); })
     .catch(e => { setDetail("Ошибка загрузки: " + e.message); setLoadingDetail(false); });
  }, [item]);

  if (!item) return null;
  const col = getCol(item.category);
  const icon = getIcon(item.category);

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
      backdropFilter: "blur(10px)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{
        background: theme.bg2, border: `1px solid ${theme.border}`,
        borderRadius: 6, width: "100%", maxWidth: 820,
        maxHeight: "88vh", overflowY: "auto", position: "relative"
      }}>
        {/* header */}
        <div style={{
          padding: "22px 24px 18px", borderBottom: `1px solid ${theme.border}`,
          display: "flex", gap: 16, alignItems: "flex-start",
          position: "sticky", top: 0, background: theme.bg2, zIndex: 2
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 6, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: theme.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
              {item.category}
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: 1, color: theme.text, lineHeight: 1, marginBottom: 6 }}>
              {item.name}
            </div>
            <div style={{ fontSize: 13, color: theme.text2 }}>
              {item.nameEn} · {item.purpose}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: theme.bg3, border: `1px solid ${theme.border}`,
            color: theme.text2, width: 36, height: 36, borderRadius: 4,
            cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0
          }}>✕</button>
        </div>

        <div style={{ padding: "22px 24px" }}>
          {/* desc */}
          <SectionTitle>Описание</SectionTitle>
          <p style={{ fontSize: 14, color: theme.text2, lineHeight: 1.8, marginBottom: 24 }}>{item.shortDesc}</p>

          {/* specs */}
          <SectionTitle>Технические параметры</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontFamily: "'IBM Plex Mono',monospace", fontSize: 13 }}>
            <tbody>
              {Object.entries(item.specs || {}).map(([k, v], i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "9px 12px", color: theme.text3, width: "45%", fontSize: 12 }}>{k}</td>
                  <td style={{ padding: "9px 12px", color: theme.text, fontWeight: 500, background: i % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent" }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ai */}
          <SectionTitle>Подробный анализ (AI)</SectionTitle>
          <div style={{
            background: theme.panel, border: `1px solid rgba(244,163,34,0.2)`,
            borderRadius: 4, padding: 18, minHeight: 80
          }}>
            {loadingDetail ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: theme.text3, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12 }}>
                <Spinner size={16} /><span>Генерация подробного описания...</span>
              </div>
            ) : (
              <p style={{ fontSize: 14, color: theme.text2, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{detail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 2,
      textTransform: "uppercase", color: theme.steel, marginBottom: 14,
      display: "flex", alignItems: "center", gap: 10
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: theme.border }} />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
      @keyframes spin { to { transform: rotate(360deg); } }
      * { scrollbar-width: thin; scrollbar-color: #2a3545 #0a0c0f; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #0a0c0f; }
      ::-webkit-scrollbar-thumb { background: #2a3545; border-radius: 3px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const doSearch = async (q, cat) => {
    const searchQuery = [q, cat].filter(Boolean).join(" ");
    if (!searchQuery.trim()) return;

    setLoading(true); setError(""); setResults(null);

    const system = `Ты — эксперт по буровому оборудованию нефтегазовой отрасли.
Верни ТОЛЬКО валидный JSON без markdown и backticks:
{
  "items": [
    {
      "id": "latin_id",
      "name": "Полное название RU",
      "nameEn": "English name",
      "category": "Долота|Трубы и колонны|Забойные двигатели|КИП и контроль|Циркуляция|Герметизация|Заканчивание скважин|Буровое оборудование",
      "shortDesc": "2-3 предложения: что это и для чего",
      "purpose": "Основное назначение (кратко)",
      "specs": {"Параметр": "значение с единицами"},
      "tags": ["тег1","тег2","тег3"]
    }
  ]
}
specs: 4-7 реальных техпараметров. Верни 6-10 позиций. Только JSON.`;

    try {
      const raw = await callAI(system, `Запрос: "${searchQuery}". Найди буровое оборудование и инструменты по этому запросу.`);
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Не удалось распарсить ответ");
      const parsed = JSON.parse(match[0]);
      setResults(parsed.items || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleSearch = () => doSearch(query, activeCat);
  const handleQuick = (q) => { setQuery(q); doSearch(q, activeCat); };
  const handleCat = (cat) => {
    setActiveCat(cat);
    if (query || cat) doSearch(query, cat);
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'IBM Plex Sans',sans-serif",
      backgroundImage: "linear-gradient(rgba(244,163,34,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(244,163,34,0.025) 1px,transparent 1px)",
      backgroundSize: "40px 40px" }}>

      {/* HEADER */}
      <header style={{ borderBottom: `1px solid ${theme.border}`, background: "rgba(10,12,15,0.97)", backdropFilter: "blur(20px)", padding: "0 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: 4, color: theme.accent, textShadow: "0 0 30px rgba(244,163,34,0.35)" }}>
            DRILL<span style={{ color: theme.text2 }}>PEDIA</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: theme.text3, textAlign: "right", lineHeight: 1.7 }}>
            <span style={{ color: theme.steel }}>AI-POWERED</span> ENCYCLOPEDIA<br />БУРОВОЕ ОБОРУДОВАНИЕ И ИНСТРУМЕНТЫ
          </div>
        </div>
      </header>

      {/* HERO */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 32px 32px" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(42px,7vw,88px)", lineHeight: 0.92, letterSpacing: 2, marginBottom: 14 }}>
          <div style={{ color: theme.text }}>БУРОВОЕ</div>
          <div style={{ color: "transparent", WebkitTextStroke: `1px rgba(244,163,34,0.45)` }}>ОБОРУДОВАНИЕ</div>
          <div style={{ color: theme.accent }}>СПРАВОЧНИК</div>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: theme.text2, letterSpacing: 2, marginBottom: 36 }}>
          // Полная база данных · Технические параметры · AI-описания
        </div>

        {/* SEARCH */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: theme.accent, fontSize: 20, pointerEvents: "none" }}>⌕</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Введите название: долото, превентор, турбобур, пакер, МВД..."
              style={{
                width: "100%", background: theme.panel, border: `1px solid ${theme.border}`,
                borderRight: "none", color: theme.text, fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 14, padding: "16px 16px 16px 52px", outline: "none",
                borderRadius: "4px 0 0 4px", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = theme.accent}
              onBlur={e => e.target.style.borderColor = theme.border}
            />
          </div>
          <button onClick={handleSearch} disabled={loading} style={{
            background: loading ? theme.text3 : theme.accent,
            border: `1px solid ${loading ? theme.text3 : theme.accent}`,
            color: "#000", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18,
            letterSpacing: 2, padding: "0 32px", cursor: loading ? "not-allowed" : "pointer",
            borderRadius: "0 4px 4px 0", whiteSpace: "nowrap", transition: "background 0.2s"
          }}>
            {loading ? "..." : "НАЙТИ"}
          </button>
        </div>

        {/* CATEGORY PILLS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CATS.map(c => (
            <button key={c.value} onClick={() => handleCat(c.value)} style={{
              background: activeCat === c.value ? "rgba(244,163,34,0.08)" : theme.bg3,
              border: `1px solid ${activeCat === c.value ? theme.accent : theme.border}`,
              color: activeCat === c.value ? theme.accent : theme.text2,
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, padding: "6px 13px",
              borderRadius: 2, cursor: "pointer", letterSpacing: "0.5px", transition: "all 0.15s"
            }}>{c.label}</button>
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(224,85,85,0.1)", border: `1px solid rgba(224,85,85,0.3)`, color: theme.red,
            padding: "10px 14px", borderRadius: 4, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, marginTop: 12 }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px 80px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 28 }}>

        {/* SIDEBAR */}
        <aside style={{ position: "sticky", top: 20, height: "fit-content" }}>
          <SidePanel title="// Статистика">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: theme.border }}>
              {[["200+","Позиций"],["12","Разделов"],["AI","Поиск"],["∞","Запросов"]].map(([n,l]) => (
                <div key={l} style={{ background: theme.bg3, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: theme.accent, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: theme.text3, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </SidePanel>

          <SidePanel title="// Быстрый доступ">
            {QUICK_LINKS.map(q => (
              <div key={q} onClick={() => handleQuick(q)} style={{
                padding: "9px 14px", fontSize: 13, color: theme.text2, cursor: "pointer",
                borderLeft: "2px solid transparent", transition: "all 0.15s",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}
              onMouseEnter={e => { e.currentTarget.style.color = theme.text; e.currentTarget.style.borderLeftColor = theme.accent; e.currentTarget.style.background = "rgba(244,163,34,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = theme.text2; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.background = "transparent"; }}>
                {q} <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: theme.text3 }}>→</span>
              </div>
            ))}
          </SidePanel>

          <SidePanel title="// Подсказки">
            <div style={{ padding: "14px", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: theme.text3, lineHeight: 1.85 }}>
              Примеры запросов:<br/>
              · "долото PDC 215.9мм"<br/>
              · "НУБТ утяжелённые трубы"<br/>
              · "превентор ОП-320"<br/>
              · "ясс гидравлический"<br/>
              · "центратор пружинный"
            </div>
          </SidePanel>
        </aside>

        {/* CONTENT */}
        <div>
          {/* Status bar */}
          {results !== null && !loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 16, padding: "9px 14px", background: theme.bg3, border: `1px solid ${theme.border}`, borderRadius: 4 }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: theme.text2 }}>
                Найдено: <span style={{ color: theme.accent }}>{results.length}</span> позиций
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["grid","list"].map(v => (
                  <button key={v} onClick={() => setViewMode(v)} style={{
                    background: "none", border: `1px solid ${viewMode === v ? theme.accent : theme.border}`,
                    color: viewMode === v ? theme.accent : theme.text3,
                    padding: "4px 10px", cursor: "pointer", fontSize: 12, borderRadius: 2, transition: "all 0.15s"
                  }}>{v === "grid" ? "▦ Сетка" : "≡ Список"}</button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 18 }}>
              <Spinner size={48} />
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: theme.text3, letterSpacing: 1 }}>
                // AI генерирует список оборудования...
              </p>
            </div>
          )}

          {/* Initial state */}
          {!loading && results === null && (
            <div style={{ textAlign: "center", padding: "72px 20px" }}>
              <div style={{ fontSize: 60, marginBottom: 22, opacity: 0.18, filter: "grayscale(1)" }}>⛏</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, letterSpacing: 3, color: theme.text2, marginBottom: 10 }}>НАЧНИТЕ ПОИСК</h2>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: theme.text3, maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
                Введите название бурового прибора, инструмента или оборудования. AI сгенерирует описание и технические параметры.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, justifyContent: "center" }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => handleQuick(s)} style={{
                    background: theme.bg3, border: `1px solid ${theme.border}`, color: theme.text2,
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, padding: "8px 15px",
                    borderRadius: 2, cursor: "pointer", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = "rgba(244,163,34,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text2; e.currentTarget.style.background = theme.bg3; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && results !== null && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.4 }}>🔍</div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 2, color: theme.text2, marginBottom: 8 }}>НЕ НАЙДЕНО</h3>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: theme.text3 }}>Попробуйте другой запрос</p>
            </div>
          )}

          {/* Results */}
          {!loading && results && results.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: viewMode === "list" ? "1fr" : "repeat(auto-fill,minmax(320px,1fr))",
              gap: 14
            }}>
              {results.map(item => <Card key={item.id} item={item} onClick={setSelected} />)}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SidePanel({ title, children }) {
  return (
    <div style={{ background: theme.bg3, border: `1px solid ${theme.border}`, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ background: theme.panel, borderBottom: `1px solid ${theme.border}`, padding: "11px 14px",
        fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: theme.steel }}>
        {title}
      </div>
      {children}
    </div>
  );
}

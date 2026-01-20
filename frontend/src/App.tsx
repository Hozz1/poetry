import { useEffect, useMemo, useState } from "react";
import styles from "./App.module.css";
import { fetchLanguages, fetchPoems, type Language, type Poem } from "./api/poems";
import PoemModal from "./components/PoemModal";

type Filter = "all" | number;
type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  // Если пользователь ничего не выбирал — уважаем системную тему
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  return prefersLight ? "light" : "dark";
}

export default function App() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<Poem | null>(null);

  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Применяем тему + сохраняем
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // map: languageId -> languageName
  const langMap = useMemo(() => {
    const m = new Map<number, string>();
    for (const l of languages) m.set(l.id, l.language);
    return m;
  }, [languages]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [langs, poemsData] = await Promise.all([fetchLanguages(), fetchPoems()]);
        setLanguages(langs);
        setPoems(poemsData);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const byLang = filter === "all" ? poems : poems.filter((p) => p.language === filter);

    const q = query.trim().toLowerCase();
    if (!q) return byLang;

    return byLang.filter((p) => {
      const title = (p.title ?? "").toLowerCase();
      const desc = (p.description ?? "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [poems, filter, query]);

  const pill = (key: Filter, label: string) => {
    const active = filter === key;
    return (
      <button
        onClick={() => setFilter(key)}
        className={`${styles.pill} ${active ? styles.pillActive : ""}`}
      >
        {label}
      </button>
    );
  };

  const openedLanguageLabel =
    opened ? (langMap.get(opened.language) ?? `Language #${opened.language}`) : "";

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const themeLabel = theme === "dark" ? "Светлая тема" : "Тёмная тема";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerRow}>
            <div>
              <div className={styles.title}>Poetry</div>
              <div className={styles.subtitle}>Finnish & Russian</div>
            </div>

            <div className={styles.controls}>
              <button className={styles.themeBtn} onClick={toggleTheme}>
                {themeLabel}
              </button>

              <div className={styles.searchWrap}>
                <input
                  className={styles.search}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск…"
                />
              </div>

              <div className={styles.filters}>
                {pill("all", "Любой")}
                {languages.map((l) => pill(l.id, l.language))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {loading ? (
          <div style={{ color: "var(--muted)", marginTop: 18 }}>Loading…</div>
        ) : error ? (
          <div style={{ marginTop: 18 }}>
            <div style={{ color: "#ff8a8a", fontWeight: 700 }}>Failed to load</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>{error}</div>
          </div>
        ) : (
          <section className={styles.grid} style={{ marginTop: 18 }}>
            {filtered.map((p) => (
              <article
                key={p.id}
                className={styles.card}
                onClick={() => setOpened(p)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <span className={styles.badge}>
                    {langMap.get(p.language) ?? `Language #${p.language}`}
                  </span>
                </div>

                <p className={styles.cardDesc}>{p.description || "No description"}</p>
              </article>
            ))}
          </section>
        )}
      </main>

      <PoemModal poem={opened} languageLabel={openedLanguageLabel} onClose={() => setOpened(null)} />
    </div>
  );
}

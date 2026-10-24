"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Cpu,
  Flame,
  FolderCode,
  LayoutDashboard,
  Menu,
  Palette,
  Play,
  Search,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { tracks, type Lesson } from "@/lib/course";
import { challenges } from "@/lib/challenges";
import { projects } from "@/lib/projects";
import { resetProgress, useLearningProgress } from "@/lib/progress";
import { setTheme, themes, useTheme } from "@/lib/themes";
import ThemePicker from "./theme-picker";
import LessonReader from "./lesson-reader";
const CodeLab = dynamic(() => import("./code-lab"), {
  loading: () => (
    <p className="feature-loading" role="status">
      Opening your coding workspace…
    </p>
  ),
});
const ProjectWorkspace = dynamic(() => import("./project-workspace"), {
  loading: () => (
    <p className="feature-loading" role="status">
      Opening your project workspace…
    </p>
  ),
});

type View =
  "overview" | "lessons" | "lab" | "projects" | "progress" | "appearance";
const navigation = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "lessons", label: "My learning", Icon: BookOpen },
  { id: "lab", label: "Coding lab", Icon: Terminal },
  { id: "projects", label: "Guided projects", Icon: FolderCode },
  { id: "progress", label: "My progress", Icon: Trophy },
  { id: "appearance", label: "Appearance", Icon: Palette },
] as const;

function HeroVisual({ robot }: { robot: boolean }) {
  return (
    <div
      className={`hero-visual ${robot ? "robot-visual" : ""}`}
      aria-hidden="true"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit-node" />
      {robot ? (
        <svg className="robot-head" viewBox="0 0 280 260">
          <defs>
            <linearGradient id="metal" x2="1" y2="1">
              <stop stopColor="#b7d4dc" />
              <stop offset=".4" stopColor="#283e50" />
              <stop offset=".6" stopColor="#7699a9" />
              <stop offset="1" stopColor="#172634" />
            </linearGradient>
          </defs>
          <path
            d="m70 65 30-24h80l30 24 12 115-43 35h-77l-44-35Z"
            fill="url(#metal)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="m85 90 110-1 8 62-25 15h-75l-25-15Z"
            fill="#07141e"
            stroke="#89b8cb"
          />
          <rect
            x="95"
            y="110"
            width="29"
            height="8"
            rx="3"
            fill="currentColor"
          />
          <rect
            x="156"
            y="110"
            width="29"
            height="8"
            rx="3"
            fill="currentColor"
          />
          <path
            d="m113 145 27 6 27-6M140 41V24M65 99H47v50h17m152-50h17v50h-17M112 191h56"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle cx="140" cy="21" r="6" fill="currentColor" />
          <path
            d="M97 215v21h86v-21"
            fill="url(#metal)"
            stroke="currentColor"
          />
        </svg>
      ) : (
        <div className="floating-editor">
          <div className="editor-chrome">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>your-next-chapter.js</span>
            <Code2 size={13} />
          </div>
          <div className="editor-code">
            <div>
              <span>01</span>
              <code>
                <em>const</em> developer = {"{"}
              </code>
            </div>
            <div>
              <span>02</span>
              <code>
                &nbsp; curiosity: <b>true</b>,
              </code>
            </div>
            <div>
              <span>03</span>
              <code>
                &nbsp; potential: <b>Infinity</b>
              </code>
            </div>
            <div>
              <span>04</span>
              <code>{"}"};</code>
            </div>
            <div className="code-spacer" />
            <div>
              <span>05</span>
              <code>
                <em>while</em> (developer.curiosity) {"{"}
              </code>
            </div>
            <div>
              <span>06</span>
              <code>
                &nbsp; <strong>learn</strong>();
              </code>
            </div>
            <div>
              <span>07</span>
              <code>
                &nbsp; <strong>build</strong>();
              </code>
            </div>
            <div>
              <span>08</span>
              <code>
                &nbsp; <strong>repeat</strong>();
              </code>
            </div>
            <div>
              <span>09</span>
              <code>{"}"}</code>
            </div>
          </div>
          <div className="editor-status">
            <span>
              <span className="status-dot" /> Ready to build
            </span>
            <span>JavaScript</span>
          </div>
        </div>
      )}
      <div className="floating-chip">
        <Zap size={14} /> YOUR NEXT LEVEL STARTS HERE
      </div>
    </div>
  );
}

export default function LearningApp() {
  const progress = useLearningProgress();
  const { theme } = useTheme();
  const [view, setView] = useState<View>("overview");
  const [trackId, setTrackId] = useState("javascript");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string>();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dialog, setDialog] = useState<"help" | "reset" | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0];
  const lessons = track.lessons;
  const completed = lessons.filter((l) => progress.completed.includes(l.id));
  const nextLesson =
    lessons.find((l) => !progress.completed.includes(l.id)) ?? lessons[0];
  const percentage = Math.round((completed.length / lessons.length) * 100);
  const scores = lessons.flatMap((l) =>
    progress.scores[l.id] === undefined ? [] : [progress.scores[l.id]],
  );
  const accuracy = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;
  const learningDays = new Set(Object.values(progress.completionDates)).size;
  const selectedTheme = themes.find((t) => t.id === theme)!;
  const visibleLessons = lessons.filter(
    (l) =>
      `${l.title} ${l.summary} ${l.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()) &&
      (filter === "all" ||
        (filter === "completed"
          ? progress.completed.includes(l.id)
          : !progress.completed.includes(l.id))),
  );

  useEffect(() => {
    if (dialog && !dialogRef.current?.open) dialogRef.current?.showModal();
    if (!dialog && dialogRef.current?.open) dialogRef.current.close();
  }, [dialog]);

  useEffect(() => {
    if (!mobileMenu) return;
    const sidebar = sidebarRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      sidebar?.querySelector<HTMLButtonElement>("nav button")?.focus(),
    );
    function keyboard(event: KeyboardEvent) {
      if (dialogRef.current?.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileMenu(false);
        requestAnimationFrame(() => menuTriggerRef.current?.focus());
      }
      if (event.key !== "Tab" || !sidebar) return;
      const buttons = Array.from(
        sidebar.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href]",
        ),
      ).filter((b) => b.getClientRects().length);
      const first = buttons[0],
        last = buttons.at(-1);
      if (!first || !last) return;
      if (
        !sidebar.contains(document.activeElement) ||
        (!event.shiftKey && document.activeElement === last)
      ) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    }
    const media = window.matchMedia("(max-width: 800px)");
    const resize = () => {
      if (!media.matches) setMobileMenu(false);
    };
    media.addEventListener("change", resize);
    document.addEventListener("keydown", keyboard);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keyboard);
      media.removeEventListener("change", resize);
    };
  }, [mobileMenu]);

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k" &&
        !dialogRef.current?.open
      ) {
        event.preventDefault();
        setView("lessons");
        setActiveLesson(null);
        setMobileMenu(false);
        requestAnimationFrame(() =>
          document.getElementById("lesson-search")?.focus(),
        );
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  function navigate(next: View) {
    setView(next);
    setActiveLesson(null);
    setQuery("");
    setFilter("all");
    setMobileMenu(false);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() =>
      mainRef.current?.focus({ preventScroll: true }),
    );
  }
  function closeMenu() {
    setMobileMenu(false);
    requestAnimationFrame(() => menuTriggerRef.current?.focus());
  }
  function openLesson(lesson: Lesson) {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0 });
  }
  function selectTrack(id: string) {
    setTrackId(id);
    setQuery("");
    setFilter("all");
  }

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true" />
      {theme === "matrix" && (
        <div className="matrix-rain" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              style={{ left: `${i * 8.5}%`, animationDelay: `-${i * 1.7}s` }}
            >
              01アイウエオ110101
              <br />
              function explore()
              <br />
              01010011
              <br />
              コード101
              <br />
              const future = true;
              <br />
              11001001
              <br />
              システム01
              <br />
              10110010
            </span>
          ))}
        </div>
      )}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {mobileMenu && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeMenu}
        />
      )}
      <aside
        id="main-navigation"
        ref={sidebarRef}
        className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}
        aria-label="Learning navigation"
      >
        {mobileMenu && (
          <button
            className="mobile-close"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          >
            <X size={21} />
          </button>
        )}
        <button
          className="brand"
          onClick={() => navigate("overview")}
          aria-label="Bloom home"
        >
          <span className="brand-symbol">
            <Code2 size={24} />
          </span>
          <span>
            bloom<span className="brand-dot">_</span>
            <small>DEVELOPER WORKSPACE</small>
          </span>
        </button>
        <div className="workspace-switch">
          <span className="workspace-avatar">B</span>
          <div>
            <strong>Personal workspace</strong>
            <small>Learn. Build. Level up.</small>
          </div>
          <span className="version-badge">V3</span>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {navigation.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              aria-label={label}
              aria-current={view === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={18} />
              {label}
              {id === "projects" && (
                <span className="new-badge" aria-hidden="true">
                  NEW
                </span>
              )}
              {view === id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <div>
              <span>YOUR MOMENTUM</span>
              <Flame size={15} />
            </div>
            <strong>
              {progress.completed.length}
              <small> / 12 lessons complete</small>
            </strong>
            <div className="progress-track">
              <span
                style={{ width: `${(progress.completed.length / 12) * 100}%` }}
              />
            </div>
            <p>Progress is built one commit at a time.</p>
          </div>
          <div className="theme-mini">
            <span>INTERFACE</span>
            <div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  title={t.name}
                  aria-label={`Use ${t.name} theme`}
                  aria-pressed={theme === t.id}
                  style={{ background: t.color }}
                  onClick={() => setTheme(t.id)}
                >
                  {theme === t.id && <Check size={11} />}
                </button>
              ))}
            </div>
          </div>
          <button
            className="nav-item help-button"
            onClick={() => setDialog("help")}
          >
            <CircleHelp size={17} />
            How Bloom works
            <ChevronRight size={14} />
          </button>
          <div className="profile">
            <span className="avatar">
              <Terminal size={17} />
            </span>
            <div>
              <strong>Developer mode</strong>
              <span>Always a work in progress.</span>
            </div>
            <span className="status-dot" />
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuTriggerRef}
              className="menu-button"
              aria-label="Open navigation"
              aria-expanded={mobileMenu}
              aria-controls="main-navigation"
              onClick={() => (mobileMenu ? closeMenu() : setMobileMenu(true))}
            >
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>
              {activeLesson
                ? "Lesson"
                : navigation.find((n) => n.id === view)?.label}
            </strong>
          </div>
          <div className="topbar-actions">
            <button
              className="header-search"
              onClick={() => {
                navigate("lessons");
                requestAnimationFrame(() =>
                  document.getElementById("lesson-search")?.focus(),
                );
              }}
              aria-label="Find a lesson"
            >
              <Search size={15} />
              <span>Find a lesson</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button
              className="theme-trigger"
              onClick={() => navigate("appearance")}
              aria-label="Customize theme"
            >
              <Palette size={15} />
              <span>{selectedTheme.name}</span>
            </button>
            <span className="header-avatar">&lt;/&gt;</span>
          </div>
        </header>
        <main id="main-content" ref={mainRef} tabIndex={-1} inert={mobileMenu}>
          {progress.storageUnavailable && (
            <p className="storage-warning" role="status">
              Browser storage is unavailable. Progress is temporary for this
              page. Saved changes or resets may not persist after a reload.
            </p>
          )}
          {activeLesson ? (
            <LessonReader
              key={activeLesson.id}
              lesson={activeLesson}
              courseTitle={track.title}
              completed={progress.completed.includes(activeLesson.id)}
              storageUnavailable={progress.storageUnavailable}
              onClose={() => {
                setActiveLesson(null);
                window.scrollTo({ top: 0 });
                requestAnimationFrame(() => mainRef.current?.focus());
              }}
            />
          ) : view === "lab" ? (
            <CodeLab />
          ) : view === "projects" ? (
            <ProjectWorkspace
              key={activeProjectId ?? "default"}
              initialProjectId={activeProjectId}
            />
          ) : view === "appearance" ? (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <Palette size={13} /> PERSONALIZE YOUR ENVIRONMENT
                  </div>
                  <h1>
                    Your workspace. <span>Your frequency.</span>
                  </h1>
                  <p>
                    Five interfaces. One mission. Choose the atmosphere that
                    keeps you in flow.
                  </p>
                </div>
                <span className="page-badge">APPEARANCE / 05</span>
              </div>
              <ThemePicker />
              <section className="appearance-note glass-panel">
                <Cpu size={26} />
                <div>
                  <h2>Different skin. Same potential.</h2>
                  <p>
                    Your lessons, quiz progress, and code drafts stay with you
                    when you switch themes. Matrix includes digital rain; Robot
                    brings a metallic cockpit. Animations respect your device’s
                    reduced-motion preference.
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="status-dot" />{" "}
                    {view === "progress"
                      ? "YOUR DEVELOPER JOURNEY"
                      : "SYSTEM ONLINE. CURIOSITY ACTIVATED."}
                  </div>
                  <h1>
                    {view === "overview" ? (
                      <>
                        Less scrolling. <span>More building.</span>
                      </>
                    ) : view === "lessons" ? (
                      <>
                        Your next skill <span>starts here.</span>
                      </>
                    ) : (
                      <>
                        Every step <span>compounds.</span>
                      </>
                    )}
                  </h1>
                  <p>
                    {view === "overview"
                      ? "Turn curiosity into capability. Your developer journey starts with the next line."
                      : view === "lessons"
                        ? "Choose a track. Learn the concepts. Put them to work."
                        : "Real learning. Real progress. All of it earned by you."}
                  </p>
                </div>
                <span className="page-badge">
                  <Terminal size={13} /> THE DEVELOPER EDITION
                </span>
              </div>
              {view === "overview" && (
                <section
                  className="hero glass-panel"
                  aria-labelledby="hero-title"
                >
                  <div className="hero-grid" />
                  <div className="hero-content">
                    <span className="course-pill">
                      <span className="status-dot" /> LEARN → BUILD → REPEAT
                    </span>
                    <h2 id="hero-title">
                      Don’t just learn code.
                      <br />
                      <span>Think like a developer.</span>
                    </h2>
                    <p>
                      Understand the fundamentals. Experiment with ideas.
                      <br />
                      Build the confidence to create something of your own.
                    </p>
                    <div className="hero-buttons">
                      <button
                        className="primary-button"
                        onClick={() => openLesson(nextLesson)}
                      >
                        <Play size={14} fill="currentColor" />
                        {percentage === 100
                          ? "Revisit your learning"
                          : percentage > 0
                            ? "Continue learning"
                            : "Start your first lesson"}
                        <ArrowRight size={15} />
                      </button>
                      <button
                        className="hero-lab-button"
                        onClick={() => navigate("lab")}
                      >
                        <Terminal size={15} />
                        Open coding lab
                      </button>
                    </div>
                    <div className="hero-meta">
                      <span>
                        <CheckCircle2 size={13} /> Beginner friendly
                      </span>
                      <span>
                        <Clock3 size={13} /> At your own pace
                      </span>
                    </div>
                  </div>
                  <HeroVisual robot={theme === "robot"} />
                  <span className="hero-coordinate">
                    BUILD_VERSION 03.00 // NO LIMITS TO CURIOSITY
                  </span>
                </section>
              )}
              <section className="stats" aria-label="Your learning statistics">
                <div className="stat-card glass-panel">
                  <span className="stat-icon">
                    <BookOpen size={20} />
                  </span>
                  <div>
                    <span className="stat-label">Lessons completed</span>
                    <strong>
                      {completed.length}
                      <small> / {lessons.length}</small>
                    </strong>
                  </div>
                  <span className="stat-detail">{percentage}% OF TRACK</span>
                </div>
                <div className="stat-card glass-panel">
                  <span className="stat-icon">
                    <Target size={20} />
                  </span>
                  <div>
                    <span className="stat-label">Best quiz average</span>
                    <strong>{accuracy === null ? "—" : `${accuracy}%`}</strong>
                  </div>
                  <span className="stat-detail">
                    {accuracy === null
                      ? "READY WHEN YOU ARE"
                      : "KEEP THE MOMENTUM"}
                  </span>
                </div>
                <div className="stat-card glass-panel">
                  <span className="stat-icon">
                    <Zap size={20} />
                  </span>
                  <div>
                    <span className="stat-label">Learning days</span>
                    <strong>
                      {learningDays}
                      <small> {learningDays === 1 ? "day" : "days"}</small>
                    </strong>
                  </div>
                  <span className="stat-detail">CONSISTENCY COMPOUNDS</span>
                </div>
              </section>
              <div className="section-heading">
                <div>
                  <span className="section-kicker">SELECT YOUR MISSION</span>
                  <h2>
                    {view === "progress"
                      ? "Track your progress"
                      : "Your learning paths"}
                  </h2>
                </div>
                <span className="mono-muted">02 TRACKS AVAILABLE</span>
              </div>
              <div
                className="track-selector"
                role="group"
                aria-label="Learning track"
              >
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    className={`track-card ${trackId === t.id ? "selected" : ""}`}
                    aria-pressed={trackId === t.id}
                    onClick={() => selectTrack(t.id)}
                  >
                    <span
                      className={`track-logo ${t.id === "ai" ? "ai-logo" : ""}`}
                    >
                      {t.id === "javascript" ? "JS" : <Sparkles size={21} />}
                    </span>
                    <span>
                      <strong>{t.title}</strong>
                      <small>
                        {t.lessons.length} lessons <span>·</span>{" "}
                        {t.id === "javascript"
                          ? "Learn the language of the web"
                          : "Understand the intelligence behind it"}
                      </small>
                    </span>
                    <span className="track-radio">
                      {trackId === t.id && <span />}
                    </span>
                  </button>
                ))}
              </div>
              {view === "progress" ? (
                <section className="progress-page glass-panel">
                  <div className="progress-overview">
                    <div className="section-kicker">
                      {track.title.toUpperCase()}
                    </div>
                    <h2>
                      {percentage === 100
                        ? "Track complete. Next level unlocked."
                        : `${percentage}% of your journey, and counting.`}
                    </h2>
                    <p>
                      Pass each lesson’s quiz to complete the track. Every
                      checkpoint counts.
                    </p>
                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-label="Course completion"
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span style={{ width: `${percentage}%` }} />
                    </div>
                    <div className="progress-caption">
                      <span>{completed.length} lessons completed</span>
                      <span>
                        {lessons.length - completed.length} to discover
                      </span>
                    </div>
                  </div>
                  <div className="milestone-list">
                    {lessons.map((l) => (
                      <button
                        key={l.id}
                        className="milestone"
                        onClick={() => openLesson(l)}
                      >
                        <span
                          className={`milestone-dot ${progress.completed.includes(l.id) ? "done" : ""}`}
                        >
                          {progress.completed.includes(l.id) ? (
                            <Check size={16} />
                          ) : (
                            String(l.number).padStart(2, "0")
                          )}
                        </span>
                        <span>
                          <strong>{l.title}</strong>
                          <small>
                            {progress.completed.includes(l.id)
                              ? "Completed"
                              : "Ready when you are"}
                          </small>
                        </span>
                        {progress.scores[l.id] !== undefined && (
                          <span className="score-tag">
                            Best: {progress.scores[l.id]}%
                          </span>
                        )}
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                  <div className="reset-area">
                    <p>Progress is saved on this browser and device.</p>
                    <button
                      className="text-button"
                      onClick={() => setDialog("reset")}
                    >
                      Reset my progress
                    </button>
                  </div>
                </section>
              ) : (
                <div className="learning-layout">
                  <section
                    className="lessons-section glass-panel"
                    aria-labelledby="lessons-title"
                  >
                    <div className="course-heading">
                      <div>
                        <div className="section-kicker">{track.language}</div>
                        <h2 id="lessons-title">{track.title}</h2>
                        <p>{track.description}</p>
                      </div>
                      <span className="level-tag">BEGINNER</span>
                    </div>
                    <div className="lesson-toolbar">
                      <div
                        className="filter-tabs"
                        role="group"
                        aria-label="Filter lessons"
                      >
                        {[
                          { id: "all", label: "All lessons" },
                          { id: "incomplete", label: "To explore" },
                          { id: "completed", label: "Completed" },
                        ].map((f) => (
                          <button
                            key={f.id}
                            className={filter === f.id ? "selected" : ""}
                            aria-pressed={filter === f.id}
                            onClick={() => setFilter(f.id)}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                      <label className="search-box">
                        <Search size={15} />
                        <input
                          id="lesson-search"
                          aria-label="Search lessons"
                          placeholder="Search lessons…"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                          <button
                            aria-label="Clear search"
                            onClick={() => setQuery("")}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </label>
                    </div>
                    <div className="lesson-list">
                      {visibleLessons.map((l) => (
                        <button
                          key={l.id}
                          className={`lesson-row ${progress.completed.includes(l.id) ? "is-complete" : ""}`}
                          onClick={() => openLesson(l)}
                        >
                          <span className="lesson-number">
                            {progress.completed.includes(l.id) ? (
                              <Check size={18} />
                            ) : (
                              String(l.number).padStart(2, "0")
                            )}
                          </span>
                          <span className="lesson-info">
                            <strong>{l.title}</strong>
                            <span>{l.summary}</span>
                            <small>
                              <Clock3 size={11} />
                              {l.duration} min <span>·</span> {l.category}
                            </small>
                          </span>
                          <span className="lesson-action">
                            {progress.completed.includes(l.id) ? (
                              <span className="completed-tag">Completed</span>
                            ) : (
                              <Play size={14} />
                            )}
                            <ArrowRight size={16} />
                          </span>
                        </button>
                      ))}
                      {!visibleLessons.length && (
                        <div className="empty-state">
                          <Search size={28} />
                          <h3>
                            {query
                              ? "No lessons found"
                              : "Nothing here just yet"}
                          </h3>
                          <p>
                            {query
                              ? "Try another word, like functions or data."
                              : filter === "completed"
                                ? "Complete your first lesson to see it here."
                                : "You’ve completed this track. Time for your next challenge."}
                          </p>
                          <button
                            className="text-button"
                            onClick={() => {
                              setQuery("");
                              setFilter("all");
                            }}
                          >
                            Show all lessons <ArrowRight size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </section>
                  <aside className="right-column">
                    <section className="lab-promo glass-panel">
                      <div className="promo-top">
                        <span className="promo-icon">
                          <Terminal size={24} />
                        </span>
                        <span className="new-badge">UPGRADED IN V3</span>
                      </div>
                      <span className="section-kicker">
                        LESS THEORY. MORE KEYSTROKES.
                      </span>
                      <h3>
                        Meet your
                        <br />
                        <span>coding playground.</span>
                      </h3>
                      <p>
                        Write JavaScript, run real tests, and turn “I get it”
                        into “I built it.”
                      </p>
                      <div className="mini-terminal">
                        <span>$ run your-potential.js</span>
                        <span>
                          <Check size={12} /> {challenges.length} challenges
                          ready
                        </span>
                        <span className="terminal-cursor">_</span>
                      </div>
                      <button
                        className="secondary-button"
                        onClick={() => navigate("lab")}
                      >
                        Enter the lab <ArrowRight size={15} />
                      </button>
                    </section>
                    <section className="daily-goal glass-panel">
                      <span className="section-kicker">
                        <Flame size={13} /> KEEP THE SPARK ALIVE
                      </span>
                      <h3>
                        One lesson.
                        <br />
                        One step forward.
                      </h3>
                      <p>
                        Your future self will thank you for showing up today.
                      </p>
                      <button
                        className="text-button"
                        onClick={() => openLesson(nextLesson)}
                      >
                        Pick up where you left off <ArrowRight size={14} />
                      </button>
                    </section>
                    <div className="private-note">
                      <Cpu size={14} />
                      <span>
                        No account required.
                        <br />
                        Your progress lives in this browser.
                      </span>
                    </div>
                  </aside>
                </div>
              )}
              {view === "overview" && (
                <section
                  className="dashboard-projects"
                  aria-labelledby="dashboard-projects-title"
                >
                  <div className="section-heading">
                    <div>
                      <span className="section-kicker">
                        TURN KNOWLEDGE INTO SOMETHING REAL
                      </span>
                      <h2 id="dashboard-projects-title">Your first builds</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => navigate("projects")}
                    >
                      Explore projects <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="project-launch-grid">
                    {projects.map((project, index) => (
                      <button
                        className="project-launch-card glass-panel"
                        key={project.id}
                        onClick={() => {
                          setActiveProjectId(project.id);
                          navigate("projects");
                        }}
                      >
                        <span className="project-launch-index">
                          0{index + 1} / GUIDED BUILD
                        </span>
                        <span className="project-launch-symbol">
                          <FolderCode size={26} />
                        </span>
                        <strong>{project.title}</strong>
                        <span>{project.description}</span>
                        <small>
                          HTML · CSS · JAVASCRIPT <ArrowRight size={16} />
                        </small>
                      </button>
                    ))}
                  </div>
                </section>
              )}
              <footer>
                <span>
                  <Code2 size={14} /> BUILT FOR THE NEXT VERSION OF YOU.
                </span>
                <span>
                  LEARN. BUILD. REPEAT.
                  <span className="status-dot" />
                </span>
              </footer>
            </>
          )}
        </main>
      </div>
      <dialog
        ref={dialogRef}
        className="info-dialog"
        aria-labelledby="dialog-title"
        onCancel={() => setDialog(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setDialog(null);
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close dialog"
          onClick={() => setDialog(null)}
        >
          <X size={20} />
        </button>
        {dialog === "reset" ? (
          <>
            <span className="dialog-icon">
              <Trophy size={25} />
            </span>
            <h2 id="dialog-title">Reset your learning journey?</h2>
            <p>
              This clears completed lessons and quiz scores across both tracks
              in this browser. Your theme and code drafts stay as they are. This
              cannot be undone.
            </p>
            {progress.storageUnavailable && (
              <p>
                Browser storage is unavailable, so previous saved progress may
                return after a reload.
              </p>
            )}
            <div className="dialog-actions">
              <button
                className="secondary-button"
                onClick={() => setDialog(null)}
              >
                Keep my progress
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  resetProgress();
                  setDialog(null);
                }}
              >
                Reset progress
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="dialog-icon">
              <Code2 size={25} />
            </span>
            <h2 id="dialog-title">Your next version starts here.</h2>
            <p>
              Bloom combines JavaScript and AI fundamentals with hands-on coding
              practice.
            </p>
            <ol>
              <li>
                Pick a learning track and explore short, practical lessons.
              </li>
              <li>
                Pass both quiz questions to complete a lesson. Retry as often as
                you like.
              </li>
              <li>
                Head to Coding lab to write JavaScript and run real tests.
              </li>
              <li>
                Build a portfolio, task tracker, or sample-data weather
                dashboard in Guided projects. Edit HTML, CSS, and JavaScript,
                run the preview, and check your work.
              </li>
              <li>
                Choose your atmosphere in Appearance. Five themes, all yours.
              </li>
            </ol>
            <p>
              Your progress and code drafts stay in this browser. Accounts,
              cloud sync, and live AI tutoring are not part of this version.
            </p>
            <button className="primary-button" onClick={() => setDialog(null)}>
              Let’s build <ArrowRight size={15} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}

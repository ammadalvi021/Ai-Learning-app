"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flower2,
  GraduationCap,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Menu,
  Search,
  Sparkles,
  Sprout,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { lessons, type Lesson } from "@/lib/course";
import {
  recordQuiz,
  resetProgress,
  todayKey,
  useLearningProgress,
} from "@/lib/progress";

type View = "overview" | "lessons" | "progress";

function BotanicalArt() {
  return (
    <svg className="botanical-art" viewBox="0 0 300 260" aria-hidden="true">
      <circle cx="157" cy="127" r="105" fill="#e3e8bc" />
      <circle
        cx="157"
        cy="127"
        r="80"
        fill="none"
        stroke="#a9bb88"
        strokeDasharray="3 7"
      />
      <path
        d="M155 225c-5-72 6-119 27-174M159 170c-42-8-64-32-70-57M163 143c37-3 56-22 65-49M157 203c29-3 53-14 67-36"
        fill="none"
        stroke="#426d51"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M164 132c-13-39-6-67 24-86 6 38-1 68-24 86" fill="#234f40" />
      <path d="M158 173c-42 1-70-21-77-63 40 7 67 25 77 63" fill="#56815c" />
      <path d="M163 146c7-38 33-57 72-56-13 36-36 56-72 56" fill="#759a69" />
      <path d="M157 205c17-32 42-45 77-37-18 31-44 43-77 37" fill="#234f40" />
      <path
        d="m89 118 57 44m37-105-17 65m58-26-52 43m52 34-57 27"
        stroke="#b2c496"
        strokeWidth="1.5"
      />
      <path
        d="m66 64 3-10 3 10 10 3-10 3-3 10-3-10-10-3Zm173 68 2-7 2 7 7 2-7 2-2 7-2-7-7-2Z"
        fill="#8d9f60"
      />
      <circle cx="119" cy="48" r="4" fill="#c0a66f" />
      <circle cx="247" cy="211" r="3" fill="#9aaf79" />
      <path
        d="M124 230h63"
        stroke="#779367"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LessonReader({
  lesson,
  completed,
  storageUnavailable,
  onClose,
}: {
  lesson: Lesson;
  completed: boolean;
  storageUnavailable: boolean;
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);
  const quizHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const score = Math.round(
    (lesson.quiz.filter((q) => answers[q.id] === q.correctIndex).length /
      lesson.quiz.length) *
      100,
  );
  const allAnswered = lesson.quiz.every((q) => answers[q.id] !== undefined);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (submitted) resultRef.current?.focus();
  }, [submitted]);

  function submitQuiz(event: React.FormEvent) {
    event.preventDefault();
    if (!allAnswered) return;
    setSubmitted(true);
    recordQuiz(lesson.id, score);
  }

  return (
    <article className="reader">
      <button className="text-button back-button" onClick={onClose}>
        <ArrowLeft size={17} /> Back to learning
      </button>
      <div className="eyebrow">
        AI FOUNDATIONS <span> / </span> LESSON{" "}
        {String(lesson.number).padStart(2, "0")}
      </div>
      <h1 ref={headingRef} tabIndex={-1}>
        {lesson.title}
      </h1>
      <p className="reader-summary">{lesson.summary}</p>
      <div className="reader-meta">
        <span>
          <Clock3 size={15} /> {lesson.duration} min read
        </span>
        <span>
          <BookOpen size={15} /> Beginner friendly
        </span>
        {completed && (
          <span className="green-text">
            <CheckCircle2 size={15} /> Completed
          </span>
        )}
      </div>
      <div className="reader-body">
        {lesson.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {section.example && (
              <aside className="example">
                <Lightbulb size={21} />
                <div>
                  <strong>Try this idea</strong>
                  <p>{section.example}</p>
                </div>
              </aside>
            )}
          </section>
        ))}
        <aside className="takeaway">
          <Sprout size={23} />
          <div>
            <strong>The seed to take with you</strong>
            <p>{lesson.takeaway}</p>
          </div>
        </aside>
        <button
          className="primary-button"
          onClick={() => {
            quizHeadingRef.current?.focus({ preventScroll: true });
            quizRef.current?.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
              block: "start",
            });
          }}
        >
          Check your understanding <ArrowDown size={16} />
        </button>
        <div className="quiz" ref={quizRef}>
          <div className="section-kicker">
            <Sparkles size={15} /> A LITTLE PRACTICE
          </div>
          <h2 ref={quizHeadingRef} tabIndex={-1}>
            Let’s make it stick.
          </h2>
          <p>
            Answer both questions correctly to complete this lesson. You can try
            as many times as you like.
          </p>
          <form onSubmit={submitQuiz}>
            {lesson.quiz.map((question, index) => (
              <fieldset key={question.id} disabled={submitted}>
                <legend>
                  <span>{index + 1}.</span> {question.question}
                </legend>
                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={option}
                      className={`quiz-option ${answers[question.id] === optionIndex ? "selected" : ""} ${submitted && optionIndex === question.correctIndex ? "correct" : ""} ${submitted && answers[question.id] === optionIndex && optionIndex !== question.correctIndex ? "incorrect" : ""}`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={optionIndex}
                        checked={answers[question.id] === optionIndex}
                        onChange={() =>
                          setAnswers({ ...answers, [question.id]: optionIndex })
                        }
                      />
                      <span>{option}</span>
                      {submitted && optionIndex === question.correctIndex && (
                        <Check size={18} />
                      )}
                    </label>
                  ))}
                </div>
                {submitted && (
                  <p className="answer-explanation">{question.explanation}</p>
                )}
              </fieldset>
            ))}
            {!submitted && (
              <>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={!allAnswered}
                >
                  Check my answers <ArrowRight size={16} />
                </button>
                {!allAnswered && (
                  <p className="quiz-hint">
                    Choose one answer for each question.
                  </p>
                )}
              </>
            )}
          </form>
          {submitted && (
            <div
              ref={resultRef}
              className={`quiz-result ${score === 100 ? "passed" : ""}`}
              role="status"
              tabIndex={-1}
            >
              {score === 100 ? <Trophy size={25} /> : <Lightbulb size={25} />}
              <div>
                <strong>
                  {score === 100
                    ? "A little wiser. Lesson complete!"
                    : `${score}% — you’re learning. Give it another go.`}
                </strong>
                <p>
                  {score === 100
                    ? storageUnavailable
                      ? "Your progress is temporary and available for this page only. Browser storage is unavailable."
                      : "Your progress has been saved in this browser."
                    : "Read the explanations above, then try again."}
                </p>
              </div>
              {score !== 100 && (
                <button
                  className="secondary-button"
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers({});
                    requestAnimationFrame(() =>
                      quizHeadingRef.current?.focus(),
                    );
                  }}
                >
                  Try again
                </button>
              )}
            </div>
          )}
          {submitted && score === 100 && (
            <button className="primary-button" onClick={onClose}>
              Back to my learning <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function LearningApp() {
  const progress = useLearningProgress();
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const nextLesson =
    lessons.find((l) => !progress.completed.includes(l.id)) ?? lessons[0];
  const percentage = Math.round(
    (progress.completed.length / lessons.length) * 100,
  );
  const learningDays = new Set(Object.values(progress.completionDates)).size;
  const scoreValues = Object.values(progress.scores);
  const accuracy = scoreValues.length
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    : null;
  const todayComplete = Object.values(progress.completionDates).includes(
    todayKey(),
  );
  const visibleLessons = lessons.filter((lesson) => {
    const matches = `${lesson.title} ${lesson.summary} ${lesson.category}`
      .toLowerCase()
      .includes(query.toLowerCase().trim());
    const complete = progress.completed.includes(lesson.id);
    return (
      matches &&
      (filter === "all" || (filter === "completed" ? complete : !complete))
    );
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if ((helpOpen || resetOpen) && dialog && !dialog.open) dialog.showModal();
    else if (dialog?.open && !helpOpen && !resetOpen) dialog.close();
  }, [helpOpen, resetOpen]);

  useEffect(() => {
    if (!mobileMenu) return;

    const sidebar = sidebarRef.current;
    const media = window.matchMedia("(max-width: 760px)");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => {
      sidebar?.querySelector<HTMLButtonElement>("nav button")?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (!media.matches || dialogRef.current?.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileMenu(false);
        requestAnimationFrame(() => menuTriggerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !sidebar) return;

      const focusable = Array.from(
        sidebar.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (!sidebar.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onViewportChange() {
      if (!media.matches) setMobileMenu(false);
    }

    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onViewportChange);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onViewportChange);
    };
  }, [mobileMenu]);

  function closeMobileMenu() {
    setMobileMenu(false);
    requestAnimationFrame(() => menuTriggerRef.current?.focus());
  }

  function navigate(next: View) {
    setView(next);
    setActiveLesson(null);
    setMobileMenu(false);
    setQuery("");
    setFilter("all");
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() =>
      mainRef.current?.focus({ preventScroll: true }),
    );
  }
  function openLesson(lesson: Lesson) {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {mobileMenu && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
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
            onClick={closeMobileMenu}
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
            <Sprout size={24} />
          </span>
          bloom<span className="brand-dot">.</span>
        </button>
        <p className="sidebar-caption">A LITTLE LEARNING, EVERY DAY</p>
        <div className="nav-label">YOUR SPACE</div>
        <nav aria-label="Main navigation">
          {(
            [
              { id: "overview", label: "Overview", Icon: LayoutDashboard },
              { id: "lessons", label: "My learning", Icon: BookOpen },
              { id: "progress", label: "My progress", Icon: Trophy },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              aria-current={view === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={19} />
              {label}
              {id === "lessons" && (
                <span className="nav-count">{lessons.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="growth-note">
            <Flower2 size={32} strokeWidth={1.3} />
            <h3>
              Small steps.
              <br />
              Brighter possibilities.
            </h3>
            <p>
              You don’t have to know it all.
              <br />
              You just have to begin.
            </p>
            <span className="tiny-leaf">
              <Leaf size={15} /> GROW AT YOUR OWN PACE
            </span>
          </div>
          <button
            className="nav-item help-button"
            onClick={() => setHelpOpen(true)}
          >
            <CircleHelp size={18} /> How Bloom works
          </button>
          <div className="profile">
            <span className="avatar">
              <Sprout size={20} />
            </span>
            <div>
              <strong>Your learning space</strong>
              <span>Curiosity looks good on you</span>
            </div>
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
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Menu size={21} />
            </button>
            <span>My workspace</span>
            <ChevronRight size={13} />
            <strong>
              {activeLesson
                ? "Lesson"
                : view === "overview"
                  ? "Overview"
                  : view === "lessons"
                    ? "My learning"
                    : "My progress"}
            </strong>
          </div>
          <span className="topbar-note">
            <span className="status-dot" /> A good day to grow
          </span>
        </header>
        <main id="main-content" ref={mainRef} tabIndex={-1} inert={mobileMenu}>
          {progress.storageUnavailable && (
            <p className="storage-warning" role="status">
              Browser storage is unavailable. New progress may be lost when you
              reload, and resets may not clear progress already saved in this
              browser.
            </p>
          )}
          {activeLesson ? (
            <LessonReader
              key={activeLesson.id}
              lesson={activeLesson}
              completed={progress.completed.includes(activeLesson.id)}
              storageUnavailable={progress.storageUnavailable}
              onClose={() => {
                setActiveLesson(null);
                window.scrollTo({ top: 0 });
                mainRef.current?.focus();
              }}
            />
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="small-line" /> YOUR NEXT CHAPTER STARTS
                    HERE
                  </div>
                  <h1>
                    {view === "overview"
                      ? "A little curiosity. A lot of possibility."
                      : view === "lessons"
                        ? "Make room for something new."
                        : "Look how far you’ve grown."}
                  </h1>
                  <p>
                    {view === "overview"
                      ? "Build your confidence with AI, one small discovery at a time."
                      : view === "lessons"
                        ? "Six bite-sized lessons. Practical ideas. Your own pace."
                        : "Every lesson is a step forward. Here’s your journey so far."}
                  </p>
                </div>
                <span className="chapter-badge">
                  <Leaf size={15} /> YOUR PERSONAL LEARNING SPACE
                </span>
              </div>

              {view === "overview" && (
                <section className="hero" aria-labelledby="hero-title">
                  <div className="hero-content">
                    <span className="course-pill">
                      <Sparkles size={13} /> A FRESH PERSPECTIVE
                    </span>
                    <h2 id="hero-title">
                      The future feels better
                      <br />
                      when you understand it.
                    </h2>
                    <p>
                      Get to know AI beyond the buzzwords.
                      <br />
                      Simple lessons for a world that keeps changing.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => openLesson(nextLesson)}
                    >
                      {percentage === 100
                        ? "Revisit your learning"
                        : percentage > 0
                          ? "Continue learning"
                          : "Start your first lesson"}
                      <ArrowRight size={17} />
                    </button>
                    <div className="hero-meta">
                      <span>
                        <BookOpen size={13} /> 6 short lessons
                      </span>
                      <span className="meta-dot">·</span>
                      <span>
                        <Clock3 size={13} /> At your own pace
                      </span>
                    </div>
                  </div>
                  <BotanicalArt />
                  <span className="hero-side-note">ROOTED IN CURIOSITY</span>
                </section>
              )}

              <section className="stats" aria-label="Your learning statistics">
                <div className="stat-card">
                  <span className="stat-icon sage">
                    <BookOpen size={19} />
                  </span>
                  <div>
                    <span className="stat-label">Lessons completed</span>
                    <strong>
                      {progress.completed.length}
                      <small> / {lessons.length}</small>
                    </strong>
                  </div>
                  <span className="stat-detail">
                    {percentage}% of your path
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon sand">
                    <Target size={20} />
                  </span>
                  <div>
                    <span className="stat-label">Best quiz average</span>
                    <strong>{accuracy === null ? "—" : `${accuracy}%`}</strong>
                  </div>
                  <span className="stat-detail">
                    {accuracy === null
                      ? "Your first win awaits"
                      : "Practice makes progress"}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon peach">
                    <Sprout size={21} />
                  </span>
                  <div>
                    <span className="stat-label">Learning days</span>
                    <strong>
                      {learningDays}
                      <small> {learningDays === 1 ? "day" : "days"}</small>
                    </strong>
                  </div>
                  <span className="stat-detail">A habit worth growing</span>
                </div>
              </section>

              {view === "progress" ? (
                <section className="progress-page">
                  <div className="progress-overview">
                    <span className="section-kicker">
                      YOUR GROWING KNOWLEDGE
                    </span>
                    <h2>
                      {percentage === 100
                        ? "You’ve completed AI foundations!"
                        : `${percentage}% of your journey, and counting.`}
                    </h2>
                    <p>
                      Pass a lesson’s quiz to grow your progress. All six
                      lessons are yours to explore.
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
                      <span>{progress.completed.length} lessons completed</span>
                      <span>
                        {lessons.length - progress.completed.length} to discover
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
                          className={
                            progress.completed.includes(l.id)
                              ? "milestone-dot done"
                              : "milestone-dot"
                          }
                        >
                          {progress.completed.includes(l.id) ? (
                            <Check size={17} />
                          ) : (
                            l.number
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
                        <ChevronRight size={18} />
                      </button>
                    ))}
                  </div>
                  <div className="reset-area">
                    <p>Progress is saved on this browser and device.</p>
                    <button
                      className="text-button"
                      onClick={() => setResetOpen(true)}
                    >
                      Reset my progress
                    </button>
                  </div>
                </section>
              ) : (
                <div className="learning-layout">
                  <section
                    className="lessons-section"
                    aria-labelledby="lessons-title"
                  >
                    <div className="section-heading">
                      <div>
                        <span className="section-kicker">
                          A FOUNDATION FOR WHAT’S NEXT
                        </span>
                        <h2 id="lessons-title">
                          Your learning path
                          <span className="count-badge">6 lessons</span>
                        </h2>
                      </div>
                      {view === "overview" && (
                        <button
                          className="text-button view-all"
                          onClick={() => navigate("lessons")}
                        >
                          View all <ArrowRight size={15} />
                        </button>
                      )}
                    </div>
                    <div className="course-heading">
                      <span className="course-icon">
                        <GraduationCap size={22} />
                      </span>
                      <div>
                        <h3>AI foundations</h3>
                        <p>Big ideas, made beautifully simple.</p>
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
                            aria-pressed={filter === f.id}
                            className={filter === f.id ? "selected" : ""}
                            onClick={() => setFilter(f.id)}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                      <label className="search-box">
                        <Search size={15} />
                        <input
                          aria-label="Search lessons"
                          placeholder="Find a lesson…"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
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
                      {visibleLessons.map((lesson) => {
                        const complete = progress.completed.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            className={`lesson-row ${complete ? "is-complete" : ""}`}
                            onClick={() => openLesson(lesson)}
                          >
                            <span
                              className={`lesson-number tone-${(lesson.number - 1) % 3}`}
                            >
                              {complete ? (
                                <Check size={20} />
                              ) : (
                                String(lesson.number).padStart(2, "0")
                              )}
                            </span>
                            <span className="lesson-info">
                              <strong>{lesson.title}</strong>
                              <span>{lesson.summary}</span>
                              <small>
                                <Clock3 size={12} /> {lesson.duration} min{" "}
                                <span>·</span> {lesson.category}
                              </small>
                            </span>
                            <span className="lesson-action">
                              {complete ? (
                                <span className="completed-tag">Completed</span>
                              ) : (
                                <span className="lesson-duration">
                                  {lesson.duration} min
                                </span>
                              )}
                              <ArrowRight size={17} />
                            </span>
                          </button>
                        );
                      })}
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
                              ? "Try another word, like data or prompts."
                              : filter === "completed"
                                ? "Complete your first lesson to see it here."
                                : "You’ve explored every lesson. Nice growing!"}
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
                    <section className="daily-goal">
                      <div className="card-label">
                        <Target size={16} /> YOUR DAILY MOMENT
                      </div>
                      <h3>
                        A little time.
                        <br />A lasting difference.
                      </h3>
                      <p>
                        One lesson today is one more
                        <br />
                        idea you’ll carry tomorrow.
                      </p>
                      <div
                        className={`goal-circle ${todayComplete ? "goal-complete" : ""}`}
                      >
                        <span>
                          {todayComplete ? (
                            <Check size={28} />
                          ) : (
                            <Sprout size={28} />
                          )}
                        </span>
                      </div>
                      <div className="goal-caption">
                        <strong>
                          {todayComplete
                            ? "Today’s goal, complete."
                            : "Make space for one lesson"}
                        </strong>
                        <span>
                          {todayComplete
                            ? "Come back tomorrow. Keep growing."
                            : "Just 5–8 minutes for yourself"}
                        </span>
                      </div>
                      <button
                        className="secondary-button"
                        onClick={() => openLesson(nextLesson)}
                      >
                        {todayComplete
                          ? "Keep exploring"
                          : "Let’s make a start"}
                        <ArrowRight size={15} />
                      </button>
                    </section>
                    <section className="gentle-note">
                      <span>✳</span>
                      <blockquote>
                        “The beautiful thing about learning is that nobody can
                        take it away from you.”
                      </blockquote>
                      <p>— B. B. KING</p>
                    </section>
                    <div className="private-note">
                      <Leaf size={14} />
                      <span>
                        Your pace. Your progress.
                        <br />
                        Saved right here in your browser.
                      </span>
                    </div>
                  </aside>
                </div>
              )}
              <footer>
                <span className="footer-brand">
                  <Sprout size={14} /> A little better, every day.
                </span>
                <span>Made for curious minds.</span>
              </footer>
            </>
          )}
        </main>
      </div>
      <dialog
        ref={dialogRef}
        className="info-dialog"
        aria-labelledby="info-dialog-title"
        onCancel={() => {
          setHelpOpen(false);
          setResetOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setHelpOpen(false);
            setResetOpen(false);
          }
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close dialog"
          onClick={() => {
            setHelpOpen(false);
            setResetOpen(false);
          }}
        >
          <X size={21} />
        </button>
        {resetOpen ? (
          <>
            <span className="dialog-icon">
              <Sprout size={26} />
            </span>
            <h2 id="info-dialog-title">Start with a fresh page?</h2>
            <p>
              {progress.storageUnavailable
                ? "Browser storage is unavailable. This resets progress for the current page, but previously saved progress may return when you reload."
                : "This clears your quiz scores and completed lessons from this browser. You can’t undo it."}
            </p>
            <div className="dialog-actions">
              <button
                className="secondary-button"
                onClick={() => setResetOpen(false)}
              >
                Keep my progress
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  resetProgress();
                  setResetOpen(false);
                }}
              >
                Reset progress
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="dialog-icon">
              <Flower2 size={28} />
            </span>
            <h2 id="info-dialog-title">A small space for big ideas.</h2>
            <p>
              Bloom makes AI approachable through six short lessons and
              practical quizzes.
            </p>
            <ol>
              <li>Choose any lesson that sparks your curiosity.</li>
              <li>Read at your own pace, then answer two questions.</li>
              <li>
                Get both right to complete the lesson. Retakes are always
                welcome.
              </li>
            </ol>
            <p>
              Your progress stays in this browser. There are no accounts or live
              AI chat features in this first version.
            </p>
            <button
              className="primary-button"
              onClick={() => setHelpOpen(false)}
            >
              Sounds good <ArrowRight size={16} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}

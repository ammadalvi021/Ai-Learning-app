"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Sparkles,
  Sprout,
  Trophy,
} from "lucide-react";
import type { Lesson } from "@/lib/course";
import { recordQuiz } from "@/lib/progress";

export default function LessonReader({
  lesson,
  courseTitle,
  completed,
  storageUnavailable,
  onClose,
}: {
  lesson: Lesson;
  courseTitle: string;
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
        {courseTitle.toUpperCase()} <span> / </span> LESSON{" "}
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
            {section.snippet && (
              <div className="lesson-code">
                <div>
                  <span>{section.snippet.language}</span>
                  <span>EXAMPLE</span>
                </div>
                <pre>
                  <code>{section.snippet.code}</code>
                </pre>
              </div>
            )}
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

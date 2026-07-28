"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import courseData from "../public/quiz-data.json";

type Stage = "select" | "question" | "correct" | "wrong" | "goal";

type QuizQuestion = {
  category: string;
  question: string;
  choices: [string, string, string];
  answer: number;
  place: string;
  explanation: string;
  hint: string;
  questionView: [number, number, number];
  answerView: [number, number, number];
};

type QuizCourse = {
  id: string;
  title: string;
  icon: string;
  description: string;
  accent: string;
  questions: QuizQuestion[];
};

const COURSES = courseData as QuizCourse[];
const CHOICE_LABELS = ["A", "B", "C"];

function shuffleQuestions(questions: QuizQuestion[]) {
  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function JapanMap({
  stage,
  question,
}: {
  stage: Stage;
  question: QuizQuestion;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    let cancelled = false;
    let localMap: LeafletMap | null = null;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      localMap = L.map(containerRef.current, {
        center: [36.4, 137.6],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
        minZoom: 4,
        maxZoom: 18,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(localMap);

      mapRef.current = localMap;
      window.setTimeout(() => localMap?.invalidateSize(), 80);
    });

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      markerRef.current = null;
      localMap?.remove();
      if (mapRef.current === localMap) mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    void import("leaflet").then((L) => {
      markerRef.current?.remove();
      markerRef.current = null;

      if (stage === "select" || stage === "goal") {
        map.flyTo([36.4, 137.6], 5, { duration: 1.3 });
        return;
      }

      if (stage === "correct") {
        const [lat, lng, zoom] = question.answerView;
        map.flyTo([lat, lng], zoom, { duration: 1.8 });
        const icon = L.divIcon({
          className: "answer-marker",
          html: '<div class="answer-pin"><span>✓</span></div>',
          iconSize: [42, 42],
          iconAnchor: [21, 40],
        });
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        return;
      }

      if (stage === "question") {
        const [lat, lng, zoom] = question.questionView;
        map.flyTo([lat, lng], zoom, { duration: 1.35 });
      }
    });
  }, [question, stage]);

  return (
    <div
      ref={containerRef}
      className="map-canvas"
      aria-label="日本地図"
      role="application"
    />
  );
}

export default function MapQuiz() {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedCourse, setSelectedCourse] = useState<QuizCourse | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const question =
    questions[questionIndex] ?? selectedCourse?.questions[0] ?? COURSES[0].questions[0];
  const totalQuestions = questions.length || selectedCourse?.questions.length || 0;
  const progress =
    totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;
  const totalAvailableQuestions = COURSES.reduce(
    (total, course) => total + course.questions.length,
    0,
  );

  const startCourse = (course: QuizCourse) => {
    setSelectedCourse(course);
    setQuestions(shuffleQuestions(course.questions));
    setQuestionIndex(0);
    setScore(0);
    setAnsweredCorrectly(false);
    setStage("question");
  };

  const chooseAnswer = (choiceIndex: number) => {
    if (choiceIndex === question.answer) {
      if (!answeredCorrectly) setScore((current) => current + 1);
      setAnsweredCorrectly(true);
      setStage("correct");
    } else {
      setStage("wrong");
    }
  };

  const goNext = () => {
    if (questionIndex === questions.length - 1) {
      setStage("goal");
      return;
    }
    setQuestionIndex((current) => current + 1);
    setAnsweredCorrectly(false);
    setStage("question");
  };

  const returnToCourses = () => {
    setStage("select");
    setSelectedCourse(null);
    setQuestions([]);
    setQuestionIndex(0);
    setScore(0);
    setAnsweredCorrectly(false);
  };

  const panelClass =
    stage === "select"
      ? "quiz-panel panel-center panel-wide"
      : stage === "goal"
        ? "quiz-panel panel-center"
        : "quiz-panel";

  const panelStyle = {
    "--course-accent": selectedCourse?.accent ?? "#1769aa",
  } as CSSProperties;

  return (
    <main className="quiz-shell">
      <JapanMap stage={stage} question={question} />

      <div className="map-brand" aria-label="日本ぐるっと地図クイズ">
        <div className="brand-mark" aria-hidden="true">
          🗾
        </div>
        <div className="brand-copy">
          <strong>日本ぐるっと！</strong>
          <span>地図クイズ</span>
        </div>
      </div>

      <section className={panelClass} style={panelStyle} aria-live="polite">
        <div className="panel-topline" />
        <div className="panel-content">
          {stage === "select" && (
            <>
              <div className="eyebrow-row">
                <span className="grade-pill">小学6年生向け</span>
                <span className="score-pill">
                  {COURSES.length}コース・全{totalAvailableQuestions}問
                </span>
              </div>
              <h1 className="hero-title">
                <span>好きなテーマで日本を旅しよう</span>
                日本ぐるっと！
                <br />
                地図クイズ
              </h1>
              <p className="hero-lead course-lead">
                コースを選ぶと問題をランダム順に出題。答えの場所まで地図がひとっ飛びします。
              </p>
              <div className="course-grid" aria-label="クイズコース">
                {COURSES.map((course) => (
                  <button
                    className="course-card"
                    style={{ "--card-accent": course.accent } as CSSProperties}
                    key={course.id}
                    onClick={() => startCourse(course)}
                  >
                    <span className="course-icon" aria-hidden="true">
                      {course.icon}
                    </span>
                    <span className="course-copy">
                      <strong>{course.title}</strong>
                      <span>{course.description}</span>
                    </span>
                    <span className="course-count">{course.questions.length}問</span>
                  </button>
                ))}
              </div>
              <p className="random-note">↻ 問題の順番は毎回変わります</p>
            </>
          )}

          {stage === "question" && (
            <>
              <div className="course-toolbar">
                <button className="text-button" onClick={returnToCourses}>
                  ‹ コース選択
                </button>
                <span className="active-course">
                  {selectedCourse?.icon} {selectedCourse?.title}
                </span>
              </div>
              <div className="progress-row">
                <span className="question-number">
                  第{questionIndex + 1}問 / {totalQuestions}
                </span>
                <div className="progress-track" aria-hidden="true">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="score-pill">★ {score}</span>
              </div>
              <span className="category-pill">{question.category}</span>
              <h2 className="question-title">{question.question}</h2>
              <div className="answers">
                {question.choices.map((choice, index) => (
                  <button
                    className="answer-button"
                    key={choice}
                    onClick={() => chooseAnswer(index)}
                  >
                    <span className="answer-badge">
                      {CHOICE_LABELS[index]}
                    </span>
                    <span>{choice}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {stage === "correct" && (
            <>
              <div className="result-heading">
                <span className="result-icon correct">✓</span>
                <div>
                  <span className="category-pill">正解！</span>
                  <h2>よくできました</h2>
                </div>
              </div>
              <div className="map-status">
                <span className="map-status-dot" />
                地図が答えの場所へ移動しました
              </div>
              <p className="place-name">{question.place}</p>
              <p className="explanation">{question.explanation}</p>
              <button className="next-button" onClick={goNext}>
                {questionIndex === questions.length - 1
                  ? "ゴールへ ▶"
                  : "次の問題へ ▶"}
              </button>
            </>
          )}

          {stage === "wrong" && (
            <>
              <div className="result-heading">
                <span className="result-icon wrong">!</span>
                <div>
                  <span className="category-pill">もう一度</span>
                  <h2>おしい！</h2>
                </div>
              </div>
              <p className="hint">
                <strong>ヒント：</strong>
                {question.hint}
              </p>
              <button
                className="retry-button"
                onClick={() => setStage("question")}
              >
                問題に戻る ↩
              </button>
            </>
          )}

          {stage === "goal" && selectedCourse && (
            <div className="goal-copy">
              <div className="goal-medal" aria-hidden="true">
                🏆
              </div>
              <h1 className="hero-title">
                <span>{selectedCourse.title}コース クリア！</span>
                地図博士に
                <br />
                一歩近づいたね
              </h1>
              <p className="goal-score">
                {totalQuestions}問中 {score}問 正解
              </p>
              <p className="hero-lead">
                今回と違う順番でもう一度挑戦したり、別のコースにも旅してみよう。
              </p>
              <div className="goal-actions">
                <button
                  className="primary-button"
                  onClick={() => startCourse(selectedCourse)}
                >
                  同じコースに再挑戦 ↻
                </button>
                <button className="secondary-button" onClick={returnToCourses}>
                  コース選択へ戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

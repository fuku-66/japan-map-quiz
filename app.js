const CHOICE_LABELS = ["A", "B", "C"];
const panel = document.querySelector("#quiz-panel");
const content = document.querySelector("#panel-content");

let courses = [];
let selectedCourse = null;
let questions = [];
let stage = "select";
let questionIndex = 0;
let score = 0;
let answeredCorrectly = false;
let marker = null;

const map = L.map("map", {
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
}).addTo(map);

function shuffleQuestions(source) {
  const shuffled = [...source];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function getQuestion() {
  return (
    questions[questionIndex] ??
    selectedCourse?.questions[0] ??
    courses[0]?.questions[0]
  );
}

function updateMap() {
  marker?.remove();
  marker = null;

  const question = getQuestion();
  if (!question || stage === "select" || stage === "goal") {
    map.flyTo([36.4, 137.6], 5, { duration: 1.3 });
    return;
  }

  if (stage === "question") {
    const [lat, lng, zoom] = question.questionView;
    map.flyTo([lat, lng], zoom, { duration: 1.35 });
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
    marker = L.marker([lat, lng], { icon }).addTo(map);
  }
}

function startCourse(course) {
  selectedCourse = course;
  questions = shuffleQuestions(course.questions);
  questionIndex = 0;
  score = 0;
  answeredCorrectly = false;
  stage = "question";
  render();
}

function returnToCourses() {
  selectedCourse = null;
  questions = [];
  questionIndex = 0;
  score = 0;
  answeredCorrectly = false;
  stage = "select";
  render();
}

function render() {
  const question = getQuestion();
  const totalQuestions = questions.length || selectedCourse?.questions.length || 0;
  const progress =
    totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;

  panel.className =
    stage === "select"
      ? "quiz-panel panel-center panel-wide"
      : stage === "goal"
        ? "quiz-panel panel-center"
        : "quiz-panel";
  panel.style.setProperty(
    "--course-accent",
    selectedCourse?.accent ?? "#1769aa",
  );

  if (stage === "select") {
    const total = courses.reduce(
      (count, course) => count + course.questions.length,
      0,
    );
    content.innerHTML = `
      <div class="eyebrow-row">
        <span class="grade-pill">小学6年生向け</span>
        <span class="score-pill">${courses.length}コース・全${total}問</span>
      </div>
      <h1 class="hero-title">
        <span>好きなテーマで日本を旅しよう</span>
        日本ぐるっと！<br>地図クイズ
      </h1>
      <p class="hero-lead course-lead">
        コースを選ぶと問題をランダム順に出題。答えの場所まで地図がひとっ飛びします。
      </p>
      <div class="course-grid" aria-label="クイズコース">
        ${courses
          .map(
            (course) => `
              <button class="course-card" data-course="${course.id}" style="--card-accent:${course.accent}">
                <span class="course-icon" aria-hidden="true">${course.icon}</span>
                <span class="course-copy">
                  <strong>${course.title}</strong>
                  <span>${course.description}</span>
                </span>
                <span class="course-count">${course.questions.length}問</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="random-note">↻ 問題の順番は毎回変わります</p>
    `;
  } else if (stage === "question") {
    content.innerHTML = `
      <div class="course-toolbar">
        <button class="text-button" data-action="courses">‹ コース選択</button>
        <span class="active-course">${selectedCourse.icon} ${selectedCourse.title}</span>
      </div>
      <div class="progress-row">
        <span class="question-number">第${questionIndex + 1}問 / ${totalQuestions}</span>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
        <span class="score-pill">★ ${score}</span>
      </div>
      <span class="category-pill">${question.category}</span>
      <h2 class="question-title">${question.question}</h2>
      <div class="answers">
        ${question.choices
          .map(
            (choice, index) => `
              <button class="answer-button" data-choice="${index}">
                <span class="answer-badge">${CHOICE_LABELS[index]}</span>
                <span>${choice}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    `;
  } else if (stage === "correct") {
    content.innerHTML = `
      <div class="result-heading">
        <span class="result-icon correct">✓</span>
        <div><span class="category-pill">正解！</span><h2>よくできました</h2></div>
      </div>
      <div class="map-status">
        <span class="map-status-dot"></span>地図が答えの場所へ移動しました
      </div>
      <p class="place-name">${question.place}</p>
      <p class="explanation">${question.explanation}</p>
      <button class="next-button" data-action="next">
        ${questionIndex === questions.length - 1 ? "ゴールへ ▶" : "次の問題へ ▶"}
      </button>
    `;
  } else if (stage === "wrong") {
    content.innerHTML = `
      <div class="result-heading">
        <span class="result-icon wrong">!</span>
        <div><span class="category-pill">もう一度</span><h2>おしい！</h2></div>
      </div>
      <p class="hint"><strong>ヒント：</strong>${question.hint}</p>
      <button class="retry-button" data-action="retry">問題に戻る ↩</button>
    `;
  } else {
    content.innerHTML = `
      <div class="goal-copy">
        <div class="goal-medal" aria-hidden="true">🏆</div>
        <h1 class="hero-title">
          <span>${selectedCourse.title}コース クリア！</span>
          地図博士に<br>一歩近づいたね
        </h1>
        <p class="goal-score">${totalQuestions}問中 ${score}問 正解</p>
        <p class="hero-lead">
          今回と違う順番でもう一度挑戦したり、別のコースにも旅してみよう。
        </p>
        <div class="goal-actions">
          <button class="primary-button" data-action="restart">同じコースに再挑戦 ↻</button>
          <button class="secondary-button" data-action="courses">コース選択へ戻る</button>
        </div>
      </div>
    `;
  }

  content.scrollTop = 0;
  updateMap();
}

content.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.course) {
    const course = courses.find((item) => item.id === button.dataset.course);
    if (course) startCourse(course);
    return;
  }

  if (button.dataset.choice !== undefined) {
    const choiceIndex = Number(button.dataset.choice);
    if (choiceIndex === getQuestion().answer) {
      if (!answeredCorrectly) score += 1;
      answeredCorrectly = true;
      stage = "correct";
    } else {
      stage = "wrong";
    }
    render();
    return;
  }

  if (button.dataset.action === "retry") {
    stage = "question";
    render();
  } else if (button.dataset.action === "next") {
    if (questionIndex === questions.length - 1) {
      stage = "goal";
    } else {
      questionIndex += 1;
      answeredCorrectly = false;
      stage = "question";
    }
    render();
  } else if (button.dataset.action === "restart") {
    startCourse(selectedCourse);
  } else if (button.dataset.action === "courses") {
    returnToCourses();
  }
});

window.addEventListener("resize", () => map.invalidateSize());

content.innerHTML = '<p class="hero-lead">クイズを準備しています…</p>';
fetch("./quiz-data.json?v=2")
  .then((response) => {
    if (!response.ok) throw new Error("Quiz data could not be loaded");
    return response.json();
  })
  .then((data) => {
    courses = data;
    render();
  })
  .catch(() => {
    content.innerHTML =
      '<p class="hero-lead">クイズを読み込めませんでした。ページを再読み込みしてください。</p>';
  });

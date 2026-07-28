const QUESTIONS = [
  {
    category: "都道府県",
    question: "日本で、面積がいちばん大きい都道府県はどこ？",
    choices: ["北海道", "岩手県", "長野県"],
    answer: 0,
    place: "北海道",
    explanation:
      "北海道の面積は日本全体のおよそ5分の1。九州と四国を合わせたよりも広いんだよ。",
    hint: "日本列島のいちばん北にある、大きな島を見てみよう。",
    questionView: [38.5, 137.5, 5],
    answerView: [43.45, 142.65, 6],
  },
  {
    category: "湖",
    question: "日本でいちばん大きい湖、琵琶湖（びわこ）がある県はどこ？",
    choices: ["福井県", "滋賀県", "三重県"],
    answer: 1,
    place: "琵琶湖・滋賀県",
    explanation:
      "琵琶湖は滋賀県の面積のおよそ6分の1をしめる、日本最大の湖。400万年以上の歴史があるといわれているよ。",
    hint: "京都府の東どなりにある県だよ。",
    questionView: [35.15, 135.8, 7],
    answerView: [35.275, 136.1, 9],
  },
  {
    category: "山地・山脈",
    question: "富士山がまたがっている2つの県の組み合わせはどれ？",
    choices: [
      "長野県と岐阜県",
      "東京都と神奈川県",
      "山梨県と静岡県",
    ],
    answer: 2,
    place: "富士山",
    explanation:
      "富士山の山頂付近は、山梨県と静岡県の県境にあるよ。高さ3,776mで日本一高い山だね。",
    hint: "関東地方の西側と、中部地方の太平洋側にある2県だよ。",
    questionView: [35.6, 138.5, 7],
    answerView: [35.3606, 138.7274, 10],
  },
  {
    category: "川",
    question: "日本でいちばん長い川はどれ？",
    choices: [
      "利根川（とねがわ）",
      "石狩川（いしかりがわ）",
      "信濃川（しなのがわ）",
    ],
    answer: 2,
    place: "信濃川",
    explanation:
      "信濃川は長さ367km。長野県では千曲川（ちくまがわ）とよばれ、新潟県で信濃川になるよ。",
    hint: "長野県から新潟県へ流れ、日本海にそそぐ川だよ。",
    questionView: [37.0, 138.3, 7],
    answerView: [37.83, 138.95, 8],
  },
  {
    category: "平野",
    question: "東京や埼玉などに広がる、日本でいちばん大きい平野はどれ？",
    choices: ["関東平野", "濃尾平野", "石狩平野"],
    answer: 0,
    place: "関東平野",
    explanation:
      "関東平野は東京・埼玉・千葉・茨城・栃木・群馬・神奈川にまたがる、日本最大の平野だよ。",
    hint: "日本で最も人口が多い地方に広がっているよ。",
    questionView: [36.05, 139.55, 7],
    answerView: [36.1, 139.65, 8],
  },
  {
    category: "歴史と都市",
    question: "794年に都が移され、平安京とよばれた現在の都市はどこ？",
    choices: ["奈良市", "京都市", "鎌倉市"],
    answer: 1,
    place: "京都市",
    explanation:
      "794年、桓武天皇（かんむてんのう）が平安京へ都を移したよ。現在の京都市にあたる場所だね。",
    hint: "『鳴くよ（794）うぐいす平安京』で覚える都市だよ。",
    questionView: [35.1, 135.5, 7],
    answerView: [35.0116, 135.7681, 11],
  },
  {
    category: "地図と経線",
    question: "日本の標準時を決める東経135度の経線が通る市はどこ？",
    choices: ["兵庫県明石市", "愛知県名古屋市", "広島県広島市"],
    answer: 0,
    place: "兵庫県明石市",
    explanation:
      "東経135度の経線は兵庫県明石市を通るよ。日本の標準時は、この経線の時刻を基準にしているんだ。",
    hint: "神戸市の西どなりにある市だよ。",
    questionView: [34.75, 134.95, 8],
    answerView: [34.6431, 134.9972, 11],
  },
  {
    category: "交通",
    question: "瀬戸大橋（せとおおはし）が結んでいる2つの県はどれ？",
    choices: [
      "広島県と愛媛県",
      "岡山県と香川県",
      "兵庫県と徳島県",
    ],
    answer: 1,
    place: "瀬戸大橋",
    explanation:
      "瀬戸大橋は本州の岡山県倉敷市と、四国の香川県坂出市を結ぶ橋のまとまりだよ。",
    hint: "本州の中国地方と、四国の北東部を結んでいるよ。",
    questionView: [34.35, 133.8, 8],
    answerView: [34.365, 133.82, 10],
  },
  {
    category: "火山",
    question: "今も活動を続ける火山・桜島（さくらじま）がある県はどこ？",
    choices: ["宮崎県", "熊本県", "鹿児島県"],
    answer: 2,
    place: "桜島・鹿児島県",
    explanation:
      "桜島は鹿児島湾にある活火山。大正時代の大噴火で流れ出た溶岩により、大隅半島と陸続きになったよ。",
    hint: "九州のいちばん南にある県だよ。",
    questionView: [31.75, 130.65, 7],
    answerView: [31.593, 130.657, 11],
  },
  {
    category: "日本の位置",
    question: "47都道府県の中で、いちばん南にある県はどこ？",
    choices: ["沖縄県", "鹿児島県", "高知県"],
    answer: 0,
    place: "沖縄県",
    explanation:
      "沖縄県は大小160ほどの島からなる県。日本の最南端・沖ノ鳥島は東京都だけれど、都道府県では沖縄県が最南だよ。",
    hint: "南西諸島の多くをふくむ県だよ。",
    questionView: [29.0, 130.0, 5],
    answerView: [26.2124, 127.6809, 8],
  },
];

const CHOICE_LABELS = ["A", "B", "C"];
const panel = document.querySelector("#quiz-panel");
const content = document.querySelector("#panel-content");

let stage = "start";
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
  maxZoom: 15,
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function updateMap() {
  if (marker) {
    marker.remove();
    marker = null;
  }

  const question = QUESTIONS[questionIndex];
  if (stage === "start" || stage === "goal") {
    map.flyTo([36.4, 137.6], 5, { duration: 1.6 });
  } else if (stage === "question") {
    const [lat, lng, zoom] = question.questionView;
    map.flyTo([lat, lng], zoom, { duration: 1.35 });
  } else if (stage === "correct") {
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

function render() {
  const question = QUESTIONS[questionIndex];
  const progress = ((questionIndex + 1) / QUESTIONS.length) * 100;
  panel.className =
    stage === "start" || stage === "goal"
      ? "quiz-panel panel-center"
      : "quiz-panel";

  if (stage === "start") {
    content.innerHTML = `
      <div class="eyebrow-row">
        <span class="grade-pill">小学6年生向け</span>
        <span class="score-pill">全10問</span>
      </div>
      <h1 class="hero-title">
        <span>地図で旅する10問</span>
        日本ぐるっと！<br>地図クイズ
      </h1>
      <p class="hero-lead">
        答えを選ぶと、地図がその場所までひとっ飛び。日本の地形や歴史を楽しく確かめよう！
      </p>
      <div class="how-to">
        <div class="how-to-item"><span class="how-to-number">1</span>A・B・Cから答えを選ぶ</div>
        <div class="how-to-item"><span class="how-to-number">2</span>正解の場所を地図で見る</div>
        <div class="how-to-item"><span class="how-to-number">3</span>解説を読んで次の問題へ</div>
      </div>
      <button class="primary-button" data-action="start">日本一周をスタート ▶</button>
    `;
  } else if (stage === "question") {
    content.innerHTML = `
      <div class="progress-row">
        <span class="question-number">第${questionIndex + 1}問 / ${QUESTIONS.length}</span>
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
        ${questionIndex === QUESTIONS.length - 1 ? "ゴールへ ▶" : "次の問題へ ▶"}
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
          <span>日本一周クリア！</span>
          地図博士に<br>一歩近づいたね
        </h1>
        <p class="goal-score">10問中 ${score}問 正解</p>
        <p class="hero-lead">
          山・川・平野・都市の場所を、もう一度地図で思い出してみよう。
        </p>
        <button class="primary-button" data-action="start">もう一度ちょうせん ↻</button>
      </div>
    `;
  }

  content.scrollTop = 0;
  updateMap();
}

content.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.choice !== undefined) {
    const choiceIndex = Number(button.dataset.choice);
    if (choiceIndex === QUESTIONS[questionIndex].answer) {
      if (!answeredCorrectly) score += 1;
      answeredCorrectly = true;
      stage = "correct";
    } else {
      stage = "wrong";
    }
    render();
    return;
  }

  if (button.dataset.action === "start") {
    questionIndex = 0;
    score = 0;
    answeredCorrectly = false;
    stage = "question";
  } else if (button.dataset.action === "retry") {
    stage = "question";
  } else if (button.dataset.action === "next") {
    if (questionIndex === QUESTIONS.length - 1) {
      stage = "goal";
    } else {
      questionIndex += 1;
      answeredCorrectly = false;
      stage = "question";
    }
  }

  render();
});

window.addEventListener("resize", () => map.invalidateSize());
render();

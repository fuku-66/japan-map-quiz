import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("quiz data contains four expandable courses and forty valid questions", async () => {
  const raw = await readFile(new URL("public/quiz-data.json", root), "utf8");
  const courses = JSON.parse(raw);

  assert.equal(courses.length, 4);
  assert.equal(new Set(courses.map((course) => course.id)).size, courses.length);
  assert.equal(
    courses.reduce((total, course) => total + course.questions.length, 0),
    40,
  );

  for (const course of courses) {
    assert.ok(course.id);
    assert.ok(course.title);
    assert.equal(course.questions.length, 10);

    for (const question of course.questions) {
      assert.equal(question.choices.length, 3);
      assert.ok(Number.isInteger(question.answer));
      assert.ok(question.answer >= 0 && question.answer <= 2);
      assert.equal(question.questionView.length, 3);
      assert.equal(question.answerView.length, 3);
      assert.ok(question.question);
      assert.ok(question.explanation);
      assert.ok(question.hint);
    }
  }
});

test("static build uses shared data, randomized order, and border-free imagery", async () => {
  const [app, source, publicData, staticData] = await Promise.all([
    readFile(new URL("docs/app.js", root), "utf8"),
    readFile(new URL("app/MapQuiz.tsx", root), "utf8"),
    readFile(new URL("public/quiz-data.json", root), "utf8"),
    readFile(new URL("docs/quiz-data.json", root), "utf8"),
  ]);

  assert.equal(staticData, publicData);
  assert.match(app, /shuffleQuestions/);
  assert.match(source, /shuffleQuestions/);
  assert.match(app, /World_Imagery/);
  assert.match(source, /World_Imagery/);
  assert.doesNotMatch(app, /tile\.openstreetmap\.org/);
  assert.doesNotMatch(source, /tile\.openstreetmap\.org/);
});

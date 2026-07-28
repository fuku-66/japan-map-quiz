import { copyFile, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "public", "quiz-data.json");
const docsPath = path.join(root, "docs");

const [leafletCss, appCss, rawData] = await Promise.all([
  readFile(path.join(root, "node_modules", "leaflet", "dist", "leaflet.css"), "utf8"),
  readFile(path.join(root, "app", "globals.css"), "utf8"),
  readFile(dataPath, "utf8"),
]);

const courses = JSON.parse(rawData);
const questionCount = courses.reduce(
  (total, course) => total + course.questions.length,
  0,
);

if (!Array.isArray(courses) || courses.length === 0 || questionCount === 0) {
  throw new Error("At least one course with questions is required");
}

for (const course of courses) {
  if (!course.id || !course.title || course.questions.length === 0) {
    throw new Error("Each course needs an id, title, and questions");
  }
  for (const question of course.questions) {
    if (question.choices.length !== 3 || question.answer < 0 || question.answer > 2) {
      throw new Error(`Invalid choices in: ${question.question}`);
    }
    if (question.questionView.length !== 3 || question.answerView.length !== 3) {
      throw new Error(`Invalid map view in: ${question.question}`);
    }
  }
}

const browserCss = appCss
  .replace('@import "tailwindcss";', "")
  .replace('@import "leaflet/dist/leaflet.css";', "")
  .trim();

await Promise.all([
  writeFile(path.join(docsPath, "style.css"), `${leafletCss}\n${browserCss}\n`),
  copyFile(dataPath, path.join(docsPath, "quiz-data.json")),
  copyFile(
    path.join(root, "node_modules", "leaflet", "dist", "leaflet.js"),
    path.join(docsPath, "leaflet.js"),
  ),
  copyFile(path.join(root, "public", "og.png"), path.join(docsPath, "og.png")),
]);

console.log(`Static quiz ready: ${courses.length} courses, ${questionCount} questions`);

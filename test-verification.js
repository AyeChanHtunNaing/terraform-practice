import fs from 'fs';
import path from 'path';

console.log('--- STARTING TERRAFORM ASSOCIATE 004 VERIFICATION SUITE ---\n');

const questionsPath = path.resolve('src/data/questions.json');
const objectivesPath = path.resolve('src/data/objectives.json');

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
const objectives = JSON.parse(fs.readFileSync(objectivesPath, 'utf8'));

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    testsFailed++;
  }
}

// 1. Total questions count === 342
assert(questions.length === 342, `342 questions imported (found ${questions.length})`);

// 2. Exactly 57 questions per exam across all 6 exams
for (let e = 1; e <= 6; e++) {
  const examQs = questions.filter((q) => q.exam === e);
  assert(examQs.length === 57, `Exam #${e} has exactly 57 questions (found ${examQs.length})`);
}

// 3. Exactly 8 objectives
assert(objectives.length === 8, `Exactly 8 objectives defined (found ${objectives.length})`);

// 4. Every question has an objective between 1 and 8 and valid objectiveName
const allHaveValidObj = questions.every(
  (q) => q.objective >= 1 && q.objective <= 8 && typeof q.objectiveName === 'string' && q.objectiveName.length > 0
);
assert(allHaveValidObj, 'Every question has a valid objective (1-8) and objectiveName');

// 5. Objective distribution check
const objCounts = {};
for (let i = 1; i <= 8; i++) objCounts[i] = 0;
questions.forEach((q) => objCounts[q.objective]++);
console.log('Objective question counts:', objCounts);
assert(
  objCounts[1] === 22 &&
  objCounts[2] === 44 &&
  objCounts[3] === 59 &&
  objCounts[4] === 75 &&
  objCounts[5] === 37 &&
  objCounts[6] === 41 &&
  objCounts[7] === 28 &&
  objCounts[8] === 36,
  'Objective counts match source exams distribution exactly (75 for Obj 4, 59 for Obj 3, etc.)'
);

// 6. Every question has correct answer(s) matching choices
const allHaveCorrectAnswers = questions.every((q) => {
  if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) return false;
  const choiceIds = q.choices.map((c) => c.id);
  return q.correctAnswers.every((a) => choiceIds.includes(a));
});
assert(allHaveCorrectAnswers, 'Every question has valid correct answer(s) mapped to choice IDs');

// 7. Question types: single-select vs multi-select vs True/False
const singleQs = questions.filter((q) => q.type === 'single');
const multiQs = questions.filter((q) => q.type === 'multi');
const tfQs = questions.filter((q) => q.isTrueFalse);
assert(singleQs.length > 0, `Single-select questions verified (${singleQs.length} questions)`);
assert(multiQs.length > 0, `Multi-select questions verified (${multiQs.length} questions)`);
assert(tfQs.length > 0, `True/False questions verified (${tfQs.length} questions)`);

// 8. Question explanations are present for every question
const allHaveExplanations = questions.every(
  (q) => typeof q.explanation === 'string' && q.explanation.trim().length > 0
);
assert(allHaveExplanations, 'Every question has an explanation from the source exam');

// 9. Original exam/question references preserved (displayId, source, questionNumber)
const allHaveTraceableRefs = questions.every(
  (q) => q.displayId === `E${q.exam}-Q${q.questionNumber}` &&
        q.source === `Exam #${q.exam}` &&
        q.questionNumber >= 1 &&
        q.questionNumber <= 57
);
assert(allHaveTraceableRefs, 'All questions have preserved original exam and question references (E1-Q1 to E6-Q57)');

// 10. Search query tests
const searchTerms = [
  'provider',
  'state',
  'for_each',
  'count',
  'lifecycle',
  'module',
  'HCP Terraform',
  'Sentinel',
  'backend',
  'data source'
];

searchTerms.forEach((term) => {
  const matches = questions.filter((q) => {
    const text = [
      q.question,
      q.explanation,
      q.questionPlain,
      ...q.choices.map((c) => c.text)
    ].join(' ').toLowerCase();
    return text.includes(term.toLowerCase());
  });
  assert(matches.length > 0, `Search term "${term}" matches ${matches.length} questions`);
});

console.log(`\n==========================================`);
console.log(`FINAL RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
console.log(`==========================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
}

import rawQuestions from '../data/questions.json';
import objectivesData from '../data/objectives.json';

/**
 * Validates the question bank according to Section 13 Data Integrity requirements:
 * - totalQuestions === 342
 * - eachExamQuestionCount === 57
 * - everyQuestionHasObjective === true
 * - everyQuestionHasCorrectAnswer === true
 */
export function validateDataIntegrity() {
  const errors = [];
  const total = rawQuestions.length;

  if (total !== 342) {
    errors.push(`Expected exactly 342 questions, but found ${total}`);
  }

  // Check each exam question count (must be exactly 57)
  const examCounts = {};
  for (let e = 1; e <= 6; e++) {
    examCounts[e] = 0;
  }

  rawQuestions.forEach((q, idx) => {
    const qLabel = q.displayId || `Index ${idx}`;

    // Validate exam #
    if (!q.exam || q.exam < 1 || q.exam > 6) {
      errors.push(`${qLabel}: Invalid exam number ${q.exam}`);
    } else {
      examCounts[q.exam] = (examCounts[q.exam] || 0) + 1;
    }

    // Validate question number
    if (!q.questionNumber || q.questionNumber < 1 || q.questionNumber > 57) {
      errors.push(`${qLabel}: Invalid question number ${q.questionNumber}`);
    }

    // Validate objective
    if (!q.objective || q.objective < 1 || q.objective > 8 || !q.objectiveName) {
      errors.push(`${qLabel}: Missing or invalid objective (${q.objective}, ${q.objectiveName})`);
    }

    // Validate correct answer(s)
    if (!q.correctAnswers || !Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
      errors.push(`${qLabel}: Missing correct answer`);
    } else {
      const choiceIds = (q.choices || []).map(c => c.id);
      q.correctAnswers.forEach(ans => {
        if (!choiceIds.includes(ans)) {
          errors.push(`${qLabel}: Correct answer "${ans}" not found in choices [${choiceIds.join(', ')}]`);
        }
      });
    }

    // Validate choices
    if (!q.choices || q.choices.length < 2) {
      errors.push(`${qLabel}: Less than 2 choices available`);
    }

    // Validate question text
    if (!q.question || !q.question.trim()) {
      errors.push(`${qLabel}: Empty question text`);
    }

    // Validate explanation
    if (!q.explanation || !q.explanation.trim()) {
      errors.push(`${qLabel}: Empty explanation`);
    }
  });

  for (let e = 1; e <= 6; e++) {
    if (examCounts[e] !== 57) {
      errors.push(`Exam #${e} has ${examCounts[e]} questions, expected 57`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      totalQuestions: total,
      examCounts,
      objectivesCount: objectivesData.length,
      singleChoiceCount: rawQuestions.filter(q => q.type === 'single').length,
      multiSelectCount: rawQuestions.filter(q => q.type === 'multi').length,
      trueFalseCount: rawQuestions.filter(q => q.isTrueFalse).length
    }
  };
}

// Run initial validation
export const integrityCheckResult = validateDataIntegrity();
if (!integrityCheckResult.isValid) {
  console.error('CRITICAL DATA INTEGRITY ERROR:', integrityCheckResult.errors);
} else {
  console.log('✓ Terraform 004 Question Bank: 342 questions validated with 100% integrity.');
}

export function getAllQuestions() {
  return rawQuestions;
}

export function getQuestionById(id) {
  return rawQuestions.find(q => q.id === id);
}

export function getQuestionsByExam(examNumber) {
  const num = parseInt(examNumber, 10);
  return rawQuestions
    .filter(q => q.exam === num)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

export function getQuestionsByObjective(objectiveId) {
  const num = parseInt(objectiveId, 10);
  return rawQuestions
    .filter(q => q.objective === num)
    .sort((a, b) => {
      if (a.exam !== b.exam) return a.exam - b.exam;
      return a.questionNumber - b.questionNumber;
    });
}

export function getAllObjectives() {
  return objectivesData;
}

export function getObjectiveById(objectiveId) {
  const num = parseInt(objectiveId, 10);
  return objectivesData.find(o => o.id === num);
}

/**
 * Searches questions across question text, choices, explanations, display IDs
 */
export function searchQuestions(query, options = {}) {
  if (!query || !query.trim()) {
    if (options.objectiveId) {
      return getQuestionsByObjective(options.objectiveId);
    }
    if (options.examId) {
      return getQuestionsByExam(options.examId);
    }
    return rawQuestions;
  }

  const cleanQuery = query.toLowerCase().trim();
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);

  return rawQuestions.filter(q => {
    if (options.objectiveId && q.objective !== parseInt(options.objectiveId, 10)) {
      return false;
    }
    if (options.examId && q.exam !== parseInt(options.examId, 10)) {
      return false;
    }

    const searchableText = [
      q.displayId,
      q.questionPlain || '',
      q.question || '',
      q.objectiveName,
      q.explanation || '',
      ...(q.choices || []).map(c => c.text)
    ].join(' ').toLowerCase();

    return tokens.every(token => searchableText.includes(token));
  });
}

/**
 * Generates a randomized practice set
 */
export function getRandomQuestions(count = 20, filterFn = null) {
  let pool = [...rawQuestions];
  if (filterFn) {
    pool = pool.filter(filterFn);
  }

  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

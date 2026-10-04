import { getAllQuestions, getAllObjectives } from './questionService';

const STORAGE_KEY = 'tf_assoc_004_progress_v1';
const SETTINGS_KEY = 'tf_assoc_004_settings_v1';

function getDefaultProgress() {
  return {
    questions: {}, // questionId -> { attempts, correct, incorrect, lastAttemptedDate, lastAnswer, lastIsCorrect, bookmarked }
    examAttempts: [], // list of completed exam / practice sessions
    lastActiveDate: new Date().toISOString(),
  };
}

function getDefaultSettings() {
  return {
    timerEnabled: true,
    instantFeedbackInPractice: true,
    shuffleOptions: false,
  };
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return getDefaultSettings();
    return { ...getDefaultSettings(), ...jsonParse(raw) };
  } catch (err) {
    console.error('Error loading settings from localStorage:', err);
    return getDefaultSettings();
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export function applyTheme() {
  // Pure light mode
  const root = document.documentElement;
  root.classList.remove('dark');
  root.classList.add('light');
}

function jsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = jsonParse(raw);
    if (!parsed || typeof parsed !== 'object') return getDefaultProgress();
    return {
      questions: parsed.questions || {},
      examAttempts: Array.isArray(parsed.examAttempts) ? parsed.examAttempts : [],
      lastActiveDate: parsed.lastActiveDate || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Error loading progress:', err);
    return getDefaultProgress();
  }
}

export function saveProgress(progress) {
  try {
    progress.lastActiveDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent('tf_progress_updated', { detail: progress }));
  } catch (err) {
    console.error('Error saving progress:', err);
  }
}

export function recordQuestionAnswer(questionId, userAnswers, isCorrect) {
  const progress = loadProgress();
  const current = progress.questions[questionId] || {
    questionId,
    attempts: 0,
    correct: 0,
    incorrect: 0,
    lastAttemptedDate: null,
    lastAnswer: [],
    lastIsCorrect: false,
    bookmarked: false,
  };

  current.attempts += 1;
  if (isCorrect) {
    current.correct += 1;
  } else {
    current.incorrect += 1;
  }
  current.lastAttemptedDate = new Date().toISOString();
  current.lastAnswer = userAnswers;
  current.lastIsCorrect = isCorrect;

  progress.questions[questionId] = current;
  saveProgress(progress);
  return current;
}

export function toggleQuestionBookmark(questionId) {
  const progress = loadProgress();
  const current = progress.questions[questionId] || {
    questionId,
    attempts: 0,
    correct: 0,
    incorrect: 0,
    lastAttemptedDate: null,
    lastAnswer: [],
    lastIsCorrect: false,
    bookmarked: false,
  };

  current.bookmarked = !current.bookmarked;
  progress.questions[questionId] = current;
  saveProgress(progress);
  return current.bookmarked;
}

export function recordAttemptResult(attemptData) {
  const progress = loadProgress();
  const attemptId = 'attempt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  const newAttempt = {
    id: attemptId,
    date: new Date().toISOString(),
    ...attemptData,
  };

  if (attemptData.answers) {
    Object.entries(attemptData.answers).forEach(([qId, ans]) => {
      const isCorrect = Boolean(ans.isCorrect);
      const userAnswers = ans.userAnswers || [];

      const current = progress.questions[qId] || {
        questionId: qId,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        lastAttemptedDate: null,
        lastAnswer: [],
        lastIsCorrect: false,
        bookmarked: false,
      };

      current.attempts += 1;
      if (isCorrect) {
        current.correct += 1;
      } else {
        current.incorrect += 1;
      }
      current.lastAttemptedDate = new Date().toISOString();
      current.lastAnswer = userAnswers;
      current.lastIsCorrect = isCorrect;

      progress.questions[qId] = current;
    });
  }

  progress.examAttempts.unshift(newAttempt);
  saveProgress(progress);
  return newAttempt;
}

export function getAttemptById(attemptId) {
  const progress = loadProgress();
  return progress.examAttempts.find((a) => a.id === attemptId);
}

export function getOverallProgressStats() {
  const allQuestions = getAllQuestions();
  const progress = loadProgress();
  const qMap = progress.questions;

  const totalQuestions = allQuestions.length;
  let answeredCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  allQuestions.forEach((q) => {
    const stat = qMap[q.id];
    if (stat && stat.attempts > 0) {
      answeredCount++;
      if (stat.lastIsCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
  });

  const unansweredCount = totalQuestions - answeredCount;
  const overallPercentage = answeredCount > 0 ? ((correctCount / answeredCount) * 100).toFixed(1) : '0.0';
  const totalCompletionPercentage = ((answeredCount / totalQuestions) * 100).toFixed(1);

  return {
    totalQuestions,
    answeredCount,
    unansweredCount,
    correctCount,
    incorrectCount,
    overallPercentage: parseFloat(overallPercentage),
    totalCompletionPercentage: parseFloat(totalCompletionPercentage),
  };
}

export function getObjectivesProgressStats() {
  const allQuestions = getAllQuestions();
  const objectives = getAllObjectives();
  const progress = loadProgress();
  const qMap = progress.questions;

  return objectives.map((obj) => {
    const objQuestions = allQuestions.filter((q) => q.objective === obj.id);
    const total = objQuestions.length;
    let completed = 0;
    let correct = 0;
    let incorrect = 0;

    objQuestions.forEach((q) => {
      const stat = qMap[q.id];
      if (stat && stat.attempts > 0) {
        completed++;
        if (stat.lastIsCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const percentage = completed > 0 ? Math.round((correct / completed) * 100) : 0;
    const completionRate = Math.round((completed / total) * 100);

    return {
      ...obj,
      totalQuestions: total,
      completed,
      correct,
      incorrect,
      percentage,
      completionRate,
      isWeak: completed >= 3 && percentage < 70,
    };
  });
}

export function getIncorrectQuestionsList() {
  const allQuestions = getAllQuestions();
  const progress = loadProgress();
  const qMap = progress.questions;

  return allQuestions
    .filter((q) => {
      const stat = qMap[q.id];
      return stat && stat.attempts > 0 && !stat.lastIsCorrect;
    })
    .map((q) => ({
      ...q,
      history: qMap[q.id],
    }));
}

export function getBookmarkedQuestionsList() {
  const allQuestions = getAllQuestions();
  const progress = loadProgress();
  const qMap = progress.questions;

  return allQuestions
    .filter((q) => {
      const stat = qMap[q.id];
      return stat && stat.bookmarked;
    })
    .map((q) => ({
      ...q,
      history: qMap[q.id],
    }));
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('tf_progress_updated', { detail: getDefaultProgress() }));
}

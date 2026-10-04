import React, { useState } from 'react';
import {
  Shuffle,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { getAllQuestions, getAllObjectives } from '../services/questionService';
import {
  recordQuestionAnswer,
  recordAttemptResult,
  toggleQuestionBookmark,
  loadProgress
} from '../services/storageService';
import { QuestionCard } from '../components/QuestionCard';

function shuffleQuestionChoices(question) {
  if (question.isTrueFalse || question.choices.length <= 2) {
    return question;
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const originalChoiceMap = {};
  question.choices.forEach((c) => {
    originalChoiceMap[c.id] = c;
  });

  const correctTexts = question.correctAnswers.map((cid) => originalChoiceMap[cid]?.text);

  const shuffledChoices = [...question.choices];
  for (let i = shuffledChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
  }

  const newChoices = [];
  const newCorrectAnswers = [];

  shuffledChoices.forEach((choice, index) => {
    const newId = alphabet[index];
    newChoices.push({
      id: newId,
      text: choice.text,
    });
    if (correctTexts.includes(choice.text)) {
      newCorrectAnswers.push(newId);
    }
  });

  return {
    ...question,
    choices: newChoices,
    correctAnswers: newCorrectAnswers,
  };
}

export function RandomPracticePage({ navigate }) {
  const [sessionActive, setSessionActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(20);
  const [customCount, setCustomCount] = useState(25);
  const [isCustom, setIsCustom] = useState(false);
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState('all');
  const [shuffleChoicesEnabled, setShuffleChoicesEnabled] = useState(true);
  const [instantFeedbackEnabled, setInstantFeedbackEnabled] = useState(true);

  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const allObjectives = getAllObjectives();

  const handleStartSession = () => {
    const count = isCustom ? Math.min(342, Math.max(5, customCount)) : selectedPreset;
    let pool = getAllQuestions();

    if (selectedObjectiveFilter !== 'all') {
      const objId = parseInt(selectedObjectiveFilter, 10);
      pool = pool.filter((q) => q.objective === objId);
    }

    const shuffledPool = [...pool];
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }

    let selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

    if (shuffleChoicesEnabled) {
      selected = selected.map(shuffleQuestionChoices);
    }

    setSessionQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setSubmittedQuestions({});

    const p = loadProgress();
    const bMap = {};
    Object.entries(p.questions || {}).forEach(([qId, data]) => {
      if (data.bookmarked) bMap[qId] = true;
    });
    setBookmarks(bMap);

    setSessionActive(true);
  };

  const currentQ = sessionQuestions[currentIndex];
  const total = sessionQuestions.length;
  const isCurrentSubmitted = Boolean(submittedQuestions[currentQ?.id]);

  const handleSelectAnswer = (selectedList) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: selectedList,
    }));
  };

  const handleCheckAnswer = () => {
    const userAns = answers[currentQ.id] || [];
    if (userAns.length === 0) return;

    const isCorrect =
      userAns.length === currentQ.correctAnswers.length &&
      currentQ.correctAnswers.every((a) => userAns.includes(a));

    recordQuestionAnswer(currentQ.id, userAns, isCorrect);
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: true,
    }));
  };

  const handleToggleBookmark = (qId) => {
    const isNowBookmarked = toggleQuestionBookmark(qId);
    setBookmarks((prev) => ({
      ...prev,
      [qId]: isNowBookmarked,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishSession();
    }
  };

  const handleFinishSession = () => {
    let correctCount = 0;
    const finalAnswers = {};

    sessionQuestions.forEach((q) => {
      const userAns = answers[q.id] || [];
      const isCorrect =
        userAns.length === q.correctAnswers.length &&
        q.correctAnswers.every((a) => userAns.includes(a));

      if (isCorrect) correctCount++;
      finalAnswers[q.id] = { userAnswers: userAns, isCorrect };
    });

    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 70;

    const attempt = recordAttemptResult({
      mode: 'random',
      title: `Random Practice (${total} Questions)`,
      score: correctCount,
      total,
      percentage,
      passed,
      answers: finalAnswers,
    });

    navigate(`results/${attempt.id}`);
  };

  if (!sessionActive) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Random Practice Quiz
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Quickly drill randomized questions with optional choice scrambling.
          </p>
        </div>

        {/* Clean Config Box (Light Mode) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-6">
          {/* Question Count Buttons */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Number of Questions
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[10, 20, 30, 50].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(count);
                    setIsCustom(false);
                  }}
                  className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                    !isCustom && selectedPreset === count
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {count} Qs
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                  isCustom
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Custom
              </button>
            </div>

            {isCustom && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="342"
                  value={customCount}
                  onChange={(e) => setCustomCount(parseInt(e.target.value, 10) || 10)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-xs w-28 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-500">questions (5 to 342)</span>
              </div>
            )}
          </div>

          {/* Objective Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Objective Pool
            </label>
            <select
              value={selectedObjectiveFilter}
              onChange={(e) => setSelectedObjectiveFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All 8 Objectives (Complete Pool — 342 Questions)</option>
              {allObjectives.map((o) => (
                <option key={o.id} value={o.id}>
                  Objective {o.id} — {o.title}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleChoicesEnabled}
                onChange={(e) => setShuffleChoicesEnabled(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
              />
              <span className="text-xs text-slate-700">
                Randomize answer choice order (scramble A/B/C/D)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={instantFeedbackEnabled}
                onChange={(e) => setInstantFeedbackEnabled(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
              />
              <span className="text-xs text-slate-700">
                Instant Feedback (Check answer & view explanation immediately)
              </span>
            </label>
          </div>

          <button
            onClick={handleStartSession}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>
              Start Quiz ({isCustom ? customCount : selectedPreset} Questions)
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 truncate">
          <button
            onClick={() => setSessionActive(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Exit Session"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="truncate min-w-0">
            <span className="font-bold text-slate-900">
              Random Quiz
            </span>
            <span className="text-slate-300 mx-1.5">•</span>
            <span className="text-slate-500 font-mono">
              Q{currentIndex + 1} of {total}
            </span>
          </div>
        </div>

        <button
          onClick={handleFinishSession}
          className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-medium border border-slate-200 transition-colors flex-shrink-0"
        >
          Finish
        </button>
      </div>

      <QuestionCard
        question={currentQ}
        questionIndex={currentIndex + 1}
        totalQuestions={total}
        selectedAnswers={answers[currentQ.id] || []}
        onSelectAnswer={handleSelectAnswer}
        isSubmitted={isCurrentSubmitted}
        showExplanation={isCurrentSubmitted}
        isBookmarked={Boolean(bookmarks[currentQ.id])}
        onToggleBookmark={handleToggleBookmark}
        mode="practice"
      />

      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs shadow-xs">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium border transition-colors ${
            currentIndex === 0
              ? 'text-slate-300 border-slate-100 cursor-not-allowed'
              : 'text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {!isCurrentSubmitted && instantFeedbackEnabled ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!(answers[currentQ.id] || []).length}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              (answers[currentQ.id] || []).length > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <span>Check Answer</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        ) : currentIndex < total - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleFinishSession}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
          >
            <span>Finish Quiz</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { getObjectiveById, getQuestionsByObjective } from '../services/questionService';
import {
  recordQuestionAnswer,
  recordAttemptResult,
  loadProgress,
  toggleQuestionBookmark
} from '../services/storageService';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionGrid } from '../components/QuestionGrid';

export function ObjectivePracticePage({ objectiveId, searchParams = {}, navigate }) {
  const objNum = parseInt(objectiveId, 10);
  const objective = getObjectiveById(objNum);
  const allObjQuestions = getQuestionsByObjective(objNum);

  const filterMode = searchParams.filter || 'all';
  const filterCount = parseInt(searchParams.count, 10) || 20;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const [flagged, setFlagged] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [showGridModal, setShowGridModal] = useState(false);

  useEffect(() => {
    const progress = loadProgress();
    const qMap = progress.questions || {};

    let filtered = [...allObjQuestions];

    if (filterMode === 'unanswered') {
      filtered = filtered.filter((q) => !qMap[q.id] || qMap[q.id].attempts === 0);
    } else if (filterMode === 'incorrect') {
      filtered = filtered.filter(
        (q) => qMap[q.id] && qMap[q.id].attempts > 0 && !qMap[q.id].lastIsCorrect
      );
    } else if (filterMode === 'random') {
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
      filtered = filtered.slice(0, Math.min(filterCount, filtered.length));
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setAnswers({});
    setSubmittedQuestions({});

    const bMap = {};
    Object.entries(qMap).forEach(([qId, data]) => {
      if (data.bookmarked) bMap[qId] = true;
    });
    setBookmarks(bMap);
  }, [objectiveId, filterMode]);

  if (!objective) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Objective #{objectiveId} Not Found</h2>
        <button
          onClick={() => navigate('objectives')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm"
        >
          Back to Objectives
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 bg-white border border-slate-200 rounded-2xl mt-10 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h2 className="text-base font-bold text-slate-900">
          No Questions Match "{filterMode}"
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {filterMode === 'unanswered'
            ? 'You have already answered all questions for this objective.'
            : filterMode === 'incorrect'
            ? 'Zero incorrect questions found for this objective.'
            : 'No questions matched the criteria.'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate(`objectives/${objNum}?filter=all`)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Practice All Questions ({allObjQuestions.length})
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const isCurrentSubmitted = Boolean(submittedQuestions[currentQ.id]);

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

    questions.forEach((q) => {
      const userAns = answers[q.id] || [];
      const isCorrect =
        userAns.length === currentQ.correctAnswers.length &&
        q.correctAnswers.every((a) => userAns.includes(a));

      if (isCorrect) correctCount++;
      finalAnswers[q.id] = { userAnswers: userAns, isCorrect };
    });

    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 70;

    const attempt = recordAttemptResult({
      mode: 'objective',
      title: `Objective ${objective.id}: ${objective.shortTitle}`,
      score: correctCount,
      total,
      percentage,
      passed,
      answers: finalAnswers,
    });

    navigate(`results/${attempt.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Bar (Light Mode) */}
      <div className="bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 truncate">
          <button
            onClick={() => navigate('objectives')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Back to Objectives"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="truncate min-w-0">
            <span className="font-bold text-slate-900">
              Obj {objective.id}
            </span>
            <span className="text-slate-300 mx-1.5">•</span>
            <span className="text-slate-600 truncate">
              {objective.shortTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setShowGridModal(true)}
            className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono transition-colors"
          >
            {currentIndex + 1}/{total} Qs
          </button>

          <button
            onClick={handleFinishSession}
            className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-medium border border-slate-200 transition-colors"
          >
            Finish
          </button>
        </div>
      </div>

      {/* Main Question Card */}
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

      {/* Bottom Controls */}
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

        {!isCurrentSubmitted ? (
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
            <span>Finish Session</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Objective {objective.id} Questions ({total})
              </h3>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <QuestionGrid
              questions={questions}
              currentIndex={currentIndex}
              onSelectIndex={(idx) => {
                setCurrentIndex(idx);
                setShowGridModal(false);
              }}
              answers={answers}
              flagged={flagged}
              isExamSubmitted={false}
            />

            <button
              onClick={() => setShowGridModal(false)}
              className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

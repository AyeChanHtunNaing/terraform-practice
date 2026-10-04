import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Eye
} from 'lucide-react';
import { getQuestionsByExam } from '../services/questionService';
import {
  recordAttemptResult,
  loadProgress,
  toggleQuestionBookmark,
  recordQuestionAnswer
} from '../services/storageService';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionGrid } from '../components/QuestionGrid';

export function ExamPracticePage({ examId, navigate }) {
  const examNumber = parseInt(examId, 10);
  const questions = getQuestionsByExam(examNumber);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavigatorModal, setShowNavigatorModal] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(false);
  const [questionSubmittedState, setQuestionSubmittedState] = useState({});

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    const bMap = {};
    Object.entries(p.questions || {}).forEach(([qId, data]) => {
      if (data.bookmarked) bMap[qId] = true;
    });
    setBookmarks(bMap);
  }, []);

  useEffect(() => {
    if (isSubmitted || isPaused) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, isPaused]);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Exam #{examId} Not Found</h2>
        <button
          onClick={() => navigate('exams')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm"
        >
          Back to Exams
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).filter((k) => (answers[k] || []).length > 0).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleSelectAnswer = (selectedList) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: selectedList,
    }));

    if (instantFeedback) {
      const isCorrect =
        selectedList.length === currentQ.correctAnswers.length &&
        currentQ.correctAnswers.every((a) => selectedList.includes(a));
      recordQuestionAnswer(currentQ.id, selectedList, isCorrect);
      setQuestionSubmittedState((prev) => ({
        ...prev,
        [currentQ.id]: true,
      }));
    }
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
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
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key.toLowerCase() === 'f') handleToggleFlag();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ]);

  const handleSubmitExam = () => {
    let correctCount = 0;
    const finalAnswers = {};
    const objectiveBreakdown = {};

    questions.forEach((q) => {
      const userAns = answers[q.id] || [];
      const isCorrect =
        userAns.length === q.correctAnswers.length &&
        q.correctAnswers.every((a) => userAns.includes(a));

      if (isCorrect) correctCount++;

      finalAnswers[q.id] = { userAnswers: userAns, isCorrect };

      if (!objectiveBreakdown[q.objective]) {
        objectiveBreakdown[q.objective] = {
          id: q.objective,
          name: q.objectiveName,
          total: 0,
          correct: 0,
        };
      }
      objectiveBreakdown[q.objective].total++;
      if (isCorrect) objectiveBreakdown[q.objective].correct++;
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    const attemptRecord = recordAttemptResult({
      examNumber,
      mode: 'full-exam',
      title: `Practice Exam #${examNumber}`,
      score: correctCount,
      total,
      percentage,
      passed,
      durationSeconds: secondsElapsed,
      answers: finalAnswers,
      objectiveBreakdown,
    });

    setShowSubmitModal(false);
    setIsSubmitted(true);
    navigate(`results/${attemptRecord.id}`);
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:px-4 sm:py-3 shadow-xs space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3 text-sm">
        {/* Row 1: Back + Title + Timer (Mobile) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <button
              onClick={() => navigate('exams')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
              title="Back to Exams"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-baseline gap-2 truncate">
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                Exam #{examNumber}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                ({answeredCount}/{totalQuestions})
              </span>
            </div>
          </div>

          {/* Timer on mobile */}
          <div className="flex sm:hidden items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 font-mono text-slate-800 border border-slate-200 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>
        </div>

        {/* Row 2 on mobile / Right column on desktop */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Timer on desktop */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 font-mono text-slate-800 border border-slate-200 text-sm font-semibold">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          {/* Flag */}
          <button
            onClick={handleToggleFlag}
            className={`flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex-1 sm:flex-none ${
              flagged[currentQ.id]
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Flag question for review"
          >
            <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Flag</span>
          </button>

          {/* Mode toggle */}
          <button
            onClick={() => setInstantFeedback(!instantFeedback)}
            className={`p-1.5 sm:p-2 rounded-lg border transition-colors ${
              instantFeedback
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title={instantFeedback ? 'Instant Explanations: ON' : 'Exam Simulation: Explanations hidden until submit'}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Navigator modal toggle */}
          <button
            onClick={() => setShowNavigatorModal(true)}
            className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex-1 sm:flex-none"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Grid</span>
          </button>

          {/* Submit button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex-1 sm:flex-none text-center"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <QuestionCard
        question={currentQ}
        questionIndex={currentIndex + 1}
        totalQuestions={totalQuestions}
        selectedAnswers={answers[currentQ.id] || []}
        onSelectAnswer={handleSelectAnswer}
        isSubmitted={instantFeedback && Boolean(questionSubmittedState[currentQ.id])}
        showExplanation={instantFeedback && Boolean(questionSubmittedState[currentQ.id])}
        isBookmarked={Boolean(bookmarks[currentQ.id])}
        onToggleBookmark={handleToggleBookmark}
        mode={instantFeedback ? 'practice' : 'exam'}
      />

      {/* Bottom Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs sm:text-sm shadow-xs">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium border transition-colors ${
            currentIndex === 0
              ? 'text-slate-300 border-slate-100 cursor-not-allowed'
              : 'text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Previous</span>
        </button>

        <span className="text-slate-400 font-mono text-xs hidden sm:inline">
          Keys A–D to choose • ← → to navigate
        </span>

        {currentIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-xs"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
          >
            <span>Submit Exam</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* Navigator Modal */}
      {showNavigatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Exam #{examNumber} Questions (57 Total)
              </h3>
              <button
                onClick={() => setShowNavigatorModal(false)}
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
                setShowNavigatorModal(false);
              }}
              answers={answers}
              flagged={flagged}
              isExamSubmitted={isSubmitted}
            />

            <button
              onClick={() => setShowNavigatorModal(false)}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-slate-900">Submit Exam #{examNumber}?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Answered: <strong className="text-emerald-700">{answeredCount}</strong> / {totalQuestions}
                {unansweredCount > 0 && (
                  <span className="text-rose-600 block mt-1.5 font-medium">
                    {unansweredCount} question{unansweredCount > 1 ? 's' : ''} left unanswered.
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Resume
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                Submit & Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

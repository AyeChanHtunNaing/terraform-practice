import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Play,
  CheckCircle2,
  Filter,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  getIncorrectQuestionsList,
  recordQuestionAnswer
} from '../services/storageService';
import { getAllObjectives } from '../services/questionService';
import { QuestionCard } from '../components/QuestionCard';
import { HtmlContent } from '../components/HtmlContent';

export function IncorrectReviewPage({ navigate }) {
  const [incorrectList, setIncorrectList] = useState([]);
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState('all');
  const [practiceActive, setPracticeActive] = useState(false);

  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedState, setSubmittedState] = useState({});

  const refreshList = () => {
    setIncorrectList(getIncorrectQuestionsList());
  };

  useEffect(() => {
    refreshList();
    const handleUpdate = () => refreshList();
    window.addEventListener('tf_progress_updated', handleUpdate);
    return () => window.removeEventListener('tf_progress_updated', handleUpdate);
  }, []);

  const allObjectives = getAllObjectives();

  const filteredList = incorrectList.filter((q) => {
    if (selectedObjectiveFilter !== 'all') {
      return q.objective === parseInt(selectedObjectiveFilter, 10);
    }
    return true;
  });

  const handleStartPracticeAll = () => {
    if (filteredList.length === 0) return;
    setPracticeQuestions(filteredList);
    setCurrentIndex(0);
    setAnswers({});
    setSubmittedState({});
    setPracticeActive(true);
  };

  const handlePracticeSingle = (q) => {
    setPracticeQuestions([q]);
    setCurrentIndex(0);
    setAnswers({});
    setSubmittedState({});
    setPracticeActive(true);
  };

  const currentQ = practiceQuestions[currentIndex];
  const totalPractice = practiceQuestions.length;
  const isCurrentSubmitted = Boolean(submittedState[currentQ?.id]);

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
    setSubmittedState((prev) => ({
      ...prev,
      [currentQ.id]: true,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalPractice - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPracticeActive(false);
      refreshList();
    }
  };

  if (practiceActive && currentQ) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPracticeActive(false);
                refreshList();
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="font-bold text-slate-900">
                Remediating Incorrect Questions
              </span>
              <span className="text-slate-300 mx-1.5">•</span>
              <span className="text-slate-500 font-mono">
                {currentIndex + 1} of {totalPractice}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setPracticeActive(false);
              refreshList();
            }}
            className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
          >
            Exit
          </button>
        </div>

        <QuestionCard
          question={currentQ}
          questionIndex={currentIndex + 1}
          totalQuestions={totalPractice}
          selectedAnswers={answers[currentQ.id] || []}
          onSelectAnswer={handleSelectAnswer}
          isSubmitted={isCurrentSubmitted}
          showExplanation={isCurrentSubmitted}
          mode="practice"
        />

        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs shadow-xs">
          <span className="text-slate-500 text-[11px]">
            Answering correctly clears the question from your review queue
          </span>

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
          ) : currentIndex < totalPractice - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setPracticeActive(false);
                refreshList();
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
            >
              <span>Done</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Review Incorrect Questions</span>
          {incorrectList.length > 0 && (
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {incorrectList.length}
            </span>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Target questions you've previously missed. Stored with attempt counts and timestamps.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedObjectiveFilter}
            onChange={(e) => setSelectedObjectiveFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 max-w-sm"
          >
            <option value="all">All Objectives ({incorrectList.length})</option>
            {allObjectives.map((o) => {
              const count = incorrectList.filter((q) => q.objective === o.id).length;
              return (
                <option key={o.id} value={o.id}>
                  Objective {o.id}: {o.shortTitle} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {filteredList.length > 0 && (
          <button
            onClick={handleStartPracticeAll}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Practice All {filteredList.length} Incorrect</span>
          </button>
        )}
      </div>

      {filteredList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-md mx-auto space-y-3 shadow-2xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900">
            {incorrectList.length === 0 ? 'No Incorrect Questions!' : 'No Mistakes in this Objective'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {incorrectList.length === 0
              ? 'You have no missed questions recorded. Take full exams to identify knowledge gaps.'
              : 'Try selecting another objective or practice all objectives.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((q) => {
            const h = q.history || {};
            const lastDate = h.lastAttemptedDate
              ? new Date(h.lastAttemptedDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              : null;

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-colors shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-mono font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                      {q.displayId}
                    </span>
                    <span className="font-medium text-slate-800">
                      {q.source} • Q{q.questionNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">
                      Obj {q.objective}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-500">
                    <span>Attempts: <strong className="text-slate-800">{h.attempts || 0}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span>Missed: <strong className="text-rose-600">{h.incorrect || 0}</strong></span>
                    {lastDate && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{lastDate}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-800 leading-relaxed">
                  <HtmlContent html={q.question} />
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handlePracticeSingle(q)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Practice Question</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

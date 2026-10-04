import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getAttemptById } from '../services/storageService';
import {
  getQuestionsByExam,
  getAllQuestions,
  getAllObjectives
} from '../services/questionService';
import { HtmlContent } from '../components/HtmlContent';

export function ResultsPage({ attemptId, navigate }) {
  const attempt = getAttemptById(attemptId);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterObjective, setFilterObjective] = useState('all');
  const [expandedMap, setExpandedMap] = useState({});

  useEffect(() => {
    if (attempt && attempt.passed) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B'],
        });
      } catch (e) {}
    }
  }, [attemptId]);

  if (!attempt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Attempt Record Not Found</h2>
        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const allQuestions = getAllQuestions();
  let questions = [];

  if (attempt.examNumber) {
    questions = getQuestionsByExam(attempt.examNumber);
  } else if (attempt.answers) {
    const qIds = Object.keys(attempt.answers);
    questions = allQuestions.filter((q) => qIds.includes(q.id));
  } else {
    questions = allQuestions.slice(0, attempt.total);
  }

  const userAnswersMap = attempt.answers || {};

  const objectiveStatsMap = {};
  questions.forEach((q) => {
    if (!objectiveStatsMap[q.objective]) {
      objectiveStatsMap[q.objective] = {
        id: q.objective,
        name: q.objectiveName,
        total: 0,
        correct: 0,
      };
    }
    objectiveStatsMap[q.objective].total++;
    const ans = userAnswersMap[q.id];
    if (ans && ans.isCorrect) {
      objectiveStatsMap[q.objective].correct++;
    }
  });

  const objectiveBreakdownList = Object.values(objectiveStatsMap).map((item) => {
    const score = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    return {
      ...item,
      score,
      isWeak: score < 70,
    };
  });

  const correctTotal = attempt.score;
  const incorrectTotal = attempt.total - attempt.score;
  const unansweredTotal = questions.filter(
    (q) => !userAnswersMap[q.id] || (userAnswersMap[q.id].userAnswers || []).length === 0
  ).length;

  const filteredQuestions = questions.filter((q) => {
    const ansData = userAnswersMap[q.id];
    const userAnswers = ansData?.userAnswers || [];
    const isAnswered = userAnswers.length > 0;
    const isCorrect = Boolean(ansData?.isCorrect);

    if (filterStatus === 'correct' && !isCorrect) return false;
    if (filterStatus === 'incorrect' && (!isAnswered || isCorrect)) return false;
    if (filterStatus === 'unanswered' && isAnswered) return false;

    if (filterObjective !== 'all' && q.objective !== parseInt(filterObjective, 10)) {
      return false;
    }

    return true;
  });

  const toggleExpand = (qId) => {
    setExpandedMap((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const expandAll = () => {
    const m = {};
    filteredQuestions.forEach((q) => (m[q.id] = true));
    setExpandedMap(m);
  };

  const allObjectives = getAllObjectives();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Score Summary Box (Light Mode) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                  attempt.passed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {attempt.passed ? 'PASSED (≥70%)' : 'DID NOT PASS (<70%)'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(attempt.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              {attempt.title} Results
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {attempt.examNumber ? (
              <button
                onClick={() => navigate(`exams/${attempt.examNumber}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('random')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>
            )}

            <button
              onClick={() => navigate('dashboard')}
              className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-200"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* 4 Score Tiles (Light Mode) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Score</span>
            <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
              {attempt.percentage}%
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Passing mark: 70%</span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
            <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider block">Correct</span>
            <div className="text-3xl font-bold font-mono text-emerald-700 mt-1">
              {attempt.score}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">out of {attempt.total} questions</span>
          </div>

          <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
            <span className="text-[11px] font-medium text-rose-800 uppercase tracking-wider block">Incorrect</span>
            <div className="text-3xl font-bold font-mono text-rose-700 mt-1">
              {incorrectTotal}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Missed questions</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Unanswered</span>
            <div className="text-3xl font-bold font-mono text-slate-700 mt-1">
              {unansweredTotal}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Skipped / blank</span>
          </div>
        </div>
      </div>

      {/* Objective Breakdown Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Performance by Objective
        </h2>

        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
          <table className="w-full min-w-[540px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Objective</th>
                <th className="px-3 py-3 text-center">Correct</th>
                <th className="px-3 py-3 text-center">Total</th>
                <th className="px-3 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {objectiveBreakdownList.map((obj) => (
                <tr key={obj.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <span className="font-mono text-indigo-600 mr-2">Obj {obj.id}:</span>
                    {obj.name}
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-semibold text-emerald-700">
                    {obj.correct}
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-slate-500">
                    {obj.total}
                  </td>
                  <td className="px-3 py-3 text-center font-mono font-bold">
                    <span className={obj.score >= 70 ? 'text-emerald-700' : 'text-rose-700'}>
                      {obj.score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {obj.isWeak ? (
                      <button
                        onClick={() => navigate(`objectives/${obj.id}`)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Drill Weak Area →
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Mastered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Question Review */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">
            Question Review ({questions.length})
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs">
              {[
                { id: 'all', label: `All (${questions.length})` },
                { id: 'correct', label: `Correct (${correctTotal})` },
                { id: 'incorrect', label: `Incorrect (${incorrectTotal})` },
                ...(unansweredTotal > 0
                  ? [{ id: 'unanswered', label: `Unanswered (${unansweredTotal})` }]
                  : []),
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterStatus === f.id
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={filterObjective}
              onChange={(e) => setFilterObjective(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All Objectives</option>
              {allObjectives.map((o) => (
                <option key={o.id} value={o.id}>
                  Obj {o.id}: {o.shortTitle}
                </option>
              ))}
            </select>

            <button
              onClick={expandAll}
              className="text-xs text-slate-500 hover:text-slate-800 px-2"
            >
              Expand All
            </button>
          </div>
        </div>

        {/* Collapsible Questions List */}
        <div className="space-y-2.5">
          {filteredQuestions.map((q) => {
            const ansData = userAnswersMap[q.id];
            const userAnswers = ansData?.userAnswers || [];
            const isCorrect = Boolean(ansData?.isCorrect);
            const isAnswered = userAnswers.length > 0;
            const isExpanded = Boolean(expandedMap[q.id]);

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-colors"
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 truncate">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px] ${
                        isCorrect
                          ? 'bg-emerald-600'
                          : !isAnswered
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}
                    >
                      {isCorrect ? '✓' : !isAnswered ? '?' : '✗'}
                    </span>

                    <span className="font-mono text-slate-500 font-semibold flex-shrink-0">
                      {q.displayId}
                    </span>

                    <span className="text-slate-800 truncate font-medium">
                      {q.questionPlain || 'Question'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 text-slate-500 font-mono text-[11px]">
                    <span className="hidden sm:inline">Obj {q.objective}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs sm:text-sm">
                    <div className="text-slate-900 leading-relaxed font-medium">
                      <HtmlContent html={q.question} />
                    </div>

                    {/* Choices */}
                    <div className="space-y-1.5 pt-1">
                      {q.choices.map((choice) => {
                        const isUserChoice = userAnswers.includes(choice.id);
                        const isRightChoice = q.correctAnswers.includes(choice.id);

                        let style = 'bg-white border-slate-200 text-slate-700';
                        if (isRightChoice) {
                          style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
                        } else if (isUserChoice && !isRightChoice) {
                          style = 'bg-rose-50 border-rose-300 text-rose-950';
                        }

                        return (
                          <div
                            key={choice.id}
                            className={`p-2.5 rounded-lg border flex items-start gap-2.5 text-xs ${style}`}
                          >
                            <span className="font-bold font-mono uppercase mt-0.5">
                              {choice.id}.
                            </span>
                            <div className="flex-1">
                              <HtmlContent html={choice.text} />
                            </div>
                            {isRightChoice && (
                              <span className="text-[11px] text-emerald-700 font-mono font-semibold">
                                ✓ Correct
                              </span>
                            )}
                            {!isRightChoice && isUserChoice && (
                              <span className="text-[11px] text-rose-700 font-mono font-semibold">
                                ✗ Your answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1.5 text-xs text-slate-700">
                        <span className="font-bold text-slate-500 block text-[11px] uppercase tracking-wider">
                          Explanation:
                        </span>
                        <HtmlContent html={q.explanation} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

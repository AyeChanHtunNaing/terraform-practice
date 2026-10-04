import React, { useState, useEffect } from 'react';
import {
  Compass,
  Shuffle,
  Layers,
  ArrowRight,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import {
  getOverallProgressStats,
  getObjectivesProgressStats,
  loadProgress,
  resetAllProgress
} from '../services/storageService';
import { DataIntegrityStatus } from '../components/DataIntegrityStatus';

export function Dashboard({ navigate }) {
  const [overallStats, setOverallStats] = useState(getOverallProgressStats());
  const [objectivesStats, setObjectivesStats] = useState(getObjectivesProgressStats());
  const [progress, setProgress] = useState(loadProgress());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const refreshData = () => {
    setOverallStats(getOverallProgressStats());
    setObjectivesStats(getObjectivesProgressStats());
    setProgress(loadProgress());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('tf_progress_updated', handleUpdate);
    return () => window.removeEventListener('tf_progress_updated', handleUpdate);
  }, []);

  const handleReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
    refreshData();
  };

  const isPassing = overallStats.answeredCount >= 20 && overallStats.overallPercentage >= 70;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Clean, Light Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Terraform Associate (004) Practice
            </h1>
            <DataIntegrityStatus />
          </div>
          <p className="text-xs sm:text-sm md:text-base text-slate-600">
            342 questions across 6 practice exams and 8 official HashiCorp objectives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => navigate('exams')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Practice Exams</span>
          </button>
          <button
            onClick={() => navigate('random')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium transition-colors shadow-2xs"
          >
            <Shuffle className="w-4 h-4 text-indigo-600" />
            <span>Quick Quiz</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Questions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Questions</span>
          <div className="text-3xl font-bold text-slate-900 font-mono">
            {overallStats.totalQuestions}
          </div>
          <p className="text-xs text-slate-500">6 Exams × 57 Questions</p>
        </div>

        {/* Questions Completed */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
          <div className="text-3xl font-bold text-indigo-600 font-mono">
            {overallStats.answeredCount} <span className="text-sm text-slate-400 font-sans font-normal">/ {overallStats.totalQuestions}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${overallStats.totalCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accuracy</span>
          <div className="text-3xl font-bold font-mono text-slate-900">
            {overallStats.overallPercentage}%
          </div>
          <p className={`text-xs font-medium ${isPassing ? 'text-emerald-700' : 'text-slate-500'}`}>
            {overallStats.answeredCount === 0 ? 'No attempts yet' : isPassing ? 'Passing grade (≥70%)' : 'Passing mark: 70%'}
          </p>
        </div>

        {/* Review Needed */}
        <div
          onClick={() => overallStats.incorrectCount > 0 && navigate('review')}
          className={`border rounded-xl p-5 space-y-1.5 transition-colors shadow-2xs ${
            overallStats.incorrectCount > 0
              ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50 cursor-pointer'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Incorrect</span>
            {overallStats.incorrectCount > 0 && (
              <span className="text-xs text-rose-700 font-semibold flex items-center">
                Review <ArrowRight className="w-3 h-3 ml-0.5" />
              </span>
            )}
          </div>
          <div className={`text-3xl font-bold font-mono ${overallStats.incorrectCount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            {overallStats.incorrectCount}
          </div>
          <p className="text-xs text-slate-500">
            {overallStats.incorrectCount > 0 ? 'Needs remediation' : 'No mistakes recorded'}
          </p>
        </div>
      </div>

      {/* Objective Progress Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span>Objective Progress</span>
          </h2>
          <button
            onClick={() => navigate('objectives')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>View All Objectives</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {objectivesStats.map((obj) => {
            const hasStarted = obj.completed > 0;

            return (
              <div
                key={obj.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between transition-colors space-y-4 shadow-2xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                      Objective {obj.id}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {obj.totalQuestions} Qs
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[38px]">
                    {obj.title}
                  </h3>

                  {/* Progress bar & percentage */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">
                        {obj.completed} / {obj.totalQuestions} completed
                      </span>
                      <span className={`font-semibold ${obj.percentage >= 70 ? 'text-emerald-600' : hasStarted ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {hasStarted ? `${obj.percentage}%` : '0%'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          obj.percentage >= 70 ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(100, (obj.completed / obj.totalQuestions) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`objectives/${obj.id}`)}
                  className="w-full py-2 px-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Table */}
      {progress.examAttempts && progress.examAttempts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {progress.examAttempts.length} Completed
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Exam / Session</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Score</th>
                  <th className="px-4 py-3.5">Result</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {progress.examAttempts.slice(0, 5).map((attempt) => {
                  const dateFormatted = new Date(attempt.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {attempt.title || `Exam #${attempt.examNumber}`}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">
                        {dateFormatted}
                      </td>
                      <td className="px-4 py-3.5 font-mono">
                        <span className="font-semibold text-slate-900">{attempt.score}</span>/{attempt.total}{' '}
                        <span className="text-slate-400 text-xs">({attempt.percentage}%)</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${
                            attempt.passed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {attempt.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => navigate(`results/${attempt.id}`)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset Progress Action */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All Progress</span>
        </button>
      </div>

      {/* Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Reset All Practice Progress?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              This will clear your answered questions, incorrect error logs, and attempt history from local storage.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

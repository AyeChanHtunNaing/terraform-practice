import React, { useState, useEffect } from 'react';
import {
  Compass,
  Play,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { getObjectivesProgressStats, loadProgress } from '../services/storageService';
import { getQuestionsByObjective } from '../services/questionService';

export function ObjectivesPage({ navigate }) {
  const [objectivesStats, setObjectivesStats] = useState(getObjectivesProgressStats());
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const handleUpdate = () => setObjectivesStats(getObjectivesProgressStats());
    window.addEventListener('tf_progress_updated', handleUpdate);
    return () => window.removeEventListener('tf_progress_updated', handleUpdate);
  }, []);

  const progress = loadProgress();
  const qMap = progress.questions || {};

  const currentObj = objectivesStats.find((o) => o.id === selectedObjectiveId) || objectivesStats[0];
  const objQuestions = getQuestionsByObjective(selectedObjectiveId);

  const unansweredCount = objQuestions.filter((q) => !qMap[q.id] || qMap[q.id].attempts === 0).length;
  const incorrectCount = objQuestions.filter((q) => qMap[q.id] && qMap[q.id].attempts > 0 && !qMap[q.id].lastIsCorrect).length;

  const handleStartPractice = () => {
    navigate(`objectives/${selectedObjectiveId}?filter=${selectedFilter}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Clean Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Practice by Objective
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Target individual objectives or study specific problem areas.
        </p>
      </div>

      {/* Quick Launch Bar (Light Mode) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Objective Select */}
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Objective
            </label>
            <select
              value={selectedObjectiveId}
              onChange={(e) => setSelectedObjectiveId(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {objectivesStats.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  Objective {obj.id} — {obj.title} ({obj.totalQuestions} Qs)
                </option>
              ))}
            </select>
          </div>

          {/* Filter Mode */}
          <div className="sm:w-60">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Filter Mode
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Questions ({currentObj.totalQuestions})</option>
              <option value="random">Random Subset (20 Qs)</option>
              <option value="unanswered">Unanswered ({unansweredCount} left)</option>
              <option value="incorrect">Incorrect Only ({incorrectCount} to review)</option>
            </select>
          </div>
        </div>

        {/* Start Button */}
        <div className="w-full md:w-auto pt-1 md:pt-4">
          <button
            onClick={handleStartPractice}
            className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of All 8 Objectives (Light Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectivesStats.map((obj) => (
          <div
            key={obj.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600 font-mono">
                  Objective {obj.id}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {obj.totalQuestions} Questions
                </span>
              </div>

              <h3 className="font-semibold text-slate-900 text-sm">
                {obj.title}
              </h3>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>{obj.completed} / {obj.totalQuestions} completed</span>
                  <span className={obj.percentage >= 70 ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
                    {obj.completed > 0 ? `${obj.percentage}% Accuracy` : '0%'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${(obj.completed / obj.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Topics Pills */}
              <div className="pt-1 flex flex-wrap gap-1.5">
                {obj.topics.slice(0, 6).map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    {topic}
                  </span>
                ))}
                {obj.topics.length > 6 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                    +{obj.topics.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => navigate(`objectives/${obj.id}?filter=all`)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-200"
              >
                Practice All ({obj.totalQuestions})
              </button>
              <button
                onClick={() => navigate(`objectives/${obj.id}?filter=unanswered`)}
                className="py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors border border-slate-200"
              >
                Unanswered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

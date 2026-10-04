import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  X
} from 'lucide-react';
import {
  getAllObjectives,
  searchQuestions
} from '../services/questionService';
import {
  loadProgress,
  toggleQuestionBookmark
} from '../services/storageService';
import { HtmlContent } from '../components/HtmlContent';

const SUGGESTED_SEARCH_TERMS = [
  'provider',
  'state',
  'for_each',
  'count',
  'lifecycle',
  'module',
  'HCP Terraform',
  'Sentinel',
  'backend',
  'data source',
];

export function QuestionsPage({ navigate }) {
  const [query, setQuery] = useState('');
  const [selectedObjective, setSelectedObjective] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedMap, setExpandedMap] = useState({});

  const [progress, setProgress] = useState(loadProgress());

  const refreshProgress = () => setProgress(loadProgress());

  useEffect(() => {
    window.addEventListener('tf_progress_updated', refreshProgress);
    return () => window.removeEventListener('tf_progress_updated', refreshProgress);
  }, []);

  const allObjectives = getAllObjectives();
  const qMap = progress.questions || {};

  const options = {
    objectiveId: selectedObjective !== 'all' ? selectedObjective : null,
    examId: selectedExam !== 'all' ? selectedExam : null,
  };

  let results = searchQuestions(query, options);

  if (selectedType !== 'all') {
    if (selectedType === 'tf') {
      results = results.filter((q) => q.isTrueFalse);
    } else {
      results = results.filter((q) => q.type === selectedType);
    }
  }

  if (selectedStatus !== 'all') {
    results = results.filter((q) => {
      const stat = qMap[q.id];
      if (selectedStatus === 'bookmarked') return stat && stat.bookmarked;
      if (selectedStatus === 'unanswered') return !stat || stat.attempts === 0;
      if (selectedStatus === 'correct') return stat && stat.attempts > 0 && stat.lastIsCorrect;
      if (selectedStatus === 'incorrect') return stat && stat.attempts > 0 && !stat.lastIsCorrect;
      return true;
    });
  }

  const toggleExpand = (qId) => {
    setExpandedMap((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleToggleBookmark = (e, qId) => {
    e.stopPropagation();
    toggleQuestionBookmark(qId);
    refreshProgress();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Clean Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Question Search & Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Browse and search the entire 342-question repository by keyword, HCL block, or topic.
        </p>
      </div>

      {/* Search & Filters Container (Light Mode) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions (e.g., provider, state locking, for_each, backend)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Popular chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1">Topics:</span>
          {SUGGESTED_SEARCH_TERMS.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                query.toLowerCase() === term.toLowerCase()
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        {/* 4 Clean Filter Dropdowns */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <select
            value={selectedObjective}
            onChange={(e) => setSelectedObjective(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Objectives</option>
            {allObjectives.map((o) => (
              <option key={o.id} value={o.id}>
                Obj {o.id}: {o.shortTitle}
              </option>
            ))}
          </select>

          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All 6 Exams</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                Exam #{num}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="single">Single Choice</option>
            <option value="multi">Multi-Select</option>
            <option value="tf">True / False</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="correct">Mastered</option>
            <option value="incorrect">Incorrect</option>
            <option value="unanswered">Unanswered</option>
            <option value="bookmarked">Bookmarked</option>
          </select>
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>
          Showing <strong className="text-slate-900">{results.length}</strong> of 342 questions
        </span>
        {(query || selectedObjective !== 'all' || selectedExam !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedObjective('all');
              setSelectedExam('all');
              setSelectedType('all');
              setSelectedStatus('all');
            }}
            className="text-indigo-600 hover:text-indigo-800 text-xs font-sans font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Questions List (Light Mode) */}
      <div className="space-y-2.5">
        {results.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
            No questions match your query. Try clearing filters.
          </div>
        ) : (
          results.map((q) => {
            const isExpanded = Boolean(expandedMap[q.id]);
            const stat = qMap[q.id];
            const isBookmarked = stat && stat.bookmarked;

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 truncate">
                    <span className="font-mono font-semibold text-indigo-700 text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex-shrink-0">
                      {q.displayId}
                    </span>

                    <span className="text-slate-900 truncate font-medium">
                      {q.questionPlain || 'Question'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                      Obj {q.objective}
                    </span>

                    <button
                      onClick={(e) => handleToggleBookmark(e, q.id)}
                      className={`p-1 rounded transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-slate-600'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
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
                        const isCorrect = q.correctAnswers.includes(choice.id);

                        return (
                          <div
                            key={choice.id}
                            className={`p-2.5 rounded-lg border flex items-start gap-2.5 text-xs ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] border flex-shrink-0 mt-0.5 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {choice.id.toUpperCase()}
                            </span>
                            <div className="flex-1">
                              <HtmlContent html={choice.text} />
                            </div>
                            {isCorrect && (
                              <span className="text-[11px] text-emerald-700 font-mono font-semibold">
                                ✓ Correct
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
          })
        )}
      </div>
    </div>
  );
}

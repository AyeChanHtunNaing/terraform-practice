import React from 'react';

export function QuestionGrid({
  questions = [],
  currentIndex = 0,
  onSelectIndex,
  answers = {},
  flagged = {},
  isExamSubmitted = false,
}) {
  const total = questions.length;
  const answeredCount = questions.filter((q) => (answers[q.id] || []).length > 0).length;
  const flaggedCount = questions.filter((q) => flagged[q.id]).length;

  return (
    <div className="space-y-3.5">
      {/* Status counts */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-200">
        <span>Answered: <strong className="text-slate-900">{answeredCount}</strong> / {total}</span>
        {flaggedCount > 0 && (
          <span className="text-amber-600">Flagged: <strong>{flaggedCount}</strong></span>
        )}
      </div>

      {/* Grid of numbers */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-72 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = (answers[q.id] || []).length > 0;
          const isFlagged = flagged[q.id];

          let isCorrect = false;
          let isIncorrect = false;
          if (isExamSubmitted) {
            const userAns = answers[q.id] || [];
            isCorrect = userAns.length === q.correctAnswers.length &&
              q.correctAnswers.every((a) => userAns.includes(a));
            isIncorrect = !isCorrect && userAns.length > 0;
          }

          let btnClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900';

          if (isExamSubmitted) {
            if (isCorrect) {
              btnClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
            } else if (isIncorrect) {
              btnClass = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
            } else {
              btnClass = 'bg-slate-50/50 text-slate-400 border-slate-200';
            }
          } else if (isAnswered) {
            btnClass = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold';
          }

          if (isCurrent) {
            btnClass += ' ring-2 ring-indigo-600 border-indigo-600 bg-white text-indigo-900 font-bold';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(idx)}
              className={`relative h-8 rounded-lg border text-xs flex items-center justify-center transition-colors ${btnClass}`}
              title={`${q.displayId}: ${isAnswered ? 'Answered' : 'Unanswered'}${isFlagged ? ' (Flagged)' : ''}`}
            >
              <span>{idx + 1}</span>

              {isFlagged && !isExamSubmitted && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-indigo-100 border border-indigo-300" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-slate-50 border border-slate-200" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded ring-1 ring-indigo-600 border border-indigo-600" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}

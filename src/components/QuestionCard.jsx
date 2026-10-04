import React, { useEffect } from 'react';
import { Bookmark, CheckCircle2, XCircle, ExternalLink, HelpCircle, Check } from 'lucide-react';
import { HtmlContent } from './HtmlContent';

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswers = [],
  onSelectAnswer,
  isSubmitted = false,
  showExplanation = false,
  isBookmarked = false,
  onToggleBookmark,
  mode = 'practice',
}) {
  if (!question) return null;

  const isMulti = question.type === 'multi' || question.correctAnswers.length > 1;
  const numToSelect = question.correctAnswers.length;

  const isCorrect = isSubmitted &&
    selectedAnswers.length === question.correctAnswers.length &&
    question.correctAnswers.every((a) => selectedAnswers.includes(a));

  const handleChoiceClick = (choiceId) => {
    if (isSubmitted && mode === 'review') return;

    if (isMulti) {
      if (selectedAnswers.includes(choiceId)) {
        onSelectAnswer(selectedAnswers.filter((id) => id !== choiceId));
      } else {
        onSelectAnswer([...selectedAnswers, choiceId]);
      }
    } else {
      onSelectAnswer([choiceId]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const index = alphabet.indexOf(key);

      if (index >= 0 && index < question.choices.length) {
        const choice = question.choices[index];
        if (choice) {
          handleChoiceClick(choice.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, selectedAnswers, isSubmitted, mode]);

  const getChoiceLabel = (id) => id.toUpperCase();

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Clean Top Bar */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-sm gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 truncate">
          <span className="font-semibold text-indigo-600 font-mono flex-shrink-0">
            Obj {question.objective}
          </span>
          <span className="text-slate-300 flex-shrink-0">•</span>
          <span className="text-slate-800 font-medium truncate">
            {question.objectiveName}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="font-mono text-slate-600 text-[11px] sm:text-xs bg-slate-100 px-2 sm:px-2.5 py-0.5 rounded border border-slate-200 font-semibold">
            {question.displayId}
          </span>

          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(question.id)}
              className={`p-1.5 rounded-md transition-colors ${
                isBookmarked
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        {/* Question Counter & Multi-select Hint */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          {questionIndex !== undefined && totalQuestions !== undefined && (
            <span className="text-slate-600 font-mono">
              Question <strong className="text-slate-900 text-sm sm:text-base">{questionIndex}</strong> of {totalQuestions}
            </span>
          )}

          {isMulti && (
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-[11px] sm:text-xs tracking-wide">
              Select {numToSelect} answers {selectedAnswers.length > 0 && `(${selectedAnswers.length}/${numToSelect})`}
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <div className="text-base sm:text-xl text-slate-900 font-medium leading-relaxed break-words">
          <HtmlContent html={question.question} />
        </div>

        {/* Choices List */}
        <div className="space-y-3 pt-1">
          {question.choices.map((choice) => {
            const isSelected = selectedAnswers.includes(choice.id);
            const isCorrectAnswer = question.correctAnswers.includes(choice.id);

            let rowStyle = 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800';
            let badgeStyle = 'border-slate-200 bg-slate-100 text-slate-700';

            if (isSubmitted) {
              if (isCorrectAnswer) {
                rowStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isCorrectAnswer) {
                rowStyle = 'border-rose-400 bg-rose-50/80 text-rose-950';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                rowStyle = 'border-slate-200/60 bg-slate-50/40 text-slate-400 opacity-70';
                badgeStyle = 'border-slate-200 bg-slate-100 text-slate-400';
              }
            } else if (isSelected) {
              rowStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500';
              badgeStyle = 'bg-indigo-600 text-white border-indigo-600';
            }

            return (
              <div
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id)}
                className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4.5 rounded-xl border cursor-pointer transition-colors ${rowStyle}`}
              >
                {/* Letter indicator */}
                <span
                  className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-xs font-bold border flex-shrink-0 mt-0.5 transition-colors ${badgeStyle}`}
                >
                  {isSubmitted && isCorrectAnswer ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    getChoiceLabel(choice.id)
                  )}
                </span>

                {/* Choice Text */}
                <div className="flex-1 text-base sm:text-lg leading-relaxed pt-0.5 break-words">
                  <HtmlContent html={choice.text} />
                </div>

                {/* Selection checkbox/radio indicator */}
                <div className="flex-shrink-0 pt-1.5">
                  <div
                    className={`w-4.5 h-4.5 rounded-${isMulti ? 'md' : 'full'} border flex items-center justify-center transition-colors ${
                      isSelected
                        ? isSubmitted
                          ? isCorrectAnswer
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'bg-rose-600 border-rose-600'
                          : 'bg-indigo-600 border-indigo-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className={`w-2 h-2 bg-white rounded-${isMulti ? 'xs' : 'full'}`} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation & Feedback (When Submitted / Instant Feedback) */}
        {isSubmitted && (
          <div className="pt-6 border-t border-slate-200 space-y-4">
            {/* Status bar */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 text-sm sm:text-base ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold">
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
                <p className="text-sm text-slate-700">
                  <span className="text-slate-500">Your answer: </span>
                  <span className={isCorrect ? 'text-emerald-800 font-semibold' : 'text-rose-800 font-semibold'}>
                    {selectedAnswers.length > 0
                      ? selectedAnswers.map((a) => getChoiceLabel(a)).join(', ')
                      : 'None'}
                  </span>
                  {!isCorrect && (
                    <>
                      <span className="text-slate-300 mx-2">•</span>
                      <span className="text-slate-500">Correct: </span>
                      <span className="text-emerald-800 font-semibold">
                        {question.correctAnswers.map((a) => getChoiceLabel(a)).join(', ')}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Explanation text */}
            {question.explanation && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5 text-sm leading-relaxed text-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Explanation</span>
                </div>
                <HtmlContent html={question.explanation} />

                {question.links && question.links.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2.5">
                    {question.links.map((link, idx) => {
                      const match = link.match(/\[(.*?)\]\((.*?)\)/);
                      const title = match ? match[1] : 'Official Documentation';
                      const url = match ? match[2] : '#';
                      return (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 underline font-medium"
                        >
                          <span>{title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

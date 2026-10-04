import React, { useState, useEffect } from 'react';
import {
  Layers,
  Play,
  ChevronRight
} from 'lucide-react';
import { getQuestionsByExam } from '../services/questionService';
import { loadProgress } from '../services/storageService';

export function ExamsPage({ navigate }) {
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    const handleUpdate = () => setProgress(loadProgress());
    window.addEventListener('tf_progress_updated', handleUpdate);
    return () => window.removeEventListener('tf_progress_updated', handleUpdate);
  }, []);

  const exams = [1, 2, 3, 4, 5, 6].map((num) => {
    const questions = getQuestionsByExam(num);
    const attempts = (progress.examAttempts || []).filter(
      (a) => a.examNumber === num && a.mode === 'full-exam'
    );
    const bestAttempt = attempts.reduce(
      (best, cur) => (!best || cur.percentage > best.percentage ? cur : best),
      null
    );
    const latestAttempt = attempts[0] || null;

    return {
      num,
      title: `Practice Exam #${num}`,
      questionCount: questions.length, // 57
      attemptsCount: attempts.length,
      bestAttempt,
      latestAttempt,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Full Practice Exams
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          6 complete practice exams containing 57 questions each (342 total), designed to mirror the HashiCorp certification exam.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => {
          const hasAttempted = exam.attemptsCount > 0;
          const isPassed = exam.bestAttempt && exam.bestAttempt.passed;

          return (
            <div
              key={exam.num}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between transition-colors space-y-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center border border-indigo-200">
                    #{exam.num}
                  </span>

                  {hasAttempted ? (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isPassed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isPassed ? 'Passed' : 'Needs Retake'}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Untested
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {exam.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                    <span>{exam.questionCount} Questions</span>
                    <span className="text-slate-300">•</span>
                    <span>60 Mins</span>
                  </div>
                </div>

                {hasAttempted && exam.bestAttempt && (
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Best Score:</span>
                    <span className={`font-semibold ${isPassed ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {exam.bestAttempt.score}/{exam.bestAttempt.total} ({exam.bestAttempt.percentage}%)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate(`exams/${exam.num}`)}
                  className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{hasAttempted ? 'Retake Exam' : 'Start Exam'}</span>
                </button>

                {hasAttempted && exam.latestAttempt && (
                  <button
                    onClick={() => navigate(`results/${exam.latestAttempt.id}`)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center justify-center gap-1 transition-colors border border-slate-200"
                  >
                    <span>View Last Result</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, X } from 'lucide-react';
import { integrityCheckResult } from '../services/questionService';

export function DataIntegrityStatus() {
  const [showModal, setShowModal] = useState(false);
  const { isValid, errors, stats } = integrityCheckResult;

  if (!isValid) {
    return (
      <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-lg text-xs">
        Data integrity check failed: {errors.length} errors found.
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-medium transition-colors cursor-pointer"
        title="View Question Bank Data Integrity Report"
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>342 Questions Verified</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-5 shadow-xl relative space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Data Integrity Report
                </h3>
                <p className="text-[11px] text-slate-500">
                  HashiCorp Terraform Associate 004
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-500 font-sans">Total Question Bank:</span>
                <span className="text-emerald-700 font-bold">{stats.totalQuestions} Questions ✓</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-500 font-sans">Exams (6 × 57 Qs):</span>
                <span className="text-emerald-700 font-bold">57 Qs Each ✓</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-500 font-sans">Objectives Covered:</span>
                <span className="text-emerald-700 font-bold">8 Objectives ✓</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-500 font-sans">Single Choice:</span>
                <span className="text-slate-900">{stats.singleChoiceCount} Qs</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-500 font-sans">Multi-Select:</span>
                <span className="text-indigo-700">{stats.multiSelectCount} Qs</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

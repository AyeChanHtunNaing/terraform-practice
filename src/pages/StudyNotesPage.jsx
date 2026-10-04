import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Compass
} from 'lucide-react';
import { MYANMAR_OBJECTIVE_NOTES } from '../data/myanmarNotes';

export function StudyNotesPage({ navigate }) {
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const activeObjective = useMemo(() => {
    return (
      MYANMAR_OBJECTIVE_NOTES.find((obj) => obj.id === selectedObjectiveId) ||
      MYANMAR_OBJECTIVE_NOTES[0]
    );
  }, [selectedObjectiveId]);

  // Search filtering across all objectives
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();

    const matches = [];
    MYANMAR_OBJECTIVE_NOTES.forEach((obj) => {
      const matchedSections = obj.sections.filter(
        (sec) =>
          sec.heading.toLowerCase().includes(query) ||
          sec.explanation.toLowerCase().includes(query) ||
          sec.keyPoints.some((p) => p.toLowerCase().includes(query)) ||
          (sec.codeSnippet && sec.codeSnippet.toLowerCase().includes(query))
      );

      const matchedTips = obj.examTips.filter((tip) =>
        tip.toLowerCase().includes(query)
      );

      if (
        matchedSections.length > 0 ||
        matchedTips.length > 0 ||
        obj.title.toLowerCase().includes(query) ||
        obj.titleMy.toLowerCase().includes(query)
      ) {
        matches.push({
          objective: obj,
          matchedSections,
          matchedTips,
        });
      }
    });

    return matches;
  }, [searchQuery]);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(id);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/50 border border-indigo-100 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Terraform Associate 004 — စာမေးပွဲပြင်ဆင်ရေး မှတ်စု</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              Objective ၁ မှ ၈ အထိ မြန်မာဘာသာ အပြည့်အစုံ ရှင်းလင်းချက်
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              HashiCorp Terraform Associate (004) စာမေးပွဲ၏ အဓိက Objectives ၈ ခုလုံးတွင် ပါဝင်သော
              သဘောတရားများ၊ အမေးများသော မေးခွန်းပုံစံများနှင့် စာမေးပွဲအတွက် အထူးမှတ်သားရန် Key Points များကို
              မြန်မာလို လွယ်ကူရှင်းလင်းစွာ လေ့လာနိုင်ရန် စုစည်းပေးထားပါသည်။
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={() => navigate(`objectives/${selectedObjectiveId}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Objective မေးခွန်းများ ဖြေဆိုရန်</span>
            </button>
          </div>
        </div>

        {/* Search bar inside notes */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="မှတ်စုထဲမှ ရှာရန် (ဥပမာ- Declarative, Sentinel, for_each, Locking, TF_LOG)..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {searchResults ? (
        /* Search Results View */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              "{searchQuery}" အတွက် တွေ့ရှိသော ရလဒ်များ (Objectives {searchResults.length} ခု တွေ့ရှိသည်)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-indigo-600 hover:underline font-medium"
            >
              ပုံမှန် ကြည့်ရှုမှုသို့ ပြန်သွားရန်
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-xs text-slate-500 space-y-2">
              <p>မည်သည့် အချက်အလက်မျှ ရှာမတွေ့ပါ။ အခြား စကားလုံးဖြင့် ထပ်မံ ရှာဖွေကြည့်ပါ။</p>
            </div>
          ) : (
            searchResults.map(({ objective, matchedSections, matchedTips }) => (
              <div
                key={objective.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center">
                      #{objective.id}
                    </span>
                    <h2 className="font-bold text-slate-900 text-base">
                      {objective.titleMy}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedObjectiveId(objective.id);
                    }}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    Objective {objective.id} အပြည့်အစုံ ကြည့်ရန် →
                  </button>
                </div>

                <div className="space-y-4">
                  {matchedSections.map((sec, idx) => (
                    <div key={idx} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-2">
                      <h3 className="font-bold text-slate-900 text-sm">{sec.heading}</h3>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{sec.explanation}</p>
                      <ul className="space-y-1 pt-1">
                        {sec.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-indigo-500 mt-1">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {matchedTips.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                      <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>စာမေးပွဲအတွက် အထူးမှတ်သားရန် (Exam Tips)</span>
                      </h4>
                      <ul className="space-y-1">
                        {matchedTips.map((tip, tIdx) => (
                          <li key={tIdx} className="text-xs text-amber-950 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Regular Objective Tabs & Reader */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation: Objective Selector Buttons (Tabs) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs space-y-1.5 sticky top-20">
            <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Objectives မာတိကာ (၁ – ၈)
            </div>

            {MYANMAR_OBJECTIVE_NOTES.map((obj) => {
              const isSelected = obj.id === selectedObjectiveId;

              return (
                <button
                  key={obj.id}
                  onClick={() => {
                    setSelectedObjectiveId(obj.id);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {obj.id}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {obj.shortTitle}
                      </span>
                      <span
                        className={`text-[10px] font-mono flex-shrink-0 px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-white/20 text-indigo-100' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {obj.questionCount} Qs
                      </span>
                    </div>
                    <p
                      className={`text-[11px] line-clamp-1 mt-0.5 leading-snug ${
                        isSelected ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {obj.titleMy}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Reader Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Objective Title Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                    #{activeObjective.id}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 font-mono uppercase tracking-wider block">
                      Objective {activeObjective.id}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                      {activeObjective.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`objectives/${activeObjective.id}`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
                >
                  <span>Practice ({activeObjective.questionCount} Qs)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Myanmar Summary Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <span className="text-indigo-700 font-bold block mb-1">အကျဉ်းချုပ် - </span>
                {activeObjective.summaryMy}
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-6 pt-2">
                {activeObjective.sections.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white space-y-3 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>{section.heading}</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {section.explanation}
                    </p>

                    {/* Key Points */}
                    {section.keyPoints && section.keyPoints.length > 0 && (
                      <div className="bg-slate-50/80 rounded-xl p-3.5 space-y-2 border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          အဓိက မှတ်သားရန် အချက်များ:
                        </span>
                        <ul className="space-y-1.5">
                          {section.keyPoints.map((point, pIdx) => (
                            <li
                              key={pIdx}
                              className="text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 leading-relaxed"
                            >
                              <span className="text-indigo-600 font-bold mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Optional Code Snippet */}
                    {section.codeSnippet && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                          <span>HCL Example</span>
                          <button
                            onClick={() => handleCopyCode(section.codeSnippet, `${sIdx}-code`)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                          >
                            {copiedCodeIndex === `${sIdx}-code` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-slate-900 text-slate-100 p-3.5 sm:p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                          <code>{section.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Exam Tips Box */}
              {activeObjective.examTips && activeObjective.examTips.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/90 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>စာမေးပွဲအတွက် အထူးမှတ်သားရန် Tips (Exam Question Patterns)</span>
                  </div>

                  <p className="text-xs text-amber-800 leading-relaxed">
                    အောက်ပါအချက်များသည် ပေးထားသော Practice Exams ၆ ခု (မေးခွန်း ၃၄၂ ခု) ထဲတွင် မကြာခဏ အမေးများဆုံး ထောင်ချောက် (Exam Traps) များနှင့် အရေးကြီးသော Point များ ဖြစ်သည်:
                  </p>

                  <ul className="space-y-2 pt-1">
                    {activeObjective.examTips.map((tip, tipIdx) => (
                      <li
                        key={tipIdx}
                        className="text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 bg-white/70 p-3 rounded-xl border border-amber-200/60 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bottom Navigation between Objectives */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                {activeObjective.id > 1 ? (
                  <button
                    onClick={() => {
                      setSelectedObjectiveId(activeObjective.id - 1);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    ← Objective {activeObjective.id - 1} သို့
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => navigate(`objectives/${activeObjective.id}`)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Objective {activeObjective.id} မေးခွန်းများ စတင်လေ့ကျင့်ရန် ({activeObjective.questionCount} Qs) →
                </button>

                {activeObjective.id < 8 ? (
                  <button
                    onClick={() => {
                      setSelectedObjectiveId(activeObjective.id + 1);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    Objective {activeObjective.id + 1} သို့ →
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

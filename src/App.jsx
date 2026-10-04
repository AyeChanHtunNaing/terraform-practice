import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ExamsPage } from './pages/ExamsPage';
import { ExamPracticePage } from './pages/ExamPracticePage';
import { ObjectivesPage } from './pages/ObjectivesPage';
import { ObjectivePracticePage } from './pages/ObjectivePracticePage';
import { RandomPracticePage } from './pages/RandomPracticePage';
import { IncorrectReviewPage } from './pages/IncorrectReviewPage';
import { ResultsPage } from './pages/ResultsPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { applyTheme } from './services/storageService';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash());

  function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'dashboard';
  }

  useEffect(() => {
    applyTheme();

    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route) => {
    window.location.hash = `#/${route}`;
  };

  const renderCurrentPage = () => {
    const [pathWithQuery] = currentRoute.split('?');
    const path = pathWithQuery.replace(/^\/+|\/+$/g, '');
    const searchParams = Object.fromEntries(new URLSearchParams(currentRoute.split('?')[1] || '').entries());

    if (path.startsWith('exams/')) {
      const examId = path.split('/')[1];
      return <ExamPracticePage examId={examId} navigate={navigate} />;
    }

    if (path === 'exams') {
      return <ExamsPage navigate={navigate} />;
    }

    if (path.startsWith('objectives/')) {
      const objId = path.split('/')[1];
      return <ObjectivePracticePage objectiveId={objId} searchParams={searchParams} navigate={navigate} />;
    }

    if (path === 'objectives') {
      return <ObjectivesPage navigate={navigate} />;
    }

    if (path === 'random' || path === 'practice/random') {
      return <RandomPracticePage navigate={navigate} />;
    }

    if (path === 'review') {
      return <IncorrectReviewPage navigate={navigate} />;
    }

    if (path.startsWith('results/')) {
      const attemptId = path.split('/')[1];
      return <ResultsPage attemptId={attemptId} navigate={navigate} />;
    }

    if (path === 'questions') {
      return <QuestionsPage navigate={navigate} />;
    }

    return <Dashboard navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors">
      <Navbar activeRoute={currentRoute} navigate={navigate} />

      <main className="flex-1 pb-16">
        {renderCurrentPage()}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
          <div>
            HashiCorp Terraform Associate (004) Practice Platform • 342 Questions
          </div>
          <div className="text-slate-400">
            Offline-Ready Local Storage
          </div>
        </div>
      </footer>
    </div>
  );
}

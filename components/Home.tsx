
import React from 'react';
import { AppState, AppSection } from '../types';

interface HomeProps {
  state: AppState;
  onNavigate: (section: AppSection) => void;
}

const Home: React.FC<HomeProps> = ({ state, onNavigate }) => {
  const issuesTotalCount = state.issues.length;
  const isPhase1Done = state.progress.simplifiedPrayerFinished;
  const categoriesCompleted = state.categories.filter(c => c.isCompleted).length;
  const isPhase2Done = categoriesCompleted >= 18;

  // Determine the dynamic primary action destination
  const getPrimaryAction = () => {
    if (!isPhase1Done) {
      if (issuesTotalCount === 0) return { label: 'Begin Phase 1', section: AppSection.ISSUE_TRACKER };
      return { label: 'Resume Phase 1', section: AppSection.SIMPLIFIED_PRAYER };
    }
    if (!isPhase2Done) return { label: 'Resume Phase 2', section: AppSection.LIST_PREP };
    return { label: 'Begin Final Phase', section: AppSection.DEEP_PRAYER };
  };

  const action = getPrimaryAction();

  const StatusBadge = ({ status }: { status: 'Complete' | 'In Progress' | 'Locked' | 'Ready' }) => {
    const styles = {
      'Complete': 'bg-emerald-100 text-emerald-700',
      'In Progress': 'bg-amber-100 text-amber-700',
      'Locked': 'bg-slate-100 text-slate-400',
      'Ready': 'bg-indigo-100 text-indigo-700'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      {/* HEADER SECTION */}
      <div className="text-center pt-8 md:pt-12">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 serif-font tracking-tight">
          Welcome Home.
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium mt-6 leading-relaxed">
          A guided path to walk out the freedom Christ has for you.
        </p>
      </div>

      {/* SECTION A: HOW TO WALK THIS OUT (STATIC INFOGRAPHIC) */}
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 serif-font">How to Walk This Out</h2>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mt-2">The Three-Step Process</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-4">
          {/* Connector lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-slate-200 -z-10"></div>
          
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto border border-indigo-100 shadow-inner">1</div>
            <h4 className="font-bold text-slate-900 text-xl">Identify</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Name the struggles and symptoms clearly in your life.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto border border-indigo-100 shadow-inner">2</div>
            <h4 className="font-bold text-slate-900 text-xl">Prepare</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Systematically find the roots using the 18-category inventory.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto border border-indigo-100 shadow-inner">3</div>
            <h4 className="font-bold text-slate-900 text-xl">Freedom</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Break agreements, repent, and receive lasting peace.</p>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => onNavigate(action.section)}
            className="group relative px-16 py-7 bg-indigo-600 text-white rounded-[2.5rem] font-bold text-2xl shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-4 border-4 border-indigo-500/50"
          >
            {action.label}
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>

      {/* SECTION B: ACTIONABLE ROADMAP */}
      <div className="max-w-2xl mx-auto space-y-8 relative pt-16 border-t border-slate-200">
        <div className="absolute left-[27px] top-[120px] bottom-[100px] w-1 bg-slate-100 -z-0"></div>
        
        {/* Phase 1 Card */}
        <div className="flex gap-6 items-start relative group">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg z-10 transition-all ${isPhase1Done ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-600 border border-slate-100'}`}>
            {isPhase1Done ? '✓' : '1'}
          </div>
          <div 
            onClick={() => onNavigate(AppSection.ISSUE_TRACKER)}
            className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-300 transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Phase 1: The Start</h4>
              <StatusBadge status={isPhase1Done ? 'Complete' : issuesTotalCount > 0 ? 'In Progress' : 'Ready'} />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Identify your struggles and receive immediate initial relief prayer.</p>
            <span className="text-xs font-bold text-indigo-600 group-hover:underline">Open Phase →</span>
          </div>
        </div>
        
        {/* Phase 2 Card */}
        <div className={`flex gap-6 items-start relative ${!isPhase1Done ? 'opacity-60' : 'group'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg z-10 transition-all ${!isPhase1Done ? 'bg-slate-100 text-slate-400' : isPhase2Done ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-600 border border-slate-100'}`}>
            {!isPhase1Done ? '🔒' : isPhase2Done ? '✓' : '2'}
          </div>
          <div 
            onClick={() => isPhase1Done && onNavigate(AppSection.LIST_PREP)}
            className={`flex-1 p-8 rounded-[2rem] border shadow-sm transition-all ${!isPhase1Done ? 'bg-slate-50 border-slate-100 cursor-not-allowed' : 'bg-white border-slate-100 cursor-pointer hover:border-indigo-300 hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Phase 2: The Roots</h4>
              <StatusBadge status={!isPhase1Done ? 'Locked' : isPhase2Done ? 'Complete' : categoriesCompleted > 0 ? 'In Progress' : 'Ready'} />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">A deep inventory across 18 categories to locate specific spiritual roots.</p>
            {isPhase1Done ? <span className="text-xs font-bold text-indigo-600 group-hover:underline">Open Phase →</span> : <span className="text-xs font-bold text-slate-400 italic">Complete Phase 1 to unlock</span>}
          </div>
        </div>
        
        {/* Phase 3 Card */}
        <div className={`flex gap-6 items-start relative ${!isPhase2Done ? 'opacity-60' : 'group'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg z-10 transition-all ${!isPhase2Done ? 'bg-slate-100 text-slate-400' : 'bg-white text-indigo-600 border border-slate-100'}`}>
            {!isPhase2Done ? '🔒' : '3'}
          </div>
          <div 
            onClick={() => isPhase2Done && onNavigate(AppSection.DEEP_PRAYER)}
            className={`flex-1 p-8 rounded-[2rem] border shadow-sm transition-all ${!isPhase2Done ? 'bg-slate-50 border-slate-100 cursor-not-allowed' : 'bg-white border-slate-100 cursor-pointer hover:border-indigo-300 hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight">Phase 3: The Freedom</h4>
              <StatusBadge status={!isPhase2Done ? 'Locked' : 'Ready'} />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">The final Prayer Journey and Deep Clean for lasting restoration.</p>
            {isPhase2Done ? <span className="text-xs font-bold text-indigo-600 group-hover:underline">Open Phase →</span> : <span className="text-xs font-bold text-slate-400 italic">Complete Phase 2 to unlock</span>}
          </div>
        </div>
      </div>

      <div className="text-center pt-12 pb-8">
        <p className="text-slate-400 text-sm italic font-medium">
          "Stand fast therefore in the liberty by which Christ has made us free." <br/> — Galatians 5:1
        </p>
      </div>
    </div>
  );
};

export default Home;

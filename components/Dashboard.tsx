import React from 'react';
import { AppState, AppSection } from '../types';

interface DashboardProps {
  state: AppState;
  onNavigate: (section: AppSection) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      
      {/* HERO SECTION - Warm & Inviting */}
      <div className="relative text-center py-16 md:py-24">
        {/* Soft Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100 to-white rounded-full blur-3xl -z-10 pointer-events-none opacity-60"></div>
        
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 serif-font tracking-tight leading-tight">
            Welcome <br/> 
            <span className="text-indigo-600">Home.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            You are not here by accident. This is a safe space to lay down your burdens and walk into the freedom Christ has purchased for you.
          </p>

          <div className="pt-8">
            <button 
              // Fix: Changed AppSection.INSTRUCTIONS to AppSection.ISSUE_TRACKER as INSTRUCTIONS is not defined in AppSection
              onClick={() => onNavigate(AppSection.ISSUE_TRACKER)}
              className="group relative px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Begin the Journey
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK OVERVIEW TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        <div onClick={() => onNavigate(AppSection.ISSUE_TRACKER)} className="cursor-pointer group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            ⚖️
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">Identify</h3>
          <p className="text-slate-500 text-sm">Locate the symptoms and roots.</p>
        </div>

        <div onClick={() => onNavigate(AppSection.LIST_PREP)} className="cursor-pointer group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            📝
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">Prepare</h3>
          <p className="text-slate-500 text-sm">Bring everything into the light.</p>
        </div>

        <div onClick={() => onNavigate(AppSection.DEEP_PRAYER)} className="cursor-pointer group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🕊️
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">Renounce</h3>
          <p className="text-slate-500 text-sm">Break agreements & find peace.</p>
        </div>

      </div>

      <div className="text-center pt-8">
        <p className="text-slate-400 text-sm italic font-medium">"Stand fast therefore in the liberty by which Christ has made us free." <br/> Galatians 5:1</p>
      </div>

    </div>
  );
};

export default Dashboard;
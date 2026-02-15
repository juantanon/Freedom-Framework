import React from 'react';
import { AppSection } from '../types';

interface InstructionsProps {
  onNavigate: (section: AppSection) => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 animate-in slide-in-from-bottom-4 duration-700 pb-24 max-w-4xl mx-auto">
      
      {/* HEADER SECTION */}
      <header className="text-center space-y-4 pt-4">
         <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-indigo-100">The Framework</span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 serif-font tracking-tight">
          Closer to Jesus
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          This application is designed to help you remove the obstacles standing between you and the abundant life God promised.
        </p>
      </header>

      {/* ENCOURAGEMENT CARD (Replaced the "Relationship Over Ritual" card) */}
      <div className="bg-gradient-to-b from-white to-indigo-50/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-indigo-100/20 relative overflow-hidden text-center">
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-indigo-100 text-indigo-600 border border-slate-50">
            ✝️
          </div>
          
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-2xl font-bold serif-font text-slate-800">A Companion, Not a Checklist</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              We know that true freedom doesn't come from an app; it comes from <strong className="text-indigo-600">Jesus Christ</strong>. 
            </p>
            <p className="text-slate-600 leading-relaxed">
              Think of this tool as a journal to help you focus, organize your thoughts, and bring them before the Lord. 
              As you use each section, pause and invite the Holy Spirit to lead you. There is no rush. 
              He is faithful to complete the work He has started in you.
            </p>
          </div>
        </div>
      </div>

      {/* THE GUIDED PATH */}
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">How to Walk This Out</h3>
          <p className="text-slate-400 text-sm">Follow these steps in order for the best experience.</p>
        </div>

        {/* STEP 1: DIAGNOSIS */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start group">
          <div className="hidden md:flex flex-col items-center pt-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-xl flex items-center justify-center shadow-sm text-indigo-600 font-bold z-10 relative">
              1
            </div>
            <div className="h-32 w-0.5 bg-slate-100 mt-4"></div>
          </div>
          
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
             <div className="flex items-center gap-3 mb-2 md:hidden">
               <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">1</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identify</span>
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚖️</span> The Issue Tracker
             </h4>
             <p className="text-slate-600 mb-4">
               We start by simply naming the struggle. Whether it's anxiety, anger, or a specific pattern of sin, we write it down.
               We've included a prayer in this section to help you ask God to reveal the root causes.
             </p>
             <button onClick={() => onNavigate(AppSection.ISSUE_TRACKER)} className="text-indigo-600 font-bold text-sm hover:underline">Go to Issue Tracker →</button>
          </div>
        </div>

        {/* STEP 2: PREPARATION */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start group">
          <div className="hidden md:flex flex-col items-center pt-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-xl flex items-center justify-center shadow-sm text-indigo-600 font-bold z-10 relative">
              2
            </div>
            <div className="h-32 w-0.5 bg-slate-100 mt-4"></div>
          </div>
          
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
             <div className="flex items-center gap-3 mb-2 md:hidden">
               <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">2</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prepare</span>
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📝</span> List Preparation
             </h4>
             <p className="text-slate-600 mb-4">
               This is where we do business with God. We systematically go through categories (unforgiveness, agreements, etc.) and list specific names and events.
               The app provides a timer to help you wait on the Lord to bring things to memory.
             </p>
             <button onClick={() => onNavigate(AppSection.LIST_PREP)} className="text-indigo-600 font-bold text-sm hover:underline">Go to List Prep →</button>
          </div>
        </div>

        {/* STEP 3: PRAYER */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start group">
          <div className="hidden md:flex flex-col items-center pt-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-xl flex items-center justify-center shadow-sm text-indigo-600 font-bold z-10 relative">
              3
            </div>
          </div>
          
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
             <div className="flex items-center gap-3 mb-2 md:hidden">
               <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">3</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Freedom</span>
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🕊️</span> Prayer Journey
             </h4>
             <p className="text-slate-600 mb-4">
               Finally, we take our lists into the courtroom of Heaven. We use the <strong>Simplified Prayer</strong> for immediate relief, and the <strong>Deep Prayers</strong> for lasting freedom.
             </p>
             <button onClick={() => onNavigate(AppSection.DEEP_PRAYER)} className="text-indigo-600 font-bold text-sm hover:underline">Go to Prayers →</button>
          </div>
        </div>

      </div>

      {/* FINAL CALL TO ACTION */}
      <div className="text-center pt-8">
        <button 
          onClick={() => onNavigate(AppSection.ISSUE_TRACKER)}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-xl shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
        >
          <span>Start with Step 1</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

    </div>
  );
};

export default Instructions;
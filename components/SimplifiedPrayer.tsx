
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, AppSection } from '../types';

interface SimplifiedPrayerProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onNavigate: (section: AppSection) => void;
}

const SimplifiedPrayer: React.FC<SimplifiedPrayerProps> = ({ state, updateState, onNavigate }) => {
  const [step, setStep] = useState(1);

  // Mark Phase 1 Start when reaching Step 2
  useEffect(() => {
    if (step === 2 && !state.progress.simplifiedPrayerStarted) {
      updateState(s => ({
        ...s,
        progress: { ...s.progress, simplifiedPrayerStarted: true },
        lastActivity: {
          label: "Started Phase 1 Personalized Prayer",
          section: AppSection.SIMPLIFIED_PRAYER,
          timestamp: new Date().toISOString()
        }
      }));
    }
  }, [step, state.progress.simplifiedPrayerStarted, updateState]);

  const joinedIssues = useMemo(() => {
    return state.issues.length > 0 
      ? state.issues.map(i => i.description).join(", ") 
      : "these struggles";
  }, [state.issues]);

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-12 px-4 max-w-lg mx-auto">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`flex flex-col items-center gap-2 ${i === step ? 'text-indigo-600' : i < step ? 'text-emerald-500' : 'text-slate-300'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${i === step ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : i < step ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
            {i < step ? '✓' : i}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-center font-sans">
            {i === 1 && "Invite"}
            {i === 2 && "Repent"}
            {i === 3 && "Pillars"}
            {i === 4 && "The Shift"}
          </span>
        </div>
      ))}
    </div>
  );

  const handleFinish = () => {
    updateState(s => ({
      ...s,
      progress: { ...s.progress, simplifiedPrayerFinished: true },
      lastActivity: {
        label: "Unlocked Phase 2: The Roots",
        section: AppSection.HOME,
        timestamp: new Date().toISOString()
      }
    }));
    onNavigate(AppSection.HOME);
  };

  const DeclarationCard = ({ title, text }: { title: string, text: string }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center space-y-4 text-center hover:border-indigo-200 transition-all">
      <h4 className="font-bold text-indigo-700 uppercase tracking-widest text-xs border-b border-indigo-50 pb-2">{title}</h4>
      <p className="serif-font italic text-slate-700 leading-relaxed text-lg">"{text}"</p>
    </div>
  );

  return (
    <div className="pb-32 space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <header className="flex justify-between items-start">
        <div>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Phase 1: The Start</span>
          <h2 className="text-3xl font-bold text-slate-900 serif-font mt-2">Personalized Prayer</h2>
          <p className="text-slate-500">Bringing your specific struggles into the presence of God.</p>
        </div>
        <button 
          onClick={() => onNavigate(AppSection.HOME)}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
        >
          ← Home
        </button>
      </header>

      <StepIndicator />

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-2xl min-h-[500px] flex flex-col justify-center relative overflow-hidden">
        
        {/* STEP 1: INVITE */}
        {step === 1 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-indigo-100">✝️</div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-slate-800">Invite God In</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Before we begin, quiet your mind and posture your heart. Read this aloud:</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-inner">
              <p className="serif-font text-2xl text-slate-800 leading-relaxed italic">
                "Lord, I come before You now. Search me, O God, and know my heart. Show me the specific areas where I need freedom today."
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: DYNAMIC REPENTANCE */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-300 text-center">
             <div className="space-y-4">
               <h3 className="text-3xl font-bold text-slate-800">Step 2: Repentance</h3>
               <p className="text-slate-600 text-lg">Bringing your identified struggles to light. Read this aloud:</p>
             </div>
             <div className="bg-indigo-900 text-indigo-50 p-10 rounded-[2.5rem] shadow-2xl">
              <p className="serif-font text-2xl leading-relaxed italic">
                "Lord, I bring <span className="text-indigo-300 underline decoration-indigo-400 decoration-2 underline-offset-4 font-bold">{joinedIssues}</span> to You. I repent of any sin connected to these areas and I ask for Your peace to replace this pain."
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: THE 4 PILLARS (STATIC CARDS) */}
        {step === 3 && (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-300">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-slate-800">Step 3: The 4 Pillars</h3>
              <p className="text-slate-600 text-lg font-medium">Read these four declarations aloud to cover major areas of spiritual struggle.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DeclarationCard 
                title="Unforgiveness" 
                text="Father, I choose to forgive everyone who has hurt me, disappointed me, or abandoned me. I release all bitterness and judgment. I ask You to bless them, and I choose to be free from the weight of offense." 
              />
              <DeclarationCard 
                title="Sexual Sin" 
                text="Lord, I repent of all sexual sin, lust, and impurity. I break every ungodly soul tie created through past relationships or exposure to pornography. I return my body to You as a temple of the Holy Spirit." 
              />
              <DeclarationCard 
                title="The Occult & False Idols" 
                text="I renounce all involvement with the occult, new age practices, horoscopes, and superstition. I break every agreement I have made with darkness, knowingly or unknowingly. I declare that Jesus Christ is my only source of power and truth." 
              />
              <DeclarationCard 
                title="Other Sins" 
                text="Lord, I repent of pride, fear, rebellion, and any other area where I have not trusted You. I lay down my need for control and I ask You to wash me clean." 
              />
            </div>
          </div>
        )}

        {/* STEP 4: THE SHIFT */}
        {step === 4 && (
          <div className="space-y-10 animate-in zoom-in-95 duration-300 text-center">
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg shadow-emerald-100 border border-emerald-200">🕊️</div>
             <div className="space-y-4">
               <h3 className="text-4xl font-bold text-slate-900 serif-font">The Shift</h3>
               <p className="text-slate-600 max-w-lg mx-auto leading-relaxed text-xl font-medium">
                 You have finished the initial relief prayer. You may feel peace, or a lightness in your spirit. Remember this moment.
               </p>
             </div>
             <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 text-emerald-800 text-lg italic serif-font shadow-inner">
               "If the Son makes you free, you shall be free indeed." — John 8:36
             </div>
             <div className="flex flex-col gap-4 pt-4">
               <button 
                onClick={handleFinish} 
                className="px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-2xl shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4 border-4 border-slate-800/50"
               >
                 Unlock Phase 2: The Roots
                 <span className="text-3xl">→</span>
               </button>
               <button onClick={() => onNavigate(AppSection.HOME)} className="text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-xs tracking-widest">Not ready? Return to Mission Control</button>
             </div>
          </div>
        )}

      </div>

      {/* NAVIGATION FOOTER */}
      {step < 4 && (
        <div className="flex justify-between items-center pt-8">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-8 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Back
          </button>
          <button 
            onClick={() => setStep(Math.min(4, step + 1))}
            className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3 text-lg"
          >
            Next Step
            <span className="text-xl">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SimplifiedPrayer;

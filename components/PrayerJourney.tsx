
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, AppSection } from '../types';

interface PrayerJourneyProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onNavigate?: (section: AppSection) => void;
}

const FruitOfTheSpirit: React.FC = () => {
  const fruits = ["Love", "Joy", "Peace", "Patience", "Kindness", "Goodness", "Faithfulness", "Gentleness", "Self-Control"];
  return (
    <div className="flex flex-wrap gap-3 justify-center py-6">
      {fruits.map((fruit, i) => (
        <span 
          key={fruit} 
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm shadow-sm animate-in fade-in zoom-in duration-500"
          style={{ animationDelay: `${i * 300}ms` }}
        >
          {fruit}
        </span>
      ))}
    </div>
  );
};

const JahbulonInfo: React.FC = () => (
  <span className="inline-flex items-center gap-1 group relative cursor-help align-middle">
    <span className="text-indigo-600 font-bold underline decoration-dotted">Jahbulon</span>
    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">i</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-4 bg-slate-900 text-white rounded-2xl text-xs shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 normal-case font-sans">
      <div className="font-bold text-indigo-300 mb-1">Theological Context</div>
      Jahbulon is a composite name (Jehovah, Baal, Osiris) used in certain secret societies. It is considered a perversion of the Trinity.
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
    </div>
  </span>
);

const PrayerJourney: React.FC<PrayerJourneyProps> = ({ state, updateState, onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number>(1); 
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (state.progress.prayer1CompletedAt && activeStep === 1) setActiveStep(2);
    if (state.progress.prayer2Logs.length >= 9 && activeStep === 2) setActiveStep(3);
  }, [state.progress.prayer1CompletedAt, state.progress.prayer2Logs.length]);

  const rootFinderData = useMemo(() => {
    const cat = state.categories[15]; 
    if (!cat || !cat.structuredItems) return { strongmen: [], juniors: [] };
    const strongmen: string[] = [];
    const juniors: string[] = [];
    cat.structuredItems.forEach(item => {
      if (item.label === item.label.toUpperCase() && item.label.length > 3) strongmen.push(item.label);
      if (item.items && item.items.length > 0) juniors.push(...item.items);
    });
    return { strongmen, juniors };
  }, [state.categories]);

  const prayerVariables = useMemo(() => {
    const getList = (idx: number, subType?: 'primary' | 'secondary' | 'tertiary') => {
      const cat = state.categories[idx];
      if (!cat) return "";
      let list: string[] = [];
      if (subType === 'secondary') list = [...(cat.secondaryItems || [])];
      else if (subType === 'tertiary') list = [...(cat.tertiaryItems || [])];
      else if (subType === 'primary') list = [...cat.items];
      else {
        list = [...cat.items];
        if (cat.secondaryItems) list.push(...cat.secondaryItems);
        if (cat.structuredItems) cat.structuredItems.forEach(s => {
          if (s.label) list.push(s.label);
          if (s.items) list.push(...s.items);
        });
      }
      return list.length > 0 ? list.join(", ") : "";
    };

    const { strongmen, juniors } = rootFinderData;
    const strongmanBlock = strongmen.length > 0 ? `In Jesus' name, I renounce and bind each Strongman spirit identified in my life, including ${strongmen.join(", ")}, and I bind all your junior spirits to you as one. I command you out now!` : "";

    // P1 Blocks
    const p1RepBlock = `And I repent of the following: Father (${getList(0, 'primary')}), Mother (${getList(0, 'secondary')}), Unforgiveness (${getList(1)}), and Sexual Sin (${getList(2)}).`;
    const sweepBlock = `I repent of addictive behaviors (${getList(10)}), other religions (${getList(11)}), and judgments (${getList(12)}).`;
    
    // P3 Specialized Blocks
    const spouse = state.progress.spouseName || "[Spouse]";
    const children = state.progress.childrenNames || "[Children]";
    const familyRepBlock = `On behalf of ${spouse}, I repent for the sins in our marriage. And on behalf of my children ${children}, I repent for each of their sins, asking for Your grace to cover them.`;

    const cat18 = state.categories[17].items || [];
    const identityRenunciation = cat18.length > 0 ? `I repent of my identity of ${cat18.join(", ")}. I separate who I am from what I have experienced or what has tried to claim my health.` : "";

    const wordCurses = state.categories[5].items || [];
    const mindRenewalBlock = wordCurses.map((curse, i) => {
      const truth = state.progress.wordCurseMappings[i] || `[Scripture Truth for "${curse}"]`;
      return `- Instead of "${curse}", I declare: ${truth}`;
    }).join("\n");

    return {
      "(Cat 1-3 Repentance Block)": p1RepBlock,
      "(The Sweep Block)": sweepBlock,
      "(The Strongman Binding Block)": strongmanBlock,
      "(The Infirmity Command Block)": cat18.map(inf => `"${inf}, go!"`).join("\n"),
      "(Cat 15 Agreement Block)": getList(14),
      "(Religion Command Block)": getList(11).split(", ").map(r => `I command spirits of ${r} to leave!`).join("\n"),
      "(Family Repentance Block)": familyRepBlock,
      "(Identity Renunciation Block)": identityRenunciation,
      "(Mind Renewal Block)": mindRenewalBlock,
      "(Cat 7 Covenants)": getList(6),
      "(Cat 6 Word Curses)": getList(5),
      "(Cat 15 Agreements)": getList(14),
      "(Cat 8 Idolatry)": getList(7),
      "(Cat 11 Addictions)": getList(10),
      "(Cat 18 Infirmity)": getList(17),
    };
  }, [state, rootFinderData]);

  const renderPrayerText = (text: string) => {
    let parts: any[] = [text];
    Object.entries(prayerVariables).forEach(([key, val]) => {
      parts = parts.flatMap(p => {
        if (typeof p !== 'string') return [p];
        const split = p.split(key);
        const result: any[] = [];
        split.forEach((s, i) => {
          result.push(s);
          if (i < split.length - 1) result.push(<strong key={`${key}-${i}`} className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">{val}</strong>);
        });
        return result;
      });
    });

    parts = parts.flatMap(p => {
      if (typeof p !== 'string') return [p];
      const split = p.split("[[Jahbulon]]");
      const result: any[] = [];
      split.forEach((s, i) => {
        result.push(s);
        if (i < split.length - 1) result.push(<JahbulonInfo key={`jah-${i}`} />);
      });
      return result;
    });

    parts = parts.flatMap(p => {
      if (typeof p !== 'string') return [p];
      const split = p.split("[[FRUIT_OF_SPIRIT]]");
      const result: any[] = [];
      split.forEach((s, i) => {
        result.push(s);
        if (i < split.length - 1) result.push(<FruitOfTheSpirit key={`fruit-${i}`} />);
      });
      return result;
    });

    return parts;
  };

  const logSession = (slot: string) => {
    updateState(s => ({
      ...s,
      progress: { ...s.progress, prayer3Logs: [...s.progress.prayer3Logs, slot] },
      lastActivity: { label: `Logged P3 Session: ${slot}`, section: AppSection.DEEP_PRAYER, timestamp: new Date().toISOString() }
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-32 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Phase 3: Freedom</span>
          <h2 className="text-3xl font-bold serif-font text-slate-900 mt-2">The Freedom Journey</h2>
        </div>
        <div className="flex gap-2">
          {activeStep === 3 && (
            <button onClick={() => setShowConfig(!showConfig)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100">
              {showConfig ? '✓ Done Setup' : '⚙ Setup Family'}
            </button>
          )}
          <button onClick={() => onNavigate?.(AppSection.HOME)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200">← Home</button>
        </div>
      </header>

      {/* SETUP PANEL FOR P3 */}
      {showConfig && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-50 shadow-xl space-y-6 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Spouse Name</label>
              <input value={state.progress.spouseName || ''} onChange={e => updateState(s => ({...s, progress: {...s.progress, spouseName: e.target.value}}))} placeholder="Spouse name..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Children Names</label>
              <input value={state.progress.childrenNames || ''} onChange={e => updateState(s => ({...s, progress: {...s.progress, childrenNames: e.target.value}}))} placeholder="Children (separated by commas)..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-800">Mind Renewal: Word Curse Replacement</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {(state.categories[5].items || []).map((curse, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-rose-500 uppercase">Lie: "{curse}"</span>
                  <input 
                    value={state.progress.wordCurseMappings[i] || ''} 
                    onChange={e => updateState(s => ({...s, progress: {...s.progress, wordCurseMappings: {...s.progress.wordCurseMappings, [i]: e.target.value}}}))} 
                    placeholder="Enter Scripture Statement..." 
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="flex gap-2 p-1.5 bg-slate-200 rounded-2xl overflow-x-auto shadow-inner">
        {[1, 2, 3].map(step => (
          <button
            key={step}
            onClick={() => setActiveStep(step)}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeStep === step ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-300'}`}
          >
            Prayer #{step}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-2xl relative">
        {activeStep === 3 && (
          <div className="absolute top-4 right-8">
            <a href="https://example.com/chapter12" target="_blank" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">If issues intensify (Chapter 12) →</a>
          </div>
        )}

        <div className="border-b border-slate-100 pb-8 mb-8 flex justify-between items-start">
           <div>
             <h3 className="text-2xl font-bold text-slate-900 serif-font">
               {activeStep === 1 ? "Repentance of Activities" : activeStep === 2 ? "Renouncing Agreements" : "Final Cleanup & Sealing"}
             </h3>
             <p className="text-sm text-slate-400 mt-1">
               {activeStep === 1 ? "Pray once out loud." : activeStep === 2 ? "3x Daily for 3 Days." : "2x Daily for 30 Days."}
             </p>
           </div>
           <button onClick={() => setIsReadingMode(!isReadingMode)} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">{isReadingMode ? 'Exit Focus' : 'Focus Mode'}</button>
        </div>

        <div className={`serif-font text-2xl leading-relaxed text-slate-800 italic whitespace-pre-wrap ${isReadingMode ? 'fixed inset-0 z-[100] bg-white p-10 md:p-24 overflow-y-auto animate-in zoom-in-95' : ''}`}>
           {isReadingMode && <button onClick={() => setIsReadingMode(false)} className="fixed top-10 right-10 w-12 h-12 bg-slate-100 rounded-full font-bold">✕</button>}
           <div className={isReadingMode ? 'max-w-3xl mx-auto' : ''}>
             {renderPrayerText(activeStep === 1 ? state.prayers.prayer1 : activeStep === 2 ? state.prayers.prayer2 : state.prayers.prayer3)}
           </div>
        </div>

        {/* 30-DAY CALENDAR TRACKER */}
        {!isReadingMode && activeStep === 3 && (
          <div className="mt-12 pt-8 border-t border-slate-100 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="font-bold text-slate-800">30-Day Success Tracker</h4>
                <p className="text-xs text-slate-400">Mark morning and evening sessions.</p>
              </div>
              <div className="text-2xl font-bold text-indigo-600">{state.progress.prayer3Logs.length} / 60</div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[...Array(30)].map((_, day) => (
                <div key={day} className="space-y-1">
                  <span className="block text-[8px] font-bold text-slate-300 text-center">D{day+1}</span>
                  <div className="flex flex-col gap-1">
                    {['AM', 'PM'].map(time => {
                      const slot = `D${day+1}-${time}`;
                      const done = state.progress.prayer3Logs.includes(slot);
                      return (
                        <button 
                          key={time}
                          onClick={() => !done && logSession(slot)}
                          className={`h-8 rounded-lg flex items-center justify-center text-[8px] font-bold border transition-all ${done ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-slate-100 text-slate-300 hover:border-indigo-300'}`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {state.progress.prayer3Logs.length >= 60 && (
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center animate-bounce">
                <span className="text-2xl">🏆</span>
                <p className="font-bold text-emerald-800">30-Day Cleanup Complete!</p>
                <p className="text-xs text-emerald-600">This prayer can now be used as your daily spiritual covering.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerJourney;

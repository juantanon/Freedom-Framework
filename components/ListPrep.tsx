
import React, { useState, useEffect } from 'react';
import { AppState, AppSection } from '../types';

interface ListPrepProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onNavigate: (section: AppSection) => void;
}

type FocusStep = 'PRAYER_START' | 'LISTING' | 'PRAYER_END' | 'TIMER' | 'VERIFY';
type ParentTab = 'FATHER' | 'MOTHER' | 'GRANDPARENTS';
type AgeGroup = '0-5' | '5-7' | '8-13' | '13+';
type SexualSinTab = 'PARTNERS' | 'INFLUENCERS';
type InfirmityTab = 'PERSONAL' | 'FAMILY';

const TIER_CONFIG = [
  { label: 'Tier 1: The Foundation', indices: [0, 1, 2, 3] },
  { label: 'Tier 2: Spiritual Ties', indices: [4, 5, 6] },
  { label: 'Tier 3: Heart & Health', indices: [7, 8, 9, 10, 11] },
  { label: 'Tier 4: The Final Sweep', indices: [12, 13, 14, 15, 16, 17] },
];

const ROOT_SPIRITS = [
  { id: 'spirit-haughty', label: 'Spirit of Haughtiness', symptoms: ['Pride', 'Arrogance', 'Scorn', 'Strife', 'Obstidacy', 'Mockery'] },
  { id: 'spirit-deaf-dumb', label: 'Deaf & Dumb Spirit', symptoms: ['Mental Illness', 'Seizures', 'Suicide', 'Insanity', 'Epilepsy'] },
  { id: 'spirit-slumber', label: 'Spirit of Slumber', symptoms: ['Isolation', 'Laziness', 'Confusion', 'Drowsiness', 'Daydreaming', 'Forgetfulness'] },
  { id: 'spirit-heaviness', label: 'Spirit of Heaviness', symptoms: ['Grief', 'Despair', 'Rejection', 'Self-Pity', 'Insomnia', 'Broken Heart'] },
  { id: 'spirit-fear', label: 'Spirit of Fear', symptoms: ['Anxiety', 'Panic Attacks', 'Phobias', 'Nightmares', 'Terror', 'Fear of Death'] },
  { id: 'spirit-jealousy', label: 'Spirit of Jealousy', symptoms: ['Anger', 'Rage', 'Revenge', 'Murder', 'Violence', 'Control'] },
  { id: 'spirit-lying', label: 'Lying Spirit', symptoms: ['Deception', 'Flattery', 'Superstition', 'Gossip', 'False Prophecy', 'Hypocrisy'] },
  { id: 'spirit-antichrist', label: 'Spirit of Anti-Christ', symptoms: ['Rebellion', 'Lawlessness', 'Witchcraft', 'Bitterness', 'Deception'] },
  { id: 'spirit-whoredom', label: 'Spirit of Whoredom', symptoms: ['Prostitution', 'Adultery', 'Fornication', 'Idolatry', 'Love of Money'] },
  { id: 'spirit-perversion', label: 'Spirit of Perversion', symptoms: ['Lust', 'Twisting Truth', 'Incest', 'Pedophilia', 'Homosexuality', 'Pornography'] },
  { id: 'spirit-poverty', label: 'Spirit of Poverty', symptoms: ['Lack', 'Debt', 'Financial Ruin', 'Greed', 'Stinginess', 'Theft'] },
  { id: 'spirit-bondage', label: 'Spirit of Bondage', symptoms: ['Addictions', 'Compulsions', 'Servitude', 'Fear of Man', 'Captivity'] },
];

const ListPrep: React.FC<ListPrepProps> = ({ state, updateState, onNavigate }) => {
  const [activeCatIndex, setActiveCatIndex] = useState<number | null>(null);
  const [focusStep, setFocusStep] = useState<FocusStep>('PRAYER_START');
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [openTier, setOpenTier] = useState<number | null>(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Persistence Key Helper
  const getPersistenceKey = (catId: string, sub?: string) => `FreedomApp_Draft_${catId}${sub ? '_' + sub : ''}`;

  // Local state for specialized inputs
  const [parentTab, setParentTab] = useState<ParentTab>('FATHER');
  const [activeAgeGroup, setActiveAgeGroup] = useState<AgeGroup>('0-5');
  const [sexualSinTab, setSexualSinTab] = useState<SexualSinTab>('PARTNERS');
  const [infirmityTab, setInfirmityTab] = useState<InfirmityTab>('PERSONAL');
  const [activePersonId, setActivePersonId] = useState<string | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(t => (t !== null ? t - 1 : null)), 1000);
    } else if (timerSeconds === 0) {
      setTimerSeconds(null);
      setFocusStep('VERIFY');
    }
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const activeCategory = activeCatIndex !== null ? state.categories[activeCatIndex] : null;

  // Persistence Sync
  useEffect(() => {
    if (activeCategory) {
      const key = getPersistenceKey(activeCategory.id, activePersonId || sexualSinTab || infirmityTab);
      const saved = localStorage.getItem(key);
      setInputValue(saved || '');
    } else {
      setInputValue('');
    }
  }, [activeCatIndex, activePersonId, sexualSinTab, infirmityTab, activeCategory]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (activeCategory) {
      const key = getPersistenceKey(activeCategory.id, activePersonId || sexualSinTab || infirmityTab);
      localStorage.setItem(key, val);
    }
  };

  const addItem = (overrideText?: string) => {
    const textToAdd = overrideText || inputValue.trim();
    if (!textToAdd || activeCatIndex === null) return;
    
    updateState(s => {
      const newCats = [...s.categories];
      const targetCat = { ...newCats[activeCatIndex] };

      if (activeCatIndex === 0) {
        const itemText = `[${activeAgeGroup}] ${textToAdd}`;
        if (parentTab === 'FATHER') targetCat.items = [...targetCat.items, itemText];
        else if (parentTab === 'MOTHER') targetCat.secondaryItems = [...(targetCat.secondaryItems || []), itemText];
        else targetCat.tertiaryItems = [...(targetCat.tertiaryItems || []), itemText];
      } 
      else if ([1, 4, 5, 6, 7, 9, 10, 11, 12, 13].includes(activeCatIndex)) {
        if (!targetCat.structuredItems) targetCat.structuredItems = [];
        if (activePersonId) {
          targetCat.structuredItems = targetCat.structuredItems.map(p => p.id === activePersonId ? { ...p, items: [...p.items, textToAdd] } : p);
        } else {
          targetCat.structuredItems = [...targetCat.structuredItems, { id: `item-${Date.now()}`, label: textToAdd, items: [] }];
        }
      } 
      else if (activeCatIndex === 2) {
        if (sexualSinTab === 'PARTNERS') targetCat.items = [...targetCat.items, textToAdd];
        else targetCat.secondaryItems = [...(targetCat.secondaryItems || []), textToAdd];
      }
      else if (activeCatIndex === 17) {
        if (infirmityTab === 'PERSONAL') targetCat.items = [...targetCat.items, textToAdd];
        else targetCat.secondaryItems = [...(targetCat.secondaryItems || []), textToAdd];
      }
      else {
        targetCat.items = [...targetCat.items, textToAdd];
      }
      
      newCats[activeCatIndex] = targetCat;
      return { ...s, categories: newCats };
    });
    
    setInputValue('');
    if (activeCategory) {
      localStorage.removeItem(getPersistenceKey(activeCategory.id, activePersonId || sexualSinTab || infirmityTab));
    }
  };

  const markComplete = () => {
    if (activeCatIndex === null) return;
    updateState(s => {
      const newCats = [...s.categories];
      newCats[activeCatIndex] = { ...newCats[activeCatIndex], isCompleted: true };
      
      const completedCount = newCats.filter(c => c.isCompleted).length;
      if (completedCount === 18) {
        setShowCelebration(true);
      }

      return { 
        ...s, 
        categories: newCats,
        lastActivity: {
          label: `Completed Category ${activeCatIndex + 1}: ${state.categories[activeCatIndex].label}`,
          section: AppSection.LIST_PREP,
          timestamp: new Date().toISOString()
        }
      };
    });
    if (activeCatIndex < 17) {
      setActiveCatIndex(null);
      setFocusStep('PRAYER_START');
    } else {
      setActiveCatIndex(null);
    }
  };

  const removeItem = (index: number, type: 'primary' | 'secondary' | 'tertiary' = 'primary', personId?: string) => {
    updateState(s => {
      const newCats = [...s.categories];
      const targetCat = { ...newCats[activeCatIndex!] };
      if (personId) {
        targetCat.structuredItems = targetCat.structuredItems?.map(p => p.id === personId ? { ...p, items: p.items.filter((_, i) => i !== index) } : p);
      } else if (targetCat.structuredItems && ![1, 4, 5, 6, 7, 9, 10, 11, 12, 13].includes(activeCatIndex!)) {
         targetCat.structuredItems = targetCat.structuredItems.filter((_, i) => i !== index);
      } else if (type === 'secondary') targetCat.secondaryItems = (targetCat.secondaryItems || []).filter((_, i) => i !== index);
      else if (type === 'tertiary') targetCat.tertiaryItems = (targetCat.tertiaryItems || []).filter((_, i) => i !== index);
      else targetCat.items = targetCat.items.filter((_, i) => i !== index);
      newCats[activeCatIndex!] = targetCat;
      return { ...s, categories: newCats };
    });
  };

  const renderTier = (tier: typeof TIER_CONFIG[0], tierIdx: number) => {
    const isExpanded = openTier === tierIdx;
    const completedInTier = tier.indices.filter(i => state.categories[i].isCompleted).length;
    const totalInTier = tier.indices.length;

    return (
      <div key={tier.label} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setOpenTier(isExpanded ? null : tierIdx)}
          className={`w-full flex items-center justify-between p-6 transition-colors ${isExpanded ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}
        >
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${completedInTier === totalInTier ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                {completedInTier === totalInTier ? '✓' : tierIdx + 1}
             </div>
             <div className="text-left">
               <h3 className="font-bold text-slate-800 text-lg">{tier.label}</h3>
               <p className="text-xs text-slate-400 font-medium">{completedInTier} / {totalInTier} Categories Completed</p>
             </div>
          </div>
          <span className={`text-slate-300 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
            {tier.indices.map(idx => {
              const cat = state.categories[idx];
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCatIndex(idx); setFocusStep('PRAYER_START'); }}
                  className={`text-left p-5 rounded-2xl border transition-all ${cat.isCompleted ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-slate-50 border-slate-100 hover:border-indigo-300 text-slate-700'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Category {idx + 1}</span>
                    {cat.isCompleted && <span className="text-emerald-500 font-bold text-xs">✓ Done</span>}
                  </div>
                  <h4 className="font-bold">{cat.label}</h4>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 z-[2000] animate-in fade-in">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-lg w-full text-center space-y-8 animate-in zoom-in-95">
           <div className="text-6xl animate-bounce">🕊️</div>
           <div className="space-y-4">
             <h2 className="text-4xl font-bold text-slate-900 serif-font">Inventory Complete!</h2>
             <p className="text-slate-600 text-lg">
               You have finished the difficult work of bringing everything into the light. 
               You are now fully prepared for the <strong>Deep Clean</strong>.
             </p>
           </div>
           <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-emerald-800 text-sm italic">
             "For the Lord is a God of justice; blessed are all those who wait for Him." — Isaiah 30:18
           </div>
           <button 
             onClick={() => onNavigate(AppSection.DEEP_PRAYER)}
             className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-indigo-700 transition-all transform hover:scale-[1.02]"
           >
             Proceed to Prayer Journey →
           </button>
        </div>
      </div>
    );
  }

  if (activeCatIndex === null) {
    return (
      <div className="pb-32 space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-start">
          <div>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Phase 2: THE ROOTS</span>
            <h2 className="text-3xl font-bold text-slate-900 serif-font mt-2">List Preparation</h2>
            <p className="text-slate-500">Work through the inventory categories systematically.</p>
          </div>
          <button 
            onClick={() => onNavigate(AppSection.HOME)}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
          >
            ← Home
          </button>
        </header>
        <div className="space-y-6">
          {TIER_CONFIG.map((tier, idx) => renderTier(tier, idx))}
        </div>
        <div className="pt-8 text-center">
          <button 
            onClick={() => onNavigate(AppSection.HOME)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-6 animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveCatIndex(null)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">←</button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category {activeCatIndex + 1}</span>
            <h2 className="text-xl font-bold text-slate-900">{activeCategory?.label}</h2>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(AppSection.HOME)}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
        >
          ← Home
        </button>
      </div>

      <div className="flex-1">
        {focusStep === 'PRAYER_START' && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center space-y-8 animate-in zoom-in-95">
            <h3 className="text-2xl font-bold">Invite God In</h3>
            <p className="serif-font italic text-slate-700 text-xl leading-relaxed">"{state.prayers.beginning}"</p>
            <button onClick={() => setFocusStep('LISTING')} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">I have prayed this</button>
          </div>
        )}

        {focusStep === 'LISTING' && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6 animate-in fade-in">
             <div className="space-y-4">
                <p className="text-sm text-slate-500 font-medium">Add entries to your list. The more specific, the better.</p>
                <div className="flex gap-2">
                  <input autoFocus value={inputValue} onChange={(e) => handleInputChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Type item..." className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  <button onClick={() => addItem()} className="px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Add</button>
                </div>
                <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {activeCategory?.items.map((it, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center group border border-transparent hover:border-slate-200 transition-all">
                      <span className="font-medium text-slate-700">{it}</span>
                      <button onClick={() => removeItem(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">✕</button>
                    </div>
                  ))}
                  {activeCategory?.items.length === 0 && <p className="text-center py-10 text-slate-400 italic">No items added yet.</p>}
                </div>
             </div>
             <button onClick={() => setFocusStep('PRAYER_END')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all">Finished Listing</button>
          </div>
        )}

        {focusStep === 'PRAYER_END' && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center space-y-8 animate-in zoom-in-95">
            <h3 className="text-2xl font-bold">Seal the Session</h3>
            <p className="serif-font italic text-indigo-900 text-xl leading-relaxed">"{state.prayers.ending}"</p>
            <button onClick={() => { setTimerSeconds(180); setFocusStep('TIMER'); }} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Start Listening Timer (3:00)</button>
          </div>
        )}

        {focusStep === 'TIMER' && (
           <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] text-center space-y-8 animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-indigo-300">Wait on the Lord</h3>
              <div className="text-8xl font-mono tracking-tighter tabular-nums">
                {Math.floor((timerSeconds || 0) / 60)}:{(timerSeconds || 0) % 60 < 10 ? '0' : ''}{(timerSeconds || 0) % 60}
              </div>
              <p className="text-slate-500 text-sm">Listen for any additional memories or names.</p>
              <button onClick={() => setTimerSeconds(0)} className="text-xs text-slate-600 uppercase tracking-widest font-bold hover:text-white transition-colors">Skip Timer</button>
           </div>
        )}

        {focusStep === 'VERIFY' && (
           <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center space-y-8 animate-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-bold text-slate-900">Category Complete</h3>
              <p className="text-slate-500">Did anything else come to mind during the silence?</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setFocusStep('LISTING')} className="py-4 border-2 border-slate-100 rounded-xl font-bold hover:border-indigo-100 transition-all">Yes, add more</button>
                <button onClick={markComplete} className="py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all">No, I'm done</button>
              </div>
           </div>
        )}
      </div>
      <div className="pt-8 text-center">
        <button 
          onClick={() => onNavigate(AppSection.HOME)}
          className="text-slate-400 text-xs font-bold uppercase hover:text-indigo-600 transition-all"
        >
          Pause & Return to Home
        </button>
      </div>
    </div>
  );
};

export default ListPrep;


import React, { useState } from 'react';
import { AppState, Issue, AppSection } from '../types';

interface IssueGridProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onNavigate?: (section: AppSection) => void; 
}

const IssueGrid: React.FC<IssueGridProps> = ({ state, updateState, onNavigate }) => {
  const [newIssueText, setNewIssueText] = useState('');
  const [showPrayer, setShowPrayer] = useState(false);

  const isP2Complete = state.progress.prayer2Logs.length >= 9;

  const addIssue = () => {
    const trimmed = newIssueText.trim();
    if (!trimmed) return;
    const newIssue: Issue = {
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      description: trimmed,
      intensityBefore: 0,
      intensity3Day: null,
      intensity30Day: null,
      notes: ''
    };
    updateState(prev => ({
      ...prev,
      issues: [newIssue, ...prev.issues],
      lastActivity: { label: `Added Issue: ${trimmed}`, section: AppSection.ISSUE_TRACKER, timestamp: new Date().toISOString() }
    }));
    setNewIssueText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addIssue(); }
  };

  const updateIssueField = (id: string, field: keyof Issue, val: any) => {
    updateState(prev => ({ ...prev, issues: prev.issues.map(i => i.id === id ? { ...i, [field]: val } : i) }));
  };

  const removeIssue = (id: string) => {
    if (confirm("Remove this issue from your grid? This cannot be undone.")) {
      updateState(prev => ({ 
        ...prev, 
        issues: prev.issues.filter(i => i.id !== id),
        lastActivity: { label: `Removed Issue`, section: AppSection.ISSUE_TRACKER, timestamp: new Date().toISOString() }
      }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-start">
        <div>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Phase 1: Identify</span>
          <h2 className="text-3xl font-bold text-slate-900 serif-font mt-2">Issue Tracker</h2>
          <p className="text-slate-500 text-sm">Diagnosis: Name the struggles clearly.</p>
        </div>
        <button onClick={() => onNavigate?.(AppSection.HOME)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">← Home</button>
      </header>

      {/* PRAYER FOR REVELATION */}
      <div className="bg-white rounded-[2rem] border border-indigo-100 shadow-sm overflow-hidden">
        <div onClick={() => setShowPrayer(!showPrayer)} className="bg-indigo-50/50 p-6 flex items-center justify-between cursor-pointer hover:bg-indigo-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🙏</span>
            <div><h3 className="font-bold text-indigo-900">Prayer for Revelation</h3><p className="text-xs text-indigo-600 font-medium">Click to open • Pray this before adding items</p></div>
          </div>
          <span className={`text-indigo-400 transform transition-transform ${showPrayer ? 'rotate-180' : ''}`}>▼</span>
        </div>
        {showPrayer && (
          <div className="p-8 bg-white animate-in slide-in-from-top-2 text-center">
            <p className="serif-font italic text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
              "Lord, I come before You now. Search me, O God, and know my heart; try me, and know my anxieties; and see if there is any wicked way in me, and lead me in the way everlasting."
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 px-2 uppercase tracking-wide">Add a struggle or symptom</label>
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-lg shadow-indigo-100/30 border border-slate-200">
          <input type="text" autoFocus value={newIssueText} onChange={(e) => setNewIssueText(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. chronic anger, nightmares, anxiety..." className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-slate-800 font-medium"/>
          <button onClick={addIssue} className="px-6 md:px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all">Add</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-50/80 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-6">Issue / Struggle</th>
                <th className="px-4 py-6 w-32 text-center">Initial</th>
                <th className={`px-4 py-6 w-36 text-center ${isP2Complete ? 'text-emerald-600 bg-emerald-50/50' : 'text-indigo-600 bg-indigo-50/50'}`}>
                  {isP2Complete ? 'After Prayer #2' : 'Post-Simplified'}
                </th>
                <th className="px-4 py-6 w-36 text-center text-slate-400">Post-Deep Clean</th>
                <th className="px-6 py-6 w-20 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.issues.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic font-medium">🌱 Your list is empty. Add a struggle above to begin.</td></tr>
              ) : state.issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-5 font-semibold text-slate-800">{issue.description}</td>
                  <td className="px-4 py-4 text-center">
                    <IntensityInput 
                      value={issue.intensityBefore} 
                      onChange={(v) => updateIssueField(issue.id, 'intensityBefore', v)} 
                      disabled={issue.intensity3Day !== null}
                    />
                  </td>
                  <td className={`px-4 py-4 text-center ${isP2Complete ? 'bg-emerald-50/30' : 'bg-indigo-50/30'}`}>
                    <IntensityInput 
                      value={issue.intensity3Day} 
                      onChange={(v) => updateIssueField(issue.id, 'intensity3Day', v)} 
                      placeholder="—" 
                      disabled={!state.progress.simplifiedPrayerFinished}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <IntensityInput 
                      value={issue.intensity30Day} 
                      onChange={(v) => updateIssueField(issue.id, 'intensity30Day', v)} 
                      placeholder="—"
                      disabled={state.progress.prayer3Logs.length < 60 && !state.progress.simplifiedPrayerFinished}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => removeIssue(issue.id)} 
                      className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all p-2 rounded-full hover:bg-rose-50 mx-auto"
                      title="Delete Issue"
                    >
                      <span className="text-xl font-bold">✕</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 text-indigo-900 text-sm italic serif-font text-center">
        "I will restore health to you and heal you of your wounds," says the Lord. — Jeremiah 30:17
      </div>
    </div>
  );
};

const IntensityInput: React.FC<{ value: number | null, onChange: (v: number | null) => void, placeholder?: string, disabled?: boolean }> = ({ value, onChange, placeholder = '0', disabled = false }) => (
  <div className="relative inline-block w-full max-w-[80px]">
    <select 
      value={value === null ? '' : value} 
      disabled={disabled}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      className={`w-full bg-white border-2 border-slate-100 rounded-xl px-2 py-2.5 text-center outline-none font-bold text-sm appearance-none transition-all ${value === null ? 'text-slate-300' : 'text-indigo-600'} ${disabled ? 'bg-slate-50 cursor-not-allowed border-slate-50 opacity-60' : 'cursor-pointer hover:border-indigo-100 hover:shadow-sm focus:border-indigo-500'}`}
    >
      <option value="">{placeholder}</option>
      {[...Array(11)].map((_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
    {!disabled && (
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
        <span className="text-[8px]">▼</span>
      </div>
    )}
  </div>
);

export default IssueGrid;

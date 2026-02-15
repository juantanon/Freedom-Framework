
import React, { useCallback } from 'react';
import { AppState } from '../types';

interface DeveloperToolsProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const PrayerInput: React.FC<{ label: string, field: string, subField?: string, val: string, onUpdate: any }> = ({ label, field, subField, val, onUpdate }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">{label}</label>
    <textarea
      className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] serif-font text-slate-800 outline-none transition-all shadow-sm"
      value={val}
      onChange={(e) => onUpdate(field, e.target.value, subField)}
      placeholder={`Paste ${label} text here...`}
    />
  </div>
);

const DeveloperTools: React.FC<DeveloperToolsProps> = ({ state, updateState }) => {
  const handleUpdate = useCallback((field: string, value: string, subField?: string) => {
    updateState(prev => {
      if (subField) {
        return {
          ...prev,
          prayers: { ...prev.prayers, simplified: { ...prev.prayers.simplified, [subField]: value } }
        };
      } else {
        return { ...prev, prayers: { ...prev.prayers, [field]: value } };
      }
    });
  }, [updateState]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="bg-amber-100 p-6 rounded-2xl border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 serif-font">Developer Tools</h2>
        <p className="text-amber-800 text-sm">Editing the core prayer framework text.</p>
      </header>

      <div className="space-y-12">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Simplified Prayer Templates</h3>
          <PrayerInput label="Opening Prayer" field="simplified" subField="intro" val={state.prayers.simplified.intro} onUpdate={handleUpdate} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PrayerInput label="Unforgiveness" field="simplified" subField="unforgiveness" val={state.prayers.simplified.unforgiveness} onUpdate={handleUpdate} />
            <PrayerInput label="Sexual Sin" field="simplified" subField="sexualSin" val={state.prayers.simplified.sexualSin} onUpdate={handleUpdate} />
            <PrayerInput label="Occult" field="simplified" subField="occult" val={state.prayers.simplified.occult} onUpdate={handleUpdate} />
            <PrayerInput label="Other Sins" field="simplified" subField="other" val={state.prayers.simplified.other} onUpdate={handleUpdate} />
          </div>
          <PrayerInput label="Closing" field="simplified" subField="outro" val={state.prayers.simplified.outro} onUpdate={handleUpdate} />
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Deep Clean Prayers</h3>
           <PrayerInput label="Prayer 1: Repentance" field="prayer1" val={state.prayers.prayer1} onUpdate={handleUpdate} />
           <PrayerInput label="Prayer 2: Renunciation" field="prayer2" val={state.prayers.prayer2} onUpdate={handleUpdate} />
           <PrayerInput label="Prayer 3: Cleanup" field="prayer3" val={state.prayers.prayer3} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
};

export default DeveloperTools;

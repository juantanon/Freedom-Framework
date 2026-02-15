
import React, { useState } from 'react';
import { AppState, AppSection } from '../types';
import { STORAGE_KEY } from '../constants';

interface SettingsProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const Settings: React.FC<SettingsProps> = ({ state, updateState }) => {
  // Local state for password management
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [recoveryEmailInput, setRecoveryEmailInput] = useState(state.settings.recoveryEmail || '');
  
  const [syncCode, setSyncCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [showSyncTool, setShowSyncTool] = useState(false);

  const handleUpdatePassword = () => {
    if (!currentPass && state.settings.password) {
      alert("Please enter your current password.");
      return;
    }
    if (state.settings.password && currentPass !== state.settings.password) {
      alert("Current password is incorrect.");
      return;
    }
    if (newPass.length < 4) {
      alert("New password must be at least 4 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      alert("New passwords do not match.");
      return;
    }

    updateState(s => ({ ...s, settings: { ...s.settings, password: newPass } }));
    alert("Password updated successfully.");
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const saveRecoveryEmail = () => {
    updateState(s => ({ ...s, settings: { ...s.settings, recoveryEmail: recoveryEmailInput.trim() || null } }));
    alert("Recovery settings saved.");
  };

  const toggleDevTools = () => {
    updateState(s => ({ ...s, settings: { ...s.settings, showDevTools: !s.settings.showDevTools } }));
  };

  const toBase64 = (str: string) => {
    try { return window.btoa(unescape(encodeURIComponent(str))); } catch (e) { return ""; }
  };
  const fromBase64 = (str: string) => {
    try { return decodeURIComponent(escape(window.atob(str))); } catch (e) { return null; }
  };

  const generateSyncCode = () => {
    const json = JSON.stringify(state);
    setSyncCode(toBase64(json));
    setShowSyncTool(true);
  };

  const copySyncCode = () => {
    navigator.clipboard.writeText(syncCode).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const loadSyncCode = () => {
    if (!importCode) return;
    const jsonStr = fromBase64(importCode.trim());
    if (!jsonStr) { alert("Invalid Sync Code."); return; }
    try {
      const parsed = JSON.parse(jsonStr);
      if (confirm("Overwrite current data with Sync Code data?")) {
        updateState(() => ({ ...parsed, settings: { ...parsed.settings, isLocked: false } }));
        setImportCode('');
        setShowSyncTool(false);
        alert("Success! Data synced.");
      }
    } catch (e) { alert("Error parsing data."); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 serif-font">System Settings</h2>
        <p className="text-slate-500">Manage security, sync, and framework configurations.</p>
      </header>

      {/* Security Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-2xl">🔒</div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Security & Authentication</h3>
            <p className="text-slate-500 text-sm">Update your password and recovery settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Change Password</h4>
            <div className="space-y-3">
              <input 
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Current Password"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none font-medium"
              />
              <input 
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New Password"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none font-medium"
              />
              <input 
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none font-medium"
              />
              <button 
                onClick={handleUpdatePassword}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Update Password
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Recovery Method</h4>
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter an email address to help recover your account if you forget your password.
              </p>
              <input 
                type="email"
                value={recoveryEmailInput}
                onChange={(e) => setRecoveryEmailInput(e.target.value)}
                placeholder="recovery@email.com"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none font-medium"
              />
              <button 
                onClick={saveRecoveryEmail}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95"
              >
                Save Recovery Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Section */}
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🔄</div>
          <div>
            <h3 className="text-xl font-bold">Sync Devices</h3>
            <p className="text-slate-400 text-sm">Transfer data between devices using encoded sync strings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Export Data</span>
              {!showSyncTool ? (
                <button onClick={generateSyncCode} className="w-full py-3 bg-indigo-500 rounded-xl font-bold">Generate Code</button>
              ) : (
                <>
                  <textarea readOnly value={syncCode} className="w-full h-20 bg-black/30 rounded-xl p-3 text-[10px] font-mono text-indigo-200 resize-none outline-none"/>
                  <button onClick={copySyncCode} className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold">{copyStatus === 'copied' ? 'Copied!' : 'Copy Code'}</button>
                </>
              )}
           </div>
           <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Import Data</span>
              <textarea value={importCode} onChange={e => setImportCode(e.target.value)} placeholder="Paste code here..." className="w-full h-20 bg-white text-black rounded-xl p-3 text-[10px] font-mono resize-none"/>
              <button onClick={loadSyncCode} className="w-full py-3 bg-emerald-600 rounded-xl font-bold">Load Data</button>
           </div>
        </div>
      </div>

      {/* Developer/Admin Toggle */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center justify-between">
         <div>
           <h4 className="font-bold text-amber-900">Admin / Prayer Library</h4>
           <p className="text-xs text-amber-700">Enable to edit the framework text.</p>
         </div>
         <button 
           onClick={toggleDevTools}
           className={`w-14 h-8 rounded-full transition-colors relative ${state.settings.showDevTools ? 'bg-amber-600' : 'bg-slate-300'}`}
         >
           <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${state.settings.showDevTools ? 'left-7' : 'left-1'}`}></div>
         </button>
      </div>

      <div className="text-center pt-8">
        <button onClick={() => confirm("Factory Reset? All data will be permanently wiped.") && (localStorage.removeItem(STORAGE_KEY), window.location.reload())} className="text-red-400 text-xs font-bold uppercase hover:text-red-600">
           Factory Reset App
        </button>
      </div>
    </div>
  );
};

export default Settings;

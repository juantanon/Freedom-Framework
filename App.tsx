
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppSection, AppState } from './types';
import { INITIAL_STATE, STORAGE_KEY } from './constants';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import IssueGrid from './components/IssueGrid';
import SimplifiedPrayer from './components/SimplifiedPrayer';
import ListPrep from './components/ListPrep';
import PrayerJourney from './components/PrayerJourney';
import Settings from './components/Settings';
import DeveloperTools from './components/DeveloperTools';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [isSaving, setIsSaving] = useState(false);
  const [unlockInput, setUnlockInput] = useState('');
  const [recoveryMode, setRecoveryMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [recoveryEmailInput, setRecoveryEmailInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_STATE;
    
    try {
      const parsed = JSON.parse(saved);
      // Migration & Safety
      return {
        ...INITIAL_STATE,
        ...parsed,
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_STATE.categories,
        settings: {
          ...INITIAL_STATE.settings,
          ...(parsed.settings || {})
        }
      };
    } catch (e) {
      console.error("Critical Load Error", e);
      return INITIAL_STATE;
    }
  });

  // Global Persistence Logic - Saves the entire state on every change
  useEffect(() => {
    setIsSaving(true);
    const dataString = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, dataString);
    
    // Smooth saving indicator
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [state]);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => updater(prev));
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (unlockInput === state.settings.password) {
      updateState(s => ({ ...s, settings: { ...s.settings, isLocked: false } }));
      setUnlockInput('');
      setRecoveryMode('login');
    } else {
      alert("Password incorrect. Please try again.");
    }
  };

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.settings.recoveryEmail && recoveryEmailInput.trim().toLowerCase() === state.settings.recoveryEmail.toLowerCase()) {
      setRecoveryMode('reset');
    } else {
      alert("Verification failed. The email address provided does not match our records.");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      alert("Passwords do not match.");
      return;
    }
    updateState(s => ({
      ...s,
      settings: { ...s.settings, password: newPasswordInput, isLocked: false }
    }));
    alert("Password reset successfully. You are now logged in.");
    setRecoveryMode('login');
    setUnlockInput('');
    setRecoveryEmailInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
  };

  const logout = () => {
    if (!state.settings.password) {
      alert("To lock the app, please set an App Password in Settings first.");
      setActiveSection(AppSection.SETTINGS);
      return;
    }
    if (confirm("Are you sure you want to logout and lock the session?")) {
      // Security Sweep: Ensure UI resets and data is protected
      updateState(s => ({ ...s, settings: { ...s.settings, isLocked: true } }));
      setActiveSection(AppSection.HOME);
      setRecoveryMode('login');
      setUnlockInput('');
    }
  };

  const isInventoryComplete = useMemo(() => {
    return state.categories.every(c => c.isCompleted);
  }, [state.categories]);

  const handleNavigation = (section: AppSection) => {
    const isPhase1Done = state.progress.simplifiedPrayerFinished;
    
    if (section === AppSection.LIST_PREP && !isPhase1Done) {
      alert("Phase 2: The Roots is currently locked. Please complete Phase 1 first.");
      return;
    }

    if (section === AppSection.DEEP_PRAYER && !isInventoryComplete) {
      alert("Phase 3: The Freedom is currently locked. Please complete your Phase 2 inventory categories first.");
      return;
    }
    
    setActiveSection(section);
  };

  // Login Screen / Gatekeeper with Recovery
  if (state.settings.isLocked && state.settings.password) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-6 z-[2000] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500 border border-slate-100 relative z-10">
          
          {recoveryMode === 'login' && (
            <>
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-indigo-100">🔒</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 serif-font">Locked Session</h2>
                <p className="text-slate-500 text-sm font-medium">Enter your app password to continue your journey.</p>
              </div>
              <form onSubmit={handleUnlock} className="space-y-6">
                <input 
                  type="password" 
                  autoFocus
                  value={unlockInput}
                  onChange={(e) => setUnlockInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none text-center font-bold text-3xl tracking-[0.3em] shadow-inner transition-all"
                />
                <div className="flex flex-col gap-4">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
                    Unlock Framework
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setRecoveryMode('forgot')}
                    className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          )}

          {recoveryMode === 'forgot' && (
            <>
              <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-rose-100">📧</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 serif-font">Recovery</h2>
                <p className="text-slate-500 text-sm font-medium">Please enter your registered recovery email address to verify your identity.</p>
              </div>
              <form onSubmit={handlePasswordRecovery} className="space-y-6">
                <input 
                  type="email" 
                  autoFocus
                  required
                  value={recoveryEmailInput}
                  onChange={(e) => setRecoveryEmailInput(e.target.value)}
                  placeholder="recovery@email.com"
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white outline-none text-center font-bold text-lg shadow-inner transition-all"
                />
                <div className="flex flex-col gap-4">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
                    Verify Identity
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setRecoveryMode('login')}
                    className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}

          {recoveryMode === 'reset' && (
            <>
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-emerald-100">✨</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 serif-font">Reset Password</h2>
                <p className="text-slate-500 text-sm font-medium">Verification successful. Choose a new secure password.</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-6 text-left">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1 block">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="New Password"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1 block">Confirm Password</label>
                    <input 
                      type="password" 
                      required
                      value={confirmNewPasswordInput}
                      onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95">
                  Update & Login
                </button>
              </form>
            </>
          )}

          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] pt-4">Freedom Prayer Framework • v2.17</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.HOME: return <Home state={state} onNavigate={handleNavigation} />;
      case AppSection.ISSUE_TRACKER: return <IssueGrid state={state} updateState={updateState} onNavigate={handleNavigation} />;
      case AppSection.SIMPLIFIED_PRAYER: return <SimplifiedPrayer state={state} updateState={updateState} onNavigate={handleNavigation} />;
      case AppSection.LIST_PREP: return <ListPrep state={state} updateState={updateState} onNavigate={handleNavigation} />;
      case AppSection.DEEP_PRAYER: return <PrayerJourney state={state} updateState={updateState} onNavigate={handleNavigation} />;
      case AppSection.SETTINGS: return <Settings state={state} updateState={updateState} />;
      case AppSection.DEVELOPER: return <DeveloperTools state={state} updateState={updateState} />;
      default: return <Home state={state} onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleNavigation} 
        isSaving={isSaving}
        onLogout={logout}
        showDevTools={state.settings.showDevTools}
        isInventoryComplete={isInventoryComplete}
      />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 h-screen custom-scrollbar selection:bg-indigo-100 relative">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {renderContent()}
        </div>
      </main>
      
      <div className={`fixed bottom-24 md:bottom-8 right-8 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 flex items-center gap-3 pointer-events-none z-[100] ${isSaving ? 'bg-indigo-900 text-white opacity-100 translate-y-0 shadow-2xl' : 'bg-transparent text-transparent opacity-0 translate-y-6'}`}>
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
        Syncing to Device
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LayoutDashboard, Scale, HandsPraying, 
  ClipboardList, Sparkles, Settings, LogOut, Plus, Trash2, Lock
} from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ category: 'Emotional', description: '', intensity: 5 });

  useEffect(() => {
    const saved = localStorage.getItem('freedom_issues');
    if (saved) setIssues(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('freedom_issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = () => {
    if (!newIssue.description) return;
    const issue = { ...newIssue, id: Date.now().toString(), date: new Date().toLocaleDateString() };
    setIssues([issue, ...issues]);
    setNewIssue({ category: 'Emotional', description: '', intensity: 5 });
  };

  const NavItem = ({ icon: Icon, label, view, active, locked = false }) => (
    <button
      onClick={() => !locked && setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
      } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <Icon size={20} />
      <span className="font-bold tracking-tight">{label}</span>
      {locked && <Lock size={14} className="ml-auto" />}
    </button>
  );

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 p-12 text-center border border-slate-100">
          <div className="inline-flex p-5 bg-indigo-600 rounded-3xl text-white mb-8 shadow-xl shadow-indigo-200">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Freedom</h1>
          <p className="text-slate-400 font-bold mb-10 uppercase tracking-[0.2em] text-[10px]">Digital Framework</p>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-lg"
          >
            Enter Sanctuary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-8 space-y-10">
        <div className="flex items-center space-x-4 px-2">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <ShieldCheck size={28} />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter block leading-none">Freedom</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Digital Framework</span>
          </div>
        </div>

        <nav className="flex-1 space-y-8">
          <div>
            <NavItem icon={LayoutDashboard} label="Mission Control" view="dashboard" active={currentView === 'dashboard'} />
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-4">Phase 1: Identify</div>
            <NavItem icon={Scale} label="Issue Tracker" view="tracker" active={currentView === 'tracker'} />
            <NavItem icon={HandsPraying} label="Initial Relief" view="relief" active={currentView === 'relief'} />
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-4">Phase 2: Roots</div>
            <NavItem icon={ClipboardList} label="Inventory Prep" view="inventory" active={currentView === 'inventory'} />

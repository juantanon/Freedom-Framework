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

  // --- Sub-Components ---
  const NavItem = ({ icon: Icon, label, view, active, locked = false }) => (
    <button
      onClick={() => !locked && setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
      } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <Icon size={20} />
      <span className="font-semibold tracking-tight">{label}</span>
      {locked && <Lock size={14} className="ml-auto" />}
    </button>
  );

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 p-12 text-center border border-slate-100">
          <div className="inline-flex p-5 bg-indigo-600 rounded-3xl text-white mb-8 shadow-xl shadow-indigo-200">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Freedom</h1>
          <p className="text-slate-400 font-medium mb-10 uppercase tracking-[0.2em] text-xs">Digital Framework</p>
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
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar - Restored from Premium Mockup */}
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
            <NavItem icon={HandsPraying} label="Initial Relief" view="relief" locked={true} />
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-4">Phase 2: Roots</div>
            <NavItem icon={ClipboardList} label="Inventory Prep" view="inventory" locked={true} />
          </div>
        </nav>

        <div className="pt-8 border-t border-slate-100 space-y-2">
          <NavItem icon={Settings} label="App Settings" view="settings" locked={true} />
          <button onClick={() => setCurrentView('login')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-bold transition-all">
            <LogOut size={20} />
            <span>Logout and Lock</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16 overflow-y-auto">
        {currentView === 'dashboard' ? (
          <div className="max-w-5xl mx-auto space-y-16">
            <header className="space-y-6">
              <h1 className="text-[8rem] font-light text-slate-900 leading-[0.9] serif-font -ml-2 tracking-tighter">Welcome Home.</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">A guided path to walk out the freedom Christ has for you.</p>
            </header>
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="text-slate-400 uppercase tracking-widest text-xs font-black">Active Journey</h3>
                  <p className="text-4xl font-bold text-slate-900">You have <span className="text-indigo-600">{issues.length}</span> items logged.</p>
               </div>
               <button onClick={() => setCurrentView('tracker')} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-xl">Open Tracker</button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            <header className="flex items-end justify-between border-b border-slate-200 pb-10">
              <div className="space-y-2">
                <h2 className="text-5xl font-light text-slate-900 serif-font">Issue Tracker</h2>
                <p className="text-slate-400 font-medium">Be honest and specific. What are you feeling right now?</p>
              </div>
            </header>

            <div className="bg-white p-10 rounded-[2.5rem] border border-indigo-50 shadow-sm space-y-6">
              <div className="flex items-center space-x-4">
                <select 
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Emotional</option><option>Physical</option><option>Relational</option><option>Spiritual</option>
                </select>
                <input 
                  type="text" placeholder="Describe the symptom..."
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button onClick={addIssue} className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"><Plus size={28} /></button>
              </div>
            </div>

            <div className="space-y-6">
              {issues.map(issue => (
                <div key={issue.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{issue.category}</span>
                    <p className="text-2xl font-bold text-slate-800 tracking-tight">{issue.description}</p>
                  </div>
                  <button onClick={() => setIssues(issues.filter(i => i.id !== issue.id))} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={24} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

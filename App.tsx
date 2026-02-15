import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LayoutDashboard, Scale, HandsPraying, 
  ClipboardList, Sparkles, Settings, LogOut, Plus, Trash2, AlertCircle 
} from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ category: 'Emotional', description: '', intensity: 5 });

  // Load data on start
  useEffect(() => {
    const saved = localStorage.getItem('freedom_issues');
    if (saved) setIssues(JSON.parse(saved));
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('freedom_issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = () => {
    if (!newIssue.description) return;
    const issue = {
      ...newIssue,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString()
    };
    setIssues([issue, ...issues]);
    setNewIssue({ category: 'Emotional', description: '', intensity: 5 });
  };

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <div className="inline-flex p-4 bg-indigo-600 rounded-2xl text-white mb-6">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Freedom Framework</h1>
          <p className="text-slate-500 mb-8">Your digital sanctuary for growth.</p>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Enter Sanctuary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white"><ShieldCheck size={24} /></div>
          <span className="text-xl font-bold text-slate-800">Freedom</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutDashboard size={20} /> <span className="font-medium">Mission Control</span>
          </button>
          <button onClick={() => setCurrentView('tracker')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${currentView === 'tracker' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Scale size={20} /> <span className="font-medium">Issue Tracker</span>
          </button>
        </nav>
        <button onClick={() => setCurrentView('login')} className="flex items-center space-x-3 px-4 py-3 text-rose-500 font-medium"><LogOut size={20} /><span>Logout</span></button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        {currentView === 'dashboard' ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl font-light text-slate-900 leading-tight">Welcome Home.</h1>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-xl text-slate-500">You have <span className="text-indigo-600 font-bold">{issues.length}</span> active items in your tracker.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-light text-slate-900">Issue Tracker</h2>
            <div className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-sm space-y-4">
              <div className="flex space-x-4">
                <select 
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                  className="px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Emotional</option><option>Physical</option><option>Relational</option><option>Spiritual</option>
                </select>
                <input 
                  type="text" placeholder="What are you feeling?"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  className="flex-1 px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={addIssue} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"><Plus size={24} /></button>
              </div>
            </div>
            <div className="space-y-4">
              {issues.map(issue => (
                <div key={issue.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{issue.category}</span>
                    <p className="text-slate-800 font-medium text-lg">{issue.description}</p>
                  </div>
                  <button onClick={() => setIssues(issues.filter(i => i.id !== issue.id))} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
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

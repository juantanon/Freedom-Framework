import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Scale, 
  HandsPraying, 
  ClipboardList, 
  Sparkles, 
  Settings, 
  LogOut,
  Mail,
  Lock,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

// --- Types ---
type View = 'login' | 'signup' | 'dashboard' | 'issue-tracker' | 'initial-relief' | 'inventory-prep' | 'settings';
interface Issue {
  id: string;
  category: string;
  description: string;
  intensity: number;
  date: string;
}

const App = () => {
  const [currentView, setCurrentView] = useState<View>('login');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssue, setNewIssue] = useState({ category: 'Emotional', description: '', intensity: 5 });

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('freedom_issues');
    if (saved) setIssues(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('freedom_issues', JSON.stringify(issues));
  }, [issues]);

  // --- Logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ email: 'test@freedom.com' });
    setCurrentView('dashboard');
  };

  const addIssue = () => {
    if (!newIssue.description) return;
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString()
    };
    setIssues([issue, ...issues]);
    setNewIssue({ category: 'Emotional', description: '', intensity: 5 });
  };

  const deleteIssue = (id: string) => {
    setIssues(issues.filter(i => i.id !== id));
  };

  // --- UI Components ---
  const SidebarItem = ({ icon: Icon, label, view, active, locked }: any) => (
    <button
      onClick={() => !locked && setCurrentView(view)}
      disabled={locked}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
      } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {locked && <Lock size={14} className="ml-auto" />}
    </button>
  );

  // --- Auth & Wrapper Screens ---
  if (currentView === 'login' || currentView === 'signup') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-center text-white">
            <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Freedom Framework</h1>
            <p className="text-indigo-100 mt-2">Your digital sanctuary for growth.</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Freedom</span>
        </div>
        <nav className="flex-1 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Main</div>
          <SidebarItem icon={LayoutDashboard} label="Mission Control" view="dashboard" active={currentView === 'dashboard'} />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 mt-8">Phase 1: Identify</div>
          <SidebarItem icon={Scale} label="Issue Tracker" view="issue-tracker" active={currentView === 'issue-tracker'} />
          <SidebarItem icon={HandsPraying} label="Initial Relief" view="initial-relief" active={currentView === 'initial-relief'} />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 mt-8">Phase 2: Roots</div>
          <SidebarItem icon={ClipboardList} label="Inventory Prep" view="inventory-prep" active={currentView === 'inventory-prep'} />
        </nav>
        <button onClick={() => setCurrentView('login')} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-medium">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-12">
        {currentView === 'dashboard' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <header className="space-y-4">
              <h1 className="text-7xl font-light text-slate-900 serif-font tracking-tight">Welcome Home.</h1>
              <p className="text-xl text-slate-500 font-medium">Your tracker currently has <span className="text-indigo-600 font-bold">{issues.length}</span> active items.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Identify', 'Prepare', 'Freedom'].map((step, i) => (
                <div key={step} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-4">{i+1}</div>
                  <h3 className="text-xl font-bold text-slate-800">{step}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'issue-tracker' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <header>
              <h2 className="text-4xl font-light text-slate-900 serif-font">Issue Tracker</h2>
              <p className="text-slate-500 mt-2 font-medium">Be honest and specific. What are you feeling right now?</p>
            </header>

            {/* Input Card */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select 
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Emotional</option>
                  <option>Physical</option>
                  <option>Relational</option>
                  <option>Spiritual</option>
                </select>
                <div className="flex items-center space-x-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-sm font-bold text-slate-400">Intensity:</span>
                  <input 
                    type="range" min="1" max="10" 
                    value={newIssue.intensity}
                    onChange={(e) => setNewIssue({...newIssue, intensity: parseInt(e.target.value)})}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-bold text-indigo-600 w-4">{newIssue.intensity}</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Describe what is happening (e.g., Sudden anxiety when checking email)" 
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={addIssue} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  <Plus size={24} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {issues.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <AlertCircle className="mx-auto text-slate-300 mb-2" size={48} />
                  <p className="text-slate-400 font-medium">No items logged yet. Begin your journey above.</p>
                </div>
              )}
              {issues.map((issue) => (
                <div key={issue.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group transition-all hover:border-indigo-200">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md uppercase tracking-wider">{issue.category}</span>
                      <span className="text-xs text-slate-400">{issue.date}</span>
                    </div>
                    <p className="text-slate-800 font-medium text-lg">{issue.description}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase">Intensity</div>
                      <div className="text-xl font-black text-slate-700">{issue.intensity}<span className="text-sm text-slate-300">/10</span></div>
                    </div>
                    <button onClick={() => deleteIssue(issue.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={20} />
                    </button>
                  </div>
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

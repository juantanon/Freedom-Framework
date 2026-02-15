
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
  UserPlus
} from 'lucide-react';

// --- Types ---
type View = 'login' | 'signup' | 'dashboard' | 'issue-tracker' | 'initial-relief' | 'inventory-prep' | 'settings';

const App = () => {
  const [currentView, setCurrentView] = useState<View>('login');
  const [user, setUser] = useState<{ email: string } | null>(null);

  // --- Auth Logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ email: 'test@freedom.com' });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
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

  // --- Auth Screen ---
  if (currentView === 'login' || currentView === 'signup') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-8 text-center text-white">
            <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold">Freedom Framework</h1>
            <p className="text-indigo-100 mt-2">Your digital sanctuary for growth.</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
              {currentView === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => setCurrentView(currentView === 'login' ? 'signup' : 'login')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                {currentView === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Main Dashboard ---
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
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 mt-8">Phase 3: Freedom</div>
          <SidebarItem icon={Sparkles} label="Deep Clean Journey" view="dashboard" locked={true} />
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-1">
          <SidebarItem icon={Settings} label="App Settings" view="settings" active={currentView === 'settings'} />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout and Lock</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-12">
        {currentView === 'dashboard' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <header className="space-y-4">
              <h1 className="text-7xl font-light text-slate-900 serif-font tracking-tight">Welcome Home.</h1>
              <p className="text-xl text-slate-500 font-medium">A guided path to walk out the freedom Christ has for you.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: 1, title: 'Identify', desc: 'Name the struggles and symptoms clearly in your life.' },
                { step: 2, title: 'Prepare', desc: 'Systematically find the roots using the 18-category inventory.' },
                { step: 3, title: 'Freedom', desc: 'Break agreements, repent, and receive lasting peace.' }
              ].map((item) => (
                <div key={item.step} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </section>
          </div>
        )}

        {currentView !== 'dashboard' && (
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
             <div className="p-6 bg-slate-100 rounded-full text-slate-400">
                <LayoutDashboard size={48} />
             </div>
             <h2 className="text-2xl font-bold text-slate-800">{currentView.replace('-', ' ').toUpperCase()}</h2>
             <p className="text-slate-500">This module is currently being finalized in Phase 1 & 2 development.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

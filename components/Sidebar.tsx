
import React from 'react';
import { AppSection } from '../types';

interface SidebarProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  isSaving?: boolean;
  onLogout: () => void;
  showDevTools: boolean;
  isInventoryComplete: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isSaving, onLogout, showDevTools, isInventoryComplete }) => {
  
  const NavButton = ({ id, label, icon, locked }: { id: AppSection, label: string, icon: string, locked?: boolean }) => (
    <button
      onClick={() => onSectionChange(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-bold ${
        activeSection === id
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
          : locked ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </div>
      {locked && <span className="text-[10px]">🔒</span>}
    </button>
  );

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="px-4 mt-8 mb-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
    </div>
  );

  return (
    <aside className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:relative md:w-72 md:border-t-0 md:border-r md:flex md:flex-col shadow-2xl md:shadow-none h-auto md:h-screen transition-all duration-300">
      <div className="hidden md:flex flex-col p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-100 font-bold border-2 border-indigo-500/50">✝️</div>
          <div>
            <h1 className="font-bold text-slate-900 tracking-tight text-lg leading-none">Freedom</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Digital Framework</span>
          </div>
        </div>
      </div>
      
      <nav className="hidden md:flex flex-col p-6 overflow-y-auto custom-scrollbar flex-1 space-y-1">
        <NavButton id={AppSection.HOME} label="Mission Control" icon="🏠" />

        <SectionHeader label="Phase 1: Identify" />
        <NavButton id={AppSection.ISSUE_TRACKER} label="Issue Tracker" icon="⚖️" />
        <NavButton id={AppSection.SIMPLIFIED_PRAYER} label="Initial Relief" icon="🙏" />

        <SectionHeader label="Phase 2: Roots" />
        <NavButton id={AppSection.LIST_PREP} label="Inventory Prep" icon="📝" />

        <SectionHeader label="Phase 3: Freedom" />
        <NavButton id={AppSection.DEEP_PRAYER} label="Deep Clean Journey" icon="🕊️" locked={!isInventoryComplete} />

        <SectionHeader label="System Management" />
        <NavButton id={AppSection.SETTINGS} label="App Settings" icon="⚙️" />
        {showDevTools && (
          <NavButton id={AppSection.DEVELOPER} label="Framework Admin" icon="📚" />
        )}

        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all text-sm font-bold group"
            title="Logout and Lock Session"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🔒</span>
            <span>Logout and Lock</span>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV BAR */}
      <nav className="flex md:hidden justify-around p-3 bg-white border-t border-slate-100">
        <button onClick={() => onSectionChange(AppSection.HOME)} className={`p-2 rounded-xl flex flex-col items-center transition-all ${activeSection === AppSection.HOME ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => onSectionChange(AppSection.ISSUE_TRACKER)} className={`p-2 rounded-xl flex flex-col items-center transition-all ${activeSection === AppSection.ISSUE_TRACKER ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <span className="text-2xl">⚖️</span>
          <span className="text-[10px] font-bold">Tracker</span>
        </button>
        <button onClick={() => onSectionChange(AppSection.LIST_PREP)} className={`p-2 rounded-xl flex flex-col items-center transition-all ${activeSection === AppSection.LIST_PREP ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <span className="text-2xl">📝</span>
          <span className="text-[10px] font-bold">Roots</span>
        </button>
        <button onClick={() => onSectionChange(AppSection.DEEP_PRAYER)} className={`p-2 rounded-xl flex flex-col items-center transition-all ${activeSection === AppSection.DEEP_PRAYER ? 'text-indigo-600 scale-110' : !isInventoryComplete ? 'text-slate-200' : 'text-slate-400'}`}>
          <span className="text-2xl">{!isInventoryComplete ? '🔒' : '🕊️'}</span>
          <span className="text-[10px] font-bold">Freedom</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;

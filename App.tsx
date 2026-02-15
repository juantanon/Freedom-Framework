import React, { useState } from 'react';

// ------------------------------------------------
// DATA TYPES
// ------------------------------------------------
interface Issue {
  id: number;
  text: string;
  date: string;
  status: 'identify' | 'ready_for_prayer';
}

type View = 'LOGIN' | 'DASHBOARD' | 'PHASE_1' | 'SETTINGS';

function App() {
  // ------------------------------------------------
  // STATE
  // ------------------------------------------------
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  
  // Issue Tracker State
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssue, setNewIssue] = useState('');

  const SECRET_CODE = "1234";

  // ------------------------------------------------
  // ACTIONS
  // ------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === SECRET_CODE) {
      setCurrentView('DASHBOARD');
      setError('');
    } else {
      setError('Incorrect passcode.');
    }
  };

  const addIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.trim()) return;
    const issue: Issue = {
      id: Date.now(),
      text: newIssue,
      date: new Date().toLocaleDateString(),
      status: 'identify'
    };
    setIssues([issue, ...issues]);
    setNewIssue('');
  };

  const deleteIssue = (id: number) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  // ------------------------------------------------
  // COMPONENTS (Sidebar & Layout)
  // ------------------------------------------------
  
  const Sidebar = () => (
    <div style={styles.sidebar}>
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>+</div>
        <div>
          <h2 style={styles.logoTitle}>Freedom</h2>
          <p style={styles.logoSubtitle}>DIGITAL FRAMEWORK</p>
        </div>
      </div>

      <nav style={styles.nav}>
        <button 
          onClick={() => setCurrentView('DASHBOARD')}
          style={currentView === 'DASHBOARD' ? styles.navItemActive : styles.navItem}
        >
          🏠 Mission Control
        </button>

        <div style={styles.navSectionLabel}>PHASE 1: IDENTIFY</div>
        <button 
          onClick={() => setCurrentView('PHASE_1')}
          style={currentView === 'PHASE_1' ? styles.navItemActive : styles.navItem}
        >
          ⚖️ Issue Tracker
        </button>
        <button style={styles.navItemLocked}>🙏 Initial Relief 🔒</button>

        <div style={styles.navSectionLabel}>PHASE 2: ROOTS</div>
        <button style={styles.navItemLocked}>📝 Inventory Prep 🔒</button>

        <div style={styles.navSectionLabel}>SYSTEM</div>
        <button onClick={() => setCurrentView('LOGIN')} style={styles.navItem}>
          🔓 Logout
        </button>
      </nav>
    </div>

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

type View = 'LOGIN' | 'DASHBOARD' | 'PHASE_1';

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

  const markReady = (id: number) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, status: 'ready_for_prayer' } : issue
    ));
  };

  const deleteIssue = (id: number) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  // ------------------------------------------------
  // VIEW 1: LOGIN
  // ------------------------------------------------
  if (currentView === 'LOGIN') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Prayer of Freedom</h1>
          <p style={styles.subtitle}>Private Workspace</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="Enter Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Enter App</button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW 2: DASHBOARD (HOME BASE)
  // ------------------------------------------------
  if (currentView === 'DASHBOARD') {
    return (
      <div style={styles.appContainer}>
        <header style={styles.header}>
          <h2>Freedom Framework</h2>
          <button onClick={() => navigateTo('LOGIN')} style={styles.logoutBtn}>Lock</button>
        </header>

        <main style={styles.mainContent}>
          <div style={styles.welcomeSection}>
            <h1>Welcome to Your Freedom Journey</h1>
            <p>Select a phase below to begin your work today.</p>
          </div>

          <div style={styles.grid}>
            {/* CARD 1: IDENTIFY (Active) */}
            <div style={styles.activeCard} onClick={() => navigateTo('PHASE_1')}>
              <div style={styles.cardHeader}>
                <span style={styles.stepNumber}>01</span>
                <h3>Identify</h3>
              </div>
              <p>Log your burdens and anxieties. Identify what is stealing your peace.</p>
              <button style={styles.cardButton}>Open Tracker &rarr;</button>
            </div>

            {/* CARD 2: ROOTS (Coming Soon) */}
            <div style={styles.lockedCard}>
              <div style={styles.cardHeader}>
                <span style={styles.stepNumberLocked}>02</span>
                <h3>Roots</h3>
              </div>
              <p>Trace the lies back to their source.</p>
              <span style={styles.comingSoon}>Coming Soon</span>
            </div>

            {/* CARD 3: PRAYER (Coming Soon) */}
            <div style={styles.lockedCard}>
              <div style={styles.cardHeader}>
                <span style={styles.stepNumberLocked}>03</span>
                <h3>Prayer</h3>
              </div>
              <p>Bring the truth into the light.</p>
              <span style={styles.comingSoon}>Coming Soon</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW 3: PHASE 1 (ISSUE TRACKER)
  // ------------------------------------------------
  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <button onClick={() => navigateTo('DASHBOARD')} style={styles.backBtn}>&larr; Back</button>
          <h2>Phase 1: Identify</h2>
        </div>
        <button onClick={() => navigateTo('LOGIN')} style={styles.logoutBtn}>Lock</button>
      </header>

      <main style={styles.mainContent}>
        <section style={styles.inputSection}>
          <p style={styles.instructionText}>What is on your mind right now?</p>
          <form onSubmit={addIssue} style={styles.addForm}>
            <input
              type="text"
              placeholder="I am feeling anxious about..."
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              style={styles.mainInput}
            />
            <button type="submit" style={styles.addButton}>Add</button>
          </form>
        </section>

        <div style={styles.listContainer}>
          {issues.length === 0 ? (
            <p style={styles.emptyState}>Your list is empty.</p>
          ) : (
            issues.map(issue => (
              <div key={issue.id} style={styles.issueCard}>
                <div style={styles.issueContent}>
                  <span style={styles.date}>{issue.date}</span>
                  <p style={styles.issueText}>{issue.text}</p>
                </div>
                <div style={styles.actions}>
                   <button onClick={() => deleteIssue(issue.id)} style={styles.deleteBtn}>X</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// ------------------------------------------------
// STYLES
// ------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  // Login & Shared
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eef2f3', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: 'white', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '90%' },
  title: { color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.8rem' },
  subtitle: { color: '#95a5a6', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '16px', outline: 'none', transition: 'border 0.3s' },
  button: { padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#34495e', color: 'white', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#e74c3c', marginTop: '1rem' },

  // Dashboard Styles
  appContainer: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  header: { backgroundColor: '#ffffff', color: '#2c3e50', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid #bdc3c7', color: '#7f8c8d', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  mainContent: { padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' },
  welcomeSection: { marginBottom: '40px', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  
  // Dashboard Cards
  activeCard: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(52, 152, 219, 0.15)', cursor: 'pointer', border: '2px solid #3498db', transition: 'transform 0.2s' },
  lockedCard: { backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', opacity: 0.7 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  stepNumber: { fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' },
  stepNumberLocked: { fontSize: '1.5rem', fontWeight: 'bold', color: '#bdc3c7' },
  cardButton: { marginTop: '20px', backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  comingSoon: { display: 'inline-block', marginTop: '20px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#95a5a6', border: '1px solid #bdc3c7', padding: '5px 10px', borderRadius: '20px' },

  // Phase 1 Styles
  backBtn: { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#34495e', marginRight: '10px' },
  inputSection: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
  instructionText: { fontSize: '1.2rem', color: '#34495e', marginBottom: '20px' },
  addForm: { display: 'flex', gap: '15px' },
  mainInput: { flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '16px' },
  addButton: { padding: '0 30px', borderRadius: '8px', border: 'none', backgroundColor: '#27ae60', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  issueCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  issueContent: { textAlign: 'left' },
  date: { fontSize: '0.8rem', color: '#bdc3c7', marginBottom: '5px', display: 'block' },
  issueText: { fontSize: '1.1rem', color: '#2c3e50', margin: 0 },
  deleteBtn: { backgroundColor: '#fab1a0', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' },
  emptyState: { textAlign: 'center', color: '#bdc3c7', fontSize: '1.1rem', marginTop: '40px' }
};

export default App;

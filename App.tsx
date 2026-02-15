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

function App() {
  // ------------------------------------------------
  // STATE (The "Memory" of the App)
  // ------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  
  // Issue Tracker State
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssue, setNewIssue] = useState('');

  const SECRET_CODE = "1234";

  // ------------------------------------------------
  // ACTIONS (What the App Does)
  // ------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === SECRET_CODE) {
      setIsAuthenticated(true);
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

  // ------------------------------------------------
  // VIEW 1: THE LOGIN GATEWAY
  // ------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Prayer of Freedom</h1>
          <p style={styles.subtitle}>Enter passcode to enter.</p>
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
  // VIEW 2: THE MAIN APP (Active)
  // ------------------------------------------------
  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h2>Prayer of Freedom</h2>
        <button onClick={() => setIsAuthenticated(false)} style={styles.logoutBtn}>
          Lock App
        </button>
      </header>

      <main style={styles.mainContent}>
        {/* INPUT SECTION */}
        <section style={styles.inputSection}>
          <h1 style={styles.phaseTitle}>Phase 1: Identify</h1>
          <p style={styles.instructionText}>What is stealing your peace today?</p>
          
          <form onSubmit={addIssue} style={styles.addForm}>
            <input
              type="text"
              placeholder="e.g., Fear of failure, Anger at neighbor..."
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              style={styles.mainInput}
            />
            <button type="submit" style={styles.addButton}>
              Add Issue
            </button>
          </form>
        </section>

        {/* LIST SECTION */}
        <div style={styles.listContainer}>
          {issues.length === 0 ? (
            <p style={styles.emptyState}>No issues tracked yet. You are free!</p>
          ) : (
            issues.map(issue => (
              <div key={issue.id} style={styles.issueCard}>
                <div style={styles.issueContent}>
                  <span style={styles.date}>{issue.date}</span>
                  <p style={styles.issueText}>{issue.text}</p>
                </div>
                <div style={styles.actions}>
                  {issue.status === 'identify' ? (
                    <button onClick={() => markReady(issue.id)} style={styles.actionBtn}>
                      Prepare for Prayer
                    </button>
                  ) : (
                    <span style={styles.readyBadge}>Ready for Phase 2</span>
                  )}
                  <button onClick={() => deleteIssue(issue.id)} style={styles.deleteBtn}>
                    X
                  </button>
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
  // Login Styles (Same as before)
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '90%' },
  title: { color: '#2c3e50', marginBottom: '0.5rem' },
  subtitle: { color: '#7f8c8d', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' },
  button: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#3498db', color: 'white', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#e74c3c', marginTop: '1rem', fontSize: '14px' },
  
  // App Styles
  appContainer: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' },
  header: { backgroundColor: '#2c3e50', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  mainContent: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  
  // Phase 1 Styles
  inputSection: { textAlign: 'center', marginBottom: '2rem' },
  phaseTitle: { color: '#2c3e50', marginBottom: '0.5rem' },
  instructionText: { color: '#7f8c8d', fontSize: '1.1rem', marginBottom: '1.5rem' },
  addForm: { display: 'flex', gap: '10px' },
  mainInput: { flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  addButton: { padding: '0 20px', borderRadius: '8px', border: 'none', backgroundColor: '#27ae60', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  
  // List Styles
  listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  issueCard: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  issueContent: { textAlign: 'left' },
  date: { fontSize: '0.8rem', color: '#95a5a6', display: 'block', marginBottom: '4px' },
  issueText: { fontSize: '1.1rem', color: '#34495e', margin: 0 },
  actions: { display: 'flex', gap: '10px', alignItems: 'center' },
  actionBtn: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  readyBadge: { backgroundColor: '#e8f6f3', color: '#16a085', padding: '6px 10px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emptyState: { textAlign: 'center', color: '#bdc3c7', fontStyle: 'italic', marginTop: '2rem' }
};

export default App;

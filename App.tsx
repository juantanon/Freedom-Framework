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
  );

  // ------------------------------------------------
  // VIEW 1: LOGIN (Clean & Centered)
  // ------------------------------------------------
  if (currentView === 'LOGIN') {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.serifTitle}>Prayer of Freedom</h1>
          <p style={styles.subtitle}>Enter your passcode to access your private workspace.</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={styles.loginInput}
            />
            <button type="submit" style={styles.loginButton}>Enter App</button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW 2: DASHBOARD (The "Mission Control" Look)
  // ------------------------------------------------
  return (
    <div style={styles.layout}>
      <Sidebar />
      
      <main style={styles.main}>
        {currentView === 'DASHBOARD' && (
          <div style={styles.contentContainer}>
            <h1 style={styles.bigSerifTitle}>Welcome Home.</h1>
            <p style={styles.heroSubtitle}>A guided path to walk out the freedom Christ has for you.</p>
            
            <h3 style={styles.sectionHeader}>How to Walk This Out</h3>
            <p style={styles.sectionSub}>THE THREE-STEP PROCESS</p>

            <div style={styles.grid}>
              {/* Card 1 */}
              <div style={styles.processCard}>
                <div style={styles.stepBadge}>1</div>
                <h3 style={styles.cardTitle}>Identify</h3>
                <p style={styles.cardText}>Name the struggles and symptoms clearly in your life.</p>
              </div>

              {/* Card 2 */}
              <div style={styles.processCard}>
                <div style={styles.stepBadgeSecondary}>2</div>
                <h3 style={styles.cardTitle}>Prepare</h3>
                <p style={styles.cardText}>Systematically find the roots using the 18-category inventory.</p>
              </div>

              {/* Card 3 */}
              <div style={styles.processCard}>
                <div style={styles.stepBadgeSecondary}>3</div>
                <h3 style={styles.cardTitle}>Freedom</h3>
                <p style={styles.cardText}>Break agreements, repent, and receive lasting peace.</p>
              </div>
            </div>

            <button onClick={() => setCurrentView('PHASE_1')} style={styles.ctaButton}>
              Begin Phase 1 &rarr;
            </button>
          </div>
        )}

        {currentView === 'PHASE_1' && (
          <div style={styles.contentContainer}>
            <h1 style={styles.serifTitle}>Phase 1: Identify</h1>
            <p style={styles.subtitle}>What is stealing your peace today?</p>
            
            <div style={styles.trackerBox}>
              <form onSubmit={addIssue} style={styles.trackerForm}>
                <input
                  type="text"
                  placeholder="e.g. Fear of the future..."
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  style={styles.trackerInput}
                />
                <button type="submit" style={styles.trackerButton}>Add Issue</button>
              </form>
            </div>

            <div style={styles.issuesList}>
               {issues.length === 0 ? (
                <p style={styles.emptyState}>No issues tracked yet.</p>
              ) : (
                issues.map(issue => (
                  <div key={issue.id} style={styles.issueRow}>
                    <div>
                      <span style={styles.date}>{issue.date}</span>
                      <span style={styles.issueText}>{issue.text}</span>
                    </div>
                    <button onClick={() => deleteIssue(issue.id)} style={styles.deleteX}>×</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ------------------------------------------------
// STYLES (The "High-Fidelity" Look)
// ------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  // Layout
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: '"Inter", "Segoe UI", sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  contentContainer: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },

  // Sidebar Elements
  logoArea: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '40px' },
  logoIcon: { width: '32px', height: '32px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  logoTitle: { margin: 0, fontSize: '18px', color: '#111827', fontFamily: 'Georgia, serif' },
  logoSubtitle: { margin: 0, fontSize: '10px', color: '#6b7280', letterSpacing: '1px', fontWeight: 'bold' },
  
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navSectionLabel: { fontSize: '11px', color: '#9ca3af', fontWeight: 'bold', letterSpacing: '1px', marginTop: '20px', marginBottom: '8px' },
  navItem: { textAlign: 'left', backgroundColor: 'transparent', border: 'none', padding: '10px 12px', borderRadius: '8px', color: '#4b5563', cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s' },
  navItemActive: { textAlign: 'left', backgroundColor: '#4f46e5', border: 'none', padding: '10px 12px', borderRadius: '8px', color: 'white', cursor: 'default', fontSize: '14px', fontWeight: 500, boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' },
  navItemLocked: { textAlign: 'left', backgroundColor: 'transparent', border: 'none', padding: '10px 12px', borderRadius: '8px', color: '#d1d5db', cursor: 'not-allowed', fontSize: '14px' },

  // Typography
  bigSerifTitle: { fontSize: '48px', fontFamily: 'Georgia, serif', color: '#111827', margin: '0 0 16px 0', fontWeight: 'bold' },
  serifTitle: { fontSize: '32px', fontFamily: 'Georgia, serif', color: '#111827', marginBottom: '16px' },
  heroSubtitle: { fontSize: '18px', color: '#6b7280', marginBottom: '60px' },
  sectionHeader: { fontSize: '24px', fontFamily: 'Georgia, serif', color: '#111827', marginBottom: '8px' },
  sectionSub: { fontSize: '12px', color: '#9ca3af', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '32px', textTransform: 'uppercase' },
  subtitle: { fontSize: '16px', color: '#6b7280', marginBottom: '32px' },

  // Cards & Grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' },
  processCard: { backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', textAlign: 'center' },
  stepBadge: { width: '40px', height: '40px', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', margin: '0 auto 20px auto' },
  stepBadgeSecondary: { width: '40px', height: '40px', backgroundColor: '#f3f4f6', color: '#9ca3af', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', margin: '0 auto 20px auto' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
  cardText: { fontSize: '14px', color: '#6b7280', lineHeight: '1.5' },

  // Buttons & Interactions
  ctaButton: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '16px 48px', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', transition: 'transform 0.2s' },
  
  // Login Styles
  loginContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  loginCard: { backgroundColor: 'white', padding: '48px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', textAlign: 'center', width: '100%', maxWidth: '420px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' },
  loginInput: { padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '16px', textAlign: 'center', letterSpacing: '4px' },
  loginButton: { padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  error: { color: '#ef4444

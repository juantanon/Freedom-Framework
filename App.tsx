import React, { useState } from 'react';

// REMOVED the broken import link.
// All styles are now safely inside this file.

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  // The secret code to enter the app
  const SECRET_CODE = "1234";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === SECRET_CODE) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  // ------------------------------------------------
  // VIEW 1: THE LOGIN GATEWAY
  // ------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Prayer of Freedom</h1>
          <p style={styles.subtitle}>Enter your passcode to access your private workspace.</p>
          
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="Enter Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Enter App
            </button>
          </form>
          
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW 2: THE MAIN APP (Phase 1 & 2)
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
        <h3>Current Phase: Identify (Phase 1)</h3>
        <p>Your Issue Tracker and Inventory tools will go here.</p>
        
        {/* PLACEHOLDER FOR YOUR FUTURE MODULES */}
        <div style={styles.placeholderBox}>
          <p>Inventory Module Loading...</p>
        </div>
      </main>
    </div>
  );
}

// ------------------------------------------------
// STYLES (Internal for simplicity - works on Mobile & PC)
// ------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    marginTop: '1rem',
    fontSize: '14px',
  },
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  mainContent: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  placeholderBox: {
    border: '2px dashed #bdc3c7',
    padding: '40px',
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: '20px',
    borderRadius: '8px',
  }
};

export default App;

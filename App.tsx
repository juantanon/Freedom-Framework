import React, { useState, useEffect } from 'react';

// ------------------------------------------------
// DATA TYPES
// ------------------------------------------------
type CategoryKey = 
  | 'parent_child' | 'unforgiveness' | 'sexual_sin' 
  | 'generational' | 'occult' | 'word_curses' 
  | 'vows' | 'idolatry' | 'pride' 
  | 'abuse' | 'addictions' | 'false_religions' 
  | 'judgments' | 'other_sins' | 'agreements' 
  | 'influencers' | 'infirmity';

interface CategoryData {
  id: CategoryKey;
  title: string;
  videoNum: string;
  placeholder: string;
}

// The "Master List" from your Screenshots
const CATEGORIES: CategoryData[] = [
  { id: 'parent_child', title: 'Parent-Child Relationship', videoNum: '#1', placeholder: 'List specific wounds from father or mother...' },
  { id: 'unforgiveness', title: 'Unforgiveness', videoNum: '#2', placeholder: 'List names of people to forgive...' },
  { id: 'sexual_sin', title: 'Sexual Sin', videoNum: '#3', placeholder: 'List names/events to renounce...' },
  { id: 'generational', title: 'Generational Sin', videoNum: '#4', placeholder: 'List family patterns (divorce, anger, etc)...' },
  { id: 'occult', title: 'Occult / New Age', videoNum: '#5', placeholder: 'List activities (horoscopes, lodges, etc)...' },
  { id: 'word_curses', title: 'Word Curses', videoNum: '#6', placeholder: 'List negative words spoken over you...' },
  { id: 'vows', title: 'Inner Vows / Covenants', videoNum: '#7', placeholder: 'List vows ("I will never...") to break...' },
  { id: 'idolatry', title: 'Idolatry', videoNum: '#8', placeholder: 'List things put before God...' },
  { id: 'pride', title: 'Pride', videoNum: '#9', placeholder: 'List areas of self-reliance...' },
  { id: 'abuse', title: 'Abuse / Trauma', videoNum: '#10', placeholder: 'List specific traumatic events...' },
  { id: 'addictions', title: 'Addictions', videoNum: '#11', placeholder: 'List substances or habits...' },
  { id: 'false_religions', title: 'Other Religions', videoNum: '#12', placeholder: 'List participation in non-Christian groups...' },
  { id: 'judgments', title: 'Judgments', videoNum: '#13', placeholder: 'List critical judgments made against others...' },
  { id: 'other_sins', title: 'Other Sins', videoNum: '#14', placeholder: 'List any other unconfessed sins...' },
  { id: 'agreements', title: 'Agreement Sins', videoNum: '#15', placeholder: 'List agreements with lies...' },
  { id: 'influencers', title: 'Bad Influencers', videoNum: '#17', placeholder: 'List people who led you astray...' },
  { id: 'infirmity', title: 'Infirmity / Sickness', videoNum: '#18', placeholder: 'List physical ailments to pray over...' },
];

function App() {
  // ------------------------------------------------
  // STATE
  // ------------------------------------------------
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'INVENTORY'>('LOGIN');
  const [passcode, setPasscode] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryData | null>(null);
  
  // This stores your lists! 
  // format: { unforgiveness: "Uncle Bob", sexual_sin: "..." }
  const [inventory, setInventory] = useState<Record<string, string>>({});

  // LOAD SAVED DATA ON STARTUP
  useEffect(() => {
    const saved = localStorage.getItem('freedom_inventory');
    if (saved) {
      setInventory(JSON.parse(saved));
    }
  }, []);

  // SAVE DATA WHENEVER IT CHANGES
  const updateInventory = (key: string, text: string) => {
    const newInventory = { ...inventory, [key]: text };
    setInventory(newInventory);
    localStorage.setItem('freedom_inventory', JSON.stringify(newInventory));
  };

  const SECRET_CODE = "1234";

  // ------------------------------------------------
  // LOGIN LOGIC
  // ------------------------------------------------
  if (view === 'LOGIN') {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.card}>
          <h1 style={styles.serifTitle}>Prayer of Freedom</h1>
          <p style={styles.textGray}>Enter passcode to access.</p>
          <input 
            type="password" 
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            style={styles.input}
            placeholder="••••"
          />
          <button 
            onClick={() => passcode === SECRET_CODE ? setView('DASHBOARD') : alert('Wrong code')}
            style={styles.btnPrimary}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // DASHBOARD
  // ------------------------------------------------
  if (view === 'DASHBOARD') {
    return (
      <div style={styles.layout}>
        <header style={styles.header}>
          <h2 style={styles.logo}>Freedom Framework</h2>
          <button onClick={() => setView('LOGIN')} style={styles.btnText}>Lock</button>
        </header>
        
        <main style={styles.main}>
          <h1 style={styles.bigTitle}>Welcome Home.</h1>
          <p style={styles.subtitle}>Select a phase to begin your work.</p>
          
          <div style={styles.grid}>
            <div style={styles.card}>
              <span style={styles.stepBadge}>01</span>
              <h3>Identify</h3>
              <p style={styles.textGray}>Log your daily burdens.</p>
              <button style={styles.btnSecondary} disabled>Coming Soon</button>
            </div>

            <div style={styles.cardActive}>
              <span style={styles.stepBadgeActive}>02</span>
              <h3>Inventory (Roots)</h3>
              <p style={styles.textGray}>The 18-Category Deep Clean.</p>
              <button onClick={() => setView('INVENTORY')} style={styles.btnPrimary}>
                Open Inventory &rarr;
              </button>
            </div>

             <div style={styles.card}>
              <span style={styles.stepBadge}>03</span>
              <h3>Prayer</h3>
              <p style={styles.textGray}>Break agreements & find peace.</p>
              <button style={styles.btnSecondary} disabled>Coming Soon</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // INVENTORY VIEW
  // ------------------------------------------------
  return (
    <div style={styles.layout}>
      {/* SIDEBAR NAVIGATION */}
      <div style={styles.sidebar}>
        <button onClick={() => setView('DASHBOARD')} style={styles.backBtn}>&larr; Back to Home</button>
        <h3 style={styles.sidebarTitle}>Categories</h3>
        <div style={styles.scrollList}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              style={activeCategory?.id === cat.id ? styles.catBtnActive : styles.catBtn}
            >
              <span style={styles.catNum}>{cat.videoNum}</span> {cat.title}
              {inventory[cat.id] && <span style={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN INPUT AREA */}
      <main style={styles.mainContent}>
        {!activeCategory ? (
          <div style={styles.emptyState}>
            <h2>Select a Category</h2>
            <p>Choose an item from the left to start your list.</p>
          </div>
        ) : (
          <div style={styles.workArea}>
            <div style={styles.workHeader}>
              <span style={styles.tag}>List Prep Guide {activeCategory.videoNum}</span>
              <h1>{activeCategory.title}</h1>
            </div>

            <p style={styles.instruction}>
              Who or what comes to mind? List them below. <br/>
              <em>(This list will be used in your prayer later).</em>
            </p>

            <textarea
              style={styles.textArea}
              placeholder={activeCategory.placeholder}
              value={inventory[activeCategory.id] || ''}
              onChange={(e) => updateInventory(activeCategory.id, e.target.value)}
            />
            
            <div style={styles.saveIndicator}>
              {inventory[activeCategory.id] ? 'Saved ✓' : 'Start typing to save...'}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ------------------------------------------------
// STYLES
// ------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  // Layouts
  centerContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif' },
  header: { padding: '20px 40px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' },
  main: { maxWidth: '900px', margin: '60px auto', textAlign: 'center', padding: '20px' },
  
  // Sidebar
  sidebar: { width: '300px', backgroundColor: '#f8f9fa', borderRight: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' },
  scrollList: { overflowY: 'auto', flex: 1, marginTop: '20px' },
  sidebarTitle: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
  
  // Main Content
  mainContent: { flex: 1, padding: '40px', backgroundColor: '#fff' },
  workArea: { maxWidth: '700px', margin: '0 auto' },
  workHeader: { marginBottom: '20px' },
  
  // Components
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px' },
  cardActive: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', border: '2px solid #4f46e5', width: '100%', maxWidth: '350px' },
  grid: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' },
  
  // Inputs & Buttons
  input: { width: '100%', padding: '12px', margin: '15px 0', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', textAlign: 'center' },
  textArea: { width: '100%', height: '300px', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '16px', fontFamily: 'inherit', lineHeight: '1.5', resize: 'none', backgroundColor: '#fafafa' },
  btnPrimary: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%' },
  btnSecondary: { backgroundColor: '#f3f4f6', color: '#9ca3af', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 'bold', width: '100%' },
  btnText: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' },
  backBtn: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginBottom: '20px', textAlign: 'left', fontWeight: 'bold' },
  
  // List Items
  catBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#374151', fontSize: '14px' },
  catBtnActive: { display: 'block', width: '100%', textAlign: 'left', padding: '12px', border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' },
  catNum: { display: 'inline-block', width: '30px', color: '#9ca3af', fontSize: '12px' },
  
  // Typography
  serifTitle: { fontFamily: 'Georgia, serif', color: '#111827', margin: 0 },
  bigTitle: { fontFamily: 'Georgia, serif', fontSize: '48px', color: '#111827', marginBottom: '10px' },
  subtitle: { color: '#6b7280', fontSize: '18px' },
  textGray: { color: '#6b7280', marginBottom: '15px' },
  tag: { backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block' },
  instruction: { fontSize: '16px', color: '#4b5563', marginBottom: '20px', lineHeight: '1.5' },
  stepBadge: { display: 'block', fontSize: '24px', color: '#d1d5db', fontWeight: 'bold', marginBottom: '10px' },
  stepBadgeActive: { display: 'block', fontSize: '24px', color: '#4f46e5', fontWeight: 'bold', marginBottom: '10px' },
  check: { color: '#10b981', marginLeft: '8px', fontWeight: 'bold' },
  saveIndicator: { textAlign: 'right', marginTop: '10px', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }
};

export default App;

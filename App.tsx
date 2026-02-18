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

interface Issue {
  id: number;
  text: string;
  intensity: number; // 0-10
  date: string;
}

// The "Master List" 
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
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'IDENTIFY' | 'INVENTORY' | 'PRAYER_MENU' | 'PRAYER_ACTIVE' | 'SETTINGS'>('LOGIN');
  const [passcode, setPasscode] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryData | null>(null);
  const [activePrayer, setActivePrayer] = useState<string>('');
  
  // Prayer Mode State
  const [prayerMode, setPrayerMode] = useState<'SELF' | 'OTHERS'>('SELF');
  const [lovedOneName, setLovedOneName] = useState('');
  
  // DATA: Inventory (Phase 2)
  const [inventory, setInventory] = useState<Record<string, string>>({});
  
  // DATA: Issues (Phase 1)
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssueText, setNewIssueText] = useState('');
  const [newIssueIntensity, setNewIssueIntensity] = useState(5);

  // ------------------------------------------------
  // DATA PERSISTENCE (The "Vault")
  // ------------------------------------------------
  useEffect(() => {
    // Load Inventory
    const savedInv = localStorage.getItem('freedom_inventory');
    if (savedInv) setInventory(JSON.parse(savedInv));

    // Load Issues
    const savedIssues = localStorage.getItem('freedom_issues');
    if (savedIssues) setIssues(JSON.parse(savedIssues));
  }, []);

  const updateInventory = (key: string, text: string) => {
    const newInventory = { ...inventory, [key]: text };
    setInventory(newInventory);
    localStorage.setItem('freedom_inventory', JSON.stringify(newInventory));
  };

  const addIssue = () => {
    if (!newIssueText.trim()) return;
    const newIssue: Issue = {
      id: Date.now(),
      text: newIssueText,
      intensity: newIssueIntensity,
      date: new Date().toLocaleDateString()
    };
    const updatedIssues = [newIssue, ...issues];
    setIssues(updatedIssues);
    localStorage.setItem('freedom_issues', JSON.stringify(updatedIssues));
    setNewIssueText('');
    setNewIssueIntensity(5);
  };

  const deleteIssue = (id: number) => {
    const updatedIssues = issues.filter(i => i.id !== id);
    setIssues(updatedIssues);
    localStorage.setItem('freedom_issues', JSON.stringify(updatedIssues));
  };
  
  const SECRET_CODE = "1234";

  // ------------------------------------------------
  // HELPERS FOR PRAYER INJECTION
  // ------------------------------------------------
  const getList = (key: string) => {
    // If praying for others, return a blank line (The "Guest Mode")
    if (prayerMode === 'OTHERS') return "____________________";
    
    // If praying for self, pull from saved data
    const val = inventory[key];
    return val && val.trim().length > 0 ? val : "___________";
  };

  const getCombinedOthers = () => {
    if (prayerMode === 'OTHERS') return "____________________";
    const mainKeys = ['unforgiveness', 'sexual_sin', 'occult'];
    const others = CATEGORIES.filter(c => !mainKeys.includes(c.id));
    let combined = "";
    others.forEach(cat => {
      if (inventory[cat.id]) combined += `\n• [${cat.title}]: ${inventory[cat.id]}`;
    });
    return combined || "___________";
  };

  const getLatestIssue = () => {
    if (issues.length > 0) return issues[0].text;
    return "this issue";
  };

  const getName = () => prayerMode === 'OTHERS' && lovedOneName ? lovedOneName : "me";
  const getHeShe = () => "he/she"; 
  const getHimHer = () => "him/her";

  // ------------------------------------------------
  // VIEW: LOGIN
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
  // VIEW: DASHBOARD
  // ------------------------------------------------
  if (view === 'DASHBOARD') {
    return (
      <div style={styles.layout}>
        <header style={styles.header}>
          <h2 style={styles.logo}>Freedom Framework</h2>
          <button onClick={() => setView('SETTINGS')} style={styles.btnText}>⚙️ Settings</button>
        </header>
        
        <main style={styles.main}>
          <h1 style={styles.bigTitle}>Welcome Home.</h1>
          <p style={styles.subtitle}>Select a phase to begin your work.</p>
          
          <div style={styles.grid}>
            {/* PHASE 1: IDENTIFY */}
            <div style={styles.cardActive}>
              <span style={styles.stepBadgeActive}>01</span>
              <h3>Identify</h3>
              <p style={styles.textGray}>Log current burdens & intensity.</p>
              <button onClick={() => setView('IDENTIFY')} style={styles.btnPrimary}>
                Open Issue Tracker &rarr;
              </button>
            </div>

            {/* PHASE 2: INVENTORY */}
            <div style={styles.cardActive}>
              <span style={styles.stepBadgeActive}>02</span>
              <h3>Inventory (Roots)</h3>
              <p style={styles.textGray}>The 18-Category Deep Clean.</p>
              <button onClick={() => setView('INVENTORY')} style={styles.btnPrimary}>
                Open Inventory &rarr;
              </button>
            </div>

             {/* PHASE 3: PRAYER */}
             <div style={styles.cardActive}>
              <span style={styles.stepBadgeActive}>03</span>
              <h3>Prayer Room</h3>
              <p style={styles.textGray}>Break agreements & find peace.</p>
              <button onClick={() => setView('PRAYER_MENU')} style={styles.btnPrimary}>
                Enter Prayer Room &rarr;
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW: IDENTIFY (ISSUE TRACKER)
  // ------------------------------------------------
  if (view === 'IDENTIFY') {
    return (
      <div style={styles.layout}>
        <header style={styles.header}>
           <button onClick={() => setView('DASHBOARD')} style={styles.backBtn}>&larr; Home</button>
           <h2 style={styles.logo}>Phase 1: Identify</h2>
        </header>
        <main style={styles.main}>
          <div style={styles.workArea}>
            <h1>What is troubling you?</h1>
            <p style={styles.instruction}>Name the issue (e.g. Anxiety, Back Pain) and rate the intensity.</p>
            
            <div style={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Name the issue..." 
                value={newIssueText}
                onChange={(e) => setNewIssueText(e.target.value)}
                style={styles.input}
              />
              <div style={{marginBottom: '20px'}}>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>Intensity (0-10): {newIssueIntensity}</label>
                <input 
                  type="range" 
                  min="0" max="10" 
                  value={newIssueIntensity}
                  onChange={(e) => setNewIssueIntensity(parseInt(e.target.value))}
                  style={{width: '100%'}}
                />
              </div>
              <button onClick={addIssue} style={styles.btnPrimary}>Log Issue</button>
            </div>

            <div style={{marginTop: '40px', textAlign: 'left'}}>
              <h3>Recent Issues</h3>
              {issues.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>No issues logged yet.</p>}
              {issues.map(issue => (
                <div key={issue.id} style={styles.issueRow}>
                  <div>
                    <span style={{fontWeight: 'bold', fontSize: '18px'}}>{issue.text}</span>
                    <br/>
                    <span style={{fontSize: '12px', color: '#666'}}>{issue.date} • Level: {issue.intensity}/10</span>
                  </div>
                  <button onClick={() => deleteIssue(issue.id)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>×</button>
                </div>
              ))}
            </div>
            
            {issues.length > 0 && (
               <button onClick={() => { setActivePrayer('RECOVERY'); setView('PRAYER_ACTIVE'); }} style={styles.btnSecondary}>
                 Go to Recovery Prayer for "{issues[0].text}" &rarr;
               </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW: INVENTORY
  // ------------------------------------------------
  if (view === 'INVENTORY') {
    return (
      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <button onClick={() => setView('DASHBOARD')} style={styles.backBtn}>&larr; Home</button>
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
                <em>(This list will be auto-filled into your prayer).</em>
              </p>

              <textarea
                style={styles.textArea}
                placeholder={activeCategory.placeholder}
                value={inventory[activeCategory.id] || ''}
                onChange={(e) => updateInventory(activeCategory.id, e.target.value)}
              />
              
              <div style={styles.saveIndicator}>
                {inventory[activeCategory.id] ? <span style={{color:'#10b981'}}>Saved to Device ✓</span> : 'Start typing...'}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW: PRAYER MENU
  // ------------------------------------------------
  if (view === 'PRAYER_MENU') {
    return (
      <div style={styles.layout}>
        <header style={styles.header}>
           <button onClick={() => setView('DASHBOARD')} style={styles.backBtn}>&larr; Back</button>
           <h2 style={styles.logo}>Prayer Room</h2>
        </header>

        <main style={styles.main}>
          <h1 style={styles.bigTitle}>Choose Your Prayer</h1>
          <div style={styles.grid}>
             {/* PRAYER 1: FREEDOM */}
            <div style={styles.cardActive}>
              <h3>Freedom Prayer</h3>
              <p style={styles.textGray}>The full "Deep Clean" using your 18-category inventory.</p>
              <button onClick={() => { setActivePrayer('FREEDOM'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>

            {/* PRAYER 2: DAILY */}
            <div style={styles.cardActive}>
              <h3>Daily Prayer</h3>
              <p style={styles.textGray}>Maintenance prayer for protection and renewal.</p>
              <button onClick={() => { setActivePrayer('DAILY'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>

            {/* PRAYER 3: 3-STEP */}
            <div style={styles.cardActive}>
              <h3>3-Step Recovery</h3>
              <p style={styles.textGray}>Quick prayer for immediate issues (Anxiety, Pain, etc).</p>
              <button onClick={() => { setActivePrayer('RECOVERY'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW: SETTINGS
  // ------------------------------------------------
  if (view === 'SETTINGS') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', alignItems: 'center' }}>
           <button onClick={() => setView('DASHBOARD')} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}>&larr; Back</button>
           <h2 style={{ margin: 0, fontSize: '18px', fontFamily: 'Georgia, serif' }}>App Settings</h2>
        </header>
        <main style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '20px' }}>
           <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
             <h3>Data Management</h3>
             <p style={{ color: '#666', marginBottom: '20px' }}>Clear all saved lists and reset the app. (Irreversible)</p>
             <button onClick={() => {
                if (window.confirm("Are you sure? This will delete all your lists.")) {
                  localStorage.removeItem('freedom_inventory');
                  localStorage.removeItem('freedom_issues');
                  // We clear state manually to update UI immediately
                  setInventory({});
                  setIssues([]);
                  alert("Data Cleared.");
                  setView('LOGIN');
                }
             }} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '16px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Reset All Data</button>
           </div>
           <br />
           <button onClick={() => setView('LOGIN')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '10px' }}>🔒 Logout</button>
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // VIEW: PRAYER ACTIVE (THE ENGINE)
  // ------------------------------------------------
  return (
    <div style={styles.layout}>
      <div style={styles.prayerContainer}>
        
        {/* HEADER & TOGGLE */}
        <div style={styles.prayerHeader}>
           <button onClick={() => setView('PRAYER_MENU')} style={styles.backBtn}>&larr; Exit</button>
           <div style={styles.toggleContainer}>
             <button 
               style={prayerMode === 'SELF' ? styles.toggleActive : styles.toggle}
               onClick={() => setPrayerMode('SELF')}
             >
               For Me
             </button>
             <button 
               style={prayerMode === 'OTHERS' ? styles.toggleActive : styles.toggle}
               onClick={() => setPrayerMode('OTHERS')}
             >
               For Loved One (Blank)
             </button>
           </div>
           {prayerMode === 'SELF' && <button onClick={() => setView('INVENTORY')} style={styles.editBtn}>✎ Lists</button>}
        </div>

        {/* LOVED ONE NAME INPUT */}
        {prayerMode === 'OTHERS' && (
          <div style={styles.nameInputBlock}>
            <p><strong>Guest Mode:</strong> Your personal lists are hidden.</p>
            <p>Who are you praying for today?</p>
            <input 
              type="text" 
              placeholder="Enter their name..." 
              value={lovedOneName}
              onChange={(e) => setLovedOneName(e.target.value)}
              style={styles.inlineInput}
            />
          </div>
        )}

        {activePrayer === 'FREEDOM' && (
          <div style={styles.prayerText}>
            <h1>The Prayer of Freedom {prayerMode === 'OTHERS' ? `(For ${getName()})` : "(Personal)"}</h1>
            <p><strong>Instructions:</strong> Read out loud

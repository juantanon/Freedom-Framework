import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ------------------------------------------------
// 1. YOUR FIREBASE KEYS (PASTE THEM HERE)
// ------------------------------------------------
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

// Initialize Firebase Cloud Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// We create one secure "document" to hold all your personal lists
const userDocRef = doc(db, 'freedom_framework', 'my_personal_data'); 

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
  date: string;
  initialIntensity: number;
  intensity3Days?: number; 
  intensity30Days?: number; 
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
  const [prayerTarget, setPrayerTarget] = useState(''); 
  
  // DATA
  const [inventory, setInventory] = useState<Record<string, string>>({});
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssueText, setNewIssueText] = useState('');
  const [newIssueIntensity, setNewIssueIntensity] = useState(5);

  // ------------------------------------------------
  // FIREBASE CLOUD SYNC
  // ------------------------------------------------
  useEffect(() => {
    // This listens to the Cloud Database in real-time
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData.inventory) setInventory(cloudData.inventory);
        if (cloudData.issues) setIssues(cloudData.issues);
      }
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Save to Cloud helper
  const saveToCloud = async (newInventory: Record<string, string>, newIssues: Issue[]) => {
    try {
      await setDoc(userDocRef, { inventory: newInventory, issues: newIssues }, { merge: true });
    } catch (error) {
      console.error("Error saving to cloud:", error);
      alert("Error saving to cloud. Check your Firebase settings and rules.");
    }
  };

  const updateInventory = (key: string, text: string) => {
    const newInventory = { ...inventory, [key]: text };
    setInventory(newInventory); // Update screen immediately
    saveToCloud(newInventory, issues); // Sync to cloud in background
  };

  const addIssue = () => {
    if (!newIssueText.trim()) return;
    const newIssue: Issue = {
      id: Date.now(),
      text: newIssueText,
      initialIntensity: newIssueIntensity,
      date: new Date().toLocaleDateString()
    };
    const updatedIssues = [newIssue, ...issues];
    setIssues(updatedIssues);
    saveToCloud(inventory, updatedIssues);
    setNewIssueText('');
    setNewIssueIntensity(5);
  };

  const updateIssueProgress = (id: number, field: '3day' | '30day', value: number) => {
    const updatedIssues = issues.map(issue => {
      if (issue.id === id) {
        if (field === '3day') return { ...issue, intensity3Days: value };
        if (field === '30day') return { ...issue, intensity30Days: value };
      }
      return issue;
    });
    setIssues(updatedIssues);
    saveToCloud(inventory, updatedIssues);
  };

  const deleteIssue = (id: number) => {
    const updatedIssues = issues.filter(i => i.id !== id);
    setIssues(updatedIssues);
    saveToCloud(inventory, updatedIssues);
  };
  
  const startSimplifiedPrayer = (issueText: string) => {
    setPrayerTarget(issueText);
    setActivePrayer('SIMPLIFIED'); 
    setView('PRAYER_ACTIVE');
  };

  const startAllIssuesPrayer = () => {
    if (issues.length === 0) return;
    const combinedIssues = issues.map(i => i.text).join(', ');
    setPrayerTarget(combinedIssues);
    setActivePrayer('SIMPLIFIED');
    setView('PRAYER_ACTIVE');
  }
  
  const SECRET_CODE = "1234";

  // ------------------------------------------------
  // HELPERS FOR PRAYER INJECTION
  // ------------------------------------------------
  const getList = (key: string) => {
    if (prayerMode === 'OTHERS') return "____________________";
    const val = inventory[key];
    return val && val.trim().length > 0 ? val : "___________";
  };

  const getCombinedOthers = () => {
    if (prayerMode === 'OTHERS') return "____________________";
    const mainKeys = ['unforgiveness', 'sexual_sin', 'occult'];
    const others = CATEGORIES.filter(c => !mainKeys.includes(c.id));
    let combined = "";
    others.forEach(cat => {
      if (cat.id === 'word_curses' && inventory['word_curses']) {
         combined += `\n• [Word Curses]: ${inventory['word_curses']}`;
      }
      else if (inventory[cat.id]) {
        combined += `\n• [${cat.title}]: ${inventory[cat.id]}`;
      }
    });
    return combined || "___________";
  };

  const getTargetIssue = () => {
    if (prayerTarget) return prayerTarget;
    if (issues.length > 0) return issues[0].text;
    return "my issues";
  };
  
  const getSpiritLabel = () => prayerTarget.includes(',') ? "spirits" : "spirit";
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
              <p style={styles.textGray}>Log current burdens & tracking.</p>
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
            <p style={styles.instruction}>
              <strong>Instructions:</strong> Name the issue (e.g. Anxiety, Back Pain) and rate its intensity level (0-10). 
              Come back in 3 days and 30 days to update the intensity score.
            </p>
            
            <div style={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Name the issue (Press Enter to log)..." 
                value={newIssueText}
                onChange={(e) => setNewIssueText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIssue()}
                style={styles.input}
              />
              <div style={{marginBottom: '20px', textAlign: 'left'}}>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>Initial Intensity (0-10):</label>
                <select 
                  value={newIssueIntensity}
                  onChange={(e) => setNewIssueIntensity(parseInt(e.target.value))}
                  style={styles.selectInput}
                >
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} - {n===10 ? 'Severe' : n===0 ? 'None' : ''}</option>
                  ))}
                </select>
              </div>
              <button onClick={addIssue} style={styles.btnPrimary}>Log Issue</button>
            </div>

            <div style={{marginTop: '40px', textAlign: 'left'}}>
              <h3>Recent Issues (Cloud Synced ☁️)</h3>
              
              {/* PRAY FOR ALL BUTTON */}
              {issues.length > 1 && (
                <button 
                  onClick={startAllIssuesPrayer}
                  style={styles.btnGrand}
                >
                  ✨ Pray for ALL {issues.length} Issues at Once &rarr;
                </button>
              )}

              {issues.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>No issues logged yet.</p>}
              {issues.map(issue => (
                <div key={issue.id} style={styles.issueRow}>
                  <div style={{flex: 1}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontWeight: 'bold', fontSize: '18px'}}>{issue.text}</span>
                      <button onClick={() => deleteIssue(issue.id)} style={{color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize:'20px'}}>×</button

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ------------------------------------------------
// 1. YOUR FIREBASE KEYS 
// ------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyD9-tne9mI-SbFABDzoXjMWzYKO6kSoCIU",
  authDomain: "freedom-framework-c27a0.firebaseapp.com",
  projectId: "freedom-framework-c27a0",
  storageBucket: "freedom-framework-c27a0.firebasestorage.app",
  messagingSenderId: "312241741660",
  appId: "1:312241741660:web:b7b4efc475da1cd5f9eb99"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const userDocRef = doc(db, 'freedom_framework', 'my_personal_data'); 

// ------------------------------------------------
// MOBILE RESPONSIVE CSS
// ------------------------------------------------
const responsiveCss = `
  .mobile-wrap { display: flex; flex-direction: row; min-height: 100vh; background-color: #fff; font-family: Inter, sans-serif; }
  .mobile-sidebar { width: 300px; background-color: #f8f9fa; border-right: 1px solid #e5e7eb; padding: 20px; display: flex; flex-direction: column; height: 100vh; position: sticky; top: 0; overflow-y: auto; }
  .mobile-content { flex: 1; padding: 20px; background-color: #fff; }
  
  @media (max-width: 768px) {
    .mobile-wrap { flex-direction: column; }
    .mobile-sidebar { width: 100%; height: 250px; border-right: none; border-bottom: 2px solid #e5e7eb; position: relative; }
    .mobile-content { padding: 15px; }
  }
`;

// ------------------------------------------------
// 18 CATEGORIES (VERBATIM FROM BOOK)
// ------------------------------------------------
type CategoryKey = 
  | 'parent_child' | 'unforgiveness' | 'sexual_sin' 
  | 'generational' | 'occult' | 'word_curses' 
  | 'vows' | 'idolatry' | 'pride' 
  | 'trauma' | 'addictions' | 'other_religions' 
  | 'judgments' | 'other_sins' | 'agreements' 
  | 'additional_sins' | 'influencers' | 'infirmity';

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

const CATEGORIES: CategoryData[] = [
  { id: 'parent_child', title: 'Parent-Child Relationship', videoNum: '#1', placeholder: 'List specific wounds from father, mother, or grandparent...' },
  { id: 'unforgiveness', title: 'Unforgiveness', videoNum: '#2', placeholder: 'List names of everyone who has hurt you...' },
  { id: 'sexual_sin', title: 'Sexual Sin', videoNum: '#3', placeholder: 'List everyone with whom you have engaged in sexual activity outside of marriage...' },
  { id: 'generational', title: 'Generational Sins', videoNum: '#4', placeholder: 'List patterns of sin in your ancestry (divorce, anger, addiction, etc)...' },
  { id: 'occult', title: 'Occult / New Age', videoNum: '#5', placeholder: 'List any occult activity (horoscopes, psychic readings, yoga, etc)...' },
  { id: 'word_curses', title: 'Word Curses', videoNum: '#6', placeholder: 'List careless words spoken over you or by you...' },
  { id: 'vows', title: 'Covenants and Vows', videoNum: '#7', placeholder: 'List solemn commitments or vows ("I will never...")...' },
  { id: 'idolatry', title: 'Idolatry', videoNum: '#8', placeholder: 'List things put before God (success, money, relationships)...' },
  { id: 'pride', title: 'Pride', videoNum: '#9', placeholder: 'List areas of self-reliance, superiority, or independence from God...' },
  { id: 'trauma', title: 'Abuse & Trauma', videoNum: '#10', placeholder: 'List specific traumatic events (abuse, car accidents, PTSD)...' },
  { id: 'addictions', title: 'Addictions', videoNum: '#11', placeholder: 'List substances or habits (drugs, alcohol, porn, video games)...' },
  { id: 'other_religions', title: 'Other Religions', videoNum: '#12', placeholder: 'List participation in other religious systems...' },
  { id: 'judgments', title: 'Judgments', videoNum: '#13', placeholder: 'List bad or negative thoughts spoken against someone else...' },
  { id: 'other_sins', title: 'Other Sins', videoNum: '#14', placeholder: 'List anything else (unhealthy eating, resentment, reality-altering meds)...' },
  { id: 'agreements', title: 'Agreement Sins', videoNum: '#15', placeholder: 'List secret oaths, lodges, or agreements contrary to God...' },
  { id: 'additional_sins', title: 'Additional Sins', videoNum: '#16', placeholder: 'Select from the specific spirits below...' },
  { id: 'influencers', title: 'Influencers', videoNum: '#17', placeholder: 'List the people who influenced the sins in list #16...' },
  { id: 'infirmity', title: 'Infirmity', videoNum: '#18', placeholder: 'List specific physical ailments, sickness, or disease...' },
];

const QUICK_CHIPS: Partial<Record<CategoryKey, string[]>> = {
  additional_sins: [
    "Pride / Vanity", "Perfection", "Accusation / Scorn", "Judgmental / Condemning", "Self-Judgmental / Self-Condemning", 
    "Competition", "Mockery", "Stubbornness", "Selfishness", "Gossip", "Boastful", "Self-righteousness", "Embarrassment / Humiliation",
    "Mental Illness / Insanity", "Double Mindedness", "Seizures / Epilepsy", "Mind binding", "Stupor", "Sarcasm", "Critical",
    "Misery / Dread", "Rejection / Self-rejection", "Despair / Hopelessness", "Grief", "Fatigue / Weariness", "Guilt / Shame", 
    "Self-pity", "Loneliness", "Depression / Manic Depression", "Suicide / Death",
    "Isolation / Anti-social", "Sleepiness / Laziness", "Forgetfulness", "Stupidity", "Daydreaming / Trances", "Apathy / Indifference", "Confusion",
    "Impatience / Frustration", "Bitterness / Negativity / Blaming", "Strife / Division / Conflict", "Envy / Covetousness", 
    "Control / Manipulation", "Revenge / Retaliation", "Suspicion", "Anger / Rage", "Hatred / Self-hatred", "Cruelty", "Murder / Violence", "Murmuring / Complaining", "Profanity",
    "Insecurity / Inadequacy / Inferiority", "Timidity", "Worry / Anxiety", "Fear of Death", "Cowardice / Cowering", "Hiding / Escaping", 
    "Abandonment", "Fear of Future / Failure", "Little girl / boy personality", "Unrest / Hyperactivity", "Nervousness", "Phobias", 
    "Panic Attacks", "Nightmares", "Terror / Torment", "Fear of Being Abused", "Fear of Authority",
    "Doubt & Unbelief", "Word Twisting", "Tradition / Legalism", "Hypocrisy Religious", "Exaggeration / Drama", "Lying",
    "Self-exaltation", "Self-help / Intellectualism", "Humanism", "Rebellion", "Theft",
    "Lust", "Homosexuality / Lesbianism", "Gender Dysphoria", "Adultery", "Fornication", "Idolatry", "Worldliness",
    "Prostitution / Masturbation", "Sodomy", "Bestiality", "Molestation / Incest", "Exhibitionism", "Pornography", "Seducing Spirit", "Fantasy Spirits", "Incubus / Succubus", "Sensual Thoughts",
    "Hindering / Distraction", "Greed / Hoarding", "Gluttony", "Slavery / Emotional Weakness", "Addiction"
  ]
};

function App() {
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'IDENTIFY' | 'INVENTORY' | 'PRAYER_MENU' | 'PRAYER_ACTIVE' | 'SETTINGS'>(() => {
    return sessionStorage.getItem('freedom_logged_in') === 'true' ? 'DASHBOARD' : 'LOGIN';
  });
  
  const [passcode, setPasscode] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryData | null>(null);
  const [activePrayer, setActivePrayer] = useState<string>('');
  
  const [prayerMode, setPrayerMode] = useState<'SELF' | 'OTHERS'>('SELF');
  const [lovedOneName, setLovedOneName] = useState('');
  const [prayerTarget, setPrayerTarget] = useState(''); 
  const [nationName, setNationName] = useState('the United States of America');
  const [recoverySin, setRecoverySin] = useState('');
  
  const [inventory, setInventory] = useState<Record<string, string>>({});
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssueText, setNewIssueText] = useState('');
  const [newIssueIntensity, setNewIssueIntensity] = useState(5);

  useEffect(() => {
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData.inventory) {
            setInventory(cloudData.inventory);
            if (cloudData.inventory.nation_name) setNationName(cloudData.inventory.nation_name);
        }
        if (cloudData.issues) setIssues(cloudData.issues);
      }
    });
    return () => unsubscribe();
  }, []);

  const saveToCloud = async (newInventory: Record<string, string>, newIssues: Issue[]) => {
    try {
      await setDoc(userDocRef, { inventory: newInventory, issues: newIssues }, { merge: true });
    } catch (error) {
      console.error("Error saving to cloud:", error);
    }
  };

  const updateInventory = (key: string, text: string) => {
    const newInventory = { ...inventory, [key]: text };
    setInventory(newInventory); 
    saveToCloud(newInventory, issues); 
  };

  const toggleChecklistItem = (key: string, item: string) => {
    const currentText = inventory[key] || '';
    let itemsArray = currentText.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (itemsArray.includes(item)) {
      itemsArray = itemsArray.filter(i => i !== item);
    } else {
      itemsArray.push(item);
    }
    updateInventory(key, itemsArray.join(', '));
  };

  const addIssue = () => {
    if (!newIssueText.trim()) return;
    const newIssue: Issue = { id: Date.now(), text: newIssueText, initialIntensity: newIssueIntensity, date: new Date().toLocaleDateString() };
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
  
  const startTargetedPrayer = (issueText: string, prayerType: string) => {
    setPrayerTarget(issueText);
    setActivePrayer(prayerType); 
    setView('PRAYER_ACTIVE');
  };

  const startAllIssuesPrayer = () => {
    if (issues.length === 0) return;
    const combinedIssues = issues.map(i => i.text).join(', ');
    setPrayerTarget(combinedIssues);
    setActivePrayer('SIMPLIFIED');
    setView('PRAYER_ACTIVE');
  };

  const SECRET_CODE = "1234";

  const handleLogin = () => {
    if (passcode === SECRET_CODE) {
      sessionStorage.setItem('freedom_logged_in', 'true');
      setView('DASHBOARD');
    } else {
      alert('Wrong code');
    }
  };

  const getList = (key: string) => {
    if (prayerMode === 'OTHERS') return "____________________";
    const val = inventory[key];
    return val && val.trim().length > 0 ? val : "(None listed)";
  };

  const getCombinedOthers = () => {
    if (prayerMode === 'OTHERS') return "____________________";
    const mainKeys = ['unforgiveness', 'sexual_sin', 'occult'];
    const others = CATEGORIES.filter(c => !mainKeys.includes(c.id));
    let combined = "";
    others.forEach(cat => {
      if (inventory[cat.id]) {
        combined += `\n• [${cat.title}]: ${inventory[cat.id]}`;
      }
    });
    return combined || "(None listed)";
  };

  const getTargetIssue = () => prayerTarget || (issues.length > 0 ? issues[0].text : "my issues");
  const getName = () => prayerMode === 'OTHERS' && lovedOneName ? lovedOneName : "(loved one's name)";
  const getHeShe = () => "he/she"; 
  const getHimHer = () => "him/her";
  const getHisHer = () => "his/her";

  if (view === 'LOGIN') {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.card}>
          <h1 style={styles.serifTitle}>Prayer of Freedom</h1>
          <p style={styles.textGray}>Enter passcode to access.</p>
          <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={styles.input} placeholder="••••" />
          <button onClick={handleLogin} style={styles.btnPrimary}>Enter</button>
        </div>
      </div>
    );
  }

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
            <div style={styles.cardActive}>
              <span style={styles.stepBadgeActive}>01</span>
              <h3>Identify</h3>
              <p style={styles.textGray}>Log current burdens & tracking.</p>
              <button onClick={() => setView('IDENTIFY')} style={styles.btnPrimary}>Open Issue Tracker &rarr;</button>
            </div>
            <div style={styles.cardActive}>
              <span style={styles.stepBadgeActive}>02</span>
              <h3>Inventory (Roots)</h3>
              <p style={styles.textGray}>The 18-Category Deep Clean.</p>
              <button onClick={() => setView('INVENTORY')} style={styles.btnPrimary}>Open Inventory &rarr;</button>
            </div>
             <div style={styles.cardActive}>
              <span style={styles.stepBadgeActive}>03</span>
              <h3>Prayer Room</h3>
              <p style={styles.textGray}>Break agreements & find peace.</p>
              <button onClick={() => setView('PRAYER_MENU')} style={styles.btnPrimary}>Enter Prayer Room &rarr;</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <p style={styles.instruction}>Name the issue and rate its intensity level (0-10).</p>
            <div style={styles.inputGroup}>
              <input type="text" placeholder="Name the issue (Press Enter to log)..." value={newIssueText} onChange={(e) => setNewIssueText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addIssue()} style={styles.input} />
              <div style={{marginBottom: '20px', textAlign: 'left'}}>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>Initial Intensity (0-10):</label>
                <select value={newIssueIntensity} onChange={(e) => setNewIssueIntensity(parseInt(e.target.value))} style={styles.selectInput}>
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} - {n===10 ? 'Severe' : n===0 ? 'None' : ''}</option>)}
                </select>
              </div>
              <button onClick={addIssue} style={styles.btnPrimary}>Log Issue</button>
            </div>

            <div style={{marginTop: '40px', textAlign: 'left'}}>
              <h3>Recent Issues (Cloud Synced ☁️)</h3>
              
              {issues.length > 1 && (
                <button onClick={startAllIssuesPrayer} style={styles.btnGrand}>
                  ✨ Pray for ALL {issues.length} Issues at Once &rarr;
                </button>
              )}

              {issues.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>No issues logged yet.</p>}
              {issues.map(issue => (
                <div key={issue.id} style={styles.issueRow}>
                  <div style={{flex: 1}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontWeight: 'bold', fontSize: '18px'}}>{issue.text}</span>
                      <button onClick={() => deleteIssue(issue.id)} style={{color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize:'20px'}}>×</button>
                    </div>
                    <p style={{fontSize: '12px', color: '#666', margin: '5px 0'}}>Logged on: {issue.date}</p>
                    <div style={styles.trackerGrid}>
                      <div style={styles.trackerItem}>
                        <span style={styles.trackerLabel}>Initial</span>
                        <div style={styles.trackerScore}>{issue.initialIntensity}</div>
                      </div>
                      <div style={styles.trackerItem}>
                        <span style={styles.trackerLabel}>3-Day Check</span>
                        {issue.intensity3Days !== undefined ? (
                           <div style={styles.trackerScoreUpdated}>{issue.intensity3Days}</div>
                        ) : (
                          <select style={styles.miniSelect} onChange={(e) => updateIssueProgress(issue.id, '3day', parseInt(e.target.value))}>
                            <option value="">Update...</option>
                            {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        )}
                      </div>
                      <div style={styles.trackerItem}>
                        <span style={styles.trackerLabel}>30-Day Check</span>
                        {issue.intensity30Days !== undefined ? (
                           <div style={styles.trackerScoreUpdated}>{issue.intensity30Days}</div>
                        ) : (
                          <select style={styles.miniSelect} onChange={(e) => updateIssueProgress(issue.id, '30day', parseInt(e.target.value))}>
                            <option value="">Update...</option>
                            {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                     <button onClick={() => startTargetedPrayer(issue.text, 'SIMPLIFIED')} style={styles.btnSmall}>Simplified &rarr;</button>
                     <button onClick={() => startTargetedPrayer(issue.text, 'RECOVERY')} style={{...styles.btnSmall, backgroundColor: '#10b981'}}>Recovery &rarr;</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'INVENTORY') {
    return (
      <div className="mobile-wrap">
        <style>{responsiveCss}</style>
        <div className="mobile-sidebar">
          <button onClick={() => setView('DASHBOARD')} style={styles.backBtn}>&larr; Home</button>
          <h3 style={styles.sidebarTitle}>Categories</h3>
          <div style={styles.scrollList}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat)} style={activeCategory?.id === cat.id ? styles.catBtnActive : styles.catBtn}>
                <span style={styles.catNum}>{cat.videoNum}</span> {cat.title}
                {inventory[cat.id] && <span style={styles.check}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <main className="mobile-content">
          {!activeCategory ? (
            <div style={styles.emptyState}>
              <h2>Select a Category</h2>
              <p>Choose an item from the menu to start your list.</p>
            </div>
          ) : (
            <div style={styles.workArea}>
              <div style={styles.workHeader}>
                <span style={styles.tag}>List Prep Guide {activeCategory.videoNum}</span>
                <h1>{activeCategory.title}</h1>
              </div>

              <p style={styles.instruction}>{activeCategory.placeholder}</p>

              {QUICK_CHIPS[activeCategory.id] && (
                <div style={styles.chipContainer}>
                  {QUICK_CHIPS[activeCategory.id]?.map(chipItem => {
                    const isSelected = (inventory[activeCategory.id] || '').includes(chipItem);
                    return (
                      <button key={chipItem} onClick={() => toggleChecklistItem(activeCategory.id, chipItem)} style={isSelected ? styles.chipActive : styles.chip}>
                        {isSelected ? '✓ ' : '+ '} {chipItem}
                      </button>
                    );
                  })}
                </div>
              )}

              <textarea style={styles.textArea} placeholder="Type custom entries here..." value={inventory[activeCategory.id] || ''} onChange={(e) => updateInventory(activeCategory.id, e.target.value)} />
              
              <div style={styles.saveIndicator}>
                {inventory[activeCategory.id] ? <span style={{color:'#10b981'}}>Saved to Cloud ☁️ ✓</span> : 'Start typing...'}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

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
            <div style={styles.cardActive}>
              <h3>Prayer #1</h3>
              <p style={styles.textGray}>Repent of activity sins and break soul ties.</p>
              <button onClick={() => { setActivePrayer('PRAYER_1'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
            <div style={styles.cardActive}>
              <h3>Prayer #2</h3>
              <p style={styles.textGray}>Renounce agreement sins (3x a day for 3 days).</p>
              <button onClick={() => { setActivePrayer('PRAYER_2'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
            <div style={styles.cardActive}>
              <h3>Prayer #3 (Daily)</h3>
              <p style={styles.textGray}>Final cleanup prayer (2x a day for 30 days).</p>
              <button onClick={() => { setActivePrayer('DAILY'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
            <div style={styles.cardActive}>
              <h3>Simplified Prayer</h3>
              <p style={styles.textGray}>Target specific issues using your inventory lists.</p>
              <button onClick={() => { setPrayerTarget(''); setActivePrayer('SIMPLIFIED'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
            <div style={styles.cardActive}>
              <h3>3-Step Recovery</h3>
              <p style={styles.textGray}>Fast relief from emotional outbursts or sudden pain.</p>
              <button onClick={() => { setPrayerTarget(''); setActivePrayer('RECOVERY'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
            <div style={styles.cardActive}>
              <h3>Prayer for Nations</h3>
              <p style={styles.textGray}>Agreement Sins Renunciation Prayer for your nation.</p>
              <button onClick={() => { setActivePrayer('NATIONS'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'PRAYER_ACTIVE') {
  return (
    <div style={styles.layout}>
      <div style={styles.prayerContainer}>
        <div style={styles.prayerHeader}>
           <button onClick={() => setView('PRAYER_MENU')} style={styles.backBtn}>&larr; Exit</button>
           
           {activePrayer === 'SIMPLIFIED' && (
             <div style={styles.toggleContainer}>
               <button style={prayerMode === 'SELF' ? styles.toggleActive : styles.toggle} onClick={() => setPrayerMode('SELF')}>For Me</button>
               <button style={prayerMode === 'OTHERS' ? styles.toggleActive : styles.toggle} onClick={() => setPrayerMode('OTHERS')}>For Loved One</button>
             </div>
           )}

           {prayerMode === 'SELF' && <button onClick={() => setView('INVENTORY')} style={styles.editBtn}>✎ Edit Lists</button>}
        </div>

        {/* --- PRAYER #1 --- */}
        {activePrayer === 'PRAYER_1' && (
           <div style={styles.prayerText}>
             <h1>Prayer #1: Repent of Activity Sins</h1>
             <p style={styles.textGray}><strong>Instructions:</strong> Pray one time. Pray out loud.</p>
             <hr style={styles.divider}/>

             <p>Lord Jesus, I repent of my sins, and I thank you for dying on the cross for me. I accept your covering of my sins with your blood, and I claim the freedom you have promised from the curse of sin and torment.</p>
             
             <p>I choose to forgive others—everyone who has hurt me, lied to me, or disappointed me, I forgive them. I repent of unforgiveness; I know it is sin. I put it under your blood, Lord Jesus. I repent of anger, bitterness, hatred, rebellion, resentment, revenge, envy, jealousy, strife, lust, witchcraft, idolatry, and all the works of the flesh. I put it all under the blood of Jesus, and by doing so I break Satan’s power and legal rights to my life. I repent of the sins in my bloodline that I inherited through my mother and father. I repent of and denounce any contract with Satan that impacts my life that either I or anyone else has made; since he is a liar, no contract is binding. By your blood, Lord Jesus, I free myself from any pact with the devil. I renounce all unholy oaths, vows, pledges, and ceremonies that either I or my ancestors have made. I also renounce and cancel the assignment of every influencing spirit through which I have made unholy soul ties with other people, and I confess as sin, renounce, and break all the unholy soul ties with those people. I also break and release all judgments I have made against others.</p>
             
             <p>I repent of all unrighteous bloodshed in my ancestral line; all sins of divination, whether known or unknown; witchcraft; and other forms of occult activities that I or my ancestors have committed. And by the blood of Jesus, I renounce and break the power of Rejection, Fear, Unforgiveness, Heaviness, Control, Divination, and all other powers over me.</p>
             
             <p>And I repent of the following sins and lay them all under your blood...</p>

             <p><strong>1. Childhood Parent Relationship</strong><br/>
             <em>For father</em>—I forgive my father for these things:</p>
             <div style={styles.variableBlock}>{getList('parent_child')}</div>
             <p>Those things wounded me. I forgive him, release all judgments against him, and break all unholy soul ties with him.<br/>
             <em>For mother</em>—I forgive my mother for these things:</p>
             <div style={styles.variableBlock}>{getList('parent_child')}</div>
             <p>Those things wounded me. I forgive her, release all judgments against her, and break all unholy soul ties with her.<br/>
             <em>For grandparents</em>—I forgive my grandparents for these things:</p>
             <div style={styles.variableBlock}>{getList('parent_child')}</div>
             <p>Those things wounded me. I forgive them, release all judgments against them, and break all unholy soul ties with them.</p>

             <p><strong>2. Unforgiveness</strong><br/>
             I confess that I have resented and not loved certain people who have hurt me, and I have held unforgiveness in my heart towards them. I repent of that unforgiveness. I choose now to forgive, release all judgments towards, and renounce and break all unholy soul ties with the following people:</p>
             <div style={styles.variableBlock}>{getList('unforgiveness')}</div>

             <p><strong>3. Sexual Sin</strong><br/>
             I repent of my sexual sins with the following people, break all unholy blood contracts with each one, and renounce and break all unholy soul ties with them, their sexual partners, and those who encouraged me in these activities, including:</p>
             <div style={styles.variableBlock}>{getList('sexual_sin')}</div>
             <p>and all other sexual partners I may not recall.</p>

             <p><strong>4. Generational Sins</strong><br/>
             I confess and acknowledge the iniquities I and my forebearers have committed, and I renounce and repent of those sins and place them under your blood. I do this specifically for the sins of:</p>
             <div style={styles.variableBlock}>{getList('generational')}</div>
             <p>and in Jesus’s name I cancel the assignment of every spirit upon me and my family from all generational sins, and I declare they have no hold over me.</p>

             <p><strong>5. Occult</strong><br/>
             I repent of and renounce all activity I have engaged in within the demonic realm and all other occult activities, including:</p>
             <div style={styles.variableBlock}>{getList('occult')}</div>
             <p>I renounce and break all unholy soul ties with those with whom I committed these sins, including those listed above.</p>

             <p><strong>6. Word Curses</strong><br/>
             I repent of believing word curses spoken over me, and I confess they are lies. I renounce and break their power over me, and I renounce and break all unholy soul ties with those who spoke these curses about me, including the following word curses and people:</p>
             <div style={styles.variableBlock}>{getList('word_curses')}</div>
             <p>I also break all unknown curses and those I have spoken over myself. I break the agreement and cancel the assignment of every spirit upon me from these curses, and I declare you have no power over me any longer.</p>

             <p><strong>7. Covenants and Vows</strong><br/>
             I repent of breaking certain covenants and vows I have made, including:</p>
             <div style={styles.variableBlock}>{getList('vows')}</div>
             <p>and I break all unholy soul ties with those who encouraged me to break them.</p>

             <p><strong>8. Idolatry</strong><br/>
             I repent of all idolatry, including but not limited to:</p>
             <div style={styles.variableBlock}>{getList('idolatry')}</div>
             <p>I also break all unholy soul ties with those who encouraged me in this direction.</p>

             <p><strong>9. Pride</strong><br/>
             I repent of my sin of pride, and especially the pride of:</p>
             <div style={styles.variableBlock}>{getList('pride')}</div>
             <p>I also repent that I have been prideful about my accomplishments and for not giving you the glory.</p>

             <p><strong>10. Abuse / Trauma</strong><br/>
             I have experienced certain abusive and traumatic events, and I repent of my sinful responses to each one, including:</p>
             <div style={styles.variableBlock}>{getList('trauma')}</div>
             <p>I now renounce and break all unholy blood contracts and unholy soul ties with everyone involved, including all the individuals I just named. And Lord, I ask that you remove the memory of these abuses and traumas—including any from my mother and father—from my mind and body. I rebuke all spirits tied to these abuses and traumas, and command each of you to leave—go now, in Jesus’s name!</p>

             <p><strong>11. Addictions</strong><br/>
             I repent of my sin in doing the following addictive behaviors. I renounce and break all unholy soul ties with those who encouraged me or with whom I did these activities, including but not limited to:</p>
             <div style={styles.variableBlock}>{getList('addictions')}</div>

             <p><strong>12. Other religions</strong><br/>
             I repent of all idolatry and involvement in all other religions, including:</p>
             <div style={styles.variableBlock}>{getList('other_religions')}</div>

             <p><strong>13. Judgments</strong><br/>
             I also repent of and renounce all judgments I have spoken against all others, including but not limited to:</p>
             <div style={styles.variableBlock}>{getList('judgments')}</div>

             <p><strong>14. Other sins</strong><br/>
             I also repent of the following sins:</p>
             <div style={styles.variableBlock}>{getList('other_sins')}</div>

             <p><strong>15. Agreement Sins</strong><br/>
             <em>(Skip. This list handled in Prayer #2)</em></p>

             <p><strong>16. Additional Sins and Activities</strong><br/>
             I repent of and renounce all sins I have committed, and continue to do, that are contrary to you, including:</p>
             <div style={styles.variableBlock}>{getList('additional_sins')}</div>

             <p><strong>17. Influencers</strong><br/>
             I renounce and break all unholy soul ties with those who influenced me to do those sins, including:</p>
             <div style={styles.variableBlock}>{getList('influencers')}</div>
             <p>I also break all unholy soul ties and renounce all agreements with the spirits behind those thoughts and activities.</p>

             <hr style={styles.divider}/>
             <h3>Command them to leave</h3>
             <p>In Jesus’s name, I renounce and bind each Strongman spirit in my life, including:</p>
             <div style={styles.variableBlock}>{getList('additional_sins')}</div>
             <p>and I renounce each of you and bind all your Junior spirits to you as one, and I break the power of each of you. And now, I declare none of you have any legal right to remain. I command you and all your Junior spirits out right now—get out, go to Jesus, and never return!</p>

             <p>In Jesus' name, I bind all unholy spirits, separately and individually, associated with any demonic bondages sent against me or my family, and I break all curses, pacts, spells, seals, hexes, vexes, triggers, trances, vows, demonic blessings, or any other demonic bondages sent against me or my family, and I command all of you unholy spirits to leave now, in Jesus's name.</p>
             
             <p>And now, in Jesus's name, I command every unholy spirit to leave me immediately. I declare you have no further right to me, and I command you to go now, in Jesus' name, and go where Jesus tells you to go.</p>

             <p>I also speak to every spirit of infirmity and, in Jesus's name, I command you to go as well, and take all your roots with you and remove all my sickness. Go!</p>
             <div style={styles.variableBlock}>{getList('infirmity')}</div>

             <p>Lord Jesus, I ask that you enforce my freedom from the curse of sin for which you shed your blood. I ask that you remove all unholy spirits from my life right now. I believe you will, and I thank you for doing so. Amen!</p>
           </div>
        )}

        {/* --- PRAYER #2 --- */}
        {activePrayer === 'PRAYER_2' && (
           <div style={styles.prayerText}>
             <h1>Prayer #2: Renounce Agreement Sins</h1>
             <p style={styles.textGray}><strong>Instructions:</strong> Pray 3 times a day for 3 days. Pray out loud.</p>
             <hr style={styles.divider}/>

             <p>Since sins of iniquity committed by my forefathers may be imputed to me, and any "agreement sins" made by my forefathers, such as oaths contrary to God, are often binding upon me, I therefore speak to all sins that have entered into my family line, either by me or my forefathers, as my sin. I choose to address them directly, knowing that clarity—not perfection—brings freedom.</p>
             
             <p>Father, I confess and believe in your Son, Jesus, as my Savior, and my loyalties are solely to you and Jesus as my Lord. I now renounce all blessings and all curses of all other religions, including:</p>
             <div style={styles.variableBlock}>{getList('other_religions')}</div>
             <p>and of all organizations and lodges, including the Masonic lodge. I no longer want any of their benefits, nor will I be bound by any of their curses. I declare that I am under the blood of Jesus, and the power of these things was defeated by him at the cross.</p>

             <p>I repent of and ask your forgiveness, for both me and my ancestors, for all participation in any group or activity with oaths, rituals, ceremonies or actions that are contrary to you, including:</p>
             <div style={styles.variableBlock}>{getList('agreements')}</div>
             
             <p>You alone are God, and you alone deserve my allegiance. My loyalties and allegiances are to you alone as Lord. If I, or any of my ancestors, have violated the first commandment by swearing allegiance to, or worshipping, a "deity" named Jahbulon (pronounced "Jah-bull-on") who is not God, or any other unholy spirit, I completely and utterly reject and renounce that worship and allegiance.</p>
             
             <p>Additionally, I completely and utterly reject and renounce, whether remembered clearly or not, with the full force of my will, all oaths, allegiances, worship, covenants and participation, either made by me or any of my ancestors, with Jahbulon and all other unholy spirits, including those of other religions either I or my ancestors have participated in. And by the blood of Jesus, your Son, I ask forgiveness for those oaths, allegiances, worship, covenants and participation, both for me and my family.</p>

             <p>I hereby break and renounce all unholy oaths and all covenants of any form taken by me and my ancestors, whether known or unknown to me, especially any I may have just listed above. I forever separate myself and my family from Jahbulon and all other unholy "deities" and spirits. On the authority of Jesus Christ, and not my own, I command you, Jahbulon, and all those other spirits, to release me and each member of my family, and go! I will not serve you, any lodge, or any other religion.</p>

             <p>If I, or anyone in my family, possess any objects associated with any unholy organization's oaths or covenants, I break those oaths, covenants, and all legal rights any unholy spirit may claim with those objects. I declare those objects neutralized and ineffective, in Jesus' name. Additionally, I declare all unholy spirits tied to those objects to be severed from them, and I command each spirit to leave now, in Jesus' name, and go directly and immediately to Jesus.</p>

             <p>Father, I ask you to block any unholy spirits—those that may have entered my family line through my sins or those of my ancestors—from passing to my subsequent generations. If any unholy spirits entered my bloodline through my sin or those of my ancestors, I ask you to pardon the torment due to those sins and free us from those spirits. Since all of those sins are imputed to me and my family, I repent of those sins personally, and I claim the blood of Jesus, your Son, over them. I also repent for any subsequent sins from those spirits affecting anyone in my family line, even those I may not yet recognize, and I claim your Son's blood over those sins as well.</p>

             <p>If any unholy spirits have entered my family line because of a curse, spell, or enchantment done by others, I ask that you give me the grace to forgive those people and release all judgments against them. I choose forgiveness as an act of obedience, not emotion. I forgive them for any effects caused by their sins committed against my family line, and for any damage they may have caused, and I release all judgments against them. I ask you, Lord, to break every curse, spell, or enchantment that is still in place against us.</p>

             <p>Father, I repent of any sins that may be the result of generational spirits in my family, and I ask you to block any power those spirits may have gained in my family line because of my own sin. Please heal any damage in my life and in the lives of my family members due to those generational spirits.</p>

             <p>I bind, and completely and utterly reject, with the full force of my will, any sin or spiritual defect of mine or any that have been imputed to me, as well as any temptation, allurements, or power that any unholy spirit may have over me as a result of my sin or the sins of any other person. I'm choosing freedom even if it means letting go of what I'm used to.</p>

             <p>Father, I ask you to bind, in your Son Jesus' precious blood, any and all curses, pacts, spells, seals, hexes, vexes, triggers, trances, vows, demonic blessings, or any other demonic bondages sent against me or my family or any object we possess. I ask you to bind them all and break them.</p>

             <p>And in the name of Jesus and by his blood, I bind all unholy spirits, separately and individually, in my life and the lives of my family, including:</p>
             <div style={styles.variableBlock}>{getList('additional_sins')}</div>
             <p>I break all curses, pacts, spells, seals, hexes, vexes, triggers, trances, vows, demonic blessings, or any other demonic bondages sent against me, my family, or any object we possess, and I command all of you spirits to leave and never return. Leave now!</p>

             <p><em>(If you or your ancestors have participated in other religions)</em>: I command all spirits of those religions, to leave me and each of my family members in the name of Jesus Christ. Leave now!</p>

             <p>In Jesus's name and by his blood, I break all unholy blood contracts made between me and any other person, whether human or spirit, whether known or unknown.</p>

             <p>I also command the spirits of Death, Infirmity, Divination, Rebellion, Lying, Rage, Manipulation, Domination and Control to leave me and each of my family members, in the name of Jesus Christ. Leave now!</p>

             <p>I also speak to every spirit of infirmity in me and in each of my family members and, in Jesus's name, I command you to go as well, and take all your roots and sickness with you. Go!</p>
             <div style={styles.variableBlock}>{getList('infirmity')}</div>

             <p>I speak to all other unholy spirits, either in or around me and my family. In the authority of Jesus and by his blood, I break every remaining legal right you claim, and I command you to leave us now. Go, and never return! In Jesus's name, I speak protection over my family. I declare our properties, our persons, and our pursuits off limits to all attacks. I declare every attack of all unholy spirits upon any of us, upon our belongings, our pursuits and occupations, to be ineffective.</p>

             <p>Father, I now ask in Jesus' name that you release your healing power into my body and into the bodies of each of my family members. Fully restore everything the thief has stolen, killed, or destroyed. Please heal these infirmities:</p>
             <div style={styles.variableBlock}>{getList('infirmity')}</div>

             <p>I pray all of this in the Holy Name of Jesus, and through the power of God the Father, and of the Son, and of the Holy Spirit. Amen.</p>

             <div style={{marginTop: '30px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a'}}>
               <p style={{color: '#92400e', margin: 0, fontSize: '14px'}}><strong>Reminder:</strong> Once you have completed the three days of Prayer #2, return to your Issue Grid (Identify Tab) and rate the intensity level of each item. Also, add any additional items you missed but are noticing changes in.</p>
             </div>
           </div>
        )}

        {/* --- SIMPLIFIED PRAYER (SELF & OTHERS) --- */}
        {activePrayer === 'SIMPLIFIED' && (
           <div style={styles.prayerText}>
             <h1>Simplified Prayer of Freedom</h1>
             
             {prayerMode === 'OTHERS' && (
               <div style={styles.nameInputBlock}>
                 <p>Who are you praying for today?</p>
                 <input type="text" placeholder="Enter their name..." value={lovedOneName} onChange={(e) => setLovedOneName(e.target.value)} style={styles.inlineInput} />
               </div>
             )}
             
             <div style={styles.nameInputBlock}><p><strong>Target Issue(s):</strong> {getTargetIssue()}</p></div>

             {prayerMode === 'SELF' ? (
               <>
                 <p>“Jesus, I repent of my sins. I want freedom from <strong>{getTargetIssue()}</strong> and I ask you to help me. I know I don't have to remember everything right now. So, please remind me of any sin I need to repent of or person I need to forgive to set me free.</p>
                 
                 <p><strong>Unforgiveness:</strong> “I repent of unforgiveness, for I know that it is a sin. I therefore choose to forgive, release all judgments against, and break all unholy soul ties with the following people:</p>
                 <div style={styles.variableBlock}>{getList('unforgiveness')}</div>

                 <p><strong>Sexual sin:</strong> “I repent of my sexual sins with the following people, I break all unholy blood contracts with each one, and I renounce and break all unholy soul ties with them, including:</p>
                 <div style={styles.variableBlock}>{getList('sexual_sin')}</div>
                 <p>I break all unholy soul ties with their sexual partners and all my other sexual partners I may not recall. I also break all unholy soul ties with any who encouraged me to engage in these sexual activities, including: <em>(Read names above again)</em>.</p>

                 <p><strong>Occult:</strong> “I repent of and renounce all occult activity I have engaged in, including:</p>
                 <div style={styles.variableBlock}>{getList('occult')}</div>
                 <p>and I break all unholy soul ties with those who encouraged me to do those activities.</p>

                 <p><strong>Other sins:</strong> “I also repent of these other sins and roots, and I break all unholy soul ties with anyone I did those sins with:</p>
                 <div style={styles.variableBlock}>{getCombinedOthers()}</div>

                 <p>“And now, in the authority of Jesus, I command every unholy spirit to leave me immediately. I declare you have no further right to me, and I command you to go now, in Jesus's name, and go where Jesus tells you to go.</p>
                 <p>“I also speak to the spirits of <strong>{getTargetIssue()}</strong> and I command you to go as well. Go now, in Jesus’s name.</p>
                 <p>“Jesus, I now ask that you enforce my freedom. I ask that you remove all unholy spirits from my life right now and set me free. Amen!”</p>
               </>
             ) : (
                <>
                  <p>“Jesus, I come before you on <strong>{getName()}'s</strong> behalf to help {getHimHer()} with <strong>{getTargetIssue()}</strong>. Please bring to mind any sin I need to repent of or person I need to forgive on {getHisHer()} behalf to set {getHimHer()} free.</p>
                  
                  <p><strong>Unforgiveness:</strong> “On <strong>{getName()}'s</strong> behalf: I repent of unforgiveness, for that it is a sin. I, therefore, declare that {getHeShe()} chooses to forgive, release all judgments against, and break all unholy soul ties with those {getHeShe()} holds unforgiveness towards, including:</p>
                  <div style={styles.variableBlockBlank}>_______________________________</div>

                  <p><strong>Sexual sin:</strong> “On <strong>{getName()}'s</strong> behalf: I repent of {getHisHer()} sexual sins, I break all unholy blood contracts with each one, and I renounce and break all unholy soul ties with each of {getHisHer()} sexual sin partners, including:</p>
                  <div style={styles.variableBlockBlank}>_______________________________</div>
                  <p>I also declare on {getHisHer()} behalf that {getHeShe()} breaks all unholy soul ties with their sexual partners and all other sexual partners I may not have listed. I also break, on {getHisHer()} behalf, all unholy soul ties with anyone who encouraged {getHimHer()} to engage in these sexual activities.</p>

                  <p><strong>Occult:</strong> “On <strong>{getName()}'s</strong> behalf: I repent of and renounce all occult activity {getHeShe()} has engaged in, including:</p>
                  <div style={styles.variableBlockBlank}>_______________________________</div>
                  <p>and I break, on {getHisHer()} behalf, all unholy soul ties with those who encouraged {getHimHer()} to do those activities.</p>

                  <p><strong>Other sins:</strong> “On <strong>{getName()}'s</strong> behalf: I also repent of other sins, and I break all unholy soul ties with anyone {getHeShe()} did those sins with:</p>
                  <div style={styles.variableBlockBlank}>_______________________________</div>

                  <p>“And now, in Jesus’ name, I command every unholy spirit to leave <strong>{getName()}</strong> immediately. I declare you have no further right to <strong>{getName()}</strong>, and I command you to go now, in Jesus’ name, and go where Jesus tells you to go.</p>
                  <p>“I also speak to the spirits of <strong>{getTargetIssue()}</strong> and I command you to go as well. Go now, in Jesus’s name.</p>
                  <p>“Jesus, I now ask that you enforce <strong>{getName()}'s</strong> freedom. I ask that you remove all unholy spirits from {getHisHer()} life right now and set {getHimHer()} free. Amen!”</p>
                </>
             )}
           </div>
        )}

        {/* --- 3-STEP RECOVERY --- */}
        {activePrayer === 'RECOVERY' && (
           <div style={styles.prayerText}>
             <h1>3-Step Recovery Prayer</h1>
             <p><em>Use this prayer to recover from any issue (emotional outburst, unusual pain, etc).</em></p>
             <div style={styles.nameInputBlock}><p><strong>Target Issue:</strong> {getTargetIssue()}</p></div>
             
             <p><strong>1. Ask the Lord to reveal your sins:</strong></p>
             <p>“Lord Jesus, I repent of my sins, and I ask you to help me recover. Please reveal any sin I need to repent of or person I need to forgive to set me free of <strong>{getTargetIssue()}</strong>.”</p>
             
             <p><strong>2. Repent of whatever comes to mind:</strong></p>
             <div style={{display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
               <p style={{margin: 0, fontSize: '14px', color: '#6b7280'}}>Type what comes to mind to fill in the blank below (Optional):</p>
               <input type="text" placeholder="e.g., getting angry with my boss..." value={recoverySin} onChange={e => setRecoverySin(e.target.value)} style={styles.inlineInput} />
             </div>
             
             <p>“I repent of <strong>{recoverySin || '__________'}</strong> and I forgive anyone involved.</p>
             <p>“And I break all unholy soul ties with and remove all judgments against all people I just named.”</p>
             
             <p><strong>3. Command unholy spirits to leave:</strong></p>
             <p>“And in Jesus’ name, I now command the spirit of <strong>{getTargetIssue()}</strong> to leave me, immediately. Go now, in Jesus’ name!” <em>(Repeat one more time)</em></p>
             
             <p style={{marginTop: '30px', color: '#6b7280', fontSize: '14px'}}><em>Note: Re-calibrate your intensity level. If it has diminished but not disappeared, keep repeating Step 3. If no change, repeat the entire process.</em></p>
           </div>
        )}
        
        {/* --- DAILY PRAYER (PRAYER #3) --- */}
        {activePrayer === 'DAILY' && (
           <div style={styles.prayerText}>
             <h1>The Daily Prayer (Prayer #3)</h1>
             <p>Heavenly Father, I come to you in Jesus’ name, being made one with him through the new covenant in his blood. I ask for your grace to help me deny myself, die to myself, be fully led by your Spirit, and no longer conform to the patterns of this world. And I commit, and remind myself, to always ask you for guidance in every decision I make that I may stay in the center of your will. Help me to be closer to you, diligently pursue you, and take every thought captive through the Word of Christ.</p>
             <p>Please abundantly provide for me and my family—not only in full financial provision, but also through health in both body and relationships with each other. Prosper all that we do and grant us the abundant life your Son has promised us.</p>
             <p>Watch over and protect my family, and bless all of us to pursue you, to focus on you, to yield to you, to deny ourselves, and bring you glory in all we do. I repent of my sins, I forgive each person who has hurt me, and I release all judgments against them, including:</p>
             <div style={styles.variableBlock}>{getList('unforgiveness')}</div>
             
             <p>On behalf of my family, I repent of their sins and break all unholy soul ties they may have with any person. I claim Jesus’ blood over all our sins, and I command all unholy spirits to leave us now! Go, in Jesus’ name!</p>
             
             <p>I plead the blood of Jesus over any curse or words working against me or my family from anyone in authority, or who carries authority, or even from my own mouth, for which I repent. I ask that those words be voided, and anything recorded in heaven from them be stricken, removed, and all legal rights revoked.</p>
             
             <p>For each of my family members, I now break, by the authority of Jesus Christ, every curse put upon us. I break all curses, seals, spells, hexes, vexes, and all other demonic bondages, all word curses either spoken over any of us or that have been written or texted, and any other unholy bondages sent against me, my family, or any object we possess. And in the name of Jesus, I command every spirit associated with those curses to be bound, leave, and never return to us.</p>

             <p>In the name of Jesus and through his blood, I bind and sever every cord of every unholy spirit over our home. I render every unholy spirit inactive. I declare you are cut off from your communication. I declare confusion into your camp, I declare all your works ineffective against me and my family, and I command you out of my home in Jesus’ name.</p>
             
             <p>For both me and each of my family members, in the name of Jesus, I renounce and bind every demonic stronghold at work in our lives. I bind every named and unnamed spirit under each of these stronghold spirits. I declare each spirit inactive in our lives and I declare all their works ineffective. And now, I speak to each of you spirits: In Jesus’s name, I break every legal right you have to remain, and I command you to leave now and never return.</p>

             <p>And Lord, I ask you to strengthen my memory, cognitive ability, thinking power, and imagination. Help me, also, to remember those things I should remember, and not remember those things I should forget.</p>

             <p>Please bring forth the fruit of your Spirit each day, in me and each member of my family—love, joy, peace, patience, goodness, kindness, gentleness, faithfulness, and self-control. Grant us mercy in all we do and help us to lean on you each day.</p>

             <p>I pray all of this in the Holy Name of Jesus, and through the power of God the Father, and of the Son, and of the Holy Spirit. Amen.</p>
           </div>
        )}

        {/* --- NATIONS PRAYER --- */}
        {activePrayer === 'NATIONS' && (
           <div style={styles.prayerText}>
             <h1>Agreement Sins Renunciation Prayer for Nations</h1>
             
             <div style={styles.nameInputBlock}>
                 <p>Which nation are you praying for today?</p>
                 <input 
                   type="text" 
                   value={nationName} 
                   onChange={(e) => {
                     setNationName(e.target.value);
                     updateInventory('nation_name', e.target.value);
                   }} 
                   style={styles.input} 
                 />
             </div>

             <p>Father God, on behalf of my nation, <strong>{nationName}</strong>, I repent of and ask your forgiveness for our sins and for the sins of our forefathers in participating in any group with oaths, rituals, ceremonies or actions that are contrary to you. You alone are God, and you alone deserve our allegiance.</p>
             
             <p>On behalf of my nation and for those of our people and forefathers who have violated the first commandment by swearing allegiance to, or worshipping, Jahbulon or any other unholy spirit, I completely and utterly reject and renounce that worship and allegiance. Additionally, I completely and utterly reject and renounce, on behalf of my nation, with the full force of my will, all oaths, allegiances, worship, covenants and participation made by any of us or our forefathers with Jahbulon and all other unholy spirits. And by the blood of Jesus, your Son, I ask forgiveness for those oaths, allegiances, worship, covenants and participation, for our nation.</p>

             <p>In Jesus's name I hereby break and renounce all unholy oaths and all covenants of any form taken by our people, our fathers and forefathers; and I forever separate the people of <strong>{nationName}</strong> from Jahbulon and all other unholy “deities” and spirits. On the authority of Jesus Christ, I command you, Jahbulon, and all other contrary spirits, to release all people within my nation, and go! I declare we, as a nation, will not serve you, any lodge, or any other religion.</p>

             <p>Father, I ask you to block all unholy spirits ― any that have entered the family lines of those residing in <strong>{nationName}</strong> due to generational iniquities ― from passing to subsequent generations. For all unholy spirits who have entered our bloodlines through sins of our fathers and forefathers, I ask you to pardon the torment due to those sins and free our people from those spirits. Since all of those sins are imputed to us and our generation, as advocate and priest of my nation, I repent of those sins and I claim the blood of Jesus, your Son, over them. I also repent for all subsequent sins from those spirits affecting anyone else in our nation, and I claim your Son’s blood over those sins as well.</p>

             <p>For all unholy spirits that have entered the family lines of anyone in our nation because of a curse, spell, or enchantment, I ask you, Lord, to break every curse, spell, or enchantment that is still in place against them.</p>

             <p>Father, on behalf of my nation I repent of all sins that are the result of generational spirits in our peoples' lives, and I ask you to block all power those spirits may have gained in our family lines. Please heal all damage in the lives of our nation's members due to those generational spirits.</p>

             <p>Father, I ask you to bind, in your Son Jesus’ precious blood, all curses, pacts, spells, seals, hexes, vexes, triggers, trances, vows, demonic blessings, and all other demonic bondages sent against any person within the boundaries of our nation. I ask you to bind them all and break them.</p>

             <p>And in the name of Jesus and by his blood, I bind all unholy spirits, separately and individually, in the lives of each person within <strong>{nationName}</strong>. I break all curses, pacts, spells, seals, hexes, vexes, triggers, trances, vows, demonic blessings, and all other demonic bondages sent against each person within our borders, in Jesus's name, and I command all of you spirits to leave, never return, and go to Jesus for your next assignment. Go now!</p>

             <p>In Jesus' name and by his blood, I break all unholy blood contracts made within our borders with any person, whether human or spirit.</p>

             <p>I also command the spirits of Death, Infirmity, Divination, Rebellion, Lying, Manipulation, Rage, Domination and Control to leave each person within our nation, in the name of Jesus Christ. Go now!</p>

             <p>I speak to all other unholy spirits, either in or around any person within our nation. In the authority of Jesus and by his blood, I declare "forgiven" every sin you claim as your legal right, and I break that legal right, and I command you to leave that person now. Go, and never return! In Jesus's name I speak protection over all our families. I declare our properties, our persons, and our pursuits off limits to all attacks. I declare every attack of all unholy spirits upon any of us, upon our belongings, our pursuits and occupations, to be ineffective, in Jesus's name.</p>

             <p>I also speak, in Jesus's name, to every spirit of infirmity sickening any person within our nation and command you to go as well, and take all your roots and sickness with you.</p>

             <p>Father, I now ask in Jesus’ name that you release your healing power into the bodies of each person within <strong>{nationName}</strong>. Fully restore everything the thief has stolen, killed, or destroyed.</p>

             <p>And I ask that your will be done in this nation. And in the name and authority of Jesus, I declare the Lord's will shall be done in this nation.</p>

             <p>I pray all of this in the Holy Name of Jesus, and through the power of God the Father, and of the Son, and of the Holy Spirit. Amen.</p>
           </div>
        )}
      </div>
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
             <p style={{ color: '#666', marginBottom: '20px' }}>Clear all saved lists from the Cloud. (Irreversible)</p>
             <button onClick={() => {
                if (window.confirm("Are you sure? This will delete all your lists from the Cloud Database.")) {
                  saveToCloud({}, []);
                  setInventory({});
                  setIssues([]);
                  alert("Data Cleared from Cloud.");
                  sessionStorage.removeItem('freedom_logged_in');
                  setView('LOGIN');
                }
             }} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '16px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Reset All Cloud Data</button>
           </div>
           <br />
           <button onClick={() => {
              sessionStorage.removeItem('freedom_logged_in');
              setView('LOGIN');
           }} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '10px' }}>🔒 Logout</button>
        </main>
      </div>
    );
  }
  
  return null; 
}

const styles: { [key: string]: React.CSSProperties } = {
  centerContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  layout: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif' },
  header: { padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', alignItems: 'center', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10 },
  main: { maxWidth: '900px', margin: '20px auto', textAlign: 'center', padding: '20px', width: '100%' },
  emptyState: { padding: '40px', textAlign: 'center', color: '#6b7280' },
  scrollList: { overflowY: 'auto', flex: 1, marginTop: '20px' },
  sidebarTitle: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
  workArea: { maxWidth: '700px', margin: '0 auto', paddingBottom: '100px' }, 
  workHeader: { marginBottom: '20px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '300px', border: '1px solid #eee', margin: '10px' },
  cardActive: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '2px solid #4f46e5', width: '100%', maxWidth: '300px', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.1)', margin: '10px' },
  grid: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' },
  chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' },
  chip: { padding: '8px 14px', backgroundColor: '#f3f4f6', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: '1px solid #e5e7eb', color: '#374151', transition: 'all 0.2s' },
  chipActive: { padding: '8px 14px', backgroundColor: '#e0e7ff', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: '1px solid #4f46e5', color: '#4f46e5', fontWeight: 'bold', transition: 'all 0.2s' },
  input: { width: '100%', padding: '16px', margin: '15px 0', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', textAlign: 'center' },
  selectInput: { width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', textAlign: 'center', backgroundColor: 'white' },
  miniSelect: { padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  inlineInput: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', width: '100%', maxWidth: '300px' },
  textArea: { width: '100%', height: '300px', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '16px', fontFamily: 'inherit', lineHeight: '1.5', resize: 'none', backgroundColor: '#fafafa' },
  btnPrimary: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '16px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%', marginTop: '10px', minHeight: '44px' },
  btnGrand: { backgroundColor: '#7c3aed', color: 'white', border: 'none', padding: '20px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', width: '100%', marginBottom: '30px', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)' },
  btnSmall: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  btnText: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', padding: '10px' },
  backBtn: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginBottom: '10px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px', padding: '10px' },
  editBtn: { backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  catBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#374151', fontSize: '14px', borderBottom: '1px solid #f3f4f6' },
  catBtnActive: { display: 'block', width: '100%', textAlign: 'left', padding: '16px', border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' },
  catNum: { display: 'inline-block', width: '30px', color: '#9ca3af', fontSize: '12px' },
  issueRow: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f3f4f6', marginBottom: '15px' },
  trackerGrid: { display: 'flex', gap: '20px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' },
  trackerItem: { flex: 1, textAlign: 'center' as const },
  trackerLabel: { display: 'block', fontSize: '12px', textTransform: 'uppercase' as const, color: '#9ca3af', marginBottom: '5px', fontWeight: 'bold' },
  trackerScore: { fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' },
  trackerScoreUpdated: { fontSize: '24px', fontWeight: 'bold', color: '#10b981' },
  prayerContainer: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  prayerHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  prayerText: { fontSize: '18px', lineHeight: '1.8', color: '#1f2937', textAlign: 'left' },
  divider: { margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' },
  variableBlock: { backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '15px', margin: '15px 0', color: '#1e3a8a', whiteSpace: 'pre-wrap', borderRadius: '4px' },
  variableBlockBlank: { backgroundColor: '#fff', border: '1px dashed #ccc', padding: '15px', margin: '15px 0', color: '#999', borderRadius: '4px' },
  nameInputBlock: { backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e5e7eb', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  toggleContainer: { display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' },
  toggle: { padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: '#6b7280', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px' },
  toggleActive: { padding: '8px 16px', border: 'none', backgroundColor: 'white', color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  serifTitle: { fontFamily: 'Georgia, serif', color: '#111827', margin: 0 },
  bigTitle: { fontFamily: 'Georgia, serif', fontSize: '32px', color: '#111827', marginBottom: '10px' },
  subtitle: { color: '#6b7280', fontSize: '16px' },
  textGray: { color: '#6b7280', marginBottom: '15px', fontSize: '14px' },
  tag: { backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block' },
  instruction: { fontSize: '16px', color: '#4b5563', marginBottom: '20px', lineHeight: '1.5' },
  stepBadgeActive: { display: 'block', fontSize: '24px', color: '#4f46e5', fontWeight: 'bold', marginBottom: '10px' },
  check: { color: '#10b981', marginLeft: '8px', fontWeight: 'bold' },
  saveIndicator: { textAlign: 'right', marginTop: '10px', fontSize: '12px', fontWeight: 'bold' }
};

export default App;

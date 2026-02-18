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
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'INVENTORY' | 'PRAYER_MENU' | 'PRAYER_ACTIVE'>('LOGIN');
  const [passcode, setPasscode] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryData | null>(null);
  const [activePrayer, setActivePrayer] = useState<string>('');
  
  // This stores your lists! 
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
  // HELPERS FOR PRAYER INJECTION
  // ------------------------------------------------
  const getList = (key: string) => {
    const val = inventory[key];
    return val && val.trim().length > 0 ? val : "___________";
  };

  // Aggregates all "Other" categories into one list for the general prayer
  const getCombinedOthers = () => {
    const mainKeys = ['unforgiveness', 'sexual_sin', 'occult'];
    const others = CATEGORIES.filter(c => !mainKeys.includes(c.id));
    
    let combined = "";
    others.forEach(cat => {
      if (inventory[cat.id]) {
        combined += `\n• [${cat.title}]: ${inventory[cat.id]}`;
      }
    });
    return combined || "___________";
  };

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
  // INVENTORY VIEW
  // ------------------------------------------------
  if (view === 'INVENTORY') {
    return (
      <div style={styles.layout}>
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
                {inventory[activeCategory.id] ? 'Saved ✓' : 'Start typing to save...'}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // PRAYER MENU
  // ------------------------------------------------
  if (view === 'PRAYER_MENU') {
    return (
      <div style={styles.layout}>
        <header style={styles.header}>
           <button onClick={() => setView('DASHBOARD')} style={styles.backBtn}>&larr; Back to Dashboard</button>
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
              <p style={styles.textGray}>Quick prayer for immediate issues.</p>
              <button onClick={() => { setActivePrayer('RECOVERY'); setView('PRAYER_ACTIVE'); }} style={styles.btnPrimary}>Start Prayer</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ------------------------------------------------
  // PRAYER ACTIVE VIEW (THE ENGINE)
  // ------------------------------------------------
  return (
    <div style={styles.layout}>
      <div style={styles.prayerContainer}>
        <div style={styles.prayerHeader}>
           <button onClick={() => setView('PRAYER_MENU')} style={styles.backBtn}>&larr; Change Prayer</button>
           <button onClick={() => setView('INVENTORY')} style={styles.editBtn}>✎ Edit My Lists</button>
        </div>

        {activePrayer === 'FREEDOM' && (
          <div style={styles.prayerText}>
            <h1>The Prayer of Freedom (Personal)</h1>
            <p><strong>Instructions:</strong> Read out loud. The names and issues you listed in your Inventory have been added below.</p>
            <hr style={styles.divider}/>
            
            <p>“Lord Jesus, I repent of my sins. I want freedom from my burdens and I ask you to help me. Please bring to mind any sin I need to repent of or a person I need to forgive to set me free.</p>
            
            <h3>1. Unforgiveness</h3>
            <p>“I repent of unforgiveness, for I know that it is a sin. I therefore choose to forgive, release all judgments against, and break all unholy soul ties with the following people:</p>
            <div style={styles.variableBlock}>{getList('unforgiveness')}</div>

            <h3>2. Sexual Sin</h3>
            <p>“I repent of my sexual sins with the following people. I break all unholy blood contracts with each one, and I renounce and break all unholy soul ties with them, including:</p>
            <div style={styles.variableBlock}>{getList('sexual_sin')}</div>
            <p>I break all unholy soul ties with their sexual partners and all my other sexual partners I may not recall.</p>

            <h3>3. Occult & False Religions</h3>
            <p>“I repent of and renounce all occult activity I have engaged in, including:</p>
            <div style={styles.variableBlock}>{getList('occult')}</div>
            <p>And I break all unholy soul ties with those who encouraged me to do those activities.</p>

            <h3>4. Other Sins & Roots</h3>
            <p>“I also repent of these specific areas I have identified (Idolatry, Vows, Pride, etc):</p>
            <div style={styles.variableBlock}>{getCombinedOthers()}</div>
            <p>And I break all unholy soul ties with anyone involved in these sins.</p>

            <h3>Closing Command</h3>
            <p>“And now, in Jesus’ name, I command every unholy spirit to leave me immediately. I declare you have no further right to me, and I command you to go now, in Jesus’ name, and go where Jesus tells you to go.</p>
            <p>“Lord Jesus, I now ask that you enforce my freedom from the curse of sin. I ask that you remove all unholy spirits from my life right now and set me free. Amen!”</p>
          </div>
        )}

        {activePrayer === 'DAILY' && (
           <div style={styles.prayerText}>
             <h1>The Daily Prayer</h1>
             <p>Heavenly Father, I come to you in Jesus’ name... I ask for your grace to help me deny myself, die to myself, be fully led by your Spirit, and no longer conform to the patterns of this world.</p>
             <p>I repent of my sins, I forgive each person who has hurt me, and I release all judgments against them:</p>
             <div style={styles.variableBlock}>{getList('unforgiveness')}</div>
             <p>And I break all unholy soul ties I have with any person:</p>
             <div style={styles.variableBlock}>{getList('soul_ties') || "(List any soul ties here)"}</div>
             <p>I claim Jesus’ blood over all our sins, and I command all unholy spirits to leave us now! Go, in Jesus’ name!</p>
             <p>Fully restore all that the thief has stolen. Lord, I also ask that you remove the memory of all abuses and traumas any of us have experienced.</p>
             <div style={styles.variableBlock}>{getList('abuse') || "(List specific traumas if needed)"}</div>
             <p>I pray all of this in the Holy Name of Jesus. Amen.</p>
           </div>
        )}

        {activePrayer === 'RECOVERY' && (
           <div style={styles.prayerText}>
             <h1>3-Step Recovery Prayer</h1>
             <p><em>Use this for immediate relief from an emotional outburst or pain.</em></p>
             <h3>Step 1: Reveal</h3>
             <p>“Lord Jesus, I repent of my sins, and I ask you to help me recover. Please reveal any sin I need to repent of or person I need to forgive to set me free of this issue.”</p>
             <h3>Step 2: Repent</h3>
             <p>“I repent of _________ (name the sin).”</p>
             <p>“I forgive _________ (name the person).”</p>
             <h3>Step 3: Command</h3>
             <p>“And in Jesus’ name, I now command the spirit of _________ (name the issue) to leave me, immediately. Go now, in Jesus’ name!”</p>
           </div>
        )}
        
      </div>
    </div>
  );
}

// ------------------------------------------------
// STYLES
// ------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  // Layouts
  centerContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  layout: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif' },
  header: { padding: '20px 40px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', alignItems: 'center' },
  main: { maxWidth: '900px', margin: '40px auto', textAlign: 'center', padding: '20px', width: '100%' },
  
  // Sidebar
  sidebar: { width: '300px', backgroundColor: '#f8f9fa', borderRight: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 },
  scrollList: { overflowY: 'auto', flex: 1, marginTop: '20px' },
  sidebarTitle: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
  
  // Content Logic
  mainContent: { marginLeft: '300px', padding: '60px', backgroundColor: '#fff', minHeight: '100vh' }, 
  workArea: { maxWidth: '700px', margin: '0 auto' },
  workHeader: { marginBottom: '20px' },
  
  // Components
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '300px', border: '1px solid #eee' },
  cardActive: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '2px solid #4f46e5', width: '300px', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.1)' },
  grid: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' },
  
  // Inputs & Buttons
  input: { width: '100%', padding: '12px', margin: '15px 0', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', textAlign: 'center' },
  textArea: { width: '100%', height: '300px', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '16px', fontFamily: 'inherit', lineHeight: '1.5', resize: 'none', backgroundColor: '#fafafa' },
  btnPrimary: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%', marginTop: '10px' },
  btnSecondary: { backgroundColor: '#f3f4f6', color: '#9ca3af', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 'bold', width: '100%', marginTop: '10px' },
  btnText: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' },
  backBtn: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginBottom: '20px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px' },
  editBtn: { backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },

  // List Items
  catBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#374151', fontSize: '14px' },
  catBtnActive: { display: 'block', width: '100%', textAlign: 'left', padding: '12px', border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' },
  catNum: { display: 'inline-block', width: '30px', color: '#9ca3af', fontSize: '12px' },
  
  // Prayer Room Styles
  prayerContainer: { maxWidth: '800px', margin: '0 auto', padding: '40px' },
  prayerHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' },
  prayerText: { fontSize: '18px', lineHeight: '1.8', color: '#1f2937' },
  divider: { margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' },
  variableBlock: { backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '15px', margin: '15px 0', color: '#1e3a8a', whiteSpace: 'pre-wrap', borderRadius: '4px' },

  // Typography
  serifTitle: { fontFamily: 'Georgia, serif', color: '#111827', margin: 0 },
  bigTitle: { fontFamily: 'Georgia, serif', fontSize: '36px', color: '#111827', marginBottom: '10px' },
  subtitle: { color: '#6b7280', fontSize: '18px' },
  textGray: { color: '#6b7280', marginBottom: '15px', fontSize: '14px' },
  tag: { backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block' },
  instruction: { fontSize: '16px', color: '#4b5563', marginBottom: '20px', lineHeight: '1.5' },
  stepBadge: { display: 'block', fontSize: '24px', color: '#d1d5db', fontWeight: 'bold', marginBottom: '10px' },
  stepBadgeActive: { display: 'block', fontSize: '24px', color: '#4f46e5', fontWeight: 'bold', marginBottom: '10px' },
  check: { color: '#10b981', marginLeft: '8px', fontWeight: 'bold' },
  saveIndicator: { textAlign: 'right', marginTop: '10px', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }
};

export default App;

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
  date: string;
  initialIntensity: number;
  intensity3Days?: number; // Optional: specific check-in
  intensity30Days?: number; // Optional: specific check-in
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
      initialIntensity: newIssueIntensity,
      date: new Date().toLocaleDateString()
    };
    const updatedIssues = [newIssue, ...issues];
    setIssues(updatedIssues);
    localStorage.setItem('freedom_issues', JSON.stringify(updatedIssues));
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
    localStorage.setItem('freedom_issues', JSON.stringify(updatedIssues));
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
      // For Word Curses, we include the LIES in the Freedom Prayer list
      if (cat.id === 'word_curses' && inventory['word_curses']) {
         combined += `\n• [Word Curses]: ${inventory['word_curses']}`;
      }
      else if (inventory[cat.id]) {
        combined += `\n• [${cat.title}]: ${inventory[cat.id]}`;
      }
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
              <h3>Recent Issues</h3>
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
                          <select 
                            style={styles.miniSelect}
                            onChange={(e) => updateIssueProgress(issue.id, '3day', parseInt(e.target.value))}
                          >
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
                          <select 
                            style={styles.miniSelect}
                            onChange={(e) => updateIssueProgress(issue.id, '30day', parseInt(e.target.value))}
                          >
                            <option value="">Update...</option>
                            {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        )}
                      </div>
                    </div>

                  </div>
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

              {/* SPECIAL LAYOUT FOR WORD CURSES */}
              {activeCategory.id === 'word_curses' ? (
                <>
                  <p style={styles.instruction}>
                    <strong>The Lie:</strong> List the negative words spoken over you.<br/>
                    <strong>The Truth:</strong> List the scripture/truth that breaks that lie.
                  </p>
                  
                  <div style={{display: 'flex', gap: '20px', flexDirection: 'column'}}>
                     <div>
                       <label style={{fontWeight:'bold', display:'block', marginBottom:'5px', color:'#ef4444'}}>THE LIE (CURSE)</label>
                       <textarea
                        style={{...styles.textArea, height: '150px', borderColor: '#fecaca'}}
                        placeholder="e.g. You will never succeed..."
                        value={inventory['word_curses'] || ''}
                        onChange={(e) => updateInventory('word_curses', e.target.value)}
                      />
                     </div>
                     <div>
                       <label style={{fontWeight:'bold', display:'block', marginBottom:'5px', color:'#10b981'}}>THE TRUTH (SCRIPTURE)</label>
                       <textarea
                        style={{...styles.textArea, height: '150px', borderColor: '#a7f3d0'}}
                        placeholder="e.g. I can do all things through Christ..."
                        value={inventory['word_curses_truth'] || ''}
                        onChange={(e) => updateInventory('word_curses_truth', e.target.value)}
                      />
                     </div>
                  </div>
                </>
              ) : (
                // STANDARD LAYOUT FOR ALL OTHER CATEGORIES
                <>
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
                </>
              )}
              
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
  // VIEW: PRAYER ACTIVE (THE ENGINE)
  // ------------------------------------------------
  if (view === 'PRAYER_ACTIVE') {
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
            <p><strong>Instructions:</strong> Read out loud. {prayerMode === 'SELF' ? 'Your saved lists are below.' : 'Fill in the blanks as you go.'}</p>
            <hr style={styles.divider}/>
            
            {prayerMode === 'SELF' ? (
              // ---------------- SELF PRAYER ----------------
              <>
                <p>“Lord Jesus, I repent of my sins. I want freedom from my burdens and I ask you to help me. Please bring to mind any sin I need to repent of or a person I need to forgive to set me free.</p>
                
                <h3>1. Unforgiveness</h3>
                <p>“I repent of unforgiveness, for I know that it is a sin. I therefore choose to forgive, release all judgments against, and break all unholy soul ties with the following people:</p>
                <div style={styles.variableBlock}>{getList('unforgiveness')}</div>

                <h3>2. Sexual Sin</h3>
                <p>“I repent of my sexual sins with the following people. I break all unholy blood contracts with each one, and I renounce and break all unholy soul ties with them, including:</p>
                <div style={styles.variableBlock}>{getList('sexual_sin')}</div>

                <h3>3. Occult & False Religions</h3>
                <p>“I repent of and renounce all occult activity I have engaged in, including:</p>
                <div style={styles.variableBlock}>{getList('occult')}</div>

                <h3>4. Other Sins & Roots</h3>
                <p>“I also repent of these specific areas I have identified (Idolatry, Vows, Pride, etc):</p>
                <div style={styles.variableBlock}>{getCombinedOthers()}</div>

                <h3>Closing Command</h3>
                <p>“And now, in Jesus’ name, I command every unholy spirit to leave me immediately. I declare you have no further right to me, and I command you to go now, in Jesus’ name, and go where Jesus tells you to go.</p>
                <p>“Lord Jesus, I now ask that you enforce my freedom from the curse of sin. I ask that you remove all unholy spirits from my life right now and set me free. Amen!”</p>
              </>
            ) : (
              // ---------------- LOVED ONE PRAYER ----------------
              <>
                 <p>“Lord Jesus, I come before you on <strong>{getName()}'s</strong> behalf. Please bring to mind any sin I need to repent of or person I need to forgive on {getName()}'s behalf.</p>

                 <h3>1. Unforgiveness</h3>
                 <p>“On <strong>{getName()}'s</strong> behalf: I repent of unforgiveness. I declare that {getHeShe()} chooses to forgive and release:</p>
                 <div style={styles.variableBlockBlank}>_______________________________</div>

                 <h3>2. Sexual Sin</h3>
                 <p>“On <strong>{getName()}'s</strong> behalf: I repent of sexual sins and soul ties, including:</p>
                 <div style={styles.variableBlockBlank}>_______________________________</div>

                 <h3>3. Occult</h3>
                 <p>“On <strong>{getName()}'s</strong> behalf: I repent of and renounce all occult activity, including:</p>
                 <div style={styles.variableBlockBlank}>_______________________________</div>
                 
                 <h3>4. Other Sins</h3>
                 <p>“On <strong>{getName()}'s</strong> behalf: I also repent of other sins and roots, including:</p>
                 <div style={styles.variableBlockBlank}>_______________________________</div>

                 <h3>Closing Command</h3>
                 <p>“And now, in Jesus’ name, I command every unholy spirit to leave <strong>{getName()}</strong> immediately. Go now, in Jesus’ name!</p>
                 <p>“Lord Jesus, I ask that you remove all unholy spirits from {getName()}'s life right now and set {getName()} free. Amen!”</p>
              </>
            )}
          </div>
        )}

        {/* RECOVERY PRAYER (Integrated with Identify Phase) */}
        {activePrayer === 'RECOVERY' && (
           <div style={styles.prayerText}>
             <h1>3-Step Recovery Prayer</h1>
             <div style={styles.nameInputBlock}>
               <p><strong>Target Issue:</strong> {getLatestIssue()}</p>
             </div>
             <p><em>Use this for immediate relief from an emotional outburst or pain.</em></p>
             <h3>Step 1: Reveal</h3>
             <p>“Lord Jesus, I repent of my sins, and I ask you to help me recover. Please reveal any sin I need to repent of or person I need to forgive to set me free of <strong>{getLatestIssue()}</strong>.”</p>
             <h3>Step 2: Repent</h3>
             <p>“I repent of _________ (name the sin).”</p>
             <p>“I forgive _________ (name the person).”</p>
             <h3>Step 3: Command</h3>
             <p>“And in Jesus’ name, I now command the spirit of <strong>{getLatestIssue()}</strong> to leave me, immediately. Go now, in Jesus’ name!”</p>
           </div>
        )}
        
        {activePrayer === 'DAILY' && (
           <div style={styles.prayerText}>
             <h1>The Daily Prayer</h1>
             <p>Heavenly Father, I come to you in Jesus’ name... I ask for your grace to help me deny myself, die to myself, be fully led by your Spirit.</p>
             <p>I repent of my sins, I forgive each person who has hurt me, and I release all judgments against them:</p>
             <div style={styles.variableBlock}>{getList('unforgiveness')}</div>
             <p>And I break all unholy soul ties I have with any person:</p>
             <div style={styles.variableBlock}>{getList('soul_ties') || "(List any soul ties here)"}</div>
             
             {/* NEW SECTION: Breaking Words */}
             <p><strong>Breaking Curses:</strong></p>
             <p>I break all curses, seals, spells, hexes, and word curses either spoken over any of us or that have been written or texted. Specifically, I break these words spoken over me:</p>
             <div style={{...styles.variableBlock, borderColor: '#ef4444', backgroundColor: '#fef2f2', color: '#7f1d1d'}}>
               {prayerMode === 'OTHERS' ? "____________________" : (inventory['word_curses'] || "(Go to Inventory > Word Curses to add the Lies)")}
             </div>
             
             <p><strong>Renewing My Mind:</strong></p>
             <p>Lord, renew my mind to believe who you say I am in the Bible. I declare these truths over my life:</p>
             <div style={{...styles.variableBlock, borderColor: '#10b981', backgroundColor: '#ecfdf5', color: '#064e3b'}}>
               {prayerMode === 'OTHERS' ? "____________________" : (inventory['word_curses_truth'] || "(Go to Inventory > Word Curses to add the Scriptures)")}
             </div>

             <p>I claim Jesus’ blood over all our sins, and I command all unholy spirits to leave us now! Go, in Jesus’ name!</p>
             <p>I pray all of this in the Holy Name of Jesus. Amen.</p>
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
             <p style={{ color: '#666', marginBottom: '20px' }}>Clear all saved lists and reset the app. (Irreversible)</p>
             <button onClick={() => {
                if (window.confirm("Are you sure? This will delete all your lists.")) {
                  localStorage.removeItem('freedom_inventory');
                  localStorage.removeItem('freedom_issues');
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
  
  return null; // Should not reach
}

// ------------------------------------------------
// STYLES
// ------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  // Layouts
  centerContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  layout: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif' },
  header: { padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', alignItems: 'center', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 10 },
  main: { maxWidth: '900px', margin: '20px auto', textAlign: 'center', padding: '20px', width: '100%' },
  
  // Sidebar
  sidebar: { width: '300px', backgroundColor: '#f8f9fa', borderRight: '1px solid #e5e7eb', padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 20 },
  scrollList: { overflowY: 'auto', flex: 1, marginTop: '20px' },
  sidebarTitle: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
  
  // Content Logic
  mainContent: { flex: 1, padding: '20px', backgroundColor: '#fff', minHeight: '100vh', marginLeft: '0' }, 
  workArea: { maxWidth: '700px', margin: '0 auto', paddingBottom: '100px' }, 
  workHeader: { marginBottom: '20px' },
  
  // Components
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '300px', border: '1px solid #eee', margin: '10px' },
  cardActive: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '2px solid #4f46e5', width: '100%', maxWidth: '300px', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.1)', margin: '10px' },
  grid: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' },
  
  // Inputs & Buttons
  input: { width: '100%', padding: '16px', margin: '15px 0', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', textAlign: 'center' },
  selectInput: { width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', textAlign: 'center', backgroundColor: 'white' },
  miniSelect: { padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  inlineInput: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', marginLeft: '10px', width: '200px' },
  textArea: { width: '100%', height: '300px', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '16px', fontFamily: 'inherit', lineHeight: '1.5', resize: 'none', backgroundColor: '#fafafa' },
  
  btnPrimary: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '16px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', width: '100%', marginTop: '10px', minHeight: '44px' },
  btnSecondary: { backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '16px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '10px', minHeight: '44px' },
  
  btnText: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', padding: '10px' },
  backBtn: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', marginBottom: '10px', textAlign: 'left', fontWeight: 'bold', fontSize: '16px', padding: '10px' },
  editBtn: { backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },

  // List Items
  catBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#374151', fontSize: '14px', borderBottom: '1px solid #f3f4f6' },
  catBtnActive: { display: 'block', width: '100%', textAlign: 'left', padding: '16px', border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' },
  catNum: { display: 'inline-block', width: '30px', color: '#9ca3af', fontSize: '12px' },
  
  // Issue Tracker Styles
  issueRow: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f3f4f6', marginBottom: '15px' },
  trackerGrid: { display: 'flex', gap: '20px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' },
  trackerItem: { flex: 1, textAlign: 'center' as const },
  trackerLabel: { display: 'block', fontSize: '12px', textTransform: 'uppercase' as const, color: '#9ca3af', marginBottom: '5px', fontWeight: 'bold' },
  trackerScore: { fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' },
  trackerScoreUpdated: { fontSize: '24px', fontWeight: 'bold', color: '#10b981' },

  // Prayer Room Styles
  prayerContainer: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
  prayerHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  prayerText: { fontSize: '18px', lineHeight: '1.8', color: '#1f2937', textAlign: 'left' },
  divider: { margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' },
  variableBlock: { backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '15px', margin: '15px 0', color: '#1e3a8a', whiteSpace: 'pre-wrap', borderRadius: '4px' },
  variableBlockBlank: { backgroundColor: '#fff', border: '1px dashed #ccc', padding: '15px', margin: '15px 0', color: '#999', borderRadius: '4px' },
  nameInputBlock: { backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e5e7eb', textAlign: 'center' },

  // Toggle
  toggleContainer: { display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' },
  toggle: { padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: '#6b7280', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px' },
  toggleActive: { padding: '8px 16px', border: 'none', backgroundColor: 'white', color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },

  // Typography
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

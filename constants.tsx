
import { AppState, AppSection } from './types';

export const STORAGE_KEY = 'FreedomApp_Storage_v1';
export const APP_VERSION = '2.17.0';

export const INITIAL_STATE: AppState = {
  issues: [],
  categories: [
    { id: 'cat-1', label: 'Parent-Child Relationship', items: [], secondaryItems: [], tertiaryItems: [], isCompleted: false },
    { id: 'cat-2', label: 'Unforgiveness', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-3', label: 'Sexual Sin', items: [], secondaryItems: [], isCompleted: false },
    { id: 'cat-4', label: 'Generational Sins', items: [], secondaryItems: [], isCompleted: false },
    { id: 'cat-5', label: 'Occult & New Age', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-6', label: 'Word Curses', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-7', label: 'Covenants & Vows', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-8', label: 'Idolatry', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-9', label: 'Pride', items: [], isCompleted: false },
    { id: 'cat-10', label: 'Abuse & Trauma', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-11', label: 'Addictions', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-12', label: 'Other Religions', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-13', label: 'Judgments', items: [], structuredItems: [], isCompleted: false },
    { 
      id: 'cat-14', 
      label: 'Other Sins (Final Sweep)', 
      items: [], 
      structuredItems: [
        { id: 'sec-body', label: 'Body & Health', items: [] },
        { id: 'sec-ent', label: 'Entertainment', items: [] },
        { id: 'sec-fam', label: 'Family Honor', items: [] },
        { id: 'sec-misc', label: 'Miscellaneous', items: [] }
      ], 
      isCompleted: false 
    },
    { id: 'cat-15', label: 'Agreements & Iniquity', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-16', label: 'The Root Finder', items: [], structuredItems: [], isCompleted: false },
    { id: 'cat-17', label: 'Category 17 (Merged)', items: [], isCompleted: true }, 
    { id: 'cat-18', label: 'Infirmity', items: [], secondaryItems: [], isCompleted: false },
  ],
  prayers: {
    beginning: "Lord, I invite You to guide me through this list preparation. Protect my mind from spiritual interference and bring everything to light that needs repentance.",
    ending: "Lord, is there anything else I have missed in this category? I wait on You now.",
    prayer1: `Lord Jesus, I repent of my sins, and I thank you for dying on the cross for me. I accept your covering of my sins with your blood, and I claim the freedom you have promised from the curse of sin and torment. 

I choose to forgive others - everyone who has hurt me, lied to me, or disappointed me, I forgive them. I repent of unforgiveness; I know it is sin. I put it under your blood, Lord Jesus. I repent of anger, bitterness, hatred, rebellion, resentment, revenge, envy, jealousy, strife, lust, witchcraft, idolatry, and all other works of the flesh. I put it all under the blood of Jesus, and by doing so I break Satan's power and legal rights to my life. 

(Cat 1-3 Repentance Block)

(The Sweep Block)

(The Strongman Binding Block)

(The Infirmity Command Block)

I declare that I am free by the blood of the Lamb and the word of my testimony. Amen.`,
    prayer2: `Lord Jesus, I come before you to renounce every unholy agreement and covenant in my life. I renounce the unholy covenants of (Cat 7 Covenants) and the word curses of (Cat 6 Word Curses). 

I specifically repent of and ask your forgiveness for these unholy agreements made by me or my ancestors:
(Cat 15 Agreement Block)

I renounce the name of [[Jahbulon]], and I break every connection to that false trinity. I declare that Jesus Christ is my only Lord.

(Religion Command Block)

(The Strongman Binding Block)

I break agreement with (Cat 15 Agreements) in Jesus name. I command every spirit associated with these agreements to leave now. Amen.`,
    prayer3: `Lord, I thank you for the freedom I am walking in. I thank you for your constant protection and for the power of your Holy Spirit in my life.

(Family Repentance Block)

(Identity Renunciation Block)

And Lord, help me renew my mind with Your truth. I reject the lies that were spoken over me and I replace them with Your Word:
(Mind Renewal Block)

(The Strongman Binding Block)

I invite the Holy Spirit to fill every area that has been cleaned out. I ask for Your:
[[FRUIT_OF_SPIRIT]]

I declare that I am a new creation in Christ. The old is gone, the new has come! Amen.`,
    simplified: {
      intro: "God, I repent of my sins. I want freedom from (Issue Tracker) and I ask you to help me. I know I don't have to remember everything right now. So, please remind me of any sin I need to repent of or person I need to forgive to set me free.",
      outro: "And now, in the authority of God, I break every assignment against me, every curse, and every stronghold associated with these sins. I declare my freedom in Jesus' name. Amen.",
      unforgiveness: "Unforgiveness: I repent of unforgiveness, for I know that it is a sin. I therefore choose to forgive, release all judgements against, and break all unholy soul ties with the following people: (list names)",
      sexualSin: "Sexual Sin: Lord, I confess and repent of sexual sins, specifically: (list names). I renounce every unholy covenant and soul tie formed through these acts, and I break unholy soul ties with anyone who encouraged me to engage in these sexual activities, including: (list secondary names)",
      occult: "Occult: I repent of any involvement in the occult, seeking power or knowledge apart from You. I renounce all agreements with darkness and specifically: (list names). I break all unholy soul ties with those who encouraged me to do those activities, including: (list secondary names)",
      other: "Other Sins: Lord, I bring before You these other areas of disobedience and sin that I have held onto. I repent of: (list names). I also break unholy soul ties with anyone I did those sins with, including: (list secondary names)"
    }
  },
  progress: {
    simplifiedPrayerStarted: false,
    simplifiedPrayerFinished: false,
    prayer1CompletedAt: null,
    prayer2Logs: [],
    prayer3Logs: [],
    wordCurseMappings: {}
  },
  settings: {
    password: null,
    recoveryEmail: null,
    isLocked: false,
    showDevTools: false
  }
};

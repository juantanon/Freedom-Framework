
export interface Issue {
  id: string;
  description: string;
  intensityBefore: number; // 0-10
  intensity3Day: number | null; // Mapped to "Post-Simplified Prayer"
  intensity30Day: number | null; // Mapped to "Post-Deep Clean"
  notes: string;
}

export interface RootItem {
  label: string; // The symptom (e.g. "Panic Attacks")
  influencer: string; // The root person/situation
}

export interface StructuredItem {
  id: string;
  label: string;
  items: string[];
  initiator?: string; // For Cat 5, 8, 11
  involvedPeople?: string[]; // For Cat 10
  supplier?: string; // For Cat 11
  personInvolved?: string; // For Cat 12, 15
  specifics?: string; // For Cat 15
  rootItems?: RootItem[]; // For Cat 16 (The Root Finder)
}

export interface ListCategory {
  id: string;
  label: string;
  items: string[];
  secondaryItems?: string[]; 
  tertiaryItems?: string[];
  structuredItems?: StructuredItem[]; 
  isCompleted?: boolean;
}

export interface AppState {
  issues: Issue[];
  categories: ListCategory[];
  lastActivity?: {
    label: string;
    section: AppSection;
    timestamp: string;
  };
  prayers: {
    beginning: string;
    ending: string;
    prayer1: string;
    prayer2: string;
    prayer3: string;
    simplified: {
      intro: string;
      outro: string;
      unforgiveness: string;
      sexualSin: string;
      occult: string;
      other: string;
    };
  };
  progress: {
    simplifiedPrayerStarted: boolean;
    simplifiedPrayerFinished: boolean;
    prayer1CompletedAt: string | null;
    prayer2Logs: string[]; 
    prayer3Logs: string[]; 
    spouseName?: string;
    childrenNames?: string;
    wordCurseMappings: Record<string, string>; // Maps curse index to scripture statement
  };
  settings: {
    password: string | null;
    recoveryEmail: string | null;
    isLocked: boolean;
    showDevTools: boolean;
  };
}

export enum AppSection {
  HOME = 'home',
  ISSUE_TRACKER = 'issue-tracker',
  SIMPLIFIED_PRAYER = 'simplified-prayer',
  LIST_PREP = 'list-prep',
  DEEP_PRAYER = 'deep-prayer',
  SETTINGS = 'settings',
  DEVELOPER = 'developer'
}

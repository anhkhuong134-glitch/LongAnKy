// Project & Manuscript Type Definitions
export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  penName: string;
  genre: string;
  description: string;
  coverUrl?: string;
  status: 'concept' | 'drafting' | 'revising' | 'completed';
  wordCountGoal: number;
  chapterCountGoal: number;
  createdAt: string;
  updatedAt: string;
  currentWordCount: number;
  stats: {
    dailyGoal: number;
    wordsToday: number;
    streakDays: number;
    history: { date: string; count: number }[];
  };
  activePartId?: string;
  activeChapterId?: string;
  activeSceneId?: string;
}

export type FactStatus = 'suggested' | 'canon' | 'deprecated';
export type BibleCategory = 
  | 'premise'
  | 'theme'
  | 'world_rule'
  | 'magic_system'
  | 'faction'
  | 'location'
  | 'terminology'
  | 'constraint'
  | 'secret'
  | 'ending';

export interface BibleFact {
  id: string;
  category: BibleCategory;
  title: string;
  content: string;
  status: FactStatus;
  sourceChapterId?: string;
  sourceChapterTitle?: string;
  createdBy: 'author' | 'ai';
  confidence?: number;
  tags: string[];
  lastUpdated: string;
}

export interface CharacterKnowledge {
  chapterId: string;
  chapterTitle: string;
  timestamp: string;
  knownSecrets: string[];
  forbiddenSecrets: string[]; // Secrets this character MUST NOT know yet
}

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  role: 'protagonist' | 'deuteragonist' | 'antagonist' | 'supporting' | 'minor';
  avatar?: string;
  bio: {
    age?: string;
    appearance: string;
    personality: string;
    voiceCadence: string; // Tone, quirks, speech mannerisms
    externalWant: string; // External goal
    internalNeed: string; // Inner need / transformational arc
    flawOrWound: string;  // Past trauma / tragic flaw
    secrets: string[];    // Secrets only this character knows
  };
  relationships: {
    targetCharacterId: string;
    targetName: string;
    relationType: string;
    note: string;
  }[];
  dynamicState: {
    currentLocation: string;
    healthStatus: string;
    itemsCarried: string[];
    emotionalState: string;
  };
  knowledgeTracker: CharacterKnowledge[];
}

export interface SceneVersion {
  id: string;
  timestamp: string;
  authorType: 'author' | 'ai';
  changeReason: string;
  content: string;
  wordCount: number;
}

export interface Scene {
  id: string;
  chapterId: string;
  partId: string;
  title: string;
  order: number;
  povCharacterId?: string;
  povCharacterName?: string;
  location?: string;
  timeOfDay?: string;
  sceneGoal: string;
  conflict: string;
  revelation: string;
  outcome: string;
  nextHook: string;
  content: string;
  notes: string;
  wordCount: number;
  status: 'draft' | 'revised' | 'final';
  presentCharacterIds: string[];
  presentItemIds: string[];
  foreshadowingIds: string[];
  versions: SceneVersion[];
}

export interface Chapter {
  id: string;
  partId: string;
  title: string;
  order: number;
  description?: string;
  content?: string;
  wordCount: number;
  notes?: string;
  povCharacterName?: string;
  location?: string;
  timeOfDay?: string;
  status?: 'draft' | 'revised' | 'final';
  presentCharacterIds?: string[];
  presentItemIds?: string[];
  foreshadowingIds?: string[];
  versions?: SceneVersion[];
  scenes?: Scene[];
  isExpanded?: boolean;
}

export interface Part {
  id: string;
  title: string;
  order: number;
  description?: string;
  chapters: Chapter[];
  wordCount: number;
  isExpanded?: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  dateOrEra: string;
  sortOrder: number;
  description: string;
  location?: string;
  involvedCharacterIds: string[];
  chapterId?: string;
  isFlashback?: boolean;
}

export type HookStatus = 'planted' | 'developing' | 'recalled' | 'resolved' | 'abandoned';

export interface ForeshadowingHook {
  id: string;
  title: string;
  description: string;
  status: HookStatus;
  plantedChapterId: string;
  plantedChapterTitle: string;
  lastMentionedChapterId: string;
  lastMentionedChapterTitle: string;
  resolvedChapterId?: string;
  resolvedChapterTitle?: string;
  chaptersDormant: number;
  clues: {
    chapterId: string;
    chapterTitle: string;
    snippet: string;
    note: string;
  }[];
  importance: 'major' | 'medium' | 'minor';
}

export type AIRole = 
  | 'plot_architect'
  | 'scene_writer'
  | 'character_actor'
  | 'lore_keeper'
  | 'logic_auditor'
  | 'style_editor'
  | 'beta_reader';

export type AIProvider = 'mock' | 'ollama' | 'gemini' | 'openai';

export interface AISettings {
  provider: AIProvider;
  ollamaUrl: string;
  ollamaModel: string;
  geminiApiKey?: string;
  geminiModel?: string;
  openaiApiKey?: string;
  openaiModel?: string;
}

export interface AIProposal {
  id: string;
  sceneId: string;
  role: AIRole;
  roleTitle: string;
  originalText: string;
  suggestedText: string;
  rationale: string;
  affectedCanonFacts?: string[];
  warnings?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
}

export interface BetaFeedback {
  persona: 'new_reader' | 'mystery_buff' | 'character_driven' | 'tough_critic' | 'commercial_editor';
  personaName: string;
  rating: number; // 1-5 stars
  curiousAbout: string;
  confusionPoints: string;
  predictions: string;
  characterCritique: string;
  nextChapterUrge: string;
}

export interface LogicAuditIssue {
  id: string;
  type: 'knowledge_leak' | 'teleportation' | 'time_drift' | 'item_paradox' | 'rule_violation';
  severity: 'critical' | 'warning' | 'info';
  characterName?: string;
  title: string;
  detail: string;
  fixSuggestion: string;
}

// ==========================================
// COMIC & MANGA & WEBTOON TYPES
// ==========================================
export type ComicReadingMode = 'webtoon' | 'manga_pages' | 'panel_slide';

export interface ComicDialogue {
  id: string;
  character: string;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  bubbleType: 'speech' | 'thought' | 'shout' | 'whisper' | 'narration';
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  imageUrl?: string;
  caption?: string;
  cameraAngle?: string;
  actionDescription?: string;
  dialogues: ComicDialogue[];
  sfx?: string;
  prompt?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | '9:16';
  widthSpan?: 'full' | 'half' | 'third';
}

export interface ComicPage {
  id: string;
  pageNumber: number;
  title: string;
  panels: ComicPanel[];
}

export interface ComicChapter {
  id: string;
  chapterId: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  readingDirection: 'vertical' | 'ltr' | 'rtl';
  pages: ComicPage[];
}

// ==========================================
// GOOGLE DOCS & GOOGLE SHEETS 2-WAY SYNC
// ==========================================
export interface SyncLogItem {
  id: string;
  timestamp: string;
  target: 'docs' | 'sheets';
  action: 'push' | 'pull' | 'gas_webhook';
  summary: string;
  status: 'success' | 'failed' | 'staged';
  diffCount?: number;
}

export interface GoogleDocsSyncState {
  docUrl: string;
  docId: string;
  lastSyncedAt: string;
  status: 'synced' | 'pending_push' | 'pending_pull' | 'error';
  liveDocTitle: string;
  autoSync: boolean;
  gasWebhookUrl?: string;
  stagedChangesCount: number;
  syncLogs: SyncLogItem[];
}

export interface GoogleSheetsSyncState {
  sheetUrl: string;
  sheetId: string;
  lastSyncedAt: string;
  status: 'synced' | 'pending_push' | 'pending_pull' | 'error';
  liveSheetTitle: string;
  autoSync: boolean;
  gasWebhookUrl?: string;
  syncLogs: SyncLogItem[];
}

// ==========================================
// SOUL SEAL GAME & EXPANDED SHEET DATA
// ==========================================
export interface GameTaskPackage {
  code: string; // T01 -> T18
  name: string;
  pillar: 'game' | 'story' | 'shared';
  status: 'Chưa làm' | 'Đang làm' | 'Đã xong' | 'Đang thẩm định';
  dodMet: boolean;
  priority: 'P1 - Cốt lõi' | 'P2 - Nâng cao' | 'P3 - Tương lai';
  details: string;
  deliverable: string;
  nextAction: string;
}

export interface GameSystemModule {
  code: string; // SYS-01 -> SYS-12
  name: string;
  idea: string;
  status: string;
  priority: string;
  inspiration: string;
  gameplayLogic: string;
  techSpecs: string;
  challenges: string;
  packageCode: string;
  dod: string;
  deliverable: string;
  nextAction: string;
}

export interface IdeaControlItem {
  id: string; // IDEA-01 -> IDEA-12
  title: string;
  category: 'Game' | 'Truyện' | 'Kỹ thuật' | 'Chung';
  priority: 'P1 - Cốt lõi' | 'P2 - Xem xét' | 'P3 - Để sau';
  status: 'Đã duyệt' | 'Đang thử nghiệm' | 'Từ chối' | 'Tạm hoãn' | 'Mới ghi nhận';
  goal: string;
  risk: string;
  solution: string;
  packageCode: string;
  proposer: string;
  decision: string;
  nextAction: string;
  dodEvaluation: string;
  notes: string;
}

// ==========================================
// GOOGLE AI STUDIO EXPANDED TYPES
// ==========================================
export interface AIStudioConfig {
  apiKey: string;
  model: string;
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  systemInstruction?: string;
}

export * from './user';

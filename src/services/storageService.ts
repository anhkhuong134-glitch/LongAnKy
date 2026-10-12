import { Project, Part, BibleFact, Character, TimelineEvent, ForeshadowingHook, AISettings } from '../types';
import { sampleProject, sampleBibleFacts, sampleCharacters, sampleTimeline, sampleForeshadowingHooks } from '../data/sampleLongAnKy';
import { googleDocsParts } from '../data/googleData';
import { googleCharacters } from '../data/googleCharacters';

const STORAGE_KEYS = {
  PROJECT: 'mach_project',
  PARTS: 'mach_parts',
  BIBLE: 'mach_bible',
  CHARACTERS: 'mach_characters',
  TIMELINE: 'mach_timeline',
  FORESHADOWING: 'mach_foreshadowing',
  AI_SETTINGS: 'mach_ai_settings',
  THEME: 'mach_theme'
};

export const defaultAISettings: AISettings = {
  provider: 'gemini',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.2',
  geminiApiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY || '',
  geminiModel: 'gemini-2.0-flash',
  openaiModel: 'gpt-4o-mini'
};

export class StorageService {
  static loadProject(): Project {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECT);
    if (!data) return sampleProject;
    try {
      const proj = JSON.parse(data);
      // Clean up if pointing to old mock parts
      if (
        !proj.activePartId ||
        proj.activePartId === 'part_02' ||
        proj.activePartId === 'part_prologue' ||
        proj.activePartId === 'part_chapters'
      ) {
        proj.activePartId = 'part_mua_nuoc_dung';
        proj.activeChapterId = 'doc_chap_01';
        localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(proj));
      }
      return proj;
    } catch {
      return sampleProject;
    }
  }

  static saveProject(project: Project): void {
    localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(project));
  }

  static loadParts(): Part[] {
    const data = localStorage.getItem(STORAGE_KEYS.PARTS);
    if (!data) return googleDocsParts;
    try {
      const parts: Part[] = JSON.parse(data);
      // Clean up old mock structure (part_prologue, part_chapters, or chapters with 'Người không tồn tại')
      const hasOldMockData = parts.some(p => 
        p.id === 'part_prologue' || 
        p.id === 'part_chapters' || 
        p.id === 'part_epilogue' ||
        p.chapters.some(c => c.title.includes('Người không tồn tại'))
      );
      const hasGoogleDocsPart = parts.some(p => p.id === 'part_mua_nuoc_dung');

      if (hasOldMockData || !hasGoogleDocsPart) {
        localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(googleDocsParts));
        return googleDocsParts;
      }
      return parts;
    } catch {
      return googleDocsParts;
    }
  }

  static saveParts(parts: Part[]): void {
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(parts));
  }

  static loadBible(): BibleFact[] {
    const data = localStorage.getItem(STORAGE_KEYS.BIBLE);
    return data ? JSON.parse(data) : sampleBibleFacts;
  }

  static saveBible(facts: BibleFact[]): void {
    localStorage.setItem(STORAGE_KEYS.BIBLE, JSON.stringify(facts));
  }

  static loadCharacters(): Character[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    if (!data) return googleCharacters;
    try {
      const chars: Character[] = JSON.parse(data);
      const hasOldMock = chars.some(c => c.id === 'char_sena' || c.id === 'char_koto' || c.name === 'Sena');
      const hasRento = chars.some(c => c.id === 'char_rento' || c.name === 'Rento');
      if (hasOldMock || !hasRento) {
        localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(googleCharacters));
        return googleCharacters;
      }
      return chars;
    } catch {
      return googleCharacters;
    }
  }

  static saveCharacters(characters: Character[]): void {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  }

  static loadTimeline(): TimelineEvent[] {
    const data = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    return data ? JSON.parse(data) : sampleTimeline;
  }

  static saveTimeline(timeline: TimelineEvent[]): void {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline));
  }

  static loadForeshadowing(): ForeshadowingHook[] {
    const data = localStorage.getItem(STORAGE_KEYS.FORESHADOWING);
    return data ? JSON.parse(data) : sampleForeshadowingHooks;
  }

  static saveForeshadowing(hooks: ForeshadowingHook[]): void {
    localStorage.setItem(STORAGE_KEYS.FORESHADOWING, JSON.stringify(hooks));
  }

  static loadAISettings(): AISettings {
    const data = localStorage.getItem(STORAGE_KEYS.AI_SETTINGS);
    if (!data) return defaultAISettings;
    try {
      const parsed = JSON.parse(data);
      if (!parsed.geminiApiKey && (import.meta as any).env?.VITE_GEMINI_API_KEY) {
        parsed.geminiApiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      }
      return parsed;
    } catch {
      return defaultAISettings;
    }
  }

  static saveAISettings(settings: AISettings): void {
    localStorage.setItem(STORAGE_KEYS.AI_SETTINGS, JSON.stringify(settings));
  }

  static resetToSampleProject(): void {
    localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(sampleProject));
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(googleDocsParts));
    localStorage.setItem(STORAGE_KEYS.BIBLE, JSON.stringify(sampleBibleFacts));
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(googleCharacters));
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(sampleTimeline));
    localStorage.setItem(STORAGE_KEYS.FORESHADOWING, JSON.stringify(sampleForeshadowingHooks));
  }

  static exportFullProjectJSON(): string {
    const bundle = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: this.loadProject(),
      parts: this.loadParts(),
      bible: this.loadBible(),
      characters: this.loadCharacters(),
      timeline: this.loadTimeline(),
      foreshadowing: this.loadForeshadowing()
    };
    return JSON.stringify(bundle, null, 2);
  }

  static importFullProjectJSON(jsonString: string): boolean {
    try {
      const bundle = JSON.parse(jsonString);
      if (bundle.project && bundle.parts) {
        if (bundle.project) this.saveProject(bundle.project);
        if (bundle.parts) this.saveParts(bundle.parts);
        if (bundle.bible) this.saveBible(bundle.bible);
        if (bundle.characters) this.saveCharacters(bundle.characters);
        if (bundle.timeline) this.saveTimeline(bundle.timeline);
        if (bundle.foreshadowing) this.saveForeshadowing(bundle.foreshadowing);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
}

import { Project, Part, BibleFact, Character, TimelineEvent, ForeshadowingHook, AISettings, ComicChapter } from '../types';
import { sampleProject, sampleBibleFacts, sampleCharacters, sampleTimeline, sampleForeshadowingHooks } from '../data/sampleLongAnKy';
import { googleDocsParts, sampleComicChapters } from '../data/googleData';
import { googleCharacters } from '../data/googleCharacters';

const STORAGE_KEYS = {
  PROJECT: 'mach_project',
  PARTS: 'mach_parts',
  BIBLE: 'mach_bible',
  CHARACTERS: 'mach_characters',
  TIMELINE: 'mach_timeline',
  FORESHADOWING: 'mach_foreshadowing',
  AI_SETTINGS: 'mach_ai_settings',
  THEME: 'mach_theme',
  COMIC_CHAPTERS: 'mach_comic_chapters',
  IS_AUTHOR: 'mach_is_author',
  AUTHOR_PIN: 'mach_author_pin'
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
      // Migrate title to Long Ấn Thức Tỉnh
      if (!proj.title || proj.title === 'Long Ấn Ký') {
        proj.title = 'Long Ấn Thức Tỉnh';
        localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(proj));
      }
      // Clean up if pointing to old mock parts or deleted bản cũ
      if (
        !proj.activePartId ||
        proj.activePartId === 'part_02' ||
        proj.activePartId === 'part_chapters' ||
        proj.activePartId === 'part_aesvorn_arc' ||
        (proj.activeChapterId && proj.activeChapterId.startsWith('aesvorn_'))
      ) {
        proj.activePartId = 'part_prologue';
        proj.activeChapterId = 'doc_chap_prologue';
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
      // Dọn dẹp Bản Cũ (part_aesvorn_arc), dữ liệu mock cũ và cấu trúc cũ khi Mở Đầu chưa tách
      const hasOldMockOrBanCu = parts.some(p => 
        p.id === 'part_chapters' || 
        p.id === 'part_epilogue' ||
        p.id === 'part_aesvorn_arc' ||
        p.title.toLowerCase().includes('bản cũ') ||
        p.chapters.some(c => c.title.includes('Người không tồn tại'))
      );
      const hasGoogleDocsPart = parts.some(p => p.id === 'part_mua_nuoc_dung');
      // Kiểm tra nếu Mở Đầu vẫn còn nằm trong Phần 1 (chưa lôi ra ngoài)
      const prologueInsidePart1 = parts.find(p => p.id === 'part_mua_nuoc_dung')?.chapters.some(c => c.id === 'doc_chap_prologue');
      // Kiểm tra nếu thiếu phần Mở Đầu riêng biệt
      const missingProloguePart = !parts.some(p => p.id === 'part_prologue');

      if (hasOldMockOrBanCu || !hasGoogleDocsPart || prologueInsidePart1 || missingProloguePart) {
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
    if (!data) return sampleBibleFacts;
    try {
      const facts: BibleFact[] = JSON.parse(data);
      if (facts.some(f => f.content?.includes('Aesvorn') || f.title?.includes('Aesvorn'))) {
        localStorage.setItem(STORAGE_KEYS.BIBLE, JSON.stringify(sampleBibleFacts));
        return sampleBibleFacts;
      }
      return facts;
    } catch {
      return sampleBibleFacts;
    }
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
    if (!data) return sampleTimeline;
    try {
      const events: TimelineEvent[] = JSON.parse(data);
      if (events.some(e => e.description?.includes('Aesvorn') || e.title?.includes('Aesvorn') || e.location?.includes('Aesvorn'))) {
        localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(sampleTimeline));
        return sampleTimeline;
      }
      return events;
    } catch {
      return sampleTimeline;
    }
  }

  static saveTimeline(timeline: TimelineEvent[]): void {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline));
  }

  static loadForeshadowing(): ForeshadowingHook[] {
    const data = localStorage.getItem(STORAGE_KEYS.FORESHADOWING);
    if (!data) return sampleForeshadowingHooks;
    try {
      const hooks: ForeshadowingHook[] = JSON.parse(data);
      if (hooks.some(h => h.description?.includes('Aesvorn') || h.title?.includes('Ba Tiếng Gõ') || h.title?.includes('cuốn sổ da'))) {
        localStorage.setItem(STORAGE_KEYS.FORESHADOWING, JSON.stringify(sampleForeshadowingHooks));
        return sampleForeshadowingHooks;
      }
      return hooks;
    } catch {
      return sampleForeshadowingHooks;
    }
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

  static loadComicChapters(): ComicChapter[] {
    const data = localStorage.getItem(STORAGE_KEYS.COMIC_CHAPTERS);
    if (!data) return sampleComicChapters;
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleComicChapters;
    } catch {
      return sampleComicChapters;
    }
  }

  static saveComicChapters(comics: ComicChapter[]): void {
    localStorage.setItem(STORAGE_KEYS.COMIC_CHAPTERS, JSON.stringify(comics));
  }

  static isAuthorAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTHOR) === 'true';
  }

  static setAuthorAuthenticated(isAuth: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHOR, isAuth ? 'true' : 'false');
  }

  static getAuthorPin(): string {
    return localStorage.getItem(STORAGE_KEYS.AUTHOR_PIN) || '332004';
  }

  static setAuthorPin(pin: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTHOR_PIN, pin);
  }

  static resetToSampleProject(): void {
    localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(sampleProject));
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(googleDocsParts));
    localStorage.setItem(STORAGE_KEYS.BIBLE, JSON.stringify(sampleBibleFacts));
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(googleCharacters));
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(sampleTimeline));
    localStorage.setItem(STORAGE_KEYS.FORESHADOWING, JSON.stringify(sampleForeshadowingHooks));
    localStorage.setItem(STORAGE_KEYS.COMIC_CHAPTERS, JSON.stringify(sampleComicChapters));
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
      foreshadowing: this.loadForeshadowing(),
      comicChapters: this.loadComicChapters()
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
        if (bundle.comicChapters) this.saveComicChapters(bundle.comicChapters);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
}

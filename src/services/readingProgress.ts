export interface ReaderSettings {
  fontFamily: 'serif' | 'sans'; // serif = Lora, sans = Nunito
  fontSize: number; // 16 to 28
  lineHeight: number; // 1.65, 1.85, 2.05
  columnWidth: number; // 600, 680, 760
  theme: 'paper' | 'mist' | 'blush'; // #FFFDF8, #F2F8F3, #FFF5F5
}

export interface Bookmark {
  id: string;
  chapterId: string;
  chapterTitle: string;
  paragraphIndex: number;
  snippet: string;
  createdAt: string;
}

export interface SavedQuote {
  id: string;
  chapterId: string;
  chapterTitle: string;
  text: string;
  savedAt: string;
}

export interface ReadingHistoryItem {
  chapterId: string;
  chapterTitle: string;
  paragraphIndex: number;
  scrollPercent: number;
  updatedAt: string;
}

const SETTINGS_KEY = 'arumo_reader_settings_v2';
const HISTORY_KEY = 'arumo_reading_history_v2';
const BOOKMARKS_KEY = 'arumo_reader_bookmarks_v2';
const QUOTES_KEY = 'arumo_reader_saved_quotes_v2';
const READ_CHAPTERS_KEY = 'arumo_completed_chapters_v2';

export class ReadingProgressService {
  // 1. Reader Settings
  static getSettings(): ReaderSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Force migration away from old dark themes
        if (!['paper', 'mist', 'blush'].includes(parsed.theme)) {
          parsed.theme = 'paper';
        }
        return {
          fontFamily: parsed.fontFamily === 'sans' ? 'sans' : 'serif',
          fontSize: Math.min(28, Math.max(16, parsed.fontSize || 20)),
          lineHeight: [1.65, 1.85, 2.05].includes(parsed.lineHeight) ? parsed.lineHeight : 1.85,
          columnWidth: [600, 680, 760].includes(parsed.columnWidth) ? parsed.columnWidth : 680,
          theme: parsed.theme || 'paper',
        };
      }
    } catch (e) {}

    return {
      fontFamily: 'serif',
      fontSize: 20,
      lineHeight: 1.85,
      columnWidth: 680,
      theme: 'paper',
    };
  }

  static saveSettings(settings: ReaderSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  // 2. Reading History
  static getHistory(): ReadingHistoryItem | null {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  }

  static saveProgress(item: ReadingHistoryItem): void {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(item));
  }

  // 3. Completed Chapters
  static getCompletedChapterIds(): string[] {
    try {
      const data = localStorage.getItem(READ_CHAPTERS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  static markChapterCompleted(chapterId: string): void {
    const list = this.getCompletedChapterIds();
    if (!list.includes(chapterId)) {
      list.push(chapterId);
      localStorage.setItem(READ_CHAPTERS_KEY, JSON.stringify(list));
    }
  }

  // 4. Bookmarks
  static getBookmarks(): Bookmark[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  static addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const list = this.getBookmarks();
    const newItem: Bookmark = {
      ...bookmark,
      id: `bm_${Date.now()}`,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    list.unshift(newItem);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    return newItem;
  }

  static removeBookmark(id: string): void {
    const list = this.getBookmarks().filter(b => b.id !== id);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  }

  // 5. Saved Quotes
  static getSavedQuotes(): SavedQuote[] {
    try {
      const data = localStorage.getItem(QUOTES_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  static addQuote(quote: Omit<SavedQuote, 'id' | 'savedAt'>): SavedQuote {
    const list = this.getSavedQuotes();
    const newItem: SavedQuote = {
      ...quote,
      id: `quote_${Date.now()}`,
      savedAt: new Date().toLocaleDateString('vi-VN'),
    };
    list.unshift(newItem);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(list));
    return newItem;
  }

  static removeQuote(id: string): void {
    const list = this.getSavedQuotes().filter(q => q.id !== id);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(list));
  }
}

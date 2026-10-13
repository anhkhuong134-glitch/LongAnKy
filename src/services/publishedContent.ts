export interface PublishedChapter {
  id: string;
  partId: string;
  title: string;
  order: number;
  content: string;
  wordCount: number;
  status: 'published';
  publishedAt?: string;
  povCharacterName?: string;
  location?: string;
  notes?: string;
}

export interface PublishedPart {
  id: string;
  title: string;
  order: number;
  description: string;
  chapters: PublishedChapter[];
}

export interface PublishedStorySnapshot {
  version: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  parts: PublishedPart[];
}

const STORAGE_KEY_PUBLISHED = 'arumo_published_snapshot_cache';

export class PublishedContentService {
  private static cachedSnapshot: PublishedStorySnapshot | null = null;

  // Clear memory cache so next call reloads freshest data
  static clearMemoryCache() {
    this.cachedSnapshot = null;
  }

  // Load published snapshot (LocalStorage cache first, then /content/published-story.json)
  static async loadSnapshot(): Promise<PublishedStorySnapshot> {
    if (this.cachedSnapshot) {
      return this.cachedSnapshot;
    }

    // 1. Check local storage cache for user-published or synced version
    try {
      const local = localStorage.getItem(STORAGE_KEY_PUBLISHED);
      if (local) {
        const parsed: PublishedStorySnapshot = JSON.parse(local);
        if (parsed?.parts && parsed.parts.length > 0) {
          this.cachedSnapshot = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Cannot parse local published snapshot cache:', e);
    }

    // 2. Fetch static bundle /content/published-story.json
    try {
      const res = await fetch('/content/published-story.json');
      if (res.ok) {
        const data: PublishedStorySnapshot = await res.json();
        this.cachedSnapshot = data;
        try {
          localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(data));
        } catch {}
        return data;
      }
    } catch (e) {
      console.warn('Cannot load published-story.json from network:', e);
    }

    // 3. Fallback to mach_parts if present
    try {
      const machPartsStr = localStorage.getItem('mach_parts');
      if (machPartsStr) {
        const parts = JSON.parse(machPartsStr);
        const snapshot: PublishedStorySnapshot = {
          version: '1.0.0',
          title: 'Long Ấn Thức Tỉnh',
          subtitle: 'Arumo Trong Nắng Sớm',
          publishedAt: '2026-10-13',
          parts: parts.map((p: any) => ({
            id: p.id,
            title: p.title,
            order: p.order,
            description: p.description || '',
            chapters: (p.chapters || []).map((c: any) => ({
              id: c.id,
              partId: p.id,
              title: c.title,
              order: c.order,
              content: c.content,
              wordCount: c.wordCount || c.content.split(/\s+/).filter(Boolean).length,
              status: 'published' as const,
              povCharacterName: c.povCharacterName,
              location: c.location,
              notes: c.notes,
            }))
          }))
        };
        this.cachedSnapshot = snapshot;
        return snapshot;
      }
    } catch {}

    // 4. Default minimal structure
    return {
      version: '1.0.0',
      title: 'Long Ấn Thức Tỉnh',
      subtitle: 'Arumo Trong Nắng Sớm',
      publishedAt: '2026-10-13',
      parts: []
    };
  }

  // Update and broadcast published snapshot
  static updateSnapshot(newSnapshot: PublishedStorySnapshot) {
    this.cachedSnapshot = newSnapshot;
    try {
      localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(newSnapshot));
    } catch (e) {
      console.error('Cannot save snapshot to localStorage:', e);
    }
    // Notify all active React views
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('story-content-updated', { detail: newSnapshot }));
    }
  }

  // Update a single chapter's content and save
  static async updateChapter(chapterId: string, title: string, content: string): Promise<boolean> {
    const snapshot = await this.loadSnapshot();
    let found = false;
    for (const part of snapshot.parts) {
      const ch = part.chapters.find(c => c.id === chapterId);
      if (ch) {
        ch.title = title;
        ch.content = content;
        ch.wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        found = true;
        break;
      }
    }
    if (found) {
      this.updateSnapshot(snapshot);
      return true;
    }
    return false;
  }

  // Get all published chapters flat
  static async getAllChapters(): Promise<PublishedChapter[]> {
    const snapshot = await this.loadSnapshot();
    const list: PublishedChapter[] = [];
    for (const part of snapshot.parts) {
      for (const ch of part.chapters) {
        list.push(ch);
      }
    }
    return list;
  }

  // Find chapter by ID
  static async getChapterById(chapterId: string): Promise<{ chapter: PublishedChapter; part: PublishedPart } | null> {
    const snapshot = await this.loadSnapshot();
    for (const part of snapshot.parts) {
      const ch = part.chapters.find(c => c.id === chapterId);
      if (ch) {
        return { chapter: ch, part };
      }
    }
    return null;
  }

  // Get Adjacent Chapters
  static async getAdjacentChapters(currentChapterId: string): Promise<{ prev: PublishedChapter | null; next: PublishedChapter | null }> {
    const all = await this.getAllChapters();
    const idx = all.findIndex(c => c.id === currentChapterId);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
    };
  }
}


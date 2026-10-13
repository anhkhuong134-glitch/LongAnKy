export interface PublishedChapter {
  id: string;
  partId: string;
  title: string;
  order: number;
  content: string;
  wordCount: number;
  status: 'published';
  publishedAt?: string;
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

export class PublishedContentService {
  private static cachedSnapshot: PublishedStorySnapshot | null = null;

  // Load published snapshot from /content/published-story.json
  static async loadSnapshot(): Promise<PublishedStorySnapshot> {
    if (this.cachedSnapshot) {
      return this.cachedSnapshot;
    }

    try {
      const res = await fetch('/content/published-story.json');
      if (res.ok) {
        const data: PublishedStorySnapshot = await res.json();
        this.cachedSnapshot = data;
        return data;
      }
    } catch (e) {
      console.warn('Cannot load published-story.json, falling back to local storage snapshot');
    }

    // Fallback if network fails
    const local = localStorage.getItem('arumo_published_snapshot_cache');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        this.cachedSnapshot = parsed;
        return parsed;
      } catch (e) {}
    }

    // Default minimal structure
    return {
      version: '1.0.0',
      title: 'Long Ấn Thức Tỉnh',
      subtitle: 'Arumo Trong Nắng Sớm',
      publishedAt: '2026-10-13',
      parts: []
    };
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

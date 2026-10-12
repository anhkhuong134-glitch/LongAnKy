import { Project, Part, Chapter, Scene, BibleFact, ForeshadowingHook } from '../types';

export interface ParseResult {
  detectedPartsCount: number;
  detectedChaptersCount: number;
  detectedScenesCount: number;
  detectedCharacters: string[];
  detectedLocations: string[];
  detectedClues: string[];
  generatedParts: Part[];
  suggestedFacts: BibleFact[];
}

export type ImportPreviewReport = ParseResult;

export class ImportExportService {
  static parseDocument(rawText: string, projectTitle?: string): ParseResult {
    return this.parseManuscriptText(rawText);
  }
  /**
   * Parses raw text or markdown from Google Docs / Word / Markdown
   * Auto-identifies Parts, Chapters, and text
   */
  static parseManuscriptText(rawText: string): ParseResult {
    const lines = rawText.split('\n');
    const parts: Part[] = [];
    let currentPart: Part | null = null;
    let currentChapter: Chapter | null = null;
    let currentScene: Scene | null = null;
    let sceneContentBuffer: string[] = [];

    const flushScene = () => {
      if (currentScene && currentChapter) {
        currentScene.content = sceneContentBuffer.join('\n').trim();
        currentScene.wordCount = currentScene.content.split(/\s+/).filter(Boolean).length;
        if (!currentChapter.scenes) currentChapter.scenes = [];
        currentChapter.scenes.push(currentScene);
        currentChapter.wordCount += currentScene.wordCount;
        currentChapter.content = (currentChapter.content ? currentChapter.content + '\n\n' : '') + currentScene.content;
        if (currentPart) currentPart.wordCount += currentScene.wordCount;
      }
      sceneContentBuffer = [];
      currentScene = null;
    };

    const flushChapter = () => {
      flushScene();
      if (currentChapter && currentPart) {
        currentPart.chapters.push(currentChapter);
      }
      currentChapter = null;
    };

    const flushPart = () => {
      flushChapter();
      if (currentPart) {
        parts.push(currentPart);
      }
      currentPart = null;
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Check for Part header (# Phần... or Tab: ...)
      if (trimmed.startsWith('# Phần') || trimmed.startsWith('# Mở đầu') || trimmed.startsWith('Tab: ') || trimmed.startsWith('[Phần]')) {
        flushPart();
        const partTitle = trimmed.replace(/^[#\[\]\s]+/, '').replace(/^Tab:\s*/, '');
        currentPart = {
          id: `part_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: partTitle,
          order: parts.length + 1,
          chapters: [],
          wordCount: 0,
          isExpanded: true
        };
        return;
      }

      // Check for Chapter header (## Chương... or Heading 1)
      if (trimmed.startsWith('## Chương') || trimmed.startsWith('# Chương') || trimmed.startsWith('Chương ') || trimmed.startsWith('[Chương]')) {
        flushChapter();
        if (!currentPart) {
          currentPart = {
            id: `part_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            title: 'Phần 1: Khởi đầu',
            order: parts.length + 1,
            chapters: [],
            wordCount: 0,
            isExpanded: true
          };
        }
        const chapTitle = trimmed.replace(/^[#\[\]\s]+/, '');
        currentChapter = {
          id: `chap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          partId: currentPart.id,
          title: chapTitle,
          order: currentPart.chapters.length + 1,
          content: '',
          scenes: [],
          wordCount: 0,
          isExpanded: true
        };
        return;
      }

      // Check for Scene header (### Cảnh... or Heading 2)
      if (trimmed.startsWith('### Cảnh') || trimmed.startsWith('## Cảnh') || trimmed.startsWith('Cảnh ') || trimmed.startsWith('[Cảnh]')) {
        flushScene();
        if (!currentPart) {
          currentPart = {
            id: `part_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            title: 'Phần 1: Khởi đầu',
            order: parts.length + 1,
            chapters: [],
            wordCount: 0,
            isExpanded: true
          };
        }
        if (!currentChapter) {
          currentChapter = {
            id: `chap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            partId: currentPart.id,
            title: 'Chương 1',
            order: 1,
            content: '',
            scenes: [],
            wordCount: 0,
            isExpanded: true
          };
        }
        const sceneTitle = trimmed.replace(/^[#\[\]\s]+/, '');
        currentScene = {
          id: `scene_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          chapterId: currentChapter.id,
          partId: currentPart.id,
          title: sceneTitle,
          order: (currentChapter.scenes?.length || 0) + 1,
          sceneGoal: '',
          conflict: '',
          revelation: '',
          outcome: '',
          nextHook: '',
          content: '',
          notes: '',
          wordCount: 0,
          status: 'draft',
          presentCharacterIds: [],
          presentItemIds: [],
          foreshadowingIds: [],
          versions: []
        };
        return;
      }

      // Normal narrative line
      if (trimmed.length > 0) {
        if (!currentPart) {
          currentPart = {
            id: `part_${Date.now()}_0`,
            title: 'Phần 1: Khởi đầu',
            order: 1,
            chapters: [],
            wordCount: 0,
            isExpanded: true
          };
        }
        if (!currentChapter) {
          currentChapter = {
            id: `chap_${Date.now()}_0`,
            partId: currentPart.id,
            title: 'Chương 1',
            order: 1,
            content: '',
            scenes: [],
            wordCount: 0,
            isExpanded: true
          };
        }
        if (!currentScene) {
          currentScene = {
            id: `scene_${Date.now()}_0`,
            chapterId: currentChapter.id,
            partId: currentPart.id,
            title: 'Đoạn 1',
            order: 1,
            sceneGoal: '',
            conflict: '',
            revelation: '',
            outcome: '',
            nextHook: '',
            content: '',
            notes: '',
            wordCount: 0,
            status: 'draft',
            presentCharacterIds: [],
            presentItemIds: [],
            foreshadowingIds: [],
            versions: []
          };
        }
        sceneContentBuffer.push(line);
      }
    });

    flushPart();

    // Secondary extraction: entity discovery
    const fullText = rawText.toLowerCase();
    const detectedCharacters: string[] = [];
    const detectedLocations: string[] = [];
    const detectedClues: string[] = [];
    const suggestedFacts: BibleFact[] = [];

    // Entity keyword matches
    ['sena', 'koto', 'ryou', 'brell'].forEach(name => {
      if (fullText.includes(name)) {
        detectedCharacters.push(name.charAt(0).toUpperCase() + name.slice(1));
      }
    });

    ['aesvorn', 'thư viện', 'cổ thụ', 'hành lang', 'căng tin'].forEach(loc => {
      if (fullText.includes(loc)) {
        detectedLocations.push(loc.charAt(0).toUpperCase() + loc.slice(1));
      }
    });

    ['sổ da', 'chỉ đỏ', 'tiếng gõ', 'đồng hồ'].forEach(clue => {
      if (fullText.includes(clue)) {
        detectedClues.push(clue);
      }
    });

    // Auto-generate basic facts
    if (fullText.includes('aesvorn')) {
      suggestedFacts.push({
        id: `fact_auto_${Date.now()}`,
        category: 'location',
        title: 'Học viện Aesvorn (Tự động phát hiện)',
        content: 'Bối cảnh trung tâm của bản thảo được nhập vào.',
        status: 'suggested',
        createdBy: 'ai',
        confidence: 0.9,
        tags: ['Địa điểm', 'Nhập dữ liệu'],
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }

    let detectedChaptersCount = 0;
    let detectedScenesCount = 0;
    parts.forEach(p => {
      detectedChaptersCount += p.chapters.length;
      p.chapters.forEach(c => {
        detectedScenesCount += (c.scenes?.length || 0);
      });
    });

    return {
      detectedPartsCount: parts.length,
      detectedChaptersCount,
      detectedScenesCount,
      detectedCharacters,
      detectedLocations,
      detectedClues,
      generatedParts: parts,
      suggestedFacts
    };
  }

  /**
   * Export clean manuscript text ready for Google Docs, Word or Markdown publishing
   */
  static exportCleanManuscript(project: Project, parts: Part[]): string {
    const lines: string[] = [
      `# ${project.title.toUpperCase()}`,
      project.subtitle ? `*${project.subtitle}*\n` : '',
      `**Tác giả:** ${project.penName}`,
      `**Thể loại:** ${project.genre}`,
      `**Tổng số từ:** ${project.currentWordCount.toLocaleString()} từ`,
      `**Ngày xuất bản:** ${new Date().toLocaleDateString('vi-VN')}`,
      '\n---\n'
    ];

    parts.forEach(part => {
      lines.push(`\n# ${part.title}\n`);
      if (part.description) lines.push(`> *${part.description}*\n`);

      part.chapters.forEach(chap => {
        lines.push(`\n## ${chap.title}\n`);
        
        if (chap.content) {
          lines.push(chap.content);
          lines.push('');
        } else if (chap.scenes && chap.scenes.length > 0) {
          chap.scenes.forEach(scene => {
            if (scene.title && !scene.title.startsWith('Cảnh 1')) {
              lines.push(`\n* * *\n`);
            }
            lines.push(scene.content);
            lines.push('');
          });
        }
      });
    });

    return lines.join('\n');
  }

  /**
   * Export annotated manuscript for beta readers and editors
   */
  static exportAnnotatedManuscript(project: Project, parts: Part[], bibleFacts: BibleFact[], hooks: ForeshadowingHook[]): string {
    const lines: string[] = [
      `# [BẢN THẢO BIÊN TẬP & BETA] ${project.title.toUpperCase()}`,
      `**Tác giả:** ${project.penName} | **Ngày lập:** ${new Date().toLocaleDateString('vi-VN')}`,
      '\n---\n',
      '## TÓM TẮT STORY BIBLE LIÊN QUAN:',
      ...bibleFacts.filter(f => f.status === 'canon').map(f => `- **[${f.title}]**: ${f.content}`),
      '\n---\n'
    ];

    parts.forEach(part => {
      lines.push(`\n# ${part.title}\n`);

      part.chapters.forEach(chap => {
        lines.push(`\n## ${chap.title}\n`);

        if (chap.scenes && chap.scenes.length > 0) {
          chap.scenes.forEach(scene => {
            lines.push(`\n### [CẢNH: ${scene.title}] | POV: ${scene.povCharacterName || 'N/A'} | Địa điểm: ${scene.location || 'N/A'}`);
            if (scene.notes) {
              lines.push(`> 📝 **Ghi chú tác giả:** ${scene.notes}`);
            }
            if (scene.conflict) {
              lines.push(`> ⚔️ **Xung đột:** ${scene.conflict}`);
            }
            lines.push('\n' + scene.content + '\n');
          });
        } else if (chap.content) {
          lines.push(`> 📖 **POV:** ${chap.povCharacterName || 'N/A'} | Địa điểm: ${chap.location || 'N/A'}`);
          if (chap.notes) lines.push(`> 📝 **Ghi chú tác giả:** ${chap.notes}`);
          lines.push('\n' + chap.content + '\n');
        }
      });
    });

    return lines.join('\n');
  }
}

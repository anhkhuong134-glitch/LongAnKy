import React, { useState, useEffect, useCallback } from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { OutlineNav } from './components/editor/OutlineNav';
import { ManuscriptEditor } from './components/editor/ManuscriptEditor';
import { ContextDrawer } from './components/editor/ContextDrawer';
import { DiffModal } from './components/editor/DiffModal';
import { StoryBibleView } from './components/bible/StoryBibleView';
import { CharacterList } from './components/characters/CharacterList';
import { TimelineView } from './components/timeline/TimelineView';
import { ForeshadowingView } from './components/foreshadowing/ForeshadowingView';
import { AIAssistantPanel } from './components/ai/AIAssistantPanel';
import { FactApprovalModal } from './components/ai/FactApprovalModal';
import { UnifiedReaderView } from './components/reader/UnifiedReaderView';
import { GoogleSyncView } from './components/googleSync/GoogleSyncView';
import { ImportExportModal } from './components/importExport/ImportExportModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthorLoginModal } from './components/author/AuthorLoginModal';

import { StorageService } from './services/storageService';
import { AIService, AISuggestionResult } from './services/aiService';
import { FactExtractor, ExtractedFactCandidate } from './services/factExtractor';
import { LogicChecker } from './services/logicChecker';
import { GoogleSyncService } from './services/googleSyncService';
import { googleDocsParts } from './data/googleData';

import {
  Project, Part, Chapter, BibleFact, Character,
  TimelineEvent, ForeshadowingHook, AISettings, AIRole, LogicAuditIssue,
  ComicChapter
} from './types';

import './styles/index.css';

type ActiveTab = 'editor' | 'bible' | 'characters' | 'timeline' | 'foreshadowing' | 'reader' | 'google_sync';

export default function App() {
  // Author mode authorization: Khách vào link Vercel mặc định 100% chỉ thấy Đọc Sách, KHÔNG THẤY Soạn Thảo
  const [isAuthorMode, setIsAuthorMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // Chỉ khi tác giả chủ động thêm ?author=1 hoặc ?admin=true hoặc ?pin=134
      if (params.get('author') === '1' || params.get('author') === 'true' || params.get('pin') === '134' || params.get('admin') === 'true') {
        sessionStorage.setItem('mach_author_session', 'true');
        StorageService.setAuthorAuthenticated(true);
        return true;
      }
      // Khách ghé thăm link bình thường: mặc định KHÔNG mở quyền tác giả
      const isSessionAuth = sessionStorage.getItem('mach_author_session') === 'true';
      if (!isSessionAuth) {
        StorageService.setAuthorAuthenticated(false);
        return false;
      }
      return true;
    }
    return false;
  });
  const [showAuthorLogin, setShowAuthorLogin] = useState<boolean>(false);

  // Core state
  const [project, setProject] = useState<Project>(() => StorageService.loadProject());
  const [parts, setParts] = useState<Part[]>(() => StorageService.loadParts());
  const [bibleFacts, setBibleFacts] = useState<BibleFact[]>(() => StorageService.loadBible());
  const [characters, setCharacters] = useState<Character[]>(() => StorageService.loadCharacters());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => StorageService.loadTimeline());
  const [foreshadowing, setForeshadowing] = useState<ForeshadowingHook[]>(() => StorageService.loadForeshadowing());
  const [aiSettings, setAISettings] = useState<AISettings>(() => StorageService.loadAISettings());
  const [comicChapters, setComicChapters] = useState<ComicChapter[]>(() => StorageService.loadComicChapters());

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');
  const [isWarmTheme, setIsWarmTheme] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [docsSyncState, setDocsSyncState] = useState(() => GoogleSyncService.getDocsSyncState());
  const [isSyncingDoc, setIsSyncingDoc] = useState(false);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Navigation state (Phần -> Chương trực tiếp)
  const [activePartId, setActivePartId] = useState<string>(() => {
    return project.activePartId || parts[0]?.id || 'part_mua_nuoc_dung';
  });
  const [activeChapterId, setActiveChapterId] = useState<string>(() => {
    return project.activeChapterId || parts[0]?.chapters[0]?.id || 'doc_chap_01';
  });

  // Tự động kéo bản mới nhất từ link Google Docs
  const handleSyncGoogleDocs = useCallback(async (showNotification = true) => {
    setIsSyncingDoc(true);
    try {
      const res = await GoogleSyncService.syncLiveGoogleDocs();
      if (res.success && res.parts && res.parts.length > 0) {
        setParts(res.parts);
        StorageService.saveParts(res.parts);
        const total = res.parts.reduce((sum, p) => sum + p.wordCount, 0);
        setProject(prev => ({
          ...prev,
          currentWordCount: total,
          updatedAt: new Date().toLocaleDateString('vi-VN')
        }));
        setDocsSyncState(GoogleSyncService.getDocsSyncState());

        // Đảm bảo active chapter hợp lệ
        const chapterExists = res.parts.some(p => p.chapters.some(c => c.id === activeChapterId));
        if (!chapterExists && res.parts[0]?.chapters[0]) {
          setActivePartId(res.parts[0].id);
          setActiveChapterId(res.parts[0].chapters[0].id);
        }

        if (showNotification) {
          setSyncToast({ message: res.message, type: 'success' });
          setTimeout(() => setSyncToast(null), 4500);
        }
      } else if (showNotification) {
        setSyncToast({ message: res.message, type: 'error' });
        setTimeout(() => setSyncToast(null), 4500);
      }
    } catch (err: any) {
      if (showNotification) {
        setSyncToast({ message: `Lỗi đồng bộ Google Docs: ${err.message}`, type: 'error' });
        setTimeout(() => setSyncToast(null), 4500);
      }
    } finally {
      setIsSyncingDoc(false);
    }
  }, [activeChapterId]);

  // Real-time Auto-Sync Watcher: Tự động phát hiện thay đổi trên Google Docs và nạp ngay vào truyện
  const [isAutoSyncLive, setIsAutoSyncLive] = useState<boolean>(true);
  const [lastLiveCheckTime, setLastLiveCheckTime] = useState<string>(() => new Date().toLocaleTimeString('vi-VN'));

  const checkAndApplyDocChanges = useCallback(async (silent = true) => {
    try {
      const res = await GoogleSyncService.checkAndAutoSyncOnDocChange();
      setLastLiveCheckTime(new Date().toLocaleTimeString('vi-VN'));
      if (res.hasChanged && res.parts && res.parts.length > 0) {
        setParts(res.parts);
        StorageService.saveParts(res.parts);
        const total = res.parts.reduce((sum, p) => sum + p.wordCount, 0);
        setProject(prev => ({
          ...prev,
          currentWordCount: total,
          updatedAt: new Date().toLocaleDateString('vi-VN')
        }));
        setDocsSyncState(GoogleSyncService.getDocsSyncState());

        // Đảm bảo active chapter hợp lệ
        const chapterExists = res.parts.some(p => p.chapters.some(c => c.id === activeChapterId));
        if (!chapterExists && res.parts[0]?.chapters[0]) {
          setActivePartId(res.parts[0].id);
          setActiveChapterId(res.parts[0].chapters[0].id);
        }

        // Hiện thông báo nổi bật màu xanh ngọc
        setSyncToast({ message: res.message, type: 'success' });
        setTimeout(() => setSyncToast(null), 5000);
      } else if (!silent) {
        setSyncToast({ message: res.message, type: 'success' });
        setTimeout(() => setSyncToast(null), 3000);
      }
    } catch (e: any) {
      if (!silent) {
        setSyncToast({ message: `Lỗi quét Google Doc: ${e.message}`, type: 'error' });
        setTimeout(() => setSyncToast(null), 4000);
      }
    }
  }, [activeChapterId]);

  // 1. Quét định kỳ nền mỗi 12 giây nếu isAutoSyncLive = true
  useEffect(() => {
    if (!isAutoSyncLive) return;
    const interval = setInterval(() => {
      checkAndApplyDocChanges(true);
    }, 12000);
    return () => clearInterval(interval);
  }, [isAutoSyncLive, checkAndApplyDocChanges]);

  // 2. Quét TỨC THÌ khi người dùng chuyển tab quay lại (window focus)
  useEffect(() => {
    const handleFocus = () => {
      if (isAutoSyncLive) {
        checkAndApplyDocChanges(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAutoSyncLive, checkAndApplyDocChanges]);

  // Tự động kiểm tra và cập nhật từ Google Doc khi ứng dụng mở
  useEffect(() => {
    handleSyncGoogleDocs(false);
  }, []);

  // Modal state
  const [aiProposal, setAIProposal] = useState<AISuggestionResult | null>(null);
  const [factCandidates, setFactCandidates] = useState<ExtractedFactCandidate[]>([]);
  const [showFactApproval, setShowFactApproval] = useState(false);
  const [logicIssues, setLogicIssues] = useState<LogicAuditIssue[]>([]);
  const [showImportExport, setShowImportExport] = useState<{ open: boolean; mode: 'import' | 'export' }>({ open: false, mode: 'import' });
  const [showSettings, setShowSettings] = useState(false);

  // Find active Part & active Chapter
  const activePart = parts.find(p => p.id === activePartId) || parts[1] || parts[0];
  const activeChapter: Chapter | null = (() => {
    if (activePart) {
      const found = activePart.chapters.find(c => c.id === activeChapterId);
      if (found) return found;
    }
    for (const p of parts) {
      const found = p.chapters.find(c => c.id === activeChapterId);
      if (found) return found;
    }
    return activePart?.chapters[0] || parts[0]?.chapters[0] || null;
  })();

  const activePartTitle = activePart?.title || 'Phần truyện';

  // Synchronize localStorage
  useEffect(() => {
    StorageService.saveProject(project);
  }, [project]);

  useEffect(() => {
    StorageService.saveParts(parts);
    const total = parts.reduce((sum, p) => sum + p.wordCount, 0);
    setProject(prev => ({ ...prev, currentWordCount: total }));
  }, [parts]);

  useEffect(() => { StorageService.saveBible(bibleFacts); }, [bibleFacts]);
  useEffect(() => { StorageService.saveCharacters(characters); }, [characters]);
  useEffect(() => { StorageService.saveTimeline(timeline); }, [timeline]);
  useEffect(() => { StorageService.saveForeshadowing(foreshadowing); }, [foreshadowing]);
  useEffect(() => { StorageService.saveAISettings(aiSettings); }, [aiSettings]);

  // Save comic chapters
  const handleSaveComicChapters = useCallback((updated: ComicChapter[]) => {
    setComicChapters(updated);
    StorageService.saveComicChapters(updated);
  }, []);

  // Đảm bảo độc giả chỉ được xem tab 'reader'
  useEffect(() => {
    if (!isAuthorMode && activeTab !== 'reader') {
      setActiveTab('reader');
    }
  }, [isAuthorMode, activeTab]);

  // Phím tắt bí mật cho Tác Giả: Ctrl + Shift + A (hoặc Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAuthorLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update Chapter content directly
  const handleUpdateChapterContent = useCallback((newContent: string) => {
    if (!activeChapter) return;
    const newWordCount = newContent.trim().split(/\s+/).filter(Boolean).length;

    setParts(prev => prev.map(p => {
      const hasTargetChapter = p.chapters.some(c => c.id === activeChapter.id);
      if (!hasTargetChapter) return p;

      const updatedChapters = p.chapters.map(c => {
        if (c.id !== activeChapter.id) return c;
        return {
          ...c,
          content: newContent,
          wordCount: newWordCount
        };
      });

      const updatedPartWords = updatedChapters.reduce((sum, c) => sum + c.wordCount, 0);
      return {
        ...p,
        chapters: updatedChapters,
        wordCount: updatedPartWords
      };
    }));

    setProject(prev => ({
      ...prev,
      stats: { ...prev.stats, wordsToday: Math.min(prev.stats.wordsToday + 10, prev.stats.dailyGoal + 500) }
    }));
  }, [activeChapter?.id]);

  // Update Chapter metadata
  const handleUpdateChapterMetadata = useCallback((updatedFields: Partial<Chapter>) => {
    if (!activeChapter) return;
    setParts(prev => prev.map(p => ({
      ...p,
      chapters: p.chapters.map(c => c.id === activeChapter.id ? { ...c, ...updatedFields } : c)
    })));
  }, [activeChapter?.id]);

  // Navigation handler
  const handleSelectChapter = useCallback((chapterId: string, partId: string) => {
    setActivePartId(partId);
    setActiveChapterId(chapterId);
  }, []);

  // Structural handlers
  const handleAddPart = () => {
    const newPart: Part = {
      id: `part_${Date.now()}`,
      title: `Phần ${parts.length + 1}: Tiêu đề mới`,
      order: parts.length + 1,
      chapters: [],
      wordCount: 0,
      isExpanded: true
    };
    setParts(prev => [...prev, newPart]);
  };

  const handleAddChapter = (partId: string) => {
    setParts(prev => prev.map(p => {
      if (p.id !== partId) return p;
      const newChap: Chapter = {
        id: `chap_${Date.now()}`,
        partId,
        title: `Chương ${p.chapters.length + 1}: Tiêu đề chương mới`,
        order: p.chapters.length + 1,
        content: '',
        wordCount: 0,
        status: 'draft',
        isExpanded: true,
        scenes: []
      };
      return { ...p, chapters: [...p.chapters, newChap] };
    }));
  };

  const handleDeleteChapter = (chapterId: string, partId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa chương này không?')) return;
    setParts(prev => prev.map(p => {
      if (p.id !== partId) return p;
      const filtered = p.chapters.filter(c => c.id !== chapterId);
      return {
        ...p,
        chapters: filtered,
        wordCount: filtered.reduce((sum, c) => sum + c.wordCount, 0)
      };
    }));
  };

  // AI Request Handler
  const handleRequestAI = useCallback(async (role: AIRole, prompt: string, options?: any) => {
    if (!activeChapter) return;
    const result = await AIService.requestAssistance(
      role,
      prompt,
      activeChapter,
      parts,
      characters,
      bibleFacts,
      foreshadowing,
      aiSettings,
      options
    );
    setAIProposal(result);
  }, [activeChapter, parts, characters, bibleFacts, foreshadowing, aiSettings]);

  // Accept AI Proposal
  const handleAcceptProposal = (acceptedText: string, reason: string) => {
    if (!activeChapter) return;
    const versionSnapshot = {
      id: `ver_${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      authorType: 'author' as const,
      changeReason: `Chấp nhận đề xuất AI: "${reason}"`,
      content: activeChapter.content || '',
      wordCount: activeChapter.wordCount
    };

    const newContent = activeChapter.content
      ? activeChapter.content + '\n\n' + acceptedText
      : acceptedText;

    const newWordCount = newContent.trim().split(/\s+/).filter(Boolean).length;

    setParts(prev => prev.map(p => ({
      ...p,
      chapters: p.chapters.map(c => {
        if (c.id !== activeChapter.id) return c;
        return {
          ...c,
          content: newContent,
          wordCount: newWordCount,
          versions: [...(c.versions || []), versionSnapshot]
        };
      }),
      wordCount: p.chapters.reduce((sum, c) => sum + (c.id === activeChapter.id ? newWordCount : c.wordCount), 0)
    })));

    setAIProposal(null);
  };

  // Fact Extraction
  const handleRequestFactExtraction = () => {
    if (!activeChapter) return;
    const candidates = FactExtractor.extractFactsFromScene(activeChapter, characters);
    setFactCandidates(candidates);
    setShowFactApproval(true);
  };

  const handleApproveFactsIntoCanon = (approvedFacts: BibleFact[]) => {
    setBibleFacts(prev => [...prev, ...approvedFacts]);
    setShowFactApproval(false);
  };

  // Logic Audit
  const handleAuditLogic = () => {
    if (!activeChapter) return;
    const issues = LogicChecker.auditSceneContent(activeChapter, characters, bibleFacts);
    setLogicIssues(issues);
    setAIProposal({
      role: 'logic_auditor',
      title: `Báo Cáo Kiểm Định Logic — ${activeChapter.title}`,
      response: issues.length === 0
        ? '✅ Không phát hiện lỗi logic, mâu thuẫn tri thức hay vi phạm Canon nào trong chương này. Rất chuẩn xác!'
        : issues.map(issue => `🔴 [${issue.type.toUpperCase()}] ${issue.title}\n${issue.detail}\n💡 Gợi ý xử lý: ${issue.fixSuggestion}`).join('\n\n'),
      rationale: `Đã kiểm tra đối chiếu qua ${characters.length} hồ sơ nhân vật và ${bibleFacts.filter(f => f.status === 'canon').length} điều luật Canon.`
    });
  };

  // Bible CRUD
  const handleUpdateFact = (fact: BibleFact) => setBibleFacts(prev => prev.map(f => f.id === fact.id ? fact : f));
  const handleAddFact = (fact: BibleFact) => setBibleFacts(prev => [...prev, fact]);
  const handleDeleteFact = (factId: string) => setBibleFacts(prev => prev.filter(f => f.id !== factId));

  // Characters CRUD
  const handleUpdateCharacter = (char: Character) => setCharacters(prev => prev.map(c => c.id === char.id ? char : c));
  const handleAddCharacter = (char: Character) => setCharacters(prev => [...prev, char]);
  const handleDeleteCharacter = (charId: string) => setCharacters(prev => prev.filter(c => c.id !== charId));

  // Timeline CRUD
  const handleAddTimelineEvent = (event: TimelineEvent) => setTimeline(prev => [...prev, event]);
  const handleUpdateTimelineEvent = (event: TimelineEvent) => setTimeline(prev => prev.map(e => e.id === event.id ? event : e));

  // Foreshadowing CRUD
  const handleUpdateHook = (hook: ForeshadowingHook) => setForeshadowing(prev => prev.map(h => h.id === hook.id ? hook : h));
  const handleAddHook = (hook: ForeshadowingHook) => setForeshadowing(prev => [...prev, hook]);
  const handleDeleteHook = (hookId: string) => setForeshadowing(prev => prev.filter(h => h.id !== hookId));

  // Reset to sample project
  const handleResetSample = () => {
    if (!window.confirm('Tải lại nguyên bản dự án mẫu "Long Ấn Ký" từ file docx?')) return;
    localStorage.clear();
    window.location.reload();
  };

  const handleImportSuccess = (importedParts: Part[], newFacts: BibleFact[]) => {
    if (importedParts.length > 0) {
      setParts(importedParts);
      setActivePartId(importedParts[0].id);
      if (importedParts[0].chapters[0]) {
        setActiveChapterId(importedParts[0].chapters[0].id);
      }
    }
    if (newFacts.length > 0) {
      setBibleFacts(prev => [...prev, ...newFacts]);
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-200 ${
      isWarmTheme ? 'bg-parchment-50 text-stone-900' : 'bg-[#060911] text-slate-100'
    }`}>
      {/* Global Header */}
      <AppHeader
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isWarmTheme={isWarmTheme}
        setIsWarmTheme={setIsWarmTheme}
        onOpenImport={() => setShowImportExport({ open: true, mode: 'import' })}
        onOpenExport={() => setShowImportExport({ open: true, mode: 'export' })}
        onOpenSettings={() => setShowSettings(true)}
        onResetSample={handleResetSample}
        stagedSyncCount={docsSyncState.stagedChangesCount}
        isAuthorMode={isAuthorMode}
        onOpenAuthorLogin={() => setShowAuthorLogin(true)}
        onExitAuthorMode={() => {
          sessionStorage.removeItem('mach_author_session');
          StorageService.setAuthorAuthenticated(false);
          setIsAuthorMode(false);
          setActiveTab('reader');
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('author');
            url.searchParams.delete('pin');
            url.searchParams.delete('admin');
            window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
          }
        }}
        isAutoSyncLive={isAutoSyncLive}
        onToggleAutoSync={() => setIsAutoSyncLive(prev => !prev)}
        onTriggerLiveCheck={() => checkAndApplyDocChanges(false)}
        lastLiveCheckTime={lastLiveCheckTime}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {/* TAB: Manuscript Studio (Phần -> Chương -> Soạn thảo & Up Truyện Tranh) - Chỉ tác giả mới xem được */}
        {isAuthorMode && activeTab === 'editor' && (
          <div className="flex-1 flex overflow-hidden">
            <OutlineNav
              parts={parts}
              activeChapterId={activeChapter?.id}
              activePartId={activePart?.id}
              onSelectChapter={handleSelectChapter}
              onAddPart={handleAddPart}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              isWarmTheme={isWarmTheme}
              onSyncGoogleDocs={() => handleSyncGoogleDocs(true)}
              isSyncingDoc={isSyncingDoc}
            />

            {activeChapter ? (
              <>
                <ManuscriptEditor
                  chapter={activeChapter}
                  partTitle={activePartTitle}
                  characters={characters}
                  chapters={activePart?.chapters || []}
                  comicChapters={comicChapters}
                  onSaveComicChapters={handleSaveComicChapters}
                  onPreviewInReader={() => setActiveTab('reader')}
                  onUpdateContent={handleUpdateChapterContent}
                  onUpdateMetadata={handleUpdateChapterMetadata}
                  onRequestAI={handleRequestAI}
                  onRequestFactExtraction={handleRequestFactExtraction}
                  onAuditLogic={handleAuditLogic}
                  isWarmTheme={isWarmTheme}
                  isFocusMode={isFocusMode}
                  setIsFocusMode={setIsFocusMode}
                />

                {!isFocusMode && (
                  <ContextDrawer
                    chapter={activeChapter}
                    characters={characters}
                    bibleFacts={bibleFacts}
                    hooks={foreshadowing}
                    onRequestAI={handleRequestAI}
                    isWarmTheme={isWarmTheme}
                  />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                <div className="text-center space-y-2">
                  <p className="font-serif text-2xl opacity-40 text-amber-300">Mạch Novel Engine</p>
                  <p>Chọn một chương từ cột bên trái để bắt đầu viết.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Story Bible - Chỉ Tác Giả */}
        {isAuthorMode && activeTab === 'bible' && (
          <div className="flex-1 overflow-hidden">
            <StoryBibleView
              facts={bibleFacts}
              onUpdateFact={handleUpdateFact}
              onAddFact={handleAddFact}
              onDeleteFact={handleDeleteFact}
              isWarmTheme={isWarmTheme}
            />
          </div>
        )}

        {/* TAB: Characters Dossiers - Chỉ Tác Giả */}
        {isAuthorMode && activeTab === 'characters' && (
          <div className="flex-1 overflow-hidden">
            <CharacterList
              characters={characters}
              onUpdateCharacter={handleUpdateCharacter}
              onAddCharacter={handleAddCharacter}
              onDeleteCharacter={handleDeleteCharacter}
              onRequestRoleplay={(charId) => {
                handleRequestAI('character_actor', 'Nhập vai nhân vật được chọn', { targetCharacterId: charId });
              }}
              isWarmTheme={isWarmTheme}
            />
          </div>
        )}

        {/* TAB: Timeline - Chỉ Tác Giả */}
        {isAuthorMode && activeTab === 'timeline' && (
          <div className="flex-1 overflow-hidden">
            <TimelineView
              timeline={timeline}
              characters={characters}
              onAddEvent={handleAddTimelineEvent}
              onUpdateEvent={handleUpdateTimelineEvent}
              isWarmTheme={isWarmTheme}
            />
          </div>
        )}

        {/* TAB: Foreshadowing Tracker - Chỉ Tác Giả */}
        {isAuthorMode && activeTab === 'foreshadowing' && (
          <div className="flex-1 overflow-hidden">
            <ForeshadowingView
              hooks={foreshadowing}
              onUpdateHook={handleUpdateHook}
              onAddHook={handleAddHook}
              onDeleteHook={handleDeleteHook}
              isWarmTheme={isWarmTheme}
            />
          </div>
        )}

        {/* TAB: Google Docs & Google Sheets Two-Way Sync + Soul Seal Game - Chỉ Tác Giả */}
        {isAuthorMode && activeTab === 'google_sync' && (
          <div className="flex-1 overflow-hidden">
            <GoogleSyncView
              activeChapter={activeChapter}
              onUpdateChapterContent={handleUpdateChapterContent}
              isWarmTheme={isWarmTheme}
            />
          </div>
        )}

        {/* TAB: Unified Reader (Novel & Comic Preview + Audio TTS) - MẶC ĐỊNH VÀ DUY NHẤT CHO ĐỘC GIẢ */}
        {activeTab === 'reader' && (
          <div className="flex-1 overflow-hidden">
            <UnifiedReaderView
              project={project}
              parts={parts}
              isWarmTheme={isWarmTheme}
              aiSettings={aiSettings}
              comicChapters={comicChapters}
              isAuthorMode={isAuthorMode}
              onOpenComicUploader={() => {
                if (isAuthorMode) setActiveTab('editor');
              }}
            />
          </div>
        )}
      </div>

      {/* ====== GLOBAL MODALS ====== */}

      {/* Author PIN Verification Modal */}
      <AuthorLoginModal
        isOpen={showAuthorLogin}
        onClose={() => setShowAuthorLogin(false)}
        onSuccess={() => {
          sessionStorage.setItem('mach_author_session', 'true');
          StorageService.setAuthorAuthenticated(true);
          setIsAuthorMode(true);
          setActiveTab('editor');
        }}
      />

      {/* AI Diff/Proposal Comparator Modal */}
      {aiProposal && activeChapter && (
        <DiffModal
          proposal={aiProposal}
          currentText={(activeChapter.content || '').slice(-800)}
          onAccept={handleAcceptProposal}
          onClose={() => setAIProposal(null)}
        />
      )}

      {/* Fact Extraction & Canon Approval Modal */}
      {showFactApproval && (
        <FactApprovalModal
          candidates={factCandidates}
          onApproveFacts={handleApproveFactsIntoCanon}
          onClose={() => setShowFactApproval(false)}
        />
      )}

      {/* Import / Export Modal */}
      {showImportExport.open && (
        <ImportExportModal
          project={project}
          parts={parts}
          bibleFacts={bibleFacts}
          hooks={foreshadowing}
          initialMode={showImportExport.mode}
          onImportSuccess={handleImportSuccess}
          onClose={() => setShowImportExport({ open: false, mode: 'import' })}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={aiSettings}
          onSaveSettings={(newSettings) => {
            setAISettings(newSettings);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Floating Sync Toast */}
      {syncToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-sm flex items-center space-x-3 transition-all backdrop-blur-xl ${
          syncToast.type === 'success'
            ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-200 shadow-emerald-500/20'
            : 'bg-slate-900/95 border-rose-500/50 text-rose-200 shadow-rose-500/20'
        }`}>
          <span className="text-base">{syncToast.type === 'success' ? '🟢' : '🔴'}</span>
          <span className="font-medium text-xs leading-relaxed max-w-sm">{syncToast.message}</span>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Image as ImageIcon, 
  ZoomIn, 
  BookMarked,
  Home,
  List,
  ArrowUp,
  Info,
  RefreshCw,
  Layers,
  ChevronDown,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { Project, Part, Chapter, ComicChapter, ComicPanel, ComicReadingMode, AISettings } from '../../types';
import { sampleComicChapters, GOOGLE_DOCS_URL } from '../../data/googleData';
import { AIStudioService, ComicScriptResult } from '../../services/aiStudioService';

interface UnifiedReaderViewProps {
  project: Project;
  parts: Part[];
  isWarmTheme: boolean;
  aiSettings: AISettings;
  comicChapters?: ComicChapter[];
  isAuthorMode?: boolean;
  onOpenComicUploader?: () => void;
  onSyncGoogleDocs?: () => Promise<void> | void;
  isSyncingDoc?: boolean;
}

type ReaderType = 'novel' | 'comic';
type NovelTheme = 'dark' | 'sepia' | 'candle' | 'paper';
type PageLayoutMode = 'scroll' | 'paginated';

export const UnifiedReaderView: React.FC<UnifiedReaderViewProps> = ({
  project,
  parts,
  isWarmTheme,
  aiSettings,
  comicChapters: propsComicChapters,
  isAuthorMode = false,
  onOpenComicUploader,
  onSyncGoogleDocs,
  isSyncingDoc = false
}) => {
  // Mode selection: Novel (Truyện chữ - Đang sáng tác) vs Comic (Truyện tranh - Sắp ra mắt)
  const [readerType, setReaderType] = useState<ReaderType>('novel');
  
  // Novel reader states
  const [selectedPartId, setSelectedPartId] = useState<string>(parts[0]?.id || '');
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [novelTheme, setNovelTheme] = useState<NovelTheme>(isWarmTheme ? 'sepia' : 'dark');
  const [pageLayout, setPageLayout] = useState<PageLayoutMode>('scroll');
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Audio / TTS states
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Comic reader states
  const [comicChapters, setComicChapters] = useState<ComicChapter[]>(() => {
    return propsComicChapters && propsComicChapters.length > 0 ? propsComicChapters : sampleComicChapters;
  });

  useEffect(() => {
    if (propsComicChapters && propsComicChapters.length > 0) {
      setComicChapters(propsComicChapters);
    }
  }, [propsComicChapters]);

  const [activeComicIndex, setActiveComicIndex] = useState<number>(0);
  const [comicMode, setComicMode] = useState<ComicReadingMode>('webtoon');
  const [selectedPanel, setSelectedPanel] = useState<ComicPanel | null>(null);
  const [isGeneratingComic, setIsGeneratingComic] = useState<boolean>(false);
  const [activeArtStyle, setActiveArtStyle] = useState<string>('dark_webtoon');
  const [showPanelCreator, setShowPanelCreator] = useState<boolean>(false);
  const [customSnippet, setCustomSnippet] = useState<string>('');

  // Left Sidebar State for Novel (Mở rộng / Thu gọn Phần & Sidebar như hình 4)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    parts.forEach(p => { initial[p.id] = true; });
    return initial;
  });

  const toggleSection = (partId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [partId]: prev[partId] !== undefined ? !prev[partId] : false
    }));
  };

  const getSectionTheme = (title: string, partId: string) => {
    const t = title.toLowerCase();
    if (t.includes('mùa nước đứng') || partId.includes('mua_nuoc_dung') || t.includes('phần i')) {
      return { icon: '🌊', badge: 'MÙA NƯỚC ĐỨNG' };
    }
    if (t.includes('bản cũ') || t.includes('aesvorn') || partId.includes('aesvorn') || t.includes('phần ii')) {
      return { icon: '🏛️', badge: 'BẢN CŨ AESVORN' };
    }
    if (t.includes('mở đầu') || partId.includes('prologue')) {
      return { icon: '📜', badge: 'MỞ ĐẦU' };
    }
    return { icon: '📁', badge: 'PHẦN TRUYỆN' };
  };

  const totalNovelWords = parts.reduce((acc, p) => acc + p.wordCount, 0);
  const totalChaptersCount = parts.reduce((acc, p) => acc + p.chapters.length, 0);

  // Danh sách phẳng tất cả các chương qua toàn bộ các Phần
  const allFlatChapters = React.useMemo(() => {
    const list: {
      partId: string;
      partTitle: string;
      chapter: Chapter;
      partIndex: number;
      chapterIndex: number;
    }[] = [];
    parts.forEach((p, pIdx) => {
      p.chapters.forEach((c, cIdx) => {
        list.push({
          partId: p.id,
          partTitle: p.title,
          chapter: c,
          partIndex: pIdx,
          chapterIndex: cIdx
        });
      });
    });
    return list;
  }, [parts]);

  const currentGlobalIndex = React.useMemo(() => {
    const idx = allFlatChapters.findIndex(
      item => item.partId === selectedPartId && item.chapterIndex === activeChapterIndex
    );
    return idx >= 0 ? idx : 0;
  }, [allFlatChapters, selectedPartId, activeChapterIndex]);

  const goToChapterByGlobalIndex = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= allFlatChapters.length) return;
    const target = allFlatChapters[targetIdx];
    setSelectedPartId(target.partId);
    setActiveChapterIndex(target.chapterIndex);
    scrollToTop();
  };

  const activePart = parts.find(p => p.id === selectedPartId) || parts[0];
  const chapters = activePart?.chapters || [];
  const currentChapter: Chapter | undefined = chapters[activeChapterIndex] || chapters[0];
  const activeComic = comicChapters[activeComicIndex] || comicChapters[0];

  const totalWords = currentChapter?.wordCount || 0;
  const estimatedReadTime = Math.max(1, Math.ceil(totalWords / 220));

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation: Mũi tên trái (←) hoặc phải (→) chuyển chapter chuẩn NetTruyen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (readerType === 'novel') {
        if (e.key === 'ArrowLeft') {
          if (currentGlobalIndex > 0) {
            goToChapterByGlobalIndex(currentGlobalIndex - 1);
          }
        } else if (e.key === 'ArrowRight') {
          if (currentGlobalIndex < allFlatChapters.length - 1) {
            goToChapterByGlobalIndex(currentGlobalIndex + 1);
          }
        }
      } else {
        if (e.key === 'ArrowLeft') {
          if (activeComicIndex > 0) {
            setActiveComicIndex(prev => Math.max(0, prev - 1));
            scrollToTop();
          }
        } else if (e.key === 'ArrowRight') {
          if (activeComicIndex < comicChapters.length - 1) {
            setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
            scrollToTop();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readerType, currentGlobalIndex, allFlatChapters.length, activeComicIndex, comicChapters.length]);

  // Tổng hợp toàn bộ các ô tranh (panels) của Chapter hiện tại thành dòng cuộn dọc NetTruyen
  const allPanels = React.useMemo(() => {
    const panels: (ComicPanel & { pageTitle?: string; pageIndex: number })[] = [];
    activeComic.pages.forEach((page, pageIdx) => {
      page.panels.forEach(panel => {
        panels.push({
          ...panel,
          pageTitle: page.title,
          pageIndex: pageIdx
        });
      });
    });
    return panels;
  }, [activeComic]);

  // Speech synthesis init
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (!synthRef.current || !currentChapter?.content) return;

    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    } else {
      synthRef.current.cancel();
      const textToRead = currentChapter.content.replace(/[*#—_]/g, ' ').slice(0, 4000);
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Convert current chapter prose into comic
  const handleGenerateComicFromCurrentChapter = async () => {
    if (!currentChapter?.content) return;
    setIsGeneratingComic(true);
    try {
      const snippet = customSnippet || currentChapter.content.slice(0, 1500);
      const scriptResult = await AIStudioService.convertProseToComicScript(snippet, aiSettings);

      const newComicChapter: ComicChapter = {
        id: `comic_gen_${Date.now()}`,
        chapterId: currentChapter.id,
        title: `Truyện Tranh AI: ${scriptResult.title || currentChapter.title}`,
        subtitle: `Tạo từ ${currentChapter.title} • Phong cách: ${activeArtStyle}`,
        coverUrl: AIStudioService.generatePanelImageUrl(scriptResult.panels[0]?.imagePrompt || 'fantasy comic cover', activeArtStyle),
        readingDirection: 'vertical',
        pages: [
          {
            id: `page_gen_01`,
            pageNumber: 1,
            title: scriptResult.title,
            panels: scriptResult.panels.map((p, idx) => ({
              id: `panel_gen_${idx}_${Date.now()}`,
              panelNumber: p.panelNumber,
              caption: p.caption,
              cameraAngle: p.cameraAngle,
              actionDescription: p.actionDescription,
              dialogues: p.dialogues.map((d, dIdx) => ({
                id: `d_${idx}_${dIdx}`,
                character: d.character,
                text: d.text,
                position: d.position,
                bubbleType: d.type
              })),
              sfx: p.sfx,
              prompt: p.imagePrompt,
              imageUrl: AIStudioService.generatePanelImageUrl(p.imagePrompt, activeArtStyle, idx * 5),
              aspectRatio: p.aspectRatio,
              widthSpan: p.aspectRatio === '16:9' ? 'full' : 'half'
            }))
          }
        ]
      };

      setComicChapters(prev => [newComicChapter, ...prev]);
      setActiveComicIndex(0);
      setReaderType('comic');
      setShowPanelCreator(false);
    } catch (e: any) {
      alert(`Lỗi sinh truyện tranh: ${e.message}`);
    } finally {
      setIsGeneratingComic(false);
    }
  };

  // Theme palettes
  const novelThemeClasses = {
    dark: {
      bg: 'bg-[#080c14]',
      container: 'bg-[#0d1322] border-slate-800/80',
      text: 'text-slate-100',
      prose: 'text-slate-200 selection:bg-amber-500/30 selection:text-amber-100',
      meta: 'text-slate-400',
      toolbar: 'bg-slate-950/80 border-slate-800/80 text-slate-200'
    },
    sepia: {
      bg: 'bg-[#f4ede2]',
      container: 'bg-[#faf6f0] border-amber-900/15 shadow-sm',
      text: 'text-stone-900',
      prose: 'text-stone-850 selection:bg-amber-300 selection:text-stone-950',
      meta: 'text-amber-800/80',
      toolbar: 'bg-[#eadecc]/90 border-amber-900/15 text-stone-900'
    },
    candle: {
      bg: 'bg-[#181109]',
      container: 'bg-[#22180e] border-amber-800/30',
      text: 'text-amber-100',
      prose: 'text-amber-50/90 selection:bg-amber-600/40 selection:text-amber-50',
      meta: 'text-amber-400/70',
      toolbar: 'bg-[#150e07]/90 border-amber-900/40 text-amber-200'
    },
    paper: {
      bg: 'bg-[#f8fafc]',
      container: 'bg-white border-slate-200 shadow-sm',
      text: 'text-gray-900',
      prose: 'text-gray-900 selection:bg-sky-200 selection:text-sky-950',
      meta: 'text-gray-500',
      toolbar: 'bg-gray-100/90 border-gray-200 text-gray-800'
    }
  }[novelTheme];

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors duration-200 ${novelThemeClasses.bg}`}>
      {/* ================= TOP UNIFIED TOOLBAR ================= */}
      <div className={`px-4 sm:px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl z-20 ${novelThemeClasses.toolbar}`}>
        {/* Left: Branding & Mode Switcher */}
        <div className="flex items-center space-x-3">
          {readerType === 'novel' && (
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm ${
                isSidebarOpen
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/60 hover:bg-slate-700/80 border-white/10 text-slate-300'
              }`}
              title="Đóng / Mở Bảng Cấu Trúc Tác Phẩm"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cấu Trúc Tác Phẩm</span>
              <span className="sm:hidden">Mục Lục</span>
            </button>
          )}

          <div className="flex items-center bg-black/20 dark:bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setReaderType('novel')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                readerType === 'novel'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'opacity-70 hover:opacity-100 text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Truyện Chữ (Đang sáng tác)</span>
            </button>

            <button
              onClick={() => setReaderType('comic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                readerType === 'comic'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'opacity-70 hover:opacity-100 text-slate-300'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>Truyện Tranh (Sắp ra mắt)</span>
            </button>
          </div>

          <span className="hidden md:inline text-xs opacity-50">•</span>
          <span className="hidden md:inline text-xs font-medium opacity-80 truncate max-w-xs font-serif">
            {readerType === 'novel' ? currentChapter?.title : activeComic.title}
          </span>
        </div>

        {/* Center: Controls based on Mode */}
        {readerType === 'novel' ? (
          <div className="flex items-center space-x-2">
            {/* Part selector pills */}
            <div className="hidden lg:flex items-center space-x-1 bg-black/15 p-1 rounded-lg">
              {parts.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPartId(p.id);
                    setActiveChapterIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    selectedPartId === p.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {p.title.split('—')[0]}
                </button>
              ))}
            </div>

            {/* Audio Read-Aloud Button */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isPlayingAudio
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-black/15 hover:bg-black/25 border-white/10'
              }`}
              title="Đọc to truyện bằng giọng AI tiếng Việt"
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Đang đọc...' : 'Đọc Audio'}</span>
            </button>

            {/* Convert to Comic Trigger - Only for Author */}
            {isAuthorMode && (
              <button
                onClick={() => setShowPanelCreator(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-rose-300 border border-rose-500/30 shadow-sm"
                title="Dành cho tác giả: Dùng AI phân cảnh đoạn văn thành truyện tranh và sinh ảnh"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Biến thành Truyện Tranh AI</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {/* Webtoon vs Manga Mode */}
            <div className="flex items-center bg-black/15 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setComicMode('webtoon')}
                className={`px-2.5 py-1 rounded-lg ${comicMode === 'webtoon' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'opacity-70'}`}
              >
                Cuộn Dọc Webtoon
              </button>
              <button
                onClick={() => setComicMode('manga_pages')}
                className={`px-2.5 py-1 rounded-lg ${comicMode === 'manga_pages' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'opacity-70'}`}
              >
                Lật Trang Manga
              </button>
            </div>

            {isAuthorMode && (
              <button
                onClick={() => setShowPanelCreator(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30"
                title="Dành cho tác giả: Tạo hồi truyện tranh mới"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tạo Hồi Mới</span>
              </button>
            )}
          </div>
        )}

        {/* Right: Theme & Typography Settings */}
        <div className="flex items-center space-x-2 text-xs">
          {readerType === 'novel' && (
            <>
              {/* Theme Selector */}
              <div className="flex items-center space-x-1 bg-black/15 p-1 rounded-xl border border-white/10">
                {(['dark', 'sepia', 'candle', 'paper'] as NovelTheme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setNovelTheme(t)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] uppercase font-bold transition-transform ${
                      novelTheme === t ? 'ring-2 ring-amber-400 scale-105' : 'opacity-60'
                    }`}
                    style={{
                      background: t === 'dark' ? '#080c14' : t === 'sepia' ? '#f4ede2' : t === 'candle' ? '#22180e' : '#ffffff',
                      color: t === 'paper' || t === 'sepia' ? '#000' : '#fff'
                    }}
                    title={`Chế độ ${t}`}
                  >
                    {t[0]}
                  </button>
                ))}
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center space-x-1 bg-black/15 px-2 py-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                  className="px-1 hover:text-amber-400 font-bold"
                >
                  A-
                </button>
                <span className="font-mono text-[11px] opacity-70 w-5 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                  className="px-1 hover:text-amber-400 font-bold"
                >
                  A+
                </button>
              </div>
            </>
          )}

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-1.5 rounded-lg border transition-all ${
              isBookmarked ? 'text-amber-400 border-amber-400/50 bg-amber-400/10' : 'opacity-60 hover:opacity-100 border-white/10'
            }`}
            title="Đánh dấu trang"
          >
            <BookMarked className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      {readerType === 'novel' ? (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile Backdrop for Sidebar */}
          {isSidebarOpen && (
            <div 
              onClick={() => setIsSidebarOpen(false)} 
              className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm transition-opacity" 
            />
          )}

          {/* ================= LEFT SIDEBAR: CẤU TRÚC TÁC PHẨM (Matching Hình 4) ================= */}
          <aside
            className={`w-80 sm:w-88 lg:w-96 flex-shrink-0 flex flex-col border-r select-none h-full transition-all duration-300 z-30 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
            } ${
              novelTheme === 'dark' || novelTheme === 'candle'
                ? 'bg-slate-950/90 border-slate-800/80 text-slate-200 backdrop-blur-2xl'
                : 'bg-parchment-100/95 border-amber-900/15 text-stone-900 backdrop-blur-xl'
            } absolute lg:relative inset-y-0 left-0 shadow-2xl lg:shadow-none`}
          >
            {/* 1. Header Card with Word Count Badge */}
            <div className="p-3.5 border-b border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
                      Cấu Trúc Tác Phẩm
                    </h3>
                    <p className="text-[10px] text-slate-400">Đồng bộ từ Google Docs</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-sm">
                    {totalNovelWords.toLocaleString()} từ
                  </span>
                </div>
              </div>

              {/* 2. Google Docs Live Sync Card */}
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-sky-950/30 to-slate-900/40 border border-emerald-500/30 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase font-mono">
                      Google Doc Live
                    </span>
                  </div>
                  <a
                    href={GOOGLE_DOCS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center space-x-1 hover:underline"
                    title="Mở Google Doc trên tab mới"
                  >
                    <span>Mở link gốc</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <button
                  onClick={() => onSyncGoogleDocs && onSyncGoogleDocs()}
                  disabled={isSyncingDoc}
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 active:scale-[0.98] border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-60 shadow-sm cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDoc ? 'animate-spin text-emerald-300' : 'text-emerald-400'}`} />
                  <span>{isSyncingDoc ? 'Đang lấy từ Google Doc...' : '🔄 Cập Nhật Live Từ Google Doc'}</span>
                </button>
                
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5 pt-0.5">
                  <span>Tự động kéo chương mới</span>
                  <span className="text-emerald-400/90 font-mono font-medium">
                    {parts.length} phần • {totalChaptersCount} chương
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Main Sections Tree (Mở đầu / Phần 1 / Phần 2 / Các chương) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
              {parts.map((part, pIdx) => {
                const isExpanded = expandedSections[part.id] !== false;
                const theme = getSectionTheme(part.title, part.id);

                return (
                  <div 
                    key={part.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded 
                        ? 'bg-slate-900/60 border-slate-700/60 shadow-lg shadow-black/20' 
                        : 'bg-slate-900/20 border-white/5 hover:border-white/15'
                    }`}
                  >
                    {/* Section Header */}
                    <div 
                      onClick={() => toggleSection(part.id)}
                      className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <span className="text-base flex-shrink-0">{theme.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-serif font-bold text-xs text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                              {part.title}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span>{part.chapters.length} chương</span>
                            <span>•</span>
                            <span className="font-mono text-slate-300">{part.wordCount.toLocaleString()} từ</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-1 text-slate-400 group-hover:text-slate-200 transition-colors">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* List of Chapters inside this Section */}
                    {isExpanded && (
                      <div className="p-1.5 space-y-1 bg-slate-950/60 border-t border-white/5">
                        {part.chapters.length === 0 ? (
                          <div className="p-3 text-center text-slate-500 text-xs italic">
                            Chưa có chương nào.
                          </div>
                        ) : (
                          part.chapters.map((chap, cIdx) => {
                            const isActive = part.id === selectedPartId && cIdx === activeChapterIndex;

                            return (
                              <div
                                key={chap.id}
                                onClick={() => {
                                  setSelectedPartId(part.id);
                                  setActiveChapterIndex(cIdx);
                                  scrollToTop();
                                  if (window.innerWidth < 1024) {
                                    setIsSidebarOpen(false);
                                  }
                                }}
                                className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                                  isActive
                                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/40 text-amber-100 shadow-md shadow-amber-500/10'
                                    : 'bg-slate-900/40 border-transparent hover:bg-white/5 text-slate-300 hover:border-white/10'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                                    isActive ? 'bg-amber-400 ring-4 ring-amber-500/20' : 'bg-slate-600 group-hover:bg-slate-400'
                                  }`} />

                                  <div className="min-w-0 flex-1">
                                    <h4 className={`font-serif font-medium text-xs leading-snug truncate ${
                                      isActive ? 'text-amber-200 font-bold' : 'text-slate-200 group-hover:text-white'
                                    }`}>
                                      {chap.title}
                                    </h4>
                                    {chap.povCharacterName && (
                                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                                        POV: {chap.povCharacterName} {chap.location ? `• ${chap.location}` : ''}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 flex-shrink-0 text-[10px] font-mono opacity-80 group-hover:opacity-100">
                                  <span className={isActive ? 'text-amber-300 font-semibold' : 'text-slate-400'}>
                                    {chap.wordCount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ================= RIGHT READING CONTENT AREA ================= */}
          <main 
            ref={scrollContainerRef} 
            className="flex-1 h-full overflow-y-auto custom-scrollbar relative px-4 sm:px-8 lg:px-12 py-8 transition-all duration-300"
          >
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumbs & Chapter Header (Clean Novel Style matching Hình 4) */}
              <div className="mb-8 pb-4 border-b border-black/10 dark:border-white/10">
                <nav className="flex items-center space-x-2 text-xs text-amber-500/80 mb-2 font-serif overflow-x-auto whitespace-nowrap">
                  <span onClick={() => goToChapterByGlobalIndex(0)} className="hover:text-amber-400 cursor-pointer opacity-70">
                    {project.title}
                  </span>
                  <span>›</span>
                  <span className="opacity-80">{activePart?.title}</span>
                  <span>›</span>
                  <span className="text-amber-400 font-semibold">{currentChapter?.title}</span>
                </nav>

                <div className="text-xs font-bold uppercase tracking-widest text-amber-400/90 font-serif mb-2">
                  {activePart?.title}
                </div>

                <h1 className={`text-2xl sm:text-4xl font-bold font-serif tracking-tight leading-tight mb-3 ${novelThemeClasses.text}`}>
                  {currentChapter?.title || 'Chương Chưa Đặt Tên'}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-75 font-mono text-slate-400">
                  <span>{totalWords.toLocaleString()} từ</span>
                  <span>•</span>
                  <span>Thời gian đọc: ~{estimatedReadTime} phút</span>
                  {currentChapter?.povCharacterName && (
                    <>
                      <span>•</span>
                      <span>POV: {currentChapter.povCharacterName}</span>
                    </>
                  )}
                  {currentChapter?.location && (
                    <>
                      <span>•</span>
                      <span>{currentChapter.location}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Prose Article (Nội dung truyện chữ) */}
              <article 
                className={`font-serif prose prose-lg max-w-none text-justify px-2 sm:px-4 py-4 rounded-2xl ${novelThemeClasses.container} ${novelThemeClasses.prose} shadow-sm`}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  fontFamily: fontFamily === 'serif' ? 'Merriweather, Georgia, serif' : fontFamily === 'sans' ? 'Inter, sans-serif' : 'monospace'
                }}
              >
                {currentChapter?.content ? (
                  currentChapter.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('“') || paragraph.startsWith('﻿“')) {
                      return (
                        <p key={pIdx} className="italic text-amber-400 font-medium pl-4 border-l-2 border-amber-500/50 my-6">
                          {paragraph}
                        </p>
                      );
                    }
                    if (paragraph.startsWith('—')) {
                      return (
                        <p key={pIdx} className="font-sans pl-2 my-3 text-slate-100 font-medium">
                          {paragraph}
                        </p>
                      );
                    }
                    return (
                      <p key={pIdx} className="indent-8 my-4 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })
                ) : (
                  <div className="text-center py-20 opacity-50">Chưa có nội dung trong chương này.</div>
                )}
              </article>

              {/* Clean Novel Navigation Footer (Previous Chapter / Next Chapter) */}
              <div className="mt-14 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  disabled={currentGlobalIndex <= 0}
                  onClick={() => goToChapterByGlobalIndex(currentGlobalIndex - 1)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200 font-serif text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-sans uppercase">Chương Trước</div>
                    <div className="font-medium truncate max-w-[200px]">
                      {currentGlobalIndex > 0 ? allFlatChapters[currentGlobalIndex - 1]?.chapter.title : 'Đầu danh sách'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={scrollToTop}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-amber-400 border border-white/10 hover:border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Cuộn lên đầu trang"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Lên đầu trang</span>
                </button>

                <button
                  disabled={currentGlobalIndex >= allFlatChapters.length - 1}
                  onClick={() => goToChapterByGlobalIndex(currentGlobalIndex + 1)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 disabled:pointer-events-none text-amber-200 font-serif text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm shadow-amber-500/10"
                >
                  <div className="text-right">
                    <div className="text-[10px] text-amber-400/80 font-sans uppercase">Chương Kế Tiếp</div>
                    <div className="font-medium truncate max-w-[200px]">
                      {currentGlobalIndex < allFlatChapters.length - 1 ? allFlatChapters[currentGlobalIndex + 1]?.chapter.title : 'Cuối danh sách'}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* ================= NETTRUYEN STYLE COMIC READER (COMING SOON) ================= */
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-6">
            {/* COMING SOON BANNER FOR COMIC */}
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-amber-950/30 border border-rose-500/30 text-center shadow-xl backdrop-blur-md">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider mb-2">
                Đang Chuẩn Bị Sản Xuất • Coming Soon
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white mb-2">
                Bản Truyện Tranh Webtoon Đang Trong Quá Trình Thực Hiện
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-4">
                Họa sĩ & tác giả đang tiến hành phân cảnh kịch bản và vẽ minh họa cho <strong className="text-amber-300">Long Ấn Ký</strong>. Mời bạn đón đọc bản Truyện Chữ đang sáng tác và phát hành trực tiếp!
              </p>
              <button
                onClick={() => { setReaderType('novel'); scrollToTop(); }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>👉 Đọc Bản Truyện Chữ Ngay Bây Giờ</span>
              </button>
            </div>
            {/* 1. TOP INFO & BREADCRUMBS (NETTRUYEN) */}
            <div className="mb-4 pb-3 border-b border-white/10">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-1.5 text-xs text-slate-400 mb-2 overflow-x-auto whitespace-nowrap">
                <span onClick={() => { setActiveComicIndex(0); scrollToTop(); }} className="hover:text-amber-400 cursor-pointer">
                  Trang chủ
                </span>
                <span>/</span>
                <span className="hover:text-amber-400 cursor-pointer">{project.title}</span>
                <span>/</span>
                <span className="text-rose-400 font-semibold">{activeComic.title.split(':')[0]}</span>
              </nav>

              {/* Chapter Main Title */}
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                {project.title} - <span className="text-amber-300">{activeComic.title}</span>
              </h1>

              {/* Updated timestamp */}
              <p className="text-xs text-slate-400 italic mt-1">
                [Ngày cập nhật: {project.updatedAt || 'Mới nhất'}]
              </p>
            </div>

            {/* 2. READING CONTROL BOX (NETTRUYEN) */}
            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-md">
              {/* Keyboard shortcut hint alert */}
              <div className="bg-sky-500/10 border border-sky-500/25 text-sky-200 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Sử dụng mũi tên trái (←) hoặc phải (→) trên bàn phím để chuyển chapter</span>
              </div>

              {/* Chapter Navigation Buttons & Select */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setActiveComicIndex(0);
                    scrollToTop();
                  }}
                  title="Trang chủ / Chapter đầu"
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-all cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                </button>

                <button
                  disabled={activeComicIndex <= 0}
                  onClick={() => {
                    setActiveComicIndex(prev => Math.max(0, prev - 1));
                    scrollToTop();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Chap trước</span>
                </button>

                {/* Select Chapter Dropdown */}
                <select
                  value={activeComicIndex}
                  onChange={e => {
                    setActiveComicIndex(Number(e.target.value));
                    scrollToTop();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-white/20 text-white font-medium text-xs focus:ring-2 focus:ring-rose-500 outline-none max-w-[260px] sm:max-w-xs truncate cursor-pointer shadow-sm"
                >
                  {comicChapters.map((c, idx) => (
                    <option key={c.id} value={idx}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <button
                  disabled={activeComicIndex >= comicChapters.length - 1}
                  onClick={() => {
                    setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
                    scrollToTop();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <span>Chap sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. READING DETAIL: SEAMLESS VERTICAL COMIC STREAM (NETTRUYEN) */}
            <div className="reading-detail w-full flex flex-col items-center select-none space-y-1">
              {allPanels.map((panel, idx) => {
                const imgUrl = panel.imageUrl || (panel.prompt ? AIStudioService.generatePanelImageUrl(panel.prompt, activeArtStyle, panel.panelNumber * 7) : null);
                return (
                  <div key={panel.id || idx} className="page-chapter w-full max-w-3xl relative flex flex-col items-center">
                    {/* Comic Image */}
                    <div className="relative w-full bg-slate-950 overflow-hidden shadow-2xl rounded-sm">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={panel.caption || `Trang ${idx + 1}`}
                          className="w-full h-auto block select-none pointer-events-auto object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                      ) : (
                        <div className="p-12 text-center text-slate-500 text-xs">
                          Đang tải trang tranh...
                        </div>
                      )}

                      {/* SFX Graphic Badge (Sound Effect) */}
                      {panel.sfx && (
                        <div className="absolute top-4 right-4 bg-rose-600/90 text-white font-black italic tracking-widest text-xs px-3 py-1 rounded shadow-lg transform rotate-2 border border-rose-400 pointer-events-none">
                          {panel.sfx}
                        </div>
                      )}

                      {/* Page Number Indicator */}
                      <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-[10px] text-white/80 font-mono px-2 py-0.5 rounded pointer-events-none">
                        Trang {idx + 1} / {allPanels.length}
                      </div>
                    </div>

                    {/* Dialogues directly under panel */}
                    {panel.dialogues && panel.dialogues.length > 0 && (
                      <div className="w-full px-4 py-2.5 space-y-1.5 bg-slate-950/95 border-b border-white/5">
                        {panel.dialogues.map(d => (
                          <div
                            key={d.id}
                            className={`flex items-start gap-2.5 text-xs ${
                              d.bubbleType === 'shout' ? 'text-rose-300 font-bold' : d.bubbleType === 'thought' ? 'italic text-sky-300' : 'text-slate-200'
                            }`}
                          >
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300 shrink-0 font-serif">
                              {d.character}
                            </span>
                            <div className="text-xs bg-slate-800/80 p-2 rounded-xl border border-white/10 flex-1 leading-relaxed">
                              {d.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Caption */}
                    {panel.caption && (
                      <div className="w-full text-center text-xs text-slate-400 font-serif italic py-1.5 bg-black/40 border-b border-white/5">
                        {panel.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 4. CHAPTER NAV BOTTOM (NETTRUYEN) */}
            <div className="chapter-nav-bottom flex flex-wrap items-center justify-center gap-2 py-8 border-t border-white/10 mt-8">
              <button
                disabled={activeComicIndex <= 0}
                onClick={() => {
                  setActiveComicIndex(prev => Math.max(0, prev - 1));
                  scrollToTop();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Chap trước</span>
              </button>

              <select
                value={activeComicIndex}
                onChange={e => {
                  setActiveComicIndex(Number(e.target.value));
                  scrollToTop();
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-white/20 text-white font-medium text-xs focus:ring-2 focus:ring-rose-500 outline-none max-w-[260px] sm:max-w-xs truncate cursor-pointer shadow-sm"
              >
                {comicChapters.map((c, idx) => (
                  <option key={c.id} value={idx}>
                    {c.title}
                  </option>
                ))}
              </select>

              <button
                disabled={activeComicIndex >= comicChapters.length - 1}
                onClick={() => {
                  setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
                  scrollToTop();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                <span>Chap sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToTop}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
                title="Cuộn lên đầu trang"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Đầu trang</span>
              </button>
            </div>

            {/* 5. FLOATING QUICK SWITCH BAR */}
            <div className="sticky bottom-4 z-40 mx-auto px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2 text-xs w-fit">
              <button
                disabled={activeComicIndex <= 0}
                onClick={() => {
                  setActiveComicIndex(prev => Math.max(0, prev - 1));
                  scrollToTop();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white font-medium flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Trước
              </button>

              <select
                value={activeComicIndex}
                onChange={e => {
                  setActiveComicIndex(Number(e.target.value));
                  scrollToTop();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium text-xs max-w-[140px] sm:max-w-[200px] truncate"
              >
                {comicChapters.map((c, idx) => (
                  <option key={c.id} value={idx}>
                    {c.title}
                  </option>
                ))}
              </select>

              <button
                disabled={activeComicIndex >= comicChapters.length - 1}
                onClick={() => {
                  setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
                  scrollToTop();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white font-medium flex items-center gap-1"
              >
                Sau <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={scrollToTop}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Lên đầu trang"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PANEL LIGHTBOX MODAL ================= */}
      {selectedPanel && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPanel(null)}
        >
          <div 
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-rose-500/30 shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-400" />
                Ô Tranh Số {selectedPanel.panelNumber} • {selectedPanel.cameraAngle || 'Góc máy'}
              </h3>
              <button
                onClick={() => setSelectedPanel(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                Đóng
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {(() => {
                const imgUrl = selectedPanel.imageUrl || (selectedPanel.prompt ? AIStudioService.generatePanelImageUrl(selectedPanel.prompt, activeArtStyle, selectedPanel.panelNumber * 7) : null);
                return imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={selectedPanel.caption || 'Panel'}
                    className="max-h-[65vh] w-auto object-contain"
                  />
                ) : (
                  <div className="text-slate-500">Chưa có ảnh</div>
                );
              })()}
            </div>

            <div className="p-4 space-y-3 bg-slate-950 text-xs">
              {selectedPanel.caption && (
                <p className="text-slate-300 font-serif italic">
                  📝 Dẫn truyện: {selectedPanel.caption}
                </p>
              )}
              {selectedPanel.prompt && (
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 font-mono text-[11px] text-amber-300/80">
                  <span className="font-bold text-amber-400">Prompt AI: </span>
                  {selectedPanel.prompt}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= COMIC SCRIPT CREATOR MODAL ================= */}
      {showPanelCreator && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 rounded-2xl border border-rose-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                Tạo Truyện Tranh Từ Đoạn Văn Tiểu Thuyết
              </h3>
              <button
                onClick={() => setShowPanelCreator(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/10"
              >
                Hủy
              </button>
            </div>

            <p className="text-xs text-slate-300">
              AI sẽ phân tích văn bản thành các khung tranh (panels), xây dựng góc máy, lời thoại bóng nước và tạo ảnh minh họa trực quan.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Đoạn văn muốn chuyển thể (Mặc định lấy từ chương đang đọc):
              </label>
              <textarea
                value={customSnippet || (currentChapter?.content ? currentChapter.content.slice(0, 800) : '')}
                onChange={e => setCustomSnippet(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-serif"
                placeholder="Dán đoạn văn tiểu thuyết cần vẽ truyện tranh vào đây..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Phong cách đồ họa (Art Style):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'dark_webtoon', label: 'Dark Webtoon (Manhwa)' },
                  { id: 'manga_shonen', label: 'Manga Shonen (Trắng đen)' },
                  { id: 'pixel_art', label: 'Pixel Art Á Đông (Game Soul Seal)' },
                  { id: 'anime_watercolor', label: 'Anime Thủy Mặc' },
                  { id: 'cinematic', label: 'Cinematic Concept Art' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setActiveArtStyle(style.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      activeArtStyle === style.id
                        ? 'bg-rose-500/25 border-rose-500 text-rose-300 font-bold'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowPanelCreator(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Đóng
              </button>
              <button
                disabled={isGeneratingComic}
                onClick={handleGenerateComicFromCurrentChapter}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-500/30 hover:opacity-90 disabled:opacity-50"
              >
                {isGeneratingComic ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang phân cảnh & sinh ảnh...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tạo Phân Cảnh & Minh Họa Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

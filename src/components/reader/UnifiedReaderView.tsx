import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Palette, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  Eye, 
  Image as ImageIcon, 
  Maximize2, 
  Download, 
  Share2, 
  Settings2, 
  Layers, 
  MessageSquare, 
  RefreshCw,
  Sliders,
  Type,
  ZoomIn,
  BookMarked
} from 'lucide-react';
import { Project, Part, Chapter, ComicChapter, ComicPanel, ComicReadingMode, AISettings } from '../../types';
import { sampleComicChapters } from '../../data/googleData';
import { AIStudioService, ComicScriptResult } from '../../services/aiStudioService';

interface UnifiedReaderViewProps {
  project: Project;
  parts: Part[];
  isWarmTheme: boolean;
  aiSettings: AISettings;
  onOpenAIHub?: () => void;
  comicChapters?: ComicChapter[];
  isAuthorMode?: boolean;
  onOpenComicUploader?: () => void;
}

type ReaderType = 'novel' | 'comic';
type NovelTheme = 'dark' | 'sepia' | 'candle' | 'paper';
type PageLayoutMode = 'scroll' | 'paginated';

export const UnifiedReaderView: React.FC<UnifiedReaderViewProps> = ({
  project,
  parts,
  isWarmTheme,
  aiSettings,
  onOpenAIHub,
  comicChapters: propsComicChapters,
  isAuthorMode = false,
  onOpenComicUploader
}) => {
  // Mode selection: Novel (Truyện chữ) vs Comic (Truyện tranh)
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

  const activePart = parts.find(p => p.id === selectedPartId) || parts[0];
  const chapters = activePart?.chapters || [];
  const currentChapter: Chapter | undefined = chapters[activeChapterIndex] || chapters[0];
  const activeComic = comicChapters[activeComicIndex] || comicChapters[0];

  const totalWords = currentChapter?.wordCount || 0;
  const estimatedReadTime = Math.max(1, Math.ceil(totalWords / 220));

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
        {/* Left: Switcher between Novel & Comic */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-black/20 dark:bg-slate-900/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setReaderType('novel')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                readerType === 'novel'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'opacity-70 hover:opacity-100 text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Truyện Chữ (Novel)</span>
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
              <span>Truyện Tranh (Comic & Webtoon)</span>
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

            {/* Convert to Comic Trigger */}
            <button
              onClick={() => setShowPanelCreator(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-rose-300 border border-rose-500/30 shadow-sm"
              title="Dùng AI phân cảnh đoạn văn thành truyện tranh và sinh ảnh"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Biến thành Truyện Tranh AI</span>
            </button>
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

            <button
              onClick={() => setShowPanelCreator(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tạo Hồi Mới</span>
            </button>
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
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {readerType === 'novel' ? (
          /* ================= NOVEL READER MODE ================= */
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 transition-all duration-300">
            {/* Header / Chapter Title Info */}
            <div className="text-center mb-10 pb-8 border-b border-black/10 dark:border-white/10">
              <span className="text-xs font-mono tracking-widest uppercase opacity-60">
                {activePart.title}
              </span>
              <h1 className={`font-serif text-2xl sm:text-4xl font-bold mt-2 mb-3 tracking-tight ${novelThemeClasses.text}`}>
                {currentChapter?.title || 'Chương Chưa Đặt Tên'}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-xs opacity-70 font-mono">
                <span>POV: {currentChapter?.povCharacterName || 'Toàn tri'}</span>
                <span>•</span>
                <span>{currentChapter?.location || 'Chưa định vị'}</span>
                <span>•</span>
                <span>{totalWords.toLocaleString()} từ (~{estimatedReadTime} phút)</span>
              </div>
            </div>

            {/* Prose Content */}
            <article 
              className={`font-serif prose prose-lg max-w-none text-justify ${novelThemeClasses.prose}`}
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
                      <p key={pIdx} className="italic text-amber-400/90 font-medium pl-4 border-l-2 border-amber-500/50 my-6">
                        {paragraph}
                      </p>
                    );
                  }
                  if (paragraph.startsWith('—')) {
                    return (
                      <p key={pIdx} className="font-sans pl-2 my-3 text-slate-100 dark:text-slate-100 font-medium">
                        {paragraph}
                      </p>
                    );
                  }
                  return (
                    <p key={pIdx} className="indent-8 my-4">
                      {paragraph}
                    </p>
                  );
                })
              ) : (
                <div className="text-center py-20 opacity-50">Chưa có nội dung trong chương này.</div>
              )}
            </article>

            {/* Bottom Chapter Navigation */}
            <div className="mt-14 pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <button
                disabled={activeChapterIndex <= 0}
                onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-black/10 dark:bg-white/5 hover:bg-black/20 disabled:opacity-30 disabled:pointer-events-none text-sm font-serif"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Chương Trước</span>
              </button>

              <span className="text-xs font-mono opacity-60">
                {activeChapterIndex + 1} / {chapters.length} chương
              </span>

              <button
                disabled={activeChapterIndex >= chapters.length - 1}
                onClick={() => setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 disabled:opacity-30 disabled:pointer-events-none text-sm font-serif"
              >
                <span>Chương Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ================= COMIC & WEBTOON READER MODE ================= */
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Comic Header Info */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-rose-950/40 border border-rose-500/20 flex flex-col md:flex-row items-center gap-6">
              {activeComic.coverUrl && (
                <img
                  src={activeComic.coverUrl}
                  alt={activeComic.title}
                  className="w-32 h-44 object-cover rounded-xl shadow-2xl border border-white/10"
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono font-medium border border-rose-500/30">
                  {comicMode === 'webtoon' ? 'Webtoon Scroll Format' : 'Manga Panels Format'}
                </span>
                <h2 className="text-2xl font-bold font-serif text-white mt-2 mb-1">
                  {activeComic.title}
                </h2>
                <p className="text-xs text-rose-200/70 mb-4">
                  {activeComic.subtitle}
                </p>

                {/* Chapter pills */}
                <div className="flex flex-wrap gap-2">
                  {comicChapters.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveComicIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeComicIndex === idx
                          ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {c.title.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comic Panels Flow */}
            <div className="space-y-8">
              {activeComic.pages.map(page => (
                <div key={page.id} className="space-y-6">
                  {page.title && (
                    <div className="flex items-center space-x-3 my-4">
                      <div className="h-px bg-rose-500/30 flex-1"></div>
                      <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold px-3 py-1 bg-rose-950/40 rounded-full border border-rose-500/30">
                        {page.title}
                      </span>
                      <div className="h-px bg-rose-500/30 flex-1"></div>
                    </div>
                  )}

                  <div className={`grid gap-6 ${comicMode === 'webtoon' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {page.panels.map(panel => (
                      <div
                        key={panel.id}
                        onClick={() => setSelectedPanel(panel)}
                        className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/90 shadow-2xl transition-all hover:border-rose-500/50 cursor-pointer ${
                          panel.widthSpan === 'full' ? 'md:col-span-2' : ''
                        }`}
                      >
                        {/* Panel Image Container */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                          {panel.imageUrl ? (
                            <img
                              src={panel.imageUrl}
                              alt={panel.caption || `Panel ${panel.panelNumber}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-center p-6 text-slate-500">
                              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                              <p className="text-xs">Chưa tạo hình ảnh panel này</p>
                            </div>
                          )}

                          {/* SFX Graphic Badge (Sound Effect) */}
                          {panel.sfx && (
                            <div className="absolute top-4 right-4 bg-rose-600/90 text-white font-black italic tracking-widest text-xs px-3 py-1 rounded shadow-lg transform rotate-2 border border-rose-400 animate-pulse pointer-events-none">
                              {panel.sfx}
                            </div>
                          )}

                          {/* Camera Angle Tag */}
                          {panel.cameraAngle && (
                            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-[10px] text-amber-300 font-mono px-2 py-0.5 rounded border border-white/10 pointer-events-none">
                              🎥 {panel.cameraAngle}
                            </div>
                          )}

                          {/* Quick Zoom Trigger */}
                          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md">
                            <ZoomIn className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Speech Bubbles & Dialogues */}
                        {panel.dialogues && panel.dialogues.length > 0 && (
                          <div className="p-4 space-y-2 bg-gradient-to-b from-slate-950/90 to-slate-900/95 border-t border-white/5">
                            {panel.dialogues.map(d => (
                              <div
                                key={d.id}
                                className={`flex items-start gap-2.5 ${
                                  d.bubbleType === 'shout' ? 'text-rose-300 font-bold' : d.bubbleType === 'thought' ? 'italic text-sky-300' : 'text-slate-200'
                                }`}
                              >
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300 shrink-0 font-serif">
                                  {d.character}
                                </span>
                                <div className="text-xs bg-slate-800/80 p-2.5 rounded-xl border border-white/10 flex-1 relative">
                                  {d.text}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Caption bottom bar */}
                        {panel.caption && (
                          <div className="px-4 py-2.5 bg-black/40 text-[11px] text-slate-400 font-serif border-t border-white/5 italic">
                            {panel.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
              {selectedPanel.imageUrl ? (
                <img
                  src={selectedPanel.imageUrl}
                  alt={selectedPanel.caption || 'Panel'}
                  className="max-h-[65vh] w-auto object-contain"
                />
              ) : (
                <div className="text-slate-500">Chưa có ảnh</div>
              )}
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

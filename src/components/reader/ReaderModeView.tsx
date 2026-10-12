import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Palette, 
  Bookmark,
  Share2,
  FileText
} from 'lucide-react';
import { Project, Part, Chapter } from '../../types';

interface ReaderModeViewProps {
  project: Project;
  parts: Part[];
  isWarmTheme: boolean;
}

type ReaderTheme = 'dark' | 'sepia' | 'light';

export const ReaderModeView: React.FC<ReaderModeViewProps> = ({
  project,
  parts,
  isWarmTheme
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>(parts[1]?.id || parts[0]?.id || '');
  const [fontSize, setFontSize] = useState<number>(19);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>(isWarmTheme ? 'sepia' : 'dark');
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  const activePart = parts.find(p => p.id === selectedPartId) || parts[0];
  const chapters = activePart?.chapters || [];
  const currentChapter: Chapter | undefined = chapters[activeChapterIndex] || chapters[0];

  const totalWords = activePart?.wordCount || 0;
  const estimatedReadTime = Math.max(1, Math.ceil(totalWords / 220));

  // Theme styling definitions
  const themeStyles = {
    dark: {
      bg: 'bg-[#080c16]',
      text: 'text-slate-100',
      prose: 'text-slate-200 selection:bg-amber-500/30 selection:text-amber-100',
      headerBg: 'bg-slate-950/80 border-slate-800/80',
      cardBg: 'bg-slate-900/40 border-white/5',
      accent: 'text-amber-400'
    },
    sepia: {
      bg: 'bg-[#f6f1e7]',
      text: 'text-stone-900',
      prose: 'text-stone-900 selection:bg-amber-300 selection:text-stone-950',
      headerBg: 'bg-[#ede5d5]/90 border-amber-900/15',
      cardBg: 'bg-[#fbf9f4] border-amber-900/10 shadow-sm',
      accent: 'text-amber-800'
    },
    light: {
      bg: 'bg-[#ffffff]',
      text: 'text-gray-900',
      prose: 'text-gray-900 selection:bg-blue-100 selection:text-blue-900',
      headerBg: 'bg-gray-50/90 border-gray-200',
      cardBg: 'bg-white border-gray-200 shadow-sm',
      accent: 'text-blue-600'
    }
  }[readerTheme];

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none transition-colors duration-200 ${themeStyles.bg} ${themeStyles.text}`}>
      {/* Top Reader Toolbar */}
      <div className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl z-20 ${themeStyles.headerBg}`}>
        {/* Title & Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base tracking-tight flex items-center gap-2">
              Chế Độ Đọc Sách
              <span className="text-[10px] px-2 py-0.5 rounded-full font-sans font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Immersive Reader
              </span>
            </h2>
            <p className="text-[11px] opacity-60 font-mono">
              {project.title} • {totalWords.toLocaleString()} từ • ~{estimatedReadTime} phút đọc
            </p>
          </div>
        </div>

        {/* Middle: Part Selection Pills */}
        <div className="flex items-center space-x-1.5 bg-black/10 dark:bg-slate-900/60 p-1 rounded-xl border border-white/5">
          {parts.map(p => {
            const isSelected = selectedPartId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPartId(p.id);
                  setActiveChapterIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all ${
                  isSelected
                    ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                    : 'opacity-70 hover:opacity-100 text-slate-300 hover:bg-white/5'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Right: Reading Controls (Font Size, Theme, Quick Jump) */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Font Resizer */}
          <div className="flex items-center space-x-1 bg-black/10 dark:bg-slate-900/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setFontSize(prev => Math.max(16, prev - 1))}
              title="Giảm cỡ chữ"
              className="p-1.5 rounded-lg hover:bg-white/10 opacity-80 hover:opacity-100"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1.5">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
              title="Tăng cỡ chữ"
              className="p-1.5 rounded-lg hover:bg-white/10 opacity-80 hover:opacity-100"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Switcher Pills */}
          <div className="flex items-center space-x-1 bg-black/10 dark:bg-slate-900/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setReaderTheme('dark')}
              className={`w-5 h-5 rounded-full bg-[#080c16] border transition-all ${
                readerTheme === 'dark' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-700'
              }`}
              title="Chủ đề: Đêm Obsidian"
            />
            <button
              onClick={() => setReaderTheme('sepia')}
              className={`w-5 h-5 rounded-full bg-[#f6f1e7] border transition-all ${
                readerTheme === 'sepia' ? 'border-amber-600 ring-2 ring-amber-600/30' : 'border-stone-400'
              }`}
              title="Chủ đề: Giấy Cũ Sepia"
            />
            <button
              onClick={() => setReaderTheme('light')}
              className={`w-5 h-5 rounded-full bg-[#ffffff] border transition-all ${
                readerTheme === 'light' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-300'
              }`}
              title="Chủ đề: Trắng Tinh Khiết"
            />
          </div>
        </div>
      </div>

      {/* Main Full-Width Reading Stage */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 flex justify-center">
        <div className="w-full max-w-3xl space-y-12 pb-24">
          {/* Elegant Book Header */}
          <div className="text-center space-y-3 pb-8 border-b border-black/10 dark:border-white/10 select-none">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block">
              {project.genre}
            </span>
            <h1 className="font-serif font-black text-3xl md:text-5xl tracking-tight leading-tight">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-sm italic font-serif opacity-75">{project.subtitle}</p>
            )}
            <div className="pt-2 flex items-center justify-center space-x-4 text-xs font-mono opacity-60">
              <span>Tác giả: <strong className="font-serif">{project.penName}</strong></span>
              <span>•</span>
              <span>Tổng số từ: {project.currentWordCount.toLocaleString()} từ</span>
            </div>
          </div>

          {/* Chapters of Selected Part */}
          {chapters.length === 0 ? (
            <div className="text-center py-16 opacity-50 italic">
              Chưa có chương nào trong phần này.
            </div>
          ) : (
            chapters.map((chap, cIdx) => (
              <article key={chap.id} className="space-y-6 pt-6">
                {/* Chapter Title & Divider */}
                <div className="text-center space-y-2 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-500/80 block">
                    {activePart.title}
                  </span>
                  <h2 className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-amber-400 dark:text-amber-300">
                    {chap.title}
                  </h2>
                  <div className="flex items-center justify-center space-x-2 text-xs font-mono opacity-50 pt-1">
                    <span>{chap.wordCount.toLocaleString()} từ</span>
                    {chap.povCharacterName && (
                      <>
                        <span>•</span>
                        <span>POV: {chap.povCharacterName}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-center pt-2 text-amber-500/40">
                    <span>❖ ❖ ❖</span>
                  </div>
                </div>

                {/* Chapter Prose Content */}
                <div 
                  style={{ fontSize: `${fontSize}px` }}
                  className={`font-serif leading-[2.15] tracking-wide whitespace-pre-wrap ${themeStyles.prose}`}
                >
                  {chap.content || (chap.scenes || []).map(s => s.content).join('\n\n')}
                </div>

                {/* Chapter End Divider */}
                {cIdx < chapters.length - 1 && (
                  <div className="pt-12 pb-6 flex items-center justify-center text-amber-500/30">
                    <div className="w-24 border-t border-current"></div>
                    <span className="px-3 text-xs">❦</span>
                    <div className="w-24 border-t border-current"></div>
                  </div>
                )}
              </article>
            ))
          )}

          {/* Book Bottom Signoff */}
          <div className="text-center pt-16 pb-8 border-t border-black/10 dark:border-white/10 space-y-2 opacity-60 text-xs font-serif">
            <p>— Hết phần {activePart.title} —</p>
            <p className="font-mono text-[10px]">Mạch Novel Studio • {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Plus, 
  FolderPlus, 
  Trash2, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Scroll,
  Clock,
  Flame,
  Feather,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Part, Chapter } from '../../types';
import { WritingPrinciplesModal } from './WritingPrinciplesModal';
import { GOOGLE_DOCS_URL } from '../../data/googleData';

interface OutlineNavProps {
  parts: Part[];
  activeChapterId?: string;
  activePartId?: string;
  onSelectChapter: (chapterId: string, partId: string) => void;
  onAddPart: () => void;
  onAddChapter: (partId: string) => void;
  onDeleteChapter?: (chapterId: string, partId: string) => void;
  isWarmTheme: boolean;
  onSyncGoogleDocs?: () => void;
  isSyncingDoc?: boolean;
}

export const OutlineNav: React.FC<OutlineNavProps> = ({
  parts,
  activeChapterId,
  activePartId,
  onSelectChapter,
  onAddPart,
  onAddChapter,
  isWarmTheme,
  onSyncGoogleDocs,
  isSyncingDoc = false
}) => {
  // Mặc định mở rộng tất cả các phần Google Docs
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    part_mua_nuoc_dung: true,
    part_aesvorn_arc: true
  });

  const [showPrinciplesModal, setShowPrinciplesModal] = useState(false);

  const toggleSection = (partId: string) => {
    setExpandedSections(prev => {
      const isCurrentlyExpanded = prev[partId] !== undefined ? prev[partId] : true;
      return {
        ...prev,
        [partId]: !isCurrentlyExpanded
      };
    });
  };

  const totalWords = parts.reduce((acc, p) => acc + p.wordCount, 0);

  const getSectionTheme = (title: string, partId: string) => {
    const t = title.toLowerCase();
    if (t.includes('mùa nước đứng') || partId.includes('mua_nuoc_dung') || t.includes('phần i')) {
      return {
        icon: '🌊',
        badge: 'MÙA NƯỚC ĐỨNG',
        color: 'from-amber-500/20 to-sky-500/10 border-amber-500/30 text-amber-300',
        activeGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
      };
    }
    if (t.includes('bản cũ') || t.includes('aesvorn') || partId.includes('aesvorn') || t.includes('phần ii')) {
      return {
        icon: '🏛️',
        badge: 'BẢN CŨ AESVORN',
        color: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-300',
        activeGlow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]'
      };
    }
    if (t.includes('mở đầu') || partId.includes('prologue')) {
      return {
        icon: '📜',
        badge: 'MỞ ĐẦU',
        color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
        activeGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
      };
    }
    return {
      icon: '📁',
      badge: 'PHẦN TRUYỆN',
      color: 'from-slate-800/40 to-slate-900/40 border-slate-700/40 text-slate-300',
      activeGlow: ''
    };
  };

  return (
    <aside className={`w-80 flex-shrink-0 flex flex-col border-r select-none h-full transition-colors relative z-10 ${
      isWarmTheme 
        ? 'bg-parchment-100/95 border-amber-900/15 text-stone-900 backdrop-blur-xl' 
        : 'bg-slate-950/80 border-slate-800/80 text-slate-200 backdrop-blur-2xl'
    }`}>
      {/* Top Header */}
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
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              {totalWords.toLocaleString()} từ
            </span>
          </div>
        </div>

        {/* Google Docs Live Sync Card */}
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
            onClick={onSyncGoogleDocs}
            disabled={isSyncingDoc}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 active:scale-[0.98] border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-60 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDoc ? 'animate-spin text-emerald-300' : 'text-emerald-400'}`} />
            <span>{isSyncingDoc ? 'Đang lấy từ Google Doc...' : '🔄 Cập Nhật Live Từ Google Doc'}</span>
          </button>
          
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5 pt-0.5">
            <span>Tự động kéo chương mới</span>
            <span className="text-emerald-400/90 font-mono font-medium">{parts.length} phần • {parts.reduce((s, p) => s + p.chapters.length, 0)} chương</span>
          </div>
        </div>

        {/* AI Writing Principles Banner Button */}
        <button
          onClick={() => setShowPrinciplesModal(true)}
          className="w-full group py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 hover:from-amber-500/25 hover:to-rose-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between transition-all shadow-sm hover:shadow-amber-500/10"
        >
          <div className="flex items-center space-x-2">
            <Scroll className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-serif text-xs">Nguyên Tắc Viết Cho AI</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono">
            Đang áp dụng ✓
          </span>
        </button>
      </div>

      {/* Main Sections Tree (Mở đầu / Các chương / Phần kết) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
              {/* Section Header (Clickable to toggle expansion) */}
              <div 
                onClick={() => toggleSection(part.id)}
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none group"
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{theme.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                        {part.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span>{part.chapters.length} chương</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{part.wordCount.toLocaleString()} từ</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddChapter(part.id);
                    }}
                    title="Thêm chương mới vào phần này"
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-1 text-slate-400 group-hover:text-slate-200 transition-colors">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* List of Chapters inside this Section */}
              {isExpanded && (
                <div className="p-1.5 space-y-1 bg-slate-950/60 border-t border-white/5">
                  {part.chapters.length === 0 ? (
                    <div className="p-3 text-center text-slate-500 text-xs italic">
                      Chưa có chương nào. Bấm dấu + để thêm chương.
                    </div>
                  ) : (
                    part.chapters.map((chap, cIdx) => {
                      const isActive = chap.id === activeChapterId;

                      return (
                        <div
                          key={chap.id}
                          onClick={() => onSelectChapter(chap.id, part.id)}
                          className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/40 text-amber-100 shadow-md shadow-amber-500/5'
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

                          <div className="flex items-center space-x-2 flex-shrink-0 text-[11px] font-mono opacity-80 group-hover:opacity-100">
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

      {/* Footer Add Part Button */}
      <div className="p-3 border-t border-white/5 bg-slate-950/40">
        <button
          onClick={onAddPart}
          className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-white/10 hover:border-amber-500/30 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
        >
          <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
          <span>Thêm Phần Truyện Mới</span>
        </button>
      </div>

      {/* Writing Principles Modal */}
      {showPrinciplesModal && (
        <WritingPrinciplesModal onClose={() => setShowPrinciplesModal(false)} />
      )}
    </aside>
  );
};

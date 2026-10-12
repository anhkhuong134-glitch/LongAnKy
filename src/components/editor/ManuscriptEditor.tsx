import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ShieldAlert, 
  FileCheck2, 
  Clock, 
  History, 
  StickyNote, 
  Zap, 
  Wand2, 
  Flame, 
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Feather,
  Eye,
  Sliders,
  CloudUpload,
  BookOpenCheck,
  Palette
} from 'lucide-react';
import { Chapter, Character, ComicChapter } from '../../types';
import { GoogleDocPushModal } from './GoogleDocPushModal';
import { ComicUploader } from './ComicUploader';

interface ManuscriptEditorProps {
  chapter: Chapter;
  partTitle: string;
  characters: Character[];
  chapters?: Chapter[];
  comicChapters?: ComicChapter[];
  onSaveComicChapters?: (updated: ComicChapter[]) => void;
  onPreviewInReader?: () => void;
  onUpdateContent: (newContent: string) => void;
  onUpdateMetadata: (updatedChapter: Partial<Chapter>) => void;
  onRequestAI: (role: any, prompt: string, options?: any) => void;
  onRequestFactExtraction: () => void;
  onAuditLogic: () => void;
  isWarmTheme: boolean;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
}

export const ManuscriptEditor: React.FC<ManuscriptEditorProps> = ({
  chapter,
  partTitle,
  characters,
  chapters = [],
  comicChapters = [],
  onSaveComicChapters,
  onPreviewInReader,
  onUpdateContent,
  onUpdateMetadata,
  onRequestAI,
  onRequestFactExtraction,
  onAuditLogic,
  isWarmTheme,
  isFocusMode,
  setIsFocusMode
}) => {
  const [editorMode, setEditorMode] = useState<'prose' | 'comic'>('prose');
  const [showNotes, setShowNotes] = useState(false);
  const [showMetadataDrawer, setShowMetadataDrawer] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showGoogleDocModal, setShowGoogleDocModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [fontSize, setFontSize] = useState<number>(18);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Word count & read time calculations
  const words = chapter.content ? chapter.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = chapter.content ? chapter.content.length : 0;
  const readMinutes = Math.max(1, Math.ceil(words / 220));

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaveStatus('saving');
    onUpdateContent(e.target.value);
    setTimeout(() => setSaveStatus('saved'), 350);
  };

  const handleRevertVersion = (verContent: string) => {
    if (window.confirm('Bạn có chắc muốn khôi phục bản lưu này không?')) {
      onUpdateContent(verContent);
      setShowVersions(false);
    }
  };

  return (
    <main className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 relative ${
      isFocusMode 
        ? 'bg-[#060910] text-slate-100 z-50 fixed inset-0' 
        : isWarmTheme 
          ? 'bg-parchment-50 text-stone-900' 
          : 'bg-[#080c16] text-slate-100'
    }`}>
      {/* Ambient Top Chapter Bar */}
      <div className={`px-6 py-3 border-b flex items-center justify-between flex-shrink-0 select-none backdrop-blur-xl ${
        isWarmTheme 
          ? 'border-amber-900/10 bg-parchment-100/60' 
          : 'border-slate-800/80 bg-slate-950/60'
      }`}>
        <div className="flex items-center space-x-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center space-x-2 text-[11px] opacity-60 font-mono">
              <span className="truncate text-amber-400 font-semibold">{partTitle}</span>
              <span>›</span>
              <span className="truncate">{chapter.title}</span>
            </div>

            <div className="flex items-center space-x-2 mt-0.5">
              <input
                type="text"
                value={chapter.title}
                onChange={(e) => onUpdateMetadata({ title: e.target.value })}
                className="font-serif font-bold text-lg md:text-xl bg-transparent border-b border-transparent hover:border-amber-500/30 focus:border-amber-500 focus:outline-none transition-colors truncate text-slate-100"
              />

              <button
                onClick={() => setShowMetadataDrawer(!showMetadataDrawer)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <span>POV: {chapter.povCharacterName || 'Tác giả'}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher: Soạn Truyện Chữ vs Up Truyện Tranh */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium space-x-1 ml-4 flex-shrink-0">
            <button
              onClick={() => setEditorMode('prose')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                editorMode === 'prose'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Feather className="w-3.5 h-3.5 text-amber-400" />
              <span>Soạn Truyện Chữ</span>
            </button>
            <button
              onClick={() => setEditorMode('comic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                editorMode === 'comic'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span>Up Truyện Tranh</span>
            </button>
          </div>
        </div>

        {/* Right Metrics & Quick Toggles */}
        <div className="flex items-center space-x-3">
          {/* Live Metric Badges */}
          <div className="hidden sm:flex items-center space-x-2.5 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {saveStatus === 'saved' ? 'Đã lưu' : 'Đang lưu...'}
            </span>

            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
              {words.toLocaleString()} từ
            </span>

            <span className="opacity-60 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~{readMinutes} phút đọc
            </span>
          </div>

          {/* History Versions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowVersions(!showVersions)}
              title="Lịch sử các phiên bản"
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 transition-all text-xs flex items-center gap-1 text-slate-300"
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline font-mono">({chapter.versions?.length || 0})</span>
            </button>

            {showVersions && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3.5 z-50 text-xs">
                <h4 className="font-serif font-bold text-slate-200 mb-2 flex items-center justify-between">
                  <span>Lịch sử các phiên bản</span>
                  <span className="text-[10px] text-slate-400">Human vs AI</span>
                </h4>
                {(!chapter.versions || chapter.versions.length === 0) ? (
                  <p className="text-slate-500 italic p-2 text-center">Chưa có bản lưu dự phòng nào.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {chapter.versions.map((ver) => (
                      <div key={ver.id} className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-amber-400 font-mono font-semibold">{ver.timestamp}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                            ver.authorType === 'ai' ? 'bg-purple-900/60 text-purple-300' : 'bg-emerald-900/60 text-emerald-300'
                          }`}>
                            {ver.authorType === 'ai' ? 'AI' : 'Tác giả'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2">{ver.changeReason}</p>
                        <button
                          onClick={() => handleRevertVersion(ver.content)}
                          className="text-[10px] text-sky-400 hover:underline pt-0.5"
                        >
                          Khôi phục bản này ({ver.wordCount} từ)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Push to Google Docs Button */}
          <button
            onClick={() => setShowGoogleDocModal(true)}
            title="Đẩy và ghi đè trực tiếp lên Google Docs của bạn"
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-sky-500/15 to-emerald-500/20 hover:from-emerald-500/30 hover:to-sky-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
          >
            <CloudUpload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Ghi Lên Google Doc</span>
          </button>

          {/* Private Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            title="Ghi chú riêng cho chương này"
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              showNotes 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                : 'bg-slate-800/60 hover:bg-slate-700/80 border-white/10 text-slate-300'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ghi Chú</span>
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            title={isFocusMode ? 'Thoát chế độ tập trung' : 'Chế độ tập trung Zen Mode'}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 transition-all text-xs text-amber-400"
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chapter Metadata Drawer (POV / Location / Context) */}
      {showMetadataDrawer && (
        <div className="p-4 border-b border-amber-500/20 bg-slate-900/90 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-3 text-xs select-none animate-in fade-in">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nhân vật góc nhìn (POV)</label>
            <select
              value={chapter.povCharacterName || ''}
              onChange={(e) => onUpdateMetadata({ povCharacterName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Chọn góc nhìn POV --</option>
              {characters.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
              ))}
              <option value="Người dẫn truyện">Người dẫn truyện (Ngôi thứ ba)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Địa điểm chính</label>
            <input
              type="text"
              value={chapter.location || ''}
              onChange={(e) => onUpdateMetadata({ location: e.target.value })}
              placeholder="Ví dụ: Giảng đường Lý Thuyết Nền số 3"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Thời điểm trong truyện</label>
            <input
              type="text"
              value={chapter.timeOfDay || ''}
              onChange={(e) => onUpdateMetadata({ timeOfDay: e.target.value })}
              placeholder="Ví dụ: Sáng thứ Ba, 8h kém 10"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Private Notes Panel */}
      {showNotes && (
        <div className="p-3.5 border-b border-amber-500/20 bg-amber-950/20 text-xs animate-in fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5 font-serif">
              <StickyNote className="w-3.5 h-3.5" /> Ghi chú sáng tác riêng của bạn:
            </span>
          </div>
          <textarea
            value={chapter.notes || ''}
            onChange={(e) => onUpdateMetadata({ notes: e.target.value })}
            placeholder="Ghi lại các chi tiết cần chú ý hoặc hướng phát triển ở chương sau..."
            className="w-full bg-slate-950/80 border border-amber-900/40 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 h-16 resize-none font-sans"
          />
        </div>
      )}

      {/* Main Content Area based on Editor Mode: Soạn Truyện Chữ vs Up Truyện Tranh */}
      {editorMode === 'comic' ? (
        <ComicUploader
          activeChapter={chapter}
          chapters={chapters}
          comicChapters={comicChapters}
          onSaveComicChapters={onSaveComicChapters || (() => {})}
          onPreviewInReader={onPreviewInReader || (() => {})}
          isWarmTheme={isWarmTheme}
        />
      ) : (
        <>
          {/* Floating Glass AI Action Ribbon */}
          <div className={`px-6 py-2.5 border-b flex items-center justify-between flex-shrink-0 select-none overflow-x-auto ${
            isWarmTheme 
              ? 'bg-parchment-200/40 border-amber-900/10' 
              : 'bg-slate-900/50 border-slate-800/60 backdrop-blur-lg'
          }`}>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Sparkles className="w-3.5 h-3.5" /> Trợ Lý AI:
              </span>

              <button
                onClick={() => onRequestAI('scene_writer', 'Đề xuất 3 hướng phát triển tiếp theo cho chương này')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-medium transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>3 Hướng Phát Triển</span>
              </button>

              <button
                onClick={() => onRequestAI('scene_writer', 'Viết tiếp đoạn văn từ vị trí hiện tại tuân thủ nghiêm ngặt nguyên tắc viết')}
                className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-medium transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Viết Tiếp</span>
              </button>

              <button
                onClick={onAuditLogic}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-medium transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                <span>Soát Logic & Rào Chắn</span>
              </button>

              <button
                onClick={() => onRequestAI('style_editor', 'Soát văn phong và nhịp điệu theo đúng phong cách tác giả')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 font-medium transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Soát Văn Phong</span>
              </button>

              <button
                onClick={onRequestFactExtraction}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-medium transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Trích Xuất Dữ Kiện</span>
              </button>
            </div>

            {/* Font Zoom Controls */}
            <div className="flex items-center space-x-1.5 text-xs opacity-75">
              <button 
                onClick={() => setFontSize(prev => Math.min(15, prev - 1))}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="font-mono text-[11px] px-1">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Main Drafting Canvas */}
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 flex justify-center selection:bg-amber-500/30 selection:text-amber-200">
            <div className="w-full max-w-3xl flex flex-col min-h-full">
              {/* Chapter Opening Header in Canvas */}
              <div className="text-center pb-8 mb-6 border-b border-white/5 space-y-2 select-none">
                <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold block">
                  {partTitle}
                </span>
                <h1 className="font-serif font-black text-2xl md:text-3xl text-slate-100 tracking-tight">
                  {chapter.title}
                </h1>
                <div className="flex items-center justify-center space-x-3 text-xs text-slate-400 font-mono pt-1">
                  <span>{words.toLocaleString()} từ</span>
                  <span>•</span>
                  <span>Thời gian đọc: ~{readMinutes} phút</span>
                </div>
              </div>

              {/* True Full Chapter Textarea */}
              <textarea
                ref={textareaRef}
                value={chapter.content || ''}
                onChange={handleTextChange}
                placeholder="Bắt đầu viết chương tại đây..."
                style={{ fontSize: `${fontSize}px` }}
                className={`w-full flex-1 bg-transparent resize-none focus:outline-none manuscript-content leading-[2.0] tracking-wide transition-colors border-none p-0 ${
                  isWarmTheme 
                    ? 'text-stone-900 placeholder:text-stone-400' 
                    : 'text-slate-100 placeholder:text-slate-600'
                }`}
              />
            </div>
          </div>
        </>
      )}

      {/* Google Doc Push & Writeback Modal */}
      <GoogleDocPushModal
        isOpen={showGoogleDocModal}
        onClose={() => setShowGoogleDocModal(false)}
        chapter={chapter}
        partTitle={partTitle}
      />
    </main>
  );
};

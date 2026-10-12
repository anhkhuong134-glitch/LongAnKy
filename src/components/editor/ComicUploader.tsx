import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Save, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Link as LinkIcon,
  MessageSquare,
  Volume2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Chapter, ComicChapter, ComicPage, ComicPanel, ComicDialogue } from '../../types';

interface ComicUploaderProps {
  activeChapter: Chapter;
  chapters: Chapter[];
  comicChapters: ComicChapter[];
  onSaveComicChapters: (updated: ComicChapter[]) => void;
  onPreviewInReader: () => void;
  isWarmTheme: boolean;
}

export const ComicUploader: React.FC<ComicUploaderProps> = ({
  activeChapter,
  chapters,
  comicChapters,
  onSaveComicChapters,
  onPreviewInReader,
  isWarmTheme
}) => {
  // Find or create ComicChapter corresponding to activeChapter
  const targetComicChapter = comicChapters.find(
    c => c.chapterId === activeChapter.id || c.title.toLowerCase().includes(activeChapter.title.toLowerCase())
  ) || comicChapters[0] || {
    id: `comic_${activeChapter.id}`,
    chapterId: activeChapter.id,
    title: activeChapter.title,
    subtitle: 'Bản chuyển thể truyện tranh (Webtoon / Manga)',
    readingDirection: 'vertical',
    pages: []
  };

  const [currentComicChapterId, setCurrentComicChapterId] = useState<string>(targetComicChapter.id);
  const [activePageIdx, setActivePageIdx] = useState<number>(0);
  const [urlInput, setUrlInput] = useState<string>('');
  const [captionInput, setCaptionInput] = useState<string>('');
  const [sfxInput, setSfxInput] = useState<string>('');
  const [dialogueChar, setDialogueChar] = useState<string>('Rento');
  const [dialogueText, setDialogueText] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Comic Chapter
  const selectedComic = comicChapters.find(c => c.id === currentComicChapterId) || targetComicChapter;
  const pages = selectedComic.pages || [];
  const currentPage: ComicPage | undefined = pages[activePageIdx] || pages[0];
  const panels = currentPage?.panels || [];

  // Helper to update active comic chapter
  const updateActiveComicChapter = (updater: (prev: ComicChapter) => ComicChapter) => {
    const updated = updater(selectedComic);
    const chapterExists = comicChapters.some(c => c.id === updated.id);
    let newChapters: ComicChapter[];
    if (chapterExists) {
      newChapters = comicChapters.map(c => c.id === updated.id ? updated : c);
    } else {
      newChapters = [...comicChapters, updated];
    }
    onSaveComicChapters(newChapters);
    setSaveToast('Đã tự động lưu thay đổi truyện tranh!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Handle Multi-file Upload from Local Machine
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        updateActiveComicChapter(prev => {
          const currentPages = [...(prev.pages || [])];
          
          // If no pages, create Page 1
          if (currentPages.length === 0) {
            currentPages.push({
              id: `page_${Date.now()}`,
              pageNumber: 1,
              title: `Trang 1: Mở màn`,
              panels: []
            });
          }

          const targetPage = currentPages[activePageIdx] || currentPages[0];
          const currentPanels = [...targetPage.panels];
          const newPanelNumber = currentPanels.length + 1;

          const newPanel: ComicPanel = {
            id: `panel_${Date.now()}_${index}`,
            panelNumber: newPanelNumber,
            imageUrl: dataUrl,
            caption: `Khung tranh ${newPanelNumber} - ${file.name.replace(/\.[^/.]+$/, '')}`,
            widthSpan: 'full',
            dialogues: []
          };

          targetPage.panels.push(newPanel);
          return { ...prev, pages: currentPages };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Add Panel via Web URL
  const handleAddPanelViaUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    updateActiveComicChapter(prev => {
      const currentPages = [...(prev.pages || [])];
      if (currentPages.length === 0) {
        currentPages.push({
          id: `page_${Date.now()}`,
          pageNumber: 1,
          title: `Trang 1: Mở màn`,
          panels: []
        });
      }

      const targetPage = currentPages[activePageIdx] || currentPages[0];
      const newPanelNumber = targetPage.panels.length + 1;

      const newPanel: ComicPanel = {
        id: `panel_${Date.now()}`,
        panelNumber: newPanelNumber,
        imageUrl: urlInput.trim(),
        caption: captionInput.trim() || `Khung tranh ${newPanelNumber}`,
        sfx: sfxInput.trim() || undefined,
        widthSpan: 'full',
        dialogues: dialogueText.trim() ? [
          {
            id: `d_${Date.now()}`,
            character: dialogueChar.trim(),
            text: dialogueText.trim(),
            position: 'bottom-left',
            bubbleType: 'speech'
          }
        ] : []
      };

      targetPage.panels.push(newPanel);
      return { ...prev, pages: currentPages };
    });

    setUrlInput('');
    setCaptionInput('');
    setSfxInput('');
    setDialogueText('');
  };

  // Reorder Panel: Move Up
  const handleMovePanelUp = (panelIdx: number) => {
    if (panelIdx <= 0 || !currentPage) return;
    updateActiveComicChapter(prev => {
      const currentPages = [...prev.pages];
      const targetPage = currentPages[activePageIdx];
      const updatedPanels = [...targetPage.panels];
      const temp = updatedPanels[panelIdx - 1];
      updatedPanels[panelIdx - 1] = updatedPanels[panelIdx];
      updatedPanels[panelIdx] = temp;
      targetPage.panels = updatedPanels.map((p, idx) => ({ ...p, panelNumber: idx + 1 }));
      return { ...prev, pages: currentPages };
    });
  };

  // Reorder Panel: Move Down
  const handleMovePanelDown = (panelIdx: number) => {
    if (!currentPage || panelIdx >= currentPage.panels.length - 1) return;
    updateActiveComicChapter(prev => {
      const currentPages = [...prev.pages];
      const targetPage = currentPages[activePageIdx];
      const updatedPanels = [...targetPage.panels];
      const temp = updatedPanels[panelIdx + 1];
      updatedPanels[panelIdx + 1] = updatedPanels[panelIdx];
      updatedPanels[panelIdx] = temp;
      targetPage.panels = updatedPanels.map((p, idx) => ({ ...p, panelNumber: idx + 1 }));
      return { ...prev, pages: currentPages };
    });
  };

  // Delete Panel
  const handleDeletePanel = (panelId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa trang tranh này không?')) return;
    updateActiveComicChapter(prev => {
      const currentPages = [...prev.pages];
      const targetPage = currentPages[activePageIdx];
      targetPage.panels = targetPage.panels.filter(p => p.id !== panelId).map((p, idx) => ({
        ...p,
        panelNumber: idx + 1
      }));
      return { ...prev, pages: currentPages };
    });
  };

  // Add New Empty Page
  const handleAddNewPage = () => {
    updateActiveComicChapter(prev => {
      const currentPages = [...prev.pages];
      const newPageNumber = currentPages.length + 1;
      currentPages.push({
        id: `page_${Date.now()}`,
        pageNumber: newPageNumber,
        title: `Trang ${newPageNumber}: Phân đoạn tiếp theo`,
        panels: []
      });
      return { ...prev, pages: currentPages };
    });
    setActivePageIdx(pages.length);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none ${
      isWarmTheme ? 'bg-[#fcfbf9] text-stone-900' : 'bg-[#080c16] text-slate-100'
    }`}>
      {/* Top Banner Toolbar */}
      <div className="px-6 py-3 border-b border-rose-500/20 bg-slate-950/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-rose-300 flex items-center gap-2">
              <span>Studio Up Truyện Tranh (Webtoon &amp; Manga)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-sans">
                Chế độ Tác Giả
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Đăng tải bản vẽ, sắp xếp thứ tự trang và gắn lời thoại cho độc giả thưởng thức
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {saveToast && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveToast}
            </span>
          )}

          <button
            onClick={onPreviewInReader}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Như Độc Giả</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Select Chapter & Page Navigation */}
        <div className="w-64 border-r border-white/5 bg-slate-950/40 p-4 flex flex-col space-y-4 overflow-y-auto">
          {/* Chapter Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Chọn Chương Truyện Tranh:
            </label>
            <select
              value={currentComicChapterId}
              onChange={(e) => setCurrentComicChapterId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {comicChapters.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Page Tabs */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Tập / Trang ({pages.length})
              </span>
              <button
                onClick={handleAddNewPage}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm trang
              </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto pr-1">
              {pages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePageIdx(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                    activePageIdx === idx
                      ? 'bg-gradient-to-r from-rose-500/30 to-amber-500/20 text-rose-200 border border-rose-500/40 font-bold'
                      : 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <span className="truncate">{p.title || `Trang ${idx + 1}`}</span>
                  <span className="text-[10px] opacity-60 font-mono">({p.panels.length} khung)</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel: Upload Area & Panels Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Multi-source Upload Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-rose-950/30 border border-rose-500/30 shadow-xl">
            <h3 className="text-sm font-bold font-serif text-white mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-400" />
              <span>Tải Lên Trang Tranh Cho {currentPage?.title || 'Trang 1'}</span>
            </h3>

            {/* Drag & Drop / File Input Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/5 transition-all rounded-xl p-8 text-center cursor-pointer mb-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-rose-400/80 animate-bounce" />
              <p className="text-sm font-semibold text-white">
                Bấm để chọn file ảnh hoặc kéo thả trực tiếp vào đây
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Hỗ trợ định dạng PNG, JPG, WEBP • Cho phép chọn cùng lúc nhiều ảnh theo thứ tự
              </p>
            </div>

            {/* Or add via URL */}
            <form onSubmit={handleAddPanelViaUrl} className="pt-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Hoặc dán URL ảnh trực tuyến (https://...)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={sfxInput}
                  onChange={(e) => setSfxInput(e.target.value)}
                  placeholder="Âm thanh SFX (Vd: ẦM ẦM!!)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="w-full h-full py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Bằng URL</span>
                </button>
              </div>
            </form>
          </div>

          {/* Uploaded Panels List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-slate-200 flex items-center gap-2">
                <span>Danh Sách Khung Tranh Đã Up ({panels.length} khung)</span>
                <span className="text-xs text-slate-400 font-sans font-normal">
                  (Độc giả sẽ xem theo đúng thứ tự này)
                </span>
              </h3>
            </div>

            {panels.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-slate-500">
                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Trang này chưa có hình ảnh truyện tranh nào.</p>
                <p className="text-xs text-slate-600 mt-1">Hãy tải ảnh lên từ máy tính của bạn ở khung phía trên.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {panels.map((panel, idx) => (
                  <div
                    key={panel.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-lg flex flex-col space-y-3 group hover:border-rose-500/40 transition-all"
                  >
                    {/* Header: Panel number & Action buttons */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
                        Khung #{idx + 1}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMovePanelUp(idx)}
                          title="Di chuyển lên trước"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === panels.length - 1}
                          onClick={() => handleMovePanelDown(idx)}
                          title="Di chuyển xuống sau"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePanel(panel.id)}
                          title="Xóa trang này"
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image Thumbnail */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/5">
                      {panel.imageUrl ? (
                        <img
                          src={panel.imageUrl}
                          alt={panel.caption || `Khung ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-600 text-xs">Chưa có ảnh</div>
                      )}
                      {panel.sfx && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] italic shadow">
                          {panel.sfx}
                        </span>
                      )}
                    </div>

                    {/* Quick Caption Input */}
                    <div>
                      <input
                        type="text"
                        value={panel.caption || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveComicChapter(prev => {
                            const currentPages = [...prev.pages];
                            currentPages[activePageIdx].panels[idx].caption = val;
                            return { ...prev, pages: currentPages };
                          });
                        }}
                        placeholder="Chú thích khung cảnh..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

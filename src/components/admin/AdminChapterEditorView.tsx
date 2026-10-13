import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Save, Globe, Eye, CheckCircle2, Clock,
  AlertCircle, Users, MapPin, Sparkles, X, ChevronRight,
  RotateCcw, RefreshCw
} from 'lucide-react';
import { PublishedContentService } from '../../services/publishedContent';
import { GoogleSyncService } from '../../services/googleSyncService';

interface AdminChapterEditorViewProps {
  chapterId: string;
  onBack: () => void;
  onPreviewChapter: (id: string) => void;
}

export const AdminChapterEditorView: React.FC<AdminChapterEditorViewProps> = ({
  chapterId,
  onBack,
  onPreviewChapter,
}) => {
  const [title, setTitle] = useState('Đang tải tiêu đề chương...');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingDoc, setIsSyncingDoc] = useState(false);

  // States
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState('Vừa xong');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Metadata panel fields
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(['Rento', 'Nari', 'Tovan', 'Omi']);
  const [locationName, setLocationName] = useState('Bến Arumo — Giếng cảng số bảy');
  const [authorNotes, setAuthorNotes] = useState('Ghi chú nội bộ tác giả cho chương này.');

  // Word count
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const timerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load real chapter content on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const draft = localStorage.getItem('arumo_chapter_draft_' + chapterId);

    PublishedContentService.getChapterById(chapterId).then(res => {
      if (!isMounted) return;
      if (res) {
        setTitle(res.chapter.title);
        setContent(draft || res.chapter.content);
        if (res.chapter.location) setLocationName(res.chapter.location);
        if (res.chapter.notes) setAuthorNotes(res.chapter.notes);
        if (res.chapter.povCharacterName) {
          const chars = res.chapter.povCharacterName.split('&').map(s => s.trim()).filter(Boolean);
          if (chars.length > 0) setSelectedCharacters(chars);
        }
      } else {
        // Fallback for new chapter
        setTitle(chapterId === 'doc_chap_prologue' ? 'Mở đầu: Ranh giới của sự bình thường' : 'Chương mới');
        setContent(draft || '');
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [chapterId]);

  // Autosave draft (2 seconds debounce)
  const handleContentChange = (newText: string) => {
    setContent(newText);
    setSaveStatus('dirty');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      localStorage.setItem('arumo_chapter_draft_' + chapterId, newText);
      setTimeout(() => {
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
      }, 400);
    }, 2000);
  };

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    localStorage.setItem('arumo_chapter_draft_' + chapterId, content);
    setTimeout(() => {
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
      showToast('Đã lưu bản nháp vào hệ thống. Bản độc giả vẫn giữ nguyên cho đến khi xuất bản.');
    }, 300);
  };

  // Pull latest text from Google Docs specifically for this chapter
  const handleSyncFromGoogleDocs = async () => {
    setIsSyncingDoc(true);
    showToast('Đang kết nối Google Docs và tải nội dung chương...');
    try {
      const syncedChap = await GoogleSyncService.syncSingleChapter(chapterId);
      if (syncedChap && syncedChap.content) {
        setTitle(syncedChap.title);
        setContent(syncedChap.content);
        if (syncedChap.location) setLocationName(syncedChap.location);
        if (syncedChap.notes) setAuthorNotes(syncedChap.notes);
        if (syncedChap.povCharacterName) {
          const chars = syncedChap.povCharacterName.split('&').map(s => s.trim()).filter(Boolean);
          if (chars.length > 0) setSelectedCharacters(chars);
        }
        localStorage.setItem('arumo_chapter_draft_' + chapterId, syncedChap.content);
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
        showToast(`Đã đồng bộ thành công từ Google Docs (${syncedChap.wordCount.toLocaleString()} từ)!`);
      } else {
        // Fallback: sync all and check again
        await GoogleSyncService.syncLiveGoogleDocs();
        const res = await PublishedContentService.getChapterById(chapterId);
        if (res && res.chapter.content) {
          setTitle(res.chapter.title);
          setContent(res.chapter.content);
          showToast(`Đã cập nhật từ Google Docs (${res.chapter.wordCount.toLocaleString()} từ)!`);
        } else {
          showToast('Đã kiểm tra Google Docs: Chương này hiện không có nội dung mới.');
        }
      }
    } catch (err: any) {
      showToast('Lỗi khi đồng bộ Google Docs: ' + (err.message || 'Lỗi mạng'));
    } finally {
      setIsSyncingDoc(false);
    }
  };

  // Confirm Publish
  const handleConfirmPublish = async () => {
    setShowPublishModal(false);
    await PublishedContentService.updateChapter(chapterId, title, content);
    localStorage.removeItem('arumo_chapter_draft_' + chapterId);
    showToast('Đã cập nhật công khai chương này cho toàn bộ độc giả!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#293B36] text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-[#5F706A] hover:text-[#293B36] hover:bg-[#F2F8F5] transition-colors"
            title="Quay lại danh sách chương"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-lg text-[#293B36]">
              {isLoading ? 'Đang tải...' : title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#5F706A]">
              <span>Bản đang sửa: đã lưu lúc {lastSavedTime}</span>
              <span>•</span>
              <span className="font-semibold text-[#376F64]">
                Liên kết: Google Docs Live
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Sync from Google Docs button */}
          <button
            onClick={handleSyncFromGoogleDocs}
            disabled={isSyncingDoc}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            title="Kéo văn bản mới nhất của chương này từ Google Docs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDoc ? 'animate-spin' : ''}`} />
            <span>{isSyncingDoc ? 'Đang đồng bộ...' : 'Đồng bộ Google Docs'}</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#293B36] bg-[#FFFDF8] border border-[#DCE6DF] hover:bg-[#F2F8F5] transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4 text-[#376F64]" />
            <span>Lưu bản nháp</span>
          </button>

          <button
            onClick={() => onPreviewChapter(chapterId)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#5F706A] bg-[#F2F8F5] hover:text-[#293B36] transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước</span>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>Cập nhật công khai</span>
          </button>
        </div>
      </div>

      {/* Editor Body Grid: Main Writing Area + Meta Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Writing Area */}
        <div className="lg:col-span-8 bg-white border border-[#DCE6DF] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Chapter Title input */}
          <div className="space-y-1 border-b border-[#DCE6DF] pb-4">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F706A]">
              Tiêu đề chương
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-extrabold text-[#293B36] focus:outline-none"
              placeholder="Nhập tên chương..."
            />
          </div>

          {/* Manuscript Content Textarea */}
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={20}
              className="w-full text-[16px] text-[#293B36] font-serif leading-[1.85] resize-y p-2 focus:outline-none bg-transparent placeholder-gray-400"
              placeholder="Nhập nội dung chương tại đây, hoặc bấm nút 'Đồng bộ Google Docs' để nạp tự động..."
            ></textarea>
          </div>

          {/* Bottom Editor Bar */}
          <div className="pt-4 border-t border-[#DCE6DF] flex items-center justify-between text-xs text-[#5F706A]">
            <div className="flex items-center gap-3">
              <span>{wordCount.toLocaleString()} chữ</span>
              <span>•</span>
              <span>Khoảng {Math.max(1, Math.round(wordCount / 250))} phút đọc</span>
            </div>
            <div className="flex items-center gap-1.5">
              {saveStatus === 'saving' ? (
                <span className="text-amber-600 font-semibold">Đang lưu...</span>
              ) : saveStatus === 'dirty' ? (
                <span className="text-gray-400">Có thay đổi chưa lưu</span>
              ) : (
                <span className="text-[#376F64] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã lưu bản nháp</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Drawer Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Google Docs Link */}
          <div className="bg-[#FFFDF8] border border-[#DCE6DF] rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#376F64]">Google Docs nguồn</span>
              <p className="text-[11px] text-[#5F706A]">Long Ấn Ký (Bản chính thức)</p>
            </div>
            <a
              href="https://docs.google.com/document/d/1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y/edit?hl=vi&tab=t.0#heading=h.nlly6mas27dt"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#E4F1E9] text-[#376F64] font-bold text-xs hover:bg-[#D5EADF] transition-colors"
            >
              Mở Docs ↗
            </a>
          </div>

          {/* Panel 1: Nhân vật xuất hiện */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#376F64] flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Nhân vật có mặt ({selectedCharacters.length})</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedCharacters.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E4F1E9] text-[#376F64]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Panel 2: Địa điểm trong truyện */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#376F64] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Bối cảnh diễn ra</span>
            </h3>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full text-xs font-semibold text-[#293B36] p-2 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8]"
            />
          </div>

          {/* Panel 3: Ghi chú tác giả */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#376F64]">
              Ghi chú nội bộ tác giả
            </h3>
            <textarea
              value={authorNotes}
              onChange={(e) => setAuthorNotes(e.target.value)}
              rows={4}
              className="w-full text-xs text-[#293B36] p-2 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] resize-none"
            ></textarea>
            <p className="text-[11px] text-[#5F706A] italic">
              Ghi chú này được lưu riêng tư cho admin, không xuất bản ra độc giả.
            </p>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6DF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="space-y-2">
              <span className="w-10 h-10 rounded-2xl bg-[#E4F1E9] text-[#376F64] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-extrabold text-[#293B36]">
                Xác nhận xuất bản chương
              </h3>
              <p className="text-xs text-[#5F706A] leading-relaxed">
                Thao tác này sẽ cập nhật bản văn chương <strong>{title}</strong> ra website công khai cho toàn bộ độc giả.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Số từ công khai:</span>
                <span className="font-bold text-[#293B36]">{wordCount.toLocaleString()} chữ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Trạng thái:</span>
                <span className="font-bold text-[#376F64]">Sẵn sàng phát hành</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5F706A] hover:bg-gray-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] shadow-sm"
              >
                Xác nhận đăng công khai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

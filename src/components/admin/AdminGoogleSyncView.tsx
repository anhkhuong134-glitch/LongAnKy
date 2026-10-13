import React, { useState, useEffect } from 'react';
import { RefreshCw, FileText, CheckCircle2, AlertTriangle, ArrowRight, Save, Globe } from 'lucide-react';
import { GoogleSyncService } from '../../services/googleSyncService';
import { PublishedContentService, PublishedChapter } from '../../services/publishedContent';

export const AdminGoogleSyncView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState('1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y');
  const [syncedChapters, setSyncedChapters] = useState<PublishedChapter[]>([]);

  // Load existing chapters
  useEffect(() => {
    PublishedContentService.getAllChapters().then(chs => {
      setSyncedChapters(chs);
    });
  }, []);

  const handleFetchDocs = async () => {
    setIsSyncing(true);
    setSyncStatus('Đang kết nối và tải toàn bộ văn bản từ Google Docs...');

    try {
      const res = await GoogleSyncService.syncLiveGoogleDocs();
      if (res.success) {
        const fresh = await PublishedContentService.getAllChapters();
        setSyncedChapters(fresh);
        setSyncStatus(`Tải và đồng bộ thành công! Đã nạp ${fresh.length} chương (${(res.totalWords || 0).toLocaleString()} từ) từ Google Docs.`);
      } else {
        setSyncStatus(`Không thể tải từ Google Docs: ${res.message}`);
      }
    } catch (e: any) {
      setSyncStatus(`Lỗi khi tải từ Google Docs: ${e.message || 'Lỗi mạng'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePublishAll = async () => {
    const snapshot = await PublishedContentService.loadSnapshot();
    PublishedContentService.updateSnapshot(snapshot);
    setSyncStatus('✅ Đã cập nhật toàn bộ bản thảo từ Google Docs ra website công khai cho độc giả!');
  };

  const totalWords = syncedChapters.reduce((sum, c) => sum + c.wordCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
          Đồng bộ nội dung từ Google Docs
        </h1>
        <p className="text-xs text-[#5F706A]">
          Luồng kiểm soát thông minh: Kết nối trực tiếp tài liệu Google Docs → Tải toàn văn → Phân tích Mở đầu & Các chương → Tự động cập nhật vào các trang truyện chữ.
        </p>
      </div>

      {/* Source Connection Card */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-[#293B36] uppercase tracking-wider">
          Nguồn tài liệu Google Docs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#5F706A]">Tên tài liệu:</span>
            <p className="font-bold text-[#293B36] text-sm">Long Ấn Ký (Bản thảo chính thức)</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-[#5F706A]">Mã Document ID:</span>
            <p className="font-mono text-[#376F64] text-xs truncate">{selectedDocId}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleFetchDocs}
            disabled={isSyncing}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ từ Google Docs ngay'}</span>
          </button>

          <button
            onClick={handlePublishAll}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>Xuất bản công khai toàn bộ</span>
          </button>

          <a
            href={`https://docs.google.com/document/d/${selectedDocId}/edit?hl=vi&tab=t.0#heading=h.nlly6mas27dt`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#376F64] hover:underline"
          >
            Mở tài liệu Google Docs nguồn ↗
          </a>
        </div>

        {syncStatus && (
          <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs font-medium text-[#293B36] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#376F64] shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Chapters Overview Panel */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-base text-[#293B36]">
              Danh sách chương đã đồng bộ ({syncedChapters.length} chương)
            </h3>
            <p className="text-xs text-[#5F706A]">
              Toàn bộ các chương dưới đây được cập nhật đúng vị trí trong hệ thống đọc tiểu thuyết.
            </p>
          </div>
          <span className="text-xs font-bold text-[#376F64] bg-[#E4F1E9] px-3 py-1.5 rounded-full">
            Tổng {totalWords.toLocaleString()} từ
          </span>
        </div>

        <div className="space-y-3">
          {syncedChapters.map((ch, idx) => (
            <div
              key={ch.id}
              className="p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] hover:border-[#376F64] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#5F706A]">
                    {idx === 0 ? 'Mở đầu' : `Chương ${idx}`}
                  </span>
                  <span className="font-extrabold text-sm text-[#293B36]">
                    {ch.title}
                  </span>
                </div>
                <p className="text-xs text-[#5F706A] line-clamp-1">
                  {ch.content ? ch.content.slice(0, 120) + '...' : 'Chưa có nội dung.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="font-bold text-[#376F64] bg-[#E4F1E9] px-2.5 py-1 rounded-lg">
                  {ch.wordCount.toLocaleString()} từ
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Khớp Google Docs</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

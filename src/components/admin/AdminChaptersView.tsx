import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Search, Filter, Edit3, Eye, Globe,
  Archive, Clock, CheckCircle2, ChevronRight, AlertTriangle,
  RefreshCw, Check
} from 'lucide-react';
import { PublishedContentService, PublishedChapter } from '../../services/publishedContent';
import { GoogleSyncService } from '../../services/googleSyncService';

interface AdminChaptersViewProps {
  onNavigate: (path: string) => void;
  onEditChapter: (chapterId: string) => void;
}

export const AdminChaptersView: React.FC<AdminChaptersViewProps> = ({
  onNavigate,
  onEditChapter,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chapters, setChapters] = useState<Array<{
    id: string;
    part: string;
    title: string;
    order: number;
    wordCount: number;
    status: 'published' | 'draft';
    lastSaved: string;
    publishedVersion: string;
  }>>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Load chapters from PublishedContentService
  const loadChaptersList = async () => {
    const snapshot = await PublishedContentService.loadSnapshot();
    const rows: typeof chapters = [];

    for (const part of snapshot.parts) {
      for (const ch of part.chapters) {
        rows.push({
          id: ch.id,
          part: part.title,
          title: ch.title,
          order: ch.order,
          wordCount: ch.wordCount,
          status: 'published',
          lastSaved: snapshot.publishedAt || '13/10/2026',
          publishedVersion: snapshot.version || '1.0.0',
        });
      }
    }

    if (rows.length > 0) {
      setChapters(rows);
    }
  };

  useEffect(() => {
    loadChaptersList();

    const handleUpdated = () => {
      loadChaptersList();
    };
    window.addEventListener('story-content-updated', handleUpdated);
    return () => {
      window.removeEventListener('story-content-updated', handleUpdated);
    };
  }, []);

  // Handle Full Google Docs Sync
  const handleSyncAllFromDocs = async () => {
    setIsSyncing(true);
    setSyncFeedback('Đang đồng bộ toàn bộ chương từ Google Docs...');
    try {
      const res = await GoogleSyncService.syncLiveGoogleDocs();
      if (res.success) {
        await loadChaptersList();
        setSyncFeedback(`✅ ${res.message}`);
      } else {
        setSyncFeedback(`⚠️ ${res.message}`);
      }
    } catch (err: any) {
      setSyncFeedback(`Lỗi đồng bộ: ${err.message || 'Không thể kết nối'}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4500);
    }
  };

  const filteredChapters = chapters.filter(c => {
    if (filterStatus === 'published' && c.status !== 'published') return false;
    if (filterStatus === 'draft' && c.status !== 'draft') return false;
    if (searchQuery.trim()) {
      return c.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Quản lý chương tiểu thuyết
          </h1>
          <p className="text-xs text-[#5F706A]">
            Soạn thảo, đồng bộ Google Docs và xuất bản các chương của Long Ấn Thức Tỉnh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync from Google Docs button */}
          <button
            onClick={handleSyncAllFromDocs}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all flex items-center gap-2 shadow-sm disabled:opacity-60"
            title="Đồng bộ tự động tất cả các chương từ link Google Docs"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ từ Google Docs'}</span>
          </button>

          <button
            onClick={() => onEditChapter('doc_chap_prologue')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Soạn thảo chương</span>
          </button>
        </div>
      </div>

      {/* Sync feedback banner */}
      {syncFeedback && (
        <div className="p-3.5 rounded-xl bg-[#E4F1E9] border border-[#376F64]/30 text-xs font-bold text-[#293B36] flex items-center justify-between animate-in fade-in">
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Stats Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Tổng số chương</span>
          <p className="text-2xl font-extrabold text-[#293B36] mt-1">{chapters.length}</p>
        </div>
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Đã xuất bản</span>
          <p className="text-2xl font-extrabold text-[#376F64] mt-1">
            {chapters.filter(c => c.status === 'published').length}
          </p>
        </div>
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Tổng số chữ</span>
          <p className="text-2xl font-extrabold text-[#293B36] mt-1">{totalWords.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Liên kết nguồn</span>
          <p className="text-xs font-bold text-[#376F64] mt-2 flex items-center gap-1 truncate">
            <Check className="w-3.5 h-3.5" />
            <span>Google Docs Live</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên chương..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] focus:outline-none focus:border-[#376F64]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-[#376F64] text-white shadow-xs'
                : 'text-[#5F706A] hover:bg-[#F2F8F5]'
            }`}
          >
            Tất cả ({chapters.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'published'
                ? 'bg-[#376F64] text-white shadow-xs'
                : 'text-[#5F706A] hover:bg-[#F2F8F5]'
            }`}
          >
            Đã công khai ({chapters.filter(c => c.status === 'published').length})
          </button>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Thứ tự</th>
                <th className="py-3.5 px-4">Tên chương & Phần</th>
                <th className="py-3.5 px-4 text-center">Số chữ</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Nguồn</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {filteredChapters.map((ch, idx) => (
                <tr key={ch.id} className="hover:bg-[#F2F8F5]/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#5F706A]">
                    {idx === 0 ? 'Mở đầu' : `Ch. ${idx}`}
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-[#293B36] text-sm hover:text-[#376F64] cursor-pointer"
                         onClick={() => onEditChapter(ch.id)}>
                        {ch.title}
                      </p>
                      <span className="text-[11px] font-semibold text-[#5F706A]">
                        {ch.part}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#293B36]">
                    {ch.wordCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E4F1E9] text-[#376F64]">
                      <Globe className="w-3 h-3" />
                      <span>Đã công khai</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-[#5F706A] font-medium">
                    Google Docs
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditChapter(ch.id)}
                        className="p-1.5 rounded-lg text-[#376F64] hover:bg-[#E4F1E9] transition-colors"
                        title="Chỉnh sửa chương"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate(`/doc/${ch.id}`)}
                        className="p-1.5 rounded-lg text-[#5F706A] hover:bg-[#F2F8F5] transition-colors"
                        title="Xem chế độ đọc"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

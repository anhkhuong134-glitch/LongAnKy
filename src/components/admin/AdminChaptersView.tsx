import React, { useState } from 'react';
import {
  BookOpen, Plus, Search, Filter, Edit3, Eye, Globe,
  Archive, Clock, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { PublishedChapter } from '../../services/publishedContent';

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

  // Chapter records (canonical snapshot + drafts)
  const [chapters, setChapters] = useState([
    {
      id: 'doc_chap_prologue',
      part: 'MỞ ĐẦU',
      title: 'Mở đầu: Ranh giới của sự bình thường',
      order: 1,
      wordCount: 1276,
      status: 'published' as const,
      lastSaved: '13/10/2026 10:00',
      publishedVersion: '1.0.0',
    },
    {
      id: 'doc_chap_01',
      part: 'PHẦN I — MÙA NƯỚC ĐỨNG',
      title: 'Chương 1 — Chiếc tàu đến sớm',
      order: 2,
      wordCount: 3647,
      status: 'published' as const,
      lastSaved: '13/10/2026 12:30',
      publishedVersion: '1.0.0',
    },
    {
      id: 'doc_chap_02',
      part: 'PHẦN I — MÙA NƯỚC ĐỨNG',
      title: 'Chương 2 — Tên nào nằm trong sổ',
      order: 3,
      wordCount: 1998,
      status: 'published' as const,
      lastSaved: '13/10/2026 14:15',
      publishedVersion: '1.0.0',
    },
    {
      id: 'doc_chap_03',
      part: 'PHẦN I — MÙA NƯỚC ĐỨNG',
      title: 'Chương 3 — Chiếc chìa khóa thứ bảy',
      order: 4,
      wordCount: 2840,
      status: 'published' as const,
      lastSaved: '13/10/2026 15:45',
      publishedVersion: '1.0.0',
    },
    {
      id: 'doc_chap_04',
      part: 'PHẦN I — MÙA NƯỚC ĐỨNG',
      title: 'Chương 4 — Khói sau giàn tời',
      order: 5,
      wordCount: 3120,
      status: 'published' as const,
      lastSaved: '13/10/2026 16:00',
      publishedVersion: '1.0.0',
    },
    {
      id: 'doc_chap_05',
      part: 'PHẦN I — MÙA NƯỚC ĐỨNG',
      title: 'Chương 5 — Lệnh từ bến trên',
      order: 6,
      wordCount: 2950,
      status: 'published' as const,
      lastSaved: '13/10/2026 16:30',
      publishedVersion: '1.0.0',
    },
    {
      id: 'doc_chap_06',
      part: 'PHẦN I — MÙA NƯỚC ĐỨNG',
      title: 'Chương 6 — Nước lạnh dưới giếng cảng',
      order: 7,
      wordCount: 2450,
      status: 'draft' as const,
      lastSaved: 'Hôm nay 15:00',
      publishedVersion: 'Chưa xuất bản',
    },
  ]);

  const filteredChapters = chapters.filter(c => {
    if (filterStatus === 'published' && c.status !== 'published') return false;
    if (filterStatus === 'draft' && c.status !== 'draft') return false;
    if (searchQuery.trim()) {
      return c.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Phần và chương tiểu thuyết
          </h1>
          <p className="text-xs text-[#5F706A]">
            Quản lý bản thảo, biên tập nội dung và điều phối xuất bản ra website độc giả.
          </p>
        </div>

        <button
          onClick={() => onEditChapter('new')}
          className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-xs shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chương mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#DCE6DF]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Tất cả ({chapters.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'published'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Đã công khai (6)
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'draft'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Bản nháp (1)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#5F706A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên chương..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none"
          />
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Tên chương</th>
                <th className="py-3 px-4">Phần</th>
                <th className="py-3 px-4 text-right">Số từ</th>
                <th className="py-3 px-4">Lưu gần nhất</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {filteredChapters.map((ch, idx) => (
                <tr key={ch.id} className="hover:bg-[#FFFDF8] transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-[#5F706A]">
                    {idx === 0 ? '0' : idx}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-sm text-[#293B36] block">
                      {ch.title}
                    </span>
                    <span className="text-[11px] text-[#5F706A] font-mono">
                      ID: {ch.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#5F706A] font-medium">
                    {ch.part}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#293B36]">
                    {ch.wordCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[#5F706A]">
                    {ch.lastSaved}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {ch.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E4F1E9] text-[#376F64]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đã công khai</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F8EDCB] text-amber-800">
                        <Clock className="w-3 h-3" />
                        <span>Bản nháp</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onEditChapter(ch.id)}
                        className="p-1.5 rounded-lg text-[#376F64] hover:bg-[#E4F1E9] transition-colors"
                        title="Biên tập chương"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate(`/doc/${ch.id}`)}
                        className="p-1.5 rounded-lg text-[#5F706A] hover:bg-gray-100 transition-colors"
                        title="Xem bản độc giả"
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

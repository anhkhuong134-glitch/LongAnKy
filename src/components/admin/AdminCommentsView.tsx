import React, { useState } from 'react';
import { MessageSquare, Eye, EyeOff, Trash2, Check, Search } from 'lucide-react';

interface CommentRecord {
  id: string;
  author: string;
  text: string;
  chapter: string;
  time: string;
  status: 'visible' | 'hidden';
}

export const AdminCommentsView: React.FC = () => {
  const [comments, setComments] = useState<CommentRecord[]>([
    {
      id: 'cm1',
      author: 'Người đọc bến Arumo',
      text: 'Đoạn Rento giằng chiếc cần phanh máy tời số bảy đọc nghẹt thở thật sự!',
      chapter: 'Chương 1 — Chiếc tàu đến sớm',
      time: '13/10/2026 15:30',
      status: 'visible',
    },
    {
      id: 'cm2',
      author: 'Thanh Thảo',
      text: 'Tạo hình chibi của Nari nhìn vừa kiên nghị vừa dễ thương, hợp với hộ vệ tập sự ghê.',
      chapter: 'Chương 2 — Tên nào nằm trong sổ',
      time: '13/10/2026 14:10',
      status: 'visible',
    },
    {
      id: 'cm3',
      author: 'Minh Vũ',
      text: 'Ủng hộ tác giả ra tiếp chương 6 ạ! Đọc cuốn quá.',
      chapter: 'Chương 1 — Chiếc tàu đến sớm',
      time: '12/10/2026 21:00',
      status: 'visible',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const toggleStatus = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? {
      ...c,
      status: c.status === 'visible' ? 'hidden' : 'visible'
    } : c));
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const filtered = comments.filter(c =>
    c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Quản trị bình luận độc giả
          </h1>
          <p className="text-xs text-[#5F706A]">
            Kiểm duyệt, ẩn hoặc hiển thị các lời nhắn phản hồi của bạn đọc theo từng chương.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3 border-b border-[#DCE6DF] flex items-center justify-between">
          <span className="text-xs font-bold text-[#5F706A]">
            Tổng số bình luận: {comments.length}
          </span>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[#5F706A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nội dung bình luận..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-extrabold uppercase">
              <tr>
                <th className="py-3 px-4">Độc giả</th>
                <th className="py-3 px-4">Nội dung</th>
                <th className="py-3 px-4">Chương</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFFDF8]">
                  <td className="py-3 px-4 font-bold text-[#293B36] whitespace-nowrap">
                    {c.author}
                  </td>
                  <td className="py-3 px-4 text-[#293B36] max-w-xs">
                    {c.text}
                  </td>
                  <td className="py-3 px-4 text-[#5F706A] whitespace-nowrap">
                    {c.chapter}
                  </td>
                  <td className="py-3 px-4 text-[#5F706A] whitespace-nowrap">
                    {c.time}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      c.status === 'visible'
                        ? 'bg-[#E4F1E9] text-[#376F64]'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {c.status === 'visible' ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className="p-1.5 rounded-lg text-[#5F706A] hover:text-[#376F64] hover:bg-gray-100"
                        title={c.status === 'visible' ? 'Ẩn bình luận' : 'Hiện bình luận'}
                      >
                        {c.status === 'visible' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="p-1.5 rounded-lg text-[#5F706A] hover:text-[#A33D49] hover:bg-red-50"
                        title="Xóa bình luận"
                      >
                        <Trash2 className="w-4 h-4" />
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

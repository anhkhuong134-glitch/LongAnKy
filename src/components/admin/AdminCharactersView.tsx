import React, { useState } from 'react';
import {
  Users, Search, Filter, Edit3, Eye, CheckCircle2,
  AlertCircle, ShieldAlert, Sparkles, ChevronRight
} from 'lucide-react';
import { ALL_CHARACTERS_DATA, PublicCharacter } from '../../data/publicCharacters';

interface AdminCharactersViewProps {
  onNavigate: (path: string) => void;
  onEditCharacter: (charId: string) => void;
}

export const AdminCharactersView: React.FC<AdminCharactersViewProps> = ({
  onNavigate,
  onEditCharacter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'public' | 'draft'>('all');

  const filteredCharacters = ALL_CHARACTERS_DATA.filter((char) => {
    if (filterTag === 'public' && !char.publicReady) return false;
    if (filterTag === 'draft' && char.publicReady) return false;
    if (searchQuery.trim()) {
      return char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             char.occupation.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Quản trị 21 hồ sơ nhân vật
          </h1>
          <p className="text-xs text-[#5F706A]">
            Toàn bộ 21 bản ghi liên kết bộ ảnh Chibi v0.3. Dữ liệu nội bộ tác giả và cấu hình hiển thị công khai.
          </p>
        </div>

        <div className="text-xs font-bold text-[#5F706A] bg-white border border-[#DCE6DF] px-3 py-2 rounded-xl">
          Đủ 21/21 ảnh chibi đã nhập sẵn
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#DCE6DF]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTag === 'all'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Tất cả (21)
          </button>
          <button
            onClick={() => setFilterTag('public')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTag === 'public'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Đã duyệt công khai (8)
          </button>
          <button
            onClick={() => setFilterTag('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTag === 'draft'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Cần biên tập (13)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#5F706A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên hoặc nghề nghiệp..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none"
          />
        </div>
      </div>

      {/* Characters Table */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Ảnh</th>
                <th className="py-3 px-4">Tên & ID</th>
                <th className="py-3 px-4">Vai trò / Nghề</th>
                <th className="py-3 px-4 text-center">Ảnh v0.3</th>
                <th className="py-3 px-4 text-center">Hồ sơ nội bộ</th>
                <th className="py-3 px-4 text-center">Công khai</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {filteredCharacters.map((char) => (
                <tr key={char.id} className="hover:bg-[#FFFDF8] transition-colors">
                  {/* Thumbnail */}
                  <td className="py-2.5 px-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#F2F8F5] border border-[#DCE6DF] p-1 mx-auto flex items-center justify-center overflow-hidden">
                      <img
                        src={char.avatar || char.chibiArt}
                        alt={char.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </td>

                  {/* Name & ID */}
                  <td className="py-2.5 px-4">
                    <span className="font-extrabold text-sm text-[#293B36] block">
                      {char.name}
                    </span>
                    <span className="text-[11px] text-[#5F706A] font-mono">
                      {char.id}
                    </span>
                  </td>

                  {/* Role / Job */}
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-[#293B36] block">
                      {char.roleLabel}
                    </span>
                    <span className="text-[11px] text-[#5F706A]">
                      {char.occupation}
                    </span>
                  </td>

                  {/* Asset Ready Status */}
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Khớp ảnh</span>
                    </span>
                  </td>

                  {/* Profile Ready Status */}
                  <td className="py-2.5 px-4 text-center">
                    {char.profileReady ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đủ trường</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <span>Cần bổ sung</span>
                      </span>
                    )}
                  </td>

                  {/* Public Ready Status */}
                  <td className="py-2.5 px-4 text-center">
                    {char.publicReady ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2.5 py-0.5 rounded-full">
                        <span>Hiển thị</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        <span>Nội bộ</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onEditCharacter(char.id)}
                        className="p-1.5 rounded-lg text-[#376F64] hover:bg-[#E4F1E9] transition-colors"
                        title="Biên tập hồ sơ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate(`/nhan-vat/${char.id}`)}
                        className="p-1.5 rounded-lg text-[#5F706A] hover:bg-gray-100 transition-colors"
                        title="Xem trang công khai"
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

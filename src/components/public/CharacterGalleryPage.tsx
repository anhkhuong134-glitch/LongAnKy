import React, { useState, useMemo } from 'react';
import { Search, X, Users, UserCheck, Anchor } from 'lucide-react';
import { ALL_CHARACTERS_DATA, PublicCharacter } from '../../data/publicCharacters';

interface CharacterGalleryPageProps {
  onNavigate: (path: string) => void;
}

// Accent removal helper for Vietnamese search
function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export const CharacterGalleryPage: React.FC<CharacterGalleryPageProps> = ({ onNavigate }) => {
  const [filterTag, setFilterTag] = useState<'all' | 'main' | 'arumo'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter public characters
  const filteredCharacters = useMemo(() => {
    const normQuery = removeVietnameseAccents(searchQuery.trim());

    return ALL_CHARACTERS_DATA.filter((char) => {
      // Must be public
      if (!char.isPublic) return false;

      // Group filter
      if (filterTag === 'main') {
        if (char.role !== 'protagonist' && char.role !== 'deuteragonist') return false;
      } else if (filterTag === 'arumo') {
        if (!char.origin.toLowerCase().includes('arumo') && !char.residence.toLowerCase().includes('arumo')) {
          return false;
        }
      }

      // Search query
      if (normQuery) {
        const normName = removeVietnameseAccents(char.name);
        const normDesc = removeVietnameseAccents(char.oneLineDesc);
        const normOcc = removeVietnameseAccents(char.occupation);
        return normName.includes(normQuery) || normDesc.includes(normQuery) || normOcc.includes(normQuery);
      }

      return true;
    });
  }, [filterTag, searchQuery]);

  return (
    <div className="py-8 md:py-12 space-y-8 max-w-[1120px] mx-auto">
      {/* Page Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#293B36] tracking-tight">
          Nhân vật
        </h1>
        <p className="text-base text-[#5F706A]">
          Mỗi người mang theo một câu chuyện.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-2 p-1 bg-white border border-[#DCE6DF] rounded-xl self-start">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
              filterTag === 'all'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterTag('main')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
              filterTag === 'main'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Nhân vật chính
          </button>
          <button
            onClick={() => setFilterTag('arumo')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
              filterTag === 'arumo'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Người ở Arumo
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên nhân vật..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-[#DCE6DF] text-sm text-[#293B36] placeholder-[#5F706A]/70 focus:border-[#376F64] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F706A] hover:text-[#293B36]"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredCharacters.length === 0 && (
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-10 text-center space-y-3">
          <p className="text-base text-[#5F706A]">
            Chưa tìm thấy nhân vật nào phù hợp với bộ lọc hiện tại.
          </p>
          <button
            onClick={() => {
              setFilterTag('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-sm font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-colors"
          >
            Xem tất cả nhân vật
          </button>
        </div>
      )}

      {/* Character Grid: 4 cols desktop, 3 tablet, 2 mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredCharacters.map((char) => (
          <div
            key={char.id}
            onClick={() => onNavigate(`/nhan-vat/${char.id}`)}
            className="bg-white border border-[#DCE6DF] rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#376F64] hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
          >
            {/* Chibi Art Frame (70% height emphasis) */}
            <div className="w-full aspect-[3/4] bg-[#FFFDF8] rounded-xl flex items-center justify-center p-2 mb-3.5 overflow-hidden border border-[#DCE6DF]/50">
              <img
                src={char.chibiArt}
                alt={`${char.name} trong phong cách chibi Arumo`}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Role Label */}
            <span className="text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded-full mb-1">
              {char.roleLabel}
            </span>

            {/* Name */}
            <h3 className="font-extrabold text-base sm:text-lg text-[#293B36] group-hover:text-[#376F64] transition-colors">
              {char.name}
            </h3>

            {/* One-line Description */}
            <p className="text-xs text-[#5F706A] mt-1 line-clamp-2 leading-relaxed">
              {char.oneLineDesc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

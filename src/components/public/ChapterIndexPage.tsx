import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Clock, CheckCircle2, ArrowUpDown, X } from 'lucide-react';
import { PublishedStorySnapshot, PublishedPart, PublishedChapter } from '../../services/publishedContent';
import { ReadingHistoryItem } from '../../services/readingProgress';

interface ChapterIndexPageProps {
  snapshot: PublishedStorySnapshot | null;
  history: ReadingHistoryItem | null;
  completedChapterIds: string[];
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

export const ChapterIndexPage: React.FC<ChapterIndexPageProps> = ({
  snapshot,
  history,
  completedChapterIds,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(false);
  const [expandedPartIds, setExpandedPartIds] = useState<Record<string, boolean>>(() => {
    // Default open first part or part user is reading
    return {
      part_prologue: true,
      part_mua_nuoc_dung: true,
    };
  });

  const togglePart = (partId: string) => {
    setExpandedPartIds(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  // Filter and sort chapters
  const filteredParts = useMemo(() => {
    if (!snapshot) return [];

    const normalizedQuery = removeVietnameseAccents(searchQuery.trim());

    return snapshot.parts.map(part => {
      let chapters = part.chapters.filter(ch => {
        if (!normalizedQuery) return true;
        const normTitle = removeVietnameseAccents(ch.title);
        const normContent = removeVietnameseAccents(ch.content.slice(0, 300));
        return normTitle.includes(normalizedQuery) || normContent.includes(normalizedQuery);
      });

      if (sortNewestFirst) {
        chapters = [...chapters].reverse();
      }

      return {
        ...part,
        chapters,
      };
    }).filter(part => part.chapters.length > 0 || !normalizedQuery);
  }, [snapshot, searchQuery, sortNewestFirst]);

  const totalPublishedChapters = useMemo(() => {
    if (!snapshot) return 0;
    return snapshot.parts.reduce((sum, p) => sum + p.chapters.length, 0);
  }, [snapshot]);

  return (
    <div className="max-w-[880px] mx-auto py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#293B36] tracking-tight">
          Mục lục
        </h1>
        <p className="text-sm text-[#5F706A]">
          {totalPublishedChapters > 0
            ? `${totalPublishedChapters} chương đã phát hành chính thức`
            : 'Đang tải danh sách chương...'}
        </p>
      </div>

      {/* Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên hoặc số chương..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#DCE6DF] text-sm text-[#293B36] placeholder-[#5F706A]/70 focus:border-[#376F64] focus:outline-none transition-colors"
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

        {/* Sort Toggle */}
        <button
          onClick={() => setSortNewestFirst(!sortNewestFirst)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            sortNewestFirst
              ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
              : 'bg-white text-[#5F706A] border-[#DCE6DF] hover:border-[#376F64]'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{sortNewestFirst ? 'Mới nhất trước' : 'Đầu đến cuối'}</span>
        </button>
      </div>

      {/* Empty State when search returns no match */}
      {filteredParts.every(p => p.chapters.length === 0) && (
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-8 text-center space-y-3">
          <p className="text-base text-[#5F706A]">
            Chưa thấy chương này. Thử một từ ngắn hơn nhé.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl text-sm font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-colors"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}

      {/* Parts & Chapters List */}
      <div className="space-y-6">
        {filteredParts.map((part) => {
          const isExpanded = expandedPartIds[part.id] ?? true;

          return (
            <div key={part.id} className="space-y-3">
              {/* Part Header (Collapsible) */}
              <button
                onClick={() => togglePart(part.id)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[#E4F1E9]/70 border border-[#DCE6DF] hover:bg-[#E4F1E9] transition-colors text-left"
              >
                <div>
                  <h3 className="font-extrabold text-[16px] md:text-[18px] text-[#293B36]">
                    {part.title}
                  </h3>
                  {part.description && (
                    <p className="text-xs text-[#5F706A] mt-0.5">{part.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#376F64]">
                  <span>{part.chapters.length} chương</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Chapters list inside part */}
              {isExpanded && (
                <div className="bg-white border border-[#DCE6DF] rounded-2xl divide-y divide-[#DCE6DF] overflow-hidden shadow-sm">
                  {part.chapters.map((chapter, idx) => {
                    const isCompleted = completedChapterIds.includes(chapter.id);
                    const isCurrent = history?.chapterId === chapter.id;

                    return (
                      <div
                        key={chapter.id}
                        onClick={() => onNavigate(`/doc/${chapter.id}`)}
                        className="min-h-[64px] md:min-h-[72px] p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FFFDF8] cursor-pointer transition-colors group"
                      >
                        {/* Left: Number & Title */}
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-[#F2F8F5] text-[#376F64] text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-[#E4F1E9] transition-colors">
                            {chapter.id === 'doc_chap_prologue' ? '0' : idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-[15px] sm:text-[16px] text-[#293B36] group-hover:text-[#376F64] transition-colors truncate">
                              {chapter.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-[#5F706A] mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>~{Math.max(1, Math.round(chapter.wordCount / 250))} phút đọc</span>
                              <span>•</span>
                              <span>{chapter.wordCount} chữ</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Personal Reading Status */}
                        <div className="shrink-0 flex items-center gap-3">
                          {isCurrent ? (
                            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E4F1E9] text-[#376F64] border border-[#376F64]/20">
                              Đang đọc
                            </span>
                          ) : isCompleted ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-[#376F64] bg-[#F2F8F5]">
                              <CheckCircle2 className="w-4 h-4 text-[#376F64]" />
                              <span>Đã đọc</span>
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-[#5F706A]/70 px-2.5 py-1">
                              Chưa đọc
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

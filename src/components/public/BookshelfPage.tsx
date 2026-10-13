import React, { useState } from 'react';
import { BookOpen, Bookmark, Quote, Trash2, ArrowRight, Clock } from 'lucide-react';
import {
  ReadingProgressService,
  ReadingHistoryItem,
  Bookmark as BookmarkItem,
  SavedQuote
} from '../../services/readingProgress';

interface BookshelfPageProps {
  history: ReadingHistoryItem | null;
  onNavigate: (path: string) => void;
}

export const BookshelfPage: React.FC<BookshelfPageProps> = ({ history, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'bookmarks' | 'quotes'>('reading');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => ReadingProgressService.getBookmarks());
  const [quotes, setQuotes] = useState<SavedQuote[]>(() => ReadingProgressService.getSavedQuotes());

  const handleDeleteBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    ReadingProgressService.removeBookmark(id);
    setBookmarks(ReadingProgressService.getBookmarks());
  };

  const handleDeleteQuote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    ReadingProgressService.removeQuote(id);
    setQuotes(ReadingProgressService.getSavedQuotes());
  };

  return (
    <div className="max-w-[880px] mx-auto py-8 md:py-12 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#293B36] tracking-tight">
          Tủ sách của bạn
        </h1>
        <p className="text-sm text-[#5F706A]">
          Chỗ đọc được lưu an toàn trên thiết bị này.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DCE6DF] pb-2">
        <button
          onClick={() => setActiveTab('reading')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'reading'
              ? 'bg-[#E4F1E9] text-[#376F64]'
              : 'text-[#5F706A] hover:text-[#293B36]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Đang đọc</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-[#E4F1E9] text-[#376F64]'
              : 'text-[#5F706A] hover:text-[#293B36]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Dấu trang ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'quotes'
              ? 'bg-[#E4F1E9] text-[#376F64]'
              : 'text-[#5F706A] hover:text-[#293B36]'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>Trích đoạn ({quotes.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: ĐANG ĐỌC */}
      {activeTab === 'reading' && (
        <div className="space-y-4">
          {history ? (
            <div
              onClick={() => onNavigate(`/doc/${history.chapterId}`)}
              className="bg-white border border-[#DCE6DF] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#376F64] hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#E4F1E9] flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-[#376F64]" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#376F64]">
                    Tiếp tục chương đang đọc
                  </span>
                  <h3 className="text-lg font-bold text-[#293B36] group-hover:text-[#376F64] transition-colors">
                    {history.chapterTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#5F706A] mt-1">
                    <span>Đoạn thứ {history.paragraphIndex + 1}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {history.updatedAt}
                    </span>
                  </div>
                </div>
              </div>

              <button className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shrink-0">
                Đọc tiếp
              </button>
            </div>
          ) : (
            /* Empty State with Paper Boat */
            <div className="bg-white border border-[#DCE6DF] rounded-3xl p-12 text-center space-y-4">
              <div className="w-20 h-20 mx-auto">
                <img
                  src="/art/ui/paper-boat.svg"
                  alt="Thuyền giấy Arumo"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-base text-[#5F706A]">
                Chỗ đọc của bạn sẽ nằm ở đây.
              </p>
              <button
                onClick={() => onNavigate('/doc/doc_chap_prologue')}
                className="px-6 py-3 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shadow-sm"
              >
                Bắt đầu đọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: DẤU TRANG */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarks.length > 0 ? (
            <div className="bg-white border border-[#DCE6DF] rounded-2xl divide-y divide-[#DCE6DF] overflow-hidden shadow-sm">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => onNavigate(`/doc/${bm.chapterId}`)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FFFDF8] cursor-pointer transition-colors group"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-[#293B36] group-hover:text-[#376F64] transition-colors truncate">
                      {bm.chapterTitle}
                    </h4>
                    <p className="text-xs text-[#5F706A] italic line-clamp-1">
                      “{bm.snippet}”
                    </p>
                    <span className="text-[11px] text-[#5F706A]/70 block">
                      Lưu ngày: {bm.createdAt}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteBookmark(bm.id, e)}
                    className="p-2 rounded-lg text-[#5F706A] hover:text-[#A33D49] hover:bg-red-50 transition-colors shrink-0"
                    title="Xóa dấu trang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#DCE6DF] rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto opacity-70">
                <img src="/art/ui/paper-boat.svg" alt="Thuyền giấy" className="w-full h-full" />
              </div>
              <p className="text-sm text-[#5F706A]">
                Bạn chưa lưu dấu trang nào. Hãy bấm “Đánh dấu” khi đang đọc chương để lưu lại.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TRÍCH ĐOẠN */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {quotes.length > 0 ? (
            <div className="space-y-3">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white border border-[#DCE6DF] rounded-2xl p-5 space-y-2 hover:border-[#376F64] transition-all"
                >
                  <p className="italic text-[15px] text-[#293B36] font-serif leading-relaxed">
                    “{q.text}”
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#5F706A] pt-2 border-t border-[#DCE6DF]/60">
                    <span>Trích từ: {q.chapterTitle}</span>
                    <button
                      onClick={(e) => handleDeleteQuote(q.id, e)}
                      className="p-1 rounded text-[#5F706A] hover:text-[#A33D49]"
                      title="Xóa trích đoạn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#DCE6DF] rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto opacity-70">
                <img src="/art/ui/paper-boat.svg" alt="Thuyền giấy" className="w-full h-full" />
              </div>
              <p className="text-sm text-[#5F706A]">
                Bạn chưa lưu trích đoạn nào từ các chương truyện.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, Clock, BookOpen, Trash2, ChevronRight, Bookmark, Sparkles, BookMarked } from 'lucide-react';
import { ReadingHistoryItem, UserProfile } from '../../types/user';
import { UserService } from '../../services/userService';

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onNavigateChapter: (type: 'novel' | 'comic', chapterId: string, partId?: string, chapterIndex?: number) => void;
}

export const UserHistoryModal: React.FC<UserHistoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateChapter,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'bookmarks'>('history');
  const [history, setHistory] = useState<ReadingHistoryItem[]>(() => UserService.getReadingHistory());

  if (!isOpen) return null;

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử đọc truyện?')) {
      UserService.clearReadingHistory();
      setHistory([]);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / (1000 * 60));
      if (mins < 1) return 'Vừa xong';
      if (mins < 60) return `${mins} phút trước`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      return `${days} ngày trước`;
    } catch (e) {
      return 'Gần đây';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-rose-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-rose-500/30">
              🕒
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <span>Tủ Sách & Lịch Sử Đọc</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Chuẩn NetTruyen
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Lưu vết chính xác từng chương truyện chữ và truyện tranh bạn đã đọc
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-black/40 px-4 justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                activeTab === 'history'
                  ? 'text-rose-300 border-rose-500 bg-white/5'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Lịch Sử Đọc ({history.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`py-3 px-4 text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                activeTab === 'bookmarks'
                  ? 'text-amber-300 border-amber-500 bg-white/5'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Đã Lưu Yêu Thích ({currentUser?.bookmarkedChapterIds.length || 0})</span>
            </button>
          </div>

          {activeTab === 'history' && history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Xóa toàn bộ lịch sử đọc"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa lịch sử</span>
            </button>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
          {activeTab === 'history' ? (
            history.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-4xl">📜</div>
                <h4 className="font-serif text-sm text-slate-300">Chưa có lịch sử đọc nào</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hãy bắt đầu đọc một chương tiểu thuyết hoặc truyện tranh để hệ thống tự động ghi nhớ và lưu trữ cho bạn nhé!
                </p>
              </div>
            ) : (
              history.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-white/10 hover:border-rose-400/30 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                      item.type === 'novel'
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    }`}>
                      {item.type === 'novel' ? '📖' : '🎨'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                          item.type === 'novel' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {item.type === 'novel' ? 'Truyện Chữ' : 'Webtoon'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatTimeAgo(item.readAt)}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-xs text-slate-100 group-hover:text-rose-300 transition-colors truncate mt-0.5">
                        {item.chapterTitle}
                      </h4>
                      {item.partTitle && (
                        <p className="text-[10px] text-slate-400 truncate">
                          {item.partTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigateChapter(item.type, item.chapterId, item.partId, item.chapterIndex);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-rose-600/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Đọc tiếp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )
          ) : (
            // Bookmarks tab
            (!currentUser || currentUser.bookmarkedChapterIds.length === 0) ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-4xl">⭐</div>
                <h4 className="font-serif text-sm text-slate-300">Chưa có chương yêu thích nào được lưu</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Trong khi đọc truyện, bấm vào biểu tượng Bookmark trên thanh công cụ để lưu chương yêu thích vào đây nhé!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentUser.bookmarkedChapterIds.map(chapId => (
                  <div
                    key={chapId}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <BookMarked className="w-4 h-4 text-amber-400" />
                      <span className="font-serif font-medium text-xs text-slate-200">
                        Chương: {chapId}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onNavigateChapter('novel', chapId);
                        onClose();
                      }}
                      className="text-xs text-amber-300 hover:underline cursor-pointer"
                    >
                      Mở chương →
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

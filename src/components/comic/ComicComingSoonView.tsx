import React, { useState } from 'react';
import { 
  Sparkles, 
  Bell, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Eye, 
  UploadCloud, 
  Rocket, 
  Layers, 
  Info,
  Calendar,
  Lock,
  ChevronRight,
  ShieldCheck,
  Palette,
  Heart
} from 'lucide-react';
import { ComicChapter } from '../../types';
import { UserService } from '../../services/userService';
import { UserProfile } from '../../types/user';
import { ChapterCommentsSection } from '../reader/ChapterCommentsSection';

interface ComicComingSoonViewProps {
  comicChapters: ComicChapter[];
  isAuthorMode?: boolean;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onPreviewDraft: (chapterIndex: number) => void;
  onPublishChapter: (chapterId: string) => void;
  publishedChapterIds: string[];
}

export const ComicComingSoonView: React.FC<ComicComingSoonViewProps> = ({
  comicChapters,
  isAuthorMode,
  currentUser,
  onOpenAuthModal,
  onPreviewDraft,
  onPublishChapter,
  publishedChapterIds
}) => {
  const [selectedTeaserImage, setSelectedTeaserImage] = useState<string | null>(null);
  const [followToast, setFollowToast] = useState<string | null>(null);

  const isFollowing = currentUser?.isFollowing || false;

  const handleToggleFollow = () => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    const newFollowing = UserService.toggleFollowStory();
    if (newFollowing) {
      setFollowToast('✨ Đã theo dõi truyện tranh! Bạn sẽ nhận thông báo sớm nhất ngay khi Hồi 1 được xuất bản (+20 Tu Vi)!');
    } else {
      setFollowToast('Đã hủy theo dõi truyện.');
    }
    setTimeout(() => setFollowToast(null), 3500);
  };

  // Sneak peek teaser panels
  const teaserPanels = [
    {
      title: 'Bến Tàu Đêm Arumo',
      subtitle: 'Khung cảnh bến cảng huyền ảo trước cơn bão quái thú',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
      badge: 'Khung hình Hồi 1'
    },
    {
      title: 'Quái Vật Cột Nước Thức Tỉnh',
      subtitle: 'Dị biến đại dương dâng cao nuốt chửng ngọn hải đăng',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      badge: 'Cao trào Hồi 1'
    },
    {
      title: 'Vết Nứt Cổ Viện Aesvorn',
      subtitle: 'Bí mật thời gian và chiếc đồng hồ chạy lệch 5 phút',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
      badge: 'Hồi 2 Đang phác thảo'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {followToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900/95 border border-pink-400/50 text-pink-200 text-xs shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{followToast}</span>
        </div>
      )}

      {/* ================= AUTHOR CONTROL DECK (CHỈ TÁC GIẢ THẤY) ================= */}
      {isAuthorMode && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-purple-950/60 border-2 border-amber-500/40 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg shadow-sm">
                👑
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
                  <span>Bảng Điều Khiển Xuất Bản Webtoon</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">DÀNH CHO TÁC GIẢ</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Độc giả hiện tại đang thấy màn hình <strong>Coming Soon</strong>. Bạn có thể xuất bản từng chương để mở cổng cho người đọc!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPreviewDraft(0)}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Xem trước bản thảo đầy đủ ở chế độ đọc truyện tranh"
              >
                <Eye className="w-3.5 h-3.5 text-purple-300" />
                <span>Xem Trước Bản Thảo</span>
              </button>
            </div>
          </div>

          {/* Chapter Publish Buttons */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comicChapters.map((chap, idx) => {
              const isPublished = publishedChapterIds.includes(chap.id);
              return (
                <div key={chap.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-serif font-semibold text-xs text-slate-200 truncate">{chap.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className={isPublished ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {isPublished ? '● Đã Xuất Bản' : '○ Bản Thảo (Chưa Xuất Bản)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onPreviewDraft(idx)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all text-xs"
                      title="Xem bản thảo chương này"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onPublishChapter(chap.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        isPublished
                          ? 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-sans shadow-emerald-500/20'
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Thu Hồi</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-3 h-3" />
                          <span>Xuất Bản Ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= HERO COMING SOON SHOWCASE ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#11162d]/90 via-[#0a0f20]/90 to-[#070b16]/95 border border-pink-500/25 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-400/40 text-pink-200 text-xs font-serif font-bold shadow-lg animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>DỰ ÁN WEBTOON LONG ẤN THỨC TỈNH • SẮP RA MẮT</span>
            <span className="text-amber-400">✨</span>
          </div>

          {/* Epic Title */}
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight leading-tight bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(244,114,182,0.3)]">
            Truyện Tranh Đang Trong Quá Trình Chế Tác
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 font-serif leading-relaxed max-w-2xl">
            Từng khung tranh Webtoon của <strong className="text-pink-200 font-semibold">Long Ấn Thức Tỉnh</strong> đang được trau chuốt tỉ mỉ từ kịch bản phân cảnh, nét vẽ nhân vật đến hiệu ứng màu sắc điện ảnh.
            <br />
            Khi <strong className="text-amber-300">Hồi 1</strong> hoàn tất xuất bản, hệ thống sẽ tự động mở cổng đọc Webtoon chất lượng cao tại đây!
          </p>

          {/* Action Buttons: Theo Dõi & Đọc Tiểu Thuyết Chữ */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleToggleFollow}
              className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xl ${
                isFollowing
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                  : 'bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white shadow-pink-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              {isFollowing ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Đã Theo Dõi Truyện Tranh (Nhận Thông Báo Sớm Nhất)</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-pink-200" />
                  <span>Theo Dõi & Nhận Thông Báo Xuất Bản (+20 Tu Vi)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= ROADMAP & TIẾN ĐỘ SẢN XUẤT ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1022]/85 border border-indigo-500/20 shadow-xl backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-100">
              Tiến Độ Sản Xuất Webtoon & Kế Hoạch Xuất Bản
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Trạng thái: Đang chau chuốt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Milestone 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-rose-300 flex items-center gap-1.5">
                <span>Hồi 1: Chiếc Tàu Đến Sớm & Quái Vật Cột Nước</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sẵn Sàng Xuất Bản
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chuyển thể từ Chương 1 tiểu thuyết. Toàn bộ 9 khung tranh bến cảng Arumo trong giông bão, tiếng thét quái vật cột nước và khoảnh khắc Rento ra khơi đã hoàn thiện bản thảo.
            </p>
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Tiến độ hoàn thiện phân cảnh</span>
                <span className="text-amber-300 font-bold">95%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full w-[95%]" />
              </div>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-purple-300 flex items-center gap-1.5">
                <span>Hồi 2: Chiếc Đồng Hồ Chạy Thừa 5 Phút</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Đang Lên Màu
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chuyển thể từ Bản thảo Học viện Aesvorn. Dãy hành lang đá cổ kính với những vết nứt zích zắc mang hoa văn cổ đại và bí mật thời gian trôi lệch.
            </p>
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Tiến độ hoàn thiện phân cảnh</span>
                <span className="text-purple-300 font-bold">70%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SNEAK PEEK TEASER GALLERY ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-400" />
              <span>Khung Tranh Xem Trước (Teaser Sneak Peek)</span>
            </h2>
            <p className="text-xs text-slate-400">Hình ảnh bản thảo đang trong phòng vẽ của tác giả & họa sĩ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teaserPanels.map((teaser, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTeaserImage(teaser.imageUrl)}
              className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-pink-400/50 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={teaser.imageUrl}
                  alt={teaser.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Watermark badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-pink-300">
                {teaser.badge}
              </div>

              {/* Overlay info */}
              <div className="p-3 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent">
                <h4 className="font-serif font-bold text-xs text-slate-100 group-hover:text-pink-300 transition-colors">
                  {teaser.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {teaser.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ZOOM TEASER ================= */}
      {selectedTeaserImage && (
        <div
          onClick={() => setSelectedTeaserImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden border border-pink-500/40 shadow-2xl relative">
            <img src={selectedTeaserImage} alt="Teaser Preview" className="w-full h-full object-contain" />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-white/20 text-white text-xs">
              Nhấn bất kỳ đâu để đóng
            </div>
          </div>
        </div>
      )}

      {/* ================= COMMUNITY REACTIONS & HYPE (BÌNH LUẬN NGÓNG CHỜ) ================= */}
      <div className="pt-4 border-t border-indigo-500/20">
        <ChapterCommentsSection
          chapterId="comic_coming_soon"
          chapterTitle="Webtoon Long Ấn Thức Tỉnh — Khu Vực Ngóng Đợi Xuất Bản"
        />
      </div>
    </div>
  );
};

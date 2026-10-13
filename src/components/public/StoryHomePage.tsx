import React from 'react';
import { ArrowRight, BookOpen, Clock, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { PublishedStorySnapshot, PublishedChapter } from '../../services/publishedContent';
import { ReadingHistoryItem } from '../../services/readingProgress';
import { ALL_CHARACTERS_DATA } from '../../data/publicCharacters';

interface StoryHomePageProps {
  snapshot: PublishedStorySnapshot | null;
  history: ReadingHistoryItem | null;
  completedChapterIds: string[];
  onNavigate: (path: string) => void;
}

export const StoryHomePage: React.FC<StoryHomePageProps> = ({
  snapshot,
  history,
  completedChapterIds,
  onNavigate,
}) => {
  // Extract all published chapters
  const allChapters: PublishedChapter[] = [];
  if (snapshot) {
    for (const part of snapshot.parts) {
      for (const ch of part.chapters) {
        allChapters.push(ch);
      }
    }
  }

  // Published count label
  const publishedLabel = snapshot
    ? `Mở đầu và ${Math.max(0, allChapters.length - 1)} chương đã đăng`
    : 'Đang tải bản thảo xuất bản...';

  // 4 Featured characters for section D
  const featuredIds = ['char_rento', 'char_nari', 'char_dagan', 'char_seika'];
  const featuredCharacters = ALL_CHARACTERS_DATA.filter(c => featuredIds.includes(c.id));

  // Determine starting chapter (first chapter or prologue)
  const firstChapterId = allChapters[0]?.id || 'doc_chap_prologue';

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* =========================================================================
          A. HERO SECTION: "Arumo trong nắng sớm"
          Desktop 12 columns (5 text / 7 art, gap 40px)
          Mobile 4:3 art under text
      ========================================================================= */}
      <section className="pt-8 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (5 cols on Desktop) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4F1E9] text-[#376F64] text-xs font-bold uppercase tracking-wider">
              <span>Tiểu thuyết kỳ ảo</span>
              <span className="w-1 h-1 rounded-full bg-[#376F64]"></span>
              <span>Đang sáng tác</span>
            </div>

            {/* Novel Title */}
            <h1 className="text-[36px] sm:text-[44px] md:text-[56px] font-extrabold text-[#293B36] tracking-tight leading-[1.12]">
              Long Ấn Thức Tỉnh
            </h1>

            {/* Official Brief Intro */}
            <p className="text-[17px] md:text-[19px] text-[#293B36] font-medium leading-relaxed">
              Ghé Arumo một chút. Ở đây, dòng sông chảy trên trời — còn một chuyến tàu đến sớm có thể làm mọi thứ đổi khác.
            </p>

            {/* Status Line */}
            <div className="flex items-center gap-2 text-sm text-[#5F706A]">
              <span className="w-2 h-2 rounded-full bg-[#376F64] animate-pulse"></span>
              <span>{publishedLabel}</span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {history ? (
                <div>
                  <button
                    onClick={() => onNavigate(`/doc/${history.chapterId}`)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-md active:translate-y-0.5"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Đọc tiếp</span>
                  </button>
                  <p className="text-xs text-[#5F706A] mt-1.5 truncate max-w-[240px]">
                    Đang ở: {history.chapterTitle}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate(`/doc/${firstChapterId}`)}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-md active:translate-y-0.5"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Bắt đầu đọc</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('/muc-luc')}
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all"
              >
                <span>Xem mục lục</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column (7 cols on Desktop): Arumo Morning Illustration */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[28px] overflow-hidden border border-[#DCE6DF] bg-[#E5F1F7] shadow-[0_10px_30px_rgba(55,111,100,0.08)] group">
              <picture>
                <source media="(max-width: 640px)" srcSet="/art/world/arumo-morning-mobile.jpg" />
                <img
                  src="/art/world/arumo-morning-wide.jpg"
                  alt="Arumo trong nắng sớm — Dòng sông Asera lơ lửng trên mây và bến cảng nhỏ"
                  className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[3/2] transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </picture>
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-[#DCE6DF] text-xs font-semibold text-[#5F706A]">
                Bến Arumo • Sông Asera
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          B. "ĐỌC TIẾP TỪ ĐÂY" (Only shown if history exists)
      ========================================================================= */}
      {history && (
        <section className="bg-[#E4F1E9]/80 border border-[#C8DFD3] rounded-2xl p-5 md:p-6 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-[#C8DFD3] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                <img
                  src="/art/ui/river-mark.svg"
                  alt="Dấu trang"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#376F64]">
                  Đang hay thì đừng lạc chương
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#293B36] line-clamp-1">
                  {history.chapterTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#5F706A] mt-0.5">
                  <span>Tiến độ đoạn {history.paragraphIndex + 1}</span>
                  <span>•</span>
                  <span>Cập nhật: {history.updatedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate(`/doc/${history.chapterId}`)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shadow-sm"
              >
                Đọc tiếp
              </button>
              <button
                onClick={() => onNavigate(`/doc/${history.chapterId}`)}
                className="text-xs font-semibold text-[#5F706A] hover:text-[#376F64] underline underline-offset-2 whitespace-nowrap"
              >
                Đọc lại từ đầu chương
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          C. "CÁC CHƯƠNG ĐÃ ĐĂNG" (Mở đầu & tối đa 5 chương gần nhất)
      ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-extrabold text-[#293B36] tracking-tight">
              Các chương đã đăng
            </h2>
            <p className="text-sm text-[#5F706A]">
              Những chương mới nhất đã được phát hành chính thức
            </p>
          </div>
          <button
            onClick={() => onNavigate('/muc-luc')}
            className="text-sm font-bold text-[#376F64] hover:underline flex items-center gap-1"
          >
            <span>Xem toàn bộ mục lục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-[#DCE6DF] rounded-2xl divide-y divide-[#DCE6DF] overflow-hidden shadow-sm">
          {allChapters.slice(0, 6).map((chapter, idx) => {
            const isCompleted = completedChapterIds.includes(chapter.id);
            const isCurrent = history?.chapterId === chapter.id;

            return (
              <div
                key={chapter.id}
                onClick={() => onNavigate(`/doc/${chapter.id}`)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FFFDF8] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-[#F2F8F5] text-[#376F64] text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-[#E4F1E9] transition-colors">
                    {idx === 0 ? '0' : idx}
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

                <div className="shrink-0 flex items-center gap-2">
                  {isCurrent ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E4F1E9] text-[#376F64]">
                      Đang đọc
                    </span>
                  ) : isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#5F706A]">
                      <CheckCircle2 className="w-4 h-4 text-[#376F64]" />
                      <span className="hidden sm:inline">Đã đọc</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#5F706A]/70 hidden sm:inline">
                      Chưa đọc
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#5F706A] group-hover:text-[#376F64] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          D. "GẶP NGƯỜI Ở ARUMO" (4 thẻ: Rento, Nari, Dagan, Seika)
      ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-extrabold text-[#293B36] tracking-tight">
              Gặp người ở Arumo
            </h2>
            <p className="text-sm text-[#5F706A]">
              Những gương mặt đầu tiên bạn sẽ gặp khi bước xuống bến cảng
            </p>
          </div>
          <button
            onClick={() => onNavigate('/nhan-vat')}
            className="text-sm font-bold text-[#376F64] hover:underline flex items-center gap-1"
          >
            <span>Gặp các nhân vật khác</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredCharacters.map((char) => (
            <div
              key={char.id}
              onClick={() => onNavigate(`/nhan-vat/${char.id}`)}
              className="bg-white border border-[#DCE6DF] rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#376F64] hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
            >
              {/* Chibi Art Frame */}
              <div className="w-full aspect-[3/4] bg-[#FFFDF8] rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden border border-[#DCE6DF]/50">
                <img
                  src={char.chibiArt}
                  alt={char.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Name & Safe Description */}
              <h3 className="font-extrabold text-base sm:text-lg text-[#293B36] group-hover:text-[#376F64] transition-colors">
                {char.name}
              </h3>
              <p className="text-xs text-[#5F706A] mt-1 line-clamp-2">
                {char.oneLineDesc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          E. "MỘT GÓC THẾ GIỚI" (Bến Arumo Postcard)
      ========================================================================= */}
      <section className="bg-white border border-[#DCE6DF] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 rounded-2xl overflow-hidden border border-[#DCE6DF]">
            <img
              src="/art/world/arumo-postcard.jpg"
              alt="Bến Arumo — Cầu gỗ, xưởng sửa tời và sông Asera"
              className="w-full h-auto object-cover aspect-[3/2]"
            />
          </div>

          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#376F64]">
              Một góc thế giới
            </span>
            <h3 className="text-[26px] md:text-[32px] font-extrabold text-[#293B36] leading-tight">
              Bến Arumo
            </h3>
            <p className="text-[15px] md:text-[16px] text-[#5F706A] leading-relaxed">
              Những mái nhà thấp, những xưởng sửa tời và một bến cảng sống theo nhịp nước. Câu chuyện bắt đầu từ đây.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/the-gioi')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Khám phá Arumo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          F. BẢN CHUYỂN THỂ TRUYỆN TRANH
      ========================================================================= */}
      <section className="bg-[#E5F1F7]/70 border border-[#CDE1EC] rounded-3xl p-6 sm:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-[#CDE1EC] p-3 shrink-0 flex items-center justify-center shadow-sm">
              <img
                src="/art/ui/open-book.svg"
                alt="Bản chuyển thể truyện tranh"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#376F64]">
                Bản chuyển thể
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#293B36]">
                Câu chuyện đang bước sang trang tranh
              </h3>
              <p className="text-sm text-[#5F706A]">
                Bản chuyển thể đang được thực hiện. Từ những dòng chữ đầu tiên đến từng khung tranh.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/truyen-tranh')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-[#376F64] bg-white border border-[#CDE1EC] hover:bg-[#E5F1F7] transition-all text-sm shrink-0 shadow-sm"
          >
            Xem tiến độ chuyển thể
          </button>
        </div>
      </section>
    </div>
  );
};

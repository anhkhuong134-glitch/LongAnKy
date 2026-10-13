import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut,
  BookOpen, Sparkles, User, Heart, Compass
} from 'lucide-react';
import { ALL_CHARACTERS_DATA, PublicCharacter } from '../../data/publicCharacters';

interface CharacterPublicProfileProps {
  characterId: string;
  onNavigate: (path: string) => void;
}

export const CharacterPublicProfile: React.FC<CharacterPublicProfileProps> = ({
  characterId,
  onNavigate,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Find character
  const characterIndex = ALL_CHARACTERS_DATA.findIndex(c => c.id === characterId);
  const character: PublicCharacter | undefined = ALL_CHARACTERS_DATA[characterIndex];

  // Previous and Next characters
  const prevCharacter = characterIndex > 0 ? ALL_CHARACTERS_DATA[characterIndex - 1] : null;
  const nextCharacter = characterIndex < ALL_CHARACTERS_DATA.length - 1 ? ALL_CHARACTERS_DATA[characterIndex + 1] : null;

  if (!character) {
    return (
      <div className="max-w-[720px] mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#293B36]">Chưa tìm thấy nhân vật này</h2>
        <p className="text-sm text-[#5F706A]">
          Hồ sơ nhân vật bạn tìm kiếm có thể chưa được công bố hoặc đường dẫn không chính xác.
        </p>
        <button
          onClick={() => onNavigate('/nhan-vat')}
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm"
        >
          Về danh sách nhân vật
        </button>
      </div>
    );
  }

  // Open Lightbox
  const handleOpenLightbox = () => {
    setZoomScale(1);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-[1040px] mx-auto py-8 md:py-12 space-y-12">
      {/* 1. Breadcrumb: Trang chủ / Nhân vật / {Tên} */}
      <nav className="flex items-center gap-2 text-sm text-[#5F706A]">
        <button onClick={() => onNavigate('/')} className="hover:text-[#376F64] transition-colors">
          Trang chủ
        </button>
        <span>/</span>
        <button onClick={() => onNavigate('/nhan-vat')} className="hover:text-[#376F64] transition-colors">
          Nhân vật
        </button>
        <span>/</span>
        <span className="font-bold text-[#293B36]">{character.name}</span>
      </nav>

      {/* Top Split Section: Desktop 360px image column + Info column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* 2. Cột ảnh Chibi toàn thân (360px desktop, max 280px mobile) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] lg:max-w-[360px] aspect-[3/4] bg-white rounded-3xl border border-[#DCE6DF] p-4 flex items-center justify-center shadow-sm overflow-hidden group">
            <img
              src={character.chibiArt}
              alt={character.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {/* Nút Xem ảnh lớn */}
            <button
              onClick={handleOpenLightbox}
              className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 border border-[#DCE6DF] text-[#376F64] hover:bg-[#E4F1E9] transition-all shadow-sm"
              title="Xem ảnh lớn"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-[#5F706A] mt-2 italic">
            Tạo hình chibi Arumo v0.3
          </span>
        </div>

        {/* 3. Tên, vai trò, một câu giới thiệu & Nút Gặp trong truyện */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E4F1E9] text-[#376F64]">
              {character.roleLabel}
            </div>
            <h1 className="text-[36px] sm:text-[44px] font-extrabold text-[#293B36] tracking-tight leading-tight">
              {character.name}
            </h1>
            <p className="text-lg text-[#293B36] font-medium leading-relaxed">
              {character.oneLineDesc}
            </p>
          </div>

          {/* Button "Gặp trong truyện" */}
          {character.appearedChapters && character.appearedChapters.length > 0 && (
            <div className="pt-1">
              <button
                onClick={() => onNavigate(`/doc/${character.appearedChapters[0].chapterId}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shadow-sm active:translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Gặp trong truyện: {character.appearedChapters[0].chapterTitle}</span>
              </button>
            </div>
          )}

          {/* 4. "Thông tin nhanh": tuổi, giới tính, xuất thân, nơi ở, nghề nghiệp */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#376F64]">
              Thông tin nhanh
            </h3>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
              <div>
                <span className="text-[#5F706A] block text-xs">Tuổi:</span>
                <span className="font-bold text-[#293B36]">{character.age}</span>
              </div>
              <div>
                <span className="text-[#5F706A] block text-xs">Giới tính:</span>
                <span className="font-bold text-[#293B36]">{character.gender}</span>
              </div>
              <div>
                <span className="text-[#5F706A] block text-xs">Nghề nghiệp:</span>
                <span className="font-bold text-[#293B36]">{character.occupation}</span>
              </div>
              <div>
                <span className="text-[#5F706A] block text-xs">Xuất thân:</span>
                <span className="font-bold text-[#293B36]">{character.origin}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#5F706A] block text-xs">Nơi sinh sống:</span>
                <span className="font-bold text-[#293B36]">{character.residence}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. "Bạn sẽ nhận ra..." (3–5 ý nhận diện) */}
      <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-extrabold text-[#293B36] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#376F64]" />
          <span>Bạn sẽ nhận ra…</span>
        </h3>
        <ul className="space-y-2.5 text-base text-[#293B36] leading-relaxed">
          {character.recognitionPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#376F64] mt-2 shrink-0"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. "Con người phía sau vẻ ngoài" */}
      <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-extrabold text-[#293B36] flex items-center gap-2">
          <User className="w-5 h-5 text-[#376F64]" />
          <span>Con người phía sau vẻ ngoài</span>
        </h3>
        <p className="text-base text-[#293B36] leading-relaxed">
          {character.personalityText}
        </p>

        {character.quoteSamples && character.quoteSamples.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#DCE6DF] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F706A]">
              Lời thoại đặc trưng:
            </span>
            {character.quoteSamples.map((q, idx) => (
              <p key={idx} className="italic text-sm text-[#376F64] bg-[#F2F8F5] p-3 rounded-xl border border-[#DCE6DF]/60">
                {q}
              </p>
            ))}
          </div>
        )}
      </section>

      {/* 7. "Xuất thân và hành trình" */}
      <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-extrabold text-[#293B36] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#376F64]" />
          <span>Xuất thân và hành trình</span>
        </h3>
        <p className="text-base text-[#293B36] leading-relaxed">
          {character.backgroundText}
        </p>
      </section>

      {/* 8. "Những người liên quan" */}
      {character.relationships && character.relationships.length > 0 && (
        <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h3 className="text-xl font-extrabold text-[#293B36] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#376F64]" />
            <span>Những người liên quan</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {character.relationships.map((rel, idx) => {
              const relTarget = ALL_CHARACTERS_DATA.find(c => c.id === rel.targetId);
              return (
                <div
                  key={idx}
                  onClick={() => relTarget && onNavigate(`/nhan-vat/${rel.targetId}`)}
                  className="p-3.5 rounded-xl border border-[#DCE6DF] hover:border-[#376F64] hover:bg-[#FFFDF8] transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#F2F8F5] border border-[#DCE6DF] shrink-0 overflow-hidden p-1 flex items-center justify-center">
                    <img
                      src={relTarget?.avatar || character.avatar}
                      alt={rel.targetName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#293B36] group-hover:text-[#376F64] transition-colors truncate">
                        {rel.targetName}
                      </h4>
                      <span className="text-[10px] font-bold text-[#376F64] bg-[#E4F1E9] px-1.5 py-0.5 rounded">
                        {rel.relationType}
                      </span>
                    </div>
                    <p className="text-xs text-[#5F706A] mt-0.5 line-clamp-2">
                      {rel.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. "Gặp nhân vật trong truyện" */}
      {character.appearedChapters && character.appearedChapters.length > 0 && (
        <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
          <h3 className="text-xl font-extrabold text-[#293B36] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#376F64]" />
            <span>Gặp nhân vật trong truyện</span>
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {character.appearedChapters.map((ch) => (
              <button
                key={ch.chapterId}
                onClick={() => onNavigate(`/doc/${ch.chapterId}`)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#E4F1E9] text-[#376F64] hover:bg-[#376F64] hover:text-white transition-all shadow-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>{ch.chapterTitle}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 10. "Hình ảnh": Bộ tạo hình chibi */}
      <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-extrabold text-[#293B36]">
          Bộ tạo hình Chibi chính thức
        </h3>
        <p className="text-sm text-[#5F706A]">
          Hình vẽ nhân vật được tạo tác riêng cho câu chuyện Long Ấn Thức Tỉnh (bản 0.3).
        </p>
        <div className="w-44 aspect-[3/4] bg-[#FFFDF8] rounded-xl border border-[#DCE6DF] p-2 overflow-hidden flex items-center justify-center">
          <img
            src={character.chibiArt}
            alt={character.name}
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      {/* 11. Điều hướng cuối trang: Trước / Sau & Về danh sách */}
      <div className="pt-6 border-t border-[#DCE6DF] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevCharacter ? (
          <button
            onClick={() => onNavigate(`/nhan-vat/${prevCharacter.id}`)}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#376F64] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước: {prevCharacter.name}</span>
          </button>
        ) : (
          <div></div>
        )}

        <button
          onClick={() => onNavigate('/nhan-vat')}
          className="px-5 py-2.5 rounded-xl border border-[#DCE6DF] bg-white text-sm font-bold text-[#293B36] hover:bg-[#F2F8F5] transition-all"
        >
          Về danh sách nhân vật
        </button>

        {nextCharacter ? (
          <button
            onClick={() => onNavigate(`/nhan-vat/${nextCharacter.id}`)}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#376F64] hover:underline"
          >
            <span>Sau: {nextCharacter.name}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Lightbox Modal (Nền sáng, zoom, nút đóng) */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full h-[90vh] flex flex-col items-center justify-center">
            {/* Top toolbar */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white border border-[#DCE6DF] p-1.5 rounded-xl shadow-md z-10">
              <button
                onClick={() => setZoomScale(s => Math.min(2.5, s + 0.25))}
                className="p-2 rounded-lg text-[#293B36] hover:bg-[#F2F8F5]"
                title="Phóng to"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomScale(s => Math.max(0.75, s - 0.25))}
                className="p-2 rounded-lg text-[#293B36] hover:bg-[#F2F8F5]"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-lg text-[#293B36] hover:bg-[#F2F8F5]"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Chibi Image Display */}
            <div className="overflow-auto max-w-full max-h-full p-4 flex items-center justify-center">
              <img
                src={character.chibiArt}
                alt={character.name}
                style={{ transform: `scale(${zoomScale})` }}
                className="max-h-[75vh] w-auto object-contain transition-transform duration-200"
              />
            </div>

            <p className="text-sm font-bold text-[#293B36] mt-4">
              {character.name} — Tạo hình Chibi Arumo
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

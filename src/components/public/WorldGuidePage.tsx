import React from 'react';
import { Compass, MapPin, Info, BookOpen } from 'lucide-react';

interface WorldGuidePageProps {
  onNavigate: (path: string) => void;
}

export const WorldGuidePage: React.FC<WorldGuidePageProps> = ({ onNavigate }) => {
  const locations = [
    {
      id: 'ben_arumo',
      title: 'Bến Arumo',
      type: 'Bến cảng ven sông',
      desc: 'Ngôi làng bến cảng hạ lưu ven sông Asera, nơi có những mái nhà gỗ san sát lợp ngói nhạt, cầu phao nổi và những chiếc tời kéo cáp neo tàu. Đời sống cư dân phụ thuộc hoàn toàn vào những chuyến tàu xuôi ngược theo nhịp nước đứng.',
      firstMentionChapter: 'doc_chap_prologue',
      firstMentionTitle: 'Mở đầu & Chương 1',
    },
    {
      id: 'xuong_sua_toi',
      title: 'Xưởng sửa tời & Giếng cảng',
      type: 'Khu kỹ thuật cơ khí',
      desc: 'Khu nhà xưởng cơ khí cũ nơi Rento và mẹ Mira làm việc. Nơi đây tập trung các bánh răng, cáp tải chịu lực cao và hệ thống giếng nước nâng tàu từ dòng sông trời trên mây xuống mặt đất.',
      firstMentionChapter: 'doc_chap_01',
      firstMentionTitle: 'Chương 1 — Chiếc tàu đến sớm',
    },
    {
      id: 'song_asera',
      title: 'Dòng sông trời Asera',
      type: 'Hiện tượng địa lý kỳ bí',
      desc: 'Dòng sông trong vắt chảy ngang bầu trời, lơ lửng ngay trên tầng mây thấp. Nước sông nuôi dưỡng các thung lũng bên dưới nhưng cũng mang theo những luồng nước lạnh bất thường và những hiểm họa không thể lường trước.',
      firstMentionChapter: 'doc_chap_01',
      firstMentionTitle: 'Chương 1 — Chiếc tàu đến sớm',
    },
  ];

  const loreNotes = [
    {
      title: 'Mùa nước đứng',
      desc: 'Khoảng thời gian trong năm khi dòng chảy sông Asera lắng lại và ổn định nhất, cho phép các đội tàu chở hàng từ thượng nguồn đi xuống bến cảng Arumo an toàn.',
    },
    {
      title: 'Hệ thống tời cáp số bảy',
      desc: 'Cụm tời chịu tải lớn ở đầu cầu cảng, đóng vai trò sống còn trong việc hãm đà neo giữ các con tàu cập bến giếng nước.',
    },
    {
      title: 'Quỹ bảo hộ bến cảng',
      desc: 'Tổ chức quản lý bồi hoàn và cấp phát vật tư bến do ban quản bến kiểm soát, chi phối trực tiếp quyền hành nghề và thu nhập của các gia đình thợ máy.',
    },
  ];

  return (
    <div className="max-w-[1040px] mx-auto py-8 md:py-12 space-y-12">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#293B36] tracking-tight">
          Một góc Arumo
        </h1>
        <p className="text-base text-[#5F706A]">
          Khám phá không gian địa lý, các địa điểm và điều cần biết trong thế giới Long Ấn Thức Tỉnh.
        </p>
      </div>

      {/* Hero Postcard Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#DCE6DF] bg-[#FFFDF8] shadow-sm">
        <img
          src="/art/world/arumo-postcard.jpg"
          alt="Minh họa không gian Bến Arumo"
          className="w-full h-auto object-cover aspect-[3/2] sm:aspect-[21/9]"
        />
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-[#DCE6DF] text-xs font-semibold text-[#5F706A]">
          Minh họa không gian — Bến Arumo bên sông Asera
        </div>
      </div>

      {/* Group 1: Địa điểm */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-[#293B36] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#376F64]" />
          <span>Địa điểm khởi đầu</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white border border-[#DCE6DF] rounded-2xl p-5 flex flex-col justify-between hover:border-[#376F64] hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2.5 py-0.5 rounded-full inline-block">
                  {loc.type}
                </span>
                <h3 className="font-extrabold text-lg text-[#293B36]">
                  {loc.title}
                </h3>
                <p className="text-sm text-[#5F706A] leading-relaxed">
                  {loc.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#DCE6DF]">
                <button
                  onClick={() => onNavigate(`/doc/${loc.firstMentionChapter}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#376F64] hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Xuất hiện ở: {loc.firstMentionTitle}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Group 2: Những điều cần biết */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-[#293B36] flex items-center gap-2">
          <Info className="w-5 h-5 text-[#376F64]" />
          <span>Những điều cần biết</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loreNotes.map((note, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#DCE6DF] rounded-2xl p-5 space-y-2 shadow-sm"
            >
              <h3 className="font-bold text-base text-[#293B36]">
                {note.title}
              </h3>
              <p className="text-sm text-[#5F706A] leading-relaxed">
                {note.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

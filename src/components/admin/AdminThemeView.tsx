import React, { useState } from 'react';
import { Palette, Save, Globe, CheckCircle2, Image, Users } from 'lucide-react';
import { ALL_CHARACTERS_DATA } from '../../data/publicCharacters';

export const AdminThemeView: React.FC = () => {
  const [novelTitle, setNovelTitle] = useState('Long Ấn Thức Tỉnh');
  const [tagline, setTagline] = useState('Ghé Arumo một chút. Ở đây, dòng sông chảy trên trời — còn một chuyến tàu đến sớm có thể làm mọi thứ đổi khác.');
  const [featuredCharIds, setFeaturedCharIds] = useState<string[]>([
    'char_rento', 'char_nari', 'char_dagan', 'char_seika'
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleChar = (id: string) => {
    if (featuredCharIds.includes(id)) {
      if (featuredCharIds.length > 1) {
        setFeaturedCharIds(prev => prev.filter(c => c !== id));
      }
    } else {
      if (featuredCharIds.length < 4) {
        setFeaturedCharIds(prev => [...prev, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#293B36] text-white text-xs font-bold shadow-xl animate-in fade-in">
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Trang chủ & Giao diện (CMS)
          </h1>
          <p className="text-xs text-[#5F706A]">
            Tùy biến lời giới thiệu, ảnh hero Arumo trong nắng sớm và 4 nhân vật nổi bật trên trang chủ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Đã lưu bản nháp giao diện. Website độc giả chưa thay đổi.')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#293B36] bg-[#FFFDF8] border border-[#DCE6DF] hover:bg-[#F2F8F5] transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-[#376F64]" />
            <span>Lưu bản nháp giao diện</span>
          </button>
          <button
            onClick={() => showToast('Đã áp dụng giao diện mới lên website công khai!')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>Áp dụng lên website</span>
          </button>
        </div>
      </div>

      {/* Hero Content Form */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-[#293B36] uppercase tracking-wider">
          Nội dung Hero Banner
        </h3>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#293B36]">Tên tiểu thuyết</label>
            <input
              type="text"
              value={novelTitle}
              onChange={(e) => setNovelTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-sm font-bold text-[#293B36]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#293B36]">Lời giới thiệu trang chủ</label>
            <textarea
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      {/* 4 Featured Characters Selector */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#293B36] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-[#376F64]" />
            <span>4 Nhân vật nổi bật (Đang chọn: {featuredCharIds.length}/4)</span>
          </h3>
          <span className="text-xs text-[#5F706A]">
            Bấm để chọn hoặc bỏ chọn
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {ALL_CHARACTERS_DATA.map((char) => {
            const isSelected = featuredCharIds.includes(char.id);

            return (
              <div
                key={char.id}
                onClick={() => handleToggleChar(char.id)}
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#376F64] bg-[#E4F1E9] ring-1 ring-[#376F64]'
                    : 'border-[#DCE6DF] bg-white hover:bg-[#FFFDF8]'
                }`}
              >
                <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={char.avatar || char.chibiArt}
                    alt={char.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-extrabold text-xs text-[#293B36] truncate">
                  {char.name}
                </div>
                <div className="text-[10px] text-[#5F706A] mt-0.5">
                  {isSelected ? '✓ Đang hiển thị' : 'Chưa chọn'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

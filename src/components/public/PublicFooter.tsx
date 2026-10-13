import React from 'react';
import { Shield } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#E4F1E9]/60 border-t border-[#DCE6DF] mt-24 py-12 text-[#293B36] transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: Brand & Philosophy */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/art/ui/river-mark.svg"
                alt="Long Ấn Thức Tỉnh"
                className="w-7 h-7 object-contain"
              />
              <span className="font-extrabold text-[18px] text-[#293B36] tracking-tight">
                Long Ấn Thức Tỉnh
              </span>
            </div>
            <p className="text-[14px] text-[#5F706A] italic max-w-[420px] leading-relaxed">
              “Một câu chuyện đang được viết tiếp.”
            </p>
            <p className="text-[13px] text-[#5F706A] max-w-[440px] leading-relaxed">
              Arumo trong nắng sớm — Không gian đọc tiểu thuyết kỳ ảo Á Đông, theo dõi từng bước chân của Rento, Nari và cư dân bên dòng sông trời Asera.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-[14px] text-[#293B36] uppercase tracking-wider">
              Khám phá
            </h4>
            <ul className="space-y-1.5 text-[14px] text-[#5F706A]">
              <li>
                <button
                  onClick={() => onNavigate('/muc-luc')}
                  className="hover:text-[#376F64] transition-colors"
                >
                  Mục lục phần & chương
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/nhan-vat')}
                  className="hover:text-[#376F64] transition-colors"
                >
                  Hồ sơ 21 nhân vật
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/the-gioi')}
                  className="hover:text-[#376F64] transition-colors"
                >
                  Bến Arumo & Sông Asera
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/truyen-tranh')}
                  className="hover:text-[#376F64] transition-colors"
                >
                  Bản chuyển thể truyện tranh
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/tu-sach')}
                  className="hover:text-[#376F64] transition-colors"
                >
                  Tủ sách cá nhân
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Management & Internal Access */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-[14px] text-[#293B36] uppercase tracking-wider">
              Quản trị & Dự án
            </h4>
            <p className="text-[13px] text-[#5F706A] leading-relaxed">
              Bản quyền tác phẩm thuộc về nhóm sáng tác Long Ấn.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/admin')}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#5F706A] hover:text-[#376F64] px-2.5 py-1.5 rounded-lg bg-white/70 border border-[#DCE6DF] hover:border-[#376F64] transition-all shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-[#376F64]" />
                <span>Bàn làm việc Arumo (Admin)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#DCE6DF]/80 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#5F706A] gap-3">
          <p>© 2026 Long Ấn Thức Tỉnh. Tất cả nội dung văn bản và hình ảnh được bảo lưu.</p>
          <p className="text-[11px] text-[#5F706A]/80">
            Phiên bản phát hành 1.0.0 • Thiết kế & Kiến trúc: Arumo trong nắng sớm
          </p>
        </div>
      </div>
    </footer>
  );
};

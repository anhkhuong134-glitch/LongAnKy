import React from 'react';
import { BookOpen, Users, Palette, CheckCircle2, Clock } from 'lucide-react';

interface ComicLandingPageProps {
  onNavigate: (path: string) => void;
}

export const ComicLandingPage: React.FC<ComicLandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-[880px] mx-auto py-8 md:py-12 space-y-12">
      {/* Hero Header */}
      <div className="bg-[#E5F1F7]/70 border border-[#CDE1EC] rounded-3xl p-8 md:p-12 text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-white rounded-3xl border border-[#CDE1EC] p-4 flex items-center justify-center shadow-sm">
          <img
            src="/art/ui/open-book.svg"
            alt="Bản chuyển thể truyện tranh"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#376F64] bg-white px-3 py-1 rounded-full border border-[#CDE1EC]">
            Dự án chuyển thể
          </span>
          <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#293B36] tracking-tight">
            Long Ấn Thức Tỉnh — Bản truyện tranh
          </h1>
          <p className="text-base text-[#5F706A]">
            Từ những dòng chữ đầu tiên đến từng khung tranh.
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#376F64] font-bold text-sm border border-[#CDE1EC] shadow-sm">
          <Clock className="w-4 h-4" />
          <span>Đang thực hiện bản chuyển thể</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/doc/doc_chap_prologue')}
            className="px-6 py-3 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm"
          >
            Đọc truyện chữ
          </button>
          <button
            onClick={() => onNavigate('/nhan-vat')}
            className="px-5 py-3 rounded-xl font-bold text-[#376F64] bg-white border border-[#CDE1EC] hover:bg-[#E5F1F7] transition-all"
          >
            Gặp các nhân vật
          </button>
        </div>
      </div>

      {/* Actual Adaptation Pipeline Status */}
      <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#293B36]">
          Tiến trình sản xuất bản tranh
        </h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F2F8F5] border border-[#DCE6DF]/70">
            <CheckCircle2 className="w-5 h-5 text-[#376F64] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-[#293B36]">
                1. Bộ tạo hình Chibi 21 nhân vật (Phiên bản v0.3)
              </h3>
              <p className="text-xs text-[#5F706A] mt-0.5">
                Đã hoàn tất 21/21 bản vẽ nguyên tác phục vụ nhận diện nhân vật, trang phục và đạo cụ tại bến Arumo.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F2F8F5] border border-[#DCE6DF]/70">
            <CheckCircle2 className="w-5 h-5 text-[#376F64] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-[#293B36]">
                2. Kịch bản phân cảnh Mở đầu & Chương 1
              </h3>
              <p className="text-xs text-[#5F706A] mt-0.5">
                Đã chuyển thể văn xuôi thành danh sách hành động, góc nhìn và thoại cho từng trang.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF]">
            <Clock className="w-5 h-5 text-[#376F64] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-[#293B36]">
                3. Phác thảo phân khung (Storyboard)
              </h3>
              <p className="text-xs text-[#5F706A] mt-0.5">
                Đang bố trí luồng đọc dọc và tỷ lệ khung hình cho các phân đoạn kịch tính giếng cảng.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 opacity-60">
            <Palette className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-gray-700">
                4. Đi nét & Lên màu hoàn thiện
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Sẽ tiến hành ngay sau khi khâu phân khung được duyệt nội bộ trong Bàn làm việc Arumo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

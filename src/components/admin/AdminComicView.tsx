import React, { useState } from 'react';
import { Film, CheckCircle2, Clock, Plus, Layers, Image, Eye } from 'lucide-react';

export const AdminComicView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2); // 1 to 7

  const steps = [
    { num: 1, name: 'Kịch bản cảnh', status: 'Hoàn thành' },
    { num: 2, name: 'Phân khung (Storyboard)', status: 'Đang làm' },
    { num: 3, name: 'Phác thảo nét thô', status: 'Chưa làm' },
    { num: 4, name: 'Tranh hoàn thiện & Lên màu', status: 'Chưa làm' },
    { num: 5, name: 'Chữ & Thoại truyện tranh', status: 'Chưa làm' },
    { num: 6, name: 'Rà soát tổng thể', status: 'Chưa làm' },
    { num: 7, name: 'Công khai tập tranh', status: 'Chưa làm' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Chuyển thể truyện tranh: Tập 1 (Mở đầu)
          </h1>
          <p className="text-xs text-[#5F706A]">
            Quy trình sản xuất bản tranh tương ứng từ Mở đầu và Chương 1 tiểu thuyết chữ.
          </p>
        </div>

        <button
          disabled
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gray-200 text-gray-500 cursor-not-allowed"
          title="Chỉ đăng khi hoàn tất rà soát ảnh thật"
        >
          Đăng tập tranh ra website
        </button>
      </div>

      {/* 7 Production Steps Bar */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`flex-1 min-w-[130px] p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                activeStep === st.num
                  ? 'border-[#376F64] bg-[#E4F1E9] text-[#376F64]'
                  : 'border-[#DCE6DF] text-[#293B36] hover:bg-[#FFFDF8]'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#5F706A]">
                Bước {st.num}
              </div>
              <div className="font-extrabold text-xs mt-0.5 line-clamp-1">
                {st.name}
              </div>
              <div className="text-[10px] mt-1 font-semibold">
                {st.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Workspace */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-4">
          <h3 className="font-extrabold text-base text-[#293B36]">
            Khung làm việc: Bước {activeStep} — {steps[activeStep - 1].name}
          </h3>
          <span className="text-xs font-bold text-[#376F64] bg-[#E4F1E9] px-2.5 py-1 rounded-full">
            {steps[activeStep - 1].status}
          </span>
        </div>

        {activeStep === 1 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-[#293B36]">Kịch bản phân cảnh: Mở đầu & Giếng cảng</h4>
            <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-2">
              <p className="font-bold text-[#376F64]">Cảnh 1: Đêm ở bến Arumo</p>
              <p className="text-[#5F706A]">Địa điểm: Bến cảng hạ lưu ven sông Asera • Nhân vật: Rento, Tovan, 2 người khuân hàng.</p>
              <p className="text-[#293B36]">Hành động: Rento quỳ soi đèn vào hộp bánh răng máy tời số bảy. Tovan tới thu sổ và từ chối ký phiếu bồi thường.</p>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-[#293B36]">Phân khung Storyboard (Bản dọc Webtoon & Trang)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] space-y-2 text-center">
                <div className="aspect-[3/4] bg-white rounded-lg border border-[#DCE6DF] flex items-center justify-center text-[#5F706A] text-xs">
                  Khung 1: Toàn cảnh sông Asera trên mây
                </div>
                <span className="font-bold text-[#293B36]">Trang 1 • Khung 1</span>
              </div>
              <div className="p-4 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] space-y-2 text-center">
                <div className="aspect-[3/4] bg-white rounded-lg border border-[#DCE6DF] flex items-center justify-center text-[#5F706A] text-xs">
                  Khung 2: Cận cảnh Rento bên máy tời
                </div>
                <span className="font-bold text-[#293B36]">Trang 1 • Khung 2</span>
              </div>
              <div className="p-4 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] space-y-2 text-center">
                <div className="aspect-[3/4] bg-white rounded-lg border border-[#DCE6DF] flex items-center justify-center text-[#5F706A] text-xs">
                  Khung 3: Mũi tàu lao qua cột nước
                </div>
                <span className="font-bold text-[#293B36]">Trang 2 • Khung 1</span>
              </div>
            </div>
          </div>
        )}

        {activeStep > 2 && (
          <div className="text-center py-8 space-y-2 text-xs text-[#5F706A]">
            <Clock className="w-8 h-8 text-[#5F706A] mx-auto opacity-40" />
            <p>Bước này sẽ tự động kích hoạt sau khi bước Phân khung được duyệt hoàn tất.</p>
          </div>
        )}
      </div>
    </div>
  );
};

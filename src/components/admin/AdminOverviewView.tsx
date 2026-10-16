import React from 'react';
import {
  BookOpen, Users, Film, CheckSquare, Clock, ArrowRight,
  Sparkles, AlertCircle, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';
import { ALL_CHARACTERS_DATA } from '../../data/publicCharacters';
import { UserService } from '../../services/userService';

interface AdminOverviewViewProps {
  onNavigate: (path: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ onNavigate }) => {
  // Real stats
  const publishedChaptersCount = 6; // Prologue + Chap 1..5
  const draftChaptersCount = 2; // Chap 6..7 in draft
  const incompleteCharactersCount = ALL_CHARACTERS_DATA.filter(c => !c.publicReady).length;
  const activeComicsCount = 1; // Storyboard prologue
  const totalUsersCount = UserService.getAllUsers().length;

  const tasksList = [
    { id: 't_seo', title: 'Tối ưu bài viết SEO & tự động sinh bài bằng AIKTP Engine', area: 'SEO & Content', status: 'Trực tiếp', link: '/admin/seo' },
    { id: 't0', title: 'Quản lý tài khoản độc giả & cập nhật liên tục từ Database', area: 'Tài khoản', status: 'Trực tiếp', link: '/admin/tai-khoan' },
    { id: 't1', title: 'Hoàn thiện hồ sơ công khai cho Tovan và Eli', area: 'Nhân vật', status: 'Đang làm', link: '/admin/nhan-vat' },
    { id: 't2', title: 'Biên tập Chương 6 — Nước lạnh dưới giếng cảng', area: 'Truyện chữ', status: 'Đang làm', link: '/admin/chuong' },
    { id: 't3', title: 'Hoàn tất phác thảo phân khung tập Mở đầu truyện tranh', area: 'Truyện tranh', status: 'Chưa làm', link: '/admin/truyen-tranh' },
    { id: 't4', title: 'Kiểm tra khớp nối 21 ảnh chibi với hồ sơ nội bộ', area: 'Đồ họa', status: 'Hoàn thành', link: '/admin/thu-vien' },
    { id: 't5', title: 'So sánh khác biệt bản thảo mới từ Google Docs', area: 'Bản thảo', status: 'Chờ xem lại', link: '/admin/nhap-noi-dung' },
  ];

  const recentEdits = [
    { title: 'Chương 1 — Chiếc tàu đến sớm', time: 'Hôm nay 15:30', status: 'Đã xuất bản' },
    { title: 'Hồ sơ nhân vật: Rento & Nari', time: 'Hôm nay 14:15', status: 'Đã xuất bản' },
    { title: 'Chương 6 (Bản nháp)', time: 'Hôm qua 21:00', status: 'Bản nháp' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Bàn làm việc của bạn
          </h1>
          <p className="text-xs text-[#5F706A]">
            Không gian điều phối toàn diện tiểu thuyết Long Ấn Thức Tỉnh & bản chuyển thể.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/admin/chuong')}
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shadow-sm flex items-center gap-2"
        >
          <span>Tiếp tục công việc gần nhất</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => onNavigate('/admin/chuong')}
          className="bg-white border border-[#DCE6DF] rounded-2xl p-5 hover:border-[#376F64] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#376F64] mb-3">
            <span className="w-9 h-9 rounded-xl bg-[#E4F1E9] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded-full">
              Chính thức
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] group-hover:text-[#376F64] transition-colors">
            {publishedChaptersCount}
          </div>
          <div className="text-xs font-bold text-[#5F706A] mt-0.5">
            Chương công khai
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => onNavigate('/admin/chuong')}
          className="bg-white border border-[#DCE6DF] rounded-2xl p-5 hover:border-[#376F64] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#376F64] mb-3">
            <span className="w-9 h-9 rounded-xl bg-[#F8EDCB] text-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-[#F8EDCB] px-2 py-0.5 rounded-full">
              Nội bộ
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] group-hover:text-[#376F64] transition-colors">
            {draftChaptersCount}
          </div>
          <div className="text-xs font-bold text-[#5F706A] mt-0.5">
            Bản nháp đang sửa
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => onNavigate('/admin/nhan-vat')}
          className="bg-white border border-[#DCE6DF] rounded-2xl p-5 hover:border-[#376F64] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#376F64] mb-3">
            <span className="w-9 h-9 rounded-xl bg-[#F8E3E4] text-[#A33D49] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-[#A33D49] bg-[#F8E3E4] px-2 py-0.5 rounded-full">
              Cần rà soát
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] group-hover:text-[#376F64] transition-colors">
            {incompleteCharactersCount}
          </div>
          <div className="text-xs font-bold text-[#5F706A] mt-0.5">
            Hồ sơ nhân vật
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => onNavigate('/admin/truyen-tranh')}
          className="bg-white border border-[#DCE6DF] rounded-2xl p-5 hover:border-[#376F64] transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-[#376F64] mb-3">
            <span className="w-9 h-9 rounded-xl bg-[#E5F1F7] text-[#293B36] flex items-center justify-center">
              <Film className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded-full">
              Phân khung
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] group-hover:text-[#376F64] transition-colors">
            {activeComicsCount}
          </div>
          <div className="text-xs font-bold text-[#5F706A] mt-0.5">
            Chương tranh
          </div>
        </div>

        {/* Card 5: Quản lý tài khoản Live DB */}
        <div
          onClick={() => onNavigate('/admin/tai-khoan')}
          className="bg-white border border-[#DCE6DF] rounded-2xl p-5 hover:border-[#376F64] transition-all cursor-pointer shadow-xs group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-[#376F64] mb-3">
            <span className="w-9 h-9 rounded-xl bg-[#E4F1E9] text-[#376F64] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#376F64] animate-ping" />
              Live DB
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] group-hover:text-[#376F64] transition-colors">
            {totalUsersCount}
          </div>
          <div className="text-xs font-bold text-[#5F706A] mt-0.5">
            Quản lý tài khoản
          </div>
        </div>
      </div>

      {/* Main Grid 8 / 4 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Tasks & Drafts in progress */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Việc cần làm */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#293B36] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#376F64]" />
                <span>Việc cần làm ưu tiên</span>
              </h3>
              <button
                onClick={() => onNavigate('/admin/cong-viec')}
                className="text-xs font-bold text-[#376F64] hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            <div className="divide-y divide-[#DCE6DF]">
              {tasksList.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onNavigate(task.link)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-[#FFFDF8] cursor-pointer group transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[11px] font-bold text-[#5F706A]">
                      [{task.area}]
                    </span>
                    <h4 className="font-bold text-sm text-[#293B36] group-hover:text-[#376F64] transition-colors truncate">
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        task.status === 'Hoàn thành'
                          ? 'bg-[#E4F1E9] text-[#376F64]'
                          : task.status === 'Đang làm'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {task.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#5F706A] group-hover:text-[#376F64]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Bản đang chỉnh sửa */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-[#293B36]">
              Bản đang chỉnh sửa gần đây
            </h3>
            <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-700 bg-[#F8EDCB] px-2 py-0.5 rounded-full inline-block mb-1">
                  Bản nháp tác giả
                </span>
                <h4 className="font-bold text-sm text-[#293B36]">
                  Chương 6 — Nước lạnh dưới giếng cảng
                </h4>
                <p className="text-xs text-[#5F706A] mt-0.5">
                  Tự động lưu: 14 phút trước • Độc giả vẫn đang đọc Chương 1–5
                </p>
              </div>
              <button
                onClick={() => onNavigate('/admin/chuong')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all"
              >
                Mở viết tiếp
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Status info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Lần đăng gần nhất */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#376F64]">
              Lần đăng gần nhất
            </h3>
            <div className="space-y-1">
              <span className="font-bold text-sm text-[#293B36]">
                Phiên bản Snapshot 1.0.0
              </span>
              <p className="text-xs text-[#5F706A]">
                Phát hành Mở đầu và Chương 1–5 vào ngày 13/10/2026.
              </p>
            </div>
          </div>

          {/* Nội dung còn thiếu */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#A33D49]">
              Nội dung cần hoàn thiện
            </h3>
            <ul className="space-y-2 text-xs text-[#293B36]">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#A33D49] shrink-0 mt-0.5" />
                <span>13 hồ sơ nhân vật cần duyệt các khối hiển thị công khai.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Phác thảo phân khung tập Mở đầu truyện tranh chưa có ảnh scan.</span>
              </li>
            </ul>
          </div>

          {/* Thay đổi gần đây */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#5F706A]">
              Thay đổi gần đây
            </h3>
            <div className="space-y-2.5">
              {recentEdits.map((ed, idx) => (
                <div key={idx} className="text-xs border-b border-[#DCE6DF]/60 pb-2">
                  <div className="font-bold text-[#293B36]">{ed.title}</div>
                  <div className="flex items-center justify-between text-[#5F706A] mt-0.5">
                    <span>{ed.time}</span>
                    <span className="font-semibold text-[#376F64]">{ed.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

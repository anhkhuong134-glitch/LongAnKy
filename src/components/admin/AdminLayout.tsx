import React, { useState } from 'react';
import {
  LayoutDashboard, BookOpen, Users, Compass, Film,
  CheckSquare, Image, RefreshCw, Palette, MessageSquare,
  UserCheck, History, Settings, ExternalLink, LogOut,
  Menu, X, Shield, ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminLayoutProps {
  currentPath: string;
  currentUser: UserProfile | null;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  currentUser,
  onNavigate,
  onLogout,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuSections = [
    {
      title: 'TỔNG QUAN',
      items: [
        { label: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'NỘI DUNG',
      items: [
        { label: 'Phần & Chương', path: '/admin/chuong', icon: BookOpen },
        { label: '21 Nhân vật', path: '/admin/nhan-vat', icon: Users },
        { label: 'Thế giới & Logic', path: '/admin/the-gioi', icon: Compass },
        { label: 'Truyện tranh', path: '/admin/truyen-tranh', icon: Film },
      ],
    },
    {
      title: 'SẢN XUẤT',
      items: [
        { label: 'Công việc & Tiến độ', path: '/admin/cong-viec', icon: CheckSquare },
        { label: 'Thư viện 21 ảnh', path: '/admin/thu-vien', icon: Image },
        { label: 'Nhập từ Google Docs', path: '/admin/nhap-noi-dung', icon: RefreshCw },
      ],
    },
    {
      title: 'WEBSITE & NGƯỜI DÙNG',
      items: [
        { label: 'Quản lý tài khoản', path: '/admin/tai-khoan', icon: UserCheck, badge: 'Live DB' },
        { label: 'Trang chủ & Giao diện', path: '/admin/giao-dien', icon: Palette },
        { label: 'Bình luận độc giả', path: '/admin/binh-luan', icon: MessageSquare },
      ],
    },
    {
      title: 'HỆ THỐNG',
      items: [
        { label: 'Lịch sử & Khôi phục', path: '/admin/lich-su', icon: History },
        { label: 'Cài đặt hệ thống', path: '/admin/cai-dat', icon: Settings },
      ],
    },
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    setSidebarOpen(false);
  };

  const isCurrentActive = (itemPath: string) => {
    if (itemPath === '/admin') return currentPath === '/admin' || currentPath === '/admin/';
    if (itemPath === '/admin/tai-khoan') return currentPath === '/admin/tai-khoan' || currentPath === '/admin/doc-gia';
    return currentPath.startsWith(itemPath);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#293B36] flex flex-col antialiased">
      {/* Admin Top Header (64px desktop, 56px mobile) */}
      <header className="sticky top-0 z-40 h-14 md:h-16 bg-white border-b border-[#DCE6DF] px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left: Brand & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-[#293B36] hover:bg-[#F2F8F5]"
            aria-label="Mở menu quản trị"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#E4F1E9] flex items-center justify-center text-[#376F64]">
              <Shield className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-base md:text-lg text-[#293B36] tracking-tight">
              Bàn làm việc Arumo
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#5F706A] ml-2">
            <span>/</span>
            <span className="font-bold text-[#376F64]">Khu quản trị tác giả & biên tập</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Xem Website */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all"
            title="Xem website độc giả"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Xem website</span>
          </button>

          {/* Admin User */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#DCE6DF]">
            <span className="text-xs font-bold text-[#293B36] hidden md:inline">
              {currentUser?.displayName || 'Quản trị viên'}
            </span>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#5F706A] hover:text-[#A33D49] hover:bg-red-50 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Left (240px desktop) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-[#FFFDF8] border-r border-[#DCE6DF] flex flex-col justify-between overflow-y-auto transform transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          }`}
          style={{ top: '64px' }}
        >
          <div className="p-4 space-y-6">
            {menuSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#5F706A]/80 block mb-1">
                  {sec.title}
                </span>
                {sec.items.map((it) => {
                  const active = isCurrentActive(it.path);
                  const Icon = it.icon;

                  return (
                    <button
                      key={it.path}
                      onClick={() => handleItemClick(it.path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left relative ${
                        active
                          ? 'bg-[#E4F1E9] text-[#376F64]'
                          : 'text-[#293B36] hover:bg-white hover:text-[#376F64]'
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#376F64] rounded-r"></span>
                      )}
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{it.label}</span>
                      {(it as any).badge && (
                        <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#376F64] text-white shrink-0 tracking-wider shadow-xs">
                          {(it as any).badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Sidebar Info */}
          <div className="p-4 border-t border-[#DCE6DF] text-[11px] text-[#5F706A] space-y-1">
            <p className="font-bold text-[#293B36]">Long Ấn Thức Tỉnh</p>
            <p>Hệ quản trị Arumo v1.0</p>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          ></div>
        )}

        {/* Main Workspace Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

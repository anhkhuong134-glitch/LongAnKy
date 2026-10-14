import React, { useState } from 'react';
import { BookOpen, Bookmark, User, Menu, X, Shield } from 'lucide-react';
import { UserProfile } from '../../types';

interface PublicHeaderProps {
  currentPath: string;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onNavigate: (path: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentPath,
  currentUser,
  onOpenAuthModal,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Câu chuyện', path: '/' },
    { label: 'Mục lục', path: '/muc-luc' },
    { label: 'Nhân vật', path: '/nhan-vat' },
    { label: 'Thế giới', path: '/the-gioi' },
    { label: 'Game Soul Seal', path: '/game' },
    { label: 'Truyện tranh', path: '/truyen-tranh' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '')) return true;
    return currentPath.startsWith(path) && path !== '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#DCE6DF] transition-all">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-8 h-[60px] md:h-[72px] flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-3 text-left group transition-transform active:scale-95"
        >
          <img
            src="/art/ui/river-mark.svg"
            alt="Biểu tượng Sông Trời Arumo"
            className="w-8 h-8 object-contain transition-transform group-hover:rotate-6"
          />
          <div>
            <span className="font-extrabold text-[18px] md:text-[20px] text-[#293B36] tracking-tight leading-none block">
              Long Ấn Thức Tỉnh
            </span>
            <span className="text-[11px] text-[#5F706A] tracking-wider block mt-0.5">
              Arumo Trong Nắng Sớm
            </span>
          </div>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-3.5 py-2 rounded-xl text-[15px] font-semibold transition-all ${
                  active
                    ? 'bg-[#E4F1E9] text-[#376F64] shadow-sm'
                    : 'text-[#293B36] hover:bg-[#F2F8F5] hover:text-[#376F64]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Bookshelf & User) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Bookshelf */}
          <button
            onClick={() => handleNavClick('/tu-sach')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[14px] font-bold transition-all ${
              currentPath === '/tu-sach'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#293B36] hover:bg-[#F2F8F5]'
            }`}
            title="Tủ sách của bạn"
          >
            <Bookmark className="w-4 h-4 text-[#376F64]" />
            <span className="hidden sm:inline">Tủ sách</span>
          </button>

          {/* Admin shortcut if logged in as admin */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('/admin')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold bg-[#E4F1E9] text-[#376F64] hover:bg-[#376F64] hover:text-white transition-all shadow-sm"
              title="Vào Bàn làm việc Arumo"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline">Bàn làm việc</span>
            </button>
          )}

          {/* User Profile / Login */}
          {currentUser ? (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#DCE6DF] hover:border-[#376F64] transition-all text-left shadow-sm"
            >
              <span className="w-7 h-7 rounded-full bg-[#E4F1E9] flex items-center justify-center text-xs font-bold text-[#376F64]">
                {currentUser.avatar || currentUser.displayName.slice(0, 1)}
              </span>
              <span className="text-xs font-bold text-[#293B36] max-w-[90px] truncate hidden sm:inline">
                {currentUser.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('/dang-nhap')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[14px] font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm active:translate-y-0.5"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#293B36] hover:bg-[#F2F8F5] transition-colors ml-1"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] border-b border-[#DCE6DF] px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-[16px] font-bold transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#E4F1E9] text-[#376F64]'
                    : 'text-[#293B36] hover:bg-[#F2F8F5]'
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="w-2 h-2 rounded-full bg-[#376F64]"></span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

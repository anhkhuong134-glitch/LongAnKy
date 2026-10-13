import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, LogOut, Clock, Bookmark, Sparkles, Bell, Calendar, ChevronDown, Award, Play, ShieldCheck, Zap, Cloud, Database, Trophy } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { UserService } from '../../services/userService';

interface UserProfileDropdownProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenLeaderboard?: () => void;
  onUserUpdated: (user: UserProfile | null) => void;
  onNavigateChapter?: (type: 'novel' | 'comic', chapterId: string, partId?: string, chapterIndex?: number) => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenHistoryModal,
  onOpenLeaderboard,
  onUserUpdated,
  onNavigateChapter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckIn = () => {
    const res = UserService.dailyCheckIn();
    setToastMsg(res.message);
    if (res.success) {
      onUserUpdated(UserService.getCurrentUser());
    }
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleFollow = () => {
    const newStatus = UserService.toggleFollowStory();
    setToastMsg(newStatus ? 'Đã thêm truyện vào Tủ Sách Theo Dõi!' : 'Đã bỏ theo dõi truyện!');
    onUserUpdated(UserService.getCurrentUser());
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleLogout = () => {
    UserService.logout();
    onUserUpdated(null);
    setIsOpen(false);
  };

  if (!currentUser) {
    return (
      <button
        onClick={onOpenAuthModal}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/80 to-amber-600/80 hover:from-rose-500 hover:to-amber-500 border border-rose-400/30 text-white text-xs font-semibold shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
        title="Đăng nhập thành viên để lưu lịch sử đọc & nhận EXP"
      >
        <User className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Đăng Nhập</span>
      </button>
    );
  }

  // Calculate EXP percentage
  const expPercent = Math.min(100, Math.round((currentUser.exp / (currentUser.nextLevelExp || 100)) * 100));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Pill Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-rose-500/30 text-slate-200 transition-all cursor-pointer shadow-sm group"
        title="Tài khoản độc giả"
      >
        {/* Avatar with Level Badge */}
        <div className="relative">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-sm shadow-sm">
            {currentUser.avatar || '🐉'}
          </div>
          <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-black px-1 rounded bg-rose-600 text-white border border-rose-400">
            Lv.{currentUser.level}
          </span>
        </div>

        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold font-serif text-white group-hover:text-rose-300 transition-colors leading-tight truncate max-w-[100px]">
            {currentUser.displayName}
          </div>
          <div className="text-[9px] text-amber-300/80 font-mono leading-none">
            {currentUser.levelTitle}
          </div>
        </div>

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu (NetTruyen Style) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-84 rounded-2xl bg-slate-950/95 border border-rose-500/30 shadow-2xl backdrop-blur-2xl z-50 p-4 space-y-3.5 animate-fade-in select-none">
          {/* Toast Notification inside dropdown */}
          {toastMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center font-medium animate-pulse">
              {toastMsg}
            </div>
          )}

          {/* User Header */}
          <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-rose-500/20 shrink-0">
              {currentUser.avatar || '🐉'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-serif font-bold text-sm text-white truncate">
                  {currentUser.displayName}
                </h4>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white shrink-0">
                  Lv.{currentUser.level}
                </span>
              </div>
              <p className="text-[11px] text-amber-300 font-serif font-medium mt-0.5">
                ✦ {currentUser.levelTitle}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                @{currentUser.username} • {currentUser.streakDays || 1} ngày liên tiếp
              </p>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-emerald-400 font-mono">
                <span className="text-[10px]">🍃</span>
                <span>MongoDB Atlas • atlas-cerise-battery</span>
              </div>
            </div>
          </div>

          {/* EXP Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Tu Vi EXP:</span>
              <span className="text-amber-300 font-bold">
                {currentUser.exp} / {currentUser.nextLevelExp} EXP ({expPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-300"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>

          {/* Daily Check-in Button */}
          <button
            onClick={handleCheckIn}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Điểm Danh Hằng Ngày (+50 EXP)</span>
          </button>

          {/* Đang đọc dở (Chỉ tài khoản người dùng có) */}
          {currentUser.lastRead && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-amber-300 uppercase flex items-center gap-1">
                  <span>📍 ĐANG ĐỌC DỞ</span>
                </span>
                <span className="text-slate-400 font-mono">{currentUser.lastRead.progressPercent}%</span>
              </div>
              <div className="font-serif font-bold text-xs text-white truncate">
                {currentUser.lastRead.chapterTitle}
              </div>
              {onNavigateChapter && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateChapter(
                      currentUser.lastRead!.type,
                      currentUser.lastRead!.chapterId,
                      currentUser.lastRead!.partId,
                      currentUser.lastRead!.chapterIndex
                    );
                  }}
                  className="w-full py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Tiếp Tục Đọc Ngay</span>
                </button>
              )}
            </div>
          )}

          {/* Menu Actions */}
          <div className="space-y-1 pt-1 border-t border-white/10">
            {/* Lịch Sử Đọc (NetTruyen) */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenHistoryModal();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Lịch Sử Đọc (NetTruyen)</span>
              </div>
              <span className="text-[10px] text-slate-500">Xem lại</span>
            </button>

            {/* Bảng Phong Thần Đạo Hữu */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenLeaderboard) onOpenLeaderboard();
              }}
              className="w-full px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-amber-300 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Bảng Phong Thần Đạo Hữu</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/20">Top Tu Vi</span>
            </button>

            {/* Theo Dõi Truyện */}
            <button
              onClick={handleToggleFollow}
              className="w-full px-3 py-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bell className={`w-3.5 h-3.5 ${currentUser.isFollowing ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                <span>{currentUser.isFollowing ? 'Đang Theo Dõi Truyện' : 'Bật Theo Dõi Truyện'}</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                currentUser.isFollowing ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {currentUser.isFollowing ? 'Đã bật' : 'Tắt'}
              </span>
            </button>
          </div>

          {/* Member Privileges Notice */}
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[10px] text-purple-200/90 space-y-1">
            <div className="font-bold flex items-center gap-1 text-purple-300">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>ĐẶC QUYỀN ĐẠO HỮU THÀNH VIÊN</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              ✓ Tự động lưu vết chương &amp; dòng đọc dở <br />
              ✓ Huy hiệu Tu Vi trong bình luận <br />
              ✓ Sổ tay trích đoạn tâm đắc độc quyền
            </p>
          </div>

          {/* Logout Button */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất Tài Khoản</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

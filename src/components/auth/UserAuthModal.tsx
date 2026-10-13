import React, { useState } from 'react';
import { X, Sparkles, User, Mail, ShieldCheck, Zap, Award } from 'lucide-react';
import { UserService } from '../../services/userService';
import { UserProfile, AVATAR_PRESETS } from '../../types/user';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐉');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = UserService.login(username);
    if (res.success && res.user) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        onClose();
      }, 600);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = UserService.register(username, displayName, email, selectedAvatar);
    if (res.success && res.user) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleGuestQuickLogin = () => {
    const guest = UserService.guestLogin();
    setSuccessMsg(`Đã tạo tài khoản khách: ${guest.displayName}!`);
    setTimeout(() => {
      onLoginSuccess(guest);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-rose-500/30 shadow-[-10px_10px_50px_rgba(244,63,94,0.2)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-rose-500/30">
              🐉
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-1.5">
                <span>Thành Viên Độc Giả</span>
                <span className="text-amber-400 text-xs">✨</span>
              </h3>
              <p className="text-[11px] text-rose-300/80">Lưu tiến độ đọc • Nhận EXP tu vi NetTruyen</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Guest 1-Click Button */}
        <div className="p-4 bg-rose-500/10 border-b border-rose-500/20">
          <button
            type="button"
            onClick={handleGuestQuickLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Đăng Nhập Nhanh 1-Click (Không cần mật khẩu)</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-1.5">
            Tạo tài khoản khách tức thì để lưu lịch sử đọc & thăng cấp tu vi ngay lập tức.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/30">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-serif font-bold text-center transition-all cursor-pointer ${
              tab === 'login'
                ? 'text-rose-300 border-b-2 border-rose-500 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-serif font-bold text-center transition-all cursor-pointer ${
              tab === 'register'
                ? 'text-rose-300 border-b-2 border-rose-500 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đăng Ký Tài Khoản Mới
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              🎉 {successMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tên tài khoản hoặc Email:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="ví dụ: longanky_fan hoặc email..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-400 text-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-serif font-bold text-xs shadow-lg shadow-rose-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Đăng Nhập Thành Viên</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tên tài khoản (viết liền không dấu):
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ví dụ: daohuu_asera"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-400 text-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Biệt danh hiển thị (khi bình luận):
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="ví dụ: Mèo Lười Đọc Truyện"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-400 text-slate-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email (tùy chọn để khôi phục):
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-rose-400 text-slate-200 text-xs outline-none"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Chọn Huy Hiệu Avatar Tu Vi:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatar(preset.icon)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center text-lg border transition-all cursor-pointer ${
                        selectedAvatar === preset.icon
                          ? 'border-rose-400 bg-rose-500/25 scale-110 shadow-md shadow-rose-500/30'
                          : 'border-white/10 bg-slate-800/60 hover:bg-white/10'
                      }`}
                      title={preset.label}
                    >
                      <span>{preset.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-serif font-bold text-xs shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Đăng Ký & Nhận 50 EXP Tu Vi</span>
              </button>
            </form>
          )}

          {/* Member Benefits Footer (NetTruyen Perks) */}
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Lưu lịch sử từng chương
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Đánh dấu chap đã đọc
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Điểm danh nhận EXP
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Bình luận có huy hiệu
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

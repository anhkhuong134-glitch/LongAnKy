import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  KeyRound,
  Database
} from 'lucide-react';
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
  
  // Login form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form states
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐉');

  // Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu xác thực tài khoản!');
      return;
    }

    const res = UserService.login(loginUsername, loginPassword);
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

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu bảo mật phải có ít nhất 6 ký tự!');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
      return;
    }

    const res = UserService.register({
      username: regUsername,
      password: regPassword,
      displayName,
      email,
      avatar: selectedAvatar,
    });

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-amber-500/30 shadow-[-10px_10px_50px_rgba(245,158,11,0.2)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-amber-500/30">
              🐉
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-1.5">
                <span>Tài Khoản Đạo Hữu Thành Viên</span>
                <span className="text-amber-400 text-xs">✨</span>
              </h3>
              <p className="text-[11px] text-amber-300/80 flex items-center gap-1 mt-0.5">
                <Database className="w-3 h-3 text-amber-400" />
                <span>Xác thực mật khẩu & Đồng bộ tiến độ đọc NetTruyen</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/40">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-serif font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'text-amber-300 border-b-2 border-amber-500 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-serif font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'text-amber-300 border-b-2 border-amber-500 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Tạo Tài Khoản Mới</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tên tài khoản hoặc Email:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    placeholder="Nhập tên tài khoản hoặc email..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Mật khẩu tài khoản:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-serif font-bold text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Xác Thực & Đăng Nhập</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tên đăng nhập (viết liền không dấu):
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="ví dụ: daohuu_longan"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mật khẩu (≥ 6 ký tự):
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Mật khẩu..."
                      className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nhập lại mật khẩu:
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Nhập lại..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Display Name */}
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email (tùy chọn để khôi phục):
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                  />
                </div>
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
                          ? 'border-amber-400 bg-amber-500/25 scale-110 shadow-md shadow-amber-500/30'
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
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-serif font-bold text-xs shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Đăng Ký & Nhận 50 EXP Tu Vi</span>
              </button>
            </form>
          )}

          {/* Member Benefits Footer (NetTruyen Perks) */}
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Xác thực mật khẩu database
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Lưu lịch sử từng chương
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Đánh dấu chap đã đọc
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

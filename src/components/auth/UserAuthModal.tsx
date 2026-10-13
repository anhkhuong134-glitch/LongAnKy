import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Info
} from 'lucide-react';
import { UserService, DatabaseStatus } from '../../services/userService';
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

  // Async & Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [showDbGuide, setShowDbGuide] = useState(false);

  // Check database status when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      UserService.checkDatabaseStatus().then(status => {
        setDbStatus(status);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu xác thực tài khoản!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await UserService.login(loginUsername, loginPassword);
      if (res.success && res.user) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối khi đăng nhập. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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

    setIsLoading(true);
    try {
      const res = await UserService.register({
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
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi lưu tài khoản. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
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
                <span>Xác thực mật khẩu &amp; Database Vercel Cloud</span>
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

        {/* Database Status Strip */}
        <div className="px-5 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`} />
            <span className="text-slate-300 font-medium">
              {dbStatus?.connected ? (
                <span className="text-emerald-300 flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span>Database: <strong>{dbStatus.provider} {dbStatus.userCount !== undefined ? `(${dbStatus.userCount} tài khoản)` : ''}</strong></span>
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px]">
                  <span>🍃</span>
                  <span>MongoDB Atlas: <strong>atlas-cerise-battery</strong></span>
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowDbGuide(prev => !prev)}
            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 transition-colors cursor-pointer"
            title="Xem trạng thái kết nối Database"
          >
            <Info className="w-3 h-3" />
            <span>{showDbGuide ? 'Đóng' : 'Chi Tiết DB'}</span>
          </button>
        </div>

        {/* Collapsible Database Connection Guide */}
        {showDbGuide && (
          <div className="p-3.5 bg-emerald-950/40 border-b border-emerald-500/20 text-[11px] text-emerald-200/90 space-y-1.5 animate-fade-in">
            <div className="font-bold flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cơ Sở Dữ Liệu: MongoDB Atlas Integration</span>
            </div>
            <div className="text-[10px] text-slate-300 space-y-1 pl-1">
              <p>• <strong>Cluster:</strong> <code className="text-emerald-300 bg-black/40 px-1 py-0.5 rounded">atlas-cerise-battery</code> (MongoDB Atlas Free Plan)</p>
              <p>• <strong>Dự án Vercel:</strong> <code className="text-emerald-300 bg-black/40 px-1 py-0.5 rounded">thuctinhlongan</code> (All Environments)</p>
              <p>• <strong>Lưu trữ:</strong> Tài khoản, mật khẩu xác thực, tiến độ đọc từng chương, tu vi EXP và sổ tay được lưu trực tiếp vào collection <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">users</code>.</p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/40">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-xs font-semibold font-serif transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              tab === 'login'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Đăng Nhập Mật Khẩu</span>
          </button>

          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-xs font-semibold font-serif transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              tab === 'register'
                ? 'border-rose-400 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Đăng Ký Tài Khoản Mới</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORM 1: LOGIN WITH PASSWORD VERIFICATION */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tên đăng nhập hoặc Email:</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="nhập tên tài khoản..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mật khẩu bảo mật:</span>
                  </span>
                  <span className="text-[10px] text-amber-400/80">Xác thực Database</span>
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="nhập mật khẩu của bạn..."
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 disabled:opacity-50 text-slate-950 font-serif font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                    <span>Đang Xác Thực Cơ Sở Dữ Liệu...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-slate-950" />
                    <span>Xác Thực Mật Khẩu &amp; Đăng Nhập</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Chưa có tài khoản? Bấm vào đây để đăng ký mới →
                </button>
              </div>
            </form>
          )}

          {/* FORM 2: REGISTER WITH REAL PASSWORD */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-400" />
                  <span>Tên đăng nhập (viết liền không dấu):</span>
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  placeholder="ví dụ: longkiem_dao, huyennguyet"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mật khẩu (tối thiểu 6 ký tự):</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="nhập mật khẩu an toàn..."
                    className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Xác nhận lại mật khẩu:</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="nhập lại mật khẩu ở trên..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-slate-200 text-xs outline-none"
                />
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
                disabled={isLoading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 disabled:opacity-50 text-slate-950 font-serif font-bold text-xs shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                    <span>Đang Lưu Vào Cơ Sở Dữ Liệu...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Đăng Ký &amp; Lưu Vào Database (+50 EXP)</span>
                  </>
                )}
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
              <span className="text-emerald-400">✓</span> Đồng bộ tài khoản đám mây
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield, Mail, Sparkles, CheckCircle2, UserPlus, Database } from 'lucide-react';
import { UserService } from '../../services/userService';
import { UserProfile } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

const AVATAR_OPTIONS = ['🐉', '🌸', '⚡', '🗡️', '👑', '🛡️', '🌙', '🦊', '✨', '🔥'];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register states
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🐉');

  // Common UI states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await UserService.login(username.trim(), password);

      if (res.success && res.user) {
        onLoginSuccess(res.user);

        // Redirect based on role verified by server
        if (res.user.role === 'admin') {
          onNavigate('/admin');
        } else {
          onNavigate('/');
        }
      } else {
        setErrorMessage(res.message || 'Tên đăng nhập hoặc mật khẩu chưa đúng.');
      }
    } catch (err) {
      setErrorMessage('Chưa kết nối được máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUser = regUsername.trim().toLowerCase();
    if (!cleanUser || cleanUser.length < 3) {
      setErrorMessage('Tên đăng nhập phải từ 3 ký tự trở lên (không có dấu cách)!');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Mật khẩu bảo mật phải từ 6 ký tự trở lên!');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
      return;
    }

    setLoading(true);

    try {
      const res = await UserService.register({
        username: cleanUser,
        password: regPassword,
        displayName: regDisplayName.trim() || cleanUser,
        email: regEmail.trim() || undefined,
        avatar: selectedAvatar,
      });

      if (res.success && res.user) {
        setSuccessMessage(res.message || 'Đăng ký thành công! Đang chuyển vào hệ thống...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
          if (res.user!.role === 'admin') {
            onNavigate('/admin');
          } else {
            onNavigate('/');
          }
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Lỗi khi tạo tài khoản. Vui lòng thử lại!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối khi đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      {/* 880px max-width container */}
      <div className="w-full max-w-[880px] bg-white border border-[#DCE6DF] rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Column (Desktop 5 cols): Arumo illustration & branding */}
        <div className="md:col-span-5 bg-[#E4F1E9]/50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#DCE6DF]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/art/ui/river-mark.svg"
                alt="Long Ấn Thức Tỉnh"
                className="w-8 h-8 object-contain"
              />
              <span className="font-extrabold text-lg text-[#293B36]">
                Long Ấn Thức Tỉnh
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#DCE6DF] bg-white aspect-[4/3] flex items-center justify-center p-3 relative shadow-2xs">
              <img
                src={mode === 'login' ? '/art/characters/01-rento-v03.png' : '/art/characters/02-nari-v03.png'}
                alt={mode === 'login' ? 'Rento' : 'Nari'}
                className="h-full w-auto object-contain transition-all duration-300"
              />
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E4F1E9] text-[#376F64] border border-[#376F64]/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{mode === 'login' ? 'Rento' : 'Nari'}</span>
              </div>
            </div>

            <p className="text-xs text-[#5F706A] italic leading-relaxed text-center min-h-[40px] flex items-center justify-center">
              {mode === 'login'
                ? '“Ghé Arumo một chút. Dòng sông chảy trên trời, và mỗi cánh cửa đều mở ra một câu chuyện.”'
                : '“Khởi đầu hành trình mới tại Arumo. Khai mở Long Ấn, tích lũy tu vi và lưu giữ từng trang đọc trên Database.”'}
            </p>
          </div>

          <div className="pt-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#376F64] border border-[#DCE6DF] shadow-2xs">
              <Database className="w-3 h-3 text-[#376F64]" />
              <span>Đồng bộ liên tục với Database</span>
            </span>
          </div>
        </div>

        {/* Right Column (Desktop 7 cols): Login / Register Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-[380px] mx-auto w-full space-y-5">
            {/* Mode Switch Tabs */}
            <div className="flex items-center p-1 bg-[#F2F8F5] border border-[#DCE6DF] rounded-2xl">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white text-[#376F64] shadow-xs'
                    : 'text-[#5F706A] hover:text-[#293B36]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-white text-[#376F64] shadow-xs'
                    : 'text-[#5F706A] hover:text-[#293B36]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký mới</span>
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
                {mode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản độc giả'}
              </h2>
              <p className="text-xs text-[#5F706A]">
                {mode === 'login'
                  ? 'Truy cập tài khoản độc giả hoặc hệ thống quản trị Arumo'
                  : 'Đăng ký miễn phí, lưu trực tiếp vào Database để lưu tiến độ đọc'}
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#A33D49] font-medium leading-relaxed animate-in fade-in">
                {errorMessage}
              </div>
            )}

            {/* Success banner */}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold leading-relaxed flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* FORM 1: LOGIN */}
            {/* ========================================================= */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Username field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#293B36]">
                    Tên đăng nhập hoặc email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên tài khoản..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-sm text-[#293B36] focus:border-[#376F64] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#293B36]">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-sm text-[#293B36] focus:border-[#376F64] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F706A] hover:text-[#293B36]"
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <span>Đang đăng nhập…</span> : <span>Đăng nhập</span>}
                </button>

                {/* Switch to Register link */}
                <p className="text-center text-xs text-[#5F706A] pt-1">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMessage(null); }}
                    className="font-extrabold text-[#376F64] hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </form>
            ) : (
              /* ========================================================= */
              /* FORM 2: REGISTER */
              /* ========================================================= */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Username */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#293B36]">
                    Tên đăng nhập (Username) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="ví dụ: docgia2026 (ít nhất 3 ký tự)"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs font-medium text-[#293B36] focus:border-[#376F64] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#293B36]">
                    Biệt danh / Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={regDisplayName}
                    onChange={(e) => setRegDisplayName(e.target.value)}
                    placeholder="ví dụ: Tiểu Long, Minh Vũ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs font-medium text-[#293B36] focus:border-[#376F64] focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#293B36]">
                    Email liên hệ (Tùy chọn)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs font-medium text-[#293B36] focus:border-[#376F64] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#293B36]">
                    Chọn Linh Thú / Avatar đại diện
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-transform shrink-0 ${
                          selectedAvatar === av
                            ? 'bg-[#E4F1E9] ring-2 ring-[#376F64] scale-110 shadow-xs'
                            : 'bg-[#FFFDF8] border border-[#DCE6DF] hover:bg-gray-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Passwords (Grid 2 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#293B36]">
                      Mật khẩu *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#5F706A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Từ 6 ký tự"
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F706A] hover:text-[#293B36]"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#293B36]">
                      Nhập lại mật khẩu *
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Khớp mật khẩu"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Register Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Đang lưu vào Database…</span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4" />
                      <span>Đăng ký tài khoản</span>
                    </span>
                  )}
                </button>

                {/* Switch to Login link */}
                <p className="text-center text-xs text-[#5F706A] pt-1">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(null); }}
                    className="font-extrabold text-[#376F64] hover:underline"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </form>
            )}

            {/* Back to reading link */}
            <div className="pt-2 text-center border-t border-[#DCE6DF]/60">
              <button
                onClick={() => onNavigate('/')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F706A] hover:text-[#376F64] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Về trang đọc truyện</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

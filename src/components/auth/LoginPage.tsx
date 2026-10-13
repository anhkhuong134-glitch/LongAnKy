import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield } from 'lucide-react';
import { UserService } from '../../services/userService';
import { UserProfile } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

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
      setErrorMessage('Chưa kết nối được. Thử lại nhé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
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

            <div className="rounded-2xl overflow-hidden border border-[#DCE6DF] bg-white aspect-[4/3] flex items-center justify-center p-3">
              <img
                src="/art/characters/01-rento-v03.png"
                alt="Rento"
                className="h-full w-auto object-contain"
              />
            </div>

            <p className="text-xs text-[#5F706A] italic leading-relaxed text-center">
              “Ghé Arumo một chút. Dòng sông chảy trên trời, và mỗi cánh cửa đều mở ra một câu chuyện.”
            </p>
          </div>

          <div className="pt-4 text-center">
            <span className="text-[11px] text-[#5F706A]">
              Hệ thống xác thực phân quyền an toàn
            </span>
          </div>
        </div>

        {/* Right Column (Desktop 7 cols): Login Form (360px max) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-[360px] mx-auto w-full space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
                Đăng nhập
              </h2>
              <p className="text-xs text-[#5F706A]">
                Truy cập tài khoản độc giả hoặc hệ thống quản trị
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#A33D49] font-medium leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {loading ? (
                  <span>Đang đăng nhập…</span>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="pt-2 text-center">
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

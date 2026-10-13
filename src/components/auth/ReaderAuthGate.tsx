/**
 * ReaderAuthGate.tsx
 * Màn hình yêu cầu đăng nhập trước khi đọc chương tiểu thuyết.
 * Hiển thị tiêu đề chương + 3 đoạn xem trước bị làm mờ, sau đó là
 * biểu mẫu đăng nhập / đăng ký nằm chồng lên.
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Lock,
  User,
  Eye,
  EyeOff,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { PublishedContentService, PublishedChapter } from '../../services/publishedContent';
import { UserService } from '../../services/userService';
import { UserProfile, AVATAR_PRESETS } from '../../types/user';

interface ReaderAuthGateProps {
  chapterId: string;
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

const AVATAR_OPTIONS = ['🐉', '🌸', '⚡', '🗡️', '👑', '🛡️', '🌙', '🦊', '✨', '🔥'];

export const ReaderAuthGate: React.FC<ReaderAuthGateProps> = ({
  chapterId,
  onLoginSuccess,
  onNavigate,
}) => {
  const [chapter, setChapter] = useState<PublishedChapter | null>(null);
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register
  const [regUser, setRegUser] = useState('');
  const [regDisplay, setRegDisplay] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regAvatar, setRegAvatar] = useState('🐉');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    PublishedContentService.getChapterById(chapterId).then((res) => {
      if (res) setChapter(res.chapter);
    });
  }, [chapterId]);

  const preview = chapter
    ? chapter.content.split('\n\n').filter((p) => p.trim()).slice(0, 3)
    : [];

  // ── Login ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!loginUser.trim() || !loginPass) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      const res = await UserService.login(loginUser.trim(), loginPass);
      if (res.success && res.user) {
        setSuccess('Đăng nhập thành công! Đang mở trang đọc...');
        setTimeout(() => onLoginSuccess(res.user!), 600);
      } else {
        setError(res.message || 'Sai tên đăng nhập hoặc mật khẩu.');
      }
    } catch {
      setError('Chưa kết nối được máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const cleanUser = regUser.trim().toLowerCase();
    if (!cleanUser || cleanUser.length < 3) {
      setError('Tên đăng nhập phải từ 3 ký tự trở lên!');
      return;
    }
    if (!regPass || regPass.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự trở lên!');
      return;
    }
    if (regPass !== regConfirm) {
      setError('Hai mật khẩu chưa khớp nhau.');
      return;
    }
    setLoading(true);
    try {
      const res = await UserService.register({
        username: cleanUser,
        password: regPass,
        displayName: regDisplay.trim() || cleanUser,
        email: regEmail.trim() || undefined,
        avatar: regAvatar,
      });
      if (res.success && res.user) {
        setSuccess('Tạo tài khoản thành công! Đang mở trang đọc...');
        setTimeout(() => onLoginSuccess(res.user!), 700);
      } else {
        setError(res.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch {
      setError('Lỗi kết nối khi đăng ký. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#293B36]">
      {/* ── Mini Reader Header ── */}
      <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-[#DCE6DF] px-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F706A] hover:text-[#376F64] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Về truyện</span>
        </button>
        <div className="text-center px-4 max-w-[420px] truncate">
          <span className="font-extrabold text-sm sm:text-base text-[#293B36] truncate block">
            {chapter?.title ?? 'Đang tải...'}
          </span>
        </div>
        <div className="w-24 sm:w-32" />
      </header>

      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 pb-32">
        <div className="max-w-[680px] mx-auto">

          {/* ── Chapter title ── */}
          {chapter && (
            <div className="text-center pb-10 border-b border-[#DCE6DF]/70 mb-10 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#376F64] block">
                Xem trước chương
              </span>
              <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#293B36] tracking-tight leading-snug">
                {chapter.title}
              </h1>
              <div className="flex items-center justify-center gap-3 text-xs text-[#5F706A]">
                <span>~{Math.max(1, Math.round((chapter.wordCount ?? 0) / 250))} phút đọc</span>
                <span>•</span>
                <span>{chapter.wordCount} chữ</span>
              </div>
            </div>
          )}

          {/* ── Blurred Preview Paragraphs ── */}
          <div className="relative space-y-6 font-serif text-[20px] leading-[1.85] text-[#293B36] mb-0">
            {preview.map((para, idx) => (
              <p
                key={idx}
                className={`transition-all duration-300 ${
                  idx === 0 ? '' : idx === 1 ? 'opacity-60' : 'opacity-30'
                }`}
              >
                {para}
              </p>
            ))}

            {/* Fade-to-white gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FFFDF8] to-transparent pointer-events-none" />
          </div>

          {/* ── Auth Wall ── */}
          <div className="mt-0 pt-12 flex flex-col items-center gap-8">

            {/* Lock badge */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E4F1E9] border border-[#376F64]/20 flex items-center justify-center shadow-sm">
                <Lock className="w-7 h-7 text-[#376F64]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#293B36]">
                  Đăng nhập để đọc tiếp
                </h2>
                <p className="text-sm text-[#5F706A] mt-1 max-w-xs">
                  Tạo tài khoản miễn phí hoặc đăng nhập để mở toàn bộ nội dung và lưu tiến độ đọc.
                </p>
              </div>
            </div>

            {/* ── Auth Card ── */}
            <div className="w-full max-w-md bg-white border border-[#DCE6DF] rounded-2xl shadow-xl overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-[#DCE6DF]">
                <button
                  onClick={() => { setTab('login'); setError(null); setSuccess(null); }}
                  className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                    tab === 'login'
                      ? 'bg-[#FFFDF8] text-[#376F64] border-b-2 border-[#376F64]'
                      : 'text-[#5F706A] hover:text-[#293B36] bg-white'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => { setTab('register'); setError(null); setSuccess(null); }}
                  className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                    tab === 'register'
                      ? 'bg-[#FFFDF8] text-[#376F64] border-b-2 border-[#376F64]'
                      : 'text-[#5F706A] hover:text-[#293B36] bg-white'
                  }`}
                >
                  Đăng ký mới
                </button>
              </div>

              <div className="p-6 space-y-4">

                {/* Error / Success messages */}
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="px-4 py-3 rounded-xl bg-[#E4F1E9] border border-[#376F64]/30 text-[#376F64] text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {success}
                  </div>
                )}

                {/* ── LOGIN FORM ── */}
                {tab === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                        Tên đăng nhập
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F706A]" />
                        <input
                          type="text"
                          value={loginUser}
                          onChange={(e) => setLoginUser(e.target.value)}
                          placeholder="Nhập tên đăng nhập..."
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] text-[#293B36] text-sm placeholder:text-[#5F706A]/60 focus:outline-none focus:ring-2 focus:ring-[#376F64]/40 focus:border-[#376F64] transition-all"
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F706A]" />
                        <input
                          type={showLoginPass ? 'text' : 'password'}
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          placeholder="Mật khẩu..."
                          className="w-full pl-9 pr-11 py-3 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] text-[#293B36] text-sm placeholder:text-[#5F706A]/60 focus:outline-none focus:ring-2 focus:ring-[#376F64]/40 focus:border-[#376F64] transition-all"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPass(!showLoginPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F706A] hover:text-[#293B36] transition-colors"
                        >
                          {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#376F64] hover:bg-[#2B5A51] disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(55,111,100,0.28)] hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          Đăng nhập & Đọc tiếp
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ── REGISTER FORM ── */}
                {tab === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-3.5">
                    {/* Avatar picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                        Chọn đại diện
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_OPTIONS.map((av) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setRegAvatar(av)}
                            className={`w-9 h-9 text-xl rounded-xl transition-all ${
                              regAvatar === av
                                ? 'bg-[#E4F1E9] ring-2 ring-[#376F64] scale-110'
                                : 'bg-[#F2F8F5] hover:bg-[#E4F1E9]'
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                          Tên đăng nhập *
                        </label>
                        <input
                          type="text"
                          value={regUser}
                          onChange={(e) => setRegUser(e.target.value)}
                          placeholder="ít nhất 3 ký tự"
                          className="w-full px-3 py-2.5 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] text-[#293B36] text-sm placeholder:text-[#5F706A]/60 focus:outline-none focus:ring-2 focus:ring-[#376F64]/40 focus:border-[#376F64] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                          Tên hiển thị
                        </label>
                        <input
                          type="text"
                          value={regDisplay}
                          onChange={(e) => setRegDisplay(e.target.value)}
                          placeholder="Tên bạn muốn hiện"
                          className="w-full px-3 py-2.5 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] text-[#293B36] text-sm placeholder:text-[#5F706A]/60 focus:outline-none focus:ring-2 focus:ring-[#376F64]/40 focus:border-[#376F64] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                        Email (không bắt buộc)
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] text-[#293B36] text-sm placeholder:text-[#5F706A]/60 focus:outline-none focus:ring-2 focus:ring-[#376F64]/40 focus:border-[#376F64] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                          Mật khẩu *
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPass ? 'text' : 'password'}
                            value={regPass}
                            onChange={(e) => setRegPass(e.target.value)}
                            placeholder="ít nhất 6 ký tự"
                            className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] text-[#293B36] text-sm placeholder:text-[#5F706A]/60 focus:outline-none focus:ring-2 focus:ring-[#376F64]/40 focus:border-[#376F64] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPass(!showRegPass)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F706A] hover:text-[#293B36]"
                          >
                            {showRegPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#293B36] uppercase tracking-wide">
                          Xác nhận *
                        </label>
                        <input
                          type="password"
                          value={regConfirm}
                          onChange={(e) => setRegConfirm(e.target.value)}
                          placeholder="Nhập lại mật khẩu"
                          className="w-full px-3 py-2.5 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] text-[#293B36] text-sm placeholder:text-[#5F706A]/60 focus:outline-none focus:ring-2 focus:ring-[#376F64]/40 focus:border-[#376F64] transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#376F64] hover:bg-[#2B5A51] disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(55,111,100,0.28)] hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Tạo tài khoản & Đọc ngay
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Benefits note */}
                <div className="pt-2 border-t border-[#DCE6DF] grid grid-cols-3 gap-3 text-center text-[10px] font-semibold text-[#5F706A]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">📖</span>
                    <span>Đọc không giới hạn</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">🔖</span>
                    <span>Lưu tiến độ tự động</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">💬</span>
                    <span>Bình luận chương</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to home */}
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 text-sm text-[#5F706A] hover:text-[#376F64] transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Về trang chủ truyện
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { Shield, KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface AuthorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthorLoginModal: React.FC<AuthorLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validPin = StorageService.getAuthorPin();

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const trimmed = pin.trim();
    if (trimmed === validPin || trimmed === 'longanky' || trimmed === '134') {
      setIsSuccess(true);
      StorageService.setAuthorAuthenticated(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPin('');
        onSuccess();
        onClose();
      }, 700);
    } else {
      setError('Mã PIN không chính xác. Vui lòng thử lại!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl shadow-amber-500/10 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-300">
              Xác Thực Quyền Tác Giả
            </h3>
            <p className="text-xs text-slate-400">
              Dành riêng cho Tác giả để mở khóa bộ Soạn Thảo &amp; Up Truyện Tranh
            </p>
          </div>
        </div>

        {/* Description Banner */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-950/70 border border-white/5 text-xs text-slate-300 leading-relaxed">
          <p className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Người đọc thông thường chỉ có quyền xem mục <strong>Đọc Sách (Chữ &amp; Tranh)</strong>. 
              Nhập mã PIN của bạn để mở khóa bảng <strong>Soạn Thảo</strong> và các công cụ quản trị.
            </span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Mã PIN hoặc Mật khẩu Tác giả:
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                placeholder="Nhập mã PIN tác giả (Mặc định: 134)..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono tracking-widest text-white placeholder:text-slate-600 placeholder:tracking-normal focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </p>
            )}
            {isSuccess && (
              <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Mở khóa quyền Tác Giả thành công! Đang chuyển hướng...</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Gợi ý: Mã PIN mặc định là <code className="text-amber-400 bg-black/40 px-1 py-0.5 rounded">134</code>
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!pin.trim() || isSuccess}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Mở Khóa Soạn Thảo</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 text-center">
          Mẹo: Bạn có thể lưu link bookmark bí mật dạng <code className="text-amber-400/80">?author=1</code> trên trình duyệt để luôn vào thẳng chế độ Tác Giả.
        </div>
      </div>
    </div>
  );
};

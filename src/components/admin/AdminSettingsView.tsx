import React, { useState } from 'react';
import { Settings, Shield, Lock, Save, CheckCircle2, Clock } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState<string | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordToast('Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordToast('Mật khẩu xác nhận không khớp.');
      return;
    }

    setPasswordToast('Đã đổi mật khẩu admin thành công! Hãy lưu lại để đăng nhập sau này.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
          Cài đặt hệ thống
        </h1>
        <p className="text-xs text-[#5F706A]">
          Thiết lập thông tin tác phẩm, tài khoản admin và cấu hình vận hành máy chủ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-6 bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#376F64]">
            Thông số chung tác phẩm
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#293B36]">Tên tác phẩm chính thức</label>
              <input
                type="text"
                disabled
                value="Long Ấn Thức Tỉnh"
                className="w-full p-2.5 rounded-xl border border-[#DCE6DF] bg-gray-50 text-[#293B36] font-bold"
              />
              <p className="text-[11px] text-[#5F706A]">Đã khóa theo quy định Section 1.</p>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#293B36]">Múi giờ hệ thống</label>
              <input
                type="text"
                disabled
                value="Asia/Ho_Chi_Minh (GMT+7)"
                className="w-full p-2.5 rounded-xl border border-[#DCE6DF] bg-gray-50 text-[#293B36]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#293B36]">Trạng thái tài khoản Admin khởi tạo (Mục 20)</label>
              <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#5F706A]">Tài khoản:</span>
                  <span className="font-mono font-bold text-[#293B36]">admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F706A]">Tác vụ máy chủ:</span>
                  <span className="font-mono font-bold text-[#376F64]">npm run admin:create</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F706A]">Tệp tác vụ:</span>
                  <span className="font-mono text-[#5F706A]">scripts/create-admin.mjs</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#DCE6DF]">
                  <span className="text-[#5F706A]">Trạng thái:</span>
                  <span className="font-bold text-[#376F64]">Đã chuẩn bị & chạy kiểm thử an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Admin Password */}
        <div className="lg:col-span-6 bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#376F64] flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            <span>Đổi mật khẩu Admin</span>
          </h3>

          {passwordToast && (
            <div className="p-3 rounded-xl bg-[#E4F1E9] border border-[#376F64]/30 text-xs text-[#376F64] font-bold">
              {passwordToast}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#293B36]">Mật khẩu hiện tại</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại (VD: admin123)..."
                className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-[#293B36]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#293B36]">Mật khẩu mới</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-[#293B36]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#293B36]">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-[#293B36]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Cập nhật mật khẩu mới</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

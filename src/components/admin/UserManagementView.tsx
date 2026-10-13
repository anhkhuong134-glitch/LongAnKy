import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trash2, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  Crown, 
  Flame, 
  BookOpen, 
  Calendar, 
  Mail, 
  Database, 
  AlertTriangle,
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../../types/user';
import { UserService } from '../../services/userService';

interface UserManagementViewProps {
  onBackToReader?: () => void;
  isWarmTheme?: boolean;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  onBackToReader,
  isWarmTheme = false,
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await UserService.getAllUsersAdmin();
      setUsers(data);
    } catch (err: any) {
      setToastMessage({ text: 'Lỗi tải danh sách người dùng từ MongoDB Atlas: ' + err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    try {
      const res = await UserService.deleteUserAdmin(deleteConfirmUser.id, deleteConfirmUser.username);
      if (res.success) {
        setToastMessage({ text: res.message, type: 'success' });
        setUsers(prev => prev.filter(u => u.id !== deleteConfirmUser.id && u.username !== deleteConfirmUser.username));
      } else {
        setToastMessage({ text: res.message, type: 'error' });
      }
    } catch (err: any) {
      setToastMessage({ text: 'Lỗi khi xóa tài khoản: ' + err.message, type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmUser(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.username.toLowerCase().includes(term) ||
      u.displayName.toLowerCase().includes(term) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
  });

  const totalExp = users.reduce((acc, u) => acc + (u.exp || 0), 0);

  return (
    <div className={`h-full flex flex-col overflow-hidden ${
      isWarmTheme ? 'bg-amber-50/50 text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Banner & Control Bar */}
      <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl shrink-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-rose-500/20">
              👑
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-white flex items-center gap-2">
                <span>HỆ THỐNG KIỂM SOÁT TÀI KHOẢN ĐỘC GIẢ</span>
                <span className="text-amber-400 text-xs">✦ Admin Hub</span>
              </h2>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5 font-mono">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MongoDB Atlas: <strong>atlas-cerise-battery</strong> (Đang đồng bộ trực tiếp)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer hover:border-amber-400/40"
              title="Làm mới danh sách từ MongoDB Atlas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Làm Mới</span>
            </button>

            {onBackToReader && (
              <button
                onClick={onBackToReader}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem Giao Diện Độc Giả</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tổng Độc Giả</span>
            <div className="font-mono font-black text-lg text-white">{users.length} tài khoản</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tổng Tu Vi EXP</span>
            <div className="font-mono font-black text-lg text-amber-300">{totalExp.toLocaleString()} EXP</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cơ Sở Dữ Liệu</span>
            <div className="font-mono font-bold text-sm text-emerald-400 flex items-center gap-1">
              <span>🍃 MongoDB Atlas</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tác Vụ Quản Trị</span>
            <div className="font-mono font-bold text-sm text-purple-300 flex items-center gap-1">
              <span>Toàn quyền kiểm soát</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên đăng nhập (username), biệt danh hiển thị hoặc email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 focus:border-amber-400 text-xs text-slate-200 placeholder:text-slate-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-3 text-xs font-semibold text-center shrink-0 animate-bounce ${
          toastMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-b border-rose-500/40'
        }`}>
          {toastMessage.text}
        </div>
      )}

      {/* User Accounts List Table */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <p className="text-xs font-mono">Đang tải danh sách tài khoản từ MongoDB Atlas...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-2 text-slate-500 text-xs">
            <Users className="w-8 h-8 opacity-40" />
            <p>Không tìm thấy tài khoản nào phù hợp.</p>
          </div>
        ) : (
          filteredUsers.map((u, idx) => {
            const isSuperAdmin = u.username === '1' || u.id === 'admin_author_1';

            return (
              <div
                key={u.id || idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSuperAdmin
                    ? 'bg-amber-950/25 border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/5'
                }`}
              >
                {/* User Info Left */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xl border border-white/10 shadow-sm">
                      {u.avatar || '🐉'}
                    </div>
                    {isSuperAdmin && (
                      <span className="absolute -top-1.5 -right-1.5 text-xs">👑</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-white truncate">
                        {u.displayName}
                      </h4>
                      <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        @{u.username}
                      </span>
                      {isSuperAdmin && (
                        <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          TÁC GIẢ TỐI CAO
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                      <span className="text-amber-300 font-serif">
                        ✦ {u.levelTitle} (Cấp {u.level})
                      </span>
                      <span className="font-mono text-slate-300">
                        {u.exp} EXP
                      </span>
                      <span className="flex items-center gap-1 text-rose-300 font-mono">
                        <Flame className="w-3 h-3 fill-rose-400 text-rose-400" />
                        <span>{u.streakDays || 1} ngày</span>
                      </span>
                      {u.email && (
                        <span className="flex items-center gap-1 font-mono text-slate-400">
                          <Mail className="w-3 h-3" />
                          <span>{u.email}</span>
                        </span>
                      )}
                      {u.joinedDate && (
                        <span className="flex items-center gap-1 font-mono text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>Tạo: {u.joinedDate}</span>
                        </span>
                      )}
                    </div>

                    {/* Last Read Chapter Tracker */}
                    {u.lastRead && (
                      <div className="mt-1.5 text-[10px] text-sky-300 flex items-center gap-1 font-mono bg-sky-950/30 px-2 py-0.5 rounded w-fit border border-sky-500/20">
                        <span>📍 Đang đọc:</span>
                        <span className="font-bold">{u.lastRead.chapterTitle}</span>
                        <span>({u.lastRead.progressPercent}%)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {isSuperAdmin ? (
                    <span className="text-xs text-amber-400 font-serif italic px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      Tài khoản Bất Tử
                    </span>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmUser(u)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 hover:border-rose-500/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                      title={`Xóa tài khoản ${u.username} khỏi cơ sở dữ liệu MongoDB Atlas`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Xóa Tài Khoản</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
          <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-rose-500/40 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-2xl mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-base text-white">
                Xác Nhận Xóa Tài Khoản?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản <strong className="text-rose-300">@{deleteConfirmUser.username}</strong> ({deleteConfirmUser.displayName}) khỏi cơ sở dữ liệu <strong>MongoDB Atlas</strong> không?
              </p>
              <p className="text-[10px] text-slate-500 italic pt-1">
                *Hành động này không thể hoàn tác. Mọi tiến độ đọc và Tu Vi EXP của độc giả này sẽ bị xóa sạch.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang Xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Vĩnh Viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

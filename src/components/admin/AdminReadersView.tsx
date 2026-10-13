import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck, Shield, Lock, Unlock, Search, Trash2, Plus,
  RefreshCw, CheckCircle2, AlertTriangle, Eye, X, UserPlus,
  Activity, Database, Sparkles, BookOpen, Clock, Edit2, Download, Check
} from 'lucide-react';
import { UserService } from '../../services/userService';
import { UserProfile, DatabaseStatus } from '../../types';

export const AdminReadersView: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'reader' | 'active' | 'locked'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Vừa xong');
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserProfile | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);

  // Edit User Form State
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'reader' | 'admin'>('reader');
  const [editStatus, setEditStatus] = useState<'active' | 'locked'>('active');
  const [editLevel, setEditLevel] = useState<number>(1);
  const [editLevelTitle, setEditLevelTitle] = useState('');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'reader' | 'admin'>('reader');
  const [createError, setCreateError] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch users from database
  const fetchUsersFromDb = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const data = await UserService.getAllUsersAdmin();
      setUsers(data);
      setLastUpdatedTime(new Date().toLocaleTimeString('vi-VN'));
    } catch (e) {
      console.warn('Lỗi tải danh sách người dùng:', e);
    } finally {
      if (!silent) setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsersFromDb();
    UserService.checkDatabaseStatus().then(setDbStatus);
  }, []);

  // Continuous live update polling (every 8 seconds when autoRefresh is enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchUsersFromDb(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Lock / Unlock Toggle
  const handleToggleLock = async (u: UserProfile) => {
    if (u.username === '1' || u.username === 'admin123') {
      showToast('⚠️ Không thể khóa tài khoản Quản trị viên tối cao!');
      return;
    }
    const currentStatus = u.status || 'active';
    const res = await UserService.toggleLockUserAdmin(u.id, u.username, currentStatus);
    showToast(res.message);
    fetchUsersFromDb(true);
  };

  // Update Role Toggle
  const handleRoleChange = async (u: UserProfile, newR: 'admin' | 'reader') => {
    if ((u.username === '1' || u.username === 'admin123') && newR === 'reader') {
      showToast('⚠️ Không thể hạ quyền tài khoản Quản trị viên tối cao!');
      return;
    }
    const res = await UserService.updateUserRoleAdmin(u.id, u.username, newR);
    showToast(res.message);
    fetchUsersFromDb(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const res = await UserService.deleteUserAdmin(userToDelete.id, userToDelete.username);
    setUserToDelete(null);
    showToast(res.message);
    fetchUsersFromDb(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (u: UserProfile) => {
    setUserToEdit(u);
    setEditDisplayName(u.displayName || u.username);
    setEditEmail(u.email || '');
    setEditRole(u.role === 'admin' ? 'admin' : 'reader');
    setEditStatus(u.status || 'active');
    setEditLevel(u.level || 1);
    setEditLevelTitle(u.levelTitle || 'Phàm Nhân');
    setEditNewPassword('');
    setEditError(null);
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    setEditError(null);

    const res = await UserService.updateUserDetailsAdmin({
      userId: userToEdit.id,
      username: userToEdit.username,
      displayName: editDisplayName.trim(),
      email: editEmail.trim(),
      role: editRole,
      status: editStatus,
      level: editLevel,
      levelTitle: editLevelTitle.trim(),
      newPassword: editNewPassword ? editNewPassword : undefined,
    });

    if (res.success) {
      setUserToEdit(null);
      showToast(res.message);
      fetchUsersFromDb(true);
    } else {
      setEditError(res.message || 'Lỗi khi cập nhật tài khoản!');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Username', 'DisplayName', 'Email', 'Role', 'Status', 'Level', 'LevelTitle', 'StreakDays', 'ReadChapters', 'JoinedDate'];
    const rows = users.map(u => [
      u.id,
      u.username,
      `"${(u.displayName || u.username).replace(/"/g, '""')}"`,
      u.email || '',
      u.role || 'reader',
      u.status || 'active',
      u.level || 1,
      `"${(u.levelTitle || '').replace(/"/g, '""')}"`,
      u.streakDays || 1,
      u.readChapterIds?.length || 0,
      u.joinedDate || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_tai_khoan_long_an_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống file CSV danh sách tài khoản!');
  };

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setCreateError('Tên đăng nhập phải từ 3 ký tự trở lên!');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setCreateError('Mật khẩu phải từ 4 ký tự trở lên!');
      return;
    }

    const res = await UserService.createUserAdmin({
      username: newUsername.trim(),
      password: newPassword,
      displayName: newDisplayName.trim() || newUsername.trim(),
      email: newEmail.trim(),
      role: newRole,
    });

    if (res.success) {
      setShowCreateModal(false);
      setNewUsername('');
      setNewPassword('');
      setNewDisplayName('');
      setNewEmail('');
      setNewRole('reader');
      showToast(res.message);
      fetchUsersFromDb(true);
    } else {
      setCreateError(res.message || 'Lỗi khi tạo tài khoản!');
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      u.username.toLowerCase().includes(q) ||
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q));

    if (!matchSearch) return false;

    if (filterRole === 'admin') return u.role === 'admin';
    if (filterRole === 'reader') return u.role !== 'admin';
    if (filterRole === 'active') return (u.status || 'active') === 'active';
    if (filterRole === 'locked') return u.status === 'locked';
    return true;
  });

  // Metrics
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const readerCount = users.filter((u) => u.role !== 'admin').length;
  const lockedCount = users.filter((u) => u.status === 'locked').length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#293B36] text-white text-xs font-bold shadow-xl animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#A8D5BA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
              Quản lý tài khoản
            </h1>
            {/* Live Database Pulse Indicator */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E4F1E9] text-[#376F64] border border-[#376F64]/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#376F64] animate-ping" />
              <span>
                {dbStatus?.provider === 'mongodb'
                  ? '🟢 MongoDB Atlas'
                  : dbStatus?.provider === 'postgres'
                  ? '🟢 Vercel Postgres'
                  : '🟢 Database trực tiếp'}
              </span>
            </span>
          </div>
          <p className="text-xs text-[#5F706A] mt-0.5">
            Cập nhật liên tục từ cơ sở dữ liệu web • Lần lấy gần nhất lúc {lastUpdatedTime}.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
              autoRefresh
                ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]/30'
                : 'bg-white text-[#5F706A] border-[#DCE6DF]'
            }`}
            title="Tự động đồng bộ mỗi 8 giây"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{autoRefresh ? 'Tự động làm mới: BẬT' : 'Tự động làm mới: TẮT'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchUsersFromDb(false)}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-[#293B36] bg-white border border-[#DCE6DF] hover:bg-[#F2F8F5] transition-all flex items-center gap-1.5 disabled:opacity-60 shadow-xs"
            title="Làm mới ngay từ Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#376F64] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-[#293B36] bg-white border border-[#DCE6DF] hover:bg-[#F2F8F5] transition-all flex items-center gap-1.5 shadow-xs"
            title="Tải về danh sách tài khoản CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#376F64]" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          {/* Create User Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo tài khoản</span>
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Tổng tài khoản</span>
          <p className="text-2xl font-extrabold text-[#293B36] mt-1">{totalCount}</p>
        </div>
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Quản trị viên</span>
          <p className="text-2xl font-extrabold text-[#376F64] mt-1 flex items-center gap-1.5">
            <Shield className="w-5 h-5 text-[#376F64]" />
            <span>{adminCount}</span>
          </p>
        </div>
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Độc giả hoạt động</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {readerCount - lockedCount}
          </p>
        </div>
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-[#5F706A] uppercase tracking-wider">Tài khoản bị khóa</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{lockedCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#5F706A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo username, tên, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'all'
                ? 'bg-[#376F64] text-white shadow-xs'
                : 'text-[#5F706A] hover:bg-[#F2F8F5]'
            }`}
          >
            Tất cả ({totalCount})
          </button>
          <button
            onClick={() => setFilterRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'admin'
                ? 'bg-[#376F64] text-white shadow-xs'
                : 'text-[#5F706A] hover:bg-[#F2F8F5]'
            }`}
          >
            Quản trị ({adminCount})
          </button>
          <button
            onClick={() => setFilterRole('reader')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'reader'
                ? 'bg-[#376F64] text-white shadow-xs'
                : 'text-[#5F706A] hover:bg-[#F2F8F5]'
            }`}
          >
            Độc giả ({readerCount})
          </button>
          <button
            onClick={() => setFilterRole('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'active'
                ? 'bg-[#376F64] text-white shadow-xs'
                : 'text-[#5F706A] hover:bg-[#F2F8F5]'
            }`}
          >
            Hoạt động ({totalCount - lockedCount})
          </button>
          {lockedCount > 0 && (
            <button
              onClick={() => setFilterRole('locked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterRole === 'locked'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Bị khóa ({lockedCount})
            </button>
          )}
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tài khoản & Người dùng</th>
                <th className="py-3.5 px-4">Email / Liên hệ</th>
                <th className="py-3.5 px-4 text-center">Vai trò</th>
                <th className="py-3.5 px-4 text-center">Tu Vi & Đọc</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#5F706A]">
                    {isLoading ? 'Đang tải dữ liệu từ database...' : 'Không tìm thấy tài khoản nào phù hợp.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isRootAdmin = u.username === '1' || u.username === 'admin123';
                  const isLocked = u.status === 'locked';

                  return (
                    <tr key={u.id} className="hover:bg-[#FFFDF8]/70 transition-colors">
                      {/* Username & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-[#E4F1E9] text-[#376F64] flex items-center justify-center text-sm font-bold shrink-0">
                            {u.avatar || (u.role === 'admin' ? '👑' : '🐉')}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#293B36] text-sm">
                                {u.username}
                              </span>
                              {isRootAdmin && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#376F64] text-white">
                                  GỐC
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#5F706A] font-medium">
                              {u.displayName || u.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-[#5F706A]">
                        {u.email || '—'}
                      </td>

                      {/* Role Dropdown / Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {isRootAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#E4F1E9] text-[#376F64]">
                            <Shield className="w-3 h-3" />
                            <span>Quản trị viên</span>
                          </span>
                        ) : (
                          <select
                            value={u.role === 'admin' ? 'admin' : 'reader'}
                            onChange={(e) => handleRoleChange(u, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                              u.role === 'admin'
                                ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]/40'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            <option value="reader">Độc giả</option>
                            <option value="admin">Quản trị viên</option>
                          </select>
                        )}
                      </td>

                      {/* Progress / EXP */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFFDF8] border border-[#DCE6DF] text-[#293B36]">
                          {u.levelTitle || `Lv.${u.level || 1}`}
                        </span>
                        <div className="text-[10px] text-[#5F706A] mt-0.5">
                          Đã đọc {u.readChapterIds?.length || 0} chương
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isLocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLocked ? 'Bị khóa' : 'Hoạt động'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Info */}
                          <button
                            onClick={() => setSelectedUserDetails(u)}
                            className="p-1.5 rounded-lg text-[#5F706A] hover:text-[#293B36] hover:bg-[#F2F8F5] transition-colors"
                            title="Xem chi tiết tài khoản"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit User Details */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg text-[#376F64] hover:bg-[#E4F1E9] transition-colors"
                            title="Chỉnh sửa thông tin tài khoản"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Lock / Unlock */}
                          {!isRootAdmin && (
                            <button
                              onClick={() => handleToggleLock(u)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLocked
                                  ? 'text-emerald-700 hover:bg-emerald-50'
                                  : 'text-amber-700 hover:bg-amber-50'
                              }`}
                              title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            >
                              {isLocked ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Delete Account */}
                          {!isRootAdmin && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                              title="Xóa vĩnh viễn khỏi Database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: TẠO TÀI KHOẢN MỚI
      ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6DF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#E4F1E9] text-[#376F64] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </span>
                <h3 className="font-extrabold text-lg text-[#293B36]">
                  Thêm tài khoản mới
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-[#5F706A] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                  Tên đăng nhập (Username) *
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="ví dụ: docgia_moi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-medium focus:border-[#376F64] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                  Mật khẩu khởi tạo *
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mật khẩu ít nhất 4 ký tự"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-medium focus:border-[#376F64] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                  Tên hiển thị (Display Name)
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="ví dụ: Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-medium focus:border-[#376F64] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-medium focus:border-[#376F64] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                  Vai trò phân quyền
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-bold bg-white focus:border-[#376F64] focus:outline-none"
                >
                  <option value="reader">Độc giả thường (Xem và đọc truyện)</option>
                  <option value="admin">Quản trị viên (Truy cập Bàn làm việc Arumo)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-[#5F706A] hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm"
                >
                  Lưu vào Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: XÁC NHẬN XÓA TÀI KHOẢN KHỎI DATABASE
      ========================================================================= */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6DF] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-[#293B36]">
                  Xóa tài khoản khỏi Database?
                </h3>
                <p className="text-xs text-[#5F706A]">
                  Hành động này sẽ xóa vĩnh viễn và không thể khôi phục.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Tên tài khoản:</span>
                <span className="font-mono font-bold text-[#293B36]">{userToDelete.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Tên hiển thị:</span>
                <span className="font-bold text-[#293B36]">{userToDelete.displayName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Vai trò:</span>
                <span className="font-bold text-[#376F64]">
                  {userToDelete.role === 'admin' ? 'Quản trị viên' : 'Độc giả'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl font-bold text-[#5F706A] hover:bg-gray-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm"
              >
                Xác nhận xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: XEM CHI TIẾT TÀI KHOẢN ĐỘC GIẢ
      ========================================================================= */}
      {selectedUserDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6DF] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-[#E4F1E9] text-[#376F64] flex items-center justify-center text-lg">
                  {selectedUserDetails.avatar || '🐉'}
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-[#293B36]">
                    {selectedUserDetails.displayName || selectedUserDetails.username}
                  </h3>
                  <p className="font-mono text-xs text-[#5F706A]">
                    @{selectedUserDetails.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetails(null)}
                className="p-1 rounded-lg text-[#5F706A] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF]">
                <span className="text-[#5F706A] block">Vai trò:</span>
                <span className="font-bold text-[#376F64] text-sm mt-0.5 block">
                  {selectedUserDetails.role === 'admin' ? 'Quản trị viên' : 'Độc giả'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF]">
                <span className="text-[#5F706A] block">Trạng thái:</span>
                <span className="font-bold text-[#293B36] text-sm mt-0.5 block">
                  {selectedUserDetails.status === 'locked' ? 'Bị khóa' : 'Hoạt động'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF]">
                <span className="text-[#5F706A] block">Cấp bậc / Tu vi:</span>
                <span className="font-bold text-[#293B36] text-sm mt-0.5 block">
                  {selectedUserDetails.levelTitle || `Lv.${selectedUserDetails.level || 1}`}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF]">
                <span className="text-[#5F706A] block">Ngày tham gia:</span>
                <span className="font-bold text-[#293B36] text-sm mt-0.5 block">
                  {selectedUserDetails.joinedDate || '13/10/2026'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Email:</span>
                <span className="font-medium text-[#293B36]">{selectedUserDetails.email || 'Chưa cung cấp'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Số chương đã đọc:</span>
                <span className="font-bold text-[#376F64]">{selectedUserDetails.readChapterIds?.length || 0} chương</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Số chương đánh dấu:</span>
                <span className="font-bold text-[#293B36]">{selectedUserDetails.bookmarkedChapterIds?.length || 0} chương</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUserDetails(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#376F64] hover:bg-[#2B5A51]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: CHỈNH SỬA THÔNG TIN TÀI KHOẢN (DATABASE)
      ========================================================================= */}
      {userToEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6DF] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-[#E4F1E9] text-[#376F64] flex items-center justify-center text-lg">
                  <Edit2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-[#293B36]">
                    Chỉnh sửa tài khoản @{userToEdit.username}
                  </h3>
                  <p className="text-xs text-[#5F706A]">
                    Cập nhật trực tiếp lên cơ sở dữ liệu web
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUserToEdit(null)}
                className="p-1 rounded-lg text-[#5F706A] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    required
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-medium focus:border-[#376F64] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-medium focus:border-[#376F64] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                    Vai trò
                  </label>
                  <select
                    disabled={userToEdit.username === '1' || userToEdit.username === 'admin123'}
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-bold bg-white focus:border-[#376F64] focus:outline-none disabled:bg-gray-100 disabled:opacity-60"
                  >
                    <option value="reader">Độc giả thường</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                    Trạng thái
                  </label>
                  <select
                    disabled={userToEdit.username === '1' || userToEdit.username === 'admin123'}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-bold bg-white focus:border-[#376F64] focus:outline-none disabled:bg-gray-100 disabled:opacity-60"
                  >
                    <option value="active">Hoạt động bình thường</option>
                    <option value="locked">Tạm khóa tài khoản</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                    Cấp độ (Level 1..99)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={editLevel}
                    onChange={(e) => setEditLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-bold focus:border-[#376F64] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                    Danh hiệu Tu vi
                  </label>
                  <input
                    type="text"
                    value={editLevelTitle}
                    onChange={(e) => setEditLevelTitle(e.target.value)}
                    placeholder="ví dụ: Trúc Cơ Kỳ, Luyện Khí..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-medium focus:border-[#376F64] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36] uppercase tracking-wider text-[11px]">
                  Đặt lại mật khẩu mới (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={editNewPassword}
                  onChange={(e) => setEditNewPassword(e.target.value)}
                  placeholder="Để trống nếu không muốn đổi mật khẩu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE6DF] text-xs font-mono focus:border-[#376F64] focus:outline-none"
                />
                <p className="text-[10px] text-[#5F706A]">
                  Chỉ điền nếu muốn reset mật khẩu cho người dùng này.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE6DF]">
                <button
                  type="button"
                  onClick={() => setUserToEdit(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-[#5F706A] hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { UserCheck, Shield, Lock, Unlock, Search } from 'lucide-react';
import { UserService } from '../../services/userService';

interface ReaderAccount {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'reader';
  joinedDate: string;
  status: 'active' | 'locked';
}

export const AdminReadersView: React.FC = () => {
  const [readers, setReaders] = useState<ReaderAccount[]>([
    {
      id: 'admin_initial_root',
      username: 'admin123',
      displayName: 'Quản Trị Viên Arumo',
      role: 'admin',
      joinedDate: '13/10/2026',
      status: 'active',
    },
    {
      id: 'u1',
      username: 'docgia_arumo',
      displayName: 'Thanh Thảo',
      role: 'reader',
      joinedDate: '12/10/2026',
      status: 'active',
    },
    {
      id: 'u2',
      username: 'minhvu2026',
      displayName: 'Minh Vũ',
      role: 'reader',
      joinedDate: '10/10/2026',
      status: 'active',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const toggleLock = (account: ReaderAccount) => {
    if (account.role === 'admin') {
      alert('Không thể khóa tài khoản Quản trị viên khởi tạo!');
      return;
    }

    setReaders(prev => prev.map(r => r.id === account.id ? {
      ...r,
      status: r.status === 'active' ? 'locked' : 'active'
    } : r));
  };

  const filtered = readers.filter(r =>
    r.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Tài khoản độc giả & Quản trị
          </h1>
          <p className="text-xs text-[#5F706A]">
            Danh sách tài khoản lưu trên cơ sở dữ liệu. Quyền quản trị do máy chủ xác nhận.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3 border-b border-[#DCE6DF] flex items-center justify-between">
          <span className="text-xs font-bold text-[#5F706A]">
            Tổng tài khoản: {readers.length}
          </span>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[#5F706A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tài khoản..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-extrabold uppercase">
              <tr>
                <th className="py-3 px-4">Tên đăng nhập</th>
                <th className="py-3 px-4">Tên hiển thị</th>
                <th className="py-3 px-4 text-center">Vai trò</th>
                <th className="py-3 px-4">Ngày tham gia</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Khóa / Mở</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#FFFDF8]">
                  <td className="py-3 px-4 font-mono font-bold text-[#293B36]">
                    {u.username}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#293B36]">
                    {u.displayName}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E4F1E9] text-[#376F64]">
                        <Shield className="w-3 h-3" />
                        <span>Admin</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
                        Độc giả
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#5F706A]">
                    {u.joinedDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => toggleLock(u)}
                        className="p-1.5 rounded-lg text-[#5F706A] hover:bg-gray-100"
                        title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {u.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

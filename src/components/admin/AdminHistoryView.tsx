import React, { useState } from 'react';
import { History, Download, RotateCcw, Trash2, CheckCircle2 } from 'lucide-react';
import { ALL_CHARACTERS_DATA } from '../../data/publicCharacters';

export const AdminHistoryView: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: 'l1', time: '13/10/2026 18:00', user: 'admin123', action: 'Tạo snapshot xuất bản', target: 'Mở đầu & Chương 1–5 (v1.0.0)' },
    { id: 'l2', time: '13/10/2026 16:30', user: 'admin123', action: 'Gán 21 ảnh chibi v0.3', target: 'Thư viện 21 ảnh' },
    { id: 'l3', time: '13/10/2026 15:00', user: 'admin123', action: 'Lưu bản nháp', target: 'Chương 6 — Nước lạnh dưới giếng cảng' },
    { id: 'l4', time: '13/10/2026 14:15', user: 'admin123', action: 'Cập nhật hồ sơ', target: 'Rento, Nari, Dagan, Seika' },
  ]);

  const handleExportBackup = () => {
    const backupData = {
      project: 'Long Ấn Thức Tỉnh',
      theme: 'Arumo trong nắng sớm',
      exportedAt: new Date().toISOString(),
      charactersCount: ALL_CHARACTERS_DATA.length,
      characters: ALL_CHARACTERS_DATA,
      note: 'Gói sao lưu an toàn — Không chứa mật khẩu hay khóa phiên.'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-long-an-thuc-tinh-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Lịch sử hoạt động & Khôi phục
          </h1>
          <p className="text-xs text-[#5F706A]">
            Theo dõi từng lần sửa, xuất bản gói dữ liệu sao lưu hoặc khôi phục bản ghi về bản nháp.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-xs flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Xuất bản sao lưu (JSON)</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3 border-b border-[#DCE6DF]">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#376F64]">
            Nhật ký hành động gần đây
          </h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-extrabold uppercase">
            <tr>
              <th className="py-3 px-4">Thời điểm</th>
              <th className="py-3 px-4">Người thực hiện</th>
              <th className="py-3 px-4">Hành động</th>
              <th className="py-3 px-4">Đối tượng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE6DF]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#FFFDF8]">
                <td className="py-3 px-4 font-mono text-[#5F706A]">{log.time}</td>
                <td className="py-3 px-4 font-bold text-[#293B36]">{log.user}</td>
                <td className="py-3 px-4 font-semibold text-[#376F64]">{log.action}</td>
                <td className="py-3 px-4 text-[#293B36]">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CheckSquare, Plus, Filter, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'Truyện chữ' | 'Nhân vật' | 'Thế giới' | 'Truyện tranh' | 'Đồ họa' | 'Website';
  status: 'Chưa làm' | 'Đang làm' | 'Chờ xem lại' | 'Hoàn thành';
  deadline?: string;
}

export const AdminTasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Hoàn thiện hồ sơ công khai cho Tovan và Eli', category: 'Nhân vật', status: 'Đang làm', deadline: '15/10/2026' },
    { id: 't2', title: 'Biên tập Chương 6 — Nước lạnh dưới giếng cảng', category: 'Truyện chữ', status: 'Đang làm', deadline: '16/10/2026' },
    { id: 't3', title: 'Phác thảo storyboard cho tập 1 truyện tranh', category: 'Truyện tranh', status: 'Chưa làm', deadline: '20/10/2026' },
    { id: 't4', title: 'Kiểm tra khớp nối 21 ảnh chibi v0.3', category: 'Đồ họa', status: 'Hoàn thành' },
    { id: 't5', title: 'Tích hợp bộ màu Arumo trong nắng sớm cho website', category: 'Website', status: 'Hoàn thành' },
    { id: 't6', title: 'So sánh khác biệt bản thảo Google Docs', category: 'Truyện chữ', status: 'Chờ xem lại' },
  ]);

  const [activeTab, setActiveTab] = useState<'board' | 'list'>('board');

  const columns: Array<'Chưa làm' | 'Đang làm' | 'Chờ xem lại' | 'Hoàn thành'> = [
    'Chưa làm', 'Đang làm', 'Chờ xem lại', 'Hoàn thành'
  ];

  const updateStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Công việc & Tiến độ dự án
          </h1>
          <p className="text-xs text-[#5F706A]">
            Theo dõi tiến độ sáng tác, phân khung truyện tranh và biên tập website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white border border-[#DCE6DF] rounded-xl p-1 flex items-center text-xs">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'board' ? 'bg-[#E4F1E9] text-[#376F64]' : 'text-[#5F706A]'
              }`}
            >
              Bảng Kanban
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'list' ? 'bg-[#E4F1E9] text-[#376F64]' : 'text-[#5F706A]'
              }`}
            >
              Danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Board View */}
      {activeTab === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter(t => t.status === col);
            return (
              <div key={col} className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#DCE6DF]">
                  <span className="font-extrabold text-xs text-[#293B36] uppercase tracking-wider">
                    {col}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-[#E4F1E9] text-[#376F64] text-[11px] font-bold flex items-center justify-center">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[160px]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8] hover:border-[#376F64] transition-all space-y-2"
                    >
                      <span className="text-[10px] font-bold text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                      <h4 className="font-bold text-xs text-[#293B36] leading-snug">
                        {task.title}
                      </h4>
                      {task.deadline && (
                        <div className="flex items-center gap-1 text-[10px] text-[#5F706A]">
                          <Clock className="w-3 h-3" />
                          <span>Hạn: {task.deadline}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-extrabold uppercase">
              <tr>
                <th className="py-3 px-4">Tên công việc</th>
                <th className="py-3 px-4">Lĩnh vực</th>
                <th className="py-3 px-4">Hạn chót</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#FFFDF8]">
                  <td className="py-3 px-4 font-bold text-[#293B36]">{task.title}</td>
                  <td className="py-3 px-4 text-[#5F706A]">{task.category}</td>
                  <td className="py-3 px-4 text-[#5F706A]">{task.deadline || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E4F1E9] text-[#376F64]">
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

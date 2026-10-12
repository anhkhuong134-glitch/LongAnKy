import React, { useState } from 'react';
import { 
  GitBranch, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Trash2, 
  Flame, 
  Eye, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { ForeshadowingHook, HookStatus } from '../../types';

interface ForeshadowingViewProps {
  hooks: ForeshadowingHook[];
  onUpdateHook: (hook: ForeshadowingHook) => void;
  onAddHook: (hook: ForeshadowingHook) => void;
  onDeleteHook: (hookId: string) => void;
  isWarmTheme: boolean;
}

const STATUS_COLUMNS: { id: HookStatus; label: string; icon: string; color: string; desc: string }[] = [
  { id: 'planted', label: 'Đã Gieo (Planted)', icon: '🌰', color: 'border-sky-500/40 bg-sky-950/20 text-sky-300', desc: 'Mới xuất hiện lần đầu' },
  { id: 'developing', label: 'Đang Phát Triển (Developing)', icon: '🌿', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300', desc: 'Được thêm manh mối mới' },
  { id: 'recalled', label: 'Đã Nhắc Lại (Recalled)', icon: '🔔', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300', desc: 'Nhắc để độc giả không quên' },
  { id: 'resolved', label: 'Đã Giải Đáp (Resolved)', icon: '🌸', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300', desc: 'Bí ẩn đã sáng tỏ viên mãn' },
  { id: 'abandoned', label: 'Bị Bỏ Quên (Abandoned)', icon: '🍂', color: 'border-rose-500/40 bg-rose-950/20 text-rose-300', desc: 'Cần gỡ bỏ hoặc kết nối lại' }
];

export const ForeshadowingView: React.FC<ForeshadowingViewProps> = ({
  hooks,
  onUpdateHook,
  onAddHook,
  onDeleteHook,
  isWarmTheme
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPlantedChap, setNewPlantedChap] = useState('Chương 1');
  const [newImportance, setNewImportance] = useState<'major' | 'medium' | 'minor'>('major');

  const handleCreateHook = () => {
    if (!newTitle.trim()) return;
    const hook: ForeshadowingHook = {
      id: `hook_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: 'planted',
      plantedChapterId: 'chap_01',
      plantedChapterTitle: newPlantedChap,
      lastMentionedChapterId: 'chap_01',
      lastMentionedChapterTitle: newPlantedChap,
      chaptersDormant: 0,
      importance: newImportance,
      clues: []
    };
    onAddHook(hook);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none ${
      isWarmTheme ? 'bg-parchment-50 text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Banner */}
      <div className="p-6 border-b border-white/10 bg-slate-925/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-6 h-6 text-rose-400" />
            <h2 className="font-serif font-bold text-xl tracking-tight">Ma Trận Phục Bút & Bí Ẩn (Foreshadowing Tracker)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi vòng đời từng chi tiết cài cắm: Đã gieo → Đang phát triển → Đã nhắc lại → Đã giải đáp.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Gieo Chi Tiết Mới</span>
        </button>
      </div>

      {/* Kanban Board of Hook Lifecycles */}
      <div className="flex-1 overflow-x-auto p-6 flex space-x-4">
        {STATUS_COLUMNS.map(col => {
          const colHooks = hooks.filter(h => h.status === col.id);

          return (
            <div key={col.id} className="w-80 flex-shrink-0 flex flex-col rounded-2xl bg-slate-900/40 border border-white/5 overflow-hidden">
              {/* Column Header */}
              <div className={`p-3 border-b ${col.color} flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <span className="text-base">{col.icon}</span>
                  <div>
                    <h4 className="font-semibold text-xs">{col.label}</h4>
                    <span className="text-[10px] opacity-75">{col.desc}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/30">
                  {colHooks.length}
                </span>
              </div>

              {/* Hook Cards in Column */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colHooks.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-white/5 text-center text-slate-600 text-xs italic">
                    Chưa có tình tiết ở giai đoạn này.
                  </div>
                ) : (
                  colHooks.map(hook => (
                    <div key={hook.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 transition-all space-y-2 text-xs">
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <span className="font-serif font-bold text-sm text-amber-200">{hook.title}</span>
                        <select
                          value={hook.status}
                          onChange={(e) => onUpdateHook({ ...hook, status: e.target.value as HookStatus })}
                          className="text-[10px] bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
                        >
                          <option value="planted">Đã gieo</option>
                          <option value="developing">Đang phát triển</option>
                          <option value="recalled">Đã nhắc lại</option>
                          <option value="resolved">Đã giải đáp</option>
                          <option value="abandoned">Bị bỏ quên</option>
                        </select>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{hook.description}</p>

                      {/* Clues Timeline Snippets */}
                      {hook.clues && hook.clues.length > 0 && (
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                          <span className="text-[10px] font-semibold text-slate-400 block">Các lần xuất hiện:</span>
                          {hook.clues.map((clue, cIdx) => (
                            <div key={cIdx} className="text-[10px] text-slate-300 border-l border-amber-500/40 pl-1.5">
                              <span className="font-semibold text-amber-400">{clue.chapterTitle}: </span>
                              <span className="italic opacity-80">{clue.note}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer Info & Dormancy Indicator */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Gieo tại: {hook.plantedChapterTitle}</span>
                        {hook.chaptersDormant > 8 ? (
                          <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                            <AlertCircle className="w-2.5 h-2.5" /> Quá {hook.chaptersDormant} chương chưa nhắc
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">Nhắc tại: {hook.lastMentionedChapterTitle}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Hook Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-rose-400" />
              <span>Gieo Chi Tiết Phục Bút Mới</span>
            </h3>
            <div>
              <label className="block text-slate-400 mb-1">Tên chi tiết / Bí ẩn</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Dấu ấn hình hoa bỉ ngạn trên chuôi kiếm"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Mô tả ý nghĩa / Hướng giải đáp</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Chi tiết này sẽ hé lộ điều gì ở các chương sau..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500 resize-none font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Chương gieo lần đầu</label>
              <input
                type="text"
                value={newPlantedChap}
                onChange={(e) => setNewPlantedChap(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Hủy</button>
              <button onClick={handleCreateHook} className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold">Tạo Phục Bút</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

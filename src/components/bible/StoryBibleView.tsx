import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Filter, 
  Check, 
  X, 
  Trash2, 
  Sparkles, 
  Tag, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { BibleFact, BibleCategory, FactStatus } from '../../types';

interface StoryBibleViewProps {
  facts: BibleFact[];
  onUpdateFact: (fact: BibleFact) => void;
  onAddFact: (fact: BibleFact) => void;
  onDeleteFact: (factId: string) => void;
  isWarmTheme: boolean;
}

const CATEGORY_LABELS: Record<BibleCategory, { label: string; icon: string }> = {
  premise: { label: 'Tiền đề cốt truyện', icon: '📜' },
  theme: { label: 'Chủ đề chính', icon: '✨' },
  world_rule: { label: 'Quy luật thế giới', icon: '🌐' },
  magic_system: { label: 'Hệ thống sức mạnh', icon: '⚡' },
  faction: { label: 'Tổ chức & Phe phái', icon: '🏛️' },
  location: { label: 'Địa danh & Bản đồ', icon: '🗺️' },
  terminology: { label: 'Thuật ngữ riêng', icon: '📖' },
  constraint: { label: 'Giới hạn không thể phá vỡ', icon: '🛑' },
  secret: { label: 'Bí mật chưa tiết lộ', icon: '🔒' },
  ending: { label: 'Kết thúc dự kiến', icon: '🏁' }
};

export const StoryBibleView: React.FC<StoryBibleViewProps> = ({
  facts,
  onUpdateFact,
  onAddFact,
  onDeleteFact,
  isWarmTheme
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New fact form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<BibleCategory>('world_rule');
  const [newStatus, setNewStatus] = useState<FactStatus>('canon');
  const [newTags, setNewTags] = useState('');

  const filteredFacts = facts.filter(f => {
    const matchCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchSearch = !searchQuery || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchStatus && matchSearch;
  });

  const handleCreateFact = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const fact: BibleFact = {
      id: `fact_${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      status: newStatus,
      createdBy: 'author',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onAddFact(fact);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  const canonCount = facts.filter(f => f.status === 'canon').length;
  const suggestedCount = facts.filter(f => f.status === 'suggested').length;
  const deprecatedCount = facts.filter(f => f.status === 'deprecated').length;

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none ${
      isWarmTheme ? 'bg-parchment-50 text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Banner */}
      <div className="p-6 border-b border-white/10 bg-slate-925/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="font-serif font-bold text-xl tracking-tight">Story Bible — Nguồn Sự Thật Trung Tâm</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mọi thông tin Canon đều là luật tối cao. AI chỉ được phép dựa chắc chắn vào các dữ kiện Canon đã được bạn xác nhận.
          </p>
        </div>

        {/* Status Counter Pills & Add Button */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs bg-slate-900 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setStatusFilter('canon')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'canon' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Canon: {canonCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter('suggested')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'suggested' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Gợi ý AI: {suggestedCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded-lg text-slate-400 hover:text-white ${statusFilter === 'all' ? 'bg-slate-800 text-white' : ''}`}
            >
              Tất cả ({facts.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Tri Thức Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="p-3 border-b border-white/5 bg-slate-900/30 flex items-center justify-between gap-3 text-xs overflow-x-auto">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất cả danh mục
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, meta]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === catKey
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm quy luật, địa danh, thẻ tag..."
          className="w-56 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Facts Grid */}
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacts.map(fact => {
          const categoryMeta = CATEGORY_LABELS[fact.category] || { label: fact.category, icon: '📌' };

          return (
            <div 
              key={fact.id} 
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                fact.status === 'canon' 
                  ? 'bg-slate-900/60 border-emerald-500/30 hover:border-emerald-500/50' 
                  : fact.status === 'suggested' 
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-slate-950 border-rose-500/20 opacity-60'
              }`}
            >
              <div>
                {/* Fact Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5 flex items-center gap-1">
                    <span>{categoryMeta.icon}</span>
                    <span>{categoryMeta.label}</span>
                  </span>

                  {/* Status Tag Selector */}
                  <select
                    value={fact.status}
                    onChange={(e) => onUpdateFact({ ...fact, status: e.target.value as FactStatus })}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border focus:outline-none cursor-pointer ${
                      fact.status === 'canon'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : fact.status === 'suggested'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <option value="canon" className="bg-slate-900 text-emerald-300">Canon (Chính thức)</option>
                    <option value="suggested" className="bg-slate-900 text-amber-300">Gợi ý AI</option>
                    <option value="deprecated" className="bg-slate-900 text-rose-300">Hết hiệu lực</option>
                  </select>
                </div>

                <h3 className="font-serif font-bold text-base text-slate-100 mb-1.5">{fact.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{fact.content}</p>
              </div>

              {/* Footer Tags & Actions */}
              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex flex-wrap gap-1">
                  {fact.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-1">
                  {fact.status === 'suggested' && (
                    <button
                      onClick={() => onUpdateFact({ ...fact, status: 'canon' })}
                      title="Xác nhận thành Canon"
                      className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-[10px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Duyệt Canon</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteFact(fact.id)}
                    title="Xóa tri thức này"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Fact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Thêm Dữ Kiện Mới Vào Story Bible</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Danh mục tri thức</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as BibleCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([catKey, meta]) => (
                  <option key={catKey} value={catKey}>{meta.icon} {meta.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tiêu đề dữ kiện</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Quy tắc Sợi Chỉ Đỏ phản ứng với Huyết Mạch"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nội dung chi tiết</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Mô tả chính xác quy luật, địa danh hoặc bí mật..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Trạng thái ban đầu</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as FactStatus)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="canon">🟢 Canon (Chính thức)</option>
                  <option value="suggested">🟡 Gợi ý (Cần kiểm tra)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Thẻ tags (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Koto, Chỉ đỏ, Aesvorn"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateFact}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20"
              >
                Lưu Tri Thức
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

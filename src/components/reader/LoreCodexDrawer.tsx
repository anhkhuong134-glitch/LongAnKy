import React, { useState, useMemo } from 'react';
import { BookMarked, Search, X, Sparkles, Tag, Shield, Compass, Key } from 'lucide-react';
import { BibleFact, BibleCategory } from '../../types';
import { sampleBibleFacts } from '../../data/sampleLongAnKy';

interface LoreCodexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bibleFacts?: BibleFact[];
}

export const LoreCodexDrawer: React.FC<LoreCodexDrawerProps> = ({
  isOpen,
  onClose,
  bibleFacts = sampleBibleFacts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFacts = useMemo(() => {
    return bibleFacts.filter(fact => {
      const matchSearch =
        !searchQuery.trim() ||
        fact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fact.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fact.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat =
        selectedCategory === 'all' ||
        fact.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [bibleFacts, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const getCategoryLabel = (cat: BibleCategory) => {
    switch (cat) {
      case 'magic_system': return 'Cổ Ấn & Phép Thuật';
      case 'location': return 'Địa Danh Cốt Lõi';
      case 'faction': return 'Thế Lực & Hội Thầu';
      case 'world_rule': return 'Quy Luật Thế Giới';
      case 'constraint': return 'Ràng Buộc Tuyệt Mật';
      default: return 'Tri Thức Thế Giới';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
      />

      {/* Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] bg-[#090d22]/95 border-l border-amber-500/30 text-slate-200 backdrop-blur-2xl shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col select-none animate-slide-left">
        {/* 1. Header */}
        <div className="p-4 sm:p-4.5 border-b border-white/10 bg-slate-950/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/25 via-pink-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm text-white">
                  Bách Khoa Toàn Thư (World Codex)
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {bibleFacts.length} mục
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Thuật ngữ, thế lực, cổ ấn & luật lệ sông Asera
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Search Toolbar */}
        <div className="p-3 border-b border-white/10 bg-slate-900/50 space-y-2.5 flex-shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm: Long Ấn, Mùa Nước Đứng, Bến Arumo..."
              className="w-full pl-8 pr-7 py-2 bg-slate-950/80 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-serif"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5 text-[11px]">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'magic_system', label: 'Long Ấn' },
              { id: 'location', label: 'Địa danh' },
              { id: 'faction', label: 'Thế lực' },
              { id: 'world_rule', label: 'Quy luật' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Codex Fact Cards List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {filteredFacts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Không tìm thấy mục nào khớp với "{searchQuery}"
            </div>
          ) : (
            filteredFacts.map(fact => (
              <div
                key={fact.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 hover:border-amber-500/40 transition-all shadow-md group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-serif font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {fact.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                    {getCategoryLabel(fact.category)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-serif pt-1">
                  {fact.content}
                </p>

                {fact.tags && fact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-3">
                    {fact.tags.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

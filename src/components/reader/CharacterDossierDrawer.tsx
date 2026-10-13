import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  X, 
  Sparkles, 
  MapPin, 
  Heart, 
  Key, 
  Briefcase, 
  Scroll, 
  MessageSquare, 
  Activity, 
  Package, 
  Compass, 
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Calendar,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Character } from '../../types';

interface CharacterDossierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  selectedCharId?: string;
  onSelectCharacter?: (charId: string) => void;
}

export const CharacterDossierDrawer: React.FC<CharacterDossierDrawerProps> = ({
  isOpen,
  onClose,
  characters,
  selectedCharId: externalSelectedCharId,
  onSelectCharacter: externalOnSelectCharacter
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    characters[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'protagonist' | 'deuteragonist' | 'supporting' | 'antagonist'>('all');

  const activeCharId = externalSelectedCharId || internalSelectedId || characters[0]?.id || '';

  const handleSelectChar = (id: string) => {
    setInternalSelectedId(id);
    if (externalOnSelectCharacter) {
      externalOnSelectCharacter(id);
    }
  };

  // Filtered characters based on search and role
  const filteredCharacters = useMemo(() => {
    return characters.filter(c => {
      const matchSearch = 
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.aliases && c.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (c.dynamicState?.currentLocation && c.dynamicState.currentLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.bio?.personality && c.bio.personality.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRole = 
        roleFilter === 'all' || 
        c.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [characters, searchQuery, roleFilter]);

  const activeCharacter = useMemo(() => {
    return characters.find(c => c.id === activeCharId) || filteredCharacters[0] || characters[0];
  }, [characters, activeCharId, filteredCharacters]);

  if (!isOpen) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'protagonist':
        return { label: 'Nhân Vật Chính', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'deuteragonist':
        return { label: 'Nhân Vật Thứ Chính', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'antagonist':
        return { label: 'Tuyến Đối Đầu / Phản Diện', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return { label: 'Tuyến Hỗ Trợ', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
    }
  };

  const roleBadge = activeCharacter ? getRoleBadge(activeCharacter.role) : null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Main Right Drawer */}
      <aside 
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] lg:w-[490px] bg-[#090d20]/95 border-l border-cyan-500/30 text-slate-200 backdrop-blur-2xl shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col select-none animate-slide-left transition-all overflow-hidden"
      >
        {/* 1. Header Banner */}
        <div className="p-4 sm:p-4.5 border-b border-white/10 bg-slate-950/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/25 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  Hồ Sơ Nhân Vật
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {characters.length} nhân vật
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Xuất xứ, tính cách, quá khứ & ấn ký nhân vật
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng bảng nhân vật"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Search & Filter Toolbar */}
        <div className="p-3 border-b border-white/10 bg-slate-900/50 space-y-2.5 flex-shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, biệt danh, bến Arumo, thợ máy..."
              className="w-full pl-8 pr-7 py-2 bg-slate-950/80 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-serif transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5 text-[11px]">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'protagonist', label: 'Chính diện' },
              { id: 'deuteragonist', label: 'Thứ chính' },
              { id: 'supporting', label: 'Hỗ trợ' },
              { id: 'antagonist', label: 'Đối đầu' }
            ].map(rf => (
              <button
                key={rf.id}
                onClick={() => setRoleFilter(rf.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === rf.id
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>

          {/* Quick Avatar Carousel (Horizontal Clickable List) */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 pb-1">
            {filteredCharacters.map(char => {
              const isSelected = char.id === activeCharacter?.id;
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectChar(char.id)}
                  className={`flex flex-col items-center flex-shrink-0 group cursor-pointer transition-all ${
                    isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100 hover:scale-102'
                  }`}
                  title={`${char.name} (${char.bio?.age || ''})`}
                >
                  <div className={`w-11 h-11 rounded-2xl p-0.5 border-2 transition-all overflow-hidden ${
                    isSelected 
                      ? 'border-cyan-400 ring-4 ring-cyan-500/25 shadow-lg shadow-cyan-500/30 bg-cyan-950'
                      : 'border-white/20 group-hover:border-white/40 bg-slate-800'
                  }`}>
                    <img
                      src={char.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={char.name}
                      className="w-full h-full object-cover rounded-[13px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <span className={`text-[10px] mt-1 max-w-[60px] truncate text-center font-medium ${
                    isSelected ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {char.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Detailed Character Profile Body (Tất Tần Tật Về Nhân Vật Đang Chọn) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {activeCharacter ? (
            <>
              {/* Hero Profile Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-cyan-950/20 to-slate-900/90 border border-cyan-500/30 p-4 shadow-xl">
                <div className="flex items-start space-x-3.5">
                  {/* Portrait Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-xl shadow-cyan-950/50">
                      <img
                        src={activeCharacter.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={activeCharacter.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    {roleBadge && (
                      <span className="absolute -bottom-2 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-900 border border-white/20 text-cyan-300 shadow">
                        {activeCharacter.bio?.age || '??'}
                      </span>
                    )}
                  </div>

                  {/* Header Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-serif font-bold text-white tracking-tight truncate">
                        {activeCharacter.name}
                      </h2>
                    </div>

                    {roleBadge && (
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    )}

                    {activeCharacter.aliases && activeCharacter.aliases.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {activeCharacter.aliases.map((al, idx) => (
                          <span key={idx} className="text-[10px] text-slate-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                            {al}
                          </span>
                        ))}
                      </div>
                    )}

                    {activeCharacter.dynamicState?.currentLocation && (
                      <div className="flex items-center gap-1 text-[11px] text-cyan-300/90 pt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{activeCharacter.dynamicState.currentLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION: 📜 XUẤT XỨ & QUÁ KHỨ (ORIGIN & FLAW / WOUND) */}
              {activeCharacter.bio?.flawOrWound && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900/80 to-slate-900/80 border border-rose-500/25 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Xuất Xứ & Quá Khứ / Biến Cố Định Hình</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-serif pl-5">
                    {activeCharacter.bio.flawOrWound}
                  </p>
                </div>
              )}

              {/* SECTION: 👤 NGOẠI HÌNH & DIỆN MẠO (APPEARANCE) */}
              {activeCharacter.bio?.appearance && (
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Ngoại Hình & Dáng Vẻ Nhận Diện</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif pl-5">
                    {activeCharacter.bio.appearance}
                  </p>
                </div>
              )}

              {/* SECTION: 🧠 TÍNH CÁCH & NGỮ ĐIỆU (PERSONALITY & VOICE) */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5 shadow-sm">
                {activeCharacter.bio?.personality && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Tính Cách Nổi Bật</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-serif pl-5">
                      {activeCharacter.bio.personality}
                    </p>
                  </div>
                )}

                {activeCharacter.bio?.voiceCadence && (
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Ngữ Điệu Giọng Nói Đặc Trưng</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-serif pl-5 italic">
                      "{activeCharacter.bio.voiceCadence}"
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION: 🎯 ĐỘNG CƠ CỐT LÕI (EXTERNAL WANT & INTERNAL NEED) */}
              {(activeCharacter.bio?.externalWant || activeCharacter.bio?.internalNeed) && (
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Động Cơ Cốt Lõi (Mục Tiêu & Khao Khát)</span>
                  </div>

                  <div className="space-y-2 pl-5 text-xs">
                    {activeCharacter.bio?.externalWant && (
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-emerald-400">⚡ Mục tiêu hành động (External Want):</span>
                        <p className="text-slate-300 font-serif leading-relaxed">
                          {activeCharacter.bio.externalWant}
                        </p>
                      </div>
                    )}

                    {activeCharacter.bio?.internalNeed && (
                      <div className="space-y-0.5 pt-1.5 border-t border-white/5">
                        <span className="text-[11px] font-bold text-teal-400">💎 Nhu cầu nội tâm sâu thẳm (Internal Need):</span>
                        <p className="text-slate-300 font-serif leading-relaxed">
                          {activeCharacter.bio.internalNeed}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: 🗝️ BÍ MẬT ĐANG CHE GIẤU (SECRETS) */}
              {activeCharacter.bio?.secrets && activeCharacter.bio.secrets.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900 border border-purple-500/25 space-y-2 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                    <Key className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Bí Mật Đang Giấu Kín</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 text-xs text-purple-100/90 font-serif list-disc">
                    {activeCharacter.bio.secrets.map((sec, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {sec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SECTION: 🤝 MỐI QUAN HỆ NHÂN QUẢ (RELATIONSHIPS) */}
              {activeCharacter.relationships && activeCharacter.relationships.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                      <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Mối Quan Hệ Với Nhân Vật Khác ({activeCharacter.relationships.length})</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    {activeCharacter.relationships.map((rel, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          const target = characters.find(c => c.id === rel.targetCharacterId || c.name.toLowerCase() === rel.targetName.toLowerCase());
                          if (target) handleSelectChar(target.id);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1">
                            {rel.targetName}
                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25">
                            {rel.relationType}
                          </span>
                        </div>
                        {rel.note && (
                          <p className="text-[11px] text-slate-400 mt-1 font-serif group-hover:text-slate-300 leading-relaxed">
                            {rel.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: 🎒 TRẠNG THÁI HIỆN TẠI & ĐỒ VẬT MANG THEO (DYNAMIC STATE) */}
              {activeCharacter.dynamicState && (
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2 shadow-sm text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Tình Trạng & Đồ Vật Mang Theo</span>
                  </div>

                  <div className="space-y-1.5 pl-5">
                    {activeCharacter.dynamicState.healthStatus && (
                      <div>
                        <span className="text-[11px] text-slate-400">Sức khỏe: </span>
                        <span className="text-slate-200 font-serif">{activeCharacter.dynamicState.healthStatus}</span>
                      </div>
                    )}

                    {activeCharacter.dynamicState.emotionalState && (
                      <div>
                        <span className="text-[11px] text-slate-400">Cảm xúc: </span>
                        <span className="text-slate-200 font-serif">{activeCharacter.dynamicState.emotionalState}</span>
                      </div>
                    )}

                    {activeCharacter.dynamicState.itemsCarried && activeCharacter.dynamicState.itemsCarried.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] text-slate-400 block mb-1">Đồ vật trong người:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCharacter.dynamicState.itemsCarried.map((item, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 font-serif"
                            >
                              <Package className="w-2.5 h-2.5 text-cyan-400" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: 👁️ TRI THỨC ĐÃ BIẾT (KNOWLEDGE TRACKER) */}
              {activeCharacter.knowledgeTracker && activeCharacter.knowledgeTracker.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2 shadow-sm text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Tri Thức Nhân Vật Nắm Được</span>
                  </div>

                  <div className="space-y-2 pl-2">
                    {activeCharacter.knowledgeTracker.map((kt, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                        <div className="text-[11px] font-bold text-amber-200 flex items-center justify-between">
                          <span>{kt.chapterTitle || 'Chương truyện'}</span>
                          <span className="text-[10px] text-slate-500">{kt.timestamp}</span>
                        </div>
                        {kt.knownSecrets && kt.knownSecrets.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] text-slate-400 block mb-0.5">Đã biết:</span>
                            <ul className="list-disc pl-4 text-[11px] text-slate-300 space-y-0.5 font-serif">
                              {kt.knownSecrets.map((s, sIdx) => (
                                <li key={sIdx}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Không tìm thấy nhân vật phù hợp với từ khóa "{searchQuery}".
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

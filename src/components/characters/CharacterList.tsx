import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  EyeOff, 
  Key, 
  Heart, 
  ShieldAlert, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Sparkles,
  MapPin,
  Briefcase,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Character, CharacterKnowledge } from '../../types';

interface CharacterListProps {
  characters: Character[];
  onUpdateCharacter: (char: Character) => void;
  onAddCharacter: (char: Character) => void;
  onDeleteCharacter: (charId: string) => void;
  onRequestRoleplay: (charId: string) => void;
  isWarmTheme: boolean;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onUpdateCharacter,
  onAddCharacter,
  onDeleteCharacter,
  onRequestRoleplay,
  isWarmTheme
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(
    characters.length > 0 ? characters[0].id : ''
  );
  const [isKnowledgeEditorOpen, setIsKnowledgeEditorOpen] = useState(false);

  // New forbidden secret input state
  const [newForbiddenSecret, setNewForbiddenSecret] = useState('');
  const [newKnownSecret, setNewKnownSecret] = useState('');

  const selectedChar = characters.find(c => c.id === selectedCharId) || characters[0];

  const handleAddForbiddenSecret = () => {
    if (!newForbiddenSecret.trim() || !selectedChar) return;
    const tracker = [...selectedChar.knowledgeTracker];
    if (tracker.length > 0) {
      tracker[tracker.length - 1].forbiddenSecrets.push(newForbiddenSecret.trim());
    } else {
      tracker.push({
        chapterId: 'chap_current',
        chapterTitle: 'Hiện tại',
        timestamp: 'Hiện tại',
        knownSecrets: [],
        forbiddenSecrets: [newForbiddenSecret.trim()]
      });
    }
    onUpdateCharacter({ ...selectedChar, knowledgeTracker: tracker });
    setNewForbiddenSecret('');
  };

  const handleAddKnownSecret = () => {
    if (!newKnownSecret.trim() || !selectedChar) return;
    const tracker = [...selectedChar.knowledgeTracker];
    if (tracker.length > 0) {
      tracker[tracker.length - 1].knownSecrets.push(newKnownSecret.trim());
    } else {
      tracker.push({
        chapterId: 'chap_current',
        chapterTitle: 'Hiện tại',
        timestamp: 'Hiện tại',
        knownSecrets: [newKnownSecret.trim()],
        forbiddenSecrets: []
      });
    }
    onUpdateCharacter({ ...selectedChar, knowledgeTracker: tracker });
    setNewKnownSecret('');
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none ${
      isWarmTheme ? 'bg-parchment-50 text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Banner */}
      <div className="p-6 border-b border-white/10 bg-slate-925/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <h2 className="font-serif font-bold text-xl tracking-tight">Hồ Sơ Nhân Vật & Ma Trận Tri Thức</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi chiều sâu tâm lý, giọng điệu đặc trưng và rào chắn “Nhân vật biết gì ở thời điểm này?”.
          </p>
        </div>

        <button
          onClick={() => {
            const newChar: Character = {
              id: `char_${Date.now()}`,
              name: 'Nhân vật mới',
              aliases: [],
              role: 'supporting',
              bio: {
                appearance: '',
                personality: '',
                voiceCadence: '',
                externalWant: '',
                internalNeed: '',
                flawOrWound: '',
                secrets: []
              },
              relationships: [],
              dynamicState: {
                currentLocation: 'Học viện Aesvorn',
                healthStatus: 'Bình thường',
                itemsCarried: [],
                emotionalState: 'Ổn định'
              },
              knowledgeTracker: []
            };
            onAddCharacter(newChar);
            setSelectedCharId(newChar.id);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Nhân Vật Mới</span>
        </button>
      </div>

      {/* Main Two-Pane Body */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left Sidebar: Character Selector */}
        <div className="w-full md:w-80 border-r border-white/10 p-3 overflow-y-auto space-y-2 bg-slate-900/30">
          <div className="text-xs font-semibold text-slate-400 px-2 py-1">Danh sách nhân vật ({characters.length})</div>
          {characters.map(char => {
            const isSelected = char.id === selectedCharId;

            return (
              <div
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md text-cyan-100'
                    : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                {char.avatar ? (
                  <img src={char.avatar} alt={char.name} className="w-11 h-11 rounded-full object-cover border border-cyan-500/30 flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-sm flex-shrink-0">
                    {char.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm truncate text-slate-100">{char.name}</h4>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      char.role === 'protagonist' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      char.role === 'deuteragonist' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {char.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{char.bio.voiceCadence || char.dynamicState.emotionalState}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        {selectedChar && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header Profile Summary */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {selectedChar.avatar ? (
                  <img src={selectedChar.avatar} alt={selectedChar.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-2xl">
                    {selectedChar.name[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif font-bold text-2xl text-slate-100">{selectedChar.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                      {selectedChar.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Danh xưng: {selectedChar.aliases.join(', ') || 'Chưa có'} • Tuổi: {selectedChar.bio.age || 'Chưa rõ'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onRequestRoleplay(selectedChar.id)}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Đối Thoại Nhập Vai (Roleplay)</span>
                </button>
              </div>
            </div>

            {/* Crucial Knowledge Partitioning Matrix */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <h4 className="font-serif font-bold text-base text-rose-300">
                    Ma Trận Tri Thức & Rào Chắn Bí Mật ("Nhân vật biết gì?")
                  </h4>
                </div>
                <span className="text-xs text-rose-400 font-mono">Bảo vệ tính bất ngờ của cốt truyện</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Allowed Knowledge */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Tri thức đã được chứng kiến/tiết lộ:</span>
                  </div>
                  
                  {selectedChar.knowledgeTracker.length === 0 || selectedChar.knowledgeTracker[0].knownSecrets.length === 0 ? (
                    <p className="text-slate-500 italic">Chưa có dữ liệu tri thức được nạp.</p>
                  ) : (
                    <ul className="space-y-1 text-slate-300">
                      {selectedChar.knowledgeTracker.flatMap(k => k.knownSecrets).map((s, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                          <span className="text-emerald-400">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2 flex items-center space-x-1.5">
                    <input
                      type="text"
                      value={newKnownSecret}
                      onChange={(e) => setNewKnownSecret(e.target.value)}
                      placeholder="Thêm bí mật nhân vật đã biết..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleAddKnownSecret}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-medium"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Forbidden Knowledge Gate */}
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-rose-400" />
                    <span>TUYỆT ĐỐI CẤM BIẾT (AI sẽ bị chặn nếu để lộ):</span>
                  </div>

                  {selectedChar.knowledgeTracker.length === 0 || selectedChar.knowledgeTracker[0].forbiddenSecrets.length === 0 ? (
                    <p className="text-slate-500 italic">Không có bí mật bị cấm.</p>
                  ) : (
                    <ul className="space-y-1 text-slate-200">
                      {selectedChar.knowledgeTracker.flatMap(k => k.forbiddenSecrets).map((s, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5 bg-rose-950/50 p-2 rounded-lg border border-rose-500/20">
                          <span className="text-rose-400">⛔</span>
                          <span className="font-medium text-rose-200">{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2 flex items-center space-x-1.5">
                    <input
                      type="text"
                      value={newForbiddenSecret}
                      onChange={(e) => setNewForbiddenSecret(e.target.value)}
                      placeholder="Thêm bí mật cấm nhân vật này biết..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={handleAddForbiddenSecret}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-medium"
                    >
                      Thêm Rào Chắn
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Depth Bio & Psychology Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
                <h4 className="font-serif font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> Động Lực Cốt Lõi (Want vs Need)
                </h4>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Mong muốn bên ngoài (External Want):</span>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-white/5">{selectedChar.bio.externalWant || 'Chưa xác định'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Nhu cầu bên trong (Internal Need):</span>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-white/5">{selectedChar.bio.internalNeed || 'Chưa xác định'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Vết thương quá khứ / Nỗi sợ (Flaw / Wound):</span>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-white/5">{selectedChar.bio.flawOrWound || 'Chưa xác định'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
                <h4 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Giọng Điệu & Ngoại Hình (Voice & Appearance)
                </h4>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Giọng văn / Cách nói (Voice Cadence):</span>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-white/5">{selectedChar.bio.voiceCadence || 'Chưa xác định'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Ngoại hình đặc trưng:</span>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-white/5">{selectedChar.bio.appearance || 'Chưa xác định'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Tính cách:</span>
                  <p className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-white/5">{selectedChar.bio.personality || 'Chưa xác định'}</p>
                </div>
              </div>
            </div>

            {/* Dynamic Status & Inventory */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Trạng Thái & Vật Phẩm Hiện Tại
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-0.5">Vị trí hiện tại:</span>
                  <span className="font-semibold text-slate-100 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {selectedChar.dynamicState.currentLocation}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-0.5">Tình trạng sức khỏe:</span>
                  <span className="font-semibold text-emerald-400">{selectedChar.dynamicState.healthStatus}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-0.5">Vật đang mang:</span>
                  <span className="font-semibold text-amber-300">{selectedChar.dynamicState.itemsCarried.join(', ') || 'Không mang theo gì'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

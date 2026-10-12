import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Package, 
  GitBranch, 
  ShieldAlert, 
  Sparkles, 
  EyeOff, 
  Key, 
  ChevronRight, 
  Flame,
  MessageSquareQuote
} from 'lucide-react';
import { Chapter, Scene, Character, BibleFact, ForeshadowingHook, AIRole } from '../../types';

interface ContextDrawerProps {
  chapter?: Chapter;
  scene?: Scene;
  characters: Character[];
  bibleFacts: BibleFact[];
  hooks: ForeshadowingHook[];
  onRequestAI: (role: AIRole, prompt: string, options?: any) => void;
  isWarmTheme: boolean;
}

export const ContextDrawer: React.FC<ContextDrawerProps> = ({
  chapter,
  scene,
  characters,
  bibleFacts,
  hooks,
  onRequestAI,
  isWarmTheme
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chars' | 'lore' | 'hooks'>('chars');
  const [charFilterMode, setCharFilterMode] = useState<'present' | 'all'>('present');

  const activeItem = chapter || scene;

  // Lọc nhân vật xuất hiện trong cảnh hoặc POV của chương hiện tại
  const chapterContent = activeItem?.content || '';
  const matchingCharacters = characters.filter(c => {
    if (!activeItem) return true;
    if (activeItem.presentCharacterIds?.includes(c.id)) return true;
    if (activeItem.povCharacterName && activeItem.povCharacterName.toLowerCase().includes(c.name.toLowerCase())) return true;
    if (chapterContent && chapterContent.includes(c.name)) return true;
    return false;
  });

  const displayCharacters = charFilterMode === 'all'
    ? characters
    : (matchingCharacters.length > 0 ? matchingCharacters : characters.slice(0, 3));

  // Active hooks
  const activeHooks = hooks.filter(h => 
    activeItem?.foreshadowingIds?.includes(h.id) || h.status === 'planted' || h.status === 'developing'
  );

  // Canon rules
  const canonRules = bibleFacts.filter(f => f.status === 'canon');

  return (
    <aside className={`w-80 flex-shrink-0 flex flex-col border-l select-none h-full transition-colors ${
      isWarmTheme 
        ? 'bg-parchment-50/70 border-amber-900/15 text-stone-900' 
        : 'bg-slate-925/80 border-slate-800/80 text-slate-200'
    }`}>
      {/* Top Tabs */}
      <div className="p-2 border-b border-white/5 flex items-center justify-between text-xs font-medium">
        <div className="flex space-x-1 p-1 bg-slate-950/40 rounded-lg border border-white/5 w-full">
          <button
            onClick={() => setActiveSubTab('chars')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center space-x-1 transition-all ${
              activeSubTab === 'chars'
                ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nhân Vật ({displayCharacters.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hooks')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center space-x-1 transition-all ${
              activeSubTab === 'hooks'
                ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-rose-400" />
            <span>Phục Bút ({activeHooks.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lore')}
            className={`flex-1 py-1.5 rounded-md flex items-center justify-center space-x-1 transition-all ${
              activeSubTab === 'lore'
                ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canon Lore</span>
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* SUBTAB 1: PRESENT CHARACTERS */}
        {activeSubTab === 'chars' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Hồ sơ nhân vật:</span>
              <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-white/10 text-[10px]">
                <button
                  onClick={() => setCharFilterMode('present')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    charFilterMode === 'present'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Trong cảnh ({matchingCharacters.length})
                </button>
                <button
                  onClick={() => setCharFilterMode('all')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    charFilterMode === 'all'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tất cả ({characters.length})
                </button>
              </div>
            </div>

            {displayCharacters.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">
                Chưa có nhân vật nào được gắn vào cảnh này.
              </p>
            ) : (
              displayCharacters.map(char => {
                const knowledge = [...char.knowledgeTracker].reverse()[0];

                return (
                  <div key={char.id} className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {char.avatar ? (
                          <img src={char.avatar} alt={char.name} className="w-8 h-8 rounded-full object-cover border border-amber-500/30" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs">
                            {char.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-serif font-bold text-sm text-slate-100 flex items-center gap-1.5">
                            {char.name}
                            {char.id === (scene?.povCharacterId || (activeItem && 'povCharacterId' in activeItem && activeItem.povCharacterId)) && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                POV
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{char.role} • {char.bio.age || 'N/A'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRequestAI('character_actor', `Thử nghiệm nhập vai ${char.name} trong cảnh này`, { targetCharacterId: char.id })}
                        title={`Nhập vai ${char.name}`}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] flex items-center gap-1"
                      >
                        <MessageSquareQuote className="w-3 h-3" />
                        <span>Roleplay</span>
                      </button>
                    </div>

                    {/* Dynamic State */}
                    <div className="text-[11px] space-y-1 pt-1 border-t border-white/5 text-slate-300">
                      <div>
                        <span className="text-slate-400">Tâm trạng: </span>
                        <span className="text-amber-200/90">{char.dynamicState.emotionalState}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Vật phẩm mang theo: </span>
                        <span className="text-cyan-300">
                          {char.dynamicState.itemsCarried.join(', ') || 'Không mang theo gì'}
                        </span>
                      </div>
                    </div>

                    {/* Allowed vs Forbidden Knowledge */}
                    <div className="pt-2 border-t border-white/5 space-y-1.5 text-[10px]">
                      {knowledge?.knownSecrets && knowledge.knownSecrets.length > 0 && (
                        <div className="p-1.5 rounded bg-emerald-950/30 border border-emerald-500/20">
                          <div className="font-semibold text-emerald-400 flex items-center gap-1 mb-0.5">
                            <Key className="w-2.5 h-2.5" /> Tri thức được phép biết:
                          </div>
                          <ul className="list-disc list-inside text-emerald-200/80 space-y-0.5">
                            {knowledge.knownSecrets.map((s, idx) => (
                              <li key={idx} className="truncate">{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {knowledge?.forbiddenSecrets && knowledge.forbiddenSecrets.length > 0 && (
                        <div className="p-1.5 rounded bg-rose-950/40 border border-rose-500/30">
                          <div className="font-semibold text-rose-400 flex items-center gap-1 mb-0.5">
                            <EyeOff className="w-2.5 h-2.5" /> Tuyệt đối cấm biết (AI Guard):
                          </div>
                          <ul className="list-disc list-inside text-rose-200/90 space-y-0.5 font-medium">
                            {knowledge.forbiddenSecrets.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* SUBTAB 2: FORESHADOWING HOOKS */}
        {activeSubTab === 'hooks' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Phục bút & Bí ẩn liên quan:</span>
              <span className="text-[10px] text-rose-400">Vòng đời tình tiết</span>
            </div>

            {activeHooks.map(hook => (
              <div key={hook.id} className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-200 font-serif truncate">{hook.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                    hook.status === 'developing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    hook.status === 'planted' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                    hook.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {hook.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{hook.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Gieo tại: {hook.plantedChapterTitle}</span>
                  <span className="text-amber-400">{hook.chaptersDormant} chương trước</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBTAB 3: CANON LORE & RULES */}
        {activeSubTab === 'lore' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Quy luật Canon tối cao:</span>
              <span className="text-[10px] text-emerald-400">Bất khả xâm phạm</span>
            </div>

            {canonRules.slice(0, 6).map(fact => (
              <div key={fact.id} className="p-2.5 rounded-xl bg-slate-900/50 border border-emerald-500/20 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-300 font-serif">{fact.title}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    CANON
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{fact.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

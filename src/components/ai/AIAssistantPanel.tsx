import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquareQuote, 
  ShieldCheck, 
  Zap, 
  Layers, 
  FileCheck2, 
  Eye, 
  Bot, 
  Compass, 
  BookOpen, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { AIRole, Scene, Part, Character, BibleFact, ForeshadowingHook, AISettings } from '../../types';
import { AIService, AISuggestionResult } from '../../services/aiService';

interface AIAssistantPanelProps {
  currentScene: Scene;
  parts: Part[];
  characters: Character[];
  bibleFacts: BibleFact[];
  hooks: ForeshadowingHook[];
  aiSettings: AISettings;
  onOpenDiffModal: (proposal: AISuggestionResult) => void;
  isWarmTheme: boolean;
}

const AI_ROLES_CONFIG: { id: AIRole; name: string; subtitle: string; icon: string; desc: string; samplePrompt: string }[] = [
  {
    id: 'plot_architect',
    name: 'Kiến Trúc Sư Cốt Truyện',
    subtitle: 'Plot Architect & Pacing',
    icon: '🏛️',
    desc: 'Xây dựng dàn ý, phân tích nhịp 3 hồi, phát hiện đoạn giữa bị chùng, đề xuất ngã rẽ cao trào.',
    samplePrompt: 'Phân tích nhịp truyện Chương 4 và đề xuất 2 bước ngoặt cho Chương 5.'
  },
  {
    id: 'scene_writer',
    name: 'Trợ Lý Viết Cảnh',
    subtitle: 'Scene Continuation & Variations',
    icon: '✍️',
    desc: 'Mở đầu cảnh hấp dẫn, viết tiếp từ con trỏ, tạo 3 phương án phát triển khác nhau mà không tự chèn.',
    samplePrompt: 'Đề xuất 3 hướng viết tiếp cảnh sau khi tiếng gõ thứ ba vang lên.'
  },
  {
    id: 'character_actor',
    name: 'Diễn Viên Nhân Vật',
    subtitle: 'Roleplay & Voice Cadence',
    icon: '🎭',
    desc: 'Nhập vai nhân vật (Sena, Koto, Ryou) thử thoại và phản ứng tâm lý mà không phá vỡ Canon.',
    samplePrompt: 'Nhập vai Koto chất vấn Sena khi thấy vảy rồng phát sáng.'
  },
  {
    id: 'lore_keeper',
    name: 'Người Giữ Tri Thức',
    subtitle: 'Canon Lore & Item Retrieval',
    icon: '📜',
    desc: 'Truy xuất vị trí vật phẩm, nhắc bí mật nhân vật được biết, cảnh báo sáng tạo trái với Canon.',
    samplePrompt: 'Kiểm tra xem Cuốn Sổ Da và Sợi Chỉ Đỏ hiện đang ở đâu và do ai giữ?'
  },
  {
    id: 'logic_auditor',
    name: 'Biên Tập Viên Logic',
    subtitle: 'Continuity & Plot Hole Auditor',
    icon: '🛡️',
    desc: 'Quét mâu thuẫn thời gian, vị trí di chuyển, vật phẩm biến mất và rò rỉ kiến thức nhân vật.',
    samplePrompt: 'Kiểm tra toàn bộ tính logic và mâu thuẫn tri thức trong cảnh hiện tại.'
  },
  {
    id: 'style_editor',
    name: 'Biên Tập Viên Văn Phong',
    subtitle: 'Author Style & Rhythm Analyst',
    icon: '🔍',
    desc: 'Phân tích lặp cấu trúc câu, từ ngữ lạm dụng, độ phân hóa giọng thoại của từng nhân vật.',
    samplePrompt: 'Soát văn phong đoạn trích và nhận xét độ tự nhiên của lời thoại Koto.'
  },
  {
    id: 'beta_reader',
    name: 'Độc Giả Thử Nghiệm',
    subtitle: 'Simulated Beta Reader Personas',
    icon: '👥',
    desc: 'Mô phỏng phản hồi từ 5 nhóm độc giả: Độc giả mới, Mọt bí ẩn, Độc giả cảm xúc, Nhà phê bình.',
    samplePrompt: 'Đóng vai độc giả mê bí ẩn nhận xét về Chương 4 và dự đoán tình tiết tiếp theo.'
  }
];

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  currentScene,
  parts,
  characters,
  bibleFacts,
  hooks,
  aiSettings,
  onOpenDiffModal,
  isWarmTheme
}) => {
  const [selectedRole, setSelectedRole] = useState<AIRole>('scene_writer');
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latestResult, setLatestResult] = useState<AISuggestionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const activeRoleConfig = AI_ROLES_CONFIG.find(r => r.id === selectedRole) || AI_ROLES_CONFIG[0];

  const handleRunAI = async (customPrompt?: string) => {
    const promptToUse = customPrompt || promptInput || activeRoleConfig.samplePrompt;
    setIsLoading(true);

    try {
      const result = await AIService.requestAssistance(
        selectedRole,
        promptToUse,
        currentScene,
        parts,
        characters,
        bibleFacts,
        hooks,
        aiSettings
      );
      setLatestResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none ${
      isWarmTheme ? 'bg-parchment-50 text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Banner */}
      <div className="p-6 border-b border-white/10 bg-slate-925/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h2 className="font-serif font-bold text-xl tracking-tight">Hệ Thống 7 Trợ Lý AI Chuyên Biệt</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mỗi trợ lý đóng vai trò chuyên môn riêng biệt, gắn kết chặt chẽ với gói ngữ cảnh Canon của cảnh đang viết.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-mono">
          Model: <span className="text-amber-400 font-bold">{aiSettings.provider === 'mock' ? 'Mạch Specialized Engine' : aiSettings.ollamaModel}</span>
        </div>
      </div>

      {/* Main Two-Pane Body */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left Roles Selector */}
        <div className="w-full md:w-80 border-r border-white/10 p-3 overflow-y-auto space-y-2 bg-slate-900/30">
          <div className="text-xs font-semibold text-slate-400 px-2 py-1">Chọn vai trò trợ lý:</div>
          {AI_ROLES_CONFIG.map(role => {
            const isSelected = role.id === selectedRole;

            return (
              <div
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setPromptInput(role.samplePrompt);
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md text-amber-200'
                    : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{role.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-sm text-slate-100">{role.name}</h4>
                  <p className="text-[10px] text-amber-400/80 font-mono mt-0.5">{role.subtitle}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{role.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Interactive Studio */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {/* Active Role Header Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{activeRoleConfig.icon}</span>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-100">{activeRoleConfig.name}</h3>
                <p className="text-xs text-slate-400">{activeRoleConfig.desc}</p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Canon Guard On
            </span>
          </div>

          {/* Prompt Input Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
            <label className="block text-xs font-semibold text-amber-300">Yêu cầu trợ lý (Prompt):</label>
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={activeRoleConfig.samplePrompt}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 font-sans focus:outline-none focus:border-amber-500 resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Gói ngữ cảnh cảnh: "{currentScene.title}" ({currentScene.wordCount} từ)
              </span>

              <button
                onClick={() => handleRunAI()}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Đang suy luận...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Yêu Cầu Trợ Lý</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Results Display */}
          {latestResult && (
            <div className="flex-1 p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif font-bold text-base text-slate-100">{latestResult.title}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyText(latestResult.response)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>

                  {latestResult.options && (
                    <button
                      onClick={() => onOpenDiffModal(latestResult)}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold flex items-center gap-1"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Mở Màn Hình So Sánh Diff</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Main Response Output */}
              <div className="text-xs text-slate-200 font-serif leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl border border-white/5 max-h-96 overflow-y-auto">
                {latestResult.response}
              </div>

              {/* Options Cards Preview if available */}
              {latestResult.options && latestResult.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-amber-300">Các phương án phát triển:</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {latestResult.options.map(opt => (
                      <div key={opt.id} className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 flex flex-col justify-between space-y-2">
                        <div>
                          <h5 className="font-serif font-bold text-xs text-amber-200">{opt.title}</h5>
                          <p className="text-[11px] text-slate-400 line-clamp-3 mt-1">{opt.snippet}</p>
                        </div>
                        <button
                          onClick={() => onOpenDiffModal(latestResult)}
                          className="w-full py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[10px] font-semibold flex items-center justify-center gap-1"
                        >
                          <span>Chọn phương án này</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

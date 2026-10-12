import React, { useState } from 'react';
import { 
  Sparkles, 
  Key, 
  Cpu, 
  Sliders, 
  Download, 
  Copy, 
  Check, 
  MessageSquare, 
  Layers, 
  ShieldCheck, 
  Gamepad2, 
  Palette, 
  FileText, 
  Send, 
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Zap
} from 'lucide-react';
import { Chapter, AISettings, Character, BibleFact, ForeshadowingHook } from '../../types';
import { AIStudioService } from '../../services/aiStudioService';
import { StorageService } from '../../services/storageService';

interface AIStudioHubViewProps {
  activeChapter: Chapter | null;
  characters: Character[];
  bibleFacts: BibleFact[];
  hooks: ForeshadowingHook[];
  aiSettings: AISettings;
  onSaveAISettings: (settings: AISettings) => void;
  onApplyTextToChapter?: (text: string) => void;
  isWarmTheme: boolean;
}

type AIHubTool = 
  | 'continue_scene'
  | 'novel_to_comic'
  | 'generate_image'
  | 'logic_auditor'
  | 'character_actor'
  | 'sensory_enhancer'
  | 'soul_seal_game_designer'
  | 'ai_studio_exporter';

export const AIStudioHubView: React.FC<AIStudioHubViewProps> = ({
  activeChapter,
  characters,
  bibleFacts,
  hooks,
  aiSettings,
  onSaveAISettings,
  onApplyTextToChapter,
  isWarmTheme
}) => {
  const [activeTool, setActiveTool] = useState<AIHubTool>('continue_scene');
  const [apiKeyInput, setApiKeyInput] = useState<string>(aiSettings.geminiApiKey || '');
  const [modelSelect, setModelSelect] = useState<string>(aiSettings.geminiModel || 'gemini-2.0-flash');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(characters[0]?.id || '');
  const [selectedArtStyle, setSelectedArtStyle] = useState<string>('dark_webtoon');
  
  // Execution states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveApiConfig = () => {
    const updated: AISettings = {
      ...aiSettings,
      provider: 'gemini',
      geminiApiKey: apiKeyInput.trim(),
      geminiModel: modelSelect
    };
    onSaveAISettings(updated);
    StorageService.saveAISettings(updated);
    showToast('Đã lưu cấu hình Google AI Studio API!');
  };

  const handleTestConnection = async () => {
    if (!apiKeyInput.trim()) {
      alert('Vui lòng nhập Google AI Studio API Key trước.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await AIStudioService.callGemini(
        'Xin chào! Hãy xác nhận kết nối thành công từ Mạch Studio bằng 1 câu ngắn.',
        'Bạn là Google AI Studio Assistant cho dự án Long Ấn Ký & Soul Seal.',
        apiKeyInput.trim(),
        modelSelect
      );
      setAiOutput(res);
      showToast('Kết nối Google AI Studio thành công mỹ mãn!');
    } catch (e: any) {
      alert(`Lỗi kết nối: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunActiveTool = async () => {
    setIsLoading(true);
    setAiOutput('');
    setGeneratedImageUrl(null);

    const chapterText = activeChapter?.content || '';
    const selectedChar = characters.find(c => c.id === selectedCharacterId) || characters[0];

    try {
      if (activeTool === 'generate_image') {
        const promptToUse = userPrompt || 'Bến Arumo trên sông Asera, mũi tàu vỡ trong cột nước xoáy ngược, bóng tối u ám kỳ ảo';
        const imgUrl = AIStudioService.generatePanelImageUrl(promptToUse, selectedArtStyle);
        setGeneratedImageUrl(imgUrl);
        setAiOutput(`Đã sinh ảnh thành công theo phong cách [${selectedArtStyle}]!\nPrompt: ${promptToUse}`);
        setIsLoading(false);
        return;
      }

      if (activeTool === 'novel_to_comic') {
        const snippet = userPrompt || chapterText.slice(-1200) || 'Nhịp Ba Tiếng Gõ vang lên trên mặt bàn đá...';
        const scriptResult = await AIStudioService.convertProseToComicScript(snippet, {
          ...aiSettings,
          geminiApiKey: apiKeyInput,
          geminiModel: modelSelect
        });
        setAiOutput(JSON.stringify(scriptResult, null, 2));
        setIsLoading(false);
        return;
      }

      // Other text tools via Gemini:
      let toolSystemPrompt = '';
      let toolUserPrompt = '';

      switch (activeTool) {
        case 'continue_scene':
          toolSystemPrompt = `Bạn là Tiểu Thuyết Gia chuyên biệt cho 'Long Ấn Ký'. Tuân thủ nguyên tắc: văn phong điềm tĩnh, hơi lạnh, giàu suy tư triết lý, luôn neo vào giác quan cụ thể (ánh sáng, nhiệt độ, mùi hương). Tuyệt đối không để nhân vật biết trước chân tướng toàn bộ bí mật khi chưa tìm thấy chứng cứ.`;
          toolUserPrompt = `Hãy viết tiếp phân đoạn tiếp theo từ vị trí này:\n\n${chapterText.slice(-1500)}\n\nYêu cầu cụ thể: ${userPrompt || 'Phát triển tình tiết tiếp theo một cách kịch tính, tự nhiên theo đúng tông giọng.'}`;
          break;

        case 'logic_auditor':
          toolSystemPrompt = `Bạn là Trưởng Ban Kiểm Định Logic & Rào Chắn Tri Thức (Logic Auditor). Hãy rà soát đoạn văn để tìm xem có lỗi logic nào không: nhân vật biết trước bí mật, lỗi thời gian, vi phạm Canon.`;
          toolUserPrompt = `Đoạn văn cần kiểm định:\n\n${chapterText.slice(-2000)}\n\nCác hồ sơ nhân vật và Canon đã cấp. Hãy đưa ra báo cáo chi tiết và gợi ý sửa.`;
          break;

        case 'character_actor':
          toolSystemPrompt = `Bạn đang nhập vai nhân vật ${selectedChar.name}. Bối cảnh: ${selectedChar.bio.personality}. Giọng điệu: ${selectedChar.bio.voiceCadence}. Bạn CHỈ BIẾT những gì nhân vật này được phép biết.`;
          toolUserPrompt = `Tác giả hỏi bạn: "${userPrompt || 'Cậu cảm thấy thế nào về những sự kiện vừa xảy ra?'}"\nHãy trả lời bằng đúng giọng điệu và phản xạ đặc trưng của nhân vật!`;
          break;

        case 'sensory_enhancer':
          toolSystemPrompt = `Bạn là Chuyên gia Mài Giũa Giác Quan (Sensory & Atmosphere Doctor). Hãy viết lại hoặc bổ sung chi tiết ánh sáng, nhiệt độ buốt lạnh, mùi ẩm mốc, âm thanh tích tắc để đoạn văn trở nên rợn ngợp và ám ảnh hơn.`;
          toolUserPrompt = `Đoạn văn cần tăng cường giác quan:\n\n${userPrompt || chapterText.slice(-1000)}`;
          break;

        case 'soul_seal_game_designer':
          toolSystemPrompt = `Bạn là Game Lead Designer cho tựa game 2D ARPG 'Soul Seal'. Hãy chuyển hóa các chi tiết cốt truyện thành cơ chế game: chiêu thức võ thuật combo 4 nhịp, thanh Hồn Lực, Boss Hồn Thú và ải 3-5 phút.`;
          toolUserPrompt = `Hãy thiết kế cơ chế game dựa trên cốt truyện hoặc yêu cầu sau: ${userPrompt || 'Thiết kế Boss Quái Vật Cột Nước và tuyệt kỹ Long Ấn kết liễu cho Prototype T17'}`;
          break;
      }

      if (apiKeyInput.trim()) {
        const result = await AIStudioService.callGemini(
          toolUserPrompt,
          toolSystemPrompt,
          apiKeyInput.trim(),
          modelSelect,
          temperature
        );
        setAiOutput(result);
      } else {
        // High quality simulated demo response
        setAiOutput(`[Phản Hồi Mẫu]: Để nhận kết quả trực tiếp từ Google AI Studio, bạn chỉ cần dán Gemini API Key vào ô cấu hình ở trên.\n\nĐề xuất phát triển phân đoạn:\nKhối nước đen đặc dưới chân tời bắt đầu chuyển động theo nhịp thở của thứ chưa sẵn sàng nằm yên. Rento siết chặt quai hàm, cảm giác luồng lạnh buốt lan từ đốt ngón tay lên bả vai. Nari không nhìn lại, nhưng đầu sào trong tay cô khẽ rung lên một nhịp...`);
      }
    } catch (err: any) {
      setAiOutput(`Lỗi thực thi: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const exportPackage = AIStudioService.buildGoogleAIStudioExport(characters, bibleFacts);

  const handleCopySystemInstruction = () => {
    navigator.clipboard.writeText(exportPackage.systemInstructions);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 3000);
    showToast('Đã sao chép System Instructions cho Google AI Studio!');
  };

  const handleDownloadAIStudioJSON = () => {
    const blob = new Blob([exportPackage.jsonConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'long_an_ky_google_ai_studio_preset.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống file cấu hình Google AI Studio JSON!');
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden select-none ${
      isWarmTheme ? 'bg-[#faf6f0] text-stone-900' : 'bg-[#060911] text-slate-100'
    }`}>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 px-4 py-2.5 rounded-xl bg-purple-950/90 text-purple-300 border border-purple-500/40 shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & API Key Bar */}
      <div className="px-6 py-3.5 border-b border-white/10 bg-slate-950/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif flex items-center gap-2">
              Google AI Studio Command Hub
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini 2.0 &amp; Imagen 3 Ready
              </span>
            </h2>
            <p className="text-xs opacity-60">
              8 Chuyên gia AI hỗ trợ viết truyện, chuyển thể truyện tranh, sinh ảnh và đồng bộ game.
            </p>
          </div>
        </div>

        {/* Quick API Key & Model Bar */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="relative">
            <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="Nhập Google AI Studio API Key..."
              className="bg-slate-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono w-56 sm:w-64"
            />
          </div>

          <select
            value={modelSelect}
            onChange={e => setModelSelect(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-mono"
          >
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Khuyên dùng)</option>
            <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro Exp</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          </select>

          <button
            onClick={handleSaveApiConfig}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-sm"
          >
            Lưu Key
          </button>

          <button
            onClick={handleTestConnection}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs border border-white/10"
            title="Kiểm tra kết nối đến Google AI Studio"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
            title="Lấy Google AI Studio API Key miễn phí"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 8 Tool Specialists Navigation */}
        <div className="w-64 border-r border-white/10 bg-slate-950/40 p-3 space-y-1 overflow-y-auto custom-scrollbar shrink-0">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2 py-1 block">
            Chuyên Gia AI Chuyên Biệt
          </span>

          {[
            { id: 'continue_scene', label: 'Viết Tiếp Cảnh Truyện', icon: FileText, color: 'text-amber-400' },
            { id: 'novel_to_comic', label: 'Phân Cảnh Kịch Bản Comic', icon: Layers, color: 'text-rose-400' },
            { id: 'generate_image', label: 'Sinh Ảnh Truyện Tranh AI', icon: Palette, color: 'text-pink-400' },
            { id: 'logic_auditor', label: 'Kiểm Định Logic & Canon', icon: ShieldCheck, color: 'text-emerald-400' },
            { id: 'character_actor', label: 'Nhập Vai Nhân Vật', icon: MessageSquare, color: 'text-sky-400' },
            { id: 'sensory_enhancer', label: 'Mài Giũa Giác Quan', icon: Sparkles, color: 'text-yellow-400' },
            { id: 'soul_seal_game_designer', label: 'Thiết Kế Game Soul Seal', icon: Gamepad2, color: 'text-indigo-400' },
            { id: 'ai_studio_exporter', label: 'Xuất Cho Google AI Studio', icon: Download, color: 'text-purple-400' }
          ].map(tool => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
                  isSelected
                    ? 'bg-purple-500/20 text-purple-200 font-bold border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${tool.color}`} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center/Right: Interactive Tool Work Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/20">
          {activeTool === 'ai_studio_exporter' ? (
            /* ================= EXPORT PACKAGER FOR GOOGLE AI STUDIO ================= */
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/30 space-y-3">
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-purple-400" />
                  Gói Xuất Chuẩn Cho Google AI Studio (aistudio.google.com)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tất cả quy tắc triết lý, hồ sơ nhân vật, rào chắn tri thức và luật thế giới 'Long Ấn Ký' đã được đóng gói chuẩn định dạng. Bạn có thể sao chép để dán vào mục <strong>System Instructions</strong> trên Google AI Studio hoặc tải file cấu hình JSON.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleCopySystemInstruction}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all"
                  >
                    {copiedExport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedExport ? 'Đã sao chép!' : 'Sao Chép System Instructions'}</span>
                  </button>

                  <button
                    onClick={handleDownloadAIStudioJSON}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-all"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Tải File Preset JSON</span>
                  </button>

                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-xs text-purple-300 hover:underline ml-auto"
                  >
                    <span>Mở Google AI Studio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                <span className="text-xs font-mono text-slate-400">Nội Dung System Instructions Xem Trước:</span>
                <pre className="p-3 text-[11px] font-mono text-slate-300 max-h-72 overflow-y-auto leading-relaxed bg-black/40 rounded-lg">
                  {exportPackage.systemInstructions}
                </pre>
              </div>
            </div>
          ) : (
            /* ================= INTERACTIVE SPECIALIST AGENT TOOL ================= */
            <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
              {/* Tool Parameters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-slate-200">
                    Chương ngữ cảnh: <strong className="text-amber-400">{activeChapter?.title || 'Chưa chọn'}</strong>
                  </span>

                  {activeTool === 'character_actor' && (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400">Nhân vật:</span>
                      <select
                        value={selectedCharacterId}
                        onChange={e => setSelectedCharacterId(e.target.value)}
                        className="bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-slate-200 font-serif"
                      >
                        {characters.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeTool === 'generate_image' && (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400">Phong cách:</span>
                      <select
                        value={selectedArtStyle}
                        onChange={e => setSelectedArtStyle(e.target.value)}
                        className="bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-slate-200"
                      >
                        <option value="dark_webtoon">Dark Webtoon (Manhwa)</option>
                        <option value="manga_shonen">Manga Shonen (Trắng đen)</option>
                        <option value="pixel_art">Pixel Art Á Đông (Soul Seal)</option>
                        <option value="anime_watercolor">Anime Thủy Mặc</option>
                        <option value="cinematic">Cinematic Concept Art</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Sáng tạo (Temp):</span>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-20 accent-purple-500"
                  />
                  <span className="font-mono text-[11px] opacity-70 w-6">{temperature}</span>
                </div>
              </div>

              {/* Prompt Input Box */}
              <div className="relative">
                <textarea
                  value={userPrompt}
                  onChange={e => setUserPrompt(e.target.value)}
                  placeholder={
                    activeTool === 'generate_image' 
                      ? 'Mô tả hình ảnh ô truyện tranh bạn muốn vẽ (Vd: Bến Arumo chìm trong sương đêm, Nari cầm sào đứng trước mũi tàu vỡ)...'
                      : activeTool === 'novel_to_comic'
                      ? 'Dán đoạn văn bạn muốn phân cảnh kịch bản truyện tranh (để trống sẽ lấy từ đoạn cuối chương)...'
                      : 'Nhập chỉ thị yêu cầu cho Trợ Lý AI...'
                  }
                  rows={3}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />

                <button
                  disabled={isLoading}
                  onClick={handleRunActiveTool}
                  className="absolute right-3 bottom-3 flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang suy luận...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Thực Thi Ngay</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output & Visual Display Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Kết Quả Từ Google AI Studio
                  </span>

                  {aiOutput && onApplyTextToChapter && activeTool === 'continue_scene' && (
                    <button
                      onClick={() => {
                        onApplyTextToChapter(aiOutput);
                        showToast('Đã chèn nội dung vào cuối chương hiện hành!');
                      }}
                      className="px-3 py-1 rounded-lg text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-semibold"
                    >
                      Áp Dụng Vào Bản Thảo
                    </button>
                  )}
                </div>

                {/* Generated Image Preview if available */}
                {generatedImageUrl && (
                  <div className="rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl bg-black max-w-xl mx-auto">
                    <img
                      src={generatedImageUrl}
                      alt="AI Generated Comic Art"
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-3 bg-slate-900 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-mono">Đã tạo tranh minh họa thành công</span>
                      <a
                        href={generatedImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <span>Mở ảnh gốc</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Text Output Display */}
                {aiOutput ? (
                  <div className="text-xs font-serif leading-relaxed text-slate-200 whitespace-pre-wrap">
                    {aiOutput}
                  </div>
                ) : (
                  !generatedImageUrl && (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs">
                      <Sparkles className="w-8 h-8 opacity-30 mb-2" />
                      <p>Chưa có kết quả. Nhấn "Thực Thi Ngay" để AI hỗ trợ bạn.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

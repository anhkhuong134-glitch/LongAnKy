import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Bot, 
  Cpu, 
  Key, 
  ShieldCheck, 
  Check, 
  HelpCircle,
  Sparkles,
  Server
} from 'lucide-react';
import { AISettings, AIProvider } from '../../types';

interface SettingsModalProps {
  settings: AISettings;
  onSaveSettings: (newSettings: AISettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  onClose
}) => {
  const [provider, setProvider] = useState<AIProvider>(settings.provider);
  const [ollamaUrl, setOllamaUrl] = useState(settings.ollamaUrl || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(settings.ollamaModel || 'llama3.2');
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [geminiModel, setGeminiModel] = useState(settings.geminiModel || 'gemini-1.5-flash');
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [openaiModel, setOpenaiModel] = useState(settings.openaiModel || 'gpt-4o-mini');

  const handleSave = () => {
    onSaveSettings({
      provider,
      ollamaUrl,
      ollamaModel,
      geminiApiKey,
      geminiModel,
      openaiApiKey,
      openaiModel
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-925 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100">Cấu Hình Nhà Cung Cấp AI</h3>
              <p className="text-xs text-slate-400">Local-first với Ollama hoặc Cloud API</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs bg-slate-950">
          {/* Provider Selection */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2">Chọn nguồn AI hoạt động chính:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setProvider('mock')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  provider === 'mock'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-semibold'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span>Mạch Specialized (Demo / Offline)</span>
              </button>

              <button
                onClick={() => setProvider('ollama')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  provider === 'ollama'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-semibold'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Server className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                <span>Ollama (Local AI)</span>
              </button>

              <button
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  provider === 'gemini'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-semibold'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Cpu className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <span>Google Gemini API</span>
              </button>
            </div>
          </div>

          {/* Ollama Config */}
          {provider === 'ollama' && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-500/30 space-y-3">
              <span className="font-semibold text-sky-300 block">Cấu hình Ollama Local (Bảo mật 100% trên máy)</span>
              <div>
                <label className="block text-slate-400 mb-1">Ollama URL</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Tên Model (vd: llama3.2, mistral, qwen2.5)</label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="llama3.2"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          )}

          {/* Gemini Config */}
          {provider === 'gemini' && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-3">
              <span className="font-semibold text-emerald-300 block">Cấu hình Google Gemini API</span>
              <div>
                <label className="block text-slate-400 mb-1">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Model Name</label>
                <input
                  type="text"
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  placeholder="gemini-1.5-flash"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-start space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Mạch cam kết không tải bản thảo của bạn lên máy chủ bên thứ ba trừ khi bạn chỉ định sử dụng Cloud API Key cá nhân.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-925 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium">
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-amber-500/20"
          >
            Lưu Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};

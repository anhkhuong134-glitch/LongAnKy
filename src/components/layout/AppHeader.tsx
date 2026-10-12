import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Clock, 
  GitBranch, 
  Eye, 
  Download, 
  Upload, 
  Settings, 
  RotateCcw, 
  Moon, 
  Sun,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Project } from '../../types';

interface AppHeaderProps {
  project: Project;
  activeTab: 'editor' | 'bible' | 'characters' | 'timeline' | 'foreshadowing' | 'ai_hub' | 'reader' | 'google_sync';
  setActiveTab: (tab: 'editor' | 'bible' | 'characters' | 'timeline' | 'foreshadowing' | 'ai_hub' | 'reader' | 'google_sync') => void;
  isWarmTheme: boolean;
  setIsWarmTheme: (warm: boolean) => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onResetSample: () => void;
  stagedSyncCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  project,
  activeTab,
  setActiveTab,
  isWarmTheme,
  setIsWarmTheme,
  onOpenImport,
  onOpenExport,
  onOpenSettings,
  onResetSample,
  stagedSyncCount = 0
}) => {
  const wordsProgressPercent = Math.min(100, Math.round((project.stats.wordsToday / project.stats.dailyGoal) * 100));

  return (
    <header className={`border-b transition-colors duration-200 select-none ${
      isWarmTheme 
        ? 'bg-parchment-100/90 border-amber-900/20 text-stone-900 backdrop-blur-md' 
        : 'bg-slate-925/90 border-slate-800/80 text-slate-100 backdrop-blur-md'
    }`}>
      {/* Top Main Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Brand Logo & Project Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-rose-600 to-purple-600 shadow-md shadow-amber-500/20 text-white font-serif font-bold text-lg">
            M
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif font-bold text-base tracking-tight leading-tight">
                {project.title}
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
                AI Studio Ready
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> GG Sync Live
              </span>
            </div>
            <p className="text-xs opacity-60 truncate max-w-md hidden sm:block">
              Đọc Truyện Chữ &amp; Tranh • Đồng Bộ Google Docs &amp; Sheets • Google AI Studio
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="hidden lg:flex items-center p-1 rounded-xl bg-slate-950/40 border border-white/5 text-xs font-medium space-x-1">
          <button
            onClick={() => setActiveTab('reader')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'reader'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Đọc Sách (Chữ &amp; Tranh)</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'editor'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Soạn Thảo (3 Cột)</span>
          </button>

          <button
            onClick={() => setActiveTab('google_sync')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
              activeTab === 'google_sync'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Docs &amp; Sheets</span>
            {stagedSyncCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai_hub')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ai_hub'
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm font-bold'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Google AI Studio Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('bible')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bible'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Story Bible</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'characters'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nhân Vật</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('foreshadowing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'foreshadowing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'hover:bg-white/5 opacity-75 hover:opacity-100'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-rose-400" />
            <span>Phục Bút</span>
          </button>
        </nav>

        {/* Right Toolbar Actions */}
        <div className="flex items-center space-x-2">
          {/* Daily Word Target Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/10 text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <div>
              <span className="font-semibold text-amber-300">{project.stats.wordsToday.toLocaleString()}</span>
              <span className="opacity-50">/{project.stats.dailyGoal.toLocaleString()} từ hôm nay</span>
            </div>
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                style={{ width: `${wordsProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Import / Export / Settings / Theme */}
          <button
            onClick={onOpenImport}
            title="Nhập văn bản từ Google Docs, Word, TXT"
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/5 transition-all text-xs flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Nhập</span>
          </button>

          <button
            onClick={onOpenExport}
            title="Xuất bản thảo sạch (Word, Markdown, Beta Draft)"
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/5 transition-all text-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Xuất</span>
          </button>

          <button
            onClick={() => setIsWarmTheme(!isWarmTheme)}
            title="Chuyển đổi giao diện Đêm / Giấy Parchment thư giãn"
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/5 transition-all text-xs"
          >
            {isWarmTheme ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="Cấu hình AI (Ollama Local, Gemini, OpenAI)"
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/5 transition-all text-xs"
          >
            <Settings className="w-3.5 h-3.5 text-slate-300" />
          </button>

          <button
            onClick={onResetSample}
            title="Nạp lại dự án mẫu Long Ấn Ký"
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-rose-900/40 border border-rose-500/20 transition-all text-xs text-rose-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto px-2 py-1.5 space-x-1 border-t border-white/5 text-xs font-medium">
        {[
          { id: 'reader', label: 'Đọc Sách (Chữ & Tranh)', icon: BookOpen },
          { id: 'editor', label: 'Soạn Thảo', icon: BookOpen },
          { id: 'google_sync', label: 'Google Docs & Sheets', icon: CheckCircle2 },
          { id: 'ai_hub', label: 'AI Studio Hub', icon: Sparkles },
          { id: 'bible', label: 'Story Bible', icon: ShieldCheck },
          { id: 'characters', label: 'Nhân Vật', icon: Users },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'foreshadowing', label: 'Phục Bút', icon: GitBranch }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

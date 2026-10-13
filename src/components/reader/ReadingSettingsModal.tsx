import React from 'react';
import { X, Check, Type, AlignLeft, Maximize2, Palette } from 'lucide-react';

export type ReadingThemeId = 'obsidian' | 'parchment' | 'abyss' | 'amber';
export type FontFamilyId = 'serif' | 'lora' | 'sans' | 'mono';
export type PageWidthId = 'narrow' | 'standard' | 'wide';

export interface ReadingPreferences {
  theme: ReadingThemeId;
  fontFamily: FontFamilyId;
  fontSize: number;
  lineHeight: number;
  pageWidth: PageWidthId;
}

interface ReadingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefs: ReadingPreferences;
  onUpdatePrefs: (newPrefs: Partial<ReadingPreferences>) => void;
}

export const THEME_OPTIONS: { id: ReadingThemeId; name: string; icon: string; previewBg: string; previewText: string }[] = [
  { id: 'obsidian', name: 'Huyền Long Dạ Cảnh', icon: '🌌', previewBg: 'bg-[#060a14]', previewText: 'text-slate-100' },
  { id: 'parchment', name: 'Giấy Dó Hoàng Gia', icon: '📜', previewBg: 'bg-[#f4ebe1]', previewText: 'text-[#2a1e14]' },
  { id: 'abyss', name: 'Vực Thẳm Asera', icon: '🌊', previewBg: 'bg-[#030d17]', previewText: 'text-[#bae6fd]' },
  { id: 'amber', name: 'Đèn Dầu Bến Tàu', icon: '🕯️', previewBg: 'bg-[#130b05]', previewText: 'text-[#ecd2bd]' }
];

export const FONT_OPTIONS: { id: FontFamilyId; name: string; fontClass: string; desc: string }[] = [
  { id: 'serif', name: 'Merriweather', fontClass: 'font-serif', desc: 'Cổ điển tiểu thuyết' },
  { id: 'lora', name: 'Lora', fontClass: 'font-serif italic', desc: 'Thơ mộng trang nhã' },
  { id: 'sans', name: 'Plus Jakarta', fontClass: 'font-sans', desc: 'Hiện đại trong trẻo' },
  { id: 'mono', name: 'JetBrains', fontClass: 'font-mono', desc: 'Tối giản đều nét' }
];

export const ReadingSettingsModal: React.FC<ReadingSettingsModalProps> = ({
  isOpen,
  onClose,
  prefs,
  onUpdatePrefs
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#0c1222]/95 border border-indigo-500/30 rounded-3xl shadow-2xl p-6 space-y-6 text-slate-100 backdrop-blur-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100">Tùy Chỉnh Không Gian Đọc</h3>
              <p className="text-[11px] text-slate-400">Tối ưu trải nghiệm mắt và cảm xúc theo phong cách của bạn</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Theme Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>🎨 Phong Cách Màu Sắc &amp; Ánh Sáng</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {THEME_OPTIONS.map(th => {
              const isActive = prefs.theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => onUpdatePrefs({ theme: th.id })}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isActive 
                      ? 'border-amber-400/60 bg-amber-500/15 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/30' 
                      : 'border-white/10 bg-slate-900/60 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg">{th.icon}</span>
                    <div>
                      <div className="font-serif font-bold text-xs text-slate-200">{th.name}</div>
                    </div>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Family Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-pink-400" />
            <span>Phông Chữ Văn Học</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FONT_OPTIONS.map(f => {
              const isActive = prefs.fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onUpdatePrefs({ fontFamily: f.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-pink-400/60 bg-pink-500/15 text-pink-200 shadow-sm'
                      : 'border-white/10 bg-slate-900/40 hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className={`font-medium text-xs ${f.fontClass}`}>
                    {f.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{f.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Font Size Stepper */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Kích Cỡ Chữ</label>
            <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
              {prefs.fontSize}px
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdatePrefs({ fontSize: Math.max(14, prefs.fontSize - 1) })}
              className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            >
              A- (Thu nhỏ)
            </button>
            <input
              type="range"
              min={14}
              max={26}
              step={1}
              value={prefs.fontSize}
              onChange={e => onUpdatePrefs({ fontSize: Number(e.target.value) })}
              className="flex-1 accent-amber-400 cursor-pointer"
            />
            <button
              onClick={() => onUpdatePrefs({ fontSize: Math.min(26, prefs.fontSize + 1) })}
              className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-bold transition-colors cursor-pointer"
            >
              A+ (Phóng to)
            </button>
          </div>
        </div>

        {/* 4. Line Spacing & Page Width */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <AlignLeft className="w-3 h-3 text-cyan-400" />
              <span>Khoảng Cách Dòng</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/10">
              {[
                { val: 1.6, label: 'Khít' },
                { val: 1.85, label: 'Chuẩn' },
                { val: 2.2, label: 'Thoáng' }
              ].map(lh => (
                <button
                  key={lh.val}
                  onClick={() => onUpdatePrefs({ lineHeight: lh.val })}
                  className={`py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    prefs.lineHeight === lh.val
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lh.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-purple-400" />
              <span>Khổ Rộng Trang</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/10">
              {[
                { val: 'narrow' as const, label: 'Hẹp' },
                { val: 'standard' as const, label: 'Vừa' },
                { val: 'wide' as const, label: 'Rộng' }
              ].map(pw => (
                <button
                  key={pw.val}
                  onClick={() => onUpdatePrefs({ pageWidth: pw.val })}
                  className={`py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    prefs.pageWidth === pw.val
                      ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pw.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-indigo-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 font-serif font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
          >
            Đã Lưu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

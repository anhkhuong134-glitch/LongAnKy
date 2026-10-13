import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  X, 
  Sparkles, 
  ChevronDown, 
  Sliders, 
  ArrowDownCircle,
  Headphones
} from 'lucide-react';
import { AudioDramaSentence, VoiceMode, AudioSpeaker, SPEAKER_CONFIGS } from '../../services/audioDramaService';

interface AudioDramaPlayerBarProps {
  currentSentence: AudioDramaSentence | null;
  currentIndex: number;
  totalSentences: number;
  isPlaying: boolean;
  voiceMode: VoiceMode;
  speed: number;
  isAutoScrollEnabled: boolean;
  onTogglePlay: () => void;
  onPrevSentence: () => void;
  onNextSentence: () => void;
  onChangeVoiceMode: (mode: VoiceMode) => void;
  onChangeSpeed: (speed: number) => void;
  onToggleAutoScroll: () => void;
  onClose: () => void;
}

export const AudioDramaPlayerBar: React.FC<AudioDramaPlayerBarProps> = ({
  currentSentence,
  currentIndex,
  totalSentences,
  isPlaying,
  voiceMode,
  speed,
  isAutoScrollEnabled,
  onTogglePlay,
  onPrevSentence,
  onNextSentence,
  onChangeVoiceMode,
  onChangeSpeed,
  onToggleAutoScroll,
  onClose,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const speakerConfig = currentSentence ? SPEAKER_CONFIGS[currentSentence.speaker] : SPEAKER_CONFIGS.narrator;

  const modeLabels: Record<VoiceMode, { label: string; icon: string }> = {
    multi_voice: { label: 'Kịch Đa Giọng Nhân Vật', icon: '🎭' },
    warm_narrator: { label: 'Giọng Kể Trầm Ấm', icon: '🎙️' },
    sweet_female: { label: 'Giọng Nữ Ngọt Ngào', icon: '🌸' },
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative rounded-2xl bg-slate-950/95 border border-amber-400/35 shadow-[0_15px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-3 sm:p-4 text-slate-100 flex flex-col gap-2.5">
        {/* Top Mini Bar: Current Sentence Preview & Speaker Tag */}
        <div className="flex items-center justify-between gap-3 text-xs border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Animated Equalizer Waves */}
            <div className="flex items-end gap-0.5 h-3.5 px-1 shrink-0">
              <span className={`w-1 bg-amber-400 rounded-full ${isPlaying ? 'animate-bounce h-3.5' : 'h-1.5'}`} style={{ animationDuration: '0.6s' }} />
              <span className={`w-1 bg-pink-400 rounded-full ${isPlaying ? 'animate-bounce h-4' : 'h-2'}`} style={{ animationDuration: '0.4s' }} />
              <span className={`w-1 bg-purple-400 rounded-full ${isPlaying ? 'animate-bounce h-3' : 'h-1'}`} style={{ animationDuration: '0.7s' }} />
              <span className={`w-1 bg-amber-300 rounded-full ${isPlaying ? 'animate-bounce h-4.5' : 'h-2.5'}`} style={{ animationDuration: '0.5s' }} />
            </div>

            {/* Speaker Tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 text-amber-200 font-serif font-bold text-[11px] shrink-0 shadow-sm">
              <span>{speakerConfig.icon}</span>
              <span>{currentSentence?.isDialogue ? speakerConfig.label : 'Người Dẫn Chuyện'}</span>
            </div>

            {/* Snippet preview */}
            <p className="text-[11px] text-slate-300 truncate font-serif italic min-w-0 flex-1">
              {currentSentence?.text || 'Đang sẵn sàng đọc...'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Progress counter */}
            <span className="text-[10px] font-mono text-amber-300/80 px-2 py-0.5 rounded bg-white/5 border border-white/10">
              {totalSentences > 0 ? `${currentIndex + 1}/${totalSentences}` : '0/0'}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng thanh đọc audio"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              disabled={currentIndex <= 0}
              onClick={onPrevSentence}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-slate-200 transition-all cursor-pointer"
              title="Lùi lại 1 câu (⏮️)"
            >
              <SkipBack className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={onTogglePlay}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={isPlaying ? "Tạm dừng đọc" : "Tiếp tục đọc"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-slate-950" />
                  <span className="font-serif">Tạm Dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-slate-950" />
                  <span className="font-serif">Đọc Tiếp</span>
                </>
              )}
            </button>

            <button
              disabled={currentIndex >= totalSentences - 1}
              onClick={onNextSentence}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-slate-200 transition-all cursor-pointer"
              title="Nhảy tới câu tiếp theo (⏭️)"
            >
              <SkipForward className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          {/* Center / Right: Mode Switcher & Speed */}
          <div className="flex items-center gap-2 text-xs">
            {/* Auto-scroll Switch */}
            <button
              onClick={onToggleAutoScroll}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer text-[11px] ${
                isAutoScrollEnabled
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title="Tự động cuộn trang khi đọc tới dòng mới"
            >
              <ArrowDownCircle className={`w-3.5 h-3.5 ${isAutoScrollEnabled ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Tự Cuộn</span>
            </button>

            {/* Voice Mode Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-center gap-1.5 cursor-pointer text-[11px] text-pink-200"
                title="Chọn chế độ giọng đọc"
              >
                <span>{modeLabels[voiceMode].icon}</span>
                <span className="hidden sm:inline font-medium">{modeLabels[voiceMode].label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isMenuOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-64 p-2 rounded-2xl bg-slate-950/95 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] text-slate-400 font-serif font-bold uppercase border-b border-white/10">
                    Chế độ giọng đọc
                  </div>
                  {(Object.keys(modeLabels) as VoiceMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        onChangeVoiceMode(mode);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center gap-2 cursor-pointer transition-all text-xs ${
                        voiceMode === mode
                          ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{modeLabels[mode].icon}</span>
                      <div className="min-w-0 flex-1">
                        <div>{modeLabels[mode].label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {mode === 'multi_voice' 
                            ? 'Giọng riêng từng nhân vật (Rento, Nari, Tovan...)'
                            : mode === 'warm_narrator'
                            ? 'Giọng trầm ấm truyền cảm'
                            : 'Giọng nữ nhẹ nhàng, trong sáng'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Speed Selector */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-[11px] font-mono">
              {[0.8, 1.0, 1.25].map(s => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    speed === s
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Tốc độ đọc ${s}x`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

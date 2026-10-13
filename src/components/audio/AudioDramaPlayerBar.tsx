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
  Headphones,
  Users,
  Check
} from 'lucide-react';
import { 
  AudioDramaSentence, 
  VoiceThemeId, 
  VOICE_THEMES, 
  SPEAKER_METADATA 
} from '../../services/audioDramaService';

interface AudioDramaPlayerBarProps {
  currentSentence: AudioDramaSentence | null;
  currentIndex: number;
  totalSentences: number;
  currentWordIndex?: number;
  isPlaying: boolean;
  voiceTheme: VoiceThemeId;
  speed: number;
  isAutoScrollEnabled: boolean;
  onTogglePlay: () => void;
  onPrevSentence: () => void;
  onNextSentence: () => void;
  onChangeVoiceTheme: (theme: VoiceThemeId) => void;
  onChangeSpeed: (speed: number) => void;
  onToggleAutoScroll: () => void;
  onClose: () => void;
}

export const AudioDramaPlayerBar: React.FC<AudioDramaPlayerBarProps> = ({
  currentSentence,
  currentIndex,
  totalSentences,
  currentWordIndex = 0,
  isPlaying,
  voiceTheme,
  speed,
  isAutoScrollEnabled,
  onTogglePlay,
  onPrevSentence,
  onNextSentence,
  onChangeVoiceTheme,
  onChangeSpeed,
  onToggleAutoScroll,
  onClose,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isCastPreviewOpen, setIsCastPreviewOpen] = useState(false);

  const activeTheme = VOICE_THEMES[voiceTheme] || VOICE_THEMES.mythic_drama;
  const speakerMeta = currentSentence ? SPEAKER_METADATA[currentSentence.speaker] : SPEAKER_METADATA.narrator;

  // Words inside the current sentence for live preview in player bar
  const sentenceWords = currentSentence?.words || [];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative rounded-2xl bg-slate-950/95 border border-amber-400/40 shadow-[0_20px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-3 sm:p-4 text-slate-100 flex flex-col gap-2.5 ring-1 ring-white/10">
        
        {/* Top Mini Bar: Current Sentence Preview & Speaker Tag */}
        <div className="flex items-center justify-between gap-3 text-xs border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Animated Equalizer Waves */}
            <div className="flex items-end gap-0.5 h-3.5 px-1 shrink-0">
              <span className={`w-1 bg-amber-400 rounded-full transition-all ${isPlaying ? 'animate-bounce h-3.5' : 'h-1.5'}`} style={{ animationDuration: '0.6s' }} />
              <span className={`w-1 bg-pink-400 rounded-full transition-all ${isPlaying ? 'animate-bounce h-4' : 'h-2'}`} style={{ animationDuration: '0.4s' }} />
              <span className={`w-1 bg-purple-400 rounded-full transition-all ${isPlaying ? 'animate-bounce h-3' : 'h-1'}`} style={{ animationDuration: '0.7s' }} />
              <span className={`w-1 bg-amber-300 rounded-full transition-all ${isPlaying ? 'animate-bounce h-4.5' : 'h-2.5'}`} style={{ animationDuration: '0.5s' }} />
            </div>

            {/* Speaking Character Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-pink-500/20 to-purple-500/20 border border-amber-400/50 text-amber-200 font-serif font-bold text-[11px] shrink-0 shadow-sm animate-pulse">
              <span>{speakerMeta.icon}</span>
              <span>{currentSentence?.isDialogue ? speakerMeta.label : 'Người Dẫn Chuyện'}</span>
            </div>

            {/* Karaoke Live Word-by-Word Preview */}
            <div className="text-[11px] text-slate-300 truncate font-serif italic min-w-0 flex-1">
              {sentenceWords.length > 0 ? (
                <span className="flex items-center gap-1 overflow-hidden">
                  {sentenceWords.map((word, wIdx) => {
                    const isCurrentWord = wIdx === currentWordIndex;
                    const isPastWord = wIdx < currentWordIndex;
                    return (
                      <span
                        key={wIdx}
                        className={`transition-all duration-100 ${
                          isCurrentWord 
                            ? 'text-amber-300 font-bold bg-amber-400/30 px-1 rounded shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-105 inline-block not-italic' 
                            : isPastWord
                            ? 'text-amber-200/90 font-medium'
                            : 'text-slate-400 opacity-75'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </span>
              ) : (
                <span>{currentSentence?.text || 'Sẵn sàng đọc audio...'}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Character Casts Button */}
            <button
              onClick={() => setIsCastPreviewOpen(prev => !prev)}
              className="p-1 sm:px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Xem danh sách chất giọng từng nhân vật"
            >
              <Users className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Diễn Viên ({Object.keys(activeTheme.speakerProfiles).length})</span>
            </button>

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
                  ? 'bg-amber-500/25 border-amber-400/50 text-amber-300 shadow-sm ring-1 ring-amber-400/30'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title="Tự động cuộn trang khi hết dòng để theo kịp chữ đọc"
            >
              <ArrowDownCircle className={`w-3.5 h-3.5 ${isAutoScrollEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline font-medium">Tự Cuộn Dòng</span>
            </button>

            {/* Voice Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(prev => !prev)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/40 via-slate-800 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-400/30 flex items-center gap-1.5 cursor-pointer text-[11px] text-pink-200 shadow-sm"
                title="Chọn phong cách / thể loại giọng đọc"
              >
                <span>{activeTheme.icon}</span>
                <span className="hidden sm:inline font-serif font-bold text-amber-200">{activeTheme.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-80 p-2.5 rounded-2xl bg-slate-950/98 border border-amber-500/40 shadow-2xl backdrop-blur-2xl z-50 space-y-1.5">
                  <div className="px-2.5 py-1 text-[11px] text-amber-300 font-serif font-bold uppercase border-b border-white/10 flex items-center justify-between">
                    <span>Chọn Thể Loại Giọng Đọc</span>
                    <span className="text-[10px] text-slate-400 font-normal">5 phong cách</span>
                  </div>

                  {(Object.keys(VOICE_THEMES) as VoiceThemeId[]).map(themeId => {
                    const theme = VOICE_THEMES[themeId];
                    const isSelected = voiceTheme === themeId;

                    return (
                      <button
                        key={themeId}
                        onClick={() => {
                          onChangeVoiceTheme(themeId);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 cursor-pointer transition-all text-xs border ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 font-bold border-amber-500/40 shadow-md ring-1 ring-amber-400/30'
                            : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5">{theme.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-xs">{theme.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-amber-300 font-mono">
                              {theme.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                            {theme.description}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Speed Selector */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-[11px] font-mono">
              {[0.8, 1.0, 1.2].map(s => (
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

        {/* Expandable Character Casts Modal */}
        {isCastPreviewOpen && (
          <div className="mt-2 pt-2.5 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <span>🎭</span>
                <span>Phân Vai Giọng Đọc Nhân Vật — {activeTheme.name}</span>
              </span>
              <button
                onClick={() => setIsCastPreviewOpen(false)}
                className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Thu gọn ✕
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Hệ thống tự động phát hiện lời thoại trong ngoặc kép hoặc dấu gạch đầu dòng. Khi đến lượt nhân vật nào nói, giọng nói của nhân vật đó sẽ tự động cất lên với âm sắc và tốc độ riêng biệt:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px] max-h-48 overflow-y-auto custom-scrollbar p-1">
              {(Object.keys(activeTheme.speakerProfiles) as Array<keyof typeof activeTheme.speakerProfiles>).map((speakerKey) => {
                const meta = SPEAKER_METADATA[speakerKey];
                const profile = activeTheme.speakerProfiles[speakerKey];
                const isCurrentSpeaking = currentSentence?.speaker === speakerKey && isPlaying;

                return (
                  <div
                    key={speakerKey}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                      isCurrentSpeaking
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-md'
                        : 'bg-white/5 border-white/5 text-slate-300'
                    }`}
                  >
                    <span className="text-base shrink-0">{meta.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold truncate flex items-center gap-1">
                        <span>{meta.label}</span>
                        {isCurrentSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        Cao độ: {profile.pitch.toFixed(2)} • {meta.gender === 'female' ? 'Nữ' : meta.gender === 'male' ? 'Nam' : 'Dẫn truyện'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

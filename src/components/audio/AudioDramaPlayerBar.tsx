import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X, 
  ChevronDown, 
  ArrowDownCircle,
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
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative rounded-2xl bg-[#FFFDF8]/96 border border-[#DCE6DF] shadow-[0_16px_50px_rgba(41,59,54,0.16)] backdrop-blur-2xl p-3.5 sm:p-4 text-[#293B36] flex flex-col gap-2.5 ring-1 ring-[#376F64]/10">
        
        {/* Top Mini Bar: Current Sentence Preview & Speaker Tag */}
        <div className="flex items-center justify-between gap-3 text-xs border-b border-[#DCE6DF]/80 pb-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Animated Equalizer Waves */}
            <div className="flex items-end gap-0.5 h-3.5 px-1 shrink-0" title={isPlaying ? "Đang phát âm thanh" : "Tạm dừng"}>
              <span className={`w-1 bg-[#376F64] rounded-full transition-all ${isPlaying ? 'animate-bounce h-3.5' : 'h-1.5'}`} style={{ animationDuration: '0.6s' }} />
              <span className={`w-1 bg-[#4E8F82] rounded-full transition-all ${isPlaying ? 'animate-bounce h-4' : 'h-2'}`} style={{ animationDuration: '0.4s' }} />
              <span className={`w-1 bg-[#7BAE9E] rounded-full transition-all ${isPlaying ? 'animate-bounce h-3' : 'h-1'}`} style={{ animationDuration: '0.7s' }} />
              <span className={`w-1 bg-[#2B5A51] rounded-full transition-all ${isPlaying ? 'animate-bounce h-4.5' : 'h-2.5'}`} style={{ animationDuration: '0.5s' }} />
            </div>

            {/* Speaking Character Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E4F1E9] border border-[#376F64]/25 text-[#293B36] font-serif font-bold text-[11px] shrink-0 shadow-xs">
              <span>{speakerMeta.icon}</span>
              <span>{currentSentence?.isDialogue ? speakerMeta.label : 'Người Dẫn Chuyện'}</span>
            </div>

            {/* Karaoke Live Word-by-Word Preview */}
            <div className="text-[11px] text-[#5F706A] truncate font-serif italic min-w-0 flex-1">
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
                            ? 'text-[#376F64] font-extrabold bg-[#E4F1E9] px-1.5 py-0.5 rounded shadow-xs scale-105 inline-block not-italic ring-1 ring-[#376F64]/30' 
                            : isPastWord
                            ? 'text-[#293B36] font-medium'
                            : 'text-[#5F706A]/70'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </span>
              ) : (
                <span>{currentSentence?.text || 'Sẵn sàng phát kịch truyền thanh...'}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Character Casts Button */}
            <button
              onClick={() => setIsCastPreviewOpen(prev => !prev)}
              className="p-1 sm:px-2.5 py-1 rounded-lg bg-[#F2F8F5] hover:bg-[#E4F1E9] border border-[#DCE6DF] text-[#376F64] hover:text-[#2B5A51] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Xem danh sách chất giọng từng nhân vật"
            >
              <Users className="w-3.5 h-3.5 text-[#376F64]" />
              <span className="hidden sm:inline">Diễn Viên ({Object.keys(activeTheme.speakerProfiles).length})</span>
            </button>

            {/* Progress counter */}
            <span className="text-[11px] font-mono text-[#5F706A] px-2 py-0.5 rounded bg-[#F2F8F5] border border-[#DCE6DF]">
              {totalSentences > 0 ? `${currentIndex + 1}/${totalSentences}` : '0/0'}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#5F706A] hover:text-[#293B36] hover:bg-[#F2F8F5] transition-colors cursor-pointer"
              title="Đóng thanh đọc audio"
            >
              <X className="w-4 h-4" />
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
              className="p-2 sm:p-2.5 rounded-xl bg-[#F2F8F5] hover:bg-[#E4F1E9] border border-[#DCE6DF] disabled:opacity-30 disabled:pointer-events-none text-[#376F64] transition-all cursor-pointer"
              title="Lùi lại 1 câu (⏮️)"
            >
              <SkipBack className="w-4 h-4 text-[#376F64]" />
            </button>

            <button
              onClick={onTogglePlay}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#376F64] hover:bg-[#2B5A51] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(55,111,100,0.28)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title={isPlaying ? "Tạm dừng phát" : "Tiếp tục phát"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-white" />
                  <span className="font-serif">Tạm Dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span className="font-serif">Đọc Tiếp</span>
                </>
              )}
            </button>

            <button
              disabled={currentIndex >= totalSentences - 1}
              onClick={onNextSentence}
              className="p-2 sm:p-2.5 rounded-xl bg-[#F2F8F5] hover:bg-[#E4F1E9] border border-[#DCE6DF] disabled:opacity-30 disabled:pointer-events-none text-[#376F64] transition-all cursor-pointer"
              title="Nhảy tới câu tiếp theo (⏭️)"
            >
              <SkipForward className="w-4 h-4 text-[#376F64]" />
            </button>
          </div>

          {/* Center / Right: Mode Switcher & Speed */}
          <div className="flex items-center gap-2 text-xs">
            {/* Auto-scroll Switch */}
            <button
              onClick={onToggleAutoScroll}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer text-[11px] ${
                isAutoScrollEnabled
                  ? 'bg-[#E4F1E9] border-[#376F64]/40 text-[#376F64] font-semibold shadow-xs ring-1 ring-[#376F64]/20'
                  : 'bg-[#F2F8F5] border-[#DCE6DF] text-[#5F706A] hover:text-[#293B36]'
              }`}
              title="Tự động cuộn trang khi hết dòng để theo kịp chữ đọc"
            >
              <ArrowDownCircle className={`w-3.5 h-3.5 ${isAutoScrollEnabled ? 'text-[#376F64] animate-pulse' : 'text-[#5F706A]'}`} />
              <span className="hidden sm:inline">Tự Cuộn Dòng</span>
            </button>

            {/* Voice Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(prev => !prev)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F2F8F5] hover:bg-[#E4F1E9] border border-[#DCE6DF] flex items-center gap-1.5 cursor-pointer text-[11px] text-[#293B36] font-semibold shadow-xs transition-colors"
                title="Chọn phong cách / thể loại giọng đọc"
              >
                <span>{activeTheme.icon}</span>
                <span className="hidden sm:inline font-serif text-[#376F64]">{activeTheme.name}</span>
                <ChevronDown className="w-3 h-3 text-[#5F706A]" />
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <div className="absolute bottom-full mb-2 right-0 w-80 p-2.5 rounded-2xl bg-[#FFFDF8] border border-[#DCE6DF] shadow-2xl backdrop-blur-2xl z-50 space-y-1.5 text-[#293B36]">
                  <div className="px-2.5 py-1 text-[11px] text-[#376F64] font-serif font-bold uppercase border-b border-[#DCE6DF] flex items-center justify-between">
                    <span>Chọn Thể Loại Giọng Đọc</span>
                    <span className="text-[10px] text-[#5F706A] font-normal">5 phong cách</span>
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
                            ? 'bg-[#E4F1E9] text-[#293B36] font-bold border-[#376F64]/40 shadow-xs ring-1 ring-[#376F64]/20'
                            : 'border-transparent text-[#5F706A] hover:bg-[#F2F8F5] hover:text-[#293B36]'
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5">{theme.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-xs text-[#293B36]">{theme.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E4F1E9] text-[#376F64] font-mono">
                              {theme.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#5F706A] font-normal mt-0.5 leading-snug">
                            {theme.description}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#376F64] shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Speed Selector */}
            <div className="flex items-center bg-[#F2F8F5] border border-[#DCE6DF] rounded-xl p-0.5 text-[11px] font-mono">
              {[0.8, 1.0, 1.2].map(s => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    speed === s
                      ? 'bg-[#376F64] text-white font-bold shadow-xs'
                      : 'text-[#5F706A] hover:text-[#293B36]'
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
          <div className="mt-2.5 pt-3 border-t border-[#DCE6DF] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-[#376F64] flex items-center gap-1.5">
                <span>🎭</span>
                <span>Phân Vai Giọng Đọc Nhân Vật — {activeTheme.name}</span>
              </span>
              <button
                onClick={() => setIsCastPreviewOpen(false)}
                className="text-[11px] text-[#5F706A] hover:text-[#293B36] cursor-pointer font-medium"
              >
                Thu gọn ✕
              </button>
            </div>
            
            <p className="text-[11px] text-[#5F706A] leading-relaxed">
              Hệ thống tự động phát hiện lời thoại trong ngoặc kép hoặc gạch đầu dòng. Khi đến lượt nhân vật nào nói, giọng đọc sẽ tự động điều chỉnh âm sắc và cao độ riêng biệt:
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
                        ? 'bg-[#E4F1E9] border-[#376F64] text-[#293B36] ring-2 ring-[#376F64]/30 shadow-xs'
                        : 'bg-[#F2F8F5] border-[#DCE6DF] text-[#293B36]'
                    }`}
                  >
                    <span className="text-base shrink-0">{meta.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold truncate flex items-center gap-1 text-[#293B36]">
                        <span>{meta.label}</span>
                        {isCurrentSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-[#376F64] animate-ping" />}
                      </div>
                      <div className="text-[9px] text-[#5F706A] truncate">
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

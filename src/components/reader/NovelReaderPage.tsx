import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, List, Type, MoreHorizontal, Bookmark,
  Headphones, Maximize, Minimize, CheckCircle2, RotateCcw, X, MessageSquare,
  Flame, Heart, Sparkles, Flower2, Send
} from 'lucide-react';
import {
  PublishedContentService,
  PublishedChapter,
  PublishedPart
} from '../../services/publishedContent';
import {
  ReadingProgressService,
  ReaderSettings
} from '../../services/readingProgress';
import { AudioDramaPlayerBar } from '../audio/AudioDramaPlayerBar';
import { 
  AudioDramaService, 
  VoiceThemeId, 
  SPEAKER_METADATA,
  AudioDramaSentence,
  AudioSpeaker
} from '../../services/audioDramaService';
import { UserProfile } from '../../types';

interface NovelReaderPageProps {
  chapterId: string;
  currentUser: UserProfile | null;
  onNavigate: (path: string) => void;
}

export const NovelReaderPage: React.FC<NovelReaderPageProps> = ({
  chapterId,
  currentUser,
  onNavigate,
}) => {
  const [chapter, setChapter] = useState<PublishedChapter | null>(null);
  const [part, setPart] = useState<PublishedPart | null>(null);
  const [prevChapter, setPrevChapter] = useState<PublishedChapter | null>(null);
  const [nextChapter, setNextChapter] = useState<PublishedChapter | null>(null);

  // Settings
  const [settings, setSettings] = useState<ReaderSettings>(() => ReadingProgressService.getSettings());
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Drama Mode
  const [audioModeActive, setAudioModeActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [voiceTheme, setVoiceTheme] = useState<VoiceThemeId>('mythic_drama');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [audioDramaSentences, setAudioDramaSentences] = useState<AudioDramaSentence[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordTimerRef = useRef<any>(null);

  // Reactions & Comments state
  const [reactions, setReactions] = useState<{ fire: number; love: number; dragon: number; flower: number }>({
    fire: 42,
    love: 38,
    dragon: 55,
    flower: 29,
  });
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    {
      id: 'c1',
      user: 'Người đọc bến Arumo',
      text: 'Đoạn Rento giằng chiếc cần phanh máy tời số bảy đọc nghẹt thở thật sự!',
      time: 'Hôm qua'
    }
  ]);

  const articleRef = useRef<HTMLElement>(null);

  // Load chapter data
  useEffect(() => {
    let isMounted = true;
    PublishedContentService.getChapterById(chapterId).then(res => {
      if (!isMounted) return;
      if (res) {
        setChapter(res.chapter);
        setPart(res.part);

        const sents = AudioDramaService.parseChapterToSentences(res.chapter.id, res.chapter.content);
        setAudioDramaSentences(sents);

        // Record progress
        ReadingProgressService.saveProgress({
          chapterId: res.chapter.id,
          chapterTitle: res.chapter.title,
          paragraphIndex: 0,
          scrollPercent: 0,
          updatedAt: new Date().toLocaleDateString('vi-VN'),
        });
      }
    });

    PublishedContentService.getAdjacentChapters(chapterId).then(res => {
      if (!isMounted) return;
      setPrevChapter(res.prev);
      setNextChapter(res.next);
    });

    const handleStoryUpdated = () => {
      PublishedContentService.getChapterById(chapterId).then(res => {
        if (!isMounted) return;
        if (res) {
          setChapter(res.chapter);
          setPart(res.part);
        }
      });
    };
    window.addEventListener('story-content-updated', handleStoryUpdated);

    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      isMounted = false;
      window.removeEventListener('story-content-updated', handleStoryUpdated);
    };
  }, [chapterId]);

  // Track scroll to mark chapter completed
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current || !chapter) return;
      const rect = articleRef.current.getBoundingClientRect();
      // If bottom of article has scrolled into view
      if (rect.bottom <= window.innerHeight + 100) {
        ReadingProgressService.markChapterCompleted(chapter.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapter]);

  // Initialize Web Speech Synthesis & voice listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const handleVoices = () => {
        if (synthRef.current) {
          synthRef.current.getVoices();
        }
      };
      handleVoices();
      window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
      };
    }
  }, []);

  // Cleanup speech when unmounting or changing chapter
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch {}
      }
      if (wordTimerRef.current) {
        clearInterval(wordTimerRef.current);
      }
    };
  }, [chapterId]);

  // Play audio for a specific sentence index
  const playSentence = useCallback((index: number) => {
    if (!synthRef.current || !audioDramaSentences || audioDramaSentences.length === 0) {
      setIsPlayingAudio(false);
      return;
    }

    if (index < 0 || index >= audioDramaSentences.length) {
      setIsPlayingAudio(false);
      return;
    }

    if (wordTimerRef.current) {
      clearInterval(wordTimerRef.current);
      wordTimerRef.current = null;
    }

    try {
      synthRef.current.cancel();
      if (synthRef.current.paused) {
        synthRef.current.resume();
      }
    } catch {}

    const sentence = audioDramaSentences[index];
    const utterance = new SpeechSynthesisUtterance(sentence.text);
    utterance.lang = 'vi-VN';

    const meta = SPEAKER_METADATA[sentence.speaker as AudioSpeaker] || SPEAKER_METADATA.narrator;
    const viVoice = AudioDramaService.getBestVietnameseVoice(
      synthRef.current, 
      meta?.gender === 'female' ? 'female' : meta?.gender === 'male' ? 'male' : undefined
    );
    if (viVoice) {
      utterance.voice = viVoice;
    }

    const { pitch, rate } = AudioDramaService.getVoiceParameters(sentence, voiceTheme, speechRate);
    utterance.pitch = pitch;
    utterance.rate = rate;

    setCurrentSentenceIndex(index);
    setCurrentWordIndex(0);

    utterance.onboundary = (event) => {
      if (event.name === 'word' || (event as any).charIndex !== undefined) {
        const wordIdx = AudioDramaService.getWordIndexFromCharIndex(sentence.text, (event as any).charIndex || 0);
        setCurrentWordIndex(wordIdx);
      }
    };

    const words = sentence.words || sentence.text.split(/\s+/).filter(Boolean);
    const msPerWord = AudioDramaService.getAverageWordDurationMs(sentence.text, rate);
    let simIdx = 0;
    wordTimerRef.current = setInterval(() => {
      simIdx++;
      if (simIdx < words.length) {
        setCurrentWordIndex(prev => Math.max(prev, simIdx));
      } else {
        if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      }
    }, msPerWord);

    utterance.onstart = () => {
      setIsPlayingAudio(true);
    };

    utterance.onend = () => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      setCurrentWordIndex(words.length);
      if (index < audioDramaSentences.length - 1) {
        playSentence(index + 1);
      } else {
        setIsPlayingAudio(false);
      }
    };

    utterance.onerror = (e) => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
        setIsPlayingAudio(false);
      }
    };

    utteranceRef.current = utterance;

    try {
      synthRef.current.resume();
    } catch {}

    synthRef.current.speak(utterance);
    setIsPlayingAudio(true);
  }, [audioDramaSentences, voiceTheme, speechRate]);

  // Audio control callbacks
  const handleTogglePlay = useCallback(() => {
    if (!synthRef.current) {
      setToastMessage('Trình duyệt chưa hỗ trợ phát âm thanh Web Speech');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (isPlayingAudio) {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      try {
        synthRef.current.cancel();
      } catch {}
      setIsPlayingAudio(false);
    } else {
      playSentence(currentSentenceIndex);
    }
  }, [isPlayingAudio, currentSentenceIndex, playSentence]);

  const handlePrevSentence = useCallback(() => {
    const nextIdx = Math.max(0, currentSentenceIndex - 1);
    if (isPlayingAudio) {
      playSentence(nextIdx);
    } else {
      setCurrentSentenceIndex(nextIdx);
      setCurrentWordIndex(0);
    }
  }, [currentSentenceIndex, isPlayingAudio, playSentence]);

  const handleNextSentence = useCallback(() => {
    const nextIdx = Math.min(audioDramaSentences.length - 1, currentSentenceIndex + 1);
    if (isPlayingAudio) {
      playSentence(nextIdx);
    } else {
      setCurrentSentenceIndex(nextIdx);
      setCurrentWordIndex(0);
    }
  }, [audioDramaSentences.length, currentSentenceIndex, isPlayingAudio, playSentence]);

  const handleChangeVoiceTheme = useCallback((newTheme: VoiceThemeId) => {
    setVoiceTheme(newTheme);
    if (isPlayingAudio) {
      setTimeout(() => playSentence(currentSentenceIndex), 50);
    }
  }, [isPlayingAudio, currentSentenceIndex, playSentence]);

  const handleChangeSpeed = useCallback((newSpeed: number) => {
    setSpeechRate(newSpeed);
    if (isPlayingAudio) {
      setTimeout(() => playSentence(currentSentenceIndex), 50);
    }
  }, [isPlayingAudio, currentSentenceIndex, playSentence]);

  const handleCloseAudio = useCallback(() => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch {}
    }
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    setIsPlayingAudio(false);
    setAudioModeActive(false);
  }, []);

  // Auto-scroll follow reading paragraph
  useEffect(() => {
    if (!isPlayingAudio || !isAutoScrollEnabled) return;
    const currentSentence = audioDramaSentences[currentSentenceIndex];
    if (!currentSentence) return;

    const el = document.getElementById(`novel_para_${currentSentence.paragraphIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentSentenceIndex, isPlayingAudio, isAutoScrollEnabled, audioDramaSentences]);

  // Change theme palette background
  const themeBgClass =
    settings.theme === 'mist'
      ? 'bg-[#F2F8F3]'
      : settings.theme === 'blush'
      ? 'bg-[#FFF5F5]'
      : 'bg-[#FFFDF8]';

  const fontClass = settings.fontFamily === 'sans' ? 'font-sans' : 'font-serif';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBookmarkCurrent = () => {
    if (!chapter) return;
    ReadingProgressService.addBookmark({
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      paragraphIndex: 0,
      snippet: chapter.content.slice(0, 100) + '...',
    });
    showToast('Lưu chỗ rồi nhé.');
    setShowMoreMenu(false);
  };

  const handleReaction = (type: 'fire' | 'love' | 'dragon' | 'flower') => {
    if (userReacted === type) return;
    setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setUserReacted(type);
    showToast('Đã ghi nhận cảm xúc của bạn!');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList(prev => [
      {
        id: `com_${Date.now()}`,
        user: currentUser?.displayName || 'Độc giả ẩn danh',
        text: commentText.trim(),
        time: 'Vừa xong'
      },
      ...prev
    ]);
    setCommentText('');
    showToast('Đã gửi bình luận của bạn!');
  };

  if (!chapter) {
    return (
      <div className="max-w-[680px] mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#293B36]">Đang tải chương...</h2>
        <p className="text-sm text-[#5F706A]">Vui lòng chờ trong giây lát.</p>
      </div>
    );
  }

  // Parse paragraphs
  const paragraphs = chapter.content.split('\n\n').filter(p => p.trim());

  return (
    <div className={`min-h-screen ${themeBgClass} text-[#293B36] transition-colors pb-24 md:pb-16`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#293B36] text-white text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* =========================================================================
          1. HEADER ĐỌC RIÊNG (56px)
      ========================================================================= */}
      {!focusMode && (
        <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-[#DCE6DF] px-4 flex items-center justify-between">
          {/* Left: Về truyện */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#5F706A] hover:text-[#376F64] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Về truyện</span>
          </button>

          {/* Center: Tên chương */}
          <div className="text-center px-4 max-w-[420px] truncate">
            <span className="font-extrabold text-sm sm:text-base text-[#293B36] truncate block">
              {chapter.title}
            </span>
          </div>

          {/* Right: Mục lục, Aa, Thêm */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('/muc-luc')}
              className="p-2 rounded-xl text-[#5F706A] hover:text-[#376F64] hover:bg-[#F2F8F5] transition-colors"
              title="Mục lục chương"
            >
              <List className="w-5 h-5" />
            </button>

            {/* Aa Settings Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                className={`p-2 rounded-xl text-[#5F706A] hover:text-[#376F64] hover:bg-[#F2F8F5] transition-colors ${
                  showSettingsPopover ? 'bg-[#E4F1E9] text-[#376F64]' : ''
                }`}
                title="Cài đặt đọc Aa"
              >
                <Type className="w-5 h-5" />
              </button>

              {/* Aa Popover */}
              {showSettingsPopover && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-xl space-y-4 z-40 text-left">
                  <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
                    <h4 className="font-extrabold text-sm text-[#293B36]">Cài đặt đọc sách</h4>
                    <button
                      onClick={() => setShowSettingsPopover(false)}
                      className="p-1 text-[#5F706A] hover:text-[#293B36]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Font selection */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#5F706A]">Kiểu chữ:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const n = { ...settings, fontFamily: 'serif' as const };
                          setSettings(n);
                          ReadingProgressService.saveSettings(n);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          settings.fontFamily === 'serif'
                            ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
                            : 'border-[#DCE6DF] text-[#293B36]'
                        }`}
                      >
                        Chữ sách (Lora)
                      </button>
                      <button
                        onClick={() => {
                          const n = { ...settings, fontFamily: 'sans' as const };
                          setSettings(n);
                          ReadingProgressService.saveSettings(n);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          settings.fontFamily === 'sans'
                            ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
                            : 'border-[#DCE6DF] text-[#293B36]'
                        }`}
                      >
                        Chữ gọn (Nunito)
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-[#5F706A]">
                      <span>Cỡ chữ:</span>
                      <span>{settings.fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const n = { ...settings, fontSize: Math.max(16, settings.fontSize - 1) };
                          setSettings(n);
                          ReadingProgressService.saveSettings(n);
                        }}
                        className="w-9 h-9 rounded-xl border border-[#DCE6DF] font-bold text-sm hover:bg-[#F2F8F5]"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center font-bold text-sm">
                        {settings.fontSize} px
                      </div>
                      <button
                        onClick={() => {
                          const n = { ...settings, fontSize: Math.min(28, settings.fontSize + 1) };
                          setSettings(n);
                          ReadingProgressService.saveSettings(n);
                        }}
                        className="w-9 h-9 rounded-xl border border-[#DCE6DF] font-bold text-sm hover:bg-[#F2F8F5]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Line Height */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#5F706A]">Giãn dòng:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[1.65, 1.85, 2.05].map((lh) => (
                        <button
                          key={lh}
                          onClick={() => {
                            const n = { ...settings, lineHeight: lh };
                            setSettings(n);
                            ReadingProgressService.saveSettings(n);
                          }}
                          className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            settings.lineHeight === lh
                              ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
                              : 'border-[#DCE6DF] text-[#293B36]'
                          }`}
                        >
                          {lh}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3 Light Palettes */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#5F706A]">Nền sáng:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'paper', label: 'Giấy sáng', color: '#FFFDF8' },
                        { key: 'mist', label: 'Sương xanh', color: '#F2F8F3' },
                        { key: 'blush', label: 'Hồng nhạt', color: '#FFF5F5' },
                      ].map((th) => (
                        <button
                          key={th.key}
                          onClick={() => {
                            const n = { ...settings, theme: th.key as any };
                            setSettings(n);
                            ReadingProgressService.saveSettings(n);
                          }}
                          className={`py-2 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 transition-all ${
                            settings.theme === th.key
                              ? 'border-[#376F64] shadow-sm ring-1 ring-[#376F64]'
                              : 'border-[#DCE6DF]'
                          }`}
                          style={{ backgroundColor: th.color }}
                        >
                          <span className="text-[#293B36]">{th.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Defaults */}
                  <div className="pt-2 border-t border-[#DCE6DF] flex justify-end">
                    <button
                      onClick={() => {
                        const def: ReaderSettings = {
                          fontFamily: 'serif',
                          fontSize: 20,
                          lineHeight: 1.85,
                          columnWidth: 680,
                          theme: 'paper',
                        };
                        setSettings(def);
                        ReadingProgressService.saveSettings(def);
                      }}
                      className="text-xs font-bold text-[#5F706A] hover:text-[#376F64] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục mặc định</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Drama Direct Header Toggle */}
            <button
              onClick={() => {
                if (audioModeActive) {
                  handleCloseAudio();
                  showToast('Đã tắt kịch truyền thanh');
                } else {
                  setAudioModeActive(true);
                  playSentence(currentSentenceIndex);
                  showToast('Đang phát kịch truyền thanh đa giọng');
                }
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                audioModeActive
                  ? 'bg-[#E4F1E9] text-[#376F64] shadow-xs ring-1 ring-[#376F64]/30'
                  : 'text-[#5F706A] hover:text-[#376F64] hover:bg-[#F2F8F5]'
              }`}
              title={audioModeActive ? "Tắt kịch truyền thanh" : "Nghe kịch truyền thanh đa giọng"}
            >
              <Headphones className="w-5 h-5" />
            </button>

            {/* "Thêm" Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-xl text-[#5F706A] hover:text-[#376F64] hover:bg-[#F2F8F5] transition-colors"
                title="Tùy chọn khác"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-12 w-52 bg-white border border-[#DCE6DF] rounded-2xl p-2 shadow-xl space-y-1 z-40 text-left">
                  <button
                    onClick={handleBookmarkCurrent}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#293B36] hover:bg-[#F2F8F5]"
                  >
                    <Bookmark className="w-4 h-4 text-[#376F64]" />
                    <span>Đánh dấu chỗ này</span>
                  </button>
                  <button
                    onClick={() => {
                      if (audioModeActive) {
                        handleCloseAudio();
                        showToast('Đã tắt kịch truyền thanh');
                      } else {
                        setAudioModeActive(true);
                        playSentence(currentSentenceIndex);
                        showToast('Đang phát kịch truyền thanh đa giọng');
                      }
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#293B36] hover:bg-[#F2F8F5]"
                  >
                    <Headphones className="w-4 h-4 text-[#376F64]" />
                    <span>{audioModeActive ? 'Tắt nghe kịch' : 'Nghe kịch truyền thanh'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setFocusMode(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#293B36] hover:bg-[#F2F8F5]"
                  >
                    <Maximize className="w-4 h-4 text-[#376F64]" />
                    <span>Chế độ tập trung</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Floating Exit Focus Button if Focus Mode active */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className="fixed top-4 right-4 z-40 px-3 py-1.5 rounded-full bg-white/90 border border-[#DCE6DF] text-xs font-bold text-[#5F706A] hover:text-[#376F64] shadow-md flex items-center gap-1.5"
        >
          <Minimize className="w-3.5 h-3.5" />
          <span>Thoát tập trung</span>
        </button>
      )}

      {/* Audio Drama Bar if active (Fixed bottom pill) */}
      {audioModeActive && (
        <AudioDramaPlayerBar
          currentSentence={audioDramaSentences[currentSentenceIndex] || null}
          currentIndex={currentSentenceIndex}
          totalSentences={audioDramaSentences.length}
          currentWordIndex={currentWordIndex}
          isPlaying={isPlayingAudio}
          voiceTheme={voiceTheme}
          speed={speechRate}
          isAutoScrollEnabled={isAutoScrollEnabled}
          onTogglePlay={handleTogglePlay}
          onPrevSentence={handlePrevSentence}
          onNextSentence={handleNextSentence}
          onChangeVoiceTheme={handleChangeVoiceTheme}
          onChangeSpeed={handleChangeSpeed}
          onToggleAutoScroll={() => setIsAutoScrollEnabled(prev => !prev)}
          onClose={handleCloseAudio}
        />
      )}

      {/* =========================================================================
          2. NỘI DUNG CHƯƠNG TRUYỆN CHỮ
          Desktop căn giữa 680px, Nunito/Lora, không bóng đổ lớn
      ========================================================================= */}
      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-10 pb-16">
        <article
          ref={articleRef}
          style={{ maxWidth: `${settings.columnWidth}px` }}
          className="mx-auto"
        >
          {/* Header trong bài: Tên phần & Tiêu đề H1 */}
          <div className="text-center pb-10 border-b border-[#DCE6DF]/70 mb-10 space-y-3">
            {part && (
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#376F64] block">
                {part.title}
              </span>
            )}
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#293B36] tracking-tight leading-snug">
              {chapter.title}
            </h1>
            <div className="flex items-center justify-center gap-3 text-xs text-[#5F706A]">
              <span>Khoảng ~{Math.max(1, Math.round(chapter.wordCount / 250))} phút đọc</span>
              <span>•</span>
              <span>{chapter.wordCount} chữ</span>
            </div>
          </div>

          {/* Body Prose Paragraphs */}
          <div
            className={`novel-prose ${fontClass} space-y-6 text-[#293B36]`}
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
            }}
          >
            {paragraphs.map((para, idx) => {
              const isVoiceHighlighted = audioModeActive && audioDramaSentences[currentSentenceIndex]?.paragraphIndex === idx;

              return (
                <p
                  key={idx}
                  id={`novel_para_${idx}`}
                  className={`transition-all duration-300 rounded-xl px-3 py-1.5 -mx-3 ${
                    isVoiceHighlighted ? 'bg-[#E4F1E9] text-[#293B36] shadow-xs font-medium ring-1 ring-[#376F64]/25' : ''
                  }`}
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* =========================================================================
              3. CUỐI CHƯƠNG: ĐI TIẾP CHỨ? & CHUYỂN CHƯƠNG
          ========================================================================= */}
          <div className="mt-16 pt-10 border-t border-[#DCE6DF] space-y-8">
            <div className="text-center space-y-2">
              <p className="text-base font-medium text-[#5F706A] italic">
                “Đến đây rồi. Đi tiếp chứ?”
              </p>
              {nextChapter ? (
                <button
                  onClick={() => onNavigate(`/doc/${nextChapter.id}`)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-md active:translate-y-0.5"
                >
                  <span>Chương tiếp: {nextChapter.title}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-[#E4F1E9] text-[#376F64] font-bold text-sm inline-block">
                  Bạn đã đọc đến chương mới nhất của Long Ấn Thức Tỉnh.
                </div>
              )}
            </div>

            {/* Previous & Next Chapters Bottom Navigation (Desktop) */}
            <div className="flex items-center justify-between pt-4 border-t border-[#DCE6DF]/60 text-sm">
              {prevChapter ? (
                <button
                  onClick={() => onNavigate(`/doc/${prevChapter.id}`)}
                  className="flex items-center gap-1.5 font-bold text-[#376F64] hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{prevChapter.title}</span>
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={() => onNavigate('/muc-luc')}
                className="font-bold text-[#5F706A] hover:text-[#376F64]"
              >
                Mục lục
              </button>

              {nextChapter ? (
                <button
                  onClick={() => onNavigate(`/doc/${nextChapter.id}`)}
                  className="flex items-center gap-1.5 font-bold text-[#376F64] hover:underline"
                >
                  <span>{nextChapter.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div></div>
              )}
            </div>

            {/* =========================================================================
                4. CẢM XÚC (4 Khóa: fire, love, dragon, flower) & BÌNH LUẬN
            ========================================================================= */}
            <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
              {/* Reactions */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-[#293B36] uppercase tracking-wider">
                  Cảm xúc với chương này
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleReaction('fire')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                      userReacted === 'fire'
                        ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
                        : 'border-[#DCE6DF] text-[#293B36] hover:bg-[#F2F8F5]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Cuốn ({reactions.fire})</span>
                  </button>

                  <button
                    onClick={() => handleReaction('love')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                      userReacted === 'love'
                        ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
                        : 'border-[#DCE6DF] text-[#293B36] hover:bg-[#F2F8F5]'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Chạm cảm xúc ({reactions.love})</span>
                  </button>

                  <button
                    onClick={() => handleReaction('dragon')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                      userReacted === 'dragon'
                        ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
                        : 'border-[#DCE6DF] text-[#293B36] hover:bg-[#F2F8F5]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Hóng chương sau ({reactions.dragon})</span>
                  </button>

                  <button
                    onClick={() => handleReaction('flower')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                      userReacted === 'flower'
                        ? 'bg-[#E4F1E9] text-[#376F64] border-[#376F64]'
                        : 'border-[#DCE6DF] text-[#293B36] hover:bg-[#F2F8F5]'
                    }`}
                  >
                    <Flower2 className="w-4 h-4 text-pink-500" />
                    <span>Thả hoa ({reactions.flower})</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-6 border-t border-[#DCE6DF]">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#293B36] uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#376F64]" />
                    <span>Bình luận độc giả ({commentsList.length})</span>
                  </h4>
                </div>

                {/* Comment Input */}
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Để lại cảm nghĩ của bạn về chương này..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#DCE6DF] text-sm text-[#293B36] focus:border-[#376F64] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi</span>
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 pt-2">
                  {commentsList.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF]/70 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#293B36]">{c.user}</span>
                        <span className="text-[#5F706A]">{c.time}</span>
                      </div>
                      <p className="text-sm text-[#293B36]">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* =========================================================================
          5. MOBILE BOTTOM BAR (56px)
          Trước / Mục lục / Sau (Chỉ hiện trên mobile, không che dòng cuối)
      ========================================================================= */}
      {!focusMode && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-white/95 backdrop-blur-md border-t border-[#DCE6DF] px-4 flex items-center justify-between">
          <button
            onClick={() => prevChapter && onNavigate(`/doc/${prevChapter.id}`)}
            disabled={!prevChapter}
            className={`flex items-center gap-1 text-xs font-bold ${
              prevChapter ? 'text-[#376F64]' : 'text-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước</span>
          </button>

          <button
            onClick={() => onNavigate('/muc-luc')}
            className="flex items-center gap-1 text-xs font-bold text-[#293B36] px-3 py-1.5 rounded-lg bg-[#F2F8F5]"
          >
            <List className="w-4 h-4 text-[#376F64]" />
            <span>Mục lục</span>
          </button>

          <button
            onClick={() => nextChapter && onNavigate(`/doc/${nextChapter.id}`)}
            disabled={!nextChapter}
            className={`flex items-center gap-1 text-xs font-bold ${
              nextChapter ? 'text-[#376F64]' : 'text-gray-300'
            }`}
          >
            <span>Sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

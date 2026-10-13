import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Image as ImageIcon, 
  ZoomIn, 
  BookMarked,
  Home,
  List,
  ArrowUp,
  Info,
  RefreshCw,
  Layers,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  Users,
  Compass,
  Music,
  Clock,
  Palette,
  Settings,
  Maximize2,
  Minimize2,
  Lock,
  KeyRound,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { Project, Part, Chapter, ComicChapter, ComicPanel, ComicReadingMode, AISettings, Character } from '../../types';
import { sampleComicChapters, GOOGLE_DOCS_URL } from '../../data/googleData';
import { googleCharacters } from '../../data/googleCharacters';
import { sampleCharacters, sampleBibleFacts, sampleTimeline } from '../../data/sampleLongAnKy';
import { AIStudioService, ComicScriptResult } from '../../services/aiStudioService';
import { soundscapeEngine } from '../../services/soundscapeService';
import { CharacterDossierDrawer } from './CharacterDossierDrawer';
import { WorldAtlasModal } from './WorldAtlasModal';
import { AmbientSoundPlayer } from './AmbientSoundPlayer';
import { LoreCodexDrawer } from './LoreCodexDrawer';
import { ChronicleTimelineModal } from './ChronicleTimelineModal';
import { ReadingSettingsModal, ReadingPreferences, THEME_OPTIONS, ReadingThemeId } from './ReadingSettingsModal';
import { ChapterCommentsSection } from './ChapterCommentsSection';
import { UserService } from '../../services/userService';
import { UserProfile } from '../../types/user';
import { UserAuthModal } from '../auth/UserAuthModal';
import { UserProfileDropdown } from '../auth/UserProfileDropdown';
import { UserHistoryModal } from '../auth/UserHistoryModal';
import { AudioDramaService, AudioDramaSentence, VoiceMode } from '../../services/audioDramaService';
import { AudioDramaPlayerBar } from '../audio/AudioDramaPlayerBar';
import { ComicComingSoonView } from '../comic/ComicComingSoonView';

interface UnifiedReaderViewProps {
  project: Project;
  parts: Part[];
  isWarmTheme: boolean;
  aiSettings: AISettings;
  comicChapters?: ComicChapter[];
  isAuthorMode?: boolean;
  onOpenComicUploader?: () => void;
  onSyncGoogleDocs?: () => Promise<void> | void;
  isSyncingDoc?: boolean;
  characters?: Character[];
  onOpenAuthorLogin?: () => void;
  onExitAuthorMode?: () => void;
}

type ReaderType = 'novel' | 'comic';
type PageLayoutMode = 'scroll' | 'paginated';

// Chibi quotes from Bé Long Long
const CHIBI_QUOTES = [
  "Oa~ Cậu đọc chăm chỉ ghê nha! Bé Long Long cổ vũ nè! ✨🐉",
  "Chương này bến Arumo gió lộng, đọc hồi hộp mê ly luôn á~ (๑>ᴗ<๑)",
  "Đọc mỏi mắt thì chớp mắt vài cái rồi hớp miếng trà ấm nhé! 🍵💖",
  "Thức Tỉnh Long Ấn rồi... sức mạnh rồng sắp bùng nổ! ⭐",
  "Bé Long Long đang ôm ngọc rồng ngồi canh cho cậu đọc nè! (｡♥‿♥｡)",
  "Tác giả cập nhật chương mới là Bé Long Long báo liền nha! 📜✨"
];

// Adorable Chibi Dragon SVG Mascot
const ChibiDragonAvatar: React.FC<{ isBouncing?: boolean }> = ({ isBouncing }) => (
  <svg
    viewBox="0 0 120 120"
    className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_10px_25px_rgba(244,114,182,0.45)] transition-transform duration-300 ${
      isBouncing ? 'scale-110 -rotate-3' : 'animate-float-gentle'
    }`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cute dragon tail with fluff */}
    <path
      d="M30 85 C15 90, 8 80, 10 72 C12 65, 20 70, 26 76"
      stroke="#c084fc"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="9" cy="71" r="5" fill="#f472b6" />

    {/* Little Wings (flapping) */}
    <g className="animate-chibi-wing origin-bottom">
      <path
        d="M26 50 C12 42, 10 28, 22 30 C28 32, 34 42, 32 52 Z"
        fill="url(#chibiWingGradient)"
        opacity="0.9"
      />
    </g>
    <g className="animate-chibi-wing origin-bottom" style={{ animationDelay: '0.1s' }}>
      <path
        d="M94 50 C108 42, 110 28, 98 30 C92 32, 86 42, 88 52 Z"
        fill="url(#chibiWingGradient)"
        opacity="0.9"
      />
    </g>

    {/* Baby Dragon Body */}
    <ellipse cx="60" cy="74" rx="26" ry="24" fill="url(#chibiBodyGradient)" />

    {/* Chubby Dragon Head */}
    <ellipse cx="60" cy="46" rx="30" ry="26" fill="url(#chibiBodyGradient)" />

    {/* Soft belly with gentle scales */}
    <ellipse cx="60" cy="76" rx="16" ry="17" fill="url(#chibiBellyGradient)" />
    <path d="M54 70 Q60 73 66 70" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M52 77 Q60 80 68 77" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M55 84 Q60 87 65 84" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />

    {/* Tiny golden dragon horns */}
    <path d="M42 26 C40 16, 47 12, 50 18 C51 22, 47 26, 45 28 Z" fill="url(#chibiGoldHornGradient)" />
    <path d="M78 26 C80 16, 73 12, 70 18 C69 22, 73 26, 75 28 Z" fill="url(#chibiGoldHornGradient)" />

    {/* Cute dragon ears */}
    <ellipse cx="32" cy="42" rx="6" ry="9" transform="rotate(-25 32 42)" fill="#a855f7" />
    <ellipse cx="33" cy="42" rx="3" ry="6" transform="rotate(-25 33 42)" fill="#f472b6" />
    <ellipse cx="88" cy="42" rx="6" ry="9" transform="rotate(25 88 42)" fill="#a855f7" />
    <ellipse cx="87" cy="42" rx="3" ry="6" transform="rotate(25 87 42)" fill="#f472b6" />

    {/* Big Anime Eyes */}
    <ellipse cx="48" cy="44" rx="7.5" ry="9.5" fill="#1e1b4b" />
    <ellipse cx="72" cy="44" rx="7.5" ry="9.5" fill="#1e1b4b" />
    {/* Sparkling highlights */}
    <circle cx="46" cy="41" r="3.2" fill="#ffffff" />
    <circle cx="50" cy="47" r="1.4" fill="#a5f3fc" />
    <circle cx="70" cy="41" r="3.2" fill="#ffffff" />
    <circle cx="74" cy="47" r="1.4" fill="#a5f3fc" />

    {/* Rosy blushing cheeks */}
    <ellipse cx="40" cy="53" rx="5" ry="3" fill="#f43f5e" opacity="0.55" />
    <ellipse cx="80" cy="53" rx="5" ry="3" fill="#f43f5e" opacity="0.55" />

    {/* Cute smile */}
    <path d="M56 51 Q60 55 64 51" stroke="#312e81" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Little dragon paws holding a glowing mini seal gem */}
    <circle cx="48" cy="74" r="5" fill="#c084fc" />
    <circle cx="72" cy="74" r="5" fill="#c084fc" />
    {/* Glowing Long Ấn Gem */}
    <circle cx="60" cy="75" r="7" fill="url(#chibiGemGradient)" className="animate-pulse" />
    <path d="M57 75 L60 72 L63 75 L60 78 Z" fill="#ffffff" opacity="0.85" />

    {/* Gradients */}
    <defs>
      <linearGradient id="chibiBodyGradient" x1="30" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c084fc" />
        <stop offset="0.6" stopColor="#a855f7" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="chibiWingGradient" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
      <linearGradient id="chibiBellyGradient" x1="60" y1="60" x2="60" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#fde047" />
      </linearGradient>
      <linearGradient id="chibiGoldHornGradient" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
      <radialGradient id="chibiGemGradient" cx="40%" cy="40%" r="60%">
        <stop stopColor="#fed7aa" />
        <stop offset="0.5" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </radialGradient>
    </defs>
  </svg>
);

export const UnifiedReaderView: React.FC<UnifiedReaderViewProps> = ({
  project,
  parts,
  isWarmTheme,
  aiSettings,
  comicChapters: propsComicChapters,
  isAuthorMode = false,
  onOpenComicUploader,
  onSyncGoogleDocs,
  isSyncingDoc = false,
  characters: propsCharacters,
  onOpenAuthorLogin,
  onExitAuthorMode
}) => {
  // Mode selection: Novel (Truyện chữ - Đang sáng tác) vs Comic (Truyện tranh - Sắp ra mắt)
  const [readerType, setReaderType] = useState<ReaderType>('novel');
  const [authorPreviewComic, setAuthorPreviewComic] = useState<boolean>(false);

  // Logo click counter to secret author prompt
  const [logoClicks, setLogoClicks] = useState<number>(0);

  // Reading Preferences state (Loaded & persisted in localStorage)
  const [readingPrefs, setReadingPrefs] = useState<ReadingPreferences>(() => {
    try {
      const saved = localStorage.getItem('longanky_reader_prefs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      theme: 'obsidian',
      fontFamily: 'serif',
      fontSize: 18,
      lineHeight: 1.85,
      pageWidth: 'standard'
    };
  });

  const handleUpdatePrefs = (newPrefs: Partial<ReadingPreferences>) => {
    setReadingPrefs(prev => {
      const updated = { ...prev, ...newPrefs };
      try {
        localStorage.setItem('longanky_reader_prefs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Modals & Drawers state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState<boolean>(false);

  // User Authentication & Member Portal state (NetTruyen style)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => UserService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  // Character Dossier Drawer state (Tra cứu hồ sơ nhân vật bên phải)
  const [isCharacterDrawerOpen, setIsCharacterDrawerOpen] = useState<boolean>(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>(undefined);

  // New Features: Atlas, Soundscape, Codex, Timeline
  const [isAtlasOpen, setIsAtlasOpen] = useState<boolean>(false);
  const [isSoundPlayerOpen, setIsSoundPlayerOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);

  // Novel reader states: Tự động khôi phục chương đọc dở dang từ localStorage
  const [selectedPartId, setSelectedPartId] = useState<string>(() => {
    try {
      const last = localStorage.getItem('longanky_last_read');
      if (last) {
        const p = JSON.parse(last);
        if (p.partId && parts.some(part => part.id === p.partId)) return p.partId;
      }
    } catch (e) {}
    return parts[0]?.id || 'part_prologue';
  });

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(() => {
    try {
      const last = localStorage.getItem('longanky_last_read');
      if (last) {
        const p = JSON.parse(last);
        if (typeof p.chapterIndex === 'number') return p.chapterIndex;
      }
    } catch (e) {}
    return 0;
  });

  // Tự động lưu tiến độ đọc vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem('longanky_last_read', JSON.stringify({
        partId: selectedPartId,
        chapterIndex: activeChapterIndex
      }));
    } catch (e) {}
  }, [selectedPartId, activeChapterIndex]);

  // Track scroll progress for the top reading progress bar
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight) {
        setReadingProgress(100);
        return;
      }
      const p = Math.min(100, Math.max(0, (scrollTop / (scrollHeight - clientHeight)) * 100));
      setReadingProgress(p);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [readerType, selectedPartId, activeChapterIndex]);

  // Combine characters (Google doc characters + Lore characters)
  const allCharacters = useMemo(() => {
    const list: Character[] = [...(propsCharacters && propsCharacters.length > 0 ? propsCharacters : googleCharacters)];
    sampleCharacters.forEach(sc => {
      if (!list.some(c => c.id === sc.id || c.name.toLowerCase() === sc.name.toLowerCase())) {
        list.push(sc);
      }
    });
    return list;
  }, [propsCharacters]);
  
  // Chibi Mascot State
  const [chibiQuoteIndex, setChibiQuoteIndex] = useState<number>(0);
  const [isChibiMinimized, setIsChibiMinimized] = useState<boolean>(false);
  const [isChibiBouncing, setIsChibiBouncing] = useState<boolean>(false);

  const handlePokeChibi = () => {
    setIsChibiBouncing(true);
    setChibiQuoteIndex(prev => (prev + 1) % CHIBI_QUOTES.length);
    setTimeout(() => setIsChibiBouncing(false), 500);
  };
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Audio Drama & Karaoke states
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('multi_voice');
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState<boolean>(true);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Comic reader & Publishing states (NetTruyen / Webtoon)
  const [comicChapters, setComicChapters] = useState<ComicChapter[]>(() => {
    return propsComicChapters && propsComicChapters.length > 0 ? propsComicChapters : sampleComicChapters;
  });

  // Trạng thái xuất bản truyện tranh (Độc giả chỉ thấy khi chương được xuất bản)
  const [publishedComicChapterIds, setPublishedComicChapterIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('longanky_published_comic_chapters');
      if (stored) return JSON.parse(stored);
    } catch {}
    return []; // Mặc định: Chưa xuất bản hồi nào -> Hiện Coming Soon
  });
  const [isAuthorPreviewingDraft, setIsAuthorPreviewingDraft] = useState<boolean>(false);

  const handlePublishComicChapter = (chapterId: string) => {
    setPublishedComicChapterIds(prev => {
      const next = prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId];
      try {
        localStorage.setItem('longanky_published_comic_chapters', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (propsComicChapters && propsComicChapters.length > 0) {
      setComicChapters(propsComicChapters);
    }
  }, [propsComicChapters]);

  const [activeComicIndex, setActiveComicIndex] = useState<number>(0);
  const [comicMode, setComicMode] = useState<ComicReadingMode>('webtoon');
  const [selectedPanel, setSelectedPanel] = useState<ComicPanel | null>(null);
  const [isGeneratingComic, setIsGeneratingComic] = useState<boolean>(false);
  const [activeArtStyle, setActiveArtStyle] = useState<string>('dark_webtoon');
  const [showPanelCreator, setShowPanelCreator] = useState<boolean>(false);
  const [customSnippet, setCustomSnippet] = useState<string>('');

  // Left Sidebar State for Novel (Mở rộng / Thu gọn Phần & Sidebar như hình 4)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    parts.forEach(p => { initial[p.id] = true; });
    return initial;
  });

  const toggleSection = (partId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [partId]: prev[partId] !== undefined ? !prev[partId] : false
    }));
  };

  const getSectionTheme = (title: string, partId: string) => {
    const t = title.toLowerCase();
    if (t.includes('mở đầu') || partId.includes('prologue')) {
      return { icon: '📜', badge: 'MỞ ĐẦU' };
    }
    if (t.includes('mùa nước đứng') || partId.includes('mua_nuoc_dung') || t.includes('phần i')) {
      return { icon: '🌊', badge: 'MÙA NƯỚC ĐỨNG' };
    }
    if (t.includes('bản cũ') || t.includes('aesvorn') || partId.includes('aesvorn') || t.includes('phần ii')) {
      return { icon: '🏛️', badge: 'BẢN CŨ AESVORN' };
    }
    return { icon: '📁', badge: 'PHẦN TRUYỆN' };
  };

  const totalNovelWords = parts.reduce((acc, p) => acc + p.wordCount, 0);
  const totalChaptersCount = parts.reduce((acc, p) => acc + p.chapters.length, 0);

  // Danh sách phẳng tất cả các chương qua toàn bộ các Phần
  const allFlatChapters = React.useMemo(() => {
    const list: {
      partId: string;
      partTitle: string;
      chapter: Chapter;
      partIndex: number;
      chapterIndex: number;
    }[] = [];
    parts.forEach((p, pIdx) => {
      p.chapters.forEach((c, cIdx) => {
        list.push({
          partId: p.id,
          partTitle: p.title,
          chapter: c,
          partIndex: pIdx,
          chapterIndex: cIdx
        });
      });
    });
    return list;
  }, [parts]);

  const currentGlobalIndex = React.useMemo(() => {
    const idx = allFlatChapters.findIndex(
      item => item.partId === selectedPartId && item.chapterIndex === activeChapterIndex
    );
    return idx >= 0 ? idx : 0;
  }, [allFlatChapters, selectedPartId, activeChapterIndex]);

  const goToChapterByGlobalIndex = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= allFlatChapters.length) return;
    const target = allFlatChapters[targetIdx];
    setSelectedPartId(target.partId);
    setActiveChapterIndex(target.chapterIndex);
    scrollToTop();
  };

  const activePart = parts.find(p => p.id === selectedPartId) || parts[0];
  const chapters = activePart?.chapters || [];
  const currentChapter: Chapter | undefined = chapters[activeChapterIndex] || chapters[0];
  const activeComic = comicChapters[activeComicIndex] || comicChapters[0];

  // Phân tích văn bản chương thành các câu thoại & dẫn truyện để đọc Karaoke đa giọng
  const audioDramaSentences = useMemo(() => {
    if (!currentChapter?.content) return [];
    return AudioDramaService.parseChapterToSentences(currentChapter.id, currentChapter.content);
  }, [currentChapter?.id, currentChapter?.content]);

  // Reset câu đọc khi đổi chương
  useEffect(() => {
    setCurrentSentenceIndex(0);
    if (isPlayingAudio && synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    }
  }, [currentChapter?.id]);

  const totalWords = currentChapter?.wordCount || 0;
  const estimatedReadTime = Math.max(1, Math.ceil(totalWords / 220));

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Điều hướng từ Lịch Sử Đọc (NetTruyen)
  const handleNavigateFromHistory = (type: 'novel' | 'comic', chapterId: string, partId?: string, chapterIndex?: number) => {
    if (type === 'novel') {
      setReaderType('novel');
      if (partId && parts.some(p => p.id === partId)) {
        setSelectedPartId(partId);
        if (typeof chapterIndex === 'number') {
          setActiveChapterIndex(chapterIndex);
        }
      } else {
        for (const p of parts) {
          const cIdx = p.chapters.findIndex(c => c.id === chapterId);
          if (cIdx >= 0) {
            setSelectedPartId(p.id);
            setActiveChapterIndex(cIdx);
            break;
          }
        }
      }
    } else {
      setReaderType('comic');
      if (typeof chapterIndex === 'number') {
        setActiveComicIndex(chapterIndex);
      } else {
        const cIdx = comicChapters.findIndex(c => c.id === chapterId);
        if (cIdx >= 0) setActiveComicIndex(cIdx);
      }
    }
    scrollToTop();
  };

  // Tự động lưu Lịch Sử Đọc Tiểu Thuyết (NetTruyen style)
  useEffect(() => {
    if (currentChapter && activePart && readerType === 'novel') {
      UserService.recordReadingHistory({
        type: 'novel',
        chapterId: currentChapter.id,
        chapterTitle: currentChapter.title,
        partTitle: activePart.title,
        partId: selectedPartId,
        chapterIndex: activeChapterIndex,
        progressPercent: readingProgress,
        wordCount: currentChapter.wordCount,
      });
      setCurrentUser(UserService.getCurrentUser());
    }
  }, [selectedPartId, activeChapterIndex, currentChapter?.id, readerType]);

  // Tự động lưu Lịch Sử Đọc Truyện Tranh (NetTruyen style)
  useEffect(() => {
    if (readerType === 'comic' && comicChapters[activeComicIndex]) {
      const chap = comicChapters[activeComicIndex];
      UserService.recordReadingHistory({
        type: 'comic',
        chapterId: chap.id,
        chapterTitle: chap.title,
        partTitle: chap.subtitle,
        chapterIndex: activeComicIndex,
        progressPercent: 100,
      });
      setCurrentUser(UserService.getCurrentUser());
    }
  }, [readerType, activeComicIndex]);

  // Keyboard navigation: Mũi tên trái (←) hoặc phải (→) chuyển chapter chuẩn NetTruyen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (readerType === 'novel') {
        if (e.key === 'ArrowLeft') {
          if (currentGlobalIndex > 0) {
            goToChapterByGlobalIndex(currentGlobalIndex - 1);
          }
        } else if (e.key === 'ArrowRight') {
          if (currentGlobalIndex < allFlatChapters.length - 1) {
            goToChapterByGlobalIndex(currentGlobalIndex + 1);
          }
        }
      } else {
        if (e.key === 'ArrowLeft') {
          if (activeComicIndex > 0) {
            setActiveComicIndex(prev => Math.max(0, prev - 1));
            scrollToTop();
          }
        } else if (e.key === 'ArrowRight') {
          if (activeComicIndex < comicChapters.length - 1) {
            setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
            scrollToTop();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readerType, currentGlobalIndex, allFlatChapters.length, activeComicIndex, comicChapters.length]);

  // Tổng hợp toàn bộ các ô tranh (panels) của Chapter hiện tại thành dòng cuộn dọc NetTruyen
  const allPanels = React.useMemo(() => {
    const panels: (ComicPanel & { pageTitle?: string; pageIndex: number })[] = [];
    activeComic.pages.forEach((page, pageIdx) => {
      page.panels.forEach(panel => {
        panels.push({
          ...panel,
          pageTitle: page.title,
          pageIndex: pageIdx
        });
      });
    });
    return panels;
  }, [activeComic]);

  // Speech synthesis init
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Đọc câu thoại tương ứng với nhân vật và tự động cuộn trang (Karaoke Multi-Voice)
  const playSentence = useCallback((index: number) => {
    if (!synthRef.current || !audioDramaSentences[index]) return;

    synthRef.current.cancel();

    const sentence = audioDramaSentences[index];
    const utterance = new SpeechSynthesisUtterance(sentence.text);
    utterance.lang = 'vi-VN';

    const viVoice = AudioDramaService.getBestVietnameseVoice(synthRef.current);
    if (viVoice) {
      utterance.voice = viVoice;
    }

    const { pitch, rate } = AudioDramaService.getVoiceParameters(sentence, voiceMode, speechRate);
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onend = () => {
      if (index < audioDramaSentences.length - 1) {
        setCurrentSentenceIndex(index + 1);
        playSentence(index + 1);
      } else {
        setIsPlayingAudio(false);
      }
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setCurrentSentenceIndex(index);
    setIsPlayingAudio(true);
    setIsAudioPlayerVisible(true);

    // Tự động cuộn trang tới đúng câu thoại đang phát (Karaoke Auto-scroll)
    if (isAutoScrollEnabled) {
      setTimeout(() => {
        const el = document.getElementById(sentence.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  }, [audioDramaSentences, voiceMode, speechRate, isAutoScrollEnabled]);

  const handleToggleAudio = () => {
    if (!synthRef.current || audioDramaSentences.length === 0) return;

    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    } else {
      setIsAudioPlayerVisible(true);
      playSentence(currentSentenceIndex);
    }
  };

  // Convert current chapter prose into comic
  const handleGenerateComicFromCurrentChapter = async () => {
    if (!currentChapter?.content) return;
    setIsGeneratingComic(true);
    try {
      const snippet = customSnippet || currentChapter.content.slice(0, 1500);
      const scriptResult = await AIStudioService.convertProseToComicScript(snippet, aiSettings);

      const newComicChapter: ComicChapter = {
        id: `comic_gen_${Date.now()}`,
        chapterId: currentChapter.id,
        title: `Truyện Tranh AI: ${scriptResult.title || currentChapter.title}`,
        subtitle: `Tạo từ ${currentChapter.title} • Phong cách: ${activeArtStyle}`,
        coverUrl: AIStudioService.generatePanelImageUrl(scriptResult.panels[0]?.imagePrompt || 'fantasy comic cover', activeArtStyle),
        readingDirection: 'vertical',
        pages: [
          {
            id: `page_gen_01`,
            pageNumber: 1,
            title: scriptResult.title,
            panels: scriptResult.panels.map((p, idx) => ({
              id: `panel_gen_${idx}_${Date.now()}`,
              panelNumber: p.panelNumber,
              caption: p.caption,
              cameraAngle: p.cameraAngle,
              actionDescription: p.actionDescription,
              dialogues: p.dialogues.map((d, dIdx) => ({
                id: `d_${idx}_${dIdx}`,
                character: d.character,
                text: d.text,
                position: d.position,
                bubbleType: d.type
              })),
              sfx: p.sfx,
              prompt: p.imagePrompt,
              imageUrl: AIStudioService.generatePanelImageUrl(p.imagePrompt, activeArtStyle, idx * 5),
              aspectRatio: p.aspectRatio,
              widthSpan: p.aspectRatio === '16:9' ? 'full' : 'half'
            }))
          }
        ]
      };

      setComicChapters(prev => [newComicChapter, ...prev]);
      setActiveComicIndex(0);
      setReaderType('comic');
      setShowPanelCreator(false);
    } catch (e: any) {
      alert(`Lỗi sinh truyện tranh: ${e.message}`);
    } finally {
      setIsGeneratingComic(false);
    }
  };

  // 4 Artistic Reading Themes for "Long Ấn Thức Tỉnh"
  const THEME_OPTIONS: { id: 'obsidian' | 'parchment' | 'abyss' | 'amber'; name: string; icon: string }[] = [
    { id: 'obsidian', name: 'Huyền Long Dạ Cảnh', icon: '🌌' },
    { id: 'parchment', name: 'Giấy Dó Hoàng Gia', icon: '📜' },
    { id: 'abyss', name: 'Vực Thẳm Asera', icon: '🌊' },
    { id: 'amber', name: 'Đèn Dầu Bến Tàu', icon: '🕯️' }
  ];

  const THEME_STYLES = {
    obsidian: {
      bg: 'bg-[#060a14] relative text-slate-100',
      container: 'bg-[#0b1022]/85 border-indigo-500/25 shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl',
      text: 'text-slate-100',
      prose: 'text-slate-200 selection:bg-pink-500/30 selection:text-pink-100',
      meta: 'text-slate-400',
      toolbar: 'bg-slate-950/85 border-indigo-500/20 text-slate-200 backdrop-blur-2xl'
    },
    parchment: {
      bg: 'bg-[#f4ebe1] relative text-[#2a1e14]',
      container: 'bg-[#fcf7ee]/95 border-amber-900/20 shadow-[0_15px_50px_rgba(70,40,10,0.15)] backdrop-blur-xl',
      text: 'text-[#2a1e14]',
      prose: 'text-[#382a1d] selection:bg-amber-300/40 selection:text-amber-950',
      meta: 'text-amber-800/70',
      toolbar: 'bg-[#eae0cf]/95 border-amber-900/20 text-[#2a1e14] backdrop-blur-2xl'
    },
    abyss: {
      bg: 'bg-[#030d17] relative text-[#bfe3f7]',
      container: 'bg-[#05172b]/90 border-cyan-500/30 shadow-[0_15px_50px_rgba(0,40,80,0.5)] backdrop-blur-xl',
      text: 'text-[#e0f2fe]',
      prose: 'text-[#bae6fd] selection:bg-cyan-500/30 selection:text-cyan-100',
      meta: 'text-cyan-400/70',
      toolbar: 'bg-[#020a13]/90 border-cyan-500/20 text-cyan-200 backdrop-blur-2xl'
    },
    amber: {
      bg: 'bg-[#130b05] relative text-[#f5e2d0]',
      container: 'bg-[#1d120a]/90 border-amber-600/25 shadow-[0_15px_50px_rgba(40,20,0,0.6)] backdrop-blur-xl',
      text: 'text-[#fff1e5]',
      prose: 'text-[#ecd2bd] selection:bg-amber-600/30 selection:text-amber-100',
      meta: 'text-amber-400/70',
      toolbar: 'bg-[#0e0703]/90 border-amber-700/20 text-amber-200 backdrop-blur-2xl'
    }
  };

  const novelThemeClasses = THEME_STYLES[readingPrefs.theme] || THEME_STYLES.obsidian;
  const currentTheme = THEME_OPTIONS.find(t => t.id === readingPrefs.theme) || THEME_OPTIONS[0];

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors duration-200 ${novelThemeClasses.bg}`}>
      {/* ================= ZEN MODE FLOATING ESCAPE PILL ================= */}
      {isZenMode && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in">
          <button
            onClick={() => setIsZenMode(false)}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-white/20 text-slate-200 hover:text-white text-xs flex items-center gap-1.5 shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
            title="Thoát chế độ tập trung đọc (Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Thoát Chế Độ Tập Trung (Esc)</span>
          </button>
        </div>
      )}

      {/* ================= TOP UNIFIED HEADER (SINGLE SLIM BAR) ================= */}
      {!isZenMode && (
        <header className={`h-14 px-4 sm:px-6 border-b flex items-center justify-between gap-3 backdrop-blur-xl z-20 shrink-0 ${novelThemeClasses.toolbar}`}>
          {/* Left: Mục Lục, Brand Title & Mode Switcher (Truyện Chữ / Truyện Tranh) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm ${
                isSidebarOpen
                  ? readerType === 'novel'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800/60 hover:bg-slate-700/80 border-white/10 text-slate-300'
              }`}
              title="Đóng / Mở Mục Lục Tác Phẩm"
            >
              <Menu className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Mục Lục</span>
            </button>

            {/* Brand Logo & Title */}
            <div 
              onClick={() => {
                const next = logoClicks + 1;
                setLogoClicks(next);
                if (next >= 5 && onOpenAuthorLogin) {
                  setLogoClicks(0);
                  onOpenAuthorLogin();
                }
              }}
              className="flex items-center space-x-2 cursor-pointer select-none"
              title="Long Ấn Thức Tỉnh"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 via-rose-600 to-purple-600 flex items-center justify-center text-white font-serif font-bold text-sm shadow-md shadow-amber-500/20">
                🐉
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-serif font-bold text-sm tracking-tight text-white leading-tight">
                    Long Ấn Thức Tỉnh
                  </h1>
                </div>
              </div>
            </div>

            {/* Switcher Mode: Truyện Chữ / Truyện Tranh */}
            <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-white/10 shadow-inner">
              <button
                onClick={() => {
                  setReaderType('novel');
                  scrollToTop();
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  readerType === 'novel'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Đọc bản tiểu thuyết chữ"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Truyện Chữ</span>
              </button>

              <button
                onClick={() => {
                  setReaderType('comic');
                  scrollToTop();
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  readerType === 'comic'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Đọc bản truyện tranh Webtoon"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Truyện Tranh</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Center: Quick Chapter Jump Dropdown (Chuyển chương nhanh) */}
          {readerType === 'novel' ? (
            <div className="relative">
              <button
                onClick={() => setIsChapterMenuOpen(prev => !prev)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer text-xs"
                title="Nhảy nhanh đến chương tiểu thuyết bất kỳ"
              >
                <span className="text-amber-300 font-serif font-semibold truncate max-w-[130px] sm:max-w-[220px] md:max-w-xs">
                  {currentChapter?.title || 'Chọn chương đọc'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 hidden md:inline">
                  {currentGlobalIndex + 1}/{allFlatChapters.length}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu Tiểu Thuyết */}
              {isChapterMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 sm:w-96 max-h-96 overflow-y-auto custom-scrollbar p-2 rounded-2xl bg-slate-950/95 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                  <div className="px-3 py-1.5 border-b border-white/10 text-[11px] font-serif font-bold text-amber-300 flex items-center justify-between">
                    <span>DANH SÁCH CHƯƠNG TIỂU THUYẾT</span>
                    <span className="font-mono text-slate-400 font-normal">{allFlatChapters.length} chương</span>
                  </div>
                  {allFlatChapters.map((item, idx) => {
                    const isCurrent = idx === currentGlobalIndex;
                    return (
                      <button
                        key={item.chapter.id}
                        onClick={() => {
                          goToChapterByGlobalIndex(idx);
                          setIsChapterMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="font-serif text-xs truncate">
                            {item.chapter.title}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {item.partTitle}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono opacity-70">
                          {item.chapter.wordCount.toLocaleString()} từ
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsChapterMenuOpen(prev => !prev)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-rose-400/40 transition-all cursor-pointer text-xs"
                title="Nhảy nhanh đến hồi truyện tranh"
              >
                <span className="text-rose-300 font-serif font-semibold truncate max-w-[130px] sm:max-w-[220px] md:max-w-xs">
                  {comicChapters[activeComicIndex]?.title || 'Chọn hồi truyện tranh'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 hidden md:inline">
                  {activeComicIndex + 1}/{comicChapters.length}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu Truyện Tranh */}
              {isChapterMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 sm:w-96 max-h-96 overflow-y-auto custom-scrollbar p-2 rounded-2xl bg-slate-950/95 border border-rose-500/30 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                  <div className="px-3 py-1.5 border-b border-white/10 text-[11px] font-serif font-bold text-rose-300 flex items-center justify-between">
                    <span>DANH SÁCH HỒI TRUYỆN TRANH WEBTOON</span>
                    <span className="font-mono text-slate-400 font-normal">{comicChapters.length} hồi</span>
                  </div>
                  {comicChapters.map((chap, idx) => {
                    const isCurrent = idx === activeComicIndex;
                    const panelCount = chap.pages?.reduce((acc, p) => acc + (p.panels?.length || 0), 0) || 0;
                    return (
                      <button
                        key={chap.id}
                        onClick={() => {
                          setActiveComicIndex(idx);
                          setIsChapterMenuOpen(false);
                          scrollToTop();
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30 font-bold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="font-serif text-xs truncate">
                            {chap.title}
                          </div>
                          {chap.subtitle && (
                            <div className="text-[10px] text-slate-400 truncate">
                              {chap.subtitle}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-mono opacity-80 text-rose-300">
                          {panelCount} tranh
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Right: Essential Tools & Reading Settings */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs">
            {/* NetTruyen Member Account & Profile */}
            <UserProfileDropdown
              currentUser={currentUser}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
              onUserUpdated={(u) => setCurrentUser(u)}
            />

            {/* Audio Read-Aloud Button (Truyện Chữ) */}
            {readerType === 'novel' && (
              <button
                onClick={handleToggleAudio}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-black/25 hover:bg-black/35 border-white/10 text-slate-300'
                }`}
                title="Đọc to truyện bằng giọng AI tiếng Việt (Karaoke & Đa giọng)"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden md:inline">{isPlayingAudio ? 'Đang đọc...' : 'Đọc Audio'}</span>
              </button>
            )}

            {/* Reading Mode Button (Truyện Tranh) */}
            {readerType === 'comic' && (
              <button
                onClick={() => setComicMode(prev => prev === 'webtoon' ? 'manga_pages' : 'webtoon')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border bg-black/25 hover:bg-black/35 border-white/10 text-slate-300 transition-all cursor-pointer"
                title="Chuyển chế độ đọc: Cuộn Webtoon dọc hoặc Từng trang"
              >
                <Layers className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline">{comicMode === 'webtoon' ? 'Cuộn Webtoon' : 'Từng Trang'}</span>
              </button>
            )}

            {/* Reading Customizer Settings Button */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/35 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Tùy chỉnh phông chữ, cỡ chữ, giao diện đọc"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-xs">Tùy Chỉnh</span>
            </button>

            {/* Zen / Focus Mode Button */}
            <button
              onClick={() => setIsZenMode(true)}
              className="p-2 rounded-xl bg-black/25 hover:bg-black/35 border border-white/10 hover:border-pink-400/40 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Chế độ tập trung đọc (Ẩn toàn bộ thanh công cụ)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-pink-400" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked 
                  ? 'text-amber-400 border-amber-400/50 bg-amber-400/10' 
                  : 'text-slate-400 hover:text-white border-white/10 bg-black/25 hover:bg-black/35'
              }`}
              title={isBookmarked ? "Đã đánh dấu chương" : "Đánh dấu chương"}
            >
              <BookMarked className="w-3.5 h-3.5" />
            </button>

            {/* Discreet Author Mode Trigger */}
            {onOpenAuthorLogin && (
              <button
                onClick={onOpenAuthorLogin}
                className="p-2 rounded-xl text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                title="Dành cho Tác giả nhập mã PIN quản trị"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </header>
      )}

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop for Sidebar */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm transition-opacity" 
          />
        )}

        {/* ================= LEFT SIDEBAR: MỤC LỤC TÁC PHẨM & TRUYỆN TRANH ================= */}
        <aside
          className={`w-80 sm:w-88 lg:w-96 flex-shrink-0 flex flex-col border-r select-none h-full transition-all duration-300 z-30 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
          } bg-[#080d1e]/90 border-r border-indigo-500/20 text-slate-200 backdrop-blur-2xl absolute lg:relative inset-y-0 left-0 shadow-2xl lg:shadow-none`}
        >
          {readerType === 'novel' ? (
            <>
              {/* 1. Header Card with Title and Word Count */}
              <div className="p-4 border-b border-indigo-500/15 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-pink-400/30 flex items-center justify-center text-amber-300 shadow-sm">
                    <span className="text-base">🐉</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
                      <span>Mục Lục Tác Phẩm</span>
                      <span className="text-pink-400 text-xs">✨</span>
                    </h3>
                    <p className="text-[10px] text-pink-300/70">Tiểu Thuyết Huyền Huyễn Á Đông</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 to-pink-500/15 border border-amber-500/30 shadow-sm">
                    {totalNovelWords.toLocaleString()} từ
                  </span>
                </div>
              </div>

              {/* Google Docs Live Sync - CHỈ hiển thị khi ở chế độ Tác Giả */}
              {isAuthorMode && (
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-sky-950/30 to-slate-900/50 border border-emerald-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-emerald-300 font-mono">👑 GOOGLE DOC LIVE</span>
                    <a
                      href={GOOGLE_DOCS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline"
                    >
                      <span>Link gốc</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <button
                    onClick={() => onSyncGoogleDocs && onSyncGoogleDocs()}
                    disabled={isSyncingDoc}
                    className="w-full py-1 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncingDoc ? 'animate-spin' : ''}`} />
                    <span>{isSyncingDoc ? 'Đang cập nhật...' : 'Cập Nhật Từ Doc'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Main Sections Tree */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
              {/* Mục Mở Đầu (Prologue): Hiển thị trực tiếp 1 thẻ duy nhất, KHÔNG tạo thư mục lồng nhau */}
              {(() => {
                const prologuePart = parts.find(p => p.id === 'part_prologue' || p.title.toLowerCase().includes('mở đầu')) || parts[0];
                const prologueChap = prologuePart?.chapters[0];
                const isPrologueActive = selectedPartId === prologuePart?.id && activeChapterIndex === 0;

                if (!prologueChap) return null;

                return (
                  <div
                    key="prologue_direct_card"
                    onClick={() => {
                      setSelectedPartId(prologuePart.id);
                      setActiveChapterIndex(0);
                      scrollToTop();
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`group p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${
                      isPrologueActive
                        ? 'bg-gradient-to-r from-amber-500/25 via-pink-500/15 to-purple-500/15 border-amber-400/50 text-amber-100 shadow-md shadow-amber-500/15 ring-1 ring-amber-400/30'
                        : 'bg-slate-900/40 border-white/5 hover:border-amber-400/30 hover:bg-white/5 text-slate-300'
                    }`}
                    title={prologueChap.title}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <span className="text-base flex-shrink-0">📜</span>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-serif font-bold text-xs truncate ${isPrologueActive ? 'text-amber-200' : 'text-slate-100 group-hover:text-amber-300'}`}>
                          {prologueChap.title}
                        </h4>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                          <span>Khởi đầu saga</span>
                          <span>•</span>
                          <span className="font-mono text-amber-300/80">{prologueChap.wordCount.toLocaleString()} từ</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {currentUser?.readChapterIds?.includes(prologueChap.id) && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-sans flex items-center gap-0.5 border border-emerald-500/30">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Đã đọc
                        </span>
                      )}
                      {isPrologueActive ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                      ) : (
                        <span className="text-[10px] font-mono opacity-60 group-hover:opacity-100 text-slate-400">
                          {prologueChap.wordCount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Các phần tiếp theo (Phần I — Mùa Nước Đứng, v.v.): Bỏ qua phần mở đầu để không trùng lặp */}
              {parts
                .filter(p => !(p.id === 'part_prologue' || p.title.toLowerCase().includes('mở đầu')))
                .map((part) => {
                  const isExpanded = expandedSections[part.id] !== false;
                  const theme = getSectionTheme(part.title, part.id);

                  return (
                    <div 
                      key={part.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isExpanded 
                          ? 'bg-slate-900/60 border-indigo-500/30 shadow-lg shadow-black/20' 
                          : 'bg-slate-900/20 border-white/5 hover:border-white/15'
                      }`}
                    >
                      {/* Section Header */}
                      <div 
                        onClick={() => toggleSection(part.id)}
                        className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          <span className="text-base flex-shrink-0">{theme.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-serif font-bold text-xs text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                                {part.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>{part.chapters.length} chương</span>
                              <span>•</span>
                              <span className="font-mono text-slate-300">{part.wordCount.toLocaleString()} từ</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-1 text-slate-400 group-hover:text-slate-200 transition-colors">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-amber-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* List of Chapters inside this Section */}
                      {isExpanded && (
                        <div className="p-1.5 space-y-1 bg-slate-950/60 border-t border-white/5">
                          {part.chapters.length === 0 ? (
                            <div className="p-3 text-center text-slate-500 text-xs italic">
                              Chưa có chương nào.
                            </div>
                          ) : (
                            part.chapters.map((chap, cIdx) => {
                              const isActive = part.id === selectedPartId && cIdx === activeChapterIndex;

                              return (
                                <div
                                  key={chap.id}
                                  onClick={() => {
                                    setSelectedPartId(part.id);
                                    setActiveChapterIndex(cIdx);
                                    scrollToTop();
                                    if (window.innerWidth < 1024) {
                                      setIsSidebarOpen(false);
                                    }
                                  }}
                                  className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                                    isActive
                                      ? 'bg-gradient-to-r from-amber-500/20 via-pink-500/10 to-transparent border-amber-500/40 text-amber-100 shadow-md shadow-amber-500/10'
                                      : 'bg-slate-900/40 border-transparent hover:bg-white/5 text-slate-300 hover:border-white/10'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${
                                      isActive ? 'bg-amber-400 ring-4 ring-amber-500/30 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-slate-600 group-hover:bg-slate-400'
                                    }`} />

                                    <div className="min-w-0 flex-1">
                                      <h4 className={`font-serif font-medium text-xs leading-snug truncate ${
                                        isActive ? 'text-amber-200 font-bold' : 'text-slate-200 group-hover:text-white'
                                      }`}>
                                        {chap.title}
                                      </h4>
                                      {chap.povCharacterName && (
                                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                                          POV: {chap.povCharacterName} {chap.location ? `• ${chap.location}` : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-1.5 flex-shrink-0 text-[10px] font-mono opacity-80 group-hover:opacity-100">
                                    {currentUser?.readChapterIds?.includes(chap.id) && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-sans flex items-center gap-0.5 border border-emerald-500/30">
                                        <CheckCircle2 className="w-2.5 h-2.5" /> Đã đọc
                                      </span>
                                    )}
                                    <span className={isActive ? 'text-amber-300 font-semibold' : 'text-slate-400'}>
                                      {chap.wordCount.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        ) : (
          <>
            {/* Comic Sidebar Header Card */}
            <div className="p-4 border-b border-rose-500/15 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-purple-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 shadow-sm">
                    <span className="text-base">🎨</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
                      <span>Mục Lục Truyện Tranh</span>
                      <span className="text-rose-400 text-xs">✨</span>
                    </h3>
                    <p className="text-[10px] text-rose-300/70">Webtoon Long Ấn Thức Tỉnh</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-rose-300 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 shadow-sm">
                    {comicChapters.length} Hồi
                  </span>
                </div>
              </div>
            </div>

            {/* Comic Chapters List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
              {comicChapters.map((chap, idx) => {
                const isActive = idx === activeComicIndex;
                const panelCount = chap.pages?.reduce((acc, p) => acc + (p.panels?.length || 0), 0) || 0;
                return (
                  <div
                    key={chap.id}
                    onClick={() => {
                      setActiveComicIndex(idx);
                      scrollToTop();
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`group p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-500/25 via-pink-500/15 to-purple-500/15 border-rose-400/50 text-rose-100 shadow-md shadow-rose-500/15 ring-1 ring-rose-400/30'
                        : 'bg-slate-900/40 border-white/5 hover:border-rose-400/30 hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10 shadow-sm">
                        {chap.coverUrl ? (
                          <img src={chap.coverUrl} alt={chap.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">🎨</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-serif font-bold text-xs truncate ${isActive ? 'text-rose-200' : 'text-slate-100 group-hover:text-rose-300'}`}>
                          {chap.title}
                        </h4>
                        <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5 truncate">
                          {publishedComicChapterIds.includes(chap.id) ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                              Đã Xuất Bản
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-mono border border-amber-500/25">
                              Coming Soon
                            </span>
                          )}
                          {currentUser?.readChapterIds?.includes(chap.id) && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-sans flex items-center gap-0.5 border border-emerald-500/30">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Đã đọc
                            </span>
                          )}
                          <span>•</span>
                          <span>{panelCount} khung tranh</span>
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.9)] shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </aside>

      {/* ================= RIGHT READING CONTENT AREA ================= */}
      {readerType === 'novel' ? (
        <main 
          ref={scrollContainerRef} 
          className="flex-1 h-full overflow-y-auto custom-scrollbar relative px-4 sm:px-8 lg:px-12 py-8 transition-all duration-300"
        >
            {/* Top Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-pink-500 to-cyan-400 transition-all duration-150 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            {/* Ambient Dreamy Floating Stardust */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
              <div className="absolute top-12 left-1/4 text-amber-300/30 animate-starlight text-lg">✦</div>
              <div className="absolute top-1/3 right-16 text-pink-300/30 animate-starlight text-sm" style={{ animationDelay: '1.2s' }}>✧</div>
              <div className="absolute top-2/3 left-16 text-indigo-300/30 animate-starlight text-base" style={{ animationDelay: '2.4s' }}>⋆</div>
              <div className="absolute bottom-24 right-1/3 text-amber-200/30 animate-starlight text-xs" style={{ animationDelay: '0.8s' }}>✨</div>
              <div className="absolute top-1/2 left-3/4 text-pink-300/25 animate-starlight text-xs" style={{ animationDelay: '1.9s' }}>🌸</div>
            </div>

            {(() => {
              const containerWidthClass = readingPrefs.pageWidth === 'narrow' ? 'max-w-2xl' : readingPrefs.pageWidth === 'wide' ? 'max-w-4xl' : 'max-w-3xl';
              const fontFamStyle = readingPrefs.fontFamily === 'serif' 
                ? "'Merriweather', Georgia, serif" 
                : readingPrefs.fontFamily === 'lora' 
                ? "'Lora', Georgia, serif" 
                : readingPrefs.fontFamily === 'sans' 
                ? "'Plus Jakarta Sans', Inter, sans-serif" 
                : "'JetBrains Mono', monospace";

              return (
                <div className={`${containerWidthClass} mx-auto relative z-10`}>
                  {/* Breadcrumbs & Chapter Header (Dreamy & Poetic Style) */}
                  <div className="mb-8 pb-5 border-b border-indigo-500/20">
                    <nav className="flex items-center space-x-2 text-xs text-amber-300/80 mb-3 font-serif overflow-x-auto whitespace-nowrap">
                      <span onClick={() => goToChapterByGlobalIndex(0)} className="hover:text-pink-300 cursor-pointer opacity-75 transition-colors">
                        Long Ấn Thức Tỉnh
                      </span>
                      <span>›</span>
                      <span className="opacity-80 text-pink-200">{activePart?.title}</span>
                      <span>›</span>
                      <span className="text-amber-300 font-semibold">{currentChapter?.title}</span>
                    </nav>

                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300/90 font-serif mb-2">
                      <span className="text-pink-400">✨</span>
                      <span>LONG ẤN THỨC TỈNH • {activePart?.title}</span>
                      <span className="text-pink-400">🌸</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight leading-tight mb-4 bg-gradient-to-r from-amber-200 via-rose-100 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">
                      {currentChapter?.title || 'Chương Chưa Đặt Tên'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-slate-300">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300">
                        ⭐ {totalWords.toLocaleString()} chữ
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300">
                        ⏱️ ~{estimatedReadTime} phút đọc
                      </span>
                      {currentChapter?.povCharacterName && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-200">
                          🌸 POV: {currentChapter.povCharacterName}
                        </span>
                      )}
                      {currentChapter?.location && (
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-200">
                          🌊 {currentChapter.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prose Article (Nội dung truyện chữ thơ mộng) */}
                  <article 
                    className={`font-serif prose prose-lg max-w-none text-justify px-4 sm:px-8 py-6 rounded-3xl ${novelThemeClasses.container} ${novelThemeClasses.prose}`}
                    style={{
                      fontSize: `${readingPrefs.fontSize}px`,
                      lineHeight: readingPrefs.lineHeight,
                      fontFamily: fontFamStyle
                    }}
                  >
                    {currentChapter?.content ? (
                      currentChapter.content.split('\n\n').filter(p => p.trim().length > 0).map((paragraph, pIdx) => {
                        const isQuote = paragraph.startsWith('“') || paragraph.startsWith('﻿“');
                        const isDialogueDash = paragraph.startsWith('—');
                        const paraSentences = audioDramaSentences.filter(s => s.paragraphIndex === pIdx);

                        const paragraphInner = paraSentences.length > 0 ? (
                          paraSentences.map((sent) => {
                            const sentGlobalIdx = audioDramaSentences.findIndex(s => s.id === sent.id);
                            const isCurrentlySpoken = isPlayingAudio && currentSentenceIndex === sentGlobalIdx;

                            return (
                              <span
                                key={sent.id}
                                id={sent.id}
                                onClick={() => playSentence(sentGlobalIdx)}
                                className={`transition-all duration-200 rounded cursor-pointer ${
                                  isCurrentlySpoken
                                    ? 'bg-amber-400/30 text-amber-100 font-semibold shadow-[0_0_14px_rgba(251,191,36,0.55)] border-b-2 border-amber-400 px-1 py-0.5 ring-2 ring-amber-400/40 inline'
                                    : 'hover:bg-amber-500/10'
                                }`}
                                title="Nhấn để nghe audio từ câu này"
                              >
                                {sent.text}{' '}
                              </span>
                            );
                          })
                        ) : (
                          paragraph
                        );

                        if (isQuote) {
                          return (
                            <p key={pIdx} className="italic text-amber-200 font-medium pl-5 pr-4 py-3.5 border-l-2 border-amber-400/80 bg-gradient-to-r from-amber-500/10 via-pink-500/5 to-transparent rounded-r-2xl my-6 shadow-sm">
                              {paragraphInner}
                            </p>
                          );
                        }
                        if (isDialogueDash) {
                          return (
                            <p key={pIdx} className="font-sans pl-2 my-4 text-slate-100 font-medium tracking-wide">
                              {paragraphInner}
                            </p>
                          );
                        }
                        return (
                          <p key={pIdx} className="indent-8 my-5 leading-relaxed text-slate-200/95">
                            {paragraphInner}
                          </p>
                        );
                      })
                    ) : (
                      <div className="text-center py-20 opacity-50 font-serif">Chưa có nội dung trong chương này.</div>
                    )}
                  </article>

                  {/* Clean Novel Navigation Footer */}
                  <div className="mt-14 pt-8 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      disabled={currentGlobalIndex <= 0}
                      onClick={() => goToChapterByGlobalIndex(currentGlobalIndex - 1)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-200 font-serif text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-400" />
                      <div className="text-left">
                        <div className="text-[10px] text-pink-300/80 font-sans uppercase">🐾 Chương Trước</div>
                        <div className="font-medium truncate max-w-[200px]">
                          {currentGlobalIndex > 0 ? allFlatChapters[currentGlobalIndex - 1]?.chapter.title : 'Đầu danh sách'}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={scrollToTop}
                      className="px-4 py-2.5 rounded-2xl text-xs text-slate-400 hover:text-pink-300 border border-white/10 hover:border-pink-400/30 transition-all flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-pink-500/10 active:scale-95"
                      title="Cuộn lên đầu trang"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>🌸 Lên đầu trang</span>
                    </button>

                    <button
                      disabled={currentGlobalIndex >= allFlatChapters.length - 1}
                      onClick={() => goToChapterByGlobalIndex(currentGlobalIndex + 1)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-pink-400/40 bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 hover:from-pink-500/25 hover:to-amber-500/25 disabled:opacity-30 disabled:pointer-events-none text-pink-100 font-serif text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-pink-500/10 hover:scale-[1.02] active:scale-95"
                    >
                      <div className="text-right">
                        <div className="text-[10px] text-amber-300 font-sans uppercase">Chương Kế Tiếp 🐾</div>
                        <div className="font-medium truncate max-w-[200px]">
                          {currentGlobalIndex < allFlatChapters.length - 1 ? allFlatChapters[currentGlobalIndex + 1]?.chapter.title : 'Cuối danh sách'}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>

                  {/* Reader Community Reactions & Thoughts Section */}
                  <ChapterCommentsSection 
                    chapterId={currentChapter?.id || 'doc_chap_prologue'} 
                    chapterTitle={currentChapter?.title || 'Chương hiện tại'} 
                  />
                </div>
              );
            })()}

            {/* ================= FLOATING QUICK BOTTOM NAVIGATOR ================= */}
            {!isZenMode && (
              <div className="sticky bottom-4 z-30 mx-auto px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2 text-xs w-fit">
                <button
                  disabled={currentGlobalIndex <= 0}
                  onClick={() => goToChapterByGlobalIndex(currentGlobalIndex - 1)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-medium flex items-center gap-1 cursor-pointer transition-all"
                  title="Chương trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Trước</span>
                </button>

                <select
                  value={currentGlobalIndex}
                  onChange={e => goToChapterByGlobalIndex(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-serif font-medium text-xs max-w-[150px] sm:max-w-[220px] truncate cursor-pointer outline-none"
                  title="Chọn nhanh chương"
                >
                  {allFlatChapters.map((item, idx) => (
                    <option key={item.chapter.id} value={idx}>
                      {item.chapter.title}
                    </option>
                  ))}
                </select>

                <button
                  disabled={currentGlobalIndex >= allFlatChapters.length - 1}
                  onClick={() => goToChapterByGlobalIndex(currentGlobalIndex + 1)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 disabled:opacity-30 font-medium flex items-center gap-1 cursor-pointer transition-all"
                  title="Chương sau"
                >
                  <span className="hidden sm:inline">Sau</span> <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={scrollToTop}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-all"
                  title="Lên đầu trang"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ================= FLOATING CHIBI COMPANION (BÉ LONG LONG) ================= */}
            {!isChibiMinimized ? (
              <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
                {/* Speech Bubble */}
                <div 
                  onClick={handlePokeChibi}
                  className="relative mb-2 max-w-[240px] sm:max-w-[280px] p-3 rounded-2xl bg-slate-900/95 border border-pink-400/40 shadow-2xl backdrop-blur-xl text-xs text-slate-100 font-sans leading-relaxed cursor-pointer hover:border-pink-300 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10 text-[10px] text-pink-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <span>🐉</span>
                      <span>Bé Long Long</span>
                      <span className="text-amber-400">✨</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsChibiMinimized(true);
                      }}
                      className="text-slate-400 hover:text-white p-0.5 rounded transition-colors text-[11px]"
                      title="Thu nhỏ Bé Long Long"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="font-medium text-pink-100/95 text-[11px]">
                    {CHIBI_QUOTES[chibiQuoteIndex]}
                  </p>
                  <div className="text-[9px] text-pink-300/70 mt-1 italic text-right group-hover:text-pink-200">
                    (Chạm bé để nghe lời chúc khác nha~)
                  </div>
                  {/* Pointer Triangle */}
                  <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900/95 border-r border-b border-pink-400/40 transform rotate-45" />
                </div>

                {/* Mascot Avatar */}
                <div 
                  onClick={handlePokeChibi}
                  className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  title="Bé Long Long - Nhấn để chơi cùng bé!"
                >
                  <ChibiDragonAvatar isBouncing={isChibiBouncing} />
                </div>
              </div>
            ) : (
              /* Minimized pill button */
              <button
                onClick={() => setIsChibiMinimized(false)}
                className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-amber-600/80 hover:from-purple-500 hover:to-amber-500 border border-pink-300/40 text-white text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all animate-bounce"
                title="Mở Bé Long Long"
              >
                <span>🐉</span>
                <span>Bé Long Long ✨</span>
              </button>
            )}
          </main>
        ) : (
          /* ================= COMIC VIEW: CHẾ ĐỘ TRUYỆN TRANH (COMING SOON HOẶC ĐÃ XUẤT BẢN) ================= */
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
            {(() => {
              const isCurrentComicPublished = publishedComicChapterIds.includes(activeComic.id);
              const shouldShowComingSoon = !isAuthorPreviewingDraft && !isCurrentComicPublished;

              if (shouldShowComingSoon) {
                return (
                  <ComicComingSoonView
                    comicChapters={comicChapters}
                    isAuthorMode={isAuthorMode}
                    currentUser={currentUser}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                    onPreviewDraft={(idx) => {
                      setActiveComicIndex(idx);
                      setIsAuthorPreviewingDraft(true);
                      scrollToTop();
                    }}
                    onPublishChapter={handlePublishComicChapter}
                    publishedChapterIds={publishedComicChapterIds}
                  />
                );
              }

              return (
                <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-6">
                  {/* DRAFT PREVIEW & PUBLISH CONTROL BAR FOR AUTHOR */}
                  {isAuthorMode && (
                    <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-purple-950/60 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>Chế độ Tác giả:</strong> {isCurrentComicPublished ? 'Hồi này đã xuất bản cho độc giả!' : 'Đang xem trước bản thảo (Độc giả đang thấy Coming Soon).'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsAuthorPreviewingDraft(false)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition-all cursor-pointer"
                        >
                          Trở về Coming Soon
                        </button>
                        <button
                          onClick={() => handlePublishComicChapter(activeComic.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shadow-sm ${
                            isCurrentComicPublished
                              ? 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-sans shadow-emerald-500/20'
                          }`}
                        >
                          {isCurrentComicPublished ? 'Thu Hồi Chương' : '🚀 Xuất Bản Chương Này'}
                        </button>
                      </div>
                    </div>
                  )}

              {/* 1. TOP INFO & BREADCRUMBS (NETTRUYEN) */}
              <div className="mb-4 pb-3 border-b border-white/10">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-1.5 text-xs text-slate-400 mb-2 overflow-x-auto whitespace-nowrap">
                  <span onClick={() => { setActiveComicIndex(0); scrollToTop(); }} className="hover:text-amber-400 cursor-pointer">
                    Trang chủ
                  </span>
                  <span>/</span>
                  <span className="hover:text-amber-400 cursor-pointer">{project.title}</span>
                  <span>/</span>
                  <span className="text-rose-400 font-semibold">{activeComic.title.split(':')[0]}</span>
                </nav>

                {/* Chapter Main Title */}
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  {project.title} - <span className="text-amber-300">{activeComic.title}</span>
                </h1>

                {/* Updated timestamp */}
                <p className="text-xs text-slate-400 italic mt-1">
                  [Ngày cập nhật: {project.updatedAt || 'Mới nhất'}]
                </p>
              </div>

              {/* 2. READING CONTROL BOX (NETTRUYEN) */}
              <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-md">
                {/* Keyboard shortcut hint alert */}
                <div className="bg-sky-500/10 border border-sky-500/25 text-sky-200 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Sử dụng mũi tên trái (←) hoặc phải (→) trên bàn phím để chuyển chapter</span>
                </div>

                {/* Chapter Navigation Buttons & Select */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveComicIndex(0);
                      scrollToTop();
                    }}
                    title="Trang chủ / Chapter đầu"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-all cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                  </button>

                  <button
                    disabled={activeComicIndex <= 0}
                    onClick={() => {
                      setActiveComicIndex(prev => Math.max(0, prev - 1));
                      scrollToTop();
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Chap trước</span>
                  </button>

                  {/* Select Chapter Dropdown */}
                  <select
                    value={activeComicIndex}
                    onChange={e => {
                      setActiveComicIndex(Number(e.target.value));
                      scrollToTop();
                    }}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-755 border border-white/20 text-white font-medium text-xs focus:ring-2 focus:ring-rose-500 outline-none max-w-[260px] sm:max-w-xs truncate cursor-pointer shadow-sm"
                  >
                    {comicChapters.map((c, idx) => (
                      <option key={c.id} value={idx}>
                        {c.title}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={activeComicIndex >= comicChapters.length - 1}
                    onClick={() => {
                      setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
                      scrollToTop();
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    <span>Chap sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. READING DETAIL: SEAMLESS VERTICAL COMIC STREAM (NETTRUYEN) */}
              <div className="reading-detail w-full flex flex-col items-center select-none space-y-1">
                {allPanels.map((panel, idx) => {
                  const imgUrl = panel.imageUrl || (panel.prompt ? AIStudioService.generatePanelImageUrl(panel.prompt, activeArtStyle, panel.panelNumber * 7) : null);
                  return (
                    <div key={panel.id || idx} className="page-chapter w-full max-w-3xl relative flex flex-col items-center">
                      {/* Comic Image */}
                      <div className="relative w-full bg-slate-950 overflow-hidden shadow-2xl rounded-sm">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={panel.caption || `Trang ${idx + 1}`}
                            className="w-full h-auto block select-none pointer-events-auto object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                        ) : (
                          <div className="p-12 text-center text-slate-500 text-xs">
                            Đang tải trang tranh...
                          </div>
                        )}

                        {/* SFX Graphic Badge (Sound Effect) */}
                        {panel.sfx && (
                          <div className="absolute top-4 right-4 bg-rose-600/90 text-white font-black italic tracking-widest text-xs px-3 py-1 rounded shadow-lg transform rotate-2 border border-rose-400 pointer-events-none">
                            {panel.sfx}
                          </div>
                        )}

                        {/* Page Number Indicator */}
                        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-[10px] text-white/80 font-mono px-2 py-0.5 rounded pointer-events-none">
                          Trang {idx + 1} / {allPanels.length}
                        </div>
                      </div>

                      {/* Dialogues directly under panel */}
                      {panel.dialogues && panel.dialogues.length > 0 && (
                        <div className="w-full px-4 py-2.5 space-y-1.5 bg-slate-950/95 border-b border-white/5">
                          {panel.dialogues.map(d => (
                            <div
                              key={d.id}
                              className={`flex items-start gap-2.5 text-xs ${
                                d.bubbleType === 'shout' ? 'text-rose-300 font-bold' : d.bubbleType === 'thought' ? 'italic text-sky-300' : 'text-slate-200'
                              }`}
                            >
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-300 shrink-0 font-serif">
                                {d.character}
                              </span>
                              <div className="text-xs bg-slate-800/80 p-2 rounded-xl border border-white/10 flex-1 leading-relaxed">
                                {d.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Caption */}
                      {panel.caption && (
                        <div className="w-full text-center text-xs text-slate-400 font-serif italic py-1.5 bg-black/40 border-b border-white/5">
                          {panel.caption}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 4. CHAPTER NAV BOTTOM (NETTRUYEN) */}
              <div className="chapter-nav-bottom flex flex-wrap items-center justify-center gap-2 py-8 border-t border-white/10 mt-8">
                <button
                  disabled={activeComicIndex <= 0}
                  onClick={() => {
                    setActiveComicIndex(prev => Math.max(0, prev - 1));
                    scrollToTop();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Chap trước</span>
                </button>

                <select
                  value={activeComicIndex}
                  onChange={e => {
                    setActiveComicIndex(Number(e.target.value));
                    scrollToTop();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-white/20 text-white font-medium text-xs focus:ring-2 focus:ring-rose-500 outline-none max-w-[260px] sm:max-w-xs truncate cursor-pointer shadow-sm"
                >
                  {comicChapters.map((c, idx) => (
                    <option key={c.id} value={idx}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <button
                  disabled={activeComicIndex >= comicChapters.length - 1}
                  onClick={() => {
                    setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
                    scrollToTop();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <span>Chap sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToTop}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
                  title="Cuộn lên đầu trang"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>Đầu trang</span>
                </button>
              </div>

              {/* 5. FLOATING QUICK SWITCH BAR */}
              <div className="sticky bottom-4 z-40 mx-auto px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-2 text-xs w-fit">
                <button
                  disabled={activeComicIndex <= 0}
                  onClick={() => {
                    setActiveComicIndex(prev => Math.max(0, prev - 1));
                    scrollToTop();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Trước
                </button>

                <select
                  value={activeComicIndex}
                  onChange={e => {
                    setActiveComicIndex(Number(e.target.value));
                    scrollToTop();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium text-xs max-w-[140px] sm:max-w-[200px] truncate"
                >
                  {comicChapters.map((c, idx) => (
                    <option key={c.id} value={idx}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <button
                  disabled={activeComicIndex >= comicChapters.length - 1}
                  onClick={() => {
                    setActiveComicIndex(prev => Math.min(comicChapters.length - 1, prev + 1));
                    scrollToTop();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white font-medium flex items-center gap-1"
                >
                  Sau <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={scrollToTop}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Lên đầu trang"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* FLOATING CHIBI COMPANION FOR COMIC (BÉ LONG LONG) */}
              {!isChibiMinimized ? (
                <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
                  <div 
                    onClick={handlePokeChibi}
                    className="relative mb-2 max-w-[240px] sm:max-w-[280px] p-3 rounded-2xl bg-slate-900/95 border border-pink-400/40 shadow-2xl backdrop-blur-xl text-xs text-slate-100 font-sans leading-relaxed cursor-pointer hover:border-pink-300 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10 text-[10px] text-pink-300 font-semibold">
                      <span className="flex items-center gap-1">
                        <span>🐉</span>
                        <span>Bé Long Long</span>
                        <span className="text-amber-400">✨</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsChibiMinimized(true);
                        }}
                        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors text-[11px]"
                        title="Thu nhỏ Bé Long Long"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="font-medium text-pink-100/95 text-[11px]">
                      {CHIBI_QUOTES[chibiQuoteIndex]}
                    </p>
                    <div className="text-[9px] text-pink-300/70 mt-1 italic text-right group-hover:text-pink-200">
                      (Chạm bé để nghe lời chúc khác nha~)
                    </div>
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900/95 border-r border-b border-pink-400/40 transform rotate-45" />
                  </div>

                  <div 
                    onClick={handlePokeChibi}
                    className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    title="Bé Long Long - Nhấn để chơi cùng bé!"
                  >
                    <ChibiDragonAvatar isBouncing={isChibiBouncing} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsChibiMinimized(false)}
                  className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-amber-600/80 hover:from-purple-500 hover:to-amber-500 border border-pink-300/40 text-white text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all animate-bounce"
                  title="Mở Bé Long Long"
                >
                  <span>🐉</span>
                  <span>Bé Long Long ✨</span>
                </button>
              )}
            </div>
          );
        })()}
      </div>
    )}
      </div>

      {/* ================= PANEL LIGHTBOX MODAL ================= */}
      {selectedPanel && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPanel(null)}
        >
          <div 
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-rose-500/30 shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-400" />
                Ô Tranh Số {selectedPanel.panelNumber} • {selectedPanel.cameraAngle || 'Góc máy'}
              </h3>
              <button
                onClick={() => setSelectedPanel(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                Đóng
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {(() => {
                const imgUrl = selectedPanel.imageUrl || (selectedPanel.prompt ? AIStudioService.generatePanelImageUrl(selectedPanel.prompt, activeArtStyle, selectedPanel.panelNumber * 7) : null);
                return imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={selectedPanel.caption || 'Panel'}
                    className="max-h-[65vh] w-auto object-contain"
                  />
                ) : (
                  <div className="text-slate-500">Chưa có ảnh</div>
                );
              })()}
            </div>

            <div className="p-4 space-y-3 bg-slate-950 text-xs">
              {selectedPanel.caption && (
                <p className="text-slate-300 font-serif italic">
                  📝 Dẫn truyện: {selectedPanel.caption}
                </p>
              )}
              {selectedPanel.prompt && (
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 font-mono text-[11px] text-amber-300/80">
                  <span className="font-bold text-amber-400">Prompt AI: </span>
                  {selectedPanel.prompt}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= COMIC SCRIPT CREATOR MODAL ================= */}
      {showPanelCreator && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 rounded-2xl border border-rose-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                Tạo Truyện Tranh Từ Đoạn Văn Tiểu Thuyết
              </h3>
              <button
                onClick={() => setShowPanelCreator(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/10"
              >
                Hủy
              </button>
            </div>

            <p className="text-xs text-slate-300">
              AI sẽ phân tích văn bản thành các khung tranh (panels), xây dựng góc máy, lời thoại bóng nước và tạo ảnh minh họa trực quan.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Đoạn văn muốn chuyển thể (Mặc định lấy từ chương đang đọc):
              </label>
              <textarea
                value={customSnippet || (currentChapter?.content ? currentChapter.content.slice(0, 800) : '')}
                onChange={e => setCustomSnippet(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-serif"
                placeholder="Dán đoạn văn tiểu thuyết cần vẽ truyện tranh vào đây..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Phong cách đồ họa (Art Style):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'dark_webtoon', label: 'Dark Webtoon (Manhwa)' },
                  { id: 'manga_shonen', label: 'Manga Shonen (Trắng đen)' },
                  { id: 'pixel_art', label: 'Pixel Art Á Đông (Game Soul Seal)' },
                  { id: 'anime_watercolor', label: 'Anime Thủy Mặc' },
                  { id: 'cinematic', label: 'Cinematic Concept Art' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setActiveArtStyle(style.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      activeArtStyle === style.id
                        ? 'bg-rose-500/25 border-rose-500 text-rose-300 font-bold'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowPanelCreator(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Đóng
              </button>
              <button
                disabled={isGeneratingComic}
                onClick={handleGenerateComicFromCurrentChapter}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-500/30 hover:opacity-90 disabled:opacity-50"
              >
                {isGeneratingComic ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang phân cảnh & sinh ảnh...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tạo Phân Cảnh & Minh Họa Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RIGHT EDGE FLOATING ACTION DOCK ================= */}
      {!isZenMode && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end space-y-2 pointer-events-auto">
          {/* Tab 1: Hồ Sơ Nhân Vật */}
          <button
            onClick={() => setIsCharacterDrawerOpen(prev => !prev)}
            className="group flex items-center gap-1.5 py-3.5 px-2 bg-gradient-to-b from-slate-900/95 via-cyan-950/95 to-slate-900/95 border-l-2 border-y border-cyan-400/60 hover:border-cyan-300 text-cyan-300 rounded-l-2xl shadow-[-6px_0_30px_rgba(0,0,0,0.7)] backdrop-blur-xl hover:translate-x-[-6px] hover:text-cyan-100 transition-all cursor-pointer ring-1 ring-cyan-500/20"
            title="Mở hồ sơ toàn bộ nhân vật"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
              <span className="[writing-mode:vertical-rl] text-[10px] font-bold tracking-widest text-slate-200 group-hover:text-cyan-200 font-serif uppercase">
                NHÂN VẬT
              </span>
              <span className="w-4 h-4 rounded-full bg-cyan-500/25 border border-cyan-400/50 text-[9px] font-mono font-bold flex items-center justify-center text-cyan-300">
                {allCharacters.length}
              </span>
            </div>
          </button>

          {/* Tab 2: Bản Đồ Thế Giới */}
          <button
            onClick={() => setIsAtlasOpen(true)}
            className="group flex items-center gap-1 py-2.5 px-2 bg-slate-900/95 border-l-2 border-y border-cyan-500/40 hover:border-cyan-300 text-cyan-300 rounded-l-xl shadow-lg backdrop-blur-xl hover:translate-x-[-4px] transition-all cursor-pointer"
            title="Mở bản đồ thế giới sông Asera & Bến Arumo"
          >
            <Compass className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
          </button>

          {/* Tab 3: Âm Thanh Nền */}
          <button
            onClick={() => setIsSoundPlayerOpen(true)}
            className="group flex items-center gap-1 py-2.5 px-2 bg-slate-900/95 border-l-2 border-y border-indigo-500/40 hover:border-indigo-300 text-indigo-300 rounded-l-xl shadow-lg backdrop-blur-xl hover:translate-x-[-4px] transition-all cursor-pointer"
            title="Mở âm thanh môi trường thư giãn khi đọc"
          >
            <Music className="w-4 h-4 text-indigo-400 group-hover:scale-125 transition-transform" />
          </button>

          {/* Tab 4: Từ Điển Lore */}
          <button
            onClick={() => setIsCodexOpen(true)}
            className="group flex items-center gap-1 py-2.5 px-2 bg-slate-900/95 border-l-2 border-y border-amber-500/40 hover:border-amber-300 text-amber-300 rounded-l-xl shadow-lg backdrop-blur-xl hover:translate-x-[-4px] transition-all cursor-pointer"
            title="Mở Từ Điển Bách Khoa Thế Giới (Codex)"
          >
            <BookMarked className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
          </button>

          {/* Tab 5: Dòng Thời Gian */}
          <button
            onClick={() => setIsTimelineOpen(true)}
            className="group flex items-center gap-1 py-2.5 px-2 bg-slate-900/95 border-l-2 border-y border-rose-500/40 hover:border-rose-300 text-rose-300 rounded-l-xl shadow-lg backdrop-blur-xl hover:translate-x-[-4px] transition-all cursor-pointer"
            title="Mở Biên Niên Sử (Thời Gian)"
          >
            <Clock className="w-4 h-4 text-rose-400 group-hover:scale-125 transition-transform" />
          </button>
        </div>
      )}

      {/* ================= ALL 6 POWERHOUSE MODALS & DRAWERS ================= */}
      {/* 1. Character Dossier Drawer */}
      <CharacterDossierDrawer
        isOpen={isCharacterDrawerOpen}
        onClose={() => setIsCharacterDrawerOpen(false)}
        characters={allCharacters}
        selectedCharId={selectedCharacterId}
        onSelectCharacter={(id) => setSelectedCharacterId(id)}
      />

      {/* 2. World Atlas Modal */}
      <WorldAtlasModal
        isOpen={isAtlasOpen}
        onClose={() => setIsAtlasOpen(false)}
      />

      {/* 3. Ambient Soundscape Player */}
      <AmbientSoundPlayer
        isOpen={isSoundPlayerOpen}
        onClose={() => setIsSoundPlayerOpen(false)}
      />

      {/* 4. Lore Codex Drawer */}
      <LoreCodexDrawer
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
      />

      {/* 5. Chronicle Timeline Modal */}
      <ChronicleTimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />

      {/* 6. Reading Settings Modal */}
      <ReadingSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        prefs={readingPrefs}
        onUpdatePrefs={handleUpdatePrefs}
      />

      {/* 7. Smart Audio Drama Karaoke Player Bar */}
      {isAudioPlayerVisible && (
        <AudioDramaPlayerBar
          currentSentence={audioDramaSentences[currentSentenceIndex] || null}
          currentIndex={currentSentenceIndex}
          totalSentences={audioDramaSentences.length}
          isPlaying={isPlayingAudio}
          voiceMode={voiceMode}
          speed={speechRate}
          isAutoScrollEnabled={isAutoScrollEnabled}
          onTogglePlay={handleToggleAudio}
          onPrevSentence={() => {
            const nextIdx = Math.max(0, currentSentenceIndex - 1);
            playSentence(nextIdx);
          }}
          onNextSentence={() => {
            const nextIdx = Math.min(audioDramaSentences.length - 1, currentSentenceIndex + 1);
            playSentence(nextIdx);
          }}
          onChangeVoiceMode={(mode) => {
            setVoiceMode(mode);
            if (isPlayingAudio) playSentence(currentSentenceIndex);
          }}
          onChangeSpeed={(s) => {
            setSpeechRate(s);
            if (isPlayingAudio) playSentence(currentSentenceIndex);
          }}
          onToggleAutoScroll={() => setIsAutoScrollEnabled(prev => !prev)}
          onClose={() => {
            if (synthRef.current) synthRef.current.cancel();
            setIsPlayingAudio(false);
            setIsAudioPlayerVisible(false);
          }}
        />
      )}

      {/* 8. NetTruyen Member Auth Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* 9. NetTruyen Reading History & Bookmarks Modal */}
      <UserHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentUser={currentUser}
        onNavigateChapter={handleNavigateFromHistory}
      />
    </div>
  );
};

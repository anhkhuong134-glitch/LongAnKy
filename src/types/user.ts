export interface SavedQuote {
  id: string;
  chapterId: string;
  chapterTitle: string;
  text: string;
  savedAt: string;
}

export interface UserLastRead {
  type: 'novel' | 'comic';
  chapterId: string;
  chapterTitle: string;
  partId?: string;
  partTitle?: string;
  chapterIndex: number;
  progressPercent: number;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  password?: string; // Mật khẩu xác thực tài khoản lưu trong cơ sở dữ liệu
  avatar: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  levelTitle: string;
  joinedDate: string;
  lastCheckInDate?: string;
  streakDays: number;
  isFollowing: boolean;
  bookmarkedChapterIds: string[];
  readChapterIds: string[];
  lastRead?: UserLastRead;
  savedQuotes?: SavedQuote[];
  readingTheme?: string;
  readingFontSize?: number;
  isAdmin?: boolean; // Quyền quản trị viên / Tác giả tối cao
}

export interface ReadingHistoryItem {
  id: string;
  type: 'novel' | 'comic';
  chapterId: string;
  chapterTitle: string;
  partTitle?: string;
  chapterIndex: number;
  partId?: string;
  progressPercent: number;
  readAt: string; // ISO string
  wordCount?: number;
}

export const USER_LEVEL_TITLES: { level: number; title: string; minExp: number; nextExp: number; badgeColor: string }[] = [
  { level: 1, title: 'Phàm Nhân Luyện Khí', minExp: 0, nextExp: 100, badgeColor: 'from-slate-500 to-slate-600' },
  { level: 2, title: 'Khởi Linh Sơ Kỳ', minExp: 100, nextExp: 300, badgeColor: 'from-emerald-500 to-teal-600' },
  { level: 3, title: 'Ngưng Ấn Chân Nhân', minExp: 300, nextExp: 700, badgeColor: 'from-sky-500 to-blue-600' },
  { level: 4, title: 'Long Hóa Đại Tôn', minExp: 700, nextExp: 1500, badgeColor: 'from-amber-500 to-orange-600' },
  { level: 5, title: 'Thần Ấn Chí Tôn', minExp: 1500, nextExp: 3000, badgeColor: 'from-purple-500 to-rose-600' },
  { level: 6, title: 'Cổ Long Bất Tử', minExp: 3000, nextExp: 10000, badgeColor: 'from-rose-500 to-amber-500' },
];

export const AVATAR_PRESETS = [
  { id: 'chibi_dragon', label: 'Bé Long Long', icon: '🐉', color: 'bg-purple-600' },
  { id: 'rento', label: 'Thợ Máy Rento', icon: '🔧', color: 'bg-amber-600' },
  { id: 'nari', label: 'Thiếu Nữ Nari', icon: '🌸', color: 'bg-pink-600' },
  { id: 'dagan', label: 'Thủ Lĩnh Dagan', icon: '⚔️', color: 'bg-red-600' },
  { id: 'seika', label: 'Ẩn Giả Seika', icon: '📜', color: 'bg-indigo-600' },
  { id: 'ancient_seal', label: 'Cổ Thần Ấn', icon: '✨', color: 'bg-cyan-600' },
];

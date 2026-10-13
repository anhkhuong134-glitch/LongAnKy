import { UserProfile, ReadingHistoryItem, USER_LEVEL_TITLES, SavedQuote, UserLastRead } from '../types/user';

const STORAGE_KEYS = {
  CURRENT_USER: 'longanky_current_user',
  ALL_USERS: 'longanky_user_accounts',
  READING_HISTORY: 'longanky_reading_history',
};

// Calculate level & title based on EXP
export function calculateLevelFromExp(exp: number) {
  for (let i = USER_LEVEL_TITLES.length - 1; i >= 0; i--) {
    const tier = USER_LEVEL_TITLES[i];
    if (exp >= tier.minExp) {
      return {
        level: tier.level,
        levelTitle: tier.title,
        nextLevelExp: tier.nextExp,
      };
    }
  }
  return {
    level: 1,
    levelTitle: USER_LEVEL_TITLES[0].title,
    nextLevelExp: USER_LEVEL_TITLES[0].nextExp,
  };
}

export class UserService {
  // 1. Get current logged in user
  static getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  // 2. Save current user
  static saveCurrentUser(user: UserProfile | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return;
    }
    // recalculate level
    const { level, levelTitle, nextLevelExp } = calculateLevelFromExp(user.exp);
    const updatedUser: UserProfile = {
      ...user,
      level,
      levelTitle,
      nextLevelExp,
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

    // Update in all users store as well
    const all = this.getAllUsers();
    const idx = all.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      all[idx] = updatedUser;
    } else {
      all.push(updatedUser);
    }
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(all));
  }

  // 3. Get all registered users
  static getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  // 4. Register new user with password validation and database storage
  static register(params: {
    username: string;
    password: string;
    displayName: string;
    email?: string;
    avatar?: string;
  }): { success: boolean; message: string; user?: UserProfile } {
    const cleanUsername = params.username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Tên đăng nhập phải từ 3 ký tự trở lên!' };
    }

    if (!params.password || params.password.length < 6) {
      return { success: false, message: 'Mật khẩu bảo mật phải từ 6 ký tự trở lên!' };
    }

    const all = this.getAllUsers();
    if (all.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Tên tài khoản này đã tồn tại trong cơ sở dữ liệu. Vui lòng chọn tên khác!' };
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      username: cleanUsername,
      password: params.password, // Lưu mật khẩu xác thực vào database
      displayName: params.displayName.trim() || params.username,
      email: params.email?.trim() || `${cleanUsername}@longan.vn`,
      avatar: params.avatar || '🐉',
      level: 1,
      exp: 50, // Welcome gift EXP
      nextLevelExp: 100,
      levelTitle: 'Phàm Nhân Luyện Khí',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      streakDays: 1,
      lastCheckInDate: new Date().toDateString(),
      isFollowing: true,
      bookmarkedChapterIds: [],
      readChapterIds: [],
    };

    all.push(newUser);
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(all));
    this.saveCurrentUser(newUser);
    return { success: true, message: 'Đăng ký tài khoản thành công! Thông tin đã được lưu vào cơ sở dữ liệu.', user: newUser };
  }

  // 5. Login with credentials verification against database
  static login(usernameOrEmail: string, password: string): { success: boolean; message: string; user?: UserProfile } {
    const clean = usernameOrEmail.trim().toLowerCase();
    if (!clean) return { success: false, message: 'Vui lòng nhập tên tài khoản hoặc email!' };
    if (!password) return { success: false, message: 'Vui lòng nhập mật khẩu tài khoản!' };

    const all = this.getAllUsers();
    const found = all.find(u => u.username.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean));

    if (!found) {
      return { success: false, message: 'Tài khoản không tồn tại trong cơ sở dữ liệu. Vui lòng kiểm tra lại hoặc đăng ký mới!' };
    }

    // Xác nhận mật khẩu có đúng không
    if (found.password && found.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.' };
    }

    // Cập nhật mật khẩu nếu tài khoản cũ chưa có
    if (!found.password) {
      found.password = password;
    }

    this.saveCurrentUser(found);
    return { success: true, message: `Xác thực thành công! Chào mừng đạo hữu ${found.displayName} trở lại.`, user: found };
  }

  // 6. Guest 1-click quick login (NetTruyen style)
  static guestLogin(): UserProfile {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      username: `khach_${randomNum}`,
      displayName: `Đạo Hữu Vô Danh #${randomNum}`,
      email: `guest${randomNum}@longan.vn`,
      avatar: '🐉',
      level: 1,
      exp: 30,
      nextLevelExp: 100,
      levelTitle: 'Phàm Nhân Luyện Khí',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      streakDays: 1,
      lastCheckInDate: new Date().toDateString(),
      isFollowing: true,
      bookmarkedChapterIds: [],
      readChapterIds: [],
    };

    this.saveCurrentUser(guestUser);
    return guestUser;
  }

  // 7. Logout
  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // 8. Award EXP (e.g. read chapter, comment, check-in)
  static awardExp(amount: number, reason: string): { user: UserProfile; leveledUp: boolean; diff: number } | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const oldLevel = user.level;
    user.exp += amount;
    const { level, levelTitle, nextLevelExp } = calculateLevelFromExp(user.exp);
    user.level = level;
    user.levelTitle = levelTitle;
    user.nextLevelExp = nextLevelExp;

    this.saveCurrentUser(user);
    return {
      user,
      leveledUp: level > oldLevel,
      diff: amount,
    };
  }

  // 9. Daily Check-In (Điểm danh nhận EXP)
  static dailyCheckIn(): { success: boolean; message: string; expGained: number } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Vui lòng đăng nhập để điểm danh!', expGained: 0 };

    const todayStr = new Date().toDateString();
    if (user.lastCheckInDate === todayStr) {
      return { success: false, message: 'Hôm nay bạn đã điểm danh rồi, mai quay lại nhé!', expGained: 0 };
    }

    user.streakDays = (user.streakDays || 0) + 1;
    user.lastCheckInDate = todayStr;
    const expBonus = 50 + Math.min(user.streakDays * 5, 50);
    this.awardExp(expBonus, 'Điểm danh hằng ngày');

    return {
      success: true,
      message: `Điểm danh thành công! Chuỗi ngày: ${user.streakDays} ngày. +${expBonus} EXP!`,
      expGained: expBonus,
    };
  }

  // 10. Toggle Follow Story (Theo Dõi Truyện - NetTruyen style)
  static toggleFollowStory(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    user.isFollowing = !user.isFollowing;
    this.saveCurrentUser(user);
    return user.isFollowing;
  }

  // 11. Toggle Chapter Bookmark
  static toggleChapterBookmark(chapterId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const exists = user.bookmarkedChapterIds.includes(chapterId);
    if (exists) {
      user.bookmarkedChapterIds = user.bookmarkedChapterIds.filter(id => id !== chapterId);
    } else {
      user.bookmarkedChapterIds.push(chapterId);
      this.awardExp(10, 'Đánh dấu chương yêu thích');
    }

    this.saveCurrentUser(user);
    return !exists;
  }

  // 12. Mark Chapter As Read (Đánh dấu đã đọc trong mục lục giống NetTruyen)
  static markChapterAsRead(chapterId: string): void {
    const user = this.getCurrentUser();
    if (!user) return;

    if (!user.readChapterIds.includes(chapterId)) {
      user.readChapterIds.push(chapterId);
      this.awardExp(20, 'Đọc xong chương mới');
      this.saveCurrentUser(user);
    }
  }

  // 13. Reading History Management
  static getReadingHistory(): ReadingHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_HISTORY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  static recordReadingHistory(item: Omit<ReadingHistoryItem, 'id' | 'readAt'>): void {
    const history = this.getReadingHistory();
    // Remove if already exists for this chapter to bump to top
    const filtered = history.filter(h => h.chapterId !== item.chapterId);

    const newEntry: ReadingHistoryItem = {
      ...item,
      id: `hist_${Date.now()}`,
      readAt: new Date().toISOString(),
    };

    filtered.unshift(newEntry);
    // Keep max 30 recent history items
    const trimmed = filtered.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.READING_HISTORY, JSON.stringify(trimmed));

    // Also mark chapter as read for current user
    this.markChapterAsRead(item.chapterId);

    // Save exact last read progress to current user profile for NetTruyen auto-resume
    const user = this.getCurrentUser();
    if (user) {
      user.lastRead = {
        type: item.type,
        chapterId: item.chapterId,
        chapterTitle: item.chapterTitle,
        partId: item.partId,
        partTitle: item.partTitle,
        chapterIndex: item.chapterIndex,
        progressPercent: Math.round(item.progressPercent || 0),
        updatedAt: new Date().toISOString(),
      };
      this.saveCurrentUser(user);
    }
  }

  static getLastRead(): UserLastRead | null {
    const user = this.getCurrentUser();
    return user?.lastRead || null;
  }

  // Sổ tay trích đoạn tâm đắc (Chỉ người dùng có)
  static saveQuote(chapterId: string, chapterTitle: string, text: string): { success: boolean; quotes: SavedQuote[]; message: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, quotes: [], message: 'Vui lòng đăng nhập để lưu trích đoạn vào Sổ Tay!' };

    if (!user.savedQuotes) user.savedQuotes = [];
    const newQuote: SavedQuote = {
      id: `quote_${Date.now()}`,
      chapterId,
      chapterTitle,
      text: text.trim(),
      savedAt: new Date().toLocaleDateString('vi-VN'),
    };
    user.savedQuotes.unshift(newQuote);
    this.awardExp(15, 'Lưu trích đoạn tâm đắc');
    this.saveCurrentUser(user);

    return {
      success: true,
      quotes: user.savedQuotes,
      message: 'Đã lưu câu văn vào Sổ Tay Đạo Hữu (+15 Tu Vi)!',
    };
  }

  static deleteQuote(quoteId: string): SavedQuote[] {
    const user = this.getCurrentUser();
    if (!user || !user.savedQuotes) return [];

    user.savedQuotes = user.savedQuotes.filter(q => q.id !== quoteId);
    this.saveCurrentUser(user);
    return user.savedQuotes;
  }

  static getSavedQuotes(): SavedQuote[] {
    const user = this.getCurrentUser();
    return user?.savedQuotes || [];
  }

  static clearReadingHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.READING_HISTORY);
  }
}

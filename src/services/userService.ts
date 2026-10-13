import { UserProfile, ReadingHistoryItem, USER_LEVEL_TITLES, SavedQuote, UserLastRead } from '../types/user';

const STORAGE_KEYS = {
  CURRENT_USER: 'longanky_current_user',
  ALL_USERS: 'longanky_user_accounts',
  READING_HISTORY: 'longanky_reading_history',
  DB_CACHE_STATUS: 'longanky_db_status_cache',
};

export interface DatabaseStatus {
  connected: boolean;
  provider: string;
  userCount?: number;
  message: string;
}

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
  // 1. Get current logged in user from localStorage cache
  static getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  // 2. Save current user locally & trigger background cloud sync
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
    const idx = all.findIndex(u => u.id === user.id || u.username === user.username);
    if (idx >= 0) {
      all[idx] = updatedUser;
    } else {
      all.push(updatedUser);
    }
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(all));

    // Synchronize to Vercel Database in background
    this.syncCloudUser(updatedUser);
  }

  // 3. Get all registered users from local cache
  static getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  // 4. Check Vercel Database Connection Status
  static async checkDatabaseStatus(): Promise<DatabaseStatus> {
    try {
      const res = await fetch('/api/auth?action=status', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const status: DatabaseStatus = {
          connected: Boolean(data.connected),
          provider: data.provider || 'local_storage',
          userCount: data.userCount,
          message: data.message || '',
        };
        localStorage.setItem(STORAGE_KEYS.DB_CACHE_STATUS, JSON.stringify(status));
        return status;
      }
    } catch (e) {
      // Offline or network error
    }

    return {
      connected: false,
      provider: 'local_storage',
      message: 'Đang sử dụng cơ sở dữ liệu lưu trữ cục bộ an toàn.',
    };
  }

  // 5. Register new user with Vercel Database + Local Storage fallback
  static async register(params: {
    username: string;
    password: string;
    displayName: string;
    email?: string;
    avatar?: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const cleanUsername = params.username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Tên đăng nhập phải từ 3 ký tự trở lên!' };
    }

    if (!params.password || params.password.length < 6) {
      return { success: false, message: 'Mật khẩu bảo mật phải từ 6 ký tự trở lên!' };
    }

    // Try cloud database registration via Vercel Serverless API first
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username: cleanUsername,
          password: params.password,
          displayName: params.displayName.trim() || params.username,
          email: params.email?.trim(),
          avatar: params.avatar || '🐉',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const userWithPass: UserProfile = { ...data.user, password: params.password };
          this.saveCurrentUser(userWithPass);
          return {
            success: true,
            message: data.message || 'Đăng ký thành công và đã lưu vào Vercel Database!',
            user: userWithPass,
          };
        } else if (!data.useLocalFallback && data.message) {
          // Cloud reported a definitive error (e.g. duplicate username in cloud DB)
          return { success: false, message: data.message };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.message) {
          return { success: false, message: errData.message };
        }
      }
    } catch (err) {
      console.warn('Vercel DB register failed, falling back to local DB:', err);
    }

    // Fallback: Check local duplicate
    const all = this.getAllUsers();
    if (all.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Tên tài khoản này đã tồn tại trong cơ sở dữ liệu. Vui lòng chọn tên khác!' };
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      username: cleanUsername,
      password: params.password,
      displayName: params.displayName.trim() || params.username,
      email: params.email?.trim() || `${cleanUsername}@longan.vn`,
      avatar: params.avatar || '🐉',
      level: 1,
      exp: 50,
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

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công! Thông tin đã được lưu an toàn.',
      user: newUser,
    };
  }

  // 6. Login with password verification against Vercel Database + Local Storage fallback
  static async login(
    usernameOrEmail: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const clean = usernameOrEmail.trim().toLowerCase();
    if (!clean) return { success: false, message: 'Vui lòng nhập tên tài khoản hoặc email!' };
    if (!password) return { success: false, message: 'Vui lòng nhập mật khẩu tài khoản!' };

    // 0. Secret Admin/Author login: 1 / 1
    if (clean === '1' && password === '1') {
      const adminUser: UserProfile = {
        id: 'admin_author_1',
        username: '1',
        password: '1',
        displayName: 'Tác Giả & Quản Trị Viên',
        email: 'tacgia@longan.vn',
        avatar: '👑',
        level: 99,
        exp: 999999,
        nextLevelExp: 999999,
        levelTitle: 'Đấng Sáng Tạo Tối Cao',
        streakDays: 999,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        isFollowing: true,
        bookmarkedChapterIds: [],
        readChapterIds: [],
        isAdmin: true,
      };
      this.saveCurrentUser(adminUser);

      // Background cloud sync
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username: '1', password: '1' }),
      }).catch(() => {});

      return {
        success: true,
        message: 'Đăng nhập Tác Giả thành công! Đang chuyển vào Hệ Thống Kiểm Soát Dữ Liệu.',
        user: adminUser,
      };
    }

    // Try cloud authentication via Vercel Serverless API first
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: clean,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const userWithPass: UserProfile = { ...data.user, password };
          this.saveCurrentUser(userWithPass);
          return {
            success: true,
            message: data.message || `Xác thực Vercel Database thành công! Chào mừng ${data.user.displayName} trở lại.`,
            user: userWithPass,
          };
        } else if (!data.useLocalFallback && data.message) {
          // Cloud reported invalid credentials
          return { success: false, message: data.message };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.message && response.status === 401) {
          return { success: false, message: errData.message };
        }
      }
    } catch (err) {
      console.warn('Vercel DB login attempt skipped, trying local accounts:', err);
    }

    // Fallback: Check local accounts
    const all = this.getAllUsers();
    const found = all.find(u => u.username.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean));

    if (!found) {
      return {
        success: false,
        message: 'Tài khoản không tồn tại trong cơ sở dữ liệu. Vui lòng kiểm tra lại hoặc đăng ký mới!',
      };
    }

    // Verify password
    if (found.password && found.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.' };
    }

    if (!found.password) {
      found.password = password;
    }

    this.saveCurrentUser(found);
    return {
      success: true,
      message: `Xác thực thành công! Chào mừng đạo hữu ${found.displayName} trở lại.`,
      user: found,
    };
  }

  // 7. Background synchronization to Vercel Database
  static syncCloudUser(user: UserProfile): void {
    if (!user) return;
    try {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', user }),
      }).catch(() => {
        // Silently catch background network sync issues
      });
    } catch (e) {
      // Ignored
    }
  }

  // 8. Guest quick login
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

  // 9. Logout
  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // 10. Award EXP
  static awardExp(amount: number, _reason: string): { user: UserProfile; leveledUp: boolean; diff: number } | null {
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

  // 11. Daily Check-In
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

  // 12. Toggle Follow Story
  static toggleFollowStory(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    user.isFollowing = !user.isFollowing;
    this.saveCurrentUser(user);
    return user.isFollowing;
  }

  // 13. Toggle Chapter Bookmark
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

  // 14. Mark Chapter As Read
  static markChapterAsRead(chapterId: string): void {
    const user = this.getCurrentUser();
    if (!user) return;

    if (!user.readChapterIds.includes(chapterId)) {
      user.readChapterIds.push(chapterId);
      this.awardExp(20, 'Đọc xong chương mới');
      this.saveCurrentUser(user);
    }
  }

  // 15. Reading History Management
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
    const filtered = history.filter(h => h.chapterId !== item.chapterId);

    const newEntry: ReadingHistoryItem = {
      ...item,
      id: `hist_${Date.now()}`,
      readAt: new Date().toISOString(),
    };

    filtered.unshift(newEntry);
    const trimmed = filtered.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.READING_HISTORY, JSON.stringify(trimmed));

    this.markChapterAsRead(item.chapterId);

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

  // 16. Saved Quotes
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

  // 17. Admin: Get all registered user accounts from MongoDB Atlas / local
  static async getAllUsersAdmin(): Promise<UserProfile[]> {
    try {
      const res = await fetch('/api/auth?action=get_all_users_admin');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          return data.users;
        }
      }
    } catch (e) {}
    return this.getAllUsers();
  }

  // 18. Admin: Delete user account from MongoDB Atlas & local
  static async deleteUserAdmin(userId: string, username: string): Promise<{ success: boolean; message: string }> {
    if (username === '1' || userId === 'admin_author_1') {
      return { success: false, message: 'Không thể xóa tài khoản Quản Trị Viên Tối Cao!' };
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', userId, username }),
      });
      const data = await res.json();
      
      // Also delete from local storage
      const all = this.getAllUsers();
      const filtered = all.filter(u => u.id !== userId && u.username !== username);
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(filtered));

      return { success: true, message: data.message || 'Đã xóa tài khoản thành công!' };
    } catch (err: any) {
      // Local fallback delete
      const all = this.getAllUsers();
      const filtered = all.filter(u => u.id !== userId && u.username !== username);
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(filtered));
      return { success: true, message: 'Đã xóa tài khoản khỏi bộ nhớ cục bộ.' };
    }
  }
}

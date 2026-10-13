import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trophy, 
  Crown, 
  Flame, 
  Sparkles, 
  User, 
  Calendar, 
  RefreshCw, 
  ShieldCheck,
  Zap,
  TrendingUp,
  Database
} from 'lucide-react';
import { UserProfile } from '../../types/user';

interface LeaderboardUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  exp: number;
  levelTitle: string;
  streakDays: number;
  joinedDate?: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'exp' | 'streak'>('exp');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth?action=get_leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.leaderboard)) {
          setUsers(data.leaderboard);
        } else {
          fallbackLocalUsers();
        }
      } else {
        fallbackLocalUsers();
      }
    } catch (err) {
      fallbackLocalUsers();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackLocalUsers = () => {
    try {
      const raw = localStorage.getItem('longanky_user_accounts');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUsers(parsed);
        return;
      }
    } catch (e) {}

    // Mock presets if empty
    setUsers([
      {
        id: 'u1',
        username: 'longthan_vuong',
        displayName: 'Long Thần Thượng Cổ',
        avatar: '🐉',
        level: 5,
        exp: 3200,
        levelTitle: 'Bất Diệt Long Vương',
        streakDays: 45,
      },
      {
        id: 'u2',
        username: 'huyennguyet_tien',
        displayName: 'Huyền Nguyệt Tiên Tử',
        avatar: '🌙',
        level: 4,
        exp: 1850,
        levelTitle: 'Long Hóa Đại Tôn',
        streakDays: 32,
      },
      {
        id: 'u3',
        username: 'kiem_vo_danh',
        displayName: 'Vô Danh Kiếm Khách',
        avatar: '⚔️',
        level: 3,
        exp: 890,
        levelTitle: 'Ngưng Ấn Chân Nhân',
        streakDays: 19,
      },
    ]);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sort based on active tab
  const sortedUsers = [...users].sort((a, b) => {
    if (activeTab === 'exp') return (b.exp || 0) - (a.exp || 0);
    return (b.streakDays || 1) - (a.streakDays || 1);
  });

  // Find current user's rank
  const myIndex = currentUser ? sortedUsers.findIndex(u => u.username === currentUser.username || u.id === currentUser.id) : -1;
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-amber-500/40 shadow-[-10px_10px_60px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-950/70 via-purple-950/60 to-slate-900 border-b border-amber-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/30">
              🏆
            </div>
            <div>
              <h3 className="font-serif font-black text-lg text-white flex items-center gap-2">
                <span>BẢNG PHONG THẦN ĐẠO HỮU</span>
                <span className="text-amber-400 text-xs">✦</span>
              </h3>
              <p className="text-xs text-amber-300/80 flex items-center gap-1.5 mt-0.5">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Xếp Hạng Thời Gian Thực • MongoDB Atlas</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={fetchLeaderboard}
              disabled={isLoading}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-black/40 shrink-0">
          <button
            onClick={() => setActiveTab('exp')}
            className={`flex-1 py-3 text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'exp'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Đẳng Cấp Tu Vi (EXP)</span>
          </button>

          <button
            onClick={() => setActiveTab('streak')}
            className={`flex-1 py-3 text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'streak'
                ? 'border-rose-400 text-rose-400 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Chuỗi Chuyên Cần (Streak)</span>
          </button>
        </div>

        {/* Top 3 Podium Cards */}
        {sortedUsers.length >= 3 && (
          <div className="p-4 bg-gradient-to-b from-amber-500/5 to-transparent border-b border-white/5 grid grid-cols-3 gap-2 shrink-0">
            {/* Rank 2 */}
            <div className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-sm relative pt-4">
              <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-slate-400 text-slate-950 font-black text-[10px] shadow">
                #2 🥈
              </span>
              <div className="text-2xl mb-1">{sortedUsers[1].avatar || '🌙'}</div>
              <div className="font-serif font-bold text-xs text-white truncate max-w-full">
                {sortedUsers[1].displayName}
              </div>
              <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                {activeTab === 'exp' ? `${sortedUsers[1].exp} EXP` : `${sortedUsers[1].streakDays} Ngày`}
              </div>
            </div>

            {/* Rank 1 (Champion) */}
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-900/90 border border-amber-400/60 shadow-lg shadow-amber-500/20 relative pt-5 scale-105 z-10">
              <span className="absolute -top-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-md flex items-center gap-1">
                <Crown className="w-3 h-3 fill-slate-950" />
                <span>#1 QUÁN QUÂN</span>
              </span>
              <div className="text-3xl mb-1">{sortedUsers[0].avatar || '🐉'}</div>
              <div className="font-serif font-black text-xs text-amber-200 truncate max-w-full">
                {sortedUsers[0].displayName}
              </div>
              <div className="text-[11px] text-amber-300 font-bold font-mono mt-0.5">
                {activeTab === 'exp' ? `${sortedUsers[0].exp} EXP` : `${sortedUsers[0].streakDays} Ngày`}
              </div>
              <span className="text-[9px] text-amber-400/90 font-serif mt-0.5">
                ✦ {sortedUsers[0].levelTitle}
              </span>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-slate-900/80 border border-amber-800/40 shadow-sm relative pt-4">
              <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-amber-700 text-white font-black text-[10px] shadow">
                #3 🥉
              </span>
              <div className="text-2xl mb-1">{sortedUsers[2].avatar || '⚔️'}</div>
              <div className="font-serif font-bold text-xs text-white truncate max-w-full">
                {sortedUsers[2].displayName}
              </div>
              <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                {activeTab === 'exp' ? `${sortedUsers[2].exp} EXP` : `${sortedUsers[2].streakDays} Ngày`}
              </div>
            </div>
          </div>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sortedUsers.slice(3).map((u, idx) => {
            const rank = idx + 4;
            const isMe = currentUser && (u.username === currentUser.username || u.id === currentUser.id);

            return (
              <div
                key={u.id || idx}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-amber-500/15 border-amber-400/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 hover:bg-slate-800/70 border-white/5'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="font-mono font-bold text-xs text-slate-400 w-6 text-center shrink-0">
                    #{rank}
                  </span>

                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-lg shrink-0 border border-white/10">
                    {u.avatar || '🐉'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-xs text-white truncate">
                        {u.displayName}
                      </h4>
                      {isMe && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 shrink-0">
                          BẠN
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-amber-300/80 font-serif truncate">
                      ✦ {u.levelTitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="font-mono font-bold text-xs text-amber-300">
                    {activeTab === 'exp' ? `${u.exp} EXP` : `${u.streakDays} Ngày`}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    Cấp {u.level}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pinned Current User Rank Footer */}
        {currentUser && (
          <div className="p-3.5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-t border-amber-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-sm shadow">
                {currentUser.avatar || '🐉'}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Hạng Của Bạn:</span>
                  <span className="text-amber-400 font-mono font-black text-sm">
                    {myRank ? `#${myRank}` : 'Chưa xếp hạng'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentUser.displayName} • Cấp {currentUser.level} ({currentUser.exp} EXP)
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>{currentUser.streakDays || 1} ngày liên tiếp</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Heart, Flame, Sparkles, MessageSquare, Send, User, Zap, Lock, Database } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { UserService } from '../../services/userService';

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
  chapterId: string;
  avatar?: string;
  level?: number;
  levelTitle?: string;
}

interface ChapterCommentsSectionProps {
  chapterId: string;
  chapterTitle: string;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onUserUpdated?: (user: UserProfile | null) => void;
}

export const ChapterCommentsSection: React.FC<ChapterCommentsSectionProps> = ({
  chapterId,
  chapterTitle,
  currentUser,
  onOpenAuthModal,
  onUserUpdated,
}) => {
  // Reactions state
  const [reactions, setReactions] = useState<{ love: number; dragon: number; fire: number; flower: number }>({
    love: 14,
    dragon: 28,
    fire: 19,
    flower: 22
  });
  const [userReacted, setUserReacted] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [commentToast, setCommentToast] = useState<string | null>(null);

  // Load from MongoDB Atlas + fallback localStorage
  useEffect(() => {
    // 1. Initial local load
    try {
      const storedReactions = localStorage.getItem(`longanky_reactions_${chapterId}`);
      if (storedReactions) {
        setReactions(JSON.parse(storedReactions));
      }
      const storedUserReacted = localStorage.getItem(`longanky_user_react_${chapterId}`);
      if (storedUserReacted) {
        setUserReacted(storedUserReacted);
      }
      const storedComments = localStorage.getItem(`longanky_comments_${chapterId}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        setComments([
          {
            id: 'c1',
            name: 'Độc giả Asera',
            text: 'Đoạn miêu tả tiếng nước dâng ở bến Arumo và chiếc tàu đến sớm đọc cuốn dã man, ngóng tiếp chương sau!',
            createdAt: 'Hôm qua lúc 21:14',
            chapterId,
            avatar: '🐉',
            level: 3,
            levelTitle: 'Ngưng Ấn Chân Nhân'
          },
          {
            id: 'c2',
            name: 'Ngọc Long',
            text: 'Không khí bến tàu đêm lạnh lẽo của Rento và Nari rất có chiều sâu huyền huyễn Á Đông!',
            createdAt: 'Hôm nay lúc 08:30',
            chapterId,
            avatar: '🌸',
            level: 2,
            levelTitle: 'Khởi Linh Sơ Kỳ'
          }
        ]);
      }

      if (currentUser) {
        setAuthorName(currentUser.displayName);
      } else {
        const savedName = localStorage.getItem('longanky_reader_name');
        if (savedName) setAuthorName(savedName);
      }
    } catch (e) {}

    // 2. Fetch live comments from MongoDB Atlas
    fetch(`/api/auth?action=get_comments&chapterId=${encodeURIComponent(chapterId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.comments) && data.comments.length > 0) {
          setComments(data.comments);
          localStorage.setItem(`longanky_comments_${chapterId}`, JSON.stringify(data.comments));
        }
      })
      .catch(() => {});

    // 3. Fetch live reactions from MongoDB Atlas
    fetch(`/api/auth?action=get_reactions&chapterId=${encodeURIComponent(chapterId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reactions) {
          setReactions(data.reactions);
        }
      })
      .catch(() => {});
  }, [chapterId, currentUser]);

  const handleReact = (type: 'love' | 'dragon' | 'fire' | 'flower') => {
    if (userReacted === type) return;
    const updated = { ...reactions, [type]: reactions[type] + 1 };
    setReactions(updated);
    setUserReacted(type);
    try {
      localStorage.setItem(`longanky_reactions_${chapterId}`, JSON.stringify(updated));
      localStorage.setItem(`longanky_user_react_${chapterId}`, type);
    } catch (e) {}

    // Post to MongoDB Atlas
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'post_reaction', chapterId, type }),
    }).catch(() => {});
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const finalName = currentUser?.displayName || authorName.trim() || 'Bạn Đọc Giấu Tên';
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      name: finalName,
      text: commentText.trim(),
      createdAt: 'Vừa xong',
      chapterId,
      avatar: currentUser?.avatar || '🐉',
      level: currentUser?.level || 1,
      levelTitle: currentUser?.levelTitle || 'Phàm Nhân Luyện Khí',
    };

    const nextComments = [newComment, ...comments];
    setComments(nextComments);
    setCommentText('');

    try {
      localStorage.setItem(`longanky_comments_${chapterId}`, JSON.stringify(nextComments));
      if (!currentUser) {
        localStorage.setItem('longanky_reader_name', finalName);
      }
    } catch (e) {}

    // Save to MongoDB Atlas
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'post_comment',
        chapterId,
        name: finalName,
        text: newComment.text,
        avatar: newComment.avatar,
        level: newComment.level,
        levelTitle: newComment.levelTitle,
        userId: currentUser?.id,
      }),
    }).catch(() => {});

    // Award EXP to logged-in user
    if (currentUser) {
      UserService.awardExp(15, 'Bình luận chương truyện');
      if (onUserUpdated) onUserUpdated(UserService.getCurrentUser());
      setCommentToast('✨ Đã gửi bình luận lên MongoDB Atlas (+15 Tu Vi)!');
    } else {
      setCommentToast('Đã gửi bình luận thành công!');
    }

    setTimeout(() => setCommentToast(null), 3000);
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12 pt-8 border-t border-indigo-500/20 space-y-8">
      {/* Toast alert */}
      {commentToast && (
        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold text-center animate-bounce">
          {commentToast}
        </div>
      )}

      {/* 1. Reader Reactions Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 text-center space-y-4 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-sm text-slate-100 flex items-center justify-center gap-1.5">
            <span>✨ Cảm Xúc Của Bạn Sau Khi Đọc Chương Này ✨</span>
          </h3>
          <p className="text-[11px] text-slate-400">Gửi năng lượng cổ vũ tác giả tiếp tục sáng tác</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => handleReact('love')}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              userReacted === 'love'
                ? 'bg-rose-500/25 border-rose-500/60 text-rose-300 ring-2 ring-rose-400/30 scale-105'
                : 'bg-white/5 hover:bg-rose-500/10 border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${userReacted === 'love' ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
            <span>Cảm động ({reactions.love})</span>
          </button>

          <button
            onClick={() => handleReact('dragon')}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              userReacted === 'dragon'
                ? 'bg-amber-500/25 border-amber-500/60 text-amber-300 ring-2 ring-amber-400/30 scale-105'
                : 'bg-white/5 hover:bg-amber-500/10 border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-200'
            }`}
          >
            <span>🐉</span>
            <span>Hóng chương sau ({reactions.dragon})</span>
          </button>

          <button
            onClick={() => handleReact('fire')}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              userReacted === 'fire'
                ? 'bg-orange-500/25 border-orange-500/60 text-orange-300 ring-2 ring-orange-400/30 scale-105'
                : 'bg-white/5 hover:bg-orange-500/10 border-white/10 hover:border-orange-500/30 text-slate-300 hover:text-orange-200'
            }`}
          >
            <Flame className={`w-4 h-4 ${userReacted === 'fire' ? 'fill-orange-400 text-orange-400' : 'text-orange-400'}`} />
            <span>Cuốn hút ({reactions.fire})</span>
          </button>

          <button
            onClick={() => handleReact('flower')}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              userReacted === 'flower'
                ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-400/30 scale-105'
                : 'bg-white/5 hover:bg-emerald-500/10 border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-200'
            }`}
          >
            <span>🌸</span>
            <span>Tặng hoa ({reactions.flower})</span>
          </button>
        </div>
      </div>

      {/* 2. Comments Thread Container */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="font-serif font-bold text-base text-slate-100">
              Đàm Đạo &amp; Bình Luận ({comments.length})
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>MongoDB Atlas Cloud Sync</span>
          </div>
        </div>

        {/* Form Write Comment */}
        <form onSubmit={handlePostComment} className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-sm shadow">
                {currentUser?.avatar || '🐉'}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {currentUser ? currentUser.displayName : (authorName || 'Độc giả chưa đăng nhập')}
                </div>
                {currentUser ? (
                  <div className="text-[10px] text-amber-300 font-serif">
                    ✦ {currentUser.levelTitle} (Cấp {currentUser.level})
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400">
                    Khách vãng lai
                  </div>
                )}
              </div>
            </div>

            {!currentUser && onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                <span>Đăng nhập để nhận Tu Vi (+15 EXP)</span>
              </button>
            )}
          </div>

          {!currentUser && (
            <div>
              <input
                type="text"
                placeholder="Nhập tên của bạn khi bình luận..."
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-400"
              />
            </div>
          )}

          <div>
            <textarea
              rows={3}
              required
              placeholder="Chia sẻ cảm nghĩ, dự đoán tình tiết hoặc gửi lời nhắn đến tác giả..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-400 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi Bình Luận</span>
            </button>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-3.5">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-sm border border-white/10">
                    {c.avatar || '🐉'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-xs text-slate-200">
                        {c.name}
                      </span>
                      {c.level && (
                        <span className="text-[9px] font-mono font-bold px-1 rounded bg-rose-600/80 text-white">
                          Lv.{c.level}
                        </span>
                      )}
                    </div>
                    {c.levelTitle && (
                      <span className="text-[9px] text-amber-300 font-serif">
                        ✦ {c.levelTitle}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {c.createdAt.includes('T') ? new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : c.createdAt}
                </span>
              </div>

              <p className="text-xs text-slate-300 pl-9 leading-relaxed">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

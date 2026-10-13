import React, { useState, useEffect } from 'react';
import { Heart, Flame, Sparkles, MessageSquare, Send, User } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
  chapterId: string;
}

interface ChapterCommentsSectionProps {
  chapterId: string;
  chapterTitle: string;
}

export const ChapterCommentsSection: React.FC<ChapterCommentsSectionProps> = ({
  chapterId,
  chapterTitle
}) => {
  // Reactions state
  const [reactions, setReactions] = useState<{ love: number; dragon: number; fire: number; flower: number }>({
    love: 12,
    dragon: 24,
    fire: 18,
    flower: 15
  });
  const [userReacted, setUserReacted] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load from localStorage for this chapter
  useEffect(() => {
    try {
      const storedReactions = localStorage.getItem(`longanky_reactions_${chapterId}`);
      if (storedReactions) {
        setReactions(JSON.parse(storedReactions));
      } else {
        // default seed
        setReactions({ love: 14, dragon: 28, fire: 19, flower: 22 });
      }

      const storedUserReacted = localStorage.getItem(`longanky_user_react_${chapterId}`);
      if (storedUserReacted) {
        setUserReacted(storedUserReacted);
      }

      const storedComments = localStorage.getItem(`longanky_comments_${chapterId}`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        // default starter thoughts for immersion
        setComments([
          {
            id: 'c1',
            name: 'Độc giả Asera',
            text: 'Đoạn miêu tả tiếng nước dâng ở bến Arumo và chiếc tàu đến sớm đọc cuốn dã man, ngóng tiếp chương sau!',
            createdAt: 'Hôm qua lúc 21:14',
            chapterId
          },
          {
            id: 'c2',
            name: 'Ngọc Long',
            text: 'Không khí bến tàu đêm lạnh lẽo của Rento và Nari rất có chiều sâu huyền huyễn Á Đông!',
            createdAt: 'Hôm nay lúc 08:30',
            chapterId
          }
        ]);
      }

      const savedName = localStorage.getItem('longanky_reader_name');
      if (savedName) setAuthorName(savedName);
    } catch (e) {}
  }, [chapterId]);

  const handleReact = (type: 'love' | 'dragon' | 'fire' | 'flower') => {
    if (userReacted === type) return;
    const updated = { ...reactions, [type]: reactions[type] + 1 };
    setReactions(updated);
    setUserReacted(type);
    try {
      localStorage.setItem(`longanky_reactions_${chapterId}`, JSON.stringify(updated));
      localStorage.setItem(`longanky_user_react_${chapterId}`, type);
    } catch (e) {}
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const finalName = authorName.trim() || 'Bạn Đọc Giấu Tên';
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      name: finalName,
      text: commentText.trim(),
      createdAt: 'Vừa xong',
      chapterId
    };

    const nextComments = [newComment, ...comments];
    setComments(nextComments);
    setCommentText('');

    try {
      localStorage.setItem(`longanky_comments_${chapterId}`, JSON.stringify(nextComments));
      localStorage.setItem('longanky_reader_name', finalName);
    } catch (e) {}

    setIsSubmitting(false);
  };

  return (
    <div className="mt-12 pt-8 border-t border-indigo-500/20 space-y-8">
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
            <span>Đỉnh cao ({reactions.fire})</span>
          </button>

          <button
            onClick={() => handleReact('flower')}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              userReacted === 'flower'
                ? 'bg-pink-500/25 border-pink-500/60 text-pink-300 ring-2 ring-pink-400/30 scale-105'
                : 'bg-white/5 hover:bg-pink-500/10 border-white/10 hover:border-pink-500/30 text-slate-300 hover:text-pink-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Thơ mộng ({reactions.flower})</span>
          </button>
        </div>
      </div>

      {/* 2. Reader Comments / Discussion Box */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif font-bold text-sm text-slate-100">
              Góc Bình Luận &amp; Cảm Nghĩ ({comments.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 italic">Thảo luận cùng cộng đồng đọc Long Ấn</span>
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handlePostComment} className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 text-xs font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Biệt danh của bạn (ví dụ: Bé Mèo Đọc Sách)"
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            rows={3}
            placeholder={`Chia sẻ suy nghĩ của bạn về ${chapterTitle}...`}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-400 leading-relaxed font-serif"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-pink-500/20 disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Gửi Bình Luận</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-2.5">
          {comments.map(c => (
            <div 
              key={c.id}
              className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-white/15 flex items-center justify-center text-[10px] font-bold text-amber-300 font-serif">
                    {c.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="font-serif font-bold text-xs text-slate-200">{c.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/15 text-pink-300 font-mono">Độc giả</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{c.createdAt}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8 font-serif">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

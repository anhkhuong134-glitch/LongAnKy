import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, BookOpen, Clock, Eye, Heart, Sparkles, CheckCircle2,
  Share2, ArrowLeft, ChevronRight, Tag, Bookmark, ShieldCheck,
  TrendingUp, Award, ExternalLink, HelpCircle, ChevronDown, Check,
  SlidersHorizontal, Compass, MessageSquare
} from 'lucide-react';
import { SeoArticle, SEO_CATEGORIES } from '../../data/seoArticlesData';
import { SeoArticleService } from '../../services/seoArticleService';

interface SeoArticlesPageProps {
  articleSlug?: string | null;
  onNavigate: (path: string) => void;
}

export const SeoArticlesPage: React.FC<SeoArticlesPageProps> = ({
  articleSlug,
  onNavigate,
}) => {
  // State
  const [articles, setArticles] = useState<SeoArticle[]>(() => SeoArticleService.getAllArticles());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Active article if in detail mode
  const currentArticle = useMemo(() => {
    if (!articleSlug) return null;
    return SeoArticleService.getArticleBySlug(articleSlug);
  }, [articleSlug, articles]);

  // Sync articles when event fires
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail) setArticles(e.detail);
      else setArticles(SeoArticleService.getAllArticles());
    };
    window.addEventListener('seo-articles-updated', handleUpdate);
    return () => window.removeEventListener('seo-articles-updated', handleUpdate);
  }, []);

  // Track view & update Dynamic SEO tags
  useEffect(() => {
    if (currentArticle) {
      SeoArticleService.incrementView(currentArticle.slug);

      // Technical SEO Head updates
      SeoArticleService.updateSeoHeadTags({
        title: currentArticle.metaTitle || `${currentArticle.title} | Long Ấn Hub`,
        description: currentArticle.metaDescription || currentArticle.summary,
        keywords: [currentArticle.targetKeyword, ...currentArticle.secondaryKeywords, ...currentArticle.tags],
        ogImage: currentArticle.coverImage,
        schemaData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': currentArticle.title,
          'description': currentArticle.summary,
          'image': currentArticle.coverImage,
          'author': {
            '@type': 'Person',
            'name': currentArticle.author.name,
            'jobTitle': currentArticle.author.role
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Long Ấn Thức Tỉnh — Arumo Hub',
            'logo': {
              '@type': 'ImageObject',
              'url': window.location.origin + '/art/ui/river-mark.svg'
            }
          },
          'datePublished': currentArticle.publishedAt,
          'dateModified': currentArticle.updatedAt,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': window.location.href
          }
        }
      });
    } else {
      // General SEO Hub Head
      SeoArticleService.updateSeoHeadTags({
        title: 'Cẩm Nang SEO & Sáng Tác 2026 — AIKTP, Kỹ Thuật Viết & Tối Ưu Google | Long Ấn Hub',
        description: 'Chuyên trang cẩm nang bài viết chuẩn SEO thế hệ mới: Hướng dẫn sử dụng AIKTP, bí kíp viết tiểu thuyết kỳ ảo bằng AI, chiến lược SEO On-Page và kiếm tiền từ sáng tác online.',
        keywords: ['AIKTP', 'SEO 2026', 'viết tiểu thuyết bằng AI', 'hướng dẫn SEO Onpage', 'kiếm tiền viết truyện', 'Long Ấn Ký'],
        schemaData: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': 'Cẩm Nang SEO & Sáng Tác 2026 — Long Ấn Hub',
          'description': 'Kho bài viết chuyên sâu về SEO, AI Content và kỹ thuật sáng tác văn học kỳ ảo Á Đông.'
        }
      });
    }

    return () => {
      // Reset title when unmounting or leaving
      document.title = 'Long Ấn Thức Tỉnh — Cổng Đọc Tiểu Thuyết & Sáng Tác';
    };
  }, [currentArticle]);

  // Reading progress scroll tracker for article detail
  useEffect(() => {
    if (!currentArticle) return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentArticle]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.targetKeyword.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Featured article (first featured or first item)
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  // Table of Contents generator
  const tableOfContents = useMemo(() => {
    if (!currentArticle) return [];
    const lines = currentArticle.content.split('\n');
    const toc: Array<{ level: number; text: string; id: string }> = [];
    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim();
        const id = text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        toc.push({ level: 2, text, id });
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim();
        const id = text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        toc.push({ level: 3, text, id });
      }
    });
    return toc;
  }, [currentArticle]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleToggleLike = (id: string) => {
    SeoArticleService.toggleLike(id);
    setArticles(SeoArticleService.getAllArticles());
  };

  // =========================================================================
  // VIEW MODE 1: ARTICLE DETAIL READER VIEW
  // =========================================================================
  if (currentArticle) {
    const isLiked = SeoArticleService.isArticleLiked(currentArticle.id);
    const relatedArticles = articles
      .filter((a) => a.id !== currentArticle.id && (a.category === currentArticle.category || a.isFeatured))
      .slice(0, 3);

    return (
      <div className="py-8 md:py-12 max-w-[1020px] mx-auto space-y-10">
        {/* Top Reading Progress Bar */}
        <div
          className="fixed top-0 left-0 h-1 bg-[#376F64] z-50 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />

        {/* 1. Breadcrumb navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#5F706A] flex-wrap">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#376F64] transition-colors"
          >
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A3B2AC]" />
          <button
            onClick={() => onNavigate('/bai-viet')}
            className="hover:text-[#376F64] transition-colors"
          >
            Cẩm nang SEO & Sáng tác
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#A3B2AC]" />
          <span className="text-[#376F64] font-semibold">{currentArticle.categoryName}</span>
        </nav>

        {/* 2. Article Header */}
        <header className="space-y-5 border-b border-[#DCE6DF] pb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E4F1E9] text-[#376F64] uppercase tracking-wider">
              {currentArticle.categoryName}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>SEO Score: {currentArticle.seoScore}/100 (AIKTP Standard)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#293B36] tracking-tight leading-[1.25]">
            {currentArticle.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5F706A] leading-relaxed font-medium">
            {currentArticle.summary}
          </p>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#5F706A]">
            {/* Author info */}
            <div className="flex items-center gap-3">
              <img
                src={currentArticle.author.avatar}
                alt={currentArticle.author.name}
                className="w-10 h-10 rounded-full object-cover border border-[#DCE6DF] shadow-xs"
              />
              <div>
                <div className="flex items-center gap-1 font-bold text-[#293B36]">
                  <span>{currentArticle.author.name}</span>
                  {currentArticle.author.verified && (
                    <span title="Tác giả được xác thực">
                      <ShieldCheck className="w-4 h-4 text-[#376F64]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5F706A]">{currentArticle.author.role}</p>
              </div>
            </div>

            {/* Read Stats */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#376F64]" />
                {currentArticle.readTimeMinutes} phút đọc
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#376F64]" />
                {currentArticle.views.toLocaleString()} lượt xem
              </span>
              <span className="text-[#A3B2AC]">•</span>
              <span>Cập nhật: {currentArticle.updatedAt}</span>
            </div>
          </div>
        </header>

        {/* 3. Cover Image */}
        <div className="relative rounded-2xl overflow-hidden border border-[#DCE6DF] shadow-sm max-h-[460px]">
          <img
            src={currentArticle.coverImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover max-h-[460px]"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium">
            Từ khóa mục tiêu: <span className="font-bold text-emerald-300">"{currentArticle.targetKeyword}"</span>
          </div>
        </div>

        {/* 4. Key Takeaways Box (Điểm cốt lõi) */}
        {currentArticle.keyTakeaways && currentArticle.keyTakeaways.length > 0 && (
          <div className="bg-[#E4F1E9]/70 border border-[#C8DFD3] rounded-2xl p-6 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-[#293B36] text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#376F64]" />
              <span>Điểm Cốt Lõi Bạn Sẽ Học Được (Key Takeaways)</span>
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-[#293B36]">
              {currentArticle.keyTakeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#376F64] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. Main Content Layout (Table of Contents + Article Body) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Sticky: Table of Contents */}
          {tableOfContents.length > 0 && (
            <aside className="lg:col-span-4 bg-white border border-[#DCE6DF] rounded-2xl p-5 lg:sticky lg:top-24 shadow-xs space-y-3">
              <h4 className="font-extrabold text-xs text-[#293B36] uppercase tracking-wider flex items-center gap-2 border-b border-[#DCE6DF] pb-2">
                <BookOpen className="w-4 h-4 text-[#376F64]" />
                <span>Mục Lục Bài Viết</span>
              </h4>
              <nav className="space-y-1.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
                {tableOfContents.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block py-1 hover:text-[#376F64] transition-colors leading-snug ${
                      item.level === 3 ? 'pl-4 text-[#5F706A]' : 'font-bold text-[#293B36]'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>

              <div className="pt-3 border-t border-[#DCE6DF] flex items-center justify-between text-xs text-[#5F706A]">
                <span>Chia sẻ bài viết:</span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 text-[#376F64] font-bold hover:underline"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Đã sao chép link!' : 'Copy Link'}</span>
                </button>
              </div>
            </aside>
          )}

          {/* Right: Article Body */}
          <article className={`${tableOfContents.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} prose-arumo space-y-6 text-[#293B36]`}>
            {/* Render article markdown formatted */}
            {currentArticle.content.split('\n\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();

              // Heading 2
              if (trimmed.startsWith('## ')) {
                const titleText = trimmed.replace('## ', '');
                const id = titleText
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-+|-+$/g, '');
                return (
                  <h2
                    key={index}
                    id={id}
                    className="text-xl sm:text-2xl font-extrabold text-[#293B36] pt-6 pb-2 border-b border-[#DCE6DF] scroll-mt-24 tracking-tight"
                  >
                    {titleText}
                  </h2>
                );
              }

              // Heading 3
              if (trimmed.startsWith('### ')) {
                const subText = trimmed.replace('### ', '');
                const id = subText
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-+|-+$/g, '');
                return (
                  <h3
                    key={index}
                    id={id}
                    className="text-lg sm:text-xl font-bold text-[#376F64] pt-4 scroll-mt-24"
                  >
                    {subText}
                  </h3>
                );
              }

              // Table
              if (trimmed.includes('|') && trimmed.split('\n').length > 1) {
                const rows = trimmed.split('\n').filter(Boolean);
                const headerRow = rows[0].split('|').map((c) => c.trim()).filter(Boolean);
                const dataRows = rows.slice(2);
                return (
                  <div key={index} className="overflow-x-auto my-6 border border-[#DCE6DF] rounded-xl shadow-xs">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <thead className="bg-[#E4F1E9] text-[#293B36] font-bold border-b border-[#DCE6DF]">
                        <tr>
                          {headerRow.map((h, i) => (
                            <th key={i} className="p-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE6DF]">
                        {dataRows.map((r, ri) => {
                          const cells = r.split('|').map((c) => c.trim()).filter(Boolean);
                          return (
                            <tr key={ri} className="hover:bg-[#FFFDF8] bg-white transition-colors">
                              {cells.map((cell, ci) => (
                                <td key={ci} className="p-3 text-[#293B36] leading-relaxed">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // Code block
              if (trimmed.startsWith('```')) {
                const cleanCode = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
                return (
                  <div key={index} className="my-5 bg-[#1F2926] text-[#E4F1E9] p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-sm">
                    <pre className="whitespace-pre-wrap">{cleanCode}</pre>
                  </div>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const items = trimmed.split('\n');
                return (
                  <ul key={index} className="space-y-2 my-4 pl-4 text-sm sm:text-base text-[#293B36]">
                    {items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#376F64] mt-2 shrink-0"></span>
                        <span className="leading-relaxed">{item.replace(/^[-*]\s+/, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              // Numbered list
              if (/^[0-9]+\.\s/.test(trimmed)) {
                const items = trimmed.split('\n');
                return (
                  <ol key={index} className="space-y-2 my-4 pl-4 text-sm sm:text-base text-[#293B36]">
                    {items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2">
                        <span className="font-bold text-[#376F64] shrink-0">{ii + 1}.</span>
                        <span className="leading-relaxed">{item.replace(/^[0-9]+\.\s+/, '')}</span>
                      </li>
                    ))}
                  </ol>
                );
              }

              // Normal paragraph with rich styling
              return (
                <p
                  key={index}
                  className="text-base sm:text-[17px] leading-[1.8] text-[#293B36] font-normal"
                >
                  {trimmed}
                </p>
              );
            })}
          </article>
        </div>

        {/* 6. FAQ Section (Accordion) */}
        {currentArticle.faqs && currentArticle.faqs.length > 0 && (
          <section className="bg-white border border-[#DCE6DF] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#376F64] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Giải Đáp Thắc Mắc Chuẩn Schema FAQ</span>
              </span>
              <h3 className="text-xl font-extrabold text-[#293B36]">
                Câu Hỏi Thường Gặp Về {currentArticle.targetKeyword}
              </h3>
            </div>

            <div className="divide-y divide-[#DCE6DF]">
              {currentArticle.faqs.map((faq, i) => {
                const isOpen = activeFaqIndex === i;
                return (
                  <div key={i} className="py-4">
                    <button
                      onClick={() => setActiveFaqIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#293B36] hover:text-[#376F64] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#5F706A] transition-transform ${
                          isOpen ? 'rotate-180 text-[#376F64]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-[#5F706A] leading-relaxed bg-[#FFFDF8] p-4 rounded-xl border border-[#DCE6DF]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. Tags & Reader Interaction Card */}
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#5F706A] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Chủ đề:</span>
            </span>
            {currentArticle.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[#E4F1E9] text-[#376F64] text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleLike(currentArticle.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                  : 'bg-white border border-[#DCE6DF] text-[#5F706A] hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
              <span>{isLiked ? 'Đã thích' : 'Hữu ích'} ({currentArticle.likes})</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#376F64] text-white hover:bg-[#2B5A51] transition-all shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Đã copy link!' : 'Chia sẻ bài'}</span>
            </button>
          </div>
        </div>

        {/* 8. Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-[#DCE6DF]">
            <h3 className="text-xl font-extrabold text-[#293B36] tracking-tight">
              Bài Viết Cùng Chủ Đề Nên Đọc Tiếp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`/bai-viet/${rel.slug}`)}
                  className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[11px] font-bold text-[#376F64]">
                      {rel.categoryName}
                    </span>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#293B36] group-hover:text-[#376F64] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-[#5F706A] line-clamp-2 mt-1.5">
                        {rel.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#5F706A] pt-3 border-t border-[#DCE6DF]">
                      <span>{rel.readTimeMinutes} phút đọc</span>
                      <span className="font-bold text-[#376F64] flex items-center gap-1">
                        Xem ngay <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back to list CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('/bai-viet')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang danh mục Cẩm nang SEO & Bài viết</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: ARTICLES HUB DIRECTORY VIEW
  // =========================================================================
  return (
    <div className="py-8 md:py-14 space-y-12">
      {/* 1. Hero Header Banner */}
      <section className="text-center max-w-[800px] mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4F1E9] text-[#376F64] text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hub Cẩm Nang SEO & Sáng Tác 2026</span>
          <span className="w-1 h-1 rounded-full bg-[#376F64]"></span>
          <span>Chuẩn AIKTP & E-E-A-T</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#293B36] tracking-tight leading-[1.15]">
          Kiến Thức SEO, Tự Động Hóa AI & Nghệ Thuật Sáng Tác Triệu View
        </h1>

        <p className="text-sm sm:text-base text-[#5F706A] leading-relaxed max-w-[680px] mx-auto">
          Bộ sưu tập bài viết chuyên sâu về công cụ AIKTP, kỹ thuật viết bài chuẩn SEO On-Page, bí kíp xây dựng thế giới kỳ ảo Á Đông và lộ trình kiếm tiền bền vững từ xuất bản số.
        </p>

        {/* Live Search Bar */}
        <div className="pt-3 max-w-[560px] mx-auto relative">
          <Search className="w-5 h-5 text-[#5F706A] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo từ khóa (AIKTP, SEO Onpage, viết truyện bằng AI, worldbuilding...)"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#DCE6DF] text-sm text-[#293B36] placeholder-[#5F706A]/60 shadow-sm focus:outline-hidden focus:border-[#376F64] focus:ring-2 focus:ring-[#376F64]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5F706A] hover:text-[#293B36]"
            >
              Xóa
            </button>
          )}
        </div>
      </section>

      {/* 2. Category Filter Chips */}
      <section className="flex items-center justify-center gap-2 flex-wrap">
        {SEO_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all'
            ? articles.length
            : articles.filter((a) => a.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#376F64] text-white shadow-md'
                  : 'bg-white border border-[#DCE6DF] text-[#5F706A] hover:bg-[#F2F8F5] hover:text-[#376F64]'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#5F706A]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </section>

      {/* 3. Featured Pillar Article Banner (Only on "All" tab when no search query) */}
      {selectedCategory === 'all' && !searchQuery && featuredArticle && (
        <section
          onClick={() => onNavigate(`/bai-viet/${featuredArticle.slug}`)}
          className="bg-white border border-[#DCE6DF] rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Left: Article Image */}
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-gray-100">
            <img
              src={featuredArticle.coverImage}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#376F64] text-white text-xs font-extrabold shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>BÀI VIẾT TÂM ĐIỂM</span>
            </div>
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs">
              SEO Score: <span className="font-bold text-emerald-400">{featuredArticle.seoScore}/100</span>
            </div>
          </div>

          {/* Right: Content details */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#5F706A]">
                <span className="font-bold text-[#376F64]">{featuredArticle.categoryName}</span>
                <span>•</span>
                <span>{featuredArticle.readTimeMinutes} phút đọc</span>
                <span>•</span>
                <span>{featuredArticle.views.toLocaleString()} lượt xem</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#293B36] group-hover:text-[#376F64] transition-colors leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#5F706A] leading-relaxed line-clamp-3">
                {featuredArticle.summary}
              </p>

              {/* Takeaways snippet */}
              <div className="space-y-1.5 pt-2">
                {featuredArticle.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#293B36]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#376F64] shrink-0" />
                    <span className="truncate">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCE6DF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={featuredArticle.author.avatar}
                  alt={featuredArticle.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-[#293B36]">{featuredArticle.author.name}</span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#376F64] group-hover:translate-x-1 transition-transform">
                <span>Đọc toàn bài</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 4. Articles Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#293B36] tracking-tight">
            {selectedCategory === 'all'
              ? 'Tất Cả Bài Viết Hướng Dẫn & Phân Tích'
              : `Danh Mục: ${SEO_CATEGORIES.find((c) => c.id === selectedCategory)?.name}`}
          </h2>
          <span className="text-xs text-[#5F706A]">
            Tìm thấy {filteredArticles.length} bài viết
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white border border-[#DCE6DF] rounded-2xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#5F706A] mx-auto opacity-40" />
            <h3 className="font-bold text-base text-[#293B36]">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-xs text-[#5F706A] max-w-sm mx-auto">
              Hãy thử tìm kiếm với từ khóa khác như "AIKTP", "SEO", "tiểu thuyết" hoặc chọn danh mục khác.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E4F1E9] text-[#376F64]"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onNavigate(`/bai-viet/${article.slug}`)}
                className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Cover */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-[11px] font-bold text-[#376F64] shadow-xs">
                      {article.categoryName}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                      Score: {article.seoScore}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-[#5F706A]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#376F64]" />
                        {article.readTimeMinutes} phút đọc
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#376F64]" />
                        {article.views.toLocaleString()} lượt xem
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#293B36] group-hover:text-[#376F64] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#5F706A] line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>

                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#F2F8F5] text-[#376F64] text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 pt-3 border-t border-[#DCE6DF] flex items-center justify-between text-xs text-[#5F706A]">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="truncate max-w-[130px] font-semibold text-[#293B36]">
                      {article.author.name}
                    </span>
                  </div>

                  <span className="font-bold text-[#376F64] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Đọc <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. AIKTP Pro Tips & SEO Callout Banner */}
      <section className="bg-gradient-to-br from-[#376F64] to-[#2B5A51] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-[700px] space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>AIKTP SEO Engine Blueprint 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bạn Muốn Tự Động Hóa 100% Quy Trình Viết Bài Lên Top Google?
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Kết hợp sức mạnh phân tích từ khóa và dựng outline tự động của AIKTP với khả năng trau chuốt ngôn từ của Gemini & Claude. Tạo ra những bài viết dài 2.500 từ chuẩn E-E-A-T chỉ sau vài cú nhấp chuột.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/bai-viet/huong-dan-viet-content-chuan-seo-aiktp-gemini')}
              className="px-6 py-3 rounded-xl font-bold bg-white text-[#2B5A51] hover:bg-emerald-50 transition-all text-xs shadow-md"
            >
              Xem cẩm nang AIKTP chi tiết
            </button>
            <button
              onClick={() => onNavigate('/game')}
              className="px-5 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-xs"
            >
              Khám phá Game Soul Seal Lore
            </button>
          </div>
        </div>

        {/* Ambient watermark */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
          <Sparkles className="w-96 h-96" />
        </div>
      </section>
    </div>
  );
};

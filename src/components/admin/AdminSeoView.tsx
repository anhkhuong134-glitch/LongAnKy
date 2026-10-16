import React, { useState, useMemo } from 'react';
import {
  Sparkles, BookOpen, Plus, Search, Edit3, Trash2, Eye,
  CheckCircle2, AlertCircle, RefreshCw, Award, Globe,
  Sliders, ArrowUpRight, Copy, Save, X, ExternalLink, HelpCircle
} from 'lucide-react';
import { SeoArticle, SEO_CATEGORIES } from '../../data/seoArticlesData';
import { SeoArticleService } from '../../services/seoArticleService';

interface AdminSeoViewProps {
  onNavigate: (path: string) => void;
}

export const AdminSeoView: React.FC<AdminSeoViewProps> = ({ onNavigate }) => {
  // State
  const [articles, setArticles] = useState<SeoArticle[]>(() => SeoArticleService.getAllArticles());
  const [activeTab, setActiveTab] = useState<'list' | 'aiktp-generator' | 'editor'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // AIKTP Generator State
  const [genKeyword, setGenKeyword] = useState('');
  const [genCategory, setGenCategory] = useState<SeoArticle['category']>('ai-content');
  const [genTone, setGenTone] = useState<'chuyen-gia' | 'than-thien' | 'kich-thich'>('chuyen-gia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState<string>('');
  const [generatedDraft, setGeneratedDraft] = useState<SeoArticle | null>(null);

  // Editor State
  const [editingArticle, setEditingArticle] = useState<SeoArticle | null>(null);
  const [editorToast, setEditorToast] = useState<string | null>(null);
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Stats
  const stats = useMemo(() => {
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const avgScore = articles.length > 0
      ? (articles.reduce((sum, a) => sum + (a.seoScore || 90), 0) / articles.length).toFixed(1)
      : '0';
    return {
      total: articles.length,
      avgScore,
      totalViews,
      topKeyword: articles[0]?.targetKeyword || 'AIKTP'
    };
  }, [articles]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.targetKeyword.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [articles, selectedCategory, searchQuery]);

  // SEO Score calculation for current editing article
  const currentAnalysis = useMemo(() => {
    if (!editingArticle) return null;
    return SeoArticleService.calculateSeoScore({
      title: editingArticle.title,
      metaTitle: editingArticle.metaTitle,
      metaDescription: editingArticle.metaDescription,
      targetKeyword: editingArticle.targetKeyword,
      content: editingArticle.content,
    });
  }, [editingArticle]);

  // Handle AIKTP One-Click Generation
  const handleRunAiktpGeneration = () => {
    if (!genKeyword.trim()) return;
    setIsGenerating(true);
    setGeneratedDraft(null);

    // Simulated multi-step AI generation
    setGenStep('Đang phân tích Google SERP & ý định tìm kiếm...');
    setTimeout(() => {
      setGenStep('Đang dựng cấu trúc dàn ý chuẩn Semantic SEO E-E-A-T...');
      setTimeout(() => {
        setGenStep('Đang sinh bài viết chuyên sâu 2.000+ từ với bảng biểu và FAQ...');
        setTimeout(() => {
          const article = SeoArticleService.generateAiktpArticle({
            targetKeyword: genKeyword,
            category: genCategory,
            tone: genTone,
            length: 'deep'
          });
          setGeneratedDraft(article);
          setIsGenerating(false);
          setGenStep('');
        }, 1200);
      }, 1000);
    }, 1000);
  };

  // Save generated draft
  const handleSaveGeneratedDraft = () => {
    if (!generatedDraft) return;
    SeoArticleService.saveArticle(generatedDraft);
    const updated = SeoArticleService.getAllArticles();
    setArticles(updated);
    setGeneratedDraft(null);
    setGenKeyword('');
    setActiveTab('list');
  };

  // Start editing existing article
  const handleStartEdit = (article: SeoArticle) => {
    setEditingArticle({ ...article });
    setActiveTab('editor');
  };

  // Start creating new manual article
  const handleCreateNewManual = () => {
    const newArt: SeoArticle = {
      id: `seo_art_${Date.now()}`,
      slug: `bai-viet-moi-${Date.now()}`,
      title: 'Tiêu đề bài viết SEO mới',
      metaTitle: 'Tiêu đề Meta SEO 2026 | Long Ấn Hub',
      metaDescription: 'Mô tả tóm tắt chuẩn SEO chứa từ khóa mục tiêu với độ dài lý tưởng từ 140 đến 160 ký tự.',
      targetKeyword: 'từ khóa mục tiêu',
      secondaryKeywords: ['từ khóa phụ 1', 'từ khóa phụ 2'],
      category: 'seo-onpage',
      categoryName: 'Chiến Lược SEO 2026',
      summary: 'Tóm tắt bài viết giới thiệu giải pháp ngắn gọn và hấp dẫn.',
      keyTakeaways: ['Điểm nổi bật số một', 'Điểm nổi bật số hai', 'Điểm nổi bật số ba'],
      content: `## 1. Giới Thiệu Chủ Đề\n\nNội dung đoạn mở đầu giới thiệu vấn đề và nêu bật từ khóa chính.\n\n## 2. Các Bước Thực Hiện Chi Tiết\n\n- Bước 1: Khảo sát nhu cầu\n- Bước 2: Triển khai kỹ thuật\n- Bước 3: Đánh giá kết quả`,
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Ban Biên Tập Long Ấn',
        role: 'Chuyên gia Chiến Lược Nội Dung',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      readTimeMinutes: 5,
      views: 0,
      likes: 0,
      seoScore: 90,
      tags: ['SEO', 'Chiến lược'],
      faqs: [
        {
          question: 'Câu hỏi phổ biến thường gặp?',
          answer: 'Câu trả lời ngắn gọn, súc tích chuẩn Schema FAQ.'
        }
      ]
    };
    setEditingArticle(newArt);
    setActiveTab('editor');
  };

  // Save current editing article
  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    // Recalculate SEO score before saving
    const analysis = SeoArticleService.calculateSeoScore({
      title: editingArticle.title,
      metaTitle: editingArticle.metaTitle,
      metaDescription: editingArticle.metaDescription,
      targetKeyword: editingArticle.targetKeyword,
      content: editingArticle.content,
    });

    const toSave: SeoArticle = {
      ...editingArticle,
      seoScore: analysis.score,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    SeoArticleService.saveArticle(toSave);
    const updated = SeoArticleService.getAllArticles();
    setArticles(updated);
    setEditorToast('Đã lưu bài viết thành công và đồng bộ lên hệ thống!');
    setTimeout(() => setEditorToast(null), 3000);
  };

  // Delete article
  const handleDeleteArticle = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      SeoArticleService.deleteArticle(id);
      const updated = SeoArticleService.getAllArticles();
      setArticles(updated);
      if (editingArticle?.id === id) {
        setEditingArticle(null);
        setActiveTab('list');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
              Quản Lý SEO & Bài Viết (AIKTP Engine)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E4F1E9] text-[#376F64] border border-[#376F64]/30">
              AIKTP 2026
            </span>
          </div>
          <p className="text-xs text-[#5F706A]">
            Tự động hóa bài viết chuẩn SEO, đo lường điểm On-Page và cấu hình từ khóa Google.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('aiktp-generator')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#376F64] to-[#2B5A51] hover:brightness-105 transition-all text-xs shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Tạo bài với AIKTP</span>
          </button>

          <button
            onClick={handleCreateNewManual}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Viết thủ công</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5F706A] font-semibold">
            <span>Tổng số bài viết SEO</span>
            <BookOpen className="w-4 h-4 text-[#376F64]" />
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] mt-2">{stats.total}</div>
          <span className="text-[11px] text-[#376F64] font-medium">100% Đã xuất bản lên Hub</span>
        </div>

        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5F706A] font-semibold">
            <span>Điểm SEO Score trung bình</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] mt-2">{stats.avgScore}/100</div>
          <span className="text-[11px] text-[#376F64] font-medium">Đạt chuẩn AIKTP & E-E-A-T</span>
        </div>

        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5F706A] font-semibold">
            <span>Tổng lượt xem độc giả</span>
            <Eye className="w-4 h-4 text-[#376F64]" />
          </div>
          <div className="text-2xl font-extrabold text-[#293B36] mt-2">
            {stats.totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#5F706A]">Từ tìm kiếm tự nhiên & mạng xã hội</span>
        </div>

        <div className="bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5F706A] font-semibold">
            <span>Từ khóa trọng tâm top 1</span>
            <Globe className="w-4 h-4 text-[#376F64]" />
          </div>
          <div className="text-base font-extrabold text-[#376F64] mt-2 truncate">
            {stats.topKeyword}
          </div>
          <span className="text-[11px] text-[#5F706A]">Xếp hạng mục tiêu trang 1 Google</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DCE6DF] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'list'
              ? 'bg-[#376F64] text-white shadow-xs'
              : 'text-[#5F706A] hover:bg-gray-100'
          }`}
        >
          Danh sách bài viết ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab('aiktp-generator')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'aiktp-generator'
              ? 'bg-[#376F64] text-white shadow-xs'
              : 'text-[#5F706A] hover:bg-gray-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trình tạo tự động AIKTP</span>
        </button>
        {editingArticle && (
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-[#376F64] text-white shadow-xs'
                : 'text-[#5F706A] hover:bg-gray-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Biên tập: {editingArticle.title.slice(0, 20)}...</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: DANH SÁCH BÀI VIẾT SEO
      ========================================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#DCE6DF]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#5F706A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết, từ khóa..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] focus:outline-hidden focus:border-[#376F64]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {SEO_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? 'bg-[#E4F1E9] text-[#376F64] font-bold'
                      : 'text-[#5F706A] hover:bg-gray-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#DCE6DF] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FFFDF8] border-b border-[#DCE6DF] text-[#5F706A] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Tiêu đề bài viết & URL Slug</th>
                    <th className="p-3.5">Chuyên mục</th>
                    <th className="p-3.5">Từ khóa chính</th>
                    <th className="p-3.5 text-center">Điểm SEO</th>
                    <th className="p-3.5 text-center">Lượt xem</th>
                    <th className="p-3.5 text-center">Cập nhật</th>
                    <th className="p-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE6DF]">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-[#F2F8F5]/60 transition-colors">
                      <td className="p-3.5 max-w-[340px]">
                        <div className="font-bold text-[#293B36] hover:text-[#376F64] transition-colors line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-[11px] text-[#5F706A] font-mono truncate mt-0.5">
                          /bai-viet/{article.slug}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#E4F1E9] text-[#376F64] font-semibold text-[11px]">
                          {article.categoryName}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-[#293B36]">
                          "{article.targetKeyword}"
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            article.seoScore >= 95
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {article.seoScore}/100
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-semibold text-[#293B36]">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center text-[#5F706A]">
                        {article.updatedAt}
                      </td>
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => onNavigate(`/bai-viet/${article.slug}`)}
                          className="p-1.5 rounded-lg text-[#5F706A] hover:bg-[#E4F1E9] hover:text-[#376F64] transition-all"
                          title="Xem trên trang độc giả"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(article)}
                          className="p-1.5 rounded-lg text-[#5F706A] hover:bg-amber-50 hover:text-amber-700 transition-all"
                          title="Chỉnh sửa bài viết & SEO"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id, article.title)}
                          className="p-1.5 rounded-lg text-[#5F706A] hover:bg-red-50 hover:text-red-600 transition-all"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: TRÌNH TẠO BÀI TỰ ĐỘNG AIKTP (AI KEY-TO-POST SIMULATOR)
      ========================================================================= */}
      {activeTab === 'aiktp-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Parameters */}
          <div className="lg:col-span-5 bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#376F64] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>AIKTP Key-to-Post Engine</span>
              </span>
              <h3 className="text-lg font-extrabold text-[#293B36]">
                Tạo Bài Viết Chuẩn SEO Tự Động
              </h3>
              <p className="text-xs text-[#5F706A]">
                Nhập từ khóa mục tiêu, hệ thống sẽ phân tích SERP và sinh bài viết hoàn chỉnh hơn 2.000 từ.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#293B36]">
                  Từ khóa chính mục tiêu (Target Keyword) *
                </label>
                <input
                  type="text"
                  value={genKeyword}
                  onChange={(e) => setGenKeyword(e.target.value)}
                  placeholder="Ví dụ: hướng dẫn làm SEO web truyện, viết kịch bản AI..."
                  className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36]">Chuyên mục bài viết</label>
                <select
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] bg-white"
                >
                  <option value="ai-content">AI & Tự Động Hóa (AIKTP)</option>
                  <option value="seo-onpage">Chiến Lược SEO 2026</option>
                  <option value="creative-writing">Kỹ Thuật Sáng Tác</option>
                  <option value="growth-monetization">Kiếm Tiền & Xuất Bản</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36]">Phong cách & Tone giọng</label>
                <select
                  value={genTone}
                  onChange={(e) => setGenTone(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] bg-white"
                >
                  <option value="chuyen-gia">Chuyên gia E-E-A-T (Khách quan, dữ liệu thực tế)</option>
                  <option value="than-thien">Thân thiện, truyền cảm hứng & hướng dẫn</option>
                  <option value="kich-thich">Hành động mạnh mẽ, giải quyết nỗi đau người đọc</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isGenerating || !genKeyword.trim()}
                  onClick={handleRunAiktpGeneration}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#376F64] to-[#2B5A51] hover:brightness-105 transition-all text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{genStep || 'Đang tạo bài...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Khởi tạo bài viết với 1 Click</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AIKTP Feature checklist */}
            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-2 text-[11px] text-[#5F706A]">
              <div className="font-bold text-[#293B36] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#376F64]" />
                <span>Tiêu chuẩn tự động được kích hoạt:</span>
              </div>
              <ul className="space-y-1 pl-4 list-disc">
                <li>Dựng Outline chuẩn Semantic Search H2/H3</li>
                <li>Sinh thẻ Meta Title & Meta Description tối ưu CTR</li>
                <li>Tự động chèn bảng tổng hợp dữ liệu & danh sách</li>
                <li>Tạo bộ giải đáp Schema FAQ Accordion</li>
              </ul>
            </div>
          </div>

          {/* Right Preview: Generated Result */}
          <div className="lg:col-span-7 space-y-4">
            {generatedDraft ? (
              <div className="bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE6DF]">
                  <div>
                    <span className="text-[11px] font-bold text-[#376F64] uppercase">
                      Bản thảo vừa sinh xong ({generatedDraft.seoScore}/100 Score)
                    </span>
                    <h4 className="font-extrabold text-base text-[#293B36]">
                      {generatedDraft.title}
                    </h4>
                  </div>
                  <button
                    onClick={handleSaveGeneratedDraft}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu & Xuất bản ngay</span>
                  </button>
                </div>

                {/* Google SERP Preview Box */}
                <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-1">
                  <div className="text-[11px] text-[#5F706A]">Mô phỏng hiển thị Google Search:</div>
                  <div className="text-sm font-bold text-blue-700 hover:underline truncate">
                    {generatedDraft.metaTitle}
                  </div>
                  <div className="text-xs text-[#376F64] font-mono">
                    https://longanthuctinh.vn/bai-viet/{generatedDraft.slug}
                  </div>
                  <div className="text-xs text-[#5F706A] line-clamp-2">
                    {generatedDraft.metaDescription}
                  </div>
                </div>

                {/* Content snippet */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#293B36]">Nội dung xem trước:</span>
                  <div className="p-4 rounded-xl bg-gray-50 border border-[#DCE6DF] text-xs font-mono max-h-60 overflow-y-auto whitespace-pre-wrap text-[#293B36]">
                    {generatedDraft.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#DCE6DF] rounded-2xl p-12 text-center space-y-3">
                <Sparkles className="w-12 h-12 text-[#376F64] mx-auto opacity-30" />
                <h4 className="font-extrabold text-base text-[#293B36]">
                  Chưa có bản thảo nào được sinh
                </h4>
                <p className="text-xs text-[#5F706A] max-w-md mx-auto">
                  Hãy nhập từ khóa mục tiêu ở cột bên trái và bấm "Khởi tạo bài viết với 1 Click" để công cụ AIKTP bắt đầu làm việc.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: BỘ PHÂN TÍCH SEO ON-PAGE & TRÌNH SOẠN THẢO
      ========================================================================= */}
      {activeTab === 'editor' && editingArticle && currentAnalysis && (
        <form onSubmit={handleSaveEditor} className="space-y-6">
          {editorToast && (
            <div className="p-3.5 rounded-xl bg-[#E4F1E9] border border-[#376F64]/30 text-xs text-[#376F64] font-bold flex items-center justify-between">
              <span>{editorToast}</span>
              <button onClick={() => setEditorToast(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Article Form Fields */}
            <div className="lg:col-span-8 bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-[#293B36]">
                  Biên tập chi tiết nội dung & Meta tags
                </h3>
                <p className="text-xs text-[#5F706A]">
                  Tối ưu hóa các thẻ tiêu đề, mô tả và nội dung bài viết theo chuẩn On-page.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#293B36]">
                    <label>Tiêu đề bài viết (H1) *</label>
                    <span className={`${editingArticle.title.length > 70 ? 'text-red-500' : 'text-[#5F706A]'}`}>
                      {editingArticle.title.length}/70 ký tự
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs font-bold text-[#293B36]"
                  />
                </div>

                {/* Slug & Target Keyword */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#293B36]">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={editingArticle.slug}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs font-mono text-[#293B36]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#293B36]">Từ khóa chính (Target Keyword) *</label>
                    <input
                      type="text"
                      required
                      value={editingArticle.targetKeyword}
                      onChange={(e) => setEditingArticle({ ...editingArticle, targetKeyword: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                    />
                  </div>
                </div>

                {/* Meta Title */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#293B36]">
                    <label>Meta Title (SEO Title)</label>
                    <span className={`${editingArticle.metaTitle.length > 65 ? 'text-red-500' : 'text-[#5F706A]'}`}>
                      {editingArticle.metaTitle.length}/65 ký tự
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingArticle.metaTitle}
                    onChange={(e) => setEditingArticle({ ...editingArticle, metaTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#293B36]">
                    <label>Meta Description (140 - 160 ký tự)</label>
                    <span className={`${editingArticle.metaDescription.length > 165 || editingArticle.metaDescription.length < 120 ? 'text-amber-600' : 'text-emerald-600 font-bold'}`}>
                      {editingArticle.metaDescription.length}/160 ký tự
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={editingArticle.metaDescription}
                    onChange={(e) => setEditingArticle({ ...editingArticle, metaDescription: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Tóm tắt bài viết (Summary)</label>
                  <textarea
                    rows={2}
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>

                {/* Content (Markdown) */}
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Nội dung bài viết (Markdown H2, H3, Table) *</label>
                  <textarea
                    rows={12}
                    required
                    value={editingArticle.content}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#DCE6DF] font-mono text-xs text-[#293B36] leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-xs shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu bài viết & Cập nhật SEO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2.5 rounded-xl font-bold text-[#5F706A] bg-white border border-[#DCE6DF] hover:bg-gray-50 transition-all text-xs"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Realtime SEO Score & Google SERP Simulator */}
            <div className="lg:col-span-4 space-y-4">
              {/* Score Meter */}
              <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-[#376F64]">
                    Điểm SEO On-Page
                  </span>
                  <span className="text-xl font-extrabold text-[#293B36]">
                    {currentAnalysis.score}/100
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      currentAnalysis.score >= 90
                        ? 'bg-emerald-500'
                        : currentAnalysis.score >= 70
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${currentAnalysis.score}%` }}
                  />
                </div>

                {/* Checklist */}
                <div className="space-y-2 pt-2 text-[11px]">
                  {currentAnalysis.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {item.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`font-semibold ${item.passed ? 'text-[#293B36]' : 'text-[#5F706A]'}`}>
                          {item.name}
                        </span>
                        <p className="text-[10px] text-[#5F706A] mt-0.5">{item.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERP Simulator */}
              <div className="bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-[#376F64]">
                    Xem trước Google SERP
                  </span>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSerpDevice('desktop')}
                      className={`px-2 py-0.5 rounded ${
                        serpDevice === 'desktop' ? 'bg-white text-[#293B36] shadow-xs' : 'text-[#5F706A]'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpDevice('mobile')}
                      className={`px-2 py-0.5 rounded ${
                        serpDevice === 'mobile' ? 'bg-white text-[#293B36] shadow-xs' : 'text-[#5F706A]'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#5F706A]">
                    <img
                      src="/art/ui/river-mark.svg"
                      alt="favicon"
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span className="truncate">longanthuctinh.vn › bai-viet › {editingArticle.slug}</span>
                  </div>
                  <div className="text-xs font-bold text-[#1a0dab] line-clamp-2 leading-snug">
                    {editingArticle.metaTitle || editingArticle.title}
                  </div>
                  <div className="text-[11px] text-[#4d5156] line-clamp-3 leading-relaxed">
                    {editingArticle.metaDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

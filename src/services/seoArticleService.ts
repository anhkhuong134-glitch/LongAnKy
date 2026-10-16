import { SeoArticle, INITIAL_SEO_ARTICLES, SEO_CATEGORIES } from '../data/seoArticlesData';

const STORAGE_KEY = 'arumo_seo_articles_custom';
const LIKES_KEY = 'arumo_seo_likes_cache';

export class SeoArticleService {
  // 1. Get all articles (combining default + local storage updates)
  static getAllArticles(): SeoArticle[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: SeoArticle[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored SEO articles:', e);
    }
    // Initialize default if not present
    this.saveAllArticles(INITIAL_SEO_ARTICLES);
    return INITIAL_SEO_ARTICLES;
  }

  // 2. Save all articles to LocalStorage
  static saveAllArticles(articles: SeoArticle[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
      // Trigger event for active React components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('seo-articles-updated', { detail: articles }));
      }
    } catch (e) {
      console.error('Failed to save SEO articles:', e);
    }
  }

  // 3. Get article by slug
  static getArticleBySlug(slug: string): SeoArticle | null {
    const all = this.getAllArticles();
    return all.find(a => a.slug === slug || a.id === slug) || null;
  }

  // 4. Save or update a single article
  static saveArticle(article: SeoArticle): void {
    const all = this.getAllArticles();
    const idx = all.findIndex(a => a.id === article.id);
    let updated: SeoArticle[];
    if (idx >= 0) {
      updated = [...all];
      updated[idx] = { ...article, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      updated = [{ ...article, publishedAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }, ...all];
    }
    this.saveAllArticles(updated);
  }

  // 5. Delete an article
  static deleteArticle(id: string): void {
    const all = this.getAllArticles();
    const filtered = all.filter(a => a.id !== id);
    this.saveAllArticles(filtered);
  }

  // 6. Increment view count
  static incrementView(slug: string): void {
    const all = this.getAllArticles();
    const item = all.find(a => a.slug === slug || a.id === slug);
    if (item) {
      item.views = (item.views || 0) + 1;
      this.saveAllArticles(all);
    }
  }

  // 7. Toggle like
  static toggleLike(articleId: string): { likes: number; isLiked: boolean } {
    let likedIds: string[] = [];
    try {
      likedIds = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
    } catch {}

    const isLiked = likedIds.includes(articleId);
    let newLikedIds: string[];
    let delta = 0;

    if (isLiked) {
      newLikedIds = likedIds.filter(id => id !== articleId);
      delta = -1;
    } else {
      newLikedIds = [...likedIds, articleId];
      delta = 1;
    }

    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(newLikedIds));
    } catch {}

    const all = this.getAllArticles();
    const article = all.find(a => a.id === articleId);
    let currentLikes = 0;
    if (article) {
      article.likes = Math.max(0, (article.likes || 0) + delta);
      currentLikes = article.likes;
      this.saveAllArticles(all);
    }

    return { likes: currentLikes, isLiked: !isLiked };
  }

  // Check if article is liked by user
  static isArticleLiked(articleId: string): boolean {
    try {
      const likedIds: string[] = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
      return likedIds.includes(articleId);
    } catch {
      return false;
    }
  }

  // 8. Calculate SEO score (0 - 100) based on AIKTP 15-criteria principles
  static calculateSeoScore(data: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    targetKeyword: string;
    content: string;
  }): { score: number; checklist: Array<{ name: string; passed: boolean; tip: string }> } {
    const { title, metaTitle, metaDescription, targetKeyword, content } = data;
    const cleanKw = (targetKeyword || '').trim().toLowerCase();
    const cleanTitle = (title || '').toLowerCase();
    const cleanMetaDesc = (metaDescription || '').toLowerCase();
    const cleanContent = (content || '').toLowerCase();

    const words = (content || '').split(/\s+/).filter(Boolean).length;
    const kwCount = cleanKw ? (cleanContent.match(new RegExp(cleanKw, 'gi')) || []).length : 0;
    const kwDensity = words > 0 ? (kwCount / words) * 100 : 0;

    const checklist = [
      {
        name: 'Từ khóa mục tiêu xuất hiện trong Tiêu đề (H1)',
        passed: cleanKw ? cleanTitle.includes(cleanKw) : false,
        tip: 'Chèn từ khóa chính vào nửa đầu tiêu đề H1 để tăng tỷ lệ nhấp chuột (CTR).'
      },
      {
        name: 'Độ dài Tiêu đề bài viết tối ưu (40 - 70 ký tự)',
        passed: title.length >= 40 && title.length <= 75,
        tip: `Hiện tại: ${title.length} ký tự. Lý tưởng nhất là 45 - 65 ký tự.`
      },
      {
        name: 'Từ khóa xuất hiện trong Meta Description',
        passed: cleanKw ? cleanMetaDesc.includes(cleanKw) : false,
        tip: 'Giúp đoạn mô tả nổi bật khi Google in đậm từ khóa truy vấn của người tìm.'
      },
      {
        name: 'Độ dài Meta Description chuẩn SEO (120 - 165 ký tự)',
        passed: metaDescription.length >= 120 && metaDescription.length <= 165,
        tip: `Hiện tại: ${metaDescription.length} ký tự. Quá ngắn sẽ thiếu thông tin, quá dài bị Google cắt ba chấm.`
      },
      {
        name: 'Độ dài bài viết chuyên sâu (> 1.200 từ)',
        passed: words >= 1200,
        tip: `Hiện tại: ${words} từ. Các bài viết xếp hạng cao nhất Google thường có từ 1.800 - 2.500 từ.`
      },
      {
        name: 'Mật độ từ khóa chính tự nhiên (0.8% - 2.5%)',
        passed: kwDensity >= 0.8 && kwDensity <= 2.5,
        tip: `Hiện tại: ${kwDensity.toFixed(2)}% (${kwCount} lần xuất hiện). Tránh nhồi nhét quá 3%.`
      },
      {
        name: 'Có chứa các đề mục phân cấp H2 và H3',
        passed: (content.includes('## ') && content.includes('### ')),
        tip: 'Phân cấp nội dung rõ ràng giúp Google trích xuất Featured Snippet và người đọc dễ quét.'
      },
      {
        name: 'Có bảng tổng hợp dữ liệu hoặc danh sách so sánh',
        passed: content.includes('|') || content.includes('- ') || content.includes('1. '),
        tip: 'Bảng biểu giúp tăng thời gian tương tác (Dwell time) và nâng cao chỉ số E-E-A-T.'
      }
    ];

    const passedCount = checklist.filter(c => c.passed).length;
    const score = Math.round((passedCount / checklist.length) * 100);

    return { score, checklist };
  }

  // 9. AIKTP Simulator: Generate a full SEO article from keyword in seconds
  static generateAiktpArticle(params: {
    targetKeyword: string;
    category: SeoArticle['category'];
    tone: 'chuyen-gia' | 'than-thien' | 'kich-thich';
    length: 'standard' | 'deep';
  }): SeoArticle {
    const { targetKeyword, category, tone, length } = params;
    const kw = targetKeyword.trim();
    const slug = kw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `bai-viet-${Date.now()}`;

    const categoryObj = SEO_CATEGORIES.find(c => c.id === category) || SEO_CATEGORIES[1];

    const title = `Hướng Dẫn ${kw}: Chiến Lược Toàn Diện Lên Top Bền Vững 2026`;
    const metaTitle = `${kw} Chuẩn SEO 2026: Hướng Dẫn Chi Tiết A-Z | Long Ấn Hub`;
    const metaDescription = `Cẩm nang khám phá bí quyết ${kw} từ A đến Z. Hướng dẫn từng bước, checklist tối ưu E-E-A-T và mẹo thực chiến đạt thứ hạng cao trên Google 2026.`;

    const generatedContent = `
## 1. Tổng Quan Về ${kw} Trong Kỷ Nguyên Mới

Trong bối cảnh công nghệ tìm kiếm và trí tuệ nhân tạo phát triển vượt bậc năm 2026, **${kw}** đang trở thành chủ đề thu hút sự quan tâm đặc biệt của cộng đồng. Việc nắm vững các nguyên tắc cốt lõi không chỉ giúp bạn tối ưu hóa hiệu suất làm việc mà còn mở ra những cơ hội đột phá mới.

Đối với các nhà sáng tạo nội dung, blogger và nhà nghiên cứu, hiểu rõ ý định tìm kiếm (Search Intent) xoay quanh **${kw}** là chìa khóa đầu tiên để chinh phục người đọc.

---

## 2. Các Trụ Cột Quan Trọng Cần Nắm Rõ

Khi triển khai các giải pháp liên quan đến **${kw}**, hãy luôn chú trọng đến 3 yếu tố nền tảng:

| Trụ Cột Nền Tảng | Ý Nghĩa Thực Tiễn | Điểm Lưu Ý Khi Thực Hiện |
| :--- | :--- | :--- |
| **Tính xác thực (Authenticity)** | Đảm bảo dữ liệu và kinh nghiệm được chia sẻ là thật | Kiểm tra chéo số liệu trước khi công bố |
| **Độ sâu thông tin (Information Depth)** | Trả lời trọn vẹn thắc mắc của độc giả | Sử dụng cấu trúc H2, H3 và bảng so sánh |
| **Trải nghiệm tương tác (UX Signals)** | Giúp độc giả dễ đọc, dễ áp dụng | Bổ sung hình ảnh, mẹo nhanh và phần FAQ |

---

## 3. Quy Trình 4 Bước Thực Hiện ${kw} Hiệu Quả Nhất

Dưới đây là quy trình thực chiến đã được chứng minh qua hàng trăm dự án:

### Bước 1: Khảo sát và phân tích nhu cầu thực tế
Trước khi bắt đầu, hãy tự đặt câu hỏi: *Độc giả đang tìm kiếm điều gì khi gõ từ khóa "${kw}"?* Họ cần một định nghĩa cơ bản, một bảng so sánh công cụ hay một bản hướng dẫn từng bước (Step-by-step tutorial)?

### Bước 2: Chuẩn bị tài nguyên và công cụ hỗ trợ
Tận dụng các công nghệ AI hiện đại như **AIKTP, Gemini và Claude** để lập dàn bài chi tiết, thu thập các góc nhìn đa chiều và tiết kiệm thời gian nghiên cứu.

### Bước 3: Triển khai nội dung kết hợp trải nghiệm thực tế (E-E-A-T)
Đừng để bài viết chỉ là những lý thuyết suông. Hãy bổ sung những câu chuyện thực tế, những sai lầm từng gặp phải và cách bạn đã vượt qua chúng để tạo sự tin tưởng tuyệt đối.

### Bước 4: Đo lường, kiểm tra điểm SEO và tinh chỉnh liên tục
Sau khi xuất bản, hãy theo dõi các chỉ số đo lường như: thời gian ở lại trang, tỷ lệ nhấp chuột (CTR) và thứ hạng từ khóa trên Google Search Console để kịp thời cập nhật.

---

## 4. Lời Khuyên Chuyên Gia & Xu Hướng Tương Lai

Tương lai của **${kw}** sẽ gắn liền với việc cá nhân hóa trải nghiệm người dùng và tích hợp công nghệ đa phương tiện (như audio nghe đọc, hình ảnh trực quan và các công cụ tương tác trực tiếp). Những ai biết ứng dụng sớm sẽ chiếm lĩnh ưu thế dẫn đầu.
    `.trim();

    const wordCount = generatedContent.split(/\s+/).filter(Boolean).length;

    const newArticle: SeoArticle = {
      id: `seo_art_${Date.now()}`,
      slug,
      title,
      metaTitle,
      metaDescription,
      targetKeyword: kw,
      secondaryKeywords: [`cách làm ${kw}`, `kinh nghiệm ${kw}`, `hướng dẫn ${kw} 2026`],
      category: category as any,
      categoryName: categoryObj.name,
      summary: `Bài viết cẩm nang chi tiết hướng dẫn về ${kw}, cung cấp các bước thực hành từng bước, bảng tổng hợp và giải đáp thắc mắc chuyên sâu giúp bạn áp dụng thành công ngay hôm nay.`,
      keyTakeaways: [
        `Nắm bắt trọn vẹn bản chất và tầm quan trọng của ${kw} trong năm 2026.`,
        'Quy trình 4 bước thực hành rõ ràng, có thể áp dụng ngay vào dự án thực tế.',
        'Chiến lược tối ưu hóa trải nghiệm người dùng và giữ chân độc giả lâu hơn trên website.',
        'Bộ giải đáp các câu hỏi thường gặp nhất của người đọc về chủ đề này.'
      ],
      content: generatedContent,
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'AIKTP Intelligence Engine',
        role: 'Hệ thống Phân tích & Tự Động Hóa Content Chuẩn SEO',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        verified: true
      },
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      readTimeMinutes: Math.max(4, Math.round(wordCount / 220)),
      views: 120,
      likes: 18,
      seoScore: 95,
      tags: [kw, 'AIKTP', 'SEO 2026', categoryObj.name],
      faqs: [
        {
          question: `Làm thế nào để bắt đầu với ${kw} cho người mới bắt đầu?`,
          answer: `Người mới bắt đầu nên làm quen với các khái niệm cơ bản trước, sau đó thực hành từng bước nhỏ theo quy trình 4 bước trong bài viết để tích lũy kinh nghiệm thực tế.`
        },
        {
          question: `Công cụ nào hỗ trợ tốt nhất cho việc triển khai ${kw}?`,
          answer: `Các công cụ AI chuyên dụng như AIKTP kết hợp các nền tảng phân tích từ khóa sẽ giúp bạn tối ưu hóa 80% thời gian nghiên cứu và sản xuất.`
        }
      ]
    };

    return newArticle;
  }

  // 10. Update browser Head tags for Dynamic Technical SEO
  static updateSeoHeadTags(params: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    schemaData?: object;
  }): void {
    if (typeof document === 'undefined') return;

    // 1. Update Title
    if (params.title) {
      document.title = params.title;
    }

    // 2. Update Meta Description
    if (params.description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', params.description);

      // OpenGraph Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', params.description);
    }

    // 3. Update OpenGraph Title
    if (params.title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', params.title);
    }

    // 4. Update OpenGraph Image
    if (params.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', params.ogImage);
    }

    // 5. Update Keywords
    if (params.keywords && params.keywords.length > 0) {
      let kwMeta = document.querySelector('meta[name="keywords"]');
      if (!kwMeta) {
        kwMeta = document.createElement('meta');
        kwMeta.setAttribute('name', 'keywords');
        document.head.appendChild(kwMeta);
      }
      kwMeta.setAttribute('content', params.keywords.join(', '));
    }

    // 6. Inject / Update JSON-LD Schema
    const schemaId = 'dynamic-seo-schema-jsonld';
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (params.schemaData) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = schemaId;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(params.schemaData, null, 2);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }
}

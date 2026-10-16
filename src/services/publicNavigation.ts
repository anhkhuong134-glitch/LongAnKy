export interface ParsedRoute {
  path: string;
  params: Record<string, string>;
  rawHash: string;
}

export class PublicNavigationService {
  static parseHash(hash = window.location.hash): ParsedRoute {
    let clean = hash.replace(/^#\/?/, '/');
    if (!clean.startsWith('/')) clean = '/' + clean;

    // Check specific patterns
    const docMatch = clean.match(/^\/doc\/([^/?]+)/);
    if (docMatch) {
      return { path: '/doc/:id', params: { chapterId: docMatch[1] }, rawHash: hash };
    }

    const charMatch = clean.match(/^\/nhan-vat\/([^/?]+)/);
    if (charMatch) {
      return { path: '/nhan-vat/:id', params: { characterId: charMatch[1] }, rawHash: hash };
    }

    const comicMatch = clean.match(/^\/truyen-tranh\/([^/?]+)/);
    if (comicMatch) {
      return { path: '/truyen-tranh/:id', params: { comicId: comicMatch[1] }, rawHash: hash };
    }

    const articleMatch = clean.match(/^\/(?:bai-viet|seo)\/([^/?]+)/);
    if (articleMatch) {
      return { path: '/bai-viet/:slug', params: { slug: articleMatch[1] }, rawHash: hash };
    }

    if (clean === '/seo' || clean === '/bai-viet') {
      return { path: '/bai-viet', params: {}, rawHash: hash };
    }

    const adminChapMatch = clean.match(/^\/admin\/chuong\/([^/?]+)/);
    if (adminChapMatch) {
      return { path: '/admin/chuong/:id', params: { id: adminChapMatch[1] }, rawHash: hash };
    }

    const adminCharMatch = clean.match(/^\/admin\/nhan-vat\/([^/?]+)/);
    if (adminCharMatch) {
      return { path: '/admin/nhan-vat/:id', params: { id: adminCharMatch[1] }, rawHash: hash };
    }

    const adminComicMatch = clean.match(/^\/admin\/truyen-tranh\/([^/?]+)/);
    if (adminComicMatch) {
      return { path: '/admin/truyen-tranh/:id', params: { id: adminComicMatch[1] }, rawHash: hash };
    }

    // Default matching for static paths
    return { path: clean, params: {}, rawHash: hash };
  }

  static navigateTo(path: string, scrollToTop = true): void {
    const targetHash = '#' + (path.startsWith('/') ? path : '/' + path);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

import React, { useState, useEffect, useCallback } from 'react';
import { PublicHeader } from './components/public/PublicHeader';
import { PublicFooter } from './components/public/PublicFooter';
import { StoryHomePage } from './components/public/StoryHomePage';
import { ChapterIndexPage } from './components/public/ChapterIndexPage';
import { CharacterGalleryPage } from './components/public/CharacterGalleryPage';
import { CharacterPublicProfile } from './components/public/CharacterPublicProfile';
import { WorldGuidePage } from './components/public/WorldGuidePage';
import { ComicLandingPage } from './components/public/ComicLandingPage';
import { BookshelfPage } from './components/public/BookshelfPage';
import { NovelReaderPage } from './components/reader/NovelReaderPage';
import { ReaderAuthGate } from './components/auth/ReaderAuthGate';
import { LoginPage } from './components/auth/LoginPage';
import { UserAuthModal } from './components/auth/UserAuthModal';
import { GameShowcasePage } from './components/public/GameShowcasePage';
import { SeoArticlesPage } from './components/public/SeoArticlesPage';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverviewView } from './components/admin/AdminOverviewView';
import { AdminSeoView } from './components/admin/AdminSeoView';
import { AdminChaptersView } from './components/admin/AdminChaptersView';
import { AdminChapterEditorView } from './components/admin/AdminChapterEditorView';
import { AdminCharactersView } from './components/admin/AdminCharactersView';
import { AdminCharacterEditorView } from './components/admin/AdminCharacterEditorView';
import { AdminWorldView } from './components/admin/AdminWorldView';
import { AdminComicView } from './components/admin/AdminComicView';
import { AdminTasksView } from './components/admin/AdminTasksView';
import { AdminMediaView } from './components/admin/AdminMediaView';
import { AdminGoogleSyncView } from './components/admin/AdminGoogleSyncView';
import { AdminThemeView } from './components/admin/AdminThemeView';
import { AdminCommentsView } from './components/admin/AdminCommentsView';
import { AdminReadersView } from './components/admin/AdminReadersView';
import { AdminHistoryView } from './components/admin/AdminHistoryView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

import { PublicNavigationService, ParsedRoute } from './services/publicNavigation';
import { PublishedContentService, PublishedStorySnapshot } from './services/publishedContent';
import { ReadingProgressService, ReadingHistoryItem } from './services/readingProgress';
import { GoogleSyncService } from './services/googleSyncService';
import { UserService } from './services/userService';
import { UserProfile } from './types';
import { ShieldAlert } from 'lucide-react';

import './styles/index.css';

export default function App() {
  // 1. Current Route parsed from hash
  const [route, setRoute] = useState<ParsedRoute>(() => PublicNavigationService.parseHash());

  // 2. Current User session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => UserService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // 3. Published Story Snapshot
  const [snapshot, setSnapshot] = useState<PublishedStorySnapshot | null>(null);

  // 4. Reading history and completed chapters
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem | null>(() =>
    ReadingProgressService.getHistory()
  );
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(() =>
    ReadingProgressService.getCompletedChapterIds()
  );

  // Active edit IDs in admin
  const [activeAdminChapterId, setActiveAdminChapterId] = useState<string | null>(null);
  const [activeAdminCharId, setActiveAdminCharId] = useState<string | null>(null);

  // Load published snapshot on mount & listen for continuous updates
  useEffect(() => {
    PublishedContentService.loadSnapshot().then((data) => setSnapshot(data));

    const handleStoryUpdated = (e: any) => {
      if (e?.detail) {
        setSnapshot(e.detail);
      } else {
        PublishedContentService.loadSnapshot().then((data) => setSnapshot(data));
      }
    };
    window.addEventListener('story-content-updated', handleStoryUpdated);

    // Initial background auto-sync from Google Docs
    GoogleSyncService.autoSyncIfNeeded().then(changed => {
      if (changed) {
        PublishedContentService.loadSnapshot().then(s => setSnapshot(s));
      }
    });

    // Continuous auto-sync interval: checks every 60s
    const syncInterval = setInterval(() => {
      GoogleSyncService.autoSyncIfNeeded().then(changed => {
        if (changed) {
          PublishedContentService.loadSnapshot().then(s => setSnapshot(s));
        }
      });
    }, 60000);

    return () => {
      window.removeEventListener('story-content-updated', handleStoryUpdated);
      clearInterval(syncInterval);
    };
  }, []);

  // Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = PublicNavigationService.parseHash();
      setRoute(parsed);
      setReadingHistory(ReadingProgressService.getHistory());
      setCompletedChapterIds(ReadingProgressService.getCompletedChapterIds());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((path: string) => {
    PublicNavigationService.navigateTo(path);
  }, []);

  const handleLogout = useCallback(() => {
    UserService.logout();
    setCurrentUser(null);
    navigateTo('/');
  }, [navigateTo]);

  // Handle successful login
  const handleLoginSuccess = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      navigateTo('/admin');
    }
  }, [navigateTo]);

  // Route paths
  const isReaderRoute = route.path === '/doc/:id';
  const isAdminRoute = route.path.startsWith('/admin');

  // =========================================================================
  // ADMIN WORKSPACE ROUTING
  // =========================================================================
  if (isAdminRoute) {
    // 1. If not logged in, show login prompt / form
    if (!currentUser) {
      return (
        <div className="min-h-screen bg-[#FFFDF8] flex flex-col">
          <PublicHeader
            currentPath={route.path}
            currentUser={null}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onNavigate={navigateTo}
          />
          <main className="flex-1">
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigate={navigateTo}
            />
          </main>
          <PublicFooter onNavigate={navigateTo} />
        </div>
      );
    }

    // 2. If logged in as reader (not admin), show permission denied
    if (currentUser.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#A33D49] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#293B36]">
            Tài khoản này không có quyền quản trị
          </h2>
          <p className="text-sm text-[#5F706A] max-w-md">
            Khu vực Bàn làm việc Arumo chỉ dành riêng cho tài khoản Quản trị viên được máy chủ xác nhận.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('/')}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-xs"
            >
              Về trang đọc truyện
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl font-bold text-[#5F706A] bg-white border border-[#DCE6DF] hover:bg-gray-50 transition-all text-xs"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      );
    }

    // 3. Render Admin Layout with selected sub-view
    const renderAdminContent = () => {
      // Sub-route: /admin/chuong or editing a chapter
      if (route.path === '/admin/chuong/:id' || activeAdminChapterId) {
        return (
          <AdminChapterEditorView
            chapterId={route.params.id || activeAdminChapterId || 'doc_chap_01'}
            onBack={() => {
              setActiveAdminChapterId(null);
              navigateTo('/admin/chuong');
            }}
            onPreviewChapter={(id) => navigateTo(`/doc/${id}`)}
          />
        );
      }

      if (route.path === '/admin/chuong') {
        return (
          <AdminChaptersView
            onNavigate={navigateTo}
            onEditChapter={(id) => {
              setActiveAdminChapterId(id);
              navigateTo(`/admin/chuong/${id}`);
            }}
          />
        );
      }

      // Sub-route: /admin/nhan-vat or editing a character
      if (route.path === '/admin/nhan-vat/:id' || activeAdminCharId) {
        return (
          <AdminCharacterEditorView
            charId={route.params.id || activeAdminCharId || 'char_rento'}
            onBack={() => {
              setActiveAdminCharId(null);
              navigateTo('/admin/nhan-vat');
            }}
            onPreviewProfile={(id) => navigateTo(`/nhan-vat/${id}`)}
          />
        );
      }

      if (route.path === '/admin/nhan-vat') {
        return (
          <AdminCharactersView
            onNavigate={navigateTo}
            onEditCharacter={(id) => {
              setActiveAdminCharId(id);
              navigateTo(`/admin/nhan-vat/${id}`);
            }}
          />
        );
      }

      // Other admin sub-routes
      if (route.path === '/admin/the-gioi') {
        return <AdminWorldView />;
      }

      if (route.path === '/admin/truyen-tranh' || route.path.startsWith('/admin/truyen-tranh')) {
        return <AdminComicView />;
      }

      if (route.path === '/admin/cong-viec') {
        return <AdminTasksView />;
      }

      if (route.path === '/admin/thu-vien') {
        return <AdminMediaView />;
      }

      if (route.path === '/admin/nhap-noi-dung') {
        return <AdminGoogleSyncView />;
      }

      if (route.path === '/admin/seo') {
        return <AdminSeoView onNavigate={navigateTo} />;
      }

      if (route.path === '/admin/giao-dien') {
        return <AdminThemeView />;
      }

      if (route.path === '/admin/binh-luan') {
        return <AdminCommentsView />;
      }

      if (route.path === '/admin/doc-gia' || route.path === '/admin/tai-khoan') {
        return <AdminReadersView />;
      }

      if (route.path === '/admin/lich-su') {
        return <AdminHistoryView />;
      }

      if (route.path === '/admin/cai-dat') {
        return <AdminSettingsView />;
      }

      // Default: Overview
      return <AdminOverviewView onNavigate={navigateTo} />;
    };

    return (
      <AdminLayout
        currentPath={route.path}
        currentUser={currentUser}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      >
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  // =========================================================================
  // NOVEL READER ROUTE — yêu cầu đăng nhập
  // =========================================================================
  if (isReaderRoute) {
    const chapterId = route.params.chapterId || 'doc_chap_prologue';

    // ── Chưa đăng nhập: hiện màn hình xác thực ──
    if (!currentUser) {
      return (
        <ReaderAuthGate
          chapterId={chapterId}
          onLoginSuccess={(user) => {
            handleLoginSuccess(user);
          }}
          onNavigate={navigateTo}
        />
      );
    }

    // ── Đã đăng nhập: hiện trang đọc đầy đủ ──
    return (
      <NovelReaderPage
        chapterId={chapterId}
        currentUser={currentUser}
        onNavigate={navigateTo}
      />
    );
  }

  // =========================================================================
  // PUBLIC WEBSITE SHELL ROUTING
  // =========================================================================
  const renderPublicPage = () => {
    switch (route.path) {
      case '/':
      case '':
        return (
          <StoryHomePage
            snapshot={snapshot}
            history={readingHistory}
            completedChapterIds={completedChapterIds}
            onNavigate={navigateTo}
          />
        );

      case '/muc-luc':
        return (
          <ChapterIndexPage
            snapshot={snapshot}
            history={readingHistory}
            completedChapterIds={completedChapterIds}
            onNavigate={navigateTo}
          />
        );

      case '/nhan-vat':
        return <CharacterGalleryPage onNavigate={navigateTo} />;

      case '/nhan-vat/:id':
        return (
          <CharacterPublicProfile
            characterId={route.params.characterId || 'char_rento'}
            onNavigate={navigateTo}
          />
        );

      case '/the-gioi':
        return <WorldGuidePage onNavigate={navigateTo} />;

      case '/game':
      case '/he-thong-game':
        return <GameShowcasePage onNavigate={navigateTo} />;

      case '/bai-viet':
      case '/seo':
        return <SeoArticlesPage onNavigate={navigateTo} />;

      case '/bai-viet/:slug':
        return (
          <SeoArticlesPage
            articleSlug={route.params.slug}
            onNavigate={navigateTo}
          />
        );

      case '/truyen-tranh':
      case '/truyen-tranh/:id':
        return <ComicLandingPage onNavigate={navigateTo} />;

      case '/tu-sach':
        return (
          <BookshelfPage
            history={readingHistory}
            onNavigate={navigateTo}
          />
        );

      case '/dang-nhap':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigateTo}
          />
        );

      default:
        // 404 Not Found as required by Section 4
        return (
          <div className="max-w-[640px] mx-auto py-24 text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-[#293B36]">
              Chưa tìm thấy trang này
            </h2>
            <p className="text-sm text-[#5F706A]">
              Địa chỉ bạn vừa mở không tồn tại hoặc đã được chuyển sang vị trí khác.
            </p>
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => navigateTo('/')}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-sm"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigateTo('/muc-luc')}
                className="px-5 py-2.5 rounded-xl font-bold text-[#376F64] bg-[#E4F1E9] hover:bg-[#D5EADF] transition-all text-sm"
              >
                Xem mục lục
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#293B36] flex flex-col antialiased">
      {/* 1. Public Header (72px desktop / 60px mobile) */}
      <PublicHeader
        currentPath={route.path}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onNavigate={navigateTo}
      />

      {/* 2. Main Page Content Container */}
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-4 sm:px-6 md:px-8">
        {renderPublicPage()}
      </main>

      {/* 3. Public Footer */}
      <PublicFooter onNavigate={navigateTo} />

      {/* 4. Auth Modal for Reader Login / Profile */}
      <UserAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onAdminAuthorized={() => navigateTo('/admin')}
      />
    </div>
  );
}

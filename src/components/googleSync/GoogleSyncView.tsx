import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Table, 
  ExternalLink, 
  RefreshCw, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Copy, 
  Check, 
  Gamepad2, 
  Layers, 
  Sparkles, 
  Clock, 
  Filter,
  Plus,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Chapter, GoogleDocsSyncState, GoogleSheetsSyncState, IdeaControlItem, GameTaskPackage } from '../../types';
import { 
  GOOGLE_DOCS_URL, 
  GOOGLE_SHEETS_URL,
  googleSheetsTaskPackages,
  googleSheetsSystemModules,
  googleSheetsIdeaControl
} from '../../data/googleData';
import { GoogleSyncService } from '../../services/googleSyncService';

interface GoogleSyncViewProps {
  activeChapter: Chapter | null;
  onUpdateChapterContent?: (content: string) => void;
  isWarmTheme: boolean;
}

type SyncTab = 'docs' | 'sheets' | 'gas_bridge';

export const GoogleSyncView: React.FC<GoogleSyncViewProps> = ({
  activeChapter,
  onUpdateChapterContent,
  isWarmTheme
}) => {
  const [activeTab, setActiveTab] = useState<SyncTab>('docs');
  const [docsSyncState, setDocsSyncState] = useState<GoogleDocsSyncState>(() => GoogleSyncService.getDocsSyncState());
  const [sheetsSyncState, setSheetsSyncState] = useState<GoogleSheetsSyncState>(() => GoogleSyncService.getSheetsSyncState());
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Sheets data states
  const [taskPackages, setTaskPackages] = useState<GameTaskPackage[]>(googleSheetsTaskPackages);
  const [ideas, setIdeas] = useState<IdeaControlItem[]>(googleSheetsIdeaControl);
  const [packageFilter, setPackageFilter] = useState<'all' | 'game' | 'story'>('all');
  const [gasUrlInput, setGasUrlInput] = useState<string>(docsSyncState.gasWebhookUrl || '');

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePullDocs = async () => {
    setIsPulling(true);
    try {
      const result = await GoogleSyncService.pullFromGoogleDocs(docsSyncState.gasWebhookUrl);
      if (result.success) {
        if (result.text && activeChapter && onUpdateChapterContent) {
          // Check if user wants to update current chapter
          if (window.confirm('Tìm thấy văn bản mới từ Google Docs. Bạn có muốn cập nhật vào chương đang mở không?')) {
            onUpdateChapterContent(result.text);
          }
        }
        setDocsSyncState(GoogleSyncService.getDocsSyncState());
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setIsPulling(false);
    }
  };

  const handlePushChapter = async () => {
    if (!activeChapter) {
      showToast('Không có chương nào đang được chọn để đẩy.', 'info');
      return;
    }
    setIsPushing(true);
    try {
      const result = await GoogleSyncService.pushChapterToGoogleDocs(activeChapter, docsSyncState.gasWebhookUrl);
      setDocsSyncState(GoogleSyncService.getDocsSyncState());
      showToast(result.message, 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setIsPushing(false);
    }
  };

  const handleSaveWebhook = () => {
    const updatedDocs = { ...docsSyncState, gasWebhookUrl: gasUrlInput.trim() };
    const updatedSheets = { ...sheetsSyncState, gasWebhookUrl: gasUrlInput.trim() };
    GoogleSyncService.saveDocsSyncState(updatedDocs);
    GoogleSyncService.saveSheetsSyncState(updatedSheets);
    setDocsSyncState(updatedDocs);
    setSheetsSyncState(updatedSheets);
    showToast('Đã lưu cấu hình Google Apps Script Webhook URL!', 'success');
  };

  const handleCopyGASCode = () => {
    navigator.clipboard.writeText(GoogleSyncService.getGoogleAppsScriptCode());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
    showToast('Đã sao chép mã nguồn Google Apps Script vào clipboard!', 'success');
  };

  const handleToggleTaskStatus = (code: string) => {
    setTaskPackages(prev => prev.map(p => {
      if (p.code !== code) return p;
      const nextStatus = p.status === 'Đã xong' ? 'Chưa làm' : p.status === 'Chưa làm' ? 'Đang làm' : 'Đã xong';
      return { ...p, status: nextStatus, dodMet: nextStatus === 'Đã xong' };
    }));
    showToast(`Đã cập nhật trạng thái gói việc ${code}!`);
  };

  const handleUpdateIdeaStatus = (id: string, newStatus: any) => {
    const updated = ideas.map(idea => idea.id === id ? { ...idea, status: newStatus } : idea);
    setIdeas(updated);
    const target = updated.find(i => i.id === id);
    if (target) {
      GoogleSyncService.pushIdeaToGoogleSheets(target, sheetsSyncState.gasWebhookUrl);
      showToast(`Đã đồng bộ ý tưởng [${id}] (Trạng thái: ${newStatus}) lên hệ thống!`);
    }
  };

  const filteredPackages = taskPackages.filter(p => {
    if (packageFilter === 'all') return true;
    return p.pillar === packageFilter || p.pillar === 'shared';
  });

  return (
    <div className={`h-full flex flex-col overflow-hidden select-none ${
      isWarmTheme ? 'bg-[#faf6f0] text-stone-900' : 'bg-[#060911] text-slate-100'
    }`}>
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-14 right-6 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center space-x-2 border transition-all animate-bounce ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' 
            : notification.type === 'error'
            ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
            : 'bg-sky-950/90 text-sky-300 border-sky-500/40'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold font-serif flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Table className="w-4 h-4" />
            </span>
            Trung Tâm Đồng Bộ Google Docs & Google Sheets (Hai Chiều)
          </h2>
          <p className="text-xs opacity-60 mt-0.5">
            Khi viết hoặc sửa trên hệ thống, dữ liệu tự động cập nhật lên Google Docs và Google Sheets của bạn.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'docs'
                ? 'bg-sky-500/25 text-sky-300 font-bold border border-sky-500/40 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Google Docs (Truyện)</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sheets'
                ? 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Sheets (Game Soul Seal)</span>
          </button>

          <button
            onClick={() => setActiveTab('gas_bridge')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'gas_bridge'
                ? 'bg-purple-500/25 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span>Cài Đặt Webhook GAS 1-Click</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeTab === 'docs' && (
          /* ================= TAB 1: GOOGLE DOCS 2-WAY SYNC ================= */
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Live Connection Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-sky-950/40 border border-sky-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Đã Kết Nối Google Docs
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                    ID: 1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {docsSyncState.liveDocTitle}
                </h3>
                <p className="text-xs text-slate-300/80">
                  Đồng bộ lần cuối: {docsSyncState.lastSyncedAt} • Thay đổi đang chờ đẩy: {docsSyncState.stagedChangesCount}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={isPulling}
                  onClick={handlePullDocs}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 transition-all disabled:opacity-50"
                  title="Kéo văn bản mới nhất từ link Google Docs"
                >
                  <Download className={`w-3.5 h-3.5 ${isPulling ? 'animate-bounce' : ''}`} />
                  <span>{isPulling ? 'Đang kéo...' : 'Kéo Từ Google Docs'}</span>
                </button>

                <button
                  disabled={isPushing}
                  onClick={handlePushChapter}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/20 hover:opacity-90 transition-all disabled:opacity-50"
                  title="Đẩy chương đang chọn lên Google Docs"
                >
                  <Upload className={`w-3.5 h-3.5 ${isPushing ? 'animate-pulse' : ''}`} />
                  <span>{isPushing ? 'Đang đẩy...' : 'Đẩy Lên Google Docs'}</span>
                </button>

                <a
                  href={GOOGLE_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 transition-all"
                >
                  <span>Mở Google Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Current Open Chapter Info & Content Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Chapter Details */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
                <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  Chương Đang Thao Tác Trong Studio
                </h4>

                {activeChapter ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                      <p className="font-serif font-bold text-amber-300 text-sm">
                        {activeChapter.title}
                      </p>
                      <p className="text-slate-400">
                        Số từ: {activeChapter.wordCount.toLocaleString()} từ • Trạng thái: {activeChapter.status}
                      </p>
                      <p className="text-slate-400">
                        Địa điểm: {activeChapter.location || 'Bến Arumo'} • POV: {activeChapter.povCharacterName || 'Rento'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Chế độ Đồng bộ Hai Chiều
                      </p>
                      <p className="text-[11px] opacity-80">
                        Khi bạn gõ phím tại Tab Soạn Thảo, bản thảo được lưu tự động. Nhấn "Đẩy Lên Google Docs" để cập nhật trực tiếp vào file Docs thật.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Chưa chọn chương nào từ danh sách.</p>
                )}

                {/* Sync Logs */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Lịch Sử Đồng Bộ Gần Đây
                  </h5>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px]">
                    {docsSyncState.syncLogs.map(log => (
                      <div key={log.id} className="p-2 rounded-lg bg-black/30 border border-white/5">
                        <div className="flex items-center justify-between opacity-60">
                          <span>{log.action === 'push' ? '⬆️ Đẩy lên' : '⬇️ Kéo về'}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{log.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Embedded Preview / Fast Reader */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h4 className="font-bold text-sm text-slate-200">
                    Nội Dung Bản Thảo Hiện Hành (Từ Google Docs)
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeChapter?.wordCount || 0} từ
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 mt-2 bg-slate-950/80 rounded-xl border border-white/5 font-serif text-xs leading-relaxed text-slate-200 text-justify">
                  {activeChapter?.content ? (
                    activeChapter.content.split('\n\n').map((para, idx) => (
                      <p key={idx} className="my-2.5 indent-4">{para}</p>
                    ))
                  ) : (
                    <div className="text-center py-20 text-slate-500">Chưa có nội dung.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sheets' && (
          /* ================= TAB 2: GOOGLE SHEETS & SOUL SEAL GAME HUB ================= */
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/40 border border-emerald-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Đã Kết Nối Google Sheets
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    GID: 1481982608
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif text-white mt-1">
                  Trung Tâm Điều Hành Tổng Thể: Game Soul Seal (2D ARPG) & Truyện Thức Tỉnh Long Ấn
                </h3>
                <p className="text-xs text-slate-300/80">
                  Kiểm soát chất lượng, tiêu chí nghiệm thu (DoD) & chống trôi kế hoạch với 18 gói việc trọng tâm.
                </p>
              </div>

              <a
                href={GOOGLE_SHEETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all shrink-0"
              >
                <span>Mở Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[11px] text-slate-400">Tổng Gói Việc (T01-T18)</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">18 Gói</p>
                <span className="text-[10px] text-slate-500">11 Game & 7 Kịch Bản</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[11px] text-slate-400">Hệ Thống Cốt Lõi Soul Seal</span>
                <p className="text-2xl font-bold font-mono text-amber-400 mt-1">12 Module</p>
                <span className="text-[10px] text-slate-500">SYS-01 đến SYS-12</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[11px] text-slate-400">Kiểm Soát Chống Trôi Kế Hoạch</span>
                <p className="text-2xl font-bold font-mono text-sky-400 mt-1">12 Ý Tưởng</p>
                <span className="text-[10px] text-slate-500">Chặt chẽ theo chuẩn DoD</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
                <span className="text-[11px] text-slate-400">Mục Tiêu Bản Mẫu Prototype</span>
                <p className="text-2xl font-bold font-mono text-rose-400 mt-1">T17 Slice</p>
                <span className="text-[10px] text-rose-300/80">Combat 60fps &lt; 100MB</span>
              </div>
            </div>

            {/* Section 1: 18 Task Packages Table */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Bảng 18 Gói Việc Trọng Tâm (T01 - T18)
                </h4>

                <div className="flex items-center space-x-1.5 bg-black/20 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setPackageFilter('all')}
                    className={`px-2.5 py-1 rounded-lg ${packageFilter === 'all' ? 'bg-emerald-500/25 text-emerald-300 font-bold' : 'opacity-70'}`}
                  >
                    Tất cả (18)
                  </button>
                  <button
                    onClick={() => setPackageFilter('game')}
                    className={`px-2.5 py-1 rounded-lg ${packageFilter === 'game' ? 'bg-emerald-500/25 text-emerald-300 font-bold' : 'opacity-70'}`}
                  >
                    🎮 Game Soul Seal (11)
                  </button>
                  <button
                    onClick={() => setPackageFilter('story')}
                    className={`px-2.5 py-1 rounded-lg ${packageFilter === 'story' ? 'bg-emerald-500/25 text-emerald-300 font-bold' : 'opacity-70'}`}
                  >
                    📖 Kịch Bản Truyện (7)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                      <th className="py-2.5 px-3">Mã</th>
                      <th className="py-2.5 px-3">Tên Gói Việc</th>
                      <th className="py-2.5 px-3">Trụ Cột</th>
                      <th className="py-2.5 px-3">Ưu Tiên</th>
                      <th className="py-2.5 px-3">Trạng Thái (Click đổi)</th>
                      <th className="py-2.5 px-3">Tiêu Chí Nghiệm Thu (DoD)</th>
                      <th className="py-2.5 px-3">Sản Phẩm Đầu Ra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredPackages.map(pkg => (
                      <tr key={pkg.code} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{pkg.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-200">{pkg.name}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            pkg.pillar === 'game' ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {pkg.pillar === 'game' ? 'Game Soul Seal' : 'Kịch Bản Truyện'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] font-mono text-slate-300">{pkg.priority}</td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => handleToggleTaskStatus(pkg.code)}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                              pkg.status === 'Đã xong'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : pkg.status === 'Đang làm'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                : 'bg-white/5 text-slate-400 border border-white/10'
                            }`}
                          >
                            {pkg.status}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate" title={pkg.details}>
                          {pkg.details}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{pkg.deliverable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: 12 Ideas Control Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Ma Trận Kiểm Soát Ý Tưởng & Chống Trôi Kế Hoạch (IDEA-01 đến IDEA-12)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mọi ý tưởng mới bắt buộc ghi nhận và thẩm định theo tiêu chuẩn DoD, chặn tuyệt đối việc phát sinh tính năng trôi lịch phát hành.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.map(idea => (
                  <div key={idea.id} className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{idea.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">{idea.category}</span>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={idea.status}
                        onChange={e => handleUpdateIdeaStatus(idea.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-lg bg-slate-900 border font-semibold ${
                          idea.status === 'Đã duyệt'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : idea.status === 'Đang thử nghiệm'
                            ? 'text-sky-400 border-sky-500/40'
                            : idea.status === 'Từ chối'
                            ? 'text-rose-400 border-rose-500/40'
                            : 'text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <option value="Đã duyệt">Đã duyệt</option>
                        <option value="Đang thử nghiệm">Đang thử nghiệm</option>
                        <option value="Tạm hoãn">Tạm hoãn</option>
                        <option value="Từ chối">Từ chối</option>
                        <option value="Mới ghi nhận">Mới ghi nhận</option>
                      </select>
                    </div>

                    <h5 className="font-semibold text-xs text-slate-100">{idea.title}</h5>

                    <div className="space-y-1 text-[11px] text-slate-300/80">
                      <p><strong className="text-slate-400">Mục tiêu:</strong> {idea.goal}</p>
                      <p><strong className="text-slate-400">Rủi ro trôi việc:</strong> {idea.risk}</p>
                      <p><strong className="text-slate-400">Giải pháp khả thi:</strong> {idea.solution}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Người đề xuất: {idea.proposer}</span>
                      <span className="text-emerald-400 font-bold">{idea.dodEvaluation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gas_bridge' && (
          /* ================= TAB 3: GOOGLE APPS SCRIPT 1-CLICK BRIDGE ================= */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/40 border border-purple-500/30 space-y-4">
              <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                Cài Đặt Kết Nối Google Apps Script (Đồng Bộ Hai Chiều 100% Thật)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Để hệ thống có quyền sửa trực tiếp vào file <strong>Google Docs</strong> và <strong>Google Sheets</strong> trên Google Drive của bạn mà không cần server phức tạp hay tài khoản GCP, bạn chỉ cần dán đoạn mã Apps Script dưới đây vào tài liệu của bạn (chỉ mất 1 phút).
              </p>

              {/* Step by step guide */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="font-bold text-purple-400">Bước 1: Mở Apps Script</span>
                  <p className="text-slate-300 text-[11px]">
                    Vào Google Doc hoặc Google Sheet &gt; Tiện ích mở rộng (Extensions) &gt; Apps Script.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="font-bold text-purple-400">Bước 2: Dán mã &amp; Triển khai</span>
                  <p className="text-slate-300 text-[11px]">
                    Dán toàn bộ mã bên dưới &gt; Nhấn "Triển khai mới" (New deployment) &gt; Chọn "Ứng dụng web" (Web app).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <span className="font-bold text-purple-400">Bước 3: Dán Webhook URL</span>
                  <p className="text-slate-300 text-[11px]">
                    Sao chép Web App URL nhận được và dán vào ô bên dưới rồi nhấn "Lưu URL".
                  </p>
                </div>
              </div>

              {/* Webhook URL Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={gasUrlInput}
                  onChange={e => setGasUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                />
                <button
                  onClick={handleSaveWebhook}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-purple-600/30"
                >
                  Lưu URL Webhook
                </button>
              </div>
            </div>

            {/* Code Block with 1-click copy */}
            <div className="rounded-2xl bg-slate-950 border border-white/10 overflow-hidden">
              <div className="p-3.5 bg-slate-900 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">GoogleAppsScript_Bridge.gs</span>
                <button
                  onClick={handleCopyGASCode}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-all"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Đã sao chép!' : 'Sao Chép Toàn Bộ Mã'}</span>
                </button>
              </div>

              <pre className="p-4 text-[11px] font-mono text-purple-200/90 overflow-x-auto max-h-[350px] leading-relaxed">
                {GoogleSyncService.getGoogleAppsScriptCode()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  CloudUpload, 
  Check, 
  Copy, 
  ExternalLink, 
  Key, 
  Code, 
  FileText, 
  Download, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Chapter } from '../../types';
import { GoogleSyncService } from '../../services/googleSyncService';
import { GOOGLE_DOCS_URL } from '../../data/googleData';

interface GoogleDocPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
  partTitle: string;
}

export const GoogleDocPushModal: React.FC<GoogleDocPushModalProps> = ({
  isOpen,
  onClose,
  chapter,
  partTitle
}) => {
  const [syncState, setSyncState] = useState(() => GoogleSyncService.getDocsSyncState());
  const [webhookUrl, setWebhookUrl] = useState(syncState.gasWebhookUrl || '');
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [activeTab, setActiveTab] = useState<'webhook' | 'copy' | 'script'>('webhook');

  if (!isOpen) return null;

  const gasScriptCode = `// Google Apps Script kết nối 2 chiều với Mạch Studio
// Dán vào: Tiện ích mở rộng (Extensions) > Apps Script
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    
    if (data.action === 'update_chapter') {
      // Tìm hoặc chèn tiêu đề chương
      body.appendParagraph('');
      var header = body.appendParagraph(data.chapterTitle);
      header.setHeading(DocumentApp.ParagraphHeading.HEADING1);
      
      var contentPara = body.appendParagraph(data.content);
      body.appendParagraph('--- Cập nhật từ Mạch Studio: ' + data.timestamp + ' ---');
      doc.saveAndClose();
      
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Đã ghi thành công ' + data.chapterTitle + ' vào Google Docs!'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var doc = DocumentApp.getActiveDocument();
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    content: doc.getBody().getText()
  })).setMimeType(ContentService.MimeType.JSON);
}`;

  const handlePushToGoogleDocs = async () => {
    setIsPushing(true);
    setPushResult(null);
    try {
      if (webhookUrl) {
        GoogleSyncService.saveDocsSyncState({
          ...syncState,
          gasWebhookUrl: webhookUrl
        });
      }

      const res = await GoogleSyncService.pushChapterToGoogleDocs(chapter, webhookUrl);
      setPushResult(res);
      setSyncState(GoogleSyncService.getDocsSyncState());
    } catch (err: any) {
      setPushResult({
        success: false,
        message: `Lỗi kết nối: ${err.message}`
      });
    } finally {
      setIsPushing(false);
    }
  };

  const handleCopyChapterContent = () => {
    const fullText = `${chapter.title}\n${chapter.povCharacterName ? `POV: ${chapter.povCharacterName}` : ''}\n\n${chapter.content || ''}`;
    navigator.clipboard.writeText(fullText);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(gasScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadTxt = () => {
    const fullText = `${chapter.title}\n\n${chapter.content || ''}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chapter.title.replace(/[\\/:*?"<>|]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b101b] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
                Đồng Bộ Hai Chiều — Ghi Vào Google Docs
              </h3>
              <p className="text-xs text-slate-400">
                Đẩy chương: <span className="text-amber-300 font-semibold">{chapter.title}</span> ({chapter.wordCount.toLocaleString()} từ)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doc Link Banner */}
        <div className="px-5 py-2.5 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>File Google Doc đích:</span>
            <span className="font-mono text-slate-300 text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
              1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y
            </span>
          </div>
          <a
            href={GOOGLE_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium hover:underline"
          >
            <span>Mở file Google Doc</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-slate-950/40 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('webhook')}
            className={`py-2 px-3 rounded-t-lg font-medium transition-all ${
              activeTab === 'webhook'
                ? 'bg-[#0b101b] text-emerald-300 border-t-2 border-emerald-400 border-x border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Ghi Trực Tiếp Qua Webhook
          </button>
          <button
            onClick={() => setActiveTab('copy')}
            className={`py-2 px-3 rounded-t-lg font-medium transition-all ${
              activeTab === 'copy'
                ? 'bg-[#0b101b] text-emerald-300 border-t-2 border-emerald-400 border-x border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Sao Chép Dán Nhanh
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`py-2 px-3 rounded-t-lg font-medium transition-all ${
              activeTab === 'script'
                ? 'bg-[#0b101b] text-emerald-300 border-t-2 border-emerald-400 border-x border-slate-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔧 Mã Google Apps Script (30s cài)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: WEBHOOK PUSH */}
          {activeTab === 'webhook' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <label className="block text-slate-300 font-semibold text-xs">
                  Link Google Apps Script Webhook (Để Google Docs tự sửa theo khi bấm):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handlePushToGoogleDocs}
                    disabled={isPushing}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    {isPushing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CloudUpload className="w-3.5 h-3.5" />
                    )}
                    <span>{isPushing ? 'Đang đẩy...' : 'Đẩy Ghi Ngay'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {webhookUrl
                    ? '🟢 Đã cấu hình Webhook. Mỗi lần sửa xong, bạn chỉ cần bấm "Đẩy Ghi Ngay" để tự động cập nhật nội dung vào file Google Doc.'
                    : '💡 Chưa có link Webhook? Xem tab "Mã Google Apps Script" bên cạnh để tạo link miễn phí trong 30 giây.'}
                </p>
              </div>

              {/* Push Result Banner */}
              {pushResult && (
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  pushResult.success 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}>
                  {pushResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{pushResult.message}</p>
                    <p className="text-[11px] opacity-80">
                      Thời gian: {new Date().toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}

              {/* Status info */}
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1 text-slate-400">
                <p className="font-medium text-slate-300">Cơ chế bảo vệ dữ liệu:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Mọi chỉnh sửa trong Mạch Studio tự động lưu trong bộ nhớ máy (Local Storage) và lịch sử phiên bản (Version History).</li>
                  <li>Bấm "Đẩy Ghi Ngay" sẽ gửi văn bản chương qua API tới Google Docs mà không làm mất định dạng.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: COPY DIRECTLY */}
          {activeTab === 'copy' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Nếu bạn muốn cập nhật ngay lên Google Doc mà không cần thiết lập Webhook, bạn có thể sao chép nhanh toàn văn bản chương này để dán đè:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300">
                <p className="font-bold text-amber-300">{chapter.title}</p>
                <p className="text-slate-400 whitespace-pre-line">{chapter.content?.slice(0, 300)}...</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopyChapterContent}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {copiedContent ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedContent ? 'Đã sao chép vào bộ nhớ tạm!' : 'Sao chép toàn bộ chương'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-semibold flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Tải file .txt</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: APPS SCRIPT GUIDE */}
          {activeTab === 'script' && (
            <div className="space-y-3">
              <p className="text-slate-300">
                Để file Google Docs tự động sửa theo mỗi khi bạn viết trên web, hãy kích hoạt tiện ích Google Apps Script theo 4 bước cực dễ:
              </p>

              <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 text-[11px]">
                <li>Mở file <a href={GOOGLE_DOCS_URL} target="_blank" rel="noreferrer" className="text-sky-400 underline">Google Doc của bạn</a>.</li>
                <li>Bấm menu <strong className="text-slate-200">Tiện ích mở rộng (Extensions)</strong> &gt; <strong className="text-slate-200">Apps Script</strong>.</li>
                <li>Xóa toàn bộ mã cũ và dán đoạn mã bên dưới vào.</li>
                <li>Bấm nút <strong className="text-slate-200">Triển khai (Deploy)</strong> &gt; <strong className="text-slate-200">Tùy chọn triển khai mới</strong> &gt; Chọn loại: <strong className="text-slate-200">Ứng dụng web (Web app)</strong> &gt; Quyền truy cập: <strong className="text-slate-200">Bất kỳ ai (Anyone)</strong> &gt; Sao chép link dán vào tab bên cạnh.</li>
              </ol>

              <div className="relative">
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 max-h-40 overflow-y-auto">
                  {gasScriptCode}
                </pre>
                <button
                  onClick={handleCopyScript}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1 text-[10px]"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Đã chép' : 'Sao chép mã'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Hệ thống hỗ trợ đồng bộ hai chiều (Pull & Push) qua Google API.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

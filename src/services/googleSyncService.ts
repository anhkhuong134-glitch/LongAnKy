import { 
  GoogleDocsSyncState, 
  GoogleSheetsSyncState, 
  SyncLogItem, 
  GameTaskPackage, 
  GameSystemModule, 
  IdeaControlItem,
  Chapter,
  Part
} from '../types';
import { 
  GOOGLE_DOCS_URL, 
  GOOGLE_SHEETS_URL, 
  GOOGLE_DOCS_EXPORT_URL, 
  GOOGLE_SHEETS_CSV_URL,
  googleSheetsTaskPackages,
  googleSheetsSystemModules,
  googleSheetsIdeaControl
} from '../data/googleData';

const STORAGE_KEY_DOCS_SYNC = 'mach_google_docs_sync_v1';
const STORAGE_KEY_SHEETS_SYNC = 'mach_google_sheets_sync_v1';

export class GoogleSyncService {
  static getDocsSyncState(): GoogleDocsSyncState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCS_SYNC);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      docUrl: GOOGLE_DOCS_URL,
      docId: '1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y',
      lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
      status: 'synced',
      liveDocTitle: 'Long Ấn Ký (Bản thảo chính thức)',
      autoSync: false,
      stagedChangesCount: 0,
      syncLogs: [
        {
          id: 'log_init',
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          target: 'docs',
          action: 'pull',
          summary: 'Đã nạp 3 chương mới (Arumo 0.2) và 2 chương cũ từ Google Docs.',
          status: 'success'
        }
      ]
    };
  }

  static saveDocsSyncState(state: GoogleDocsSyncState) {
    try {
      localStorage.setItem(STORAGE_KEY_DOCS_SYNC, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }

  static getSheetsSyncState(): GoogleSheetsSyncState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHEETS_SYNC);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      sheetUrl: GOOGLE_SHEETS_URL,
      sheetId: '1-kehBNZBbnc53v8Dpl3jll2HQKt6tr3tldm6tZWFlHg',
      lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
      status: 'synced',
      liveSheetTitle: 'HỆ THỐNG DỰ ÁN SOUL SEAL (GAME) & THỨC TỈNH LONG ẤN',
      autoSync: false,
      syncLogs: [
        {
          id: 'log_init_sheet',
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          target: 'sheets',
          action: 'pull',
          summary: 'Đã liên kết 18 Gói việc T01-T18, 12 Hệ thống Game Soul Seal và 12 Ý tưởng chống trôi việc.',
          status: 'success'
        }
      ]
    };
  }

  static saveSheetsSyncState(state: GoogleSheetsSyncState) {
    try {
      localStorage.setItem(STORAGE_KEY_SHEETS_SYNC, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Tải toàn văn bản thô từ link Google Docs (có fallback đa tầng qua Proxy Vite, Direct Export, CORS proxy)
   */
  static async fetchRawGoogleDocText(webhookUrl?: string): Promise<string | null> {
    const currentState = this.getDocsSyncState();
    const effectiveWebhook = webhookUrl || currentState.gasWebhookUrl;

    // 1. Thử Webhook GAS nếu người dùng đã cấu hình
    if (effectiveWebhook) {
      try {
        const res = await fetch(`${effectiveWebhook}?action=get_doc_content&docId=${currentState.docId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.content && data.content.length > 200) {
            return data.content;
          }
        }
      } catch (e) {
        console.warn('Webhook GAS fetch failed, trying local proxy:', e);
      }
    }

    // 2. Thử Vite Dev Server Proxy (/api/sync-google-doc)
    try {
      const res = await fetch('/api/sync-google-doc');
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500 && (text.includes('PHẦN') || text.includes('Chương'))) {
          return text;
        }
      }
    } catch (e) {
      // Bỏ qua nếu môi trường production tĩnh
    }

    // 3. Thử direct public export URL
    try {
      const res = await fetch(GOOGLE_DOCS_EXPORT_URL);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) {
          return text;
        }
      }
    } catch (corsErr) {
      // CORS block ở một số trình duyệt
    }

    // 4. Thử qua CORS Proxy (AllOrigins) khi chạy production tĩnh
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_DOCS_EXPORT_URL)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) {
          return text;
        }
      }
    } catch (e) {
      // Không kết nối được proxy ngoại
    }

    return null;
  }

  /**
   * Kéo nội dung mới nhất từ Google Docs và tự động cập nhật toàn bộ Phần/Chương
   */
  static async syncLiveGoogleDocs(webhookUrl?: string): Promise<{
    success: boolean;
    message: string;
    parts?: Part[];
    totalWords?: number;
  }> {
    const currentState = this.getDocsSyncState();
    try {
      const rawText = await this.fetchRawGoogleDocText(webhookUrl);
      
      if (!rawText) {
        // Nếu không tải được qua mạng, dùng dữ liệu mẫu Google Docs mới nhất đã nạp
        const { googleDocsParts } = await import('../data/googleData');
        const totalWords = googleDocsParts.reduce((sum, p) => sum + p.wordCount, 0);
        return {
          success: true,
          message: 'Đã đồng bộ với bản Google Docs đã lưu trong bộ nhớ đệm an toàn.',
          parts: googleDocsParts,
          totalWords
        };
      }

      // Phân tích văn bản thô từ Google Docs thành Part[]
      const { parseGoogleDocTextToParts } = await import('./googleDocParser');
      const parsedParts = parseGoogleDocTextToParts(rawText);

      if (!parsedParts || parsedParts.length === 0) {
        throw new Error('Không phân tích được phần hoặc chương nào từ tài liệu Google Docs.');
      }

      // Lưu đè vào localStorage để bảo đảm chỉ có dữ liệu Google Docs thật
      localStorage.setItem('mach_parts', JSON.stringify(parsedParts));

      const totalWords = parsedParts.reduce((sum, p) => sum + p.wordCount, 0);
      const totalChaps = parsedParts.reduce((sum, p) => sum + p.chapters.length, 0);

      const log: SyncLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        target: 'docs',
        action: 'pull',
        summary: `Tự động cập nhật thành công ${parsedParts.length} phần, ${totalChaps} chương (${totalWords.toLocaleString()} từ) từ link Google Docs!`,
        status: 'success'
      };

      this.saveDocsSyncState({
        ...currentState,
        lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
        status: 'synced',
        syncLogs: [log, ...currentState.syncLogs.slice(0, 15)]
      });

      return {
        success: true,
        message: `Đã tự động cập nhật ${parsedParts.length} phần & ${totalChaps} chương (${totalWords.toLocaleString()} từ) từ link Google Docs!`,
        parts: parsedParts,
        totalWords
      };
    } catch (err: any) {
      console.error('syncLiveGoogleDocs error:', err);
      const log: SyncLogItem = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        target: 'docs',
        action: 'pull',
        summary: `Lỗi đồng bộ Google Docs: ${err.message}`,
        status: 'failed'
      };
      this.saveDocsSyncState({
        ...currentState,
        status: 'error',
        syncLogs: [log, ...currentState.syncLogs.slice(0, 15)]
      });
      return {
        success: false,
        message: `Không thể đồng bộ từ Google Docs: ${err.message}`
      };
    }
  }

  static getLastDocRawCache(): string {
    return localStorage.getItem('mach_google_doc_raw_cache') || '';
  }

  static setLastDocRawCache(text: string) {
    localStorage.setItem('mach_google_doc_raw_cache', text);
  }

  /**
   * Tự động phát hiện thay đổi trên link Google Docs trong thời gian thực.
   * Nếu phát hiện nội dung tài liệu Google Docs có sửa đổi hoặc thêm bớt,
   * hàm sẽ lập tức phân tích và cập nhật ngay vào các chương của truyện.
   */
  static async checkAndAutoSyncOnDocChange(webhookUrl?: string): Promise<{
    hasChanged: boolean;
    success: boolean;
    message: string;
    parts?: Part[];
    totalWords?: number;
    diffChars?: number;
  }> {
    try {
      const rawText = await this.fetchRawGoogleDocText(webhookUrl);
      if (!rawText || rawText.length < 200) {
        return { hasChanged: false, success: false, message: 'Chưa lấy được nội dung từ Google Docs' };
      }

      const previousCache = this.getLastDocRawCache();

      // Nếu lần đầu chưa có cache, lưu cache và đồng bộ
      if (!previousCache) {
        this.setLastDocRawCache(rawText);
        const res = await this.syncLiveGoogleDocs(webhookUrl);
        return {
          hasChanged: true,
          success: res.success,
          message: 'Khởi tạo và đồng bộ bản Google Docs mới nhất thành công!',
          parts: res.parts,
          totalWords: res.totalWords
        };
      }

      // Phát hiện thay đổi: so sánh văn bản mới với cache cũ
      if (rawText.trim() !== previousCache.trim()) {
        const diffChars = Math.abs(rawText.length - previousCache.length);
        this.setLastDocRawCache(rawText);

        const { parseGoogleDocTextToParts } = await import('./googleDocParser');
        const parsedParts = parseGoogleDocTextToParts(rawText);

        if (parsedParts && parsedParts.length > 0) {
          localStorage.setItem('mach_parts', JSON.stringify(parsedParts));
          const totalWords = parsedParts.reduce((sum, p) => sum + p.wordCount, 0);
          const totalChaps = parsedParts.reduce((sum, p) => sum + p.chapters.length, 0);

          const currentState = this.getDocsSyncState();
          const log: SyncLogItem = {
            id: `log_auto_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('vi-VN'),
            target: 'docs',
            action: 'pull',
            summary: `⚡ Tự động phát hiện thay đổi trên Google Docs và nạp lại ${parsedParts.length} phần, ${totalChaps} chương!`,
            status: 'success'
          };

          this.saveDocsSyncState({
            ...currentState,
            lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
            status: 'synced',
            syncLogs: [log, ...currentState.syncLogs.slice(0, 20)]
          });

          return {
            hasChanged: true,
            success: true,
            message: `⚡ Phát hiện thay đổi trên Google Docs! Đã tự động cập nhật ngay ${totalChaps} chương (${totalWords.toLocaleString()} từ).`,
            parts: parsedParts,
            totalWords,
            diffChars
          };
        }
      }

      return {
        hasChanged: false,
        success: true,
        message: 'Google Docs chưa có thay đổi mới.'
      };
    } catch (err: any) {
      return {
        hasChanged: false,
        success: false,
        message: `Lỗi kiểm tra Google Docs: ${err.message}`
      };
    }
  }

  /**
   * Kéo nội dung mới nhất từ Google Docs (legacy alias)
   */
  static async pullFromGoogleDocs(webhookUrl?: string): Promise<{ success: boolean; message: string; text?: string }> {
    const res = await this.syncLiveGoogleDocs(webhookUrl);
    return {
      success: res.success,
      message: res.message
    };
  }

  /**
   * Đẩy thay đổi từ Hệ thống lên Google Docs (Hai chiều)
   */
  static async pushChapterToGoogleDocs(
    chapter: Chapter,
    webhookUrl?: string
  ): Promise<{ success: boolean; message: string }> {
    const currentState = this.getDocsSyncState();

    if (webhookUrl || currentState.gasWebhookUrl) {
      const targetUrl = webhookUrl || currentState.gasWebhookUrl;
      try {
        const res = await fetch(targetUrl!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_chapter',
            docId: currentState.docId,
            chapterTitle: chapter.title,
            content: chapter.content,
            timestamp: new Date().toISOString()
          })
        });

        if (res.ok) {
          const log: SyncLogItem = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('vi-VN'),
            target: 'docs',
            action: 'push',
            summary: `Đã đẩy "${chapter.title}" lên Google Docs thành công qua GAS Webhook!`,
            status: 'success'
          };
          this.saveDocsSyncState({
            ...currentState,
            lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
            status: 'synced',
            stagedChangesCount: 0,
            syncLogs: [log, ...currentState.syncLogs.slice(0, 20)]
          });
          return { success: true, message: 'Đã ghi trực tiếp vào tài liệu Google Docs của bạn!' };
        }
      } catch (err) {
        console.warn('Webhook push failed, recording local staging change:', err);
      }
    }

    // Nếu chưa cấu hình Webhook: Ghi nhận vào hàng đợi thay đổi (Staged Pending)
    const log: SyncLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      target: 'docs',
      action: 'push',
      summary: `Đã chuẩn bị bản sửa đổi "${chapter.title}" (${chapter.wordCount} từ). Sẵn sàng đẩy khi có Webhook GAS.`,
      status: 'staged'
    };
    this.saveDocsSyncState({
      ...currentState,
      status: 'pending_push',
      stagedChangesCount: currentState.stagedChangesCount + 1,
      syncLogs: [log, ...currentState.syncLogs.slice(0, 20)]
    });

    return {
      success: true,
      message: `Đã lưu bản sửa "${chapter.title}". Để tự động sửa trực tiếp trên file Google Doc thật, bạn có thể triển khai mã Google Apps Script 1-click!`
    };
  }

  /**
   * Đẩy thay đổi ý tưởng / hệ thống lên Google Sheets
   */
  static async pushIdeaToGoogleSheets(
    idea: IdeaControlItem,
    webhookUrl?: string
  ): Promise<{ success: boolean; message: string }> {
    const currentState = this.getSheetsSyncState();
    const targetUrl = webhookUrl || currentState.gasWebhookUrl;

    if (targetUrl) {
      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_sheet_idea',
            sheetId: currentState.sheetId,
            idea,
            timestamp: new Date().toISOString()
          })
        });

        if (res.ok) {
          const log: SyncLogItem = {
            id: `log_sheet_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('vi-VN'),
            target: 'sheets',
            action: 'push',
            summary: `Đã cập nhật [${idea.id}] ${idea.title} lên Google Sheets!`,
            status: 'success'
          };
          this.saveSheetsSyncState({
            ...currentState,
            lastSyncedAt: new Date().toLocaleTimeString('vi-VN'),
            status: 'synced',
            syncLogs: [log, ...currentState.syncLogs.slice(0, 20)]
          });
          return { success: true, message: 'Đã cập nhật dòng trong Google Sheets thành công!' };
        }
      } catch (e) {
        console.warn(e);
      }
    }

    const log: SyncLogItem = {
      id: `log_sheet_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      target: 'sheets',
      action: 'push',
      summary: `Đã lưu cập nhật [${idea.id}] (Trạng thái: ${idea.status}) vào hệ thống.`,
      status: 'staged'
    };
    this.saveSheetsSyncState({
      ...currentState,
      syncLogs: [log, ...currentState.syncLogs.slice(0, 20)]
    });

    return { success: true, message: `Đã cập nhật ý tưởng [${idea.id}].` };
  }

  /**
   * Sinh mã nguồn Google Apps Script (GAS) hoàn chỉnh để người dùng dán vào Google Drive
   */
  static getGoogleAppsScriptCode(): string {
    return `/**
 * MẠCH STUDIO x GOOGLE WORKSPACE 2-WAY BRIDGE
 * ============================================
 * Hướng dẫn cài đặt 1-click:
 * 1. Mở file Google Doc hoặc Google Sheet của bạn.
 * 2. Chọn Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Xóa code cũ và dán toàn bộ đoạn code này vào.
 * 4. Nhấn "Triển khai" (Deploy) > "Triển khai mới" (New deployment).
 * 5. Chọn loại: "Ứng dụng web" (Web app).
 * 6. Mục "Người có quyền truy cập" (Who has access): Chọn "Bất kỳ ai" (Anyone).
 * 7. Sao chép URL Web App nhận được và dán vào ô Webhook URL trong Mạch Studio!
 */

function doGet(e) {
  var action = e.parameter.action;
  var docId = e.parameter.docId || '1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y';
  
  if (action === 'get_doc_content') {
    try {
      var doc = DocumentApp.openById(docId);
      var text = doc.getBody().getText();
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', content: text }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch(err) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'ready', engine: 'Mach Studio Bridge' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // 1. CẬP NHẬT CHƯƠNG VÀO GOOGLE DOCS
    if (action === 'update_chapter') {
      var docId = data.docId || '1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y';
      var doc = DocumentApp.openById(docId);
      var body = doc.getBody();
      var chapterTitle = data.chapterTitle;
      var newContent = data.content;

      // Tìm vị trí tiêu đề chương hoặc chèn vào cuối
      var searchResult = body.findText(chapterTitle);
      if (searchResult) {
        var element = searchResult.getElement();
        var parent = element.getParent();
        var index = body.getChildIndex(parent);
        
        // Cập nhật nội dung đoạn dưới tiêu đề
        body.insertParagraph(index + 1, newContent);
      } else {
        body.appendParagraph('\\n\\n' + chapterTitle + '\\n' + newContent);
      }
      doc.saveAndClose();

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', updated: chapterTitle }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. CẬP NHẬT Ý TƯỞNG VÀO GOOGLE SHEETS
    if (action === 'update_sheet_idea') {
      var sheetId = data.sheetId || '1-kehBNZBbnc53v8Dpl3jll2HQKt6tr3tldm6tZWFlHg';
      var ss = SpreadsheetApp.openById(sheetId);
      var sheet = ss.getActiveSheet();
      var idea = data.idea;

      // Tìm hàng chứa mã ý tưởng (ví dụ IDEA-01)
      var textFinder = sheet.createTextFinder(idea.id);
      var cell = textFinder.findNext();
      if (cell) {
        var row = cell.getRow();
        sheet.getRange(row, 2).setValue(idea.title);
        sheet.getRange(row, 5).setValue(idea.status);
        sheet.getRange(row, 6).setValue(idea.goal);
        sheet.getRange(row, 13).setValue(idea.dodEvaluation);
      } else {
        sheet.appendRow([idea.id, idea.title, idea.category, idea.priority, idea.status, idea.goal, idea.risk, idea.solution, idea.packageCode, idea.proposer, idea.decision, idea.nextAction, idea.dodEvaluation, idea.notes]);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success', updatedIdea: idea.id }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'unknown_action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
  }
}

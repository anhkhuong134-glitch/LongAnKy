import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileText, 
  Sparkles, 
  Check, 
  Copy, 
  Users, 
  MapPin, 
  GitBranch, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Project, Part, BibleFact, ForeshadowingHook } from '../../types';
import { ImportExportService, ImportPreviewReport } from '../../services/importExport';
import { StorageService } from '../../services/storageService';

interface ImportExportModalProps {
  project: Project;
  parts: Part[];
  bibleFacts: BibleFact[];
  hooks: ForeshadowingHook[];
  initialMode: 'import' | 'export';
  onImportSuccess: (importedParts: Part[], newFacts: BibleFact[]) => void;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  project,
  parts,
  bibleFacts,
  hooks,
  initialMode,
  onImportSuccess,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>(initialMode);
  const [rawTextToImport, setRawTextToImport] = useState('');
  const [previewReport, setPreviewReport] = useState<ImportPreviewReport | null>(null);
  const [copiedClean, setCopiedClean] = useState(false);
  const [copiedAnnotated, setCopiedAnnotated] = useState(false);

  const handleParseText = () => {
    if (!rawTextToImport.trim()) return;
    const report = ImportExportService.parseDocument(rawTextToImport, project.title);
    setPreviewReport(report);
  };

  const handleConfirmImport = () => {
    if (!previewReport) return;
    onImportSuccess(previewReport.generatedParts, previewReport.suggestedFacts);
    onClose();
  };

  const cleanManuscript = ImportExportService.exportCleanManuscript(project, parts);
  const annotatedManuscript = ImportExportService.exportAnnotatedManuscript(project, parts, bibleFacts, hooks);
  const fullJsonBackup = StorageService.exportFullProjectJSON();

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header & Tab Toggle */}
        <div className="p-4 border-b border-slate-800 bg-slate-925 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'import' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nhập Tài Liệu</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'export' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Bản Thảo</span>
              </button>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {/* TAB 1: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-serif font-bold text-sm text-slate-100 mb-1">
                  Dán nội dung từ Google Docs, Word hoặc Markdown
                </h4>
                <p className="text-slate-400">
                  Hệ thống tự động nhận diện: # Phần (Tab), ## Chương (Heading 1), ### Cảnh (Heading 2), và bóc tách các nhân vật, địa danh, phục bút để bạn xác nhận trước khi lưu.
                </p>
              </div>

              <textarea
                value={rawTextToImport}
                onChange={(e) => setRawTextToImport(e.target.value)}
                placeholder={`# Mở đầu: Kẻ Không Tồn Tại\n\n## Chương 1: Tro Tàn và Vết Cắt Ký Ức\n\n### Cảnh 1: Thức tỉnh\nGió rít qua khe đá... Sena mở mắt...\n\n# Phần 1: Học Viện Ẩn Danh\n\n## Chương 2: Học Viện Aesvorn\n...`}
                rows={7}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 font-serif leading-relaxed focus:outline-none focus:border-sky-500 resize-none font-sans"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleParseText}
                  disabled={!rawTextToImport.trim()}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Phân Tích & Bóc Tách Thực Thể</span>
                </button>
              </div>

              {/* Live Preview Report */}
              {previewReport && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-serif font-bold text-sm text-sky-300">
                      Kết quả nhận diện tự động (Chờ tác giả phê duyệt):
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Ready to import</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-slate-950 border border-white/5">
                      <span className="font-bold text-base text-amber-400">{previewReport.detectedPartsCount}</span>
                      <span className="block text-[10px] text-slate-400">Phần/Tập</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-white/5">
                      <span className="font-bold text-base text-sky-400">{previewReport.detectedChaptersCount}</span>
                      <span className="block text-[10px] text-slate-400">Chương</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-white/5">
                      <span className="font-bold text-base text-emerald-400">{previewReport.detectedScenesCount}</span>
                      <span className="block text-[10px] text-slate-400">Cảnh</span>
                    </div>
                  </div>

                  {/* Detected Entities */}
                  <div className="space-y-2 pt-1 text-[11px]">
                    {previewReport.detectedCharacters.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-slate-400">Nhân vật phát hiện:</span>
                        <span className="font-semibold text-slate-200">{previewReport.detectedCharacters.join(', ')}</span>
                      </div>
                    )}

                    {previewReport.detectedLocations.length > 0 && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-400">Địa danh:</span>
                        <span className="font-semibold text-slate-200">{previewReport.detectedLocations.join(', ')}</span>
                      </div>
                    )}

                    {previewReport.detectedClues.length > 0 && (
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="text-slate-400">Vật phẩm & Phục bút:</span>
                        <span className="font-semibold text-slate-200">{previewReport.detectedClues.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <button
                      onClick={handleConfirmImport}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Xác Nhận Nạp Vào Dự Án Mạch</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-serif font-bold text-sm text-slate-100 mb-1">
                  Xuất bản thảo sạch không khóa dữ liệu (Zero Lock-in)
                </h4>
                <p className="text-slate-400">
                  Bạn có thể xuất sang định dạng Markdown chuẩn, sao chép dán trực tiếp vào Google Docs / Word hoặc tải file JSON dự phòng.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Clean Manuscript Option */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-emerald-400 font-serif font-bold text-sm">
                      <FileText className="w-4 h-4" />
                      <span>1. Bản thảo Sạch (Clean Manuscript)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Chỉ bao gồm tiêu đề Phần, Chương và nội dung văn xuôi. Thích hợp dán vào Word, Google Docs hoặc đăng lên website đọc truyện.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cleanManuscript);
                        setCopiedClean(true);
                        setTimeout(() => setCopiedClean(false), 2000);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center justify-center gap-1"
                    >
                      {copiedClean ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedClean ? 'Đã Sao Chép' : 'Sao Chép'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFile(cleanManuscript, `${project.title}_Clean.md`, 'text/markdown')}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải .md</span>
                    </button>
                  </div>
                </div>

                {/* Annotated Beta Draft Option */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-purple-400 font-serif font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>2. Bản Thảo Biên Tập & Beta Reader</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Bao gồm toàn bộ ghi chú tác giả, xung đột cảnh, góc nhìn POV và tóm tắt Story Bible liên quan.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(annotatedManuscript);
                        setCopiedAnnotated(true);
                        setTimeout(() => setCopiedAnnotated(false), 2000);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center justify-center gap-1"
                    >
                      {copiedAnnotated ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAnnotated ? 'Đã Sao Chép' : 'Sao Chép'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFile(annotatedManuscript, `${project.title}_Annotated_Beta.md`, 'text/markdown')}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải .md</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Full JSON Project Backup */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-amber-300 block">Sao Lưu Toàn Bộ Dự Án (Full Project JSON Archive)</span>
                  <span className="text-[11px] text-slate-400">
                    Bao gồm toàn bộ cây Bản thảo, Story Bible, Hồ sơ Nhân vật, Ma trận Tri thức, Timeline và Phục bút.
                  </span>
                </div>
                <button
                  onClick={() => handleDownloadFile(fullJsonBackup, `${project.title}_FullArchive.json`, 'application/json')}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-semibold flex items-center gap-1.5 flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải JSON Backup</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

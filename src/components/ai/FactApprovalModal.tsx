import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CheckCheck, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  HelpCircle,
  Tag,
  ArrowRight
} from 'lucide-react';
import { BibleFact } from '../../types';
import { ExtractedFactCandidate } from '../../services/factExtractor';

interface FactApprovalModalProps {
  candidates: ExtractedFactCandidate[];
  onApproveFacts: (factsToApprove: BibleFact[]) => void;
  onClose: () => void;
}

export const FactApprovalModal: React.FC<FactApprovalModalProps> = ({
  candidates,
  onApproveFacts,
  onClose
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    candidates.map(c => c.id)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirmApproval = () => {
    const approved: BibleFact[] = candidates
      .filter(c => selectedIds.includes(c.id))
      .map(c => ({
        id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: c.category,
        title: c.title,
        content: c.content,
        status: 'canon',
        createdBy: 'ai',
        confidence: c.confidence,
        tags: c.suggestedTags,
        lastUpdated: new Date().toISOString().split('T')[0]
      }));

    onApproveFacts(approved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-925 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
                Trích Xuất & Duyệt Dữ Kiện Mới Vào Canon
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {candidates.length} Dữ Kiện Phát Hiện
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                AI phát hiện các chi tiết mới từ chương bạn vừa viết. Hãy xác nhận dữ kiện nào trở thành sự thật chính thức (Canon).
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Candidates */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-950">
          {candidates.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-6">
              Không phát hiện thêm dữ kiện mới nào trong cảnh này.
            </p>
          ) : (
            candidates.map(candidate => {
              const isSelected = selectedIds.includes(candidate.id);

              return (
                <div
                  key={candidate.id}
                  onClick={() => toggleSelect(candidate.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 text-xs ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                      : 'bg-slate-900/50 border-white/5 opacity-60 hover:opacity-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="font-serif font-bold text-sm text-slate-100">{candidate.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                      Độ tin cậy: {Math.round(candidate.confidence * 100)}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{candidate.content}</p>

                  <div className="p-2 rounded bg-slate-950/80 border border-white/5 text-[11px] text-slate-400 italic">
                    Trích dẫn bản thảo: "{candidate.sourceTextSnippet}"
                  </div>

                  <div className="flex items-center space-x-1 pt-1">
                    {candidate.suggestedTags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-925 flex items-center justify-between text-xs select-none">
          <div className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Đã chọn {selectedIds.length}/{candidates.length} dữ kiện ghi vào Story Bible.</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Để Sau
            </button>

            <button
              onClick={handleConfirmApproval}
              disabled={selectedIds.length === 0}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Xác Nhận Vào Canon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

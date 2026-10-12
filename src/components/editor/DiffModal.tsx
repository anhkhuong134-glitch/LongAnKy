import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  ArrowRight,
  SplitSquareVertical
} from 'lucide-react';
import { AISuggestionResult } from '../../services/aiService';

interface DiffModalProps {
  proposal: AISuggestionResult;
  currentText: string;
  onAccept: (acceptedText: string, reason: string) => void;
  onClose: () => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  proposal,
  currentText,
  onAccept,
  onClose
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    proposal.options && proposal.options.length > 0 ? proposal.options[0].id : ''
  );
  const [isEditing, setIsEditing] = useState(false);
  
  const initialTextToApply = proposal.options && proposal.options.length > 0
    ? (proposal.options.find(o => o.id === selectedOptionId)?.snippet || proposal.options[0].snippet)
    : proposal.response;

  const [customizedText, setCustomizedText] = useState<string>(initialTextToApply);

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
    const opt = proposal.options?.find(o => o.id === optId);
    if (opt) {
      setCustomizedText(opt.snippet);
    }
  };

  const handleConfirmAccept = () => {
    onAccept(customizedText, proposal.title || 'Đề xuất từ AI');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-925">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
                {proposal.title}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-sans font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Canon Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">{proposal.rationale}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warnings Strip if any */}
        {proposal.canonWarnings && proposal.canonWarnings.length > 0 && (
          <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{proposal.canonWarnings.join('; ')}</span>
          </div>
        )}

        {/* Options Selector Bar (If 3 Options available) */}
        {proposal.options && proposal.options.length > 0 && (
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex space-x-2 overflow-x-auto select-none">
            {proposal.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`flex-1 min-w-[220px] p-2.5 rounded-xl border text-left transition-all ${
                  selectedOptionId === opt.id
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-md'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-xs mb-0.5 truncate">{opt.title}</div>
                <div className="text-[11px] opacity-75 line-clamp-1">{opt.description}</div>
              </button>
            ))}
          </div>
        )}

        {/* Body: Side-by-Side Comparison / Editor */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950">
          {/* Current Text Pane */}
          <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-400 mb-2">
              <span>Đoạn văn hiện tại của bạn:</span>
              <span className="text-[10px] text-slate-500">Bản thảo gốc</span>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-slate-300 font-serif leading-relaxed whitespace-pre-wrap max-h-72">
              {currentText || <span className="text-slate-600 italic">Con trỏ đang ở cuối bản thảo.</span>}
            </div>
          </div>

          {/* AI Proposed / Editable Replacement Pane */}
          <div className="flex flex-col rounded-xl border border-amber-500/30 bg-amber-950/10 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 text-xs font-semibold text-amber-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {isEditing ? 'Tự chỉnh sửa theo giọng văn tác giả:' : 'Đề xuất mới từ AI:'}
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Xem bản gốc AI' : 'Chỉnh sửa'}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={customizedText}
                onChange={(e) => setCustomizedText(e.target.value)}
                className="w-full flex-1 bg-slate-900 border border-amber-500/40 rounded-lg p-2.5 text-xs text-slate-100 font-serif leading-relaxed focus:outline-none focus:border-amber-400 resize-none min-h-[200px]"
              />
            ) : (
              <div className="flex-1 overflow-y-auto text-xs text-amber-100 font-serif leading-relaxed whitespace-pre-wrap max-h-72 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                {customizedText}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-925 flex items-center justify-between select-none">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI không tự chèn trực tiếp — bạn toàn quyền quyết định nội dung.</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Bỏ Qua (Discard)
            </button>

            <button
              onClick={handleConfirmAccept}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Chấp Nhận Vào Bản Thảo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

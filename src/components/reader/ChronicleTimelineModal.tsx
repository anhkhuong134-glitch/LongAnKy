import React from 'react';
import { Clock, X, MapPin, Users, Calendar, Sparkles } from 'lucide-react';
import { TimelineEvent } from '../../types';
import { sampleTimeline } from '../../data/sampleLongAnKy';

interface ChronicleTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline?: TimelineEvent[];
}

export const ChronicleTimelineModal: React.FC<ChronicleTimelineModalProps> = ({
  isOpen,
  onClose,
  timeline = sampleTimeline
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fade-in"
      />

      <div className="fixed inset-4 sm:inset-10 lg:inset-16 z-50 bg-[#070c1e]/95 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col select-none animate-scale-up text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/25 via-purple-600/20 to-pink-600/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-md">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Biên Niên Sử & Dòng Thời Gian (Chronicle Timeline)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Long Ấn Ký
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tiến trình các biến cố định hình vận mệnh Bến Arumo và Sông Asera
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
          <div className="max-w-3xl mx-auto relative pl-6 sm:pl-8 border-l-2 border-indigo-500/30 space-y-8">
            {timeline.map((event, idx) => (
              <div key={event.id} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full bg-slate-950 border-2 border-indigo-400 group-hover:border-cyan-400 group-hover:scale-125 transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-cyan-400 transition-colors" />
                </div>

                {/* Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30 border border-white/10 group-hover:border-indigo-400/50 transition-all shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {event.dateOrEra}
                    </span>

                    {event.location && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-cyan-300 font-serif">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {event.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base text-white group-hover:text-indigo-200 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif mt-2">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

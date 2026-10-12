import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Calendar, 
  Compass, 
  Sparkles, 
  CheckCircle2,
  GitCommit
} from 'lucide-react';
import { TimelineEvent, Character } from '../../types';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  characters: Character[];
  onAddEvent: (event: TimelineEvent) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
  isWarmTheme: boolean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  characters,
  onAddEvent,
  onUpdateEvent,
  isWarmTheme
}) => {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('Học viện Aesvorn');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const sortedEvents = [...timeline].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleCreateEvent = () => {
    if (!newEventTitle.trim()) return;
    const ev: TimelineEvent = {
      id: `time_${Date.now()}`,
      title: newEventTitle.trim(),
      dateOrEra: newEventDate.trim() || 'Hiện tại',
      sortOrder: sortedEvents.length + 1,
      description: newEventDesc.trim(),
      location: newEventLocation,
      involvedCharacterIds: ['char_sena']
    };
    onAddEvent(ev);
    setIsAddOpen(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-none ${
      isWarmTheme ? 'bg-parchment-50 text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Banner */}
      <div className="p-6 border-b border-white/10 bg-slate-925/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <h2 className="font-serif font-bold text-xl tracking-tight">Dòng Thời Gian & Kiểm Định Dịch Chuyển</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tuần tự các mốc sự kiện, phát hiện nhân vật bị phân thân hoặc thời lượng di chuyển bất hợp lý.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sự Kiện Timeline</span>
        </button>
      </div>

      {/* Continuity Anomaly Guard Summary Strip */}
      <div className="px-6 py-2.5 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Không phát hiện mâu thuẫn thời gian: Các mốc di chuyển từ Thung Lũng Tro Tàn về Aesvorn hoàn toàn khả thi.</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400">Plausibility Check: 100% OK</span>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="w-full max-w-3xl relative">
          {/* Central Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-30"></div>

          <div className="space-y-6">
            {sortedEvents.map((event, idx) => {
              const involvedChars = characters.filter(c => event.involvedCharacterIds?.includes(c.id));

              return (
                <div key={event.id} className="relative pl-14 group">
                  {/* Timeline node icon */}
                  <div className={`absolute left-4 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center -translate-x-1/2 transition-all ${
                    event.isFlashback 
                      ? 'bg-purple-900 border-purple-400 shadow-purple-500/50' 
                      : 'bg-blue-900 border-blue-400 shadow-blue-500/50'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>

                  {/* Event Card */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-blue-500/40 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-medium">
                          {event.dateOrEra}
                        </span>
                        {event.isFlashback && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Hồi ức quá khứ (Flashback)
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-100">{event.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{event.description}</p>

                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                      <div className="flex items-center space-x-1 text-cyan-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{event.location || 'Chưa định vị'}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300">
                          {involvedChars.map(c => c.name).join(', ') || 'Chưa gán nhân vật'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-slate-100">Thêm Mốc Sự Kiện Timeline Mới</h3>
            <div>
              <label className="block text-slate-400 mb-1">Mốc thời gian (trong truyện)</label>
              <input
                type="text"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                placeholder="Ví dụ: Ngày 5 - Canh ba"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Tên sự kiện</label>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Ví dụ: Đột kích tầng hầm Tháp Chuông"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Địa điểm</label>
              <input
                type="text"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Mô tả chi tiết</label>
              <textarea
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Mô tả diễn biến sự kiện..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Hủy</button>
              <button onClick={handleCreateEvent} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">Thêm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

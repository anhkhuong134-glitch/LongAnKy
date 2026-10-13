import React, { useState } from 'react';
import { MapPin, X, Compass, Sparkles, Navigation, AlertTriangle, Users, BookOpen, Layers } from 'lucide-react';

interface LocationPoint {
  id: string;
  name: string;
  category: 'port' | 'facility' | 'sealed' | 'danger';
  icon: string;
  coords: { x: number; y: number }; // Percentage on map canvas
  tag: string;
  description: string;
  dangerLevel: 'Thấp' | 'Trung Bình' | 'Nguy Hiểm' | 'Tuyệt Mật';
  characters: string[];
  loreSnippet: string;
  relatedChapterTitle: string;
}

const ATLAS_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc_arumo_port',
    name: 'Bến Cảng Arumo & Tháp Tời Số 7',
    category: 'port',
    icon: '⚓',
    coords: { x: 42, y: 58 },
    tag: 'Bến Bãi Cơ Khí',
    description: 'Khu bến cảng hạ nguồn sông Asera, trung tâm vận tải hàng hóa và các xưởng sửa chữa cơ khí. Nơi Rento phụ trách tháp tời số bảy kéo thuyền neo cập bến.',
    dangerLevel: 'Trung Bình',
    characters: ['Rento', 'Dagan', 'Oren'],
    loreSnippet: 'Chiếc tời số bảy được Rento mua lại từ bãi phế liệu, vừa bị gãy trục chịu lực sau vụ kéo chiếc tàu trôi dạt trong đêm.',
    relatedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm'
  },
  {
    id: 'loc_night_station',
    name: 'Nhà Trực Ca Đêm & Cầu Phao Tuần Bến',
    category: 'facility',
    icon: '🏮',
    coords: { x: 50, y: 52 },
    tag: 'Trạm Tuần Tra',
    description: 'Trạm gác ven sông, nơi các tuần đinh ghi sổ và theo dõi mực nước dòng Asera. Nơi Nari trực ca đêm với cây sào cứu hộ và vòng kim loại dẫn lực.',
    dangerLevel: 'Trung Bình',
    characters: ['Nari', 'Garan'],
    loreSnippet: 'Nari phát hiện mực nước sông ngưng chảy bất thường và ranh giới đóng váng xám xịt báo hiệu Mùa Nước Đứng.',
    relatedChapterTitle: 'Mở đầu: Ranh giới của bình thường'
  },
  {
    id: 'loc_mira_workshop',
    name: 'Xưởng May Cũ Của Mẹ Mira',
    category: 'facility',
    icon: '🧵',
    coords: { x: 34, y: 65 },
    tag: 'Khu Dân Cư',
    description: 'Xưởng may và dệt vải cũ nằm ở hẻm sau bến cảng, nơi hai mẹ con Rento sinh sống. Xưởng từng bị tịch thu quyền sở hữu sau tai nạn tời máy 4 năm trước.',
    dangerLevel: 'Thấp',
    characters: ['Mira', 'Rento'],
    loreSnippet: 'Mục tiêu sống của Rento là kiếm đủ tiền chuộc lại toàn bộ xưởng may để mẹ không phải làm thuê cực nhọc.',
    relatedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm'
  },
  {
    id: 'loc_upstream_dam',
    name: 'Đập Thủy Lực Thượng Nguồn',
    category: 'danger',
    icon: '🌊',
    coords: { x: 70, y: 22 },
    tag: 'Đại Công Trình',
    description: 'Hệ thống đập thủy lực khổng lồ ngăn dòng nước dữ từ thượng nguồn. Do Quan chấp sự Seika phụ trách vận hành.',
    dangerLevel: 'Nguy Hiểm',
    characters: ['Seika', 'Omi'],
    loreSnippet: 'Bà Omi cảnh báo đập thượng nguồn đã rạn nứt và có lệnh sơ tán bí mật mà bến Arumo chưa hề được thông báo.',
    relatedChapterTitle: 'Chương 2 — Lời cảnh báo từ thượng nguồn'
  },
  {
    id: 'loc_stagnant_marsh',
    name: 'Đầm Lầy Nước Đứng & Vùng Nước Chết',
    category: 'danger',
    icon: '🌫️',
    coords: { x: 22, y: 38 },
    tag: 'Khu Vực Nguy Hiểm',
    description: 'Khúc sông cụt nơi dòng Asera ngưng chảy tạo thành váng nước đặc quánh. Chiếc tàu trôi dạt chở sinh vật hút nước lạ từng bị mắc kẹt tại đây.',
    dangerLevel: 'Nguy Hiểm',
    characters: ['Rento', 'Nari', 'Omi'],
    loreSnippet: 'Nơi tìm thấy ván gỗ bị bóp méo với dấu năm ngón tay trong suốt hút kiệt nước.',
    relatedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm'
  },
  {
    id: 'loc_dragon_well',
    name: 'Giếng Cảng & Hầm Phong Ấn Long Cổ',
    category: 'sealed',
    icon: '🐉',
    coords: { x: 58, y: 38 },
    tag: 'Phong Ấn Cổ Đại',
    description: 'Miệng giếng đá ngầm dưới lòng sông Asera, nơi giam giữ linh mạch Long Thần từ thời viễn cổ. Các hoa văn Long Ấn đang bắt đầu phát sáng rực rỡ.',
    dangerLevel: 'Tuyệt Mật',
    characters: ['Rento', 'Nari', 'Seika'],
    loreSnippet: 'Cổ ấn rồng phong ấn rồng thần ngàn năm. Khi nước sông ngưng chảy, phong ấn rạn vỡ phát ra tiếng gầm từ đáy vực.',
    relatedChapterTitle: 'Chương 3 — Rạn nứt cổ ấn'
  }
];

interface WorldAtlasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter?: (chapterTitle: string) => void;
}

export const WorldAtlasModal: React.FC<WorldAtlasModalProps> = ({ isOpen, onClose }) => {
  const [selectedLocId, setSelectedLocId] = useState<string>(ATLAS_LOCATIONS[0].id);
  const [filterCategory, setFilterCategory] = useState<'all' | 'port' | 'facility' | 'sealed' | 'danger'>('all');

  if (!isOpen) return null;

  const activeLocation = ATLAS_LOCATIONS.find(l => l.id === selectedLocId) || ATLAS_LOCATIONS[0];

  const filteredLocations = ATLAS_LOCATIONS.filter(l => {
    return filterCategory === 'all' || l.category === filterCategory;
  });

  const getDangerBadge = (level: LocationPoint['dangerLevel']) => {
    switch (level) {
      case 'Tuyệt Mật':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Nguy Hiểm':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Trung Bình':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 animate-fade-in"
      />

      {/* Main Atlas Modal */}
      <div className="fixed inset-4 sm:inset-8 lg:inset-12 z-50 bg-[#070b1a]/95 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col select-none animate-scale-up text-slate-200">
        {/* 1. Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-purple-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Bản Đồ Địa Lý Vực Sông Asera & Bến Arumo
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  Canon Atlas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Các cứ điểm trọng yếu, tháp tời, nhà trực và phong ấn cổ Long Thần
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

        {/* 2. Main Content: Map Canvas on Left/Center + Detail Dossier on Right */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Map Area */}
          <div className="flex-1 relative bg-gradient-to-b from-[#060a18] via-[#091129] to-[#050814] overflow-hidden flex items-center justify-center p-4">
            {/* SVG Visual Stylized Dark Fantasy Map Graphic */}
            <svg 
              viewBox="0 0 1000 700" 
              className="w-full h-full max-h-[550px] object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              {/* Grid Lines */}
              <defs>
                <pattern id="atlasGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <linearGradient id="riverGrad" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <rect width="1000" height="700" fill="url(#atlasGrid)" />

              {/* Mountains & Terrain Contours */}
              <path d="M 50,150 Q 250,80 450,160 T 950,100" fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth="2" strokeDasharray="6,6" />
              <path d="M 80,620 Q 300,550 600,630 T 920,580" fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth="2" strokeDasharray="6,6" />

              {/* River Asera Path (Sinuous Flow) */}
              <path 
                d="M 850,50 Q 750,180 650,220 T 550,380 T 420,580 T 200,680" 
                fill="none" 
                stroke="url(#riverGrad)" 
                strokeWidth="70" 
                strokeLinecap="round"
                className="opacity-75"
              />
              <path 
                d="M 850,50 Q 750,180 650,220 T 550,380 T 420,580 T 200,680" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="3" 
                strokeDasharray="12,12"
                className="animate-pulse opacity-60"
              />

              {/* Stagnant Marsh Branch */}
              <path 
                d="M 550,380 Q 350,360 220,380" 
                fill="none" 
                stroke="#0e7490" 
                strokeWidth="35" 
                strokeLinecap="round"
                className="opacity-50"
              />

              {/* Text Watermark Labels on Map */}
              <text x="750" y="110" fill="#38bdf8" fontSize="16" fontFamily="serif" opacity="0.6" letterSpacing="4">
                SÔNG ASERA — THƯỢNG NGUỒN
              </text>
              <text x="250" y="660" fill="#38bdf8" fontSize="16" fontFamily="serif" opacity="0.6" letterSpacing="4">
                HẠ LƯU VỰC ARUMO
              </text>
              <text x="140" y="360" fill="#a5f3fc" fontSize="13" fontFamily="serif" opacity="0.5" letterSpacing="2">
                ĐẦM NƯỚC ĐỨNG
              </text>
            </svg>

            {/* Interactive Location Pins Overlay */}
            {filteredLocations.map(loc => {
              const isSelected = loc.id === selectedLocId;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocId(loc.id)}
                  style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Glowing Radar Rings for Active/Selected Pin */}
                  {isSelected && (
                    <div className="absolute inset-0 -m-3 rounded-full bg-cyan-400/25 animate-ping" />
                  )}

                  {/* Pin Capsule */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-white shadow-[0_0_25px_rgba(6,182,212,0.8)] scale-110 font-bold'
                      : 'bg-slate-900/90 text-cyan-200 border-cyan-500/40 hover:border-cyan-300 hover:scale-105 shadow-lg backdrop-blur-sm'
                  }`}>
                    <span className="text-sm">{loc.icon}</span>
                    <span className="text-[11px] font-serif whitespace-nowrap hidden sm:inline">
                      {loc.name.split('&')[0]}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Category Filter Pills on Top of Map */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              {[
                { id: 'all', label: 'Tất cả cứ điểm' },
                { id: 'port', label: '⚓ Bến Cảng' },
                { id: 'facility', label: '🏢 Công trình' },
                { id: 'danger', label: '⚠️ Nguy hiểm' },
                { id: 'sealed', label: '🐉 Long Ấn' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    filterCategory === cat.id
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Detail Dossier (Right Side) */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-slate-950/90 p-5 overflow-y-auto custom-scrollbar flex flex-col justify-between flex-shrink-0">
            <div className="space-y-4">
              {/* Badge & Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                    {activeLocation.tag}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDangerBadge(activeLocation.dangerLevel)}`}>
                    {activeLocation.dangerLevel}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                  <span className="text-xl">{activeLocation.icon}</span>
                  <span>{activeLocation.name}</span>
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                {activeLocation.description}
              </p>

              {/* Prominent Characters */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nhân vật hiện diện thường xuyên</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {activeLocation.characters.map((ch, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 font-serif">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lore Snippet */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/25 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Manh mối cốt truyện & Ghi chép</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                  "{activeLocation.loreSnippet}"
                </p>
              </div>

              {/* Related Chapter Mention */}
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Xuất hiện lần đầu: </span>
                <span className="text-amber-300 font-medium font-serif">{activeLocation.relatedChapterTitle}</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 text-xs font-bold transition-all cursor-pointer"
              >
                Đóng Bản Đồ & Tiếp Tục Đọc
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

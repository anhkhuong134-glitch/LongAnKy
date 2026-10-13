import React, { useState } from 'react';
import {
  Image, Search, Filter, CheckCircle2, Eye, Info,
  Link, X, Maximize2
} from 'lucide-react';

interface MediaAsset {
  filename: string;
  title: string;
  type: 'character' | 'world' | 'ui';
  dimensions: string;
  size: string;
  characterMapped: string;
  usedIn: string[];
  url: string;
}

export const AdminMediaView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'character' | 'world' | 'ui'>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // All 21 chibi images + world images + UI icons
  const assets: MediaAsset[] = [
    { filename: '01-rento-v03.png', title: 'Rento Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.4 MB', characterMapped: 'Rento (NV01)', usedIn: ['Trang chủ', 'Hồ sơ Rento', 'Reader'], url: '/art/characters/01-rento-v03.png' },
    { filename: '02-nari-v03.png', title: 'Nari Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Nari (NV02)', usedIn: ['Trang chủ', 'Hồ sơ Nari'], url: '/art/characters/02-nari-v03.png' },
    { filename: '03-dagan-v03.png', title: 'Dagan Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Dagan (NV03)', usedIn: ['Trang chủ', 'Hồ sơ Dagan'], url: '/art/characters/03-dagan-v03.png' },
    { filename: '04-seika-v03.png', title: 'Seika Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Seika (NV04)', usedIn: ['Trang chủ', 'Hồ sơ Seika'], url: '/art/characters/04-seika-v03.png' },
    { filename: '05-mira-v03.png', title: 'Mira Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.8 MB', characterMapped: 'Mira (NV05)', usedIn: ['Hồ sơ Mira'], url: '/art/characters/05-mira-v03.png' },
    { filename: '06-omi-v03.png', title: 'Omi Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Omi (NV06)', usedIn: ['Hồ sơ Omi'], url: '/art/characters/06-omi-v03.png' },
    { filename: '07-oren-v03.png', title: 'Oren Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Oren (NV07)', usedIn: ['Hồ sơ Oren'], url: '/art/characters/07-oren-v03.png' },
    { filename: '08-garan-v03.png', title: 'Garan Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Garan (NV08)', usedIn: ['Hồ sơ Garan'], url: '/art/characters/08-garan-v03.png' },
    { filename: '09-tovan-v03.png', title: 'Tovan Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Tovan (NPC-01)', usedIn: ['Hồ sơ Tovan'], url: '/art/characters/09-tovan-v03.png' },
    { filename: '10-eli-v03.png', title: 'Eli Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Eli (NPC-02)', usedIn: ['Hồ sơ Eli'], url: '/art/characters/10-eli-v03.png' },
    { filename: '11-banu-v03.png', title: 'Banu Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Banu (NPC-03)', usedIn: ['Hồ sơ Banu'], url: '/art/characters/11-banu-v03.png' },
    { filename: '12-seli-v03.png', title: 'Seli Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Seli (NPC-04)', usedIn: ['Hồ sơ Seli'], url: '/art/characters/12-seli-v03.png' },
    { filename: '13-luma-v03.png', title: 'Luma Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Luma (NPC-05)', usedIn: ['Hồ sơ Luma'], url: '/art/characters/13-luma-v03.png' },
    { filename: '14-fara-v03.png', title: 'Fara Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Fara (NPC-06)', usedIn: ['Hồ sơ Fara'], url: '/art/characters/14-fara-v03.png' },
    { filename: '15-kiro-v03.png', title: 'Kiro Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Kiro (NPC-07)', usedIn: ['Hồ sơ Kiro'], url: '/art/characters/15-kiro-v03.png' },
    { filename: '16-bero-v03.png', title: 'Bero Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Bero (NPC-08)', usedIn: ['Hồ sơ Bero'], url: '/art/characters/16-bero-v03.png' },
    { filename: '17-veni-v03.png', title: 'Veni Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Veni (NPC-09)', usedIn: ['Hồ sơ Veni'], url: '/art/characters/17-veni-v03.png' },
    { filename: '18-doro-v03.png', title: 'Doro Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Doro (NPC-10)', usedIn: ['Hồ sơ Doro'], url: '/art/characters/18-doro-v03.png' },
    { filename: '19-paku-v03.png', title: 'Paku Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Paku (NPC-11)', usedIn: ['Hồ sơ Paku'], url: '/art/characters/19-paku-v03.png' },
    { filename: '20-yori-v03.png', title: 'Yori Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.7 MB', characterMapped: 'Yori (NPC-12)', usedIn: ['Hồ sơ Yori'], url: '/art/characters/20-yori-v03.png' },
    { filename: '21-tavi-v03.png', title: 'Tavi Chibi v0.3', type: 'character', dimensions: '800 × 1067', size: '1.6 MB', characterMapped: 'Tavi (16)', usedIn: ['Hồ sơ Tavi'], url: '/art/characters/21-tavi-v03.png' },
    { filename: 'arumo-morning-wide.jpg', title: 'Arumo Nắng Sớm Desktop', type: 'world', dimensions: '1800 × 1200', size: '823 KB', characterMapped: '—', usedIn: ['Hero Desktop'], url: '/art/world/arumo-morning-wide.jpg' },
    { filename: 'arumo-postcard.jpg', title: 'Bến Arumo Postcard', type: 'world', dimensions: '1200 × 800', size: '823 KB', characterMapped: '—', usedIn: ['Một góc thế giới', 'Thế giới'], url: '/art/world/arumo-postcard.jpg' },
    { filename: 'river-mark.svg', title: 'Biểu tượng Sông Mây', type: 'ui', dimensions: 'Vector 64 × 64', size: '1 KB', characterMapped: '—', usedIn: ['Header', 'Favicon', 'Footer'], url: '/art/ui/river-mark.svg' },
  ];

  const filteredAssets = assets.filter(a => {
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (searchQuery.trim()) {
      return a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.characterMapped.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Thư viện 21 ảnh Chibi & Đồ họa
          </h1>
          <p className="text-xs text-[#5F706A]">
            Đầy đủ 21 tệp ảnh Chibi v0.3, tranh bối cảnh thế giới và vector biểu tượng Arumo.
          </p>
        </div>
        <div className="text-xs font-bold text-[#376F64] bg-[#E4F1E9] px-3 py-1.5 rounded-xl">
          21/21 Ảnh đã sẵn sàng
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#DCE6DF]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Tất cả ({assets.length})
          </button>
          <button
            onClick={() => setFilterType('character')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'character'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            21 Nhân vật Chibi (21)
          </button>
          <button
            onClick={() => setFilterType('world')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'world'
                ? 'bg-[#E4F1E9] text-[#376F64]'
                : 'text-[#5F706A] hover:text-[#293B36]'
            }`}
          >
            Thế giới & Bối cảnh (2)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#5F706A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên tệp hoặc nhân vật..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#DCE6DF] text-xs text-[#293B36] focus:border-[#376F64] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Thumbnails (160–200 px) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.filename}
            onClick={() => setSelectedAsset(asset)}
            className="bg-white border border-[#DCE6DF] rounded-2xl p-3 flex flex-col items-center text-center hover:border-[#376F64] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-full aspect-[3/4] bg-[#FFFDF8] rounded-xl border border-[#DCE6DF]/50 p-2 mb-2 flex items-center justify-center overflow-hidden">
              <img
                src={asset.url}
                alt={asset.title}
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h4 className="font-extrabold text-xs text-[#293B36] line-clamp-1 group-hover:text-[#376F64]">
              {asset.title}
            </h4>
            <span className="text-[10px] text-[#5F706A] block truncate max-w-full mt-0.5">
              {asset.characterMapped}
            </span>
          </div>
        ))}
      </div>

      {/* Image Inspection Drawer / Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6DF] rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
              <h3 className="font-extrabold text-base text-[#293B36]">
                Chi tiết tệp đồ họa
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded-lg text-[#5F706A] hover:text-[#293B36]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-48 aspect-[3/4] mx-auto bg-[#FFFDF8] rounded-2xl border border-[#DCE6DF] p-3 flex items-center justify-center overflow-hidden">
              <img
                src={selectedAsset.url}
                alt={selectedAsset.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 text-xs bg-[#FFFDF8] border border-[#DCE6DF] p-4 rounded-xl">
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Tên tệp:</span>
                <span className="font-mono font-bold text-[#293B36]">{selectedAsset.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Kích thước ảnh:</span>
                <span className="font-bold text-[#293B36]">{selectedAsset.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Dung lượng:</span>
                <span className="font-bold text-[#293B36]">{selectedAsset.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Nhân vật liên kết:</span>
                <span className="font-bold text-[#376F64]">{selectedAsset.characterMapped}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F706A]">Vị trí sử dụng:</span>
                <span className="font-bold text-[#293B36]">{selectedAsset.usedIn.join(', ')}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

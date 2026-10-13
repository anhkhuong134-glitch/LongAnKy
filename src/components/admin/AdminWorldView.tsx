import React, { useState } from 'react';
import { Compass, MapPin, Layers, Sparkles, Plus, Search, Edit3 } from 'lucide-react';

export const AdminWorldView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'locations' | 'organizations' | 'lore'>('locations');

  const items = [
    { id: 'w1', name: 'Bến Arumo', type: 'Địa điểm', desc: 'Làng bến cảng dưới cùng của sông Asera, nơi tập trung các xưởng sửa tời kéo cáp.', isPublic: true },
    { id: 'w2', name: 'Giếng cảng số bảy', type: 'Địa điểm', desc: 'Giếng nước sâu nối từ tầng sông trời xuống mặt đất, nơi con tàu trôi dạt lao xuống.', isPublic: true },
    { id: 'w3', name: 'Dòng sông trời Asera', type: 'Địa điểm', desc: 'Dòng sông lơ lửng trên tầng mây, là huyết mạch giao thương kỳ bí.', isPublic: true },
    { id: 'w4', name: 'Ban quản bến Arumo', type: 'Tổ chức', desc: 'Cơ quan quản lý bến cảng, do Tovan và Oren điều hành phân công ca trực.', isPublic: false },
    { id: 'w5', name: 'Quỹ bảo hộ bến cảng', type: 'Tổ chức', desc: 'Quỹ bồi thường và cấp vật tư, nơi đang treo hồ sơ của mẹ con Rento.', isPublic: false },
    { id: 'w6', name: 'Mùa nước đứng', type: 'Thuật ngữ', desc: 'Thời điểm dòng chảy sông Asera phẳng lặng nhất trong năm.', isPublic: true },
    { id: 'w7', name: 'Lệnh sơ tán trạm thượng nguồn', type: 'Bí ẩn cốt truyện', desc: 'Tấm biển dán bí mật mà Omi đã đọc trước khi tàu bị đẩy xuống bến hạ.', isPublic: false },
  ];

  const filteredItems = items.filter(it => {
    if (activeTab === 'locations') return it.type === 'Địa điểm';
    if (activeTab === 'organizations') return it.type === 'Tổ chức';
    return it.type !== 'Địa điểm' && it.type !== 'Tổ chức';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#293B36] tracking-tight">
            Thế giới & Logic cốt truyện
          </h1>
          <p className="text-xs text-[#5F706A]">
            Quản lý địa điểm, tổ chức, thuật ngữ và các nút thắt then chốt trong StoryBible.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all text-xs flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Thêm mục mới</span>
        </button>
      </div>

      <div className="flex items-center gap-1 bg-white p-2 rounded-2xl border border-[#DCE6DF] w-fit">
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'locations' ? 'bg-[#E4F1E9] text-[#376F64]' : 'text-[#5F706A]'
          }`}
        >
          Địa điểm (3)
        </button>
        <button
          onClick={() => setActiveTab('organizations')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'organizations' ? 'bg-[#E4F1E9] text-[#376F64]' : 'text-[#5F706A]'
          }`}
        >
          Tổ chức (2)
        </button>
        <button
          onClick={() => setActiveTab('lore')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'lore' ? 'bg-[#E4F1E9] text-[#376F64]' : 'text-[#5F706A]'
          }`}
        >
          Thuật ngữ & Bí ẩn (2)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#DCE6DF] rounded-2xl p-5 space-y-3 hover:border-[#376F64] shadow-xs transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#376F64] bg-[#E4F1E9] px-2 py-0.5 rounded">
                {item.type}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {item.isPublic ? 'Đã công khai' : 'Nội bộ'}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-[#293B36]">{item.name}</h3>
            <p className="text-xs text-[#5F706A] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

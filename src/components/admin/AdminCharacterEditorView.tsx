import React, { useState } from 'react';
import {
  ArrowLeft, Save, Globe, Eye, CheckCircle2, AlertCircle,
  Users, Sparkles, Image, Lock, ShieldCheck, Heart
} from 'lucide-react';
import { ALL_CHARACTERS_DATA, PublicCharacter } from '../../data/publicCharacters';

interface AdminCharacterEditorViewProps {
  charId: string;
  onBack: () => void;
  onPreviewProfile: (charId: string) => void;
}

export const AdminCharacterEditorView: React.FC<AdminCharacterEditorViewProps> = ({
  charId,
  onBack,
  onPreviewProfile,
}) => {
  const character = ALL_CHARACTERS_DATA.find(c => c.id === charId) || ALL_CHARACTERS_DATA[0];

  // Editable fields
  const [name, setName] = useState(character.name);
  const [roleLabel, setRoleLabel] = useState(character.roleLabel);
  const [age, setAge] = useState(character.age);
  const [gender, setGender] = useState(character.gender);
  const [occupation, setOccupation] = useState(character.occupation);
  const [origin, setOrigin] = useState(character.origin);
  const [residence, setResidence] = useState(character.residence);
  const [personalityText, setPersonalityText] = useState(character.personalityText);
  const [backgroundText, setBackgroundText] = useState(character.backgroundText);
  const [oneLineDesc, setOneLineDesc] = useState(character.oneLineDesc);

  // Statuses
  const [assetReady, setAssetReady] = useState(character.assetReady);
  const [profileReady, setProfileReady] = useState(character.profileReady);
  const [publicReady, setPublicReady] = useState(character.publicReady);

  // Internal Secrets
  const [secretNotes, setSecretNotes] = useState(
    character.internalNotes?.secrets?.join('\n') || 'Bí mật chưa công bố: Giữ kín nguồn gốc linh thạch và mối quan hệ với cha.'
  );

  const [activeTab, setActiveTab] = useState<'info' | 'art' | 'personality' | 'relations' | 'publicScope' | 'history'>('info');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveDraft = () => {
    showToast(`Đã lưu bản nháp hồ sơ ${name}. Độc giả chưa thấy các thay đổi mới.`);
  };

  const handlePublish = () => {
    setPublicReady(true);
    showToast(`Đã cập nhật xuất bản hồ sơ ${name} ra trang độc giả!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#293B36] text-white text-xs font-bold shadow-xl animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#DCE6DF] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-[#5F706A] hover:text-[#293B36] hover:bg-[#F2F8F5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-lg text-[#293B36]">
              Biên tập hồ sơ: {name}
            </h1>
            <p className="text-xs text-[#5F706A]">
              Mã ID cố định: <span className="font-mono text-[#376F64]">{character.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#293B36] bg-[#FFFDF8] border border-[#DCE6DF] hover:bg-[#F2F8F5] transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-[#376F64]" />
            <span>Lưu bản nháp</span>
          </button>

          <button
            onClick={() => onPreviewProfile(character.id)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#5F706A] bg-[#F2F8F5] hover:text-[#293B36] transition-all flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước</span>
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#376F64] hover:bg-[#2B5A51] transition-all shadow-sm flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>Xuất bản hồ sơ</span>
          </button>
        </div>
      </div>

      {/* Editor Grid: Left Column 300px + Right Column 6 Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (300px): Chibi Image Frame & Statuses */}
        <div className="lg:col-span-4 bg-white border border-[#DCE6DF] rounded-2xl p-5 shadow-sm space-y-5">
          <div className="w-full aspect-[3/4] bg-[#FFFDF8] rounded-xl border border-[#DCE6DF] p-3 flex items-center justify-center overflow-hidden">
            <img
              src={character.chibiArt}
              alt={character.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="font-extrabold text-base text-[#293B36]">{name}</h3>
            <span className="text-xs text-[#5F706A] font-mono block">
              {character.chibiArt}
            </span>
          </div>

          {/* 3 Independent Statuses */}
          <div className="space-y-3 pt-4 border-t border-[#DCE6DF] text-xs">
            <h4 className="font-bold text-[#5F706A] uppercase tracking-wider text-[10px]">
              Trạng thái bản ghi:
            </h4>

            <div className="flex items-center justify-between">
              <span className="text-[#293B36] font-medium">1. Bộ ảnh Chibi v0.3:</span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-[#E4F1E9] text-[#376F64]">
                Đã gán
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#293B36] font-medium">2. Hồ sơ nội bộ:</span>
              <button
                onClick={() => setProfileReady(!profileReady)}
                className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                  profileReady
                    ? 'bg-[#E4F1E9] text-[#376F64]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {profileReady ? 'Đầy đủ' : 'Cần bổ sung'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#293B36] font-medium">3. Hiển thị công khai:</span>
              <button
                onClick={() => setPublicReady(!publicReady)}
                className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                  publicReady
                    ? 'bg-[#E4F1E9] text-[#376F64]'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {publicReady ? 'Bật công khai' : 'Tắt (Chỉ admin)'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): 6 Editor Sections Tabs */}
        <div className="lg:col-span-8 bg-white border border-[#DCE6DF] rounded-2xl p-6 shadow-sm space-y-6">
          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#DCE6DF] pb-3 text-xs">
            {[
              { id: 'info', label: '1. Thông tin gốc' },
              { id: 'art', label: '2. Ngoại hình & Ảnh' },
              { id: 'personality', label: '3. Tính cách & Xuất thân' },
              { id: 'relations', label: '4. Quan hệ & Spoiler' },
              { id: 'publicScope', label: '5. Phạm vi công khai' },
              { id: 'history', label: '6. Nguồn & Lịch sử' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#E4F1E9] text-[#376F64]'
                    : 'text-[#5F706A] hover:text-[#293B36] hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: THÔNG TIN GỐC */}
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Tên nhân vật</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs font-bold text-[#293B36]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Vai trò</label>
                  <input
                    type="text"
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Tuổi & Mốc</label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Giới tính</label>
                  <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Nghề nghiệp</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Xuất thân</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#293B36]">Nơi sinh sống</label>
                  <input
                    type="text"
                    value={residence}
                    onChange={(e) => setResidence(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36]">Mô tả ngắn 1 dòng (An toàn độc giả)</label>
                <input
                  type="text"
                  value={oneLineDesc}
                  onChange={(e) => setOneLineDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: NGOẠI HÌNH & ẢNH */}
          {activeTab === 'art' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-[#293B36]">Điểm nhận diện ngoại hình (3–5 ý)</label>
                {character.recognitionPoints.map((pt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    defaultValue={pt}
                    className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] mb-1.5"
                  />
                ))}
              </div>
              <p className="text-[11px] text-[#5F706A]">
                Bộ ảnh Chibi v0.3 được gán tự động từ manifest `design-handoff/character-art-v03`.
              </p>
            </div>
          )}

          {/* TAB 3: TÍNH CÁCH & XUẤT THÂN */}
          {activeTab === 'personality' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#293B36]">Tính cách & Hành vi</label>
                <textarea
                  rows={4}
                  value={personalityText}
                  onChange={(e) => setPersonalityText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] resize-y"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36]">Xuất thân & Hành trình quá khứ</label>
                <textarea
                  rows={4}
                  value={backgroundText}
                  onChange={(e) => setBackgroundText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] resize-y"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 4: QUAN HỆ & SPOILER NỘI BỘ */}
          {activeTab === 'relations' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Khu vực Bí Mật Nội Bộ Tác Giả</span>
                </div>
                <p className="text-[11px]">
                  Các thông tin dưới đây chứa spoiler và mục tiêu ẩn, tuyệt đối không gửi ra giao diện độc giả.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#293B36]">Bí mật, tổn thương & kế hoạch arc</label>
                <textarea
                  rows={4}
                  value={secretNotes}
                  onChange={(e) => setSecretNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE6DF] text-xs text-[#293B36] bg-[#FFFDF8]"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 5: PHẠM VI CÔNG KHAI */}
          {activeTab === 'publicScope' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-[#293B36]">
                Cấu hình hiển thị từng khối lên trang độc giả:
              </h4>

              {[
                { name: 'Ảnh Chibi toàn thân', status: 'Luôn hiển thị' },
                { name: 'Thông tin nhanh (Tuổi, nghề, quê quán)', status: 'Hiển thị' },
                { name: 'Điểm nhận diện ngoại hình', status: 'Hiển thị' },
                { name: 'Con người & Tính cách', status: 'Hiển thị' },
                { name: 'Xuất thân & Hành trình', status: 'Hiển thị' },
                { name: 'Những người liên quan', status: 'Hiển thị quan hệ an toàn' },
                { name: 'Bí mật nội tâm & Spoiler', status: 'Ẩn hoàn toàn (Chỉ admin)' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[#DCE6DF] bg-[#FFFDF8]">
                  <span className="font-medium text-[#293B36]">{item.name}</span>
                  <span className="font-bold text-[#376F64]">{item.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: NGUỒN & LỊCH SỬ */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs text-[#5F706A]">
              <p>Nguồn đối chiếu: Google Docs Long Ấn Ký & Google Sheets Hồ sơ nhân vật.</p>
              <p>Tệp ảnh tương ứng: {character.chibiArt}</p>
              <p>Phiên bản dữ liệu: 0.3 (Đã xác minh)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

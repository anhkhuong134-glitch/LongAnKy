import { 
  GameTaskPackage, 
  GameSystemModule, 
  IdeaControlItem, 
  ComicChapter,
  Part
} from '../types';

export const GOOGLE_DOCS_URL = 'https://docs.google.com/document/d/1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y/edit?hl=vi&tab=t.0#heading=h.1tqrvyl4g8yj';
export const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1-kehBNZBbnc53v8Dpl3jll2HQKt6tr3tldm6tZWFlHg/edit?gid=1481982608#gid=1481982608';
export const GOOGLE_DOCS_EXPORT_URL = 'https://docs.google.com/document/d/1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y/export?format=txt';
export const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1-kehBNZBbnc53v8Dpl3jll2HQKt6tr3tldm6tZWFlHg/export?format=csv&gid=1481982608';

import defaultGoogleDocRawText from './google_doc_raw.txt?raw';
import { parseGoogleDocTextToParts } from '../services/googleDocParser';

// ========================================================
// 1. DATA FROM GOOGLE DOCS (CHƯƠNG TRUYỆN MỚI & BẢN CŨ)
// Tự động phân tích từ tài liệu Google Docs gốc
// ========================================================
export const googleDocsParts: Part[] = parseGoogleDocTextToParts(defaultGoogleDocRawText);

// ========================================================
// 2. DATA FROM GOOGLE SHEETS (GAME SOUL SEAL & CỐT TRUYỆN)
// ========================================================
export const googleSheetsTaskPackages: GameTaskPackage[] = [
  { code: 'T01', name: 'Thẩm Định Ý Tưởng & IP', pillar: 'story', status: 'Đang làm', dodMet: true, priority: 'P1 - Cốt lõi', details: 'Khảo sát thị trường, bảo vệ bản quyền Thức Tỉnh Long Ấn, đồng bộ thế giới.', deliverable: 'Hồ sơ thẩm định IP', nextAction: 'Chốt hợp đồng IP' },
  { code: 'T02', name: 'Mạch Truyện Nhân Quả', pillar: 'story', status: 'Đang làm', dodMet: true, priority: 'P1 - Cốt lõi', details: 'Thiết lập chuỗi nguyên nhân - kết quả, biến cố giếng cảng Arumo và bí ẩn Aesvorn.', deliverable: 'Sơ đồ mạch truyện nhân quả', nextAction: 'Mở rộng Arumo 0.2' },
  { code: 'T03', name: 'Quy Tắc Thế Giới (Lore Bible)', pillar: 'story', status: 'Đang làm', dodMet: true, priority: 'P1 - Cốt lõi', details: 'Hệ thống sông Asera trên trời, ấn ký rồng, rào chắn tri thức.', deliverable: 'Lore Bible V1.0', nextAction: 'Đồng bộ sang Game' },
  { code: 'T04', name: 'Hồ Sơ Nhân Vật', pillar: 'story', status: 'Đang làm', dodMet: true, priority: 'P1 - Cốt lõi', details: 'Hồ sơ tâm lý Sena, Koto, Ryou, Rento, Nari, Seika, Tovan, Mira.', deliverable: 'Bộ 8 hồ sơ nhân vật chuẩn', nextAction: 'Duyệt bảng chỉ số Game' },
  { code: 'T05', name: 'Dàn Ý Chi Tiết', pillar: 'story', status: 'Đang làm', dodMet: false, priority: 'P1 - Cốt lõi', details: 'Dàn ý 15 chương đầu Thức Tỉnh Long Ấn theo chuẩn 3 hồi.', deliverable: 'Outline 15 chương', nextAction: 'Viết bản thảo chương 4' },
  { code: 'T06', name: 'Truyện Trong Game (Lore Sync)', pillar: 'shared', status: 'Đang làm', dodMet: true, priority: 'P2 - Nâng cao', details: 'Lời thoại NPC, tên chiêu thức, nhiệm vụ cốt truyện đồng bộ 100% với Lore.', deliverable: 'Bảng đối chiếu IP & Nhiệm vụ', nextAction: 'Thống nhất Timeline' },
  { code: 'T07', name: 'Nghiên Cứu Thị Trường ARPG', pillar: 'game', status: 'Đã xong', dodMet: true, priority: 'P2 - Nâng cao', details: 'Phân tích điểm mạnh NSO, NRO, Dead Cells, Katana Zero để chắt lọc cơ chế.', deliverable: 'Báo cáo Benchmark Game', nextAction: 'Tích hợp vào GDD' },
  { code: 'T08', name: 'Vòng Chơi Cốt Lõi (Core Loop)', pillar: 'game', status: 'Đang làm', dodMet: false, priority: 'P1 - Cốt lõi', details: 'Nhận nhiệm vụ Thợ Săn Ấn -> Săn quái -> Thu thập Hồn Thú -> Mở Ấn Chú (3-5 phút/ải).', deliverable: 'Sơ đồ Core Loop & Kịch bản 5p', nextAction: 'Thử nghiệm trong Prototype T17' },
  { code: 'T09', name: 'Dòng Nhân Vật & Hệ Phái', pillar: 'game', status: 'Đang làm', dodMet: false, priority: 'P1 - Cốt lõi', details: '3 hệ phái: Long Tộc (Cận chiến), Linh Tộc (Tầm xa ấn thuật), Thần Tộc (Tốc độ & ám khí).', deliverable: 'Hồ sơ thiết kế 3 dòng phái', nextAction: 'Cân bằng sát thương' },
  { code: 'T10', name: 'Vũ Khí & Kỹ Năng', pillar: 'game', status: 'Đang làm', dodMet: false, priority: 'P1 - Cốt lõi', details: 'Đao, Kiếm, Tiêu, Kunai, Quạt. Combo 4 nhịp, 3 skill chủ động, 1 tuyệt kỹ Long Ấn.', deliverable: 'Ma trận vũ khí & 12 skill', nextAction: 'Thiết lập bảng tính cân bằng' },
  { code: 'T11', name: 'Bản Đồ & Tilemap', pillar: 'game', status: 'Chưa làm', dodMet: false, priority: 'P2 - Nâng cao', details: 'Thôn Khởi Nguyên, Rừng Quỷ Ấn, Thung Lũng Rồng. Tilemap 32x32 pixel 2D.', deliverable: 'Layout Tilemap Thôn Khởi Nguyên', nextAction: 'Dựng Whitebox trong Unity' },
  { code: 'T12', name: 'Quái Thường & Boss Hồn Thú', pillar: 'game', status: 'Chưa làm', dodMet: false, priority: 'P1 - Cốt lõi', details: 'Quái tuần tra, Boss 2 pha chiến đấu, cơ chế phá giáp, nộ chiêu quét sàn.', deliverable: 'Bảng hành vi quái & Kịch bản Boss 1', nextAction: 'Lập trình AI Behavior Tree' },
  { code: 'T13', name: 'Trang Bị & Ấn Phù', pillar: 'game', status: 'Chưa làm', dodMet: false, priority: 'P2 - Nâng cao', details: '5 phẩm cấp (Trắng, Lam, Tím, Cam, Thần Ấn), Khảm Linh Ngọc, Cường hóa.', deliverable: 'Bảng dữ liệu 20 item khởi đầu', nextAction: 'Lập trình UI Inventory' },
  { code: 'T14', name: 'Logic Combat & Hitbox', pillar: 'game', status: 'Chưa làm', dodMet: false, priority: 'P1 - Cốt lõi', details: 'Hit-stop, Stagger choáng, Dash né đòn i-frame 0.25s, Input latency < 50ms.', deliverable: 'Tài liệu công thức combat', nextAction: 'Code thử nghiệm Unity' },
  { code: 'T15', name: 'Mỹ Thuật Đồ Họa 2D Pixel', pillar: 'game', status: 'Đang làm', dodMet: false, priority: 'P2 - Nâng cao', details: 'Pixel Art Á Đông huyền ảo kết hợp hiệu ứng hạt Soul Energy 60fps.', deliverable: 'Concept Art & Sprite sheet mẫu', nextAction: 'Render Sprite sheet 60fps' },
  { code: 'T16', name: 'Engine Unity & Pipeline', pillar: 'game', status: 'Đang làm', dodMet: false, priority: 'P1 - Cốt lõi', details: 'Unity LTS, Universal Render Pipeline (URP), New Input System (PC + Mobile).', deliverable: 'Base Unity Project', nextAction: 'Khởi tạo Git Repository' },
  { code: 'T17', name: 'Bản Mẫu Prototype (Vertical Slice)', pillar: 'game', status: 'Đang làm', dodMet: false, priority: 'P1 - Cốt lõi', details: '1 nhân vật (Long Tộc) - 1 map nhỏ - 1 quest - 2 quái - 1 boss - 1 tuyệt kỹ Long Ấn.', deliverable: 'Build .exe & .apk < 100MB 60fps', nextAction: 'Đo lường độ trễ phản hồi' },
  { code: 'T18', name: 'Kiểm Thử & Đóng Gói (QA)', pillar: 'game', status: 'Chưa làm', dodMet: false, priority: 'P3 - Tương lai', details: 'Bộ Test Case, Bug Tracker (P1-P3), tối ưu RAM < 500MB.', deliverable: 'Kế hoạch QA & Biên bản nghiệm thu', nextAction: 'Xây dựng mẫu báo cáo bug' }
];

export const googleSheetsSystemModules: GameSystemModule[] = [
  {
    code: 'SYS-01',
    name: 'Vòng Chơi Cốt Lõi (Core Loop)',
    idea: 'Nhận nhiệm vụ Thợ Săn Ấn → Chiến đấu săn quái → Thu thập Hồn Thú → Mở khóa Ấn Chú & Đột phá',
    status: 'Đang phác thảo',
    priority: 'P1 - Cốt lõi',
    inspiration: 'NSO x NRO',
    gameplayLogic: 'Vòng lặp ngắn 3-5 phút/ải, tăng động lực cày cuốc và cảm giác thành tựu khi mở ấn mới',
    techSpecs: 'Finite State Machine cho vòng đời phiên chơi',
    challenges: 'Giữ nhịp độ gây nghiện của NSO và sự thăng tiến sức mạnh của NRO',
    packageCode: 'T08',
    dod: 'Hoàn thiện sơ đồ luồng chơi Soul Seal và kịch bản thử nghiệm 5 phút',
    deliverable: 'Sơ đồ Core Loop & Bản thảo kịch bản',
    nextAction: 'Thử nghiệm nhịp chơi trong bản Prototype T17'
  },
  {
    code: 'SYS-02',
    name: 'Dòng Nhân Vật & Hệ Phái',
    idea: '3 trường phái truyền thừa: Long Tộc (Cận chiến dũng mãnh), Linh Tộc (Tầm xa ấn thuật), Thần Tộc (Tốc độ & ám khí)',
    status: 'Đang mở',
    priority: 'P1 - Cốt lõi',
    inspiration: 'Thức Tỉnh Long Ấn',
    gameplayLogic: 'Mỗi hệ có bộ chỉ số và phong cách thi triển ấn ký đặc thù, combo liên hoàn độc đáo',
    techSpecs: 'Bảng chỉ số: HP, MP, Sát thương, Tốc đánh, Tốc chạy, Hồn Lực',
    challenges: 'Cân bằng cảm giác ra đòn giữa tầm xa (Linh Tộc) và cận chiến (Long Tộc)',
    packageCode: 'T09',
    dod: 'Chốt danh tính, tiểu sử và bảng chỉ số cơ bản cho 3 hệ phái Soul Seal',
    deliverable: 'Hồ sơ thiết kế 3 dòng phái Soul Seal',
    nextAction: 'Khảo sát trải nghiệm và đồng bộ với kịch bản T04'
  },
  {
    code: 'SYS-03',
    name: 'Trường Phái Vũ Khí & Kỹ Năng',
    idea: 'Đao, Kiếm, Tiêu, Kunai, Quạt - Cơ chế kích hoạt Ấn Chú Soul Seal chuyển dạng kỹ năng',
    status: 'Ý tưởng mở',
    priority: 'P1 - Cốt lõi',
    inspiration: 'NSO x Kiếm hiệp',
    gameplayLogic: 'Mỗi vũ khí có combo đánh thường 4 nhịp, 3 kỹ năng chủ động, 1 tuyệt kỹ Thần Ấn bùng nổ',
    techSpecs: 'Skill Tree 3 nhánh chuyên sâu: Công kích, Ấn chú bí truyền, Hộ thể',
    challenges: 'Độ trễ và hitbox đòn đánh phối hợp nhịp nhàng giữa võ thuật và nhẫn thuật',
    packageCode: 'T10',
    dod: 'Tài liệu mô tả chi tiết logic 12 kỹ năng khởi đầu kèm chỉ số sát thương/CD',
    deliverable: 'Ma trận vũ khí & bảng thông số kỹ năng',
    nextAction: 'Thiết lập bảng tính cân bằng sát thương và hồi chiêu'
  },
  {
    code: 'SYS-04',
    name: 'Bản Đồ & Phân Khu Thế Giới',
    idea: 'Thôn Khởi Nguyên, Rừng Quỷ Ấn, Thung Lũng Rồng, Phụ Bản Huyết Trì (2D Side-scrolling)',
    status: 'Đang quy hoạch',
    priority: 'P2 - Nâng cao',
    inspiration: 'Thức Tỉnh Long Ấn',
    gameplayLogic: 'Bản đồ phân tầng cuộn cảnh 2D, có khu vực an toàn mua sắm và bãi quái cày cấp',
    techSpecs: 'Tilemap 32x32 pixel, hỗ trợ collider, trigger chuyển cảnh mượt mà',
    challenges: 'Tối ưu tải bản đồ phân đoạn (chunk loading) mượt mà trên điện thoại',
    packageCode: 'T11',
    dod: 'Bản vẽ layout Thôn Khởi Nguyên và 1 bãi săn quái mẫu có điểm spawn',
    deliverable: 'Sơ đồ kiến trúc Map & Tilemap mẫu',
    nextAction: 'Dựng Whitebox bản đồ thử nghiệm trong Unity'
  },
  {
    code: 'SYS-05',
    name: 'Quái Thường & Boss Hồn Thú',
    idea: 'Quái dã ngoại phân cấp linh lực, Boss Hồn Thú gác cổng sở hữu cơ chế nộ chiêu và biến hình',
    status: 'Đang mở',
    priority: 'P1 - Cốt lõi',
    inspiration: 'ARPG hành động',
    gameplayLogic: 'Quái có AI tuần tra/truy đuổi; Boss có 2 pha chiến đấu, đòn quét diện rộng và cơ chế phá giáp',
    techSpecs: 'Behavior Tree: Idle → Patrol → Aggro → Attack → Enrage',
    challenges: 'Thiết kế nhịp né chiêu (dodge-roll) và parry phản đòn tạo chiều sâu kỹ năng',
    packageCode: 'T12',
    dod: 'Kịch bản hành vi hoàn chỉnh cho 2 quái thường và 1 Boss Hồn Thú thử nghiệm',
    deliverable: 'Bảng hành vi quái & Kịch bản Boss 1',
    nextAction: 'Lập trình AI tuần tra và tầm đánh trong Prototype'
  },
  {
    code: 'SYS-07',
    name: 'Logic Chiến Đấu & Cân Bằng',
    idea: 'Hệ thống Hitbox/Hurtbox chuẩn xác, Frame dừng đòn (Hit-stop), Stagger choáng, Khắc chế ấn chú',
    status: 'Cần nghiên cứu',
    priority: 'P1 - Cốt lõi',
    inspiration: 'Fighting / ARPG',
    gameplayLogic: 'Đòn đánh dứt khoát, uy lực, tạo cảm giác chém trúng da thịt, phản hồi rung màn hình nhẹ',
    techSpecs: 'Công thức: Sát thương = (Tấn công - Phòng thủ) * Hệ số Ấn Chú * Bạo kích',
    challenges: 'Độ trễ phản hồi phím điều khiển (Input Latency) phải dưới 50ms',
    packageCode: 'T14',
    dod: 'Văn bản công thức chiến đấu và bảng tính mô phỏng tương tác chỉ số',
    deliverable: 'Tài liệu công thức chiến đấu & bảng tính',
    nextAction: 'Kiểm thử công thức trên bảng tính trước khi nạp mã code'
  },
  {
    code: 'SYS-10',
    name: 'Bản Mẫu Thử Nghiệm (Prototype T17)',
    idea: 'Phạm vi tối giản: 1 nhân vật (Long Tộc), 1 map nhỏ (Thôn Khởi Nguyên), 1 nhiệm vụ, 2 quái thường, 1 Boss Hồn Thú & 1 tuyệt kỹ Long Ấn',
    status: 'Kế hoạch lập',
    priority: 'P1 - Cốt lõi',
    inspiration: 'Vertical Slice (3-5 phút)',
    gameplayLogic: 'Đánh giá cảm giác combat combo 4 nhịp, phản hồi < 50ms, dash né đòn và kích hoạt Long Ấn kết liễu Boss',
    techSpecs: 'Build độc lập Windows (.exe) và Android (.apk), dung lượng < 100MB, 60fps mượt mà',
    challenges: 'Giữ phạm vi tối giản tuyệt đối, hoàn thiện nhanh trong 2 tuần, chống phình tính năng',
    packageCode: 'T17',
    dod: 'Build chạy mượt 60fps, hoàn thành trọn vẹn luồng 1 nv - 1 map - 1 quest - 2 quái - 1 boss - 1 skill Long Ấn không crash',
    deliverable: 'Bộ cài đặt Prototype PC/Android & Báo cáo đo lường trải nghiệm combat',
    nextAction: 'Triển khai kiểm thử nội bộ và đo đạc độ trễ phản hồi đòn đánh'
  }
];

export const googleSheetsIdeaControl: IdeaControlItem[] = [
  {
    id: 'IDEA-01',
    title: 'Cơ chế Kích Hoạt Ấn Ký Thần Thú (Soul Seal Awakening)',
    category: 'Game',
    priority: 'P1 - Cốt lõi',
    status: 'Đã duyệt',
    goal: 'Tạo cơ chế biến hình thức tỉnh nộ chiêu mang bản sắc riêng biệt',
    risk: 'Gắn liền vòng chơi cốt lõi T08/T10, không phát sinh trôi tính năng mới',
    solution: 'Tích hợp trực tiếp vào thanh Hồn Lực khi đầy nộ chiêu',
    packageCode: 'T08, T10',
    proposer: 'Game Lead',
    decision: 'Thông qua cho bản Prototype T17',
    nextAction: 'Thiết kế bảng thông số kích hoạt ấn',
    dodEvaluation: 'Đạt tiêu chuẩn DoD',
    notes: 'Đồng bộ với truyện Thức Tỉnh Long Ấn'
  },
  {
    id: 'IDEA-02',
    title: 'Cơ chế Né Đòn Tức Thời & Phản Đòn (Perfect Dodge / Parry)',
    category: 'Game',
    priority: 'P1 - Cốt lõi',
    status: 'Đang thử nghiệm',
    goal: 'Tăng chiều sâu cảm giác hành động đã tay, thử thách phản xạ người chơi',
    risk: 'Nguy cơ tăng độ khó trên màn hình cảm ứng di động nếu hitbox không chuẩn',
    solution: 'Đặt cửa sổ i-frame 0.25s kèm hiệu ứng slow-motion cực ngắn khi né chuẩn',
    packageCode: 'T14, T17',
    proposer: 'Combat Designer',
    decision: 'Cho phép thử nghiệm trong Prototype',
    nextAction: 'Lập trình thử nghiệm trong Unity',
    dodEvaluation: 'Theo dõi trải nghiệm',
    notes: 'Khảo sát người chơi thử nghiệm'
  },
  {
    id: 'IDEA-03',
    title: 'Mở rộng Thế Giới Mở Multiplayer ngay giai đoạn khởi đầu',
    category: 'Kỹ thuật',
    priority: 'P3 - Để sau',
    status: 'Từ chối',
    goal: 'Cho phép nhiều người chơi gặp nhau tại map dã ngoại như MMORPG lớn',
    risk: 'Nguy cơ trôi kế hoạch nghiêm trọng (Feature Creep), vỡ ngân sách và server',
    solution: 'Kiên định với Single-player ARPG tinh gọn, giữ multiplayer cho bản mở rộng',
    packageCode: 'T16, T17',
    proposer: 'Tech Team',
    decision: 'Bác bỏ hoàn toàn ở giai đoạn này',
    nextAction: 'Tập trung hoàn thiện Prototype đơn',
    dodEvaluation: 'Chặn trôi kế hoạch',
    notes: 'Bảo vệ tuyệt đối lịch phát hành Prototype'
  },
  {
    id: 'IDEA-04',
    title: 'Đồng bộ Bảng Cảnh Giới Tu Luyện giữa Truyện & Game',
    category: 'Chung',
    priority: 'P1 - Cốt lõi',
    status: 'Đã duyệt',
    goal: 'Nhất quán thuật ngữ: Khởi Linh, Ngưng Ấn, Long Hóa, Phá Giới Thần Vực',
    risk: 'Tránh xung đột tên gọi làm người đọc và game thủ cảm thấy mâu thuẫn lore',
    solution: 'Xây dựng tài liệu Lore Bible làm nguồn chân lý duy nhất cho 2 mảng',
    packageCode: 'T03, T06',
    proposer: 'Lead Writer',
    decision: 'Duyệt làm chuẩn chung toàn dự án',
    nextAction: 'Cập nhật vào tài liệu Lore Bible T06',
    dodEvaluation: 'Đạt chuẩn đồng bộ',
    notes: 'Biên tập viên cả 2 mảng đã ký duyệt'
  },
  {
    id: 'IDEA-05',
    title: 'Chuyển hướng Đồ Họa sang 3D Real-time thay vì 2D Pixel',
    category: 'Kỹ thuật',
    priority: 'P3 - Để sau',
    status: 'Tạm hoãn',
    goal: 'Đồ họa 3D hiện đại bắt mắt hơn theo xu hướng thị trường',
    risk: 'Tăng chi phí sản xuất x3 lần, kéo dài tiến độ làm tài nguyên đồ họa thêm 6 tháng',
    solution: 'Giữ phong cách 2D Pixel Art Á Đông độc đáo, tiết kiệm nguồn lực tối đa',
    packageCode: 'T15',
    proposer: 'Art Lead',
    decision: 'Kiên định với phong cách 2D Pixel',
    nextAction: 'Chuẩn hóa bộ Palette màu Pixel Art',
    dodEvaluation: 'Đảm bảo tính khả thi',
    notes: 'Tối ưu hiệu năng chạy trên mọi thiết bị'
  },
  {
    id: 'IDEA-08',
    title: 'Phát hành Chương Truyện định kỳ hàng tuần xây dựng cộng đồng',
    category: 'Truyện',
    priority: 'P2 - Xem xét',
    status: 'Đang thử nghiệm',
    goal: 'Tạo tệp người hâm mộ sớm trước khi sản phẩm game chính thức phát hành',
    risk: 'Yêu cầu duy trì kỷ luật sáng tác đều đặn để không làm gián đoạn kịch bản game',
    solution: 'Hoàn thiện dàn ý chi tiết 15 chương đầu trước khi chính thức đăng tải công khai',
    packageCode: 'T02, T05',
    proposer: 'Tác Giả Truyện',
    decision: 'Đồng ý thử nghiệm sau khi chốt dàn ý',
    nextAction: 'Hoàn thành 10 chương bản thảo đầu',
    dodEvaluation: 'Theo dõi chất lượng',
    notes: 'Ghi nhận phản hồi độc giả để tinh chỉnh game'
  }
];

// ========================================================
// 3. SAMPLE COMIC / MANGA CHAPTERS (TRUYỆN TRANH TRỰC QUAN)
// ========================================================
export const sampleComicChapters: ComicChapter[] = [
  {
    id: 'comic_chap_01',
    chapterId: 'doc_chap_01',
    title: 'Hồi 1: Chiếc Tàu Đến Sớm & Quái Vật Cột Nước',
    subtitle: 'Chuyển thể từ Chương 1: Bến Arumo trên sông Asera',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    readingDirection: 'vertical',
    pages: [
      {
        id: 'page_01',
        pageNumber: 1,
        title: 'Đêm Bến Cảng & Chiếc Tời Số 7',
        panels: [
          {
            id: 'panel_01',
            panelNumber: 1,
            caption: 'Bến Arumo — Dòng sông Asera vắt ngang trời đêm tĩnh lặng.',
            cameraAngle: 'Toàn cảnh từ trên cao nhìn xuống giếng cảng',
            actionDescription: 'Sông Asera lấp lánh như dải ngân hà bạc trên nóc nhà. Phía dưới, ánh đèn vàng leo lét của quầy cháo và bến tàu.',
            dialogues: [],
            sfx: 'RÌ RÀO... TÍCH TẮC...',
            prompt: 'Wide cinematic establishing shot of a mystical medieval harbor town at night, an enormous river flowing horizontally in the starry sky like a floating celestial water ribbon, lanterns and steam below, dark fantasy style, masterpiece',
            imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
            widthSpan: 'full',
            aspectRatio: '16:9'
          },
          {
            id: 'panel_02',
            panelNumber: 2,
            caption: 'Rento quỳ bên chiếc tời số bảy, bàn tay lấm lem dầu máy.',
            cameraAngle: 'Cận cảnh Rento và hộp bánh răng',
            actionDescription: 'Rento tập trung soi đèn, bên cạnh là chiếc tời cũ bọc bạt xanh trên xe kéo.',
            dialogues: [
              {
                id: 'd_01',
                character: 'Tovan',
                text: 'Hộ của Mira còn treo bảo hộ. Để bên quỹ xác nhận đã.',
                position: 'top-right',
                bubbleType: 'speech'
              },
              {
                id: 'd_02',
                character: 'Rento',
                text: '...Bốn năm rồi, lần nào chú cũng bảo đợi.',
                position: 'bottom-left',
                bubbleType: 'thought'
              }
            ],
            sfx: 'KENG! LÁCH CÁCH',
            prompt: 'Close-up anime webtoon style, young determined mechanic boy with grease on cheek inspecting gears of a heavy mechanical winch, atmospheric lighting, detailed mechanical parts',
            imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
            widthSpan: 'half',
            aspectRatio: '4:3'
          },
          {
            id: 'panel_03',
            panelNumber: 3,
            caption: 'Nari xuất hiện cùng cây sào gác quen thuộc.',
            cameraAngle: 'Trung cảnh góc thấp',
            actionDescription: 'Nari đứng tựa cột, chiếc vòng kim loại trên cổ tay sáng mờ, tay cầm bát mì nóng.',
            dialogues: [
              {
                id: 'd_03',
                character: 'Nari',
                text: 'Còn định ở đây tới lúc tàu mùa sau về à?',
                position: 'top-left',
                bubbleType: 'speech'
              },
              {
                id: 'd_04',
                character: 'Rento',
                text: 'Đợi con ốc này biết điều!',
                position: 'bottom-right',
                bubbleType: 'speech'
              }
            ],
            sfx: 'XÈO... HƠI NƯỚC',
            prompt: 'Medium shot webtoon comic, athletic young female dock guard holding a metallic quarterstaff with glowing ring bracelet on her wrist, gentle steam rising, soft smile, atmospheric fantasy dock',
            imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
            widthSpan: 'half',
            aspectRatio: '4:3'
          }
        ]
      },
      {
        id: 'page_02',
        pageNumber: 2,
        title: 'Cột Nước Cuộn Ngược & Con Tàu Bí Ẩn',
        panels: [
          {
            id: 'panel_04',
            panelNumber: 4,
            caption: 'ĐỘT BIẾN: Sợi cáp rùng mình dữ dội!',
            cameraAngle: 'Cận cảnh bánh răng bị kẹt và vỡ chốt',
            actionDescription: 'Chiếc tời tự động quay với tốc độ xé gió, tuốc nơ vít bị nghiền nát, mảnh vỡ bay sượt qua má Rento.',
            dialogues: [
              {
                id: 'd_05',
                character: 'Rento',
                text: 'AI MÓC HÀNG VÀO?! CHỐT HÃM GÃY RỒI!',
                position: 'bottom-left',
                bubbleType: 'shout'
              }
            ],
            sfx: 'RẮC!! ROẸT!!',
            prompt: 'Dramatic anime comic action panel, heavy iron winch spinning out of control with sparks flying, metallic teeth grinding, young mechanic dodging flying metal shards, extreme motion blur',
            imageUrl: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=800&q=80',
            widthSpan: 'half',
            aspectRatio: '4:3'
          },
          {
            id: 'panel_05',
            panelNumber: 5,
            caption: 'Mặt nước giếng cảng dựng ngược thành cột xoáy khổng lồ!',
            cameraAngle: 'Góc thấp hoành tráng (Worm-eye view)',
            actionDescription: 'Một mũi tàu nát bét bị đẩy trồi lên từ tâm cột nước xoáy ngược, thân tàu chao đảo va vào mạn đá.',
            dialogues: [
              {
                id: 'd_06',
                character: 'Nari',
                text: 'RỜI CẦU! HAI CHÚ KÉO CHUÔNG BÁO ĐỘNG!!',
                position: 'top-right',
                bubbleType: 'shout'
              }
            ],
            sfx: 'ẦM ẦM!! ROOOAR!!',
            prompt: 'Epic webtoon vertical panel, monstrous dark water spout rising unnaturally from a harbor well, a wrecked wooden galleon ship emerging head-first from the vortex, foaming water, mist and dramatic lighting',
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            widthSpan: 'half',
            aspectRatio: '4:3'
          },
          {
            id: 'panel_06',
            panelNumber: 6,
            caption: 'Nari tung người vượt qua khoảng không sinh tử.',
            cameraAngle: 'Động thái trên không, góc nghiêng 45 độ',
            actionDescription: 'Nari cầm sào cắm mạnh xuống sàn tàu vỡ, vòng cổ tay rực sáng giải phóng lực chấn động phá tan cánh cửa khoang cứu người.',
            dialogues: [
              {
                id: 'd_07',
                character: 'Nari',
                text: 'TỪNG NGƯỜI MỘT! BÁM DÂY, NHÌN VỀ PHÍA ĐÈN!',
                position: 'top-left',
                bubbleType: 'shout'
              }
            ],
            sfx: 'XOẢNG!! RẦM!!',
            prompt: 'High action anime panel, athletic heroine leaping across dark abyss onto a creaking shattered ship deck, kinetic energy waves bursting from her staff, wood splinters flying, heroic composition',
            imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1200&q=80',
            widthSpan: 'full',
            aspectRatio: '16:9'
          }
        ]
      },
      {
        id: 'page_03',
        pageNumber: 3,
        title: 'Bàn Tay Trong Suốt & Sự Thật Kinh Hoàng',
        panels: [
          {
            id: 'panel_07',
            panelNumber: 7,
            caption: 'Từ khoảng tối sau khoang ngập, một thứ dị thường trồi lên.',
            cameraAngle: 'Cận cảnh kinh dị bí ẩn (Dark Mystery)',
            actionDescription: 'Những ngón tay dài quá khổ, trong suốt nhìn thấu xương gỗ, các khớp gập ngược trôi qua nhau không theo quy luật giải phẫu.',
            dialogues: [
              {
                id: 'd_08',
                character: 'Nari',
                text: 'Nó... không phải sinh vật bình thường! Rento, giữ máy!!',
                position: 'top-right',
                bubbleType: 'shout'
              }
            ],
            sfx: 'LÁCH CÁCH... XÈO...',
            prompt: 'Eerie dark fantasy comic panel, horrifying translucent elongated alien fingers with unnatural disjointed knuckles gripping a cracked wooden doorframe, water dripping, shadowy form lurking behind, unsettling mood',
            imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
            widthSpan: 'half',
            aspectRatio: '4:3'
          },
          {
            id: 'panel_08',
            panelNumber: 8,
            caption: 'Rento siết chặt hàm kẹp ống, khóa van hút nước.',
            cameraAngle: 'Góc nghiêng căng thẳng cao độ',
            actionDescription: 'Mồ hôi và máu chảy từ bàn tay Rento khi cậu dồn toàn lực nghiền nát ống hút nước; sinh vật rũ xuống tan thành nước đục.',
            dialogues: [
              {
                id: 'd_09',
                character: 'Rento',
                text: 'KHOÁ ĐƯỢC RỒI! NARI, QUA BẾN NGAY!',
                position: 'bottom-left',
                bubbleType: 'shout'
              }
            ],
            sfx: 'RẮC!! PHÌ...',
            prompt: 'Intense anime panel, boy clenching heavy iron clamp shut with bloody hands and grimace of pain, glowing water steam escaping high pressure hose, high tension',
            imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
            widthSpan: 'half',
            aspectRatio: '4:3'
          },
          {
            id: 'panel_09',
            panelNumber: 9,
            caption: 'Người phụ nữ Omi run rẩy thốt lên câu hỏi buốt lạnh.',
            cameraAngle: 'Cận cảnh biểu cảm kinh hoàng',
            actionDescription: 'Bà lão Omi ôm bọc vải, ánh mắt nhìn những mái nhà Arumo vẫn yên bình trong bóng đêm.',
            dialogues: [
              {
                id: 'd_10',
                character: 'Omi',
                text: '...Các cháu chưa nhận được lệnh sơ tán à?',
                position: 'center',
                bubbleType: 'whisper'
              }
            ],
            sfx: 'IM LẶNG...',
            prompt: 'Emotional webtoon climax panel, shivering old woman wrapped in an oversized trenchcoat with trembling lips, eyes wide in disbelief and horror, dark misty harbor background, haunting atmosphere',
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
            widthSpan: 'full',
            aspectRatio: '16:9'
          }
        ]
      }
    ]
  },
  {
    id: 'comic_chap_02',
    chapterId: 'doc_chap_aesvorn_02',
    title: 'Hồi 2: Chiếc Đồng Hồ Chạy Thừa 5 Phút',
    subtitle: 'Chuyển thể từ Bản thảo Học viện Aesvorn',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    readingDirection: 'vertical',
    pages: [
      {
        id: 'page_aesvorn_01',
        pageNumber: 1,
        title: 'Hành Lang Tầng Hai & Tiếng Tích Tắc',
        panels: [
          {
            id: 'panel_a01',
            panelNumber: 1,
            caption: 'Học viện Aesvorn — Nơi những vết nứt zích zắc chạy dọc chân tường vôi.',
            cameraAngle: 'Toàn cảnh hành lang cổ kính hun hút',
            actionDescription: 'Ánh đèn vàng ệch như nến tàn chiếu xuống dãy cửa gỗ tối màu. Chiếc đồng hồ quả lắc sẫm màu đung đưa ở cuối dãy.',
            dialogues: [],
            sfx: 'TÍCH... TẮC... TÍCH... TẮC...',
            prompt: 'Atmospheric dark academia corridor, ancient stone academy with yellow flickering antique lamps, cracks forming strange zig-zag glyphs on peeling plaster walls, antique grandfather clock ticking at the end, moody lighting',
            widthSpan: 'full',
            aspectRatio: '16:9'
          },
          {
            id: 'panel_a02',
            panelNumber: 2,
            caption: 'Koto, Ryou và Sena quay lại trước mặt đồng hồ.',
            cameraAngle: 'Góc ngang 3 nhân vật nhìn lên mặt đồng hồ',
            actionDescription: 'Namec Koto da xanh nhạt, ăng-ten dựng thẳng đờ. Ryou khẽ siết chặt chiếc đuôi nâu quanh hông. Sena ánh mắt lạnh lùng đối chiếu thời gian.',
            dialogues: [
              {
                id: 'da_01',
                character: 'Koto',
                text: 'Chúng ta đi mười lăm phút. Nhưng nó chạy hai mươi phút.',
                position: 'top-left',
                bubbleType: 'speech'
              },
              {
                id: 'da_02',
                character: 'Ryou',
                text: '...Mày đùa tao à? Đồng hồ chạy nhanh thôi mà?',
                position: 'top-right',
                bubbleType: 'speech'
              },
              {
                id: 'da_03',
                character: 'Sena',
                text: 'Không. Tớ nhớ rõ lúc đi là 9h47. Nó không hề chạy nhanh.',
                position: 'center',
                bubbleType: 'whisper'
              }
            ],
            sfx: 'TÍCH... TẮC...',
            prompt: 'Tense anime group shot: green-skinned alien boy with antennae rigid with suspicion, beastfolk rogue boy with dark tail coiling tensely, black-haired observant girl staring at an ancient Roman numeral clock face',
            widthSpan: 'full',
            aspectRatio: '16:9'
          }
        ]
      }
    ]
  }
];

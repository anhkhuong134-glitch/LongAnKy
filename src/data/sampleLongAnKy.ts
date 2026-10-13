import { Project, Part, BibleFact, Character, TimelineEvent, ForeshadowingHook } from '../types';
import { googleCharacters } from './googleCharacters';

export const sampleProject: Project = {
  id: 'proj_long_an_ky',
  title: 'Long Ấn Thức Tỉnh',
  subtitle: 'Ký ức Sông Asera và Tiếng Gầm Dưới Bến Arumo',
  penName: 'Lục Hàn Phong',
  genre: 'Huyền huyễn / Kỳ ảo bí ẩn Á Đông (Dark Fantasy)',
  description: 'Tại bến cảng Arumo bên dòng sông Asera đang bước vào Mùa Nước Đứng, chiếc tàu trôi dạt bí ẩn chở theo những sinh vật lạ và câu hỏi về lệnh sơ tán thượng nguồn đã đánh thức cổ ấn rồng ngàn năm.',
  status: 'drafting',
  wordCountGoal: 150000,
  chapterCountGoal: 50,
  createdAt: '2026-08-15',
  updatedAt: '2026-10-13',
  currentWordCount: 18450,
  stats: {
    dailyGoal: 2000,
    wordsToday: 2150,
    streakDays: 14,
    history: [
      { date: '2026-10-07', count: 1800 },
      { date: '2026-10-08', count: 2100 },
      { date: '2026-10-09', count: 1650 },
      { date: '2026-10-10', count: 2200 },
      { date: '2026-10-11', count: 1900 },
      { date: '2026-10-12', count: 2400 },
      { date: '2026-10-13', count: 2150 }
    ]
  },
  activePartId: 'part_prologue',
  activeChapterId: 'doc_chap_prologue'
};

export const sampleBibleFacts: BibleFact[] = [
  {
    id: 'fact_long_an',
    category: 'magic_system',
    title: 'Hệ Thống Cổ Ấn Long Thần (Long Ấn)',
    content: 'Cổ ấn rồng phong ấn rồng thần và nguồn nước cội nguồn dưới đáy vực sông Asera. Khi các cọc trụ thủy lực bị dịch chuyển hoặc nước sông đứng lại, các ấn ký bắt đầu rạn nứt và phát sáng lân tinh xanh lam.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Long Ấn', 'Cổ Pháp', 'Sông Asera'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'fact_asera_river',
    category: 'location',
    title: 'Dòng Sông Asera & Mùa Nước Đứng',
    content: 'Dòng sông huyết mạch chảy từ đập thủy lực thượng nguồn qua bến Arumo ra biển lớn. Vào Mùa Nước Đứng, dòng chảy ngưng trệ bất thường, nước đóng váng xám bạc, đáy sông phát ra tiếng rền vang như hơi thở rồng.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Địa lý', 'Sông Asera', 'Mùa Nước Đứng'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'fact_arumo_port',
    category: 'location',
    title: 'Bến Cảng Arumo & Tháp Tời Số Bảy',
    content: 'Khu bến bãi sầm uất ven sông Asera, nơi tập trung xưởng máy, phu khuân vác và tuần đinh ca đêm. Tháp tời số bảy do thợ máy trẻ Rento phụ trách kéo các thuyền nặng vào bờ neo đậu.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Bến Arumo', 'Tời Máy', 'Rento'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'fact_dam_seika',
    category: 'faction',
    title: 'Đập Thủy Lực Thượng Nguồn & Quan Chấp Sự Seika',
    content: 'Đại công trình cơ khí khổng lồ kiểm soát lưu lượng nước của toàn bộ lưu vực Asera. Quan chấp sự Seika nắm quyền vận hành đập nhưng đang che giấu các vết nứt chân đế và lệnh bí mật xả lũ ngầm.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Thượng nguồn', 'Seika', 'Đập nước'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'fact_water_parasite',
    category: 'world_rule',
    title: 'Sinh Vật Ký Sinh Hút Nước Đêm Trôi Dạt',
    content: 'Thực thể kỳ dị trôi dạt từ thượng nguồn, sở hữu các bàn tay trong suốt có khả năng hút cạn nước và bóp lõm ván gỗ tàu buôn trong chớp mắt.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Quái vật', 'Sinh vật lạ', 'Tàu trôi dạt'],
    lastUpdated: '2026-10-13'
  },
  {
    id: 'fact_oren_guild',
    category: 'faction',
    title: 'Hội Thầu Cảng Của Chủ Thầu Oren',
    content: 'Tổ chức nắm giữ hợp đồng vận tải, bốc xếp và ngân quỹ bảo hộ tại bến Arumo. Luôn gây sức ép nợ nần lên gia đình Rento sau tai nạn tời máy 4 năm trước.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Oren', 'Hội thầu', 'Kinh tế'],
    lastUpdated: '2026-10-13'
  }
];

export const sampleCharacters: Character[] = googleCharacters;

export const sampleTimeline: TimelineEvent[] = [
  {
    id: 'time_accident_4yrs',
    title: 'Tai nạn nổ tời máy & Món nợ bảo hộ',
    dateOrEra: '4 năm trước',
    sortOrder: 1,
    description: 'Chiếc tời cũ bị quá tải vỡ nổ khiến gia đình thợ dệt Mira bị Hội thầu Oren tước quyền sở hữu xưởng và treo bảo hộ nợ nần.',
    location: 'Bến cảng Arumo',
    involvedCharacterIds: ['char_rento', 'char_mira', 'char_oren']
  },
  {
    id: 'time_border_night',
    title: 'Đêm Giới Nghiêm & Ranh Giới Bất Thường',
    dateOrEra: 'Đêm mở đầu Mùa Nước Đứng',
    sortOrder: 2,
    description: 'Sông Asera ngưng chảy tạo thành ranh giới bất thường; Nari bắt đầu ca trực đêm tại nhà trực bến cảng.',
    location: 'Cầu phao bến Arumo',
    involvedCharacterIds: ['char_nari', 'char_garan']
  },
  {
    id: 'time_ghost_ship',
    title: 'Chiếc Tàu Đến Sớm & Trục Tời Gãy Đôi',
    dateOrEra: 'Đêm muộn hồi chuông cuối',
    sortOrder: 3,
    description: 'Chiếc tàu trôi dạt từ thượng nguồn đâm vào bến; Rento khởi động tời số 7 kéo tàu thành công nhưng gãy đôi trục truyền lực.',
    location: 'Tháp tời số bảy bến Arumo',
    involvedCharacterIds: ['char_rento', 'char_nari', 'char_dagan']
  },
  {
    id: 'time_omi_warning',
    title: 'Nhân Chứng Bà Omi & Câu Hỏi Về Lệnh Sơ Tán',
    dateOrEra: 'Rạng sáng hôm sau',
    sortOrder: 4,
    description: 'Bà lão Omi được vớt lên từ tàu trôi dạt, hỏi câu rợn người: "Các cháu chưa nhận được lệnh sơ tán à?"',
    location: 'Nhà cứu thương bến Arumo',
    involvedCharacterIds: ['char_omi', 'char_rento', 'char_nari']
  }
];

export const sampleForeshadowingHooks: ForeshadowingHook[] = [
  {
    id: 'hook_cracked_winch',
    title: 'Trục Tời Số Bảy Bị Gãy Đôi Giấu Dưới Bạt Xanh',
    description: 'Chiếc tời bãi phế liệu của Rento bị gãy trục chịu lực sau vụ kéo tàu đêm; nếu Oren phát hiện thì xưởng của mẹ sẽ vĩnh viễn bị tịch thu.',
    status: 'developing',
    plantedChapterId: 'doc_chap_01',
    plantedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    lastMentionedChapterId: 'doc_chap_01',
    lastMentionedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    chaptersDormant: 0,
    importance: 'major',
    clues: [
      {
        chapterId: 'doc_chap_01',
        chapterTitle: 'Chương 1',
        snippet: 'Chiếc tời mua từ bãi phế liệu giấu dưới bạt xanh đã bị gãy đôi trục khi cứu chiếc tàu trôi dạt.',
        note: 'Rento giấu cả Nari lẫn mẹ Mira'
      }
    ]
  },
  {
    id: 'hook_omi_evacuation',
    title: 'Lệnh Sơ Tán Thượng Nguồn Bí Mật',
    description: 'Bà Omi khẳng định thượng nguồn đã phát lệnh sơ tán khẩn cấp vì đập nứt, nhưng hạ nguồn bến Arumo hoàn toàn không nhận được tin tức gì.',
    status: 'planted',
    plantedChapterId: 'doc_chap_01',
    plantedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    lastMentionedChapterId: 'doc_chap_01',
    lastMentionedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    chaptersDormant: 0,
    importance: 'major',
    clues: [
      {
        chapterId: 'doc_chap_01',
        chapterTitle: 'Chương 1',
        snippet: 'Bà lão nhìn quanh rồi thì thầm: "Các cháu chưa nhận được lệnh sơ tán à?"',
        note: 'Manh mối quan trọng về sự mờ ám của Quan chấp sự Seika'
      }
    ]
  },
  {
    id: 'hook_water_hand',
    title: 'Bàn Tay Trong Suốt Hút Nước Ký Sinh',
    description: 'Vết lõm bất thường trên ván tàu trôi dạt mang hình bàn tay trong suốt hút cạn nước.',
    status: 'planted',
    plantedChapterId: 'doc_chap_01',
    plantedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    lastMentionedChapterId: 'doc_chap_01',
    lastMentionedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    chaptersDormant: 0,
    importance: 'major',
    clues: [
      {
        chapterId: 'doc_chap_01',
        chapterTitle: 'Chương 1',
        snippet: 'Gỗ ván bị hút kiệt nước đến giòn vụn, in hình dấu năm ngón dài bất thường.',
        note: 'Dấu tích của sinh vật trốn thoát từ cấm địa đập nước'
      }
    ]
  },
  {
    id: 'hook_nari_wrist',
    title: 'Cổ Tay Sưng Đau Bị Giấu Kín Của Nari',
    description: 'Nari bị chấn thương cổ tay phải sau cú đáp cứu hộ nhưng bí mật đổi sang cầm bút tay trái để không bị tước thẻ trực ca.',
    status: 'planted',
    plantedChapterId: 'doc_chap_01',
    plantedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    lastMentionedChapterId: 'doc_chap_01',
    lastMentionedChapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
    chaptersDormant: 0,
    importance: 'medium',
    clues: [
      {
        chapterId: 'doc_chap_01',
        chapterTitle: 'Chương 1',
        snippet: 'Cô đổi bút sang tay trái, tay phải giấu dưới vạt áo đồng phục sẫm màu.',
        note: 'Nỗi sợ bị thay thế của Nari'
      }
    ]
  }
];

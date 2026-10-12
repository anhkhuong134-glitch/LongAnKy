const fs = require('fs');

const chapters = JSON.parse(fs.readFileSync('parsed_chapters.json', 'utf8'));

const epilogueText = `Thứ duy nhất không thể bị xóa — dù người ta đã cố, dù người ta đã gần thành công, dù có những khoảnh khắc mà chính ba người trong câu chuyện này cũng không còn nhớ tại sao mình phải giữ lấy nữa.

Thứ còn lại không có tên. Chỉ có nhịp. Và nhịp thì không cần ai nhớ để tiếp tục vang.

Khi bình minh đầu tiên sau ngày trăng tròn chiếu qua những khung cửa sổ dài của Học viện Aesvorn, những bức tường đá xám dày dặn vẫn đứng đó, im lặng và kiên nhẫn. Nhưng sâu bên dưới nền móng, nơi vết nứt hư không từng bị che đậy suốt hàng trăm năm, một âm thanh rất khẽ vẫn đang truyền qua các thớ đá.

Tốc — tốc — tốc.

Và từ khoảng không giữa những người còn đang sống, tiếng thứ tư vẫn đáp lại. Bình thản, vững chãi, như lời khẳng định rằng dù danh sách có bị xóa đi, dù cuốn sổ có mục nát, thì những gì đã xảy ra... vẫn vĩnh viễn đã xảy ra.`;

const tsContent = `import { Project, Part, BibleFact, Character, TimelineEvent, ForeshadowingHook } from '../types';

export const sampleProject: Project = {
  id: 'proj_long_an_ky',
  title: 'Long Ấn Ký',
  subtitle: 'Ký ức bị xóa và Tiếng gõ từ Vực Thẳm',
  penName: 'Lục Hàn Phong',
  genre: 'Huyền huyễn / Kỳ ảo bí ẩn (Dark Fantasy)',
  description: 'Tại Học viện Aesvorn, nơi ký ức bị thanh tẩy và những vết nứt không gian bắt đầu rạn vỡ, ba con người gắn kết bởi một cuốn sổ da nâu, sợi chỉ đỏ và nhịp ba tiếng gõ bí ẩn.',
  status: 'drafting',
  wordCountGoal: 120000,
  chapterCountGoal: 40,
  createdAt: '2026-08-15',
  updatedAt: '2026-09-03',
  currentWordCount: 11764,
  stats: {
    dailyGoal: 1500,
    wordsToday: 1850,
    streakDays: 9,
    history: [
      { date: '2026-08-28', count: 1400 },
      { date: '2026-08-29', count: 1650 },
      { date: '2026-08-30', count: 980 },
      { date: '2026-08-31', count: 1800 },
      { date: '2026-09-01', count: 1200 },
      { date: '2026-09-02', count: 1520 },
      { date: '2026-09-03', count: 1850 }
    ]
  },
  activePartId: 'part_chapters',
  activeChapterId: 'chap_04'
};

export const sampleParts: Part[] = [
  {
    id: 'part_prologue',
    title: 'Mở đầu',
    order: 1,
    description: 'Có một thứ mà con người sợ hơn cái chết: bị quên khi vẫn còn đang sống.',
    wordCount: 1111,
    isExpanded: true,
    chapters: [
      {
        id: 'chap_prologue',
        partId: 'part_prologue',
        title: 'Mở đầu: Có một thứ mà con người sợ hơn cái chết',
        order: 1,
        description: 'Về ký ức, sự lãng quên và vết nứt nền móng của học viện.',
        content: ${JSON.stringify(chapters.prologueText)},
        wordCount: 1111,
        status: 'final',
        povCharacterName: 'Người dẫn truyện',
        location: 'Học viện Aesvorn',
        timeOfDay: 'Không thời gian',
        notes: 'Đoạn văn triết lý mở đầu, thiết lập toàn bộ tông giọng của tiểu thuyết.',
        presentCharacterIds: ['char_sena', 'char_koto', 'char_ryou'],
        foreshadowingIds: ['hook_three_knocks'],
        scenes: []
      }
    ]
  },
  {
    id: 'part_chapters',
    title: 'Các chương',
    order: 2,
    description: 'Khởi nguồn: Thứ sai lệch xuất hiện tại Học viện Aesvorn.',
    wordCount: 10653,
    isExpanded: true,
    chapters: [
      {
        id: 'chap_01',
        partId: 'part_chapters',
        title: 'Chương 1: Người không tồn tại',
        order: 1,
        description: 'Buổi điểm danh ở Giảng đường Lý Thuyết Nền số 3 và sinh viên áo trắng hai bóng.',
        content: ${JSON.stringify(chapters.chap1Text)},
        wordCount: 2256,
        status: 'final',
        povCharacterName: 'Sena',
        location: 'Giảng đường Lý Thuyết Nền số 3',
        timeOfDay: 'Sáng thứ Ba',
        notes: 'Giới thiệu Sena, Koto người Namec, Ryou có đuôi quấn hông, và sinh viên áo trắng.',
        presentCharacterIds: ['char_sena', 'char_koto', 'char_ryou'],
        foreshadowingIds: ['hook_white_shirt'],
        scenes: []
      },
      {
        id: 'chap_02',
        partId: 'part_chapters',
        title: 'Chương 2: Những sai lệch nhỏ',
        order: 2,
        description: 'Buổi chiều ở căng tin, câu chuyện hai phiên bản và chiếc đồng hồ chạy nhanh 5 phút.',
        content: ${JSON.stringify(chapters.chap2Text)},
        wordCount: 2699,
        status: 'final',
        povCharacterName: 'Sena',
        location: 'Căng tin & Hành lang tầng 2',
        timeOfDay: 'Buổi chiều',
        notes: 'Mối quan hệ ba người bắt đầu gắn kết qua những chi tiết sai lệch.',
        presentCharacterIds: ['char_sena', 'char_koto', 'char_ryou'],
        foreshadowingIds: ['hook_clock_drift'],
        scenes: []
      },
      {
        id: 'chap_03',
        partId: 'part_chapters',
        title: 'Chương 3: Nhịp tay',
        order: 3,
        description: 'Dưới gốc cây cổ thụ, tiếng gõ ba ngón tay đồng bộ và tiếng gõ thứ tư vô hình.',
        content: ${JSON.stringify(chapters.chap3Text)},
        wordCount: 2589,
        status: 'final',
        povCharacterName: 'Sena',
        location: 'Cây cổ thụ góc tây Aesvorn',
        timeOfDay: 'Hoàng hôn thứ Năm',
        notes: 'Thiết lập biểu tượng Tốc — tốc — tốc và tiếng thứ tư vô hình.',
        presentCharacterIds: ['char_sena', 'char_koto', 'char_ryou'],
        foreshadowingIds: ['hook_three_knocks'],
        scenes: []
      },
      {
        id: 'chap_04',
        partId: 'part_chapters',
        title: 'Chương 4: Vết nứt',
        order: 4,
        description: 'Thư viện cũ sau tủ sách hành lang B, cuốn sổ da nâu và trang Vết Nứt Hư Không.',
        content: ${JSON.stringify(chapters.chap4Text)},
        wordCount: 3109,
        status: 'draft',
        povCharacterName: 'Sena',
        location: 'Thư viện cũ sau hành lang B',
        timeOfDay: 'Thứ Tư, sau 10 giờ đêm',
        notes: 'Cao trào hiện tại của bản thảo. Koto giữ cuốn sổ da nâu và sợi chỉ đỏ quấn cổ tay.',
        presentCharacterIds: ['char_sena', 'char_koto', 'char_ryou'],
        foreshadowingIds: ['hook_leather_notebook', 'hook_three_dots', 'hook_three_knocks'],
        scenes: []
      }
    ]
  },
  {
    id: 'part_epilogue',
    title: 'Phần kết',
    order: 3,
    description: 'Dự thảo kết truyện: Sự thức tỉnh của Mạch và nhịp không có tên.',
    wordCount: 450,
    isExpanded: false,
    chapters: [
      {
        id: 'chap_epilogue',
        partId: 'part_epilogue',
        title: 'Phần kết: Tiếng Vang Còn Lại',
        order: 1,
        description: 'Đoạn kết dự kiến: Thứ duy nhất không thể bị xóa là nhịp.',
        content: ${JSON.stringify(epilogueText)},
        wordCount: 450,
        status: 'draft',
        povCharacterName: 'Ngôi thứ ba',
        location: 'Học viện Aesvorn',
        timeOfDay: 'Bình minh sau cơn bão',
        notes: 'Đoạn kết dự thảo theo Story Bible Canon.',
        presentCharacterIds: ['char_sena', 'char_koto', 'char_ryou'],
        foreshadowingIds: ['hook_three_knocks'],
        scenes: []
      }
    ]
  }
];

export const sampleBibleFacts: BibleFact[] = [
  {
    id: 'fact_01',
    category: 'world_rule',
    title: 'Bản chất của Ký ức và Không gian (Memory in Space Law)',
    content: 'Ký ức không nằm trong vật chất (tường, đá, gỗ) mà nằm trong khoảng không gian giữa chúng. Nơi có quá nhiều ký ức bị xóa đi cùng lúc sẽ trở nên lệch (glitch), xê dịch vài centimet so với thực tại.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Ký ức', 'Quy luật thế giới', 'Không gian'],
    lastUpdated: '2026-09-03'
  },
  {
    id: 'fact_02',
    category: 'terminology',
    title: 'Nhịp Ba Tiếng Gõ & Tiếng Thứ Tư Vô Hình',
    content: 'Ba ngón tay giữa chụm lại gõ ba lần (Tốc — tốc — tốc) đồng bộ. Luôn có một tiếng gõ thứ tư xuất hiện từ khoảng trống vô hình giữa các nhân vật.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Âm thanh', 'Nhịp gõ', 'Quy thức cổ'],
    lastUpdated: '2026-09-03'
  },
  {
    id: 'fact_03',
    category: 'secret',
    title: 'Cuốn Sổ Da Bìa Nâu & Trang Thứ Tư',
    content: 'Bìa da nâu sờn mép, gáy quấn sợi chỉ đỏ cũ (sau đó đứt và quấn quanh cổ tay Koto). Trang 4 ghi 3 chữ to: VẾT NỨT HƯ KHÔNG cùng bản vẽ zích zắc và ba chấm tròn nhỏ nằm sát nhau trong vòng mờ.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Vật phẩm', 'Cuốn sổ da', 'Koto', 'Vết nứt'],
    lastUpdated: '2026-09-03'
  },
  {
    id: 'fact_04',
    category: 'location',
    title: 'Học Viện Aesvorn & Thư Viện Cũ Hành Lang B',
    content: 'Học viện xây dựng trên nền móng của một vết nứt lãng quên. Thư viện cũ bị xóa khỏi bản đồ chính thức, nằm ẩn sau tủ sách gỗ cao đến trần ở cuối hành lang B.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Địa điểm', 'Aesvorn', 'Thư viện cũ'],
    lastUpdated: '2026-09-03'
  },
  {
    id: 'fact_05',
    category: 'world_rule',
    title: 'Hiện Tượng Sai Lệch (Reality Glitches)',
    content: 'Đồng hồ quả lắc hành lang tầng 2 chạy nhanh 5 phút trong khoảng thời gian 15 phút; sinh viên áo trắng khi đứng lên đổ hai bóng về hai hướng khác nhau rồi biến mất; sách tự dịch chuyển trên kệ trong phòng không người.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Sai lệch', 'Quy luật thế giới', 'Đồng hồ'],
    lastUpdated: '2026-09-03'
  },
  {
    id: 'fact_06',
    category: 'constraint',
    title: 'Rào chắn: Không ai được biết ai vẽ ba chấm tròn',
    content: 'Ba nhân vật tuyệt đối không biết ai là người vẽ bản đồ zích zắc và ba chấm tròn trên cuốn sổ da cho đến khi giải mã được bí mật tầng hầm.',
    status: 'canon',
    createdBy: 'author',
    tags: ['Giới hạn', 'Bí ẩn'],
    lastUpdated: '2026-09-03'
  }
];

export const sampleCharacters: Character[] = [
  {
    id: 'char_sena',
    name: 'Sena',
    aliases: ['Cô gái ghi nhật ký', 'Người cảm nhận vết nứt'],
    role: 'protagonist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '19 tuổi',
      appearance: 'Tóc đen ngắn lộn xộn, mắt xám tro mang ánh nhìn kiên định, dáng người nhỏ nhắn so với hành lý nhập học.',
      personality: 'Điềm tĩnh, nhạy bén, không chấp nhận những câu trả lời lấp liếm (tòa nhà cũ mà). Có thói quen viết nhật ký vào ban đêm từ năm 12 tuổi để neo giữ những ngày đã qua không trôi mất.',
      voiceCadence: 'Nói năng khúc chiết, câu từ chậm rãi, có khoảng dừng, không giải thích khi không cần thiết.',
      externalWant: 'Hiểu rõ tại sao Aesvorn lại mang lại cảm giác sai lệch và nguồn gốc mùi đất ẩm hành lang tầng 4.',
      internalNeed: 'Giữ lại những mảnh ký ức về những người xung quanh không để bị thế giới xóa nhòa.',
      flawOrWound: 'Hay mơ về những người mà khi tỉnh dậy không thể nhớ mặt; cảm giác đau buốt ở thái dương khi cố nhớ.',
      secrets: ['Ghi nhật ký về sự kiện sinh viên áo trắng và chiếc đồng hồ chạy nhanh']
    },
    relationships: [
      {
        targetCharacterId: 'char_koto',
        targetName: 'Koto',
        relationType: 'Bạn học tri âm',
        note: 'Tin tưởng sự quan sát tinh tường của Koto về hiện tượng hai bóng và chiếc đồng hồ.'
      },
      {
        targetCharacterId: 'char_ryou',
        targetName: 'Ryou',
        relationType: 'Bạn học tranh luận',
        note: 'Thường xuyên tranh cãi về bài tập và xấp xỉ toán học nhưng luôn đứng về phía nhau khi nguy cấp.'
      }
    ],
    dynamicState: {
      currentLocation: 'Hành lang B sau cuộc chạy trốn',
      healthStatus: 'Hơi mệt, tim đập nhanh, thở ra khói trắng',
      itemsCarried: ['Nhật ký cá nhân', 'Bút chì'],
      emotionalState: 'Căng thẳng nhưng kiên định'
    },
    knowledgeTracker: [
      {
        chapterId: 'chap_04',
        chapterTitle: 'Chương 4',
        timestamp: 'Thứ Tư, sau 10h đêm',
        knownSecrets: ['Koto giữ cuốn sổ da nâu và sợi chỉ đỏ', 'Trang 4 có chữ Vết Nứt Hư Không và 3 chấm tròn', 'Kệ sách tự dịch chuyển'],
        forbiddenSecrets: ['Thân phận thực sự của người viết cuốn sổ', 'Nguồn gốc sâu xa của vết nứt']
      }
    ]
  },
  {
    id: 'char_koto',
    name: 'Koto',
    aliases: ['Người Namec', 'Kẻ để ý hai bóng'],
    role: 'deuteragonist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '20 tuổi',
      appearance: 'Người Namec da xanh lục nhạt, đôi ăng-ten nhỏ ở hai bên thái dương, đôi mắt màu tím xám sâu thẳm.',
      personality: 'Trầm lặng, cẩn thận, khả năng quan sát siêu việt. Ăng-ten cụp xuống khi suy nghĩ/tập trung và dựng thẳng cứng khi cảnh giác cao độ.',
      voiceCadence: 'Giọng trầm, đều, đặt từng chữ cẩn trọng như đặt chân trên băng mỏng.',
      externalWant: 'Khám phá sự thật về những sai lệch không gian tại Aesvorn.',
      internalNeed: 'Tìm thấy những người bạn cùng tần số thấu hiểu sự nhạy cảm của mình.',
      flawOrWound: 'Đã quen với việc tồn tại trong một nơi không được thiết kế cho giống loài của mình.',
      secrets: ['Đang giữ cuốn sổ da nâu có sợi chỉ đỏ quấn quanh cổ tay trong túi áo khoác']
    },
    relationships: [
      {
        targetCharacterId: 'char_sena',
        targetName: 'Sena',
        relationType: 'Đồng minh quan sát',
        note: 'Biết Sena là người đầu tiên tin vào những quan sát của mình.'
      }
    ],
    dynamicState: {
      currentLocation: 'Hành lang B',
      healthStatus: 'Ổn định, ăng-ten dựng thẳng cảnh giác',
      itemsCarried: ['Cuốn sổ da nâu', 'Sợi chỉ đỏ quấn cổ tay'],
      emotionalState: 'Cực kỳ tập trung và đề phòng'
    },
    knowledgeTracker: [
      {
        chapterId: 'chap_04',
        chapterTitle: 'Chương 4',
        timestamp: 'Thứ Tư đêm',
        knownSecrets: ['Cuốn sổ da có trang Vết Nứt Hư Không', 'Sợi chỉ đỏ tự đứt và quấn quanh tay', 'Tiếng trang sách tự lật trong thư viện cấm'],
        forbiddenSecrets: ['Ý nghĩa thực sự của ba chấm tròn']
      }
    ]
  },
  {
    id: 'char_ryou',
    name: 'Ryou',
    aliases: ['Cậu bạn có đuôi', 'Triết gia bánh mì kẹp trứng'],
    role: 'supporting',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '20 tuổi',
      appearance: 'Dáng người không nổi bật một cách hoàn hảo; có chiếc đuôi màu nâu sẫm quấn quanh hông.',
      personality: 'Thẳng thắn, thích nói chuyện thực tế (cuộc đời có ý nghĩa nhờ bánh mì kẹp trứng). Siết đuôi khi ở chỗ đông người và thả lỏng khi ở cạnh bạn thân. Hay gõ nhịp đầu ngón tay khi suy nghĩ.',
      voiceCadence: 'Linh hoạt, hài hước đời thường, dứt khoát.',
      externalWant: 'Hoàn thành bài vở và giữ an toàn cho nhóm.',
      internalNeed: 'Học cách thừa nhận nỗi sợ trước những điều không thể giải thích.',
      flawOrWound: 'Ký ức đôi khi bị phân mảnh (kể câu chuyện có 2 phiên bản mà không tự nhận ra).',
      secrets: ['Cảm nhận nhịp tay khi đẩy cửa chạy trốn khớp hoàn toàn với nhịp ba tiếng gõ']
    },
    relationships: [
      {
        targetCharacterId: 'char_sena',
        targetName: 'Sena',
        relationType: 'Bạn thân',
        note: 'Hay tranh luận bài tập nhưng luôn bảo vệ Sena khi gặp nguy.'
      }
    ],
    dynamicState: {
      currentLocation: 'Hành lang B',
      healthStatus: 'Khỏe mạnh, đuôi hơi co lại vì lạnh',
      itemsCarried: ['Điện thoại', 'Mảnh giấy chỉ đường thư viện cũ'],
      emotionalState: 'Hoang mang nhẹ trước nhịp tay của chính mình'
    },
    knowledgeTracker: [
      {
        chapterId: 'chap_04',
        chapterTitle: 'Chương 4',
        timestamp: 'Thứ Tư đêm',
        knownSecrets: ['Lối vào thư viện cũ sau tủ sách hành lang B', 'Nhịp gõ tay của mình trùng với nhịp Tốc — tốc — tốc'],
        forbiddenSecrets: ['Lý do câu chuyện của mình có hai phiên bản']
      }
    ]
  }
];

export const sampleTimeline: TimelineEvent[] = [
  {
    id: 'time_01',
    title: 'Sena nhập học Aesvorn',
    dateOrEra: 'Buổi sáng tháng Chín',
    sortOrder: 1,
    description: 'Sena đến Aesvorn với túi hành lý lớn, cảm nhận tòa nhà chiếm nhiều không gian hơn thực tế.',
    location: 'Sân chính Học viện Aesvorn',
    involvedCharacterIds: ['char_sena']
  },
  {
    id: 'time_02',
    title: 'Sự cố sinh viên áo trắng hai bóng',
    dateOrEra: 'Tuần thứ ba, Sáng thứ Ba 8h',
    sortOrder: 2,
    description: 'Brell điểm danh cái tên không rõ; sinh viên áo trắng có hai bóng đổ về hai hướng rồi biến mất.',
    location: 'Giảng đường Lý Thuyết Nền số 3',
    involvedCharacterIds: ['char_sena', 'char_koto', 'char_ryou']
  },
  {
    id: 'time_03',
    title: 'Đồng hồ quả lắc nhảy 5 phút',
    dateOrEra: 'Buổi chiều, 9h47 -> 9h52',
    sortOrder: 3,
    description: 'Tại căng tin, câu chuyện hai phiên bản; đồng hồ tầng 2 chạy nhanh 5 phút; tiếng sột soạt cuối hành lang.',
    location: 'Căng tin & Hành lang tầng 2',
    involvedCharacterIds: ['char_sena', 'char_koto', 'char_ryou']
  },
  {
    id: 'time_04',
    title: 'Nhịp ba tiếng gõ dưới gốc cây cổ thụ',
    dateOrEra: 'Chiều thứ Năm hoàng hôn',
    sortOrder: 4,
    description: 'Ba người vô thức gõ Tốc — tốc — tốc; tiếng thứ tư vô hình vang lên từ khoảng trống.',
    location: 'Cây cổ thụ góc tây',
    involvedCharacterIds: ['char_sena', 'char_koto', 'char_ryou']
  },
  {
    id: 'time_05',
    title: 'Đột nhập thư viện cũ sau tủ sách',
    dateOrEra: 'Thứ Tư sau 10h đêm',
    sortOrder: 5,
    description: 'Tìm thấy cuốn sổ da nâu có sợi chỉ đỏ; trang Vết Nứt Hư Không; kệ sách dịch chuyển; chạy thoát.',
    location: 'Thư viện cũ sau hành lang B',
    involvedCharacterIds: ['char_sena', 'char_koto', 'char_ryou']
  }
];

export const sampleForeshadowingHooks: ForeshadowingHook[] = [
  {
    id: 'hook_three_knocks',
    title: 'Nhịp Ba Tiếng Gõ (Tốc — tốc — tốc)',
    description: 'Cử chỉ vô thức gõ ba ngón tay giữa đồng bộ; tiếng thứ tư vang lên từ khoảng trống vô hình.',
    status: 'developing',
    plantedChapterId: 'chap_03',
    plantedChapterTitle: 'Chương 3: Nhịp tay',
    lastMentionedChapterId: 'chap_04',
    lastMentionedChapterTitle: 'Chương 4: Vết nứt',
    chaptersDormant: 0,
    importance: 'major',
    clues: [
      {
        chapterId: 'chap_03',
        chapterTitle: 'Chương 3',
        snippet: 'Tốc — tốc — tốc... Tao nghe thấy bốn tiếng.',
        note: 'Dưới gốc cây cổ thụ góc tây'
      },
      {
        chapterId: 'chap_04',
        chapterTitle: 'Chương 4',
        snippet: 'Lúc cánh cửa kẹt và tao phải đẩy mạnh hơn, tao gõ vào tường ba lần để tính lực. Và nhịp đó là nhịp đó.',
        note: 'Ryou nhận ra khi chạy thoát khỏi thư viện cũ'
      }
    ]
  },
  {
    id: 'hook_leather_notebook',
    title: 'Cuốn Sổ Da Bìa Nâu & Sợi Chỉ Đỏ',
    description: 'Bìa da nâu sờn mép, trang thứ tư ghi VẾT NỨT HƯ KHÔNG và ba chấm tròn nhỏ nằm sát nhau.',
    status: 'developing',
    plantedChapterId: 'chap_04',
    plantedChapterTitle: 'Chương 4: Vết nứt',
    lastMentionedChapterId: 'chap_04',
    lastMentionedChapterTitle: 'Chương 4: Vết nứt',
    chaptersDormant: 0,
    importance: 'major',
    clues: [
      {
        chapterId: 'chap_04',
        chapterTitle: 'Chương 4',
        snippet: 'Bìa da màu nâu sẫm, mép bìa sờn, gáy sổ có một sợi chỉ đỏ cũ buộc quanh hai vòng...',
        note: 'Tìm thấy dưới kệ sách thấp nhất thư viện cũ'
      }
    ]
  },
  {
    id: 'hook_three_dots',
    title: 'Ký Hiệu Ba Chấm Tròn Trong Vòng Mờ',
    description: 'Bản vẽ bút chì zích zắc có 3 chấm tròn nhỏ nằm sát nhau ở góc dưới phải trang thứ tư cuốn sổ da.',
    status: 'planted',
    plantedChapterId: 'chap_04',
    plantedChapterTitle: 'Chương 4: Vết nứt',
    lastMentionedChapterId: 'chap_04',
    lastMentionedChapterTitle: 'Chương 4: Vết nứt',
    chaptersDormant: 0,
    importance: 'major',
    clues: [
      {
        chapterId: 'chap_04',
        chapterTitle: 'Chương 4',
        snippet: 'ở góc dưới phải — nhỏ đến mức phải nhìn thật gần mới thấy — là ba chấm tròn nhỏ nằm sát nhau, được khoanh tròn bằng một vòng mờ nhạt...',
        note: 'Trang 4 cuốn sổ da nâu'
      }
    ]
  },
  {
    id: 'hook_white_shirt',
    title: 'Kẻ Không Tồn Tại (Sinh viên áo trắng hai bóng)',
    description: 'Sinh viên có tên không ai nghe rõ, khi đứng dậy ngồi xuống đổ hai bóng về hai hướng khác nhau.',
    status: 'planted',
    plantedChapterId: 'chap_01',
    plantedChapterTitle: 'Chương 1: Người không tồn tại',
    lastMentionedChapterId: 'chap_01',
    lastMentionedChapterTitle: 'Chương 1: Người không tồn tại',
    chaptersDormant: 3,
    importance: 'medium',
    clues: [
      {
        chapterId: 'chap_01',
        chapterTitle: 'Chương 1',
        snippet: 'Cái bóng của cậu ta lúc đứng dậy đổ hai hướng... không còn ai nhớ gương mặt cậu ta.',
        note: 'Tại Giảng đường Lý Thuyết Nền số 3'
      }
    ]
  },
  {
    id: 'hook_clock_drift',
    title: 'Đồng Hồ Quả Lắc Hành Lang Tầng 2 Nhảy Giờ',
    description: 'Đồng hồ quả lắc vỏ gỗ sẫm chạy thêm 5 phút so với thời gian thực tế trong 15 phút.',
    status: 'planted',
    plantedChapterId: 'chap_02',
    plantedChapterTitle: 'Chương 2: Những sai lệch nhỏ',
    lastMentionedChapterId: 'chap_02',
    lastMentionedChapterTitle: 'Chương 2: Những sai lệch nhỏ',
    chaptersDormant: 2,
    importance: 'medium',
    clues: [
      {
        chapterId: 'chap_02',
        chapterTitle: 'Chương 2',
        snippet: 'Đồng hồ chạy thêm năm phút so với thực tế... nó đang đếm một thứ không phải là thời gian.',
        note: 'Hành lang tầng 2 gần căng tin'
      }
    ]
  }
];
`;

fs.writeFileSync('src/data/sampleLongAnKy.ts', tsContent, 'utf8');
console.log('Successfully generated sampleLongAnKy.ts with Part -> Chapter direct hierarchy!');

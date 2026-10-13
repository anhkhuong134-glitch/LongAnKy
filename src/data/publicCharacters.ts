export interface PublicCharacter {
  id: string;
  name: string;
  aliases: string[];
  role: 'protagonist' | 'deuteragonist' | 'supporting' | 'antagonist';
  roleLabel: string;
  oneLineDesc: string;
  age: string;
  gender: string;
  occupation: string;
  origin: string;
  residence: string;
  chibiArt: string;
  avatar: string;
  isPublic: boolean;
  assetReady: boolean;
  profileReady: boolean;
  publicReady: boolean;
  groupTag: 'all' | 'main' | 'arumo';
  recognitionPoints: string[];
  personalityText: string;
  backgroundText: string;
  quoteSamples: string[];
  relationships: {
    targetId: string;
    targetName: string;
    relationType: string;
    note: string;
  }[];
  appearedChapters: {
    chapterId: string;
    chapterTitle: string;
  }[];
  // Internal author fields (not exposed directly on reader page)
  internalNotes?: {
    secrets: string[];
    externalWant: string;
    internalNeed: string;
    flawOrWound: string;
  };
}

export const ALL_CHARACTERS_DATA: PublicCharacter[] = [
  {
    id: 'char_rento',
    name: 'Rento',
    aliases: ['NV01', 'Thợ máy trẻ bến Arumo'],
    role: 'protagonist',
    roleLabel: 'Nhân vật chính',
    oneLineDesc: 'Thợ máy trẻ ở bến Arumo.',
    age: '18 tuổi',
    gender: 'Nam',
    occupation: 'Thợ sửa máy tời & cơ khí bến cảng',
    origin: 'Bến Arumo, ven sông Asera',
    residence: 'Xưởng tời nhỏ & nhà riêng gần ngõ chợ',
    chibiArt: '/art/characters/01-rento-v03.png',
    avatar: '/art/characters/01-rento-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'main',
    recognitionPoints: [
      'Ngón tay thường dính vệt dầu mỡ máy móc và vết xước kim loại',
      'Áo thợ màu be sờn vai, vạt áo gọn ghẽ để khỏi vướng bánh răng',
      'Luôn mang theo túi dụng cụ sửa tời bên hông cùng tuốc nơ vít cán nứt'
    ],
    personalityText: 'Rento là người luôn muốn tự tay sửa chữa mọi thứ hỏng hóc quanh mình. Cậu sợ người khác nhìn mình như kẻ bất tài và sợ mẹ phải làm việc nặng, nên thường nhận trách nhiệm rất nhanh nhưng lại tự gánh một mình. Cậu nói năng nhanh nhẹn, rành rọt khi bàn về bánh răng, tời kéo, nhưng giọng thường ngập ngừng, trầm xuống mỗi khi nhắc đến chuyện tiền công hay món nợ gia đình.',
    backgroundText: 'Lớn lên cùng mẹ Mira bên những xưởng sửa máy của bến Arumo. Sau tai nạn máy tời cũ 4 năm trước khiến gia đình bị treo bảo hộ quỹ bến, Rento luôn mang tâm lý mắc nợ và quyết tâm tích góp mua lại xưởng cho mẹ. Đêm trực bến nọ, khi chiếc tàu trôi dạt từ thượng nguồn lao vào giếng cảng, cậu đã dùng chiếc máy tời bí mật để cứu người.',
    quoteSamples: [
      '“Răng cưa trượt một nhịp là cả cần phanh gãy theo đấy, để em chỉnh lại đã.”',
      '“Tàu vào bến rồi, người sống sót cần được kéo lên trước!”'
    ],
    relationships: [
      { targetId: 'char_mira', targetName: 'Mira', relationType: 'Mẹ con', note: 'Muốn kiếm tiền chuộc xưởng cho mẹ; sợ mẹ lo lắng nên giấu chuyện máy tời gãy.' },
      { targetId: 'char_nari', targetName: 'Nari', relationType: 'Bạn đồng hành ca đêm', note: 'Cùng trực ca đêm tại bến Arumo; phối hợp ăn ý khi cứu tàu trôi dạt.' },
      { targetId: 'char_dagan', targetName: 'Dagan', relationType: 'Bạn thân', note: 'Thương Dagan phải khuân vác cực nhọc; hứa sẽ dạy nghề máy móc cho Dagan.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_prologue', chapterTitle: 'Mở đầu: Ranh giới của sự bình thường' },
      { chapterId: 'doc_chap_01', chapterTitle: 'Chương 1 — Chiếc tàu đến sớm' },
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' },
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ],
    internalNotes: {
      secrets: ['Chiếc tời mua từ bãi phế liệu giấu dưới bạt xanh đã bị gãy đôi trục khi cứu chiếc tàu đêm qua.'],
      externalWant: 'Sửa xong chiếc tời số bảy của bến cảng và mua lại xưởng cho mẹ Mira.',
      internalNeed: 'Học cách hỏi điều mẹ thực sự muốn và chia sẻ trách nhiệm với đồng đội.',
      flawOrWound: 'Món nợ và tai nạn máy tời cũ khiến gia đình bị treo bảo hộ; luôn mang tâm lý mắc nợ.'
    }
  },
  {
    id: 'char_nari',
    name: 'Nari',
    aliases: ['NV02', 'Tuần bến Arumo'],
    role: 'deuteragonist',
    roleLabel: 'Hộ vệ bến',
    oneLineDesc: 'Hộ vệ tập sự của bến.',
    age: '19 tuổi',
    gender: 'Nữ',
    occupation: 'Hộ vệ tập sự & tuần tra bến Arumo',
    origin: 'Làng bến Arumo',
    residence: 'Nhà trực bến cảng Arumo',
    chibiArt: '/art/characters/02-nari-v03.png',
    avatar: '/art/characters/02-nari-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'main',
    recognitionPoints: [
      'Đồng phục ca đêm màu xanh thẫm buộc gọn gàng, dáng vóc mảnh mai nhưng dẻo dai',
      'Cổ tay đeo vòng kim loại dẫn lực, luôn mang theo cây sào cứu hộ có khoen đồng',
      'Ánh mắt sắc sảo, cảnh giác cao độ và luôn kiểm tra sổ ghi chép hai lần'
    ],
    personalityText: 'Quyết đoán, thẳng thắn và có tinh thần trách nhiệm mãnh liệt. Nari luôn sợ rằng một quyết định chậm hơn một nhịp của mình sẽ khiến người khác mất mạng. Khi làm nhiệm vụ, cô dứt khoát như phát hiệu lệnh; nhưng trước những kẻ lợi dụng quy tắc để đùn đẩy trách nhiệm, cô sẵn sàng chất vấn đến cùng.',
    backgroundText: 'Tập sự trong đội tuần tra bến Arumo dưới sự hướng dẫn của Seika và Oren. Sau một sự cố diễn tập hai năm trước khiến người bạn Seli bị thương, Nari tự thúc ép bản thân không được phép phạm sai lầm. Trong vụ cứu tàu thượng nguồn, cô đã bất chấp nguy hiểm lao vào khoang nước để kéo nạn nhân ra ngoài.',
    quoteSamples: [
      '“Tôi ghi bảy người. Tôi đã phát chăn cho đủ bảy người sống sót.”',
      '“Đừng kết luận thay người chứng kiến khi chưa kiểm tra mặt dưới đáy tàu.”'
    ],
    relationships: [
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Đồng đội ca trực', note: 'Biết Rento hay làm việc quá sức; tin tưởng tay nghề của Rento nhưng lo cậu quá liều.' },
      { targetId: 'char_seika', targetName: 'Seika', relationType: 'Người hướng dẫn', note: 'Kính trọng Seika và học hỏi phương pháp đo đạc khoa học từ cô.' },
      { targetId: 'char_oren', targetName: 'Oren', relationType: 'Cấp trên quản bến', note: 'Bất bình khi Oren yêu cầu sửa báo cáo và giấu các cảnh báo rủi ro.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_01', chapterTitle: 'Chương 1 — Chiếc tàu đến sớm' },
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ],
    internalNotes: {
      secrets: ['Phát hiện mục kiểm tra đường sơ tán trong sổ trực cũ bị gạch ngang và lùi lại một ca.'],
      externalWant: 'Bảo vệ an toàn cho bến Arumo và làm rõ danh tính người thứ bảy trên tàu.',
      internalNeed: 'Học cách giao quyền và không tự ép bản thân gánh vác mọi rủi ro một mình.',
      flawOrWound: 'Cổ tay phải bị sưng đau sau cú đáp cứu hộ nhưng giấu kín, chuyển sang viết bằng tay trái.'
    }
  },
  {
    id: 'char_dagan',
    name: 'Dagan',
    aliases: ['NV03', 'Người khuân hàng thực tế'],
    role: 'supporting',
    roleLabel: 'Người khuân hàng',
    oneLineDesc: 'Người hộ tống hàng ở Arumo.',
    age: '20 tuổi',
    gender: 'Nam',
    occupation: 'Khuân vác bến cảng & chuyển hàng',
    origin: 'Khu xóm thợ bến Arumo',
    residence: 'Phòng trọ gần kho hàng giếng số 3',
    chibiArt: '/art/characters/03-dagan-v03.png',
    avatar: '/art/characters/03-dagan-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Vóc người vạm vỡ, vai bè, bàn tay thô ráp nhiều vết chai do khuân vác nặng',
      'Trang phục vải thô nâu đất, đai lưng quấn chắc chắn để đỡ cột sống',
      'Kín đáo giữ một cuốn tập ghi chép sơ đồ bánh răng cũ nhặt từ bãi phế liệu'
    ],
    personalityText: 'Thực tế, coi trọng tiền công trước mắt vì gánh nặng sinh kế gia đình. Dù vẻ ngoài thô ráp, Dagan lại có niềm say mê kín đáo với máy móc và cơ khí, hay ngượng ngùng khi bị người khác bắt gặp đang học lỏm nghề.',
    backgroundText: 'Từng phải bỏ học vì không đủ tiền nộp phí thi nghề, Dagan đi làm thuê ở bến cảng từ sớm. Cậu là bạn chí cốt của Rento, luôn có mặt phụ giúp Rento đẩy máy kéo nặng và che chắn cho bạn bè khi xảy ra xô xát.',
    quoteSamples: [
      '“Tôi khuân xong ba kiện này là đủ tiền mua thuốc cho em gái rồi.”',
      '“Rento, chiếc máy tời này chân đế sắp bật rồi, không giữ thêm được đâu!”'
    ],
    relationships: [
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Bạn chí cốt', note: 'Giúp Rento kéo máy tời phế liệu; ngưỡng mộ tài năng kỹ thuật của Rento.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_01', chapterTitle: 'Chương 1 — Chiếc tàu đến sớm' },
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ],
    internalNotes: {
      secrets: ['Giữ cuốn tập ghi chép sơ đồ bánh răng cũ nhặt được từ xưởng phế liệu.'],
      externalWant: 'Kiếm đủ tiền công mỗi ngày mang về cho gia đình và có cơ hội học nghề rõ ràng.',
      internalNeed: 'Dám thừa nhận ước mơ của bản thân, thôi tự ti là kẻ chỉ biết bán sức lao động.',
      flawOrWound: 'Mặc cảm vì từng phải bỏ học giữa chừng do cảnh nghèo khó.'
    }
  },
  {
    id: 'char_seika',
    name: 'Seika',
    aliases: ['NV04', 'Nhà đo đạc dòng nước'],
    role: 'supporting',
    roleLabel: 'Chuyên viên dòng chảy',
    oneLineDesc: 'Người hướng dẫn hộ vệ đường sông.',
    age: '35 tuổi',
    gender: 'Nữ',
    occupation: 'Đo đạc dòng chảy sông Asera & giảng dạy nghề',
    origin: 'Vùng đồi thượng lưu',
    residence: 'Trạm quan trắc cửa hút phía đông Arumo',
    chibiArt: '/art/characters/04-seika-v03.png',
    avatar: '/art/characters/04-seika-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Trang phục đo đạc màu nâu sẫm gọn gàng, thắt lưng da mang ống thước ngắm',
      'Mang theo ống nghiệm mẫu nước đục và bản đồ dòng nước sông Asera',
      'Phong thái điềm đạm, nghiêm cẩn của một nhà khoa học thực địa từng trải'
    ],
    personalityText: 'Bình tĩnh, khoa học và coi trọng số liệu kiểm chứng. Seika dạy học trò cách tự quan sát dòng chảy và ra quyết định thay vì học vẹt kinh nghiệm.',
    backgroundText: 'Nhiều năm nghiên cứu biến động bất thường của dòng sông lơ lửng Asera. Cô là người đầu tiên phát hiện mẫu nước ở cửa hút phía đông có sợi xám mỏng đục trùng khớp với chất nhầy sinh vật lạ trên chiếc tàu trôi dạt.',
    quoteSamples: [
      '“Dòng nước đứng không có nghĩa là nó phẳng lặng. Dưới đáy sâu, áp lực đang dồn lại.”',
      '“Muốn cứu người thì mắt phải nhìn số liệu, tay phải giữ chắc mốc đo.”'
    ],
    relationships: [
      { targetId: 'char_nari', targetName: 'Nari', relationType: 'Học trò / Cố vấn', note: 'Khuyên Nari phải biết nghỉ ngơi và giữ khoảng cách an toàn khi trực bến.' },
      { targetId: 'char_oren', targetName: 'Oren', relationType: 'Đồng nghiệp quản lý', note: 'Bất đồng với Oren về việc trì hoãn kiểm tra các cửa hút nước.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' },
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_mira',
    name: 'Mira',
    aliases: ['NV05', 'Mẹ của Rento'],
    role: 'supporting',
    roleLabel: 'Thợ xưởng kỳ cựu',
    oneLineDesc: 'Thợ xưởng kỳ cựu và mẹ của Rento.',
    age: '43 tuổi',
    gender: 'Nữ',
    occupation: 'Thợ sửa máy & gia công linh kiện',
    origin: 'Làng bến Arumo',
    residence: 'Nhà riêng gần ngõ chợ Arumo',
    chibiArt: '/art/characters/05-mira-v03.png',
    avatar: '/art/characters/05-mira-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Tóc buộc vội, dáng người tần tảo nhưng cứng cỏi của người làm xưởng lâu năm',
      'Tay áo thường xắn cao, ngón tay có vết sẹo cũ từ tai nạn máy tời',
      'Tạp dề xưởng màu xám tro luôn có túi đựng chìa khóa vặn ốc'
    ],
    personalityText: 'Thương con sâu sắc nhưng kín đáo, thấu hiểu cái giá đắt của máy móc. Bà có kế hoạch tương lai riêng và không muốn Rento tự hủy hoại bản thân vì món nợ của gia đình.',
    backgroundText: 'Từng là chủ xưởng cơ khí uy tín trước khi xảy ra tai nạn máy tời bốn năm trước. Sau tai nạn, bà chấp nhận làm thuê để trả nợ và che chở cho Rento khôn lớn.',
    quoteSamples: [
      '“Rento, ăn bát cháo nóng đi đã. Máy móc hỏng thì sửa lại được, người kiệt sức thì lấy gì bù?”',
      '“Mẹ không cần con chuộc xưởng bằng cách liều mạng đâu.”'
    ],
    relationships: [
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Mẹ con', note: 'Thương con trai tự gánh vác; nhìn thấy chiếc máy tời gãy nhưng không trách nửa lời.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_omi',
    name: 'Omi',
    aliases: ['NV06', 'Nhân chứng trên tàu'],
    role: 'supporting',
    roleLabel: 'Nhân chứng sống sót',
    oneLineDesc: 'Người mang theo sự thật từ trạm thượng nguồn.',
    age: '62 tuổi',
    gender: 'Nữ',
    occupation: 'Chủ quán cơm trạm dừng (cũ) & nhân chứng',
    origin: 'Trạm điều tiết thượng nguồn sông Asera',
    residence: 'Được sơ tán về nhà trực bến Arumo',
    chibiArt: '/art/characters/06-omi-v03.png',
    avatar: '/art/characters/06-omi-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Người phụ nữ lớn tuổi mặc áo khoác thợ của Rento, tay ôm chặt túi vải trước bụng',
      'Mái tóc hoa râm ướt sũng sau khi thoát chết khỏi khoang tàu',
      'Ánh mắt kiên định dù toàn thân rét run vì ngấm nước lạnh'
    ],
    personalityText: 'Từng trải, can đảm và nhìn thấu sự lúng túng, che đậy của bộ máy quản bến. Bà kiên quyết bảo vệ người thứ bảy trên tàu — một nhân chứng không có giấy tờ bảo hộ.',
    backgroundText: 'Sống sót sau sự cố trôi dạt của chiếc tàu từ thượng nguồn. Khi bước chân lên bến Arumo, câu hỏi đầu tiên của bà đã làm rúng động những người trực ca: “Các cháu chưa nhận được lệnh sơ tán à?”',
    quoteSamples: [
      '“Các cháu chưa nhận được lệnh sơ tán à?”',
      '“Người ta có tên hay không có tên trong sổ thì cũng là người bằng xương bằng thịt!”'
    ],
    relationships: [
      { targetId: 'char_nari', targetName: 'Nari', relationType: 'Người giúp đỡ', note: 'Tin tưởng sự cương trực của Nari khi cô kiên quyết cấp chăn cho người thứ bảy.' },
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Ân nhân cứu mạng', note: 'Cảm ơn Rento đã dùng máy tời giữ tàu khỏi rơi xuống giếng cảng.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_01', chapterTitle: 'Chương 1 — Chiếc tàu đến sớm' },
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_oren',
    name: 'Oren',
    aliases: ['NV07', 'Quản bến Arumo'],
    role: 'supporting',
    roleLabel: 'Quản bến',
    oneLineDesc: 'Người giữ trật tự và quy tắc bến cảng.',
    age: '32 tuổi',
    gender: 'Nam',
    occupation: 'Quản bến trưởng Arumo',
    origin: 'Thị trấn Arumo',
    residence: 'Văn phòng quản bến Arumo',
    chibiArt: '/art/characters/07-oren-v03.png',
    avatar: '/art/characters/07-oren-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Áo khoác quản bến màu chàm phẳng phiu, sổ trực kẹp nách',
      'Phong thái nhà quản lý hành chính mẫn cán, luôn cầm bút ký lệnh',
      'Khóe mắt mệt mỏi đỏ hoe vì áp lực trách nhiệm và thiếu ngủ'
    ],
    personalityText: 'Có tổ chức, nhớ tên từng thợ làm, cố gắng duy trì hoạt động ổn định của bến cảng. Tuy nhiên, anh có xu hướng làm mềm các báo cáo rủi ro để tránh gây hoảng loạn.',
    backgroundText: 'Được thăng chức quản bến nhờ sự tỉ mỉ trong sổ sách. Khi nhận được các tín hiệu cảnh báo bất thường từ cấp trên Varo, Oren lúng túng giữa việc tuân thủ quy trình hành chính và bảo vệ sinh mạng người dân.',
    quoteSamples: [
      '“Ghi đủ việc đã làm, không kết luận thay ai.”',
      '“Một lời báo động sai lúc này sẽ khiến cả trăm gia đình bỏ xưởng chạy loạn.”'
    ],
    relationships: [
      { targetId: 'char_nari', targetName: 'Nari', relationType: 'Cấp trên', note: 'Muốn Nari tiến bộ nhưng khó chịu khi cô chất vấn công khai quy trình sổ sách.' },
      { targetId: 'char_garan', targetName: 'Garan', relationType: 'Cấp dưới gián tiếp', note: 'Chịu áp lực nặng nề từ các chỉ thị kiểm soát thông tin của Garan.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' },
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_garan',
    name: 'Garan',
    aliases: ['NV08', 'Người điều hành vùng Varo'],
    role: 'antagonist',
    roleLabel: 'Người điều hành Varo',
    oneLineDesc: 'Người điều hành mạng lưới thượng nguồn Varo.',
    age: '46 tuổi',
    gender: 'Nam',
    occupation: 'Tổng điều hành trạm Varo & hệ thống dòng nước',
    origin: 'Khu cao Varo',
    residence: 'Trạm điều tiết Varo — Thượng nguồn sông Asera',
    chibiArt: '/art/characters/08-garan-v03.png',
    avatar: '/art/characters/08-garan-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'all',
    recognitionPoints: [
      'Dáng người cao ráo, tóc điểm bạc, trang phục kín đáo thực dụng',
      'Găng tay kỹ thuật có vết mòn do thao tác trạm điều tiết lâu năm',
      'Ánh mắt lạnh lùng, luôn mang theo bảng đo áp suất dòng sông'
    ],
    personalityText: 'Điềm tĩnh, nhìn được bức tranh hệ thống lớn; tin rằng người nắm số liệu có quyền quyết định phần thiệt hại mà cấp dưới phải gánh chịu để bảo vệ mục tiêu tối thượng.',
    backgroundText: 'Người đứng đầu các thử nghiệm điều tiết dòng nước mùa nước đứng tại trạm Varo. Khi thử nghiệm gặp sự cố tạo ra biến dị sinh vật hút nước, Garan tìm cách cô lập thông tin để bảo vệ tuyến cấp nước khu cao.',
    quoteSamples: [
      '“Anh có thể bác phương án của tôi. Vậy đường cấp nước nào sẽ thay nó trước sáng?”',
      '“Hệ thống không thể sụp đổ chỉ vì một nhánh rẽ hạ lưu.”'
    ],
    relationships: [
      { targetId: 'char_oren', targetName: 'Oren', relationType: 'Cấp trên gián tiếp', note: 'Dùng sinh kế của bến Arumo để buộc Oren kiểm soát thông tin không cho rò rỉ.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_tovan',
    name: 'Tovan',
    aliases: ['NPC-01', 'Đại diện nhóm chủ kho'],
    role: 'supporting',
    roleLabel: 'Quản lý kho & Quỹ bảo hộ',
    oneLineDesc: 'Đại diện nhóm chủ hàng và quản lý kho bến.',
    age: '48 tuổi',
    gender: 'Nam',
    occupation: 'Chủ kho hàng & quản lý quỹ bảo hộ bến Arumo',
    origin: 'Nhà buôn lâu đời tại Arumo',
    residence: 'Dãy kho bờ tây bến Arumo',
    chibiArt: '/art/characters/09-tovan-v03.png',
    avatar: '/art/characters/09-tovan-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Người đậm, cổ ngắn, tóc đen rẽ bên đã bạc ở thái dương',
      'Áo dài chàm than phủ áo ngà, chùm chìa khóa đồng ngắn đeo sát hông',
      'Sổ bìa nâu luôn ép dưới nách; khi nghe phản đối thường khép sổ trước rồi mới nhìn'
    ],
    personalityText: 'Thực dụng, nguyên tắc và luôn lấy chứng từ làm lá chắn. Ông tin rằng những hộ đóng góp nhiều cho quỹ bến phải được ưu tiên xét duyệt trước.',
    backgroundText: 'Từng cứu kho hàng qua mùa tàu ngưng chạy bằng cách tính toán chi li. Sau tai nạn xưởng cũ, ông ủng hộ việc treo bảo hộ hộ Mira để giảm chi phí bồi thường.',
    quoteSamples: [
      '“Tôi không bảo không giúp. Tôi hỏi ai chịu trách nhiệm ký?”',
      '“Cậu cứ để phiếu đấy. Tôi đã nói là sẽ xem.”'
    ],
    relationships: [
      { targetId: 'char_eli', targetName: 'Eli', relationType: 'Quản lý kho', note: 'Gây sức ép lên Eli về trách nhiệm sổ sách kho hàng.' },
      { targetId: 'char_oren', targetName: 'Oren', relationType: 'Đồng sự', note: 'Cần Oren ký xác nhận các khoản xuất quỹ dự phòng.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_01', chapterTitle: 'Chương 1 — Chiếc tàu đến sớm' },
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_eli',
    name: 'Eli',
    aliases: ['NPC-02', 'Nhân viên kho bến'],
    role: 'supporting',
    roleLabel: 'Thư ký kho bến',
    oneLineDesc: 'Nhân viên kho và ghi phiếu ca trực dưới Oren.',
    age: '23 tuổi',
    gender: 'Nữ',
    occupation: 'Ghi chép phiếu xuất kho & cấp phát vật tư',
    origin: 'Khu dân cư bến Arumo',
    residence: 'Phòng trọ gần chợ cùng em gái',
    chibiArt: '/art/characters/10-eli-v03.png',
    avatar: '/art/characters/10-eli-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Thấp người, tóc đen tết gọn sau gáy, áo xanh xám tay xắn gọn',
      'Tạp dề nâu nhạt nhiều túi nhỏ, thước gỗ ngắn nhô khỏi túi trước',
      'Ngón tay giữa có vệt mực tím khó rửa từ việc ghi phiếu suốt đêm'
    ],
    personalityText: 'Cẩn thận, nguyên tắc nhưng giàu lòng trắc ẩn. Cô tin vào giấy tờ để bảo vệ mình, nhưng khi đối diện với sinh mệnh, cô dám kiên quyết làm điều đúng đắn.',
    backgroundText: 'Làm việc chăm chỉ để nuôi em gái ăn học. Trong đêm xảy ra tai nạn tàu, Eli đã can đảm ôm chồng chăn ra cấp phát cho cả bảy người sống sót, kể cả người chưa có tên trong danh sách.',
    quoteSamples: [
      '“Em ghi bảy người. Em đã phát chăn cho bảy người.”',
      '“Phần việc em làm, em ký. Phần lệnh, anh ký giúp em.”'
    ],
    relationships: [
      { targetId: 'char_nari', targetName: 'Nari', relationType: 'Bạn đồng nghiệp', note: 'Được Nari bảo vệ khi kiên quyết cấp chăn cho nạn nhân.' },
      { targetId: 'char_tovan', targetName: 'Tovan', relationType: 'Cấp trên kho', note: 'Chịu sự giám sát gắt gao của Tovan về định mức vật tư.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_banu',
    name: 'Banu',
    aliases: ['NPC-03', 'Thợ sửa ghế & kiểm hàng'],
    role: 'supporting',
    roleLabel: 'Cựu thợ xưởng',
    oneLineDesc: 'Người công nhân bị thương trong tai nạn xưởng cũ.',
    age: '41 tuổi',
    gender: 'Nam',
    occupation: 'Kiểm hàng nhẹ & sửa chữa đồ mộc tại nhà',
    origin: 'Xóm thợ cũ Arumo',
    residence: 'Căn nhà nhỏ ven đường bờ đê',
    chibiArt: '/art/characters/11-banu-v03.png',
    avatar: '/art/characters/11-banu-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Vai rộng, thân trên rắn chắc, chân phải bước ngắn hơn chân trái',
      'Tóc cắt sát điểm hoa râm, ria mép gọn, áo nâu đất tay ngắn',
      'Miếng đệm da ở đầu gối trái khi ngồi quỳ sửa đồ mộc'
    ],
    personalityText: 'Thẳng thắn, tự trọng và không muốn người khác thương hại. Ông có thể giận vì tai nạn cũ nhưng luôn làm chứng đúng sự thật, không tư lợi.',
    backgroundText: 'Bốn năm trước bị tai nạn gãy chân trong vụ thử tải máy tời tại xưởng của Mira. Vết thương khiến ông mất sức lao động nặng, chuyển sang sửa chữa nhỏ.',
    quoteSamples: [
      '“Tôi chưa nói là tôi hết giận.”',
      '“Kê sang trái giúp tôi. Ừ, thế thì tôi tự làm được.”'
    ],
    relationships: [
      { targetId: 'char_mira', targetName: 'Mira', relationType: 'Cựu chủ xưởng', note: 'Chờ đợi một lời giải thích chân thành và bồi thường sòng phẳng.' },
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Người quen', note: 'Nhìn thấy Rento nỗ lực nhưng khuyên cậu không nên gánh tội thay mẹ.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_seli',
    name: 'Seli',
    aliases: ['NPC-04', 'Thợ làm dây cứu hộ'],
    role: 'supporting',
    roleLabel: 'Thợ bện dây',
    oneLineDesc: 'Thợ làm dây cứu hộ, bạn cùng khóa cũ của Nari.',
    age: '19 tuổi',
    gender: 'Nam',
    occupation: 'Thợ gia công dây thừng & cáp cứu hộ',
    origin: 'Làng bến Arumo',
    residence: 'Giàn bện dây có mái che ven bến',
    chibiArt: '/art/characters/12-seli-v03.png',
    avatar: '/art/characters/12-seli-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Dáng người mảnh khảnh, tóc nâu buộc thấp bằng sợi dây gai tháo xoắn',
      'Áo cộc tay màu xanh rêu, thắt lưng vải treo con thoi gỗ và dao cắt dây',
      'Đầu ngón tay chai sần, có kỹ năng thắt nút cứu nạn cực kỳ điêu luyện'
    ],
    personalityText: 'Tự lập, tự hào về tay nghề của mình và không thích người khác coi mình là nạn nhân cần phải bù đắp.',
    backgroundText: 'Từng là đồng đội tập sự của Nari. Trong buổi diễn tập hai năm trước, anh bị thương ở chân khi cố gắng cứu đồng đội. Sau khi bình phục, anh chuyển sang nghề bện dây cứu hộ và trở thành người cung cấp dây chất lượng nhất bến.',
    quoteSamples: [
      '“Nút đẹp đấy. Giờ thử xem nó chịu được người không.”',
      '“Hỏi tôi muốn làm gì trước đã, Nari.”'
    ],
    relationships: [
      { targetId: 'char_nari', targetName: 'Nari', relationType: 'Bạn cùng khóa', note: 'Thân với Nari nhưng khó chịu khi cô đối xử với anh như kẻ có lỗi.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_luma',
    name: 'Luma',
    aliases: ['NPC-05', 'Hậu cần trạm trên'],
    role: 'supporting',
    roleLabel: 'Điều phối trạm thượng nguồn',
    oneLineDesc: 'Nhân viên hậu cần trạm trên, con gái bà Omi.',
    age: '34 tuổi',
    gender: 'Nữ',
    occupation: 'Điều phối kho & hậu cần trạm dừng thượng nguồn',
    origin: 'Trạm dừng chân thượng lưu Asera',
    residence: 'Khu công vụ trạm thượng nguồn',
    chibiArt: '/art/characters/13-luma-v03.png',
    avatar: '/art/characters/13-luma-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'all',
    recognitionPoints: [
      'Tóc đen cắt ngang vai vén sau tai bằng kẹp gỗ sẫm',
      'Áo khoác ngắn màu đất nung, túi vải sâu đựng phiếu chuyến',
      'Vòng dây chìa khóa cột chặt trong túi để tránh rơi rớt khi di chuyển'
    ],
    personalityText: 'Nhanh nhẹn, có tổ chức, luôn đòi hỏi mốc thời gian biểu cụ thể thay vì những lời hứa hẹn chung chung.',
    backgroundText: 'Con gái của bà Omi. Khi lệnh sơ tán ban hành tại trạm trên, cô đã gửi mẹ đi trước trên chiếc thuyền đầu tiên và ở lại lo thủ tục di dời cho các chuyến sau.',
    quoteSamples: [
      '“Mẹ xuống trước là việc mình đã bàn. Con ở lại không có nghĩa là con ở mãi.”',
      '“Cho tôi giờ chốt. ‘Cố thêm chút’ không phải một cái giờ.”'
    ],
    relationships: [
      { targetId: 'char_omi', targetName: 'Omi', relationType: 'Mẹ con', note: 'Thương mẹ nhưng hay lo lắng vì tính quyết đoán, hay cứu người của mẹ.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_fara',
    name: 'Fara',
    aliases: ['NPC-06', 'Bà bán cháo bến'],
    role: 'supporting',
    roleLabel: 'Chủ quán ăn bến',
    oneLineDesc: 'Người bán cháo ở lối từ bến về chợ.',
    age: '54 tuổi',
    gender: 'Nữ',
    occupation: 'Chủ gánh cháo sớm ven lối chợ',
    origin: 'Làng bến Arumo',
    residence: 'Quầy ăn sáng đầu ngõ chợ Arumo',
    chibiArt: '/art/characters/14-fara-v03.png',
    avatar: '/art/characters/14-fara-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Người thấp, vai tròn, da rám nắng, tóc muối tiêu búi sau gáy',
      'Áo nâu đất, tạp dề vàng nghệ bạc màu, khăn xanh rêu vắt vai',
      'Tay luôn cầm chiếc vá gỗ cán ngắn thoăn thoắt múc cháo bốc khói'
    ],
    personalityText: 'Khẩu xà tâm phật, miệng la rầy nhưng tay vẫn múc đầy bát cháo nóng cho những người thợ làm ca đêm mệt mỏi.',
    backgroundText: 'Bán cháo sớm ở bến nhiều chục năm, chứng kiến bao thế hệ thợ trẻ lớn lên. Sáng sớm hôm xảy ra tai nạn tàu, bà đã dúi gói cơm nóng vào tay Rento khi thấy cậu kiệt sức.',
    quoteSamples: [
      '“Ăn đi! Để nguội rồi lại chê cháo của tôi không ngon.”',
      '“Cho nợ được. Nhưng bảo tôi không cần tiền mua gạo là không được đâu đấy.”'
    ],
    relationships: [
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Khách quen', note: 'Quý Rento vì cậu luôn sửa nồi, vá quầy giúp bà đúng hẹn.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_kiro',
    name: 'Kiro',
    aliases: ['NPC-07', 'Người sơ cứu theo ca'],
    role: 'supporting',
    roleLabel: 'Nhân viên y tế bến',
    oneLineDesc: 'Người phụ trách sơ cứu theo ca tại bến Arumo.',
    age: '28 tuổi',
    gender: 'Nam',
    occupation: 'Nhân viên y tế sơ cứu bến cảng',
    origin: 'Trạm y tế khu bến',
    residence: 'Phòng thuê sau chợ bến Arumo',
    chibiArt: '/art/characters/15-kiro-v03.png',
    avatar: '/art/characters/15-kiro-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Cao vừa, vai hẹp, mắt hơi thâm vì thức đêm trực ca cứu nạn',
      'Áo xanh xám xắn tay, khăn trắng ngà buộc eo, túi bông băng bên hông',
      'Luôn rửa sạch tay cẩn thận trước khi băng bó cho người bệnh'
    ],
    personalityText: 'Cẩn trọng, kiên nhẫn và biết lắng nghe. Càng trong tình huống nguy cấp, anh càng bình tĩnh và nói chuyện chậm rãi để trấn an nạn nhân.',
    backgroundText: 'Từng có bài học đắt giá khi tin lời thợ giấu đau để đi làm tiếp. Giờ đây anh luôn kiểm tra kỹ lưỡng từng vết cắt, vết dập cơ của thợ bến.',
    quoteSamples: [
      '“Ngồi xuống đã. Cậu cứ nói chuyện tiếp, tôi vẫn đang nghe.”',
      '“Tôi nghe cậu nói là ổn rồi. Giờ để tôi kiểm tra lại khớp tay.”'
    ],
    relationships: [
      { targetId: 'char_nari', targetName: 'Nari', relationType: 'Đồng nghiệp trực', note: 'Băng bó cổ tay sưng của Nari và nghiêm khắc yêu cầu cô nghỉ ngơi.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_bero',
    name: 'Bero',
    aliases: ['NPC-08', 'Thợ bảo trì già'],
    role: 'supporting',
    roleLabel: 'Thợ bảo trì kỳ cựu',
    oneLineDesc: 'Thợ bảo trì lâu năm, hiện nhận việc nhẹ ở bến.',
    age: '57 tuổi',
    gender: 'Nam',
    occupation: 'Thợ bảo trì máy móc bến cảng',
    origin: 'Làng bến Arumo',
    residence: 'Khu xóm thợ bờ nam',
    chibiArt: '/art/characters/16-bero-v03.png',
    avatar: '/art/characters/16-bero-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Lưng hơi còng, cằm rộng, tóc thưa chải sang một bên',
      'Áo chàm vá miếng vải khác màu ngay khuỷu tay, dây da treo thước gấp',
      'Ngón trỏ có vết chai dày của người vặn ốc vít suốt bốn mươi năm'
    ],
    personalityText: 'Trầm lặng, hiểu biết về máy móc nhưng mang gánh nặng tội lỗi vì từng im lặng trong cuộc xét xử tai nạn cũ để giữ chén cơm nuôi con.',
    backgroundText: 'Từng làm việc cùng Mira từ thời trẻ. Khi vụ tai nạn máy tời xảy ra, sự im lặng của ông đã khiến Mira bị tước quyền bảo hộ. Nay ông tìm cách chỉ dẫn Rento những kinh nghiệm sửa máy như một cách chuộc lỗi thầm lặng.',
    quoteSamples: [
      '“Giữ cả bản ghi ca. Phiếu này chưa kể hết được đâu.”',
      '“Tôi có nghe thấy tiếng báo động hôm ấy... Tôi đã không nói.”'
    ],
    relationships: [
      { targetId: 'char_mira', targetName: 'Mira', relationType: 'Bạn đồng nghiệp cũ', note: 'Mang mặc cảm nợ tinh thần vì đã im lặng trong vụ tai nạn bốn năm trước.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_veni',
    name: 'Veni',
    aliases: ['NPC-09', 'Người đưa thư liên trạm'],
    role: 'supporting',
    roleLabel: 'Giao liên đường sông',
    oneLineDesc: 'Người chuyển thư và thông báo giữa các trạm gần Arumo.',
    age: '24 tuổi',
    gender: 'Nữ',
    occupation: 'Giao liên & chuyển phát công văn đường sông',
    origin: 'Trạm bến hạ lưu',
    residence: 'Di chuyển liên tục trên các chuyến đò thư',
    chibiArt: '/art/characters/17-veni-v03.png',
    avatar: '/art/characters/17-veni-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'all',
    recognitionPoints: [
      'Người cao mảnh, chân dài nhanh nhẹn, một bên lông mày mọc hơi lệch',
      'Áo khoác vàng đất tới hông, quần xanh sẫm, túi thư vuông đeo chéo',
      'Tấm bạt che mưa cuộn chặt sau lưng, luôn đòi hỏi ký nhận mốc giờ chuẩn'
    ],
    personalityText: 'Nhanh nhẹn, thẳng thắn và nguyên tắc cao về mốc giờ giao nhận văn bản. Cô không bao giờ để ai đổi giờ ghi trên biên nhận thư.',
    backgroundText: 'Từng bị đổ lỗi khi một thông báo miệng bị sai lệch thời gian. Từ đó, Veni chỉ tin vào biên lai có chữ ký và con dấu xác thực mốc thời gian.',
    quoteSamples: [
      '“Tôi nhớ giờ nhận. Chuyện xảy ra trước giờ ấy thì anh phải hỏi người gửi.”',
      '“Đọc thư của người ta không giúp chân cô chạy nhanh hơn đâu.”'
    ],
    relationships: [
      { targetId: 'char_luma', targetName: 'Luma', relationType: 'Đối tác trạm', note: 'Thường xuyên giao nhận công văn và hàng mẫu với Luma.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_doro',
    name: 'Doro',
    aliases: ['NPC-10', 'Chủ thầu xe kéo'],
    role: 'supporting',
    roleLabel: 'Chủ thầu vận tải',
    oneLineDesc: 'Chủ hai xe hàng, nhận thầu những chuyến ngắn trong làng.',
    age: '38 tuổi',
    gender: 'Nam',
    occupation: 'Chủ xe kéo & vận chuyển hàng nội địa Arumo',
    origin: 'Chợ đầu mối Arumo',
    residence: 'Bãi đỗ xe kéo gần bờ sông',
    chibiArt: '/art/characters/18-doro-v03.png',
    avatar: '/art/characters/18-doro-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Thân người chắc nịch, tóc cắt bằng, râu cằm tỉa sát',
      'Áo đỏ gạch cộc tay, đai nâu giữ túi tiền và thỏi phấn đánh dấu kiện hàng',
      'Thường gõ đồng tiền xu lên móng tay khi tính toán giá cước'
    ],
    personalityText: 'Thực dụng, tính toán từng đồng cước phí vận chuyển nhưng không làm ăn gian lận hay trái luật hợp đồng.',
    backgroundText: 'Từng là phu kéo xe thuê trước khi dành dụm mua được hai cỗ xe kéo riêng. Ông thuê Dagan khuân hàng theo chuyến và nhờ Rento sửa bánh xe.',
    quoteSamples: [
      '“Tôi trả đủ chuyến. Chuyện chờ ở cổng bến ai trả cho tôi?”',
      '“Được, ghi tiền chờ riêng. Nhưng giờ bắt đầu bốc hàng phải rõ.”'
    ],
    relationships: [
      { targetId: 'char_dagan', targetName: 'Dagan', relationType: 'Chủ thuê việc', note: 'Thường thuê Dagan bốc xếp các chuyến hàng nặng.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_02', chapterTitle: 'Chương 2 — Tên nào nằm trong sổ' }
    ]
  },
  {
    id: 'char_paku',
    name: 'Paku',
    aliases: ['NPC-11', 'Học việc bãi phế liệu'],
    role: 'supporting',
    roleLabel: 'Học việc phân loại',
    oneLineDesc: 'Người học việc phân loại đồ cũ tại sân tái dụng ở chợ.',
    age: '16 tuổi',
    gender: 'Nam',
    occupation: 'Học việc phân loại linh kiện cơ khí cũ',
    origin: 'Xóm chợ Arumo',
    residence: 'Sân phế liệu tái dụng Arumo',
    chibiArt: '/art/characters/19-paku-v03.png',
    avatar: '/art/characters/19-paku-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Nhỏ con, tóc xoăn dựng ở gáy, răng cửa hơi khấp khểnh đáng yêu',
      'Áo xanh lam rộng thùng thình, khăn cam giữ tóc trên trán',
      'Mang khay gỗ chia ô đựng ốc vít và chiếc kính lúp nhỏ bên túi'
    ],
    personalityText: 'Hào hứng, tò mò về thế giới máy móc, hay hỏi han Rento và các thợ lớn tuổi về công dụng của từng linh kiện kim loại.',
    backgroundText: 'Học việc tại sân phế liệu của chợ Arumo. Cậu chính là người giúp Rento tìm ra những bánh răng thay thế vừa vặn cho các máy tời cũ.',
    quoteSamples: [
      '“Cái này em biết! Khoan, để em soi kỹ mặt dưới đã xem có nứt ngầm không.”',
      '“Bán được thì thích thật, nhưng nhỡ người ta đem lắp vào máy tời rồi gãy thì sao?”'
    ],
    relationships: [
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Đàn anh chỉ dẫn', note: 'Ngưỡng mộ tài năng của Rento và luôn để dành linh kiện tốt cho cậu.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_yori',
    name: 'Yori',
    aliases: ['NPC-12', 'Người kiểm tuyến bờ đông'],
    role: 'supporting',
    roleLabel: 'Quan trắc đê điều',
    oneLineDesc: 'Người đo mực nước và kiểm tuyến đi bộ dọc bờ đông Arumo.',
    age: '29 tuổi',
    gender: 'Nữ',
    occupation: 'Quan trắc viên mực nước đê kè bờ đông',
    origin: 'Bờ đông làng Arumo',
    residence: 'Chòi canh đê phía đông bến',
    chibiArt: '/art/characters/20-yori-v03.png',
    avatar: '/art/characters/20-yori-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'arumo',
    recognitionPoints: [
      'Cao vừa, chân bước vững chãi, mặt có vài đốm tàn nhang duyên dáng',
      'Áo xanh rêu ngắn, ủng nâu lấm bùn sông, đeo cọc sơn trắng đỏ và thước xếp',
      'Cuốn sổ tay bọc vải dầu chống nước luôn cầm chặt trên tay'
    ],
    personalityText: 'Cẩn trọng, kiên quyết và không bao giờ đoán mò số liệu khi chưa đo đạc tận mắt.',
    backgroundText: 'Chuyên trách kiểm tra độ sạt lở và mực nước dâng dọc bờ đông sông Asera. Khi phát hiện mực nước tụt bất thường trước mùa nước đứng, cô đã kịp thời cắm cọc cảnh báo nguy hiểm.',
    quoteSamples: [
      '“Tôi đo tới khúc đá trắng. Qua đó, tôi chưa dám dẫn đoàn đi tiếp.”',
      '“Mực nước thấp hơn không có nghĩa là lòng đường đất phía dưới chịu được thêm người.”'
    ],
    relationships: [
      { targetId: 'char_seika', targetName: 'Seika', relationType: 'Đồng sự khoa học', note: 'Phối hợp báo cáo số liệu thủy văn định kỳ cho Seika.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_03', chapterTitle: 'Chương 3 — Món nợ và vết nứt' }
    ]
  },
  {
    id: 'char_tavi',
    name: 'Tavi',
    aliases: ['NV21', 'Ký ức thời gian cũ'],
    role: 'supporting',
    roleLabel: 'Hồi ức Arumo',
    oneLineDesc: 'Nhân vật trong hồi ức và dòng thời gian cũ của làng.',
    age: '16 tuổi (Mốc tạo hình quá khứ)',
    gender: 'Nam',
    occupation: 'Người ghi chép sự kiện bến xưa',
    origin: 'Arumo thời kỳ trước biến cố nước đứng',
    residence: 'Lưu trữ trong hồi ức và hồ sơ bến cũ',
    chibiArt: '/art/characters/21-tavi-v03.png',
    avatar: '/art/characters/21-tavi-v03.png',
    isPublic: true,
    assetReady: true,
    profileReady: true,
    publicReady: true,
    groupTag: 'all',
    recognitionPoints: [
      'Trang phục kiểu cũ màu lam nhạt với dải thắt lưng dệt thủ công truyền thống',
      'Gương mặt thanh tú, ánh mắt mơ màng hướng về dòng sông trên mây',
      'Mang theo hộp gỗ đựng những phiến đá ghi khắc ký tự cổ xưa'
    ],
    personalityText: 'Trầm lặng, nhạy cảm với những biến đổi huyền bí của sông trời Asera và các truyền thuyết về Long Ấn.',
    backgroundText: 'Nhân vật thuộc dòng thời gian quá khứ của Arumo, người từng ghi lại những quan sát đầu tiên khi dòng sông bắt đầu lơ lửng trên tầng mây trước khi mùa nước đứng định hình.',
    quoteSamples: [
      '“Có những dòng chảy không xuôi về biển, mà chảy ngược vào bầu trời.”'
    ],
    relationships: [
      { targetId: 'char_rento', targetName: 'Rento', relationType: 'Duyên kỳ ngộ', note: 'Những ghi chép cũ của Tavi để lại manh mối quan trọng cho Rento sau này.' }
    ],
    appearedChapters: [
      { chapterId: 'doc_chap_prologue', chapterTitle: 'Mở đầu: Ranh giới của sự bình thường' }
    ]
  }
];

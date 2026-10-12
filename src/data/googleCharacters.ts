import { Character } from '../types';

/**
 * 8 Hồ Sơ Nhân Vật Chuẩn trích xuất trực tiếp từ Mục 03 -> 10 của Tài Liệu Google Docs:
 * https://docs.google.com/document/d/1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y/edit
 */
export const googleCharacters: Character[] = [
  {
    id: 'char_rento',
    name: 'Rento',
    aliases: ['NV01', 'Thợ máy trẻ bến Arumo', 'Người luôn muốn tự sửa mọi thứ'],
    role: 'protagonist',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '18 tuổi',
      appearance: 'Dáng người thợ máy trẻ nhanh nhẹn, ngón tay thường dính dầu máy, áo thợ sờn vai, thường mang túi dụng cụ sửa tời bên hông.',
      personality: 'Luôn muốn tự sửa mọi thứ, sợ mẹ phải làm việc nặng, sợ người khác nhìn mình như kẻ bất tài. Nhận trách nhiệm nhanh nhưng hay tự gánh một mình.',
      voiceCadence: 'Nói năng nhanh và rành rọt khi bàn về bánh răng/tời máy; ngập ngừng, trầm xuống khi nhắc đến tiền công và món nợ gia đình.',
      externalWant: 'Sửa xong chiếc tời số bảy của bến cảng và mua lại xưởng cho mẹ Mira để mẹ không phải làm thuê cực nhọc.',
      internalNeed: 'Học cách hỏi điều mẹ thực sự muốn và chia sẻ trách nhiệm với đồng đội thay vì tự mình hứng chịu mọi rủi ro.',
      flawOrWound: 'Món nợ và tai nạn máy tời cũ 4 năm trước khiến gia đình bị treo bảo hộ quỹ bến; luôn mang tâm lý mắc nợ.',
      secrets: ['Chiếc tời mua từ bãi phế liệu giấu dưới bạt xanh đã bị gãy đôi trục khi cứu chiếc tàu trôi dạt đêm qua.']
    },
    relationships: [
      {
        targetCharacterId: 'char_mira',
        targetName: 'Mira',
        relationType: 'Mẹ con',
        note: 'Muốn kiếm tiền chuộc xưởng cho mẹ; sợ mẹ lo lắng nên giấu chuyện tời gãy.'
      },
      {
        targetCharacterId: 'char_nari',
        targetName: 'Nari',
        relationType: 'Bạn đồng hành ca đêm',
        note: 'Cùng trực ca đêm tại bến Arumo; phối hợp ăn ý khi cứu tàu nhưng giấu Nari việc tời sắp bật chân đế.'
      },
      {
        targetCharacterId: 'char_dagan',
        targetName: 'Dagan',
        relationType: 'Bạn thân',
        note: 'Thương Dagan phải khuân vác cực nhọc; hứa sẽ dạy nghề máy móc cho Dagan khi có xưởng riêng.'
      }
    ],
    dynamicState: {
      currentLocation: 'Bến Arumo — Xưởng tời & Khu sửa máy ven sông Asera',
      healthStatus: 'Lòng bàn tay băng bó do kim loại cắt, vai ê ẩm do va chạm cần phanh',
      itemsCarried: ['Tuốc nơ vít cán nứt', 'Phiếu công bị từ chối ký', 'Kẹp ống nước'],
      emotionalState: 'Lo lắng về chiếc tời gãy và câu hỏi về lệnh sơ tán của bà Omi'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_01',
        chapterTitle: 'Chương 1 — Chiếc tàu đến sớm',
        timestamp: 'Đêm muộn hồi chuông cuối',
        knownSecrets: [
          'Chiếc tàu trôi dạt từ thượng nguồn bị bóp lõm ván',
          'Sinh vật có bàn tay trong suốt hút nước',
          'Câu hỏi của bà Omi: "Các cháu chưa nhận được lệnh sơ tán à?"'
        ],
        forbiddenSecrets: [
          'Bản cảnh báo sơ tán sơ bộ bị Oren gạch bỏ',
          'Thử nghiệm điều tiết dòng nước của Garan ở thượng nguồn Varo'
        ]
      }
    ]
  },
  {
    id: 'char_nari',
    name: 'Nari',
    aliases: ['NV02', 'Tuần bến Arumo', 'Người sợ quyết định chậm hơn một nhịp'],
    role: 'deuteragonist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '19 tuổi',
      appearance: 'Dáng vóc mảnh mai nhưng dẻo dai, mặc đồng phục ca đêm, cổ tay đeo vòng kim loại dẫn lực, luôn mang theo cây sào cứu hộ.',
      personality: 'Quyết đoán, cảnh giác cao độ, luôn sợ một quyết định chậm hơn một nhịp sẽ khiến người khác mất mạng. Cứng cỏi, dám chất vấn cấp trên.',
      voiceCadence: 'Dứt khoát, câu từ rõ ràng như hiệu lệnh ca trực; giọng trầm và nghiêm lại khi phát hiện dấu hiệu sai lệch.',
      externalWant: 'Bảo vệ an toàn cho bến Arumo và làm rõ danh tính 7 người sống sót trên chiếc tàu đến sớm.',
      internalNeed: 'Học cách giao quyền, cho phép đồng đội nói điều mình không muốn nghe và không tự ép bản thân gánh vác tất cả.',
      flawOrWound: 'Cổ tay phải bị sưng đau sau cú đáp cứu hộ nhưng giấu kín, chuyển sang cầm bút bằng tay trái.',
      secrets: ['Phát hiện mục "Kiểm tra đường sơ tán" trong sổ trực hôm trước bị gạch ngang và lùi lại một ca.']
    },
    relationships: [
      {
        targetCharacterId: 'char_rento',
        targetName: 'Rento',
        relationType: 'Đồng đội ca trực',
        note: 'Biết Rento hay làm quá sức; tin tưởng tay nghề của Rento nhưng lo cậu quá liều lĩnh.'
      },
      {
        targetCharacterId: 'char_oren',
        targetName: 'Oren',
        relationType: 'Cấp trên quản bến',
        note: 'Tôn trọng Oren nhưng bất bình khi Oren yêu cầu sửa báo cáo và giấu các cảnh báo rủi ro.'
      },
      {
        targetCharacterId: 'char_omi',
        targetName: 'Omi',
        relationType: 'Nhân chứng cần bảo vệ',
        note: 'Bảo vệ bà Omi và người thứ bảy chưa có giấy tờ trước sự hạch sách của Tovan.'
      }
    ],
    dynamicState: {
      currentLocation: 'Nhà trực bến cảng Arumo',
      healthStatus: 'Cổ tay phải sưng to được giấu trong tay áo, viết chật vật bằng tay trái',
      itemsCarried: ['Cây sào kim loại có vòng dẫn lực', 'Còi đồng ca đêm', 'Tờ danh sách người sống sót'],
      emotionalState: 'Căng thẳng trước câu hỏi về lệnh sơ tán và thái độ đáng ngờ của ban quản bến'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_02',
        chapterTitle: 'Chương 2 — Tên nào nằm trong sổ',
        timestamp: 'Rạng sáng sau sự cố tàu',
        knownSecrets: [
          '7 người trên tàu có 1 người chưa xác định giấy tờ',
          'Tovan giữ chăn của người thứ bảy',
          'Mục kiểm tra đường sơ tán bị gạch ngang trong sổ trực cũ'
        ],
        forbiddenSecrets: [
          'Mối liên hệ giữa dòng nước trên cao với thử nghiệm tại trạm Varo',
          'Kế hoạch dời xưởng bí mật của Mira'
        ]
      }
    ]
  },
  {
    id: 'char_dagan',
    name: 'Dagan',
    aliases: ['NV03', 'Người khuân hàng thực tế'],
    role: 'supporting',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '20 tuổi',
      appearance: 'Vóc người vạm vỡ, vai bè, bàn tay thô ráp nhiều vết chai do khuân hàng nặng tại bến cảng.',
      personality: 'Thực tế, coi trọng tiền công trước mắt vì áp lực gia đình nhưng kín đáo giữ tập vở cũ vì khao khát học nghề cơ khí.',
      voiceCadence: 'Chân chất, bộc trực, không vòng vo; ngượng ngùng khi bị phát hiện đang đọc sách kỹ thuật.',
      externalWant: 'Kiếm đủ tiền công mỗi ngày mang về cho gia đình và có một cơ hội học nghề rõ ràng.',
      internalNeed: 'Dám thừa nhận ước mơ của bản thân, thôi tự hạ thấp mình là một kẻ chỉ biết bán sức lao động.',
      flawOrWound: 'Từng phải bỏ học vì không đủ tiền nộp phí thi nghề; mặc cảm trước những người có học vị.',
      secrets: ['Giữ một cuốn tập ghi chép sơ đồ bánh răng cũ nhặt được từ xưởng phế liệu.']
    },
    relationships: [
      {
        targetCharacterId: 'char_rento',
        targetName: 'Rento',
        relationType: 'Bạn chí cốt',
        note: 'Giúp Rento đẩy máy tời phế liệu; ngưỡng mộ tài sửa máy của Rento.'
      }
    ],
    dynamicState: {
      currentLocation: 'Bến cảng Arumo — Kho hàng giếng số 3',
      healthStatus: 'Khỏe mạnh, mỏi cơ lưng do khuân hàng đêm',
      itemsCarried: ['Đòn khiêng gỗ', 'Cặp lồng cơm', 'Tập vở ghi chép cũ'],
      emotionalState: 'Mừng vì cứu được người nhưng lo lắng tiền công hôm nay bị chậm'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_01',
        chapterTitle: 'Chương 1',
        timestamp: 'Đêm muộn',
        knownSecrets: ['Chiếc tời phụ của Rento cứu được người trên tàu'],
        forbiddenSecrets: ['Hồ sơ nợ của Mira', 'Lệnh sơ tán bị giấu']
      }
    ]
  },
  {
    id: 'char_seika',
    name: 'Seika',
    aliases: ['NV04', 'Người dạy học trò tự quyết', 'Nhà đo đạc dòng nước'],
    role: 'supporting',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '35 tuổi',
      appearance: 'Trang phục đo đạc màu nâu sẫm gọn gàng, thắt lưng da mang ống thước ngắm, ánh mắt sắc sảo từng trải.',
      personality: 'Bình tĩnh, khoa học, dạy học trò cách tự quan sát và quyết định thay vì áp đặt kinh nghiệm cá nhân.',
      voiceCadence: 'Điềm đạm, chậm rãi, nhấn mạnh vào các bằng chứng vật lý và dữ liệu dòng chảy.',
      externalWant: 'Xác định các điểm bất thường của dòng sông Asera và cảnh báo nguy cơ dòng nước đứng.',
      internalNeed: 'Đối diện với giới hạn của bản thân: không phải người giỏi giang nào cũng cứu được tất cả mọi người.',
      flawOrWound: 'Vết thương cũ ở vai nhắc nhở về một lần cứu hộ thất bại trong quá khứ do chậm quyết định.',
      secrets: ['Phát hiện mẫu nước ở cửa hút phía đông có sợi xám mỏng đục giống chất nhầy sinh vật lạ.']
    },
    relationships: [
      {
        targetCharacterId: 'char_nari',
        targetName: 'Nari',
        relationType: 'Học trò / Cố vấn',
        note: 'Khuyên Nari phải biết nghỉ ngơi và giữ khoảng cách an toàn khi trực bến.'
      },
      {
        targetCharacterId: 'char_oren',
        targetName: 'Oren',
        relationType: 'Đồng nghiệp quản lý',
        note: 'Bất đồng với Oren về việc trì hoãn kiểm tra các cửa hút nước.'
      }
    ],
    dynamicState: {
      currentLocation: 'Sân lớp nghề & Cửa hút nước phía đông Arumo',
      healthStatus: 'Ổn định, vai hơi cứng khi thời tiết ẩm lạnh',
      itemsCarried: ['Bản đồ dòng nước sông Asera', 'Ống nghiệm mẫu nước đục', 'Thước ngắm cơ khí'],
      emotionalState: 'Lo ngại sâu sắc về sự biến đổi áp lực nước thượng nguồn'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_03',
        chapterTitle: 'Chương 3',
        timestamp: 'Buổi sáng',
        knownSecrets: ['Mẫu nước ở giỏ lọc có sợi xám trùng khớp với chất nhầy trên tàu'],
        forbiddenSecrets: ['Toàn cảnh các thử nghiệm xả tràn của Garan tại trạm Varo']
      }
    ]
  },
  {
    id: 'char_mira',
    name: 'Mira',
    aliases: ['NV05', 'Mẹ của Rento', 'Thợ xưởng kỳ cựu'],
    role: 'supporting',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '43 tuổi',
      appearance: 'Tóc buộc vội, dáng người tần tảo nhưng cứng cỏi của người làm xưởng lâu năm, tay áo thường xắn cao.',
      personality: 'Thương con sâu sắc nhưng kín đáo, thấu hiểu cái giá của máy móc; có kế hoạch sống riêng và không muốn Rento tự hủy hoại vì mình.',
      voiceCadence: 'Ấm áp, ngắn gọn, hay đùa nhẹ để xua tan bầu không khí căng thẳng trong nhà.',
      externalWant: 'Bảo vệ Rento và hoàn tất công việc xưởng mà không để con trai gặp nguy hiểm.',
      internalNeed: 'Nói thật với Rento về kế hoạch tương lai và mong con sống cho ước mơ của chính nó.',
      flawOrWound: 'Vết thương từ tai nạn máy tời cũ khiến bà thấu hiểu sự tàn nhẫn của các tổ chức quỹ bến.',
      secrets: ['Đang cân nhắc chuyển hướng công việc sang khu vực khác an toàn hơn thay vì bám trụ xưởng cũ.']
    },
    relationships: [
      {
        targetCharacterId: 'char_rento',
        targetName: 'Rento',
        relationType: 'Mẹ con',
        note: 'Thương con trai tự gánh vác; nhìn thấy chiếc máy tời gãy nhưng không trách nửa lời.'
      }
    ],
    dynamicState: {
      currentLocation: 'Nhà riêng gần ngõ chợ Arumo',
      healthStatus: 'Khớp tay hơi mỏi, sẹo cũ thỉnh thoảng đau nhức khi nước Asera đổi màu',
      itemsCarried: ['Tạp dề xưởng', 'Bát cháo nóng cho Rento', 'Chìa khóa xưởng làm thuê'],
      emotionalState: 'Nhẹ nhõm vì con còn nguyên vẹn nhưng suy nghĩ về tương lai'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_03',
        chapterTitle: 'Chương 3',
        timestamp: 'Buổi sáng',
        knownSecrets: ['Chiếc tời nhỏ của Rento đã gãy trục'],
        forbiddenSecrets: ['Lệnh sơ tán thật của bến cảng']
      }
    ]
  },
  {
    id: 'char_omi',
    name: 'Omi',
    aliases: ['NV06', 'Người mang theo điều đã chứng kiến', 'Nhân chứng trên tàu'],
    role: 'supporting',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '62 tuổi',
      appearance: 'Người phụ nữ lớn tuổi mặc áo khoác của Rento, tay ôm chặt túi vải trước bụng, ánh mắt kiên định dù vừa thoát chết.',
      personality: 'Từng trải, nhìn thấu sự lúng túng của bộ máy thị trấn; kiên quyết bảo vệ những người ngoài danh sách bảo hộ.',
      voiceCadence: 'Run rẩy do ngâm nước lạnh nhưng lời nói đanh thép, chất chứa sự thật không thể chối cãi.',
      externalWant: 'Truyền đạt cảnh báo về thảm họa từ trạm thượng nguồn và bảo vệ người thứ bảy trên tàu.',
      internalNeed: 'Xác lập sự thật về dòng thời gian chuyến tàu để cứu giúp những người ở các bến hạ lưu.',
      flawOrWound: 'Nỗi đau chứng kiến những người bị bỏ lại phía trên khi trạm thượng nguồn gặp sự cố.',
      secrets: ['Trong túi vải có chìa khóa trạm và bản sao lệnh điều tiết thượng nguồn ghi nhận danh sách lệch.']
    },
    relationships: [
      {
        targetCharacterId: 'char_nari',
        targetName: 'Nari',
        relationType: 'Người giúp đỡ',
        note: 'Tin tưởng sự cương trực của Nari khi cô kiên quyết cấp chăn cho người thứ bảy.'
      },
      {
        targetCharacterId: 'char_rento',
        targetName: 'Rento',
        relationType: 'Ân nhân cứu mạng',
        note: 'Cảm ơn Rento đã dùng máy tời giữ tàu khỏi rơi xuống đáy giếng cảng.'
      }
    ],
    dynamicState: {
      currentLocation: 'Nhà trực bến cảng Arumo — Ghế sưởi bên lò than',
      healthStatus: 'Rét run do ngấm nước lạnh, chân tay yếu ớt',
      itemsCarried: ['Túi vải buộc chặt trước bụng', 'Áo khoác thợ của Rento', 'Chìa khóa trạm trên'],
      emotionalState: 'Hoang mang nhưng kiên quyết đòi gặp người có thẩm quyền cao nhất'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_01',
        chapterTitle: 'Chương 1 & 2',
        timestamp: 'Đêm và rạng sáng',
        knownSecrets: [
          'Trạm trên đã phát lệnh sơ tán khẩn cấp từ nhiều ngày trước',
          'Người thứ bảy trên tàu là nhân chứng của một vụ rò rỉ dòng chảy'
        ],
        forbiddenSecrets: ['Toàn bộ thỏa thuận ngầm giữa hội đồng Arumo và tập đoàn Varo']
      }
    ]
  },
  {
    id: 'char_oren',
    name: 'Oren',
    aliases: ['NV07', 'Quản bến Arumo', 'Người giữ bến và giữ cả uy tín'],
    role: 'supporting',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '32 tuổi',
      appearance: 'Vẻ ngoài lịch sự, áo khoác quản bến phẳng phiu, sổ trực kẹp nách, phong thái nhà quản lý mẫn cán.',
      personality: 'Có tổ chức, nhớ tên người làm, bảo vệ uy tín bến cảng. Mặt hạn chế là khó nhận mình đổi ý và có xu hướng làm mềm các báo cáo rủi ro.',
      voiceCadence: 'Hành chính, thận trọng: "Ghi đủ việc đã làm, không kết luận thay ai."',
      externalWant: 'Duy trì hoạt động ổn định của bến Arumo, tránh hoảng loạn gây thiệt hại kinh tế cho hàng trăm hộ dân.',
      internalNeed: 'Dũng cảm thừa nhận thông tin chưa đầy đủ không miễn trách nhiệm chuẩn bị cho thảm họa lớn.',
      flawOrWound: 'Nỗi sợ bị người quen nhìn nhận như một kẻ thăng chức nhờ ghi sổ nhưng bất tài khi lâm nguy.',
      secrets: ['Đã nhận cảnh báo sơ bộ nhưng hạ mức thành ghi chú bảo trì và không báo hết cho tổ trực đêm.']
    },
    relationships: [
      {
        targetCharacterId: 'char_nari',
        targetName: 'Nari',
        relationType: 'Cấp trên / Người hướng dẫn',
        note: 'Muốn Nari tiến bộ nhưng khó chịu khi cô chất vấn công khai quy trình sổ sách.'
      },
      {
        targetCharacterId: 'char_seika',
        targetName: 'Seika',
        relationType: 'Bất đồng chuyên môn',
        note: 'Thường xuyên tranh luận với Seika về việc có nên phát lệnh báo động khi số liệu chưa đủ.'
      }
    ],
    dynamicState: {
      currentLocation: 'Văn phòng trưởng bến Arumo',
      healthStatus: 'Mệt mỏi, mắt đỏ do thiếu ngủ và căng thẳng',
      itemsCarried: ['Sổ ghi ca trực chính thức', 'Con dấu quản bến', 'Bản báo cáo kỹ thuật'],
      emotionalState: 'Căng thẳng tột độ khi đối diện với sự xuất hiện của chiếc tàu và bà Omi'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_02',
        chapterTitle: 'Chương 2',
        timestamp: 'Rạng sáng',
        knownSecrets: [
          'Đã nhận được thông báo yêu cầu kiểm tra tuyến sơ tán từ 24h trước',
          'Tổ chức tiếp tế của bến đang thiếu hụt trầm trọng'
        ],
        forbiddenSecrets: ['Động thái di tản thực sự của gia đình Garan ở khu cao']
      }
    ]
  },
  {
    id: 'char_garan',
    name: 'Garan',
    aliases: ['NV08', 'Người điều hành vùng Varo', 'Người tin mình có quyền quyết định ai chịu thiệt'],
    role: 'antagonist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: {
      age: '46 tuổi',
      appearance: 'Cao 1m82, tóc điểm bạc, trang phục kín đáo thực dụng, găng tay kỹ thuật có vết mòn do thao tác trạm lâu năm.',
      personality: 'Điềm tĩnh, nhìn được bức tranh hệ thống lớn; tin rằng người nắm số liệu có quyền quyết định phần thiệt hại mà cấp dưới phải chịu.',
      voiceCadence: 'Bình thản, logic: "Anh có thể bác phương án của tôi. Vậy đường cấp nước nào sẽ thay nó trước sáng?"',
      externalWant: 'Duy trì đường cấp nước và vận chuyển của khu cao, tránh để hệ thống sông Asera sụp đổ dây chuyền.',
      internalNeed: 'Nhận thức được rằng một kế hoạch không thể thành công nếu thiếu sự đồng thuận và tính mạng của cư dân bị xem như số liệu.',
      flawOrWound: 'Niềm tin tuyệt đối vào con số và giải pháp kỹ thuật duy ý chí xuất phát từ thành công trong quá khứ.',
      secrets: ['Đang che giấu một thử nghiệm chuyển tải trong mùa nước đứng bị mất ổn định gây biến dị sinh vật lạ.']
    },
    relationships: [
      {
        targetCharacterId: 'char_oren',
        targetName: 'Oren',
        relationType: 'Cấp trên gián tiếp',
        note: 'Dùng sinh kế của bến Arumo để buộc Oren kiểm soát thông tin không cho rò rỉ ra ngoài.'
      },
      {
        targetCharacterId: 'char_rento',
        targetName: 'Rento',
        relationType: 'Quan sát thợ trẻ',
        note: 'Xem Rento là thợ có năng lực, dự định trao thiết bị để kéo cậu vào bộ máy trạm Varo.'
      }
    ],
    dynamicState: {
      currentLocation: 'Trạm điều tiết Varo — Thượng nguồn sông Asera',
      healthStatus: 'Sức khỏe tốt, phong thái vững vàng quyền uy',
      itemsCarried: ['Thiết bị đo áp suất dòng sông Asera', 'Lệnh điều hành độc quyền Varo', 'Găng tay dẫn lực hạng nặng'],
      emotionalState: 'Kiểm soát chặt chẽ mọi báo cáo, lạnh lùng tính toán thiệt hại chấp nhận được'
    },
    knowledgeTracker: [
      {
        chapterId: 'doc_chap_03',
        chapterTitle: 'Chương 3',
        timestamp: 'Ban ngày',
        knownSecrets: [
          'Thử nghiệm chuyển dòng đã tạo ra dòng xoáy ngược và sinh vật hút nước',
          'Khu vực hạ lưu Arumo sẽ là nơi chịu tải áp lực lớn nhất'
        ],
        forbiddenSecrets: ['Phương án can thiệp bí mật của nhóm thợ máy Arumo']
      }
    ]
  }
];

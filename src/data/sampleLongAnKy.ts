import { Project, Part, BibleFact, Character, TimelineEvent, ForeshadowingHook } from '../types';

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
  activePartId: 'part_mua_nuoc_dung',
  activeChapterId: 'doc_chap_01'
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
        content: "﻿Mở đầu\n\n“ Có một thứ mà con người sợ hơn cái chết “\n\nKhông phải đau đớn. Không phải mất mát. Không phải cô đơn — dù cô đơn đã từng được xếp vào danh sách những thứ đáng sợ nhất từ thời người ta còn chưa có từ ngữ để gọi tên nó. Thứ đáng sợ hơn tất cả những điều đó, thứ mà người ta ít khi nói ra vì nói ra đồng nghĩa với việc thừa nhận rằng mình đã nghĩ đến nó, là thế này: bị quên. Không phải chết rồi bị quên — cái đó còn chịu được, vì ít nhất cái chết là một sự kiện, một mốc thời gian, một lý do để người khác nhớ đến dù chỉ trong một khoảnh khắc. Mà là bị quên khi vẫn còn đang sống. Bị xóa khỏi ký ức của người khác từng ngày một, từng mảnh một, cho đến khi không còn ai trên thế giới này nhớ rằng bạn đã từng cười theo cách đó, đã từng có thói quen đó, đã từng là người mà ai đó gọi tên vào buổi sáng.\n\nĐó là thứ đáng sợ nhất. Và cũng là thứ mà có người đã biến thành vũ khí.\n\nKhông phải ngẫu nhiên mà những nơi cũ kỹ thường mang theo thứ gì đó không thuộc về hiện tại. Người ta hay đổ cho kiến trúc, cho lịch sử, cho cái cảm giác chủ quan của người đứng trong một không gian quá lớn hoặc quá tối hoặc quá im lặng. Nhưng sự thật gần hơn và kỳ lạ hơn thế — những nơi cũ kỹ giữ lại ký ức không phải trong tường hay trong gỗ hay trong đá, mà trong khoảng không khí giữa những thứ đó. Trong khoảng cách giữa hai bức tường. Trong chiều cao của trần nhà so với sàn nhà. Trong cái cách ánh sáng đổ vào buổi chiều và tạo ra những bóng không hoàn toàn đúng với vật thể tạo ra chúng. Ký ức không cần vật chất để tồn tại — ký ức chỉ cần không gian, và không gian thì luôn luôn ở đó, im lặng và kiên nhẫn và không bao giờ thực sự trống rỗng.\n\nNhững nơi mà quá nhiều ký ức bị xóa đi cùng một lúc trở nên bất ổn theo cách không có từ ngữ thông thường nào mô tả đúng được. Không phải ma ám theo nghĩa người ta hay dùng. Không phải nguy hiểm theo nghĩa có thể đo đếm hay phòng tránh. Chỉ là — lệch. Như một căn phòng mà ai đó đã dịch chuyển tất cả đồ đạc đi vài centimet theo cùng một hướng, không đủ để nhìn thấy ngay nhưng đủ để cơ thể bạn biết rằng có gì đó không khớp với những gì nó đã học thuộc lòng. Bạn bước vào và thấy bình thường. Bạn ở lại và bắt đầu quên những thứ nhỏ. Bạn rời đi và không nhớ mình đã quên gì — chỉ biết rằng mình ra về với ít hơn những gì mình mang vào, theo một cách không thể kiểm kê.\n\nVà nếu bạn ở lại đủ lâu, đến một lúc nào đó bạn sẽ không còn nhớ tại sao mình lại đến đây ngay từ đầu.\n\nCòn có những người được sinh ra — hoặc trở thành, vì ranh giới giữa hai điều đó đôi khi mỏng hơn người ta muốn tin — với khả năng cảm nhận những vết nứt đó. Không phải một năng lực kỳ diệu theo nghĩa người ta hay lãng mạn hóa. Chỉ là một sự nhạy cảm, một thứ dây thần kinh nằm ở đâu đó sâu hơn những dây thần kinh thông thường, cái thứ khiến họ dừng lại giữa hành lang và không biết tại sao, khiến họ cảm thấy lạnh ở những chỗ không có gió, khiến họ hay mơ về những người mà khi tỉnh dậy họ không thể nhớ mặt. Những người đó thường không biết mình khác gì. Họ chỉ biết rằng thế giới đôi khi có cảm giác như một bức tranh bị vẽ đè lên một bức tranh khác, và nếu ánh sáng chiếu đúng góc vào đúng lúc, họ có thể thấy những nét của bức tranh bên dưới.\n\nĐiều đó không làm cuộc đời họ dễ dàng hơn. Thường thì ngược lại. Và điều đó khiến họ trở thành chính xác thứ mà một nơi được xây trên nền lãng quên cần nhất — không phải vì họ mạnh mẽ hay đặc biệt theo nghĩa thông thường, mà vì họ là thứ duy nhất có thể đứng giữa vết nứt và thực tại mà không bị nuốt chửng ngay lập tức.\n\nThứ duy nhất có thể — không phải thứ sẽ không bị tổn thương.\n\nĐây là câu chuyện về ba người như vậy, và về thứ họ phải trả để trở thành những gì họ trở thành.\n\nVề một người đàn ông đã đau quá lâu đến mức quên mất sự khác biệt giữa giải thoát và hủy diệt — và về khoảnh khắc ông ta nhớ lại, muộn theo cái cách mà những điều quan trọng nhất thường đến muộn, đủ muộn để không thể thay đổi những gì đã xảy ra nhưng vẫn đủ sớm để thay đổi những gì sắp xảy ra.\n\nVề một học viện đứng trên một vết nứt và gọi đó là nền móng.\n\nVề ký ức — không phải ký ức như tài sản hay gánh nặng, mà ký ức như bằng chứng. Bằng chứng rằng điều gì đó đã xảy ra. Rằng ai đó đã ở đây. Rằng dù thế giới có nói gì đi nữa, dù bao nhiêu trang danh sách bị lật qua mà không tìm thấy tên, dù bao nhiêu tấm ảnh bị nhòe đi cho đến khi không còn nhìn ra mặt người — thứ đã xảy ra vẫn đã xảy ra, và không có gì có thể lấy đi điều đó.\n\nKhông có gì, ngoại trừ sự đồng ý của chính người trong cuộc.\n\nCâu chuyện bắt đầu bằng một cái tên được gọi lên mà không ai nghe rõ.\n\nVà kết thúc bằng thứ duy nhất không thể bị xóa — dù người ta đã cố, dù người ta đã gần thành công, dù có những khoảnh khắc mà chính ba người trong câu chuyện này cũng không còn nhớ tại sao mình phải giữ lấy nữa.\n\nThứ còn lại không có tên. Chỉ có nhịp. Và nhịp thì không cần ai nhớ để tiếp tục vang. ",
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
        content: "Có một điều kỳ lạ về Học viện Aesvorn mà không sinh viên nào nói ra thành lời, nhưng tất cả đều cảm nhận được vào một thời điểm nào đó trong những ngày đầu tiên — thường là lúc đi một mình trong hành lang vào buổi tối, hoặc lúc ngồi im trong một căn phòng quá rộng, hoặc đơn giản là lúc nhìn lên từ trang sách và bắt gặp một góc tường không có gì đặc biệt nhưng lại khiến mắt mình dừng lại lâu hơn cần thiết.\n\nCảm giác rằng nơi này đang nhìn lại mình.\n\nKhông phải theo nghĩa ẩn dụ lãng mạn mà người ta hay dùng để mô tả những tòa nhà có lịch sử. Mà là theo nghĩa thực, cụ thể, đủ để khiến gáy bạn lạnh đi một nhịp — cái cách một cánh cửa tự đóng chậm hơn bình thường, cái cách ánh đèn ở cuối hành lang cứ nhấp nháy đúng lúc bạn một mình đi qua rồi trở lại bình thường ngay sau đó, cái cách những bức tường đá xám ở đây dày hơn bất kỳ tòa nhà nào bạn từng bước vào, như thể chúng được xây để giữ thứ gì đó bên trong hơn là để chắn thứ gì đó bên ngoài.\n\nNhững thứ nhỏ. Những thứ mà nếu bạn kể lại, người nghe sẽ gật đầu và nói: ừ, tòa nhà cũ mà, bình thường thôi.\n\nBình thường. Đó là từ mà người ta dùng nhiều nhất ở đây. Nhiều đến mức đáng ngờ.\n\nSena đến Aesvorn vào một buổi sáng tháng Chín, với một chiếc túi hành lý quá lớn so với người và một tờ giấy nhập học bị nhàu góc vì cô đã cầm nó quá chặt suốt chuyến đi. Lần đầu nhìn lên tòa nhà chính, cô đứng im một lúc trên sân. Không phải vì choáng ngợp — cô đã chuẩn bị tinh thần cho cái choáng ngợp đó rồi. Mà vì một cảm giác khác, kỳ lạ hơn: tòa nhà trông như thể nó chiếm nhiều không gian hơn phần nó thực sự tồn tại. Như thể nếu bạn đo từ góc này sang góc kia, con số sẽ không khớp với những gì mắt bạn nhìn thấy.\n\nCô kể điều đó cho bạn cùng phòng nghe tối hôm đó.\n\nỪ!  - bạn cùng phòng nói, không ngẩng đầu lên khỏi trang sách. \n\nTòa nhà cũ mà.\n\nSena không nói thêm gì. Nhưng cô nằm trên giường nhìn lên trần phòng và nghĩ rằng tòa nhà cũ không phải câu trả lời cho tất cả mọi thứ — chỉ là câu trả lời người ta đưa ra khi không muốn nghĩ tiếp.\n\nBa tuần sau, cô vẫn chưa tìm được câu trả lời nào tốt hơn. Nhưng cô đã học được cách ngừng tìm kiếm, ít nhất là vào ban ngày.\n\nBuổi sáng thứ Ba của tuần thứ ba, Sena bước vào Giảng đường Lý Thuyết Nền số 3 lúc tám giờ kém mười, sớm hơn thường lệ vì cô đã thức từ sáu giờ mà không rõ lý do. Giảng đường rộng, trần cao, những ô cửa sổ dài dọc tường đổ vào thứ ánh sáng trắng đục không ấm không lạnh của một buổi sáng chưa quyết định mình sẽ ra sao. Sức chứa gần hai trăm người nhưng chỉ lấp được một nửa — những dãy ghế trống tạo ra khoảng im lặng giữa các nhóm nhỏ, khiến mỗi cuộc trò chuyện nghe như đang xảy ra trong một căn phòng riêng biệt.\n\nCô ngồi xuống hàng thứ năm, lấy vở ra, và nhìn lên phía trước.\n\nKoto ngồi ở hàng thứ tư, lệch về phía cửa sổ bên trái.\n\nCô đã quen với sự hiện diện của cậu ta đủ để không còn nhìn lâu nữa — nhưng ban đầu, những ngày đầu tiên, cô cứ vô tình nhìn. Không phải vì tò mò hay thiếu lịch sự, mà đơn giản là vì người Namec không phải thứ phổ biến đến mức mắt người ta quen nhìn. Làn da xanh lục nhạt, đôi ăng-ten nhỏ cụp xuống hai bên thái dương theo thói quen như thể cậu ta đang cố thu mình lại cho vừa với không gian xung quanh — Koto trông như một người đã học cách tồn tại trong một nơi không được thiết kế cho mình và đã quen với điều đó lâu đến mức không còn để ý nữa. Hôm nay cậu cầm bút chì, tay di chuyển đều đặn trên trang giấy, nhưng đôi mắt màu tím xám đang nhìn ra ngoài cửa sổ — dõi theo một cành cây đung đưa không rõ vì gió hay vì lý do gì khác.\n\nBên phải Koto, cách một ghế trống, Ryou đang gõ đầu ngón tay lên mặt bàn.\n\nRyou là kiểu người mà bạn nhận ra ngay trong phòng đông người không phải vì cậu ta nổi bật, mà vì cậu ta không nổi bật theo một cách quá hoàn hảo đến mức bắt đầu trở thành nổi bật. Lúc nào cũng có vẻ đang nghĩ điều gì đó, nhưng không bao giờ nói ra trừ khi cần thiết, và khi nói thì thường là đúng lúc. Ngón tay cậu gõ nhịp lên mặt bàn — không phải vì buồn chán, Sena đã quan sát đủ lâu để biết điều đó — mà vì cậu đang xử lý thứ gì đó trong đầu và cần tay làm một việc gì đó trong lúc đó.\n\nGiảng viên Brell bước lên bục đúng tám giờ, không sớm không muộn, như một cái đồng hồ mặc quần áo. Người đàn ông tóc muối tiêu, dáng gầy theo kiểu của người đã ngồi quá nhiều năm trong những căn phòng thiếu ánh sáng, mở danh sách điểm danh và bắt đầu đọc bằng giọng đều đều không ngữ điệu — cái giọng của người đã làm việc này đủ nhiều lần để không còn thực sự nghe thấy mình đang nói gì nữa.\n\nArata?\n\nCó ạ!\n\nFenn?\n\nCó!\n\nCứ thế. Sena nhìn xuống trang vở, tay cầm bút, chờ đến tên mình theo phản xạ trong khi một phần đầu cô đang ở đâu đó khác — đang nghĩ về giấc mơ tối qua, một giấc mơ mà cô thức dậy không nhớ nội dung gì ngoài cảm giác đã từng đứng ở một nơi rất tối và nghe thấy ai đó gọi tên mình theo cách không ai đã từng gọi.\n\nRồi Brell đọc một cái tên. Sena không nghe rõ. Không phải vì giọng ông ta nhỏ hơn — mà vì âm thanh đó cứ trượt qua tai cô mà không đọng lại, như nước chảy trên kính. Cô chớp mắt.\n\nỞ hàng thứ sáu, một sinh viên đứng dậy.\n\nNam, dáng người bình thường, tóc hơi dài che một phần tai, áo sơ mi trắng bạc màu ở cổ. Không có gì đặc biệt trong vẻ ngoài của cậu ta — đó chính xác là điều kỳ lạ. Cậu ta là kiểu người mà bạn nhìn vào và không tìm được bất cứ thứ gì để bám víu, không một chi tiết nào đủ sắc nét để ký ức có thể giữ lại.\n\nCó ạ!  - Cậu ta nói, giọng bình thản.\n\nBrell dừng lại! Không phải dừng để lật trang hay ho khan — mà là cái dừng hoàn toàn, đột ngột, của người vừa đọc một thứ không khớp với những gì đang có trước mặt. Ngón tay ông ta chạy dọc theo danh sách, chậm, rồi lật trang, rồi lật ngược lại. Lần thứ hai. Lần thứ ba. Đầu ông ta cúi xuống ở một góc nhỏ — cái nghiêng đầu của người đang kiểm tra lại và kết quả vẫn không khớp.\n\nSena không thở. Cô không để ý là mình đã nín thở cho đến khi cảm thấy phổi căng lên. Xung quanh cô, vài người liếc sang hàng thứ sáu rồi nhìn lại vở của họ. Ryou đã ngừng gõ nhịp. Koto vẫn nhìn ra cửa sổ, nhưng tay cậu đặt xuống bàn, không còn chép bài.\n\nĐược rồi!  - Brell nói.\n\nGiọng ông ta không thay đổi gì cả. Bằng phẳng như mặt hồ không gió.\n\nTiếp tục.\n\nVà ông ta tiếp tục đọc tên, như thể trang danh sách đó hoàn toàn bình thường, như thể không có gì vừa xảy ra. Sinh viên áo trắng bạc màu ngồi xuống. Những người xung quanh cậu ta quay lại vở của họ. Một giây, hai giây — và cái khoảng lặng kỳ lạ đó tan ra như sương, như thể nó chưa từng có mặt.\n\nSena nhìn xuống trang vở của mình. Tay cô vẫn cầm bút, nhưng không viết gì. Đó là lúc Koto thấy nó. Không phải chú  ý nhìn — cậu chỉ đang quay mắt từ cửa sổ vào trong phòng theo phản xạ khi nghe cái dừng lại bất thường của Brell, và ánh mắt lướt qua hàng thứ sáu đúng vào khoảnh khắc sinh viên áo trắng ngồi xuống.Bóng của cậu ta khi đứng là bình thường. Một cái bóng duy nhất, dài, đổ về phía cửa sổ theo đúng hướng ánh sáng buổi sáng.\n\nNhưng trong khoảnh khắc cơ thể cậu ta đang chuyển từ đứng sang ngồi — không phải trước, không phải sau, mà đúng cái khoảnh khắc ở giữa — có hai bóng. Đổ về hai hướng hoàn toàn khác nhau, như thể cùng một cơ thể đó đang tồn tại dưới hai nguồn sáng từ hai nơi không thể cùng tồn tại.\n\nKoto chớp mắt.\n\nMột bóng. Bình thường.\n\nCậu nhìn xuống trang vở. Bài ghi chép dừng lại giữa chừng ở một câu chưa hoàn thành. Cậu đặt bút chì xuống, nhìn nó, rồi cầm lên và tiếp tục chép như không có gì xảy ra. Nhưng tay cậu ghi những ký hiệu không còn theo kịp những gì Brell đang nói nữa.\n\nHết giờ, cả giảng đường dịch chuyển ra ngoài theo dòng quen thuộc. Tiếng ghế, tiếng vở đóng lại, tiếng người chen nhau về phía cửa. Sena thu đồ, nhìn sang hàng thứ sáu. Ghế của sinh viên áo trắng trống rỗng. Không biết từ lúc nào.\n\nBa người bước ra hành lang — không phải vì họ rủ nhau, mà vì họ cùng đi ra cùng một hướng và bước chân cứ tự nhiên đi gần nhau. Hành lang dài, ánh đèn vàng ệch dọc trần nhà, phần cuối dãy chìm trong một khoảng tối mà không ai giải thích được tại sao đèn ở đó không bao giờ đủ sáng.\n\nRyou là người lên tiếng trước. Cậu không hỏi ai cụ thể, chỉ ném câu đó vào không khí giữa ba người như một hòn đá ném xuống mặt nước — để xem có ai phản ứng không.\n\nHôm nay mày nghe tên cậu đó không?\n\nSena im lặng một nhịp.\n\nTao không nghe rõ.  -cô nói.\n\nTao cũng không.  - Ryou liếc nhìn lại phía sau một lần, như thể cậu vẫn đang cố ghép lại điều gì đó.\n\n Lạ nhỉ! Tao ngồi đúng phía đó.\n\nKoto không nói gì. Cậu đi bên cạnh họ, tay trong túi, ăng-ten cụp thấp xuống hơn bình thường — dấu hiệu mà Sena chưa hiểu hết nhưng đã bắt đầu nhận ra là không hoàn toàn vô nghĩa. Mãi đến khi đi được một đoạn dài, cậu mới lên tiếng. Giọng thấp, chắc, như người đưa ra một quan sát hơn là một câu hỏi.\n\nCái bóng của cậu ta lúc đứng dậy đổ hai hướng.\n\nRyou nhìn sang.\n\nMày nói gì?\"\n\nKoto nhìn thẳng phía trước thêm một nhịp. Rồi cậu nói:\n\nKhông có gì. Chắc nhìn nhầm.\n\nKhông ai hỏi thêm. Họ đi tiếp, ba bóng người dưới hành lang dài của Aesvorn, và không ai trong số họ nói ra điều mình thực sự đang nghĩ — rằng nhìn nhầm không phải câu trả lời cho tất cả mọi thứ, chỉ là câu trả lời người ta đưa ra khi không muốn nghĩ tiếp.\n\nĐêm đó Sena ngồi trên giường, mở vở ra, và thấy một khoảng trắng ở giữa — một đoạn bài cô không chép mà không nhớ mình đã làm gì thay vào đó. Cô lật lại, nhìn chỗ trống đó một lúc. Rồi cô cố hình dung lại gương mặt của sinh viên áo trắng.\n\nKhông được.\n\nKhông phải vì cô không để ý. Mà vì gương mặt đó, dù cô chắc chắn mình đã nhìn thấy rõ ràng, cứ trượt ra khỏi ký ức như nước trượt trên kính — không bám vào được, không giữ lại được. Cô nhắm mắt, thử lần nữa. Rồi lần nữa.\n\nChỉ còn lại một chiếc áo trắng bạc màu ở cổ, và một cái ghế gỗ ở hàng thứ sáu.\n\nCô ngồi im một lúc trong phòng tối, nghe tiếng gió bên ngoài cửa sổ, và nghĩ về một điều không liên quan: sáng nay khi đi ngang hành lang tầng bốn, hơi lạnh ở đó vẫn có mùi của đất ẩm. Của thứ gì đó bị chôn xuống từ rất lâu. Của thứ gì đó chưa sẵn sàng nằm yên.\n\nCô gập vở lại. Tắt đèn. Nằm xuống.\n\nVà tự nhủ rằng ngày mai mình sẽ không nghĩ về những thứ không có lời giải thích.\n\nĐó là một lời hứa cô biết mình sẽ không giữ được.",
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
        content: "Không ai nói về cậu sinh viên áo trắng vào ngày hôm sau. Không phải vì họ đã thỏa thuận — ba người thậm chí chưa đủ thân để thỏa thuận bất cứ điều gì. Chỉ đơn giản là khi buổi sáng hôm sau đến, câu chuyện đó trở nên kỳ lạ theo một cách khác: nó không còn cảm giác cấp bách nữa. Như thể đêm qua đã làm mờ đi những cạnh sắc của nó, bào mòn xuống đến mức chỉ còn là một mảnh ký ức mơ hồ — có gì đó đã xảy ra, nhưng chính xác là gì thì không còn quan trọng lắm.\n\nSena nhận ra điều đó lúc đánh răng buổi sáng, nhìn vào gương và cố hình dung lại cái dừng lại của Brell, cái giọng bình thản kỳ lạ của cậu sinh viên kia. Ký ức đó không còn sắc nét như tối qua nữa. Như ảnh phơi nắng một ngày — màu sắc nhạt đi theo những cách không đều nhau, và bạn không thể chỉ ra đúng chỗ nào đã thay đổi, chỉ biết rằng nó khác rồi.\n\nCô nhổ nước súc miệng, nhìn lại gương. \n\nTòa nhà cũ mà cô nghĩ. Bình thường thôi.\n\nRồi cô đặt bàn chải xuống và bước ra ngoài, và cố không nghĩ về việc mình vừa dùng đúng cái câu mà tuần trước cô đã quyết định là không đủ.\n\nBuổi chiều không có lịch học. Ryou đề nghị ra căng tin vì cậu đói, Sena đồng ý vì cô cũng đói, và Koto đi theo vì không có lý do gì đặc biệt để không đi theo — đó là mức độ của mối quan hệ giữa ba người vào thời điểm đó. Không nhiều hơn, không ít hơn. Đủ để đi cùng nhau, chưa đủ để im lặng mà không thấy ngại.\n\nHọ đi dọc theo hành lang chính của tầng hai. Hành lang dài đến mức bạn có thể đi hai phút mà không thấy cuối, hai bên là những cánh cửa gỗ tối màu đóng im lìm với biển số bằng đồng đã ố vàng. Ánh đèn trên trần không trắng như các phòng học — vàng hơn, ấm hơn, nhưng ấm theo cái cách của ngọn nến sắp tắt hơn là của một buổi chiều có nắng. Dọc theo chân tường, những vết nứt nhỏ trong lớp vữa tạo thành những đường zích zắc không đều như chữ viết của người đang run tay — và nếu bạn đứng nhìn đủ lâu, bạn sẽ bắt đầu tự hỏi liệu mình có đang đọc được điều gì không. Không ai đứng nhìn đủ lâu. Đó là quy tắc bất thành văn thứ hai của Aesvorn.\n\nỞ cuối dãy hành lang, treo trên tường giữa hai cánh cửa, là một cái đồng hồ quả lắc.\n\nKoto không biết nó đã ở đó bao lâu — có lẽ lâu hơn bất kỳ thứ gì khác trong tòa nhà này. Vỏ gỗ sẫm màu như màu của đất ẩm sau mưa, mặt số bằng sứ trắng ngả vàng với những con số La Mã khắc tay, con lắc đung đưa đều đặn với âm thanh tích — tắc chậm rãi đến mức nghe như từng nhịp đang được cân nhắc kỹ lưỡng trước khi xảy ra. Không hiểu sao mỗi lần đi qua cậu đều nhìn lên nó, không phải vì cần biết giờ, mà vì có điều gì đó trong cái đồng hồ đó kéo ánh mắt lại như nam châm kéo kim loại — nhẹ thôi, nhưng không thể phủ nhận.\n\nLúc đó là 9h47. Cậu ghi nhớ điều đó mà không biết tại sao.\n\nCăng tin của Aesvorn nằm ở góc cuối tòa nhà phụ — một căn phòng rộng với trần nhà thấp hơn bình thường và những chiếc bàn gỗ dài đủ chứa mười người nhưng hiếm khi được dùng hết. Mùi ở đây luôn là sự pha trộn kỳ lạ giữa cà phê và gỗ ẩm và thứ gì đó giống mùi sách cũ bị để quên trong ngăn kéo — không khó chịu, chỉ là không hoàn toàn thuộc về một nơi bán đồ ăn. Nắng chiều lọt vào qua hai ô cửa sổ nhỏ ở góc phải, tạo ra hai vệt sáng vàng hẹp trên sàn gạch, và trong hai vệt sáng đó bụi lơ lửng yên tĩnh như thể thời gian ở đây chạy chậm hơn một chút so với phần còn lại của tòa nhà.\n\nBa người ngồi xuống bàn gần cửa sổ. Ryou mang về một cái bánh mì kẹp trứng và một ly cà phê đen, đặt xuống bàn với vẻ mặt của người vừa hoàn thành một nhiệm vụ quan trọng. Cái đuôi nâu sẫm quấn quanh hông cậu — thói quen giữ chặt lại mỗi khi vào chỗ đông người, như thể cậu đã học từ lâu rằng không phải ai cũng thoải mái với sự hiện diện của nó — khẽ thả lỏng ra một chút khi cậu ngồi xuống. Dấu hiệu nhỏ của một người đang bắt đầu cảm thấy ổn với chỗ mình đang ngồi.\n\nXong!    - cậu nói.\n\nCuộc đời có ý nghĩa trở lại.\n\nMày vừa mua mỗi một cái bánh mì.   - Sena nói.\n\nĐúng!!  Và cuộc đời có ý nghĩa trở lại.  \n\n Ryou cắn một miếng lớn, nhai, nhìn lên trần nhà với vẻ mãn nguyện của một triết gia vừa tìm ra chân lý. \"Tao không hiểu tại sao người ta hay tìm ý nghĩa cuộc sống ở những chỗ phức tạp thế. Nó ở trong bánh mì kẹp trứng. Luôn luôn là vậy.\"\n\nKoto nhìn cậu ta một giây, ăng-ten khẽ nghiêng sang một bên theo kiểu của người đang xử lý thông tin và chưa quyết định được thông tin đó có đáng xử lý không.\n\nMày ăn xong chưa?   - cậu hỏi.\n\nChưa.\n\nThì đừng triết học.\n\nSena bật cười — một tiếng cười nhỏ không cố ý, kiểu thoát ra trước khi kịp quyết định có nên cười không. Ryou nhìn sang cô, rồi nhìn sang Koto, rồi gật đầu một cái với vẻ của người vừa được công nhận một cách gián tiếp.\n\nNgười Namec cũng biết hài hước à!  - cậu nói. \n\nTao cứ tưởng các mày chỉ thiền và giao tiếp bằng ăng-ten.\n\nChúng tao không giao tiếp bằng ăng-ten.  - Koto nói, giọng bằng phẳng.\n\nỪ nhưng tao để ý mỗi khi mày đang nghĩ thì ăng-ten cụp xuống. Vậy không phải giao tiếp thì là gì?\n\nKoto im lặng một nhịp. Ăng-ten cậu — như để chứng minh điểm của Ryou — khẽ cụp xuống thêm một chút.\n\nĐó là phản xạ. - cậu nói.\n\nPhản xạ cũng là ngôn ngữ cơ thể.\n\nMày đang ăn bánh mì hay học ngôn ngữ học?\n\nSena cười thêm lần nữa. Có điều gì đó trong cái không khí nhỏ bé ở góc căng tin này — nắng chiều vàng, mùi cà phê, hai người đang tranh luận về ăng-ten trong khi thế giới vẫn đang vận hành bình thường ở bên ngoài — khiến cô thấy nhẹ hơn một chút so với buổi sáng. Không nhiều. Nhưng đủ để nhận ra, và đủ để trân trọng.\n\nRồi Ryou đặt ly cà phê xuống, nhìn lên, và kể một câu chuyện cười.\n\nCô không nhớ chính xác đề tài — chỉ nhớ đó là chuyện về một giảng viên và một con mèo và một tình huống hiểu nhầm liên quan đến bài tập về nhà. Ryou kể bằng giọng điệu của người biết chính xác chỗ nào sẽ gây cười, nhịp nào cần dừng lại, chỗ nào cần hạ giọng cho đúng lúc. Koto nghe với biểu cảm trung lập theo kiểu trung lập chủ động — không phải không quan tâm mà là đang xử lý trước khi phản ứng. Sena cười ở đúng chỗ, không hẳn vì câu chuyện buồn cười, mà vì cô đột nhiên nhận ra mình đang ngồi ở đây với hai người này và cảm thấy thoải mái theo cái cách mà cô chưa cảm thấy từ ngày đặt chân vào Aesvorn.\n\nCảm giác đó kéo dài được đúng đến khi Ryou kể xong câu chuyện.\n\nSena nhìn sang cậu ta. Có điều gì đó vừa kéo một sợi dây nhỏ trong đầu cô — không đau, chỉ là bất ổn nhẹ, như khi bạn nghe một bài hát quen và không thể nhớ tên nhưng biết chắc mình đã nghe nó trong một bối cảnh hoàn toàn khác.\n\nCâu chuyện đó?  - cô nói chậm. \n\nMày kể rồi!\n\nRyou nhìn cô.\n\nHả?\n\nMày kể câu chuyện này rồi. Hai ngày trước, ở hành lang tầng ba, trước giờ Vật lý ứng dụng.  - Sena đặt tay lên bàn, nhìn thẳng cậu. \n\nNhưng lúc đó con mèo là con chó. Và giảng viên là nữ, không phải nam.\n\nRyou im lặng. Sau một lúc, cậu nói — không phải giọng phân bua, giọng của người thực sự đang cố nhớ lại và không tìm thấy ký ức đó ở đâu cả. Cái đuôi của cậu khẽ co lại một chút, vô thức.\n\n Tao không nhớ là mình đã kể.  \n\nMày kể rồi!  - Sena nói lại, lần này nhẹ hơn. \n\nTao nghe rõ ràng.\n\nMột khoảng im lặng nhỏ rơi xuống giữa ba người. Không phải im lặng khó chịu — mà là im lặng của ba người đang nhìn vào cùng một thứ từ ba góc khác nhau và chưa ai biết phải gọi thứ đó là gì.\n\nKoto là người lên tiếng trước. Giọng cậu thấp và cẩn thận theo kiểu của người đang đặt từng chữ xuống như đặt chân trên băng mỏng.\n\nCâu chuyện khác đi ở những chi tiết nhỏ. - cậu nói. \n\nKhông phải nội dung chính.\n\nĐúng!  - Sena nói.\n\nNghĩa là Ryou nhớ câu chuyện — nhưng nhớ sai phiên bản. Hoặc…  - cậu dừng lại.\n\nHoặc?  - Ryou nhìn sang.\n\nHoặc có hai phiên bản. Và chúng ta không nhớ cùng một cái.\n\nCả ba người im lặng với điều đó một lúc.\n\nTao thề là lần này tao kể đúng. - Ryou nói cuối cùng, giọng không còn chắc như lúc đầu.\n\nLần trước mày cũng thề vậy.  - Sena nói.\n\nRyou không trả lời. Cậu cầm ly cà phê lên, uống một ngụm, đặt xuống. Nhìn ra cửa sổ nơi hai vệt nắng vàng vẫn nằm im trên sàn gạch, bụi vẫn lơ lửng trong không khí theo cái cách của thứ không bị thời gian làm phiền.\n\nTao không biết!  - cậu nói cuối cùng, và đó là câu thành thật nhất cậu nói trong cả buổi chiều hôm đó.\n\nHọ rời căng tin lúc trời bắt đầu đổ màu cam ở phía chân trời. Đi ngược lại hành lang chính, ba người, bước chân không vội, cái im lặng giữa họ bây giờ khác hơn một chút — không còn là im lặng của người chưa đủ thân, mà là im lặng của người đang mang theo cùng một thứ nặng và chưa biết đặt nó xuống ở đâu.\n\nKoto đi trước. Và khi đến cuối hành lang, cậu nhìn lên cái đồng hồ quả lắc theo phản xạ. 9h52.Cậu dừng lại. Ryou và Sena đi kịp đến ngang cậu, nhìn theo ánh mắt cậu lên mặt đồng hồ. Không ai nói gì trong vài giây đầu. Con lắc vẫn đung đưa, tích — tắc, đều đặn, bình thản một cách không tự nhiên.\n\nSao mày dừng lại?  - Ryou hỏi.\n\nLúc mình đi qua đây lúc nãy…  - Koto nói, giọng bình thường nhưng cái bình thường đó có gắng một chút.\n\nĐồng hồ chỉ 9 giờ 47!\n\nỪ thì đi một lúc rồi, giờ khác là đúng chứ.\n\nChúng ta đi bao lâu?\n\nRyou mở miệng, rồi khép lại. Cậu lấy điện thoại ra, nhìn giờ, nhìn lại đồng hồ trên tường. Một thứ gì đó thoáng qua mặt cậu — không hẳn là sợ, gần với cái cảm giác khi bạn bước một bậc thang và bậc thang đó thấp hơn bạn tưởng một chút, cái giật mình nhỏ trong người khi mặt đất đến sớm hơn dự kiến.\n\nChưa đến 15 phút.   - cậu nói chậm.\n\nĐồng hồ chạy thêm năm phút so với thực tế.  - Koto nói. \n\nTừ lúc chúng ta đi qua đến lúc quay lại. Chúng ta đi mười lăm phút nhưng nó chạy hai mươi phút.\n\nSena nhìn lên mặt đồng hồ. Con lắc vẫn đung đưa, tích — tắc, không quan tâm đến việc mình vừa bị đặt câu hỏi. Cô có một cảm giác kỳ lạ khi nhìn vào mặt số ố vàng đó — cảm giác như đồng hồ đang nhìn lại cô, và nó biết nhiều hơn cô về khoảng thời gian vừa qua.\n\nCó thể đồng hồ chạy nhanh?  -  cô nói, dù ngay cả khi nói cô cũng không tin vào lý do đó.\n\nTao đứng đây nhìn nó lúc đi qua.  -  Koto nói. \n\nNó đang chạy đúng nhịp. Không nhanh không chậm.\n\nBa người đứng im nhìn cái đồng hồ. Cái đồng hồ không giải thích gì thêm. Nó chỉ tiếp tục đung đưa, tích — tắc, như thể năm phút mất đi đó là chuyện hoàn toàn bình thường — chỉ là một trong nhiều thứ ở Aesvorn mà nếu bạn kể lại, người nghe sẽ gật đầu và nói ừ, tòa nhà cũ mà.\n\nRyou nhìn sang Sena. Sena nhìn sang Koto. Koto nhìn lại cái đồng hồ thêm một giây, rồi quay đi.\n\nĐi thôi!  -  cậu nói.\n\nKhông ai hỏi đi đâu. Họ chỉ đi, bước chân nặng hơn lúc đến, hành lang dài ra trước mặt với ánh đèn vàng ệch nhạt dần về phía cuối, và ở chỗ ánh đèn cuối cùng cũng bỏ cuộc — ở khoảng tối quen thuộc không ai giải thích được tại sao vẫn ở đó — có một âm thanh.\n\nKhông to. Không rõ ràng. Chỉ là một tiếng vọng nhỏ, như tiếng ai đó vừa đặt tay lên tường ở cuối hành lang và kéo nhẹ theo chiều dài của nó. Một tiếng vọng của một âm thanh không có nguồn gốc.Ba người dừng lại cùng lúc. Nhìn về phía cuối hành lang.\n\nKhông có ai.Chỉ có bóng tối, và tích — tắc của cái đồng hồ quả lắc vang theo sau lưng họ, đều đặn, kiên nhẫn, như thể nó đang đếm một thứ không phải là thời gian.\n\nRyou là người phá vỡ im lặng trước. Cậu hắng giọng một cái nhỏ.\n\nTao vẫn còn đói!  - cậu nói.\n\nSena nhìn cậu.\n\nMày vừa ăn bánh mì.\n\nỪ. Và tao vẫn còn đói.  -  Cậu quay người đi về hướng khác, đuôi khẽ vẫy một cái như để xua đi điều vừa xảy ra. \n\nCó ai muốn ăn thêm không?\n\nKhông ai trả lời. Nhưng cả hai đều đi theo cậu.\n\nĐêm đó, lúc Sena ngồi trên giường cố viết lại những gì xảy ra trong ngày vào trang nhật ký — thói quen cô có từ năm 12 tuổi, cái thứ duy nhất giúp cô cảm thấy những ngày đã qua không hoàn toàn trôi mất — cô viết xuống:\n\n Đồng hồ hành lang tầng hai chạy sai giờ.\n\n Câu chuyện của Ryou có hai phiên bản.\n\n Koto để ý cả hai.\n\nCô nhìn ba dòng đó. Rồi cô viết thêm một dòng nữa, nhỏ hơn, ở góc dưới trang giấy, theo cái cách người ta viết những thứ họ chưa sẵn sàng nhìn thẳng vào:\n\nVà ở cuối hành lang tối, có tiếng của ai đó. Nhưng không có ai.\n\nCô gập nhật ký lại. Tắt đèn. Và nằm im trong bóng tối, nghe tiếng gió bên ngoài cửa sổ phòng ký túc xá, tự hỏi tại sao hơi lạnh của hành lang tầng bốn vẫn cứ theo cô về đến tận đây — mùi đất ẩm, mùi của thứ gì đó chưa sẵn sàng nằm yên — dù cô đã không đi qua đó từ buổi sáng.",
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
        content: "Cây cổ thụ ở góc tây của khuôn viên Aesvorn không có trong bất kỳ tài liệu giới thiệu nào của học viện.\n\nSena tìm thấy nó vào buổi chiều đầu tiên cô đi lạc — không phải đi lạc theo nghĩa không biết đường về, mà đi lạc theo nghĩa của người cần thoát khỏi bốn bức tường một lúc mà không muốn đến bất kỳ nơi nào có tên gọi cụ thể. Cô đi theo bản năng, rẽ vào những lối nhỏ giữa các tòa nhà, và cái cây cứ ở đó như thể nó đã chờ từ trước. Rễ cây xòe rộng trên mặt đất như những ngón tay khổng lồ đang bám lấy điều gì đó bên dưới — điều gì đó mà mặt đất có thể muốn nuốt trở xuống nhưng cái cây không chịu buông. Tán cây rộng đến mức tạo ra một khoảng không gian riêng bên dưới, nơi ánh sáng và bóng tối trộn vào nhau theo những tỉ lệ không giống với phần còn lại của thế giới.\n\nCô lấy điện thoại ra định chụp ảnh gửi về nhà cho mẹ. Nhưng ngón tay cô dừng lại trên màn hình và không nhấn nút — không phải vì cô quên, mà vì có điều gì đó trong cô nói rằng cái cây này không muốn được ghi lại. Không phải theo nghĩa đáng sợ. Mà theo nghĩa của thứ quá cũ để quan tâm đến việc được nhớ theo cách đó.\n\nCô cất điện thoại vào túi, ngồi xuống dưới gốc cây, lưng tựa vào thân gỗ sần sùi lạnh. Và lần đầu tiên từ khi đặt chân vào Aesvorn — lần đầu tiên kể từ cái hành lang tầng bốn, kể từ cái đồng hồ quả lắc, kể từ cậu sinh viên không có tên trong danh sách — cô thở ra thật sự. Không phải thở để tồn tại. Thở để đặt xuống. Cô không biết mình đã mang theo nhiều thứ nặng đến vậy cho đến lúc đặt được xuống.\n\nĐó là lý do cô quay lại vào buổi chiều hôm sau. Rồi hôm sau nữa. Rồi không biết từ lúc nào, Ryou và Koto cũng xuất hiện ở đó — không ai rủ ai, họ chỉ cùng đi về một hướng sau giờ học như những mảnh vụn bị kéo về cùng một chỗ bởi thứ lực hút không có tên gọi. Dưới gốc cây có một cái bàn đá nhỏ mà không ai nhớ ai đã đặt ở đó, đủ chỗ cho ba người ngồi quanh mà không phải cố tình nhìn mặt nhau nếu không muốn. Họ bày sách vở ra, tranh luận về những bài tập không ai thực sự muốn làm — và trong khoảng thời gian đó, dù ngắn dù dài, học viện Aesvorn trở nên nhỏ hơn một chút so với khi chỉ có một người ngồi.\n\nKhông ai nói ra điều đó. Nhưng cả ba đều cảm thấy.\n\nBuổi chiều của ngày thứ Năm, hoàng hôn đến theo cái cách đặc trưng của Aesvorn — đột ngột, không báo trước, như thể bầu trời không thèm hỏi ý kiến những người đang ngồi bên dưới. Ánh sáng cuối ngày đổ qua tán cây tạo ra những mảnh nắng vỡ vụn trên mặt bàn đá, lung linh theo gió như những mảnh gương bị đập nhỏ. Bóng tối bắt đầu tập hợp lại ở những góc xa của khuôn viên — không kín đặc, chỉ là dày hơn bình thường, theo cái cách của thứ có khối lượng, có thể ngồi xuống và ở lại nếu nó muốn.\n\nRyou đang tranh luận. Cậu đã nói liên tục được khoảng mười lăm phút về lý do tại sao cách tiếp cận của Sena với phần lý thuyết đầu tiên là sai về mặt nguyên tắc — không có lớp đệm ngoại giao, không có ác ý, chỉ là trực tiếp theo cái cách của người tin rằng nói thẳng là tôn trọng nhau hơn vòng vo. Cái đuôi của cậu đập nhẹ xuống đất trong khi cậu nói, nhịp điệu không đều của người vừa lập luận vừa suy nghĩ.\n\nSena để cậu nói xong. Cô không vội. Cô nhìn lại đúng trang cậu vừa chỉ, và khi ngẩng lên giọng cô mang cái tĩnh lặng của người đã chuẩn bị tinh thần cho cuộc tranh luận này từ trước.\n\nCông thức này áp dụng cho không gian tuyến tính. Tao biết! – cô nói. \n\nNhưng ở trường hợp này khi độ cong tiệm cận về không, hai công thức cho kết quả xấp xỉ nhau. Đó là điều tao đang khai thác.\n\nXấp xỉ không phải bằng nhau.  – Ryou nói.\n\nTrong giới hạn sai số cho phép thì xấp xỉ là đủ.\n\nTao không chấp nhận đủ trong bài thi.\n\nSena nhìn thẳng vào mắt cậu, không chớp.\n\nMay là tao không cần mày chấp nhận.\n\nRồi cô lật trang, bình thản như người vừa kết thúc một cuộc trò chuyện không đáng kéo dài thêm. Ryou mở miệng định nói tiếp, rồi nhìn sang Koto như tìm kiếm đồng minh. Koto đang đọc phần tài liệu riêng của cậu, ăng-ten cụp xuống theo góc quen thuộc của người đang tập trung thật sự.\n\nKoto..!!  – Ryou gọi.\n\nSena đúng!  – Koto nói mà không ngẩng đầu.\n\nMột khoảng im lặng ngắn. Rồi Ryou phì cười — tiếng cười của người không muốn cười nhưng không nhịn được — và cái căng thẳng nhỏ trong không khí tan ra theo. Sena không cười lại, nhưng cô để nó thoát ra ở khóe miệng một chút, đủ để Ryou thấy mà không phải thừa nhận là mình đã thắng.\n\nĐó là một trong những khoảnh khắc mà về sau Sena sẽ nhớ lại nhiều lần, không phải vì nó quan trọng, mà vì nó đơn giản và thật theo cái cách mà những khoảnh khắc về sau sẽ không còn được như vậy nữa. Ba người, dưới gốc cây cổ thụ, ánh hoàng hôn vỡ vụn qua tán lá, tranh luận về bài tập không ai thực sự muốn làm.\n\nBình thường đến mức gần như đẹp. Gần như. Cô không biết ai làm trước.\n\nVề sau khi cố nhớ lại, cả ba đều không thể trả lời câu hỏi đó — không phải vì ký ức mờ, mà vì thực sự không có người làm trước. Nó xảy ra đồng thời, theo cái cách mà ba cái đồng hồ riêng biệt đột nhiên điểm cùng một giờ dù không ai lên dây cho chúng cùng lúc.\n\nBa người đưa tay lên. Và gõ xuống mặt bàn đá. Ba lần. Cùng nhịp. Cùng khoảng cách. Không phải cả bàn tay xòe ra mà là ba ngón tay giữa chụm lại, gõ theo kiểu không ai trong số họ có thể giải thích là mình học từ đâu hoặc từ bao giờ.\n\nTốc — tốc — tốc.\n\nIm lặng.\n\nBa người nhìn xuống tay mình. Rồi nhìn lên nhau. Ánh hoàng hôn vẫn vỡ vụn qua tán lá, gió vẫn thổi nhẹ, dưới gốc cây rễ vẫn xòe ra trên mặt đất như những ngón tay đang bám víu. Mọi thứ vẫn ở đúng chỗ cũ, vận hành đúng như cũ. Chỉ có một thứ không đúng — và cả ba đều biết thứ đó là gì mà không cần ai nói ra.\n\nRyou là người lên tiếng trước, giọng chậm hơn bình thường, cẩn thận theo cái cách của người đặt chân xuống mặt đất mà chưa chắc chắn mặt đất có ở đó không.\n\nMày vừa làm gì vậy?\n\nTao không biết!  - Sena nói.\n\n Thật sự không biết — tay cô đã chuyển động trước khi não cô kịp ra lệnh, theo cái cách của phản xạ, nhưng không phải phản xạ của thứ gì cô đã từng học.\n\nHọ nhìn sang Koto. Cậu đang nhìn xuống bàn tay mình, anten dựng thẳng cứng — không phải cụp xuống như lúc tập trung mà dựng thẳng theo cái cách Sena chưa thấy bao giờ, cái cách của thứ gì đó lớn hơn cảnh giác. Cậu không ngẩng lên ngay. Khi cậu lên tiếng thì giọng cậu thấp, đặt từng chữ xuống như đặt chân trên băng mỏng.\n\nTao nghe thấy bốn tiếng.\n\nKhông ai muốn thừa nhận rằng họ cũng nghe thấy bốn tiếng.\n\nSena đã nghe — cô chắc chắn với cái chắc chắn của người biết rằng thừa nhận điều này có nghĩa là phải đối mặt với những câu hỏi mà mình chưa sẵn sàng hỏi. Tiếng thứ tư không to hơn hay nhỏ hơn ba tiếng kia. Nó ở đúng chỗ trong nhịp, đúng vị trí, như thể đã được đặt ở đó bởi một bàn tay không thuộc về ai trong số họ. Và nó không đến từ mặt bàn đá — nó đến từ khoảng trống ngay giữa ba người, từ nơi không có gì cả.\n\nThử lại đi.  – Koto nói.\n\nRyou nhìn xung quanh một lượt — cái nhìn của người đang cố ra vẻ bình thường và không hoàn toàn thành công. Bóng tối ở những góc xa của khuôn viên đã dày hơn rõ rệt so với mười phút trước, không phải vì trời tối đi nhanh mà vì Sena có cảm giác bóng tối ở đây không chờ trời tối mới xuất hiện — nó chỉ chờ người ta bớt chú ý.\n\nNhưng cuối cùng, không ai phản đối.\n\nLần này họ cố ý làm khác. Ryou quyết định trong đầu sẽ gõ hai tiếng thay vì ba. Sena quyết định dùng lòng bàn tay thay vì ngón tay. Koto quyết định gõ chậm hơn, khoảng cách giữa các tiếng dài ra gấp đôi. Ba quyết định riêng biệt, được giữ trong đầu riêng biệt, không ai nói ra cho ai.\n\nHọ đưa tay lên.\n\nTốc — tốc — tốc.\n\nY hệt lần trước. Cùng nhịp, cùng khoảng cách, cùng ba ngón tay giữa chụm lại — như thể ý chí của họ không tồn tại trong khoảnh khắc đó, như thể tay họ biết điều gì mà đầu họ không biết và không thèm hỏi ý kiến. Và lần này tiếng thứ tư đến rõ hơn. Không phải to hơn — chỉ là rõ hơn, đủ để không thể bào chữa bằng chắc nghe nhầm, đủ để cả ba người cùng rút tay về trong một cử chỉ hoàn toàn đồng bộ và ngồi im nhìn mặt bàn đá như thể mặt bàn đá vừa nói điều gì đó bằng ngôn ngữ mà cơ thể họ hiểu nhưng đầu óc họ chưa được phép biết.\n\nHọ ngồi thêm một lúc dưới gốc cây mà không ai lấy sách vở ra nữa. Trời tối dần, và trong bóng tối đang dày lên đó cái cây cổ thụ trở nên khác đi — không đáng sợ, chỉ là khác, theo cái nghĩa của thứ ban ngày trông như một thứ và ban đêm trông như một thứ hoàn toàn khác mà bạn không thể chỉ ra điều gì đã thay đổi.\n\nRyou kéo cái đuôi lên, ôm vào lòng — một cử chỉ nhỏ, riêng tư, kiểu cử chỉ người ta hay làm một mình. Cô không nghĩ cậu nhận ra mình đang làm vậy. Cậu nhìn lên tán cây, những cành tối sẫm in lên nền trời đang đổi màu, và khi cậu lên tiếng thì giọng cậu không còn cái chắc chắn quen thuộc của người biết mình đang đứng ở đâu.\n\nCác mày có bao giờ cảm thấy như mình biết điều gì đó mà mình không nhớ học từ bao giờ không?\n\nSena nhìn sang cậu nhưng không vội trả lời. Cô để câu hỏi đó nằm trong không khí một lúc, vì cô biết câu hỏi này không cần trả lời nhanh.\n\nCái nhịp tay đó..!\n\n Ryou tiếp tục, chậm hơn, như thể cậu đang tìm từ ngữ cho điều mình chưa bao giờ phải diễn đạt thành lời. \n\nTao không biết nó từ đâu. Nhưng lúc tay tao làm, nó không có cảm giác là lần đầu tiên.\n\n Cậu nhìn xuống bàn tay mình, lật ngửa ra, nhìn vào lòng bàn tay như thể câu trả lời đang nằm ở đó. \n\nNó có cảm giác như là...\n\nNhư nhớ lại…   – Koto nói khẽ, thay cậu.\n\nRyou ngẩng lên nhìn Koto. Giữa hai người trao đổi điều gì đó không có lời — cái bất ngờ nhỏ khi nhận ra mình không đơn độc trong một điều mình tưởng chỉ có mình cảm thấy.\n\nỪ!!  – cậu nói. \n\nĐúng cái đó.\n\nSena nhìn xuống lòng bàn tay mình. Trên đó có ba đường mờ đỏ nhạt từ mặt đá lạnh — ba đường, đúng ba, không hơn không kém. Cô nhìn vào đó và nghĩ rằng cái lạnh đang trên tay cô không phải lạnh của đá. Nó là lạnh của thứ gì đó đã chạm vào rồi rút đi, để lại dấu vết không phải bằng nhiệt độ mà bằng sự vắng mặt của ấm áp.\n\nNhư nhớ lại.\n\nCô lặp lại câu đó trong đầu, không nói ra thành lời. Và thứ lạ lẫm nhất không phải là câu hỏi cái nhịp đó đến từ đâu — mà là câu hỏi tại sao, khi tay cô làm điều đó, có một phần rất nhỏ trong cô cảm thấy đúng. Không phải đúng như giải được một bài toán khó. Mà đúng theo cái nghĩa sâu hơn, cũ hơn — như người đi xa lâu ngày đặt chân về nhà và nhận ra mình vẫn còn nhớ bậc thang nào kêu.\n\nGió thổi qua tán cây, một tiếng xào xạc dài rồi tắt đột ngột như thể có ai đó vừa đặt tay lên miệng nó. Và trong cái khoảng lặng sau tiếng xào xạc đó — trong cái khoảng lặng không hoàn toàn là lặng — có một âm thanh rất nhỏ vẫn còn vang trong không khí.\n\nTốc.\n\nMột tiếng. Một mình. Không có tay nào gõ.\n\nCả ba người nghe thấy nó. Cả ba người không nói ra.\n\nHọ thu dọn sách vở, đứng dậy, và đi về ba hướng ký túc xá của họ mà không hẹn nhau hôm sau sẽ gặp lại. Nhưng cả ba đều biết rằng họ sẽ gặp lại — không phải vì họ muốn, không phải vì họ hẹn, mà vì có điều gì đó đã bắt đầu dưới gốc cây cổ thụ đó vào buổi chiều hôm đó, điều gì đó không hỏi ý kiến họ trước khi bắt đầu.\n\nVà những thứ không hỏi ý kiến bạn trước khi bắt đầu, thường cũng không hỏi ý kiến bạn trước khi kết thúc.\n\nĐêm đó Sena nằm trên giường nhìn lên trần phòng tối, và lần đầu tiên từ khi đến Aesvorn cô không nghĩ về hành lang tầng bốn hay cái đồng hồ quả lắc hay cậu sinh viên áo trắng không có trong danh sách. Cô chỉ nghĩ về tiếng gõ. Về cái cảm giác vừa đau vừa nhẹ nhõm — theo cái cách của những thứ mâu thuẫn nhau nhưng vẫn cùng tồn tại — rằng cái nhịp đó không xa lạ.\n\nRằng có điều gì đó trong cô đã biết nó từ trước. Rằng điều đó không đáng sợ. Và cái không đáng sợ đó, kỳ lạ thay, lại là thứ đáng sợ nhất trong tất cả.",
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
        content: "Thư viện cũ của Aesvorn không nằm trên bản đồ chính thức của học viện.\n\nKhông phải vì người ta quên vẽ nó vào — mà vì trong phiên bản bản đồ mới nhất được in và phát cho sinh viên năm nhất, cái khu vực mà thư viện cũ tọa lạc chỉ là một hình chữ nhật trống, không nhãn, không ghi chú, như thể người vẽ bản đồ đã quyết định rằng đặt tên cho nó là không cần thiết. Hoặc không nên.\n\nRyou tìm ra lối vào từ một tờ giấy nhàu nát ai đó bỏ quên trong ngăn bàn phòng học — không phải bản đồ, chỉ là một mảnh giấy xé tay có vẽ nguệch ngoạc một cái mũi tên và dòng chữ sau tủ sách cuối hành lang B, đẩy sang phải. Không có tên người viết. Không có ngày tháng. Mực đã nhạt màu đủ để biết tờ giấy đó không phải của hôm qua hay tuần trước.\n\nCậu đưa nó cho Sena và Koto xem vào buổi tối, dưới ánh đèn vàng ệch của căng tin gần đóng cửa. Sena đọc xong, đặt tờ giấy xuống, nhìn Ryou.\n\n\"Đây rõ ràng là bẫy,\" cô nói.\n\n\"Hoặc là thông tin hữu ích,\" Ryou nói.\n\n\"Hai thứ đó không loại trừ nhau.\"\n\n\"Chính xác. Vậy mình vào không?\"\n\nKoto không nhìn lên khỏi tờ giấy trong suốt cuộc trao đổi đó. Cậu đọc nó chậm, theo cái cách của người đang đọc nhiều hơn những gì được viết ra — đọc cả giấy, đọc cả mực, đọc cả lý do tại sao thứ này xuất hiện đúng lúc này trong tay họ. Rồi cậu gấp tờ giấy lại, đẩy trả về phía Ryou.\n\n\"Thứ Tư,\" cậu nói. \"Sau mười giờ đêm. Hành lang B vắng nhất vào lúc đó.\"\n\nSena nhìn cậu một giây.\n\n\"Tao không hỏi lúc nào.\"\n\n\"Tao biết mày hỏi gì,\" Koto nói. \"Và tao vừa trả lời.\"\n\nHành lang B của Aesvorn vào sau mười giờ đêm trông như một phiên bản khác của chính nó — cùng những bức tường đá, cùng những cánh cửa gỗ tối màu, nhưng không có ánh đèn vàng ệch mà ban ngày cô quen nhìn. Chỉ có những bóng đèn sự cố màu xanh lạnh treo cách nhau mười mét, tạo ra thứ ánh sáng không đủ để nhìn rõ mặt người đứng cạnh mình nhưng đủ để thấy bóng của họ đổ dài và méo mó theo những góc không hoàn toàn đúng với vị trí nguồn sáng. Tiếng bước chân của ba người vang trên nền gạch theo cái cách mà ban ngày không bao giờ xảy ra — như thể ban đêm hành lang này sâu hơn, rộng hơn, có nhiều không gian hơn để âm thanh di chuyển trước khi tắt đi.\n\nTủ sách cuối hành lang B là một cái tủ gỗ cao đến trần nhà, đen sẫm, hai cánh cửa kính mờ chứa những cuốn sách mà Sena không nhìn rõ tên. Cô đặt tay lên mép tủ, nhìn sang Ryou. Ryou gật đầu. Cô đẩy sang phải.\n\nTủ sách trượt đi êm hơn cô tưởng — không phải tiếng cọ xát khó nhọc của thứ không được di chuyển từ lâu, mà là tiếng trượt nhẹ gần như im lặng, như thể cái tủ đã được bôi trơn định kỳ bởi ai đó không muốn người khác biết họ đang làm điều đó. Phía sau là một cánh cửa thấp, không có tay nắm, chỉ có một khe hở nhỏ ở mép dưới mà ánh sáng xanh lạnh từ hành lang lọt vào thành một vệt mỏng trên sàn bên trong.\n\n\"Sau tao,\" Koto nói, và cúi người bước qua trước khi ai kịp phản đối.\n\nThư viện cũ tối hơn cô tưởng.\n\nKhông phải tối hoàn toàn — có ánh sáng từ những ô cửa sổ nhỏ gần trần nhà, loại ánh sáng của đêm nhiều mây khi trăng không đủ sức xuyên qua nhưng bầu trời cũng không hoàn toàn tối. Ánh sáng đó đủ để thấy những dãy kệ sách cao đến trần, xếp thành hàng dày đặc như rừng cây, những cuốn sách cũ kỹ chen nhau với gáy sách ngả vàng hoặc đen sẫm, một số tựa sách đã mờ đến mức không đọc được, một số khác được viết bằng ngôn ngữ mà Sena không nhận ra. Không khí trong phòng này khác với phần còn lại của Aesvorn — không phải lạnh hơn, mà là nặng hơn, theo cái nghĩa của không khí chứa quá nhiều thứ đã xảy ra trong đó và chưa tìm được chỗ thoát ra.\n\nRyou bật đèn pin điện thoại, quét một vòng quanh phòng. Ánh sáng di chuyển qua những dãy kệ, qua một cái bàn đọc sách cũ ở giữa phòng với một chiếc ghế bị lật nghiêng như thể người ngồi đó đã đứng dậy rất vội, qua một góc tường có vết ố đen loang ra theo hình dạng không đều như bóng của thứ gì đó đã cháy ở đó từ lâu và để lại dấu vết. Ở góc xa nhất của phòng, nơi ánh đèn pin không chạm tới, bóng tối dày đặc theo cái cách khiến Sena không chắc có thứ gì đang đứng trong đó hay không — và không chắc mình có muốn biết không.\n\n\"Ấm cúng ghê,\" Ryou nói khẽ.\n\n\"Suỵt,\" Sena nói.\n\n\"Tao nói nhỏ rồi.\"\n\n\"Nhỏ hơn nữa đi.\"\n\nKoto không nói gì. Cậu đứng giữa phòng, ăng-ten dựng thẳng, nhìn chậm rãi từ dãy kệ này sang dãy kệ khác theo cái cách của người đang lắng nghe bằng mắt. Bàn tay cậu buông thẳng xuống hai bên, nhưng các ngón tay hơi cong lại — phản xạ không có ý thức của người đang sẵn sàng cho điều gì đó mà chính họ cũng không biết là gì.\n\n\"Không có ai ở đây,\" cậu nói sau một lúc. \"Nhưng có người đã ở đây gần đây.\"\n\nRyou chiếu đèn pin xuống sàn theo hướng tay cậu chỉ. Trên lớp bụi dày phủ nền gạch, có những vết chân — không nhiều, không thành đường đi rõ ràng, chỉ là một vài vết rải rác như thể người đó đã dừng lại nhiều lần ở những chỗ khác nhau mà không có lộ trình cụ thể. Vết chân không tươi, nhưng cũng không đủ cũ để xác định là của tuần trước hay tháng trước.\n\nSena nhìn những vết chân đó một lúc rồi ngẩng lên, và đó là lúc cô để ý đến góc phải của phòng.\n\nỞ đó, dưới một cái kệ thấp nhất, bị kẹp giữa hai cuốn sách dày như thể ai đó cất vội vào và không muốn nó bị nhìn thấy ngay lần đầu, là một cuốn sổ tay.\n\nKhông to. Bìa da màu nâu sẫm, mép bìa sờn, gáy sổ có một sợi chỉ đỏ cũ buộc quanh hai vòng. Không có tên trên bìa. Không có gì trên bìa cả — chỉ là da và thời gian và cái sờn mòn của thứ đã được cầm lên và đặt xuống quá nhiều lần.\n\nSena đứng nhìn cuốn sổ một lúc mà không chạm vào. Có điều gì đó trong cách nó nằm ở đó — không phải bị quên, mà như thể đang đợi — khiến cô không muốn vội.\n\n\"Ryou,\" cô gọi khẽ.\n\n\"Gì?\"\n\n\"Lại đây.\"\n\nBa người đứng trước cuốn sổ. Ryou chiếu đèn pin thẳng vào nó, và trong ánh sáng đó cái bìa da nâu sẫm trông gần như đen.\n\n\"Mở ra đi,\" Ryou nói.\n\n\"Mày mở đi,\" Sena nói.\n\n\"Mày tìm thấy.\"\n\n\"Đó không phải logic.\"\n\nKoto cúi xuống và nhặt cuốn sổ lên — Sena để ý thấy cậu làm điều đó nhẹ nhàng, theo cái cách người ta nhặt thứ gì đó mà họ chưa biết có dễ vỡ không. Cậu tháo sợi chỉ đỏ ra. Sợi chỉ đứt ở giữa — không phải do cậu kéo, mà tự đứt, theo cái cách của thứ đã giữ quá lâu và không còn đủ sức giữ thêm nữa. Cậu mở bìa.\n\nNhững trang đầu trống. Không phải giấy trắng mà là trống theo nghĩa từng có chữ nhưng chữ đã mờ đi đến mức không còn đọc được, chỉ để lại những vệt mờ nhạt trên giấy ố vàng như dấu tích của lời nói đã bị nuốt trở lại. Koto lật qua những trang đó chậm rãi — một trang, hai trang, ba trang, tất cả đều vậy.\n\nRồi đến trang thứ tư.\n\nBa chữ, viết to, mực đen đậm hơn hẳn tất cả những gì đã từng ở những trang trước — đậm theo cái cách của người viết bằng tay run, không phải vì yếu ớt mà vì đang cố ép từng nét chữ xuống trang giấy như thể sợ chúng sẽ biến mất nếu không giữ đủ chặt:\n\nVẾT NỨT HƯ KHÔNG\n\nVà bên dưới, một bản vẽ nguệch ngoạc bằng bút chì — không phải bản vẽ kỹ thuật hay sơ đồ có chủ ý, mà là kiểu vẽ của người đang cố ghi lại điều mình nhìn thấy trước khi nó biến mất, tay di chuyển nhanh hơn mắt có thể theo kịp. Một đường nứt hình zích zắc ở giữa trang, xung quanh là những hình tròn nhỏ kết nối với nhau bằng những đường mảnh. Và ở góc dưới phải — nhỏ đến mức phải nhìn thật gần mới thấy — là ba chấm tròn nhỏ nằm sát nhau, được khoanh tròn bằng một vòng mờ nhạt như thể người vẽ đã do dự trước khi quyết định vẽ vòng đó.\n\nBa chấm.\n\nSena nhìn vào bản vẽ và cảm thấy điều gì đó lạnh chạm qua gáy cô — không phải từ không khí, mà từ bên trong, từ chỗ không có nhiệt độ.\n\n\"Cái này là gì?\" Ryou nói khẽ.\n\nKhông ai trả lời.\n\nRồi nó xảy ra.\n\nKhông có cảnh báo. Không có âm thanh lạ hay ánh sáng nhấp nháy. Nó chỉ xảy ra — đột ngột và im lặng và toàn diện đến mức Sena không có thời gian để sợ trước khi nó đã ở đó rồi.\n\nMọi thứ lệch.\n\nKhông phải lệch theo nghĩa di chuyển — mọi thứ vẫn ở đúng chỗ cũ, những dãy kệ, cái bàn đọc sách, ánh đèn pin của Ryou. Nhưng tất cả những thứ đó lệch đi nửa nhịp so với cái cách chúng nên tồn tại, theo cái nghĩa không thể giải thích bằng từ ngữ thông thường nhưng cơ thể cô hiểu ngay lập tức và phản ứng lại bằng cách làm cô buồn nôn. Không phải buồn nôn của người say xe — mà là buồn nôn của người mà không gian xung quanh đột nhiên không còn đồng ý với sự tồn tại của họ nữa. Như thể thế giới vừa lùi ra một bước và nhìn cô theo cách mà nó chưa bao giờ nhìn trước đó.\n\nCô đặt tay lên kệ sách gần nhất để giữ thăng bằng.\n\n\"Sena.\" Giọng Koto. Thấp, cảnh giác.\n\n\"Tao ổn,\" cô nói, dù không chắc điều đó có đúng không.\n\n\"Mày không ổn,\" cậu nói. \"Mày đang xanh mặt.\"\n\nRyou quay đèn pin sang cô. Trong ánh sáng đó cô thấy cả hai người nhìn mình — Ryou với cái chú ý căng thẳng của người không biết mối đe dọa đến từ đâu và không thể đánh nó, Koto với cái im lặng đang đọc đang đo đang tính toán mà cô đã bắt đầu học cách nhận ra.\n\nRồi cô quay lại nhìn những dãy kệ, và thứ lạnh ở gáy cô trở lại, lần này không đi qua mà ở lại.\n\nNhững cuốn sách trên kệ trước mặt cô không ở chỗ cũ.\n\nKhông phải tất cả. Chỉ một vài cuốn — đủ để cô chắc chắn rằng mình không nhớ nhầm, vì cô đã nhìn vào cái kệ đó khi mới vào phòng và ghi nhớ màu sắc của những gáy sách theo thói quen vô thức. Cuốn sách đỏ sẫm bây giờ ở vị trí thứ ba từ trái, trong khi trước đó nó ở vị trí thứ sáu. Cuốn sách đen không có gáy đang nằm ngang trên đầu những cuốn khác, trong khi trước đó nó đứng thẳng.\n\nCô không quay lưng đi lần nào từ khi bước vào phòng này.\n\n\"Kệ sách,\" cô nói, giọng không hoàn toàn bằng phẳng.\n\nRyou quay đèn pin sang. Một giây im lặng — cái im lặng của người đang nhìn thấy thứ mình không muốn nhìn thấy và chưa tìm được từ ngữ để phủ nhận nó.\n\n\"Tao không nhớ nó như vậy,\" cậu nói chậm.\n\n\"Vì nó không như vậy,\" cô nói. \"Trước đó.\"\n\nNhiệt độ trong phòng giảm.\n\nKhông từ từ như khi gió thổi qua cửa sổ mở — mà đột ngột, như thể ai đó vừa rút đi thứ đã giữ ấm không khí ở đây cho đến lúc này. Hơi thở của cô bắt đầu tạo ra khói trắng nhỏ trong ánh đèn pin. Cô nhìn xuống tay mình — ngón tay cô lạnh theo cái nghĩa của thứ gì đó đang lấy đi nhiệt độ từ bên trong ra ngoài thay vì từ ngoài vào trong.\n\nKoto vẫn đang cầm cuốn sổ. Cậu đứng im, không nhìn kệ sách, không nhìn Sena hay Ryou — cậu nhìn thẳng vào khoảng không giữa các dãy kệ, nơi bóng tối dày nhất. Ăng-ten cậu dựng thẳng cứng đến mức Sena gần như nghe thấy sự cảnh giác trong đó.\n\nRồi từ phía cuối phòng, từ chỗ tối nhất nơi ánh đèn pin không chạm tới — một âm thanh.\n\nKhông phải tiếng động to. Chỉ là tiếng giấy. Tiếng của một trang sách tự lật, chậm rãi, trong một căn phòng không có gió. Một trang. Dừng. Rồi một trang nữa.\n\nSena buông tay khỏi kệ sách.\n\n\"Ra ngoài,\" cô nói.\n\nKhông ai phản đối lần này.\n\nHọ chạy.\n\nKhông phải chạy hoảng loạn mất phương hướng — chạy theo hướng cánh cửa thấp vì cơ thể nhớ đường ra tốt hơn mọi lúc khi người ta sợ. Koto ra trước, Sena theo sau, Ryou đi cuối và xoay người lại một lần — chỉ một lần — nhìn về phía cuối phòng trước khi cúi người chui qua cửa.\n\nCậu không nói mình thấy gì. Cả Sena lẫn Koto không hỏi.\n\nTủ sách trượt trở lại vị trí cũ sau khi họ qua, êm ái và thuần thục như lúc đến — như thể cái tủ đã làm việc này nhiều lần hơn ba người họ biết.\n\nHọ đứng trong hành lang B dưới ánh đèn xanh lạnh, thở. Không ai nói gì trong một lúc. Tiếng thở của họ tạo ra khói trắng mờ trong không khí — nhiệt độ hành lang không đủ lạnh để làm vậy, nhưng họ vẫn thấy hơi thở của mình. Không ai đủ bình tĩnh để chỉ ra sự mâu thuẫn đó.\n\nRyou là người nói trước, giọng cậu bình thản theo cái cách của người đang dùng hết sức để giữ bình thản.\n\n\"Tao vote là chúng ta không bao giờ vào đó nữa.\"\n\n\"Đồng ý,\" Sena nói ngay.\n\nKoto không trả lời. Cậu đang nhìn xuống bàn tay mình — cuốn sổ vẫn còn ở đó, cậu đã giữ nó trong suốt lúc chạy ra mà không ai để ý, kể cả cậu.\n\n\"Tao mang nó ra rồi,\" cậu nói, giọng không rõ là thông báo hay xin lỗi.\n\nSena nhìn cuốn sổ trong tay cậu. Dưới ánh đèn xanh lạnh, cái bìa da nâu sẫm trông khác hơn trong phòng thư viện — nâu của đất ẩm, của rễ cây, của thứ gì đó đã ở dưới đất lâu rồi được đào lên. Sợi chỉ đỏ bị đứt vẫn còn quấn lỏng quanh cổ tay cậu hai vòng như thể cậu không biết nó ở đó.\n\n\"Cất đi,\" cô nói. \"Không phải bỏ lại. Cất đi.\"\n\nKoto nhìn cô một giây, rồi bỏ cuốn sổ vào túi áo khoác.\n\nHọ đi về trong im lặng, bước chân nặng hơn lúc đến. Gần đến chỗ rẽ về ký túc xá, Ryou dừng lại đột ngột. Sena và Koto đi thêm một bước rồi dừng, quay nhìn cậu.\n\nCậu đang nhìn xuống tay mình theo cái cách mà Sena nhận ra ngay — không phải nhìn tay, mà nhìn những gì tay mình vừa làm.\n\n\"Lúc mình chạy ra,\" cậu nói chậm, giọng cậu có một thứ gì đó mà Sena chưa nghe thấy ở cậu trước đây — không phải sợ hãi, mà gần với điều đó hơn bất kỳ thứ gì khác. \"Lúc cánh cửa kẹt và tao phải đẩy mạnh hơn, tao gõ vào tường ba lần để tính lực.\"\n\nSena nhìn cậu, cảm thấy một thứ gì đó trong ngực mình bắt đầu chìm xuống.\n\n\"Và?\" cô nói, dù cô đã biết câu trả lời.\n\nRyou ngẩng đầu lên, nhìn cô, rồi nhìn Koto.\n\n\"Và nhịp đó,\" cậu nói, \"là nhịp đó.\"\n\nKhoảnh khắc đó kéo dài đủ lâu để Sena cảm thấy cái gì đó trong ngực mình thắt lại. Không phải sợ hãi — mà thứ gì đó gần hơn với nỗi buồn. Cái nỗi buồn mơ hồ của người nhận ra rằng điều đang xảy ra với mình lớn hơn mình, bắt đầu trước mình, và có thể sẽ không kết thúc theo cách mình muốn.\n\nBa người đứng dưới hành lang lạnh, ánh đèn xanh trên mặt họ, hơi thở tạo khói trong không khí — và không ai trong số họ nói được điều mình đang thực sự nghĩ. Rằng nhịp tay đó đang theo họ. Rằng nó đã ở đó trước khi họ biết đến nó. Rằng có lẽ — và đây là điều đáng sợ nhất — nó sẽ vẫn còn ở đó sau khi tất cả những thứ khác đã kết thúc.\n\n\"Chúng ta không được chọn cái nhịp đó,\" Sena nói khẽ, không hẳn nói với ai. \"Phải không.\"\n\nKhông ai trả lời.\n\nTrong túi áo khoác của Koto, cuốn sổ da nâu nằm im lặng — và trên trang thứ tư của nó, ba chấm tròn nhỏ nằm sát nhau trong vòng tròn mờ nhạt, kiên nhẫn theo cái cách của thứ đã đợi từ rất lâu trước khi ba người này bước vào học viện, và sẽ vẫn còn ở đó rất lâu sau khi đêm nay kết thúc.",
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
        content: "Thứ duy nhất không thể bị xóa — dù người ta đã cố, dù người ta đã gần thành công, dù có những khoảnh khắc mà chính ba người trong câu chuyện này cũng không còn nhớ tại sao mình phải giữ lấy nữa.\n\nThứ còn lại không có tên. Chỉ có nhịp. Và nhịp thì không cần ai nhớ để tiếp tục vang.\n\nKhi bình minh đầu tiên sau ngày trăng tròn chiếu qua những khung cửa sổ dài của Học viện Aesvorn, những bức tường đá xám dày dặn vẫn đứng đó, im lặng và kiên nhẫn. Nhưng sâu bên dưới nền móng, nơi vết nứt hư không từng bị che đậy suốt hàng trăm năm, một âm thanh rất khẽ vẫn đang truyền qua các thớ đá.\n\nTốc — tốc — tốc.\n\nVà từ khoảng không giữa những người còn đang sống, tiếng thứ tư vẫn đáp lại. Bình thản, vững chãi, như lời khẳng định rằng dù danh sách có bị xóa đi, dù cuốn sổ có mục nát, thì những gì đã xảy ra... vẫn vĩnh viễn đã xảy ra.",
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

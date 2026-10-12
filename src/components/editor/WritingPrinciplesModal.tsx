import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Check, 
  Copy, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface WritingPrinciplesModalProps {
  onClose: () => void;
}

const PRINCIPLES_TEXT = `# NGUYÊN TẮC VIẾT TIỂU THUYẾT: LONG ẤN KÝ (MẠCH ENGINE)

I. TRIẾT LÝ VÀ CHỦ ĐỀ TRUNG TÂM
1. Thứ đáng sợ hơn cái chết:
   - "Có một thứ mà con người sợ hơn cái chết: bị quên khi vẫn còn đang sống."
   - Bị xóa khỏi ký ức của người khác từng ngày một, từng mảnh một, cho đến khi không còn ai nhớ mình từng cười thế nào, từng có thói quen gì.
   - Ký ức không phải tài sản hay gánh nặng, mà là bằng chứng duy nhất xác nhận một người đã từng tồn tại.

2. Bản chất của Không gian và Ký ức:
   - Ký ức không nằm trong vật chất (tường, đá, gỗ), mà nằm trong khoảng không gian giữa chúng: trong khoảng cách giữa hai bức tường, chiều cao trần nhà, cách ánh sáng đổ bóng vào buổi chiều.
   - Những nơi có quá nhiều ký ức bị xóa đi cùng lúc sẽ trở nên "lệch" (glitch). Không phải ma ám, mà như một căn phòng bị xê dịch đồ đạc vài centimet — đủ để cơ thể nhận biết có gì đó không đúng.
   - Câu cửa miệng nguy hiểm nhất tại Học viện Aesvorn: "Tòa nhà cũ mà", "Chắc nhìn nhầm", "Bình thường thôi" — đó là câu trả lời người ta đưa ra khi không muốn hoặc sợ phải nghĩ tiếp.

II. VĂN PHONG VÀ TIẾT TẤU (PROSE & PACING)
1. Giọng văn trần thuật:
   - Điềm tĩnh, hơi lạnh, giàu chất suy tư triết lý và hiện sinh, tuyệt đối không dùng từ ngữ sáo rỗng, khoa trương kiểu truyện kiếm hiệp rẻ tiền.
   - Nhịp điệu câu văn chậm rãi, có độ ngắt nghỉ và khoảng lặng. Để sự bất an len lỏi vào tâm trí người đọc qua những chi tiết sai lệch rất nhỏ thay vì đao to búa lớn.
   - Câu văn sắc sảo, dùng phép so sánh độc đáo gắn liền với xúc giác: "như nước chảy trên kính", "mùi đất ẩm của thứ chưa sẵn sàng nằm yên", "như bước hụt một bậc thang thấp hơn dự kiến".

2. Giác quan và Chi tiết bối cảnh:
   - Mọi phân đoạn phải neo vào giác quan cụ thể:
     + Ánh sáng: Vệt nắng vàng hẹp của buổi chiều muộn, bóng đổ về hai hướng không khớp nguồn sáng, đèn sự cố xanh lạnh trong hành lang đêm.
     + Nhiệt độ: Luồng lạnh buốt ở gáy, nhiệt độ phòng tụt đột ngột khiến hơi thở tạo khói trắng dù không phải mùa đông.
     + Mùi hương: Mùi đất ẩm sau mưa, mùi giấy mục, mùi dầu thông cổ thụ, mùi sách cũ để quên trong ngăn kéo.
     + Âm thanh: Tiếng tích-tắc đều đặn nhưng đếm thứ không phải thời gian của đồng hồ quả lắc; tiếng sột soạt kéo tay dọc tường ở cuối hành lang tối.

3. Đối thoại và Nhịp điệu tương tác:
   - Lời thoại sắc bén, tự nhiên, mang phong thái học thuật kết hợp đời thường.
   - Đan xen các yếu tố hài hước nhẹ nhàng (chuyện bánh mì kẹp trứng của Ryou, tranh luận về xấp xỉ toán học, phản xạ ăng-ten của Koto) để tạo sự tương phản sâu sắc với sự ngột ngạt, bí hiểm của thế giới ngầm Aesvorn.

III. HỒ SƠ TÂM LÝ VÀ HÀNH VI ĐẶC TRƯNG CỦA NHÂN VẬT
1. SENA:
   - Sinh viên năm nhất đến Aesvorn tháng Chín, dáng người nhỏ nhắn nhưng ánh mắt quan sát kiên định, tóc đen.
   - Thói quen viết nhật ký vào ban đêm từ năm 12 tuổi để neo giữ những ngày đã qua không bị trôi mất.
   - Không chấp nhận những câu trả lời lấp liếm ("Tòa nhà cũ mà"). Khi đối mặt với nguy hiểm, cô giữ được sự tỉnh táo lạnh lùng để ra quyết định ("Ra ngoài!").

2. KOTO:
   - Người Namec da xanh lục nhạt, đôi mắt màu tím xám, có đôi ăng-ten nhỏ ở hai bên thái dương.
   - Ngôn ngữ cơ thể:
     + Khi tập trung suy nghĩ hoặc đọc tài liệu: Ăng-ten cụp xuống theo góc quen thuộc.
     + Khi cảnh giác cao độ hoặc phát hiện nguy hiểm: Ăng-ten dựng thẳng cứng đờ.
   - Tính cách & Giọng điệu: Ít nói, quan sát cực kỳ chi tiết (để ý sinh viên áo trắng có 2 bóng, đồng hồ chạy nhanh 5 phút). Khi nói thì đặt từng chữ cẩn trọng như bước trên băng mỏng. Cậu là người nhặt cuốn sổ da nâu có sợi chỉ đỏ từ thư viện cũ.

3. RYOU:
   - Dáng vẻ không nổi bật một cách hoàn hảo; có chiếc đuôi màu nâu sẫm quấn quanh hông.
   - Ngôn ngữ cơ thể:
     + Siết chặt đuôi quanh hông khi ở chỗ đông người (phòng vệ tự nhiên).
     + Khẽ thả lỏng hoặc vẫy nhẹ đuôi khi ở bên bạn bè hoặc cảm thấy an toàn.
     + Thường gõ đầu ngón tay nhịp lên mặt bàn khi đầu óc đang xử lý thông tin.
   - Tính cách: Thẳng thắn, thực tế, thích nói thẳng thắn ("cuộc đời có ý nghĩa trở lại nhờ bánh mì kẹp trứng"), nhưng lại là người đầu tiên cảm nhận được cái nhịp tay vô thức khi đẩy cửa chạy trốn.

IV. CÁC MOTIF VÀ QUY TẮC THẾ GIỚI CẤM PHÁ VỠ
1. Nhịp Ba Tiếng Gõ (Tốc — tốc — tốc):
   - Cử chỉ: Ba ngón tay giữa chụm lại, gõ xuống mặt bàn đá hoặc vật cản ba lần với khoảng cách nhịp điệu hoàn toàn đồng bộ.
   - Tiếng thứ tư vô hình: Luôn có một tiếng gõ thứ tư (Tốc) xuất hiện từ khoảng trống vô hình giữa các nhân vật — không thuộc về bất kỳ ai trong ba người.
   - Bản chất: Đây không phải hành động ngẫu nhiên, mà là "nhớ lại" một quy thức cổ xưa đã ăn sâu vào tiềm thức.

2. Cuốn Sổ Da Bìa Nâu & Sợi Chỉ Đỏ:
   - Bìa da sờn mòn, màu nâu của đất ẩm/rễ cây. Gáy sổ quấn sợi chỉ đỏ cũ (khi tháo ra sợi chỉ tự đứt và quấn quanh cổ tay Koto).
   - Ba trang đầu từng có chữ nhưng đã mờ hẳn. Trang thứ tư ghi 3 chữ to bằng mực đen đậm run rẩy: "VẾT NỨT HƯ KHÔNG".
   - Kèm bản vẽ zích zắc và BA CHẤM TRÒN nhỏ nằm sát nhau được khoanh tròn bằng vòng mờ nhạt ở góc dưới phải.

3. Kẻ Không Tồn Tại (Sinh viên áo trắng):
   - Sinh viên áo sơ mi trắng bạc màu ở cổ, khi Brell điểm danh thì cả giảng đường không ai nghe rõ tên.
   - Khi đứng lên ngồi xuống, bóng của cậu ta tách làm HAI BÓNG đổ về hai hướng khác nhau. Sau đó biến mất không để lại dấu vết và không ai nhớ nổi gương mặt.

4. Nguyên tắc Rào Chắn Tri Thức (Knowledge Partitioning):
   - AI khi viết tiếp hoặc nhập vai nhân vật TUYỆT ĐỐI KHÔNG ĐƯỢC để nhân vật biết trước chân tướng toàn bộ bí mật khi chưa tìm thấy chứng cứ.`;

export const WritingPrinciplesModal: React.FC<WritingPrinciplesModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PRINCIPLES_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-925 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
                Nguyên Tắc Viết Tiểu Thuyết (Long Ấn Ký)
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-sans">
                  AI Context Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Toàn bộ các nguyên tắc này được tự động tích hợp vào gói ngữ cảnh để AI luôn tuân thủ đúng giọng văn và motif.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-950 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30">
          {PRINCIPLES_TEXT}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-925 flex items-center justify-between text-xs select-none">
          <div className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Đã đồng bộ với file nguyên tắc viết.txt và AI Prompt Engine</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

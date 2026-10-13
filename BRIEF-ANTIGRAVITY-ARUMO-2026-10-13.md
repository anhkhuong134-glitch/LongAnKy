# Prompt giao cho Antigravity: Arumo trong nắng sớm

Hãy thực hiện thiết kế lại website đọc truyện trong dự án hiện có theo bản đặc tả dưới đây. Đây là hướng thiết kế đã được chọn; hãy triển khai thành giao diện hoạt động, không chỉ trả lại ý tưởng hoặc một danh sách gợi ý.

## 1. Dự án, mục tiêu và phạm vi

- Thư mục dự án: `C:\Users\anhkh\OneDrive\Desktop\nghịch`.
- Website hiện tại: https://thuctinhlongan.vercel.app/.
- Tên đang hiển thị trên website: **Long Ấn Thức Tỉnh**. Giữ cách viết này thống nhất trong đợt thiết kế; không tự đổi tên bộ truyện. Tài liệu phát triển nội bộ còn có tên Long Ấn Ký.
- Nền hiện có: React 18, TypeScript, Vite 6, Tailwind CSS 3 và CSS thường. Giữ nền này, không chuyển sang Next.js, không tạo một dự án thay thế.
- Đây là website của **một bộ truyện**, có truyện chữ, nhân vật, thế giới và bản truyện tranh đang phát triển.
- Mục tiêu: người mới hiểu mình đang bước vào câu chuyện nào và bắt đầu đọc ngay; người quay lại tìm lại đúng chỗ; người đọc cảm thấy giao diện sáng, thơ mộng, có cá tính chibi và vẫn đọc thoải mái những chương dài.
- Phạm vi cập nhật: thiết kế lại phần độc giả, tích hợp đủ thư viện 21 ảnh và trang hồ sơ nhân vật, đồng thời hoàn thiện hệ thống quản trị với đăng nhập admin và các luồng quản lý tại mục 19–21. Giữ nguyên văn chương, tên nhân vật, thứ tự đoạn, lời thoại và dữ liệu người dùng. Không viết lại nội dung tiểu thuyết trong khi sửa UI.
- Tạo bản xem trước tại máy và bàn giao kết quả cụ thể. Chỉ đưa bản mới lên website công khai khi chủ dự án yêu cầu xuất bản.

## 2. Hướng mỹ thuật đã chốt

Tên concept: **Arumo trong nắng sớm**.

Hình dung một quyển truyện minh họa đang mở ở ngôi làng ven sông: giấy sáng, ánh nắng nhẹ, mái nhà thấp, cầu gỗ, dây phơi, cây bên cửa sổ và dòng sông lơ lửng trên những tầng mây. Người đọc gặp các nhân vật chibi có nghề nghiệp, quần áo và vật dụng riêng.

Ba lớp thị giác:

1. **Thế giới:** cảnh làng và sông trời tạo dấu ấn ở đầu trang chủ.
2. **Nhân vật:** ảnh chibi nguyên bản làm người dẫn vào câu chuyện, xuất hiện ở trang chủ và hồ sơ.
3. **Trang sách:** nền sáng yên tĩnh, chữ rõ, ít chi tiết ở màn hình đọc.

Chất Gen Z nằm ở một vài dòng phụ thân thiện, sticker nhỏ và phản hồi khi bấm. Nội dung truyện có bi kịch và bí ẩn; các cảnh nghiêm túc phải giữ được cảm xúc đó.

Quy định hình thức:

- Nền sáng ở tất cả giao diện công khai, gồm header, footer, popup, mục lục, hồ sơ và cài đặt.
- Chibi khoảng 2,5–3 đầu, giữ dấu hiệu tuổi tác và đặc điểm riêng. Người trưởng thành vẫn phải nhận ra là người trưởng thành.
- Nét viền xanh xám mềm, tô màu nhẹ, có chất giấy rất mỏng ở minh họa.
- Đồ họa thể hiện rõ đời sống bến Arumo: dụng cụ sửa máy, cầu cảng, mái nhà, nước và dây thừng.
- Không dùng ảnh người thật, ảnh stock làm nhân vật hoặc tranh truyện; không dùng ảnh Naruto/NRO/NSO.
- Không dùng nền đen, neon, chữ vàng phát sáng, viền phát quang, hạt lấp lánh dày hoặc hiệu ứng toàn màn hình.
- Không thay toàn bộ đồ họa bằng emoji. Icon chức năng dùng bộ `lucide-react` đang có, cùng nét 1,75–2 px.
- Không bọc mọi đoạn nội dung vào một ô bo góc. Mục lục là danh sách, bài đọc là trang sách, nhân vật là thẻ ảnh.

## 3. Hệ màu và chữ: dùng đúng các giá trị này

### Màu

| Tên token | Màu | Dùng cho |
|---|---|---|
| `--page` | `#FFFDF8` | Nền chung, giấy sáng |
| `--surface` | `#FFFFFF` | Popup, biểu mẫu, các mặt phẳng cần tách nền |
| `--ink` | `#293B36` | Chữ chính, tiêu đề |
| `--muted` | `#5F706A` | Ngày cập nhật, chú thích, chữ phụ |
| `--primary` | `#376F64` | Nút chính, liên kết, trạng thái chọn |
| `--primary-hover` | `#2B5A51` | Hover/pressed nút chính |
| `--mint` | `#E4F1E9` | Nền đọc tiếp, nhãn đang đọc |
| `--sky` | `#E5F1F7` | Nền minh họa sông trời |
| `--blush` | `#F8E3E4` | Điểm nhấn sticker hoặc trạng thái nhỏ |
| `--sun` | `#F8EDCB` | Ánh nắng, thẻ giấy nhấn nhẹ |
| `--line` | `#DCE6DF` | Đường phân cách |
| `--error` | `#A33D49` | Lỗi biểu mẫu, đi kèm lời giải thích |

Màu pastel dùng cho nền; chữ đặt trên nền pastel vẫn dùng `--ink` hoặc `--primary`. Nút chính nền xanh đậm, chữ trắng. Chữ thông thường phải đạt tương phản tối thiểu 4,5:1; không dùng chữ xám nhạt để tạo cảm giác thơ mộng.

### Font

- **Nunito:** toàn bộ UI, tên truyện, tiêu đề trang, tên nhân vật; trọng lượng 400, 600, 700, 800.
- **Lora:** nội dung tiểu thuyết; trọng lượng 400, 500 và italic khi văn bản nguồn thực sự có in nghiêng.
- Fallback UI: `system-ui, sans-serif`; fallback truyện: `Georgia, serif`.
- Nạp đúng bộ ký tự tiếng Việt. Kiểm tra các cụm “Thức tỉnh”, “Mùa nước đứng”, “Chương”, “Người dẫn truyện” không bị lỗi dấu hoặc rơi sang font khác.
- Bỏ các font không còn dùng trên giao diện công khai. Không dùng font monospace để đọc truyện.

### Kích thước

| Thành phần | Máy tính | Điện thoại |
|---|---|---|
| Tên truyện ở hero | 56 px / 1,12 / 800 | 36 px / 1,16 / 800 |
| Tiêu đề trang | 36 px / 1,2 / 800 | 28 px / 1,25 / 800 |
| Tiêu đề khu vực | 28 px / 1,3 / 800 | 24 px / 1,3 / 800 |
| Chữ UI | 16 px / 1,55 | 16 px / 1,55 |
| Chữ phụ | 14 px / 1,5 | 14 px / 1,5 |
| Văn truyện mặc định | 20 px / 1,85 | 18 px / 1,85 |

Khoảng cách dùng thang 4, 8, 12, 16, 24, 32, 48, 64, 80 px. Container trang thường tối đa 1.120 px. Lề trang 32 px desktop, 24 px tablet, 20 px mobile; màn 320 px dùng 16 px.

Bo góc: nút/input 12 px; thẻ ảnh 20 px; khung minh họa lớn 28 px. Bóng dùng nhẹ `0 10px 30px rgba(55,111,100,.08)`, chỉ cho phần cần nổi. Không thêm shadow cho từng hàng mục lục.

## 4. Sơ đồ trang và điều hướng

Dùng URL hash để hoạt động trên Vite/Vercel mà không cần thay cấu hình máy chủ. Tạo bộ định tuyến nhỏ, rõ ràng; không thêm một framework mới. URL phải hỗ trợ mở trực tiếp, tải lại, quay lại/tiến tới và chia sẻ chương.

| URL | Trang |
|---|---|
| `/#/` | Trang chủ tác phẩm |
| `/#/muc-luc` | Mục lục phần/chương |
| `/#/doc/:chapterId` | Đọc truyện chữ |
| `/#/nhan-vat` | Danh sách nhân vật công khai |
| `/#/nhan-vat/:characterId` | Hồ sơ một nhân vật |
| `/#/the-gioi` | Địa điểm và thuật ngữ đã được giới thiệu |
| `/#/truyen-tranh` | Trang bản chuyển thể |
| `/#/truyen-tranh/:comicId` | Đọc một chương tranh đã phát hành |
| `/#/tu-sach` | Lịch sử, dấu trang, trích đoạn |

Giữ nguyên ID chương/nhân vật đang có; không tạo ID mới chỉ vì đổi tiêu đề. Dữ liệu không tồn tại thì hiển thị trang “Chưa tìm thấy trang này”, nút “Về trang chủ” và “Xem mục lục”.

### Header trang thường

- Desktop cao 72 px: logo bên trái; giữa là “Câu chuyện”, “Mục lục”, “Nhân vật”, “Thế giới”, “Truyện tranh”; bên phải “Tủ sách” và tài khoản.
- Logo gồm biểu tượng sông/mây nhỏ và tên truyện; không dùng emoji rồng làm logo.
- Header nền giấy sáng, đường phân cách mảnh; không phát sáng.
- Dưới 1.024 px thu menu vào một nút “Menu”. Mobile header cao 60 px, giữ logo, tủ sách và menu; không tạo một hàng nút dài phải cuộn ngang.
- Menu mobile là một bảng mở dưới header, mỗi hàng cao ít nhất 48 px, có nút đóng; không tạo thêm thanh điều hướng cố định ở đáy trang thường.
- “Đọc tiếp” là nút chính trong hero hoặc khu tiếp tục đọc, không lặp thành ba nút nổi ở nhiều vị trí.

Footer nền mint rất nhạt, có tên truyện, câu “Một câu chuyện đang được viết tiếp.” và liên kết mục lục, nhân vật, tủ sách. Chỉ dùng thông tin tác giả/liên hệ đã có thật. Tài khoản độc giả tiếp tục dùng dịch vụ hiện có. Lối vào khu tác giả đặt nhỏ ở footer, tiếp tục dùng luồng hiện có; không tự gỡ chức năng tác giả đang được sử dụng.

## 5. Trang chủ: bố cục phải thực hiện

Thứ tự từ trên xuống:

### A. Hero “Arumo trong nắng sớm”

Desktop dùng 12 cột, chữ chiếm 5 cột bên trái, minh họa chiếm 7 cột bên phải; gap 40 px. Khoảng trên 48 px, dưới 56 px; không ép cao bằng cả màn hình.

Nội dung trái:

- Nhãn nhỏ: “Tiểu thuyết kỳ ảo • Đang sáng tác”.
- Tên truyện: “Long Ấn Thức Tỉnh”, tối đa 3 dòng trên điện thoại.
- Lời giới thiệu website, không chèn vào bản văn: **“Ghé Arumo một chút. Ở đây, dòng sông chảy trên trời — còn một chuyến tàu đến sớm có thể làm mọi thứ đổi khác.”**
- Người chưa có lịch sử: nút chính **“Bắt đầu đọc”**, mở phần Mở đầu; liên kết phụ **“Xem mục lục”**.
- Người có lịch sử: nút chính **“Đọc tiếp”**, dưới nút có tên chương đang đọc; liên kết phụ vẫn là “Xem mục lục”.
- Dòng trạng thái lấy từ dữ liệu phát hành thật, ví dụ hiện tại “Mở đầu và 5 chương đã đăng”. Đây là ví dụ, không ghi cứng số 5.

Nửa minh họa: cảnh Arumo sáng sớm, dòng sông trời ở phần trên, nhà thấp và cầu gỗ ở phần dưới. Một nhóm nhỏ Rento, Nari, Dagan đặt trong phần tiền cảnh nếu có ảnh ghép đúng nhận diện. Không thêm nhân vật từ bộ truyện khác.

Mobile: chữ và CTA trước; tranh nằm dưới, tỉ lệ 4:3, cách 24 px. Người đọc phải thấy nút bắt đầu/đọc tiếp trước khi cuộn qua một bức tranh rất cao.

### B. “Đọc tiếp từ đây”

Chỉ hiện nếu đã có lịch sử. Một dải mint, ảnh nhỏ 64 px, tên chương, tiến độ trong chương và nút “Đọc tiếp”. Có liên kết nhỏ “Đọc lại từ đầu chương”. Không hiện trạng thái giả cho khách mới.

### C. “Các chương đã đăng”

Một khối mục lục gọn hiển thị Mở đầu và tối đa 5 chương gần nhất đã phát hành. Mỗi hàng có số/tên chương, thời lượng đọc ước tính và trạng thái cá nhân. Có “Xem toàn bộ mục lục”. Không dùng carousel hoặc 6 thẻ ảnh giống hệt nhau cho 6 chương chữ.

### D. “Gặp người ở Arumo”

Bốn thẻ: Rento, Nari, Dagan, Seika, ảnh chibi toàn thân, tên và một câu mô tả công khai. Desktop 4 cột, tablet 2 cột, mobile 2 cột. Dùng đúng ảnh dự án, không đổi ngoại hình tùy hứng.

Mô tả an toàn để dùng:

- Rento: “Thợ máy trẻ ở bến Arumo.”
- Nari: “Hộ vệ tập sự của bến.”
- Dagan: “Người hộ tống hàng ở Arumo.”
- Seika: “Người hướng dẫn hộ vệ đường sông.”

Mỗi thẻ dẫn tới hồ sơ riêng. Cuối khối có “Gặp các nhân vật khác”. Không hiển thị bí mật, cái chết, mục tiêu ẩn hoặc diễn biến tương lai.

### E. “Một góc thế giới”

Một tranh làng khổ ngang bên trái, bên phải là tiêu đề “Bến Arumo” và đoạn ngắn: “Những mái nhà thấp, những xưởng sửa tời và một bến cảng sống theo nhịp nước. Câu chuyện bắt đầu từ đây.” Nút “Khám phá Arumo”. Mobile xếp tranh rồi chữ.

### F. Bản chuyển thể

Dải giấy màu sky, một hình quyển truyện đang mở, tiêu đề “Câu chuyện đang bước sang trang tranh”. Nếu chưa có chương tranh phát hành: “Bản chuyển thể đang được thực hiện.” Nút “Xem tiến độ chuyển thể” mở trang truyện tranh. Không hiển thị % khi chưa có dữ liệu tính được.

## 6. Mục lục: đáp ứng truyện dài mà không tiết lộ bản thảo

- Tiêu đề “Mục lục”; dưới có số chương đã công bố, không tính 240 chương kế hoạch là chương đã đăng.
- Mở đầu là một mục riêng; phần truyện là nhóm có thể mở/đóng.
- Mặc định mở phần đang đọc; khách mới mở phần đầu tiên.
- Thanh tìm kiếm có placeholder “Tìm tên hoặc số chương”; chỉ tìm trong chương công khai. Tìm không dấu vẫn khớp được.
- Một hàng chương cao tối thiểu 64 px desktop, 72 px mobile: số chương bên trái, tên ở giữa, trạng thái “Đang đọc”, “Đã đọc” hoặc “Chưa đọc” bên phải. Không chỉ phân biệt bằng màu.
- Mặc định thứ tự từ đầu đến cuối. Có lựa chọn “Mới nhất trước”.
- Dự án dự kiến 20 phần × 12 chương; giao diện phải chịu được quy mô đó nhưng chỉ render phần/chương đã phát hành. Chưa công bố thì không lộ tên phần, nút thắt và tóm tắt từ Sheets.
- Không render hàng trăm chương trống hoặc hàng khóa nhằm giả cảm giác nhiều nội dung.
- Trạng thái không tìm thấy: “Chưa thấy chương này. Thử một từ ngắn hơn nhé.” và nút “Xóa tìm kiếm”.

## 7. Màn hình đọc truyện chữ: ưu tiên cao nhất

### Bố cục

- Dùng header đọc riêng cao 56 px, nền sáng: “Về truyện” bên trái; tên chương ở giữa; “Mục lục”, “Aa”, “Thêm” bên phải. Mobile tên chương rút gọn một dòng; icon phải có nhãn hỗ trợ đọc màn hình.
- H1 của chương nằm trong bài, không đưa tiêu đề khổng lồ chiếm gần hết màn đầu.
- Trên tiêu đề có tên phần; dưới tiêu đề chỉ thời lượng đọc và ngày cập nhật nếu có. Các nhãn POV, địa điểm nội bộ, mã nhân vật chuyển khỏi giao diện đọc công khai.
- Cột văn bản mặc định 680 px trên desktop, căn giữa. Các mức chiều rộng: Hẹp 600 px, Vừa 680 px, Rộng 760 px. Luôn giới hạn theo chiều rộng màn hình và lề.
- Mobile lề 20 px; không đặt bài trong một khung có thêm 32 px padding khiến cột chữ quá hẹp.
- Bài đọc nền giấy phẳng, không tranh nền, không hoa rơi, không đường viền đậm, không bóng đổ lớn.
- Đoạn văn canh trái, không canh đều hai bên. Giữ ngắt đoạn của văn bản nguồn; khoảng cách đoạn 1 em; mặc định không thụt đầu dòng.
- Lời thoại dùng cùng font và màu với văn xuôi. Không biến toàn bộ câu trong ngoặc kép thành chữ vàng hoặc font UI.
- Phân cảnh dùng dấu phân cảnh có trong nguồn; nếu cần phần tử trình bày thì dùng một nét sóng nhỏ, không tự chia lại văn.

### Điều khiển

- Desktop: header đọc gọn và cụm chuyển chương ở cuối bài; không còn 5 nút dọc bên phải.
- Mobile: một thanh đáy duy nhất cao 56 px cộng safe area, gồm “Trước”, “Mục lục”, “Sau”. Bài phải có padding đáy đủ để không che dòng cuối.
- “Thêm” chứa “Đánh dấu”, “Nghe chương”, “Âm nền”, “Chế độ tập trung”. Không đặt toàn bộ lên header.
- Chế độ tập trung ẩn thanh phụ; giữ một nút “Thoát tập trung” nhỏ và dễ tìm.
- Nghe truyện chỉ bắt đầu sau khi bấm. Khi nghe trên mobile, thay nội dung thanh đáy bằng player gọn có phát/tạm dừng và nút đóng; không chồng thêm một thanh nữa.
- Chọn/copy chữ không được tự phát audio. Việc tô sáng câu đang nghe chỉ hoạt động khi chế độ nghe đã bật.
- Âm nền mặc định tắt. Không bật âm thanh từ thao tác mở chương.
- Mascot ẩn trong lúc đọc. Nếu dùng mascot ở cuối chương, nằm trong luồng trang, không có bóng thoại nổi.

### Cài đặt Aa

Desktop: popover rộng 320 px; mobile: bottom sheet tối đa 75dvh, cuộn nội dung bên trong khi cần.

- Font: “Chữ sách” = Lora; “Chữ gọn” = Nunito.
- Cỡ chữ: 16–28 px, bước 1 px; nút giảm/tăng và số hiện tại.
- Giãn dòng: 1,65 / 1,85 / 2,05; mặc định 1,85.
- Chiều rộng: 600 / 680 / 760 px; ẩn lựa chọn này khi màn hình không đủ rộng.
- Ba nền sáng: “Giấy sáng” `#FFFDF8`, “Sương xanh” `#F2F8F3`, “Hồng rất nhạt” `#FFF5F5`. Chữ đều là `#293B36`.
- Có “Khôi phục mặc định”. Không thêm chế độ tối vào bản này.
- Lưu cài đặt thật. Di chuyển thiết lập cũ `obsidian` và các theme tối sang “Giấy sáng” một lần bằng version setting, giữ cỡ chữ/giãn dòng hợp lệ của người dùng.

### Lưu chỗ đọc và kết thúc chương

- Lưu bằng `chapterId` + mốc đoạn ổn định + độ lệch trong đoạn + thời gian; không dựa vào vị trí chương trong mảng.
- Khi đổi cỡ chữ hoặc màn hình, khôi phục theo đoạn; chỉ dùng phần trăm cuộn làm phương án dự phòng.
- Chỉ đánh dấu đã đọc khi người dùng thực sự chạm cuối vùng văn bản hoặc tự bấm “Đánh dấu đã đọc”. Không đánh dấu khi vừa mở trang.
- Cuối chương: dòng nhẹ “Đến đây rồi. Đi tiếp chứ?”, nút chương tiếp theo có tên thật; nếu hết nội dung thì “Bạn đã đọc đến chương mới nhất.”
- Sau điều hướng mới tới cảm xúc/bình luận. Không chèn mời đăng nhập ở giữa truyện.

## 8. Trang thông tin nhân vật đầy đủ và ảnh chibi đã có

### Danh sách

- H1 “Nhân vật”. Dòng phụ “Mỗi người mang theo một câu chuyện.” “Người ở Arumo” là nhóm có thể lọc, không giới hạn toàn bộ bộ truyện vào một địa điểm.
- Ô tìm tên; bộ lọc “Tất cả”, “Nhân vật chính”, “Người ở Arumo”. Chỉ gán nhóm khi dữ liệu xác định được; không tự phân loại thiện/ác để tiết lộ cốt truyện.
- Desktop 4 cột, tablet 3, mobile 2. Thẻ có nền giấy, ảnh chiếm khoảng 70% chiều cao, tên và một câu mô tả.
- Ảnh toàn thân `object-fit: contain`; có khoảng thở quanh tóc, chân và đạo cụ.
- Hồ sơ có route riêng, mở trực tiếp được; không nhét tiểu sử dài vào một drawer hẹp.

### Trang hồ sơ riêng: bố cục bắt buộc

Route `/#/nhan-vat/:characterId`. Mỗi nhân vật có một trang thật, không chỉ một ảnh/avatar hoặc bảng kéo hẹp. Trên desktop dùng container 1.040 px, cột ảnh 360 px, cột giới thiệu còn lại, gap 40 px. Các mục dài nằm dưới rộng cả container. Mobile xếp dọc, ảnh tối đa 280 px, không có tab ngang phải kéo mới tìm được tiểu sử.

Thứ tự các khối:

1. Breadcrumb “Trang chủ / Nhân vật / {Tên}”.
2. Ảnh chibi toàn thân trong khung giấy sáng, cao khoảng 440 px desktop; nút “Xem ảnh lớn” mở lightbox nền sáng có nút đóng, phóng to và xem lại toàn ảnh. Không cắt tóc, chân hoặc đạo cụ.
3. Tên nhân vật, vai trò, một câu giới thiệu. Có nút “Gặp trong truyện” nếu đã biết chương xuất hiện công khai.
4. “Thông tin nhanh”: tuổi kèm mốc thời gian khi cần, giới tính, xuất thân, nơi sinh sống, nghề nghiệp/vai trò. Chỉ hiện trường có dữ liệu nguồn; không bịa ngày sinh, chiều cao, cung hoàng đạo hoặc hệ sức mạnh.
5. “Bạn sẽ nhận ra…”: ngoại hình, trang phục, đạo cụ và nét nhận diện, trình bày thành 3–5 ý ngắn.
6. “Con người phía sau vẻ ngoài”: tính cách, cách nói, thói quen và điều nhân vật quan tâm đã được giới thiệu. Dùng các đoạn ngắn, không chỉ một dãy nhãn.
7. “Xuất thân và hành trình”: tiểu sử đã công bố; quá khứ có mốc nguồn có thể trình bày theo timeline. Mốc chưa chắc thì dùng đoạn văn, không tự tạo năm tháng.
8. “Những người liên quan”: thẻ ảnh nhỏ của nhân vật liên quan, tên, mô tả quan hệ đã công bố và liên kết hồ sơ. Không dùng một avatar cho nhiều người.
9. “Gặp nhân vật trong truyện”: danh sách chương đã phát hành có dữ liệu xác nhận sự xuất hiện; không tự đánh dấu nhân vật có mặt ở tất cả chương.
10. “Hình ảnh”: ảnh tạo hình hiện có; chỉ thêm biểu cảm/góc quay/ảnh cảnh khi có tệp thật. Một ảnh toàn thân không được giả thành bộ nhiều góc bằng cách lật ảnh.
11. Điều hướng cuối trang: nhân vật trước/sau trong danh mục và “Về danh sách”. Không thêm chỉ số game hoặc bảng sức mạnh vào hồ sơ truyện.

Đủ 21 nhân vật phải có bản ghi trong hệ thống quản trị và ghép đúng ảnh. Bản xem trước nội bộ dựng đủ 21 hồ sơ theo dữ liệu hiện có, đánh dấu rõ phần nào còn thiếu. Trang độc giả chỉ hiện những hồ sơ được bật công khai. Không giới hạn hệ thống ở 8 nhân vật cũ, cũng không tự bịa tiểu sử cho 13 người còn lại để lấp khoảng trống.

Nguồn đối chiếu nội bộ: [Google Sheets — hồ sơ nhân vật truyện](https://docs.google.com/spreadsheets/d/1-kehBNZBbnc53v8Dpl3jll2HQKt6tr3tldm6tZWFlHg/edit?gid=1700000006#gid=1700000006) và [Google Docs — Long Ấn Ký](https://docs.google.com/document/d/1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y/edit). Các liên kết này là nguồn biên tập, không đưa lên hồ sơ độc giả. Nếu môi trường không đọc được nguồn, nhập ảnh và các trường đã có trước, đánh dấu thiếu dữ liệu trong admin; không đoán tiểu sử.

### Thông tin đầy đủ của tác giả và thông tin độc giả

- Hồ sơ quản trị gồm cả gia đình, xuất thân, biến cố quá khứ, mục tiêu, nỗi sợ, nhu cầu nội tâm, bí mật, quan hệ, năng lực/giới hạn, tổn thương, tri thức theo chương và tuyến phát triển. Dữ liệu lấy từ tài liệu dự án, không suy ra từ hình ảnh.
- Hồ sơ công khai là bản biên tập từ hồ sơ đó. Mỗi khối có trạng thái “Chưa công khai”, “Công khai”, hoặc “Tiết lộ đến chương…”.
- Nội dung đã xuất hiện ở chương sau có thể nằm trong vùng “Có tiết lộ nội dung”, yêu cầu bấm mở và ghi mốc chương. Người đọc có thể chọn mốc đã đọc; hệ thống không tự cho là họ đã đọc hết.
- Bí mật chưa xuất bản, kế hoạch arc, chương nhân vật chết, ghi chú tạo hình và đường dẫn máy chỉ nằm ở admin. Không gửi các trường đó tới trình duyệt khách rồi che bằng CSS.
- Trường có nguồn nhưng còn thiếu bản biên tập công khai được hiện thành việc cần hoàn thiện ở admin; không hiện bảng “đang điền dữ liệu” trên trang người đọc.

## 9. Dùng bộ ảnh chibi đã có

Thư viện ảnh đã bàn giao ngay trong dự án:

`design-handoff/character-art-v03/`

Thư mục này có đủ 21 PNG, `asset-index.json` để ghép tên với tệp và `README.md` hướng dẫn sử dụng. Đây là tài nguyên nội bộ để Antigravity nhập vào hệ thống, không được phục vụ toàn bộ thư mục cho khách truy cập. Thư viện gốc trên máy:

`C:\Users\anhkh\Documents\Codex\2026-10-11\b-y-h-v-i-c\output\character-art-v03\`

Đọc manifest nguồn để đối chiếu tên, tuổi của tạo hình, file và ngoại hình. Manifest không chứa đầy đủ vai trò, tiểu sử hay ID truyện; lấy các trường đó từ hồ sơ nhân vật nguồn. Đây là bộ tạo hình phiên bản 0.3 dùng làm cơ sở thiết kế, chưa có nghĩa mọi hồ sơ đều đã được công bố.

Các file:

`01-rento-v03.png`, `02-nari-v03.png`, `03-dagan-v03.png`, `04-seika-v03.png`, `05-mira-v03.png`, `06-omi-v03.png`, `07-oren-v03.png`, `08-garan-v03.png`, `09-tovan-v03.png`, `10-eli-v03.png`, `11-banu-v03.png`, `12-seli-v03.png`, `13-luma-v03.png`, `14-fara-v03.png`, `15-kiro-v03.png`, `16-bero-v03.png`, `17-veni-v03.png`, `18-doro-v03.png`, `19-paku-v03.png`, `20-yori-v03.png`, `21-tavi-v03.png`.

Cách làm:

1. Nhập đủ 21 ảnh vào thư viện quản trị và liên kết đúng 21 bản ghi nhân vật. Giữ ảnh nguồn; chỉ xuất bản web của nhân vật được bật công khai vào `public/art/characters/` hoặc nơi lưu ảnh công khai tương ứng.
2. Tạo bảng map theo ID nhân vật; không map bằng index và không suy luận ID mới từ thứ tự file.
3. Bản preview quản trị có đủ 21 ảnh/hồ sơ. Tách ba trạng thái `assetReady`, `profileReady`, `publicReady`; có ảnh không đồng nghĩa hồ sơ đã viết đủ hoặc được đăng. Với 13 người chưa có ID trong mã hiện tại, tìm ID từ dữ liệu gốc trước; nếu chưa có thì tạo ID ổn định khi nhập, ghi vào bảng map và giữ nguyên về sau.
4. Dùng WebP/AVIF nếu công cụ hiện có hỗ trợ; portrait khoảng 640–800 px cạnh dài, avatar 160 px. Giữ bản PNG nguồn.
5. Avatar có thể crop vùng mặt; ảnh hồ sơ phải toàn thân. Đặt width/height hoặc aspect-ratio để tránh trang giật khi tải.
6. Ảnh nguồn có nền giấy: đặt trong thẻ cùng màu. Nếu cần tách nền để ghép cảnh, dùng công cụ xử lý ảnh có kiểm tra tóc/tay/đạo cụ; không dùng `mix-blend-mode` làm mất nét.
7. Nếu thiếu file, dùng silhouette nguyên bản có chữ “Đang cập nhật hình”; không thay bằng một người mẫu Unsplash.
8. Alt text ngắn, ví dụ “Rento trong trang phục thợ máy”; tránh mô tả bí mật trong alt.
9. Không công bố manifest nguồn chứa prompt, đường dẫn máy hoặc ghi chú cốt truyện. Manifest ảnh dành cho public chỉ gồm ID, tên, URL ảnh, alt trung tính và kích thước.
10. Banu 41 ở mốc hiện tại, 37 ở hồi tưởng nếu hồ sơ đang nói T−4; Tavi 16 là tuổi của tạo hình quá khứ. Không tự cộng tuổi hiện tại hoặc công bố tình trạng sống/chết từ tên file. Đối chiếu mốc nguồn trước khi đưa tuổi lên trang.

Mốc giữ tạo hình theo manifest: Rento nam 18, Nari nữ 19, Dagan nam 20, Seika nữ 35, Mira nữ 43, Omi nữ 62, Oren nam 32, Garan nam 46. Không làm trẻ các nhân vật lớn tuổi, thay tóc/trang phục/đạo cụ hoặc đảo bên đặc điểm cơ thể. Những tuổi này dùng để giữ hình nhất quán; chỉ hiển thị trên hồ sơ public nếu đã xác nhận công khai.

## 10. Các hình minh họa mới cần chuẩn bị

Tạo thư mục `public/art/world/` và `public/art/ui/`. Đây là tranh trang trí cho giao diện, không tự coi là bản đồ chính thức hay cảnh đã diễn ra trong truyện.

| Tệp | Kích thước nguồn | Nội dung |
|---|---|---|
| `arumo-morning-wide.webp` | 1.800 × 1.200 | Cảnh làng bến cảng và sông trời cho hero desktop |
| `arumo-morning-mobile.webp` | 960 × 720 | Bố cục lại cùng cảnh để xem trên mobile |
| `arumo-postcard.webp` | 1.200 × 800 | Cầu gỗ, xưởng sửa tời, cây và mái nhà cho khối thế giới |
| `paper-boat.svg` | viewBox 128 × 128 | Thuyền giấy nhỏ, xanh ngọc, dùng cho empty state |
| `river-mark.svg` | viewBox 64 × 64 | Hai nét sông và một nét mây; favicon/logo phụ |
| `open-book.svg` | viewBox 240 × 160 | Quyển truyện mở có một góc tranh đang vẽ |

Brief tạo cảnh hero, dùng nguyên nội dung sau với công cụ tạo ảnh nếu có:

> Original illustrated fantasy river-port village at early morning, gentle sunlight, an impossible translucent river flowing above soft clouds, small wooden houses, pale tiled roofs, a modest timber pier, ropes and a simple mechanical repair workshop, leafy plants by windows. A welcoming lived-in place with subtle mystery. Hand-drawn storybook background compatible with 2.75-head-tall chibi characters, soft blue-gray outlines, restrained watercolor and gouache texture, warm off-white paper, muted sage green, pale sky blue, small blush-pink and butter-yellow accents. Clear foreground, middle ground and distant sky river; village occupies lower two thirds. No humans, no text, no logo, no interface, no modern city, no giant pagodas, no neon, no night sky, no photorealism, no recognizable franchise assets. Horizontal 3:2 composition.

Mobile là bố cục 4:3 của cùng cảnh, giữ sông trời và cầu gỗ trong vùng trung tâm; không chỉ cắt mất phần nhận diện chính. Nhân vật nếu ghép vào hero phải dùng đúng ảnh tham chiếu, không tự tạo trang phục mới.

Nếu môi trường không có công cụ tạo tranh: dựng cảnh dự phòng bằng SVG nguyên bản gồm mây, sông, 5 mái nhà nhỏ, cầu gỗ và cây; dùng ảnh nhân vật sẵn có trong khung giấy cạnh cảnh. Ghi rõ tranh nền cần thay ở bàn giao, vẫn hoàn thiện luồng đọc. Không dùng ảnh stock để giả thành tranh hoàn chỉnh.

## 11. Trang thế giới

- H1 “Một góc Arumo”. Bên dưới là tranh postcard khổ ngang.
- Hai nhóm nội dung: “Địa điểm” và “Những điều cần biết”.
- Địa điểm khởi đầu: bến Arumo, xưởng sửa tời, dòng sông Asera; mô tả dựa trên nội dung đã đăng.
- Mỗi địa điểm có ảnh/biểu tượng, tên, mô tả tối đa 100–150 từ, liên kết tới chương đầu tiên đề cập nếu đã xác định chắc.
- Không dựng bản đồ có vị trí địa lý cụ thể chưa được tác giả xác nhận. Tranh cảnh có thể mang nhãn “Minh họa không gian”.
- Không đưa timeline toàn truyện, bí mật thế giới hoặc tuyến 20 phần chưa viết lên đây. Dữ liệu đó tiếp tục ở studio.

## 12. Truyện tranh: giao diện phải phản ánh đúng tiến độ

Khi chưa có chương tranh hoàn chỉnh:

- H1 “Long Ấn Thức Tỉnh — Bản truyện tranh”.
- Hình quyển truyện mở, ảnh chibi nhỏ và câu “Từ những dòng chữ đầu tiên đến từng khung tranh.”
- Trạng thái “Đang thực hiện bản chuyển thể”.
- Nút chính “Đọc truyện chữ”; liên kết phụ “Gặp các nhân vật”.
- Chỉ trưng bày khung tranh thực tế đã được phép giới thiệu. Kịch bản chia khung không được tính là chương tranh hoàn thành.
- Xóa nội dung mẫu về “Học viện Aesvorn”, “Chiếc đồng hồ chạy thừa 5 phút”, % 95/70 và nhãn “Sẵn sàng xuất bản” nếu chúng không thuộc dữ liệu hiện hành đã xác nhận.
- Không dùng ảnh cảnh Unsplash làm teaser truyện tranh. Không hứa ngày ra mắt hoặc gửi thông báo khi chưa có chức năng thật.

Khi đã có chương phát hành:

- Danh sách tập có thumbnail thật, tên tập, chương chữ tương ứng và ngày phát hành thật.
- Reader tranh cuộn dọc, desktop tối đa 800 px, mobile 100% chiều rộng; giữ nguyên tỷ lệ ảnh.
- Nếu ảnh là trang truyện có khung: có khoảng cách 12 px giữa trang. Nếu ảnh là các lát của webtoon liên tục: gap 0. Dữ liệu khai báo rõ loại, không tự kéo giãn.
- Chạm để mở ảnh lớn khi cần; không mặc định ép cả chương vào slideshow.
- Có chuyển về bản chữ tương ứng và lưu tiến độ tranh riêng với tiến độ chữ.

## 13. Tủ sách, tài khoản, bình luận và các trạng thái

### Tủ sách

Ba mục: “Đang đọc”, “Dấu trang”, “Trích đoạn”. Khách vẫn lưu được trên thiết bị. Chỉ nói “Đã đồng bộ” khi backend thực sự xác nhận.

Empty state dùng thuyền giấy và câu “Chỗ đọc của bạn sẽ nằm ở đây.” Nút “Bắt đầu đọc”. Không bắt tạo tài khoản trước khi đọc truyện.

Tài khoản đang có được giữ lại và đổi sang giao diện sáng. Xếp hạng/EXP nếu tiếp tục giữ thì nằm trong tài khoản, không còn là nút chính ở màn đọc. Không thêm streak, thông báo thúc ép hoặc pop-up nhận thưởng giữa chương.

### Bình luận và cảm xúc

- Giữ tích hợp hiện có; giao diện nằm sau cuối chương.
- Giữ bốn khóa dữ liệu/API đang có, đổi nhãn hiển thị: `fire` = “Cuốn”, `love` = “Chạm cảm xúc”, `dragon` = “Hóng chương sau”, `flower` = “Thả hoa”. Mobile xếp thành lưới 2 × 2. Không gộp hoặc chuyển số đếm giữa các khóa; số thật từ API giữ nguyên.
- Xóa các số seed 14/28/19/22 và hai bình luận mẫu nếu chỉ là dữ liệu demo.
- Server trả danh sách rỗng thì render rỗng, không nạp lại bình luận giả.
- Chưa có bình luận: “Chưa có lời nhắn nào. Bạn muốn để lại cảm nghĩ đầu tiên chứ?”
- Gửi thành công mới thông báo thành công. Lỗi giữ lại nội dung người dùng đã gõ và có “Thử lại”.
- Ẩn tên nhà cung cấp cơ sở dữ liệu, thông tin đồng bộ và chi tiết kỹ thuật khỏi UI.
- Nếu dịch vụ bình luận chưa dùng được thì hiện “Bình luận đang tạm ngưng”; không tạo một nút gửi luôn báo thành công.

### Microcopy dùng sẵn

- Đánh dấu thành công: “Lưu chỗ rồi nhé.”
- Trở lại trang chủ có lịch sử: “Đang hay thì đừng lạc chương.”
- Chương cuối hiện có: “Bạn đã đọc đến chương mới nhất.”
- Tải lỗi: “Chưa tải được chương này. Thử lại nhé.”
- Bản cập nhật nội dung: “Có bản cập nhật cho chương này.” + nút “Tải bản mới”.
- Lưu trên máy: “Chỗ đọc được lưu trên thiết bị này.”

Chỉ dùng tối đa một câu vui trong một khối. Nút chức năng giữ tên rõ ràng. Không dùng “Oa~”, “bé iu”, chuỗi emoji hay tiếng lóng ở tất cả tiêu đề.

## 14. Chuyển động và tương tác

- Hover nút đổi màu 160 ms; pressed dịch xuống 1 px. Card nhân vật nhấc tối đa 3 px khi hover trên thiết bị có chuột.
- Bảng mở/đóng dùng opacity và transform 180–220 ms.
- Minh họa hero chỉ có một chuyển động nhập cảnh nhẹ trong tối đa 4 giây rồi dừng; không tự chạy mây, hoa, mascot vô hạn.
- Reader tĩnh. Không parallax hoặc scroll hijacking.
- Có `prefers-reduced-motion`, khi bật thì bỏ chuyển động trang trí.
- Vùng bấm thiết kế tối thiểu 44 × 44 px; focus ring xanh đậm 2 px, offset 3 px.
- Dialog có tiêu đề, giữ focus bên trong, đóng bằng Escape, trả focus về nút đã mở.
- Không khóa zoom hoặc kéo chọn văn bản trên điện thoại.

## 15. Tách component và sửa đúng nơi

Tạo các nhóm sau, có thể điều chỉnh phần mở rộng theo cấu trúc dự án nhưng giữ trách nhiệm rõ ràng:

```text
src/components/public/
  PublicSiteShell.tsx
  PublicHeader.tsx
  PublicFooter.tsx
  StoryHomePage.tsx
  ChapterIndexPage.tsx
  CharacterGalleryPage.tsx
  CharacterPublicProfile.tsx
  WorldGuidePage.tsx
  ComicLandingPage.tsx
  BookshelfPage.tsx

src/components/reader/
  NovelReaderPage.tsx
  ReaderToolbar.tsx
  ReaderChapterDrawer.tsx
  ReaderArticle.tsx
  ReaderEndSection.tsx
  ReaderSettingsPanel.tsx

src/styles/
  public-tokens.css
  public-site.css
  reader.css

src/data/
  publicCharacters.ts
  characterArt.ts

src/services/
  publicNavigation.ts
  readingProgress.ts
  publishedContent.ts

public/art/
  characters/
  world/
  ui/
```

Các điểm cần sửa trong mã hiện có:

- `src/App.tsx`: render public shell khi là độc giả và admin shell sau khi máy chủ xác nhận vai trò admin. Giữ dữ liệu/chức năng studio cũ, đưa vào khu quản trị tại mục 19. Không để effect cũ ép mọi trang công khai quay về reader. Thay đường tắt PIN/query/localStorage bằng xác thực và phân quyền tại mục 20.
- `UnifiedReaderView.tsx`: tách dần phần chữ, toolbar, cuối chương, setting. Không tiếp tục chèn hàng trăm dòng UI mới vào component này.
- `src/styles/index.css`, `index.html`, `tailwind.config.js`: thay token và font công khai; gỡ `dark` ghi cứng khỏi gốc public, scope style studio riêng nếu cần. Không đè toàn dự án bằng `!important`.
- `ReadingSettingsModal.tsx`: chuyển sang ba nền sáng, hai font; migrate theme cũ một lần.
- `CharacterDossierDrawer.tsx`: ngừng dùng hồ sơ tác giả đầy đủ làm UI công khai; dùng dữ liệu public đã lọc và ảnh chibi.
- `ChapterCommentsSection.tsx`: giữ API, bỏ seed giả, sửa trạng thái rỗng/lỗi.
- `ComicComingSoonView.tsx`: thay nội dung mẫu và phần trăm ghi cứng bằng trạng thái chuyển thể thật.
- Giữ kết nối hữu ích từ `userService.ts`, các component auth/history, `audioDramaService.ts`, `AudioDramaPlayerBar.tsx` và dịch vụ âm nền. Dời vị trí trình bày theo đặc tả.
- Khu độc giả dùng một vùng cuộn chính của tài liệu. Studio có thể giữ bố cục riêng. Sửa nơi nghe cuộn và khôi phục chỗ đọc theo vùng cuộn mới; không giữ `body { overflow: hidden }` cho toàn public.

## 16. Giữ nội dung và dữ liệu nhất quán

Các file cần đọc trước khi đổi luồng nội dung: `googleData.ts`, `googleCharacters.ts`, `storageService.ts`, `googleSyncService.ts`, `googleDocParser.ts`, `src/types/index.ts`.

Cách triển khai dữ liệu công khai; phần lưu quản trị mở rộng dịch vụ hiện có theo mục 20–21:

1. Tạo snapshot `public/content/published-story.json` từ Mở đầu và Chương 1–5 hiện đang công khai, sau khi đối chiếu nội dung. Dùng allowlist ID chương cụ thể; không dùng trạng thái `draft/final` của editor để suy ra được phép đăng, vì chương đang công khai có thể vẫn mang nhãn draft.
2. Snapshot có `version`, `parts`, `chapters` và các trường cần hiển thị. Chỉ có `publishedAt` khi có nguồn ngày phát hành thật. Có một bản snapshot đã công bố đi kèm build để website vẫn đọc được nếu cập nhật qua mạng lỗi.
   Sau khi có admin, snapshot hiện hành được lưu trong cơ sở dữ liệu/kho lưu bền vững và trả qua API public chỉ đọc. Tệp đi kèm build là dữ liệu khởi tạo hoặc dự phòng có version, không phải đích ghi của thao tác “Đăng” trên Vercel. Bản cũ không được ghi đè snapshot mới hơn hoặc làm hiện lại chương server đã đánh dấu gỡ công khai. Phản hồi 404/410 hoặc trạng thái không công khai từ server luôn thắng cache; fallback chỉ dành cho lỗi kết nối, không phục hồi chương bị gỡ. Lỗi tải cập nhật không được báo là cập nhật thành công.
3. Các component độc giả chỉ nhận snapshot và hồ sơ public đã lọc; không nhận nguyên object hồ sơ tác giả rồi giấu một số phần bằng CSS. Chức năng studio chuyển vào admin; giữ dữ liệu nguồn qua bước nhập có thể quay lại.
4. Dữ liệu bản thảo và hồ sơ nội bộ được tải qua API yêu cầu admin, không import ghi cứng vào bundle public. Lazy-loading và route ẩn không phải phân quyền. Tận dụng API và cơ sở dữ liệu đang có, bổ sung các endpoint còn thiếu; không đổi nền công nghệ toàn dự án.
5. Đăng nhập, lịch sử, bình luận và audio dành cho độc giả vẫn nối dịch vụ hiện có. Các module UI mới không import dữ liệu nội bộ; chỉ dùng adapter public. Không công bố thêm tài liệu, bí mật hoặc nhân vật chưa xuất hiện để lấp đầy giao diện.

- Tách snapshot nội dung đã công bố với dữ liệu studio. Các trang chủ, mục lục, reader và số chương đều đọc cùng một snapshot/version.
- Chưa có snapshot hợp lệ thì hiển thị skeleton và trạng thái tải; không hiện bản demo cũ vài giây rồi đổi sang chương khác.
- Nếu dùng bản cache đã công bố, cho người đọc tiếp tục; khi có bản mới thì thông báo nhẹ và áp dụng lúc chuyển chương hoặc bấm “Tải bản mới”. Không thay đoạn văn dưới mắt người đang đọc.
- Nếu giữ kiểm tra Google Docs mỗi 12 giây thì chỉ chạy trong admin, chỉ thông báo nguồn có bản mới. Không tự nhập hoặc ghi đè bản nháp; thao tác xem khác biệt và chọn nhập tại mục 19.10 quyết định việc áp dụng. Public không gọi luồng này.
- Giữ dịch vụ đồng bộ để tác giả sử dụng; thêm ranh giới công bố rõ ràng. Chỉ lấy các chương đã được xác nhận công khai vào snapshot. Không tự công bố mọi thứ vừa đọc thấy trong Docs.
- Với trang chữ đang chạy, giữ Mở đầu và 5 chương hiện hành sau khi xác nhận dữ liệu; không đưa về 3 chương mẫu cũ.
- Model, adapter snapshot và UI public hỗ trợ nhiều phần, giữ ID phần/chương hiện có. Không sửa parser Google Docs hoặc migration toàn bộ bản thảo trong đợt này nếu dữ liệu công khai chưa cần; ghi riêng hạn chế parser hiện chỉ xử lý Phần I. Không tự sinh 240 bản văn.
- Lưu trữ cũ cần migration có version và phương án quay lại. Không xóa toàn bộ localStorage để đạt giao diện sạch.
- Snapshot công khai không chứa raw hồ sơ tác giả, bí mật, bản thảo hoặc URL tài liệu quản lý nội bộ. Dùng danh sách trường cho phép và loại import dữ liệu nội bộ khỏi public build sau khi chuyển dữ liệu vào nơi lưu admin theo mục 21.

## 17. Responsive và tải trang

- Từ 1.024 px: bố cục desktop. Từ 640–1.023 px: tablet. Dưới 640 px: mobile.
- Tất cả trang phải dùng được ở 320, 390, 768, 1.024 và 1.440 px.
- Không có thanh nút tràn ngoài viewport như header hiện tại. Không dùng `overflow-x: hidden` để che một layout bị vỡ.
- Ảnh hero có `srcset`/`sizes` hoặc `<picture>` để chọn bản mobile; ảnh dưới màn đầu tải chậm. Ảnh hero chính không lazy-load.
- Quy định kích thước ảnh trước khi tải. Không đưa trực tiếp cả 21 PNG dung lượng lớn vào màn đầu.
- Mục tiêu ảnh hero bản web khoảng 350 KB desktop/200 KB mobile nếu chất lượng cho phép; portrait khoảng 100 KB. Đây là ngân sách tối ưu, không hy sinh nét mặt để đạt số bằng mọi giá.
- Tách tải phần studio, audio nâng cao và các modal ít dùng khỏi phần đọc đầu tiên khi cấu trúc hiện có cho phép.
- Favicon dùng `river-mark`; title tab phản ánh trang/chương. Không hứa rằng hash route tự tạo SEO riêng cho mọi chương.

## 18. Thứ tự thực hiện và kết quả bàn giao

Làm theo thứ tự:

1. Đọc dự án, ghi nhận dữ liệu/chức năng hiện có; tạo mốc sao lưu có thể quay lại, không ghi đè thay đổi chưa lưu của chủ dự án.
2. Tạo token, font, public shell, URL và bộ ảnh web.
3. Hoàn thiện trang chủ theo đúng bố cục đã chỉ định.
4. Hoàn thiện mục lục và màn hình đọc trên điện thoại trước, sau đó desktop.
5. Nối lại lưu chỗ, dấu trang, cài đặt, audio và tài khoản.
6. Làm đầy đủ trang nhân vật, ghép thư viện 21 ảnh, thế giới, truyện tranh, tủ sách và trạng thái rỗng/lỗi.
7. Sửa các dữ liệu demo, theme cũ và tình trạng cập nhật nội dung làm nhảy trang.
8. Xây hệ thống quản trị, đăng nhập và lưu/xuất bản thật theo mục 19–21; không coi màn admin chỉ có giao diện là hoàn thành.
9. Bàn giao bản preview, ảnh chụp các màn chính, danh sách tệp đã đổi và những asset còn thiếu nếu có. Không tuyên bố tính năng đã hoạt động nếu chưa kiểm tra thực tế.

Điều kiện chấp nhận của thiết kế:

- Ngay màn đầu nhận ra một bộ truyện chibi sáng và thơ mộng về Arumo.
- Người mới tìm thấy “Bắt đầu đọc”; người cũ tìm thấy đúng chương đang đọc.
- Không còn nền tối, chữ phát sáng, ảnh người thật hoặc mascot che văn bản ở public.
- Đọc chương dài thoải mái trên điện thoại; thanh điều khiển không che dòng cuối.
- Nội dung đọc, mục lục và số chương thống nhất.
- Nhân vật dùng đúng ảnh; hồ sơ và snapshot công khai mới chỉ chứa nội dung đã biên tập cho độc giả.
- Bản truyện tranh, bình luận và số cảm xúc thể hiện dữ liệu thật.
- Các nút có hành vi thực hoặc trạng thái chưa khả dụng rõ ràng; không dùng `href="#"` để giả điều hướng.
- Giữ được dữ liệu và chức năng hữu ích của dự án cũ.

Hãy thực hiện theo đặc tả này, bao gồm phần quản trị bổ sung bên dưới. Nếu một tài nguyên thật sự chưa tồn tại, dùng phương án dự phòng đã nêu, ghi nhận phần thiếu và tiếp tục hoàn thiện những phần còn lại; không tự đổi hướng mỹ thuật hoặc trả lại những câu như “có thể dùng màu pastel”, “hãy cân nhắc bố cục”.

## 19. Hệ thống quản trị: “Bàn làm việc Arumo”

Đây là nơi chủ dự án không rành kỹ thuật có thể quản lý toàn bộ bộ truyện và website. Xây các màn hình và thao tác thực theo mô tả sau; không chỉ vẽ dashboard rồi để các nút chưa làm gì.

### 19.1. Bố cục và diện mạo

- Admin tiếp tục dùng nền sáng, Nunito, xanh ngọc và nền giấy của website. Các bảng làm việc ưu tiên gọn, dễ đọc. Chibi chỉ xuất hiện ở tổng quan, thẻ nhân vật và trạng thái trống.
- Desktop từ 1.200 px: thanh menu trái rộng 240 px; header trên cao 64 px; nội dung lề 32 px. Ở 768–1.199 px menu mặc định thu gọn thành dải 72 px có tooltip; dưới 768 px dùng menu trượt, header 56 px và lề 16 px.
- Header: breadcrumb và tên trang bên trái; bên phải có “Xem website”, thông báo công việc và tài khoản. “Xem website” mở tab độc giả riêng để không mất bản đang sửa.
- Sidebar nhóm **Nội dung**: Phần và chương, Nhân vật, Thế giới, Truyện tranh. Nhóm **Sản xuất**: Công việc, Thư viện ảnh, Nhập từ Google Docs. Nhóm **Website**: Trang chủ và giao diện, Bình luận, Độc giả. Nhóm **Hệ thống**: Lịch sử và khôi phục, Cài đặt. “Tổng quan” ở đầu.
- Mục đang chọn có nền mint và vạch xanh nhỏ; icon 20 px. Không có nền đen, neon hoặc emoji ở mọi hàng menu.
- Header mỗi trang gồm tên, một câu giải thích ngắn, nút chính duy nhất phù hợp như “Thêm chương” hoặc “Thêm nhân vật”.
- Danh sách dùng bảng có header rõ, hàng khoảng 64 px, ảnh thu nhỏ 48 px khi cần. Mobile chuyển thành thẻ thông tin; chỉ bảng dữ liệu thực sự cần nhiều cột mới cuộn ngang bên trong khung.
- Biểu mẫu có nhãn ở trên, trợ giúp bên dưới, lỗi ngay dưới trường; không chỉ dùng placeholder. Các nhóm biểu mẫu cách nhau 24–32 px.
- Dải lưu ở cuối biểu mẫu luôn có “Lưu bản nháp”, “Xem trước”, “Đăng/Cập nhật công khai” khi phù hợp; trên mobile chỉ nút lưu chính cố định, thao tác còn lại nằm trong “Thêm”. Dành đủ khoảng trống để không che trường cuối.

### 19.2. Các route quản trị

| Route | Trang và hành động chính |
|---|---|
| `/#/dang-nhap` | Đăng nhập chung, tự chuyển theo vai trò |
| `/#/admin` | Tổng quan công việc |
| `/#/admin/chuong` | Phần và chương; tạo, sắp xếp, chỉnh sửa |
| `/#/admin/chuong/:id` | Trình biên tập một chương |
| `/#/admin/nhan-vat` | Toàn bộ 21 hồ sơ và ảnh |
| `/#/admin/nhan-vat/:id` | Biên tập hồ sơ, ảnh, quan hệ và phạm vi công khai |
| `/#/admin/the-gioi` | Địa điểm, tổ chức, thuật ngữ |
| `/#/admin/truyen-tranh` | Chuyển thể và các trang tranh |
| `/#/admin/truyen-tranh/:id` | Làm một chương tranh |
| `/#/admin/cong-viec` | Tiến độ dự án và việc nhỏ |
| `/#/admin/thu-vien` | Ảnh, phiên bản và nơi đang sử dụng |
| `/#/admin/nhap-noi-dung` | Nhập/xem khác biệt từ Google Docs |
| `/#/admin/giao-dien` | Nội dung trang chủ, hình nền, nhân vật nổi bật |
| `/#/admin/binh-luan` | Duyệt và ẩn bình luận |
| `/#/admin/doc-gia` | Tài khoản độc giả |
| `/#/admin/lich-su` | Phiên bản, hoạt động, thùng rác, khôi phục |
| `/#/admin/cai-dat` | Tên truyện, liên kết, mật khẩu, thiết lập |

Các route chỉ là địa chỉ giao diện. Quyền truy cập thật do máy chủ quyết định theo mục 20.

### 19.3. Tổng quan

Trên cùng là lời chào “Bàn làm việc của bạn” và nút “Tiếp tục công việc gần nhất”. Bên dưới có bốn số liệu thật: chương công khai, bản nháp đang sửa, hồ sơ nhân vật cần hoàn thiện, chương tranh đang làm. Mỗi ô bấm được để mở danh sách đã lọc tương ứng.

Nội dung desktop chia 8/4 cột:

- Bên trái: “Việc cần làm” tối đa 8 việc, mỗi việc có tên, mảng, trạng thái và nút mở đúng trang biên tập; bên dưới là “Bản đang chỉnh sửa”.
- Bên phải: “Lần đăng gần nhất”, “Nội dung còn thiếu” như chưa có ảnh/chưa có bản giới thiệu public, và “Thay đổi gần đây”.
- Mobile xếp lần lượt số liệu → việc cần làm → bản đang sửa → hoạt động.
- Không dựng biểu đồ tăng trưởng/lượt đọc nếu chưa thu thập số liệu. Các số đếm thiếu nguồn hiện “Chưa có dữ liệu”.

### 19.4. Phần và chương

Danh sách có nhóm phần, tìm tên/số chương và lọc “Nháp”, “Đang biên tập”, “Sẵn sàng đăng”, “Đã công khai”, “Đã lưu trữ”. Mỗi hàng có thứ tự, tên, số từ thực, lần lưu gần nhất, bản công khai và menu thao tác.

Tạo/sắp xếp phần bằng nút lên/xuống bên cạnh kéo thả. Không đổi ID khi đổi tên hoặc thứ tự. Khung 20 × 12 là kế hoạch sản xuất; mục Công việc có thể quản lý đủ 240 chương dự kiến, còn danh sách bản văn chỉ đánh dấu có nội dung khi đã có bản thực.

Trình biên tập chương:

- Desktop đủ rộng: cây phần/chương 220 px bên trái; vùng viết `min-width: 0; width: 100%; max-width: 680px`; panel thông tin 280 px. Dưới 1.600 px, panel thông tin thành drawer; dưới 1.280 px, cây chương cũng thành drawer. Sau khi trừ sidebar/lề/gap, vùng viết được co theo phần còn lại; không ép chiều rộng tối thiểu làm tràn. Mobile hiển thị vùng viết, các panel mở bằng nút.
- Trên vùng viết: tên chương, phần thuộc về, trạng thái. Thanh định dạng nhỏ gồm tiêu đề, đậm, nghiêng, trích dẫn và phân cảnh; không tự thêm emoji vào văn.
- Panel thông tin: nhân vật xuất hiện, địa điểm, thời gian trong truyện, ghi chú logic, ghi chú riêng và tham chiếu bản nguồn. Các trường này không tự hiện ngoài trang đọc.
- Trên/dưới vùng viết luôn phân biệt “Bản đang sửa: đã lưu lúc…” và “Bản độc giả đang đọc: phiên bản…”.
- “Lưu bản nháp” chỉ lưu nội bộ; “Xem trước” mở reader dùng bản nháp trong phiên admin; “Đăng chương” hoặc “Cập nhật công khai” mở bảng tóm tắt thay đổi và hành động xác nhận rõ.
- Tự lưu bản nháp sau khoảng 2 giây dừng gõ, có trạng thái “Đang lưu”, “Đã lưu”, “Chưa lưu được — Thử lại”. Lỗi mạng không được xóa phần vừa gõ.
- “Gỡ khỏi công khai” không xóa bản thảo. Chương bị gỡ thì đường dẫn cũ báo chưa khả dụng và dẫn về mục lục.
- Giữ các công cụ AI/kiểm tra logic hiện có trong panel “Hỗ trợ biên tập”, mặc định đóng. Đề xuất AI phải được so sánh và bấm áp dụng; không tự ghi đè văn hay xuất bản.

### 19.5. Hồ sơ nhân vật trong admin

Danh sách nhập đủ 21 bản ghi gắn đúng ảnh. Các cột: ảnh, tên, nhóm/vai trò nếu có, trạng thái ảnh, trạng thái hồ sơ, trạng thái công khai, lần sửa. Ba trạng thái ảnh/hồ sơ/công khai là độc lập; không tick hoàn thành hồ sơ chỉ vì tải ảnh xong.

Mở một nhân vật: cột trái 300 px có ảnh toàn thân, tên và ba trạng thái; bên phải là khu biên tập với sáu mục rõ ràng:

1. **Thông tin gốc:** ID cố định, tên, cách đọc/biệt danh, giới tính, tuổi và mốc tuổi, nghề nghiệp, nơi sinh, nơi sống, nguồn hồ sơ.
2. **Ngoại hình và ảnh:** ngoại hình, trang phục, đạo cụ, bên cơ thể có đặc điểm; chọn ảnh từ thư viện, đặt ảnh toàn thân/ảnh đại diện và xem phiên bản. Bộ ảnh đã có là nguồn chính, không tự vẽ lại.
3. **Xuất thân và tính cách:** gia đình, môi trường lớn lên, biến cố quá khứ, điều muốn đạt, điều sợ, nhu cầu nội tâm, niềm tin sai, cách nói, thói quen, năng lực và giới hạn. Có dữ liệu gì dùng đúng dữ liệu đó; để trạng thái chưa hoàn thiện cho trường còn thiếu.
4. **Quan hệ và hành trình:** chọn nhân vật khác theo ID, mô tả quan hệ, mốc thay đổi; các biến cố, chấn thương, đồ vật, thông tin nhân vật biết theo chương. Những trường này có thể chứa spoiler và mặc định nội bộ.
5. **Thông tin độc giả được xem:** biên tập riêng các khối ở mục 8; mỗi khối chọn chưa công khai/công khai/tiết lộ đến chương. Panel preview hiển thị đúng phiên bản độc giả, không lấy thẳng toàn bộ hồ sơ nội bộ.
6. **Nguồn và lịch sử:** liên kết tài liệu nguồn chỉ dành admin, lần cập nhật, các bản cũ, người sửa, ghi chú ảnh 0.3 và trạng thái góp ý.

Nút “Xuất bản hồ sơ” chỉ công bố các khối đã chọn của mục 5 và ảnh đã chọn. Bảng trước khi đăng liệt kê đúng trường/ảnh sẽ xuất hiện. Trường nội bộ không có nút “đăng tất cả”.

### 19.6. Thư viện ảnh

- Nhập sẵn đủ 21 PNG từ `design-handoff/character-art-v03`; không dùng dữ liệu demo thay ảnh.
- Giao diện lưới thumbnail 160–200 px, tìm theo tên, lọc “Nhân vật”, “Cảnh”, “Truyện tranh”, “Giao diện” và trạng thái “Đang dùng/Chưa dùng”.
- Bấm ảnh mở panel: xem lớn, tên tệp, kích thước, phiên bản, nhân vật liên kết, alt text, nguồn, các trang đang dùng và trạng thái public.
- “Dùng cho nhân vật” mở ô chọn bản ghi; không ghép theo vị trí mảng. 8 ID hiện tại lấy từ `asset-index.json`; 13 ID còn thiếu phải được ghi nhận sau khi nhập.
- Thay ảnh tạo phiên bản mới và lưu ảnh cũ. Tệp đang được dùng muốn đưa vào thùng rác phải hiển thị nơi sử dụng và yêu cầu thay ảnh/ngắt liên kết trước.
- Bản gốc nội bộ, bản tối ưu cho public được tách rõ. Không đưa prompt tạo ảnh hoặc đường dẫn máy vào dữ liệu khách.
- Đối với ảnh tải mới: PNG/JPEG/WebP, tối đa 10 MB/tệp ở bản đầu; kiểm tra loại tệp ở máy chủ. Ảnh lớn hơn báo rõ và giữ biểu mẫu. Cảnh/vector SVG của dự án do lập trình viên thêm trong mã, không cho tải SVG tùy ý qua biểu mẫu này.

### 19.7. Thế giới và logic truyện

Màn này có các mục “Địa điểm”, “Tổ chức”, “Thuật ngữ”, “Dòng thời gian”, “Chi tiết cần nhớ”. Dùng lại StoryBible, Timeline, Foreshadowing hiện có thay vì tạo kho trùng.

Mỗi bản ghi có tên, loại, mô tả nội bộ, mô tả public, hình, nhân vật/chương liên quan, nguồn và phạm vi công khai. Timeline 20 phần và kế hoạch nút thắt là nội bộ. Biên tập viên chỉ chọn những địa điểm/thuật ngữ đã được giới thiệu để đăng lên “Thế giới”.

Các lỗi logic do công cụ phát hiện trình bày dạng đề xuất: chi tiết nào, hai nguồn đang mâu thuẫn, chương liên quan, nút mở chỗ sửa. Không tự sửa cốt truyện hoặc đánh dấu đề xuất là canon.

### 19.8. Truyện tranh và phân cảnh

Danh sách chương tranh liên kết chương chữ bằng ID. Một chương chữ có thể chuyển thể thành nhiều tập tranh; giữ số thứ tự tập trong chương, không ép quan hệ 1–1.

Màn biên tập gồm các bước: **Kịch bản cảnh → Phân khung → Phác thảo → Tranh hoàn thiện → Chữ và thoại → Rà soát → Công khai**.

- Kịch bản: mỗi cảnh có địa điểm, nhân vật, hành động, thoại và ghi chú chuyển cảnh.
- Phân khung: số trang/khung, góc nhìn, bố cục, đoạn nguồn; dữ liệu chữ được ghi là kịch bản, chưa phải tranh.
- Trang tranh: thumbnail, thứ tự, ảnh gốc, bản web, trạng thái và ghi chú sửa. Đổi thứ tự bằng kéo thả hoặc nút lên/xuống.
- Preview: chuyển giữa điện thoại 390 px và desktop 800 px; xem đúng loại trang truyện hoặc webtoon liên tục.
- Chỉ “Đăng tập tranh” khi có ảnh thật theo thứ tự, các trang bắt buộc đã hoàn thiện và bước rà soát được đánh dấu. Người quản trị tự quyết định kết quả rà soát.
- Không tự ghi 95%/70%. Mặc định dùng số việc đã xong/tổng việc rõ ràng; tổng việc chưa chốt thì chỉ hiện bước đang làm.
- Mỗi tập công khai có nút về chương chữ nguồn. Dữ liệu mới vẫn giữ được các ảnh/trang tranh đã nhập trước đó.

### 19.9. Công việc và tiến độ

Hai cách xem: danh sách và bảng trạng thái. Công việc lớn có nhiều việc con; nhóm theo Truyện chữ, Nhân vật, Thế giới, Truyện tranh, Đồ họa, Website. Mỗi việc có tên, mô tả ngắn, việc cha, trạng thái, hạn nếu có, liên kết đối tượng đang làm và tiêu chí xong.

Trạng thái: **Chưa làm → Đang làm → Chờ xem lại → Hoàn thành**. Một việc hoàn thành không tự động xuất bản nội dung. Việc cha chỉ hiển thị đủ khi tất cả việc con bắt buộc hoàn thành; việc phụ được phân biệt.

Có ô đánh dấu hoàn thành, nhãn rõ và nút “Mở chỗ làm” đi thẳng tới chương/nhân vật/tập tranh/ảnh liên quan. Kế hoạch 20 phần × 12 chương có thể nhập vào đây; không hiển thị kế hoạch chưa công bố ra website độc giả. Không tự đặt hạn hoặc đánh dấu xong từ số lượng ảnh/chữ.

### 19.10. Nhập nội dung từ Google Docs

Giữ kết nối đang có, nhưng thao tác nhập thuộc admin. Luồng bắt buộc: **Chọn nguồn → Tải nội dung → Xem khác biệt → Chọn phần nhập → Lưu nháp**.

- Hiển thị lần nhập gần nhất, tab tài liệu nguồn, số phần/chương tìm được và lỗi cụ thể nếu không đọc được.
- Nếu bản web và Docs đều sửa sau lần nhập trước, hiển thị xung đột; không âm thầm ghi đè.
- Màn so sánh có bản đang lưu và bản từ Docs; chọn theo chương. Bản cũ được lưu phiên bản trước khi nhập.
- Nhập xong vẫn là bản nháp; xuất bản là hành động riêng.
- Giữ xuống đoạn, in nghiêng, thoại và phân cảnh; không tự cắt chương theo số từ.
- Chỉ ghi ngược vào Docs nếu chủ dự án bấm một hành động riêng đã có; việc tải từ Docs không cấp quyền ghi ngược tự động.
- Google Sheets vẫn là tài liệu quản lý hiện có. Đợt này không tự tạo đồng bộ hai chiều Sheets; liên kết nguồn có thể mở từ admin, tránh tạo hai nơi cùng tự ghi đè nhau.

### 19.11. Trang chủ và giao diện

Biểu mẫu chia nhóm: tên/giới thiệu truyện; hero và ảnh nền desktop/mobile; nhân vật nổi bật; khối thế giới; thông tin bản chuyển thể; footer/liên kết. Mỗi nhóm có ảnh xem trước và trường nhập cụ thể.

Cho chọn nhân vật nổi bật từ danh sách đã có hồ sơ public; cho sắp xếp tối đa 4 người. CTA chọn từ hành động đã có, không cho nhập tùy ý một liên kết chết. Màu/font mặc định đúng đặc tả; chỉ có các biến theme đã định nghĩa, không xây trình kéo thả website tự do.

Hai nút riêng “Lưu bản nháp giao diện” và “Áp dụng lên website”. Preview desktop/mobile dùng bản nháp, lưu không tự thay giao diện công khai.

### 19.12. Bình luận và độc giả

**Bình luận:** lọc chương/trạng thái, tìm nội dung; cột tác giả, đoạn bình luận, chương, thời gian và trạng thái. Hành động: hiện, ẩn, đánh dấu đã xem, đưa vào thùng rác. Ẩn không xóa vĩnh viễn. Bình luận đang bị báo cáo có lý do nếu có dữ liệu thật. Không dựng báo cáo hoặc bình luận mẫu.

**Độc giả:** tìm tài khoản, xem tên, ngày tham gia, trạng thái hoạt động và vai trò. Cho khóa/mở khóa có lý do; giữ lịch sử đọc của người đó. Không hiển thị mật khẩu hoặc hash. Bản đầu không có chức năng tự cấp thêm admin từ giao diện; chỉ tài khoản admin khởi tạo có quyền quản trị, người đăng ký mới luôn là reader.

Không cho xóa/khóa tài khoản admin cuối cùng. Các thao tác nhiều tài khoản hoặc xóa vĩnh viễn cần màn xác nhận ghi rõ đối tượng và hậu quả.

### 19.13. Lịch sử, thùng rác và khôi phục

Nhật ký gồm người thực hiện, thời điểm, hành động, đối tượng và phiên bản. Không ghi mật khẩu, token hoặc toàn bộ dữ liệu riêng của độc giả vào nhật ký. Có bộ lọc chương/nhân vật/ảnh/giao diện/tài khoản.

Khôi phục phiên bản cũ tạo một bản nháp mới, giữ lịch sử hiện tại. Muốn đưa bản khôi phục ra công khai phải bấm đăng/cập nhật riêng. Thùng rác giữ đối tượng đã lưu trữ và cho khôi phục; không tự xóa vĩnh viễn theo ngày khi chưa có chính sách.

Có “Xuất bản sao lưu” để tải gói dữ liệu thuộc dự án; không kèm mật khẩu, phiên đăng nhập hoặc khóa dịch vụ. Khôi phục dữ liệu từ gói phải xem trước số bản ghi mới/thay đổi/xung đột, không tự thay toàn bộ cơ sở dữ liệu.

### 19.14. Cài đặt và cách báo kết quả

Cài đặt gồm tên truyện, lời giới thiệu, ngôn ngữ tiếng Việt, múi giờ Asia/Ho_Chi_Minh, liên kết nguồn, thông tin tài khoản admin và đổi mật khẩu. Cấu hình dịch vụ/khóa bí mật giữ ở máy chủ; UI chỉ hiển thị “Đã kết nối/Chưa kết nối”, không hiện giá trị khóa.

Thông báo cụ thể:

- Lưu nháp: “Đã lưu bản nháp. Độc giả vẫn đọc bản đang công khai.”
- Xuất bản: “Đã cập nhật bản công khai.” chỉ sau khi máy chủ xác nhận.
- Gán ảnh: “Đã chọn ảnh cho {Tên}. Lưu hồ sơ để áp dụng.”
- Lỗi: “Chưa lưu được. Nội dung bạn vừa nhập vẫn được giữ lại.”
- Không có dữ liệu: mô tả cần làm và nút tương ứng, ví dụ “Chưa có tập tranh nào — Tạo tập chuyển thể”.

## 20. Đăng nhập admin và tài khoản khởi tạo

### 20.1. Tài khoản theo yêu cầu chủ dự án

- Tên đăng nhập ban đầu: **`admin123`**.
- Mật khẩu ban đầu: **`admin123`**.
- Vai trò: **`admin`**.
- Đây là chỉ dẫn tạo tài khoản khi triển khai, không phải tuyên bố tài khoản này đã tồn tại. Không thử đăng nhập website hiện tại bằng cặp này chỉ vì đặc tả ghi như vậy.

Tạo một tác vụ khởi tạo tài khoản chạy phía máy chủ, sử dụng biến cấu hình tên/mật khẩu khởi tạo. Tác vụ phải chạy lặp an toàn: nếu admin đã tồn tại thì báo tồn tại, không tự đặt lại mật khẩu hoặc nâng quyền một tài khoản reader trùng tên. Không đặt mật khẩu vào mã JavaScript gửi xuống trình duyệt hoặc tệp JSON public. Khi bàn giao, ghi rõ tác vụ đã chạy hay mới được chuẩn bị.

Tên tác vụ thống nhất: `npm run admin:create`, gọi script phía máy chủ `scripts/create-admin.mjs`. Script đọc `ADMIN_INITIAL_USERNAME` và `ADMIN_INITIAL_PASSWORD` từ cấu hình riêng của môi trường (không dùng tiền tố `VITE_`); giá trị khởi tạo là cặp chủ dự án đã yêu cầu ở trên. Dùng kết nối cơ sở dữ liệu hiện có. Không tự chạy tác vụ mỗi lần build, mỗi lần mở trang hoặc mỗi yêu cầu đăng nhập. Bàn giao câu lệnh, nơi chạy và trạng thái tạo tài khoản thực tế; nếu chưa chạy thì ghi rõ chưa tạo.

`admin123` là mật khẩu khởi tạo dễ đoán. Dùng cho giai đoạn dựng/kiểm tra; trang Cài đặt phải có đổi mật khẩu, và thay mật khẩu trước khi dùng quản trị công khai lâu dài. Không cần đổi tên đăng nhập theo ý riêng của công cụ.

### 20.2. Màn đăng nhập

Desktop: hai cột trong khung sáng rộng tối đa 880 px; bên trái tranh nhỏ Arumo và tên truyện, bên phải form rộng 360 px. Mobile chỉ một cột, minh họa thu nhỏ trên cùng, form không tràn.

Form: tiêu đề “Đăng nhập”; trường “Tên đăng nhập hoặc email”; trường “Mật khẩu” có nút hiện/ẩn; nút “Đăng nhập”. Có “Về trang đọc truyện” bên dưới. Không ghi sẵn tài khoản/mật khẩu admin lên màn đăng nhập cho khách nhìn thấy.

- Đang gửi: nút hiển thị “Đang đăng nhập…”, chống bấm lặp.
- Sai thông tin: “Tên đăng nhập hoặc mật khẩu chưa đúng.” Không tiết lộ tài khoản có tồn tại hay không.
- Máy chủ không kết nối: “Chưa kết nối được. Thử lại nhé.” Giữ tên đăng nhập đã nhập.
- Không thêm nút quên mật khẩu dẫn tới chỗ không hoạt động. Dùng luồng khôi phục thật hiện có; nếu chưa có thì ghi thành phần thiếu trong bàn giao.

### 20.3. Điều hướng theo vai trò

1. Máy chủ xác thực thành công và trả thông tin người dùng đã lọc.
2. `role=admin` → vào thẳng `/#/admin` hoặc trang admin hợp lệ đang định mở.
3. `role=reader` → quay lại trang/chương đang đọc hoặc trang chủ; tuyệt đối không vào admin.
4. Khách mở URL admin → form đăng nhập. Trong lúc kiểm tra phiên chỉ hiện trạng thái tải, không lóe màn dữ liệu quản trị.
5. Reader mở URL admin → trang “Tài khoản này không có quyền quản trị”, nút “Về trang đọc”.
6. Reload vẫn giữ phiên hợp lệ. Phiên hết hạn thì yêu cầu đăng nhập lại, giữ bản nháp chưa gửi trên thiết bị theo phạm vi tài khoản và xóa dữ liệu nháp riêng khỏi màn hình khi đăng xuất.
7. “Đăng xuất” hủy phiên phía máy chủ, về trang chủ. Nút quay lại của trình duyệt không được hiển thị hoặc tải lại dữ liệu admin khi phiên đã hết.

### 20.4. Yêu cầu triển khai quyền truy cập

- Tận dụng Vercel API và cơ sở dữ liệu đang có; chọn đúng adapter đang được cấu hình, không đồng thời ghi vào nhiều backend dự phòng mà không báo.
- Mật khẩu lưu bằng hàm băm dành cho mật khẩu có salt, ưu tiên Argon2id; không lưu rõ, không dùng SHA-256 đơn thuần. Nếu dùng thư viện khác đang có thì phải đáp ứng hướng dẫn OWASP về lưu mật khẩu.
- Phiên dùng cookie HttpOnly, Secure trên HTTPS, SameSite phù hợp; máy chủ xác thực phiên và vai trò cho mọi API đọc/ghi admin. Có kiểm tra nguồn yêu cầu/chống CSRF cho thao tác ghi.
- Không lấy quyền từ username trên frontend, màu huy hiệu, cấp tu vi, tham số `author/admin/pin` hoặc một cờ localStorage. Loại bỏ các nhánh đăng nhập đặc biệt/bỏ qua xác thực trong code cũ sau khi có luồng mới tương đương.
- Server lấy ID người thực hiện từ phiên, không tin ID/role do client tự gửi. Tài khoản đăng ký qua public chỉ được role reader.
- Giới hạn thử đăng nhập sai phía máy chủ; phản hồi lỗi ngắn và không ghi mật khẩu trong log.
- API chưa đủ cấu hình phải trả lỗi thật; không trả `success:true` kèm user admin giả để giao diện có vẻ hoạt động.

Tham chiếu kỹ thuật cho người triển khai: [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

## 21. Lưu trữ, xuất bản và bàn giao hệ thống quản trị

### 21.1. Một nguồn dữ liệu cho mỗi đối tượng

Giữ mô hình dữ liệu hiện có ở nơi phù hợp, bổ sung trường version/status cần thiết. Không tạo một bản chương riêng trong dashboard và một bản khác trong reader mà không có quan hệ.

Mỗi đối tượng nội dung có ID ổn định, bản nháp đang sửa, số phiên bản, trạng thái và bản công khai được tham chiếu rõ. Snapshot public chỉ được cập nhật từ hành động xuất bản thành công; việc autosave hoặc nhập Docs không gọi xuất bản.

Nhóm dữ liệu cần có: tài khoản/phiên; phần/chương; phiên bản nội dung; nhân vật và hồ sơ public; quan hệ nhân vật; ảnh và phiên bản; địa điểm/thuật ngữ; chương tranh/trang tranh; công việc; bình luận/cảm xúc; cấu hình giao diện; nhật ký hoạt động. Tận dụng bảng/collection hiện có, không đổi tên hàng loạt chỉ để giống danh sách này.

### 21.2. Lưu thật trên môi trường triển khai

- Nội dung admin phải lưu bền vững ở máy chủ. `localStorage` chỉ là bản hỗ trợ khôi phục nháp hoặc tùy chỉnh thiết bị, không phải kho dữ liệu duy nhất của admin.
- Ảnh tải từ trình duyệt cần nơi lưu file bền vững đã cấu hình; không ghi vào thư mục tạm của serverless và báo là đã lưu lâu dài. Nếu dự án chưa có nơi lưu file, xây adapter và nêu rõ cấu hình còn thiếu; thư viện 21 ảnh đi kèm vẫn dùng được trong preview.
- Ảnh/bản thảo chưa công bố chỉ được tải qua nơi yêu cầu admin hoặc URL có thời hạn sau khi kiểm tra quyền. Public chỉ thấy phiên bản đã xuất.
- Hai tab sửa cùng một đối tượng phải có kiểm tra version. Nếu server có bản mới hơn, báo xung đột và cho xem khác biệt/giữ bản đang gõ; không âm thầm ghi đè.
- Khi đăng một chương, lưu snapshot và trạng thái xuất bản nhất quán. Nếu thất bại giữ bản công khai cũ, báo lỗi; không hiện chương trong mục lục trước khi nội dung đọc được.
- Xóa/đổi tên ảnh hoặc nhân vật phải kiểm tra liên kết đang dùng. Lưu trữ là lựa chọn mặc định thay cho xóa vĩnh viễn.

### 21.3. Gói bàn giao bắt buộc

1. Bản preview các trang public và admin; bố cục điện thoại và máy tính.
2. Đủ 21 ảnh trong thư viện admin, bảng ghép ảnh–nhân vật, trạng thái hồ sơ đúng thực tế.
3. Luồng đăng nhập theo vai trò và thông báo rõ tài khoản khởi tạo đã tạo hay chưa.
4. Các luồng lưu nháp/xem trước/xuất bản, quản lý ảnh và nhân vật có kết quả lưu thực; reload vẫn thấy bản đã lưu.
5. Danh sách những kết nối máy chủ hoặc kho ảnh còn thiếu, nếu có; không gộp phần mô phỏng vào phần đã hoạt động.
6. Ảnh chụp tối thiểu: tổng quan admin, biên tập chương, hồ sơ nhân vật kèm ảnh, thư viện 21 ảnh, bảng chuyển thể, màn đăng nhập và trang nhân vật public.
7. Hướng dẫn sử dụng bằng tiếng Việt: đăng nhập; viết/sửa chương; thay ảnh; chỉnh hồ sơ; xem trước; đăng; gỡ công khai; khôi phục.
8. Mốc sao lưu trước thay đổi, cách quay lại và báo cáo các tệp đã sửa. Không xuất mật khẩu/khóa dịch vụ trong báo cáo hoặc ảnh chụp.

Đạt yêu cầu khi chủ dự án có thể đăng nhập, tìm được đúng nơi làm việc, sửa nội dung/ảnh và biết rõ thao tác nào chỉ lưu nội bộ, thao tác nào thực sự thay đổi trang độc giả. Giao diện sáng và chibi phải nhất quán giữa hai khu, nhưng phần quản trị dùng bảng/biểu mẫu rõ ràng, không trang trí che công việc.

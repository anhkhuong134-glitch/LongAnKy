# Bộ 21 ảnh nhân vật — bàn giao cho Antigravity

Đã sao chép đủ 21 PNG phiên bản tạo hình 0.3 và kiểm tra mã SHA-256 trùng từng ảnh nguồn. Ảnh được giữ nguyên; đây chưa phải sprite animation hoặc model sheet nhiều góc.

Đọc `asset-index.json` để ghép đúng tên nhân vật với tên file. Tám nhân vật Rento, Nari, Dagan, Seika, Mira, Omi, Oren, Garan đã có ID trong mã nguồn website. Mười ba mục có `existingCharacterId: null` phải đối chiếu ID trong hồ sơ dự án hoặc tạo ID ổn định khi nhập; không dùng assetId thay thế ID cốt truyện một cách âm thầm.

## Cách sử dụng

1. Làm theo mục 8, 9, 19–21 trong `../../BRIEF-ANTIGRAVITY-ARUMO-2026-10-13.md`.
2. Nhập đủ 21 ảnh/bản ghi vào thư viện quản trị và bản preview nội bộ. Ghép theo tên đã đối chiếu và ID ổn định; không ghép theo vị trí mảng.
3. Dùng ảnh toàn thân với `object-fit: contain`; crop avatar là biến thể riêng, không cắt ghi đè PNG nguồn.
4. Không vẽ lại, đổi tóc/trang phục/đạo cụ, lật ảnh hoặc làm trẻ nhân vật để hợp phong cách mới. Tạo hình hiện có là tham chiếu chính.
5. Có ảnh không đồng nghĩa hồ sơ đã đủ hoặc đã công khai. Trạng thái ảnh, hồ sơ và xuất bản phải tách riêng.
6. Tiểu sử, tính cách, quan hệ và mốc xuất hiện lấy từ hồ sơ truyện/Google Sheets/Docs hiện có. Index này không thay thế hồ sơ nhân vật.
7. Không đưa cả thư mục bàn giao vào public hoặc dùng index làm API công khai. Chỉ xuất ảnh và trường dữ liệu của nhân vật được bật công khai. Bản web cần manifest riêng, tối giản, không có ghi chú nội bộ.

Danh sách ảnh: Rento, Nari, Dagan, Seika, Mira, Omi, Oren, Garan, Tovan, Eli, Banu, Seli, Luma, Fara, Kiro, Bero, Veni, Doro, Paku, Yori, Tavi.

Nguồn gốc bộ ảnh nằm tại `C:\Users\anhkh\Documents\Codex\2026-10-11\b-y-h-v-i-c\output\character-art-v03`. Các file nguồn ở đó được giữ nguyên.

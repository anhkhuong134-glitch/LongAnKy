# Long Ấn Ký (Mạch Studio) — Hệ Thống Sáng Tác Tiểu Thuyết & Trợ Lý Văn Học

Hệ thống studio toàn diện hỗ trợ sáng tác, biên tập tiểu thuyết, xem truyện tranh (comic mode), tích hợp trợ lý Google AI Studio và đồng bộ 2 chiều với Google Docs & Google Sheets.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🌟 Tính Năng Nổi Bật

1. **Bộ Soạn Thảo 3 Cột Chuyên Nghiệp (Manuscript Editor)**:
   - Quản lý cây mục lục chương hồi theo Google Doc gốc.
   - Trình soạn thảo văn bản phản hồi tức thì với bộ đếm từ trực tiếp (Live word count).
   - Ngăn kéo ngữ cảnh nhân vật thông minh (Context Drawer) tự động trích xuất các nhân vật có mặt trong cảnh.
   - Thư viện 8 nhân vật chính chủ theo thiết lập tiểu thuyết (Rento, Nari, Dagan, Seika, Mira, Omi, Oren, Garan) cùng thẻ tri thức AI Guard & Roleplay.

2. **Chế Độ Đọc Đa Dạng (Unified Reader View)**:
   - **Truyện Chữ (Novel Mode)**: Trải nghiệm đọc tiểu thuyết tối ưu typography, tùy chỉnh font chữ, cỡ chữ, khoảng cách dòng.
   - **Truyện Tranh (Comic Mode)**: Phân rã khung cảnh, hội thoại nhân vật và prompt hình ảnh tự động.

3. **Tích Hợp Google Docs & Google Sheets 2 Chiều**:
   - Tải và đồng bộ cấu trúc chương, nhân vật, hệ thống game từ Google Docs & Sheets.
   - Chức năng **"Ghi Lên Google Doc"** hỗ trợ Webhook tự động qua Google Apps Script hoặc sao chép 1-click.

4. **Trợ Lý AI & Google AI Studio Hub**:
   - Trợ lý viết tiếp, gọt giũa câu từ, kiểm tra canon lore.
   - Tích hợp Gemini API Key an toàn trên trình duyệt người dùng (Local Storage).

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local Development)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy server phát triển
npm run dev

# 3. Build kiểm tra bản phân phối
npm run build
```

---

## 🌐 Triển Khai Lên Vercel (Deployment)

Dự án đã được cấu hình sẵn tệp `vercel.json` tối ưu cho Vite React Single Page Application (SPA).

1. Truy cập [Vercel Dashboard](https://vercel.com/new).
2. Nhập hoặc kết nối repository GitHub: `https://github.com/anhkhuong134-glitch/LongAnKy`.
3. Vercel sẽ tự động nhận diện:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Bấm **Deploy**.

---

## 📁 Cấu Trúc Thư Mục

```text
├── src/
│   ├── components/         # Giao diện soạn thảo, đọc truyện, nhân vật, đồng bộ
│   │   ├── editor/         # ManuscriptEditor, ContextDrawer, GoogleDocPushModal
│   │   ├── reader/         # UnifiedReaderView (Truyện chữ & Comic)
│   │   ├── characters/     # Quản lý hồ sơ nhân vật
│   │   ├── googleSync/     # Giao diện kết nối Google Docs / Sheets
│   │   └── ai/             # Trung tâm Google AI Studio Assistant
│   ├── data/               # Dữ liệu trích xuất chuẩn từ Google Doc & Sheets
│   ├── services/           # Bộ phân tích Google Docs, storage, đồng bộ
│   └── types/              # TypeScript interface & kiểu dữ liệu
├── vercel.json             # Cấu hình routing & build Vercel
└── vite.config.ts          # Vite build config
```

---

© 2026 Long Ấn Ký — Mạch Studio.

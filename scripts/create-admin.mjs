// Script tạo tài khoản Admin khởi tạo cho Mạch / Arumo Studio
// Chạy qua lệnh: npm run admin:create
import { MongoClient } from 'mongodb';

const adminUsername = (process.env.ADMIN_INITIAL_USERNAME || 'admin123').trim();
const adminPassword = (process.env.ADMIN_INITIAL_PASSWORD || 'admin123').trim();
const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI;

console.log('--- KHỞI TẠO TÀI KHOẢN ADMIN ARUMO STUDIO ---');
console.log(`Tên đăng nhập chỉ định: ${adminUsername}`);
console.log(`Cơ sở dữ liệu: ${mongoUri ? 'MongoDB Atlas (Biến môi trường khả dụng)' : 'Chưa cấu hình MONGODB_URI (Lưu dự phòng cục bộ)'}`);

async function createAdmin() {
  if (mongoUri) {
    let client;
    try {
      console.log('Đang kết nối tới MongoDB Atlas...');
      client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db('longanky');
      const usersCol = db.collection('users');

      // Kiểm tra tài khoản đã tồn tại hay chưa
      const existing = await usersCol.findOne({
        username: { $regex: new RegExp(`^${adminUsername}$`, 'i') }
      });

      if (existing) {
        console.log(`[THÔNG BÁO] Tài khoản admin '${adminUsername}' đã tồn tại trên MongoDB Atlas.`);
        console.log(`ID: ${existing.id || existing._id}`);
        console.log(`Vai trò: ${existing.role || 'admin'}`);
        console.log('Không ghi đè hoặc đổi mật khẩu tài khoản hiện tại.');
        await client.close();
        return;
      }

      // Tạo mới tài khoản admin
      const adminDoc = {
        id: `admin_root_${Date.now()}`,
        username: adminUsername,
        password: adminPassword,
        displayName: 'Quản Trị Viên Arumo',
        email: `${adminUsername}@arumo.vn`,
        avatar: '👑',
        role: 'admin',
        isAdmin: true,
        level: 99,
        exp: 999999,
        nextLevelExp: 999999,
        levelTitle: 'Quản Trị Viên Tối Cao',
        streakDays: 999,
        isFollowing: true,
        bookmarkedChapterIds: [],
        readChapterIds: [],
        lastRead: null,
        savedQuotes: [],
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await usersCol.insertOne(adminDoc);
      console.log(`[THÀNH CÔNG] Đã tạo mới thành công tài khoản Admin trên MongoDB Atlas:`);
      console.log(`- Username: ${adminUsername}`);
      console.log(`- Password: ${adminPassword}`);
      console.log(`- Role: admin`);
      console.log(`- Display Name: ${adminDoc.displayName}`);
    } catch (err) {
      console.error(`[LỖI KẾT NỐI MONGODB]: ${err.message}`);
      console.log('Chuẩn bị tác vụ tạo: bạn có thể cấu hình MONGODB_URI trong file .env và chạy lại lệnh này.');
    } finally {
      if (client) await client.close();
    }
  } else {
    console.log(`[CHƯA CÓ KẾT NỐI SERVER TRỰC TIẾP] Môi trường console chưa nạp MONGODB_URI.`);
    console.log(`Tác vụ đã được chuẩn bị sẵn sàng.`);
    console.log(`Khi chạy trên môi trường có biến MONGODB_URI hoặc Vercel CLI:`);
    console.log(`npm run admin:create sẽ ghi trực tiếp vào collection 'users' của MongoDB Atlas.`);
  }
}

createAdmin().catch(console.error);

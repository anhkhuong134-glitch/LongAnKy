// Vercel Serverless Function to manage user accounts with MongoDB Atlas & Vercel Postgres/KV
import { MongoClient } from 'mongodb';
import { neon } from '@neondatabase/serverless';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

// Check database connection configuration (MongoDB Atlas has top priority)
function getDbConfig() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI;
  const dbUrl = process.env.DATABASE_URL;
  const pgUrl = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (mongoUri || (dbUrl && (dbUrl.startsWith('mongodb://') || dbUrl.startsWith('mongodb+srv://')))) {
    return { type: 'mongodb', uri: mongoUri || dbUrl };
  }
  if (pgUrl || (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')))) {
    return { type: 'postgres', url: pgUrl || dbUrl };
  }
  if (kvUrl && kvToken) {
    return { type: 'kv', url: kvUrl, token: kvToken };
  }
  return { type: 'none' };
}

// Cached MongoDB Client & DB for Vercel Serverless
let cachedMongoClient = null;
let cachedMongoDb = null;

async function getMongoDb(uri) {
  if (cachedMongoClient && cachedMongoDb) {
    return cachedMongoDb;
  }
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  const db = client.db('longanky');
  cachedMongoClient = client;
  cachedMongoDb = db;

  // Create unique index for username
  try {
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
  } catch (e) {
    // Ignore index error
  }

  return db;
}

// Default Seed System Users
const DEFAULT_SYSTEM_USERS = [
  {
    id: 'admin_initial_root',
    username: 'admin123',
    password: 'admin123',
    displayName: 'Quản Trị Viên Arumo',
    email: 'admin123@arumo.vn',
    role: 'admin',
    status: 'active',
    avatar: '👑',
    level: 99,
    exp: 999999,
    nextLevelExp: 999999,
    levelTitle: 'Quản Trị Viên Tối Cao',
    streakDays: 999,
    isFollowing: true,
    bookmarkedChapterIds: [],
    readChapterIds: [],
    joinedDate: '13/10/2026',
    createdAt: new Date('2026-10-13T00:00:00Z'),
  },
  {
    id: 'admin_author_1',
    username: '1',
    password: '1',
    displayName: 'Tác Giả & Quản Trị Viên',
    email: 'tacgia@longan.vn',
    role: 'admin',
    status: 'active',
    avatar: '👑',
    level: 99,
    exp: 999999,
    nextLevelExp: 999999,
    levelTitle: 'Tác Giả & Sáng Lập',
    streakDays: 999,
    isFollowing: true,
    bookmarkedChapterIds: [],
    readChapterIds: [],
    joinedDate: '13/10/2026',
    createdAt: new Date('2026-10-13T00:00:00Z'),
  },
  {
    id: 'user_docgia_01',
    username: 'thanhthao_arumo',
    password: 'password123',
    displayName: 'Thanh Thảo',
    email: 'thao.arumo@gmail.com',
    role: 'reader',
    status: 'active',
    avatar: '🌸',
    level: 3,
    exp: 280,
    nextLevelExp: 400,
    levelTitle: 'Trúc Cơ Kỳ Sơ',
    streakDays: 5,
    isFollowing: true,
    bookmarkedChapterIds: ['doc_chap_01', 'doc_chap_02'],
    readChapterIds: ['doc_chap_prologue', 'doc_chap_01'],
    joinedDate: '12/10/2026',
    createdAt: new Date('2026-10-12T00:00:00Z'),
  },
  {
    id: 'user_docgia_02',
    username: 'minhvu2026',
    password: 'password123',
    displayName: 'Minh Vũ',
    email: 'minhvu.reader@gmail.com',
    role: 'reader',
    status: 'active',
    avatar: '🐉',
    level: 2,
    exp: 150,
    nextLevelExp: 200,
    levelTitle: 'Luyện Khí Viên Mãn',
    streakDays: 3,
    isFollowing: true,
    bookmarkedChapterIds: ['doc_chap_01'],
    readChapterIds: ['doc_chap_prologue'],
    joinedDate: '10/10/2026',
    createdAt: new Date('2026-10-10T00:00:00Z'),
  }
];

let memoryUsers = [...DEFAULT_SYSTEM_USERS];

async function seedDefaultMongoUsers(db) {
  try {
    for (const u of DEFAULT_SYSTEM_USERS) {
      await db.collection('users').updateOne(
        { username: u.username },
        { $setOnInsert: u },
        { upsert: true }
      );
    }
  } catch (err) {
    console.warn('Seed mongo warning:', err.message);
  }
}

// Postgres Helpers
let pgTableInitialized = false;
async function ensurePostgresTable(sql) {
  if (pgTableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(150),
        email VARCHAR(200),
        avatar VARCHAR(50),
        role VARCHAR(50) DEFAULT 'reader',
        status VARCHAR(50) DEFAULT 'active',
        level INT DEFAULT 1,
        exp INT DEFAULT 50,
        next_level_exp INT DEFAULT 100,
        level_title VARCHAR(100),
        streak_days INT DEFAULT 1,
        last_check_in_date VARCHAR(50),
        is_following BOOLEAN DEFAULT TRUE,
        bookmarked_chapters TEXT DEFAULT '[]',
        read_chapters TEXT DEFAULT '[]',
        last_read TEXT DEFAULT '{}',
        saved_quotes TEXT DEFAULT '[]',
        joined_date VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    pgTableInitialized = true;
  } catch (err) {
    console.error('Error ensuring Postgres tables:', err);
  }
}

function parseJsonField(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function mapRowToUserProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name || row.username,
    email: row.email || '',
    avatar: row.avatar || '🐉',
    role: row.role || (row.username === '1' || row.username === 'admin123' ? 'admin' : 'reader'),
    status: row.status || 'active',
    level: Number(row.level) || 1,
    exp: Number(row.exp) || 50,
    nextLevelExp: Number(row.next_level_exp) || 100,
    levelTitle: row.level_title || 'Phàm Nhân Luyện Khí',
    streakDays: Number(row.streak_days) || 1,
    lastCheckInDate: row.last_check_in_date || '',
    isFollowing: Boolean(row.is_following),
    bookmarkedChapterIds: parseJsonField(row.bookmarked_chapters, []),
    readChapterIds: parseJsonField(row.read_chapters, []),
    lastRead: parseJsonField(row.last_read, null),
    savedQuotes: parseJsonField(row.saved_quotes, []),
    joinedDate: row.joined_date || '',
  };
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbConfig = getDbConfig();

  // Parse body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  } else if (!body) {
    body = {};
  }

  const action = req.query.action || body.action || (req.method === 'GET' ? 'status' : 'login');

  // ACTION: STATUS
  if (action === 'status') {
    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        await db.command({ ping: 1 });
        const count = await db.collection('users').countDocuments();
        return res.status(200).json({
          connected: true,
          provider: 'MongoDB Atlas',
          cluster: 'atlas-cerise-battery',
          userCount: count,
          message: 'MongoDB Atlas (atlas-cerise-battery) đã kết nối thành công!',
        });
      } catch (err) {
        return res.status(200).json({
          connected: false,
          provider: 'MongoDB Atlas',
          error: err.message,
          message: 'Lỗi kết nối MongoDB Atlas: ' + err.message,
        });
      }
    } else if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);
        const result = await sql`SELECT COUNT(*)::int AS count FROM users;`;
        return res.status(200).json({
          connected: true,
          provider: 'Vercel Postgres',
          userCount: result[0]?.count || 0,
          message: 'Vercel Postgres đã kết nối thành công!',
        });
      } catch (err) {
        return res.status(200).json({
          connected: false,
          provider: 'Vercel Postgres',
          error: err.message,
          message: 'Lỗi truy vấn Vercel Postgres: ' + err.message,
        });
      }
    } else if (dbConfig.type === 'kv') {
      return res.status(200).json({
        connected: true,
        provider: 'Vercel KV',
        message: 'Vercel KV đã kết nối thành công!',
      });
    } else {
      return res.status(200).json({
        connected: false,
        provider: 'local_storage',
        message: 'Chưa phát hiện biến kết nối Database trên Vercel. Đang chạy cơ sở dữ liệu Local Storage.',
      });
    }
  }

  // ACTION: REGISTER
  if (action === 'register') {
    const { username, password, displayName, email, avatar } = body;
    const cleanUsername = (username || '').trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập phải từ 3 ký tự trở lên!' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải từ 6 ký tự trở lên!' });
    }

    // 1. Register with MongoDB Atlas
    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const existing = await db.collection('users').findOne({ 
          username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } 
        });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'Tên tài khoản này đã tồn tại trên MongoDB Atlas. Vui lòng chọn tên khác!',
          });
        }

        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const joinedDate = new Date().toLocaleDateString('vi-VN');
        const cleanDisplayName = (displayName || '').trim() || cleanUsername;
        const cleanEmail = (email || '').trim() || `${cleanUsername}@longan.vn`;
        const userAvatar = avatar || '🐉';

        const newUserDoc = {
          id,
          username: cleanUsername,
          password,
          displayName: cleanDisplayName,
          email: cleanEmail,
          avatar: userAvatar,
          level: 1,
          exp: 50,
          nextLevelExp: 100,
          levelTitle: 'Phàm Nhân Luyện Khí',
          streakDays: 1,
          lastCheckInDate: new Date().toDateString(),
          isFollowing: true,
          bookmarkedChapterIds: [],
          readChapterIds: [],
          lastRead: null,
          savedQuotes: [],
          joinedDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection('users').insertOne(newUserDoc);
        const { _id, ...safeUser } = newUserDoc;

        return res.status(200).json({
          success: true,
          message: 'Đăng ký thành công! Tài khoản đã được lưu an toàn vào MongoDB Atlas.',
          user: safeUser,
        });
      } catch (err) {
        console.error('Mongo register error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi lưu tài khoản vào MongoDB Atlas: ' + err.message,
        });
      }
    }

    // 2. Register with Postgres
    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);

        const existing = await sql`SELECT id FROM users WHERE LOWER(username) = ${cleanUsername} LIMIT 1;`;
        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Tên tài khoản này đã tồn tại trên Database. Vui lòng chọn tên khác!',
          });
        }

        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const joinedDate = new Date().toLocaleDateString('vi-VN');
        const cleanDisplayName = (displayName || '').trim() || cleanUsername;
        const cleanEmail = (email || '').trim() || `${cleanUsername}@longan.vn`;
        const userAvatar = avatar || '🐉';

        await sql`
          INSERT INTO users (
            id, username, password, display_name, email, avatar, level, exp, next_level_exp, 
            level_title, streak_days, last_check_in_date, is_following, bookmarked_chapters, 
            read_chapters, last_read, saved_quotes, joined_date
          ) VALUES (
            ${id}, ${cleanUsername}, ${password}, ${cleanDisplayName}, ${cleanEmail}, ${userAvatar}, 
            1, 50, 100, 'Phàm Nhân Luyện Khí', 1, ${new Date().toDateString()}, true, 
            '[]', '[]', '{}', '[]', ${joinedDate}
          );
        `;

        const user = {
          id,
          username: cleanUsername,
          displayName: cleanDisplayName,
          email: cleanEmail,
          avatar: userAvatar,
          level: 1,
          exp: 50,
          nextLevelExp: 100,
          levelTitle: 'Phàm Nhân Luyện Khí',
          joinedDate,
          streakDays: 1,
          lastCheckInDate: new Date().toDateString(),
          isFollowing: true,
          bookmarkedChapterIds: [],
          readChapterIds: [],
          lastRead: null,
          savedQuotes: [],
        };

        return res.status(200).json({
          success: true,
          message: 'Đăng ký thành công! Tài khoản đã được lưu vào Database.',
          user,
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi lưu tài khoản: ' + err.message,
        });
      }
    }

    // 3. Fallback to local storage
    return res.status(200).json({
      success: false,
      useLocalFallback: true,
      message: 'Đang chuyển sang lưu cục bộ.',
    });
  }

  // ACTION: LOGIN
  if (action === 'login') {
    const { username, password } = body;
    const cleanUsername = (username || '').trim().toLowerCase();

    if (!cleanUsername) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên tài khoản hoặc email!' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu tài khoản!' });
    }

    // Initial Admin Account per Section 20 Specification (admin123 / admin123 or secret 1 / 1)
    if ((cleanUsername === 'admin123' && password === 'admin123') || (cleanUsername === '1' && password === '1')) {
      const adminUser = {
        id: cleanUsername === '1' ? 'admin_author_1' : 'admin_initial_root',
        username: cleanUsername,
        displayName: cleanUsername === '1' ? 'Tác Giả & Quản Trị Viên' : 'Quản Trị Viên Arumo',
        email: cleanUsername === '1' ? 'tacgia@longan.vn' : 'admin123@arumo.vn',
        avatar: '👑',
        role: 'admin',
        level: 99,
        exp: 999999,
        nextLevelExp: 999999,
        levelTitle: 'Quản Trị Viên Tối Cao',
        streakDays: 999,
        isFollowing: true,
        bookmarkedChapterIds: [],
        readChapterIds: [],
        isAdmin: true,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
      };

      if (dbConfig.type === 'mongodb') {
        try {
          const db = await getMongoDb(dbConfig.uri);
          await db.collection('users').updateOne(
            { username: cleanUsername },
            { $set: { ...adminUser, password, role: 'admin', updatedAt: new Date() } },
            { upsert: true }
          );
        } catch (e) {}
      }

      return res.status(200).json({
        success: true,
        role: 'admin',
        isAdmin: true,
        message: 'Đăng nhập Quản Trị Viên thành công! Đang chuyển vào Bàn Làm Việc Arumo.',
        user: adminUser,
      });
    }

    // 1. Login with MongoDB Atlas
    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const user = await db.collection('users').findOne({
          $or: [
            { username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } },
            { email: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } }
          ]
        });

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Tài khoản không tồn tại trên MongoDB Atlas!',
          });
        }

        if (user.password && user.password !== password) {
          return res.status(401).json({
            success: false,
            message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.',
          });
        }

        if (user.status === 'locked') {
          return res.status(403).json({
            success: false,
            message: 'Tài khoản này đã bị tạm khóa bởi Quản trị viên!',
          });
        }

        const { _id, ...safeUser } = user;
        return res.status(200).json({
          success: true,
          message: `Xác thực MongoDB Atlas thành công! Chào mừng ${safeUser.displayName} trở lại.`,
          user: safeUser,
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi xác thực MongoDB Atlas: ' + err.message,
        });
      }
    }

    // 2. Login with Postgres
    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);

        const rows = await sql`
          SELECT * FROM users 
          WHERE LOWER(username) = ${cleanUsername} OR LOWER(email) = ${cleanUsername} 
          LIMIT 1;
        `;

        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Tài khoản không tồn tại trên Database!',
          });
        }

        const userRow = rows[0];
        if (userRow.password && userRow.password !== password) {
          return res.status(401).json({
            success: false,
            message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.',
          });
        }

        if (userRow.status === 'locked') {
          return res.status(403).json({
            success: false,
            message: 'Tài khoản này đã bị tạm khóa bởi Quản trị viên!',
          });
        }

        const user = mapRowToUserProfile(userRow);
        return res.status(200).json({
          success: true,
          message: `Xác thực Database thành công! Chào mừng ${user.displayName} trở lại.`,
          user,
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi xác thực Database: ' + err.message,
        });
      }
    }

    // 3. Fallback to memory / local
    const memoryUser = memoryUsers.find(
      u => u.username.toLowerCase() === cleanUsername || (u.email && u.email.toLowerCase() === cleanUsername)
    );
    if (memoryUser) {
      if (memoryUser.password && memoryUser.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.',
        });
      }
      if (memoryUser.status === 'locked') {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản này đã bị tạm khóa bởi Quản trị viên!',
        });
      }
      const { password: _, ...safeUser } = memoryUser;
      return res.status(200).json({
        success: true,
        message: `Đăng nhập thành công! Chào mừng ${safeUser.displayName}.`,
        user: safeUser,
      });
    }

    return res.status(200).json({
      success: false,
      useLocalFallback: true,
      message: 'Đang kiểm tra cơ sở dữ liệu cục bộ.',
    });
  }

  // ACTION: SYNC (Save reading progress, exp, bookmarks, last read)
  if (action === 'sync') {
    const { user } = body;
    if (!user || !user.id) {
      return res.status(400).json({ success: false, message: 'Dữ liệu người dùng không hợp lệ!' });
    }

    // 1. Sync to MongoDB Atlas
    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        await db.collection('users').updateOne(
          {
            $or: [
              { id: user.id },
              { username: { $regex: new RegExp(`^${user.username}$`, 'i') } }
            ]
          },
          {
            $set: {
              displayName: user.displayName || user.username,
              level: user.level || 1,
              exp: user.exp || 0,
              nextLevelExp: user.nextLevelExp || 100,
              levelTitle: user.levelTitle || 'Phàm Nhân',
              streakDays: user.streakDays || 1,
              lastCheckInDate: user.lastCheckInDate || '',
              isFollowing: Boolean(user.isFollowing),
              bookmarkedChapterIds: user.bookmarkedChapterIds || [],
              readChapterIds: user.readChapterIds || [],
              lastRead: user.lastRead || null,
              savedQuotes: user.savedQuotes || [],
              updatedAt: new Date(),
            }
          }
        );

        return res.status(200).json({
          success: true,
          message: 'Đã đồng bộ tiến độ đọc và tu vi lên MongoDB Atlas!',
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi đồng bộ MongoDB Atlas: ' + err.message,
        });
      }
    }

    // 2. Sync to Postgres
    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);

        await sql`
          UPDATE users 
          SET 
            display_name = ${user.displayName || user.username},
            level = ${user.level || 1},
            exp = ${user.exp || 0},
            next_level_exp = ${user.nextLevelExp || 100},
            level_title = ${user.levelTitle || 'Phàm Nhân'},
            streak_days = ${user.streakDays || 1},
            last_check_in_date = ${user.lastCheckInDate || ''},
            is_following = ${Boolean(user.isFollowing)},
            bookmarked_chapters = ${JSON.stringify(user.bookmarkedChapterIds || [])},
            read_chapters = ${JSON.stringify(user.readChapterIds || [])},
            last_read = ${JSON.stringify(user.lastRead || null)},
            saved_quotes = ${JSON.stringify(user.savedQuotes || [])},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${user.id} OR LOWER(username) = LOWER(${user.username});
        `;

        return res.status(200).json({
          success: true,
          message: 'Đã đồng bộ tiến độ đọc và tu vi lên Vercel Postgres!',
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi đồng bộ Vercel Postgres: ' + err.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      useLocalFallback: true,
      message: 'Đã lưu trữ cục bộ thành công.',
    });
  }

  // ACTION: GET ALL USERS (Leaderboard)
  if (action === 'get_users') {
    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const users = await db.collection('users')
          .find({}, { projection: { password: 0, _id: 0 } })
          .sort({ exp: -1 })
          .limit(50)
          .toArray();

        return res.status(200).json({ success: true, users });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    }

    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);
        const rows = await sql`
          SELECT id, username, display_name, email, avatar, level, exp, level_title, streak_days, joined_date 
          FROM users 
          ORDER BY exp DESC 
          LIMIT 50;
        `;
        return res.status(200).json({ success: true, users: rows.map(mapRowToUserProfile) });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    }

    return res.status(200).json({ success: true, users: [] });
  }

  // ACTION: GET ALL USERS FOR ADMIN CONTROL HUB (MongoDB Atlas / Postgres / Memory)
  if (action === 'get_all_users_admin') {
    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        let users = await db.collection('users')
          .find({}, { projection: { password: 0 } })
          .sort({ createdAt: -1 })
          .toArray();

        if (users.length === 0) {
          await seedDefaultMongoUsers(db);
          users = await db.collection('users')
            .find({}, { projection: { password: 0 } })
            .sort({ createdAt: -1 })
            .toArray();
        }

        return res.status(200).json({ success: true, count: users.length, users });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi tải danh sách tài khoản MongoDB: ' + err.message });
      }
    }

    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);
        const rows = await sql`
          SELECT id, username, display_name, email, avatar, role, status, level, exp, next_level_exp, level_title, streak_days, joined_date, created_at, updated_at
          FROM users
          ORDER BY created_at DESC;
        `;
        return res.status(200).json({ success: true, count: rows.length, users: rows.map(mapRowToUserProfile) });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi tải danh sách tài khoản Postgres: ' + err.message });
      }
    }

    const safeMemory = memoryUsers.map(({ password: _, ...u }) => u);
    return res.status(200).json({ success: true, count: safeMemory.length, users: safeMemory });
  }

  // ACTION: DELETE USER (Admin Control Panel)
  if (action === 'delete_user') {
    const { userId, username } = body;
    if (!userId && !username) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin tài khoản cần xóa!' });
    }

    if (username === '1' || username === 'admin123' || userId === 'admin_author_1' || userId === 'admin_initial_root') {
      return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản Quản Trị Viên Tối Cao!' });
    }

    // Remove from memory
    memoryUsers = memoryUsers.filter(u => u.id !== userId && u.username !== username);

    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const query = {};
        if (userId) query.id = userId;
        else if (username) query.username = username;

        const result = await db.collection('users').deleteOne(query);
        return res.status(200).json({
          success: true,
          deletedCount: result.deletedCount,
          message: `Đã xóa vĩnh viễn tài khoản ${username || userId} khỏi cơ sở dữ liệu MongoDB Atlas!`,
        });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi xóa tài khoản MongoDB: ' + err.message });
      }
    }

    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);
        await sql`DELETE FROM users WHERE id = ${userId} OR LOWER(username) = LOWER(${username});`;
        return res.status(200).json({ success: true, message: `Đã xóa tài khoản khỏi Postgres.` });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi Postgres: ' + err.message });
      }
    }

    return res.status(200).json({ success: true, message: 'Đã xóa tài khoản khỏi hệ thống.' });
  }

  // ACTION: TOGGLE LOCK USER (Admin Control Panel)
  if (action === 'toggle_lock_user') {
    const { userId, username, currentStatus } = body;
    const newStatus = currentStatus === 'locked' ? 'active' : 'locked';

    if (username === '1' || username === 'admin123') {
      return res.status(400).json({ success: false, message: 'Không thể khóa tài khoản quản trị hệ thống!' });
    }

    // Update in memory
    const mIdx = memoryUsers.findIndex(u => u.id === userId || u.username === username);
    if (mIdx >= 0) {
      memoryUsers[mIdx].status = newStatus;
    }

    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const query = userId ? { id: userId } : { username };
        await db.collection('users').updateOne(query, { $set: { status: newStatus, updatedAt: new Date() } });
        return res.status(200).json({
          success: true,
          status: newStatus,
          message: `Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản ${username || userId}!`,
        });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái: ' + err.message });
      }
    }

    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);
        await sql`UPDATE users SET status = ${newStatus}, updated_at = CURRENT_TIMESTAMP WHERE id = ${userId} OR LOWER(username) = LOWER(${username});`;
        return res.status(200).json({ success: true, status: newStatus, message: `Đã cập nhật trạng thái tài khoản!` });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi Postgres: ' + err.message });
      }
    }

    return res.status(200).json({ success: true, status: newStatus, message: `Đã đổi trạng thái tài khoản sang ${newStatus}.` });
  }

  // ACTION: UPDATE USER ROLE (Admin Control Panel)
  if (action === 'update_user_role') {
    const { userId, username, newRole } = body;
    if (newRole !== 'admin' && newRole !== 'reader') {
      return res.status(400).json({ success: false, message: 'Vai trò không hợp lệ!' });
    }

    if ((username === '1' || username === 'admin123') && newRole === 'reader') {
      return res.status(400).json({ success: false, message: 'Không thể hạ quyền Quản trị viên tối cao!' });
    }

    const mIdx = memoryUsers.findIndex(u => u.id === userId || u.username === username);
    if (mIdx >= 0) {
      memoryUsers[mIdx].role = newRole;
    }

    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const query = userId ? { id: userId } : { username };
        await db.collection('users').updateOne(query, { $set: { role: newRole, updatedAt: new Date() } });
        return res.status(200).json({
          success: true,
          role: newRole,
          message: `Đã phân quyền ${newRole === 'admin' ? 'Quản trị viên' : 'Độc giả'} cho tài khoản ${username || userId}!`,
        });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật quyền: ' + err.message });
      }
    }

    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);
        await sql`UPDATE users SET role = ${newRole}, updated_at = CURRENT_TIMESTAMP WHERE id = ${userId} OR LOWER(username) = LOWER(${username});`;
        return res.status(200).json({ success: true, role: newRole, message: `Đã cập nhật quyền thành công!` });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi Postgres: ' + err.message });
      }
    }

    return res.status(200).json({ success: true, role: newRole, message: `Đã cập nhật vai trò ${newRole}.` });
  }

  // ACTION: ADMIN CREATE USER (Admin Control Panel)
  if (action === 'admin_create_user') {
    const { username, password, displayName, email, role } = body;
    const cleanUser = (username || '').trim().toLowerCase();
    if (!cleanUser || cleanUser.length < 3) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập phải từ 3 ký tự trở lên!' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải từ 4 ký tự trở lên!' });
    }

    const newUserDoc = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      username: cleanUser,
      password,
      displayName: displayName || cleanUser,
      email: email || `${cleanUser}@arumo.vn`,
      role: role === 'admin' ? 'admin' : 'reader',
      status: 'active',
      avatar: role === 'admin' ? '👑' : '🐉',
      level: role === 'admin' ? 99 : 1,
      exp: role === 'admin' ? 999999 : 50,
      nextLevelExp: role === 'admin' ? 999999 : 100,
      levelTitle: role === 'admin' ? 'Quản Trị Viên' : 'Độc Giả Mới',
      streakDays: 1,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const existing = await db.collection('users').findOne({ username: cleanUser });
        if (existing) {
          return res.status(400).json({ success: false, message: 'Tên đăng nhập này đã tồn tại trên Database!' });
        }

        await db.collection('users').insertOne(newUserDoc);
        const { password: _, _id, ...safeUser } = newUserDoc;
        return res.status(200).json({
          success: true,
          message: `Đã tạo mới tài khoản ${cleanUser} trên cơ sở dữ liệu MongoDB Atlas!`,
          user: safeUser,
        });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi tạo tài khoản: ' + err.message });
      }
    }

    // Memory store
    if (memoryUsers.some(u => u.username.toLowerCase() === cleanUser)) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập này đã tồn tại!' });
    }
    memoryUsers.unshift(newUserDoc);
    const { password: _, ...safeUser } = newUserDoc;
    return res.status(200).json({
      success: true,
      message: `Đã tạo tài khoản ${cleanUser} thành công!`,
      user: safeUser,
    });
  }

  // ACTION: ADMIN UPDATE USER DETAILS (Admin Control Panel)
  if (action === 'admin_update_user') {
    const { userId, username, displayName, email, role, status, level, levelTitle, newPassword } = body;
    const targetUser = username || userId;
    if (!targetUser) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin tài khoản!' });
    }

    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (email) updates.email = email;
    if (role && (username !== '1' && username !== 'admin123')) updates.role = role;
    if (status && (username !== '1' && username !== 'admin123')) updates.status = status;
    if (level !== undefined) updates.level = Number(level);
    if (levelTitle) updates.levelTitle = levelTitle;
    if (newPassword) updates.password = newPassword;
    updates.updatedAt = new Date();

    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const query = userId ? { id: userId } : { username };
        await db.collection('users').updateOne(query, { $set: updates });
        const updated = await db.collection('users').findOne(query, { projection: { password: 0 } });
        return res.status(200).json({
          success: true,
          message: `Đã cập nhật thông tin tài khoản ${targetUser} trên MongoDB Atlas!`,
          user: updated,
        });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật MongoDB: ' + err.message });
      }
    }

    // Memory update
    const mIdx = memoryUsers.findIndex(u => u.id === userId || u.username === username);
    if (mIdx >= 0) {
      memoryUsers[mIdx] = { ...memoryUsers[mIdx], ...updates };
      const { password: _, ...safe } = memoryUsers[mIdx];
      return res.status(200).json({
        success: true,
        message: 'Đã cập nhật thông tin tài khoản thành công!',
        user: safe,
      });
    }

    return res.status(200).json({ success: true, message: 'Đã cập nhật thông tin tài khoản!' });
  }

  // ACTION: GET COMMENTS (MongoDB Atlas)
  if (action === 'get_comments') {
    const chapterId = req.query.chapterId || body.chapterId;
    if (!chapterId) {
      return res.status(400).json({ success: false, message: 'Thiếu chapterId' });
    }

    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const comments = await db.collection('comments')
          .find({ chapterId }, { projection: { _id: 0 } })
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();

        return res.status(200).json({ success: true, comments });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi tải bình luận: ' + err.message });
      }
    }

    return res.status(200).json({ success: true, comments: [] });
  }

  // ACTION: POST COMMENT (MongoDB Atlas)
  if (action === 'post_comment') {
    const { chapterId, name, text, avatar, level, levelTitle, userId } = body;
    if (!chapterId || !text) {
      return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
    }

    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const doc = {
          id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          chapterId,
          name: name || 'Đạo Hữu Vô Danh',
          text: text.trim(),
          avatar: avatar || '🐉',
          level: Number(level) || 1,
          levelTitle: levelTitle || 'Phàm Nhân',
          userId: userId || '',
          createdAt: new Date().toISOString(),
        };

        await db.collection('comments').insertOne(doc);
        const { _id, ...safeComment } = doc;
        return res.status(200).json({ success: true, comment: safeComment });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Lỗi lưu bình luận: ' + err.message });
      }
    }

    return res.status(200).json({
      success: true,
      comment: {
        id: `c_${Date.now()}`,
        chapterId,
        name: name || 'Đạo Hữu',
        text: text.trim(),
        avatar: avatar || '🐉',
        level: level || 1,
        levelTitle: levelTitle || 'Phàm Nhân',
        createdAt: new Date().toISOString(),
      }
    });
  }

  // ACTION: GET & POST REACTIONS (MongoDB Atlas)
  if (action === 'get_reactions') {
    const chapterId = req.query.chapterId || body.chapterId;
    if (dbConfig.type === 'mongodb' && chapterId) {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const doc = await db.collection('reactions').findOne({ chapterId });
        return res.status(200).json({
          success: true,
          reactions: doc?.reactions || { love: 14, dragon: 28, fire: 19, flower: 22 }
        });
      } catch (err) {
        // Fallback
      }
    }
    return res.status(200).json({ success: true, reactions: { love: 14, dragon: 28, fire: 19, flower: 22 } });
  }

  if (action === 'post_reaction') {
    const { chapterId, type } = body;
    if (dbConfig.type === 'mongodb' && chapterId && type) {
      try {
        const db = await getMongoDb(dbConfig.uri);
        await db.collection('reactions').updateOne(
          { chapterId },
          { $inc: { [`reactions.${type}`]: 1 } },
          { upsert: true }
        );
        const updated = await db.collection('reactions').findOne({ chapterId });
        return res.status(200).json({ success: true, reactions: updated?.reactions });
      } catch (err) {
        // Fallback
      }
    }
    return res.status(200).json({ success: true });
  }

  // ACTION: GET LEADERBOARD (Top Tu Vi Đạo Hữu)
  if (action === 'get_leaderboard') {
    if (dbConfig.type === 'mongodb') {
      try {
        const db = await getMongoDb(dbConfig.uri);
        const leaderboard = await db.collection('users')
          .find({}, { projection: { password: 0, _id: 0 } })
          .sort({ exp: -1 })
          .limit(30)
          .toArray();

        return res.status(200).json({ success: true, leaderboard });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    }

    return res.status(200).json({ success: true, leaderboard: [] });
  }

  return res.status(400).json({ error: 'Hành động không hợp lệ' });
}

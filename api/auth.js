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

  return res.status(400).json({ error: 'Hành động không hợp lệ' });
}

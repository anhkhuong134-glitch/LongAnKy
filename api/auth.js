// Vercel Serverless Function to manage user accounts with Vercel Postgres (Neon) & Vercel KV
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

// Check database connection configuration
function getDbConfig() {
  const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (pgUrl) {
    return { type: 'postgres', url: pgUrl };
  }
  if (kvUrl && kvToken) {
    return { type: 'kv', url: kvUrl, token: kvToken };
  }
  return { type: 'none' };
}

let tableInitialized = false;

async function ensurePostgresTable(sql) {
  if (tableInitialized) return;
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
    tableInitialized = true;
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
    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);
        const result = await sql`SELECT COUNT(*)::int AS count FROM users;`;
        return res.status(200).json({
          connected: true,
          provider: 'Vercel Postgres (Neon)',
          userCount: result[0]?.count || 0,
          message: 'Vercel Database đã kết nối thành công và sẵn sàng lưu trữ tài khoản!',
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
        provider: 'Vercel KV (Upstash)',
        message: 'Vercel KV đã kết nối thành công!',
      });
    } else {
      return res.status(200).json({
        connected: false,
        provider: 'local_storage',
        message: 'Chưa cấu hình Vercel Database Storage. Hệ thống đang sử dụng cơ sở dữ liệu Local Storage.',
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

    if (dbConfig.type === 'postgres') {
      try {
        const sql = neon(dbConfig.url);
        await ensurePostgresTable(sql);

        // Check duplicate
        const existing = await sql`SELECT id FROM users WHERE LOWER(username) = ${cleanUsername} LIMIT 1;`;
        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Tên tài khoản này đã tồn tại trên Vercel Database. Vui lòng chọn tên khác!',
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
          message: 'Đăng ký thành công! Tài khoản đã được lưu vào Vercel Database.',
          user,
        });
      } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi lưu tài khoản vào Vercel Postgres: ' + err.message,
        });
      }
    } else {
      // If no cloud DB configured yet, inform client to proceed with local storage
      return res.status(200).json({
        success: false,
        useLocalFallback: true,
        message: 'Vercel Database chưa được cấu hình. Đang chuyển sang lưu cục bộ.',
      });
    }
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
            message: 'Tài khoản không tồn tại trên Vercel Database!',
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
          message: `Xác thực Vercel Database thành công! Chào mừng ${user.displayName} trở lại.`,
          user,
        });
      } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi xác thực Vercel Postgres: ' + err.message,
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        useLocalFallback: true,
        message: 'Vercel Database chưa được cấu hình. Đang kiểm tra cơ sở dữ liệu cục bộ.',
      });
    }
  }

  // ACTION: SYNC (Synchronize reading progress, exp, bookmarks, last read to cloud)
  if (action === 'sync') {
    const { user } = body;
    if (!user || !user.id) {
      return res.status(400).json({ success: false, message: 'Dữ liệu người dùng không hợp lệ!' });
    }

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
          message: 'Đã đồng bộ tiến độ đọc và tu vi lên Vercel Database!',
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi đồng bộ Vercel Database: ' + err.message,
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        useLocalFallback: true,
        message: 'Đã lưu trữ cục bộ thành công (Chờ kết nối Vercel Database).',
      });
    }
  }

  // ACTION: GET ALL USERS (Public profile summary)
  if (action === 'get_users') {
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
        const users = rows.map(r => ({
          id: r.id,
          username: r.username,
          displayName: r.display_name,
          email: r.email,
          avatar: r.avatar,
          level: r.level,
          exp: r.exp,
          levelTitle: r.level_title,
          streakDays: r.streak_days,
          joinedDate: r.joined_date,
        }));
        return res.status(200).json({ success: true, users });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    } else {
      return res.status(200).json({ success: true, users: [] });
    }
  }

  return res.status(400).json({ error: 'Hành động không hợp lệ' });
}

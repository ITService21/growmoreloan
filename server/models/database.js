import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import uuidv4 from '../utils/id.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import BLOG_SEED_DATA from '../data/blogSeedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || './data/database.sqlite';
const resolvedPath = path.isAbsolute(dbPath)
  ? dbPath
  : path.resolve(path.join(__dirname, '..'), dbPath);

const dataDir = path.dirname(resolvedPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(resolvedPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      reviewer_name TEXT NOT NULL,
      reviewer_image TEXT,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      location TEXT,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT,
      website TEXT,
      category TEXT NOT NULL CHECK(category IN ('bank', 'nbfc', 'hfc')),
      is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      category_name TEXT NOT NULL,
      excerpt TEXT,
      image_url TEXT,
      date TEXT NOT NULL,
      read_time TEXT DEFAULT '5 min read',
      content TEXT NOT NULL,
      tags TEXT,
      seo_title TEXT,
      seo_description TEXT,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
};

const seedAdminUser = () => {
  const existingAdmin = db
    .prepare("SELECT id FROM users WHERE phone = ? AND role = 'admin'")
    .get('9081941882');

  if (!existingAdmin) {
    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
    const hashedPassword = bcrypt.hashSync('growmoreloan@081', bcryptRounds);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, phone, password, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), '9081941882', hashedPassword, 'Admin', 'admin', now, now);

    console.log('Default admin user seeded');
  }
};

const DEFAULT_PARTNERS = [
  { name: 'State Bank of India', domain: 'sbi.co.in', category: 'bank' },
  { name: 'HDFC Bank', domain: 'hdfcbank.com', category: 'bank' },
  { name: 'ICICI Bank', domain: 'icicibank.com', category: 'bank' },
  { name: 'Axis Bank', domain: 'axisbank.com', category: 'bank' },
  { name: 'Bank of Baroda', domain: 'bankofbaroda.in', category: 'bank' },
  { name: 'Punjab National Bank', domain: 'pnbindia.in', category: 'bank' },
  { name: 'Kotak Mahindra Bank', domain: 'kotak.com', category: 'bank' },
  { name: 'IndusInd Bank', domain: 'indusind.com', category: 'bank' },
  { name: 'Yes Bank', domain: 'yesbank.in', category: 'bank' },
  { name: 'IDFC First Bank', domain: 'idfcfirstbank.com', category: 'bank' },
  { name: 'Bajaj Finserv', domain: 'bajajfinserv.in', category: 'nbfc' },
  { name: 'Tata Capital', domain: 'tatacapital.com', category: 'nbfc' },
  { name: 'Mahindra Finance', domain: 'mahindrafinance.com', category: 'nbfc' },
  { name: 'LIC Housing Finance', domain: 'lichousing.com', category: 'hfc' },
  { name: 'Aditya Birla Capital', domain: 'adityabirlacapital.com', category: 'nbfc' },
];

const seedPartners = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM partners').get();

  if (count.count === 0) {
    const insertPartner = db.prepare(`
      INSERT INTO partners (id, name, logo_url, website, category, is_active, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    DEFAULT_PARTNERS.forEach((partner, index) => {
      insertPartner.run(
        uuidv4(),
        partner.name,
        `https://logo.clearbit.com/${partner.domain}`,
        `https://${partner.domain}`,
        partner.category,
        1,
        index + 1,
        now,
        now
      );
    });

    console.log('Default partners seeded');
  }
};

const seedBlogs = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM blogs').get();
  const hasOldSeed = db
    .prepare("SELECT id FROM blogs WHERE id = 'how-to-get-personal-loan-in-rajkot'")
    .get();
  const needsReseed = count.count === 0 || hasOldSeed || count.count !== BLOG_SEED_DATA.length;

  if (needsReseed) {
    if (count.count > 0) {
      db.prepare('DELETE FROM blogs').run();
    }
    const insertBlog = db.prepare(`
      INSERT INTO blogs (
        id, title, category, category_name, excerpt, image_url, date, read_time,
        content, tags, seo_title, seo_description, is_published, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    BLOG_SEED_DATA.forEach((blog) => {
      insertBlog.run(
        blog.id,
        blog.title,
        blog.category,
        blog.category_name,
        blog.excerpt || null,
        blog.image_url || null,
        blog.date,
        blog.read_time || '5 min read',
        typeof blog.content === 'string' ? blog.content : JSON.stringify(blog.content),
        typeof blog.tags === 'string' ? blog.tags : JSON.stringify(blog.tags || []),
        blog.seo_title || null,
        blog.seo_description || null,
        blog.is_published !== undefined ? (blog.is_published ? 1 : 0) : 1,
        now,
        now
      );
    });

    console.log('Default blogs seeded');
  }
};

createTables();
seedAdminUser();
seedPartners();
seedBlogs();

export default db;

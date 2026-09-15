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
      sort_order INTEGER NOT NULL DEFAULT 0,
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

const DEFAULT_REVIEWS = [
  { name: 'Rajesh Patel', rating: 5, location: 'Rajkot, Gujarat', description: 'Excellent service by the Grow More team! They helped me get my home loan approved in just 7 days with the lowest interest rate. Very professional and transparent throughout the process.' },
  { name: 'Priya Sharma', rating: 5, location: 'Ahmedabad, Gujarat', description: 'I was confused about which loan product to choose. The consultants at Grow More explained everything clearly and helped me get a business loan with great terms. Highly recommended!' },
  { name: 'Amit Desai', rating: 4, location: 'Rajkot, Gujarat', description: 'Good experience with their personal loan service. They compared offers from multiple banks and found me the best rate. The only reason for 4 stars is the documentation process took a bit longer than expected.' },
  { name: 'Neha Joshi', rating: 5, location: 'Surat, Gujarat', description: 'The best loan consultancy in Gujarat! They secured my MSME loan under the MUDRA scheme within 10 days. Their knowledge of government schemes is impressive.' },
  { name: 'Vikram Singh', rating: 5, location: 'Ahmedabad, Gujarat', description: 'Got my car loan approved with zero hassle. The team handled everything from documentation to bank coordination. Will definitely recommend to friends and family.' },
  { name: 'Meena Agarwal', rating: 4, location: 'Rajkot, Gujarat', description: 'Very helpful team for mortgage loan. They negotiated a much better interest rate than what I was initially offered by the bank. Professional service overall.' },
  { name: 'Karan Mehta', rating: 5, location: 'Vadodara, Gujarat', description: 'Outstanding support for my machinery loan. They understood my business needs perfectly and connected me with the right lender. Quick processing and no hidden charges.' },
  { name: 'Sneha Trivedi', rating: 5, location: 'Rajkot, Gujarat', description: 'I applied for a personal loan through Grow More and the entire process was smooth. They kept me updated at every step. The consultancy fee was very reasonable for the service provided.' },
  { name: 'Dhruv Patel', rating: 4, location: 'Gandhinagar, Gujarat', description: 'Good experience with their home loan service. They helped me compare 5 different bank offers and choose the best one. Response time could be slightly faster.' },
  { name: 'Anita Rawat', rating: 5, location: 'Ahmedabad, Gujarat', description: 'Exceptional service! Grow More helped my startup get a business loan when other consultancies had given up. Their connections with banks and NBFCs are truly valuable.' },
];

const seedReviews = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  if (count.count === 0) {
    const now = new Date().toISOString();
    const insertReview = db.prepare('INSERT INTO reviews (id, reviewer_name, reviewer_image, rating, location, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    DEFAULT_REVIEWS.forEach(r => {
      insertReview.run(uuidv4(), r.name, null, r.rating, r.location, r.description, now, now);
    });
    console.log('Default reviews seeded');
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

try {
  db.prepare("SELECT sort_order FROM reviews LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE reviews ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0");
  const rows = db.prepare("SELECT id FROM reviews ORDER BY created_at ASC").all();
  rows.forEach((row, i) => db.prepare("UPDATE reviews SET sort_order = ? WHERE id = ?").run(i, row.id));
  console.log('Added sort_order to reviews table');
}

seedAdminUser();
seedPartners();
seedBlogs();
seedReviews();

export default db;

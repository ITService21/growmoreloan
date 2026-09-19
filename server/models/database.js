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
  { name: 'Rajesh Patel', rating: 5, location: 'Rajkot, Gujarat', category: 'Home Loan', description: 'Excellent service by the Grow More team! They helped me get my home loan approved in just 7 days with the lowest interest rate. Very professional and transparent throughout the process.' },
  { name: 'Priya Sharma', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Business Loan', description: 'I was confused about which loan product to choose. The consultants at Grow More explained everything clearly and helped me get a business loan with great terms. Highly recommended!' },
  { name: 'Amit Desai', rating: 4, location: 'Rajkot, Gujarat', category: 'Personal Loan', description: 'Good experience with their personal loan service. They compared offers from multiple banks and found me the best rate. The only reason for 4 stars is the documentation process took a bit longer than expected.' },
  { name: 'Neha Joshi', rating: 5, location: 'Surat, Gujarat', category: 'MSME Loan', description: 'The best loan consultancy in Gujarat! They secured my MSME loan under the MUDRA scheme within 10 days. Their knowledge of government schemes is impressive.' },
  { name: 'Vikram Singh', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Car Loan', description: 'Got my car loan approved with zero hassle. The team handled everything from documentation to bank coordination. Will definitely recommend to friends and family.' },
  { name: 'Meena Agarwal', rating: 4, location: 'Rajkot, Gujarat', category: 'Mortgage Loan', description: 'Very helpful team for mortgage loan. They negotiated a much better interest rate than what I was initially offered by the bank. Professional service overall.' },
  { name: 'Karan Mehta', rating: 5, location: 'Vadodara, Gujarat', category: 'Machinery Loan', description: 'Outstanding support for my machinery loan. They understood my business needs perfectly and connected me with the right lender. Quick processing and no hidden charges.' },
  { name: 'Sneha Trivedi', rating: 5, location: 'Rajkot, Gujarat', category: 'Personal Loan', description: 'I applied for a personal loan through Grow More and the entire process was smooth. They kept me updated at every step. The consultancy fee was very reasonable for the service provided.' },
  { name: 'Dhruv Patel', rating: 4, location: 'Gandhinagar, Gujarat', category: 'Home Loan', description: 'Good experience with their home loan service. They helped me compare 5 different bank offers and choose the best one. Response time could be slightly faster.' },
  { name: 'Anita Rawat', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Business Loan', description: 'Exceptional service! Grow More helped my startup get a business loan when other consultancies had given up. Their connections with banks and NBFCs are truly valuable.' },
  { name: 'Suresh Nair', rating: 5, location: 'Rajkot, Gujarat', category: 'Cash Credit Loan (CC)', description: 'Got my cash credit facility sanctioned within 15 days. The team guided me through the entire process and ensured smooth documentation. Highly professional!' },
  { name: 'Pooja Deshmukh', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Overdraft (OD)', description: 'Excellent OD facility arranged against my property. The team at Grow More negotiated a fantastic interest rate. Very satisfied with their service.' },
  { name: 'Harsh Vyas', rating: 4, location: 'Surat, Gujarat', category: 'MSME Loan', description: 'Very knowledgeable about government schemes for MSMEs. They helped me get subsidy benefits I didn\'t even know existed. Great consultancy team.' },
  { name: 'Ritu Kapoor', rating: 5, location: 'Rajkot, Gujarat', category: 'Personal Loan', description: 'Was drowning in credit card debt with 40% interest. Grow More helped me convert it to a manageable EMI at just 14%. Saved me lakhs in interest!' },
  { name: 'Manish Gupta', rating: 5, location: 'Vadodara, Gujarat', category: 'Personal Loan', description: 'Quick personal loan approval within 48 hours! The team was extremely responsive and guided me through every step. Best loan consultancy in Gujarat.' },
  { name: 'Kavita Bhatt', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Home Loan', description: 'Dream home became reality thanks to Grow More. They got me a home loan at 7.5% from a top bank. The entire process was hassle-free and transparent.' },
  { name: 'Arjun Reddy', rating: 4, location: 'Rajkot, Gujarat', category: 'Business Loan', description: 'Good business loan service. The processing took a week longer than expected but the interest rate they secured was worth the wait. Would recommend.' },
  { name: 'Nisha Chauhan', rating: 5, location: 'Gandhinagar, Gujarat', category: 'Machinery Loan', description: 'Excellent machinery loan arranged for my manufacturing unit. They even helped with government subsidy applications. Professional and knowledgeable team.' },
  { name: 'Rohit Jain', rating: 5, location: 'Rajkot, Gujarat', category: 'Cash Credit Loan (CC)', description: 'Cash credit limit enhanced from 20L to 50L thanks to Grow More\'s expert guidance. They know exactly how to present your case to the bank. Amazing service!' },
  { name: 'Deepika Pandey', rating: 5, location: 'Surat, Gujarat', category: 'Insurance', description: 'Got comprehensive insurance coverage for my family through Grow More. They compared policies from multiple insurers and found the best deal. Very thorough!' },
  { name: 'Jayesh Modi', rating: 4, location: 'Ahmedabad, Gujarat', category: 'Overdraft (OD)', description: 'OD against my FD was set up within 2 days. Very efficient service. The only suggestion would be to provide more follow-up after disbursement.' },
  { name: 'Sanjana Rao', rating: 5, location: 'Rajkot, Gujarat', category: 'Personal Loan', description: 'Consolidated all my credit card dues into one affordable EMI. The interest savings are incredible. Thank you Grow More for helping me become debt-free!' },
  { name: 'Prakash Verma', rating: 5, location: 'Vadodara, Gujarat', category: 'Mortgage Loan', description: 'Got mortgage loan against my commercial property at excellent terms. The team handled property valuation coordination and all bank paperwork. Superb service!' },
  { name: 'Ananya Mehta', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Car Loan', description: 'Best car loan deal! Got 100% financing at just 8.5% interest. The process was smooth and the team even coordinated with the dealer directly. Highly recommended!' },
  { name: 'Vikas Thakur', rating: 4, location: 'Rajkot, Gujarat', category: 'MSME Loan', description: 'Good MSME loan service under CGTMSE scheme. Collateral-free loan of 75 lakhs was sanctioned. The team is very knowledgeable about government schemes.' },
  { name: 'Preeti Saxena', rating: 5, location: 'Surat, Gujarat', category: 'Personal Loan', description: 'Needed an urgent personal loan for medical expenses. Grow More got it approved within 24 hours. Their quick response during my emergency was commendable.' },
  { name: 'Mahesh Kumar', rating: 5, location: 'Gandhinagar, Gujarat', category: 'Home Loan', description: 'Home loan balance transfer saved me over ₹3 lakhs in interest. The Grow More team identified the opportunity and handled the entire transfer seamlessly.' },
  { name: 'Swati Patil', rating: 5, location: 'Rajkot, Gujarat', category: 'Business Loan', description: 'Grow More helped me expand my textile business with a business loan at competitive rates. Their understanding of the local market is excellent.' },
  { name: 'Gaurav Soni', rating: 4, location: 'Ahmedabad, Gujarat', category: 'Cash Credit Loan (CC)', description: 'Good CC facility arranged for my trading business. The working capital management advice they provided was also very helpful. Satisfied customer.' },
  { name: 'Radha Iyer', rating: 5, location: 'Rajkot, Gujarat', category: 'Insurance', description: 'The insurance advisory from Grow More was eye-opening. They found gaps in my existing coverage and recommended the right policies. Very professional approach.' },
  { name: 'Tushar Bhavsar', rating: 5, location: 'Vadodara, Gujarat', category: 'Overdraft (OD)', description: 'OD against property was arranged quickly with a great interest rate. The team managed all documentation and bank coordination. Excellent service from start to finish.' },
  { name: 'Megha Trivedi', rating: 5, location: 'Surat, Gujarat', category: 'Personal Loan', description: 'Was paying 42% on my credit card balances. Grow More consolidated everything into a 15% loan with fixed EMIs. My financial stress has reduced dramatically!' },
  { name: 'Anil Prajapati', rating: 5, location: 'Rajkot, Gujarat', category: 'Machinery Loan', description: 'Financed CNC machines worth 1.5 crore through Grow More. They arranged the best machinery loan terms and even guided me on depreciation benefits. Top-notch service!' },
  { name: 'Komal Shah', rating: 4, location: 'Ahmedabad, Gujarat', category: 'Personal Loan', description: 'Personal loan approved despite my moderate credit score. Grow More found a lender willing to work with my profile. Very grateful for their persistence.' },
  { name: 'Deepak Joshi', rating: 5, location: 'Gandhinagar, Gujarat', category: 'Home Loan', description: 'First-time home buyer and Grow More made it so easy! They explained every detail, compared 8 banks, and got me the best rate. Could not have done it without them.' },
  { name: 'Shreya Parikh', rating: 5, location: 'Rajkot, Gujarat', category: 'MSME Loan', description: 'MSME loan under Mudra scheme arranged perfectly. The team helped with Udyam registration too. Complete end-to-end support for small business owners!' },
  { name: 'Nilesh Barot', rating: 5, location: 'Surat, Gujarat', category: 'Mortgage Loan', description: 'Mortgage loan against my residential property at just 9.5%. Used the funds for business expansion. Grow More made the entire process smooth and transparent.' },
  { name: 'Payal Dave', rating: 4, location: 'Vadodara, Gujarat', category: 'Car Loan', description: 'Good car loan rate for my pre-owned car. The team found a lender offering competitive rates for used vehicles. Documentation was handled efficiently.' },
  { name: 'Ramesh Solanki', rating: 5, location: 'Rajkot, Gujarat', category: 'Cash Credit Loan (CC)', description: 'CC renewal with enhanced limit happened smoothly. Grow More prepared all the financials and presented my case professionally to the bank. Very efficient!' },
  { name: 'Jyoti Mishra', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Business Loan', description: 'Got business loan for my restaurant expansion. The team understood the F&B industry requirements and connected me with the right bank. Excellent guidance!' },
  { name: 'Vivek Patel', rating: 5, location: 'Rajkot, Gujarat', category: 'Personal Loan', description: 'Had 3 credit cards with huge outstanding. Grow More consolidated everything into one loan at half the interest rate. Best financial decision I ever made!' },
  { name: 'Bhavna Desai', rating: 5, location: 'Gandhinagar, Gujarat', category: 'Home Loan', description: 'Home renovation loan arranged quickly through home loan top-up. Great rate and the process was completed in just 10 days. Very impressed with Grow More!' },
  { name: 'Chirag Thakor', rating: 4, location: 'Surat, Gujarat', category: 'Overdraft (OD)', description: 'OD facility against my FD was set up efficiently. Good interest rate at just 1% above FD rate. The team was helpful and responsive throughout.' },
  { name: 'Heena Patel', rating: 5, location: 'Rajkot, Gujarat', category: 'MSME Loan', description: 'Stand-Up India loan for my women-owned business arranged by Grow More. They were very supportive and helped with all government formalities. Grateful!' },
  { name: 'Yash Panchal', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Machinery Loan', description: 'New textile machinery financed through Grow More at excellent terms. They also helped claim CLCSS subsidy. Saved me significant money on the machinery purchase!' },
  { name: 'Mital Joshi', rating: 5, location: 'Vadodara, Gujarat', category: 'Personal Loan', description: 'Personal loan for my daughter\'s wedding arranged quickly. The EMI fit perfectly within my budget. Grow More truly cares about their clients\' needs.' },
  { name: 'Dinesh Chavda', rating: 4, location: 'Rajkot, Gujarat', category: 'Business Loan', description: 'Business loan sanctioned for my auto parts shop. Good terms and reasonable processing time. The team was knowledgeable and professional.' },
  { name: 'Reshma Khan', rating: 5, location: 'Ahmedabad, Gujarat', category: 'Insurance', description: 'Comprehensive health insurance for my entire family arranged through Grow More. They compared 10+ policies and found the perfect coverage at the best premium.' },
  { name: 'Bhavin Doshi', rating: 5, location: 'Rajkot, Gujarat', category: 'Mortgage Loan', description: 'LAP arranged at 9.25% against my commercial property. Used the funds for business working capital. The entire process was smooth and well-coordinated.' },
  { name: 'Urvi Raval', rating: 5, location: 'Surat, Gujarat', category: 'Car Loan', description: 'Brand new car loan at just 7.9% interest! Grow More got me the best deal by comparing offers from 6 banks. Zero down payment option was a bonus. Love their service!' },
];

const seedReviews = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  const hasCategory = db.prepare("SELECT category FROM reviews WHERE category != 'Other' LIMIT 1").get();
  if (count.count === 0 || !hasCategory) {
    if (count.count > 0) {
      db.prepare('DELETE FROM reviews').run();
    }
    const now = new Date().toISOString();
    const insertReview = db.prepare('INSERT INTO reviews (id, reviewer_name, reviewer_image, rating, location, description, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    DEFAULT_REVIEWS.forEach(r => {
      insertReview.run(uuidv4(), r.name, null, r.rating, r.location, r.description, r.category || 'Other', now, now);
    });
    console.log('Default reviews seeded (50 reviews)');
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

try {
  db.prepare("SELECT category FROM reviews LIMIT 1").get();
} catch {
  db.exec("ALTER TABLE reviews ADD COLUMN category TEXT DEFAULT 'Other'");
  console.log('Added category to reviews table');
}

seedAdminUser();
seedPartners();
seedBlogs();
seedReviews();

export default db;

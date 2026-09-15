import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedDir = path.join(__dirname, '../data/seed');
const outPath = path.join(__dirname, '../data/blogSeedData.js');

const CATEGORIES = {
  'personal-loan': 'Personal Loan',
  'business-loan': 'Business Loan',
  'machinery-loan': 'Machinery Loan',
  'cash-credit': 'Cash Credit',
  overdraft: 'Overdraft',
  'msme-loan': 'MSME Loan',
  'home-loan': 'Home Loan',
  'mortgage-loan': 'Mortgage Loan',
  'car-loan': 'Car Loan',
  insurance: 'Insurance',
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function readTime(blocks) {
  let words = 0;
  for (const b of blocks) {
    if (b.type === 'paragraph' || b.type === 'heading') words += b.text.split(/\s+/).length;
    if (b.type === 'list') words += b.items.join(' ').split(/\s+/).length;
  }
  return `${Math.max(4, Math.ceil(words / 200))} min read`;
}

const articles = [];

for (const [category, categoryName] of Object.entries(CATEGORIES)) {
  const filePath = path.join(seedDir, `${category}.json`);
  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const item of items) {
    articles.push({
      id: slugify(item.title),
      title: item.title,
      category,
      category_name: categoryName,
      excerpt: item.excerpt,
      image_url: null,
      date: item.date,
      read_time: readTime(item.blocks),
      content: item.blocks,
      tags: item.tags,
      seo_title: `${item.title} | Grow More Loan Consultancy`,
      seo_description: item.excerpt,
      is_published: 1,
    });
  }
}

const output = `const BLOG_SEED_DATA = ${JSON.stringify(articles, null, 2)};\n\nexport default BLOG_SEED_DATA;\n`;
fs.writeFileSync(outPath, output);
console.log(`Generated ${articles.length} articles -> ${outPath}`);

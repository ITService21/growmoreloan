# Grow More Loan Consultancy Group — Deployment Guide

## Architecture

```
growmore/
├── client/          # React (Vite) frontend
│   ├── .env         # VITE_API_URL
│   └── dist/        # Production build output
└── server/          # Express.js backend API
    ├── .env         # PORT, JWT_SECRET, DB_PATH, etc.
    ├── data/        # SQLite database
    └── uploads/     # User-uploaded files
```

---

## 1. Backend Deployment (api.growmoreloan.in)

### Prerequisites
- Node.js 18+ installed
- PM2 (process manager): `npm install -g pm2`

### Setup

```bash
cd server
npm install
```

### Environment Variables (server/.env)

```env
PORT=5001
NODE_ENV=production
API_BASE_URL=https://api.growmoreloan.in
JWT_SECRET=<your-secure-secret-key>
BCRYPT_ROUNDS=10
DB_PATH=./data/database.sqlite
CORS_ORIGIN=https://growmoreloan.in
```

> ⚠️ Change `JWT_SECRET` to a long, random string in production.
> ⚠️ Set `CORS_ORIGIN` to your frontend domain.

### Start Server

```bash
# Development
npm run dev

# Production (with PM2)
pm2 start server.js --name growmore-api
pm2 save
pm2 startup
```

### Nginx Reverse Proxy (api.growmoreloan.in)

```nginx
server {
    listen 80;
    server_name api.growmoreloan.in;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then enable HTTPS with Certbot:
```bash
sudo certbot --nginx -d api.growmoreloan.in
```

---

## 2. Frontend Deployment (growmoreloan.in)

### Environment Variables (client/.env)

```env
VITE_API_URL=https://api.growmoreloan.in/api
```

### Build

```bash
cd client
npm install
npx vite build
```

Output goes to `client/dist/`.

### Nginx Config (growmoreloan.in)

```nginx
server {
    listen 80;
    server_name growmoreloan.in www.growmoreloan.in;
    root /path/to/growmore/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Then enable HTTPS:
```bash
sudo certbot --nginx -d growmoreloan.in -d www.growmoreloan.in
```

---

## 3. API Reference

### Base URL: `https://api.growmoreloan.in/api`

### Authentication

**Login:**
```
POST /api/auth/login
Body: { "phone": "9081941882", "password": "growmoreloan@081" }
Response: { success: true, data: { token: "JWT...", user: {...} } }
```

**Get Profile:**
```
GET /api/auth/profile
Header: Authorization: Bearer <token>
```

### Users (Admin Only — Postman)

| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| GET    | /api/users        | List all users   |
| POST   | /api/users        | Create user      |
| PUT    | /api/users/:id    | Update user      |
| DELETE | /api/users/:id    | Delete user      |

**Create User:**
```json
POST /api/users
Header: Authorization: Bearer <admin-token>
Body: {
  "phone": "9876543210",
  "password": "somepassword",
  "name": "John Doe",
  "role": "admin"    // "admin" or "user"
}
```

**Update User (change password/role):**
```json
PUT /api/users/:id
Header: Authorization: Bearer <admin-token>
Body: {
  "password": "newpassword",
  "role": "user"
}
```

### Reviews

| Method | Endpoint           | Auth     | Description       |
|--------|--------------------|----------|-------------------|
| GET    | /api/reviews       | Public   | List all reviews  |
| GET    | /api/reviews/:id   | Public   | Get one review    |
| POST   | /api/reviews       | Admin    | Create review     |
| PUT    | /api/reviews/:id   | Admin    | Update review     |
| DELETE | /api/reviews/:id   | Admin    | Delete review     |

**Create Review:**
```json
POST /api/reviews
Header: Authorization: Bearer <admin-token>
Body: {
  "reviewer_name": "Rajesh Patel",
  "reviewer_image": "https://example.com/photo.jpg",
  "rating": 5,
  "location": "Rajkot, Gujarat",
  "description": "Excellent service!"
}
```

### Partners

| Method | Endpoint            | Auth     | Description        |
|--------|---------------------|----------|--------------------|
| GET    | /api/partners       | Public   | List all partners  |
| GET    | /api/partners/:id   | Public   | Get one partner    |
| POST   | /api/partners       | Admin    | Create partner     |
| PUT    | /api/partners/:id   | Admin    | Update partner     |
| DELETE | /api/partners/:id   | Admin    | Delete partner     |

**Create Partner:**
```json
POST /api/partners
Header: Authorization: Bearer <admin-token>
Body: {
  "name": "HDFC Bank",
  "logo_url": "https://logo.clearbit.com/hdfcbank.com",
  "website": "https://www.hdfcbank.com",
  "category": "bank",
  "sort_order": 1,
  "is_active": true
}
```

---

## 4. Default Credentials

| Phone        | Password            | Role  |
|-------------|---------------------|-------|
| 9081941882  | growmoreloan@081    | admin |

> Change the password immediately after first deployment using the Update User API.

---

## 5. Database

SQLite database is stored at `server/data/database.sqlite`.

**Backup:**
```bash
cp server/data/database.sqlite server/data/database-backup-$(date +%Y%m%d).sqlite
```

**Reset (will lose all data):**
```bash
rm server/data/database.sqlite
npm run dev  # Auto-creates tables and seeds defaults
```

---

## 6. Blogs API

| Method | Endpoint         | Auth     | Description        |
|--------|------------------|----------|--------------------|
| GET    | /api/blogs       | Public   | List published blogs |
| GET    | /api/blogs/admin | Admin    | List all blogs     |
| GET    | /api/blogs/:id   | Public   | Get one blog       |
| POST   | /api/blogs       | Admin    | Create blog        |
| PUT    | /api/blogs/:id   | Admin    | Update blog        |
| DELETE | /api/blogs/:id   | Admin    | Delete blog        |

**Create Blog:**
```json
POST /api/blogs
Header: Authorization: Bearer <admin-token>
Body: {
  "title": "How to Get a Personal Loan",
  "category": "personal-loan",
  "category_name": "Personal Loan",
  "excerpt": "A guide to personal loans...",
  "date": "2026-09-01",
  "read_time": "5 min read",
  "content": [{"type":"paragraph","text":"..."},{"type":"heading","text":"..."}],
  "tags": ["personal loan", "rajkot"],
  "seo_title": "Personal Loan Guide",
  "seo_description": "...",
  "is_published": true
}
```

Supports image file upload via `multipart/form-data` — use field `image_file` for file, `image_url` for URL. URL takes priority if both provided.

## 7. Seeding Data in Production

**Auto-seed:** The server automatically seeds 100 blog articles, 15 bank partners, and an admin user when starting with an empty database.

```bash
# Fresh seed (WARNING: loses all data)
rm server/data/database.sqlite
npm start
```

**Seed partner via curl:**
```bash
TOKEN=$(curl -s -X POST https://api.growmoreloan.in/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"phone":"9081941882","password":"growmoreloan@081"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

curl -X POST https://api.growmoreloan.in/api/partners \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"State Bank of India","logo_url":"https://logo.clearbit.com/sbi.co.in","website":"https://sbi.co.in","category":"bank","sort_order":1,"is_active":true}'
```

**Seed blog via curl:**
```bash
curl -X POST https://api.growmoreloan.in/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Personal Loan Guide","category":"personal-loan","category_name":"Personal Loan","excerpt":"...","date":"2026-09-01","content":[{"type":"paragraph","text":"..."}],"tags":["loan"]}'
```

---

## 8. macOS Development Note

Port 5000 is used by AirPlay Receiver on macOS. The server uses port **5001** by default. If you need port 5000, disable AirPlay Receiver in System Settings → General → AirDrop & Handoff.

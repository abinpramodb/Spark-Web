-- Spark Web Cloudflare D1 Database Schema Setup

-- 1. Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    demoPath TEXT NOT NULL,
    price TEXT NOT NULL DEFAULT 'Free'
);

-- 2. Customizer Builds Table
CREATE TABLE IF NOT EXISTS builds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    email TEXT NOT NULL,
    templateId TEXT NOT NULL,
    fields TEXT NOT NULL
);

-- 3. Verified Whitelist Emails Table
CREATE TABLE IF NOT EXISTS verified_emails (
    email TEXT PRIMARY KEY,
    verifiedDate TEXT NOT NULL
);

-- 4. Whitelist Access Requests Table
CREATE TABLE IF NOT EXISTS access_requests (
    email TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending Approval'
);

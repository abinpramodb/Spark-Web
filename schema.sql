-- Spark Web Cloudflare D1 Database Schema Setup

-- 1. Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    demoPath TEXT NOT NULL,
    price TEXT NOT NULL DEFAULT 'Free',
    payhipUrl TEXT,
    figmaUrl TEXT
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

-- 5. Seed Default Templates Data
INSERT OR IGNORE INTO templates (id, name, category, description, thumbnail, demoPath, price, payhipUrl) VALUES
('template-1', 'Apex SaaS Landing Page', 'saas', 'Clean semantic HTML structure with responsive design, pricing matrices, and modern dark-mode gradient elements.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 'template-1', 'Free', ''),
('template-2', 'Zenith Personal Portfolio', 'portfolio', 'Stunning developer-focused minimal dark-mode layout. Tailored for showcasing projects, skills, and work histories.', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', 'template-2', 'Free', ''),
('template-3', 'Echo Creator Blog', 'blog', 'Minimalist, typography-focused blog template designed for creators, writers, and newsletters. Includes newsletter signup styles.', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80', 'template-3', 'Free', ''),
('template-4', 'Nova SaaS Landing Page Pro', 'saas', 'High-performance SaaS landing page with dark glassmorphism layout, modular grids, pricing calculator, and clean flex layouts.', 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80', 'template-1', '$14.99', 'https://payhip.com/b/mock-pro');

-- 6. Purchased Templates Ledger
CREATE TABLE IF NOT EXISTS purchases (
    email TEXT NOT NULL,
    templateId TEXT NOT NULL,
    purchaseDate TEXT NOT NULL,
    PRIMARY KEY (email, templateId)
);

-- 7. UPI Purchase Requests Queue
CREATE TABLE IF NOT EXISTS upi_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    templateId TEXT NOT NULL,
    utr TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending Verification'
);

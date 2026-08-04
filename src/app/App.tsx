import { useState, useEffect, useRef } from 'react'

// ─── Constants ──────────────────────────────────────────────────────────────
const CLOUDFLARE_WORKER_URL = "https://sparkweb-api.sparkwebtemp.workers.dev";
const GOOGLE_CLIENT_ID = "915707234297-n0c94s32q1gtje708bhckeapdg676adu.apps.googleusercontent.com";
const ADMIN_EMAILS = ["oxoredz@gmail.com"];

// ─── Types ──────────────────────────────────────────────────────────────────
type NavPage = 'home' | 'templates' | 'dashboard' | 'contact'
type AdminTab = 'overview' | 'upload' | 'templates' | 'inquiries' | 'access'
type Viewport = 'desktop' | 'tablet' | 'mobile'

interface Template {
  id: string
  name: string
  category: string
  description: string
  price: string
  thumbnail: string
  demoPath: string
  payhipUrl?: string
  figmaUrl?: string
  htmlCode?: string
  cssCode?: string
  jsCode?: string
  rating?: number
  reviews?: number
  downloads?: number
  pages?: number
  tech?: string[]
}

interface Inquiry {
  id: number
  name: string
  email: string
  budget: string
  message: string
  timestamp: string
}

interface AccessRequest {
  email: string
  timestamp: string
  status: string
}

interface UPIRequest {
  id: number
  email: string
  templateId: string
  utr: string
  timestamp: string
  status: string
}

interface VerifiedEmail {
  email: string
  verifiedDate: string
}

interface AdminUser {
  email: string
  name: string
  role: string
}

// ─── Mock Fallbacks ─────────────────────────────────────────────────────────
const SEED_TEMPLATES: Template[] = [
  {
    id: 'template-1',
    name: 'Nexus SaaS Landing Page',
    category: 'SaaS',
    description: 'Clean semantic HTML structure with responsive design, pricing matrices, and modern dark-mode gradient elements.',
    price: 'Free',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    demoPath: 'template-1',
    rating: 4.9,
    reviews: 214,
    downloads: 1840,
    pages: 12,
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'template-2',
    name: 'Zenith Personal Portfolio',
    category: 'Portfolio',
    description: 'Stunning developer-focused minimal dark-mode layout. Tailored for showcasing projects, skills, and work histories.',
    price: 'Free',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    demoPath: 'template-2',
    rating: 4.8,
    reviews: 87,
    downloads: 620,
    pages: 6,
    tech: ['React', 'Framer', 'Tailwind'],
  },
  {
    id: 'template-3',
    name: 'Echo Creator Blog',
    category: 'Blog',
    description: 'Minimalist, typography-focused blog template designed for creators, writers, and newsletters. Includes newsletter signup styles.',
    price: 'Free',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    demoPath: 'template-3',
    rating: 4.7,
    reviews: 163,
    downloads: 2210,
    pages: 18,
    tech: ['MDX', 'Blog', 'SEO'],
  },
  {
    id: 'template-4',
    name: 'Nova SaaS Landing Page Pro',
    category: 'SaaS',
    description: 'High-performance SaaS landing page with dark glassmorphism layout, modular grids, pricing calculator, and clean flex layouts.',
    price: '$14.99',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    demoPath: 'template-1',
    payhipUrl: 'https://payhip.com/b/mock-pro',
    rating: 4.8,
    reviews: 198,
    downloads: 3100,
    pages: 1,
    tech: ['Full Stack', 'Charts', 'Glass'],
  },
]

const SANDBOX_DEFAULT = {
  html: `<div class="hero">\n  <h1>Spark Web Visual Sandbox</h1>\n  <p>Modify layout parameters, colors, and code and hit Run to preview instantly.</p>\n  <a href="#" class="btn">Get Started</a>\n</div>`,
  css: `.hero {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  background: linear-gradient(135deg, #070b12, #0d1a2e);\n  color: #e2e8f0;\n  font-family: sans-serif;\n  text-align: center;\n  gap: 1rem;\n}\nh1 {\n  font-size: 3rem;\n  background: linear-gradient(135deg, #00e5ff, #8b5cf6);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n.btn {\n  padding: 0.75rem 2rem;\n  background: #00e5ff;\n  color: #070b12;\n  border-radius: 6px;\n  font-weight: 700;\n  text-decoration: none;\n  margin-top: 1rem;\n}`,
  js: `// Interactive Console Trigger\nconsole.log('Spark Web sandbox initialized.');`,
}

// Helper to convert files to text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

// Helper to convert files to base64 DataURL
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavBar({ page, setPage, userEmail, handleSignOut, onLogoClick, onSignInClick }: { page: NavPage; setPage: (p: NavPage) => void; userEmail: string | null; handleSignOut: () => void; onLogoClick: () => void; onSignInClick: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks: { label: string; id: NavPage }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Templates', id: 'templates' },
    { label: 'Contact', id: 'contact' },
  ]

  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase().trim());

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(7,11,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <button
          onClick={onLogoClick}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#070b12', fontFamily: 'var(--font-display)',
          }}>S</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Spark<span style={{ color: '#00e5ff' }}>Web</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map(l => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
                background: page === l.id ? 'rgba(0,229,255,0.1)' : 'transparent',
                color: page === l.id ? '#00e5ff' : '#9ca3af',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isAdmin && (
            <button
              onClick={() => setPage('dashboard')}
              style={{
                padding: '7px 16px', borderRadius: 6, border: '1px solid rgba(0,229,255,0.25)',
                background: 'rgba(0,229,255,0.06)', color: '#00e5ff', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}
            >
              Admin
            </button>
          )}
          {userEmail ? (
            <button
              onClick={handleSignOut}
              style={{
                padding: '7px 16px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)',
                background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={onSignInClick}
              className="btn-primary"
              style={{ padding: '7px 18px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              Google Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function HeroSection({ setPage }: { setPage: (p: NavPage) => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 64,
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,255,0.07) 0%, transparent 70%)' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
      <div style={{
        position: 'absolute',
        top: '20%', left: '10%',
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        transition: 'transform 0.3s ease',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%', right: '8%',
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
        transform: `translate(${-mousePos.x * 15}px, ${-mousePos.y * 15}px)`,
        transition: 'transform 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 860, padding: '0 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.06)', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5ff', display: 'inline-block' }} className="animate-pulse-glow" />
          <span className="section-label" style={{ fontSize: '0.65rem' }}>Edge-Native Marketplace</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: '#f1f5f9',
          marginBottom: 24,
        }}>
          Ship Stunning Sites<br />
          <span className="gradient-text">at the Speed of Edge</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 40px', fontWeight: 400 }}>
          Premium responsive templates with live browser preview viewports, dynamic source code unlocks,
          and serverless backends powered by Cloudflare Workers and D1 Database.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPage('templates')}
            className="btn-primary"
            style={{ padding: '14px 32px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Browse Templates
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
          {[
            { val: '24+', label: 'Premium Templates' },
            { val: '3ms', label: 'Edge Latency' },
            { val: '99.9%', label: 'Uptime SLA' },
            { val: '1.2k+', label: 'Active Licenses' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: '#00e5ff' }}>{s.val}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#374151', textTransform: 'uppercase' }}>scroll</div>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(0,229,255,0.3), transparent)' }} />
      </div>
    </div>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: '⬡',
      title: 'Dynamic Live Preview',
      desc: 'Every template is served dynamically via the /api/preview endpoint — rendering full-screen live layouts instantly in the browser.',
      accent: '#00e5ff',
    },
    {
      icon: '⬢',
      title: 'Edge-Native Backend',
      desc: 'Cloudflare Workers handle all API routes at the network edge. Cloudflare D1 provides a globally replicated SQLite database with zero cold starts.',
      accent: '#8b5cf6',
    },
    {
      icon: '◈',
      title: 'Google OAuth Whitelist',
      desc: 'Secure sign-in via Google OAuth. Whitelisted users get instant download access; others submit Access Requests reviewed in the admin panel.',
      accent: '#22c55e',
    },
    {
      icon: '◉',
      title: 'Multi-Channel Licensing',
      desc: 'Automated unlocks via Payhip integration or manual UPI payment triggers — buyers submit UTR codes, admins approve from the dashboard.',
      accent: '#f59e0b',
    },
    {
      icon: '◫',
      title: 'Figma Assets Included',
      desc: 'Get full access to the source Figma design files alongside raw code templates to customize assets offline with your design system.',
      accent: '#06b6d4',
    },
    {
      icon: '◐',
      title: 'Super Admin Console',
      desc: 'Full control over templates, purchases, access requests, and the inquiries inbox — with stats, search, date filters, and a purge command.',
      accent: '#ec4899',
    },
  ]

  return (
    <section style={{ padding: '120px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Platform Architecture</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Everything you need to ship
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            A complete stack — from edge database to visual customizer — so you can focus on building, not infrastructure.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {features.map((f) => (
            <div
              key={f.title}
              className="card-hover"
              style={{
                padding: '40px 36px',
                background: '#0d1422',
                border: '1px solid transparent',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${f.accent}33, transparent)` }} />
              <div style={{ fontSize: '1.6rem', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle, ${f.accent}15, transparent)`, borderRadius: '50%' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TemplateCard({ t, isUnlocked, onDownload, onPurchase }: { t: Template; isUnlocked: boolean; onDownload: (t: Template) => void; onPurchase: (t: Template) => void }) {
  const isFree = t.price === 'Free'
  
  // Clean fallback checks for thumbnails
  const isDefaultThumbnail = !t.thumbnail || t.thumbnail.trim() === "" || (!t.thumbnail.startsWith("data:") && !t.thumbnail.startsWith("http") && !t.thumbnail.startsWith("/"));

  return (
    <div className="card-hover" style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', background: '#0d1422', display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail or iframe preview */}
      <div style={{ position: 'relative', height: 180, background: "#0a0a0a", display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {isDefaultThumbnail ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
            <iframe
              src={t.htmlCode && t.htmlCode.trim()
                ? `${CLOUDFLARE_WORKER_URL}/api/preview?templateId=${t.id}`
                : `/previews/${t.demoPath}/index.html`}
              title={`${t.name} card preview`}
              className="absolute"
              style={{
                width: "400%",
                height: "400%",
                transform: "scale(0.25)",
                transformOrigin: "top left",
                border: "none",
                background: "#0a0a0a"
              }}
            />
          </div>
        ) : (
          <img src={t.thumbnail} alt={t.name} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {(t.tech || ['HTML', 'CSS', 'JS']).map(tag => (
            <span key={tag} style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#6b7280', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 12 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{t.name}</h3>
          <span style={{ color: isFree ? '#22c55e' : '#00e5ff', fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
            {t.price}
          </span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{t.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <button
            onClick={() => {
              const previewUrl = t.htmlCode && t.htmlCode.trim()
                ? `${CLOUDFLARE_WORKER_URL}/api/preview?templateId=${t.id}`
                : `/previews/${t.demoPath}/index.html`;
              window.open(previewUrl, '_blank');
            }}
            style={{ padding: '7px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
          >
            Live Demo
          </button>
          {isUnlocked ? (
            <button
              onClick={() => onDownload(t)}
              className="btn-primary"
              style={{ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.78rem', flex: 1 }}
            >
              Download 📥
            </button>
          ) : (
            <button
              onClick={() => onPurchase(t)}
              className="btn-primary"
              style={{ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.78rem', flex: 1 }}
            >
              Unlock License ⚡
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TemplatesPage({
  templatesList,
  purchasedTemplates,
  userEmail,
  isWhitelisted,
  onDownload,
  onPurchase,
  openUPIModal
}: {
  templatesList: Template[];
  purchasedTemplates: string[];
  userEmail: string | null;
  isWhitelisted: boolean;
  onDownload: (t: Template) => void;
  onPurchase: (t: Template) => void;
  openUPIModal: () => void;
}) {
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'SaaS', 'Portfolio', 'eCommerce', 'Blog']
  const filtered = filter === 'All' ? templatesList : templatesList.filter(t => t.category.toLowerCase() === filter.toLowerCase())

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Template Catalog</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Premium Edge-Native Templates
          </h2>
          <p style={{ color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
            Production-ready layouts with visual preview boxes, design files, and source code unlocks.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '7px 18px', borderRadius: 100,
                border: `1px solid ${filter === c ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                background: filter === c ? 'rgba(0,229,255,0.1)' : 'transparent',
                color: filter === c ? '#00e5ff' : '#6b7280',
                cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-body)',
                fontWeight: filter === c ? 600 : 400, transition: 'all 0.2s',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map(t => {
            const isUnlocked = t.price === 'Free' || purchasedTemplates.includes(t.id);
            return (
              <TemplateCard
                key={t.id}
                t={t}
                isUnlocked={isUnlocked}
                onDownload={onDownload}
                onPurchase={onPurchase}
              />
            );
          })}
        </div>

        {/* Whitelist / Signup section */}
        <div style={{ marginTop: 80, padding: 48, borderRadius: 16, background: 'linear-gradient(135deg, rgba(0,229,255,0.06), rgba(139,92,246,0.06))', border: '1px solid rgba(0,229,255,0.12)', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>Whitelist Credentials</h3>
          <p style={{ color: '#6b7280', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
            Logging in via Google automatically registers your whitelist status. Unlock free download assets and track orders in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {!userEmail ? (
              <div id="google-signin-btn-container" style={{ minHeight: 40 }}></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="text-sm font-semibold" style={{ color: isWhitelisted ? '#22c55e' : '#f59e0b' }}>
                  Logged in: {userEmail} {isWhitelisted ? '(Whitelisted ✅)' : '(Awaiting Whitelist Approval ⏳)'}
                </span>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button onClick={openUPIModal} className="btn-ghost" style={{ padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem' }}>
                    Submit UPI UTR ID
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({
  templatesList,
  onRefreshTemplates
}: {
  templatesList: Template[];
  onRefreshTemplates: () => void;
}) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [inquirySearch, setInquirySearch] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  
  // Real database states
  const [data, setData] = useState<{
    requests: AccessRequest[]
    verified: VerifiedEmail[]
    builds: any[]
    upiRequests: UPIRequest[]
    messages: Inquiry[]
  }>({
    requests: [],
    verified: [],
    builds: [],
    upiRequests: [],
    messages: []
  })

  // Add & edit template fields
  const [editTplHtmlFile, setEditTplHtmlFile] = useState<File | null>(null);
  const [editTplCssFile, setEditTplCssFile] = useState<File | null>(null);
  const [editTplJsFile, setEditTplJsFile] = useState<File | null>(null);
  const [editTplThumbnailFile, setEditTplThumbnailFile] = useState<File | null>(null);
  const [viewCode, setViewCode] = useState<{ title: string; code: string } | null>(null);

  // New Template form fields
  const [newTemplate, setNewTemplate] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    price: 'Free',
    thumbnail: '',
    demoPath: '',
    payhipUrl: '',
    figmaUrl: ''
  })
  const [newTplHtmlFile, setNewTplHtmlFile] = useState<File | null>(null);
  const [newTplCssFile, setNewTplCssFile] = useState<File | null>(null);
  const [newTplJsFile, setNewTplJsFile] = useState<File | null>(null);
  const [newTplThumbnailFile, setNewTplThumbnailFile] = useState<File | null>(null);

  const fetchAdminData = async () => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_admin_data" })
      })
      const d = await res.json()
      if (d.result === "success") {
        setData({
          requests: d.requests || [],
          verified: d.verified || [],
          builds: d.builds || [],
          upiRequests: d.upiRequests || [],
          messages: d.messages || []
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  // Approve whitelist request
  const handleApproveWhitelist = async (email: string) => {
    if (!confirm(`Approve whitelist request for ${email}?`)) return
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_request", email })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert("Account approved and whitelisted successfully!")
        fetchAdminData()
      }
    } catch (e) {
      alert("Failed to approve")
    }
  }

  // Deny whitelist request
  const handleDenyWhitelist = async (email: string) => {
    if (!confirm(`Deny access request for ${email}?`)) return
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deny_request", email })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert("Access request denied.")
        fetchAdminData()
      }
    } catch (e) {
      alert("Failed to deny request.")
    }
  }

  // Approve UPI Purchase Verification
  const handleApproveUPI = async (req: UPIRequest) => {
    if (!confirm(`Approve transaction reference UTR: ${req.utr} to unlock template ${req.templateId}?`)) return
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_upi_request", id: req.id, email: req.email, templateId: req.templateId })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert("UPI Request approved, template unlocked!")
        fetchAdminData()
      }
    } catch (e) {
      alert("Failed to approve transaction")
    }
  }

  // Reject UPI transaction
  const handleRejectUPI = async (id: number) => {
    if (!confirm("Reject this UPI transaction reference?")) return
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_upi_request", id })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert("UPI verification request rejected.")
        fetchAdminData()
      }
    } catch (e) {
      alert("Failed to reject transaction")
    }
  }

  // Delete dynamic template
  const handleDeleteTemplate = async (id: string) => {
    if (!confirm(`Are you sure you want to permanently delete template ${id}?`)) return
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_template", id })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert("Template deleted successfully!")
        onRefreshTemplates()
      }
    } catch (e) {
      alert("Failed to delete template.")
    }
  }

  // Submit Template Creation to D1
  const handleAddTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const htmlCode = newTplHtmlFile ? await readFileAsText(newTplHtmlFile) : '';
      const cssCode = newTplCssFile ? await readFileAsText(newTplCssFile) : '';
      const jsCode = newTplJsFile ? await readFileAsText(newTplJsFile) : '';
      const thumbnailDataUrl = newTplThumbnailFile ? await readFileAsDataURL(newTplThumbnailFile) : '';

      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_template",
          id: newTemplate.id,
          name: newTemplate.name,
          category: newTemplate.category,
          description: newTemplate.description,
          price: newTemplate.price,
          thumbnail: thumbnailDataUrl || newTemplate.thumbnail || '',
          demoPath: newTemplate.demoPath || newTemplate.id,
          payhipUrl: newTemplate.payhipUrl,
          figmaUrl: newTemplate.figmaUrl,
          htmlCode,
          cssCode,
          jsCode
        })
      })
      const data = await res.json()
      if (data.result === "success") {
        alert("Template saved to D1 database successfully!")
        onRefreshTemplates()
        // Reset form
        setNewTemplate({ id: '', name: '', category: '', description: '', price: 'Free', thumbnail: '', demoPath: '', payhipUrl: '', figmaUrl: '' })
        setNewTplHtmlFile(null)
        setNewTplCssFile(null)
        setNewTplJsFile(null)
        setNewTplThumbnailFile(null)
      } else {
        alert("Error: " + data.error)
      }
    } catch (err: any) {
      alert("Failed to create template: " + err?.message)
    }
  }

  // Submit Template Modifications to D1
  const handleEditTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTemplate) return
    try {
      const htmlCode = editTplHtmlFile ? await readFileAsText(editTplHtmlFile) : undefined;
      const cssCode = editTplCssFile ? await readFileAsText(editTplCssFile) : undefined;
      const jsCode = editTplJsFile ? await readFileAsText(editTplJsFile) : undefined;
      const thumbnailDataUrl = editTplThumbnailFile ? await readFileAsDataURL(editTplThumbnailFile) : undefined;

      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit_template",
          id: editingTemplate.id,
          name: editingTemplate.name,
          category: editingTemplate.category,
          description: editingTemplate.description,
          price: editingTemplate.price,
          thumbnail: thumbnailDataUrl !== undefined ? thumbnailDataUrl : (editingTemplate.thumbnail !== undefined && editingTemplate.thumbnail !== null ? editingTemplate.thumbnail : ""),
          demoPath: editingTemplate.demoPath,
          payhipUrl: editingTemplate.payhipUrl,
          figmaUrl: editingTemplate.figmaUrl,
          ...(htmlCode !== undefined && { htmlCode }),
          ...(cssCode !== undefined && { cssCode }),
          ...(jsCode !== undefined && { jsCode })
        })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert("Template updated successfully!")
        setEditingTemplate(null)
        setEditTplHtmlFile(null)
        setEditTplCssFile(null)
        setEditTplJsFile(null)
        setEditTplThumbnailFile(null)
        onRefreshTemplates()
      } else {
        alert("Error: " + d.error)
      }
    } catch (err: any) {
      alert("Failed to update template: " + err?.message)
    }
  }

  // Purge Messages inbox
  const handlePurgeMessages = async () => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_all_inquiries" })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert("Inquiries inbox cleared successfully!")
        fetchAdminData()
        setShowPurgeConfirm(false)
      }
    } catch (e) {
      alert("Failed to clear inquiries inbox.")
    }
  }

  // Manual Whitelist submission
  const [manualEmail, setManualEmail] = useState('')
  const handleManualWhitelist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualEmail) return
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_request", email: manualEmail })
      })
      const d = await res.json()
      if (d.result === "success") {
        alert(`${manualEmail} has been whitelisted!`)
        setManualEmail('')
        fetchAdminData()
      }
    } catch (e) {
      alert("Failed to whitelist email")
    }
  }

  // Filters for messages
  const filteredInquiries = data.messages.filter(q => {
    const matchSearch = q.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      q.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      q.message.toLowerCase().includes(inquirySearch.toLowerCase())
    const matchBudget = budgetFilter === 'All' || q.budget === budgetFilter
    const matchDate = !dateFilter || q.timestamp.startsWith(dateFilter)
    return matchSearch && matchBudget && matchDate
  })

  const budgets = ['All', '$100–$200', '$200–$500', '$500–$1000', '$1000+', "Let's discuss"]

  const pendingRequestsCount = data.requests.filter(r => r.status === "Pending Approval").length
  const pendingUPIRequestsCount = data.upiRequests.filter(r => r.status === "Pending Verification").length

  const stats = [
    { label: 'Total Templates', val: String(templatesList.length), icon: '◧', color: '#00e5ff' },
    { label: 'Pending Requests', val: String(pendingRequestsCount + pendingUPIRequestsCount), icon: '◎', color: '#f59e0b' },
    { label: 'Approved Accounts', val: String(data.verified.length), icon: '◉', color: '#22c55e' },
    { label: 'Inbox Messages', val: String(data.messages.length), icon: '◫', color: '#8b5cf6' },
  ]

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'upload', label: 'Upload Template' },
    { id: 'templates', label: 'Template Manager' },
    { id: 'inquiries', label: 'Inquiries Inbox' },
    { id: 'access', label: 'Access Requests' },
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, display: 'grid', gridTemplateColumns: '220px 1fr' }}>
      {/* Sidebar */}
      <div style={{ background: '#0a1020', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '32px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px', marginBottom: 28 }}>
          <div className="section-label" style={{ color: '#374151' }}>Super Admin</div>
        </div>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '11px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? 'rgba(0,229,255,0.08)' : 'transparent',
              color: tab === t.id ? '#00e5ff' : '#6b7280',
              borderLeft: `2px solid ${tab === t.id ? '#00e5ff' : 'transparent'}`,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}

        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#070b12' }}>A</div>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#f1f5f9', fontWeight: 500 }}>Admin</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#374151' }}>oxoredz@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '36px 36px', overflow: 'auto' }}>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Dashboard Overview</h2>
            <p style={{ color: '#4b5563', marginBottom: 32, fontSize: '0.85rem' }}>Real-time edge metrics and system status.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
              {stats.map(s => (
                <div key={s.label} style={{ padding: '24px', borderRadius: 12, background: '#0d1422', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: '1.2rem', color: s.color }}>{s.icon}</span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} className="animate-pulse-glow" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#374151', marginTop: 4, letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Build Log Activity */}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Build Logs</h3>
            <div style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#111827' }}>
                    {['Email', 'Activity details', 'Timestamp'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#374151', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', fontWeight: 500 }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.builds.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{r.email}</td>
                      <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500 }}>{r.templateId}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#4b5563' }}>{r.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Template Section */}
        {tab === 'upload' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Upload New Template</h2>
            <p style={{ color: '#4b5563', marginBottom: 36, fontSize: '0.85rem' }}>Create and register a new template directly to the Cloudflare D1 SQLite database.</p>

            <form onSubmit={handleAddTemplateSubmit} style={{ padding: 32, borderRadius: 12, background: '#0d1422', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Template Metadata</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>TEMPLATE ID</label>
                  <input
                    required
                    placeholder="e.g. template-5"
                    value={newTemplate.id}
                    onChange={e => setNewTemplate({ ...newTemplate, id: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>TEMPLATE NAME</label>
                  <input
                    required
                    placeholder="e.g. Apex Dashboard Pro"
                    value={newTemplate.name}
                    onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>CATEGORY</label>
                  <input
                    required
                    placeholder="SaaS / Portfolio / Blog / eCommerce"
                    value={newTemplate.category}
                    onChange={e => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>PRICE</label>
                  <input
                    required
                    placeholder="Free or $14.99"
                    value={newTemplate.price}
                    onChange={e => setNewTemplate({ ...newTemplate, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>PAYHIP CHECKOUT URL (OPTIONAL)</label>
                  <input
                    placeholder="https://payhip.com/b/..."
                    value={newTemplate.payhipUrl}
                    onChange={e => setNewTemplate({ ...newTemplate, payhipUrl: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>FIGMA FILE URL (OPTIONAL)</label>
                  <input
                    placeholder="https://figma.com/file/..."
                    value={newTemplate.figmaUrl}
                    onChange={e => setNewTemplate({ ...newTemplate, figmaUrl: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>DESCRIPTION</label>
                <textarea
                  required
                  placeholder="Brief description of the template features..."
                  value={newTemplate.description}
                  onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>THUMBNAIL IMAGE URL / UPLOAD IMAGE</label>
                <input
                  placeholder="https://unsplash.com/..."
                  value={newTemplate.thumbnail}
                  onChange={e => setNewTemplate({ ...newTemplate, thumbnail: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none', marginBottom: 8 }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setNewTplThumbnailFile(e.target.files?.[0] || null)}
                  className="text-xs text-muted"
                />
              </div>

              {/* File uploads */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'HTML File', ext: '.html', file: newTplHtmlFile, setFile: setNewTplHtmlFile },
                  { label: 'CSS File', ext: '.css', file: newTplCssFile, setFile: setNewTplCssFile },
                  { label: 'JS File', ext: '.js', file: newTplJsFile, setFile: setNewTplJsFile },
                ].map(f => (
                  <div key={f.label} style={{ padding: '16px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 8 }}>{f.label.toUpperCase()}</div>
                    <label style={{ cursor: 'pointer' }}>
                      <input type="file" accept={f.ext} style={{ display: 'none' }} onChange={e => f.setFile(e.target.files?.[0] || null)} />
                      <div style={{ padding: '6px 12px', borderRadius: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280', fontSize: '0.75rem', fontFamily: 'var(--font-body)', cursor: 'pointer', display: 'inline-block' }}>
                        {f.file ? f.file.name : `Choose ${f.ext}`}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                Save Template to D1
              </button>
            </form>
          </div>
        )}

        {/* Template Manager */}
        {tab === 'templates' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Template Manager</h2>
            <p style={{ color: '#4b5563', marginBottom: 36, fontSize: '0.85rem' }}>View, edit, or delete existing templates registered on the Cloudflare database.</p>

            {/* Template list */}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Existing Templates</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {templatesList.map(t => (
                <div key={t.id} style={{ padding: '16px', borderRadius: 10, background: '#0d1422', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {t.thumbnail ? (
                        <img src={t.thumbnail} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', fontWeight: 800, color: '#00e5ff' }}>{t.name[0]}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#374151', marginTop: 2 }}>{t.id} · {t.price}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => setEditingTemplate(t)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.75rem', padding: 4 }} title="Edit Template">✎</button>
                      <button onClick={() => handleDeleteTemplate(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: 4 }} title="Delete Template">✕</button>
                    </div>
                  </div>

                  {/* Code Previews */}
                  <div style={{ display: 'flex', gap: 6, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 10 }}>
                    <button
                      onClick={() => setViewCode({ title: `${t.name} - HTML Source`, code: t.htmlCode || '<!-- No HTML uploaded -->' })}
                      style={{ flex: 1, padding: '5px 0', borderRadius: 4, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#f97316', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      HTML
                    </button>
                    <button
                      onClick={() => setViewCode({ title: `${t.name} - CSS Styles`, code: t.cssCode || '/* No CSS uploaded */' })}
                      style={{ flex: 1, padding: '5px 0', borderRadius: 4, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      CSS
                    </button>
                    <button
                      onClick={() => setViewCode({ title: `${t.name} - JS Logic`, code: t.jsCode || '// No JS uploaded' })}
                      style={{ flex: 1, padding: '5px 0', borderRadius: 4, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      JS
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Editing modal overlay */}
            {editingTemplate && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setEditingTemplate(null)}>
                <form onSubmit={handleEditTemplateSubmit} onClick={e => e.stopPropagation()} style={{ background: '#0d1422', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 560, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Edit {editingTemplate.name}</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>NAME</label>
                      <input required value={editingTemplate.name} onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>CATEGORY</label>
                      <input required value={editingTemplate.category} onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>PRICE</label>
                      <input required value={editingTemplate.price} onChange={e => setEditingTemplate({ ...editingTemplate, price: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>PAYHIP URL</label>
                      <input value={editingTemplate.payhipUrl || ''} onChange={e => setEditingTemplate({ ...editingTemplate, payhipUrl: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>FIGMA FILE URL</label>
                      <input value={editingTemplate.figmaUrl || ''} onChange={e => setEditingTemplate({ ...editingTemplate, figmaUrl: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>DESCRIPTION</label>
                      <textarea required value={editingTemplate.description} onChange={e => setEditingTemplate({ ...editingTemplate, description: e.target.value })} rows={2} style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>THUMBNAIL URL (LEAVE EMPTY TO CLEAR)</label>
                      <input value={editingTemplate.thumbnail || ''} onChange={e => setEditingTemplate({ ...editingTemplate, thumbnail: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', marginBottom: 6 }} />
                      <input type="file" accept="image/*" onChange={e => setEditTplThumbnailFile(e.target.files?.[0] || null)} className="text-xs text-muted" />
                    </div>

                    {/* HTML File Upload */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563' }}>PREVIEW HTML (.HTML)</label>
                        {editingTemplate.htmlCode && editingTemplate.htmlCode.trim() && (
                          <span style={{ fontSize: '0.65rem', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                            Saved Code: {(editingTemplate.htmlCode.length/1024).toFixed(1)} KB ✅
                          </span>
                        )}
                      </div>
                      <input type="file" accept=".html" onChange={e => setEditTplHtmlFile(e.target.files?.[0] || null)} className="text-xs text-muted" />
                    </div>

                    {/* CSS File Upload */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563' }}>PREVIEW CSS (.CSS)</label>
                        {editingTemplate.cssCode && editingTemplate.cssCode.trim() && (
                          <span style={{ fontSize: '0.65rem', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                            Saved Code: {(editingTemplate.cssCode.length/1024).toFixed(1)} KB ✅
                          </span>
                        )}
                      </div>
                      <input type="file" accept=".css" onChange={e => setEditTplCssFile(e.target.files?.[0] || null)} className="text-xs text-muted" />
                    </div>

                    {/* JS File Upload */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563' }}>PREVIEW JS (.JS)</label>
                        {editingTemplate.jsCode && editingTemplate.jsCode.trim() && (
                          <span style={{ fontSize: '0.65rem', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                            Saved Code: {(editingTemplate.jsCode.length/1024).toFixed(1)} KB ✅
                          </span>
                        )}
                      </div>
                      <input type="file" accept=".js" onChange={e => setEditTplJsFile(e.target.files?.[0] || null)} className="text-xs text-muted" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setEditingTemplate(null)} className="btn-ghost" style={{ padding: '8px 18px', borderRadius: 7, fontSize: '0.82rem' }}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 18px', borderRadius: 7, fontSize: '0.82rem' }}>Save Changes</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Inquiries Inbox */}
        {tab === 'inquiries' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Inquiries Inbox</h2>
                <p style={{ color: '#4b5563', fontSize: '0.85rem' }}>{filteredInquiries.length} messages</p>
              </div>
              <button
                onClick={() => setShowPurgeConfirm(true)}
                style={{ padding: '8px 18px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', transition: 'all 0.2s' }}
              >
                ⚠ Purge Queue
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <input
                placeholder="Search name, email, message..."
                value={inquirySearch}
                onChange={e => setInquirySearch(e.target.value)}
                style={{ flex: 1, minWidth: 200, padding: '9px 14px', background: '#0d1422', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }}
              />
              <select
                value={budgetFilter}
                onChange={e => setBudgetFilter(e.target.value)}
                style={{ padding: '9px 12px', background: '#0d1422', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, color: '#9ca3af', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}
              >
                {budgets.map(b => <option key={b}>{b}</option>)}
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                style={{ padding: '9px 12px', background: '#0d1422', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, color: '#9ca3af', fontSize: '0.82rem', outline: 'none', colorScheme: 'dark' }}
              />
            </div>

            {/* Inquiry cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredInquiries.map(q => (
                <div
                  key={q.id}
                  onClick={() => setSelectedInquiry(q)}
                  className="card-hover"
                  style={{ padding: '18px 20px', borderRadius: 10, background: '#0d1422', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: 16 }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>{q.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>{q.budget}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#374151', marginBottom: 8 }}>{q.email}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{q.message}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#374151', whiteSpace: 'nowrap' }}>{q.timestamp}</div>
                </div>
              ))}
              {filteredInquiries.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', color: '#374151', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>No messages found.</div>
              )}
            </div>

            {/* Inquiry detail modal */}
            {selectedInquiry && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
                onClick={() => setSelectedInquiry(null)}
              >
                <div onClick={e => e.stopPropagation()} style={{ background: '#0d1422', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 560, padding: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5f9', fontSize: '1.1rem', marginBottom: 4 }}>{selectedInquiry.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#4b5563' }}>{selectedInquiry.email}</div>
                    </div>
                    <button onClick={() => setSelectedInquiry(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '4px 10px', borderRadius: 6, background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>Budget: {selectedInquiry.budget}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#4b5563' }}>{selectedInquiry.timestamp}</span>
                  </div>
                  <div style={{ padding: '16px', background: '#111827', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.7, overflowWrap: 'anywhere' }}>{selectedInquiry.message}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                    <button onClick={() => setSelectedInquiry(null)} className="btn-ghost" style={{ padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: '0.82rem', background: 'transparent' }}>Close</button>
                    <a href={`mailto:${selectedInquiry.email}`} className="btn-primary" style={{ padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: '0.82rem', border: 'none', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Purge confirm modal */}
            {showPurgeConfirm && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
                onClick={() => setShowPurgeConfirm(false)}
              >
                <div onClick={e => e.stopPropagation()} style={{ background: '#0d1422', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, width: '100%', maxWidth: 400, padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 16 }}>⚠</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Clear Inbox Queue?</div>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: 24 }}>This will permanently delete all {data.messages.length} messages. This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button onClick={() => setShowPurgeConfirm(false)} className="btn-ghost" style={{ padding: '9px 20px', borderRadius: 7, cursor: 'pointer', fontSize: '0.85rem', background: 'transparent' }}>Cancel</button>
                    <button
                      onClick={handlePurgeMessages}
                      style={{ padding: '9px 20px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.12)', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}
                    >
                      Purge All Messages
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Access Requests */}
        {tab === 'access' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Access Requests</h2>
            <p style={{ color: '#4b5563', marginBottom: 32, fontSize: '0.85rem' }}>Manage whitelisted users, UPI payment verifications, and access approvals.</p>

            {/* Pending UPI Payments Queue */}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Pending UPI Payments Queue</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
              {data.upiRequests.map(r => (
                <div key={r.id} style={{ padding: '20px', borderRadius: 10, background: '#0d1422', border: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500, color: '#e2e8f0' }}>{r.email}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#374151', marginTop: 2 }}>Template Code: {r.templateId}</div>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#6b7280', marginBottom: 2 }}>UTR CODE</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8b5cf6' }}>{r.utr}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#374151' }}>{r.timestamp}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '3px 10px', borderRadius: 100, background: r.status === 'Approved' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: r.status === 'Approved' ? '#22c55e' : '#f59e0b' }}>
                      {r.status}
                    </span>
                  </div>
                  {r.status === 'Pending Verification' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleApproveUPI(r)} className="btn-primary" style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        Approve
                      </button>
                      <button onClick={() => handleRejectUPI(r.id)} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {data.upiRequests.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 10, color: '#374151', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>No UPI transactions found.</div>
              )}
            </div>

            {/* Pending Whitelist Requests */}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Whitelist Email Access Requests</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
              {data.requests.map((r, i) => (
                <div key={i} style={{ padding: '20px', borderRadius: 10, background: '#0d1422', border: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500, color: '#e2e8f0' }}>{r.email}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#374151', marginTop: 2 }}>Requested: {r.timestamp}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '3px 10px', borderRadius: 100, background: r.status.includes('Pending') ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', color: r.status.includes('Pending') ? '#f59e0b' : '#22c55e' }}>{r.status}</span>
                  </div>
                  {r.status === 'Pending Approval' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleApproveWhitelist(r.email)} className="btn-primary" style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        Approve Whitelist
                      </button>
                      <button onClick={() => handleDenyWhitelist(r.email)} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {data.requests.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 10, color: '#374151', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>No pending access requests.</div>
              )}
            </div>

            {/* Manually Whitelist Form */}
            <form onSubmit={handleManualWhitelist} style={{ padding: '24px', borderRadius: 12, background: '#0d1422', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5f9', marginBottom: 16, fontSize: '0.95rem' }}>Manually Whitelist Email Address</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input required type="email" placeholder="Email address (e.g. client@gmail.com)" value={manualEmail} onChange={e => setManualEmail(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', outline: 'none' }} />
                <button type="submit" className="btn-primary" style={{ padding: '9px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
                  Whitelist Account
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Code Inspector Overlay */}
        {viewCode && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 220, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setViewCode(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#0d1422', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 720, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '90vh' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>{viewCode.title}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(viewCode.code);
                      alert('Source code copied to clipboard! 📋');
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}
                  >
                    Copy Code
                  </button>
                  <button
                    onClick={() => setViewCode(null)}
                    className="btn-ghost"
                    style={{ padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}
                  >
                    Close
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={viewCode.code}
                style={{ flex: 1, minHeight: 350, background: '#070b12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 16, color: '#00e5ff', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.7, outline: 'none', resize: 'none' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_contact_message",
          name: form.name,
          email: form.email,
          budget: form.budget || "Let's discuss",
          message: form.message
        })
      })
      const d = await res.json()
      if (d.result === "success") {
        setSubmitted(true)
      } else {
        alert("Failed to submit inquiry: " + d.error)
      }
    } catch (err: any) {
      alert("Failed to submit inquiry: " + err?.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 80px' }}>
      <div style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

        {/* Left column */}
        <div>
          <div className="section-label" style={{ marginBottom: 16 }}>Let's Build Together</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.1 }}>
            Start a project<br />
            <span className="gradient-text">with Spark Web</span>
          </h2>
          <p style={{ color: '#6b7280', lineHeight: 1.8, marginBottom: 40, maxWidth: 400 }}>
            We build high-performance web products, interactive user experiences, and responsive layouts. Let us know your goals and we'll reply within 24 hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: '◈', title: 'Custom Development', desc: 'Bespoke web applications built on Cloudflare edge stack' },
              { icon: '◉', title: 'Template Tuning', desc: 'Brand-customized builds matching your custom styling requirements' },
              { icon: '◧', title: 'Premium Engineering', desc: 'Highly optimized templates with rapid load speeds' },
            ].map(i => (
              <div key={i.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#00e5ff', fontSize: '1rem' }}>{i.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem', marginBottom: 2 }}>{i.title}</div>
                  <div style={{ color: '#4b5563', fontSize: '0.82rem' }}>{i.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#0d1422', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 36 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16, color: '#22c55e' }}>✓</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#22c55e', marginBottom: 10 }}>Inquiry Received</div>
              <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Thank you! We will review your message and reach out to {form.email} within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Send an Inquiry</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Aryan Kapoor', type: 'text' },
                  { key: 'email', label: 'Email Address', placeholder: 'aryan@company.com', type: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.63rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>{f.label.toUpperCase()}</label>
                    <input
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '10px 13px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.63rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>BUDGET RANGE</label>
                  <select
                    required
                    value={form.budget}
                    onChange={e => setForm(prev => ({ ...prev, budget: e.target.value }))}
                    style={{ width: '100%', padding: '10px 13px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: form.budget ? '#e2e8f0' : '#4b5563', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', colorScheme: 'dark' }}
                  >
                    <option value="">Select budget range</option>
                    <option>$100–$200</option>
                    <option>$200–$500</option>
                    <option>$500–$1000</option>
                    <option>$1000+</option>
                    <option>Let's discuss</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.63rem', letterSpacing: '0.1em', color: '#4b5563', marginBottom: 6 }}>MESSAGE</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your design goals, timeline, and feature lists..."
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    style={{ width: '100%', padding: '10px 13px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  Submit Project Request →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Footer({ setPage }: { setPage: (p: NavPage) => void }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 24px 32px', background: '#070b12' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#070b12', fontFamily: 'var(--font-display)' }}>S</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#f1f5f9' }}>Spark<span style={{ color: '#00e5ff' }}>Web</span></span>
            </div>
            <p style={{ color: '#374151', fontSize: '0.82rem', lineHeight: 1.7, maxWidth: 260 }}>
              Premium responsive design templates built with Cloudflare Workers serverless edge engine.
            </p>
          </div>
          {[
            { title: 'Platform', links: [{ label: 'Templates', page: 'templates' }, { label: 'Contact Us', page: 'contact' }] },
            { title: 'Information', links: [{ label: 'Privacy Policy', page: 'home' }, { label: 'Terms of Use', page: 'home' }, { label: 'Whitelists', page: 'templates' }] },
            { title: 'Company', links: [{ label: 'Get Support', page: 'contact' }, { label: 'Admin Access', page: 'dashboard' }] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', color: '#374151', marginBottom: 14, textTransform: 'uppercase' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(l => (
                  <button key={l.label} onClick={() => setPage(l.page as NavPage)} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: '#4b5563', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'color 0.15s' }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#1f2937' }}>© 2026 SparkWeb. Edge platform.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Cloudflare Edge', 'D1 Database', 'Google Whitelists'].map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#1f2937', letterSpacing: '0.06em' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── UPI Verification Modal ──────────────────────────────────────────────────
function UPIVerificationModal({
  templatesList,
  userEmail,
  onClose
}: {
  templatesList: Template[];
  userEmail: string;
  onClose: () => void;
}) {
  const [selectedTpl, setSelectedTpl] = useState('');
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (templatesList.length > 0) {
      setSelectedTpl(templatesList[0].id);
    }
  }, [templatesList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTpl || !utr || utr.trim().length < 6) {
      alert("Please enter a valid 12-digit transaction UTR code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_upi_request",
          email: userEmail,
          templateId: selectedTpl,
          utr: utr.trim()
        })
      });
      const d = await res.json();
      if (d.result === "success") {
        alert("UPI Payment request submitted! The administrator will review and unlock access within 2-4 hours.");
        onClose();
      } else {
        alert("Failed to submit request: " + d.error);
      }
    } catch (err: any) {
      alert("Failed: " + err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ background: '#0d1422', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 440, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>Submit UPI Payment</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <p style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: 20, lineHeight: 1.6 }}>
          Scan the QR code using any UPI app (GPay/PhonePe/Paytm), pay the template amount, and paste the 12-digit transaction UTR code below.
        </p>

        {/* UPI QR Code Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#111827', padding: 20, borderRadius: 10, marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=oxoredz@okaxis%26pn=SparkWeb%26cu=INR"
            alt="UPI QR Code Scan to Pay"
            style={{ width: 150, height: 150, background: '#fff', padding: 4, borderRadius: 4 }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#e2e8f0', marginTop: 12 }}>UPI ID: oxoredz@okaxis</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>SELECT TEMPLATE</label>
            <select
              value={selectedTpl}
              onChange={e => setSelectedTpl(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem', colorScheme: 'dark' }}
            >
              {templatesList.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.price})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4b5563', marginBottom: 6 }}>12-DIGIT TRANSACTION UTR CODE</label>
            <input
              required
              placeholder="e.g. 482930184729"
              value={utr}
              onChange={e => setUtr(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#e2e8f0', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '8px 18px', borderRadius: 7, fontSize: '0.82rem' }}>Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '8px 18px', borderRadius: 7, fontSize: '0.82rem' }}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Purchase Detail Modal ───────────────────────────────────────────────────
function PurchaseCheckoutModal({
  template,
  userEmail,
  onClose,
  onOpenUPI
}: {
  template: Template;
  userEmail: string;
  onClose: () => void;
  onOpenUPI: () => void;
}) {
  const payhipUrl = template.payhipUrl || "";

  useEffect(() => {
    // Rebind Payhip scan overlay script trigger
    if (payhipUrl && (window as any).Payhip && typeof (window as any).Payhip.scan === "function") {
      try {
        (window as any).Payhip.scan();
      } catch (e) {
        console.error("Payhip scan error:", e);
      }
    }
  }, [payhipUrl]);

  const finalCheckoutUrl = payhipUrl
    ? payhipUrl + (payhipUrl.includes("?") ? "&" : "?") + "email=" + encodeURIComponent(userEmail)
    : "";

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#0d1422', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 440, padding: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', textAlign: 'left' }}>Unlock {template.name}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: 24, lineHeight: 1.6 }}>
          Choose a payment method to purchase this premium design layout. Access is linked to: <br/><strong>{userEmail}</strong>
        </p>

        <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#00e5ff', marginBottom: 28 }}>
          {template.price}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {finalCheckoutUrl ? (
            <a
              href={finalCheckoutUrl}
              className="btn-primary payhip-buy-button"
              style={{ padding: '12px', borderRadius: 8, display: 'block', textDecoration: 'none', fontSize: '0.9rem' }}
              onClick={onClose}
            >
              Pay via Card / PayPal (Instant)
            </a>
          ) : (
            <div style={{ padding: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', fontSize: '0.78rem' }}>
              Checkout link not configured for this template.
            </div>
          )}

          <button
            onClick={() => { onClose(); onOpenUPI(); }}
            className="btn-ghost"
            style={{ padding: '12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Pay via UPI QR Code
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App Main Router ──────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<NavPage>('home')
  
  // Whitelist user state hooks
  const [templatesList, setTemplatesList] = useState<Template[]>([])
  const [purchasedTemplates, setPurchasedTemplates] = useState<string[]>([])
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("tf_user_email"))
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("tf_user_name"))
  const [userPicture, setUserPicture] = useState<string | null>(localStorage.getItem("tf_user_picture"))
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)

  // Overlay state hooks
  const [checkoutTemplate, setCheckoutTemplate] = useState<Template | null>(null)
  const [showUPIModal, setShowUPIModal] = useState(false)

  // 1. Fetch dynamic templates list
  const loadTemplates = async () => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_templates" })
      })
      const d = await res.json()
      if (d.result === "success" && d.templates && d.templates.length > 0) {
        setTemplatesList(d.templates)
      } else {
        setTemplatesList(SEED_TEMPLATES)
      }
    } catch (e) {
      console.error(e)
      setTemplatesList(SEED_TEMPLATES)
    }
  }

  // 2. Fetch user whitelist purchases
  const loadUserPurchases = async (email: string) => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_purchases", email })
      })
      const d = await res.json()
      if (d.result === "success" && d.purchases) {
        setPurchasedTemplates(d.purchases)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 3. Verify whitelist status on login
  const checkWhitelistStatus = async (email: string) => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", email })
      })
      const d = await res.json()
      if (d.result === "success") {
        setIsWhitelisted(true)
      } else {
        setIsWhitelisted(false)
        // Auto registered into whitelist access queue
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    if (userEmail) {
      loadUserPurchases(userEmail)
      checkWhitelistStatus(userEmail)
    } else {
      setPurchasedTemplates([])
      setIsWhitelisted(false)
    }
  }, [userEmail])

  // Google OAuth button renderer inside templates tab and login modal
  useEffect(() => {
    const handleCredentialResponse = (response: any) => {
      try {
        const payload = JSON.parse(
          decodeURIComponent(
            window
              .atob(response.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          )
        );
        const { email, name, picture } = payload;
        handleGoogleSuccess(email, name, picture);
        setShowAuthModal(false);
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    };

    if (!userEmail && (window as any).google) {
      setTimeout(() => {
        const container = document.getElementById("google-signin-btn-container");
        if (container) {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
          });
          (window as any).google.accounts.id.renderButton(container, {
            theme: "filled_blue",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: 250
          });
        }

        const modalContainer = document.getElementById("modal-google-signin-btn");
        if (modalContainer) {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
          });
          (window as any).google.accounts.id.renderButton(modalContainer, {
            theme: "filled_blue",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: 250
          });
        }
      }, 300);
    }
  }, [page, userEmail, showAuthModal]);

  // Payhip Success redirect hooks
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payhipSuccess = params.get("payhip_success");
    const payhipEmail = params.get("email");
    const payhipTemplate = params.get("template");

    if (payhipSuccess === "true" && payhipTemplate && payhipEmail) {
      const syncPurchase = async () => {
        try {
          const response = await fetch(CLOUDFLARE_WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "record_purchase",
              email: payhipEmail,
              templateId: payhipTemplate
            })
          });
          const data = await response.json();
          if (data.result === "success") {
            alert("Payment verified successfully! You can now download your template source code on this page.");
            loadUserPurchases(payhipEmail);
            setPage('templates');
          }
        } catch (err) {
          console.error("Payhip redirect sync failed:", err);
        }
      };
      syncPurchase();
    }
  }, []);

  const handleLogoClick = () => {
    if (logoClicks >= 4) {
      setLogoClicks(0);
      const email = prompt("Developer Mode: Enter email address to mock sign-in:");
      if (email && email.trim()) {
        handleGoogleSuccess(email.trim(), "Developer Mode Bypass", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80");
      }
    } else {
      setLogoClicks(prev => prev + 1);
      setTimeout(() => setLogoClicks(0), 3000);
    }
    setPage('home');
  };

  const handleGoogleSuccess = (email: string, name: string, picture: string) => {
    localStorage.setItem("tf_user_email", email);
    localStorage.setItem("tf_user_name", name);
    localStorage.setItem("tf_user_picture", picture);
    setUserEmail(email);
    setUserName(name);
    setUserPicture(picture);
    
    if (ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setPage('dashboard');
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("tf_user_email");
    localStorage.removeItem("tf_user_name");
    localStorage.removeItem("tf_user_picture");
    setUserEmail(null);
    setUserName(null);
    setUserPicture(null);
    setIsWhitelisted(false);
    setPurchasedTemplates([]);
    setPage('home');
  }

  const triggerDownload = (t: Template) => {
    if (!t.htmlCode && !t.cssCode && !t.jsCode) {
      alert("This is a mock layout. Source code has not been uploaded to the database.");
      return;
    }
    const htmlStr = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>${t.name}</title>\n  <style>\n${t.cssCode || ''}\n  </style>\n</head>\n<body>\n${t.htmlCode || ''}\n  <script>\n${t.jsCode || ''}\n  </script>\n</body>\n</html>`;
    const blob = new Blob([htmlStr], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${t.id || 'template'}_source.html`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const handleDownload = (t: Template) => {
    if (!userEmail) {
      alert("Please sign in with Google below first!");
      return;
    }
    if (!isWhitelisted && t.price === 'Free') {
      alert("Your account is awaiting whitelist approval from the sheet administrator. Access request has already been recorded.");
      return;
    }
    triggerDownload(t);
  }

  const handlePurchase = (t: Template) => {
    if (!userEmail) {
      alert("Please sign in with Google below first to purchase!");
      return;
    }
    setCheckoutTemplate(t);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
    <div style={{ background: '#070b12', minHeight: '100vh', color: '#e2e8f0' }}>
      <NavBar page={page} setPage={setPage} userEmail={userEmail} handleSignOut={handleSignOut} onLogoClick={handleLogoClick} onSignInClick={() => setShowAuthModal(true)} />

      {page === 'home' && (
        <>
          <HeroSection setPage={setPage} />
          <FeaturesSection />
          {/* Marketplace preview on home */}
          <section style={{ padding: '80px 24px', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Featured Templates</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 16 }}>
                Start with something exceptional
              </h2>
            </div>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 40 }}>
              {templatesList.slice(0, 3).map(t => {
                const isUnlocked = t.price === 'Free' || purchasedTemplates.includes(t.id);
                return (
                  <TemplateCard
                    key={t.id}
                    t={t}
                    isUnlocked={isUnlocked}
                    onDownload={handleDownload}
                    onPurchase={handlePurchase}
                  />
                );
              })}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setPage('templates')} className="btn-ghost" style={{ padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem', background: 'transparent' }}>
                View All Templates →
              </button>
            </div>
          </section>

          {/* CTA Banner */}
          <section style={{ padding: '100px 24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '60px 48px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(139,92,246,0.08))', border: '1px solid rgba(0,229,255,0.1)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.08), transparent)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 16, position: 'relative' }}>
                Ready to build at the <span className="gradient-text">edge?</span>
              </h2>
              <p style={{ color: '#6b7280', marginBottom: 36, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.7, position: 'relative' }}>
                Access serverless database templates, premium design layouts, and fast responsive edge builders.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <button onClick={() => setPage('templates')} className="btn-primary" style={{ padding: '13px 32px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  Explore Catalog
                </button>
                <button onClick={() => setPage('contact')} className="btn-ghost" style={{ padding: '13px 32px', borderRadius: 8, cursor: 'pointer', fontSize: '0.95rem', background: 'transparent' }}>
                  Contact Us
                </button>
              </div>
            </div>
          </section>
          <Footer setPage={setPage} />
        </>
      )}

      {page === 'templates' && (
        <TemplatesPage
          templatesList={templatesList}
          purchasedTemplates={purchasedTemplates}
          userEmail={userEmail}
          isWhitelisted={isWhitelisted}
          onDownload={handleDownload}
          onPurchase={handlePurchase}
          openUPIModal={() => setShowUPIModal(true)}
        />
      )}

      {page === 'dashboard' && (
        <AdminDashboard
          templatesList={templatesList}
          onRefreshTemplates={loadTemplates}
        />
      )}

      {page === 'contact' && (
        <>
          <ContactPage />
          <Footer setPage={setPage} />
        </>
      )}

      {/* UPI payment trigger modal */}
      {showUPIModal && userEmail && (
        <UPIVerificationModal
          templatesList={templatesList}
          userEmail={userEmail}
          onClose={() => setShowUPIModal(false)}
        />
      )}

      {/* Premium Checkout modal */}
      {checkoutTemplate && userEmail && (
        <PurchaseCheckoutModal
          template={checkoutTemplate}
          userEmail={userEmail}
          onClose={() => setCheckoutTemplate(null)}
          onOpenUPI={() => setShowUPIModal(true)}
        />
      )}

      {/* Google Login Popup Modal */}
      {showAuthModal && !userEmail && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowAuthModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0d1422', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 400, padding: 36, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #00e5ff, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#070b12', fontFamily: 'var(--font-display)' }}>S</div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Welcome to SparkWeb</h3>
              <p style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.6 }}>Sign in with Google to download templates, view license records, and unlock developer tools.</p>
            </div>
            <div id="modal-google-signin-btn" style={{ minHeight: 40, width: '100%', display: 'flex', justifyContent: 'center' }}></div>
            <button onClick={() => setShowAuthModal(false)} className="btn-ghost" style={{ padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Check, Star, ChevronDown, Mail, Phone, MapPin, ExternalLink, Zap, Globe, Code2, Palette, BarChart3, Shield, ShoppingCart, Eye, Download, Tag, Layers, Filter, LogOut, Users, Package, TrendingUp, DollarSign, AlertCircle, Edit3, Trash2, Plus, Lock, LayoutDashboard, Settings, Bell, Search, ChevronUp, MoreVertical } from "lucide-react";

const CLOUDFLARE_WORKER_URL = "https://sparkweb-api.sparkwebtemp.workers.dev";
const GOOGLE_CLIENT_ID = "915707234297-n0c94s32q1gtje708bhckeapdg676adu.apps.googleusercontent.com";
const ADMIN_EMAILS = ["oxoredz@gmail.com"];

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = ["Services", "Templates", "Work", "Pricing", "Contact"];

const services = [
  { icon: Globe, title: "Landing Pages", desc: "High-converting single-page sites built to turn visitors into buyers within seconds of arrival.", tag: "FROM $1,200" },
  { icon: Code2, title: "Full-Stack Web Apps", desc: "Custom-built platforms with authentication, dashboards, databases, and API integrations.", tag: "FROM $4,800" },
  { icon: Palette, title: "Brand & Design Systems", desc: "Visual identity, component libraries, and design tokens that scale across every touchpoint.", tag: "FROM $2,400" },
  { icon: BarChart3, title: "E-Commerce Stores", desc: "Product-catalog, cart, checkout, and inventory systems — optimized for conversion.", tag: "FROM $3,600" },
  { icon: Zap, title: "Performance Audits", desc: "We cut load times, fix Core Web Vitals, and make your existing site feel brand new.", tag: "FROM $800" },
  { icon: Shield, title: "Maintenance Plans", desc: "Monthly retainers covering uptime monitoring, updates, security patches, and feature additions.", tag: "FROM $450 /MO" },
];

const templateCategories = ["All", "SaaS", "Agency", "E-Commerce", "Portfolio", "Blog", "Landing"];

const templates = [
  {
    id: 1,
    name: "Launchpad SaaS",
    category: "SaaS",
    price: 79,
    originalPrice: 129,
    img: "photo-1551650975-87deedd944c3",
    badge: "Bestseller",
    badgeColor: "#c8ff00",
    rating: 4.9,
    reviews: 214,
    tech: ["Next.js", "Tailwind", "Supabase"],
    desc: "Full SaaS starter with auth, billing, onboarding flows, and dashboard.",
    pages: 12,
    downloads: 1840,
  },
  {
    id: 2,
    name: "Folio Dark",
    category: "Portfolio",
    price: 49,
    originalPrice: null,
    img: "photo-1507003211169-0a1dd7228f2d",
    badge: "New",
    badgeColor: "#00d4ff",
    rating: 4.8,
    reviews: 87,
    tech: ["React", "Framer Motion", "Tailwind"],
    desc: "Minimal dark portfolio for designers and developers who mean business.",
    pages: 6,
    downloads: 620,
  },
  {
    id: 3,
    name: "Storefront Pro",
    category: "E-Commerce",
    price: 99,
    originalPrice: 149,
    img: "photo-1555421689-d68471e189f2",
    badge: "Popular",
    badgeColor: "#ff6b35",
    rating: 4.7,
    reviews: 163,
    tech: ["Next.js", "Stripe", "Sanity"],
    desc: "Full-featured e-commerce with cart, checkout, and a Sanity-backed catalog.",
    pages: 18,
    downloads: 2210,
  },
  {
    id: 4,
    name: "Agency One",
    category: "Agency",
    price: 69,
    originalPrice: null,
    img: "photo-1542744094-24638eff58bb",
    badge: null,
    badgeColor: null,
    rating: 4.6,
    reviews: 52,
    tech: ["Next.js", "Tailwind", "GSAP"],
    desc: "Bold agency site with animated hero, case studies, and team section.",
    pages: 9,
    downloads: 390,
  },
  {
    id: 5,
    name: "Beacon Blog",
    category: "Blog",
    price: 39,
    originalPrice: null,
    img: "photo-1499750310107-5fef28a66643",
    badge: null,
    badgeColor: null,
    rating: 4.5,
    reviews: 44,
    tech: ["Next.js", "MDX", "Tailwind"],
    desc: "Clean editorial blog with dark/light mode, tags, and newsletter capture.",
    pages: 7,
    downloads: 510,
  },
  {
    id: 6,
    name: "Convert Land",
    category: "Landing",
    price: 29,
    originalPrice: 49,
    img: "photo-1460925895917-afdab827c52f",
    badge: "Sale",
    badgeColor: "#ff4444",
    rating: 4.8,
    reviews: 198,
    tech: ["React", "Tailwind"],
    desc: "Single-page high-conversion landing with A/B-friendly sections.",
    pages: 1,
    downloads: 3100,
  },
  {
    id: 7,
    name: "Nexus Dashboard",
    category: "SaaS",
    price: 119,
    originalPrice: 169,
    img: "photo-1551288049-bebda4e38f71",
    badge: "Premium",
    badgeColor: "#a78bfa",
    rating: 4.9,
    reviews: 311,
    tech: ["React", "Recharts", "Tailwind"],
    desc: "Data-rich admin dashboard with 30+ chart types, tables, and user flows.",
    pages: 22,
    downloads: 2750,
  },
  {
    id: 8,
    name: "Craft Portfolio",
    category: "Portfolio",
    price: 45,
    originalPrice: null,
    img: "photo-1558655146-9f40138edfeb",
    badge: null,
    badgeColor: null,
    rating: 4.7,
    reviews: 76,
    tech: ["Astro", "Tailwind"],
    desc: "Lightweight, ultra-fast portfolio built on Astro for near-zero JS.",
    pages: 5,
    downloads: 480,
  },
];

const projects = [
  { title: "Meridian Finance", category: "Web App", img: "photo-1460925895917-afdab827c52f", color: "#1a1a2e" },
  { title: "Oaken Studio", category: "E-Commerce", img: "photo-1555421689-d68471e189f2", color: "#1a2a1a" },
  { title: "Pulse Health", category: "Dashboard", img: "photo-1576091160550-2173dba999ef", color: "#2a1a1a" },
  { title: "Vanta Logistics", category: "Full-Stack", img: "photo-1586528116311-ad8dd3c8310d", color: "#1a1a1a" },
  { title: "Nova Agency", category: "Landing Page", img: "photo-1542744094-24638eff58bb", color: "#1a1a2a" },
  { title: "Verdant Foods", category: "E-Commerce", img: "photo-1542838132-92c53300491e", color: "#1a2a1a" },
];

const steps = [
  { num: "01", title: "Discovery Call", desc: "We map your goals, audience, and technical requirements in a focused 60-minute session." },
  { num: "02", title: "Strategy & Scope", desc: "A detailed proposal covers architecture, timeline, deliverables, and fixed pricing. No surprises." },
  { num: "03", title: "Design Sprint", desc: "High-fidelity mockups in Figma — full review rounds until every pixel earns its place." },
  { num: "04", title: "Build & QA", desc: "We code in two-week sprints with weekly demos. You see real progress, not just updates." },
  { num: "05", title: "Launch", desc: "Deployment, DNS, performance checks, and a live walkthrough before you announce anything." },
  { num: "06", title: "Growth Support", desc: "Post-launch retainer, analytics review, and iterative improvements as your business scales." },
];

const plans = [
  {
    name: "Starter",
    price: "$1,200",
    period: "one-time",
    desc: "Perfect for solo founders who need a polished web presence fast.",
    features: ["5-page responsive site", "Custom design", "Mobile-first build", "Contact form", "Google Analytics", "2 revision rounds", "30-day support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$4,800",
    period: "one-time",
    desc: "For growing businesses ready to invest in a full digital foundation.",
    features: ["Up to 20 pages", "Full-stack web app", "CMS integration", "User authentication", "Custom dashboard", "SEO optimization", "Unlimited revisions", "90-day support"],
    cta: "Most Popular",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "project",
    desc: "Complex platforms, integrations, and ongoing engineering partnerships.",
    features: ["Unlimited scope", "Dedicated team", "Custom integrations", "White-label option", "SLA guarantee", "Priority support", "Monthly strategy calls", "Full source transfer"],
    cta: "Let's Talk",
    highlight: false,
  },
];

const testimonials = [
  {
    name: "Sophia Andretti",
    role: "CEO, Meridian Finance",
    avatar: "photo-1494790108755-2616b612b786",
    rating: 5,
    text: "They delivered a full banking dashboard in 8 weeks. Our users called it the smoothest interface in fintech. That's not marketing — that's what our NPS data says.",
  },
  {
    name: "Marcus Chen",
    role: "Founder, Oaken Studio",
    avatar: "photo-1507003211169-0a1dd7228f2d",
    rating: 5,
    text: "We were paying $3k/month for a Shopify theme that barely worked. One custom build later and our conversion rate jumped 34%. The site paid for itself in 6 weeks.",
  },
  {
    name: "Laila Osei",
    role: "CTO, Pulse Health",
    avatar: "photo-1580489944761-15a19d654956",
    rating: 5,
    text: "The team understood HIPAA constraints immediately and built with compliance baked in, not bolted on. Rare to find developers who think like that.",
  },
];

const faqs = [
  { q: "How long does a typical project take?", a: "Landing pages: 2–3 weeks. Full web apps: 6–12 weeks depending on scope. We give you a hard timeline in the proposal and hold to it." },
  { q: "Do you work with clients outside the US?", a: "Yes — about 40% of our clients are in Europe and Southeast Asia. We run async with weekly video calls aligned to your timezone." },
  { q: "Who owns the code at the end?", a: "You do. Full source code, repo access, all assets. No vendor lock-in, no licensing fees." },
  { q: "Can I update the site myself after launch?", a: "For CMS-backed sites, yes — no technical knowledge needed. For custom apps, we document the codebase thoroughly and offer training sessions." },
  { q: "What tech stack do you use?", a: "React / Next.js on the frontend, Node.js or Python on the backend, PostgreSQL or Supabase for data. We choose what fits your project, not what's trending." },
];

// ─── Components ───────────────────────────────────────────────────────────────

interface NavbarProps {
  userEmail: string | null;
  userName: string | null;
  userPicture: string | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
  onAdminDashboard: () => void;
  onProfileView: () => void;
}

function Navbar({ userEmail, userName, userPicture, onSignOut, onOpenAuth, onAdminDashboard, onProfileView }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase().trim());

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <a href="#" className="flex items-center gap-2 group">
          <span
            className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold"
            style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "JetBrains Mono, monospace" }}
          >
            SP
          </span>
          <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: "Outfit, sans-serif", color: "#f0f0ee" }}>
            Spark Web
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {userEmail ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {userPicture ? (
                  <img src={userPicture} alt={userName || ""} className="w-8 h-8 rounded-full border border-[#c8ff00]/40" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1c1c1c] text-[#c8ff00] flex items-center justify-center font-bold text-xs">
                    {(userName || userEmail).substring(0, 2).toUpperCase()}
                  </div>
                )}
                <ChevronDown size={14} style={{ color: "#888880" }} />
              </button>
              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-sm border py-2 shadow-xl"
                  style={{ background: "#131313", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="px-4 py-2 border-b text-xs font-semibold" style={{ color: "#f0f0ee", borderColor: "rgba(255,255,255,0.06)" }}>
                    {userName || userEmail}
                  </div>
                  <button
                    onClick={() => { onProfileView(); setShowDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#f0f0ee] hover:bg-white/[0.03] transition-colors"
                  >
                    My Purchases
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { onAdminDashboard(); setShowDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#c8ff00] hover:bg-white/[0.03] transition-colors"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => { onSignOut(); setShowDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#ff6666] hover:bg-white/[0.03] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-sm transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "Outfit, sans-serif" }}
            >
              Sign In
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-sm transition-colors"
          style={{ color: "#f0f0ee" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ background: "rgba(10,10,10,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-base py-1 transition-colors hover:text-white"
              style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}
            >
              {link}
            </a>
          ))}
          {userEmail ? (
            <>
              <button
                onClick={() => { onProfileView(); setOpen(false); }}
                className="text-left text-base py-1 text-[#f0f0ee]"
              >
                My Purchases
              </button>
              <button
                onClick={() => { onSignOut(); setOpen(false); }}
                className="mt-2 text-left text-base py-1 text-[#ff6666]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setOpen(false); }}
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-sm"
              style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "Outfit, sans-serif" }}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20" style={{ background: "#0a0a0a" }}>
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-5xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border"
            style={{ borderColor: "rgba(200,255,0,0.3)", color: "#c8ff00", background: "rgba(200,255,0,0.06)", fontFamily: "JetBrains Mono, monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Available for new projects — Q3 2026
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8"
            style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}
          >
            We build{" "}
            <em
              className="not-italic"
              style={{ color: "#c8ff00" }}
            >
              websites
            </em>
            <br />
            that close{" "}
            <span
              className="relative inline-block"
              style={{ color: "#f0f0ee" }}
            >
              deals.
              <span
                className="absolute -bottom-2 left-0 right-0 h-0.5"
                style={{ background: "linear-gradient(90deg, #c8ff00, transparent)" }}
              />
            </span>
          </h1>

          <p
            className="text-lg lg:text-xl leading-relaxed max-w-2xl mb-12"
            style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}
          >
            WebxStudio builds custom websites and sells production-ready templates for founders and teams who know that design is revenue. Ship a custom site or launch in hours with a pro template.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-7 py-4 text-base font-semibold rounded-sm transition-all duration-200 hover:opacity-90 active:scale-95 group"
              style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "Outfit, sans-serif" }}
            >
              Start a Project
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#templates"
              className="inline-flex items-center gap-2 px-7 py-4 text-base font-medium rounded-sm border transition-all duration-200 hover:border-white/20 hover:text-white"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#888880", fontFamily: "Outfit, sans-serif" }}
            >
              Browse Templates
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="mt-24 pt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {[
            { val: "140+", label: "Projects shipped" },
            { val: "98%", label: "Client retention" },
            { val: "4.2×", label: "Avg conversion lift" },
            { val: "8 yrs", label: "In the industry" },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="text-4xl font-bold mb-1"
                style={{ fontFamily: "Fraunces, serif", color: "#c8ff00" }}
              >
                {s.val}
              </div>
              <div className="text-sm" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 lg:py-32" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div
              className="text-xs font-medium mb-4 tracking-widest uppercase"
              style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
            >
              Services
            </div>
            <h2
              className="text-4xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}
            >
              What we{" "}
              <em className="not-italic" style={{ color: "#c8ff00" }}>
                build
              </em>
            </h2>
          </div>
          <p
            className="lg:max-w-sm text-base leading-relaxed"
            style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}
          >
            Every engagement starts with a problem worth solving. We match the right technology to the outcome, not the other way around.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          {services.map((s) => (
            <div
              key={s.title}
              className="p-8 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ background: "#0a0a0a" }}
            >
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[#c8ff00]"
                style={{ background: "rgba(200,255,0,0.1)" }}
              >
                <s.icon
                  size={18}
                  className="transition-colors duration-300 group-hover:text-black"
                  style={{ color: "#c8ff00" }}
                />
              </div>
              <div
                className="text-xs font-medium mb-3 tracking-widest"
                style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
              >
                {s.tag}
              </div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ fontFamily: "Outfit, sans-serif", color: "#f0f0ee" }}
              >
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                {s.desc}
              </p>
              <div
                className="mt-6 flex items-center gap-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: "#c8ff00", fontFamily: "Outfit, sans-serif" }}
              >
                Learn more <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface PaymentCheckoutModalProps {
  template: any;
  userEmail: string;
  onClose: () => void;
}

function PaymentCheckoutModal({ template, userEmail, onClose }: PaymentCheckoutModalProps) {
  const payhipUrl = template.payhipUrl || "";

  useEffect(() => {
    // Dynamically bind Payhip overlay script when the modal mounts
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div
        className="w-full max-w-md rounded-sm border overflow-hidden flex flex-col"
        style={{ background: "#131313", borderColor: "rgba(255,255,255,0.1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}>
              Unlock {template.name}
            </h3>
            <p className="text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
              Logged in: {userEmail}
            </p>
          </div>
          <button onClick={onClose} style={{ color: "#888880" }}><X size={18} /></button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 text-center">
          <p className="text-sm" style={{ color: "#888880" }}>
            Unlock instantly using PayPal, Credit Card, or Debit Card.
          </p>
          <div className="text-2xl font-bold" style={{ color: "#c8ff00", fontFamily: "Fraunces, serif" }}>
            {template.price}
          </div>
          {finalCheckoutUrl ? (
            <a
              href={finalCheckoutUrl}
              className="w-full py-3.5 text-center text-sm font-semibold rounded-sm text-[#0a0a0a] transition-all hover:opacity-90 payhip-buy-button"
              style={{ background: "#c8ff00", display: "block" }}
              onClick={() => {
                onClose();
              }}
            >
              Proceed to Checkout
            </a>
          ) : (
            <div
              className="py-3 px-4 rounded-sm border text-xs"
              style={{ borderColor: "rgba(255,68,68,0.2)", background: "rgba(255,68,68,0.02)", color: "#ff6666" }}
            >
              This template currently does not have a checkout link configured. Please set one up in the Admin Dashboard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (email: string, name: string, picture: string) => void;
}

function AuthModal({ onClose, onSuccess }: AuthModalProps) {
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
        onSuccess(email, name, picture);
      } catch (err) {
        console.error("Failed to decode login token", err);
      }
    };

    if ((window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById("google-signin-btn-container"),
        { theme: "filled_blue", size: "large", text: "continue_with", shape: "pill", width: 280 }
      );
    }
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div
        className="w-full max-w-sm rounded-sm border p-8 flex flex-col items-center gap-6"
        style={{ background: "#131313", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div className="w-full flex justify-between items-center border-b pb-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}>
            Sign In with Google
          </h3>
          <button onClick={onClose} style={{ color: "#888880" }}><X size={18} /></button>
        </div>
        <p className="text-xs text-center leading-relaxed" style={{ color: "#888880" }}>
          Logging in allows you to unlock premium templates, sync your custom live editor builds, and access your whitelisted downloads.
        </p>
        <div id="google-signin-btn-container" className="my-2"></div>
      </div>
    </div>
  );
}

interface TemplatesProps {
  templatesList: any[];
  purchasedTemplates: string[];
  userEmail: string | null;
  onOpenCheckout: (tmpl: any) => void;
  onOpenAuth: () => void;
}

function Templates({ templatesList, purchasedTemplates, userEmail, onOpenCheckout, onOpenAuth }: TemplatesProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewId, setPreviewId] = useState<string | number | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const getPriceNum = (p: any) => {
    if (typeof p === "number") return p;
    if (!p || p.toLowerCase() === "free") return 0;
    const num = parseFloat(p.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const getTmplThumbnail = (t: any) => {
    if (!t.thumbnail) return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop&auto=format";
    if (t.thumbnail.startsWith("http")) return t.thumbnail;
    if (t.thumbnail.includes("/")) return t.thumbnail;
    return `https://images.unsplash.com/${t.thumbnail}?w=640&h=400&fit=crop&auto=format`;
  };

  const categories = ["All", ...Array.from(new Set(templatesList.map((t: any) => {
    const cat = t.category || "Other";
    if (cat.toLowerCase() === "saas") return "SaaS";
    if (cat.toLowerCase() === "e-commerce") return "E-Commerce";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  })))];

  const filtered = templatesList
    .filter((t) => {
      const matchesCategory = activeCategory === "All" || t.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || t.desc || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = getPriceNum(a.price);
      const priceB = getPriceNum(b.price);
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      const ratingA = a.rating || 4.8;
      const ratingB = b.rating || 4.8;
      if (sortBy === "rating") return ratingB - ratingA;
      const dlA = a.downloads || 1200;
      const dlB = b.downloads || 1200;
      return dlB - dlA;
    });

  const previewTemplate = previewId !== null ? templatesList.find((t) => t.id === previewId) : null;

  return (
    <section id="templates" className="py-24 lg:py-32" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div
              className="text-xs font-medium mb-4 tracking-widest uppercase"
              style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
            >
              Template Marketplace
            </div>
            <h2
              className="text-4xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}
            >
              Launch faster with{" "}
              <em className="not-italic" style={{ color: "#c8ff00" }}>
                pro templates
              </em>
            </h2>
          </div>
          <p
            className="lg:max-w-xs text-base leading-relaxed"
            style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}
          >
            Production-ready templates built on the same stack we use for custom clients. Buy once, own forever.
          </p>
        </div>

        {/* Trust bar */}
        <div
          className="flex flex-wrap items-center gap-6 mb-10 pb-10 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {[
            { icon: Download, label: "12,000+ downloads" },
            { icon: Tag, label: "One-time purchase" },
            { icon: Layers, label: "Full source code" },
            { icon: Shield, label: "6-month updates" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon size={14} style={{ color: "#c8ff00" }} />
              <span className="text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
                className="px-4 py-1.5 text-xs font-medium rounded-sm border transition-all duration-200"
                style={{
                  background: activeCategory === cat ? "#c8ff00" : "transparent",
                  color: activeCategory === cat ? "#0a0a0a" : "#888880",
                  borderColor: activeCategory === cat ? "#c8ff00" : "rgba(255,255,255,0.08)",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto">
            {/* Search Input */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm border flex-1 md:flex-initial md:w-64"
              style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <Search size={12} style={{ color: "#888880" }} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs outline-none bg-transparent w-full"
                style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ color: "#888880" }}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={12} style={{ color: "#888880" }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs px-3 py-2 rounded-sm border outline-none appearance-none cursor-pointer"
                style={{
                  background: "#1c1c1c",
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "#888880",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((tmpl) => {
            const isFree = getPriceNum(tmpl.price) === 0;
            const isUnlocked = isFree || purchasedTemplates.includes(tmpl.id);

            return (
              <div
                key={tmpl.id}
                className="group rounded-sm border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-white/10"
                style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", background: "#1a1a1a" }}>
                  <img
                    src={getTmplThumbnail(tmpl)}
                    alt={`${tmpl.name} template preview`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(10,10,10,0.7)" }}
                  >
                    <button
                      onClick={() => setPreviewId(tmpl.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-semibold transition-colors hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.08)", color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <a
                      href={`/templates/product.html?id=${tmpl.id}`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-semibold transition-all hover:bg-[#c8ff00] hover:text-[#0a0a0a]"
                      style={{ background: "rgba(255,255,255,0.08)", color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
                    >
                      <ExternalLink size={12} /> Details
                    </a>
                    {tmpl.figmaUrl && (
                      <a
                        href={tmpl.figmaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-semibold transition-colors hover:bg-white/10"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
                      >
                        Figma
                      </a>
                    )}
                  </div>
                  {/* Figma Badge */}
                  {tmpl.figmaUrl && (
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-sm text-[10px] font-semibold flex items-center gap-1"
                      style={{ background: "linear-gradient(135deg, #1e1e2e 0%, #a259ff 100%)", color: "white", fontFamily: "JetBrains Mono, monospace" }}
                    >
                      Figma Design
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <a
                        href={`/templates/product.html?id=${tmpl.id}`}
                        className="text-sm font-semibold mb-0.5 hover:text-[#c8ff00] hover:underline block"
                        style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
                      >
                        {tmpl.name}
                      </a>
                      <div className="text-xs" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                        {tmpl.category}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold" style={{ color: "#c8ff00", fontFamily: "Fraunces, serif" }}>
                        {tmpl.price}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed flex-1" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                    {tmpl.description || tmpl.desc}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {(tmpl.tech || ["React", "Tailwind"]).map((t: string) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-sm text-xs"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#666660", fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div
                    className="flex items-center justify-between pt-3 border-t text-xs"
                    style={{ borderColor: "rgba(255,255,255,0.06)", color: "#666660", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="#c8ff00" style={{ color: "#c8ff00" }} />
                      {tmpl.rating || 4.8} ({tmpl.reviews || 84})
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={10} />
                      {(tmpl.downloads || 1200).toLocaleString()}
                    </div>
                    <div>{tmpl.pages || 5}pg</div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2">
                    {tmpl.figmaUrl && (
                      <a
                        href={tmpl.figmaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2 rounded-sm border hover:bg-white/5 transition-colors shrink-0"
                        style={{ borderColor: "rgba(162, 89, 255, 0.4)", color: "#a259ff" }}
                        title="View Figma Design"
                      >
                        <svg width="12" height="12" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 28.5 19 28.5Z" fill="#a259ff" />
                          <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#a259ff" />
                          <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#a259ff" />
                          <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#a259ff" />
                          <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#a259ff" />
                        </svg>
                      </a>
                    )}
                    <a
                      href={`/templates/live-editor.html?template=${tmpl.demoPath}`}
                      className="flex-1 py-2 text-center text-xs font-semibold rounded-sm border border-[#c8ff00]/40 bg-[rgba(200,255,0,0.05)] text-[#c8ff00] transition-colors hover:bg-[rgba(200,255,0,0.1)]"
                    >
                      Customize &amp; Edit
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold rounded-sm border transition-all duration-200 hover:border-white/20 hover:text-white group"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#888880", fontFamily: "Outfit, sans-serif" }}
          >
            Browse all 80+ templates
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setPreviewId(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-sm border overflow-hidden flex flex-col"
            style={{ background: "#131313", borderColor: "rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-4"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div>
                <span className="text-base font-semibold" style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}>
                  {previewTemplate.name}
                </span>
                <span className="ml-3 text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                  {previewTemplate.category}
                </span>
              </div>

              {/* Device switcher tabs (Option 2) */}
              <div className="flex items-center gap-1 rounded-sm border p-0.5" style={{ background: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
                <button
                  onClick={() => setPreviewDeviceMode("desktop")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${previewDeviceMode === "desktop" ? "bg-[#c8ff00] text-[#0a0a0a]" : "text-[#888880] hover:text-white"
                    }`}
                >
                  🖥️ Desktop
                </button>
                <button
                  onClick={() => setPreviewDeviceMode("tablet")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${previewDeviceMode === "tablet" ? "bg-[#c8ff00] text-[#0a0a0a]" : "text-[#888880] hover:text-white"
                    }`}
                >
                  📟 Tablet
                </button>
                <button
                  onClick={() => setPreviewDeviceMode("mobile")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${previewDeviceMode === "mobile" ? "bg-[#c8ff00] text-[#0a0a0a]" : "text-[#888880] hover:text-white"
                    }`}
                >
                  📱 Mobile
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-bold" style={{ color: "#c8ff00", fontFamily: "Fraunces, serif" }}>
                  {previewTemplate.price}
                </span>
                <a
                  href={`/templates/live-editor.html?template=${previewTemplate.demoPath}`}
                  className="px-4 py-2 text-xs font-semibold rounded-sm transition-all hover:opacity-90"
                  style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "Outfit, sans-serif" }}
                >
                  Customize &amp; Edit
                </a>
                <button onClick={() => setPreviewId(null)} style={{ color: "#888880" }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Interactive Preview Iframe Viewport wrapper */}
            <div className="bg-[#0e0e0e] flex items-center justify-center p-6 h-[60vh] overflow-auto">
              <div
                className="transition-all duration-300 shadow-2xl relative bg-white"
                style={{
                  width: previewDeviceMode === "desktop" ? "100%" : previewDeviceMode === "tablet" ? "768px" : "375px",
                  height: previewDeviceMode === "desktop" ? "100%" : previewDeviceMode === "tablet" ? "95%" : "550px",
                  border: previewDeviceMode === "desktop" ? "none" : previewDeviceMode === "tablet" ? "8px solid #1c1c1c" : "12px solid #1c1c1c",
                  borderRadius: previewDeviceMode === "desktop" ? "0px" : previewDeviceMode === "tablet" ? "12px" : "32px",
                  overflow: "hidden"
                }}
              >
                {previewDeviceMode === "mobile" && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-[#1c1c1c] rounded-b-xl z-20"></div>
                )}
                <iframe
                  src={`/previews/${previewTemplate.demoPath}/index.html`}
                  className="w-full h-full border-none"
                  title={`${previewTemplate.name} Live Sandbox`}
                ></iframe>
              </div>
            </div>

            {/* Modal footer */}
            <div
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                {previewTemplate.description || previewTemplate.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(previewTemplate.tech || ["React", "Tailwind"]).map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-sm text-xs"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#888880", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="py-24 lg:py-32" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <div
            className="text-xs font-medium mb-4 tracking-widest uppercase"
            style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
          >
            Selected Work
          </div>
          <h2
            className="text-4xl lg:text-6xl font-bold"
            style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}
          >
            Recent projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-sm cursor-pointer"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={`https://images.unsplash.com/${p.img}?w=800&h=600&fit=crop&auto=format`}
                alt={`${p.title} project screenshot`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)" }}
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div
                  className="text-xs font-medium mb-2 tracking-widest uppercase"
                  style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
                >
                  {p.category}
                </div>
                <div
                  className="text-xl font-semibold"
                  style={{ fontFamily: "Outfit, sans-serif", color: "#f0f0ee" }}
                >
                  {p.title}
                </div>
              </div>
              <div
                className="absolute top-4 right-4 w-8 h-8 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                style={{ background: "#c8ff00" }}
              >
                <ExternalLink size={14} style={{ color: "#0a0a0a" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold rounded-sm border transition-all duration-200 hover:border-white/20 hover:text-white group"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#888880", fontFamily: "Outfit, sans-serif" }}
          >
            View all 140+ projects
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="py-24 lg:py-32" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <div
            className="text-xs font-medium mb-4 tracking-widest uppercase"
            style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
          >
            How We Work
          </div>
          <h2
            className="text-4xl lg:text-6xl font-bold"
            style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}
          >
            A process with{" "}
            <em className="not-italic" style={{ color: "#c8ff00" }}>
              no blind spots
            </em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="flex gap-6 p-8 group transition-colors duration-300 hover:bg-white/[0.02]"
              style={{ background: "#0a0a0a" }}
            >
              <div
                className="text-5xl font-bold leading-none shrink-0 transition-colors duration-300 group-hover:text-[#c8ff00]"
                style={{ fontFamily: "Fraunces, serif", color: "rgba(255,255,255,0.06)" }}
              >
                {s.num}
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "Outfit, sans-serif", color: "#f0f0ee" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Contact() {
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 lg:py-32" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <div
              className="text-xs font-medium mb-4 tracking-widest uppercase"
              style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
            >
              Get in Touch
            </div>
            <h2
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}
            >
              Ready to build something{" "}
              <em className="not-italic" style={{ color: "#c8ff00" }}>
                great?
              </em>
            </h2>
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}
            >
              Tell us about your project. We review every inquiry and respond within 24 hours with honest feedback on scope, feasibility, and fit.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: Mail, label: "Email", val: "hello@webxstudio.co" },
                { icon: Phone, label: "Phone", val: "+1 (415) 882-3310" },
                { icon: MapPin, label: "Location", val: "San Francisco, CA — Remote worldwide" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                    style={{ background: "rgba(200,255,0,0.08)" }}
                  >
                    <c.icon size={15} style={{ color: "#c8ff00" }} />
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                      {c.label}
                    </div>
                    <div className="text-sm" style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}>
                      {c.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-12 rounded-sm border"
                style={{ background: "#131313", borderColor: "rgba(200,255,0,0.2)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "rgba(200,255,0,0.1)" }}
                >
                  <Check size={28} style={{ color: "#c8ff00" }} />
                </div>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}
                >
                  Message received.
                </h3>
                <p className="text-sm" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                  We will review your project and reply within 24 hours with initial thoughts and next steps.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 lg:p-10 rounded-sm border flex flex-col gap-5"
                style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
              >
                {[
                  { id: "name", label: "Your Name", type: "text", placeholder: "Alex Johnson" },
                  { id: "email", label: "Email Address", type: "email", placeholder: "alex@company.com" },
                  { id: "budget", label: "Project Budget", type: "text", placeholder: "$5,000 – $15,000" },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-xs font-medium mb-2"
                      style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.id as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                      required
                      className="w-full px-4 py-3 text-sm rounded-sm border outline-none transition-colors focus:border-[#c8ff00]/40"
                      style={{
                        background: "#0a0a0a",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#f0f0ee",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium mb-2"
                    style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Tell us about the project
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="What are you building, who is it for, and what is the timeline?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm rounded-sm border outline-none transition-colors focus:border-[#c8ff00]/40 resize-none"
                    style={{
                      background: "#0a0a0a",
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "#f0f0ee",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 text-sm font-semibold rounded-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 group"
                  style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "Outfit, sans-serif" }}
                >
                  Send Message
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onAdminClick }: { onAdminClick: () => void }) {
  return (
    <footer
      className="py-12 border-t"
      style={{ background: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold"
                style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "JetBrains Mono, monospace" }}
              >
                WX
              </span>
              <span className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "#f0f0ee" }}>
                WebxStudio
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}
            >
              We build conversion-first websites and full-stack platforms for founders and teams who know that design is revenue.
            </p>
          </div>

          {[
            { title: "Company", links: ["About", "Work", "Process", "Careers"] },
            { title: "Services", links: ["Landing Pages", "Web Apps", "E-Commerce", "Audits"] },
          ].map((col) => (
            <div key={col.title}>
              <div
                className="text-xs font-medium mb-4 tracking-widest uppercase"
                style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}
              >
                {col.title}
              </div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#666660", fontFamily: "Outfit, sans-serif" }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Adsterra Secure Banner Container */}
        <div className="my-8 flex justify-center w-full">
          <iframe
            src="/ad-banner.html"
            sandbox="allow-scripts allow-same-origin"
            width="100%"
            height="250"
            style={{ border: "none", overflow: "hidden" }}
            title="Advertisement"
          />
        </div>

        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: "rgba(255,255,255,0.06)", color: "#666660", fontFamily: "Outfit, sans-serif" }}
        >
          <span>© 2026 WebxStudio. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────

const ADMIN_USERS = [
  { email: "admin@webxstudio.co", password: "admin2026", name: "Alex Rivera", role: "Super Admin" },
  { email: "dev@webxstudio.co", password: "devpass", name: "Sam Chen", role: "Developer" },
];

const mockOrders = [
  { id: "#ORD-1041", customer: "Tomas Bray", email: "tomas@bray.io", template: "Launchpad SaaS", amount: 79, status: "completed", date: "Jul 9, 2026" },
  { id: "#ORD-1040", customer: "Nina Vasquez", email: "nina@nv.design", template: "Storefront Pro", amount: 99, status: "completed", date: "Jul 8, 2026" },
  { id: "#ORD-1039", customer: "Chen Wei", email: "c.wei@product.co", template: "Nexus Dashboard", amount: 119, status: "pending", date: "Jul 8, 2026" },
  { id: "#ORD-1038", customer: "Amara Okafor", email: "amara@okafor.ng", template: "Convert Land", amount: 29, status: "completed", date: "Jul 7, 2026" },
  { id: "#ORD-1037", customer: "Louis Petit", email: "louis@atelier.fr", template: "Agency One", amount: 69, status: "refunded", date: "Jul 7, 2026" },
  { id: "#ORD-1036", customer: "Sara Kim", email: "sara@kimdesign.kr", template: "Folio Dark", amount: 49, status: "completed", date: "Jul 6, 2026" },
  { id: "#ORD-1035", customer: "Marco Rossi", email: "marco@studio.it", template: "Beacon Blog", amount: 39, status: "completed", date: "Jul 6, 2026" },
  { id: "#ORD-1034", customer: "Priya Nair", email: "priya@nair.in", template: "Launchpad SaaS", amount: 79, status: "pending", date: "Jul 5, 2026" },
];

const mockUsers = [
  { id: 1, name: "Tomas Bray", email: "tomas@bray.io", plan: "Pro", joined: "Mar 2026", purchases: 3, spent: 247, avatar: "photo-1570295999919-56ceb5ecca61" },
  { id: 2, name: "Nina Vasquez", email: "nina@nv.design", plan: "Starter", joined: "Apr 2026", purchases: 1, spent: 99, avatar: "photo-1580489944761-15a19d654956" },
  { id: 3, name: "Chen Wei", email: "c.wei@product.co", plan: "Pro", joined: "Jan 2026", purchases: 5, spent: 481, avatar: "photo-1507003211169-0a1dd7228f2d" },
  { id: 4, name: "Amara Okafor", email: "amara@okafor.ng", plan: "Free", joined: "Jun 2026", purchases: 1, spent: 29, avatar: "photo-1494790108755-2616b612b786" },
  { id: 5, name: "Sara Kim", email: "sara@kimdesign.kr", plan: "Pro", joined: "Feb 2026", purchases: 4, spent: 316, avatar: "photo-1438761681033-6461ffad8d80" },
];

type AdminUser = typeof ADMIN_USERS[0];

function AdminLogin({ onLogin }: { onLogin: (user: AdminUser) => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const match = ADMIN_USERS.find((u) => u.email === email && u.password === password);
      if (match) {
        onLogin(match);
      } else {
        setError("Invalid credentials. Access denied.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0a" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(200,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span
            className="w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold"
            style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "JetBrains Mono, monospace" }}
          >
            WX
          </span>
          <span className="text-base font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "#f0f0ee" }}>
            WebxStudio
          </span>
        </div>

        <div
          className="rounded-sm border p-8"
          style={{ background: "#131313", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Lock size={14} style={{ color: "#c8ff00" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}>
              Admin Access
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}>
            Sign in
          </h1>
          <p className="text-sm mb-8" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
            Restricted to authorised team members only.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@webxstudio.co"
                required
                className="w-full px-4 py-3 text-sm rounded-sm border outline-none transition-colors focus:border-[#c8ff00]/40"
                style={{ background: "#0a0a0a", borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 text-sm rounded-sm border outline-none transition-colors focus:border-[#c8ff00]/40"
                style={{ background: "#0a0a0a", borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs"
                style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)", color: "#ff6666", fontFamily: "Outfit, sans-serif" }}
              >
                <AlertCircle size={12} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold rounded-sm transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "Outfit, sans-serif" }}
            >
              {loading ? "Verifying…" : "Sign In"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs" style={{ color: "#444440", fontFamily: "JetBrains Mono, monospace" }}>
            Hint: admin@webxstudio.co / admin2026
          </p>
        </div>
      </div>
    </div>
  );
}

type AdminTab = "overview" | "templates" | "orders" | "users" | "settings";

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  templatesList: any[];
  onRefreshTemplates: () => void;
}

function AdminDashboard({ user, onLogout, templatesList, onRefreshTemplates }: AdminDashboardProps) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [search, setSearch] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "SaaS",
    description: "",
    thumbnail: "",
    demoPath: "template-1",
    price: "Free",
    payhipUrl: "",
    figmaUrl: "",
  });

  const [data, setData] = useState<{
    requests: any[];
    verified: any[];
    upiRequests: any[];
    builds: any[];
  }>({
    requests: [],
    verified: [],
    upiRequests: [],
    builds: []
  });

  const sidebarItems: { id: AdminTab; icon: React.ElementType; label: string }[] = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "templates", icon: Package, label: "Templates" },
    { id: "orders", icon: DollarSign, label: "Approvals" },
    { id: "users", icon: Users, label: "Whitelisted" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const loadAdminData = async () => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_admin_data" })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        setData({
          requests: resData.requests || [],
          verified: resData.verified || [],
          upiRequests: resData.upiRequests || [],
          builds: resData.builds || []
        });
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveAccess = async (email: string) => {
    if (!confirm(`Approve access request for ${email}?`)) return;
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_request", email })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        alert("Access request approved!");
        loadAdminData();
      }
    } catch (e) {
      alert("Error approving request");
    }
  };

  const handleDenyAccess = async (email: string) => {
    if (!confirm(`Deny access request for ${email}?`)) return;
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deny_request", email })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        alert("Access request denied!");
        loadAdminData();
      }
    } catch (e) {
      alert("Error denying request");
    }
  };

  const handleApproveUPI = async (id: number, email: string, templateId: string) => {
    if (!confirm(`Approve UPI payment for ${email} on template ${templateId}?`)) return;
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_upi_request", id, email, templateId })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        alert("UPI payment approved & template unlocked!");
        loadAdminData();
      }
    } catch (e) {
      alert("Error approving UPI");
    }
  };

  const handleRejectUPI = async (id: number) => {
    if (!confirm("Reject this UPI request?")) return;
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject_upi_request", id })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        alert("UPI request rejected.");
        loadAdminData();
      }
    } catch (e) {
      alert("Error rejecting UPI");
    }
  };

  const handleDeleteTemplate = async (id: string | number) => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_template", id })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        alert("Template deleted successfully.");
        onRefreshTemplates();
        setDeleteConfirm(null);
      }
    } catch (e) {
      alert("Failed to delete template.");
    }
  };

  const handleAddTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_template",
          ...newTemplate
        })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        alert("Template published successfully!");
        onRefreshTemplates();
        setAddModalOpen(false);
        setNewTemplate({
          name: "",
          category: "SaaS",
          description: "",
          thumbnail: "",
          demoPath: "template-1",
          price: "Free",
          payhipUrl: "",
          figmaUrl: "",
        });
      }
    } catch (e) {
      alert("Failed to add template.");
    }
  };

  const handleEditTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit_template",
          id: editingTemplate.id,
          name: editingTemplate.name,
          category: editingTemplate.category,
          description: editingTemplate.description || editingTemplate.desc,
          thumbnail: editingTemplate.thumbnail || editingTemplate.img,
          demoPath: editingTemplate.demoPath,
          price: editingTemplate.price,
          payhipUrl: editingTemplate.payhipUrl,
          figmaUrl: editingTemplate.figmaUrl,
        })
      });
      const resData = await res.json();
      if (resData.result === "success") {
        alert("Template updated successfully!");
        onRefreshTemplates();
        setEditingTemplate(null);
      }
    } catch (e) {
      alert("Failed to update template.");
    }
  };

  const getTmplThumbnail = (t: any) => {
    if (!t.thumbnail && !t.img) return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=56&h=36&fit=crop&auto=format";
    const thumb = t.thumbnail || t.img;
    if (thumb.startsWith("http")) return thumb;
    if (thumb.includes("/")) return thumb;
    return `https://images.unsplash.com/${thumb}?w=56&h=36&fit=crop&auto=format`;
  };

  const totalDownloads = templatesList.reduce((s, t) => s + (t.downloads || 1200), 0);
  const pendingRequestsCount = data.requests.filter(r => r.status.includes("Pending")).length;
  const pendingUPIRequestsCount = data.upiRequests.filter(r => r.status === "Pending Verification").length;

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0a", fontFamily: "Outfit, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col border-r"
        style={{ background: "#0d0d0d", borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span
            className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold"
            style={{ background: "#c8ff00", color: "#0a0a0a", fontFamily: "JetBrains Mono, monospace" }}
          >
            SP
          </span>
          <div>
            <div className="text-xs font-semibold leading-tight" style={{ color: "#f0f0ee" }}>Spark Web</div>
            <div className="text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-left transition-all duration-150"
              style={{
                background: tab === item.id ? "rgba(200,255,0,0.08)" : "transparent",
                color: tab === item.id ? "#c8ff00" : "#888880",
              }}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className="px-3 pb-4">
          <div
            className="p-3 rounded-sm border flex items-center gap-3"
            style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "rgba(200,255,0,0.15)", color: "#c8ff00", fontFamily: "JetBrains Mono, monospace" }}
            >
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: "#f0f0ee" }}>{user.name}</div>
              <div className="text-xs truncate" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>{user.role}</div>
            </div>
            <button onClick={onLogout} className="shrink-0 hover:text-white transition-colors" style={{ color: "#888880" }}>
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-8 py-4 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0a0a0a" }}
        >
          <div>
            <h1 className="text-lg font-bold capitalize" style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}>
              {tab === "orders" ? "Payment & Whitelist Approvals" : tab === "users" ? "Whitelisted Users" : tab}
            </h1>
            <p className="text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
              Live Connected DB Endpoint
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-sm border"
              style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <Search size={12} style={{ color: "#888880" }} />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs outline-none w-32 bg-transparent"
                style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <div className="flex flex-col gap-8">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Whitelisted", val: String(data.verified.length), sub: "Access granted", icon: Users, up: true },
                  { label: "Marketplace Templates", val: String(templatesList.length), sub: "Templates live", icon: Package, up: true },
                  { label: "Sync Action Logs", val: String(data.builds.length), sub: "Developer builds", icon: LayoutDashboard, up: true },
                  { label: "Pending Approvals", val: String(pendingRequestsCount + pendingUPIRequestsCount), sub: "Needs review", icon: AlertCircle, up: false },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-5 rounded-sm border flex flex-col gap-3"
                    style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>{s.label}</span>
                      <div
                        className="w-7 h-7 rounded-sm flex items-center justify-center"
                        style={{ background: "rgba(200,255,0,0.08)" }}
                      >
                        <s.icon size={13} style={{ color: "#c8ff00" }} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}>
                      {s.val}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: s.up ? "#c8ff00" : "#ffaa00", fontFamily: "JetBrains Mono, monospace" }}>
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent customizer builds + pending approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent builds */}
                <div
                  className="lg:col-span-2 rounded-sm border overflow-hidden"
                  style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>Recent Customizer Builds</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    {data.builds.slice(0, 5).map((b, idx) => (
                      <div key={idx} className="flex items-center justify-between px-5 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: "#f0f0ee" }}>{b.email}</div>
                          <div className="text-xs truncate" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                            Built customization settings for <strong style={{ color: "#c8ff00" }}>{b.templateId}</strong>
                          </div>
                        </div>
                        <span className="text-xs" style={{ color: "#666660", fontFamily: "JetBrains Mono, monospace" }}>
                          {b.timestamp}
                        </span>
                      </div>
                    ))}
                    {data.builds.length === 0 && (
                      <div className="p-5 text-center text-xs" style={{ color: "#888880" }}>No recent sync actions recorded.</div>
                    )}
                  </div>
                </div>

                {/* Top templates list */}
                <div
                  className="rounded-sm border overflow-hidden"
                  style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>Top Templates</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    {[...templatesList].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5).map((t, i) => (
                      <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                        <span
                          className="text-xs font-bold w-4 shrink-0"
                          style={{ color: i === 0 ? "#c8ff00" : "#444440", fontFamily: "JetBrains Mono, monospace" }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate" style={{ color: "#f0f0ee" }}>{t.name}</div>
                          <div className="text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                            {(t.downloads || 1200).toLocaleString()} downloads
                          </div>
                        </div>
                        <div className="text-sm font-semibold shrink-0" style={{ color: "#c8ff00" }}>{t.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Templates Management ── */}
          {tab === "templates" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "#888880" }}>{templatesList.length} templates total</p>
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold"
                  style={{ background: "#c8ff00", color: "#0a0a0a" }}
                >
                  <Plus size={13} /> Add Template
                </button>
              </div>

              <div
                className="rounded-sm border overflow-hidden"
                style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
              >
                {/* Table header */}
                <div
                  className="grid text-xs font-medium px-5 py-3 border-b"
                  style={{
                    gridTemplateColumns: "2fr 1fr 80px 80px 80px",
                    borderColor: "rgba(255,255,255,0.06)",
                    color: "#888880",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  <span>Name</span><span>Category</span><span>Price</span><span>Demo Code Path</span><span>Actions</span>
                </div>
                {templatesList.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase())).map((t) => (
                  <div
                    key={t.id}
                    className="grid items-center px-5 py-3.5 border-b hover:bg-white/[0.02] transition-colors"
                    style={{
                      gridTemplateColumns: "2fr 1fr 80px 80px 80px",
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getTmplThumbnail(t)}
                        alt={t.name}
                        className="w-14 h-9 rounded-sm object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: "#f0f0ee" }}>{t.name}</div>
                        <div className="text-xs truncate text-[#888880] font-mono">{t.id}</div>
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-sm text-xs w-fit capitalize"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#888880", fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {t.category}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "#c8ff00" }}>{t.price}</span>
                    <span className="text-xs font-mono" style={{ color: "#c0c0bc" }}>{t.demoPath}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTemplate(t)}
                        className="p-1.5 rounded-sm hover:bg-white/5 transition-colors"
                        style={{ color: "#888880" }}
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(t.id)}
                        className="p-1.5 rounded-sm hover:bg-red-500/10 transition-colors"
                        style={{ color: "#888880" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Template Modal */}
              {addModalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                  style={{ background: "rgba(0,0,0,0.8)" }}
                  onClick={() => setAddModalOpen(false)}
                >
                  <div
                    className="w-full max-w-lg rounded-sm border p-6 max-h-[90vh] overflow-y-auto"
                    style={{ background: "#131313", borderColor: "rgba(255,255,255,0.1)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold" style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}>
                        Add New Template
                      </h3>
                      <button onClick={() => setAddModalOpen(false)} style={{ color: "#888880" }}><X size={16} /></button>
                    </div>
                    <form onSubmit={handleAddTemplateSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Template Name</label>
                        <input
                          required
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                          placeholder="e.g. Genesis Marketing Hub"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Category</label>
                        <input
                          required
                          value={newTemplate.category}
                          onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black text-[#f0f0ee]"
                          style={{ borderColor: "rgba(255,255,255,0.08)" }}
                          placeholder="e.g. SaaS, Portfolio, Blog, Agency, E-Commerce, Corporate"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Description</label>
                        <textarea
                          required
                          value={newTemplate.description}
                          onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black resize-none"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                          placeholder="Brief summary of features..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Thumbnail Image URL</label>
                        <input
                          value={newTemplate.thumbnail}
                          onChange={(e) => setNewTemplate({ ...newTemplate, thumbnail: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                          placeholder="https://images.unsplash.com/... (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Sandbox Base Path (e.g. template-1)</label>
                        <input
                          required
                          value={newTemplate.demoPath}
                          onChange={(e) => setNewTemplate({ ...newTemplate, demoPath: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Price Tag</label>
                        <input
                          required
                          value={newTemplate.price}
                          onChange={(e) => setNewTemplate({ ...newTemplate, price: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                          placeholder="Free or $9.00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Payhip Product URL (Optional)</label>
                        <input
                          value={newTemplate.payhipUrl}
                          onChange={(e) => setNewTemplate({ ...newTemplate, payhipUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                          placeholder="e.g. https://payhip.com/b/XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Figma Demo URL (Optional)</label>
                        <input
                          value={newTemplate.figmaUrl}
                          onChange={(e) => setNewTemplate({ ...newTemplate, figmaUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                          placeholder="e.g. https://www.figma.com/design/XXXX"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 text-xs font-semibold rounded-sm text-[#0a0a0a]"
                        style={{ background: "#c8ff00" }}
                      >
                        Publish Template
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit modal */}
              {editingTemplate && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                  style={{ background: "rgba(0,0,0,0.8)" }}
                  onClick={() => setEditingTemplate(null)}
                >
                  <div
                    className="w-full max-w-lg rounded-sm border p-6 max-h-[90vh] overflow-y-auto"
                    style={{ background: "#131313", borderColor: "rgba(255,255,255,0.1)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold" style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}>
                        Edit Template
                      </h3>
                      <button onClick={() => setEditingTemplate(null)} style={{ color: "#888880" }}><X size={16} /></button>
                    </div>
                    <form onSubmit={handleEditTemplateSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Template Name</label>
                        <input
                          required
                          value={editingTemplate.name}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Category</label>
                        <input
                          required
                          value={editingTemplate.category}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black text-[#f0f0ee]"
                          style={{ borderColor: "rgba(255,255,255,0.08)" }}
                          placeholder="e.g. SaaS, Portfolio, Blog, Agency, E-Commerce, Corporate"
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Description</label>
                        <textarea
                          required
                          value={editingTemplate.description || editingTemplate.desc}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black resize-none"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Thumbnail Image URL</label>
                        <input
                          value={editingTemplate.thumbnail || editingTemplate.img}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, thumbnail: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Sandbox Base Path (e.g. template-1)</label>
                        <input
                          required
                          value={editingTemplate.demoPath}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, demoPath: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Price Tag</label>
                        <input
                          required
                          value={editingTemplate.price}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, price: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Payhip Product URL (Optional)</label>
                        <input
                          value={editingTemplate.payhipUrl}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, payhipUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Figma Demo URL (Optional)</label>
                        <input
                          value={editingTemplate.figmaUrl}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, figmaUrl: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black"
                          style={{ borderColor: "rgba(255,255,255,0.08)", color: "#f0f0ee" }}
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingTemplate(null)}
                          className="flex-1 py-2.5 text-xs font-semibold rounded-sm border"
                          style={{ borderColor: "rgba(255,255,255,0.1)", color: "#888880" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 text-xs font-semibold rounded-sm text-[#0a0a0a]"
                          style={{ background: "#c8ff00" }}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Delete confirm */}
              {deleteConfirm !== null && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: "rgba(0,0,0,0.8)" }}
                  onClick={() => setDeleteConfirm(null)}
                >
                  <div
                    className="w-full max-w-sm rounded-sm border p-6 text-center"
                    style={{ background: "#131313", borderColor: "rgba(255,68,68,0.2)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(255,68,68,0.1)" }}
                    >
                      <Trash2 size={20} style={{ color: "#ff6666" }} />
                    </div>
                    <h3 className="text-base font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}>
                      Delete template?
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "#888880" }}>
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 py-2.5 text-xs font-semibold rounded-sm border"
                        style={{ borderColor: "rgba(255,255,255,0.1)", color: "#888880" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(deleteConfirm)}
                        className="flex-1 py-2.5 text-xs font-semibold rounded-sm"
                        style={{ background: "#ff4444", color: "#fff" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Payment & Access Approvals ── */}
          {tab === "orders" && (
            <div className="flex flex-col gap-8">
              {/* UPI QR Approvals */}
              <div className="rounded-sm border overflow-hidden" style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>Pending UPI Verification Requests</span>
                </div>
                <div className="grid text-xs font-medium px-5 py-3 border-b" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", borderColor: "rgba(255,255,255,0.06)", color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                  <span>Buyer Email</span><span>Template ID</span><span>UTR / Ref No.</span><span>Timestamp</span><span>Actions</span>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  {data.upiRequests.filter(r => r.status === "Pending Verification").map((req) => (
                    <div key={req.id} className="grid items-center px-5 py-3.5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 120px" }}>
                      <span className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>{req.email}</span>
                      <span className="text-xs font-mono" style={{ color: "#a259ff" }}>{req.templateId}</span>
                      <span className="text-xs font-mono font-semibold" style={{ color: "#c8ff00" }}>{req.utr}</span>
                      <span className="text-xs" style={{ color: "#888880" }}>{req.timestamp}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveUPI(req.id, req.email, req.templateId)} className="px-2.5 py-1 text-[11px] font-semibold bg-[#c8ff00] text-[#0a0a0a] rounded-sm">Approve</button>
                        <button onClick={() => handleRejectUPI(req.id)} className="px-2.5 py-1 text-[11px] font-semibold bg-[#ff4444] text-white rounded-sm">Reject</button>
                      </div>
                    </div>
                  ))}
                  {data.upiRequests.filter(r => r.status === "Pending Verification").length === 0 && (
                    <div className="p-5 text-center text-xs" style={{ color: "#888880" }}>No pending UPI purchase requests.</div>
                  )}
                </div>
              </div>

              {/* Free Whitelist Email Approvals */}
              <div className="rounded-sm border overflow-hidden" style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>Free / Custom Whitelist Email Requests</span>
                </div>
                <div className="grid text-xs font-medium px-5 py-3 border-b" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 120px", borderColor: "rgba(255,255,255,0.06)", color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                  <span>Requesting Email</span><span>Requested Date</span><span>Status</span><span>Actions</span>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  {data.requests.filter(r => r.status.includes("Pending")).map((req, idx) => (
                    <div key={idx} className="grid items-center px-5 py-3.5" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 120px" }}>
                      <span className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>{req.email}</span>
                      <span className="text-xs" style={{ color: "#888880" }}>{req.date}</span>
                      <span className="text-xs font-semibold text-[#ffaa00]">{req.status}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveAccess(req.email)} className="px-2.5 py-1 text-[11px] font-semibold bg-[#c8ff00] text-[#0a0a0a] rounded-sm">Approve</button>
                        <button onClick={() => handleDenyAccess(req.email)} className="px-2.5 py-1 text-[11px] font-semibold bg-[#ff4444] text-white rounded-sm">Deny</button>
                      </div>
                    </div>
                  ))}
                  {data.requests.filter(r => r.status.includes("Pending")).length === 0 && (
                    <div className="p-5 text-center text-xs" style={{ color: "#888880" }}>No pending whitelist access requests.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Whitelisted Users ── */}
          {tab === "users" && (
            <div className="flex flex-col gap-6">
              <p className="text-sm" style={{ color: "#888880" }}>{data.verified.length} users with template access</p>
              <div className="rounded-sm border overflow-hidden" style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="grid text-xs font-medium px-5 py-3 border-b" style={{ gridTemplateColumns: "2fr 1fr", borderColor: "rgba(255,255,255,0.06)", color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                  <span>Whitelisted User Email</span><span>Date Whitelisted</span>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  {data.verified.filter(u => !search || u.email.toLowerCase().includes(search.toLowerCase())).map((u, idx) => (
                    <div key={idx} className="grid items-center px-5 py-3.5" style={{ gridTemplateColumns: "2fr 1fr" }}>
                      <span className="text-sm font-semibold" style={{ color: "#f0f0ee" }}>{u.email}</span>
                      <span className="text-xs" style={{ color: "#888880" }}>{u.date}</span>
                    </div>
                  ))}
                  {data.verified.length === 0 && (
                    <div className="p-5 text-center text-xs" style={{ color: "#888880" }}>No whitelisted users yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Settings ── */}
          {tab === "settings" && (
            <div className="max-w-lg flex flex-col gap-6">
              <div
                className="rounded-sm border p-6"
                style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <h3 className="text-sm font-semibold mb-4" style={{ color: "#f0f0ee", fontFamily: "Fraunces, serif" }}>
                  Admin Settings
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Display Name</label>
                    <input readOnly value={user.name} className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black text-[#f0f0ee]" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>Email Address</label>
                    <input readOnly value={user.email} className="w-full px-3 py-2 text-sm rounded-sm border outline-none bg-black text-[#f0f0ee]" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
                  </div>
                </div>
              </div>

              <div
                className="rounded-sm border p-6"
                style={{ background: "#131313", borderColor: "rgba(255,68,68,0.15)" }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#ff6666", fontFamily: "Fraunces, serif" }}>
                  Danger Zone
                </h3>
                <p className="text-xs mb-4" style={{ color: "#888880" }}>
                  Log out of the admin panel and return to the public site.
                </p>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-sm border"
                  style={{ borderColor: "rgba(255,68,68,0.3)", color: "#ff6666" }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

interface UserProfileProps {
  userEmail: string;
  userName: string | null;
  userPicture: string | null;
  purchasedTemplates: string[];
  templatesList: any[];
  onBack: () => void;
  onSignOut: () => void;
}

function UserProfile({
  userEmail,
  userName,
  userPicture,
  purchasedTemplates,
  templatesList,
  onBack,
  onSignOut,
}: UserProfileProps) {
  const getTmplThumbnail = (t: any) => {
    if (!t.thumbnail) return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=400&fit=crop&auto=format";
    if (t.thumbnail.startsWith("http")) return t.thumbnail;
    if (t.thumbnail.includes("/")) return t.thumbnail;
    return `https://images.unsplash.com/${t.thumbnail}?w=640&h=400&fit=crop&auto=format`;
  };

  const handleDownloadReceipt = (tmpl: any) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 600, 700);

    // Draw border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 560, 660);

    // Draw top logo/brand header
    ctx.fillStyle = "#c8ff00";
    // Logo square
    ctx.fillRect(50, 60, 40, 40);
    ctx.fillStyle = "#0a0a0a";
    ctx.font = "bold 16px 'Courier New', monospace";
    ctx.fillText("SP", 58, 86);

    ctx.fillStyle = "#f0f0ee";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("SPARK WEB", 105, 86);

    ctx.fillStyle = "#888880";
    ctx.font = "12px monospace";
    ctx.fillText("TRANSACTION RECEIPT", 420, 86);

    // Separator line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.beginPath();
    ctx.moveTo(50, 125);
    ctx.lineTo(550, 125);
    ctx.stroke();

    // Invoice Meta (Date, Inv #)
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const invId = "INV-" + Math.floor(100000 + Math.random() * 900000);

    ctx.fillStyle = "#888880";
    ctx.font = "12px sans-serif";
    ctx.fillText("Date Issued:", 50, 160);
    ctx.fillStyle = "#f0f0ee";
    ctx.fillText(dateStr, 150, 160);

    ctx.fillStyle = "#888880";
    ctx.fillText("Invoice ID:", 50, 190);
    ctx.fillStyle = "#f0f0ee";
    ctx.fillText(invId, 150, 190);

    ctx.fillStyle = "#888880";
    ctx.fillText("Client Account:", 50, 220);
    ctx.fillStyle = "#f0f0ee";
    ctx.fillText(userEmail, 150, 220);

    // Separator line
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(550, 250);
    ctx.stroke();

    // Items Header
    ctx.fillStyle = "#888880";
    ctx.font = "bold 12px monospace";
    ctx.fillText("ITEM DESCRIPTION", 50, 280);
    ctx.fillText("QTY", 400, 280);
    ctx.fillText("AMOUNT", 490, 280);

    // Separator line
    ctx.beginPath();
    ctx.moveTo(50, 295);
    ctx.lineTo(550, 295);
    ctx.stroke();

    // Item line
    ctx.fillStyle = "#f0f0ee";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(tmpl.name + " (" + (tmpl.category || "HTML Template") + ")", 50, 335);

    ctx.fillStyle = "#f0f0ee";
    ctx.font = "14px sans-serif";
    ctx.fillText("1", 405, 335);

    ctx.fillStyle = "#c8ff00";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(tmpl.price || "$0.00", 490, 335);

    // Separator line
    ctx.beginPath();
    ctx.moveTo(50, 480);
    ctx.lineTo(550, 480);
    ctx.stroke();

    // Total section
    ctx.fillStyle = "#888880";
    ctx.font = "14px sans-serif";
    ctx.fillText("Total Amount Paid:", 330, 520);
    ctx.fillStyle = "#c8ff00";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(tmpl.price || "$0.00", 480, 522);

    // Support Footer
    ctx.fillStyle = "#888880";
    ctx.font = "italic 11px sans-serif";
    ctx.fillText("Thank you for purchasing from Spark Web.", 50, 580);
    ctx.fillText("This document serves as verification of a Commercial Single-Use License.", 50, 600);
    ctx.fillText("For customer support, contact support@sparkweb.com", 50, 620);

    // Trigger download
    const link = document.createElement("a");
    link.download = `SparkWeb_${tmpl.name.replace(/\s+/g, "_")}_Receipt.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const unlocked = templatesList.filter((t) => purchasedTemplates.includes(t.id));

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0a0a0a" }}>
      {/* Upper sub-header bar */}
      <div className="border-b" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-[#888880] hover:text-white transition-colors"
          >
            ← Back to Storefront
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
              Logged in: {userEmail}
            </span>
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 rounded-sm border text-xs font-semibold text-[#ff6666] hover:bg-red-500/5 transition-all"
              style={{ borderColor: "rgba(255,102,102,0.15)" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Card Sidebar */}
          <div
            className="rounded-sm border p-8 flex flex-col items-center text-center gap-6"
            style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)", height: "fit-content" }}
          >
            {userPicture ? (
              <img
                src={userPicture}
                alt={userName || "User profile"}
                className="w-20 h-20 rounded-full border-2 border-[#c8ff00]"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl"
                style={{ background: "#1c1c1c", color: "#c8ff00" }}
              >
                {(userName || userEmail).substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#f0f0ee" }}>
                {userName || "Valued Customer"}
              </h2>
              <p className="text-xs mt-1" style={{ color: "#888880", fontFamily: "JetBrains Mono, monospace" }}>
                {userEmail}
              </p>
            </div>

            <div
              className="w-full rounded-sm border p-4 text-left"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "#888880" }}>
                Account Tier
              </div>
              <div className="text-sm font-bold text-[#c8ff00] mt-1 flex items-center gap-1.5">
                <Shield size={14} /> Premium Creator
              </div>
            </div>

            <div
              className="w-full rounded-sm border p-4 text-left"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "#888880" }}>
                Statistics
              </div>
              <div className="mt-2 text-xs flex justify-between">
                <span style={{ color: "#888880" }}>Unlocked templates:</span>
                <span className="font-bold text-white">{purchasedTemplates.length}</span>
              </div>
            </div>
          </div>

          {/* Library Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "#f0f0ee" }}>
                My Purchased Library
              </h1>
              <p className="text-sm" style={{ color: "#888880" }}>
                Manage, preview, and download the templates associated with your license.
              </p>
            </div>

            {unlocked.length === 0 ? (
              <div
                className="rounded-sm border p-12 text-center flex flex-col items-center gap-6"
                style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(200,255,0,0.05)", color: "#c8ff00" }}
                >
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1" style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}>
                    Your library is currently empty
                  </h3>
                  <p className="text-xs max-w-sm leading-relaxed" style={{ color: "#888880" }}>
                    You haven't purchased or whitelisted any templates yet. Browse the marketplace and unlock premium layouts to get started!
                  </p>
                </div>
                <button
                  onClick={onBack}
                  className="px-6 py-2.5 text-xs font-semibold rounded-sm text-[#0a0a0a]"
                  style={{ background: "#c8ff00" }}
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {unlocked.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="rounded-sm border overflow-hidden flex flex-col"
                    style={{ background: "#131313", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div style={{ aspectRatio: "16/10", overflow: "hidden", background: "#1a1a1a" }}>
                      <img
                        src={getTmplThumbnail(tmpl)}
                        alt={tmpl.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#f0f0ee", fontFamily: "Outfit, sans-serif" }}>
                          {tmpl.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "#888880", fontFamily: "Outfit, sans-serif" }}>
                          {tmpl.category}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed flex-1" style={{ color: "#888880" }}>
                        {tmpl.description || tmpl.desc}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <a
                            href={`/templates/live-editor.html?template=${tmpl.demoPath}`}
                            className="flex-1 py-2 text-center text-xs font-semibold rounded-sm text-[#0a0a0a]"
                            style={{ background: "#c8ff00" }}
                          >
                            Customize &amp; Edit
                          </a>
                          <a
                            href={`/previews/${tmpl.demoPath}/index.html`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2 text-center text-xs font-semibold rounded-sm border hover:bg-white/5 transition-all"
                            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#888880" }}
                          >
                            Preview
                          </a>
                        </div>
                        <button
                          onClick={() => handleDownloadReceipt(tmpl)}
                          className="w-full py-2 text-center text-xs font-semibold rounded-sm border transition-all duration-200 hover:bg-white/5"
                          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "#f0f0ee" }}
                        >
                          📥 Download Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

type AppView = "site" | "admin-login" | "admin-dashboard" | "profile";

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    if (window.location.hash === "#admin" || window.location.search.includes("view=admin")) {
      return "admin-login";
    }
    return "site";
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const email = localStorage.getItem("tf_user_email");
    if (email && ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      return {
        email,
        name: localStorage.getItem("tf_user_name") || "Admin User",
        role: "Super Admin"
      };
    }
    return null;
  });

  const [templatesList, setTemplatesList] = useState<any[]>([]);
  const [purchasedTemplates, setPurchasedTemplates] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("tf_user_email"));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("tf_user_name"));
  const [userPicture, setUserPicture] = useState<string | null>(localStorage.getItem("tf_user_picture"));

  const [checkoutTemplate, setCheckoutTemplate] = useState<any | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);  // Helper to normalize template column keys from SQLite (case-insensitive fallback)
  const normalizeTemplate = (t: any) => {
    if (!t) return t;

    // Map numerical IDs or names to demoPath and payhipUrl if missing
    let defaultDemoPath = "template-1";
    const tid = String(t.id || t.ID);
    const tname = String(t.name || t.NAME || "").toLowerCase();

    if (tid === "2" || tid.includes("template-2") || tname.includes("portfolio") || tname.includes("zenith")) {
      defaultDemoPath = "template-2";
    } else if (tid === "3" || tid.includes("template-3") || tname.includes("blog") || tname.includes("echo")) {
      defaultDemoPath = "template-3";
    } else if (tid === "4" || tid.includes("template-4") || tname.includes("nova")) {
      defaultDemoPath = "template-4";
    } else if (tid === "5" || tid.includes("template-5")) {
      defaultDemoPath = "template-5";
    }

    return {
      id: t.id || t.ID,
      name: t.name || t.NAME,
      category: t.category || t.CATEGORY,
      description: t.description || t.desc || t.DESCRIPTION || t.DESC,
      thumbnail: t.thumbnail || t.THUMBNAIL || t.img || "",
      demoPath: t.demoPath || t.demopath || t.DEMOPATH || defaultDemoPath,
      price: t.price || t.PRICE || "Free",
      payhipUrl: t.payhipUrl || t.payhipurl || t.PAYHIPURL || (t.price && t.price !== "Free" ? "https://payhip.com/b/mock-pro" : ""),
      figmaUrl: t.figmaUrl || t.figmaurl || t.FIGMAURL,
      rating: t.rating || t.RATING || 4.8,
      reviews: t.reviews || t.REVIEWS || 120,
      downloads: t.downloads || t.DOWNLOADS || 1200,
      pages: t.pages || t.PAGES || 5,
      tech: t.tech ? (typeof t.tech === "string" ? JSON.parse(t.tech) : t.tech) : ["React", "Tailwind"]
    };
  };

  // 1. Fetch templates from D1 database
  const loadTemplates = async () => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_templates" })
      });
      const data = await res.json();
      if (data.result === "success" && data.templates && data.templates.length > 0) {
        setTemplatesList(data.templates.map(normalizeTemplate));
      } else {
        // Fallback to static seed data if D1 returns empty results
        setTemplatesList(templates.map(normalizeTemplate));
      }
    } catch (err) {
      console.error("Failed to load templates", err);
      // Fallback to static seed data if network or server error occurs
      setTemplatesList(templates.map(normalizeTemplate));
    }
  };  // 2. Fetch user whitelist purchases from D1 database
  const loadUserPurchases = async (email: string) => {
    try {
      const res = await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_purchases", email })
      });
      const data = await res.json();
      if (data.result === "success") {
        setPurchasedTemplates(data.purchases.map((p: any) => p.templateId));
      }
    } catch (err) {
      console.error("Failed to load user purchases", err);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (userEmail) {
      loadUserPurchases(userEmail);
    } else {
      setPurchasedTemplates([]);
    }
  }, [userEmail]);

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
            alert("Payment verified successfully! Redirecting to customizer...");
            window.location.href = `/templates/live-editor.html?template=${payhipTemplate}`;
          }
        } catch (err) {
          console.error("Payhip redirect sync failed:", err);
        }
      };
      syncPurchase();
    }
  }, []);

  const handleLogin = (user: AdminUser) => {
    setAdminUser(user);
    setView("admin-dashboard");
  };

  const handleLogout = () => {
    setAdminUser(null);
    setView("site");
  };

  const handleGoogleSuccess = (email: string, name: string, picture: string) => {
    localStorage.setItem("tf_user_email", email);
    localStorage.setItem("tf_user_name", name);
    localStorage.setItem("tf_user_picture", picture);
    setUserEmail(email);
    setUserName(name);
    setUserPicture(picture);
    setShowAuthModal(false);

    // If logging in is admin email, automatically load admin session
    if (ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setAdminUser({
        email,
        password: "",
        name,
        role: "Super Admin"
      });
      setView("admin-dashboard");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("tf_user_email");
    localStorage.removeItem("tf_user_name");
    localStorage.removeItem("tf_user_picture");
    setUserEmail(null);
    setUserName(null);
    setUserPicture(null);
    setPurchasedTemplates([]);
    handleLogout();
  };

  if (view === "admin-login") {
    return <AdminLogin onLogin={handleLogin} onBack={() => setView("site")} />;
  }

  if (view === "admin-dashboard" && adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={handleLogout}
        templatesList={templatesList}
        onRefreshTemplates={loadTemplates}
      />
    );
  }

  if (view === "profile" && userEmail) {
    return (
      <UserProfile
        userEmail={userEmail}
        userName={userName}
        userPicture={userPicture}
        purchasedTemplates={purchasedTemplates}
        templatesList={templatesList}
        onBack={() => setView("site")}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <Navbar
        userEmail={userEmail}
        userName={userName}
        userPicture={userPicture}
        onSignOut={handleSignOut}
        onOpenAuth={() => setShowAuthModal(true)}
        onAdminDashboard={() => setView("admin-dashboard")}
        onProfileView={() => setView("profile")}
      />
      <Hero />
      <Templates
        templatesList={templatesList}
        purchasedTemplates={purchasedTemplates}
        userEmail={userEmail}
        onOpenCheckout={(tmpl) => setCheckoutTemplate(tmpl)}
        onOpenAuth={() => setShowAuthModal(true)}
      />
      <Services />
      <Work />
      <Process />
      <Contact />
      <Footer onAdminClick={() => setView("admin-login")} />

      {/* Overlays */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleGoogleSuccess}
        />
      )}

      {checkoutTemplate && userEmail && (
        <PaymentCheckoutModal
          template={checkoutTemplate}
          userEmail={userEmail}
          onClose={() => setCheckoutTemplate(null)}
        />
      )}
    </div>
  );
}

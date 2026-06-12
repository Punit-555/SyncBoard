import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitContactQuery } from '../utils/api';

const FONT = { fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" };

const products = [
  {
    icon: 'fas fa-tasks',
    name: 'SyncBoard',
    tag: 'Flagship Product',
    live: true,
    description:
      'Smart task management & team collaboration. Kanban boards, role-based dashboards, real-time messaging, email notifications, and project tracking — all in one place.',
    features: ['Kanban & Table views', 'Team messaging', 'Role-based access', 'Email alerts'],
    gradient: 'from-[#4361ee] to-[#7209b7]',
  },
  {
    icon: 'fas fa-chart-line',
    name: 'InsightHub',
    tag: 'Coming Soon',
    live: false,
    description:
      'Business analytics & reporting suite. Turn your operational data into beautiful dashboards and actionable insights.',
    features: ['Custom dashboards', 'Automated reports', 'Data integrations'],
    gradient: 'from-[#0ea5e9] to-[#6366f1]',
  },
  {
    icon: 'fas fa-headset',
    name: 'ClientDesk',
    tag: 'Coming Soon',
    live: false,
    description:
      'Customer support & ticketing platform. Manage client queries, SLAs and support workflows effortlessly.',
    features: ['Ticketing system', 'SLA tracking', 'Knowledge base'],
    gradient: 'from-[#f72585] to-[#b5179e]',
  },
];

const useCases = [
  {
    icon: 'fas fa-rocket',
    title: 'Startups & Agencies',
    text: 'Ship faster with lightweight project boards, clear ownership and zero onboarding friction.',
  },
  {
    icon: 'fas fa-building',
    title: 'Enterprises',
    text: 'Role-based access control, audit-friendly workflows and admin oversight across every team.',
  },
  {
    icon: 'fas fa-laptop-code',
    title: 'Software Teams',
    text: 'Kanban boards with drag & drop, QA pipelines, subtasks and due-date tracking built for dev cycles.',
  },
  {
    icon: 'fas fa-users',
    title: 'Remote Teams',
    text: 'Built-in messaging, file sharing and notifications keep distributed teams perfectly in sync.',
  },
];

const steps = [
  { num: '01', icon: 'fas fa-user-plus', title: 'Create your account', text: 'Sign up free in under a minute. No credit card required.' },
  { num: '02', icon: 'fas fa-diagram-project', title: 'Set up your workspace', text: 'Create projects, invite your team and assign roles.' },
  { num: '03', icon: 'fas fa-bolt', title: 'Start shipping', text: 'Track tasks on boards, chat with the team and watch progress live.' },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '150+', label: 'Teams onboard' },
  { value: '10k+', label: 'Tasks completed' },
  { value: '4.8★', label: 'User rating' },
];

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Contact form
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSending(true);
      const res = await submitContactQuery({ ...form, source: 'landing' });
      if (res.success) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-gray-900 antialiased" style={FONT}>
      {/* ============ NAVBAR ============ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-extrabold text-lg md:text-xl no-underline text-gray-900">
            <div className="bg-linear-to-br from-[#4361ee] to-[#7209b7] w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4361ee]/25">
              <i className="fas fa-layer-group text-sm"></i>
            </div>
            <span>Proin<span className="text-[#4361ee]">Serve</span></span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button onClick={() => scrollTo('products')} className="hover:text-[#4361ee] transition-colors">Products</button>
            <button onClick={() => scrollTo('usecases')} className="hover:text-[#4361ee] transition-colors">Use Cases</button>
            <button onClick={() => scrollTo('how')} className="hover:text-[#4361ee] transition-colors">How it Works</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-[#4361ee] transition-colors">Contact</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-[#4361ee] no-underline px-4 py-2 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white no-underline px-5 py-2.5 rounded-xl bg-linear-to-r from-[#4361ee] to-[#7209b7] hover:shadow-lg hover:shadow-[#4361ee]/30 hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100">
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl px-5 py-4 space-y-1 animate-fadeIn">
            {[['products', 'Products'], ['usecases', 'Use Cases'], ['how', 'How it Works'], ['contact', 'Contact']].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left px-3 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                {label}
              </button>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100 flex gap-3">
              <Link to="/login" className="flex-1 text-center text-sm font-semibold text-[#4361ee] no-underline px-4 py-2.5 rounded-xl border border-[#4361ee]/30">
                Sign In
              </Link>
              <Link to="/register" className="flex-1 text-center text-sm font-semibold text-white no-underline px-4 py-2.5 rounded-xl bg-linear-to-r from-[#4361ee] to-[#7209b7]">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="relative overflow-hidden pt-32 md:pt-44 pb-20 md:pb-28">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4361ee]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-24 w-96 h-96 bg-[#7209b7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#f72585]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#4361ee] bg-[#4361ee]/8 border border-[#4361ee]/15 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Software Solutions · Pro Services Platform
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            We build software
            <br />
            <span className="bg-linear-to-r from-[#4361ee] via-[#7209b7] to-[#f72585] bg-clip-text text-transparent">
              that moves teams forward
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-500 leading-relaxed mb-10">
            ProinServe crafts professional software products and services for modern businesses.
            Meet <strong className="text-gray-800">SyncBoard</strong> — our flagship task management
            &amp; team collaboration platform trusted by growing teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/register"
              className="w-full sm:w-auto text-base font-bold text-white no-underline px-8 py-4 rounded-2xl bg-linear-to-r from-[#4361ee] to-[#7209b7] shadow-xl shadow-[#4361ee]/25 hover:shadow-2xl hover:shadow-[#4361ee]/40 hover:-translate-y-1 transition-all"
            >
              <i className="fas fa-rocket mr-2"></i>
              Start Free with SyncBoard
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto text-base font-bold text-gray-800 no-underline px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#4361ee]/40 hover:text-[#4361ee] transition-all"
            >
              <i className="fas fa-arrow-right-to-bracket mr-2"></i>
              Sign In
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/70 backdrop-blur border border-gray-100 rounded-2xl py-5 shadow-sm">
                <p className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-[#4361ee] to-[#7209b7] bg-clip-text text-transparent">{s.value}</p>
                <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS ============ */}
      <section id="products" className="py-20 md:py-28 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#4361ee] uppercase tracking-widest mb-3">Our Products</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Built to solve real problems</h2>
            <p className="max-w-xl mx-auto text-gray-500">A growing suite of professional tools, starting with our flagship collaboration platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.name}
                className={`group relative bg-white rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  p.live ? 'border-[#4361ee]/20 shadow-xl shadow-[#4361ee]/5 md:scale-[1.03]' : 'border-gray-100 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${p.gradient} flex items-center justify-center text-white text-xl shadow-lg`}>
                    <i className={p.icon}></i>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                    p.live ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold mb-2">{p.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{p.description}</p>

                <ul className="space-y-2 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <i className="fas fa-circle-check text-[#4361ee] text-xs"></i>
                      {f}
                    </li>
                  ))}
                </ul>

                {p.live ? (
                  <Link
                    to="/login"
                    className="block text-center text-sm font-bold text-white no-underline px-5 py-3 rounded-xl bg-linear-to-r from-[#4361ee] to-[#7209b7] hover:shadow-lg hover:shadow-[#4361ee]/30 transition-all"
                  >
                    Launch SyncBoard
                    <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform inline-block"></i>
                  </Link>
                ) : (
                  <button disabled className="block w-full text-center text-sm font-bold text-gray-400 px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 cursor-not-allowed">
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ USE CASES ============ */}
      <section id="usecases" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#4361ee] uppercase tracking-widest mb-3">Use Cases</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Made for every kind of team</h2>
            <p className="max-w-xl mx-auto text-gray-500">From two-person startups to enterprise departments — our platform adapts to how you work.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((u) => (
              <div key={u.title} className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm hover:shadow-xl hover:border-[#4361ee]/20 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#4361ee]/8 text-[#4361ee] flex items-center justify-center text-lg mb-5">
                  <i className={u.icon}></i>
                </div>
                <h3 className="font-extrabold text-lg mb-2">{u.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{u.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="py-20 md:py-28 bg-linear-to-br from-[#0f1535] via-[#1a1f4b] to-[#2a1a5e] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4361ee]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f72585]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-[#4cc9f0] uppercase tracking-widest mb-3">How it Works</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Up and running in minutes</h2>
            <p className="max-w-xl mx-auto text-white/60">No complex setup, no training sessions. Three simple steps to a more productive team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center md:text-left">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-white/15" />
                )}
                <div className="relative inline-flex flex-col items-center md:items-start">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center text-2xl text-[#4cc9f0] mb-5 shadow-xl">
                    <i className={s.icon}></i>
                  </div>
                  <span className="text-xs font-extrabold tracking-widest text-white/40 mb-2">STEP {s.num}</span>
                  <h3 className="text-xl font-extrabold mb-2">{s.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed max-w-xs">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/register"
              className="inline-block text-base font-bold text-[#1a1f4b] no-underline px-8 py-4 rounded-2xl bg-white hover:bg-gray-100 shadow-xl hover:-translate-y-1 transition-all"
            >
              Create Your Free Account
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONTACT / VISITOR QUERY ============ */}
      <section id="contact" className="py-20 md:py-28 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left copy */}
            <div>
              <p className="text-sm font-bold text-[#4361ee] uppercase tracking-widest mb-3">Contact Us</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
                Have a question?
                <br />
                <span className="bg-linear-to-r from-[#4361ee] to-[#7209b7] bg-clip-text text-transparent">We'd love to help.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8 max-w-md">
                Whether you're curious about features, need a custom solution, or want to report an
                issue — drop us a message and our team will get back to you directly by email.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#4361ee]/8 text-[#4361ee] flex items-center justify-center">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Email us</p>
                    <p className="text-sm text-gray-500">Replies within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#4361ee]/8 text-[#4361ee] flex items-center justify-center">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Goes straight to our admins</p>
                    <p className="text-sm text-gray-500">Your query lands directly in our support inbox</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-7 md:p-9">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                    <i className="fas fa-check text-emerald-500 text-3xl"></i>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2">Message sent!</h3>
                  <p className="text-gray-500 mb-7">Our team has been notified and will reply to your email soon.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-sm font-bold text-[#4361ee] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4361ee] focus:ring-4 focus:ring-[#4361ee]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        required
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4361ee] focus:ring-4 focus:ring-[#4361ee]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleFormChange}
                      required
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4361ee] focus:ring-4 focus:ring-[#4361ee]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleFormChange}
                      required
                      placeholder="Tell us about your question or project..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4361ee] focus:ring-4 focus:ring-[#4361ee]/10 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full text-base font-bold text-white px-6 py-4 rounded-xl bg-linear-to-r from-[#4361ee] to-[#7209b7] hover:shadow-lg hover:shadow-[#4361ee]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <><i className="fas fa-spinner fa-spin mr-2"></i>Sending...</>
                    ) : (
                      <><i className="fas fa-paper-plane mr-2"></i>Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#0f1535] text-white/60 py-14">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 font-extrabold text-xl text-white mb-4">
                <div className="bg-linear-to-br from-[#4361ee] to-[#7209b7] w-9 h-9 rounded-xl flex items-center justify-center text-white">
                  <i className="fas fa-layer-group text-sm"></i>
                </div>
                <span>Proin<span className="text-[#4cc9f0]">Serve</span></span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Software solutions &amp; professional services platform. We design, build and run
                products that help teams work smarter.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm list-none">
                <li><Link to="/login" className="hover:text-white no-underline text-white/60 transition-colors">SyncBoard</Link></li>
                <li><button onClick={() => scrollTo('usecases')} className="hover:text-white transition-colors">Use Cases</button></li>
                <li><button onClick={() => scrollTo('how')} className="hover:text-white transition-colors">How it Works</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Account</h4>
              <ul className="space-y-2.5 text-sm list-none">
                <li><Link to="/register" className="hover:text-white no-underline text-white/60 transition-colors">Create Account</Link></li>
                <li><Link to="/login" className="hover:text-white no-underline text-white/60 transition-colors">Sign In</Link></li>
                <li><Link to="/login" className="hover:text-white no-underline text-white/60 transition-colors">Admin Sign In</Link></li>
                <li><button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">Support</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} ProinServe. All rights reserved. · Developed by <span className="text-white/90 font-semibold">Punit</span></p>
            <div className="flex items-center gap-4 text-base">
              <a href="#" className="hover:text-white transition-colors" title="Twitter"><i className="fab fa-x-twitter"></i></a>
              <a href="#" className="hover:text-white transition-colors" title="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="hover:text-white transition-colors" title="GitHub"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

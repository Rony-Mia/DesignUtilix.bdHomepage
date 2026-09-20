import { useState, useEffect, useRef, useCallback } from 'react';

// ── Parallax Hook ─────────────────────────────────────────────────────────────
function useParallax(speed = 0.4) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const update = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const wh = window.innerHeight;
    // How far the section center is from viewport center
    const offsetY = (rect.top + rect.height / 2 - wh / 2) * speed;
    const bg = ref.current.querySelector('.parallax-bg') as HTMLElement | null;
    if (bg) {
      bg.style.transform = `translateY(${offsetY}px) translateZ(0)`;
    }
  }, [speed]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  return ref;
}

// ── Parallax Section Wrapper ──────────────────────────────────────────────────
interface ParallaxSectionProps {
  imageUrl: string;
  overlayColor?: string;
  overlayOpacity?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  minHeight?: string;
}

function ParallaxSection({
  imageUrl, overlayColor = '#0B5D3B', overlayOpacity = 0.72,
  speed = 0.35, className = '', style = {}, children, minHeight = 'auto',
}: ParallaxSectionProps) {
  const ref = useParallax(speed);
  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`} style={{ minHeight, ...style }}>
      {/* Parallax image layer — oversized so it can move */}
      <div
        className="parallax-bg absolute inset-0 will-change-transform"
        style={{
          top: '-20%', bottom: '-20%', left: 0, right: 0,
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Color overlay */}
      <div className="absolute inset-0" style={{ background: overlayColor, opacity: overlayOpacity }} />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

// ── Subtle Parallax BG (for light sections) ───────────────────────────────────
function ParallaxBg({ imageUrl, speed = 0.2, opacity = 0.06, children, className = '', style = {} }:
  { imageUrl: string; speed?: number; opacity?: number; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useParallax(speed);
  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
      <div
        className="parallax-bg absolute inset-0 will-change-transform"
        style={{
          top: '-20%', bottom: '-20%', left: 0, right: 0,
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

// ── Image URLs ────────────────────────────────────────────────────────────────
const IMAGES = {
  dhakaSkyline:   'https://images.unsplash.com/photo-1630987871777-f7b2d62894d0?w=1800&h=1000&fit=crop&auto=format',
  dhakaCity:      'https://images.unsplash.com/photo-1630987437576-92688f9ad653?w=1800&h=1000&fit=crop&auto=format',
  bdNature:       'https://images.unsplash.com/photo-1645383595754-4f829c74ef77?w=1800&h=900&fit=crop&auto=format',
  bdSunset:       'https://images.unsplash.com/photo-1732808460864-b8e5eb489a52?w=1800&h=900&fit=crop&auto=format',
  emeraldAbstract:'https://images.unsplash.com/photo-1710438399422-2fca27686bcd?w=1800&h=900&fit=crop&auto=format',
  bdGreenField:   'https://images.unsplash.com/photo-1741197722276-a23f699fc7a9?w=1800&h=900&fit=crop&auto=format',
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconChevronDown = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconShield = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
    <path d="M32 4L8 14v18c0 14 10.667 22.667 24 28 13.333-5.333 24-14 24-28V14L32 4z" fill="rgba(255,255,255,0.1)"/>
    <path d="M32 10L12 19v13c0 12.667 9.333 19.667 20 24 10.667-4.333 20-11.333 20-24V19L32 10z" fill="rgba(255,255,255,0.15)"/>
    <path d="M32 16L14 24v10c0 10.667 8 17 18 20.5 10-3.5 18-9.833 18-20.5V24L32 16z" fill="rgba(255,255,255,0.2)"/>
    <path d="M22 32l6 6 14-14" stroke="#F5A524" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Navbar ────────────────────────────────────────────────────────────────────
const navLinks = [
  { label: 'হোম', href: '#' },
  {
    label: 'টেক্সট টুলস',
    mega: [
      { icon: '🔤', title: 'বিজয় → ইউনিকোড', desc: 'Bijoy থেকে Unicode রূপান্তর' },
      { icon: '📝', title: 'ওয়ার্ড কাউন্টার', desc: 'শব্দ ও অক্ষর গণনা করুন' },
      { icon: '🔠', title: 'কেস কনভার্টার', desc: 'বড়/ছোট হাতের রূপান্তর' },
    ],
  },
  {
    label: 'ইমেজ টুলস',
    mega: [
      { icon: '🖼️', title: 'ছবি রিসাইজার', desc: 'সরকারি সাইজে ছবি বানান' },
      { icon: '🔄', title: 'ফরম্যাট কনভার্টার', desc: 'JPG, PNG, WebP রূপান্তর' },
      { icon: '🗜️', title: 'ইমেজ কম্প্রেসার', desc: 'ছবির সাইজ কমান' },
    ],
  },
  {
    label: 'ক্যালকুলেটর',
    mega: [
      { icon: '🎓', title: 'জিপিএ ক্যালকুলেটর', desc: 'SSC/HSC জিপিএ হিসাব করুন' },
      { icon: '💰', title: 'EMI ক্যালকুলেটর', desc: 'ব্যাংক লোনের কিস্তি দেখুন' },
      { icon: '📊', title: 'শতাংশ ক্যালকুলেটর', desc: 'দ্রুত শতাংশ বের করুন' },
    ],
  },
  {
    label: 'পিডিএফ ও ডকুমেন্ট',
    mega: [
      { icon: '📄', title: 'পিডিএফ মার্জার', desc: 'একাধিক PDF একত্রিত করুন' },
      { icon: '✂️', title: 'পিডিএফ স্প্লিটার', desc: 'PDF পৃষ্ঠা আলাদা করুন' },
      { icon: '📋', title: 'সিভি মেকার', desc: 'পেশাদার সিভি তৈরি করুন' },
    ],
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ boxShadow: scrolled ? '0 4px 24px rgba(11,93,59,0.1)' : 'none' }}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #0B5D3B, #0D7048)' }}>U</div>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B5D3B', fontSize: '18px', letterSpacing: '-0.02em' }}>
            Utilix<span style={{ color: '#F5A524' }}>.bd</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="nav-item relative">
              <a href={link.href || '#'}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0B5D3B')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4A5A52')}>
                {link.label}
                {link.mega && <IconChevronDown open={false} />}
              </a>
              {link.mega && (
                <div className="mega-menu">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: '#0B5D3B', fontFamily: 'Inter' }}>{link.label}</p>
                  <div className="flex flex-col gap-2">
                    {link.mega.map((item) => (
                      <a key={item.title} href="#"
                        className="flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-[#E6F4EC]">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>{item.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{item.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: '#4A5A52', background: '#F0F4F2' }}>
            <IconSearch />
            <span style={{ fontFamily: 'Hind Siliguri', fontSize: '13px' }}>খুঁজুন</span>
            <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#E6F4EC', color: '#0B5D3B', fontFamily: 'Inter', fontSize: '11px' }}>⌘K</kbd>
          </button>
          <a href="#tools"
            className="btn-shine px-4 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #0B5D3B, #0D7048)', fontFamily: 'Hind Siliguri', boxShadow: '0 4px 12px rgba(11,93,59,0.35)' }}>
            সব টুলস দেখুন
          </a>
        </div>

        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: '#0B5D3B' }}>
          {mobileOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t px-6 py-4 flex flex-col gap-2"
          style={{ background: 'rgba(250,250,247,0.98)', borderColor: 'rgba(11,93,59,0.1)' }}>
          {navLinks.map((link) => (
            <a key={link.label} href="#" className="py-2 text-sm font-medium"
              style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>{link.label}</a>
          ))}
          <a href="#tools" className="mt-2 py-2.5 px-4 rounded-full text-sm font-semibold text-white text-center"
            style={{ background: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>সব টুলস দেখুন</a>
        </div>
      )}
    </nav>
  );
}

// ── Hero — Parallax ───────────────────────────────────────────────────────────
function Hero() {
  const sectionRef = useParallax(0.3);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Parallax BG — Dhaka skyline */}
      <div
        className="parallax-bg absolute will-change-transform"
        style={{
          top: '-20%', bottom: '-20%', left: 0, right: 0,
          backgroundImage: `url("${IMAGES.dhakaSkyline}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />
      {/* Layered overlays for depth */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(250,250,247,0.97) 0%, rgba(230,244,236,0.9) 50%, rgba(250,250,247,0.82) 100%)' }} />
      <div className="absolute inset-0 dot-grid opacity-40" />
      {/* Soft glow blobs */}
      <div className="glow-blob w-96 h-96 top-20 -left-20 opacity-40" style={{ background: '#E6F4EC' }} />
      <div className="glow-blob w-72 h-72 top-40 right-16 opacity-20" style={{ background: '#FEF3D0' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: 'rgba(230,244,236,0.9)', color: '#0B5D3B', border: '1px solid rgba(11,93,59,0.25)', fontFamily: 'Hind Siliguri', backdropFilter: 'blur(8px)' }}>
            <span>🇧🇩</span>
            <span>১০০% ফ্রি • কোনো লগইন নেই</span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6"
            style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            বাংলাদেশের জন্য{' '}
            <span className="squiggle-underline" style={{ color: '#0B5D3B' }}>সবচেয়ে দ্রুত</span>{' '}
            ও নিরাপদ অনলাইন টুলস
          </h1>

          <p className="text-lg leading-relaxed mb-10"
            style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri', maxWidth: '480px' }}>
            চাকরিপ্রার্থী, শিক্ষার্থী বা পেশাদার — সবার জন্য সহজ ও দ্রুত টুলস।
            আপনার ডিভাইসেই সব কাজ হয়, কোনো ডেটা সার্ভারে যায় না।
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#tools"
              className="btn-shine flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0B5D3B, #0D7048)', fontFamily: 'Hind Siliguri', fontSize: '16px', boxShadow: '0 8px 24px rgba(11,93,59,0.4)' }}>
              টুলস দেখুন <IconArrow />
            </a>
            <a href="#how"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold"
              style={{ background: 'rgba(255,255,255,0.85)', color: '#0B5D3B', fontFamily: 'Hind Siliguri', fontSize: '16px', border: '1.5px solid rgba(11,93,59,0.25)', backdropFilter: 'blur(8px)' }}>
              কীভাবে কাজ করে
            </a>
          </div>

          <div className="flex flex-wrap gap-6">
            {[{ icon: '🔒', label: 'কোনো সার্ভার আপলোড নেই' }, { icon: '✅', label: '১০০% ফ্রি' }, { icon: '📶', label: 'অফলাইনে কাজ করে' }].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating mockup collage */}
        <div className="relative flex items-center justify-center h-[500px] lg:h-[560px]">
          {/* PDF Merger */}
          <div className="float-1 absolute left-4 top-12 w-52 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 20px 60px rgba(11,93,59,0.18)', border: '1px solid rgba(11,93,59,0.1)', backdropFilter: 'blur(12px)' }}>
            <div className="p-4 pb-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #E6F4EC, #C5E8D4)' }}>📄</div>
                <span className="text-xs font-semibold" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>পিডিএফ মার্জার</span>
              </div>
              <div className="space-y-2 mb-3">
                {['আবেদনপত্র.pdf', 'সনদ.pdf', 'ছবি.pdf'].map((f, i) => (
                  <div key={f} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                    style={{ background: i === 0 ? '#E6F4EC' : '#F8FAF9', border: '1px solid rgba(11,93,59,0.1)' }}>
                    <span className="text-xs">📑</span>
                    <span className="text-xs" style={{ fontFamily: 'Hind Siliguri', color: '#4A5A52' }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="py-2 rounded-lg text-center text-xs font-semibold text-white mb-3"
                style={{ background: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>একত্রিত করুন →</div>
            </div>
          </div>

          {/* Photo Resizer */}
          <div className="float-2 absolute right-0 top-8 w-56 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 20px 60px rgba(11,93,59,0.18)', border: '1px solid rgba(11,93,59,0.1)', backdropFilter: 'blur(12px)' }}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #FEF3D0, #FDE68A)' }}>🖼️</div>
                <span className="text-xs font-semibold" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>ছবি রিসাইজার</span>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center text-3xl"
                  style={{ background: '#E6F4EC', height: '72px' }}>👤</div>
                <div className="flex items-center"><span className="text-lg" style={{ color: '#F5A524' }}>→</span></div>
                <div className="rounded-xl overflow-hidden flex items-center justify-center text-base"
                  style={{ background: '#E6F4EC', width: '48px', height: '60px' }}>👤</div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ background: '#E6F4EC', color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>সরকারি</div>
                <div className="flex-1 text-center px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ background: '#F0F4F2', color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>পাসপোর্ট</div>
              </div>
            </div>
          </div>

          {/* GPA Calculator */}
          <div className="float-3 absolute left-12 bottom-12 w-52 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 20px 60px rgba(11,93,59,0.18)', border: '1px solid rgba(11,93,59,0.1)', backdropFilter: 'blur(12px)' }}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' }}>🎓</div>
                <span className="text-xs font-semibold" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>জিপিএ ক্যালকুলেটর</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {[['বাংলা', 'A+'], ['ইংরেজি', 'A'], ['গণিত', 'A+']].map(([sub, grade]) => (
                  <div key={sub} className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Hind Siliguri', color: '#4A5A52' }}>{sub}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{ background: grade === 'A+' ? '#E6F4EC' : '#FEF3D0', color: grade === 'A+' ? '#0B5D3B' : '#B45309', fontFamily: 'Inter' }}>{grade}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #0B5D3B, #0D7048)' }}>
                <span className="text-xs text-white font-medium" style={{ fontFamily: 'Hind Siliguri' }}>জিপিএ</span>
                <span className="text-lg font-bold text-white" style={{ fontFamily: 'Inter' }}>5.00</span>
              </div>
            </div>
          </div>

          <div className="absolute right-8 bottom-32 px-3 py-1.5 rounded-full"
            style={{ background: '#F5A524', color: 'white', boxShadow: '0 4px 12px rgba(245,165,36,0.4)' }}>
            <span className="text-xs font-bold" style={{ fontFamily: 'Hind Siliguri' }}>নতুন</span>
          </div>
          <div className="absolute left-28 top-44 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(230,244,236,0.9)', color: '#0B5D3B', border: '1px solid rgba(11,93,59,0.2)', backdropFilter: 'blur(8px)' }}>
            <span className="text-xs font-semibold" style={{ fontFamily: 'Hind Siliguri' }}>✓ ডাউনলোড রেডি</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stats Strip ───────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: '১২+', label: 'টুলস' },
    { value: '১০,০০০+', label: 'ব্যবহারকারী' },
    { value: '১০০%', label: 'প্রাইভেসি' },
    { value: '০ টাকা', label: 'সম্পূর্ণ বিনামূল্যে' },
  ];
  return (
    <div className="max-w-[1000px] mx-auto px-6 -mt-8 relative z-20">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'white', boxShadow: '0 20px 60px rgba(11,93,59,0.12)', border: '1px solid rgba(11,93,59,0.08)' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="p-6 lg:p-8 text-center relative">
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-6 bottom-6 w-px" style={{ background: 'rgba(11,93,59,0.1)' }} />
              )}
              <div className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Popular Tools — subtle parallax bg ───────────────────────────────────────
function PopularTools() {
  return (
    <ParallaxBg imageUrl={IMAGES.bdNature} speed={0.15} opacity={0.05} className="py-24" style={{ background: '#FAFAF7' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: '#E6F4EC', color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>জনপ্রিয়</span>
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em' }}>
            সবচেয়ে জনপ্রিয় টুলস
          </h2>
          <p className="mt-3 text-lg" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>বাংলাদেশের লক্ষাধিক মানুষের পছন্দের টুলস</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Large card */}
          <div className="tool-card card-hover md:col-span-2 lg:col-span-2 rounded-2xl p-6 relative overflow-hidden cursor-pointer"
            style={{ background: 'white', border: '1px solid rgba(11,93,59,0.1)', boxShadow: '0 4px 16px rgba(11,93,59,0.06)' }}>
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: '#F5A524', fontFamily: 'Hind Siliguri' }}>জনপ্রিয়</span>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #E6F4EC, #A7D9BE)' }}>🖼️</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>সরকারি চাকরির ছবি রিসাইজার</h3>
            <p className="text-sm mb-6" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>বিজ্ঞপ্তি অনুযায়ী ছবির সাইজ, ফরম্যাট ও KB সীমা ঠিক করুন</p>
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F8FAF9' }}>
              <div className="flex-1 text-center">
                <div className="w-16 h-20 mx-auto rounded-lg flex items-center justify-center text-3xl mb-2"
                  style={{ background: '#E6F4EC', border: '2px dashed rgba(11,93,59,0.2)' }}>👤</div>
                <p className="text-xs" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>আসল ছবি</p>
                <p className="text-xs font-mono" style={{ color: '#9CA3AF' }}>2.4MB</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#0B5D3B' }}>
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="w-10 h-12 mx-auto rounded-lg flex items-center justify-center text-xl mb-2"
                  style={{ background: '#0B5D3B' }}><span className="text-white text-sm">👤</span></div>
                <p className="text-xs font-semibold" style={{ color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>সরকারি সাইজ</p>
                <p className="text-xs font-mono" style={{ color: '#0B5D3B', fontFamily: 'Inter' }}>98KB</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm font-semibold tool-arrow" style={{ color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>
              টুল চালু করুন <IconArrow />
            </div>
          </div>

          {[
            { icon: '🔤', title: 'বিজয় → ইউনিকোড', desc: 'যেকোনো Bijoy ফন্টের লেখা Unicode-এ রূপান্তর করুন', badge: 'জনপ্রিয়', badgeBg: '#E6F4EC', badgeColor: '#0B5D3B', iconBg: 'linear-gradient(135deg, #FEF3D0, #FDE68A)' },
            { icon: '📋', title: 'সিভি মেকার', desc: 'বাংলা ও ইংরেজিতে পেশাদার সিভি তৈরি করুন', badge: 'নতুন', badgeBg: '#F5A524', badgeColor: 'white', iconBg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' },
            { icon: '💰', title: 'EMI ক্যালকুলেটর', desc: 'ব্যাংক লোনের মাসিক কিস্তি হিসাব করুন', badge: '', badgeBg: '', badgeColor: '', iconBg: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' },
            { icon: '📄', title: 'পিডিএফ মার্জার', desc: 'একাধিক PDF ফাইল একত্রিত করুন', badge: 'জনপ্রিয়', badgeBg: '#E6F4EC', badgeColor: '#0B5D3B', iconBg: 'linear-gradient(135deg, #FEE2E2, #FECACA)' },
            { icon: '🎓', title: 'জিপিএ ক্যালকুলেটর', desc: 'SSC ও HSC জিপিএ হিসাব করুন', badge: '', badgeBg: '', badgeColor: '', iconBg: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)' },
            { icon: '🔠', title: 'কেস কনভার্টার', desc: 'বড়/ছোট হাতের অক্ষর পরিবর্তন করুন', badge: 'নতুন', badgeBg: '#F5A524', badgeColor: 'white', iconBg: 'linear-gradient(135deg, #FEF3D0, #FDE68A)' },
          ].map((card) => (
            <div key={card.title} className="tool-card card-hover rounded-2xl p-5 cursor-pointer"
              style={{ background: 'white', border: '1px solid rgba(11,93,59,0.1)', boxShadow: '0 4px 16px rgba(11,93,59,0.06)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: card.iconBg }}>{card.icon}</div>
                {card.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: card.badgeBg, color: card.badgeColor, fontFamily: 'Hind Siliguri' }}>{card.badge}</span>
                )}
              </div>
              <h3 className="text-sm font-bold mb-1" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>{card.title}</h3>
              <p className="text-xs" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{card.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold tool-arrow" style={{ color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>
                চালু করুন <IconArrow />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ParallaxBg>
  );
}

// ── All Tools ─────────────────────────────────────────────────────────────────
const allTools = [
  { icon: '🖼️', title: 'ছবি রিসাইজার', desc: 'নির্দিষ্ট মাপে ছবি পরিবর্তন', tags: ['ছবি', 'সরকারি'], category: 'ইমেজ' },
  { icon: '🔤', title: 'বিজয় → ইউনিকোড', desc: 'বিজয় ফন্টকে Unicode-এ রূপান্তর', tags: ['টেক্সট'], category: 'টেক্সট' },
  { icon: '📋', title: 'সিভি মেকার', desc: 'পেশাদার সিভি ও বায়োডাটা তৈরি', tags: ['চাকরি', 'ডকুমেন্ট'], category: 'পিডিএফ' },
  { icon: '🎓', title: 'জিপিএ ক্যালকুলেটর', desc: 'SSC ও HSC জিপিএ হিসাব করুন', tags: ['শিক্ষা'], category: 'ক্যালকুলেটর' },
  { icon: '📄', title: 'পিডিএফ মার্জার', desc: 'একাধিক PDF একত্রিত করুন', tags: ['পিডিএফ'], category: 'পিডিএফ' },
  { icon: '💰', title: 'EMI ক্যালকুলেটর', desc: 'ব্যাংক লোনের মাসিক কিস্তি', tags: ['ব্যাংক'], category: 'ক্যালকুলেটর' },
  { icon: '🗜️', title: 'ইমেজ কম্প্রেসার', desc: 'ছবির সাইজ কমান মানের সাথে', tags: ['ছবি', 'অপটিমাইজ'], category: 'ইমেজ' },
  { icon: '🔠', title: 'কেস কনভার্টার', desc: 'বড়/ছোট হাতের অক্ষর পরিবর্তন', tags: ['টেক্সট'], category: 'টেক্সট' },
  { icon: '✂️', title: 'পিডিএফ স্প্লিটার', desc: 'PDF থেকে পৃষ্ঠা আলাদা করুন', tags: ['পিডিএফ'], category: 'পিডিএফ' },
  { icon: '📝', title: 'ওয়ার্ড কাউন্টার', desc: 'শব্দ, অক্ষর ও বাক্য গণনা', tags: ['টেক্সট', 'লেখা'], category: 'টেক্সট' },
  { icon: '📊', title: 'শতাংশ ক্যালকুলেটর', desc: 'দ্রুত শতাংশ বের করুন', tags: ['হিসাব'], category: 'ক্যালকুলেটর' },
  { icon: '🔄', title: 'ফরম্যাট কনভার্টার', desc: 'JPG, PNG, WebP রূপান্তর', tags: ['ছবি'], category: 'ইমেজ' },
];
const categories = ['সব', 'টেক্সট', 'ইমেজ', 'ক্যালকুলেটর', 'পিডিএফ'];
const catGradients: Record<string, string> = {
  'টেক্সট': 'linear-gradient(135deg, #FEF3D0, #FDE68A)',
  'ইমেজ': 'linear-gradient(135deg, #E6F4EC, #A7D9BE)',
  'ক্যালকুলেটর': 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
  'পিডিএফ': 'linear-gradient(135deg, #FEE2E2, #FECACA)',
};

function AllTools() {
  const [activeTab, setActiveTab] = useState('সব');
  const filtered = activeTab === 'সব' ? allTools : allTools.filter((t) => t.category === activeTab);
  return (
    <section id="tools" className="py-24" style={{ background: 'white' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3"
            style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em' }}>সব টুলস</h2>
          <p className="text-lg" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>ক্যাটাগরি অনুযায়ী ফিল্টার করুন</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveTab(cat)}
              className="tab-pill px-5 py-2 rounded-full text-sm font-semibold border"
              style={{ fontFamily: 'Hind Siliguri', background: activeTab === cat ? '#0B5D3B' : 'white', color: activeTab === cat ? 'white' : '#4A5A52', border: activeTab === cat ? '1.5px solid #0B5D3B' : '1.5px solid rgba(11,93,59,0.2)' }}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
            <div key={tool.title} className="tool-card card-hover group rounded-2xl p-5 cursor-pointer relative overflow-hidden"
              style={{ background: '#FAFAF7', border: '1px solid rgba(11,93,59,0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: catGradients[tool.category] || '#E6F4EC' }}>{tool.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-1" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>{tool.title}</h3>
                  <p className="text-sm mb-3" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{tool.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{ background: '#E6F4EC', color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end px-5 py-3 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to top, white, transparent)' }}>
                <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>
                  টুল চালু করুন <IconArrow />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works — parallax bg ────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '০১', icon: '🔍', title: 'টুল বেছে নিন', desc: 'আপনার প্রয়োজন অনুযায়ী ক্যাটাগরি থেকে টুল বেছে নিন' },
    { num: '০২', icon: '📁', title: 'ফাইল বা তথ্য দিন', desc: 'ছবি, পিডিএফ বা যেকোনো তথ্য আপলোড বা টাইপ করুন' },
    { num: '০৩', icon: '⚡', title: 'সাথে সাথে ফলাফল পান', desc: 'সেকেন্ডের মধ্যে ফলাফল ডাউনলোড করুন' },
  ];
  return (
    <ParallaxBg imageUrl={IMAGES.dhakaCity} speed={0.18} opacity={0.06} id="how" className="py-24" style={{ background: '#FAFAF7' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: '#E6F4EC', color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>কীভাবে কাজ করে</span>
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em' }}>
            মাত্র ৩ ধাপে কাজ করুন
          </h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-16 left-[25%] right-[25%] h-px"
            style={{ borderTop: '2px dashed rgba(11,93,59,0.2)' }} />
          {steps.map((step, i) => (
            <div key={step.num} className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl mx-auto relative z-10"
                  style={{ background: 'white', boxShadow: '0 8px 32px rgba(11,93,59,0.1)', border: '1px solid rgba(11,93,59,0.08)' }}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: i === 0 ? '#0B5D3B' : i === 1 ? '#F5A524' : '#0D7048', fontFamily: 'Inter' }}>
                  {i + 1}
                </div>
              </div>
              <div className="text-5xl font-black mb-3 opacity-10" style={{ color: '#0B5D3B', fontFamily: 'Inter' }}>{step.num}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>{step.title}</h3>
              <p className="text-base leading-relaxed" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </ParallaxBg>
  );
}

// ── Privacy — deep parallax with emerald abstract ─────────────────────────────
function Privacy() {
  const features = [
    { icon: '⚡', title: 'Client-side প্রসেসিং', desc: 'সব কাজ আপনার ব্রাউজারে হয়, সার্ভারে কিছু যায় না' },
    { icon: '🚫', title: 'কোনো সাইনআপ নেই', desc: 'অ্যাকাউন্ট বা ইমেইল ছাড়াই ব্যবহার করুন' },
    { icon: '📶', title: 'অফলাইনে কাজ করে', desc: 'ইন্টারনেট ছাড়াও অধিকাংশ টুল কাজ করে' },
    { icon: '♾️', title: 'চিরকাল বিনামূল্যে', desc: 'কোনো প্রিমিয়াম প্ল্যান নেই, সব টুল ফ্রি' },
  ];
  return (
    <ParallaxSection
      imageUrl={IMAGES.emeraldAbstract}
      overlayColor="#052D1C"
      overlayOpacity={0.82}
      speed={0.4}
      className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-24 h-24 mb-8">
              <IconShield />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white"
              style={{ fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em' }}>
              আপনার ডেটা কখনো<br />
              <span style={{ color: '#F5A524' }}>আপনার ডিভাইস ছাড়ে না</span>
            </h2>
            <p className="text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Hind Siliguri' }}>
              আমরা বিশ্বাস করি আপনার প্রাইভেসি আপনার অধিকার। তাই আমাদের সব টুল আপনার ব্রাউজারেই কাজ করে।
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>{f.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1" style={{ fontFamily: 'Hind Siliguri' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Hind Siliguri' }}>{f.desc}</p>
                </div>
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#F5A524' }}>
                  <IconCheck />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}

// ── Testimonials — subtle bd nature bg ───────────────────────────────────────
function Testimonials() {
  const testimonials = [
    { name: 'মো. রাশেদুল ইসলাম', role: 'চাকরিপ্রার্থী, ঢাকা', avatar: '👨‍💼', quote: 'সরকারি চাকরির আবেদনের জন্য ছবি রিসাইজ করতে আগে অনেক ঝামেলা হতো। এখন Utilix.bd দিয়ে মাত্র ৩০ সেকেন্ডে হয়ে যায়!' },
    { name: 'সানজিদা আক্তার', role: 'শিক্ষার্থী, চট্টগ্রাম বিশ্ববিদ্যালয়', avatar: '👩‍🎓', quote: 'GPA ক্যালকুলেটর এবং বিজয় কনভার্টার দুটো টুলই আমার নিয়মিত কাজে লাগে। সবচেয়ে ভালো যে ইন্টারনেট ছাড়াও চলে।' },
    { name: 'আরিফুর রহমান', role: 'অফিস কর্মী, রাজশাহী', avatar: '👨‍💻', quote: 'পিডিএফ মার্জার এবং সিভি মেকার দুটো টুল অফিসের অনেক কাজ সহজ করে দিয়েছে। কোনো লগইন ছাড়াই ব্যবহার করা যায়।' },
  ];
  return (
    <ParallaxBg imageUrl={IMAGES.bdGreenField} speed={0.15} opacity={0.05} className="py-24" style={{ background: 'white' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: '#E6F4EC', color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>ব্যবহারকারীরা বলছেন</span>
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em' }}>
            হাজারো মানুষের বিশ্বাস
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-hover rounded-2xl p-6"
              style={{ background: '#FAFAF7', border: '1px solid rgba(11,93,59,0.08)', boxShadow: '0 4px 16px rgba(11,93,59,0.05)' }}>
              <div className="stars text-lg mb-4">★★★★★</div>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: '#E6F4EC' }}>{t.avatar}</div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ParallaxBg>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'কি Utilix.bd সম্পূর্ণ ফ্রি?', a: 'হ্যাঁ, Utilix.bd-এর সব টুল সম্পূর্ণ বিনামূল্যে। কোনো প্রিমিয়াম প্ল্যান বা লুকানো চার্জ নেই।' },
  { q: 'আমার ফাইল কি সার্ভারে আপলোড হয়?', a: 'না। সব প্রসেসিং আপনার ব্রাউজারে হয়। আপনার ফাইল বা ডেটা আমাদের সার্ভারে কখনো যায় না।' },
  { q: 'অফলাইনে কি ব্যবহার করা যাবে?', a: 'অধিকাংশ টুল অফলাইনে কাজ করে। একবার পেজ লোড হলে ইন্টারনেট ছাড়াও ব্যবহার করা যাবে।' },
  { q: 'মোবাইল থেকে ব্যবহার করা যাবে?', a: 'হ্যাঁ, Utilix.bd সম্পূর্ণ মোবাইল-ফ্রেন্ডলি। যেকোনো ডিভাইস থেকে ব্যবহার করুন।' },
  { q: 'নতুন টুল কখন আসবে?', a: 'আমরা নিয়মিত নতুন টুল যোগ করি। নিউজলেটারে সাবস্ক্রাইব করুন আপডেট পেতে।' },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-24" style={{ background: '#FAFAF7' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: '#E6F4EC', color: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>সাধারণ প্রশ্ন</span>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em' }}>প্রশ্ন আছে?</h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>
              আপনার যেকোনো প্রশ্নের উত্তর পেতে আমাদের সাথে যোগাযোগ করুন।
            </p>
            <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(11,93,59,0.1)' }}>
              <p className="font-semibold mb-2" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>📧 আমাদের জানান</p>
              <p className="text-sm mb-4" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>সরাসরি ইমেইল করুন, ২৪ ঘণ্টায় উত্তর পাবেন</p>
              <a href="mailto:hello@utilix.bd"
                className="block text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>hello@utilix.bd</a>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ background: 'white', border: `1px solid ${openIdx === i ? 'rgba(11,93,59,0.3)' : 'rgba(11,93,59,0.08)'}` }}>
                <button className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                  <span className="font-semibold text-base pr-4" style={{ color: '#0F1F17', fontFamily: 'Hind Siliguri' }}>{faq.q}</span>
                  <IconChevronDown open={openIdx === i} />
                </button>
                {openIdx === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: '#4A5A52', fontFamily: 'Hind Siliguri' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Final CTA — dramatic parallax with BD sunset ──────────────────────────────
function FinalCTA() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <ParallaxSection
          imageUrl={IMAGES.bdSunset}
          overlayColor="#052D1C"
          overlayOpacity={0.78}
          speed={0.45}
          className="rounded-3xl"
          style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <div className="py-16 lg:py-20 px-8 lg:px-16 text-center">
            {/* Amber glow accent */}
            <div className="glow-blob w-64 h-64 -top-8 right-20 opacity-20" style={{ background: '#F5A524' }} />
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: 'rgba(245,165,36,0.2)', color: '#F5A524', border: '1px solid rgba(245,165,36,0.3)', fontFamily: 'Hind Siliguri' }}>
              আজই শুরু করুন
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Hind Siliguri', letterSpacing: '-0.02em' }}>
              আজই আপনার কাজ সহজ করুন
            </h2>
            <p className="text-lg mb-10 mx-auto" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Hind Siliguri', maxWidth: '480px' }}>
              কোনো রেজিস্ট্রেশন নেই, কোনো পেমেন্ট নেই। এখনই শুরু করুন।
            </p>
            <a href="#tools"
              className="btn-shine inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg"
              style={{ background: '#F5A524', color: '#0B2D1E', fontFamily: 'Hind Siliguri', boxShadow: '0 8px 32px rgba(245,165,36,0.45)' }}>
              সব টুলস দেখুন <IconArrow />
            </a>
          </div>
        </ParallaxSection>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState('');
  const footerTools = ['ছবি রিসাইজার', 'বিজয় → ইউনিকোড', 'সিভি মেকার', 'জিপিএ ক্যালকুলেটর', 'পিডিএফ মার্জার', 'EMI ক্যালকুলেটর'];
  const footerLinks = ['আমাদের সম্পর্কে', 'গোপনীয়তা নীতি', 'ব্যবহারের শর্ত', 'যোগাযোগ', 'ব্লগ'];

  return (
    <footer style={{ background: '#0F1F17' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #0B5D3B, #0D7048)' }}>U</div>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, color: 'white', fontSize: '18px' }}>
                Utilix<span style={{ color: '#F5A524' }}>.bd</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Hind Siliguri' }}>
              বাংলাদেশের জন্য তৈরি সবচেয়ে দ্রুত ও নিরাপদ অনলাইন টুলস প্ল্যাটফর্ম।
            </p>
            <div className="flex gap-3">
              {['f', 'in', '𝕏'].map((s) => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#0B5D3B'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white" style={{ fontFamily: 'Hind Siliguri' }}>সব টুলস</h3>
            <ul className="space-y-2.5">
              {footerTools.map((t) => (
                <li key={t}><a href="#" className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Hind Siliguri' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#F5A524')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}>{t}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white" style={{ fontFamily: 'Hind Siliguri' }}>গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((l) => (
                <li key={l}><a href="#" className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Hind Siliguri' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#F5A524')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-white" style={{ fontFamily: 'Hind Siliguri' }}>নিউজলেটার</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Hind Siliguri' }}>নতুন টুলের আপডেট সবার আগে পান</p>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="আপনার ইমেইল" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'Hind Siliguri' }} />
              <button className="btn-shine py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#0B5D3B', fontFamily: 'Hind Siliguri' }}>সাবস্ক্রাইব করুন</button>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Hind Siliguri' }}>© ২০২৪ Utilix.bd — সর্বস্বত্ব সংরক্ষিত</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Hind Siliguri' }}>Made with ♥ in Bangladesh 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <PopularTools />
        <AllTools />
        <HowItWorks />
        <Privacy />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

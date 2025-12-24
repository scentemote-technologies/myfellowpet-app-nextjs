'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { db } from '../../../lib/firebase';

// Icons
import {
  FaUserCircle,
  FaAngleDown,
  FaAngleUp,
  FaRegClock,
  FaRegCalendarAlt,
  FaShareAlt,
} from 'react-icons/fa';

/* ================= TYPES ================= */
type BlogSection = {
  id: string;
  title: string;
  content: string;
  image?: string;
  order: number;
};

type Blog = {
  title: string;
  excerpt?: string;
  main_image?: string;
  tags?: string[];
  author?: { name: string; role?: string; avatar?: string };
  created_at?: any;
  sections: BlogSection[];
};

// ---------------- CONSTANTS ----------------
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.myfellowpet.app';

/* ================= PAGE ================= */
export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [showCopied, setShowCopied] = useState(false);

const handleShare = () => {
  navigator.clipboard.writeText(window.location.href);
  setShowCopied(true);
  setTimeout(() => setShowCopied(false), 2000);
};

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchBlog() {
      try {
        const blogRef = doc(db, 'settings', 'blogs', 'admin_blogs', slug);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) return setBlog(null);

        const sectionsRef = collection(
          db,
          'settings',
          'blogs',
          'admin_blogs',
          slug,
          'sections'
        );

        const q = query(sectionsRef, orderBy('order', 'asc'));
        const sectionsSnap = await getDocs(q);

        const sections = sectionsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<BlogSection, 'id'>),
        }));

        setBlog({ ...(blogSnap.data() as Omit<Blog, 'sections'>), sections });
      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  /* ================= ACTIVE SECTION OBSERVER ================= */
  useEffect(() => {
    // FIX: Check if blog exists before running observer logic
    if (!blog || !blog.sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%', threshold: 0.2 }
    );

    blog.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [blog]); // Watch 'blog' instead of 'blog.sections' to avoid null errors

  /* ================= READING PROGRESS ================= */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setProgress((scrollTop / height) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-24 space-y-8 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl w-full" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    );
  }

  if (!blog) return notFound();

  const readingTime = Math.max(
    1,
    Math.ceil(
      blog.sections.reduce(
        (acc, s) => acc + (typeof s.content === 'string' ? s.content.length : 0),
        0
      ) / 800
    )
  );

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <Head>
        <title>{blog.title} | MyFellowPet</title>
      </Head>

     {/* ================= HEADER ================= */}
<header className="sticky top-0 z-50 bg-white border-b">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

    {/* Logo */}
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/myfellowpet_web_logo.jpg"
        alt="MyFellowPet"
        width={200}
        height={60}
        className="cursor-pointer"
        priority
      />
    </Link>

    {/* Desktop Nav */}
    <div className="hidden md:flex items-center gap-6">

      {/* Bordered links */}
      {[
        {
          label: 'Blogs',
          href: 'https://myfellowpet.com/blogs',
        },
        {
          label: 'Careers',
          href: 'https://careers.myfellowpet.com/',
        },
        {
          label: 'Partner with us',
          href: 'https://partner.myfellowpet.com/',
        },
      ].map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target="_blank"
          className="px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
        >
          {item.label}
        </Link>
      ))}

      {/* App Download Pill */}
      <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
        <span className="text-sm font-medium text-gray-800">
          Love your pet?
          <span className="ml-1 font-semibold text-orange-600">
            Download our app
          </span>
        </span>

        <Image
          src="/assets/AppStoreLogo.png"
          alt="App Store"
          width={90}
          height={26}
        />

        <Link href={PLAY_STORE_URL} target="_blank">
          <Image
            src="/assets/GooglePlayLogo.png"
            alt="Google Play"
            width={100}
            height={26}
          />
        </Link>
      </div>

      <button className="text-gray-600 hover:text-gray-900">
        <FaUserCircle size={30} />
      </button>
    </div>

    {/* Mobile Menu Button */}
    <button
      className="md:hidden text-gray-800"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      {menuOpen ? <FaAngleUp size={28} /> : <FaAngleDown size={28} />}
    </button>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden px-6 pb-6 space-y-4 bg-white border-t">

      {[
        {
          label: 'Blogs',
          href: 'https://myfellowpet.com/blogs',
        },
        {
          label: 'Careers',
          href: 'https://careers.myfellowpet.com/',
        },
        {
          label: 'Partner with us',
          href: 'https://partner.myfellowpet.com/',
        },
      ].map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target="_blank"
          className="block w-full text-center py-3 border border-black rounded-full font-medium"
          onClick={() => setMenuOpen(false)}
        >
          {item.label}
        </Link>
      ))}

      <div className="flex justify-center gap-4 pt-2">
        <Image
          src="/assets/AppStoreLogo.png"
          alt="App Store"
          width={100}
          height={28}
        />
        <Link href={PLAY_STORE_URL} target="_blank">
          <Image
            src="/assets/GooglePlayLogo.png"
            alt="Google Play"
            width={110}
            height={28}
          />
        </Link>
      </div>
    </div>
  )}
</header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="w-full max-w-[1600px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-6 xl:gap-16 items-start">
          
       {/* LEFT: TABLE OF CONTENTS */}
<aside className="hidden lg:block relative">
  <div className="sticky top-32 group/toc">
    {/* Heading with Animated Bar */}
    <div className="flex items-center gap-3 mb-8">
      <div className="relative h-5 w-[2px] bg-gray-100 overflow-hidden rounded-full">
        <div 
          className="absolute top-0 left-0 w-full bg-[#2CB4B6] transition-all duration-500 ease-out"
          style={{ height: `${activeId ? '100%' : '30%'}` }}
        />
      </div>
      <h4 className="text-[10px] uppercase tracking-[0.3em] font-black /40 group-hover/toc:text-[#2CB4B6] transition-colors">
        On This Page
      </h4>
    </div>

    {/* Navigation Menu */}
    <nav className="space-y-1 relative">
      {/* Decorative vertical line track */}
      <div className="absolute left-[19px] top-0 w-[1px] h-full bg-gray-50 -z-10" />
      
      {blog.sections.map((section, idx) => {
        const active = activeId === section.id;
        return (
          <a 
            key={section.id} 
            href={`#${section.id}`} 
            className={`
              group flex items-center gap-4 py-3 px-3 rounded-2xl transition-all duration-300
              ${active 
                ? 'bg-white shadow-[0_10px_20px_rgba(0,0,0,0.04)] border border-gray-100 translate-x-1' 
                : 'hover:bg-gray-50/50 border border-transparent'
              }
            `}
          >
            {/* Index Number with Ring Effect */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300
              ${active 
                ? 'bg-[#2CB4B6] text-white rotate-[360deg] shadow-lg shadow-[#2CB4B6]/30' 
                : 'bg-gray-50 text-gray-300 group-hover:bg-white group-hover:text-gray-900'
              }
            `}>
              0{idx + 1}
            </div>

            {/* Title */}
            <span className={`
              text-[13px] font-bold leading-tight transition-colors duration-300
              ${active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}
            `}>
              {section.title}
            </span>
          </a>
        );
      })}
    </nav>

    {/* Enhanced Share Block */}
<div className="mt-10 p-1 rounded-[24px] bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm relative">
  <button 
    onClick={handleShare}
    className="
      w-full flex items-center justify-center gap-3 py-4 rounded-[20px] 
      text-[10px] font-black text-gray-400 uppercase tracking-widest
      hover:bg-white hover:text-[#2CB4B6] hover:shadow-xl hover:shadow-gray-200/50 
      transition-all duration-300 active:scale-95 group
    "
  >
<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#2CB4B6] transition-colors">
      <FaShareAlt size={12} />
    </div>
    Share Story
  </button>

  {/* Copied Link Snackbar */}
  {showCopied && (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-2 px-4 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2 whitespace-nowrap z-50">
      <div className="w-2 h-2 rounded-full bg-[#2CB4B6] animate-pulse" />
      Link Copied!
    </div>
  )}
</div>
  </div>
</aside>

          {/* MIDDLE: ARTICLE */}
          <article className="w-full max-w-[880px] mx-auto lg:mx-0">
            <h1 className="text-3xl md:text-5xl font-bold text-[#111827] leading-tight mb-6 tracking-tight">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-[#E6F7F7] text-[#2CB4B6] text-[11px] font-bold uppercase tracking-wider rounded-md">
                {blog.tags?.[0] || 'Pet Care'}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <FaRegClock /> {readingTime} min read
              </span>
            </div>

            <div className="flex items-center gap-4 mb-0 pb-8 border-b border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                <FaUserCircle size={48} />
              </div>
              <div>
                <p className="font-bold text-gray-800">{blog.author?.name || 'Gowtham'}</p>
                <p className="text-sm text-gray-400">
                  Published on {blog.created_at?.toDate?.().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Dec 24, 2025'}
                </p>
              </div>
            </div>

         {/* Main Featured Image - Left Aligned & Reduced Size */}
{blog.main_image && (
  <div className="relative w-full max-w-2xl aspect-video mb-12 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm ml-0 group">
    {/* Subtle Blurred Background Fill */}
    <div 
      className="absolute inset-0 scale-110 blur-2xl opacity-10"
      style={{ 
        backgroundImage: `url(${blog.main_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
    {/* Image contained to show everything, starting from left */}
    <Image 
      src={blog.main_image} 
      alt={blog.title} 
      fill 
      className="object-contain relative z-10 p-4 transition-transform duration-700 group-hover:scale-[1.02]" 
      priority 
    />
  </div>
)}

            <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:mb-8 prose-headings:text-gray-900">
              {blog.sections.map((section, idx) => (
                <section id={section.id} key={section.id} className="mb-16 scroll-mt-28">
                  <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                  <div className={`text-lg text-gray-600 leading-relaxed whitespace-pre-line ${idx === 0 ? 'first-letter:text-7xl first-letter:font-black first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left first-letter:leading-[1]' : ''}`}>
                    {section.content}
                  </div>
                {/* Section Image - Left Aligned & Reduced Size */}
{section.image && (
  <div className="relative w-full max-w-xl aspect-video mt-10 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm ml-0">
    <Image 
      src={section.image} 
      alt={section.title} 
      fill 
      className="object-contain p-2" 
    />
  </div>
)}
                </section>
              ))}
            </div>
          </article>

          {/* RIGHT: SIDEBAR */}
<aside className="hidden xl:block">
  <div className="sticky top-32 space-y-8" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
    
    {/* PREMIUM AUTHOR CARD */}
    <div className="relative overflow-hidden group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1">
      {/* Decorative background glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#2CB4B6]/5 rounded-full blur-2xl group-hover:bg-[#2CB4B6]/10 transition-colors" />
      
      <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-[#2CB4B6] mb-6">
        The Author
      </p>
      
      <div className="relative flex items-center gap-4 mb-5">
        <div className="relative w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 overflow-hidden border border-gray-100 shadow-inner group-hover:border-[#2CB4B6]/30 transition-colors">
          <FaUserCircle size={56} className="group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h5 className="font-bold text-gray-900 text-lg leading-tight">
            {blog.author?.name || 'Gowtham'}
          </h5>
        
        </div>
      </div>
      
     
      
      <button className="w-full py-3.5 bg-gray-900 text-white rounded-2xl text-[10px] font-black tracking-[0.15em] hover:bg-[#2CB4B6] hover:shadow-lg hover:shadow-[#2CB4B6]/20 transition-all active:scale-95">
        VIEW PROFILE
      </button>
    </div>

    {/* DATA METRICS CARD */}
    <div className="p-2 rounded-[2rem] bg-gray-50/50 border border-gray-100">
      <div className="bg-white rounded-[1.6rem] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <FaRegCalendarAlt size={14} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Published</span>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {blog.created_at?.toDate?.().toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            }) || '24 Dec 2025'}
          </span>
        </div>

        <div className="h-[1px] w-full bg-gray-50" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2CB4B6]/10 flex items-center justify-center text-[#2CB4B6]">
              <FaRegClock size={14} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Read Time</span>
          </div>
          <span className="text-sm font-bold text-gray-900">{readingTime} Mins</span>
        </div>
      </div>
    </div>

    {/* INTERACTIVE TOPICS */}
    <div className="px-2">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-[1px] flex-1 bg-gray-100" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Related</p>
        <div className="h-[1px] flex-1 bg-gray-100" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {(blog.tags || ['boarding', 'dog-care']).map(tag => (
          <span 
            key={tag} 
            className="px-4 py-2 bg-white border border-gray-100 text-[11px] font-bold text-gray-600 rounded-xl hover:border-[#2CB4B6] hover:text-[#2CB4B6] hover:shadow-md transition-all cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>

  </div>
</aside>
        </div>
      </main>
    </div>
  );
}
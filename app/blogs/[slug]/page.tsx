'use client';
'use client';
import {
  MdContentCut,
  MdHome,
  MdShoppingBag,
  MdSchool,
  MdPets,
  MdLocalHospital,
} from 'react-icons/md';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


import Link from 'next/link';
import { Poppins } from 'next/font/google';

// Icons
import {
  FaWhatsapp,
  FaUserCircle,
  FaSearch,
  FaInstagram,
  FaAngleDown,
  FaAngleUp,
  FaEnvelope,
} from 'react-icons/fa';

import {
  MdFavorite,
} from 'react-icons/md';



import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Head from 'next/head';
import { db } from '../../../lib/firebase';

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
  author?: { name: string };
  created_at?: any;
  sections: BlogSection[];
};
// ---------------- CONSTANTS ----------------
const kPrimary = '#2CB4B6';
const kAccent = '#F67B0D';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.myfellowpet.app';
const APP_STORE_URL = 'YOUR_APP_STORE_LINK'; // Replace with Apple link

/* ================= PAGE ================= */
export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
const [menuOpen, setMenuOpen] = useState(false);
  

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

        const sections = sectionsSnap.docs.map(d => ({
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

  /* ================= SCHEMA ================= */
  const articleSchema = useMemo(() => {
    if (!blog) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      description: blog.excerpt,
      image: blog.main_image,
      author: {
        '@type': 'Person',
        name: blog.author?.name,
      },
      datePublished: blog.created_at?.toDate?.().toISOString(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://myfellowpet.com/blog/${slug}`,
      },
    };
  }, [blog, slug]);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myfellowpet.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://myfellowpet.com/blog' },
      { '@type': 'ListItem', position: 3, name: blog?.title },
    ],
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="max-w-[680px] mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-64 bg-gray-200 rounded-xl" />
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
    
    <>
      {/* ================= SEO ================= */}
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="article:published_time" content={blog.created_at?.toDate?.().toISOString()} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
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
          label: 'Blog',
          href: 'http://myfellowpet.com/blogs',
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
          label: 'Docs',
          href: 'http://myfellowpet.com/home-boarder-onboarding/overview/',
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


      {/* ================= PROGRESS BAR ================= */}
      <div className="fixed top-0 left-0 h-1 bg-gray-200 w-full z-50">
        <div className="h-full bg-black" style={{ width: `${progress}%` }} />
      </div>

      {/* ================= 3 COLUMN LAYOUT ================= */}
<div className="max-w-full mx-auto px-0 py-16 grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-12">
    {/* ================= HEADER ================= */}

<aside className="hidden lg:block sticky top-28 h-screen bg-white">
  <div className="h-full px-8 py-28 overflow-y-auto">
    <ul className="space-y-3">
      {blog.sections.map((section, index) => {
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="
                group flex items-center gap-3
                px-4 py-3 rounded-xl
                text-sm font-medium
                bg-[#E6F7F7]
                text-[#2CB4B6]
                hover:bg-[#D9F1F1]
                transition
              "
            >
              {/* Index */}
              <span className="
                flex items-center justify-center
                w-6 h-6 rounded-full
                bg-white
                text-[#2CB4B6]
                text-xs font-semibold
              ">
                {index + 1}
              </span>

              {/* Title */}
              <span className="leading-snug">
                {section.title}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  </div>
</aside>




        {/* ========== ARTICLE ========== */}
        <article className="max-w-[680px] w-full">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            By <span className="font-medium text-gray-700">{blog.author?.name}</span>
          </p>

          {blog.main_image && (
            <div className="relative h-[300px] mb-10 rounded-xl overflow-hidden bg-gray-50">
              <Image src={blog.main_image} alt={blog.title} fill className="object-contain" />
            </div>
          )}

          <div className="space-y-14">
            {blog.sections.map((section, idx) => (
              <section id={section.id} key={section.id}>
                <h2 className="text-xl font-semibold mb-3">
                  {section.title}
                </h2>

                <p
                  className={`text-gray-700 leading-relaxed ${
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left'
                      : ''
                  }`}
                >
                  {section.content}
                </p>

                {section.image && (
                  <div className="relative h-[240px] mt-6 rounded-lg overflow-hidden bg-gray-50">
                    <Image src={section.image} alt={section.title} fill className="object-contain" />
                  </div>
                )}
              </section>
            ))}
          </div>
        </article>

        {/* ========== RIGHT RAIL ========== */}
        <aside className="hidden xl:block sticky top-28 h-fit space-y-6">

          {/* Author */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              Written by
            </p>
            <p className="font-semibold text-gray-900">
              {blog.author?.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Contributor at MyFellowPet
            </p>
          </div>

          {/* Meta */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Reading time</span>
              <span>{readingTime} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Published</span>
              <span>
                {blog.created_at?.toDate?.().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { db } from '../../../lib/firebase';

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
  author?: {
    name: string;
  };
  created_at?: any;
  sections: BlogSection[];
};

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return;

      try {
        /* ---------------- BLOG DOC ---------------- */
        const blogRef = doc(db, 'settings', 'blogs', 'admin_blogs', slug);
        const blogSnap = await getDoc(blogRef);

        if (!blogSnap.exists()) {
          setBlog(null);
          return;
        }

        /* ---------------- SECTIONS SUBCOLLECTION ---------------- */
        const sectionsRef = collection(
          db,
          'settings',
          'blogs',
          'admin_blogs',
          slug,
          'sections'
        );

        const sectionsQuery = query(sectionsRef, orderBy('order', 'asc'));
        const sectionsSnap = await getDocs(sectionsQuery);

        const sections: BlogSection[] = sectionsSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<BlogSection, 'id'>),
        }));

        /* ---------------- MERGE DATA ---------------- */
        setBlog({
          ...(blogSnap.data() as Omit<Blog, 'sections'>),
          sections,
        });

      } catch (err) {
        console.error('Error fetching blog:', err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="py-32 text-center text-gray-500">
        Loading article…
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (!blog) {
    return notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-20">

      {/* ================= TITLE (ONLY ONE H1) ================= */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
        {blog.title}
      </h1>

      {/* ================= META ================= */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8">
        {blog.author?.name && (
          <span>
            By <strong className="text-gray-700">{blog.author.name}</strong>
          </span>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <>
            <span>•</span>
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </>
        )}
      </div>

      {/* ================= EXCERPT ================= */}
      {blog.excerpt && (
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          {blog.excerpt}
        </p>
      )}

      {/* ================= HERO IMAGE ================= */}
      {blog.main_image && (
        <div className="relative w-full h-[420px] mb-16 rounded-2xl overflow-hidden">
          <Image
            src={blog.main_image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* ================= CONTENT SECTIONS ================= */}
      <div className="space-y-16">

        {blog.sections.map(section => (
          <section key={section.id}>

            {/* SECTION TITLE */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              {section.title}
            </h2>

            {/* SECTION CONTENT */}
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {section.content}
            </p>

            {/* SECTION IMAGE */}
            {section.image && (
              <div className="relative w-full h-[360px] mt-8 rounded-xl overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

          </section>
        ))}

      </div>

      {/* ================= AUTHOR FOOTER ================= */}
      {blog.author?.name && (
        <div className="mt-20 pt-8 border-t text-sm text-gray-500">
          Written by <strong className="text-gray-700">{blog.author.name}</strong>
        </div>
      )}

    </article>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type Blog = {
  slug: string;
  title: string;
  main_image: string;
  excerpt?: string;
  author?: { name: string };
  published_at?: string;
};

export default function BlogsClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBlogs() {
      const ref = collection(db, 'settings', 'blogs', 'admin_blogs');
      const snap = await getDocs(ref);

      const data = snap.docs.map((doc) => ({
        slug: doc.id,
        ...doc.data(),
      })) as Blog[];

      setBlogs(data);
    }

    fetchBlogs();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -360 : 360,
      behavior: 'smooth',
    });
  };

  if (!blogs.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* ================= HEADER ================= */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">
            Pet Care Blogs & Guides
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl">
            Expert insights on grooming, boarding, training & pet wellness —
            written by professionals.
          </p>
        </div>

        {/* Arrows */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full border hover:bg-gray-100 transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full border hover:bg-gray-100 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* ================= BLOG ROW ================= */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-6 scroll-smooth"
      >
        {blogs.map((blog) => (
          <Link
            key={blog.slug}
            href={`/blogs/${blog.slug}`}
            className="group min-w-[340px] max-w-[340px]
                       bg-white rounded-3xl border
                       hover:shadow-xl transition-all"
          >
            {/* Image */}
            
            {blog.main_image && (
             <div className="relative w-full h-52 overflow-hidden rounded-t-3xl bg-gray-50">
  <Image
    src={blog.main_image}
    alt={blog.title}
    fill
    className="object-contain transition-transform duration-500 group-hover:scale-105"
  />
</div>

            )}

            {/* Content */}
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {blog.title}
              </h3>

              {blog.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {blog.excerpt}
                </p>
              )}

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                {blog.author?.name && (
                  <span>By {blog.author.name}</span>
                )}
                {blog.published_at && (
                  <span>
                    {new Date(blog.published_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

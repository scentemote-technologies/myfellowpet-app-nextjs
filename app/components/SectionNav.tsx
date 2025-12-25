"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  PawPrint,
  RefreshCcw,
} from "lucide-react";

const SECTIONS = [
  {
    id: "features",
    label: "Why parents love this",
    icon: Heart,
  },
  {
    id: "pet-details",
    label: "Pet pricing",
    icon: PawPrint,
  },
  {
    id: "refund-policy",
    label: "Refund policy",
    icon: RefreshCcw,
  },
];

export default function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [open, setOpen] = useState(false);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* ================= SCROLL SPY ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setOpen(false);
  };

  /* ================= INDICATOR POSITION ================= */
  const indicatorTop =
    itemRefs.current[active]?.offsetTop ?? 0;

  return (
    <>
      {/* ================= DESKTOP LEFT NAV ================= */}
      <aside className="hidden lg:block sticky top-24 w-56 self-start font-[var(--font-poppins)]">
        <div className="relative border-r border-gray-200">

          {/* Animated indicator */}
          <span
            className="absolute left-0 w-0.5 h-6 bg-[#2CB4B6] rounded transition-all duration-300"
            style={{ top: indicatorTop + 14 }}
          />

          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
ref={(el) => {
  itemRefs.current[id] = el;
}}
              onClick={() => scrollTo(id)}
              className={`
                group w-full flex items-center gap-3
                px-4 py-3 text-sm text-left
                transition
                ${
                  active === id
                    ? "text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900"
                }
              `}
            >
              <Icon
                size={16}
                className={`
                  ${
                    active === id
                      ? "text-[#2CB4B6]"
                      : "text-gray-400 group-hover:text-[#2CB4B6]"
                  }
                `}
              />
              {label}
            </button>
          ))}
        </div>
      </aside>

      {/* ================= MOBILE HAMBURGER ================= */}
      <button
        onClick={() => setOpen(true)}
        className="
          lg:hidden fixed bottom-6 right-6 z-40
          rounded-full bg-[#2CB4B6] text-white
          p-4 shadow-lg
        "
        aria-label="Open section navigation"
      >
        ☰
      </button>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-72 bg-white font-[var(--font-poppins)]">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <p className="font-semibold text-gray-900">
                Jump to section
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="divide-y">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`
                    w-full flex items-center gap-3
                    px-5 py-4 text-sm
                    ${
                      active === id
                        ? "text-[#2CB4B6] font-medium"
                        : "text-gray-700"
                    }
                    hover:bg-gray-50
                  `}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

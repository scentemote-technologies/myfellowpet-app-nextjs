"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {images.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className="relative h-40 cursor-pointer"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          >
            <Image
              src={img}
              alt={alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setOpen(false)}
          >
            ×
          </button>

          <button
            className="absolute left-6 text-white text-3xl"
            onClick={prev}
          >
            ‹
          </button>

          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={images[index]}
              alt={alt}
              fill
              className="object-contain"
            />
          </div>

          <button
            className="absolute right-6 text-white text-3xl"
            onClick={next}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

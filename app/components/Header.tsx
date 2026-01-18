'use client'; // Required because of the setMenuOpen state

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserCircle, FaAngleUp, FaAngleDown } from 'react-icons/fa';

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.myfellowpet.app";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Blogs', href: 'http://myfellowpet.com/blogs' },
    { label: 'Careers', href: 'https://careers.myfellowpet.com/' },
  { label: 'Partner with us', scrollTo: 'partner-section' },
  ];
  const handleScroll = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};


  return (
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
         {navLinks.map((item) =>
  item.scrollTo ? (
    <button
      key={item.label}
      onClick={() => handleScroll(item.scrollTo)}
      className="px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
    >
      {item.label}
    </button>
  ) : (
    <Link
      key={item.label}
      href={item.href}
      target="_blank"
      className="px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
    >
      {item.label}
    </Link>
  )
)}


          {/* App Download Pill */}
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-gray-800 text-nowrap">
              Love your pet?
              <span className="ml-1 font-semibold text-orange-600">Download our app</span>
            </span>
            <Image src="/assets/AppStoreLogo.png" alt="App Store" width={90} height={26} />
            <Link href={PLAY_STORE_URL} target="_blank">
              <Image src="/assets/GooglePlayLogo.png" alt="Google Play" width={100} height={26} />
            </Link>
          </div>

          <button className="text-gray-600 hover:text-gray-900">
            <FaUserCircle size={30} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaAngleUp size={28} /> : <FaAngleDown size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 space-y-4 bg-white border-t animate-in slide-in-from-top duration-300">
          {navLinks.map((item) =>
  item.scrollTo ? (
    <button
      key={item.label}
      onClick={() => {
        handleScroll(item.scrollTo);
        setMenuOpen(false);
      }}
      className="block w-full text-center py-3 border border-black rounded-full font-medium"
    >
      {item.label}
    </button>
  ) : (
    <Link
      key={item.label}
      href={item.href}
      target="_blank"
      className="block w-full text-center py-3 border border-black rounded-full font-medium"
      onClick={() => setMenuOpen(false)}
    >
      {item.label}
    </Link>
  )
)}

          <div className="flex justify-center gap-4 pt-2">
            <Image src="/assets/AppStoreLogo.png" alt="App Store" width={100} height={28} />
            <Link href={PLAY_STORE_URL} target="_blank">
              <Image src="/assets/GooglePlayLogo.png" alt="Google Play" width={110} height={28} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
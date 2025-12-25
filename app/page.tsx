'use client';

import { useRouter } from 'next/navigation';

import {
  MdContentCut,
  MdHome,
  MdShoppingBag,
  MdSchool,
  MdPets,
  MdLocalHospital,
} from 'react-icons/md';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

// Components & Hooks
import ServiceCard from './components/ServiceCard';
import Footer from './components/Footer';
import useBoardingServices from '../lib/useBoardingServices';
import Header from './components/Header';

// ---------------- FONT CONFIGURATION ----------------
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

// ---------------- CONSTANTS ----------------
const kPrimary = '#2CB4B6';
const kAccent = '#F67B0D';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.myfellowpet.app';
const APP_STORE_URL = 'YOUR_APP_STORE_LINK'; // Replace with Apple link

// ---------------- SERVICES DATA ----------------
const services = [
  { name: 'Boarding', icon: MdHome, link: '/services/boarding' },
  { name: 'Grooming', icon: MdContentCut, link: '/services/grooming' },
  { name: 'Vets', icon: MdLocalHospital, link: '/services/vet' },
  { name: 'Supplies', icon: MdShoppingBag, link: '/store' },
  { name: 'Training', icon: MdSchool, link: '/services/training' },
  { name: 'Farewell', icon: MdFavorite, link: '/services/farewell' },
];




function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}




// ===================================================

export default function LandingPage() {
  const router = useRouter(); // Initialize router
// 1. Initialize with 'Bengaluru' as the default fallback
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // 2. Use a Reverse Geocoding API
            // Using OpenStreetMap (Free, no API key required for low volume)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            
            // 3. Extract City/District
            // Nominatim returns city, town, or residential district in 'address'
            const detectedCity = data.address.city || data.address.town || data.address.state_district;
            
            if (detectedCity) {
              // Clean up strings like "Bengaluru Urban" to just "Bengaluru" if needed
              const cleanCity = detectedCity.replace(' District', '').replace(' Division', '');
              setSelectedCity(cleanCity);
            }
          } catch (error) {
            console.error("Error detecting city:", error);
          } finally {
            setIsDetecting(false);
          }
        },
        (error) => {
          console.warn("Location permission denied, using default.");
          setIsDetecting(false);
        }
      );
    }
  }, []);  const { cards: sortedCards, loading } = useBoardingServices();
  const [showAllBoardingCards, setShowAllBoardingCards] = useState(false);
  const [footerData, setFooterData] = useState<any>(null);
  const [partnerVideoUrl, setPartnerVideoUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [partnerBgImages, setPartnerBgImages] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
const [selectedService, setSelectedService] = useState('Boarding');
const [blogs, setBlogs] = useState<any[]>([]);
const blogScrollRef = React.useRef<HTMLDivElement>(null);
const handleSearch = () => {
    // Map service names to your URL slugs
    const serviceMap: Record<string, string> = {
      'Boarding': 'boarding',
      'Grooming': 'grooming',
      'Shops': 'store',
      'Training': 'training',
      'Sitting': 'sitting',
      'Veterinary': 'vet',
    };

    const slug = serviceMap[selectedService] || 'boarding';
    
    // Redirect to the service page with city as a query param
    router.push(`/services/${slug}?city=${selectedCity}`);
  };



const [activeBg, setActiveBg] = useState(0);


  const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};



  const hasMoreThanFive = sortedCards.length > 5;
  const cardsToDisplay =
    hasMoreThanFive && !showAllBoardingCards
      ? sortedCards.slice(0, 6)
      : sortedCards;

  // ---------------- FETCH FOOTER DATA ----------------
  useEffect(() => {
    async function fetchFooterData() {
      try {
        const ref = doc(db, 'company_documents', 'footer');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setFooterData(snap.data());
        }
      } catch (err) {
        console.error('Error fetching footer data:', err);
      }
    }

    fetchFooterData();
  }, []);
  useEffect(() => {
  async function fetchStats() {
    try {
      const ref = doc(db, 'settings', 'stats');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setStats(snap.data());
      }
    } catch (e) {
      console.error('Error fetching stats', e);
    }
  }

  fetchStats();
}, []);
useEffect(() => {
  async function fetchBlogs() {
    try {
      const blogsRef = collection(db, 'settings', 'blogs', 'admin_blogs');
      const q = query(blogsRef, orderBy('published_at', 'desc'));
      const snap = await getDocs(q);

      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogs(list);
    } catch (e) {
      console.error('Error fetching blogs', e);
    }
  }

  fetchBlogs();
}, []);



  useEffect(() => {
  async function fetchPartnerCarousel() {
    try {
      const ref = doc(db, 'settings', 'photos_and_videos');
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const images = snap.data()?.main_website_partner_carousel || [];
        setPartnerBgImages(images);
      }
    } catch (err) {
      console.error('Error fetching partner carousel:', err);
    }
  }

  fetchPartnerCarousel();
}, []);

useEffect(() => {
  if (partnerBgImages.length <= 1) return;

  const interval = setInterval(() => {
    setActiveBg((prev) =>
      prev === partnerBgImages.length - 1 ? 0 : prev + 1
    );
  }, 5000); // 5 seconds

  return () => clearInterval(interval);
}, [partnerBgImages]);


  useEffect(() => {
    async function fetchPartnerOnboardVideoData() {
      try {
        const ref = doc(db, 'settings', 'links');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPartnerVideoUrl(snap.data()?.boarding_partner_onboard_video || null);
        }
      } catch (err) {
        console.error('Error fetching Partner Onboard Video:', err);
      }
    }

    fetchPartnerOnboardVideoData();
  }, []);

  return (
    <div
      className={`min-h-screen bg-white text-gray-800 relative ${poppins.className}`}
    >
   <Header /> {/* Call the Header here */}




{/* ================= HERO ================= */}
<main className="w-full py-24 px-4">
  <div className="max-w-6xl mx-auto flex flex-col items-center">

   {/* ================= HEADING ================= */}
<h1 className="text-4xl md:text-[3rem] font-semibold text-gray-900 leading-tight text-center">
  Find Trusted Pet Businesses
</h1>

{/* Verified line */}
<div className="mt-3 flex items-center justify-center gap-2">
  
  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="white"
      className="w-3.5 h-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </span>

<p className="text-base md:text-lg font-semibold text-gray-700">
  Only trusted & verified pet businesses
</p>



</div>
<div className="mt-10 w-full max-w-5xl bg-white rounded-2xl border border-gray-300 shadow-md px-6 py-5 space-y-5">

  {/* ================= SERVICE CHIPS ================= */}
  <div className="flex flex-wrap gap-4">

    {[
      { name: 'Boarding', icon: MdHome },
      { name: 'Grooming', icon: MdContentCut },
      { name: 'Shops', icon: MdShoppingBag },
      { name: 'Training', icon: MdSchool },
      { name: 'Sitting', icon: MdPets },
      { name: 'Veterinary', icon: MdLocalHospital },
    ].map(({ name, icon: Icon }) => {
      const active = selectedService === name;

      return (
        <button
          key={name}
          onClick={() => setSelectedService(name)}
          className="flex items-center gap-2 px-4 py-2 border text-sm font-semibold transition"
          style={{
            borderRadius: '12px',
            backgroundColor: active ? '#FFF7ED' : '#fff',
            borderColor: active ? kAccent : '#D1D5DB',
            color: active ? kAccent : '#374151',
          }}
        >
          <Icon size={18} />
          {name}
        </button>
      );
    })}
  </div>

  {/* ================= FILTER ROW ================= */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

  {/* City Selector */}
  <div className="border rounded-xl px-4 py-3 flex justify-between items-center bg-gray-50">
    <div className="flex-1">
      <p className="text-xs text-gray-500">My City</p>
      <select 
        className="w-full bg-transparent text-lg font-semibold text-gray-900 outline-none cursor-pointer appearance-none"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        {/* Dynamic City List from Stats if available, otherwise fallback */}
        {stats?.cities_covered?.names ? (
          stats.cities_covered.names.map((city: string) => (
            <option key={city} value={city}>{city}</option>
          ))
       ) : null}
      </select>
    </div>

    {/* Reset City Button */}
    <button 
      onClick={() => setSelectedCity('Bengaluru')}
      className="text-gray-400 hover:text-gray-700 text-xl ml-2"
    >
      ×
    </button>
  </div>

  {/* Search Button */}
  <button
    onClick={handleSearch} // This triggers your router.push logic
    className="flex items-center justify-center gap-2 text-white font-semibold rounded-xl h-full py-4 md:py-0 px-8 hover:opacity-90 transition shadow-lg active:scale-95"
    style={{ backgroundColor: kAccent }}
  >
    <FaSearch size={16} />
    Search
  </button>
</div>
</div>


    {/* ================= SEARCH CARD (CENTER) ================= */}
<div
  className="mt-0 w-full bg-white rounded-2xl  p-6 space-y-5 "
>

   
    {stats && (
  <div className="mt-4 w-full flex flex-wrap justify-center gap-6">


    <StatItem
      label="Total Bookings"
      value={Number(stats.total_bookings || 0)}
    />

    <StatItem
      label="Verified Partners"
      value={Number(stats.verified_partners || 0)}
    />

    <StatItem
      label="Happy Pet Parents"
      value={Number(stats.total_users || 0)}
    />

    <StatItem
      label="Cities Covered"
      value={stats.cities_covered?.names?.length || 0}
      cities={stats.cities_covered?.names || []}
    />

    <StatItem
      label="Average Rating"
      value={Number(stats.average_rating || 0)}
      isDecimal
    />

  </div>
)}
    {/* ================= USER TYPE CARDS (ROW BELOW) ================= */}
    <div className="mt-14 w-full grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Pet Parent */}
      <button
        onClick={() => scrollToSection('pet-parent-steps')}
        className="group border-2 rounded-3xl p-12 text-left transition-all hover:shadow-2xl hover:-translate-y-1"
        style={{ borderColor: kPrimary }}
      >
        <h3 className="text-3xl font-semibold text-gray-900 mb-3">
          I’m a Pet Parent
        </h3>

        <p className="text-gray-600 text-lg mb-10 max-w-md">
          Find trusted pet services, compare options, and book instantly.
        </p>

        <span
          className="text-lg font-semibold inline-flex items-center gap-2"
          style={{ color: kPrimary }}
        >
          Find pet services →
        </span>
      </button>

      {/* Pet Service Provider */}
      <button
        onClick={() => scrollToSection('partner-section')}
        className="group border-2 rounded-3xl p-12 text-left transition-all hover:shadow-2xl hover:-translate-y-1"
        style={{ borderColor: kPrimary }}
      >
        <h3 className="text-3xl font-semibold text-gray-900 mb-3">
          I’m a Pet Service Provider
        </h3>

        <p className="text-gray-600 text-lg mb-10 max-w-md">
          Join MyFellowPet and grow your business with verified pet parents.
        </p>

        <span
          className="text-lg font-semibold inline-flex items-center gap-2"
          style={{ color: kPrimary }}
        >
          Become a partner →
        </span>
      </button>

    </div>
  </div>
  </div>
</main>



<section
  id="pet-parent-steps"
  className="scroll-mt-32 py-0 px-4 md:px-12 bg-white text-center"
>

  {/* Heading */}
 <h2 className="text-4xl font-bold text-gray-900 mb-3">
  Book Pet Services in Just 4 Simple Steps
</h2>
<p className="text-gray-600 text-lg mb-16">
  From login to booking — everything happens seamlessly inside the MyFellowPet app.
</p>


  {/* Steps */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

    {/* Step 1 */}
    <div className="flex flex-col items-center text-center">
      <Image
        src="/assets/step1-login.png"
        alt="Login with OTP"
        width={180}
        height={360}
        className="rounded-2xl shadow-md mb-6"
      />
      <h3 className="font-semibold text-lg mb-2">Step 1</h3>
      <p className="text-gray-600">
        Open the <strong>MyFellowPet App</strong> and login instantly using{" "}
        <strong>OTP</strong>
      </p>
    </div>

    {/* Step 2 */}
    <div className="flex flex-col items-center text-center">
      <Image
        src="/assets/step2-browse.png"
        alt="Browse services"
        width={180}
        height={360}
        className="rounded-2xl shadow-md mb-6"
      />
      <h3 className="font-semibold text-lg mb-2">Step 2</h3>
      <p className="text-gray-600">
        <strong>Browse through all service providers</strong> available near you
      </p>
    </div>

    {/* Step 3 */}
    <div className="flex flex-col items-center text-center">
      <Image
        src="/assets/step3-details.png"
        alt="Read details"
        width={180}
        height={360}
        className="rounded-2xl shadow-md mb-6"
      />
      <h3 className="font-semibold text-lg mb-2">Step 3</h3>
      <p className="text-gray-600">
        <strong>Read complete details, reviews, and pricing</strong> — no more{" "}
        <strong>multiple calls</strong> or <strong>long enquiries</strong>
      </p>
    </div>

    {/* Step 4 */}
    <div className="flex flex-col items-center text-center">
      <Image
        src="/assets/step4-book.png"
        alt="Book service"
        width={180}
        height={360}
        className="rounded-2xl shadow-md mb-6"
      />
      <h3 className="font-semibold text-lg mb-2">Step 4</h3>
      <p className="text-gray-600">
        <strong>Select your pet</strong>, choose the <strong>date</strong> and
        add <strong>extra services</strong> if needed — and{" "}
        <strong>you’re done</strong>
      </p>
    </div>

  </div>


</section>

      {/* ================= BOARDING ================= */}
      <section className="py-10 px-4 md:px-12">
        <h2 className="text-4xl font-bold mt-10 mb-10">
  Search nearby <span style={{ color: kPrimary }}>boarding centers</span>
</h2>


        {loading && <p>Loading...</p>}

        {!loading && sortedCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cardsToDisplay.map((service) => (
              <ServiceCard
                key={service.service_id}
                service={service}
              />
            ))}
          </div>
        )}
      </section>

<section
  id="partner-section"
  className="py-28 px-4 md:px-12 bg-white text-center"
>

  {/* Heading */}
  <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
    Partner with MyFellowPet
  </h2>

  <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
    Join our network of trusted pet service providers and grow your business.
  </p>

  {/* Options */}
  {/* Options */}
<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">

  {/* Self Onboarding */}
  <a
    href="https://partner.myfellowpet.com/"
    target="_blank"
    className="group border rounded-2xl p-8 text-left transition hover:shadow-lg"
    style={{ borderColor: kPrimary }}
  >
  

    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Self onboarding
    </h3>

    <p className="text-gray-600">
      Complete your enrollment on your own and get started in just a few minutes.
    </p>

    <p className="mt-4 text-sm font-semibold" style={{ color: kPrimary }}>
      Start onboarding →
    </p>
  </a>

  {/* Need Help */}
  <a
    href={
      footerData?.whatsapp
        ? `https://wa.me/${footerData.whatsapp.replace(
            /[^0-9]/g,
            ''
          )}?text=${encodeURIComponent(
            footerData.whatsapp_message ||
              'I need help with partner onboarding'
          )}`
        : '#'
    }
    target="_blank"
    className="group border rounded-2xl p-8 text-left transition hover:shadow-lg"
    style={{ borderColor: kPrimary }}
  >
 

    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      I need help
    </h3>

    <p className="text-gray-600">
      Talk to our onboarding team and we’ll guide you through every step.
    </p>

    <p className="mt-4 text-sm font-semibold" style={{ color: kPrimary }}>
      Contact us →
    </p>
  </a>

  {/* Learn More */}
  <a
    href="https://www.myfellowpet.com/home-boarder-onboarding/overview"
    target="_blank"
    className="group border rounded-2xl p-8 text-left transition hover:shadow-lg"
    style={{ borderColor: kPrimary }}
  >
  

    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Learn before you begin
    </h3>

    <p className="text-gray-600">
      Explore how the MyFellowPet partner platform works before getting started.
    </p>

    <p className="mt-4 text-sm font-semibold" style={{ color: kPrimary }}>
      View overview →
    </p>
  </a>

</div>


  {/* Micro reassurance */}
  <p className="mt-10 text-xs text-gray-400">
    Onboarding takes less than 5 minutes
  </p>
</section>

{/* ================= BLOGS SECTION ================= */}
{blogs.length > 0 && (
  <section className="py-16 px-4 md:px-12 bg-white">
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Pet Care Blogs
        </h2>

        {/* Arrows */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              blogScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
            }
            className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() =>
              blogScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
            }
            className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Scroll Row */}
      <div
        ref={blogScrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
      >
        {blogs.map(blog => (
          <Link
            key={blog.slug}
            href={`/blogs/${blog.slug}`}
            className="min-w-[280px] max-w-[280px] bg-white rounded-2xl border
                       hover:shadow-xl transition overflow-hidden"
          >
          {/* Image */}
<div className="relative h-40 w-full">
  <Image
    src={blog.main_image}
    alt={blog.title}
    fill
    className="object-contain"
  />
</div>


            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {blog.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                By {blog.author?.name || 'MyFellowPet'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
)}






      <Footer />

      {/* ================= WHATSAPP BUTTON ================= */}
      {footerData?.whatsapp && (
        <a
          href={`https://wa.me/${footerData.whatsapp.replace(
            /[^0-9]/g,
            ''
          )}?text=${encodeURIComponent(
            footerData.whatsapp_message || ''
          )}`}
          target="_blank"
          className="fixed bottom-6 right-6"
        >
          <div className="bg-green-500 text-white p-3 rounded-full shadow-xl">
            <FaWhatsapp size={30} />
          </div>
        </a>
      )}
    </div>
  );
}


function StatItem({
  label,
  value,
  cities = [],
  isDecimal = false,
}: {
  label: string;
  value: number;
  cities?: string[];
  isDecimal?: boolean;
}) {
  const count = useCountUp(value);
  const [open, setOpen] = useState(false);

  return (
   <div
  className="relative flex flex-col items-center gap-2 px-8 py-6 rounded-2xl
             bg-white border border-gray-200 shadow-sm
             hover:shadow-xl hover:-translate-y-1
             transition-all duration-300 cursor-default"
>
   <div className="text-2xl font-semibold text-gray-900">
  {isDecimal ? count.toFixed(1) : `${count}+`}
</div>


      <p className="text-sm text-gray-500 font-medium">{label}</p>

      {label === 'Cities Covered' && cities.length > 0 && open && (
        <div className="absolute top-full mt-3 z-50 w-44 rounded-xl bg-white shadow-xl border">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
            Available in
          </div>
          <ul className="py-2 max-h-40 overflow-auto">
            {cities.map((city, i) => (
              <li
                key={i}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

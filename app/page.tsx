'use client';

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
  MdHome,
  MdContentCut,
  MdLocalHospital,
  MdShoppingBag,
  MdSchool,
  MdFavorite,
} from 'react-icons/md';

// Components & Hooks
import ServiceCard from './components/ServiceCard';
import Footer from './components/Footer';
import useBoardingServices from '../lib/useBoardingServices';

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

// ===================================================

export default function LandingPage() {
  const { cards: sortedCards, loading } = useBoardingServices();
  const [showAllBoardingCards, setShowAllBoardingCards] = useState(false);
  const [footerData, setFooterData] = useState<any>(null);

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

  return (
    <div
      className={`min-h-screen bg-white text-gray-800 relative ${poppins.className}`}
    >
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/myfellowpet_web_logo.jpg"
            alt="MyFellowPet"
            width={160}
            height={50}
            className="cursor-pointer"
          />
        </div>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="https://careers.myfellowpet.com/"
            target="_blank"
            className="h-10 flex items-center font-semibold text-gray-900 hover:text-gray-600"
          >
            Careers
          </Link>

          <Link
            href="https://partner.myfellowpet.com/"
            target="_blank"
            className="h-10 flex items-center font-semibold text-gray-900 hover:text-gray-600"
          >
            Partner with us
          </Link>

          <Link href={APP_STORE_URL} target="_blank">
            <Image
              src="/assets/AppStoreLogo.png"
              alt="App Store"
              width={110}
              height={32}
            />
          </Link>

          <Link href={PLAY_STORE_URL} target="_blank">
            <Image
              src="/assets/GooglePlayLogo.png"
              alt="Google Play"
              width={125}
              height={29}
            />
          </Link>

          <button className="text-gray-500 hover:text-gray-800">
            <FaUserCircle size={28} />
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="w-full py-0 flex flex-col-reverse md:flex-row items-center gap-24">
        <div className="flex-1 text-center md:text-left space-y-6 px-4 pl-12">
          <h1 className="text-3xl md:text-[2.6rem] font-semibold text-gray-900">
            All Pet Services.
            <br />
            One App. <span style={{ color: kPrimary }}>Across India.</span>
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed">
            India’s No.1 Pet Service Aggregator — trusted by thousands of pet
            parents.
          </p>

          <div className="mt-8 relative max-w-lg shadow-lg rounded-full flex items-center bg-white border p-2">
            <FaSearch className="ml-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for services..."
              className="flex-1 px-4 py-3 outline-none"
            />
            <button
              className="px-8 py-3 rounded-full text-white font-bold"
              style={{ backgroundColor: kAccent }}
            >
              Find Care
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-[380px] h-[380px] md:w-[480px] md:h-[480px]">
            <Image
              src="/assets/ProductionLogo.jpg"
              alt="Pet Map Location"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </main>

      {/* ================= SERVICES ================= */}
      <section className="py-10 px-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {services.map((service, index) => (
            <Link href={service.link} key={index}>
              <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center gap-3 hover:shadow-md">
                <service.icon size={32} style={{ color: kPrimary }} />
                <span className="font-semibold">{service.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= BOARDING ================= */}
      <section className="py-10 px-4 md:px-12">
        <h2 className="text-3xl font-bold mb-4">
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

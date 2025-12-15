'use client';

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google'; // Import Google Font
import { FaWhatsapp, FaUserCircle, FaSearch } from 'react-icons/fa';
import ServiceCard from './components/ServiceCard'; // Assuming ServiceCard is in app/components
// Add these imports to your existing icon imports at the top
import { FaInstagram, FaAngleDown, FaAngleUp, FaEnvelope } from 'react-icons/fa';
import { 
  MdHome, 
  MdContentCut, 
  MdLocalHospital, 
  MdShoppingBag, 
  MdSchool, 
  MdFavorite 
} from 'react-icons/md';
import useBoardingServices from '../lib/useBoardingServices';
import Footer from './components/Footer';

// NOTE: The state declaration should be inside the component or outside the export default function.
// Moving the state declaration inside a utility function or the component itself for correctness.
// For the purpose of providing the exact code structure requested, I'm keeping the original pattern,
// but be aware the `const [footerData, setFooterData] = useState<any>(null);` outside the component
// function is invalid React syntax and will cause an error in a real app. 

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'] 
});

const kPrimary = "#2CB4B6"; // Teal color
const kAccent = "#F67B0D";  // Orange accent

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.myfellowpet.app";
const APP_STORE_URL = "YOUR_APP_STORE_LINK"; // REPLACE THIS WITH YOUR APPLE LINK

const services = [
  { name: 'Boarding', icon: MdHome, link: '/services/boarding' },
  { name: 'Grooming', icon: MdContentCut, link: '/services/grooming' },
  { name: 'Vets', icon: MdLocalHospital, link: '/services/vet' },
  { name: 'Supplies', icon: MdShoppingBag, link: '/store' },
  { name: 'Training', icon: MdSchool, link: '/services/training' },
  { name: 'Farewell', icon: MdFavorite, link: '/services/farewell' },
];

export default function LandingPage() {
    
    // Fix: State and useEffect must be inside the component function
    const [footerData, setFooterData] = useState<any>(null);

    useEffect(() => {
        async function fetchFooterData() {
            try {
                const ref = doc(db, "company_documents", "footer");
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    setFooterData(snap.data());
                }
            } catch (err) {
                console.error("Error fetching WhatsApp data:", err);
            }
        }

        fetchFooterData();
    }, []);

    // --- DYNAMIC DATA AND STATE MANAGEMENT ---
    const { cards: sortedCards, loading } = useBoardingServices();
    const [showAllBoardingCards, setShowAllBoardingCards] = React.useState(false);
    
    // Dynamic Display Logic
    const hasMoreThanFive = sortedCards.length > 5;
    const cardsToDisplay = hasMoreThanFive && !showAllBoardingCards
        ? sortedCards.slice(0, 6) // Show first 5 cards if not showing all
        : sortedCards; // Show all cards

  return (
    <div className={`min-h-screen bg-white text-gray-800 relative ${poppins.className}`}>
      
      {/* ================= HEADER (Minimal Padding) ================= */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
             <Image 
                src="/assets/myfellowpet_web_logo.jpg" 
                alt="MyFellowPet" 
                width={160} 
                height={50}
                className="cursor-pointer"
             /> 
        </div>

       <div className="hidden md:flex gap-3 items-center">
{/* Careers Link */}
<Link
  href="https://careers.myfellowpet.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="h-10 flex items-center font-semibold text-gray-900 hover:text-gray-600 transition"
>
  Careers
</Link>

{/* Partner Link */}
<Link
  href="https://partner.myfellowpet.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="h-10 flex items-center font-semibold text-gray-900 hover:text-gray-600 transition"
>
  Partner with us
</Link>


  {/* App Store Badge */}
  <Link href={APP_STORE_URL} target="_blank" className="h-10 flex items-center">
    <Image 
      src="/assets/AppStoreLogo.png"
      alt="App Store"
      width={110}
      height={32}
    />
  </Link>

  {/* Google Play Badge */}
  <Link href={PLAY_STORE_URL} target="_blank" className="h-10 flex items-center">
    <Image 
      src="/assets/GooglePlayLogo.png"
      alt="Google Play"
      width={125}
      height={29}
    />
  </Link>

  {/* Profile Icon */}
  <button className="h-10 flex items-center text-gray-500 hover:text-gray-800 transition">
    <FaUserCircle size={28} />
  </button>

</div>

      </header>


      {/* ================= HERO SECTION (MAX EDGE) ================= */}
      {/* CRITICAL CHANGE: Removed max-w-* and mx-auto. Content now spans full width. */}
      <div className="px-0"> 
        <main className="w-full py-0 flex flex-col-reverse md:flex-row items-center gap-24">
          
          {/* Left: Text Content - Uses minimal internal padding to push text away from the absolute edge on small screens */}
          <div className="flex-1 text-center md:text-left space-y-6 px-4">
            <div className="flex-1 text-center md:text-left space-y-6 pl-12">
             <h1 className="text-3xl md:text-[2.6rem] font-semibold leading-snug text-gray-900">
  All Pet Services. <br />
  One App. <span style={{ color: kPrimary }}>Across India.</span>
</h1>

              
          <p className="text-gray-700 text-base md:text-lg max-w-full mx-auto md:mx-0 leading-relaxed">
  India’s No.1 Pet Service Aggregator — trusted by thousands of pet parents. 
  From grooming to boarding, food to healthcare, everything your pet needs is here.
</p>


              {/* Search Bar */}
              <div className="mt-8 relative max-w-lg mx-auto md:mx-0 shadow-lg rounded-full flex items-center bg-white border border-gray-100 p-2">
                  <FaSearch className="ml-4 text-gray-400" size={20} />
                  <input 
                      type="text" 
                      placeholder="Search for services..." 
                      className="flex-1 px-4 py-3 outline-none text-gray-700 bg-transparent"
                  />
                  <button 
                      className="px-8 py-3 rounded-full text-white font-bold transition hover:opacity-90"
                      style={{ backgroundColor: kAccent }}
                  >
                      Find Care
                  </button>
              </div>
          </div>
          </div>

          {/* Right: Hero Image - No padding */}
          <div className="flex-1 flex justify-center">
              <div className="relative w-[380px] h-[380px] md:w-[480px] md:h-[480px]">
                  <Image 
                      src="/assets/ProductionLogo.jpg" 
                      alt="Pet Map Location"
                      layout="fill"
                      objectFit="contain"
                      priority
                  />
              </div>
            </div>
        </main>
      </div>


      {/* ================= SERVICES GRID (MAX EDGE) ================= */}
      <section className="bg-white py-0">
        {/* CRITICAL CHANGE: Removed max-w-* and mx-auto. Now uses w-full px-2 for minimal gutter */}
        <div className="w-full px-2"> 
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {services.map((service, index) => (
                    <Link href={service.link} key={index} className="group">
                        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer border border-gray-100 group-hover:border-teal-100">
                            <service.icon 
                                size={32} 
                                style={{ color: kPrimary }} 
                                className="mb-1"
                            />
                            <span className="font-semibold text-base text-gray-700 group-hover:text-teal-600 text-center">
                                {service.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </section>
       <hr className="my-10 mx-auto w-11/12 border-gray-200" />
        
        {/* ================= DYNAMIC BOARDING CARDS SECTION ================= */}
        <section className="py-10 px-4 md:px-12 w-full">
            <div className="max-w-7xl mx-auto">
                
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Search nearby <span style={{ color: kPrimary }}>boarding centers</span> today!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Trusted care for your pets. Convenient, safe, and affordable.
                </p>

                {/* --- Loading State --- */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-teal-500 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600">Fetching nearby services...</p>
                    </div>
                )}
                
                {/* --- Empty State --- */}
                {!loading && sortedCards.length === 0 && (
                    <div className="text-center py-20 text-gray-600">
                        No boarding services found near your location.
                    </div>
                )}

                {/* --- Cards Grid --- */}
                {!loading && sortedCards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
                        
                        {cardsToDisplay.map((service, index) => {
                            // Show More button logic (at the 6th position)
                            if (index === 5 && hasMoreThanFive && !showAllBoardingCards) {
                                return (
                                    <div key="show-more-placeholder" className="w-full flex justify-center items-center">
                                        <button
                                            onClick={() => setShowAllBoardingCards(true)}
                                            className="w-full max-w-xs md:max-w-none h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 text-lg font-semibold"
                                            style={{ borderColor: kPrimary, color: kPrimary }}
                                        >
                                            <FaAngleDown size={24} className="mb-2" />
                                            Show {sortedCards.length - 5} More Boarding Centers
                                        </button>
                                    </div>
                                );
                            }
                            
                            return (
                                <ServiceCard 
                                    key={service.service_id} 
                                    service={service} 
                                />
                            );
                        })}
                    </div>
                )}
                
                {/* Show Less Button */}
                {showAllBoardingCards && hasMoreThanFive && (
                    <div className="w-full text-center mt-8">
                        <button
                            onClick={() => setShowAllBoardingCards(false)}
                            className="px-6 py-2 rounded-full font-semibold border transition-all duration-300 hover:opacity-90 flex items-center gap-2 mx-auto"
                            style={{ borderColor: kPrimary, color: kPrimary }}
                        >
                            <FaAngleUp size={20} />
                            Show Less
                        </button>
                    </div>
                )}
            </div>
        </section>

      
      <div className="mt-20"> 
  <Footer />
</div>


      

      {/* ================= WHATSAPP FLOATING BUTTON ================= */}
      {footerData?.whatsapp && (
  <a
    href={`https://wa.me/${footerData.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      footerData.whatsapp_message || ""
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 transition-transform hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <div className="bg-green-500 text-white p-3 rounded-full shadow-xl flex items-center justify-center w-14 h-14">
      <FaWhatsapp size={30} />
    </div>
  </a>
)}


    </div>
  );
}
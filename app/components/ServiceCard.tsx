// app/components/ServiceCard.tsx
import { buildShopSlug } from "@/lib/slug";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Import necessary types and icons
import { ServiceCardData } from '@/lib/useBoardingServices'; 
// ✅ CORRECTED: Import useRatingStats as a named export
import { useRatingStats } from '@/lib/useRatingStats';
import { FaHeart, FaCertificate, FaCheckCircle, FaStar, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
// Ensure Poppins is imported if you use it for styling
import { Poppins } from 'next/font/google'; 

// --- CONSTANTS ---
const kPrimary = "#2CB4B6";
const kAccent = "#F67B0D";

interface ServiceCardProps {
    service: ServiceCardData;
}

// --- HELPER COMPONENTS (Required definitions) ---

const getRunTypeStyle = (type: string) => {
    switch (type) {
        case 'Business Run': return { label: 'Business', color: '#4682B4' };
        case 'Home Run': return { label: 'Home Run', color: '#556B2F' };
        case 'Vet Run': return { label: 'Vet Run', color: '#BA68C8' };
        default: return { label: type || 'Standard', color: '#90A4AE' };
    }
};

const PetChip: React.FC<{ pet: string }> = ({ pet }) => (
    <div 
        className="px-2 py-1 text-xs font-semibold rounded-lg" 
        style={{ color: kPrimary, backgroundColor: 'rgba(44, 180, 182, 0.1)' }}
    >
        {pet}
    </div>
);

interface IconBadgeProps {
    icon: React.ElementType;
    color: string;
}

const IconBadge: React.FC<IconBadgeProps> = ({ icon: Icon, color }) => (
    <div 
        className="p-1 rounded-full border-2 border-white absolute -top-1 -right-1 shadow-sm"
        style={{ backgroundColor: color }}
    >
        <Icon size={14} className="text-white" />
    </div>
);

const truncateText = (text: string, limit: number): string => {
    if (text.length > limit) {
        return text.substring(0, limit) + '..';
    }
    return text;
};

// --- MAIN COMPONENT ---
const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    // Destructure properties safely
    const { 
        service_id, shopName, areaName, runType = '', shop_image, 
        pets = [], distance = 0, isOfferActive = false, isCertified = false, 
        isAdminApproved = false, min_price = 0
    } = service;

    // Fetch dynamic rating stats
    const { avg, count, loading } = useRatingStats(service_id);
    const roundedAvg = Math.round(avg);
    
    // Mock SEO Path - replace with your actual Next.js path logic
// SEO Dynamic Path
const country = "india"; // later you can make this dynamic
const serviceType = "boarding"; // also can be dynamic

const stateSlug = (service.state || "unknown").toLowerCase().replace(/\s+/g, "-");
const districtSlug = (service.district || "unknown").toLowerCase().replace(/\s+/g, "-");
const areaSlug = (areaName || "unknown").toLowerCase().replace(/\s+/g, "-");

// pet for slug generation
const pet = pets[0] || "pet";

// final slug: "paws-and-claws-dog-center"
const seoSlug = buildShopSlug(shopName, pet);

const seoPath = `/${country}/${serviceType}/${stateSlug}/${districtSlug}/${areaSlug}/${seoSlug}`;
    const runStyle = getRunTypeStyle(runType);
    
    return (
        <Link 
            href={seoPath} 
            passHref 
            legacyBehavior
            // ✅ NEW TAB FOR SEO/Marketing
            target="_blank" 
            rel="noopener noreferrer"
        >
            {/* The main card wrapper */}
            <div className="group w-[380px] cursor-pointer relative">
                <div 
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2" 
                    style={{ borderColor: 'rgba(0, 0, 0, 0.87)' }}
                >
                    <div className="p-3 flex">
                        {/* Left Side: Image */}
                        <div className="relative w-28 h-36 flex-shrink-0">
                            <Image 
                                src={shop_image} 
                                alt={shopName} 
                                width={112}
                                height={144}
                                style={{ objectFit: 'cover' }} 
                                className="rounded-lg"
                            />
                            {/* Run Type Banner */}
                            <div 
                                className="absolute bottom-0 left-0 right-0 h-5 text-center text-xs font-semibold text-white rounded-b-lg flex items-center justify-center"
                                style={{ backgroundColor: runStyle.color }}
                            >
                                {runStyle.label}
                            </div>
                            {/* Favorite Icon */}
                            <button className="absolute top-1 right-1 p-1 bg-white bg-opacity-80 rounded-full">
                                <FaHeart size={14} className="text-gray-500 hover:text-red-500" />
                            </button>
                        </div>

                        {/* Right Side: Details */}
                        <div className="flex-1 ml-4 flex flex-col justify-between h-36">
                            <div>
                                <h3 className="text-base font-bold text-gray-800 line-clamp-2">{shopName}</h3>
                                
                                {/* Dynamic Star Rating */}
                                <div className="flex items-center text-amber-400 text-sm my-1">
                                    {loading ? (
                                        <span className="text-xs text-gray-400">Loading rating...</span>
                                    ) : count > 0 ? (
                                        <>
                                            {/* Render the dynamic stars */}
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar 
                                                    key={i} 
                                                    size={12} 
                                                    className={i < roundedAvg ? 'text-amber-400' : 'text-gray-300'} 
                                                />
                                            ))}
                                            {/* Render the dynamic average and count */}
                                            <span className="ml-1 text-xs text-gray-500">{avg.toFixed(1)} ({count})</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-400">No ratings yet</span>
                                    )}
                                </div>
                                
                                {/* Price and Location Container */}
                                <div className="text-sm font-semibold text-gray-800">
                                    {/* Price Line */}
                                    <div className='flex items-center gap-1 my-1'>
                                        <FaTag size={12} className='text-teal-600' />
                                        <span>Starts from ₹{min_price.toFixed(0)}</span>
                                    </div>
                                    
                                    {/* LOCATION LINE: Truncated */}
                                    <div className='flex items-center gap-1'>
                                        <FaMapMarkerAlt size={12} className='text-gray-500' />
                                        
                                        <span className='whitespace-nowrap truncate'>
                                            {truncateText(areaName, 20)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Pet Chips and Distance */}
                            <div>
                                <div className="flex space-x-1.5 overflow-x-auto my-1">
                                    {pets.slice(0, 3).map(pet => <PetChip key={pet} pet={pet} />)}
                                </div>
                                <p className="text-xs text-gray-500">{distance.toFixed(1)} km away</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Offer Banner */}
                    {isOfferActive && (
                        <div 
                            className="w-full text-center py-1.5 text-white font-bold text-xs rounded-b-xl"
                            style={{ background: `linear-gradient(to right, ${kAccent}, #D96D0B)` }}
                        >
                            SPECIAL OFFER
                        </div>
                    )}
                </div>

                {/* Badges (Certified / Verified) */}
                {(isCertified || isAdminApproved) && (
                    <IconBadge 
                        icon={isCertified ? FaCertificate : FaCheckCircle}
                        color={isCertified ? kAccent : kPrimary}
                    />
                )}
            </div>
        </Link>
    );
};

export default ServiceCard;
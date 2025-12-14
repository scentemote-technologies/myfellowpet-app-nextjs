// @/app/[country]/[serviceType]/[state]/[district]/[area]/[slug]/page.tsx
// ✨ INTEGRATED COMPLEX DATA FROM FLUTTER/DART PAGE ✨

import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { getServiceBySlug } from "../../../../../../../lib/getServiceBySlug";
import { capitalize, formatPrice, getRatingStars } from "../../../../../../../lib/utils";

export const dynamic = "force-dynamic";

type GeoPoint = {
  latitude: number;
  longitude: number;
};

// --- Service Data Interface (Extended to match Dart file) ---
interface ServiceData {
  shop_name: string;
  description: string;
  shop_logo?: string;
  image_urls?: string[];
  pets?: string[];
  min_price?: string | number;
  state?: string;
  district?: string;
  district_slug?: string;
  area_name?: string;
  seo_slug: string;
  owner_phone?: string;
  street?: string;
  full_address?: string;
  postal_code?: string;
  location_geopoint?: GeoPoint;
  open_time?: string;
  close_time?: string;
  avg_rating: number;
  rating_count: number;
  isOfferActive?: boolean;
  refund_policy?: Record<string, number>;
  features?: string[];
  // Data structure to hold the pricing and pet details from the Dart file
  pet_pricing: PetPricingData[];
}

interface PetPricingData {
  petName: string; // e.g., 'dog'
  ratesDaily: Record<string, string>; // {Small: "500", Medium: "750"}
  offerRatesDaily: Record<string, string>;
  acceptedSizes: string[];
  acceptedBreeds: string[];
  // Assuming meal/walking rates are also fetched if needed
}

type ServicePageParams = {
  country: string;
  serviceType: string;
  state: string;
  district: string;
  area: string;
  slug: string;
};

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata(
  props: { params: ServicePageParams }
): Promise<Metadata> {
  const params = props.params;
  const slug = params.slug;

  if (!slug) {
    return { title: "Invalid Page" };
  }

  // Cast return type to the extended interface
  const service = (await getServiceBySlug(slug)) as ServiceData | null;

  if (!service) {
    return {
      title: "Service Not Found | MyFellowPet",
      description: "The service you're looking for does no longer exist.",
    };
  }

  const state = (service.state || "").toLowerCase().replace(/\s+/g, "-");
  const district =
    service.district_slug ??
    (service.district || "").toLowerCase().replace(/\s+/g, "-");
  const area = (service.area_name || "").toLowerCase().replace(/\s+/g, "-");

  const name = service.shop_name || "Pet Service";
  const desc = service.description || "Trusted pet service provider.";
  const img = service.shop_logo || service.image_urls?.[0] || "/default-og.png";
  const pet = service.pets?.[0] || "Pet";

  return {
    title: `${name} | ${pet} Boarding in ${service.area_name}`,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
      url: `https://myfellowpet.com/india/boarding/${state}/${district}/${area}/${slug}`,
      images: [{ url: img }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: desc,
      images: [img],
    },
  };
}

// ============================================================================
// CORE COMPONENTS
// ============================================================================

// Helper to display pricing table (Simplified version)
const PricingTable = ({
  pricingData,
  isOfferActive,
}: {
  pricingData: PetPricingData;
  isOfferActive?: boolean;
}) => {
  const sizes = ["Small", "Medium", "Large", "Giant"];
  const dailyRates = pricingData.ratesDaily;
  const offerRates = pricingData.offerRatesDaily;

  // Assuming only daily boarding rates for simplicity
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mt-6">
      <h3 className="p-3 text-lg font-bold bg-gray-50 border-b">
        Boarding Rates ({capitalize(pricingData.petName)})
      </h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pet Size
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price (Per Day)
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sizes.map((size) => {
            const standardPrice = parseInt(dailyRates[size] || "0");
            const offerPrice = parseInt(offerRates[size] || "0");
            const price = isOfferActive && offerPrice > 0 ? offerPrice : standardPrice;
            const isDiscounted = isOfferActive && offerPrice > 0 && offerPrice < standardPrice;

            return (
              <tr key={size}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {size}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {standardPrice > 0 ? (
                    isDiscounted ? (
                      <span className="flex items-center">
                        <span className="text-gray-500 line-through mr-2">
                          {formatPrice(standardPrice)}
                        </span>
                        <span className="text-green-600 font-semibold">
                          {formatPrice(price)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-900">
                        {formatPrice(price)}
                      </span>
                    )
                  ) : (
                    <span className="text-gray-400">NA</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}; // 

const PetVarieties = ({ pricingData }: { pricingData: PetPricingData }) => (
  <div className="mt-8">
    <h3 className="text-xl font-bold text-teal-600 mb-4">
      Accepted Pet Varieties ({capitalize(pricingData.petName)})
    </h3>
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Sizes Accepted:</h4>
        <div className="flex flex-wrap gap-2">
          {pricingData.acceptedSizes.map((size) => (
            <span
              key={size}
              className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-lg border border-teal-300"
            >
              {size}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Breeds Accepted:</h4>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
          {pricingData.acceptedBreeds.map((breed) => (
            <span
              key={breed}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-lg border border-yellow-300"
            >
              {capitalize(breed)}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
); // 

const FeaturesList = ({ features }: { features: string[] }) => (
  <div className="mt-8">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Service Features</h3>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <svg
            className="w-5 h-5 text-green-500 flex-shrink-0 mt-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-3 text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const policyMap = {
  'lt_4h': 'Less than 4 hours before start',
  'gt_4h': '4 – 12 hours before start',
  'gt_12h': '12 – 24 hours before start',
  'gt_24h': '24 – 48 hours before start',
  'gt_48h': 'More than 48 hours before start',
};

// Define the type for the specific keys in policyMap
type PolicyKey = keyof typeof policyMap;

const RefundPolicy = ({ policy }: { policy: Record<string, number> }) => {
  // Using the previously defined policyMap outside the component for reuse

  const sortedPolicy = Object.entries(policy)
    .sort((a, b) => {
      // Sort by refund rate descending (better for user visibility)
      return b[1] - a[1];
    })
    .map(([key, value]) => {
      let label: string = key;

      // ✅ FIX: Use a type guard to safely check and cast the key before indexing
      if (key in policyMap) {
        // TypeScript now trusts that 'key' is one of the PolicyKey literals
        label = policyMap[key as PolicyKey];
      }
      
      return {
        label: label,
        refund: value,
      };
    });

  return (
    <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd"></path></svg>
        Cancellation & Refund Policy
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {sortedPolicy.map(({ label, refund }, index) => (
          <li key={index} className="flex justify-between">
            <span className="font-medium">{label}:</span>
            <span className="font-bold text-red-600">
              {refund}% Refund
            </span>
          </li>
        ))}
        {sortedPolicy.length === 0 && (
          <li className="text-gray-500 italic">Policy not specified.</li>
        )}
      </ul>
    </div>
  );
};

// ============================================================================
// PAGE
// ============================================================================

export default async function ServicePage(props: {
  params: ServicePageParams;
}) {
  const params = props.params;
  const slug = params.slug;

  if (!slug) {
    return <div>Invalid service URL</div>;
  }

  const service = (await getServiceBySlug(slug)) as ServiceData | null;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Service not found
      </div>
    );
  }

  const {
    shop_name: name,
    description: desc,
    shop_logo: img,
    image_urls: gallery,
    pets,
    min_price: price,
    state,
    district,
    area_name: area,
    location_geopoint: location,
    open_time: openTime,
    close_time: closeTime,
    avg_rating: ratingValue,
    rating_count: reviewCount,
    isOfferActive,
    refund_policy: refundPolicy,
    features,
    pet_pricing: allPetPricing,
  } = service;

  // Derive slugs for Breadcrumb/Schema
  const stateSlug = state?.toLowerCase().replace(/\s+/g, "-");
  const districtSlug = service.district_slug;
  const areaSlug = area?.toLowerCase().replace(/\s+/g, "-");

  // Get pricing data for the first accepted pet (like the Flutter page)
  const defaultPetPricing = allPetPricing?.[0];

  return (
    <>
      {/* ========================================================= */}
      {/* ✅ STEP 1 — LocalBusiness Schema (UNCHANGED) */}
      {/* ========================================================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `https://myfellowpet.com/${service.seo_slug}`,
            name: name,
            description: desc,
            image: img || gallery?.[0],
            url: `https://myfellowpet.com/india/boarding/${stateSlug}/${districtSlug}/${areaSlug}/${service.seo_slug}`,
            telephone: service.owner_phone,
            priceRange: "₹₹",
            address: {
              "@type": "PostalAddress",
              streetAddress: service.street,
              addressLocality: area,
              addressRegion: state,
              postalCode: service.postal_code,
              addressCountry: "IN",
            },
            geo: location
              ? {
                  "@type": "GeoCoordinates",
                  latitude: location.latitude,
                  longitude: location.longitude,
                }
              : undefined,
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              opens: openTime,
              closes: closeTime,
            },
          }),
        }}
      />

      {/* ========================================================= */}
      {/* ✅ STEP 2 — FAQ Schema (UPDATED WITH NEW DATA) */}
      {/* ========================================================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What is the starting price at ${name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `The starting price at ${name} is ${formatPrice(
                    price
                  )} per day.`,
                },
              },
              {
                "@type": "Question",
                name: "What pets are accepted at this boarding center?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `This service accepts ${
                    pets?.join(", ") || "various pets"
                  }.`,
                },
              },
              {
                "@type": "Question",
                name: "What are the check-in and check-out timings?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Check-in starts at ${openTime} and check-out is by ${closeTime}.`,
                },
              },
              {
                "@type": "Question",
                name: "Where is this pet boarding service located?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${name} is located at ${service.full_address}.`,
                },
              },
              // ADDED Q from Dart logic:
              ...(features && features.length > 0
                ? [
                    {
                      "@type": "Question",
                      name: `What features does ${name} offer?`,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: `Key features include: ${features.join(", ")}.`,
                      },
                    },
                  ]
                : []),
            ],
          }),
        }}
      />

      {/* ========================================================= */}
      {/* ✅ STEP 3 — Breadcrumb Schema (UNCHANGED) */}
      {/* ========================================================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://myfellowpet.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Pet Boarding",
                item: "https://myfellowpet.com/india/boarding",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: state,
                item: `https://myfellowpet.com/india/boarding/${stateSlug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: district,
                item: `https://myfellowpet.com/india/boarding/${stateSlug}/${districtSlug}`,
              },
              {
                "@type": "ListItem",
                position: 5,
                name: area,
                item: `https://myfellowpet.com/india/boarding/${stateSlug}/${districtSlug}/${areaSlug}`,
              },
              {
                "@type": "ListItem",
                position: 6,
                name: name,
                item: `https://myfellowpet.com/india/boarding/${stateSlug}/${districtSlug}/${areaSlug}/${service.seo_slug}`,
              },
            ],
          }),
        }}
      />

      {/* ========================================================= */}
      {/* ✅ STEP 4 — AggregateRating Schema (STARS) */}
      {/* ========================================================= */}
      {ratingValue > 0 && reviewCount > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AggregateRating",
              itemReviewed: {
                "@type": "LocalBusiness",
                name: name,
                url: `https://myfellowpet.com/india/boarding/${stateSlug}/${districtSlug}/${areaSlug}/${service.seo_slug}`,
              },
              ratingValue: ratingValue.toFixed(1),
              reviewCount: reviewCount,
              bestRating: "5",
              worstRating: "1",
            }),
          }}
        />
      )}

      {/* ========================================================= */}
      {/* PAGE UI - INTEGRATED DATA */}
      {/* ========================================================= */}
      <main className="min-h-screen max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          {/* Header & Rating */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {area}, {district}, {state}, India
              </p>
            </div>
            {reviewCount > 0 && (
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold text-yellow-500">
                  {getRatingStars(ratingValue)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {ratingValue.toFixed(1)} average ({reviewCount} reviews)
                </p>
              </div>
            )}
          </div>
          {/* End Header */}

          {/* Image Gallery Grid (Simplified) */}
          <div className="grid grid-cols-3 gap-2 mt-4 h-64">
            {gallery?.slice(0, 3).map((url, index) => (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <Image
                  src={url}
                  alt={`${name} photo ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "25vw"}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
            {/* Fallback for single image or missing images */}
            {gallery?.length === 0 && img && (
                 <div className="relative col-span-3 row-span-2 rounded-xl overflow-hidden">
                    <Image
                        src={img}
                        alt={name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="100vw"
                    />
                 </div>
            )}
          </div>
          {/*  */}

          <div className="mt-8 space-y-8">
            {/* Description and Basic Info */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Overview & Timings
              </h2>
              <p className="text-gray-700 leading-relaxed">{desc}</p>
              
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mt-4 text-sm">
                <span className="font-semibold text-gray-600">
                  Starts From:
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(price)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd"></path></svg>
                  Open: {openTime}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd"></path></svg>
                  Close: {closeTime}
                </span>
              </div>
            </section>
            
            {/* Pricing Section (Uses data from the first pet pricing entry) */}
            {defaultPetPricing && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900">
                  Detailed Pricing
                </h2>
                <PricingTable
                  pricingData={defaultPetPricing}
                  isOfferActive={isOfferActive}
                />
              </section>
            )}

            {/* Accepted Breeds & Sizes Section */}
            {defaultPetPricing && (
              <section>
                <PetVarieties pricingData={defaultPetPricing} />
              </section>
            )}

            {/* Features Section */}
            {features && features.length > 0 && (
              <section>
                <FeaturesList features={features} />
              </section>
            )}

            {/* Refund Policy Section */}
            {refundPolicy && Object.keys(refundPolicy).length > 0 && (
              <section>
                <RefundPolicy policy={refundPolicy} />
              </section>
            )}

            {/* Full Address */}
            <section className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Full Address
                </h3>
                <p className="text-gray-700">{service.full_address}</p>
                {/*  */}
                {location && (
                    <div className="mt-4">
                        <Link 
                            href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`} 
                            target="_blank" 
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                        >
                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m.707 3.536l.707.707m.001 0L12 20.9l4.243-4.243m-1.414-12.728l-4.243 4.243m4.243-4.243l-4.243 4.243m0 0L8.757 7.05m-4.243 4.243l4.243-4.243m4.243 4.243l4.243-4.243m0 0L15.243 7.05m-4.243-4.243l4.243 4.243m-4.243-4.243L7.757 7.05m0 0L3.515 2.807m4.243 4.243l-4.243 4.243m4.243-4.243l-4.243 4.243m0 0L7.757 7.05M3.515 2.807l4.243 4.243M3.515 2.807L7.757 7.05m0 0L12 11.293l4.243-4.243m-4.243 4.243l4.243-4.243m0 0L15.243 7.05m-4.243-4.243l4.243 4.243m-4.243-4.243L7.757 7.05m0 0L3.515 2.807" /></svg>
                            View on Google Maps
                        </Link>
                    </div>
                )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
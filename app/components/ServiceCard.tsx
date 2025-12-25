// app/components/ServiceCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { FaStar, FaRegStar } from "react-icons/fa";
import {
  FaHeart,
  FaCertificate,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";

import { ServiceCardData } from "../../lib/useBoardingServices";
import { useRatingStats } from "../../lib/useRatingStats";

const kPrimary = "#2CB4B6";
const kAccent = "#F67B0D";

interface ServiceCardProps {
  service: ServiceCardData;
}

const getRunTypeStyle = (type: string) => {
  switch (type) {
    case "Business Run":
      return { label: "Business", color: "#4682B4" };
    case "Home Run":
      return { label: "Home Run", color: "#556B2F" };
    case "Vet Run":
      return { label: "Vet Run", color: "#BA68C8" };
    default:
      return { label: type || "Standard", color: "#90A4AE" };
  }
};

const PetChip: React.FC<{ pet: string }> = ({ pet }) => (
  <div
    className="px-2 py-1 text-xs font-semibold rounded-lg"
    style={{ color: kPrimary, backgroundColor: "rgba(44,180,182,0.1)" }}
  >
    {pet}
  </div>
);

const IconBadge: React.FC<{ icon: React.ElementType; color: string }> = ({
  icon: Icon,
  color,
}) => (
  <div
    className="p-1 rounded-full border-2 border-white absolute -top-1 -right-1 shadow-sm"
    style={{ backgroundColor: color }}
  >
    <Icon size={14} className="text-white" />
  </div>
);

const truncateText = (text: string, limit: number): string =>
  text.length > limit ? text.substring(0, limit) + ".." : text;

// ---------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  /**
   * 🔥 ALL FIELDS FROM FIRESTORE — DESTRUCTURED
   * (Even if not used yet, they are now available)
   */
  const {
    service_id,
    shop_name,
    shop_logo,
    area_name,
    district,
    state,
    type,
    pets = [],
    features = [],
    description,
    open_time,
    close_time,
    created_at,

    image_urls = [],
    other_branches = [],

    location_geopoint,
    shop_location,

    max_pets_allowed,
    max_pets_allowed_per_hour,

    isOfferActive,
    mfp_certified,
    isCertified,
    isAdminApproved,

    pre_calculated_offer_prices,
    pre_calculated_standard_prices,

    refund_policy,

    distance,
    min_price = 0,

    seo_slug,
    district_slug,
  } = service;

  // Ratings
  const { avg, count, loading } = useRatingStats(service_id);
  const roundedAvg = Math.round(avg);

  // ---------------------------------------------------------------
  // SEO PATH (UNCHANGED)
  // ---------------------------------------------------------------

  const country = "india";
  const serviceType = "boarding";

  const slugify = (str: string) =>
    str
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const stateSlug = slugify(state || "unknown");
  const districtSlug = district_slug || slugify(district || "unknown");
  const areaSlug = slugify(area_name || "unknown");

  // 🔥 ALWAYS USE FIRESTORE SEO SLUG
  const finalSlug = seo_slug || "unknown";

  const seoPath = `/${country}/${serviceType}/${stateSlug}/${districtSlug}/${areaSlug}/${finalSlug}`;

  const runStyle = getRunTypeStyle(type);

  return (
    <Link href={seoPath} target="_blank" rel="noopener noreferrer">
      <div className="group w-[380px] cursor-pointer relative">
        <div
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2"
          style={{ borderColor: "rgba(0,0,0,0.87)" }}
        >
          <div className="p-3 flex">
            {/* LEFT IMAGE */}
            <div className="relative w-28 h-36 flex-shrink-0">
              <Image
                src={shop_logo || "/default-shop.png"}
                alt={shop_name}
                width={112}
                height={144}
                className="rounded-lg object-cover"
              />

              {/* RUN TYPE */}
              <div
                className="absolute bottom-0 left-0 right-0 h-5 text-center text-xs font-semibold text-white rounded-b-lg flex items-center justify-center"
                style={{ backgroundColor: runStyle.color }}
              >
                {runStyle.label}
              </div>

              {/* HEART */}
              <button className="absolute top-1 right-1 p-1 bg-white bg-opacity-80 rounded-full">
                <FaHeart size={14} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex-1 ml-4 flex flex-col justify-between h-36">
              <div>
                <h3 className="text-base font-bold text-gray-800 line-clamp-2">
                  {shop_name}
                </h3>

                {/* RATING */}
                <div className="flex items-center text-amber-400 text-sm my-1">
                  {loading ? (
                    <span className="text-xs text-gray-400">
                      Loading rating...
                    </span>
                  ) : (
                    <>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) =>
                          count > 0 && i < roundedAvg ? (
                            <FaStar key={i} size={12} />
                          ) : (
                            <FaRegStar key={i} size={12} />
                          )
                        )}
                      </div>

                      {count > 0 && (
                        <span className="ml-1.5 text-xs text-gray-500 font-medium">
                          {avg.toFixed(1)} ({count})
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* PRICE + LOCATION */}
                <div className="text-sm font-semibold text-gray-800">
                  <div className="flex items-center gap-1 my-1">
                    <FaTag size={12} className="text-teal-600" />
                    <span>Starts from ₹{min_price.toFixed(0)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt size={12} className="text-gray-500" />
                    <span>{truncateText(area_name ?? "", 20)}</span>
                  </div>
                </div>
              </div>

              {/* PETS + DISTANCE */}
              <div>
                <div className="flex space-x-1.5 overflow-x-auto my-1">
                  {pets.slice(0, 3).map((pet) => (
                    <PetChip key={pet} pet={pet} />
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  {(distance ?? 0).toFixed(1)} km away
                </p>
              </div>
            </div>
          </div>

          {/* OFFER */}
          {isOfferActive && (
            <div
              className="w-full text-center py-1.5 text-white font-bold text-xs rounded-b-xl"
              style={{
                background: `linear-gradient(to right, ${kAccent}, #D96D0B)`,
              }}
            >
              SPECIAL OFFER
            </div>
          )}
        </div>

        {/* BADGES */}
        {(isCertified || isAdminApproved || mfp_certified) && (
          <IconBadge
            icon={isCertified || mfp_certified ? FaCertificate : FaCheckCircle}
            color={isCertified || mfp_certified ? kAccent : kPrimary}
          />
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;

import Image from "next/image";
import type { Metadata } from "next";
import { getServiceBySlug } from "../../../../../../../lib/getServiceBySlug";
import { getServiceWithPetInfo } from "../../../../../../../lib/getServiceWithPetInfo";

import Header from "../../../../../../components/Header";
import ImageGallery from "../../../../../../components/ImageGallery";
import Footer from "../../../../../../components/Footer";
import PetPricingTable from "../../../../../../components/PetPricingTable";
import PetFeedingDetails from "../../../../../../components/FeedingInfo";
import SectionNav from "../../../../../../components/SectionNav";

export const dynamic = "force-dynamic";

type ServicePageParams = {
  country: string;
  serviceType: string;
  state: string;
  district: string;
  area: string;
  slug: string;
};

type RefundPolicy = Record<string, string | number>;

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata(
  props: { params: Promise<ServicePageParams> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);

  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.shop_name} | Pet Boarding in ${service.area_name}`,
    description: service.description,
    openGraph: {
      images: [service.shop_logo || service.image_urls?.[0]],
    },
  };
}

// ============================================================================
// PAGE
// ============================================================================

export default async function ServicePage(
  props: { params: Promise<ServicePageParams> }
) {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  const servicePetInfo = await getServiceWithPetInfo(slug);

  if (!service) {
    return <div className="min-h-screen grid place-items-center">Not found</div>;
  }

  return (
    <>
      <Header />

      {/* ================= PAGE LAYOUT ================= */}
<div className="w-full flex">
        {/* ================= LEFT NAV ================= */}
        <SectionNav />

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1">
<div className="max-w-10xl mx-auto pl-6 pr-10">

          {/* ================= HERO ================= */}
          <section className="py-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ImageGallery
                images={
                  service.image_urls?.length
                    ? service.image_urls
                    : [service.shop_logo]
                }
                alt={service.shop_name}
              />

              <div>
                <h1 className="text-3xl font-bold">{service.shop_name}</h1>

                <p className="text-gray-600 mt-1">
                  {service.area_name}, {service.district}, {service.state}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <Badge text={service.type} />
                  {service.isOfferActive && (
                    <Badge text="Special Offer" accent />
                  )}
                  {service.mfp_certified && (
                    <Badge text="MFP Certified" accent />
                  )}
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </section>

          {/* ================= QUICK STATS ================= */}
          <section className="bg-gray-50 border-y">
            <div className="p-6 grid md:grid-cols-4 gap-4 text-sm">
              <Stat label="Timings" value={`${service.open_time} – ${service.close_time}`} />
              <Stat label="Pets Accepted" value={service.pets.join(", ")} />
              <Stat label="Max Pets / Day" value={service.max_pets_allowed} />
              <Stat
                label="Distance"
                value={
                  typeof service.distance === "number"
                    ? `${service.distance.toFixed(1)} km`
                    : "—"
                }
              />
            </div>
          </section>

          {/* ================= FEATURES ================= */}
          {service.features?.length > 0 && (
            <Section id="features" title="Why Pet Parents Love This Place">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {service.features.map((f: string) => (
                  <div
                    key={f}
                    className="p-4 rounded-xl bg-teal-50 text-teal-800 font-medium"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ================= PET PRICING ================= */}
          {service.pet_information && (
            <Section id="pet-details" title="Pet Pricing">
              <div className="max-w-4xl">
                <PetPricingTable petInformation={service.pet_information} />
              </div>
            </Section>
          )}

          {/* ================= FEEDING DETAILS ================= */}
          {service.pet_information && (
            <Section title="Feeding Information">
              <div className="max-w-4xl">
                <PetFeedingDetails petInformation={service.pet_information} />
              </div>
            </Section>
          )}

          {/* ================= REFUND POLICY ================= */}
          <Section id="refund-policy" title="Cancellation & Refund Policy">
            <div className="max-w-xl">
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">If cancelled:</span>
              </p>

              <div className="rounded-xl border divide-y bg-white">
                {Object.entries(service.refund_policy as RefundPolicy).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between px-4 py-3 text-sm"
                    >
                      <span>{formatRefundLabel(key)}</span>
                      <span className="font-semibold">{value}% refund</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </Section>
        </div>


        </div>
        
      </div>
                <Footer />

    </>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

const formatRefundLabel = (key: string) => {
  const map: Record<string, string> = {
    lt_4h: "Less than 4 hours before check-in",
    gt_4h: "More than 4 hours before check-in",
    gt_12h: "More than 12 hours before check-in",
    gt_24h: "More than 24 hours before check-in",
    gt_48h: "More than 48 hours before check-in",
  };
  return map[key] ?? key;
};

const Section = ({ id, title, children }: any) => (
  <section id={id} className="py-6 scroll-mt-24">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {children}
  </section>
);

const Stat = ({ label, value }: any) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const Badge = ({ text, accent }: any) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      accent ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
    }`}
  >
    {text}
  </span>
);

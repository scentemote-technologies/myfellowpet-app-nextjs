import { getServiceBySlug } from "@/lib/getServiceBySlug";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
  props: { params: Promise<ServicePageParams> }
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  if (!slug) {
    return { title: "Invalid Page" };
  }

  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | MyFellowPet",
      description: "The service you're looking for does not exist.",
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
// PAGE
// ============================================================================

export default async function ServicePage(
  props: { params: Promise<ServicePageParams> }
) {
  const params = await props.params;
  const slug = params.slug;

  if (!slug) {
    return <div>Invalid service URL</div>;
  }

  const service = await getServiceBySlug(slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Service not found
      </div>
    );
  }

  const name = service.shop_name || "Pet Service";
  const img = service.shop_logo || service.image_urls?.[0];
  const desc = service.description || "No description available.";
  const pets = service.pets || [];
  const price = service.min_price || "—";

  return (
    <>
      {/* ========================================================= */}
      {/* ✅ STEP 1 — LocalBusiness Schema */}
      {/* ========================================================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `https://myfellowpet.com/${service.seo_slug}`,
            name: service.shop_name,
            description: service.description,
            image: service.shop_logo || service.image_urls?.[0],
            url: `https://myfellowpet.com/india/boarding/${service.state
              ?.toLowerCase()
              .replace(/\s+/g, "-")}/${service.district_slug}/${service.area_name
              ?.toLowerCase()
              .replace(/\s+/g, "-")}/${service.seo_slug}`,
            telephone: service.owner_phone,
            priceRange: "₹₹",
            address: {
              "@type": "PostalAddress",
              streetAddress: service.street,
              addressLocality: service.area_name,
              addressRegion: service.state,
              postalCode: service.postal_code,
              addressCountry: "IN",
            },
            geo: service.location_geopoint
              ? {
                  "@type": "GeoCoordinates",
                  latitude: service.location_geopoint.latitude,
                  longitude: service.location_geopoint.longitude,
                }
              : undefined,
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              opens: service.open_time,
              closes: service.close_time,
            },
          }),
        }}
      />

      {/* ========================================================= */}
      {/* PAGE UI */}
      {/* ========================================================= */}
      <main className="min-h-screen max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">{name}</h1>

        <p className="text-gray-600 mt-2">
          {service.area_name}, {service.district}, {service.state}, India
        </p>

        {img && (
          <div className="relative w-full h-64 mt-4 rounded-xl overflow-hidden shadow-md">
            <Image src={img} alt={name} fill style={{ objectFit: "cover" }} />
          </div>
        )}

        <div className="mt-6 space-y-3">
          <p className="text-lg font-semibold">Starts from ₹{price}</p>

          <p className="text-gray-700">{desc}</p>

          <p className="text-sm text-gray-500 mt-2">
            Pets: {pets.length ? pets.join(", ") : "Not specified"}
          </p>
        </div>
      </main>
    </>
  );
}

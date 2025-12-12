import { getServiceBySlug } from "@/lib/getServiceBySlug";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// URL params type
type ServicePageParams = {
  country: string;
  serviceType: string;
  state: string;
  district: string;
  area: string;
  slug: string;
};

// -----------------------------------------------------------------------------
// METADATA
// -----------------------------------------------------------------------------

export async function generateMetadata(
  { params }: { params: ServicePageParams }
): Promise<Metadata> {

  // 🔥 FIX #1 — Handle Vercel's weird param name
  const slug = params.slug || (params as any).nxtPslug;

  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | MyFellowPet",
      description: "The service you're looking for does not exist.",
    };
  }

  // ALWAYS build slugs from database values
  const country = "india";
  const serviceType = "boarding";
  const state = (service.state || "").toLowerCase().replace(/\s+/g, "-");
  const district =
    service.district_slug ||
    (service.district || "").toLowerCase().replace(/\s+/g, "-");
  const area = (service.area_name || "").toLowerCase().replace(/\s+/g, "-");

  const name = service.shop_name || service.shopName || "Pet Service";
  const desc = service.description || "Trusted pet service provider.";
  const img = service.shop_logo || service.image_urls?.[0] || "/default-og.png";
  const pet = service.pets?.[0] || "Pet";

  const title = `${name} | ${pet} ${serviceType} in ${service.area_name}, ${service.district}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://myfellowpet.com/${country}/${serviceType}/${state}/${district}/${area}/${slug}`,
      type: "article",
      siteName: "MyFellowPet",
      images: [
        {
          url: img,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [img],
    },
  };
}

// -----------------------------------------------------------------------------
// PAGE
// -----------------------------------------------------------------------------

export default async function ServicePage(
  { params }: { params: ServicePageParams }
) {
  // 🔥 FIX #2 — Recover slug for Vercel
  const slug = params.slug || (params as any).nxtPslug;

  const service = await getServiceBySlug(slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Service not found
      </div>
    );
  }

  const country = "india";
  const serviceType = "boarding";

  const name = service.shop_name || service.shopName || "Pet Service";
  const img = service.shop_logo || service.image_urls?.[0];
  const desc = service.description || "No description available.";
  const pets = service.pets || [];
  const price = service.min_price || "—";

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{name}</h1>

      <p className="text-gray-600 mt-2">
        {service.area_name}, {service.district}, {service.state}, {country}
      </p>

      {img && (
        <div className="relative w-full h-64 mt-4 rounded-xl overflow-hidden shadow-md">
          <Image
            src={img}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
          />
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
  );
}

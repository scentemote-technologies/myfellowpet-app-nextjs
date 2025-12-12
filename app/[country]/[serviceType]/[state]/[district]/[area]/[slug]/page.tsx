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
// METADATA (FIXED)
// ============================================================================

export async function generateMetadata(
  props: { params: Promise<ServicePageParams> }
): Promise<Metadata> {

  const params = await props.params; // 🔥 FIX
  console.log("🧠 Metadata params =", params);

  const slug = params.slug;

  if (!slug) {
    console.error("❌ Metadata ERROR: Missing slug");
    return { title: "Invalid Page" };
  }

  const service = await getServiceBySlug(slug);
  console.log("🧠 Metadata service =", service);

  if (!service) {
    return {
      title: "Service Not Found | MyFellowPet",
      description: "The service you're looking for does not exist.",
    };
  }

  const country = "india";
  const serviceType = "boarding";

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
    title: `${name} | ${pet} ${serviceType} in ${service.area_name}`,
    description: desc,
    openGraph: {
      title: `${name} | ${pet} ${serviceType}`,
      description: desc,
      url: `https://myfellowpet.com/${country}/${serviceType}/${state}/${district}/${area}/${slug}`,
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
// PAGE (FIXED)
// ============================================================================

export default async function ServicePage(
  props: { params: Promise<ServicePageParams> }
) {

  const params = await props.params; // 🔥 FIX
  console.log("🔥 PAGE params =", params);

  const slug = params.slug;

  if (!slug) {
    console.error("❌ PAGE ERROR: Missing slug");
    return <div>Invalid service URL</div>;
  }

  const service = await getServiceBySlug(slug);
  console.log("🔥 Loaded service =", service);

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

  const country = "india";

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{name}</h1>

      <p className="text-gray-600 mt-2">
        {service.area_name}, {service.district}, {service.state}, {country}
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
  );
}

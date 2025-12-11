import { getServiceBySlug } from "@/lib/getServiceBySlug";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: {
    params: {
      country: string;
      serviceType: string;
      state: string;
      district: string;
      area: string;
      slug: string;
    };
  }
): Promise<Metadata> {

  const { slug, country, serviceType, state, district, area } = params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | MyFellowPet",
      description: "The service you're looking for does not exist.",
    };
  }

  const title = `${service.shop_name} | ${service.pets?.[0] || "Pet"} ${serviceType} in ${area}, ${district}`;
  const description = `Book ${service.pets?.[0] || "pet"} ${serviceType} at ${service.shop_name} in ${area}, ${district}. Starts from ₹${service.min_price || "N/A"}. Trusted and verified service provider.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://myfellowpet.com/${country}/${serviceType}/${state}/${district}/${area}/${slug}`,
      type: "article",
      siteName: "MyFellowPet",
      images: [
        {
          url: service.shop_image || "https://myfellowpet.com/default-og.png",
          width: 1200,
          height: 630,
          alt: service.shopName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [service.shop_image || "https://myfellowpet.com/default-og.png"],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: {
    country: string;
    serviceType: string;
    state: string;
    district: string;
    area: string;
    slug: string;
  };
}) {

  const { slug, country, serviceType, state, district, area } = params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Service not found
      </div>
    );
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{service.shopName}</h1>

      <p className="text-gray-600 mt-2">
        {area}, {district}, {state}, {country}
      </p>

      {service.shop_image && (
        <div className="relative w-full h-64 mt-4 rounded-xl overflow-hidden shadow-md">
          <Image
            src={service.shop_image}
            alt={service.shopName}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className="mt-6 space-y-3">
        <p className="text-lg font-semibold">
          Starts from ₹{service.min_price ?? "—"}
        </p>

        <p className="text-gray-700">
          {service.description ?? "No description added yet."}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Pets: {service.pets?.join(", ") ?? "Not specified"}
        </p>
      </div>

      <a
        href={`https://wa.me/919876543210?text=I'm interested in ${service.shopName}`}
        target="_blank"
        className="block w-full mt-6 py-3 bg-green-600 text-white text-center rounded-full font-bold"
      >
        Contact on WhatsApp
      </a>
    </main>
  );
}

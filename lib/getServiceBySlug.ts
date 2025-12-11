"use server";
import "server-only";
import { adminDB } from "./firebaseAdmin";
import { buildShopSlug } from "./slug";

export interface ServiceDoc {
  service_id: string;
  shopName: string;
  areaName?: string;
  state?: string;
  district?: string;
  country?: string;
  shop_image?: string;
  pets?: string[];
  min_price?: number;
  shop_location?: { latitude: number; longitude: number };
  description?: string;
  seo_slug?: string;
}

export async function getServiceBySlug(slug: string): Promise<ServiceDoc | null> {
  try {
    // 1️⃣ Try direct lookup by seo_slug
    const snap = await adminDB
      .collection("users-sp-boarding")
      .where("seo_slug", "==", slug)
      .limit(1)
      .get();

    if (!snap.empty) {
      const doc = snap.docs[0];
      return { service_id: doc.id, ...(doc.data() as any) };
    }

    console.warn("Fallback slug search triggered");

    // 2️⃣ Fallback: brute force match
    const allDocs = await adminDB.collection("users-sp-boarding").get();

    for (const doc of allDocs.docs) {
      const data = doc.data() as any;
      const shopName = data.shop_name || data.shopName || "";
      const primaryPet = data.pets?.[0] || "pet";
      const generatedSlug = buildShopSlug(shopName, primaryPet);

      if (generatedSlug === slug) {
        return { service_id: doc.id, ...data };
      }
    }

    return null;
  } catch (err) {
    console.error("Error in getServiceBySlug:", err);
    return null;
  }
}

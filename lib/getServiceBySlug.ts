"use server";

import { getAdminDB } from "@/lib/firebaseAdmin";
import { buildShopSlug } from "./slug";

export async function getServiceBySlug(slug: string) {
  const adminDB = await getAdminDB();
  if (!slug) {
  console.error("❌ ERROR: getServiceBySlug received empty slug");
  return null;
}

slug = slug.toLowerCase();


  // 1️⃣ Try direct Firestore seo_slug match
  const snap = await adminDB
    .collection("users-sp-boarding")
    .where("seo_slug", "==", slug)
    .limit(1)
    .get();

  console.log("🔥 DEBUG: Direct match docs =", snap.docs.length);  

  if (!snap.empty) {
    const doc = snap.docs[0];
    return { service_id: doc.id, ...(doc.data() as any) };
  }

  // 2️⃣ Fallback — match based on shopName → buildShopSlug()
  const allDocs = await adminDB.collection("users-sp-boarding").get();

  for (const doc of allDocs.docs) {
    const data = doc.data() as any;
    const shopName = data.shop_name || data.shopName || "";

    const generatedSlug = buildShopSlug(shopName);

    if (generatedSlug === slug) {
      return { service_id: doc.id, ...data };
    }
  }

  return null;
}

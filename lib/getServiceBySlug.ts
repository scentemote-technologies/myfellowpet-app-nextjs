"use server";

import { getAdminDB } from "./firebaseAdmin";
import { buildShopSlug } from "./slug";

export async function getServiceBySlug(slug: string) {
  try {
    const adminDB = await getAdminDB();
    if (!slug) {
      console.error("❌ getServiceBySlug: No slug provided");
      return null;
    }

    const cleanSlug = slug.toLowerCase().trim();
    console.log(`🔍 Searching Firestore for: [${cleanSlug}]`);

    let serviceDoc = null;

    // 1. Try direct Firestore seo_slug match
    const snap = await adminDB
      .collection("users-sp-boarding")
      .where("seo_slug", "==", cleanSlug)
      .limit(1)
      .get();

    if (!snap.empty) {
      serviceDoc = snap.docs[0];
      console.log("✅ Match found via seo_slug:", serviceDoc.id);
    } else {
      // 2. Fallback search (Brute force matching name)
      // NOTE: This can be slow if you have thousands of docs. 
      // Ensure 'shop_name' is indexed or use a dedicated slug field in DB.
      console.log("⚠️ No seo_slug match, checking all documents...");
      const allDocs = await adminDB.collection("users-sp-boarding").get();
      
      for (const doc of allDocs.docs) {
        const data = doc.data();
        const shopName = data.shop_name || data.shopName || "";
        if (buildShopSlug(shopName) === cleanSlug) {
          serviceDoc = doc;
          console.log("✅ Match found via name fallback:", doc.id);
          break;
        }
      }
    }

    if (!serviceDoc) {
      console.error("❌ No service found in Firestore for slug:", cleanSlug);
      return null;
    }

    const serviceId = serviceDoc.id;
    const mainData = serviceDoc.data();

    // 3. Fetch Subcollection 'pet_information'
    const petInfoSnap = await adminDB
      .collection("users-sp-boarding")
      .doc(serviceId)
      .collection("pet_information")
      .get();

    const pet_information = petInfoSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // 4. Fetch Reviews logic
    const reviewsSnap = await adminDB
      .collection("public_review")
      .doc("service_providers")
      .collection("sps")
      .doc(serviceId)
      .collection("reviews")
      .get();

    const ratings = reviewsSnap.docs
      .map((d) => (d.data().rating as number) || 0)
      .filter((r) => r > 0);

    const rating_count = ratings.length;
    const avg_rating = rating_count > 0 
      ? ratings.reduce((a, b) => a + b) / rating_count 
      : 0;

    // Merge into a plain serializable object for the Client Component
    return {
      ...mainData,
      service_id: serviceId,
      pet_information,
      rating_stats: { 
        avg: avg_rating, 
        count: rating_count 
      },
      // Ensure these exist so your Client Component hooks don't crash
      pets: mainData.pets || [],
      image_urls: mainData.image_urls || [],
    };

  } catch (error) {
    console.error("🔥 Firestore Admin Error:", error);
    return null;
  }
}
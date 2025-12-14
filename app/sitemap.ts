import { getAdminDB } from "../lib/firebaseAdmin";

export default async function sitemap() {
  const adminDB = await getAdminDB();

  const snap = await adminDB.collection("users-sp-boarding").get();

  const urls = snap.docs.map(doc => {
    const d = doc.data();

    const state = (d.state || "").toLowerCase().replace(/\s+/g, "-");
    const district =
      d.district_slug ||
      (d.district || "").toLowerCase().replace(/\s+/g, "-");
    const area = (d.area_name || "").toLowerCase().replace(/\s+/g, "-");
    const slug = d.seo_slug;

    return {
      url: `https://myfellowpet.com/india/boarding/${state}/${district}/${area}/${slug}`,
      lastModified: new Date(),
    };
  });

  return urls;
}

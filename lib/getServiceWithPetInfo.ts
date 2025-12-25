import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // adjust path if needed

export async function getServiceWithPetInfo(slug: string) {
  // 1️⃣ Fetch main service document
  const serviceRef = doc(db, "services", slug);
  const serviceSnap = await getDoc(serviceRef);

  if (!serviceSnap.exists()) return null;

  const serviceData = serviceSnap.data();

  // 2️⃣ Fetch pet_information subcollection
  const petInfoRef = collection(db, "services", slug, "pet_information");
  const petInfoSnap = await getDocs(petInfoRef);

  const pet_information: Record<string, any> = {};

  petInfoSnap.forEach((doc) => {
    pet_information[doc.id] = doc.data();
  });

  // 3️⃣ Return combined object
  return {
    ...serviceData,
    pet_information,
  };
}

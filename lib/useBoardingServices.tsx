// lib/useBoardingServices.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db, GeoPointLike } from "./firebase";
import { getDistance } from "geolib";

// -------------------------
// TYPES
// -------------------------
export interface ServiceCardData extends DocumentData {
  service_id: string;
  shopName: string;
  areaName: string;
  shop_image: string;
  pets: string[];
  distance: number;
  isOfferActive?: boolean;
  isCertified?: boolean;
  isAdminApproved?: boolean;
  min_price: number;
  shop_location?: GeoPointLike;
  other_branches?: string[];
  shop_name?: string;
  area_name?: string;
  seo_slug?: string;
  state?: string;
  district?: string;
  district_slug?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

// -------------------------
// HOOK
// -------------------------
const useBoardingServices = () => {
  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // -----------------------------------------------------
  // 1️⃣ GET USER LOCATION
  // -----------------------------------------------------
  useEffect(() => {
    // Default fallback (Bengaluru center)
    setUserLocation({ latitude: 12.9716, longitude: 77.5946 });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
        }
      );
    }
  }, []);

  // -----------------------------------------------------
  // 2️⃣ LIVE FIREBASE SUBSCRIPTION
  // -----------------------------------------------------
  useEffect(() => {
    const q = query(
      collection(db, "users-sp-boarding"),
      where("display", "==", true),
      limit(10)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allBranches: ServiceCardData[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const serviceId = doc.id;

          // -------------------------------
          // Extract min_price properly
          // -------------------------------
          const standardPricesMap =
            (data["pre_calculated_standard_prices"] as Record<
              string,
              Record<string, number>
            >) || {};

          const allPrices: number[] = [];

          Object.values(standardPricesMap).forEach((petTypeMap) => {
            allPrices.push(...(Object.values(petTypeMap) as number[]));
          });

          const minPrice =
            allPrices.length > 0 ? Math.min(...allPrices) : 0;

          return {
            ...(data as ServiceCardData),
            service_id: serviceId,
            shopName: data.shop_name || "Unknown Shop",
            areaName: data.area_name || "Unknown Area",
            shop_image:
              data.shop_logo || "/assets/pet_card_placeholder.jpg",
            min_price: minPrice,
          };
        });

        setServices(allBranches);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // -----------------------------------------------------
  // 3️⃣ PROCESS + GROUP + SORT BY DISTANCE
  // -----------------------------------------------------
  const finalCards = useMemo(() => {
    if (loading || !userLocation) return [];

    const grouped: Record<string, ServiceCardData[]> = {};

    services.forEach((branch) => {
      const shopName = branch.shopName;
      let distanceKm = Infinity;

      if (
        branch.shop_location &&
        typeof branch.shop_location.latitude === "number"
      ) {
        distanceKm =
          getDistance(userLocation, {
            latitude: branch.shop_location.latitude,
            longitude: branch.shop_location.longitude,
          }) / 1000;
      }

      branch.distance = distanceKm;

      (grouped[shopName] ??= []).push(branch);
    });

    // Pick closest branch, and attach other branches
    const finalList: ServiceCardData[] = [];

    Object.values(grouped).forEach((branches) => {
      branches.sort((a, b) => a.distance - b.distance);

      const closest = branches[0];
      const others = branches.slice(1).map((b) => b.service_id);

      finalList.push({
        ...closest,
        other_branches: others,
      });
    });

    finalList.sort((a, b) => a.distance - b.distance);

    return finalList;
  }, [services, userLocation, loading]);

  return { cards: finalCards, loading };
};

export default useBoardingServices;

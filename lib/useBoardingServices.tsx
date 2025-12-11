// lib/useBoardingServices.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, limit, onSnapshot, DocumentData } from 'firebase/firestore';
// In your custom hooks:
import { db, GeoPointLike } from './firebase'; // Import only what is needed
import { getDistance } from 'geolib';

// 1. Define the TypeScript interface for your service card data
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
    pre_calculated_standard_prices?: Record<string, Record<string, number>>;
}

interface UserLocation {
    latitude: number;
    longitude: number;
}

const useBoardingServices = () => {
    const [services, setServices] = useState<ServiceCardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null); 

    // --- 1. Fetch User Location (Client-side effect) ---
    useEffect(() => {
        // Mock Location for demonstration in development (Bengaluru center):
        setUserLocation({ latitude: 12.9716, longitude: 77.5946 }); 
        
        // LOG 1: Check initial location state (will likely show null on first render)
        console.log("DEBUG 1: Initial userLocation state:", userLocation);

        if (navigator.geolocation) {
             // LOG 2: Track if real geolocation is attempted
             console.log("DEBUG 2: Attempting to get real Geolocation...");
             
             navigator.geolocation.getCurrentPosition(
                 (pos) => {
                     const realLocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                     setUserLocation(realLocation);
                     // LOG 3: Track successful real geolocation
                     console.log("DEBUG 3: Real Geolocation SUCCESS:", realLocation);
                 },
                 (err) => {
                     console.error("DEBUG 3: GeoLocation Error:", err.message);
                 }
             );
        } else {
             console.log("DEBUG 2: Browser does not support Geolocation API.");
        }
    }, []); // Empty dependency array means this runs only on mount
    
    // --- 2. Live Firestore Subscription ---
    useEffect(() => {
        const q = query(
            collection(db, 'users-sp-boarding'),
            where('display', '==', true),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
             // LOG 4: Check raw data fetch result
             console.log(`DEBUG 4: Firestore Snapshot Received. Docs found: ${snapshot.docs.length}`);

            const allBranches: ServiceCardData[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                const serviceId = doc.id;
                
                // ... (Price Calculation logic) ...

                const standardPricesMap = data['pre_calculated_standard_prices'] || {};
                const allPrices: number[] = [];
                Object.values(standardPricesMap).forEach((petPriceMap) => {
                    if (petPriceMap && typeof petPriceMap === 'object') {
                        allPrices.push(...Object.values(petPriceMap) as number[]);
                    }
                });
                const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
                
                return {
                    ...(data as ServiceCardData),
                    service_id: serviceId,
                    shopName: data.shop_name || 'Unknown Shop',
                    areaName: data.area_name || 'Unknown Area',
                    shop_image: data.shop_logo || '/assets/pet_card_placeholder.jpg',
                    min_price: minPrice,
                } as ServiceCardData;
            });
            
            setServices(allBranches);
            setLoading(false);
            
            // LOG 5: Confirm data is loaded and loading state is set to false
            console.log(`DEBUG 5: Data loaded. Services array size set to ${allBranches.length}. Loading=false.`);
            
        }, (error) => {
            // LOG 6: Catch any Firebase read/connection errors
            console.error("DEBUG 6: FATAL Firestore stream failed:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // --- 3. Group, Calculate Distance, and Sort (Memoized) ---
    const finalCards = useMemo(() => {
        
        // LOG 7: Check if memoized function runs and if dependencies are ready
        console.log(`DEBUG 7: Processing Memo. Ready: ${!loading && !!userLocation}. Services count: ${services.length}`);
        
        if (loading || !userLocation) {
            return [];
        }

        const groupedByShopName: Record<string, ServiceCardData[]> = {};
        services.forEach(branch => {
            const shopName = branch.shopName;
            let distanceKm = Infinity;
            
            // Calculate distance
            if (branch.shop_location && typeof branch.shop_location.latitude === 'number') {
                distanceKm = getDistance(
                    userLocation,
                    { latitude: branch.shop_location.latitude, longitude: branch.shop_location.longitude }
                ) / 1000; // to km
            } else {
                 // LOG 8: Check if a card is missing location data
                 console.log(`DEBUG 8: Branch "${shopName}" missing location data.`);
            }
            branch.distance = distanceKm;
            
            (groupedByShopName[shopName] ??= []).push(branch);
        });

        const finalCardList: ServiceCardData[] = [];
        Object.values(groupedByShopName).forEach(branches => {
            branches.sort((a, b) => a.distance - b.distance);
            const closestBranch = branches[0];
            
            const otherBranchIds = branches
                .slice(1) 
                .map(b => b.service_id);

            finalCardList.push({
                ...closestBranch,
                other_branches: otherBranchIds, 
            });
        });

        finalCardList.sort((a, b) => a.distance - b.distance);
        
        // LOG 9: Final result check
        console.log(`DEBUG 9: FINAL RESULT. Total Cards: ${finalCardList.length}`);
        if (finalCardList.length > 0) {
            console.log("DEBUG 9: Closest Card Name:", finalCardList[0].shopName);
            console.log("DEBUG 9: Closest Card Distance:", finalCardList[0].distance.toFixed(2) + ' km');
        }


        return finalCardList;
    }, [services, userLocation, loading]);


    return { cards: finalCards, loading };
};

export default useBoardingServices;
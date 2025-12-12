// lib/useRatingStats.tsx (Modified)
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
// In your custom hooks:
import { db, GeoPointLike } from './firebase'; // Import only what is needed
export interface RatingStats { // Keep this as a named export
    avg: number;
    count: number;
    loading: boolean;
}

// Change from 'const useRatingStats = ...' + 'export default useRatingStats' 
// to a direct 'export function'
export function useRatingStats(serviceId: string): RatingStats {
    // You must keep the React hook rules: useState/useEffect inside the function body

    const [stats, setStats] = useState<Omit<RatingStats, 'loading'>>({ avg: 0.0, count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!serviceId) {
            setLoading(false);
            return;
        }

        const fetchRatingStats = async () => {
            setLoading(true);
            try {
                // 1. Construct the complex collection path matching your Flutter code:
                const reviewsRef = collection(
                    db,
                    'public_review',
                    'service_providers',
                    'sps',
                    serviceId,
                    'reviews'
                );

                const snapshot = await getDocs(reviewsRef);
                
                let ratingsSum = 0;
                let validCount = 0;

                snapshot.docs.forEach((d) => {
                    const data = d.data() as DocumentData;
                    const rating = data.rating as number | undefined;

                    if (rating && rating > 0) {
                        ratingsSum += rating;
                        validCount += 1;
                    }
                });
                
                const avg = validCount > 0 ? ratingsSum / validCount : 0.0;
                
                setStats({
                    avg: Math.max(0.0, Math.min(5.0, avg)), // Clamp between 0 and 5
                    count: validCount,
                });

            } catch (error) {
                console.error(`Error fetching rating for ${serviceId}:`, error);
                setStats({ avg: 0.0, count: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchRatingStats();
    }, [serviceId]);

    return { ...stats, loading };
}
// Remove the 'export default useRatingStats;' line
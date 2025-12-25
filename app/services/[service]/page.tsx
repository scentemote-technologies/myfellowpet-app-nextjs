'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Import your custom hook that handles distance and pricing logic
import useBoardingServices from '../../../lib/useBoardingServices';
import ServiceCard from '../../components/ServiceCard';

interface PageProps {
  params: Promise<{ service: string }>;
}

export default function ServiceListingPage({ params }: PageProps) {
  // 1. Unwrap the async params (Next.js 15 requirement)
  const resolvedParams = React.use(params);
  const serviceSlug = resolvedParams.service; 
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 2. Get the city from the URL query (?city=...)
  const city = searchParams.get('city');

  // 3. REUSE YOUR CUSTOM HOOK 
  // This hook handles city variations (Bangalore vs Bengaluru), 
  // geolocation, and distance sorting automatically.
  const { cards: results, loading } = useBoardingServices(city);

  // 4. Guard: Ensure this page only handles 'boarding'
  const isBoarding = serviceSlug === 'boarding';

  // If the user navigates to /services/grooming on this page, show a fallback
  if (!isBoarding) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <h2 className="text-2xl font-bold">This section is for Boarding only.</h2>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 text-orange-500 font-semibold hover:underline"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-white">
      {/* HEADER SECTION */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Pet Boarding in <span className="text-cyan-600 capitalize">{city || 'your area'}</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          {loading 
            ? 'Searching for trusted partners...' 
            : `Found ${results.length} verified boarding centers near you`}
        </p>
      </header>

      {/* CONTENT SECTION */}
      {loading ? (
        /* Skeleton Loading State */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="h-80 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" 
            />
          ))}
        </div>
      ) : results.length > 0 ? (
        /* Results Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((item) => (
            <ServiceCard key={item.service_id} service={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-gray-100 rounded-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-semibold">No boarding centers found in {city}</p>
          <p className="text-gray-400 mt-2">Try searching for a different city or check back later.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-full font-medium hover:bg-cyan-700 transition"
          >
            Search Another City
          </button>
        </div>
      )}
    </div>
  );
}
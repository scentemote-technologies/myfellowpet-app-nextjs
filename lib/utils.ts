// @/lib/utils.ts

/**
 * Capitalizes the first letter of a string.
 * @param str The input string.
 * @returns The capitalized string.
 */
export function capitalize(str?: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a price (number or string) into the Indian Rupee format (₹).
 * @param price The price value.
 * @returns Formatted price string (e.g., "₹500").
 */
export function formatPrice(price?: string | number): string {
  if (price === undefined || price === null) return '₹—';
  const num = typeof price === 'string' ? parseInt(price) : price;
  if (isNaN(num) || num <= 0) return '₹—';

  // Basic Indian Rupee formatting (no locale required for simple display)
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Generates a string of star emojis based on a rating value.
 * @param rating The rating value (0 to 5).
 * @returns A string of filled and empty stars.
 */
export function getRatingStars(rating?: number): string {
  if (rating === undefined || rating === null) return '';
  const rounded = Math.round(rating * 2) / 2; // Round to nearest 0.5
  let stars = '';

  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) {
      stars += '⭐'; // Filled star
    } else if (rounded >= i - 0.5) {
      stars += '★'; // Half star (using a different symbol as emoji half-star varies)
    } else {
      stars += '☆'; // Empty star (using a different symbol as emoji empty-star varies)
    }
  }
  return stars;
}
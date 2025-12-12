// lib/slug.ts

/**
 * Convert any string into a clean SEO-safe slug.
 * Example: "Paws & Claws!!" → "paws-and-claws"
 */
export const slugify = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")            // Replace &
    .replace(/['"`]/g, "")          // Remove quotes & ticks
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^a-z0-9-]/g, "")     // Remove non-alphanumeric (keep dashes)
    .replace(/-+/g, "-")            // Remove repeated dashes
    .replace(/^-|-$/g, "");         // Trim dash at start/end
};

/**
 * Build your service SEO slug:
 * shopName: "Paws & Claws"
 * pet: "Dog"
 * → "paws-and-claws-dog-center"
 */
export function buildShopSlug(shopName: string) {
  return shopName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


/**
 * OPTIONAL: Reverse a slug back into components
 * ("paws-and-claws-dog-center" → { shop: "...", pet: "..." })
 * exported for convenience but not required by ServiceCard
 */
export const decodeSlug = (slug: string) => {
  if (!slug) return null;
  const parts = slug.split("-");
  if (parts.length < 3) return null;
  const pet = parts[parts.length - 2];
  const shop = parts.slice(0, parts.length - 2).join(" ");
  return { shop, pet };
};

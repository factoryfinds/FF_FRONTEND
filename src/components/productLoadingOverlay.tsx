// components/skeletons/ProductSkeleton.tsx
// Pure Tailwind, no external UI libraries required
// Reusable skeletons for product cards + grid

// NOTE: No hooks used, so no "use client" needed.

export type ProductSkeletonCardProps = {
  className?: string;
};

export function ProductSkeletonCard({ className = "" }: ProductSkeletonCardProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="aspect-[4/5] bg-gray-200 rounded-sm mb-3" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  );
}

export type ProductSkeletonGridProps = {
  /** Number of skeleton cards to render */
  count?: number;
  /** Extra classes for the grid wrapper */
  className?: string;
};

export default function ProductSkeletonGrid({ count = 8, className = "" }: ProductSkeletonGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeletonCard key={i} />
      ))}
    </div>
  );
}

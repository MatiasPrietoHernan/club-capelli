export function ProductPageSkeleton() {
  return (
    <div className="max-w-md mx-auto bg-white">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 animate-pulse" />

      {/* Product Info Skeleton */}
      <div className="p-4 space-y-4">
        {/* Category Badge Skeleton */}
        <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />

        {/* Product Name Skeleton */}
        <div className="space-y-2">
          <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          ))}
          <div className="w-8 h-4 bg-gray-200 rounded animate-pulse ml-1" />
        </div>

        {/* Description Section Skeleton */}
        <div className="space-y-2">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-1">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Stock Info Skeleton */}
        <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />

        {/* Add to Cart Button Skeleton */}
        <div className="w-full h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

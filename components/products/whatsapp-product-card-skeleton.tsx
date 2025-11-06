export function WhatsAppProductCardSkeleton() {
  return (
    <div className="product-message w-full flex flex-col animate-pulse">
      <div className="relative overflow-hidden rounded-t-lg bg-gray-200 h-32 sm:h-40 md:h-44 lg:h-48">
        {/* Skeleton image */}
        <div className="w-full h-full bg-gray-300"></div>
      </div>

      <div className="p-3 md:p-4 flex-1 flex flex-col">
        {/* Category badge skeleton */}
        <div className="mb-2">
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>

        {/* Product name skeleton */}
        <div className="mb-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Description skeleton */}
        <div className="mb-3">
          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Stars skeleton */}
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded ml-2"></div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-8 bg-gray-200 rounded w-full mt-auto"></div>
      </div>
    </div>
  )
}

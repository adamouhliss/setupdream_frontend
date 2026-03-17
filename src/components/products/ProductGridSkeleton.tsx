const ProductGridSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700/50 animate-pulse"
                >
                    {/* Image Placeholder */}
                    <div className="aspect-[4/5] bg-gray-700/50 w-full relative">
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-600/50"></div>
                    </div>

                    {/* Content Placeholder */}
                    <div className="p-5 space-y-3">
                        {/* Category */}
                        <div className="h-3 bg-gray-700 rounded w-1/3"></div>

                        {/* Title */}
                        <div className="h-5 bg-gray-600 rounded w-3/4"></div>

                        {/* Price */}
                        <div className="h-6 bg-gray-700 rounded w-1/4 mt-2"></div>

                        {/* Button */}
                        <div className="h-10 bg-gray-700 rounded-xl w-full mt-4"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductGridSkeleton


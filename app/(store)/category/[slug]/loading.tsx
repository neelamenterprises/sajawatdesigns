import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header skeleton */}
            <div className="mb-8">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="mt-2 h-5 w-80" />
            </div>

            <div className="flex gap-8">
                {/* Desktop filter skeleton */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="rounded-xl border border-border/50 bg-card p-5">
                        <Skeleton className="mb-4 h-4 w-16" />
                        <Skeleton className="mb-3 h-8 w-full" />
                        <Skeleton className="mb-3 h-8 w-full" />
                        <Skeleton className="mb-3 h-8 w-full" />
                    </div>
                </aside>

                {/* Grid skeleton */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-9 w-[180px]" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

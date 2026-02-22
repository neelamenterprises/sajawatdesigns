import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
            {/* Image skeleton */}
            <Skeleton className="aspect-square w-full" />

            {/* Content skeleton */}
            <div className="p-4">
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-3 h-3 w-2/3" />
                <div className="mb-3 flex items-baseline gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-14" />
                </div>
                <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </div>
        </div>
    );
}

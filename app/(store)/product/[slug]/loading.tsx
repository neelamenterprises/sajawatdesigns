import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb skeleton */}
            <Skeleton className="mb-6 h-4 w-64" />

            <div className="grid gap-10 lg:grid-cols-2">
                {/* Image skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <div className="flex gap-3">
                        <Skeleton className="h-20 w-20 rounded-lg" />
                        <Skeleton className="h-20 w-20 rounded-lg" />
                        <Skeleton className="h-20 w-20 rounded-lg" />
                    </div>
                </div>

                {/* Info skeleton */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="mt-4 h-px w-full" />
                    <div className="flex items-baseline gap-3">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-12 w-40 rounded-xl" />
                        <Skeleton className="h-12 w-40 rounded-xl" />
                    </div>
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    );
}

import { Metadata } from "next";
import { searchProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { SortBar } from "@/components/products/SortBar";
import { Search } from "lucide-react";
import { SortOption } from "@/lib/types";
import { Suspense } from "react";

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
    title: "Search Jewellery",
    description: "Search across all jewellery collections at Sajawat Designs",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const sp = await searchParams;
    const query = typeof sp.q === "string" ? sp.q : "";

    const filters = {
        minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
        maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
        platforms: sp.platforms
            ? (String(sp.platforms).split(",") as ("amazon" | "flipkart" | "meesho")[])
            : undefined,
        sort: (sp.sort as SortOption) || "newest",
    };

    const { products, total } = query
        ? await searchProducts(query, filters)
        : { products: [], total: 0 };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                {query ? (
                    <>
                        <h1 className="font-serif text-3xl font-semibold tracking-tight italic">
                            Results for &ldquo;{query}&rdquo;
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {total} piece{total !== 1 ? "s" : ""} found
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="font-serif text-3xl font-semibold tracking-tight italic">
                            Search Jewellery
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Use the search bar above to find your perfect piece
                        </p>
                    </>
                )}
            </div>

            {query ? (
                <div className="flex gap-8">
                    <Suspense fallback={null}>
                        <FilterSidebar maxPriceLimit={200000} />
                    </Suspense>
                    <div className="flex-1">
                        <div className="mb-6">
                            <Suspense fallback={null}>
                                <SortBar totalProducts={total} />
                            </Suspense>
                        </div>
                        <ProductGrid products={products} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#fdf8f3] border border-border/30">
                        <Search className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h2 className="mb-2 font-serif text-xl font-semibold italic">Start Exploring</h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Search for rings, earrings, necklaces, bracelets &amp; more across
                        Amazon, Flipkart, and Meesho.
                    </p>
                </div>
            )}
        </div>
    );
}

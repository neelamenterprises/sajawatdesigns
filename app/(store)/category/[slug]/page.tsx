import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, getProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { SortBar } from "@/components/products/SortBar";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { SortOption } from "@/lib/types";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: "Category Not Found" };
    return {
        title: category.name,
        description: category.description || `Browse ${category.name} products at Neelam Enterprises`,
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const sp = await searchParams;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const filters = {
        categorySlug: slug,
        minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
        maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
        platforms: sp.platforms
            ? (String(sp.platforms).split(",") as ("amazon" | "flipkart" | "meesho")[])
            : undefined,
        sort: (sp.sort as SortOption) || "newest",
        page: sp.page ? Number(sp.page) : 1,
    };

    const { products, total } = await getProducts(filters);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Category Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-semibold tracking-tight italic">{category.name}</h1>
                {category.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                )}
            </div>

            <div className="flex gap-8">
                {/* Filter Sidebar */}
                <Suspense fallback={null}>
                    <FilterSidebar maxPriceLimit={200000} />
                </Suspense>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Sort Bar */}
                    <div className="mb-6">
                        <Suspense fallback={null}>
                            <SortBar totalProducts={total} />
                        </Suspense>
                    </div>

                    {/* Product Grid */}
                    <ProductGrid products={products} />

                    {/* Pagination */}
                    {total > 12 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map(
                                (page) => (
                                    <a
                                        key={page}
                                        href={`?${new URLSearchParams({
                                            ...Object.fromEntries(
                                                Object.entries(sp).filter(([, v]) => v !== undefined) as [string, string][]
                                            ),
                                            page: String(page),
                                        }).toString()}`}
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === filters.page
                                            ? "bg-primary text-primary-foreground"
                                            : "border border-border hover:bg-secondary"
                                            }`}
                                    >
                                        {page}
                                    </a>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

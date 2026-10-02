import { Metadata } from "next";
import { getCategoriesWithProductCount } from "@/lib/queries";
import { CategoryCard } from "@/components/ui/CategoryCard";

export const metadata: Metadata = {
    title: "All Collections",
    description: "Explore our complete range of exquisite jewellery collections, from rings and earrings to necklaces and bracelets.",
};

export default async function CollectionsPage() {
    const categoriesWithCount = await getCategoriesWithProductCount();

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h1 className="font-serif text-3xl font-semibold tracking-tight italic sm:text-4xl">
                    All Collections
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Explore our complete range of curated jewellery categories.
                </p>
            </div>

            {categoriesWithCount.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoriesWithCount.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            productCount={category.productCount}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground">No collections found.</p>
                </div>
            )}
        </div>
    );
}

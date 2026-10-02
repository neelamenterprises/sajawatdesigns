import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PopularSearches } from "@/components/layout/PopularSearches";
import { WishlistProvider } from "@/components/store/WishlistProvider";
import { getCategoriesWithProductCount } from "@/lib/queries";

export default async function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const categoriesWithCount = await getCategoriesWithProductCount();
    // Only show top 5 collections in the navbar dropdown
    const topCategories = categoriesWithCount.slice(0, 5).map(c => ({
        name: c.name,
        slug: c.slug
    }));

    return (
        <WishlistProvider>
            <Navbar categories={topCategories} />
            <main className="min-h-[calc(100vh-8rem)]">{children}</main>
            <PopularSearches />
            <Footer />
        </WishlistProvider>
    );
}


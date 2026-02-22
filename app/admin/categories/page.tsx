import { getCategories, getProducts } from "@/lib/queries";
import { CategoriesGrid } from "@/components/admin/CategoriesGrid";

export default async function AdminCategoriesPage() {
    const [categories, { products }] = await Promise.all([
        getCategories(),
        getProducts({ limit: 999 }),
    ]);

    // Count products per category
    const productCounts: Record<string, number> = {};
    products.forEach((p) => {
        productCounts[p.category_id] = (productCounts[p.category_id] || 0) + 1;
    });

    return <CategoriesGrid categories={categories} productCounts={productCounts} />;
}

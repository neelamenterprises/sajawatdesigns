import { getProducts, getCategories } from "@/lib/queries";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
    const [{ products }, categories] = await Promise.all([
        getProducts({ limit: 999 }),
        getCategories(),
    ]);

    return <ProductsTable products={products} categories={categories} />;
}

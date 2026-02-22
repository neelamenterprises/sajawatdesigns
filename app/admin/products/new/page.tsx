import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/product-actions";

export default async function NewProductPage() {
    const categories = await getCategories();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Add New Product</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Create a new jewellery listing
                </p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card p-6">
                <ProductForm
                    categories={categories}
                    action={createProduct}
                    submitLabel="Create Product"
                />
            </div>
        </div>
    );
}

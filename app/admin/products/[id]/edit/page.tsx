import { notFound } from "next/navigation";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/product-actions";
import { createClient } from "@/lib/supabase/server";
import { mockProducts } from "@/lib/mock-data";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

async function getProductById(id: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === "your-supabase-url") {
        // Fallback to mock data
        return mockProducts.find((p) => p.id === id) || null;
    }

    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
    return data;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const [product, categories] = await Promise.all([
        getProductById(id),
        getCategories(),
    ]);

    if (!product) {
        notFound();
    }

    const updateWithId = async (formData: FormData) => {
        "use server";
        return updateProduct(id, formData);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Edit Product</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Update {product.name}
                </p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card p-6">
                <ProductForm
                    product={product}
                    categories={categories}
                    action={updateWithId}
                    submitLabel="Save Changes"
                />
            </div>
        </div>
    );
}

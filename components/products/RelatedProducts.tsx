import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
    products: Product[];
    title?: string;
}

export function RelatedProducts({
    products,
    title = "You May Also Like",
}: RelatedProductsProps) {
    if (products.length === 0) return null;

    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold">{title}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, getCategoryBySlug } from "@/lib/queries";
import { PlatformButtonGroup } from "@/components/ui/PlatformButton";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { WishlistButton } from "@/components/store/WishlistButton";
import { ShareButton } from "@/components/store/ShareButton";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product Not Found" };
    return {
        title: product.name,
        description: product.short_description || product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.short_description,
            images: product.images[0] ? [{ url: product.images[0] }] : [],
        },
    };
}

function getDiscountPercent(price: number, mrp: number): number {
    if (mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const [relatedProducts, category] = await Promise.all([
        getRelatedProducts(product.id, product.category_id),
        getCategoryBySlug(product.category_id),
    ]);

    const discount = getDiscountPercent(product.price, product.mrp);

    const features = product.description
        .split(/\.\s+/)
        .filter((s) => s.trim().length > 10)
        .slice(0, 5);

    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sajawatdesigns.com";

    // JSON-LD structured data for Google rich snippets (price, availability in search results)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images,
        sku: product.id,
        brand: {
            "@type": "Brand",
            name: "Sajawat Designs",
        },
        offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: product.price,
            highPrice: product.mrp,
            offerCount: [product.amazon_url, product.flipkart_url, product.meesho_url].filter(Boolean).length || 1,
            offers: [
                product.amazon_url && {
                    "@type": "Offer",
                    url: product.amazon_url,
                    priceCurrency: "INR",
                    price: product.price,
                    availability: "https://schema.org/InStock",
                    seller: { "@type": "Organization", name: "Amazon India" },
                },
                product.flipkart_url && {
                    "@type": "Offer",
                    url: product.flipkart_url,
                    priceCurrency: "INR",
                    price: product.price,
                    availability: "https://schema.org/InStock",
                    seller: { "@type": "Organization", name: "Flipkart" },
                },
                product.meesho_url && {
                    "@type": "Offer",
                    url: product.meesho_url,
                    priceCurrency: "INR",
                    price: product.price,
                    availability: "https://schema.org/InStock",
                    seller: { "@type": "Organization", name: "Meesho" },
                },
            ].filter(Boolean),
        },
        url: `${BASE_URL}/product/${product.slug}`,
        keywords: product.tags.join(", "),
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* JSON-LD for Google rich snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Breadcrumb */}
            <nav className="mb-6 text-xs text-muted-foreground tracking-wide uppercase">
                <a href="/" className="hover:text-primary transition-colors">
                    Home
                </a>
                <span className="mx-2 text-border">/</span>
                {category && (
                    <>
                        <a
                            href={`/category/${category.slug}`}
                            className="hover:text-primary transition-colors"
                        >
                            {category.name}
                        </a>
                        <span className="mx-2 text-border">/</span>
                    </>
                )}
                <span className="text-foreground normal-case">{product.name}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-2">
                {/* Image Gallery */}
                <ProductGallery
                    images={product.images}
                    name={product.name}
                    discount={discount}
                />

                {/* Product Info */}
                <div className="flex flex-col">
                    {/* Tags */}
                    {product.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {product.tags.slice(0, 4).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="rounded-full text-[10px] font-medium tracking-wide uppercase"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <h1 className="font-serif text-2xl font-semibold tracking-tight italic sm:text-3xl">
                        {product.name}
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {product.short_description}
                    </p>

                    <Separator className="my-6" />

                    {/* Price */}
                    <div className="mb-2 flex items-baseline gap-3">
                        <span className="text-3xl font-bold">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                            <>
                                <span className="text-base text-muted-foreground line-through">
                                    ₹{product.mrp.toLocaleString("en-IN")}
                                </span>
                                <Badge className="rounded-full bg-green-600/90 text-white text-xs">
                                    Save ₹{(product.mrp - product.price).toLocaleString("en-IN")}
                                </Badge>
                            </>
                        )}
                    </div>
                    <p className="mb-6 text-xs text-muted-foreground">Inclusive of all taxes</p>

                    {/* Platform Buttons */}
                    <div className="mb-6">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            Buy From
                        </p>
                        <PlatformButtonGroup
                            amazonUrl={product.amazon_url}
                            flipkartUrl={product.flipkart_url}
                            meeshoUrl={product.meesho_url}
                        />
                    </div>

                    {/* Wishlist / Share */}
                    <div className="mb-6 flex gap-3">
                        <WishlistButton
                            productId={product.id}
                            productName={product.name}
                            productData={{
                                id: product.id,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                mrp: product.mrp,
                                image: product.images[0] || "",
                                short_description: product.short_description,
                            }}
                            variant="page"
                        />
                        <ShareButton
                            title={product.name}
                            text={product.short_description}
                        />
                    </div>

                    <Separator className="mb-6" />

                    {/* Key Features */}
                    {features.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
                                Highlights
                            </h3>
                            <ul className="space-y-3">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {feature.trim()}.
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mt-8">
                        <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                            Description
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <Separator className="mb-12" />
                    <RelatedProducts products={relatedProducts} title="Similar Pieces" />
                </div>
            )}
        </div>
    );
}

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

function getDiscountPercent(price: number, mrp: number): number {
    if (mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
}

function getPlatformIcons(product: Product) {
    const platforms: { name: string; color: string; available: boolean }[] = [
        { name: "Amazon", color: "#FF9900", available: !!product.amazon_url },
        { name: "Flipkart", color: "#2874F0", available: !!product.flipkart_url },
        { name: "Meesho", color: "#E91E63", available: !!product.meesho_url },
    ];
    return platforms.filter((p) => p.available);
}

export function ProductCard({ product }: ProductCardProps) {
    const discount = getDiscountPercent(product.price, product.mrp);
    const platforms = getPlatformIcons(product);

    return (
        <Link href={`/product/${product.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-xl border border-border/30 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                {/* Image Container — white/cream background like jewellery sites */}
                <div className="relative aspect-square overflow-hidden bg-[#faf7f2]">
                    <Image
                        src={product.images[0] || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover p-2 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <Badge className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                            -{discount}%
                        </Badge>
                    )}

                    {/* Wishlist heart */}
                    <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:text-primary group-hover:opacity-100">
                        <Heart className="h-4 w-4" />
                    </button>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <span className="rounded-full bg-foreground/90 px-5 py-2 text-xs font-medium tracking-wide text-background uppercase shadow-lg backdrop-blur-sm">
                            Quick View
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Platform tags at top */}
                    <div className="mb-2 flex items-center gap-1.5">
                        {platforms.map((platform) => (
                            <span
                                key={platform.name}
                                className="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase"
                                style={{
                                    backgroundColor: `${platform.color}10`,
                                    color: platform.color,
                                }}
                            >
                                {platform.name}
                            </span>
                        ))}
                    </div>

                    <h3 className="mb-1 line-clamp-1 text-sm font-medium text-card-foreground transition-colors group-hover:text-primary">
                        {product.name}
                    </h3>
                    <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">
                        {product.short_description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-card-foreground">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                                ₹{product.mrp.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

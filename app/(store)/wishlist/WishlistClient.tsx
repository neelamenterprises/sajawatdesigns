"use client";

import { useWishlist } from "@/components/store/WishlistProvider";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function WishlistClient() {
    const { products, toggle } = useWishlist();

    if (products.length === 0) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Heart className="h-10 w-10 text-primary/50" />
                    </div>
                </div>
                <h1 className="font-serif text-2xl font-semibold italic">Your Wishlist is Empty</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    Browse our collections and tap the ♡ heart on any piece you love — it&apos;ll be saved here for later.
                </p>
                <Button asChild className="mt-8 rounded-full px-8" size="lg">
                    <Link href="/search">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Explore Collections
                    </Link>
                </Button>
            </div>
        );
    }

    function getDiscount(price: number, mrp: number) {
        if (mrp <= price) return 0;
        return Math.round(((mrp - price) / mrp) * 100);
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-semibold italic sm:text-3xl">My Wishlist</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {products.length} saved {products.length === 1 ? "piece" : "pieces"}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                    const discount = getDiscount(product.price, product.mrp);
                    return (
                        <div
                            key={product.id}
                            className="group relative overflow-hidden rounded-xl border border-border/30 bg-card transition-all hover:shadow-md"
                        >
                            {/* Remove button */}
                            <button
                                onClick={() => toggle(product.id)}
                                className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500"
                                aria-label="Remove from wishlist"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            <Link href={`/product/${product.slug}`}>
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden bg-[#faf7f2]">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover p-2 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Heart className="h-12 w-12 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <Badge className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold">
                                            -{discount}%
                                        </Badge>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="mb-1 line-clamp-1 text-sm font-medium transition-colors group-hover:text-primary">
                                        {product.name}
                                    </h3>
                                    <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">
                                        {product.short_description}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-base font-bold">
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </span>
                                        {discount > 0 && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                ₹{product.mrp.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>

                            <div className="border-t border-border/20 p-3">
                                <Button asChild size="sm" className="w-full gap-1.5 rounded-lg text-xs">
                                    <Link href={`/product/${product.slug}`}>
                                        View & Buy <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

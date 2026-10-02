"use client";

import { Heart } from "lucide-react";
import { useWishlist, WishlistProduct } from "@/components/store/WishlistProvider";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    productId: string;
    productName: string;
    /** Full product data — pass this so the wishlist page can render without extra fetches */
    productData?: WishlistProduct;
    /** Visual style variant */
    variant?: "card" | "page";
    className?: string;
}

export function WishlistButton({
    productId,
    productName,
    productData,
    variant = "card",
    className,
}: WishlistButtonProps) {
    const { isWishlisted, toggle } = useWishlist();
    const saved = isWishlisted(productId);

    function handleClick(e: React.MouseEvent) {
        e.preventDefault(); // prevent card link navigation
        e.stopPropagation();
        toggle(productId, productData);
    }

    if (variant === "card") {
        return (
            <button
                type="button"
                onClick={handleClick}
                aria-label={saved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
                aria-pressed={saved}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200",
                    saved
                        ? "text-red-500 opacity-100"
                        : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-400",
                    className
                )}
            >
                <Heart
                    className={cn("h-4 w-4 transition-all", saved && "fill-current")}
                />
            </button>
        );
    }

    // page variant — shown on product detail page
    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={saved ? `Remove from wishlist` : `Add to wishlist`}
            aria-pressed={saved}
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200",
                saved
                    ? "border-red-500/40 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
                    : "border-border hover:border-red-400/50 hover:bg-red-50/50 hover:text-red-500 dark:hover:bg-red-950/20",
                className
            )}
        >
            <Heart
                className={cn("h-3.5 w-3.5 transition-all", saved && "fill-current text-red-500")}
            />
            {saved ? "Saved to Wishlist" : "Add to Wishlist"}
        </button>
    );
}

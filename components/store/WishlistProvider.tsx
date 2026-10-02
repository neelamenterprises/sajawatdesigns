"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";

const IDS_KEY = "sajawat_wishlist";
const PRODUCTS_KEY = "sajawat_wishlist_products";

export interface WishlistProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    image: string;
    short_description: string;
}

interface WishlistContextValue {
    /** Set of product IDs currently in wishlist */
    wishlist: Set<string>;
    /** All saved product details (for rendering the wishlist page) */
    products: WishlistProduct[];
    /** Whether a product is in the wishlist */
    isWishlisted: (productId: string) => boolean;
    /**
     * Toggle a product in/out of the wishlist.
     * Pass `productData` when adding so details can be stored.
     * Returns true if the item was ADDED.
     */
    toggle: (productId: string, productData?: WishlistProduct) => boolean;
    /** Number of items in the wishlist */
    count: number;
    /** Remove all items */
    clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within <WishlistProvider>");
    return ctx;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [products, setProducts] = useState<WishlistProduct[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Hydrate from localStorage on mount (client-only, avoids SSR mismatch)
    useEffect(() => {
        try {
            const storedIds = localStorage.getItem(IDS_KEY);
            if (storedIds) setWishlist(new Set(JSON.parse(storedIds) as string[]));

            const storedProducts = localStorage.getItem(PRODUCTS_KEY);
            if (storedProducts) setProducts(JSON.parse(storedProducts) as WishlistProduct[]);
        } catch {
            // ignore parse errors
        }
        setHydrated(true);
    }, []);

    // Persist to localStorage whenever state changes (after hydration)
    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(IDS_KEY, JSON.stringify([...wishlist]));
        } catch { /* ignore */ }
    }, [wishlist, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        } catch { /* ignore */ }
    }, [products, hydrated]);

    const isWishlisted = useCallback(
        (productId: string) => wishlist.has(productId),
        [wishlist]
    );

    const toggle = useCallback((productId: string, productData?: WishlistProduct): boolean => {
        let added = false;

        setWishlist((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
                added = false;
            } else {
                next.add(productId);
                added = true;
            }
            return next;
        });

        setProducts((prev) => {
            if (prev.find((p) => p.id === productId)) {
                // Removing
                return prev.filter((p) => p.id !== productId);
            } else if (productData) {
                // Adding
                return [...prev, productData];
            }
            return prev;
        });

        return added;
    }, []);

    const clear = useCallback(() => {
        setWishlist(new Set());
        setProducts([]);
    }, []);

    const value = useMemo(
        () => ({ wishlist, products, isWishlisted, toggle, count: wishlist.size, clear }),
        [wishlist, products, isWishlisted, toggle, clear]
    );

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

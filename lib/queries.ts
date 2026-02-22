import { Category, Product, ProductFilters } from "./types";
import { mockCategories, mockProducts } from "./mock-data";

// Check if Supabase is configured
const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;

// ─── Category queries ─────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured) return mockCategories;

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error fetching categories:", error);
        return mockCategories;
    }
    return data ?? mockCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!isSupabaseConfigured) {
        return mockCategories.find((c) => c.slug === slug) ?? null;
    }

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching category:", error);
        return mockCategories.find((c) => c.slug === slug) ?? null;
    }
    return data;
}

// ─── Product queries ──────────────────────────────────────────────

export async function getProducts(filters: ProductFilters = {}): Promise<{
    products: Product[];
    total: number;
}> {
    if (!isSupabaseConfigured) {
        return getFilteredMockProducts(filters);
    }

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("is_active", true);

    if (filters.categorySlug) {
        const category = await getCategoryBySlug(filters.categorySlug);
        if (category) {
            query = query.eq("category_id", category.id);
        }
    }

    if (filters.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
    }

    if (filters.platforms && filters.platforms.length > 0) {
        const orClauses = filters.platforms
            .map((p) => `${p}_url.neq.null`)
            .join(",");
        query = query.or(orClauses);
    }

    // Sort
    switch (filters.sort) {
        case "price-low-high":
            query = query.order("price", { ascending: true });
            break;
        case "price-high-low":
            query = query.order("price", { ascending: false });
            break;
        case "popularity":
            query = query.order("is_trending", { ascending: false }).order("is_featured", { ascending: false });
            break;
        case "newest":
        default:
            query = query.order("created_at", { ascending: false });
            break;
    }

    // Pagination
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        console.error("Error fetching products:", error);
        return getFilteredMockProducts(filters);
    }
    return { products: data ?? [], total: count ?? 0 };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    if (!isSupabaseConfigured) {
        return mockProducts.find((p) => p.slug === slug) ?? null;
    }

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return mockProducts.find((p) => p.slug === slug) ?? null;
    }
    return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        return mockProducts.filter((p) => p.is_featured && p.is_active);
    }

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .limit(8);

    if (error) {
        console.error("Error fetching featured:", error);
        return mockProducts.filter((p) => p.is_featured);
    }
    return data ?? [];
}

export async function getTrendingProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        return mockProducts.filter((p) => p.is_trending && p.is_active);
    }

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_trending", true)
        .eq("is_active", true)
        .limit(8);

    if (error) {
        console.error("Error fetching trending:", error);
        return mockProducts.filter((p) => p.is_trending);
    }
    return data ?? [];
}

export async function getRelatedProducts(
    productId: string,
    categoryId: string
): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        return mockProducts
            .filter((p) => p.category_id === categoryId && p.id !== productId && p.is_active)
            .slice(0, 4);
    }

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .neq("id", productId)
        .eq("is_active", true)
        .limit(4);

    if (error) {
        console.error("Error fetching related:", error);
        return mockProducts
            .filter((p) => p.category_id === categoryId && p.id !== productId)
            .slice(0, 4);
    }
    return data ?? [];
}

export async function searchProducts(
    query: string,
    filters: ProductFilters = {}
): Promise<{ products: Product[]; total: number }> {
    if (!isSupabaseConfigured) {
        const q = query.toLowerCase();
        const filtered = mockProducts.filter(
            (p) =>
                p.is_active &&
                (p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q)))
        );
        return { products: filtered, total: filtered.length };
    }

    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("is_active", true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error searching:", error);
        const q = query.toLowerCase();
        const filtered = mockProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
        );
        return { products: filtered, total: filtered.length };
    }
    return { products: data ?? [], total: count ?? 0 };
}

// ─── Mock data filtering helper ──────────────────────────────────

function getFilteredMockProducts(filters: ProductFilters): {
    products: Product[];
    total: number;
} {
    let results = mockProducts.filter((p) => p.is_active);

    if (filters.categorySlug) {
        const cat = mockCategories.find((c) => c.slug === filters.categorySlug);
        if (cat) results = results.filter((p) => p.category_id === cat.id);
    }

    if (filters.minPrice !== undefined) {
        results = results.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
        results = results.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.platforms && filters.platforms.length > 0) {
        results = results.filter((p) =>
            filters.platforms!.some((platform) => {
                if (platform === "amazon") return p.amazon_url !== null;
                if (platform === "flipkart") return p.flipkart_url !== null;
                if (platform === "meesho") return p.meesho_url !== null;
                return false;
            })
        );
    }

    if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q))
        );
    }

    // Sort
    switch (filters.sort) {
        case "price-low-high":
            results.sort((a, b) => a.price - b.price);
            break;
        case "price-high-low":
            results.sort((a, b) => b.price - a.price);
            break;
        case "popularity":
            results.sort((a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0));
            break;
        case "newest":
        default:
            results.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            break;
    }

    const total = results.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const from = (page - 1) * limit;
    results = results.slice(from, from + limit);

    return { products: results, total };
}

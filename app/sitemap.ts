import { getCategories } from "@/lib/queries";
import { getProducts } from "@/lib/queries";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sajawatdesigns.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [categories, { products }] = await Promise.all([
        getCategories(),
        getProducts({ limit: 9999 }),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/search`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${BASE_URL}/category/${cat.slug}`,
        lastModified: new Date(cat.created_at),
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: new Date(product.updated_at || product.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

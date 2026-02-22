import Link from "next/link";
import { Package, FolderOpen, Star, TrendingUp, Plus } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/queries";

export default async function AdminDashboard() {
    const [categories, { products, total }] = await Promise.all([
        getCategories(),
        getProducts({ limit: 999 }),
    ]);

    const featuredCount = products.filter((p) => p.is_featured).length;
    const trendingCount = products.filter((p) => p.is_trending).length;

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Overview of your jewellery catalogue
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href="/admin/categories">
                            <Plus className="h-3.5 w-3.5" /> Category
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="gap-2">
                        <Link href="/admin/products/new">
                            <Plus className="h-3.5 w-3.5" /> Product
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Products"
                    value={total}
                    icon={Package}
                    description="Active in catalogue"
                />
                <StatsCard
                    title="Categories"
                    value={categories.length}
                    icon={FolderOpen}
                    description="Product collections"
                />
                <StatsCard
                    title="Featured"
                    value={featuredCount}
                    icon={Star}
                    description="Editor's picks"
                />
                <StatsCard
                    title="Trending"
                    value={trendingCount}
                    icon={TrendingUp}
                    description="Most loved items"
                />
            </div>

            {/* Recent Products */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent Products</h2>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/admin/products">View All →</Link>
                    </Button>
                </div>
                <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/30 bg-secondary/30">
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {products.slice(0, 5).map((product) => (
                                <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="font-medium hover:text-primary transition-colors"
                                        >
                                            {product.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        ₹{product.price.toLocaleString("en-IN")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${product.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {product.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Category } from "@/lib/types";
import { deleteProduct, toggleProductField } from "@/lib/product-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Star, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductsTableProps {
    products: Product[];
    categories: Category[];
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
    const [search, setSearch] = useState("");

    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.short_description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {products.length} total products
                    </p>
                </div>
                <Button asChild size="sm" className="gap-2">
                    <Link href="/admin/products/new">
                        <Plus className="h-3.5 w-3.5" /> Add Product
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border/30 bg-secondary/30">
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Product
                            </th>
                            <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                                Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Price
                            </th>
                            <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {filtered.map((product) => (
                            <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                                {/* Product name + thumbnail */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {product.images[0] && (
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{product.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {product.short_description}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                {/* Category */}
                                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                    {categoryMap[product.category_id] || "—"}
                                </td>
                                {/* Price */}
                                <td className="px-4 py-3">
                                    <span className="font-medium">₹{product.price.toLocaleString("en-IN")}</span>
                                    {product.mrp > product.price && (
                                        <span className="ml-1.5 text-xs text-muted-foreground line-through">
                                            ₹{product.mrp.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </td>
                                {/* Status badges */}
                                <td className="hidden px-4 py-3 sm:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        <Badge
                                            variant={product.is_active ? "default" : "secondary"}
                                            className="text-[10px]"
                                        >
                                            {product.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                        {product.is_featured && (
                                            <Badge variant="secondary" className="gap-1 text-[10px]">
                                                <Star className="h-2.5 w-2.5" />
                                            </Badge>
                                        )}
                                        {product.is_trending && (
                                            <Badge variant="secondary" className="gap-1 text-[10px]">
                                                <TrendingUp className="h-2.5 w-2.5" />
                                            </Badge>
                                        )}
                                    </div>
                                </td>
                                {/* Actions dropdown */}
                                <td className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/products/${product.id}/edit`} className="gap-2">
                                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    toggleProductField(product.id, "is_active", product.is_active)
                                                }
                                                className="gap-2"
                                            >
                                                {product.is_active ? (
                                                    <><EyeOff className="h-3.5 w-3.5" /> Deactivate</>
                                                ) : (
                                                    <><Eye className="h-3.5 w-3.5" /> Activate</>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    toggleProductField(product.id, "is_featured", product.is_featured)
                                                }
                                                className="gap-2"
                                            >
                                                <Star className="h-3.5 w-3.5" />
                                                {product.is_featured ? "Unfeature" : "Feature"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    toggleProductField(product.id, "is_trending", product.is_trending)
                                                }
                                                className="gap-2"
                                            >
                                                <TrendingUp className="h-3.5 w-3.5" />
                                                {product.is_trending ? "Untrend" : "Mark Trending"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    if (confirm("Delete this product?")) {
                                                        deleteProduct(product.id);
                                                    }
                                                }}
                                                className="gap-2 text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

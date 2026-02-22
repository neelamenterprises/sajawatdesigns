"use client";

import Image from "next/image";
import { Category } from "@/lib/types";
import { deleteCategory } from "@/lib/category-actions";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface CategoriesGridProps {
    categories: Category[];
    productCounts: Record<string, number>;
}

export function CategoriesGrid({ categories, productCounts }: CategoriesGridProps) {
    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {categories.length} collections
                    </p>
                </div>
                <CategoryDialog
                    trigger={
                        <Button size="sm" className="gap-2">
                            <Plus className="h-3.5 w-3.5" /> Add Category
                        </Button>
                    }
                />
            </div>

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="group relative overflow-hidden rounded-xl border border-border/30 bg-card transition-shadow hover:shadow-md"
                    >
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-secondary/30">
                            {category.image_url && (
                                <Image
                                    src={category.image_url}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-3 left-4 right-4">
                                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                <p className="text-xs text-white/80">
                                    {productCounts[category.id] || 0} products
                                </p>
                            </div>
                        </div>

                        {/* Description + Actions */}
                        <div className="p-4">
                            {category.description && (
                                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                                    {category.description}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <CategoryDialog
                                    category={category}
                                    trigger={
                                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                            <Pencil className="h-3 w-3" /> Edit
                                        </Button>
                                    }
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-xs text-destructive hover:text-destructive"
                                    onClick={() => {
                                        if (confirm(`Delete "${category.name}"? This will also delete all its products.`)) {
                                            deleteCategory(category.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="h-3 w-3" /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
                        No categories yet. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}

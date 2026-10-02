"use client";

import { useState } from "react";
import Image from "next/image";
import { Category } from "@/lib/types";
import { deleteCategory } from "@/lib/category-actions";
import { useToast } from "@/components/admin/ToastProvider";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface CategoriesGridProps {
    categories: Category[];
    productCounts: Record<string, number>;
}

export function CategoriesGrid({ categories, productCounts }: CategoriesGridProps) {
    const { toast } = useToast();
    // Track which category is being deleted
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(categoryId: string, categoryName: string) {
        if (
            !confirm(
                `Delete "${categoryName}"?\n\nThis will also unlink or delete all products in this category.`
            )
        )
            return;

        setDeletingId(categoryId);
        try {
            const result = await deleteCategory(categoryId);
            if (result?.error) {
                toast({
                    variant: "error",
                    message: result.error,
                    detail: result.detail,
                    duration: 8000,
                });
            } else {
                toast({
                    variant: "success",
                    message: `"${categoryName}" was deleted successfully.`,
                });
            }
        } catch (err) {
            toast({
                variant: "error",
                message: "Something went wrong while deleting — please try again.",
                detail: err instanceof Error ? err.message : String(err),
            });
        } finally {
            setDeletingId(null);
        }
    }

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
                {categories.map((category) => {
                    const isDeleting = deletingId === category.id;

                    return (
                        <div
                            key={category.id}
                            className="group relative overflow-hidden rounded-xl border border-border/30 bg-card transition-shadow hover:shadow-md"
                            aria-busy={isDeleting}
                        >
                            {/* Deleting overlay */}
                            {isDeleting && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}

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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1.5 text-xs"
                                                disabled={isDeleting}
                                            >
                                                <Pencil className="h-3 w-3" /> Edit
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs text-destructive hover:text-destructive"
                                        disabled={isDeleting}
                                        onClick={() => handleDelete(category.id, category.name)}
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                        {isDeleting ? "Deleting…" : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {categories.length === 0 && (
                    <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
                        No categories yet. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Category } from "@/lib/types";
import { deleteCategory, getProductCountForCategory } from "@/lib/category-actions";
import { useToast } from "@/components/admin/ToastProvider";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface CategoriesGridProps {
    categories: Category[];
    productCounts: Record<string, number>;
}

interface DeleteTarget {
    id: string;
    name: string;
    productCount: number | null; // null = still loading the count
}

export function CategoriesGrid({ categories, productCounts }: CategoriesGridProps) {
    const { toast } = useToast();

    // The category staged for deletion (opens the confirm dialog)
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
    // Whether the actual delete call is running
    const [isDeleting, setIsDeleting] = useState(false);
    // Which card is fetching its product count (spinner on the button)
    const [fetchingCountFor, setFetchingCountFor] = useState<string | null>(null);

    /** Clicking Delete first fetches the live product count, then opens the dialog */
    async function requestDelete(category: Category) {
        setFetchingCountFor(category.id);
        try {
            const count = await getProductCountForCategory(category.id);
            setDeleteTarget({ id: category.id, name: category.name, productCount: count });
        } catch {
            // Fall back to count from props if the fetch fails
            setDeleteTarget({
                id: category.id,
                name: category.name,
                productCount: productCounts[category.id] ?? 0,
            });
        } finally {
            setFetchingCountFor(null);
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const result = await deleteCategory(deleteTarget.id);
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
                    message: `"${deleteTarget.name}" and all its products were deleted.`,
                });
            }
        } catch (err) {
            toast({
                variant: "error",
                message: "Something went wrong while deleting — please try again.",
                detail: err instanceof Error ? err.message : String(err),
            });
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    }

    // Build consequences list for the confirm dialog
    const deleteConsequences = (() => {
        if (!deleteTarget) return [];
        const lines = [`Delete the category "${deleteTarget.name}"`];
        const count = deleteTarget.productCount ?? 0;
        if (count > 0) {
            lines.push(
                `Permanently delete ${count} product${count === 1 ? "" : "s"} inside this category`
            );
            lines.push("Remove those products from the storefront immediately");
        }
        return lines;
    })();

    return (
        <div>
            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(v) => {
                    if (!v && !isDeleting) setDeleteTarget(null);
                }}
                title="Delete Category?"
                description={
                    deleteTarget?.productCount
                        ? `You are about to delete "${deleteTarget.name}" which contains ${deleteTarget.productCount} product${deleteTarget.productCount === 1 ? "" : "s"}. All of them will be permanently removed.`
                        : `You are about to delete "${deleteTarget?.name ?? ""}". This action cannot be reversed.`
                }
                consequences={deleteConsequences}
                confirmLabel="Yes, Delete Everything"
                variant="danger"
                loading={isDeleting}
                onConfirm={confirmDelete}
            />

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
                    const isFetchingCount = fetchingCountFor === category.id;

                    return (
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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1.5 text-xs"
                                                disabled={isFetchingCount}
                                            >
                                                <Pencil className="h-3 w-3" /> Edit
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs text-destructive hover:text-destructive"
                                        disabled={isFetchingCount}
                                        onClick={() => requestDelete(category)}
                                    >
                                        {isFetchingCount ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                        {isFetchingCount ? "Checking…" : "Delete"}
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

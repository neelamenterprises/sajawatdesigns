"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/lib/types";
import { createCategory, updateCategory } from "@/lib/category-actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface CategoryDialogProps {
    category?: Category;
    trigger: React.ReactNode;
}

export function CategoryDialog({ category, trigger }: CategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>(
        category?.image_url ? [category.image_url] : []
    );

    const isEditing = !!category;

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        // Set the image URL from upload
        formData.set("image_url", imageUrls[0] || "");

        const result = isEditing
            ? await updateCategory(category!.id, formData)
            : await createCategory(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            setOpen(false);
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => {
            setOpen(v);
            if (v) {
                // Reset image state when opening
                setImageUrls(category?.image_url ? [category.image_url] : []);
                setError(null);
            }
        }}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Category" : "Add Category"}
                    </DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Name</label>
                        <Input
                            name="name"
                            defaultValue={category?.name}
                            placeholder="e.g. Rings"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Description</label>
                        <Input
                            name="description"
                            defaultValue={category?.description || ""}
                            placeholder="Brief description of the category"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Category Image</label>
                        {/* Show current image if editing and no new upload yet */}
                        {imageUrls.length > 0 && (
                            <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-lg border border-border/30">
                                <Image
                                    src={imageUrls[0]}
                                    alt="Category image"
                                    fill
                                    sizes="400px"
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <ImageUpload
                            value={imageUrls}
                            onChange={setImageUrls}
                            folder="categories"
                            maxImages={1}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : isEditing ? "Save Changes" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

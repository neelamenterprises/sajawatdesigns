"use client";

import { useState, useTransition } from "react";
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
import { useToast } from "@/components/admin/ToastProvider";
import { Loader2, Save } from "lucide-react";

interface CategoryDialogProps {
    category?: Category;
    trigger: React.ReactNode;
}

export function CategoryDialog({ category, trigger }: CategoryDialogProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [imageUrls, setImageUrls] = useState<string[]>(
        category?.image_url ? [category.image_url] : []
    );

    const isEditing = !!category;

    async function handleSubmit(formData: FormData) {
        formData.set("image_url", imageUrls[0] || "");

        startTransition(async () => {
            try {
                const result = isEditing
                    ? await updateCategory(category!.id, formData)
                    : await createCategory(formData);

                if (result?.error) {
                    toast({
                        variant: "error",
                        message: result.error,
                        detail: (result as { error: string; detail?: string }).detail,
                        duration: 8000,
                    });
                } else {
                    toast({
                        variant: "success",
                        message: isEditing
                            ? `"${category!.name}" was updated successfully.`
                            : "New category created successfully.",
                    });
                    setOpen(false);
                }
            } catch (err) {
                toast({
                    variant: "error",
                    message: "Something went wrong — please try again.",
                    detail: err instanceof Error ? err.message : String(err),
                });
            }
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (isPending) return; // Prevent closing while saving
                setOpen(v);
                if (v) {
                    // Reset image state when opening
                    setImageUrls(category?.image_url ? [category.image_url] : []);
                }
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Category" : "Add Category"}
                    </DialogTitle>
                </DialogHeader>

                {/* Loading bar at top of dialog */}
                {isPending && (
                    <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden rounded-t-lg">
                        <div className="h-full w-full animate-[loading-bar_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary to-transparent" />
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Name</label>
                        <Input
                            name="name"
                            defaultValue={category?.name}
                            placeholder="e.g. Rings"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Description</label>
                        <Input
                            name="description"
                            defaultValue={category?.description || ""}
                            placeholder="Brief description of the category"
                            disabled={isPending}
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
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="gap-2 min-w-[110px]">
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isEditing ? "Save Changes" : "Create"}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

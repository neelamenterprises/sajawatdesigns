"use client";

import { useState } from "react";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ProductFormProps {
    product?: Product | null;
    categories: Category[];
    action: (formData: FormData) => Promise<{ error?: string } | void>;
    submitLabel: string;
}

export function ProductForm({
    product,
    categories,
    action,
    submitLabel,
}: ProductFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [categoryId, setCategoryId] = useState(product?.category_id || "");
    const [images, setImages] = useState<string[]>(product?.images || []);

    // Determine upload folder from category name
    const selectedCategory = categories.find((c) => c.id === categoryId);
    const uploadFolder = selectedCategory
        ? `products/${selectedCategory.slug}`
        : "products/uncategorized";

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        formData.set("category_id", categoryId);
        formData.set("images", images.join("\n"));
        const result = await action(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Basic Info */}
            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Basic Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium">Product Name</label>
                        <Input
                            name="name"
                            defaultValue={product?.name}
                            placeholder="e.g. Rose Gold Solitaire Ring"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium">Short Description</label>
                        <Input
                            name="short_description"
                            defaultValue={product?.short_description}
                            placeholder="Brief one-liner for product cards"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium">Full Description</label>
                        <textarea
                            name="description"
                            defaultValue={product?.description}
                            placeholder="Detailed product description..."
                            required
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Category</label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>{/* spacer */}</div>
                </div>
            </section>

            {/* Pricing */}
            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Pricing
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">Selling Price (₹)</label>
                        <Input
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={product?.price}
                            placeholder="1999"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">MRP (₹)</label>
                        <Input
                            name="mrp"
                            type="number"
                            step="0.01"
                            defaultValue={product?.mrp}
                            placeholder="2999"
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Images */}
            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Product Images
                </h3>
                <ImageUpload
                    value={images}
                    onChange={setImages}
                    folder={uploadFolder}
                    maxImages={6}
                />
            </section>

            {/* Tags */}
            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags
                </h3>
                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Tags <span className="font-normal text-muted-foreground">(comma-separated)</span>
                    </label>
                    <Input
                        name="tags"
                        defaultValue={product?.tags.join(", ")}
                        placeholder="gold, diamond, ring, wedding"
                    />
                </div>
            </section>

            {/* Platform URLs */}
            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Platform Links
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#FF9900]" />
                            Amazon URL
                        </label>
                        <Input
                            name="amazon_url"
                            type="url"
                            defaultValue={product?.amazon_url || ""}
                            placeholder="https://amazon.in/..."
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#2874F0]" />
                            Flipkart URL
                        </label>
                        <Input
                            name="flipkart_url"
                            type="url"
                            defaultValue={product?.flipkart_url || ""}
                            placeholder="https://flipkart.com/..."
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#E91E63]" />
                            Meesho URL
                        </label>
                        <Input
                            name="meesho_url"
                            type="url"
                            defaultValue={product?.meesho_url || ""}
                            placeholder="https://meesho.com/..."
                        />
                    </div>
                </div>
            </section>

            {/* Flags */}
            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Visibility
                </h3>
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            name="is_active"
                            defaultChecked={product?.is_active ?? true}
                        />
                        Active (visible on store)
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            name="is_featured"
                            defaultChecked={product?.is_featured ?? false}
                        />
                        Featured (Editor&apos;s Pick)
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            name="is_trending"
                            defaultChecked={product?.is_trending ?? false}
                        />
                        Trending (Most Loved)
                    </label>
                </div>
            </section>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}

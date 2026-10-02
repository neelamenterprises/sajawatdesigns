"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { addReview, updateReview } from "@/lib/review-actions";
import { Testimonial } from "@/lib/types";
import { useToast } from "@/components/admin/ToastProvider";

interface ReviewFormProps {
    review?: Testimonial;
    trigger?: React.ReactNode;
}

export function ReviewForm({ review, trigger }: ReviewFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        
        try {
            let res;
            if (review) {
                res = await updateReview(review.id, formData);
            } else {
                res = await addReview(formData);
            }

            if (res.error) {
                toast({ message: res.error, detail: res.detail, variant: "error" });
            } else {
                toast({
                    message: `Review successfully ${review ? "updated" : "added"}.`,
                    variant: "success",
                });
                setOpen(false);
            }
        } catch (err) {
            toast({
                message: "Something went wrong. Please try again.",
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Review
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{review ? "Edit Review" : "Add New Review"}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Customer Name</label>
                            <Input
                                name="customer_name"
                                defaultValue={review?.customer_name}
                                placeholder="e.g. Priya Sharma"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Platform</label>
                            <select
                                name="platform"
                                defaultValue={review?.platform || "amazon"}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="amazon">Amazon</option>
                                <option value="flipkart">Flipkart</option>
                                <option value="meesho">Meesho</option>
                                <option value="direct">Direct/Website</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Rating (1-5)</label>
                            <Input
                                name="rating"
                                type="number"
                                min="1"
                                max="5"
                                defaultValue={review?.rating || 5}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Review Content</label>
                            <textarea
                                name="content"
                                defaultValue={review?.content}
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Write the review text here..."
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                defaultChecked={review ? review.is_active : true}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium">
                                Show on Website
                            </label>
                        </div>

                        <div className="pt-6">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Saving..." : "Save Review"}
                            </Button>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

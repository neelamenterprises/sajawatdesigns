"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteReview } from "@/lib/review-actions";
import { useToast } from "@/components/admin/ToastProvider";
import { ReviewForm } from "./ReviewForm";
import { Testimonial } from "@/lib/types";

export function ReviewActions({ review }: { review: Testimonial }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            const res = await deleteReview(review.id);
            if (res.error) {
                toast({ message: res.error, variant: "error" });
            } else {
                toast({
                    message: "Review deleted successfully.",
                    variant: "success",
                });
            }
        } catch (err) {
            toast({
                message: "Failed to delete review.",
                variant: "error",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <ReviewForm
                        review={review}
                        trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                        }
                    />

                    <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onSelect={() => setIsDeleting(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={isDeleting}
                onOpenChange={setIsDeleting}
                onConfirm={handleDelete}
                title="Delete Review"
                description={`Are you sure you want to delete the review by ${review.customer_name}? This action cannot be undone.`}
            />
        </div>
    );
}

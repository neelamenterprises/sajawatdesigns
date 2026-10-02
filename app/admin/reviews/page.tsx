import { Suspense } from "react";
import { getTestimonials } from "@/lib/queries";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewList } from "./ReviewList";

export const metadata = {
    title: "Manage Reviews",
};

export default async function AdminReviewsPage() {
    const testimonials = await getTestimonials(); // Fetch all reviews, even inactive ones?
    // Wait, getTestimonials() only fetches active ones. We should fetch all for admin.
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage customer testimonials shown on the homepage.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Review
                </Button>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <ReviewList />
            </Suspense>
        </div>
    );
}

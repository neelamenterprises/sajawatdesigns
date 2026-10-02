import { Suspense } from "react";
import { getTestimonials } from "@/lib/queries";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "@/components/admin/ReviewForm";

export const metadata = {
    title: "Manage Reviews",
};

export default async function AdminReviewsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage customer testimonials shown on the homepage.
                    </p>
                </div>
                <ReviewForm />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <ReviewList />
            </Suspense>
        </div>
    );
}

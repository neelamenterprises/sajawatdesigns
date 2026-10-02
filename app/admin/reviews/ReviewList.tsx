import { getTestimonials } from "@/lib/queries";
import { Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function ReviewList() {
    const reviews = await getTestimonials(true); // fetch all

    if (reviews.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <MessageSquare className="mx-auto mb-4 h-8 w-8 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">No reviews yet</h3>
                <p className="text-sm text-muted-foreground">
                    Add customer testimonials to display them on the homepage.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                <div>Customer & Review</div>
                <div className="w-24 text-center">Platform</div>
                <div className="w-24 text-center">Rating</div>
                <div className="w-24 text-right">Status</div>
            </div>
            <div className="divide-y">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 p-4 text-sm transition-colors hover:bg-muted/50"
                    >
                        <div>
                            <div className="font-medium text-foreground">{review.customer_name}</div>
                            <div className="mt-1 line-clamp-1 text-muted-foreground">
                                {review.content}
                            </div>
                        </div>
                        <div className="w-24 text-center uppercase tracking-wider text-xs font-semibold text-muted-foreground">
                            {review.platform}
                        </div>
                        <div className="w-24 flex justify-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "fill-[#FF9900] text-[#FF9900]" : "fill-muted text-muted"}`}
                                />
                            ))}
                        </div>
                        <div className="w-24 text-right">
                            <Badge variant={review.is_active ? "default" : "secondary"}>
                                {review.is_active ? "Active" : "Hidden"}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

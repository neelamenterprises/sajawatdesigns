import { Testimonial } from "@/lib/types";
import { Star } from "lucide-react";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
    if (testimonials.length === 0) return null;

    return (
        <section className="bg-[#faf7f2] py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="font-serif text-3xl font-semibold tracking-tight italic sm:text-4xl">
                        Loved by Customers
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Real reviews from our shoppers across India
                    </p>
                </div>

                {/* CSS Snap Scroll Carousel */}
                <div className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-8 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
                    {testimonials.map((review) => (
                        <div
                            key={review.id}
                            className="w-[85vw] shrink-0 snap-center rounded-2xl bg-white p-6 shadow-sm sm:w-[350px] sm:p-8"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating
                                                ? "fill-[#FF9900] text-[#FF9900]"
                                                : "fill-muted text-muted"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {review.platform}
                                </span>
                            </div>
                            <blockquote className="mb-6 text-sm leading-relaxed text-foreground/80 sm:text-base">
                                "{review.content}"
                            </blockquote>
                            <div className="font-serif text-sm font-semibold italic text-primary">
                                — {review.customer_name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

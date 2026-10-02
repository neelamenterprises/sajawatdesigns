import { Testimonial } from "@/lib/types";
import { Star } from "lucide-react";
import Image from "next/image";

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

                {/* Masonry / Bento Grid Layout */}
                <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>div:not(:first-child)]:mt-6">
                    {testimonials.map((review) => (
                        <div
                            key={review.id}
                            className="break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
                        >
                            {/* If there's an image screenshot */}
                            {review.image_url ? (
                                <div className="relative">
                                    <Image
                                        src={review.image_url}
                                        alt={`Review from ${review.customer_name || 'customer'}`}
                                        width={600}
                                        height={800}
                                        className="h-auto w-full object-cover"
                                    />
                                    {/* Optional gradient overlay with platform badge */}
                                    <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                                        {review.platform}
                                    </div>
                                </div>
                            ) : null}

                            {/* Only show text section if there's actual text content to show */}
                            {(review.content || review.customer_name) ? (
                                <div className="p-6 sm:p-8">
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
                                        {!review.image_url && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                {review.platform}
                                            </span>
                                        )}
                                    </div>
                                    {review.content && (
                                        <blockquote className="mb-6 text-sm leading-relaxed text-foreground/80 sm:text-base">
                                            "{review.content}"
                                        </blockquote>
                                    )}
                                    {review.customer_name && (
                                        <div className="font-serif text-sm font-semibold italic text-primary">
                                            — {review.customer_name}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

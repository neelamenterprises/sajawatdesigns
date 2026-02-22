import Link from "next/link";
import { ArrowRight, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f9f5f0] via-[#fdf8f3] to-[#f5ede4]">
            {/* Decorative shapes */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-brand/5 blur-3xl" />

            {/* Subtle dot pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-widest text-primary uppercase">
                        <Gem className="h-3.5 w-3.5" />
                        Handpicked Collections
                    </div>

                    {/* Heading */}
                    <h1 className="mb-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl italic">
                        Jewellery that tells{" "}
                        <span className="not-italic text-primary">your story</span>
                    </h1>

                    {/* Subheading */}
                    <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Discover exquisite rings, necklaces, earrings & more — curated from
                        the finest collections on Amazon, Flipkart & Meesho.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 rounded-full px-8 text-sm font-medium tracking-wide shadow-md transition-all hover:shadow-lg hover:scale-[1.02]"
                        >
                            <Link href="/category/rings">
                                Explore Collection
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-full border-primary/30 px-8 text-sm font-medium tracking-wide transition-all hover:bg-primary/5"
                        >
                            <Link href="/about">Our Story</Link>
                        </Button>
                    </div>

                    {/* Trust bar */}
                    <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
                        <div className="text-center">
                            <p className="font-serif text-2xl font-semibold text-foreground">500+</p>
                            <p className="text-[11px] tracking-widest uppercase">Designs</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="text-center">
                            <p className="font-serif text-2xl font-semibold text-foreground">50k+</p>
                            <p className="text-[11px] tracking-widest uppercase">Happy Customers</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="text-center">
                            <p className="font-serif text-2xl font-semibold text-foreground">100%</p>
                            <p className="text-[11px] tracking-widest uppercase">Authentic</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

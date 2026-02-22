import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Mail, Shield, Heart, Gem, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Sajawat Designs — curating the finest jewellery from India's top marketplaces.",
};

const values = [
    {
        icon: Gem,
        title: "Curated Quality",
        description:
            "Every piece is handpicked from thousands of listings based on craftsmanship, reviews & value.",
    },
    {
        icon: Shield,
        title: "100% Authentic",
        description:
            "We only feature verified sellers with genuine certifications from trusted platforms.",
    },
    {
        icon: Heart,
        title: "Made with Love",
        description:
            "From traditional jadau to modern minimal — we celebrate jewellery for every personality.",
    },
    {
        icon: Users,
        title: "Community First",
        description:
            "Built by jewellery enthusiasts who understand what Indian women truly love to wear.",
    },
];

export default function AboutPage() {
    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#f9f5f0] via-background to-[#fdf8f3] py-20">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
                    <h1 className="font-serif text-4xl font-semibold tracking-tight italic sm:text-5xl">
                        About <span className="text-primary">Sajawat Designs</span>
                    </h1>
                    <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                        We curate the most exquisite jewellery from India&apos;s top
                        e-commerce platforms — Amazon, Flipkart &amp; Meesho. No middleman,
                        no markup. Just stunning pieces at the best prices.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                <h2 className="mb-6 font-serif text-2xl font-semibold italic">Our Story</h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                        Sajawat Designs was born out of a love for beautiful jewellery and
                        frustration with the endless scrolling across multiple shopping apps.
                        We noticed that finding the perfect ring or the right pair of
                        earrings meant opening ten tabs and comparing hundreds of listings.
                    </p>
                    <p>
                        So we built something better — a curated storefront where every
                        piece has been vetted for quality, craftsmanship, and value. When
                        you find something you adore, we take you directly to the platform
                        where it&apos;s sold, with full buyer protection from Amazon,
                        Flipkart, or Meesho.
                    </p>
                    <p>
                        From traditional gold jhumkas to modern diamond solitaires, from
                        bridal mangalsutras to everyday silver chains — we&apos;re your
                        personal jewellery concierge.
                    </p>
                </div>
            </section>

            <Separator className="mx-auto max-w-3xl" />

            {/* Values */}
            <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
                <h2 className="mb-10 text-center font-serif text-2xl font-semibold italic">
                    What We Stand For
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    {values.map((value) => (
                        <div
                            key={value.title}
                            className="rounded-xl border border-border/30 bg-card p-6 transition-shadow hover:shadow-md"
                        >
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-primary/5">
                                <value.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="mb-2 text-base font-semibold">{value.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="border-t border-border/30 bg-gradient-to-br from-[#f9f5f0] to-[#fdf8f3] py-16">
                <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
                    <h2 className="font-serif text-2xl font-semibold italic">Get in Touch</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Have questions or feedback? We&apos;d love to hear from you.
                    </p>

                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button asChild size="lg" className="h-12 gap-2 rounded-full px-8 text-sm font-medium">
                            <a
                                href="https://wa.me/919876543210"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Us
                            </a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-12 gap-2 rounded-full px-8 text-sm font-medium"
                        >
                            <a href="mailto:hello@sajawatdesigns.com">
                                <Mail className="h-4 w-4" />
                                Email Us
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

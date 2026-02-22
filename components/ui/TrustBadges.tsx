import { Shield, Truck, BadgeCheck, Gem } from "lucide-react";

const badges = [
    {
        icon: BadgeCheck,
        title: "100% Authentic",
        description: "Certified genuine jewellery",
    },
    {
        icon: Truck,
        title: "Free Delivery",
        description: "On orders above ₹999",
    },
    {
        icon: Shield,
        title: "Secure Shopping",
        description: "Via trusted platforms",
    },
    {
        icon: Gem,
        title: "Curated Quality",
        description: "Handpicked finest pieces",
    },
];

export function TrustBadges() {
    return (
        <section className="border-y border-border/30 bg-[#fdf8f3] py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {badges.map((badge) => (
                        <div
                            key={badge.title}
                            className="flex flex-col items-center gap-3 text-center"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/15 bg-primary/5">
                                <badge.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-wide">{badge.title}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {badge.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

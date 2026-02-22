import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Search", href: "/search" },
];

const collections = [
    { name: "Rings", href: "/category/rings" },
    { name: "Earrings", href: "/category/earrings" },
    { name: "Necklaces", href: "/category/necklaces" },
    { name: "Bracelets", href: "/category/bracelets" },
    { name: "Mangalsutra", href: "/category/mangalsutra" },
    { name: "Anklets & Chains", href: "/category/anklets-chains" },
];

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-card">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                S
                            </div>
                            <div>
                                <span className="font-serif text-xl font-semibold tracking-tight italic">
                                    Sajawat
                                </span>
                                <span className="ml-1 text-xs font-light tracking-[0.2em] uppercase text-muted-foreground">
                                    Designs
                                </span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Curating the finest jewellery from India&apos;s top marketplaces.
                            Every piece is handpicked for quality, craftsmanship &amp; value.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Collections */}
                    <div>
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
                            Collections
                        </h3>
                        <ul className="space-y-3">
                            {collections.map((cat) => (
                                <li key={cat.name}>
                                    <Link
                                        href={cat.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>hello@sajawatdesigns.com</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Sajawat Designs. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Products are sold &amp; fulfilled by Amazon, Flipkart &amp; Meesho.
                    </p>
                </div>
            </div>
        </footer>
    );
}

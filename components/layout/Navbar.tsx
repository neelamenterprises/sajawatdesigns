"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
    { name: "Rings", slug: "rings" },
    { name: "Earrings", slug: "earrings" },
    { name: "Necklaces", slug: "necklaces" },
    { name: "Bracelets", slug: "bracelets" },
    { name: "Mangalsutra", slug: "mangalsutra" },
    { name: "Anklets & Chains", slug: "anklets-chains" },
];

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
            {/* Top bar - subtle */}
            <div className="border-b border-border/30 bg-primary/5">
                <div className="mx-auto flex h-8 max-w-7xl items-center justify-center px-4 text-[11px] tracking-widest text-muted-foreground uppercase">
                    ✦ Free Shipping on Orders Above ₹999 &nbsp;•&nbsp; 100% Authentic Jewellery ✦
                </div>
            </div>

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        S
                    </div>
                    <div className="hidden sm:block">
                        <span className="font-serif text-xl font-semibold tracking-tight italic">
                            Sajawat
                        </span>
                        <span className="ml-1 text-xs font-light tracking-[0.2em] uppercase text-muted-foreground">
                            Designs
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden items-center gap-1 lg:flex">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-xs font-medium tracking-wide uppercase">
                            Home
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs font-medium tracking-wide uppercase">
                                Collections <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-48">
                            {categories.map((cat) => (
                                <DropdownMenuItem key={cat.slug} asChild>
                                    <Link href={`/category/${cat.slug}`} className="text-sm">{cat.name}</Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="/about">
                        <Button variant="ghost" size="sm" className="text-xs font-medium tracking-wide uppercase">
                            About
                        </Button>
                    </Link>
                </nav>

                {/* Desktop Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="hidden flex-1 items-center md:flex md:max-w-sm"
                >
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search jewellery..."
                            className="h-9 w-full rounded-full border-border/50 bg-secondary/50 pl-10 pr-4 text-sm transition-colors focus:bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                    {/* Mobile Search */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 md:hidden"
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    >
                        {mobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                    </Button>

                    {/* Wishlist (cosmetic) */}
                    <Button variant="ghost" size="icon" className="hidden h-9 w-9 sm:flex">
                        <Heart className="h-4 w-4" />
                    </Button>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <SheetTitle className="font-serif text-lg font-semibold italic">
                                Sajawat Designs
                            </SheetTitle>
                            <nav className="mt-8 flex flex-col gap-1">
                                <Link href="/">
                                    <Button variant="ghost" className="w-full justify-start text-sm tracking-wide">
                                        Home
                                    </Button>
                                </Link>
                                <div className="py-3">
                                    <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                        Collections
                                    </p>
                                    {categories.map((cat) => (
                                        <Link key={cat.slug} href={`/category/${cat.slug}`}>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start pl-6 text-sm font-normal"
                                            >
                                                {cat.name}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                                <Link href="/about">
                                    <Button variant="ghost" className="w-full justify-start text-sm tracking-wide">
                                        About Us
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {mobileSearchOpen && (
                <div className="border-t border-border/40 px-4 py-3 md:hidden">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search rings, earrings, necklaces..."
                                className="h-10 w-full rounded-full bg-secondary/50 pl-10 pr-4 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </form>
                </div>
            )}
        </header>
    );
}

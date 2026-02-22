"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FolderOpen, LogOut, Gem } from "lucide-react";
import { signOut } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
];

interface AdminSidebarProps {
    userEmail?: string | null;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-border/40 bg-card">
            {/* Brand */}
            <div className="flex h-16 items-center gap-2.5 border-b border-border/40 px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    <Gem className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-serif text-sm font-semibold italic">Sajawat</p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="border-t border-border/40 p-3">
                {userEmail && (
                    <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{userEmail}</p>
                )}
                <form action={signOut}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </form>
                <Link
                    href="/"
                    className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    ← Back to Store
                </Link>
            </div>
        </aside>
    );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useCallback, useState } from "react";

const platformOptions = [
    { id: "amazon", label: "Amazon", color: "#FF9900" },
    { id: "flipkart", label: "Flipkart", color: "#2874F0" },
    { id: "meesho", label: "Meesho", color: "#E91E63" },
];

interface FilterSidebarProps {
    maxPriceLimit?: number;
}

function FilterContent({ maxPriceLimit = 5000 }: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentMinPrice = Number(searchParams.get("minPrice")) || 0;
    const currentMaxPrice =
        Number(searchParams.get("maxPrice")) || maxPriceLimit;
    const currentPlatforms = searchParams.get("platforms")?.split(",") || [];

    const [priceRange, setPriceRange] = useState<number[]>([
        currentMinPrice,
        currentMaxPrice,
    ]);

    const updateFilters = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "" || value === "0") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });
            // Reset to page 1 when filters change
            params.delete("page");
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    const handlePlatformToggle = (platformId: string, checked: boolean) => {
        const newPlatforms = checked
            ? [...currentPlatforms, platformId]
            : currentPlatforms.filter((p) => p !== platformId);
        updateFilters({
            platforms: newPlatforms.length > 0 ? newPlatforms.join(",") : null,
        });
    };

    const handlePriceApply = () => {
        updateFilters({
            minPrice: priceRange[0] > 0 ? String(priceRange[0]) : null,
            maxPrice:
                priceRange[1] < maxPriceLimit ? String(priceRange[1]) : null,
        });
    };

    const handleClearAll = () => {
        router.push(pathname);
    };

    const hasActiveFilters =
        currentPlatforms.length > 0 ||
        currentMinPrice > 0 ||
        currentMaxPrice < maxPriceLimit;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                    Filters
                </h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                    >
                        Clear all
                    </Button>
                )}
            </div>

            <Accordion type="multiple" defaultValue={["price", "platform"]} className="w-full">
                {/* Price Range */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-medium">
                        Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 px-1 pt-2">
                            <Slider
                                min={0}
                                max={maxPriceLimit}
                                step={100}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="w-full"
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    ₹{priceRange[0].toLocaleString("en-IN")}
                                </span>
                                <span className="text-muted-foreground">
                                    ₹{priceRange[1].toLocaleString("en-IN")}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePriceApply}
                                className="w-full"
                            >
                                Apply Price
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Platform */}
                <AccordionItem value="platform">
                    <AccordionTrigger className="text-sm font-medium">
                        Platform
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-2">
                            {platformOptions.map((platform) => (
                                <label
                                    key={platform.id}
                                    className="flex cursor-pointer items-center gap-3"
                                >
                                    <Checkbox
                                        checked={currentPlatforms.includes(platform.id)}
                                        onCheckedChange={(checked) =>
                                            handlePlatformToggle(platform.id, checked === true)
                                        }
                                    />
                                    <span className="flex items-center gap-2 text-sm">
                                        <span
                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: platform.color }}
                                        />
                                        {platform.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export function FilterSidebar(props: FilterSidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
                <div className="sticky top-20 rounded-xl border border-border/50 bg-card p-5">
                    <FilterContent {...props} />
                </div>
            </aside>

            {/* Mobile Filter Button + Sheet */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                        <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
                        <div className="mt-6">
                            <FilterContent {...props} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

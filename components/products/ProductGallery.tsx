"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    name: string;
    discount?: number;
}

export function ProductGallery({ images, name, discount = 0 }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const hasMultiple = images.length > 1;

    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border/30 bg-[#faf7f2]">
                <Image
                    src={images[activeIndex] || "/placeholder.jpg"}
                    alt={`${name} - Image ${activeIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover p-4 transition-transform duration-500"
                    priority
                />

                {discount > 0 && (
                    <Badge className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                        -{discount}%
                    </Badge>
                )}

                {/* Navigation arrows */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={goPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={goNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Image counter */}
                {hasMultiple && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        {activeIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {hasMultiple && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-[#faf7f2] transition-all",
                                i === activeIndex
                                    ? "border-primary ring-1 ring-primary/30"
                                    : "border-border/30 hover:border-primary/50"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${name} - Thumbnail ${i + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover p-1"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

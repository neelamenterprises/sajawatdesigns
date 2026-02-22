import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/category/${category.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl bg-[#fdf8f3] border border-border/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    {/* Elegant gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif text-xl font-semibold text-white drop-shadow-md italic">
                        {category.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-white/80">
                        <span className="text-xs tracking-wide uppercase">Explore</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

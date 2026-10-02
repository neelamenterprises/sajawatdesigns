import Link from "next/link";
import { getCategories } from "@/lib/queries";

export async function PopularSearches() {
    const categories = await getCategories();

    const materials = ["Gold", "Diamond", "Solitaire", "Silver", "Platinum", "Rose Gold", "Gemstone"];
    const occasions = ["Wedding", "Engagement", "Everyday", "Party Wear", "Bridal"];
    
    // Sort categories alphabetically
    const sortedCats = [...categories].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="border-t border-border/40 bg-card py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-10 font-serif text-xl font-semibold tracking-tight">
                    Popular Searches
                </h2>

                <div className="space-y-10">
                    {/* General Materials Row */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-primary">Jewellery Materials</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {materials.map((mat) => (
                                <Link
                                    key={mat}
                                    href={`/search?q=${mat.toLowerCase()}`}
                                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                                >
                                    {mat} Jewellery
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Occasions Row */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-primary">Shop by Occasion</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {occasions.map((occ) => (
                                <Link
                                    key={occ}
                                    href={`/search?tags=${occ.split(" ")[0].toLowerCase()}`}
                                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                                >
                                    {occ} Jewellery
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Category Rows */}
                    {sortedCats.map((cat) => (
                        <div key={cat.id}>
                            <h3 className="mb-3 text-sm font-semibold text-primary">{cat.name}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <Link
                                    href={`/category/${cat.slug}`}
                                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                                >
                                    All {cat.name}
                                </Link>
                                {materials.slice(0, 5).map((mat) => (
                                    <Link
                                        key={`${cat.id}-${mat}`}
                                        href={`/search?q=${mat.toLowerCase()}+${cat.name.toLowerCase()}&categorySlug=${cat.slug}`}
                                        className="text-xs text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {mat} {cat.name}
                                    </Link>
                                ))}
                                {occasions.slice(0, 3).map((occ) => (
                                    <Link
                                        key={`${cat.id}-${occ}`}
                                        href={`/search?tags=${occ.split(" ")[0].toLowerCase()}&categorySlug=${cat.slug}`}
                                        className="text-xs text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {occ} {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

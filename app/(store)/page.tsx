import { HeroBanner } from "@/components/ui/HeroBanner";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategories, getTrendingProducts, getFeaturedProducts } from "@/lib/queries";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [categories, trendingProducts, featuredProducts] = await Promise.all([
    getCategories(),
    getTrendingProducts(),
    getFeaturedProducts(),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight italic sm:text-4xl">
            Our Collections
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore jewellery handpicked for every occasion
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Trending — "Most Loved" */}
      {trendingProducts.length > 0 && (
        <section className="bg-[#fdf8f3] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-semibold tracking-tight italic sm:text-4xl">
                  Most Loved
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bestsellers our customers can&apos;t stop buying
                </p>
              </div>
              <Link href="/search">
                <Button variant="ghost" className="hidden gap-1 text-primary sm:inline-flex">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {trendingProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured — "Editor's Pick" */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight italic sm:text-4xl">
              Editor&apos;s Picks
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Exquisite pieces handpicked by our design team
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="border-t border-border/30 bg-gradient-to-br from-[#f9f5f0] to-[#fdf8f3] py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-semibold tracking-tight italic sm:text-3xl">
            Stay in the Loop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to know about new arrivals, exclusive deals &amp; curated
            collections.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="h-12 rounded-full border border-border/50 bg-background px-6 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-72"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 rounded-full px-8 text-sm font-medium tracking-wide"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

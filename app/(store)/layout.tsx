import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WishlistProvider } from "@/components/store/WishlistProvider";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WishlistProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-8rem)]">{children}</main>
            <Footer />
        </WishlistProvider>
    );
}


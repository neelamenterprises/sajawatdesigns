import { WishlistClient } from "./WishlistClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Wishlist",
    description: "Your saved jewellery pieces on Sajawat Designs — view and buy your favourites from Amazon, Flipkart and Meesho.",
};

export default function WishlistPage() {
    return <WishlistClient />;
}

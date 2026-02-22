import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Sajawat Designs — Exquisite Jewellery Collection",
    template: "%s | Sajawat Designs",
  },
  description:
    "Discover exquisite jewellery from top platforms. Handpicked rings, earrings, necklaces, and bracelets from Amazon, Flipkart & Meesho.",
  keywords: [
    "jewellery",
    "rings",
    "earrings",
    "necklaces",
    "bracelets",
    "gold jewellery",
    "silver jewellery",
    "diamond jewellery",
    "sajawat designs",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

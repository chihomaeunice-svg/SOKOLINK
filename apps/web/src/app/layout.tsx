import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Soko Link — Tanzania's #1 Online Marketplace",
    template: "%s | Soko Link",
  },
  description:
    "Shop the best products from across Tanzania. Pay with M-Pesa, delivered to your door. Tanzania's #1 Online Marketplace.",
  keywords: [
    "tanzania",
    "online shopping",
    "mpesa",
    "e-commerce",
    "dar es salaam",
    "buy online",
    "tanzania marketplace",
  ],
  authors: [{ name: "Soko Link" }],
  creator: "Soko Link",
  openGraph: {
    type: "website",
    locale: "en_TZ",
    alternateLocale: "sw_TZ",
    url: "https://sokolink.co.tz",
    siteName: "Soko Link",
    title: "Soko Link — Tanzania's #1 Online Marketplace",
    description:
      "Shop the best products from across Tanzania. Pay with M-Pesa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soko Link",
    description: "Tanzania's #1 Online Marketplace",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1B4332",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}

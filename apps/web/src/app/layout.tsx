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
    default: "Soko Link — Kariakoo na Tanzania Yote",
    template: "%s | Soko Link",
  },
  description:
    "Nunua bidhaa bora kutoka Kariakoo na Tanzania nzima. Lipa kwa M-Pesa, pokea nyumbani. Tanzania's first Kariakoo-focused e-commerce marketplace.",
  keywords: [
    "kariakoo",
    "tanzania",
    "online shopping",
    "mpesa",
    "e-commerce",
    "dar es salaam",
    "nunua online",
  ],
  authors: [{ name: "Soko Link" }],
  creator: "Soko Link",
  openGraph: {
    type: "website",
    locale: "sw_TZ",
    alternateLocale: "en_TZ",
    url: "https://sokolink.co.tz",
    siteName: "Soko Link",
    title: "Soko Link — Kariakoo na Tanzania Yote",
    description:
      "Nunua bidhaa bora kutoka Kariakoo na Tanzania nzima. Lipa kwa M-Pesa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soko Link",
    description: "Tanzania's Kariakoo-focused e-commerce marketplace",
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
    <html lang="sw" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Discord Insights — Client-Side Discord Analytics Dashboard",
  description:
    "An interactive personal dashboard and analytical recap of your Discord history. Analyze message frequency, top servers, friend affinities, and billing trends completely client-side.",
  keywords: ["Discord", "Analytics", "Wrapped", "Insights", "Data Export", "Privacy-first"],
  authors: [{ name: "Discord Insights Team" }],
  openGraph: {
    title: "Discord Insights — Client-Side Discord Analytics Dashboard",
    description: "Explore your entire Discord history with stunning visuals and deep statistical breakdowns.",
    type: "website",
    siteName: "Discord Insights",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Insights — Client-Side Discord Analytics Dashboard",
    description: "Explore your entire Discord history with stunning visuals and deep statistical breakdowns.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

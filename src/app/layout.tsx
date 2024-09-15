import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BASE_URL, NAME } from "@/constants";
import { Analytics } from "@vercel/analytics/react";
import Banner from "@/components/banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: NAME,
    template: `%s | ${NAME}`,
  },
  description: "Developer and writer.",
  openGraph: {
    title: NAME,
    description: "Developer and writer.",
    url: BASE_URL,
    siteName: NAME,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: NAME,
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Banner />
        {children}
      </body>
      <Analytics />
    </html>
  );
}

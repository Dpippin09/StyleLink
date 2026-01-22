import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import RefreshToHomeWrapper from "@/components/RefreshToHomeWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StyleLink - Compare Shoe Prices",
  description: "Find the best prices for shoes across multiple online stores. Save money on Nike, Adidas, Jordans, and more.",
  keywords: "shoes, price comparison, deals, nike, adidas, jordan, sneakers, footwear, shopping",
  authors: [{ name: "StyleLink Team" }],
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#f5f2ed',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
          <RefreshToHomeWrapper>
            {children}
          </RefreshToHomeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
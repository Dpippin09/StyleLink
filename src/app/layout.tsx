import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import RefreshToHomeWrapper from "@/components/RefreshToHomeWrapper";
import InstallPWA from "@/components/InstallPWA";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StyleLink",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "StyleLink",
    title: "StyleLink - Compare Shoe Prices",
    description: "Find the best prices for shoes across multiple online stores",
  },
  twitter: {
    card: "summary",
    title: "StyleLink - Compare Shoe Prices",
    description: "Find the best prices for shoes across multiple online stores",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#3b82f6',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="StyleLink" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StyleLink" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <AuthProvider>
          <RefreshToHomeWrapper>
            {children}
          </RefreshToHomeWrapper>
          <InstallPWA />
        </AuthProvider>
      </body>
    </html>
  );
}
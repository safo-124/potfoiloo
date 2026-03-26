import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { RouteProgress } from "@/components/route-progress";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { PageViewTracker } from "@/components/page-view-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emmanuel Safo Acheampong | Signal Processing & ML Engineer",
  description:
    "Portfolio of Emmanuel Safo Acheampong — Signal Processing and Machine Learning Engineer. Explore my projects, research, publications, and technical blog.",
  keywords: [
    "Signal Processing",
    "Machine Learning",
    "Deep Learning",
    "DSP",
    "Portfolio",
    "Emmanuel Safo Acheampong",
  ],
  metadataBase: new URL("https://portfoilo-two-ivory.vercel.app"),
  openGraph: {
    title: "Emmanuel Safo Acheampong | Signal Processing & ML Engineer",
    description:
      "Signal Processing and Machine Learning Engineer. Explore my projects, research, and technical blog.",
    url: "https://portfoilo-two-ivory.vercel.app",
    siteName: "ESA Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Safo Acheampong | Signal Processing & ML Engineer",
    description:
      "Signal Processing and Machine Learning Engineer. Explore my projects, research, and technical blog.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="ESA Blog RSS" href="/api/rss" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RouteProgress />
          <Navbar />
          <main id="main-content">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}

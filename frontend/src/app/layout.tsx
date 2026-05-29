import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Analytics } from "@/components/analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | CareerCopilot AI",
    default: "CareerCopilot AI — Your Intelligent Career Assistant",
  },
  description:
    "AI-powered career platform with smart job matching, resume analysis, interview preparation, and automated job applications. Accelerate your career with CareerCopilot.",
  keywords: [
    "AI career assistant",
    "job search AI",
    "resume analyzer",
    "ATS score",
    "interview practice",
    "auto apply jobs",
    "career copilot",
    "AI job matching",
    "semantic job search",
    "career platform",
  ],
  authors: [{ name: "CareerCopilot AI" }],
  creator: "CareerCopilot AI",
  publisher: "CareerCopilot AI",
  metadataBase: new URL("https://careercopilot.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careercopilot.ai",
    siteName: "CareerCopilot AI",
    title: "CareerCopilot AI — Your Intelligent Career Assistant",
    description:
      "AI-powered career platform with smart job matching, resume analysis, interview preparation, and automated job applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareerCopilot AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerCopilot AI — Your Intelligent Career Assistant",
    description:
      "AI-powered career platform with smart job matching, resume analysis, interview preparation, and automated job applications.",
    images: ["/og-image.png"],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "application-name": "CareerCopilot AI",
    "apple-mobile-web-app-title": "CareerCopilot",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#050816] text-white`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}

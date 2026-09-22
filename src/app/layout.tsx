import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
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
  title: "JobFlow — AI Job Application Toolkit",
  description: "Paste a job description. Get a tailored CV and cover letter in under 2 minutes. Self-hosted on Vercel, powered by Claude. One-time purchase.",
  openGraph: {
    title: "JobFlow — AI Job Application Toolkit",
    description: "Paste a job description. Get a tailored CV and cover letter in under 2 minutes. Self-hosted on Vercel, powered by Claude. One-time purchase.",
    type: "website",
    siteName: "JobFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobFlow — AI Job Application Toolkit",
    description: "Paste a job description. Get a tailored CV and cover letter in under 2 minutes. Self-hosted on Vercel, powered by Claude.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" />
        {children}
      </body>
      <Analytics />
      {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token":"${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          strategy="afterInteractive"
        />
      )}
    </html>
  );
}

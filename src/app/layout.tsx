import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

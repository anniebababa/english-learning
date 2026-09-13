import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "無聊就來學英文",
  description: "每天一句實用日常英文，輕鬆開口說英文。12 大分類、350+ 句，附發音、測驗、收藏功能。",
  openGraph: {
    title: "無聊就來學英文",
    description: "每天一句，輕鬆開口說英文。12 大分類、350+ 句，附發音、測驗、收藏功能。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "無聊就來學英文",
    description: "每天一句，輕鬆開口說英文。12 大分類、350+ 句，附發音、測驗、收藏功能。",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16">
        {children}
        <NavBar />
        <ScrollToTop />
      </body>
    </html>
  );
}

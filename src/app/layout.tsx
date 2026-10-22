import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SiteHeader from "@/components/SiteHeader";
import WebAppProvider from "@/components/WebAppProvider";
import "./globals.css";
import "./mobile.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "勇士班經文 · 讓真理走進日常",
  description:
    "學員版與領袖版經文卡，透過閱讀、默想與自由練習，將神的話收藏在心裡。",
  applicationName: "勇士班經文",
  appleWebApp: {
    capable: true,
    title: "勇士班經文",
    statusBarStyle: "default",
  },
  icons: { apple: "/icons/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f7f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a className="skip-link" href="#main-content">
          跳至主要內容
        </a>
        <WebAppProvider>
          <SiteHeader />
          {children}
        </WebAppProvider>
      </body>
    </html>
  );
}

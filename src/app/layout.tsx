import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "經文背誦測驗-領袖版",
  description: "經文背誦測驗 領袖版 - 透過經文背誦測驗來學習聖經",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-mobile-bg lg:bg-desktop-bg bg-cover bg-left-bottom lg:bg-center text-black`}
      >
        {children}
      </body>
    </html>
  );
}

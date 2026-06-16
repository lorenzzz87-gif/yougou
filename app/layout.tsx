import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "友购 - 最简单的叫货平台",
  description: "B2B 订货管理平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className="h-full">
      <body className="min-h-full bg-gray-50">{children}</body>
    </html>
  );
}

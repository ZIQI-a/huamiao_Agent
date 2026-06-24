import type { Metadata } from "next";
import { Inter, ZCOOL_KuaiLe } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const zcoolKuaiLe = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zcool",
});

export const metadata: Metadata = {
  title: "话喵 — AI 智能创作平台",
  description:
    "话喵是 AI 驱动的文章创作、古诗词生成与风格仿写平台，像一只陪伴你写作的创意猫咪伙伴。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${zcoolKuaiLe.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

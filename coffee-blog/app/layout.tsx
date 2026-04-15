import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Work_Sans } from "next/font/google";
import "./globals.css";

/* Display font for hero moments - Plus Jakarta Sans */
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* Body font for long-form readability - Work Sans */
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Coffee Knowledge - 日常のコーヒーを知識資産に",
  description: "コーヒーの知識を体系立てて情報発信・記録。スペシャルティコーヒーの世界を探求する。",
  keywords: ["コーヒー", "スペシャルティコーヒー", "珈琲", "コーヒー知識", "抽出", "焙煎"],
  authors: [{ name: "Coffee Knowledge" }],
  openGraph: {
    title: "Coffee Knowledge - 日常のコーヒーを知識資産に",
    description: "コーヒーの知識を体系立てて情報発信・記録。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${plusJakarta.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}

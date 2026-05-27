import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Work_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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

const baseUrl = 'https://coffee-blog-eta.vercel.app';

export const metadata: Metadata = {
  verification: {
    google: 'yzJD7J80XXiK0Jj2by9D_pbieNw3xFra32noe8pWn9c',
  },
  title: "Coffee Knowledge - いつも飲んでいるコーヒーをできるだけ自分の言葉で探しています。",
  description: "コーヒーとAIを使ってブログを書いてみました。手探りですがどんな記録でも残していこうと思います。",
  keywords: ["コーヒー", "スペシャルティコーヒー", "珈琲", "コーヒー知識", "抽出", "焙煎"],
  authors: [{ name: "Coffee Knowledge" }],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Coffee Knowledge - いつも飲んでいるコーヒーをできるだけ自分の言葉で探しています。",
    description: "コーヒーとAIを使ってブログを書いてみました。手探りですがどんな記録でも残していこうと思います。",
    type: "website",
    url: baseUrl,
    siteName: "Coffee Knowledge",
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Coffee Knowledge - いつも飲んでいるコーヒーをできるだけ自分の言葉で探しています。",
    description: "コーヒーとAIを使ってブログを書いてみました。手探りですがどんな記録でも残していこうと思います。"
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
    <html
      lang="ja"
      className={`${plusJakarta.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      )}
    </html>
  );
}

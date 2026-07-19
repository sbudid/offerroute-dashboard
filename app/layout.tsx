import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OfferRoute — Affiliate Link Control Center",
  description: "OfferRoute — affiliate link control center prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/prototype.css" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

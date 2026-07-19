import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OfferRoute Dashboard",
  description: "Link management and offer routing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}

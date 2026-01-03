import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RS Automation - Inventory Catalog",
  description: "Browse our inventory of process equipment and automation systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}


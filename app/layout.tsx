import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "RS Automation - Used Food Process & Plant Automation Equipment",
  description: "Quality used food processing, plant automation, and industrial equipment. Pumps, valves, mixers, PLCs, sensors, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}

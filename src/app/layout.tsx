import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proof — Garment VTO",
  description: "YouCam API Skin AI & eCommerce VTO Hackathon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-gray-100">
        {children}
      </body>
    </html>
  );
}

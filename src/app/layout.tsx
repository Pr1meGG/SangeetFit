import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SangeetFit — Indian Wedding Outfit Styling",
  description: "Occasion-curated outfit gallery with skin-tone harmony scoring and virtual try-on, powered by the YouCam API.",
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

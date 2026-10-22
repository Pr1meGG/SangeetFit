import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = { themeColor: "#FBF7EF", viewportFit: "cover" };

export const metadata: Metadata = {
  title: "SangeetFit — Indian Wedding Outfit Styling",
  description: "Find outfit inspiration for your next celebration and explore personal virtual try-on with SangeetFit.",
  icons: {
    icon: [{ url: "/brand/app-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/app-icon.svg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a href="#main-content" className="sf-skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}

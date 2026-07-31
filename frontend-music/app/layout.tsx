import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muse Library",
  description: "Personal music library with search, analytics, and AI insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full antialiased">
        {children}
      </body>
    </html>
  );
}

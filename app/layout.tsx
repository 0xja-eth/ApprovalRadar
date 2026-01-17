import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApprovalRadar",
  description: "Real-time monitoring of large approval events across multiple blockchains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

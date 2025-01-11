import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leo - the language tutor",
  description: "A new way to learn a language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Platypi:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />

      </head>
      <body
        className={`font-sans bg-background`}
      >
        {children}
      </body>
    </html>
  );
}

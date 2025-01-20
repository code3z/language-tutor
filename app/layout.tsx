import type { Metadata } from "next";
import "./globals.css";
import { Platypi } from 'next/font/google'

export const metadata: Metadata = {
  title: "Leo - the language tutor",
  description: "A new way to learn a language",
};

const platypi = Platypi({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-platypi',
})

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
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="languagetutor.app" />
        <meta property="twitter:url" content="https://languagetutor.app" />
        <meta name="twitter:title" content="Leo - the language tutor" />
        <meta name="twitter:description" content="A new way to learn a language" />
        <meta name="twitter:image" content="https://languagetutor.app/screenshot.png" />
        <meta property="og:image" content="https://languagetutor.app/screenshot.png" />
      </head>
      <body
        className={`${platypi.variable} bg-background`}
      >
        {children}
      </body>
    </html>
  );
}

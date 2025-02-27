import type { Metadata } from "next";
import "./globals.css";
import "../public/css/style.css"; 
import "../public/css/all.min.css"; // Importing the CSS file directly
import { Analytics } from "@vercel/analytics/react"
import PageAnimatePresence from '../components/PageAnimatePresence'

export const metadata: Metadata = {
  title: "Fitness Geek",
  description: "Fitness & Nutrition tracking and goal setting app, for better health!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
      </head>
      <body className="antialiased">
        <PageAnimatePresence>{children}</PageAnimatePresence>
        {
          process.env.NEXT_PUBLIC_ENV_NAME === 'live' && <Analytics/> // Only load the analytics script in production
        }
      </body>
    </html>
  );
}

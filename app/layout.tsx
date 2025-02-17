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
      <body className="antialiased">
        <PageAnimatePresence>{children}</PageAnimatePresence>
        {
          process.env.NEXT_PUBLIC_ENV_NAME === 'live' && <Analytics/> // Only load the analytics script in production
        }
      </body>
    </html>
  );
}

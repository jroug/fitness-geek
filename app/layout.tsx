import type { Metadata } from "next";
import "./globals.css";
import "../public/css/style.css"; 
import "../public/css/all.min.css"; // Importing the CSS file directly
import { Analytics } from "@vercel/analytics/react"
import HeaderGate from "@/components/HeaderGate";
import SidebarGate from "@/components/SidebarGate";
// import PageAnimatePresence from '../components/PageAnimatePresence'
// import BottomBar from "@/components/BottomBar";

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
    <html lang="en" data-scroll-behavior="smooth" >
      <head>
        <link rel="apple-touch-icon" href="/images/favicon/favicon-dumbbell.svg" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon/favicon-dumbbell.svg" />
        <link rel="shortcut icon" href="/images/favicon/favicon-dumbbell.svg" />
      </head>
      <body className="antialiased">
        <HeaderGate />
        {children}
        <SidebarGate />
        {
          process.env.NEXT_PUBLIC_ENV_NAME === 'live' && <Analytics/> // Only load the analytics script in production
        }
      </body>
    </html>
  );
}

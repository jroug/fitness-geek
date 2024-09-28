import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

 

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
        <link rel="stylesheet" href="/css/all.min.css" />
      </head>
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

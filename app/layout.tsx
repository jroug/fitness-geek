import type { Metadata } from "next";
import "./globals.css";
import "../public/css/style.css"; 
import "../public/css/all.min.css"; // Importing the CSS file directly
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
        {
           process.env.NEXT_PUBLIC_ENV_NAME === 'develop' ? 
           <div>NO ACCESS</div> 
           : 
           <PageAnimatePresence>{children}</PageAnimatePresence>
        }
        
      </body>
    </html>
  );
}

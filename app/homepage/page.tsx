// app/homepage/layout.tsx
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";
import Homepage from "./Homepage";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <Header homeUrl="/homepage" title="FITNESS GEEK" />
        <main className="site-content">
            <Homepage />
        </main>
        <BottomBar />
        <SideBar />
    </>
  );
}
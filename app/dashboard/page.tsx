// app/dashboard/layout.tsx
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import SideBar from "@/components/SideBar";
import Dashboard from "./dashboard";

export default function Page() {
  return (
    <>
        <Header homeUrl="/dashboard" title="FITNESS GEEK" />
        <main className="site-content">
            <Dashboard />
        </main>
        <BottomBar />
        <SideBar />
    </>
  );
}
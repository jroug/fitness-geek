// app/dashboard/layout.tsx
import BottomBar from "@/components/BottomBar";
import Dashboard from "./dashboard";

export default function Page() {
  return (
    <>
        <main className="site-content">
            <Dashboard />
        </main>
        <BottomBar />
    </>
  );
}
import { Suspense } from "react";
import AddWorkout from "./AddWorkout";
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import InnerLink from "@/components/InnerLink";
 

export default function Page() {
  return (
    <>
      <main className="site-content">
          <Header title="Add Workout" backUrl="/homepage" />
          <InnerLink title="Calendar" goToUrl="/calendar" />
          <Suspense fallback={null}>
                <AddWorkout />
          </Suspense>
      </main>
      <SideBar />
    </>
  );
}
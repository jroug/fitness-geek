import { Suspense } from "react";
import AddWorkout from "./AddWorkout";
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import InnerLink from "@/components/InnerLink";
 

export default function Page() {
  return (
    <>
      <Header title="Add Workout" backUrl="/dashboard" />
      <main className="site-content form-width">
          <InnerLink title="Calendar" goToUrl="/calendar" />
          <Suspense fallback={null}>
                <AddWorkout />
          </Suspense>
      </main>
      <SideBar />
    </>
  );
}
import { Suspense } from "react";
import LogWorkout from "./LogWorkout";
 

export default function Page() {
  return (
    <>
      <main className="site-content form-width">
          <Suspense fallback={null}>
                <LogWorkout />
          </Suspense>
      </main>
    </>
  );
}
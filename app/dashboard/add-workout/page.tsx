import { Suspense } from "react";
import AddWorkout from "./AddWorkout";
 

export default function Page() {
  return (
    <>
      <main className="site-content form-width">
          <Suspense fallback={null}>
                <AddWorkout />
          </Suspense>
      </main>
    </>
  );
}
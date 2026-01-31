import { Suspense } from "react";
import AddWorkout from "./AddWorkout";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AddWorkout />
    </Suspense>
  );
}
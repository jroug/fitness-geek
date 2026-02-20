import type { Metadata } from "next";
import FeaturesPageContent from "./FeaturesPageContent";

export const metadata: Metadata = {
  title: "Features | Fitness Geek",
  description: "Explore all core features of Fitness Geek for tracking workouts, meals, and progress.",
};

export default function Page() {
  return <FeaturesPageContent />;
}

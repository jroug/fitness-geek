import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "Fitness Geek",
  description: "Fitness & Nutrition tracking and goal setting app, for better health!",
};

export default function Page() {
  return <LandingPage />;
}

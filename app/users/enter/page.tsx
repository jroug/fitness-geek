import type { Metadata } from "next";
import EnterPage from "./EnterPage";

export const metadata: Metadata = {
  title: "Login | Fitness Geek",
  description: "Sign in to your Fitness Geek account.",
};

export default function Page() {
  return <EnterPage />;
}

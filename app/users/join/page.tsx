import type { Metadata } from "next";
import JoinPage from "./JoinPage";

export const metadata: Metadata = {
  title: "Register | Fitness Geek",
  description: "Create your Fitness Geek account.",
};

export default function Page() {
  return <JoinPage />;
}

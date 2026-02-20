import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact | Fitness Geek",
  description: "Contact Fitness Geek for support, questions, and feedback.",
};

export default function Page() {
  return <ContactPageContent />;
}

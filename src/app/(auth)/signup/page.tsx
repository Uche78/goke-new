import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Goke account",
};

export default function SignupPage() {
  return <SignupForm />;
}

import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <div className="hero-grid flex-1 py-12">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <Logo />
          <p className="mt-6 font-display text-4xl font-semibold leading-tight text-foreground">
            Start booking in minutes
          </p>
          <p className="mt-4 max-w-md text-muted">
            Create a demo account to explore the BookEase customer experience. No backend auth in
            Phase 1.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}

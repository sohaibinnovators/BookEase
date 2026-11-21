import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/ui/Logo";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="hero-grid flex-1 py-12">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <Logo />
          <p className="mt-6 font-display text-4xl font-semibold leading-tight text-foreground">
            Book Smarter. Live Better.
          </p>
          <p className="mt-4 max-w-md text-muted">
            Access your upcoming appointments, booking history, and profile settings from the
            customer dashboard.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}

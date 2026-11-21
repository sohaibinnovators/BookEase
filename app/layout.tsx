import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookEase — Book Smarter. Live Better.",
    template: "%s · BookEase",
  },
  description:
    "BookEase is a demo booking and appointment UI for discovering services, comparing providers, and scheduling with localStorage-backed availability.",
  keywords: [
    "BookEase",
    "booking demo",
    "appointment scheduling",
    "service discovery",
    "Next.js portfolio",
  ],
  openGraph: {
    title: "BookEase — Book Smarter. Live Better.",
    description:
      "A polished frontend booking system demo with services, providers, calendars, and localStorage persistence.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

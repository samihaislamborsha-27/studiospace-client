import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "StudioSpace | Find Your Creative Space",
  description:
    "Discover inspiring creative studios and spaces for photography, music, podcasts, film, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>

            <main className="flex-1">{children}</main>

            <Footer />

            <Toaster
              position="top-right"
              richColors
              closeButton
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

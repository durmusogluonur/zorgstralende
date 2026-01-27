import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Stralendezorg - Persoonlijke Thuiszorg",
  description: "Stralendezorg is een kleinschalige thuiszorg bedrijf die de cliënt en de verzorgende graag in verbintenis wilt brengen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="nl">
      <head>
        {recaptchaSiteKey && (
          <Script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`}
            strategy="afterInteractive"
            async
            defer
          />
        )}
      </head>
      <body className="font-sans antialiased">
        <Navigation />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

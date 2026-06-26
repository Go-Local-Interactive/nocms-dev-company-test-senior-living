import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HelpBadge } from "@/components/layout/HelpBadge";
import { ExitIntent } from "@/components/layout/ExitIntent";

export const metadata: Metadata = {
  title: { default: "Test Senior Living", template: "%s | Test Senior Living" },
  description: "Built with NoCMS",
};
// Inspector script is gated server-side by env (set only by the editor when
// spawning preview dev servers). The script self-no-ops without ?nocms-edit=1.
const editorOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {editorOrigin && (
          <script async src={`${editorOrigin}/nocms/nocms-inspector.js`} />
        )}
      </head>
      <body className="font-body antialiased text-text bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-background focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <HelpBadge />
        <ExitIntent />
      </body>
    </html>
  );
}

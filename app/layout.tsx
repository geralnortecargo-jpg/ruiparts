import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import AppShell from "@/components/AppShell";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "O Mundo das Sucatas",
  description: "Peças de desmontagem com origem, estado e reserva confirmada pelo pátio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Familiar | Time Manager",
  description: "A gamified productivity companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} ${mono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-transparent text-foreground overflow-x-hidden selection:bg-white/20">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col min-h-screen p-4 md:p-8">
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { MediaBackground } from "@/components/ui/MediaBackground";
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
  title: "Sidekick | Pokémon Manager",
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
      className={`${inter.variable} ${instrument.variable} ${mono.variable} antialiased dark`}
    >
      <body className="h-screen w-screen overflow-hidden font-sans text-foreground selection:bg-white/20 flex flex-col">
        <MediaBackground />
        
        {/* The Desktop environment container */}
        <div className="relative z-10 flex-1 w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-7xl h-full flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

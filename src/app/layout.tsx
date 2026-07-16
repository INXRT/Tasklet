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

import { ScaleWrapper } from "@/components/ui/ScaleWrapper";

import { Providers } from "@/components/Providers";
import { GlobalLoaderProvider } from "@/components/GlobalLoader";

export const metadata: Metadata = {
  title: "PokéQuest | Pokémon Manager",
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
      <body className="h-dvh w-dvw overflow-hidden font-sans text-foreground selection:bg-white/20 flex flex-col">
        <Providers>
          <GlobalLoaderProvider>
            <MediaBackground />
          
          {/* The Desktop environment container */}
          <ScaleWrapper targetWidth={1280} targetHeight={800} padding={24}>
            <div className="w-full h-full flex flex-col">
              {children}
            </div>
          </ScaleWrapper>
          </GlobalLoaderProvider>
        </Providers>
      </body>
    </html>
  );
}

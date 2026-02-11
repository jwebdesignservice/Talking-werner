import type { Metadata } from "next";
import { Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Existential Finance | $WERNER",
  description: "The AI that talks back. Ask Werner anything. Ape 4+ SOL and Werner sees you, speaks to you. Philosophical degen wisdom from the void.",
  keywords: ["Werner Herzog", "Existential Finance", "Solana", "Penguin", "Crypto", "Meme Coin", "$WERNER"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

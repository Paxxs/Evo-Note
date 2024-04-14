import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import "./themes.css";

import { cn } from "@/lib/utils";
import Provider from "./providers";
import { type ReactNode } from "react";

const fontSans = FontSans({
  subsets: ["latin-ext"],
  variable: "--font-sans",
});
// const inter = Inter({ subsets: ["latin"] });
const noteSC = Noto_Sans_SC({
  subsets: ["latin", "cyrillic"],
  variable: "--font-cn",
});

export const metadata: Metadata = {
  title: "V2Note | A Cutting-Edge, Privacy-Centric Note-taking Experience",
  description:
    "Unleash your productivity with v2Note, where elegance meets innovation. Dive into a dual editing paradigm, blending Notion-like block organization with a boundless whiteboard canvas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // const [config] = useConfig();
  return (
    <html lang="en" suppressHydrationWarning className="overflow-hidden">
      {/* <body className={inter.className}>{children}</body> */}
      <body
        className={cn(
          "h-dvh bg-background/0 font-sans antialiased",
          fontSans.variable,
          noteSC.variable,
        )}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

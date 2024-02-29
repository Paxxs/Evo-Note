import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={inter.className}>{children}</body> */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          noteSC.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

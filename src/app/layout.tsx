import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google'
import "./globals.scss";
import RightClickBlocker from "./right_click_blocker";
import { Box } from "@mui/material";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ['latin']
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeHub - Moe's",
  description: "WMS for Moe's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
        {process.env.NODE_ENV === 'production' ? (
          <RightClickBlocker>
              { children }
          </RightClickBlocker>
        ) : (
          <Box>
            { children }
          </Box>
        )}

      </body>
    </html>
  );
}

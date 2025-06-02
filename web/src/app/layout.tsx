import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/providers/Provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolos da TI",
  description: 'Controle as Bóloss de bolo da sua equipe de TI'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <Providers>
      <html lang="pt">
        <body>{children}</body>
      </html>
    </Providers>
  )
}

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/app/providers";
import Header from "@/components/app/Header";

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: false,
});

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "aplicacion web2",
  description: "Ecommerce de productos",
  icons: {
    icon: "/favicon.svg",
  },
};

/**
 * RootLayout component
 *
 * This component serves as the root layout for the entire application.
 * It wraps the app with `Providers` (tema, AuthProvider y Toaster), aplica estilos globales e incluye la cabecera.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The root layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="container mx-auto space-y-4 p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

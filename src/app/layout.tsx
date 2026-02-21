/* ============================================
   CHIACCHIO - Layout Principal de la App
   ============================================ */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { MainLayout } from "@/components/layout";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Chiacchio - Mantenimiento Domiciliario por Membresía",
  description: "Servicios de mantenimiento domiciliario por membresía mensual. Mantenemos tu hogar en óptimas condiciones con profesionales de confianza.",
  keywords: ["mantenimiento", "hogar", "membresía", "servicios domiciliarios", "reparaciones", "obra"],
  authors: [{ name: "Chiacchio" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable}`}>
        <AuthProvider>
          <ToastProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

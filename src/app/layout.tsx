import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PortfolioSidebar } from "@/components/portfolio-sidebar";
import { LanguageProvider } from "@/context/language-context";
import { LoadingProvider } from "@/context/loading-context";
import { MobileHeader } from "@/components/mobile-header";
import { BackgroundElements } from "@/components/background-elements";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edilberto A. Lima Jr. | Portfólio",
  description: "Portfólio de Edilberto A. Lima Jr., Analista e Desenvolvedor",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.ico",
  },
  alternates: {
    languages: {
      "pt-BR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "Edilberto A. Lima Jr. | Portfólio",
    description: "Portfólio de Edilberto A. Lima Jr., Analista e Desenvolvedor",
    locale: "pt_BR",
    alternateLocale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <LoadingProvider>
              <SidebarProvider>
                {/* Background Elements */}
                <BackgroundElements />

                <div className="flex flex-col lg:flex-row min-h-screen">
                  {/* Desktop Sidebar - hidden on small screens */}
                  <PortfolioSidebar />

                  {/* Main Content with Mobile Header */}
                  <div className="flex-1 flex flex-col lg:ml-[320px]">
                    {/* Mobile Header - visible only on small screens */}
                    <MobileHeader />

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto w-full">
                      {children}
                    </main>
                  </div>
                </div>
                <Analytics />
              </SidebarProvider>
            </LoadingProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

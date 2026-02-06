import type React from "react";
import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PortfolioSidebar } from "@/components/portfolio-sidebar";
import { LanguageProvider } from "@/context/language-context";
import { MobileHeader } from "@/components/mobile-header";
import { BackgroundElements } from "@/components/background-elements";
import { Analytics } from "@vercel/analytics/next";

// Primary font - modern, clean, geometric
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Display font - bold, impactful for headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SidebarProvider>
              {/* Aurora Background */}
              <BackgroundElements />

              {/* Noise texture overlay for depth */}
              <div className="noise-overlay" />

              <div className="flex flex-col lg:flex-row min-h-screen relative">
                {/* Desktop Sidebar - hidden on small screens */}
                <PortfolioSidebar />

                {/* Main Content with Mobile Header */}
                <div className="flex-1 flex flex-col lg:ml-[280px] xl:ml-[300px]">
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
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

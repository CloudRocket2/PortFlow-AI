import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { TelemetryProvider } from "@/hooks/useTelemetry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortFlow AI — Container Routing Optimizer",
  description:
    "Automated Port Freight & Container Routing Optimizer — Real-time Digital Twin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex overflow-hidden bg-[#0f172a]">
        <TelemetryProvider>
          {/* Left Sidebar — always visible */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Top Header with global metrics */}
            <Header />

            {/* Page Content — scrollable */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </TelemetryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { TelemetryProvider } from "@/hooks/useTelemetry";
import { ChatProvider } from "@/context/ChatContext";
import { PortFlowProvider } from "@/context/PortFlowContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortFlow AI - Terminal OS",
  description: "Next-Gen Terminal Operating System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex overflow-hidden bg-black">
        <TelemetryProvider>
          <PortFlowProvider>
            <ChatProvider>
              <AppShell>{children}</AppShell>
            </ChatProvider>
          </PortFlowProvider>
        </TelemetryProvider>
      </body>
    </html>
  );
}

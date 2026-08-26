"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Quick client-side check for hackathon auth
    const role = localStorage.getItem("portflow_role");
    
    if (role) {
      setIsAuthenticated(true);
      // If logged in and trying to view the login page, bounce to dashboard
      if (pathname === "/login") {
        router.push("/");
      }
    } else {
      setIsAuthenticated(false);
      // If not logged in and trying to view app, bounce to login
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  // Prevent UI flashing while checking auth
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-black" />;
  }

  if (pathname === "/login") {
    return <main className="w-full h-full">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </>
  );
}

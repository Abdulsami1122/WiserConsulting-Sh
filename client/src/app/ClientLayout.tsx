"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "min-h-[calc(100vh-160px)] mt-20" : ""}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

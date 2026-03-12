"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Home } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shadcn-space/blocks/sidebar-01/app-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Helper function to check if user is admin (handles both number and string roles)
  const isAdmin = (role: string | number | undefined): boolean => {
    return role === 1 || role === '1' || role === 'admin';
  };

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Small delay to ensure Redux state is hydrated
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isClient || isChecking) return;
    
    // Redirect if not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // Redirect if not admin (role 1)
    if (!isAdmin(user.role)) {
      router.replace("/");
    }
  }, [user, router, isClient, isChecking]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Show loading state while checking auth or during SSR
  if (!isClient || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not admin
  if (!isAdmin(user.role)) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* ---------------- Main ---------------- */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4">
          <SidebarTrigger className="cursor-pointer" />
          <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
            {/* User info - hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden lg:block">
                <span className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</span>
                <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full">
                  Admin
                </span>
              </div>
            </div>
            {/* Mobile: just avatar */}
            <div className="md:hidden w-9 h-9 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}

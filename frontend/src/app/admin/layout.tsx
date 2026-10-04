"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  Tags, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  LogOut, 
  Coffee,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Menu Items", href: "/admin/menu", icon: MenuIcon },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Staff", href: "/admin/staff", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // The login page manages its own layout, so we bypass the dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Protect all other admin routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-background">
        <Loader2 className="w-8 h-8 text-cafe-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-cafe-text">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Coffee className="text-cafe-primary mr-3 w-6 h-6" />
          <span className="font-serif font-bold text-xl text-cafe-primary">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-cafe-primary text-white font-medium shadow-sm' 
                    : 'hover:bg-cafe-secondary/30 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {pathname.split("/").pop()?.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-cafe-primary text-white rounded-full flex items-center justify-center font-bold font-serif">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
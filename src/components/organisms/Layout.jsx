import { useState } from "react";
import { Outlet } from "react-router-dom";
import DesktopSidebar from "@/components/organisms/DesktopSidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary-50 flex">
      <DesktopSidebar />
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
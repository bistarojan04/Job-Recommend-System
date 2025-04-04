
import { ReactNode } from "react";
import NavBar from "./NavBar";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <NavBar />
      <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="border-t border-white/10 py-4 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center md:flex-row md:justify-between text-sm text-muted-foreground">
          <div className="flex items-center mb-2 md:mb-0">
            <span className="gradient-text text-lg mr-1">FutureJobs</span> 
            <span>Portal</span> © {new Date().getFullYear()}
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

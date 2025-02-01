"use client";
import GlobalSidebar from "@/components/PublicComp/global-sidebar";
import { cn } from "@/lib/utils";
import React from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
}
const HomeLayout = ({ children }: HomeLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <GlobalSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={cn(
          "min-h-screen transition-all duration-300 lightBg dark:darkBg",
          isSidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;

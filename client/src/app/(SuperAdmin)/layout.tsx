"use client";
import React from "react";
import { cn } from "@/lib/utils";
import SuperAdminSidebar from "@/components/SuperAdminComp/superadmin-sidebar";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={cn(
          "min-h-screen transition-all duration-300 p-2 lightBg dark:darkBg",
          isSidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default SuperAdminLayout;

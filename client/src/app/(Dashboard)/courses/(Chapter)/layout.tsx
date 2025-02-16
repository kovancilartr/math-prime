"use client";
import React from "react";
import ChapterSidebar from "@/components/DashboardComp/chapter-sidebar";
import { cn } from "@/lib/utils";
import ChapterHeader from "@/components/DashboardComp/chapter-header";

interface ChapterLayoutProps {
  children: React.ReactNode;
}
const ChapterLayout = ({ children }: ChapterLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-row">
      <ChapterSidebar />
      <div className="flex flex-col min-h-screen w-full">
        <ChapterHeader />
        <div
          className={cn(
            "h-full transition-all duration-300 lightBg dark:darkBg"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChapterLayout;

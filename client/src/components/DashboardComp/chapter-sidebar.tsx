"use client";
import React from "react";
import { cn } from "@/lib/utils";
import ChapterSidebarItem from "./chapter-sidebar-item";
import { useAuthStore, useQueryStore } from "@/store/useAuthStore";

const ChapterSidebar = () => {
  const { chapterSideBarVisible } = useQueryStore();
  return (
    <aside
      className={cn(
        "hidden lg:flex h-screen w-96 bg-myColor1-100 dark:bg-myColor1-400 border-r-2 border-slate-200 dark:border-slate-700",
        chapterSideBarVisible === false && "lg:hidden"
      )}
    >
      <div className="flex flex-col gap-4 items-center w-full">
        <ChapterSidebarItem isLocked={false} />
      </div>
    </aside>
  );
};

export default ChapterSidebar;

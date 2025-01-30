"use client";
import React from "react";
import ChapterSidebarItem from "./chapter-sidebar-item";

interface ChapterSidebarProps {
  courseId: string;
}
const ChapterSidebar = ({ courseId }: ChapterSidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm mt-[80px] dark:border-gray-700">
      <div className="flex flex-col w-full">
        <ChapterSidebarItem
          courseId={courseId}
          isCompleted={false}
          isLocked={false}
        />
      </div>
    </div>
  );
};

export default ChapterSidebar;

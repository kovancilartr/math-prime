"use client";
import React from "react";
import { useParams } from "next/navigation";

interface ChapterLayoutProps {
  children: React.ReactNode;
}
const ChapterLayout = ({ children }: ChapterLayoutProps) => {
  const courseId = useParams().courseId as string;
  return (
    <div className="h-full">
      <div className="h-[80px] fixed inset-x-0 w-full z-50 bg-red-500">
        <div>ChapterNavbar Eklenecek</div>
      </div>
      <div className="hidden md:flex h-full w-80 top-[80px] flex-col fixed inset-y-0 z-49 bg-blue-700">
        <div>ChapterSidebar Eklenecek</div>
      </div>
      <main className="relative md:left-80 top-[80px] h-full">{children}</main>
    </div>
  );
};

export default ChapterLayout;

"use client";
import React from "react";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, Focus } from "lucide-react";
import { useParams } from "next/navigation";
import { useAuthStore, useQueryStore } from "@/store/useAuthStore";
import UserProgress from "./user-progress";

const ChapterHeader = () => {
  const { courseId, chapterId } = useParams();
  const { toggleChapterSideBarVisible } = useQueryStore();

  return (
    <div className="p-4 border-b h-16 flex justify-between items-center shadow-md dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-700">
      <div>
        <Link href={courseId ? `${"/courses/details/" + courseId}` : `/null`}>
          <Button
            variant="outline"
            className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kursa Geri Dön
          </Button>
        </Link>
      </div>

      <div className="flex flex-row items-center justify-center gap-2 pr-4 w-full">
        <UserProgress />
      </div>

      <div className="flex flex-row items-center gap-2 pr-4">
        <ThemeToggle />
        <Button
          variant={"outline"}
          size={"icon"}
          className="hidden lg:flex bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600"
          onClick={() => toggleChapterSideBarVisible()}
        >
          <Focus />
        </Button>
        {/* <UserButton /> */}
      </div>
    </div>
  );
};

export default ChapterHeader;

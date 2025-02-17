"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, PlayCircle, Lock, Pin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchCourseDetailsPageActions } from "@/store/useQueryStore";
import LoadingSpinner from "../loading-spinner";
import { useAuthStore } from "@/store/useAuthStore";

interface ChapterSidebarItemProps {
  isLocked: boolean;
}

const ChapterSidebarItem = ({ isLocked }: ChapterSidebarItemProps) => {
  const pathChapterId = useParams().chapterId;
  const courseId = useParams().courseId;
  const { user } = useAuthStore();
  const currentUserId = user?.id;
  const router = useRouter();

  // React Query
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = fetchCourseDetailsPageActions(courseId as string);

  const currentCourse = courseData?.data[0];
  const currentSection = currentCourse?.section;
  const defaultSectionId = currentSection?.[0]?.id;

  const isChapterActive = (chapterId: string) => {
    return pathChapterId === chapterId;
  };

  const onClick = (chapterId: string) => {
    router.push(`/courses/${courseId}/chapter/${chapterId}`);
  };

  if (isCourseLoading) {
    return <LoadingSpinner spinnerText=" " spinnerVariant="infinite" />;
  }
  if (isCourseError) {
    return <p>Verileri çekerken bir hata oluştu.</p>;
  }

  return (
    <>
      <Accordion
        key={defaultSectionId}
        type="single"
        collapsible
        className="w-full"
        defaultValue={defaultSectionId}
      >
        {currentSection?.map((section: any) => (
          <AccordionItem
            value={section.id}
            key={section.id}
            className="last:border-b-0"
          >
            <div className="overflow-hidden">
              <AccordionTrigger className="flex flex-row items-center gap-x-1 py-2 px-2">
                <div className="flex flex-row items-center gap-x-1">
                  <Pin className="h-4 w-4 text-red-600 dark:text-white" />
                  <h3 className="text-lg font-semibold dark:text-white border-gray-200">
                    {section.title}
                  </h3>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0">
                {section.chapter.length > 0 ? (
                  section.chapter.map((chapter: any) => {
                    const isCompleted = chapter?.completedLesson?.some(
                      (completedLesson: any) =>
                        completedLesson.userId === currentUserId
                    );

                    const Icon = isLocked
                      ? Lock
                      : isCompleted
                      ? CheckCircle
                      : PlayCircle;

                    return (
                      <button
                        key={chapter.id}
                        onClick={() => onClick(chapter.id)}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-x-2 text-slate-500 text-sm font-[600] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                          isChapterActive(chapter.id) &&
                            "bg-slate-200/20 text-black hover:bg-slate-200/20 hover:text-slate-700",
                          isCompleted &&
                            "text-emerald-700 hover:text-emerald-700",
                          isCompleted &&
                            isChapterActive(chapter.id) &&
                            "bg-emerald-200/20"
                        )}
                      >
                        <div className="flex items-center gap-x-2 py-4 text-xs dark:text-white">
                          <Icon
                            size={22}
                            className={cn(
                              "text-slate-500",
                              isChapterActive(chapter.id) && "text-slate-700",
                              isCompleted && "text-emerald-700"
                            )}
                          />
                          {chapter.title}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    Bu bölümde henüz bir Chapter eklenmemiş.
                  </div>
                )}
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default ChapterSidebarItem;

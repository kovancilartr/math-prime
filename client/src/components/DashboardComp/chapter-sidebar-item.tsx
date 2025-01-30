"use client";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, PlayCircle, Lock, Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
// import { Chapter, Course, Section } from "@/types/globalTypes";
// import { getCourse } from "@/services/fetch-api";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

interface ChapterSidebarItemProps {
  courseId: string;
  isCompleted: boolean;
  isLocked: boolean;
}
const ChapterSidebarItem = ({
  courseId,
  isCompleted,
  isLocked,
}: ChapterSidebarItemProps) => {
  const pathChapterId = useParams().chapterId;
  const router = useRouter();
//   const [courseData, setCourseData] = useState<Course | undefined>();
//   const [sectionData, setSectionData] = useState<Section[]>();

//   useEffect(() => {
//     const getCourseData = async () => {
//       const response = await getCourse(courseId as string);
//       if (response) {
//         setCourseData(response.data);
//         setSectionData(response.data.sections);
//       }
//     };
//     getCourseData();
//   }, [courseId]);

//   console.log(
//     "Chapter SidebarItem Course:",
//     courseData,
//     "Chapter SidebarItem Section:",
//     sectionData
//   );

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const isChapterActive = (chapterId: string) => {
    return pathChapterId === chapterId;
  };

  const onClick = (chapterId: string) => {
    router.push(`/course/${courseId}/chapter/${chapterId}`);
  };

  return (
    <>
      <div>
        {/* {sectionData?.map((section: Section) => (
          <Accordion
            key={section.documentId}
            type="single"
            collapsible
            className="w-full"
            defaultValue={section.documentId}
          >
            <AccordionItem
              value={section.documentId}
              key={section.documentId}
              className="last:border-b-0"
            >
              <div className="overflow-hidden">
                <AccordionTrigger className="flex flex-row items-center gap-x-1 py-2 px-2 bg-stone-100">
                  <div className="flex flex-row items-center gap-x-1">
                    <Pin className="h-4 w-4" />
                    <h3 className="text-lg font-semibold dark:text-white border-gray-200">
                      {section.title}
                    </h3>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="dark:bg-slate-700">
                  {section.chapters && section.chapters.length > 0 ? (
                    section.chapters.map((chapter: Chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => onClick(chapter.documentId)}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                          isChapterActive(chapter.documentId) &&
                            "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700",
                          isCompleted &&
                            "text-emerald-700 hover:text-emerald-700",
                          isCompleted &&
                            isChapterActive(chapter.documentId) &&
                            "bg-emerald-200/20"
                        )}
                      >
                        <div className="flex items-center gap-x-2 py-4">
                          <Icon
                            size={22}
                            className={cn(
                              "text-slate-500",
                              isChapterActive(chapter.documentId) &&
                                "text-slate-700",
                              isCompleted && "text-emerald-700"
                            )}
                          />
                          {chapter.title}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      Bu bölümde henüz bir Chapter eklenmemiş.
                    </div>
                  )}
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        ))} */}
      </div>
    </>
  );
};

export default ChapterSidebarItem;

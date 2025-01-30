import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FastForward, Lock, LockOpen } from "lucide-react";
import Link from "next/link";

interface CourseListSectionProps {
  courseData: {
    success: boolean;
    data: any;
  } | null;
}
const CourseListSection = ({ courseData }: CourseListSectionProps) => {
  console.log("courseData", courseData?.data);
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={courseData?.data[0]?.section?.id}
    >
      {courseData?.data[0]?.section && courseData.data[0]?.section.length > 0 ? (
        courseData.data[0]?.section.map((section: any) => (
          <AccordionItem
            value={section.id}
            key={section.id}
            className="last:border-b-0"
          >
            <div className="rounded-md overflow-hidden">
              {/* Bölüm Başlığı */}
              <AccordionTrigger className="flex flex-row items-center gap-x-1 py-2">
                <div className="flex flex-row items-center gap-x-2 ">
                  <FastForward className="h-4 w-4" />
                  <h3 className="text-lg font-semibold dark:text-white border-gray-200">
                    {section.title}
                  </h3>
                </div>
              </AccordionTrigger>
              {/* Bölümün Altındaki Konular */}
              <AccordionContent className="dark:bg-slate-700">
                {section.chapter && section.chapter.length > 0 ? (
                  section.chapter.map((chapter: any) => (
                    <Link
                      href={`/course/${courseData?.data?.id}/chapter/${chapter.id}`}
                      key={chapter.id}
                      className="flex flex-row gap-x-1 items-center px-4 py-2 border-t last:border-b"
                    >
                      {chapter.isFree ? (
                        <Lock className="h-6 w-6 font-bold text-gray-500" />
                      ) : (
                        <LockOpen className="h-6 w-6 font-bold text-green-700" />
                      )}
                      <h4 className="text-sm font-medium dark:text-white">
                        {chapter.title}
                      </h4>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    Bu bölümde henüz bir konu eklenmemiş.
                  </div>
                )}
              </AccordionContent>
            </div>
          </AccordionItem>
        ))
      ) : (
        <div className="dark:text-slate-50 text-center">
          Henüz bu kurs için içerik eklenmemiş.
        </div>
      )}
    </Accordion>
  );
};

export default CourseListSection;

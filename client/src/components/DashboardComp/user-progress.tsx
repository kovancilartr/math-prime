"use client";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchCourseDetailsPageActions } from "@/store/useQueryStore";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "../loading-spinner";
import toast from "react-hot-toast";

const UserProgress = () => {
  const { courseId, chapterId } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const currentUserId = user?.id;

  // React Query
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = fetchCourseDetailsPageActions(courseId as string);

  const allChapters =
    courseData?.data?.flatMap((course: any) =>
      course.section.flatMap((section: any) => section.chapter)
    ) || [];
  const completedCount = allChapters.filter((chapter) =>
    chapter.completedLesson.some((lesson) => lesson.userId === currentUserId)
  ).length;
  const totalChapters = allChapters.length;
  const completionPercentage =
    totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

  if (isCourseLoading) {
    return <LoadingSpinner />;
  }
  if (isCourseError) {
    return <p>Verileri çekerken bir hata oluştu.</p>;
  }
  return (
    <>
      {completionPercentage === 100 ? (
        <h2 className="cursor-default">Tebrikler! Kurs Tamamlandı 🎉</h2>
      ) : (
        <>
          <Progress value={completionPercentage} className="w-[40%]" />
          <h2 className="text-xs">
            Tamamlanma Yüzdesi:{" "}
            <span className="font-bold text-base">{completionPercentage}%</span>
          </h2>
        </>
      )}
    </>
  );
};

export default UserProgress;

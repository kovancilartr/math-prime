"use client";
import React from "react";
import { useParams } from "next/navigation";
import { fetchCourseDetailsPageActions } from "@/store/useQueryStore";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCheck, X } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  completeChapterServices,
  deleteCompletedChapterServices,
} from "@/services/chapterServices";
import toast from "react-hot-toast";

const ChapterPage = () => {
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

  const completeChapterMutation = useMutation({
    mutationFn: () => {
      return completeChapterServices(user?.id as string, chapterId as string);
    },
    onSuccess: () => {
      toast.success("Kursa başarıyla kaydedildi");
      // Kurs verilerini yeniden çekmek için sorguyu güncelle
      queryClient.refetchQueries();
    },
    onError: (error) => {
      toast.error("Bir hata oluştu");
    },
  });
  const deleteCompletedChapterMutation = useMutation({
    mutationFn: () => {
      return deleteCompletedChapterServices(
        chapterId as string,
        currentUserId as string
      );
    },
    onSuccess: () => {
      toast.success("Kursa başarıyla kaydedildi");
      queryClient.refetchQueries();
    },
    onError: (error) => {
      toast.error("Bir hata oluştu");
    },
  });

  // courseData'dan chapterId ile eşleşen veriyi almak
  const chapterData = courseData?.data
    ?.flatMap((course: any) =>
      course.section.flatMap((section: any) =>
        section.chapter.find((chapter: any) => chapter.id === chapterId)
      )
    )
    .find(Boolean); // Eğer null veya undefined dönerse, bir sonraki öğeyi bul

  // Kullanıcının dersi tamamlayıp tamamlamadığını kontrol etme
  const isCompleted = chapterData?.completedLesson?.some(
    (lesson: any) => lesson.userId === currentUserId
  );

  if (isCourseLoading) {
    return <LoadingSpinner />;
  }
  if (isCourseError) {
    return <p>Verileri çekerken bir hata oluştu.</p>;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 items-center lg:max-w-screen-lg lg:mx-auto">
        <div className="w-full rounded-xl overflow-hidden shadow-md dark:border dark:border-slate-700">
          <VideoPlayer
            provider="youtube"
            videoUrl={chapterData?.videoUrl as string}
            courseId={courseId as string}
            chapterId={chapterId as string}
            isLocked={false}
          />
        </div>
      </div>

      <div className="border rounded-md p-6 lightBg dark:darkBg h-fit flex flex-row justify-between">
        <div className="flex flex-col items-start mb-2">
          <div className="">
            <h2 className="text-2xl font-bold">{chapterData?.title}</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400">
              {chapterData?.description}
            </p>
          </div>
        </div>

        <div>
          {isCompleted ? (
            <Button
              variant="default"
              className="bg-ColorPalette-434190 text-white dark:bg-ColorPalette-434190 dark:text-white shadow-none"
              onClick={() => deleteCompletedChapterMutation.mutate()}
            >
              <X className="h-4 w-4" />
              Ders Tamamlanmadı
            </Button>
          ) : (
            <Button
              variant="default"
              className="shadow-none"
              onClick={() => completeChapterMutation.mutate()}
            >
              <CheckCheck className="h-4 w-4" />
              Ders Tamamlandı
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;

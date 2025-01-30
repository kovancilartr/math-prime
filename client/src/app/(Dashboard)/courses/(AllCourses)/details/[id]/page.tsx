"use client";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/globalTypes";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import CourseListSection from "../../_components/CourseListSection";
import LoadingSpinner from "@/components/loading-spinner";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { fetchCourseDetailsPageActions, fetchCourseEnrollmentActions } from "@/store/useQueryStore";

const CourseDetailPage = () => {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuthStore();
  // React Query
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = fetchCourseDetailsPageActions(courseId);
  const {
    data: courseEnrollment,
    isLoading: isCourseEnrollmentLoading,
    isError: isCourseEnrollmentError,
  } = fetchCourseEnrollmentActions(user?.id as string, courseId);
  const isLocked = !courseEnrollment?.success;

  if (isCourseLoading || isCourseEnrollmentLoading) {
    return <LoadingSpinner />;
  }
  if (isCourseError || isCourseEnrollmentError) {
    return <p>Verileri çekerken bir hata oluştu.</p>;
  }

  // Kullanıcı satın almadıysa, kursu kilitli göster

  const saveCourseEnrollment = async () => {
    if (isLocked) {
      console.log("Kursa kaydediliyor");
    } else if (!isLocked) {
      console.log("Kursa devam ettiriliyor");
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="order-1 col-span-1 lg:col-span-3 flex flex-col space-y-6">
          <div className="rounded-xl overflow-hidden shadow-md dark:border dark:border-slate-700">
            <VideoPlayer
              provider="youtube"
              videoUrl={courseData?.data[0]?.courseVideoUrl as string}
              courseId={courseId}
              isLocked={isLocked} // Kullanıcı satın almadıysa, kursu kilitli göster
            />
          </div>
          <div className="border rounded-md p-6 lightBg dark:darkBg">
            <div className="flex flex-row justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {courseData?.data[0]?.title}
                </h2>
                <p className="line-clamp-2">
                  {courseData?.data[0]?.description}
                </p>
              </div>
              <div className="flex flex-row gap-x-1">
                {courseData?.data[0]?.categories?.map((category: Category) => (
                  <Badge
                    key={category.id}
                    variant="default"
                    className="cursor-pointer"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="order-2 lg:col-span-2 flex flex-col space-y-6">
          <div className="w-full border dark:border-slate-700 rounded-md p-6 lightBg dark:darkBg">
            <div className="mb-7">
              <h4 className="font-semibold text-xl mb-4">
                {courseData?.data[0]?.title}
              </h4>
              <p className="text-sm">{courseData?.data[0]?.description}</p>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={saveCourseEnrollment}
              >
                {isLocked ? "Kursa Kayıt Ol" : "Kursa Devam Et"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center border dark:border-gray-700 rounded-md shadow-lg">
            {/* Üst Badgeli Başlık */}
            <div className="relative w-full">
              <div className="p-4 rounded-t-md bg-slate-700 text-slate-50 dark:bg-slate-800 dark:text-white">
                <h2 className="text-xl font-semibold text-center ">
                  Kurs İçeriği
                </h2>
              </div>
            </div>

            {/* Kurs İçeriği */}
            <div className="p-2 w-full rounded-b-md dark:bg-slate-600 dark:text-slate-50">
              <CourseListSection courseData={courseData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;

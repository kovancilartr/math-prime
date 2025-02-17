"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Category, Courses } from "@/types/globalTypes";
import Image from "next/image";
import Link from "next/link";
import noCourseAvatar from "../../../../../../public/images/banner-2.jpg";
import UserProgress from "@/components/DashboardComp/user-progress";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";

interface CourseCardProps {
  data: Courses;
}
const CourseCard = ({ data }: CourseCardProps) => {
  const { user } = useAuthStore();
  const currentUserId = user?.id;

  const enrollmentCourse =
    data?.courseEnrollment?.some(
      (enrollment) => enrollment.userId === currentUserId
    ) || false;

  return (
    <>
      <Link href={`/courses/details/${data.id}`}>
        <div className="group shadow-md hover:shadow-lg transition overflow-hidden dark:border-slate-800 border rounded-lg p-3 h-full bg-slate-50 dark:bg-slate-600">
          {/* Card Image */}
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image
              src={data.thumbnail || noCourseAvatar}
              alt="Course Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
            />
          </div>

          {/* Card Content */}
          <div className="flex flex-col h-fit pt-2 justify-between">
            <div>
              {/* Card Title */}
              <div className="flex flex-row justify-between items-center mb-2">
                <div className="flex flex-row w-full justify-between items-center ">
                  <div className="text-lg md:text-base font-medium group-hover:text-myColor2-200 dark:group-hover:text-myColor2-100 transition lime-clamp-2">
                    {data.title}
                  </div>
                  <div className="flex flex-row gap-x-1">
                    {data.categories?.map((category: Category) => (
                      <Badge key={category.id} variant="default" className="">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Description */}
              <div className="mb-4">
                <p className="line-clamp-3">{data.description}</p>
              </div>

              {/* Card Price or Purchase Button */}
              {enrollmentCourse ? (
                <div className="flex flex-col items-center justify-center">
                  <UserProgress courseIdProps={data.id} className="w-[80%]" />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full text-base dark:hover:bg-slate-700"
                >
                  <UserPlus className="h-4 w-4" />
                  Kursa Kayıt Ol
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CourseCard;

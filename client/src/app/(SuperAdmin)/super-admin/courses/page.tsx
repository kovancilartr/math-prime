"use client";
import React from "react";
import { DataTableCourse } from "@/components/SuperAdminComp/CourseDataTable/data-table-course";
import { courseColumns } from "@/components/SuperAdminComp/CourseDataTable/data-table-course-columns";
import { Spinner } from "@/components/spinner";
import { fetchAllCoursesSuperAdminActions } from "@/store/useQueryStore";

const SuperAdminCoursesPage = () => {
  const {
    data: responseCourses,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = fetchAllCoursesSuperAdminActions();

  if (isCourseLoading) {
    return (
      <div className="mt-48">
        <div className="flex flex-col items-center justify-center">
          <Spinner
            variant="infinite"
            className="h-20 w-20 text-muted-foreground"
          />
          <span className="text-xs animate-ping duration-1000">
            Kayıtlar Yükleniyor
          </span>
        </div>
      </div>
    );
  }
  if (isCourseError) {
    return <p>Verileri çekerken bir hata oluştu.</p>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold">Kurs Yönetimi</h2>
      </div>
      <div className="flex items-center justify-center">
        <DataTableCourse data={responseCourses?.data} columns={courseColumns} />
      </div>
    </div>
  );
};

export default SuperAdminCoursesPage;

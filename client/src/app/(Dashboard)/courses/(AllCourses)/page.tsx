"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CourseList from "./_components/CourseList";
import Categories from "./_components/Category";
import LoadingSpinner from "@/components/loading-spinner";
import {
  fetchAllCategoriesActions,
  fetchAllCoursesActions,
  fetchCoursesByCategoryActions,
} from "@/store/useQueryStore";

const CoursesPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  // React Query
  const {
    data: CoursesData,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = fetchAllCoursesActions(categoryId as string);
  const {
    data: categoriesData,
    isLoading: isCategoriesError,
    isError: isCategoriesLoading,
  } = fetchAllCategoriesActions();
  const {
    data: filteredCoursesData,
    isLoading: isFilteredCoursesLoading,
    isError: isFilteredCoursesError,
  } = fetchCoursesByCategoryActions(categoryId as string);

  if (isCategoriesLoading || isCoursesLoading || isFilteredCoursesLoading) {
    return <LoadingSpinner spinnerVariant="bars" />;
  }

  if (isCategoriesError || isCoursesError || isFilteredCoursesError) {
    return <p>Verileri çekerken bir hata oluştu.</p>;
  }

  return (
    <div className="p-6">
      {/* Kategoriler */}
      <Categories dataCategories={categoriesData?.data} />

      {/* Kurslar */}
      <div className="mt-6">
        <CourseList
          dataCourses={!CoursesData ? filteredCoursesData : CoursesData}
        />
      </div>
    </div>
  );
};

// Suspense ile sarmalayın
export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner spinnerVariant="bars" />}>
      <CoursesPage />
    </Suspense>
  );
}

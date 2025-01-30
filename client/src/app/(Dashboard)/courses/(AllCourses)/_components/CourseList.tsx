import React from "react";
import CourseCard from "./CourseCard";

interface CourseListProps {
  dataCourses: any[] | undefined;
}

const CourseList = ({ dataCourses }: CourseListProps) => {
  if (!dataCourses || dataCourses.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground mt-10">
        Kurs bulunamadı.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {dataCourses?.map((course: any) => (
        <CourseCard key={course.id} data={course} />
      ))}
    </div>
  );
};

export default CourseList;

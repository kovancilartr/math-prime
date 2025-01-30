"use client";
import React from "react";
import { useParams } from "next/navigation";

const CourseDetails = () => {
  const params = useParams();

  return (
    <div>
      <h2>Kurs Detayı</h2>
    </div>
  );
};

export default CourseDetails;

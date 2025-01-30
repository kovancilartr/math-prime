import axios from "axios";
import { API_ROUTES } from "@/lib/api";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.COURSE,
  withCredentials: true,
});

type fetchCoursesProps = {
  populate?: string;
  filters?: {
    field: string;
    operator: string;
    value: string;
  }[];
  pageSize?: number;
};
type createCourseProps = {
  instructorId: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  isPublished: boolean;
};
type editCourseProps = {
  id: string | undefined;
  newInstructorId: string;
  newTitle: string;
  newDescription: string;
  newCourseVideoUrl: string;
  newPrice: number;
  newThumbnail: string;
  newIsPublished: boolean;
  newCategoryId: string;
};

export const getCoursesServices = async ({
  populate = "*",
  filters = [],
  pageSize = 10,
}: fetchCoursesProps) => {
  try {
    let url = `/get-courses?populate=${populate}`;
    filters.forEach((filter) => {
      url += `&filters[${filter.field}][${
        "$" + filter.operator
      }]=${encodeURIComponent(filter.value)}`;
    });
    const response = await axiosInstance.get(url);
    // console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error("Kursları alırken hata oluştu:", error);
    return null;
  }
};

export const createCourseServices = async (data: createCourseProps) => {
  try {
    const response = await axiosInstance.post("/create-course", data);
    return response.data;
  } catch (error) {
    console.error("Kurs oluşturulurken hata oluştu:", error);
    return null;
  }
};

export const editCourseServices = async (data: editCourseProps) => {
  try {
    const response = await axiosInstance.put("/edit-course", data);
    return response.data;
  } catch (error) {
    console.error("Kurs güncellenirken hata oluştu:", error);
    return null;
  }
};

export const deleteCourseServices = async (ids: string[]) => {
  try {
    const response = await axiosInstance.delete(`/delete-course/${ids}`);
    return response.data;
  } catch (error) {
    console.error("Kurs silinirken hata oluştu:", error);
    return null;
  }
};

export const getCategoriesServices = async ({
  populate = "",
  filters = [],
  pageSize = 10,
}: {
  populate?: string;
  filters?: {
    field: string;
    operator: string;
    value: string;
  }[];
  pageSize?: number;
}) => {
  try {
    let url = `/get-categories`;
    populate && (url += `?populate=${populate}`);

    filters.forEach((filter) => {
      url += `&filters[${filter.field}][${
        "$" + filter.operator
      }]=${encodeURIComponent(filter.value)}`;
    });
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Kategori getirirken hata oluştu:", error);
    return null;
  }
};

export const getCourseEnrollmentServices = async (
  userId: string,
  courseId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/course-enrollment/${userId}/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("CourseEnrollment getirirken hata oluştu:", error);
    return null;
  }
};

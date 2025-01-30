import { useQuery } from "@tanstack/react-query";
import { Courses } from "@/types/globalTypes";
import {
  getCategoriesServices,
  getCourseEnrollmentServices,
  getCoursesServices,
} from "@/services/courseServices";

export const fetchCourseEnrollmentActions = (
  userId: string,
  courseId: string
) => {
  return useQuery({
    queryKey: ["getCourseEnrollment", { userId, courseId }],
    queryFn: () => getCourseEnrollmentServices(userId, courseId),
    staleTime: 1000 * 60 * 5,
  });
};

export const fetchCourseDetailsPageActions = (courseId: string) => {
  return useQuery({
    queryKey: ["fetchCourseDetailsPageActions", courseId],
    queryFn: () =>
      getCoursesServices({
        filters: [{ field: "id", operator: "eq", value: courseId }],
      }),
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul edilir
    gcTime: 1000 * 60 * 10, // 10 dakika boyunca cache'de tutulur
    enabled: !!courseId, // Burada istediğim koşul gerçekleşirse bu query'i çalıştırır
  });
};

export const fetchAllCoursesActions = (categoryId: string) => {
  return useQuery({
    queryKey: ["fetchAllCoursesActions", categoryId],
    queryFn: async () => {
      const response = await getCoursesServices({
        populate: "*",
        // Yayında olan kursları filtrele
        // filters: [{ field: "isPublished", operator: "eq", value: "true" }],
      });
      return response?.data;
    },
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul edilir
    gcTime: 1000 * 60 * 10, // 10 dakika boyunca cache'de tutulur
    refetchOnWindowFocus: false, // Pencere odaklandığında yeniden fetch yapma
    refetchOnReconnect: false, // İnternet bağlantısı tekrar geldiğinde fetch yapma
    enabled: !categoryId, // Burada istediğim koşul gerçekleşirse bu query'i çalıştırır
  });
};

export const fetchAllCoursesSuperAdminActions = () => {
  return useQuery({
    queryKey: ["fetchAllCoursesSuperAdminActions", { populate: "*" }],
    queryFn: () => getCoursesServices({ populate: "*", pageSize: 100 }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10, // 10 dakika boyunca cache'de tutulur
    refetchOnWindowFocus: false, // Pencere odaklandığında yeniden fetch yapma
    refetchOnReconnect: false, // İnternet bağlantısı tekrar geldiğinde fetch yapma
    enabled: true, // Burada istediğim koşul gerçekleşirse bu query'i çalıştırır
  });
};

export const fetchAllCategoriesActions = () => {
  return useQuery({
    queryKey: ["fetchAllCategoriesActions"],
    queryFn: () => getCategoriesServices({}),
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul edilir
    gcTime: 1000 * 60 * 10, // 10 dakika boyunca cache'de tutulur
    refetchOnWindowFocus: false, // Pencere odaklandığında yeniden fetch yapma
    refetchOnReconnect: false, // İnternet bağlantısı tekrar geldiğinde fetch yapma
  });
};

export const fetchCoursesByCategoryActions = (categoryId: string) => {
  return useQuery({
    queryKey: ["fetchCoursesByCategoryActions", categoryId],
    queryFn: async () => {
      const response = await getCategoriesServices({
        populate: "*",
        filters: [{ field: "id", operator: "eq", value: categoryId || "" }],
      });
      return response?.data[0]?.courses.map((course: Courses) => course);
    },
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca taze kabul edilir
    gcTime: 1000 * 60 * 10, // 10 dakika boyunca cache'de tutulur
    refetchOnWindowFocus: false, // Pencere odaklandığında yeniden fetch yapma
    refetchOnReconnect: false, // İnternet bağlantısı tekrar geldiğinde fetch yapma
    enabled: !!categoryId, // Burada istediğim koşul gerçekleşirse bu query'i çalıştırır
  });
};

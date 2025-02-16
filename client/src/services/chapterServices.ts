import axios from "axios";
import { API_ROUTES } from "@/lib/api";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.COURSE,
  withCredentials: true,
});

export const completeChapterServices = async (
  userId: string,
  chapterId: string
) => {
  try {
    const response = await axiosInstance.post(`/complete-chapter`, {
      userId,
      chapterId,
    });
    return response.data;
  } catch (error) {
    console.error("Chapter tamamlanırken hata oluştu:", error);
    return null;
  }
};

export const deleteCompletedChapterServices = async (chapterId: string, userId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/delete-completed-chapter/${chapterId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("CompletedChapter silinirken hata oluştu:", error);
    return null;
  }
};

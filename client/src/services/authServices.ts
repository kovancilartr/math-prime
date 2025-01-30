import axios from "axios";
import { API_ROUTES } from "@/lib/api";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const getAdminRoleAllUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/all-users?filters[role][$eq]=SUPER_ADMIN"
    );
    // Sadece gerekli verileri döndür
    const filteredUsers = response.data.users.map(
      ({
        id,
        role,
        status,
        name,
      }: {
        id: string;
        role: string;
        status: string;
        name: string;
      }) => ({
        id,
        role,
        status,
        name,
      })
    );

    return filteredUsers; // Filtrelenmiş kullanıcıları döndür
  } catch (error) {
    console.error("Rolü tüm kullanıcıları alırken hata oluştu:", error);
    return null;
  }
};

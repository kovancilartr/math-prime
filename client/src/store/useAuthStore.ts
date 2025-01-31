import { AuthStore } from "@/types/useAuthTypes";
import { API_ROUTES } from "@/lib/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      allUsersState: [],
      isLoading: false,
      error: null,
      message: null,
      register: async (
        name: string,
        surname: string,
        email: string,
        password: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/register", {
            name,
            surname,
            email,
            password,
          });
          set({ isLoading: false });
          return response.data.userId;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Registration failed"
              : "Unknown error occurred",
          });
          return null;
        }
      },
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const response = await axiosInstance.post("/login", {
            email,
            password,
          });
          if (response.data.success) {
            console.log("Login ResponseStore: ", response.data);
            set({
              isLoading: false,
              user: response.data.user,
              message: response.data.message,
              accessToken: response.data.accessToken,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data.error,
            });
            return false;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Login failed"
              : "Unknown error occurred",
          });
          return false;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/logout");
          set({ isLoading: false, user: null, accessToken: null });
          window.location.reload(); // Çıkış yapıldığında sayfayı yeniler
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Logout failed"
              : "Unknown error occurred",
          });
        }
      },
      refreshToken: async () => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/refresh-token");
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Refresh token failed"
              : "Unknown error occurred",
          });
          return false;
        }
      },
      allUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/all-users");
          set({ isLoading: false, allUsersState: response.data.users });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            allUsersState: [],
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Get All Users API failed"
              : "Unknown error occurred",
          });
        }
      },
      editUser: async (data: {
        id: string | undefined;
        newName: string;
        newSurname: string;
        newEmail: string;
        newPassword?: string;
        newRole: string;
        newStatus: string;
      }) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.put("/edit-user", data);
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Edit User API failed"
              : "Unknown error occurred",
          });
          return false;
        }
      },
      deleteUser: async (ids: string[]) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete("/delete-user", {
            data: {
              ids,
            },
          });
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Delete User API failed"
              : "Unknown error occurred",
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        message: state.message,
      }),
    }
  )
);

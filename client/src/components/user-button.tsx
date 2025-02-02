"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import noAvatar from "../../public/images/noAvatar.png";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";
import { LogInIcon, LogOutIcon } from "lucide-react";

const UserButton = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  return (
    <div className="fixed top-2 right-4 w-10 h-10 overflow-hidden flex justify-center items-center z-50 animate-pulse">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            className="w-full h-full rounded-full"
            src={noAvatar}
            alt="no avatar"
            width={100}
            height={100}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col p-2">
            <div className="flex flex-col items-center">
              <h1>Kullanıcı Bilgileri</h1>
              <h2 className="text-xs text-muted-foreground">
                <span className="text-sm font-bold text-red-800">ID: </span>
                {user?.id}
              </h2>
              <h2 className="text-xs text-muted-foreground">
                {user?.name} {user?.surname}
              </h2>
              <h2 className="text-xs">{user?.email}</h2>
            </div>

            <div className="flex flex-row justify-around pt-2">
              <h2 className="text-xs text-green-700">
                {user?.role === "SUPER_ADMIN" ? "Admin" : "Öğrenci"}
              </h2>
              <ThemeToggle type="single" />
            </div>
          </div>
          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOutIcon className="h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                router.push("/auth/login");
              }}
              className="cursor-pointer"
            >
              <LogInIcon className="h-4 w-4" />
              Giriş Yap
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;

"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import LoadingSpinner from "../loading-spinner";

const UserButton = () => {
  const { user, isLoading, error, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setMounted(true);
    setLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : !isLoading && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-row items-center gap-1 cursor-pointer border p-2 rounded-md shadow-md dark:border-gray-700">
              {/* Kullanıcı Resmini Daha Sonra Prismadan Getirmek için Ayarlanacak */}
              {/* <Image
                src={
                    user?.image
                    ? process.env.NEXT_PUBLIC_URL + user?.image?.url
                    : "/noAvatar.png"
                }
                alt=""
                width={1080}
                height={780}
                unoptimized
                className="rounded-full w-10 h-10 border-2 border-myColor1-300 dark:border-myColor2-100"
              /> */}
              <div className="flex flex-col items-center">
                <span className="text-xs leading-3 font-medium">
                  {user?.name} {user?.surname}
                </span>
                <span className="text-[10px] text-black dark:text-white text-right">
                  {user?.role === "SUPER_ADMIN" ? "Admin" : "Öğrenci"}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-50 dark:bg-primary text-black p-2 rounded-md shadow-lg mr-1">
            <DropdownMenuLabel className="flex flex-col items-center text-md">
              Hoş Geldin
              <span className="text-red-600" style={{ fontSize: "10px" }}>
                {user?.id}
              </span>
              <span className="text-xs">{user?.name}</span>
              <span className="text-xs text-green-700">
                {user?.role === "SUPER_ADMIN" ? "Admin" : "Öğrenci"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/auth/profile">
              <DropdownMenuItem className="cursor-pointer">
                <span className="hidden lg:block">Hesabımı Yönet</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer">
                <span className="hidden lg:block">Settings</span>
              </DropdownMenuItem>
            </Link>
            <button className="w-full" onClick={logout}>
              <DropdownMenuItem className="cursor-pointer">
                <span className="hidden lg:block">Çıkış Yap</span>
              </DropdownMenuItem>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
};

export default UserButton;

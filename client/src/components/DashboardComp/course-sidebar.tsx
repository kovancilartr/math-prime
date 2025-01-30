"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
// import SearchBar from "./SearchBar";
// import { getNavRoutes } from "@/services/fetch-api";
// import { useQuery } from "@tanstack/react-query";
// import { NavRoute } from "@/types/globalTypes";
// import { getIconByName } from "@/utils/icons";
// import LoadingSpinner from "./Skeleton/LoadingSpinner";
import Logo from "../logo";

const CourseSidebar = () => {
  const pathname = usePathname();

  //   const { data, isLoading, isError } = useQuery<{
  //     success: boolean;
  //     data?: NavRoute[];
  //     error?: string;
  //   }>({
  //     queryKey: ["navRoutes"], // Cache key
  //     queryFn: getNavRoutes, // API çağrısı yapan fonksiyon
  //     staleTime: 1000 * 60 * 5, // 5 dakika boyunca cache'lenmiş veriyi kullan
  //     retry: 1, // Hata durumunda sadece bir kez dene

  //     refetchOnWindowFocus: true, // Sayfa odaklandığında yenilemeyi devre dışı bırak
  //     refetchOnReconnect: false, // Bağlantı tekrar sağlandığında yenilemeyi devre dışı bırak
  //   });

  //   if (isLoading) {
  //     return (
  //       <aside className="hidden lg:flex h-screen w-72 bg-myColor1-400 dark:bg-myColor1-100 border-r-2 border-slate-200 dark:border-slate-700">
  //         <div className="flex flex-col gap-4 justify-center items-center w-full">
  //           <LoadingSpinner />
  //         </div>
  //       </aside>
  //     );
  //   }

  //   if (isError || !data?.success) {
  //     return (
  //       <div className="flex items-center justify-center h-screen text-red-500">
  //         Menü yüklenirken bir hata oluştu.
  //       </div>
  //     );
  //   }

  //   const navRoutes = data.data as NavRoute[]; // API'den dönen veriler

  return (
    <aside className="hidden lg:flex h-screen w-72 bg-myColor1-100 dark:bg-myColor1-400 border-r-2 border-slate-200 dark:border-slate-700">
      <div className="flex flex-col gap-4 justify-center items-center w-full">
        <div className="mx-auto justify-center items-center mt-12">
          <Link href="/">
            <Logo className="rounded-full w-32 h-32" width={160} height={160} />
          </Link>
          <div className="flex justify-center mt-2">
            <ThemeToggle />
          </div>
        </div>

        <nav className="w-[90%] h-full flex-col justify-between md:flex gap-3">
          {/* <ul className="hidden md:flex flex-col items-start gap-4 mt-14">
            {navRoutes.map((link) => {
              const isActive = pathname === link.route;
              const IconComponent = getIconByName(link.icon);

              return (
                <Button
                  asChild
                  key={link.route}
                  variant={"ghost"}
                  className={cn(
                    "w-full h-12 justify-center",
                    isActive &&
                      "bg-myColor1-300 dark:bg-myColor2-100 dark:hover:bg-myColor2-100/80 text-myColor1-100 border dark:border-myColor1-100"
                  )}
                >
                  <Link href={link.route}>
                    <div
                      className={cn(
                        "flex items-center w-full gap-2 text-myColor1-100 dark:text-myColor1-500 text-lg",
                        isActive &&
                          "text-myColor1-100 dark:text-myColor1-100 dark:hover:text-myColor1-100"
                      )}
                    >
                      <IconComponent className="w-6 h-6" />
                      <p>{link.name}</p>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </ul> */}
          <h2>NavRoutes</h2>

          <ul className="hidden md:flex w-full items-start gap-2 mb-12">
            {/* <SearchBar /> */}
            <h2>SerchBar</h2>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default CourseSidebar;

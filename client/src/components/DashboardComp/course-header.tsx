"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import UserButton from "./user-button";
import LoadingSpinner from "../loading-spinner";

const CourseHeader = () => {
  const [mounted, setMounted] = useState(false);
  const { isLoading, error, user } = useAuthStore();
  const pathname = usePathname();
  const pathnameCourses = pathname?.includes("/courses");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="bg-myColor1-100 dark:bg-myColor1-400 bg-opacity-25 dark:bg-opacity-25 border-b-2 dark:border-myColor1-400/20 backdrop-blur-md backdrop-saturate-200  h-16 mx-auto flex justify-between px-4 items-center sticky z-50 top-0">
        <div className="flex flex-row items-center gap-2">
          {pathnameCourses ? <LoadingSpinner /> : null}
        </div>

        <div className="justify-end items-center pr-4">
          <LoadingSpinner />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-myColor1-100 dark:bg-myColor1-400 bg-opacity-25 dark:bg-opacity-25 border-b-2 dark:border-myColor1-400/20 backdrop-blur-md backdrop-saturate-200  h-16 mx-auto flex justify-between px-4 items-center sticky z-50 top-0">
      <div className="flex flex-row items-center gap-2">
        {pathnameCourses ? (
          <Link href={`/${pathname.split("/")[0]}`}>
            <Button variant={"outline"}>
              <ArrowLeft className="h-4 w-4" />
              <h2>Geri Dön</h2>
            </Button>
          </Link>
        ) : null}
      </div>
      <div className="justify-end items-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : !isLoading && user ? (
          <UserButton />
        ) : (
          <Link href={`/auth/login`}>
            <Button className="bg-myColor1-200 dark:bg-myColor1-100 hover:bg-myColor1-200/80 dark:hover:bg-myColor1-100/80 text-md">
              <LogIn />
              Giriş Yap
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default CourseHeader;

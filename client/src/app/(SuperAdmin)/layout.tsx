"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import SuperAdminSidebar from "@/components/SuperAdminComp/superadmin-sidebar";
import { getAccessToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  // STATES
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken.success) {
      router.push("/auth/login");
      return;
    } else if (accessToken.userState.role !== "SUPER_ADMIN") {
      router.push("/");
      return;
    }
    setIsMounted(false);
  }, [router]);

  if (isMounted) {
    return (
      <LoadingSpinner spinnerText="Kontrol Sağlanıyor" spinnerVariant="bars" />
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={cn(
          "min-h-screen transition-all duration-300 p-2 lightBg dark:darkBg",
          isSidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default SuperAdminLayout;

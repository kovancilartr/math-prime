"use client";
import LoadingSpinner from "@/components/loading-spinner";
import { getAccessToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [isMounted, setIsMounted] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken.success) {
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
  return <>{children}</>;
};

export default AuthLayout;

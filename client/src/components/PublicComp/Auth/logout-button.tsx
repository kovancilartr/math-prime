"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!useAuthStore.getState().user) {
    return null;
  }
  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Çıkış Yap
    </Button>
  );
};

export default LogoutButton;

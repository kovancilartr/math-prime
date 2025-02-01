"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { useAuthStore } from "@/store/useAuthStore";
import { ActionSearchBar } from "../action-search-bar";

interface GlobalSidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const GlobalSidebar = ({ isOpen, toggle }: GlobalSidebarProps) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const menuItems = [
    { name: "Ana Sayfa", href: "/", icon: LayoutDashboard },
    { name: "Neden Biz?", href: "/neden-biz", icon: Info },
    { name: "Kurslar", href: "/courses", icon: BookOpenCheck },

    ...(user?.role === "SUPER_ADMIN"
      ? [
          {
            name: "Yönetim Paneli",
            href: "/super-admin",
            icon: Settings,
          },
        ]
      : []),

    ...(user?.id
      ? [{ name: "Çıkış", href: "/auth/logout", icon: LogOut }]
      : [{ name: "Giriş", href: "/auth/login", icon: LogIn }]),
  ];

  async function handleLogout() {
    await logout();
    router.refresh();
  }
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300 pt-8",
        isOpen ? "w-64" : "w-16",
        "border-r"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-between px-1 space-y-2",
          !isOpen && "px-0"
        )}
      >
        <div className={cn("flex", !isOpen && "hidden")}>
          <Logo className="h-24 w-24 rounded-full border" />
        </div>

        <div
          className={cn(
            "flex justify-between items-center w-full",
            !isOpen && "w-fit"
          )}
        >
          {isOpen ? (
            <>
              <div className={cn("", !isOpen && "hidden")}>
                <ThemeToggle />
              </div>
              <Button
                variant={isOpen ? "ghost" : "outline"}
                size={"sm"}
                className=""
                onClick={toggle}
              >
                {isOpen ? (
                  <ChevronLeft className={"h-6 w-6"} />
                ) : (
                  <ChevronRight className={"h-6 w-6"} />
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1">
              <ThemeToggle
                type="single"
                className={{
                  buttonClass:
                    "animate-bounce h-6 w-6 shadow-gray-300 dark:shadow-gray-600",
                  iconClass: "h-4 w-4",
                }}
              />
              <Button
                variant={isOpen ? "ghost" : "outline"}
                size={"sm"}
                className=""
                onClick={toggle}
              >
                {isOpen ? (
                  <ChevronLeft className={"h-6 w-6"} />
                ) : (
                  <ChevronRight className={"h-6 w-6"} />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1 py-4">
        {menuItems.map((item) => (
          <div
            onClick={
              item.href === "/auth/logout"
                ? handleLogout
                : () => router.push(item.href)
            }
            key={item.name}
            className={cn(
              "flex items-center px-4 py-2 text-sm hover:bg-accent hover: text-accent-foreground cursor-pointer"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className={cn("ml-3", !isOpen && "hidden")}>{item.name}</span>
          </div>
        ))}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4",
            !isOpen && "hidden"
          )}
        >
          <ActionSearchBar />
        </div>
      </div>
    </div>
  );
};

export default GlobalSidebar;

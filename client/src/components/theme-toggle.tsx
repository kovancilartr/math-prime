"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  type?: "single" | "double";
  className?: {
    buttonClass?: string;
    iconClass?: string;
  };
}

export function ThemeToggle({ type = "double", className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);

    toast(`${newTheme === "dark" ? "Koyu" : "Açık"} temaya geçiş yapıldı!`, {
      icon: newTheme === "dark" ? "🌙" : "☀️",
      style: {
        borderRadius: "10px",
        background: newTheme === "dark" ? "#333" : "#fff",
        color: newTheme === "dark" ? "#fff" : "#333",
      },
    });
  };

  if (!mounted) return null;

  if (type === "double") {
    return (
      <div className="flex items-center gap-2">
        {/* Açık Tema Butonu */}
        <Button
          variant="link"
          disabled={resolvedTheme === "light"}
          className={className?.buttonClass}
          size="icon"
          onClick={() => handleThemeChange("light")}
        >
          <Sun
            className={`h-5 w-5 ${
              resolvedTheme === "light" ? "animate-bounce" : ""
            }`}
          />
        </Button>

        {/* Ok İkonu */}
        {resolvedTheme === "light" ? (
          <ArrowLeft className="h-5 w-5" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}

        {/* Koyu Tema Butonu */}
        <Button
          variant="link"
          disabled={resolvedTheme === "dark"}
          className={className?.buttonClass}
          size="icon"
          onClick={() => handleThemeChange("dark")}
        >
          <Moon
            className={`h-5 w-5 ${
              resolvedTheme === "dark" ? "animate-bounce" : ""
            }`}
          />
        </Button>
      </div>
    );
  }

  if (type === "single") {
    return (
      <button
        onClick={() =>
          handleThemeChange(resolvedTheme === "light" ? "dark" : "light")
        }
        className={cn(`relative flex items-center  ${className?.buttonClass}`)}
      >
        {/* Açık Tema İkonu */}
        <Sun
          className={cn(
            `absolute w-5 h-5 text-gray-400 transition-all duration-500 ${
              resolvedTheme === "light"
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-0 -rotate-180"
            } ${className?.iconClass}`
          )}
        />

        {/* Koyu Tema İkonu */}
        <Moon
          className={cn(
            `absolute w-5 h-5 text-gray-400 transition-all duration-500 ${
              resolvedTheme === "dark"
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-0 -rotate-180"
            } ${className?.iconClass}`
          )}
        />
      </button>
    );
  }

  return null;
}

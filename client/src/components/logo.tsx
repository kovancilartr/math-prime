import React from "react";
import Image from "next/image";
import logo from "../../public/images/logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ width, height, className }: LogoProps) => {
  return (
    <Image
      src={logo}
      alt="logo"
      width={width || 200}
      height={height || 50}
      className={cn("dark:invert", className)}
    />
  );
};

export default Logo;

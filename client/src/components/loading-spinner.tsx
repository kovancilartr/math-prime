import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface LoadingSpinnerProps {
  containerClassName?: string;
  spinnerClassName?: string;
  spinnerVariant?:
    | "default"
    | "circle"
    | "pinwheel"
    | "circle-filled"
    | "ellipsis"
    | "ring"
    | "bars"
    | "infinite";
  spinnerText?: string;
  textClassName?: string;
}

const LoadingSpinner = ({
  containerClassName,
  spinnerClassName,
  spinnerVariant,
  spinnerText,
  textClassName,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col pt-40 items-center min-h-screen",
        containerClassName
      )}
    >
      <Spinner
        variant={spinnerVariant}
        className={cn("h-12 w-12 text-muted-foreground", spinnerClassName)}
      />
      <span
        className={cn("text-xs animate-ping duration-1000 mt-2", textClassName)}
      >
        {spinnerText || "Kayıt yükleniyor..."}
      </span>
    </div>
  );
};

export default LoadingSpinner;

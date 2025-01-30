"use client";
import React from "react";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryItemProps {
  slug: string;
  name: string;
  id: string;
}
const CategoryItem = ({ name, id }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("slug");

  const isSelected = currentCategoryId === id;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: isSelected ? null : id,
          slug: currentTitle,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <>
      <button
        className={cn(
          "flex items-center gap-x-1 text-sm px-3 py-2 rounded-full transition border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-600 dark:to-slate-700",
          isSelected && "lightBg/80 dark:darkBg/80 text-black dark:text-white"
        )}
        type="button"
        onClick={onClick}
      >
        <div className="truncate">{name}</div>
      </button>
    </>
  );
};

export default CategoryItem;

import React from "react";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const ChapterHeader = () => {
  return (
    <div className="p-4 border-b h-full flex justify-between items-center shadow-md dark:border-gray-700">
      <div>
        <Link href={`/search/details/aas`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Kursa Geri Dön
          </Button>
        </Link>
      </div>

      <div className="flex flex-row items-center gap-2 pr-4 ">Progress</div>

      <div className="flex flex-row items-center gap-2 pr-4">
        <ThemeToggle />
        {/* <UserButton /> */}
      </div>
    </div>
  );
};

export default ChapterHeader;

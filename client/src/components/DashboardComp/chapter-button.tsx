import { Lock, Play } from "lucide-react";
import React from "react";

interface ChapterButtonProps {
  isLocked?: boolean;
}
const ChapterButton = ({ isLocked }: ChapterButtonProps) => {
  return (
    <>
      {isLocked ? (
        <div className="flex flex-row items-center gap-x-1">
          <Lock className="h-4 w-4" />
          <span>Kursa Kayıt Ol</span>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-x-1">
          <Play className="h-4 w-4" />
          <span>Kursa Devam Et</span>
        </div>
      )}
    </>
  );
};

export default ChapterButton;

"use client";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

// import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";
// import { userRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  provider: Plyr.Provider;
  videoUrl: string;
  options?: Plyr.Options;

  courseId?: string;
  chapterId?: string;
  title?: string;
  isLocked?: boolean;
  completeOnEnd?: boolean;
}

export const VideoPlayer = ({
  provider,
  videoUrl,
  options,
  // courseId,
  // chapterId,
  // title,
  isLocked,
}: // completeOnEnd,
VideoPlayerProps) => {
  // console.log("playbackUrl", playbackUrl);
  // console.log("courseId", courseId);
  // console.log("chapterId", chapterId);
  // console.log("title", title);
  // console.log("nextChapterId", nextChapterId);
  // console.log("isLocked", isLocked);
  // console.log("completeOnEnd", completeOnEnd);

  const videoSettings: Plyr.SourceInfo = {
    type: "video",
    sources: [
      {
        src: videoUrl,
        provider: provider,
      },
    ],
  };

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const videoController = () => {
      if (videoUrl !== null) {
        if (provider === "youtube" && videoUrl?.includes("youtube.com")) {
          setIsReady(true);
        } else {
          setIsReady(false);
        }
      } else {
        setIsReady(false);
      }
    };
    videoController();
  }, [videoUrl, provider]);
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />2
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-white">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            Bu bölümü izleyemezsiniz. Lütfen satın alınız.
          </p>
        </div>
      )}

      {isReady && !isLocked && (
        <Plyr source={videoSettings} options={options} />
      )}
    </div>
  );
};

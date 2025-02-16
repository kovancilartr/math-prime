import React from "react";
import Image from "next/image";
import banner from "../../../../public/images/banner-1.jpg";
import { Button } from "@/components/ui/button";
import { AlignLeft, ArrowLeft } from "lucide-react";
import Link from "next/link";

const AuthBanner = () => {
  return (
    <>
      <Image
        src={banner}
        alt="registerBanner"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
      />
      <div className="bg-gray-600 h-full w-full absolute top-0 left-0 z-10 opacity-30 dark:opacity-40" />
      <Link
        href="/"
        className="absolute top-16 right-12 z-50 flex items-center gap-1 text-sm font-medium"
      >
        <Button variant={"outline"}>
          <ArrowLeft className="h-4 w-4" />
          <h2 className="text-md font-sans italic">Ana Sayfaya Dön</h2>
        </Button>
      </Link>
    </>
  );
};

export default AuthBanner;

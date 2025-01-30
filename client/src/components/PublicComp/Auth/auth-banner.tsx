import React from "react";
import Image from "next/image";
import banner from "../../../../public/images/banner-1.jpg";

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
    </>
  );
};

export default AuthBanner;

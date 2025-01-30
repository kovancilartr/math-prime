"use client";
import React, { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { X, ImageDown, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadThingProps {
  imageValue?: string;
  onChange: (url: string) => void;
}

const ImageUploadThing = ({ imageValue, onChange }: ImageUploadThingProps) => {
  const [completedImage, setCompletedImage] = useState(imageValue || null);
  return (
    <>
      <div className="flex justify-end">
        <div
          className={cn(
            "flex flex-row gap-1 w-fit items-center justify-end cursor-pointer",
            !completedImage && "hidden"
          )}
          onClick={() => setCompletedImage(null)}
        >
          <h2 className="text-xs">Görseli Sil</h2>
          <X className="w-4 h-4" />
        </div>
      </div>
      <UploadDropzone
        content={{
          button({ ready, files }) {
            if (files.length > 0)
              return (
                <div className="flex flex-row gap-1 items-center">
                  <Upload className="h-4 w-4" />
                  <span className="text-xs overflow-hidden">
                    {files[0].name}
                  </span>
                </div>
              );
            return "Görsel Yükle";
          },
          allowedContent({ ready, fileTypes }) {
            if (!ready) return "Checking what you allow";
            return (
              <>
                <h2>Bir dosya seçebilirsiniz: {fileTypes.join(", ")}</h2>
              </>
            );
          },
          label({ ready, isUploading, uploadProgress }) {
            if (!ready) return "Checking what you label";
            if (isUploading)
              return `Görsel sisteme yükleniyor.. (${uploadProgress}%)`;
            return "Hemen bir dosya yükle";
          },
          uploadIcon({ ready }) {
            if (!ready) return "Checking what you upload";
            return (
              <>
                {completedImage ? (
                  <Image
                    src={`${completedImage}`}
                    alt="Select Files"
                    width={1080}
                    height={720}
                    className="w-56 h-24 rounded-lg"
                  />
                ) : (
                  <ImageDown className="h-8 w-8" />
                )}
              </>
            );
          },
        }}
        appearance={{
          container: `flex cursor-pointer flex-col items-center justify-center py-1 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted`,
        }}
        endpoint="imageUploader"
        onChange={(res: any) => {
          console.log("Select Files: ", res);
          toast.success("Görsel Seçildi");
          // Arka planı ayarlamak için gerekli kod
        }}
        onClientUploadComplete={(res: any) => {
          // Do something with the response
          console.log("Complate Files: ", res);
          toast.success("Görsel Yüklendi");
          imageValue = res[0].url;
          onChange(res[0].url);
          setCompletedImage(res[0].url); // İlk dosyanın URL'sini al
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
};

export default ImageUploadThing;

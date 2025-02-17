import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowRightIcon, CircleAlert, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageUploadThing from "@/components/image-upload-thing";

interface ImageModalProps {
  form: any;
}

const ImageModal = ({ form }: ImageModalProps) => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="ml-auto" variant="ghost">
            <ArrowRightIcon className="h-4 w-4" />
            Görsel Yükle
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploadThing
                    imageValue={field.value}
                    onChange={(url: any) => field.onChange(url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="w-1/3">İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => {}} className="w-2/3">
              Kaydet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageModal;

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
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CircleAlert, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { deleteCourseServices } from "@/services/courseServices";

interface UserDeleteModalProps {
  table?: any;
  course?: any;
  onClose?: () => void;
}

const CourseDeleteModal = ({
  table,
  course,
  onClose,
}: UserDeleteModalProps) => {
  console.log("Course Delete Modal", course);
  const handleDeleteRows = async () => {
    if (table) {
      const deleteCourseId = table
        .getSelectedRowModel()
        .rows.map((row: any) => row.original.id);

      const response = await deleteCourseServices(deleteCourseId);
      if (response) {
        toast.success("Kullanıcılar başarıyla silindi");
        table.resetRowSelection();
        window.location.reload();
      } else {
        toast.error("Kullanıcı silme işlemi başarısız oldu");
      }
    } else if (course) {
      const deleteCourseId = [course.id];
      const response = await deleteCourseServices(deleteCourseId);
      if (response) {
        toast.success("Kullanıcılar başarıyla silindi");
        window.location.reload();
      } else {
        toast.error("Kullanıcı silme işlemi başarısız oldu");
      }
    } else {
      return null;
    }
  };

  if (table) {
    return (
      <>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="ml-auto" variant="outline">
              <Trash
                className="-ms-1 me-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Delete
              <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded-sm border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-white bg-purple-700">
                {table.getSelectedRowModel().rows.length}
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true"
              >
                <CircleAlert
                  className="opacity-80 text-red-700"
                  size={36}
                  // color="yellow"
                  strokeWidth={2}
                />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl">Dikkat</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Aşağıdaki kurs(lar) kalıcı olarak
                  silinecektir:
                </AlertDialogDescription>
                <div className="flex flex-row gap-x-1 items-center">
                  <ArrowRightIcon className="h-4 w-4 inline-block mr-1" />
                  sadasd
                </div>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="w-2/3">İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRows} className="w-1/3">
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  } else if (course) {
    return (
      <>
        <AlertDialog open={!!course} onOpenChange={onClose}>
          <AlertDialogContent>
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true"
              >
                <CircleAlert
                  className="opacity-80 text-red-700"
                  size={36}
                  // color="yellow"
                  strokeWidth={2}
                />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl">Dikkat</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Aşağıdaki kurs(lar) kalıcı olarak
                  silinecektir:
                </AlertDialogDescription>
                <div className="flex flex-row gap-x-1 items-center">
                  <ArrowRightIcon className="h-4 w-4 inline-block mr-1" />
                  {course.title}
                </div>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="w-2/3">İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRows} className="w-1/3">
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  } else null;
};

export default CourseDeleteModal;

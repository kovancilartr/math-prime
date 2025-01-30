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
import { useAuthStore } from "@/store/useAuthStore";

interface UserDeleteModalProps {
  table?: any;
  user?: any;
  onClose?: () => void;
}

const UserDeleteModal = ({ table, user, onClose }: UserDeleteModalProps) => {
  const { deleteUser } = useAuthStore();

  const handleDeleteRows = async () => {
    if (table) {
      const deleteUsersId = table
        .getSelectedRowModel()
        .rows.map((row: any) => row.original.id);

      const response = await deleteUser(deleteUsersId);
      if (response) {
        toast.success("Kullanıcılar başarıyla silindi");
        table.resetRowSelection();
        // window.location.reload();
      } else {
        toast.error("Kullanıcı silme işlemi başarısız oldu");
      }
    } else if (user) {
      const deleteUsersId = [user.id];
      const response = await deleteUser(deleteUsersId);
      if (response) {
        toast.success("Kullanıcılar başarıyla silindi");
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
                  Bu işlem geri alınamaz. Aşağıdaki kullanıcı(lar) kalıcı olarak
                  silinecektir:
                  <ul>
                    {table.getSelectedRowModel().rows.map((row: any) => (
                      <li
                        key={row.id}
                        className="text-red-700 dark:text-white cursor-default"
                      >
                        <ArrowRightIcon className="h-4 w-4 inline-block mr-1" />
                        {row.original.name} {row.original.surname}
                      </li> // Kullanıcı adını göster
                    ))}
                  </ul>
                </AlertDialogDescription>
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
  } else if (user) {
    return (
      <>
        <AlertDialog open={!!user} onOpenChange={onClose}>
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
                  Bu işlem geri alınamaz. Aşağıdaki kullanıcı(lar) kalıcı olarak
                  silinecektir:
                </AlertDialogDescription>
                <div className="flex flex-row gap-x-1 items-center">
                  <ArrowRightIcon className="h-4 w-4 inline-block mr-1" />
                  {user.name} {user.surname}
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

export default UserDeleteModal;

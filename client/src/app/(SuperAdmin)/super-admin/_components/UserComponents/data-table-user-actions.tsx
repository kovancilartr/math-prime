import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserCog } from "lucide-react";
import { Row } from "@tanstack/react-table";
import UserEditSheet from "./user-edit-sheet";
import UserDeleteModal from "./user-delete-modal";
import { Users } from "@/types/globalTypes";

interface DataTableUserActionsProps {
  row: Row<Users>;
}

const DataTableUserActions = ({ row }: DataTableUserActionsProps) => {
  const [isEditSheetOpen, setEditSheetOpen] = useState(false); // Durum ekleyin
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Durum ekleyin
  const [selectedUser, setSelectedUser] = useState<Users | null>(null); // Türü null olarak ayarlayın

  const handleEdit = () => {
    setSelectedUser(row.original); // Seçilen kullanıcıyı ayarla
    setEditSheetOpen(true); // Edit sheet'i aç
  };
  const handleDelete = () => {
    setSelectedUser(row.original); // Seçilen kullanıcıyı ayarla
    setDeleteModalOpen(true); // Delete modal'u aç
  };
  return (
    <>
      <div className="flex gap-2">
        <Button
          variant={"outline"}
          size={"sm"}
          className="shadow-none"
          onClick={handleEdit}
        >
          <UserCog size={16} strokeWidth={2} aria-hidden="true" />
          Düzenle
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className="bg-red-700 text-white dark:bg-red-800 dark:text-white shadow-none"
          onClick={handleDelete}
        >
          <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
          Sil
        </Button>
      </div>

      {isEditSheetOpen && (
        <UserEditSheet
          user={selectedUser} // Seçilen kullanıcıyı prop olarak geçin
          onClose={() => {
            setEditSheetOpen(false); // Kapatma fonksiyonu
            setSelectedUser(null); // Seçilen kullanıcıyı sıfırla
          }}
        />
      )}
      {isDeleteModalOpen && (
        <UserDeleteModal
          user={selectedUser} // Seçilen kullanıcıyı prop olarak geçin
          onClose={() => {
            setDeleteModalOpen(false); // Kapatma fonksiyonu
            setSelectedUser(null); // Seçilen kullanıcıyı sıfırla
          }}
        />
      )}
    </>
  );
};

export default DataTableUserActions;

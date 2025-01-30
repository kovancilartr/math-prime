import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layers, Trash2, UserCog } from "lucide-react";
import { Courses } from "@/types/globalTypes";
import { Row } from "@tanstack/react-table";
import CourseEditSheet from "./course-edit-sheet";
import CourseDeleteModal from "./course-delete-modal";
import Link from "next/link";

interface DataTableUserActionsProps {
  row: Row<Courses>;
}

const DataTableCourseActions = ({ row }: DataTableUserActionsProps) => {
  const [isEditSheetOpen, setEditSheetOpen] = useState(false); // Durum ekleyin
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Durum ekleyin
  const [selectedCourse, setSelectedCourse] = useState<Courses | null>(null); // Türü null olarak ayarlayın

  const handleEdit = () => {
    setSelectedCourse(row.original); // Seçilen kullanıcıyı ayarla
    setEditSheetOpen(true); // Edit sheet'i aç
  };
  const handleDelete = () => {
    setSelectedCourse(row.original); // Seçilen kullanıcıyı ayarla
    setDeleteModalOpen(true); // Delete modal'u aç
  };
  return (
    <>
      <div className="flex gap-2">
        <Link href={`/super-admin/courses/${row.original.id}`}>
          <Button variant={"outline"} size={"default"} className="shadow-none">
            <Layers size={16} strokeWidth={2} aria-hidden="true" />
            Detay
          </Button>
        </Link>
        <Button
          variant={"outline"}
          size={"icon"}
          className="shadow-none"
          onClick={handleEdit}
        >
          <UserCog size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button
          variant={"outline"}
          size={"icon"}
          className="bg-red-700 text-white dark:bg-red-800 dark:text-white"
          onClick={handleDelete}
        >
          <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </div>

      {isEditSheetOpen && (
        <CourseEditSheet
          course={selectedCourse} // Seçilen kullanıcıyı prop olarak geçin
          onClose={() => {
            setEditSheetOpen(false); // Kapatma fonksiyonu
            setSelectedCourse(null); // Seçilen kullanıcıyı sıfırla
          }}
        />
      )}
      {isDeleteModalOpen && (
        <CourseDeleteModal
          course={selectedCourse} // Seçilen kullanıcıyı prop olarak geçin
          onClose={() => {
            setDeleteModalOpen(false); // Kapatma fonksiyonu
            setSelectedCourse(null); // Seçilen kullanıcıyı sıfırla
          }}
        />
      )}
    </>
  );
};

export default DataTableCourseActions;

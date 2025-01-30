"use client";

import DataTableCourseActions from "@/app/(SuperAdmin)/super-admin/_components/CourseComponents/data-table-course-actions";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Category, Courses } from "@/types/globalTypes";
import { ColumnDef } from "@tanstack/react-table";
import noCourseAvatar from "../../../../public/images/banner-2.jpg";

export const courseColumns: ColumnDef<Courses>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Kurs Adı",
    size: 80,
  },
  {
    accessorKey: "description",
    header: "Kurs Açıklaması",
  },
  {
    header: "Kategori",
    cell: ({ row }) => (
      <div>
        {row.original.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1 items-center justify-center">
            {row.original.categories.map((category: Category) => (
              <Badge key={category.id} variant="default" className="bg-cyan-800 text-slate-50">
                {category.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 items-center justify-center">
            <Badge variant="default" className="bg-red-800 text-slate-50">
              Kategori Yok
            </Badge>
          </div>
        )}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "thumbnail",
    header: "Kurs Görseli",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Image
          src={row.getValue("thumbnail") || noCourseAvatar}
          width={1080}
          height={720}
          alt="Kurs Görseli"
          className="h-12 w-32 rounded-sm"
        />
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "price",
    header: "Ücret",
    cell: ({ row }) => (
      <div className="flex items-center justify-center ">
        <span className="text-lg font-semibold">
          {row.getValue("price")} <span className="text-xs">TL</span>
        </span>
      </div>
    ),
    size: 60,
  },
  {
    accessorKey: "instructor.name",
    header: "Öğretmen Adı",
    size: 80,
  },
  {
    accessorKey: "isPublished",
    header: "Durumu",
    cell: ({ row }) => {
      return row.getValue("isPublished") ? (
        <Badge variant="success">Yayında</Badge>
      ) : (
        <Badge variant="warning">Taslak</Badge>
      );
    },
    size: 80,
  },
  {
    header: "Oluşturma Tarihi",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("tr-TR");
    },
    size: 100,
  },
  {
    id: "actions",
    header: "Aksiyonlar",
    cell: ({ row }) => <DataTableCourseActions row={row} />,
    size: 160,
    enableHiding: false,
  },
];

import React from "react";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Users } from "@/types/globalTypes";
import { Angry, Check, Loader, Skull, User, X } from "lucide-react";
import DataTableUserActions from "@/app/(SuperAdmin)/super-admin/_components/UserComponents/data-table-user-actions";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Users> = (row, columnId, filterValue) => {
  // console.log("row", row, "columnId", columnId, "filterValue", filterValue);
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Users> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

const userColumns: ColumnDef<Users>[] = [
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
    header: "İsim",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 120,
    filterFn: multiColumnFilterFn,
    enableHiding: true,
  },
  {
    header: "Soyisim",
    accessorKey: "surname",
    cell: ({ row }) => <div>{row.getValue("surname")}</div>,
    size: 120,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Rol",
    accessorKey: "role",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "cursor-pointer gap-x-1",
          row.getValue("role") === "USER"
            ? "bg-green-700 dark:bg-green-800 text-white"
            : row.getValue("role") === "SUPER_ADMIN"
            ? "bg-red-700 text-white"
            : ""
        )}
      >
        {/* Badge İcons */}
        {row.getValue("role") === "USER" ? (
          <User width={16} height={16} />
        ) : row.getValue("role") === "SUPER_ADMIN" ? (
          <Skull width={16} height={16} />
        ) : (
          <Angry width={16} height={16} />
        )}
        {row.getValue("role") === "USER" ? "Öğrenci" : "Super Admin"}
      </Badge>
    ),
    size: 100,
  },
  {
    header: "Durum",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "cursor-pointer gap-x-1",
          row.getValue("status") === "ACTIVE"
            ? "bg-green-700 dark:bg-green-800 text-white"
            : row.getValue("status") === "INACTIVE"
            ? "bg-red-700 text-white"
            : ""
        )}
      >
        {/* Badge İcons */}
        {row.getValue("status") === "ACTIVE" ? (
          <Check width={16} height={16} />
        ) : row.getValue("status") === "PENDING" ? (
          <Loader width={16} height={16} />
        ) : (
          <X width={16} height={16} />
        )}
        {/* Badge Title */}
        {row.getValue("status") === "ACTIVE"
          ? "Aktif"
          : row.getValue("status") === "INACTIVE"
          ? "Pasif"
          : "Beklemede"}
      </Badge>
    ),
    size: 100,
    filterFn: statusFilterFn,
  },
  {
    header: "Kayıt Tarihi",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("tr-TR");
    },
    size: 100,
    filterFn: multiColumnFilterFn,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">İşlemler</span>,
    cell: ({ row }) => <DataTableUserActions row={row} />,
    size: 120,
    enableHiding: false,
  },
];

export default userColumns;

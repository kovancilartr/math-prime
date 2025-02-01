"use client";
import React, { useEffect } from "react";
import UserAddSheet from "../_components/UserComponents/user-add-sheet";
import { useAuthStore } from "@/store/useAuthStore";
import DataTableUser from "@/components/SuperAdminComp/UserDataTable/data-table-user";
import userColumns from "@/components/SuperAdminComp/UserDataTable/data-table-user-columns";

const SuperAdminUsersPage = () => {
  const { allUsers, allUsersState, accessToken } = useAuthStore();
  useEffect(() => {
    const fetchAllUsers = async () => {
      await allUsers();
    };
    fetchAllUsers();
  }, [allUsersState]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
      </div>
      <DataTableUser
        data={allUsersState}
        columns={userColumns}
        AddComponent={UserAddSheet}
      />
    </div>
  );
};

export default SuperAdminUsersPage;
